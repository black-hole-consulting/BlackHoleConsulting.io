# Black Hole Consulting - Website

[![CI/CD Pipeline](https://github.com/black-hole-consulting/website/actions/workflows/deploy.yml/badge.svg)](https://github.com/black-hole-consulting/website/actions/workflows/deploy.yml)
[![Node](https://img.shields.io/badge/node-20-green?style=flat-square)](https://nodejs.org)
[![Astro](https://img.shields.io/badge/astro-5.x-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fblackholeconsulting.io&style=flat-square)](https://blackholeconsulting.io)

Site vitrine corporate pour Black Hole Consulting, expert en Solution Architecture, GenAI/LLM, Cloud et Développement Web.

**URL** : [https://blackholeconsulting.io](https://blackholeconsulting.io)

## Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Astro | 5.x | Framework SSG avec View Transitions |
| Tailwind CSS | 4.x | Styling avec design system |
| TypeScript | 5.x | Type safety |
| Playwright | 1.x | Tests E2E |
| AWS Lambda | Node 20 | API formulaire contact |

## Structure du Projet

```
src/
├── components/
│   ├── blog/                 # ArticleCard, ReadingTime, TableOfContents
│   ├── projects/             # ProjectCard
│   ├── Header.astro          # Navigation avec glass effect
│   ├── Hero.astro            # Section hero avec animations
│   ├── Services.astro        # Bento grid des services
│   ├── Expertise.astro       # Domaines d'expertise
│   ├── Method.astro          # Méthodologie (timeline)
│   ├── Testimonials.astro    # Témoignages clients
│   ├── Contact.astro         # Formulaire + Calendly
│   ├── Footer.astro          # Footer avec liens
│   ├── Stats.astro           # Statistiques animées
│   ├── ClientLogos.astro     # Logos clients
│   ├── SkillsGrid.astro      # Grille de compétences
│   ├── Timeline.astro        # Timeline parcours
│   ├── LeadMagnet.astro      # CTA newsletter
│   ├── FAQ.astro             # Questions fréquentes
│   ├── ThemeToggle.astro     # Dark/Light mode
│   ├── ScrollProgress.astro  # Barre de progression
│   ├── CrispChat.astro       # Widget Crisp
│   ├── CookieBanner.astro    # Bannière cookies
│   ├── CustomCursor.astro    # Curseur personnalisé
│   ├── NoiseOverlay.astro    # Texture grain
│   └── BlobBackground.astro  # Formes animées
├── content/
│   ├── blog/                 # Articles Markdown (3)
│   ├── projects/             # Projets Markdown (11)
│   └── config.ts             # Schemas Zod
├── layouts/
│   ├── BaseLayout.astro      # Layout principal + SEO + JSON-LD
│   ├── BlogLayout.astro      # Template articles avec TOC
│   └── LegalLayout.astro     # Pages légales
├── pages/
│   ├── index.astro           # Homepage
│   ├── a-propos.astro        # Page À propos
│   ├── blog/                 # Blog listing + [slug]
│   ├── projets/              # Portfolio + [slug]
│   ├── credits.astro         # Crédits images
│   ├── cgv.astro             # CGV
│   ├── mentions-legales.astro
│   ├── politique-confidentialite.astro
│   └── rss.xml.js            # Flux RSS
├── scripts/
│   └── process-images.js     # Traitement images avec IA
└── styles/
    └── global.css            # Design system complet

lambda/
├── contact-form/             # Lambda API formulaire
│   └── index.mjs             # Handler avec Brevo
└── template.yaml             # CloudFormation stack

tests/
└── e2e/                      # Tests Playwright (20 tests)
    ├── accessibility.spec.ts
    ├── contact.spec.ts
    ├── mobile.spec.ts
    └── navigation.spec.ts
```

## Commandes

```bash
# Développement
npm run dev           # Serveur dev (localhost:4321)
npm run build         # Build production
npm run preview       # Preview du build

# Qualité
npm run lint          # ESLint
npm run lint:fix      # ESLint avec auto-fix
npm run format        # Prettier
npm run format:check  # Vérifier le formatage
npm run test          # Tests E2E Playwright
npm run test:ui       # Tests avec UI Playwright
npm run lighthouse    # Audit Lighthouse CI

# Images
npm run images:process  # Traiter les images
npm run images:watch    # Mode watch
```

## Pages (22 total)

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/a-propos` | À propos avec timeline, skills, valeurs |
| `/blog` | Liste des articles avec filtres tags |
| `/blog/[slug]` | Article avec TOC et temps de lecture |
| `/projets` | Portfolio avec sections featured/autres |
| `/projets/[slug]` | Détail projet avec projets liés |
| `/credits` | Crédits images |
| `/rss.xml` | Flux RSS |
| `/cgv`, `/mentions-legales`, `/politique-confidentialite` | Pages légales |

## CI/CD Pipeline

Le déploiement est automatisé via GitHub Actions sur push vers `main` :

1. **Lint & Format** - Vérification du code
2. **Build** - Construction du site statique
3. **E2E Tests** - Tests Playwright
4. **Lighthouse** - Audit performance
5. **Deploy** - S3 + CloudFront + Lambda
6. **Notify** - Notification Slack

### Secrets requis

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
BREVO_API_KEY
SLACK_WEBHOOK_URL
```

## Configuration

| Fichier | Configuration |
|---------|---------------|
| `src/components/Contact.astro` | API endpoint Lambda |
| `src/components/CrispChat.astro` | ID Crisp |
| `src/components/Footer.astro` | SIRET, liens sociaux |
| `src/layouts/BaseLayout.astro` | Meta tags, JSON-LD |
| `lambda/template.yaml` | Stack CloudFormation |

## Performance

Objectifs Lighthouse :
- Performance : > 90
- Accessibility : > 90
- Best Practices : > 90
- SEO : > 90

## Licence

Propriétaire - Black Hole Consulting SASU
