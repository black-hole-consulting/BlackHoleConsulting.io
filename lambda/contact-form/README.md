# Lambda Contact Form - Brevo

Cette Lambda gère l'envoi des messages du formulaire de contact via l'API Brevo.

## Déploiement AWS

### 1. Créer la Lambda

```bash
# Dans AWS Console > Lambda > Create function
# - Name: bhc-contact-form
# - Runtime: Node.js 20.x
# - Architecture: arm64 (moins cher)
```

### 2. Uploader le code

Zipper et uploader `index.mjs` :
```bash
cd lambda/contact-form
zip function.zip index.mjs
# Upload via Console ou CLI
aws lambda update-function-code --function-name bhc-contact-form --zip-file fileb://function.zip
```

### 3. Configurer les variables d'environnement

Dans Lambda > Configuration > Environment variables :
```
BREVO_API_KEY = <ta-clé-api-brevo>
```

### 4. Créer l'API Gateway

```bash
# AWS Console > API Gateway > Create API
# - Type: HTTP API
# - Name: bhc-api

# Ajouter une route:
# - Method: POST
# - Path: /contact
# - Integration: Lambda bhc-contact-form

# Ajouter une route pour CORS:
# - Method: OPTIONS
# - Path: /contact
# - Integration: Lambda bhc-contact-form
```

### 5. Configurer le domaine personnalisé (optionnel)

Pour avoir `api.blackholeconsulting.io` :
1. API Gateway > Custom domain names
2. Créer `api.blackholeconsulting.io`
3. Ajouter certificat ACM (même région)
4. Mapper à l'API

Sinon, mettre à jour `API_ENDPOINT` dans `Contact.astro` avec l'URL API Gateway générée.

### 6. Configurer l'expéditeur Brevo

Dans Brevo > Settings > Senders :
1. Ajouter `noreply@blackholeconsulting.io` comme expéditeur
2. Valider le domaine `blackholeconsulting.io` (DNS)

## Test local

```bash
# Simuler l'event Lambda
node -e "
import('./index.mjs').then(m => m.handler({
  httpMethod: 'POST',
  body: JSON.stringify({
    name: 'Test',
    email: 'test@example.com',
    company: 'Test Co',
    'project-type': 'web',
    message: 'Test message'
  })
})).then(console.log);
"
```

## Structure de l'email

L'email envoyé contient :
- Nom du contact
- Email (avec reply-to configuré)
- Société
- Type de projet
- Message formaté

Le sujet est : `[Contact] {Nom} - {Type de projet}`
