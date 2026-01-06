# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Black Hole Consulting corporate website - a multi-page site built with Astro 5.x and Tailwind CSS 4.x. The site showcases Solution Architecture, GenAI/LLM, Cloud, and Web Development services with a blog, portfolio, and about page.

## Development Commands

```bash
npm run dev      # Start development server (localhost:4321)
npm run build    # Build for production (output: dist/)
npm run preview  # Preview production build locally
npm run format   # Format code with Prettier
```

## Architecture

### Framework Stack
- **Astro 5.x** - Static Site Generation (SSG) with View Transitions
- **Tailwind CSS 4.x** - Styling with custom design system
- **Content Collections** - Blog and Projects with Zod schemas
- **Vanilla JS** - Animations (Intersection Observer, scroll progress)

### Project Structure
```
src/
├── components/
│   ├── blog/           # ArticleCard, ReadingTime, TableOfContents
│   ├── projects/       # ProjectCard
│   ├── ScrollProgress.astro
│   ├── SkillsGrid.astro
│   ├── Timeline.astro
│   └── ... (Header, Hero, Services, etc.)
├── content/
│   ├── blog/           # Markdown articles
│   ├── projects/       # Markdown project pages
│   └── config.ts       # Zod schemas for collections
├── layouts/
│   ├── BaseLayout.astro   # SEO, JSON-LD, scripts
│   ├── BlogLayout.astro   # Article template with TOC
│   └── LegalLayout.astro  # Legal pages
├── pages/
│   ├── index.astro        # Homepage
│   ├── a-propos.astro     # About page
│   ├── blog/              # Blog listing + [slug]
│   ├── projets/           # Portfolio + [slug]
│   └── ... (legal pages)
└── styles/
    └── global.css         # Design system + prose styles
public/                    # Static assets
.github/workflows/         # CI/CD to AWS S3
```

### Content Collections (src/content/config.ts)
```typescript
blog: { title, description, pubDate, heroImage, tags, draft }
projects: { title, description, image, tags, url, github, featured, order }
```

### Design System (src/styles/global.css)
- Colors: `--color-bg-*`, `--color-text-*`, `--color-accent-*`
- Components: `.btn`, `.card`, `.tech-badge`, `.input`
- Animations: `.fade-in`, `.pulse-glow`, `.animated-grid`, `.card-shine`
- Prose styles for markdown content

### Key Features
- **View Transitions** - ClientRouter for smooth navigation
- **RSS Feed** - `/rss.xml` via @astrojs/rss
- **Crisp Chat** - Widget in BaseLayout (configure CRISP_WEBSITE_ID)
- **Self-hosted fonts** - Inter via @fontsource-variable/inter
- **Scroll progress** - Visual indicator at page top
- **Active nav state** - IntersectionObserver highlights current section

## Pages (15 total)

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/a-propos` | About with timeline, skills, values |
| `/blog` | Blog listing with tag filters |
| `/blog/[slug]` | Article with TOC, reading time |
| `/projets` | Portfolio with featured/other sections |
| `/projets/[slug]` | Project detail with related projects |
| `/rss.xml` | RSS feed |
| `/cgv`, `/mentions-legales`, `/politique-confidentialite` | Legal |

## Deployment

Automated via GitHub Actions to AWS S3 + CloudFront.

### Required Secrets
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

## Configuration Notes

- **Crisp Chat**: Update `YOUR_CRISP_WEBSITE_ID` in `BaseLayout.astro`
- **Formspree**: Update form action in `Contact.astro`
- **Content**: Customize demo articles in `src/content/blog/` and `src/content/projects/`
- **Timeline**: Update career data in `a-propos.astro`

---

## Session History

### 6 Janvier 2026
- Audit Astro best practices (39/39)
- Added View Transitions + Prefetch
- Implemented YoanDev.co inspirations (stats, gradients, animations)
- Phase 1: Quick Wins (fonts, RSS, Crisp, accessibility)
- Phases 2-4: Full site expansion (blog, projects, about, UX)
- See `report.md` for detailed changelog
