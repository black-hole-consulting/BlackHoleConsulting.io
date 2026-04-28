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
