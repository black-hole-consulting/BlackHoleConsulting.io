---
title: "Migration Cloud AWS"
description: "Migration complete d'une infrastructure on-premise vers AWS. Containerisation des applications legacy, mise en place CI/CD, Infrastructure as Code avec Terraform et optimisation des couts cloud."
image: "/images/projects/cloud-migration.svg"
tags: ["AWS", "Terraform", "Docker", "DevOps", "CI/CD"]
featured: false
order: 3
---

## Contexte

Une entreprise industrielle operait son SI sur une infrastructure vieillissante on-premise. Les couts de maintenance augmentaient, et l'equipe IT passait plus de temps a "garder les lumieres allumees" qu'a innover.

## Solution technique

### Phase 1 : Audit et planification

- Cartographie complete de l'infrastructure existante
- Analyse des dependances inter-applications
- Evaluation des couts TCO cloud vs on-premise
- Definition de la strategie de migration (6R)

### Phase 2 : Containerisation

- Dockerisation des applications Java et .NET
- Refactoring leger pour cloud-readiness
- Mise en place de registres d'images (ECR)
- Tests de non-regression automatises

### Phase 3 : Infrastructure AWS

- VPC multi-AZ avec subnets publics/prives
- EKS pour l'orchestration des containers
- RDS Aurora pour les bases de donnees
- S3 + Glacier pour le stockage et l'archivage

### Phase 4 : DevOps et CI/CD

- Pipelines GitLab CI/CD complets
- Infrastructure as Code avec Terraform
- Monitoring avec CloudWatch et Datadog
- Alerting et on-call avec PagerDuty

## Resultats

- **40%** reduction des couts infrastructure
- **99.95%** disponibilite vs 95% precedemment
- **Deploiements** : de 1/mois a 10+/semaine
- **MTTR** : reduction de 4h a 20 minutes
