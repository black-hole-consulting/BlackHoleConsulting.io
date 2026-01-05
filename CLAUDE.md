# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Black Hole Consulting corporate website - a static one-page site built with Astro 5.x and Tailwind CSS 4.x. The site showcases Solution Architecture, GenAI/LLM, Cloud, and Web Development services.

## Development Commands

```bash
npm run dev      # Start development server (localhost:4321)
npm run build    # Build for production (output: dist/)
npm run preview  # Preview production build locally
```

## Architecture

### Framework Stack
- **Astro 5.x** - Static Site Generation (SSG)
- **Tailwind CSS 4.x** - Styling with custom design system
- **Vanilla JS** - Minimal JS for animations (Intersection Observer)

### Project Structure
```
src/
├── components/     # Astro components (Header, Hero, Services, etc.)
├── layouts/        # BaseLayout (SEO/meta), LegalLayout (legal pages)
├── pages/          # index.astro (one-page), legal pages
└── styles/         # global.css with design system variables
public/             # Static assets (favicon, robots.txt, fonts)
.github/workflows/  # GitHub Actions for S3 deployment
```

### Design System (src/styles/global.css)
CSS custom properties define the dark theme:
- Colors: `--color-bg-*`, `--color-text-*`, `--color-accent-*`, `--color-border-*`
- Typography: Fluid `clamp()` sizes, Inter font family
- Components: `.btn`, `.card`, `.tech-badge`, `.input` classes
- Animations: `.fade-in` with Intersection Observer, stagger delays

### Key Components
- **BaseLayout.astro**: SEO meta tags, JSON-LD structured data, Intersection Observer script
- **Header.astro**: Fixed navbar with scroll effects and mobile menu
- **Contact.astro**: Formspree integration (update `YOUR_FORM_ID` placeholder)

## Deployment

Automated via GitHub Actions to AWS S3 + CloudFront.

### Required Secrets
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

### Manual Deploy
```bash
npm run build
aws s3 sync dist/ s3://YOUR_BUCKET --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Configuration Notes

- **Formspree**: Update form action in `src/components/Contact.astro`
- **Analytics**: Add Plausible or GA4 script in BaseLayout if needed
- **Calendly**: Update booking link in Contact component
- **SIRET/Legal**: Update placeholder values in Footer and legal pages
- **LinkedIn/GitHub**: Update profile URLs in Contact and Footer
