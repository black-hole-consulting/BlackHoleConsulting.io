---
title: "Infrastructure as Code avec Terraform : Migration complète d'un site AWS"
description: "Retour d'expérience sur la migration d'une infrastructure AWS (S3, CloudFront, Lambda, API Gateway) de CloudFormation vers Terraform avec CI/CD GitHub Actions."
pubDate: 2026-01-22
heroImage: "/images/blog/infrastructure-as-code-terraform-migration-aws.webp"
tags: ["Terraform", "AWS", "DevOps", "Infrastructure as Code", "CI/CD"]
draft: false
---

Gérer son infrastructure manuellement via la console AWS, c'est acceptable pour un prototype. Mais pour un site en production, l'Infrastructure as Code (IaC) devient indispensable. Dans cet article, je partage mon retour d'expérience sur la migration de l'infrastructure de ce site vers Terraform, avec un pipeline CI/CD complet via GitHub Actions.

## Pourquoi migrer vers Terraform ?

L'infrastructure initiale du site était partiellement gérée par CloudFormation (Lambda + API Gateway) et partiellement manuelle (S3, CloudFront). Cette approche hybride posait plusieurs problèmes :

- **Pas de vision unifiée** de l'infrastructure
- **Drift non détecté** entre l'état réel et l'état souhaité
- **Reproductibilité limitée** en cas de disaster recovery
- **Documentation implicite** dans la console AWS

Terraform apporte une réponse à chacun de ces points, avec en bonus un écosystème riche et une syntaxe HCL plus lisible que le YAML CloudFormation.

## Architecture cible

Voici l'infrastructure complète gérée par Terraform :

```
┌─────────────────┐
│   Route 53      │ (DNS - géré manuellement)
└────────┬────────┘
         │
┌────────┴────────┐     ┌──────────────────┐
│   CloudFront    │     │   API Gateway    │
│   Distribution  │     │   HTTP API       │
│   + OAC + Fn    │     │   POST /contact  │
└────────┬────────┘     └────────┬─────────┘
         │                       │
┌────────┴────────┐     ┌────────┴─────────┐
│   S3 Bucket     │     │   Lambda         │
│   (Static Site) │     │   (Node.js 20)   │
└─────────────────┘     └────────┬─────────┘
                                 │
                        ┌────────┴─────────┐
                        │   Brevo API      │
                        │   (Email)        │
                        └──────────────────┘
```

## Structure du projet Terraform

J'ai opté pour une structure modulaire mais simple, adaptée à un projet de taille moyenne :

```
infra/
├── bootstrap/
│   └── main.tf          # State backend (S3 + DynamoDB)
├── backend.tf           # Configuration du backend S3
├── versions.tf          # Contraintes de versions
├── main.tf              # Provider + data sources
├── variables.tf         # Variables d'entrée
├── outputs.tf           # Outputs
├── s3.tf                # Bucket + policies
├── cloudfront.tf        # Distribution + OAC + Function
├── lambda.tf            # Function + IAM
└── api-gateway.tf       # HTTP API + routes
```

### Le problème du bootstrap

Terraform a besoin d'un backend pour stocker son state. Mais ce backend (S3 + DynamoDB) doit lui-même être créé... par Terraform. C'est le classique problème de l'œuf et de la poule.

La solution : un module `bootstrap/` séparé avec un state local, exécuté une seule fois :

```hcl
# infra/bootstrap/main.tf
resource "aws_s3_bucket" "terraform_state" {
  bucket = "mon-projet-terraform-state"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

## Import des ressources existantes

L'un des avantages majeurs de Terraform : pouvoir importer des ressources existantes sans les recréer. Pour notre S3 et CloudFront existants :

```bash
# Export des variables sensibles
export TF_VAR_s3_bucket_name="mon-bucket"
export TF_VAR_cloudfront_distribution_id="EXXXXXXXXXX"

# Import
terraform import aws_s3_bucket.website "$TF_VAR_s3_bucket_name"
terraform import aws_cloudfront_distribution.website "$TF_VAR_cloudfront_distribution_id"

