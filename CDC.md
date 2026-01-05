# Cahier des Charges — Black Hole Consulting v2

## Informations Projet

| Élément | Détail |
|---------|--------|
| **Projet** | Refonte site corporate Black Hole Consulting |
| **URL actuelle** | https://blackholeconsulting.io |
| **Client** | Cédric — Black Hole Consulting (SASU) |
| **Type** | Site vitrine one-page |
| **Hébergement** | AWS S3 + CloudFront |

---

## Objectifs

### Objectifs Business
- Présenter l'expertise polyvalente : **GenAI/LLM**, **Solution Architecture**, **Cloud**, **Développement Web**
- Générer des leads qualifiés via un formulaire de contact fonctionnel
- Positionner Black Hole Consulting comme expert technique premium sur le marché français

### Objectifs Techniques
- Site statique performant (score Lighthouse > 95)
- SEO optimisé pour le référencement naturel
- GEO optimisé (Generative Engine Optimization) pour les moteurs IA (ChatGPT, Perplexity, Claude)
- UI/UX moderne respectant les standards 2025
- Déploiement automatisé sur AWS S3

---

## Stack Technique

### Framework & Build
```
Framework:      Astro 5.x
Styling:        Tailwind CSS 4.x
Animations:     CSS natives + Intersection Observer API
Icons:          Lucide Icons (ou Phosphor Icons)
Fonts:          Variable fonts auto-hébergées (ex: Inter, Geist)
Build:          Static Site Generation (SSG)
```

### Hébergement & Déploiement
```
Hosting:        AWS S3 (bucket statique)
CDN:            AWS CloudFront
SSL:            AWS Certificate Manager
DNS:            Route 53 (ou existant)
CI/CD:          GitHub Actions
```

### Services Externes
```
Formulaire:     Formspree (ou AWS SES + Lambda)
Analytics:      Plausible Analytics (privacy-friendly) ou GA4
Calendrier:     Calendly (embed existant)
```

---

## Structure du Site

### Architecture One-Page

```
blackholeconsulting.io/
├── #hero              → Accroche principale + CTA
├── #services          → 5-6 services clés
├── #expertise         → Domaines d'expertise + Technologies
├── #methode           → Process de travail (4 étapes)
├── #temoignages       → Social proof (si applicable)
├── #contact           → Formulaire + coordonnées
└── Footer             → Navigation, légal, social
```

### Pages Additionnelles (statiques)
```
/mentions-legales
/politique-confidentialite
/cgv
```

---

## Spécifications UI/UX — Standards 2025

### Principes Directeurs

1. **Less is More** — Design épuré, whitespace généreux
2. **Motion with Purpose** — Animations subtiles et fonctionnelles
3. **Mobile-First** — Conception responsive native
4. **Accessibility-First** — WCAG 2.2 AA minimum
5. **Performance-First** — Pas de JavaScript bloquant

### Design System

#### Palette de Couleurs
```css
/* Mode sombre (principal) */
--color-bg-primary:      #0a0a0b;      /* Fond principal */
--color-bg-secondary:    #141416;      /* Cartes, sections */
--color-bg-tertiary:     #1c1c1f;      /* Hover states */

--color-text-primary:    #fafafa;      /* Titres */
--color-text-secondary:  #a1a1aa;      /* Corps de texte */
--color-text-muted:      #71717a;      /* Labels, captions */

--color-accent-primary:  #6366f1;      /* Indigo — CTA principal */
--color-accent-secondary:#8b5cf6;      /* Violet — Accent secondaire */
--color-accent-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);

--color-border:          #27272a;      /* Bordures subtiles */
--color-border-hover:    #3f3f46;      /* Bordures hover */
```

#### Typographie
```css
/* Font stack */
--font-sans: 'Inter Variable', 'Geist', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Scale (fluid typography) */
--text-xs:    clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm:    clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--text-base:  clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-lg:    clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--text-xl:    clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--text-2xl:   clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
--text-3xl:   clamp(1.875rem, 1.4rem + 2.375vw, 2.5rem);
--text-4xl:   clamp(2.25rem, 1.5rem + 3.75vw, 3.5rem);
--text-hero:  clamp(2.5rem, 1.5rem + 5vw, 4.5rem);
```

