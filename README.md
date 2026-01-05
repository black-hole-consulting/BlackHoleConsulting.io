# Black Hole Consulting - Website

Site vitrine corporate pour Black Hole Consulting, expert en Solution Architecture, GenAI/LLM, Cloud et Développement Web.

**URL** : [https://blackholeconsulting.io](https://blackholeconsulting.io)

## Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Astro | 5.x | Framework SSG |
| Tailwind CSS | 4.x | Styling |
| TypeScript | 5.x | Type safety |
| Vanilla JS | - | Animations |

## Structure du Projet

```
src/
├── components/          # Composants Astro
│   ├── Header.astro     # Navigation + ThemeToggle
│   ├── Hero.astro       # Section hero avec animations
│   ├── Services.astro   # Bento grid des services
│   ├── Expertise.astro  # Domaines d'expertise
│   ├── Method.astro     # Méthodologie (timeline)
│   ├── Testimonials.astro
│   ├── Contact.astro    # Formulaire Formspree
│   ├── Footer.astro
│   ├── ThemeToggle.astro      # Dark/Light mode
│   ├── CustomCursor.astro     # Curseur personnalisé
│   ├── NoiseOverlay.astro     # Texture grain
│   └── BlobBackground.astro   # Formes animées
├── layouts/
│   ├── BaseLayout.astro       # Layout principal + SEO
│   └── LegalLayout.astro      # Pages légales
├── pages/
│   ├── index.astro            # Page principale
│   ├── mentions-legales.astro
│   ├── politique-confidentialite.astro
│   └── cgv.astro
├── scripts/
│   └── tilt.js                # Effet 3D cards
└── styles/
    └── global.css             # Design system complet
```

## Commandes

```bash
npm install      # Installer les dépendances
npm run dev      # Serveur de développement (localhost:4321)
npm run build    # Build production (dist/)
npm run preview  # Preview du build
```

## Fonctionnalités UI/UX 2025

- **Glass Navigation** : Header avec backdrop-filter blur au scroll
- **Dark/Light Mode** : Toggle avec persistance localStorage
- **Custom Cursor** : Curseur avec glow effect (desktop)
- **Bento Grid** : Layout asymétrique pour les services
- **Gradient Mesh** : Background animé dans le hero
- **Text Reveal** : Animation mot par mot du titre
- **Tilt 3D Cards** : Effet perspective au survol
- **Blob Shapes** : Formes organiques animées en arrière-plan
- **Noise Overlay** : Texture grain subtile
- **Scroll Animations** : Reveal au scroll (Intersection Observer)

Toutes les animations respectent `prefers-reduced-motion`.

## SEO & GEO

- Meta tags complets (OG, Twitter Cards)
- JSON-LD structured data (ProfessionalService)
- Sitemap XML automatique
- Optimisé pour les moteurs IA (ChatGPT, Perplexity, Claude)

## Déploiement

Le déploiement est automatisé via GitHub Actions sur push vers `main`.

### Secrets requis (GitHub)

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
```

### Déploiement manuel

```bash
npm run build
aws s3 sync dist/ s3://$AWS_S3_BUCKET --delete
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
```

## Configuration

| Fichier | Configuration |
|---------|---------------|
| `src/components/Contact.astro` | ID Formspree |
| `src/components/Footer.astro` | SIRET, liens sociaux |
| `src/layouts/BaseLayout.astro` | Meta tags, JSON-LD |

## Performance

Objectifs Lighthouse :
- Performance : > 95
- Accessibility : > 95
- Best Practices : > 95
- SEO : > 95

## Licence

Propriétaire - Black Hole Consulting SASU