# Vérification
terraform plan
```

Le `terraform plan` après import révèle les différences entre la configuration Terraform et l'état réel. C'est l'occasion d'aligner les deux ou d'ajuster la configuration.

## CloudFront avec OAC : le piège du routing

En migrant CloudFront, j'ai remplacé l'origine "website endpoint" S3 par une origine S3 directe avec Origin Access Control (OAC). Plus sécurisé, mais avec un effet de bord : les URLs comme `/blog` ne fonctionnent plus (erreur 403).

Pourquoi ? L'endpoint website S3 gère automatiquement la redirection `/blog` → `/blog/index.html`. Pas l'origine S3 directe.

La solution : une CloudFront Function pour réécrire les URLs :

```javascript
// CloudFront Function (cloudfront-js-2.0)
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // /blog/ → /blog/index.html
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  }
  // /blog → /blog/index.html
  else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }

  return request;
}
```

En Terraform :

```hcl
resource "aws_cloudfront_function" "url_rewrite" {
  name    = "url-rewrite"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/functions/url-rewrite.js")
}

resource "aws_cloudfront_distribution" "website" {
  # ...
  default_cache_behavior {
    # ...
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }
}
```

## CI/CD avec GitHub Actions

L'objectif : `terraform plan` automatique sur chaque Pull Request, `terraform apply` sur merge dans main.

```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  push:
    branches: [main]
    paths: ['infra/**']
  pull_request:
    branches: [main]
    paths: ['infra/**']

jobs:
  terraform-plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: '1.5.7'

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-3

      - run: terraform init
        working-directory: infra

      - run: terraform plan -no-color -out=tfplan
        working-directory: infra
        env:
          TF_VAR_s3_bucket_name: ${{ secrets.AWS_S3_BUCKET }}
          TF_VAR_cloudfront_distribution_id: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          TF_VAR_brevo_api_key: ${{ secrets.BREVO_API_KEY }}

  terraform-apply:
    needs: terraform-plan
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: production
    steps:
      # ... same setup ...
      - run: terraform apply -auto-approve tfplan
        working-directory: infra
```

Les variables sensibles sont passées via les secrets GitHub, jamais commitées dans le repo.

## Gestion des secrets

Trois niveaux de secrets dans ce projet :

1. **GitHub Secrets** : credentials AWS, clés API
2. **Variables Terraform sensibles** : marquées `sensitive = true`
3. **Variables d'environnement Lambda** : injectées par Terraform

```hcl
variable "brevo_api_key" {
  description = "Brevo API key"
  type        = string
  sensitive   = true  # Masqué dans les logs
}

resource "aws_lambda_function" "contact_form" {
  # ...
  environment {
    variables = {
      BREVO_API_KEY = var.brevo_api_key
    }
  }
}
```

## Protection des ressources critiques

Pour éviter les suppressions accidentelles de ressources critiques (S3, CloudFront), j'utilise le lifecycle `prevent_destroy` :

```hcl
resource "aws_s3_bucket" "website" {
  bucket = var.s3_bucket_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_cloudfront_distribution" "website" {
  # ...
  lifecycle {
    prevent_destroy = true
  }
}
```

Terraform refusera de détruire ces ressources, même avec `terraform destroy`.

## Leçons apprises

### Ce qui a bien fonctionné

- **Import progressif** : migrer ressource par ressource plutôt que tout d'un coup
- **State remote dès le début** : évite les problèmes de synchronisation
- **Variables sensibles** : jamais de secrets dans le code
- **Lifecycle prevent_destroy** : filet de sécurité indispensable

### Les pièges rencontrés

- **Noms S3 globalement uniques** : `mon-projet-terraform-state` était déjà pris
- **CloudFront + OAC** : nécessite une CloudFront Function pour le routing
- **Ressources existantes** : penser à importer Lambda, IAM roles, Log Groups
- **Temps de propagation CloudFront** : ~10 minutes pour chaque modification

## Conclusion

La migration vers Terraform représente un investissement initial, mais les bénéfices sont immédiats :

- **Reproductibilité** : l'infrastructure entière peut être recréée from scratch
- **Auditabilité** : chaque changement est versionné dans Git
- **Collaboration** : review de l'infra via Pull Requests
- **Documentation vivante** : le code Terraform EST la documentation

Pour un site statique avec une API serverless, l'infrastructure complète tient en ~300 lignes de HCL. Un investissement raisonnable pour une tranquillité d'esprit durable.

Le code source complet est disponible dans le dossier `infra/` du [repository GitHub](https://github.com/black-hole-consulting/website).