#### Espacements
```css
/* Spacing scale */
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */

/* Section spacing */
--section-padding: clamp(4rem, 8vw, 8rem);
```

#### Composants

**Boutons**
```
Primary:    Fond gradient, texte blanc, shadow glow au hover
Secondary:  Bordure accent, fond transparent, fill au hover
Ghost:      Texte seul, underline au hover
```

**Cartes**
```
Background: var(--color-bg-secondary)
Border:     1px solid var(--color-border)
Radius:     1rem (16px)
Shadow:     Subtle, augmente au hover
Hover:      Border color transition + slight lift (translateY -2px)
```

**Inputs (formulaire)**
```
Background: var(--color-bg-tertiary)
Border:     1px solid var(--color-border)
Focus:      Ring accent color (2px)
Radius:     0.5rem (8px)
```

### Animations & Micro-interactions

#### Principes
- **Durée** : 150-300ms pour les interactions, 400-600ms pour les reveals
- **Easing** : `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- **Reduce Motion** : Respecter `prefers-reduced-motion`

#### Animations Prévues
```
1. Hero text       → Fade-in + slide-up séquentiel
2. Section reveal  → Fade-in au scroll (Intersection Observer)
3. Cards           → Stagger animation à l'entrée viewport
4. Boutons         → Scale subtle + glow au hover
5. Navigation      → Backdrop blur au scroll
6. Skills tags     → Hover lift effect
7. Process steps   → Connexion animée entre étapes
```

---

### Tendances UX/UI 2025 — Éléments Avancés

Ces éléments différenciateurs positionnent le site comme moderne et premium.

#### 1. Glassmorphism Navigation
```css
/* Header avec effet verre givré au scroll */
.header-scrolled {
  background: rgba(10, 10, 11, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```
**Comportement** : Header transparent au top, devient glass effect après 50px de scroll.

#### 2. Curseur Personnalisé
```
Type: Dot cursor avec glow effect
- Curseur principal : cercle 8px, blanc/accent
- Hover sur éléments interactifs : scale up + glow ring
- Hover sur liens/boutons : changement de forme (cercle → ring)
- Trail effect subtil (optionnel)

Note: Désactivé sur mobile/touch devices
Fallback: Curseur système si prefers-reduced-motion
```

#### 3. Bento Grid Layout
```
Application : Section Services et/ou Expertise

Layout exemple (desktop) :
┌─────────────────┬──────────┐
│                 │          │
│   Service 1     │ Service 2│
│   (large)       │ (medium) │
│                 │          │
├────────┬────────┼──────────┤
│        │        │          │
│ Serv 3 │ Serv 4 │ Service 5│
│ (small)│ (small)│ (medium) │
│        │        │          │
└────────┴────────┴──────────┘

Caractéristiques :
- Tailles variées selon importance du service
- Gap uniforme (1rem)
- Responsive : devient stack sur mobile
- Hover : légère élévation + border glow
```

#### 4. Gradient Mesh Animé (Hero)
```css
/* Background hero avec gradient animé */
.hero-background {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 60% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
    var(--color-bg-primary);
  animation: gradientShift 20s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```
**Note** : Animation très lente (20s) pour effet subtil et non distrayant.

#### 5. Parallaxe Léger
```
Éléments concernés :
- Formes géométriques décoratives en arrière-plan
- Icônes flottantes (optionnel)
- Séparateurs de sections

Intensité : Faible (0.1 - 0.3 du scroll speed)
Implémentation : CSS transform avec Intersection Observer
Désactivé si prefers-reduced-motion
```

#### 6. Hover 3D sur Cards (Tilt Effect)
```javascript
/* Effet perspective au survol */
Comportement :
- Card suit légèrement le curseur (rotation max ±10deg)
- Highlight/reflet suit la position du curseur
- Légère élévation (translateZ)
- Transition smooth à l'entrée/sortie

Paramètres :
- Max rotation : 10 degrés
- Perspective : 1000px
- Transition : 150ms ease-out
- Scale on hover : 1.02

Désactivé sur touch devices
```

#### 7. Text Reveal Animé (Hero)
```
Type : Split text animation

Comportement :
- Titre principal se révèle mot par mot
- Délai entre chaque mot : 80-100ms
- Animation : fade-in + translateY (de 20px à 0)
- Sous-titre apparaît après le titre (délai 400ms)
- CTAs apparaissent en dernier (délai 600ms)

Alternative : Reveal caractère par caractère (plus dramatique)
```

#### 8. Noise Texture Overlay
```css
/* Grain subtil sur le fond */
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03; /* Très subtil */
  background-image: url('/noise.svg'); /* ou généré via CSS/canvas */
  mix-blend-mode: overlay;
}
```
**Effet** : Casse l'aspect "trop propre" du digital, ajoute de la texture organique.

#### 9. Blob / Organic Shapes
```
Éléments :
- 2-3 formes organiques en arrière-plan
- Positionnées en absolute, z-index négatif
- Couleurs : accent colors avec opacité très faible (0.05-0.1)
- Blur important (80-150px)

Animation :
- Mouvement lent et fluide (30-60s cycle)
- Morphing subtil de la forme
- Translation douce

Positionnement :
- Blob 1 : Top-right du hero
- Blob 2 : Left de la section expertise
- Blob 3 : Bottom-right du footer
```

#### 10. Dark/Light Mode Toggle
```
Implémentation :
- Toggle dans le header (icône sun/moon)
- Respecte prefers-color-scheme par défaut
- Sauvegarde préférence en localStorage
- Transition smooth entre modes (300ms)

Palette Light Mode :
--color-bg-primary:      #fafafa;
--color-bg-secondary:    #ffffff;
--color-bg-tertiary:     #f4f4f5;
--color-text-primary:    #18181b;
--color-text-secondary:  #52525b;
--color-text-muted:      #a1a1aa;
--color-accent-primary:  #4f46e5; /* Légèrement plus saturé */
--color-border:          #e4e4e7;

Note : Le dark mode reste le défaut (audience tech)
```

---

### Récapitulatif Effets Visuels

| Effet | Section | Priorité | Performance |
|-------|---------|----------|-------------|
| Glass navigation | Header | Haute | Léger |
| Cursor custom | Global | Moyenne | Léger |
| Bento grid | Services | Haute | CSS only |
| Gradient mesh | Hero | Haute | CSS only |
| Parallaxe | Background | Basse | Modéré |
| Tilt 3D cards | Cards | Moyenne | JS requis |
| Text reveal | Hero | Haute | CSS/JS léger |
| Noise overlay | Global | Basse | Très léger |
| Blob shapes | Background | Moyenne | CSS only |
| Dark/Light toggle | Header | Moyenne | Léger |

**Ordre d'implémentation suggéré** :
1. Glass nav + Gradient mesh + Text reveal (impact visuel immédiat)
2. Bento grid + Tilt cards (structure différenciante)
3. Dark/Light toggle (UX)
4. Cursor custom + Blob shapes (polish)
5. Noise + Parallaxe (finitions)

### Responsive Breakpoints
```css
--bp-sm:  640px;   /* Mobile large */
--bp-md:  768px;   /* Tablette */
--bp-lg:  1024px;  /* Desktop */
--bp-xl:  1280px;  /* Desktop large */
--bp-2xl: 1536px;  /* Ultra-wide */
```

---

## Contenu par Section

### 1. Hero Section

**Headline Principal**
```
Solutions Architecturales & IA pour votre Transformation Digitale
```

**Sous-titre**
```
Solution Architect & Expert GenAI avec 17+ ans d'expérience.
Je conçois des architectures cloud robustes et intègre l'intelligence artificielle
pour accélérer votre innovation.
```

**CTAs**
- Principal : "Discuter de votre projet" → scroll to #contact
- Secondaire : "Découvrir mes services" → scroll to #services

**Éléments visuels**
- Background : Gradient subtil ou pattern géométrique abstrait (éviter les images stock)
- Optionnel : Animation particules légère (canvas) ou formes géométriques flottantes

---

### 2. Services Section

**Titre** : "Services"
**Sous-titre** : "Des solutions complètes pour accompagner votre transformation digitale"

#### Service 1 : Architecture de Solutions
```
Icône: Blocks / Layers
Titre: Architecture de Solutions
Description: Conception d'architectures techniques évolutives,
choix technologiques stratégiques et accompagnement à la transformation digitale.
Points clés:
- Architecture microservices & API
- Design patterns & best practices
- Documentation technique
```

#### Service 2 : Intelligence Artificielle & GenAI
```
Icône: Brain / Sparkles
Titre: Intelligence Artificielle & GenAI
Description: Intégration de solutions IA génératives dans vos processus métier.
LLM, RAG, agents autonomes et automatisation intelligente.
Points clés:
- Intégration LLM (OpenAI, Claude, Mistral)
- Systèmes RAG & knowledge bases
- Agents IA & workflows automatisés
```

#### Service 3 : Cloud & DevOps
```
Icône: Cloud
Titre: Cloud & DevOps
Description: Architecture cloud-native, migration, CI/CD et optimisation
des coûts sur AWS, Azure et GCP.
Points clés:
- Multi-cloud (AWS, Azure, GCP)
- Infrastructure as Code (Terraform)
- CI/CD & GitOps
```

#### Service 4 : Développement Web
```
Icône: Code
Titre: Développement Web
Description: Applications web modernes, sites e-commerce et
solutions sur mesure avec les frameworks les plus performants.
Points clés:
- React, Next.js, Vue.js
- PHP/Symfony, Node.js
- E-commerce (SAP Commerce, Shopify)
```

#### Service 5 : Conseil & Accompagnement
```
Icône: Compass / Target
Titre: Conseil & Accompagnement
Description: Audit technique, cadrage de projets, coordination d'équipes
et accompagnement stratégique pour vos initiatives digitales.
Points clés:
- Audit & recommandations
- Gestion de projet Agile
- Formation & montée en compétences
```

---

### 3. Expertise Section

**Titre** : "Expertise"
**Sous-titre** : "17+ années d'expérience au service de vos projets"

#### Domaines d'Expertise (cards ou liste)
```
1. Solution Architecture
   Conception d'architectures distribuées, event-driven et cloud-native.

2. Generative AI & LLM
   Intégration d'IA générative, prompt engineering, fine-tuning et déploiement.

3. Cloud Engineering
   Infrastructure multi-cloud, serverless, containers et orchestration.

4. Full-Stack Development
   Applications web performantes du frontend au backend.
```

#### Technologies (badges/tags groupés)

**IA & Machine Learning**
```
OpenAI API, Claude API, LangChain, LlamaIndex,
Hugging Face, RAG, Vector DBs, Prompt Engineering
```

**Cloud Platforms**
```
AWS (Certified), Azure, GCP, Terraform,
Kubernetes, Docker, Serverless
```

**Backend**
```
Node.js, TypeScript, Python, PHP, Symfony,
NestJS, FastAPI, GraphQL, REST
```

**Frontend**
```
React, Next.js, Vue.js, Astro,
Tailwind CSS, TypeScript
```

**Data**
```
PostgreSQL, MongoDB, Redis,
Elasticsearch, Pinecone, Weaviate
```

**DevOps & Tools**
```
GitHub Actions, GitLab CI,
Jenkins, ArgoCD, Datadog
```

---

### 4. Méthode Section

**Titre** : "Méthode"
**Sous-titre** : "Une approche structurée pour garantir le succès de votre projet"

```
Étape 1 — Découverte
Analyse de vos besoins, objectifs business et contraintes techniques.
Définition du périmètre et des indicateurs de succès.

Étape 2 — Conception
Architecture technique, choix des solutions, prototypage si nécessaire.
Planning détaillé et validation des livrables.

Étape 3 — Réalisation
Développement itératif, intégration continue, tests automatisés.
Points réguliers et ajustements en temps réel.

Étape 4 — Livraison
Déploiement en production, documentation, formation.
Support post-lancement et suivi des performances.
```

**Affichage** : Timeline verticale avec connecteurs animés, numéros stylisés

---

### 5. Témoignages Section

**Titre** : "Ce que disent mes clients"
**Sous-titre** : "Des collaborations réussies qui parlent d'elles-mêmes"

#### Témoignage 1
```
"L'expertise technique de Cédric nous a permis de moderniser notre application legacy
en un temps record. La nouvelle architecture cloud nous a fait économiser 40%
sur nos coûts d'hébergement."

— Mathieu Dupont, CTO @ FinTech Solutions
```

#### Témoignage 2
```
"Black Hole Consulting a complètement transformé notre processus de déploiement.
Notre équipe peut maintenant livrer de nouvelles fonctionnalités chaque semaine
au lieu de chaque trimestre."

— Sophie Laurent, Directrice Produit @ E-commerce Plus
```

#### Témoignage 3
```
"Cédric a su comprendre nos enjeux métier et nous proposer une solution technique
parfaitement adaptée. Son expertise en gestion de projet a été déterminante
dans le succès de notre plateforme."

— Alexandre Martin, CEO @ InnovStart
```

**Affichage** : Carrousel ou grille de cards avec avatar/initiales, citation stylisée, nom et titre

---

### 6. Contact Section

**Titre** : "Parlons de votre projet"
**Sous-titre** : "Prêt à concrétiser votre vision ? Discutons-en."

#### Formulaire de Contact
```
Champs:
- Nom complet (required)
- Email (required)
- Société (optional)
- Type de projet (select):
  - Architecture & Conseil
  - IA & GenAI
  - Cloud & DevOps
  - Développement Web
  - Autre
- Message (textarea, required)
- Bouton: "Envoyer le message"

Intégration: Formspree ou AWS SES + Lambda
Feedback: Message de confirmation inline après envoi
```

#### Informations de Contact
```
Email:     cedric@blkhole.fr
Téléphone: +33 6 02 18 04 13
Calendly:  Lien pour rendez-vous vidéo
LinkedIn:  [lien]
GitHub:    [lien si public]
```

#### Localisation
```
Basé à Tours, France
Interventions : France entière & Remote
```

---

### 7. Footer

```
Logo + Tagline: "Expert Solution Architecture, IA & Cloud"

Navigation:
- Services
- Expertise
- Méthode
- Contact

Légal:
- Mentions légales
- Politique de confidentialité
- CGV

Social:
- LinkedIn
- GitHub (si applicable)
- Twitter/X (si applicable)

Copyright: © 2025 Black Hole Consulting. Tous droits réservés.
SIRET: [numéro]
```

---

## Optimisation SEO

### Meta Tags

```html
<!-- Primary Meta Tags -->
<title>Black Hole Consulting | Solution Architect & Expert IA - Tours, France</title>
<meta name="title" content="Black Hole Consulting | Solution Architect & Expert IA">
<meta name="description" content="Solution Architect & Expert GenAI avec 17+ ans d'expérience. Architecture cloud, intégration IA/LLM et développement web sur mesure. Basé à Tours, interventions France entière.">
<meta name="keywords" content="solution architect, architecte solutions, consultant IA, GenAI, LLM, cloud architect, AWS, développement web, Tours, France">
<meta name="author" content="Cédric - Black Hole Consulting">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://blackholeconsulting.io/">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://blackholeconsulting.io/">
<meta property="og:title" content="Black Hole Consulting | Solution Architect & Expert IA">
<meta property="og:description" content="Solution Architect & Expert GenAI avec 17+ ans d'expérience. Architecture cloud, intégration IA/LLM et développement web sur mesure.">
<meta property="og:image" content="https://blackholeconsulting.io/og-image.png">
<meta property="og:locale" content="fr_FR">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://blackholeconsulting.io/">
<meta property="twitter:title" content="Black Hole Consulting | Solution Architect & Expert IA">
<meta property="twitter:description" content="Solution Architect & Expert GenAI avec 17+ ans d'expérience. Architecture cloud, intégration IA/LLM et développement web sur mesure.">
<meta property="twitter:image" content="https://blackholeconsulting.io/og-image.png">

<!-- Geo Tags -->
<meta name="geo.region" content="FR-CVL">
<meta name="geo.placename" content="Tours">
<meta name="geo.position" content="47.394144;0.68484">
<meta name="ICBM" content="47.394144, 0.68484">
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Black Hole Consulting",
  "description": "Solution Architect & Expert GenAI avec 17+ ans d'expérience. Architecture cloud, intégration IA/LLM et développement web sur mesure.",
  "url": "https://blackholeconsulting.io",
  "logo": "https://blackholeconsulting.io/logo.png",
  "image": "https://blackholeconsulting.io/og-image.png",
  "telephone": "+33602180413",
  "email": "cedric@blkhole.fr",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Tours",
    "addressRegion": "Centre-Val de Loire",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.394144,
    "longitude": 0.68484
  },
  "areaServed": {
    "@type": "Country",
    "name": "France"
  },
  "founder": {
    "@type": "Person",
    "name": "Cédric",
    "jobTitle": "Solution Architect & AI Expert"
  },
  "knowsAbout": [
    "Solution Architecture",
    "Artificial Intelligence",
    "Generative AI",
    "Large Language Models",
    "Cloud Computing",
    "AWS",
    "Web Development",
    "DevOps"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Architecture de Solutions",
          "description": "Conception d'architectures techniques évolutives"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Intelligence Artificielle & GenAI",
          "description": "Intégration de solutions IA génératives"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Cloud & DevOps",
          "description": "Architecture cloud-native et CI/CD"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Développement Web",
          "description": "Applications web modernes sur mesure"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.linkedin.com/in/[votre-profil]",
    "https://github.com/[votre-profil]"
  ]
}
```

### Technical SEO

```yaml
Performance:
  - Score Lighthouse > 95 (Performance, Accessibility, Best Practices, SEO)
  - Core Web Vitals optimisés (LCP < 2.5s, FID < 100ms, CLS < 0.1)
  - Images optimisées (WebP/AVIF, lazy loading, srcset)
  - Fonts optimisées (preload, font-display: swap)
  - CSS critique inline

