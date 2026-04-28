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
- **reCAPTCHA v3** - Spam protection on contact form
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
- `BREVO_API_KEY`
- `PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA v3 site key (public)
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA v3 secret key (for Lambda)

## Infrastructure (Terraform)

Infrastructure as Code in `infra/` directory. See `infra/README.md` for details.

### Quick Commands
```bash
cd infra
terraform init      # Initialize
terraform plan      # Preview changes
terraform apply     # Apply changes
terraform output    # View outputs
```

### Resources Managed
- **S3 Bucket** - Static website hosting
- **CloudFront** - CDN distribution with OAC
- **Lambda** - Contact form handler (Node.js 20, ARM64)
- **API Gateway** - HTTP API for `/contact` endpoint
- **IAM** - Lambda execution role
- **CloudWatch** - Logs with 14-day retention

### State Management
- **State file**: `s3://blackholeconsulting-terraform-state/website/terraform.tfstate`
- **Locking**: DynamoDB table `bhc-terraform-locks`

### CI/CD Workflows
- `terraform.yml` - Plan on PR, Apply on main push
- `deploy.yml` - Site deployment (uses Terraform-managed infra)

## Configuration Notes

<<<<<<< HEAD
- **Formspree**: Update form action in `src/components/Contact.astro`
- **Analytics**: Add Plausible or GA4 script in BaseLayout if needed
- **Calendly**: Update booking link in Contact component
- **SIRET/Legal**: Update placeholder values in Footer and legal pages
- **LinkedIn/GitHub**: Update profile URLs in Contact and Footer

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
=======
- **reCAPTCHA**: Site key is set via `PUBLIC_RECAPTCHA_SITE_KEY` env var at build time
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
>>>>>>> c18c720316698cc3edcc639891ffe7a1e4c4d6a4