Crawlability:
  - sitemap.xml généré automatiquement
  - robots.txt configuré
  - URLs propres et descriptives
  - Pas de contenu dupliqué

Accessibilité:
  - Structure heading logique (h1 > h2 > h3)
  - Alt text sur toutes les images
  - Contraste WCAG AA
  - Navigation au clavier
  - Labels sur tous les champs de formulaire
```

---

## Optimisation GEO (Generative Engine Optimization)

### Objectif
Optimiser le contenu pour être correctement référencé et cité par les moteurs de recherche IA (ChatGPT, Perplexity, Claude, Google AI Overview).

### Stratégies

#### 1. Contenu Structuré & Factuel
```
- Informations factuelles claires (17 ans d'expérience, basé à Tours)
- Listes de compétences explicites et à jour
- Services décrits de manière concise et non-ambiguë
- Éviter le jargon marketing vague
```

#### 2. Entité Claire & Cohérente
```
- Nom consistant : "Black Hole Consulting" partout
- Personne associée : "Cédric" avec titre "Solution Architect & Expert GenAI"
- Localisation : Tours, France
- Contact : informations complètes et vérifiables
```

#### 3. Schema.org Enrichi
```
- LocalBusiness / ProfessionalService complet
- Person schema pour le fondateur
- Service schema pour chaque offre
- FAQPage si section FAQ ajoutée
```

#### 4. Contenu "IA-friendly"
```
Questions-réponses implicites dans le contenu :
- "Qui est Black Hole Consulting ?" → Section hero/about
- "Quels services propose Black Hole Consulting ?" → Section services
- "Quelles technologies maîtrise Black Hole Consulting ?" → Section expertise
- "Où est basé Black Hole Consulting ?" → Footer + contact
- "Comment contacter Black Hole Consulting ?" → Section contact
```

#### 5. Signaux de Crédibilité
```
- Années d'expérience mentionnées
- Technologies spécifiques listées
- Localisation précise
- Moyens de contact multiples
- Liens vers profils professionnels (LinkedIn)
```

---

## Structure des Fichiers (Astro)

```
blackholeconsulting/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-image.png                 # Image Open Graph (1200x630)
│   ├── robots.txt
│   ├── noise.svg                    # Texture grain pour overlay
│   └── fonts/
│       ├── inter-variable.woff2
│       └── jetbrains-mono.woff2
│
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── ServiceCard.astro
│   │   ├── BentoGrid.astro          # Layout Bento pour services
│   │   ├── Expertise.astro
│   │   ├── TechBadge.astro
│   │   ├── Method.astro
│   │   ├── MethodStep.astro
│   │   ├── Testimonials.astro
│   │   ├── TestimonialCard.astro
│   │   ├── Contact.astro
│   │   ├── ContactForm.astro
│   │   ├── Button.astro
│   │   ├── SectionTitle.astro
│   │   ├── ThemeToggle.astro        # Toggle dark/light mode
│   │   ├── CustomCursor.astro       # Curseur personnalisé
│   │   ├── NoiseOverlay.astro       # Texture grain
│   │   ├── BlobBackground.astro     # Formes organiques animées
│   │   ├── GradientMesh.astro       # Gradient animé hero
│   │   └── Icons/
│   │       └── [icônes SVG]
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro         # Layout principal avec head, meta, etc.
│   │
│   ├── pages/
│   │   ├── index.astro              # Page principale (one-page)
│   │   ├── mentions-legales.astro
│   │   ├── politique-confidentialite.astro
│   │   └── cgv.astro
│   │
│   ├── styles/
│   │   ├── global.css               # Variables CSS + styles globaux
│   │   └── themes.css               # Variables dark/light mode
│   │
│   ├── scripts/
│   │   ├── cursor.js                # Logique curseur custom
│   │   ├── tilt.js                  # Effet 3D cards
│   │   ├── scroll-animations.js     # Intersection Observer animations
│   │   └── theme-toggle.js          # Gestion dark/light mode
│   │
│   └── data/
│       ├── services.json            # Données services
│       ├── technologies.json        # Données technologies
│       └── site.json                # Metadata site
│
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## Déploiement

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to S3

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete --cache-control "max-age=31536000"
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'eu-west-3'
          SOURCE_DIR: 'dist'

      - name: Invalidate CloudFront
        uses: chetan/invalidate-cloudfront-action@v2
        env:
          DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          PATHS: '/*'
          AWS_REGION: 'eu-west-3'
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Configuration S3

```json
{
  "Bucket Policy": "Public read pour objets statiques",
  "Static Website Hosting": "Enabled",
  "Index Document": "index.html",
  "Error Document": "404.html"
}
```

### Configuration CloudFront

```yaml
Origins:
  - S3 bucket (Website endpoint)

Behaviors:
  - HTTPS only
  - Redirect HTTP to HTTPS
  - Compress objects automatically
  - Cache policy: CachingOptimized

Custom Error Pages:
  - 404 → /404.html

SSL Certificate:
  - ACM certificate pour blackholeconsulting.io
```

---

## Checklist de Validation

### Avant Mise en Production

**Performance & Core**
- [ ] Lighthouse score > 95 (toutes catégories)
- [ ] Core Web Vitals dans le vert
- [ ] Mobile responsive testé (iOS Safari, Android Chrome)
- [ ] Formulaire de contact fonctionnel (test d'envoi)
- [ ] Tous les liens fonctionnels
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Favicon et touch icons présents
- [ ] Open Graph image testée (cards.twitter.com/validator)
- [ ] Schema.org validé (schema.org/docs/validator)
- [ ] sitemap.xml accessible
- [ ] robots.txt configuré
- [ ] HTTPS forcé
- [ ] 404 page custom
- [ ] Analytics configuré

**Effets Visuels & UX**
- [ ] Glass navigation fonctionne au scroll
- [ ] Gradient mesh animé (hero) - smooth, non distrayant
- [ ] Text reveal animation (hero)
- [ ] Bento grid responsive (mobile stack)
- [ ] Tilt 3D cards fonctionne (desktop only)
- [ ] Custom cursor fonctionne (desktop only)
- [ ] Scroll reveal animations
- [ ] Blob shapes visibles mais subtiles
- [ ] Noise overlay subtil (opacity ~3%)
- [ ] Dark/Light mode toggle fonctionne
- [ ] Préférence theme sauvegardée (localStorage)
- [ ] prefers-reduced-motion respecté (animations désactivées)
- [ ] prefers-color-scheme respecté (theme par défaut)

**Légal & Compliance**
- [ ] Mentions légales complètes (SIRET, etc.)
- [ ] RGPD compliance (pas de cookies tracking sans consentement)
- [ ] Politique de confidentialité
- [ ] CGV

### Post-Production

- [ ] Google Search Console configuré
- [ ] sitemap soumis
- [ ] Indexation vérifiée
- [ ] Backlinks profils sociaux
- [ ] Test Perplexity/ChatGPT pour vérifier indexation GEO
- [ ] Test sur différents navigateurs (Chrome, Firefox, Safari, Edge)
- [ ] Test performances 3G throttled

---

## Ressources & Références

### Design Inspiration
- https://dribbble.com/tags/portfolio
- https://www.awwwards.com/websites/portfolio/
- https://minimal.gallery/

### Documentation Technique
- Astro: https://docs.astro.build/
- Tailwind CSS: https://tailwindcss.com/docs
- Formspree: https://formspree.io/docs

### Outils de Test
- Lighthouse: Chrome DevTools
- PageSpeed Insights: https://pagespeed.web.dev/
- Schema Validator: https://validator.schema.org/
- OG Debugger: https://developers.facebook.com/tools/debug/

---

## Notes pour Claude Code

### Priorités d'Implémentation

**Phase 1 — Fondations**
1. Setup projet — Init Astro + Tailwind + structure fichiers
2. Layout & composants de base — Header, Footer, BaseLayout
3. Variables CSS — Dark/Light mode, design tokens

**Phase 2 — Sections Core**
4. Hero — Gradient mesh + text reveal animé
5. Services — Bento grid layout
6. Expertise — Tech badges + domaines
7. Méthode — Timeline animée
8. Témoignages — Cards avec quotes
9. Contact — Formulaire Formspree

**Phase 3 — Polish & Effets**
10. Glass navigation — Backdrop blur au scroll
11. Scroll animations — Intersection Observer reveals
12. Tilt 3D cards — Effet hover perspective
13. Custom cursor — Dot + glow effect
14. Blob shapes — Formes organiques background
15. Noise overlay — Texture grain subtile

**Phase 4 — Finitions**
16. Dark/Light toggle — Theme switcher
17. SEO & Meta — Tous les meta tags + JSON-LD
18. Pages légales — Mentions légales, confidentialité, CGV
19. Optimisation — Images, fonts, performances
20. Déploiement — GitHub Actions + S3

### Contraintes à Respecter

- **Zero JavaScript framework lourd** — Pas de React/Vue côté client sauf si absolument nécessaire
- **Vanilla JS minimal** — Intersection Observer pour animations, rien de plus
- **Pas de dépendances inutiles** — Garder le bundle minimal
- **Accessibilité non négociable** — WCAG 2.2 AA minimum
- **Mobile-first** — Toujours commencer par mobile

### Points d'Attention

- Le SIRET et infos légales exactes seront fournis
- Les liens LinkedIn/GitHub seront fournis
- L'image OG devra être créée (1200x630px)

---

*Document généré le 4 janvier 2025*
*Version 1.0*
