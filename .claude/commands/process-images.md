---
description: Process project images with color-matched backgrounds
allowed-tools: Bash(npm run images:process:*), Bash(npm run images:watch:*)
---

# Process Project Images

Process images for the portfolio with color-matched backgrounds.

## Usage

1. **Add images** to `public/images/projects/` (supports: jpg, jpeg, png, webp, gif)

2. **Run processor**:
   - One-time: `npm run images:process`
   - Watch mode: `npm run images:watch`

3. **Output** in `public/images/projects/processed/`:
   - `<name>-thumb.webp` (400x225) - for lists
   - `<name>-card.webp` (800x450) - for cards
   - `<name>-hero.webp` (1200x675) - for hero sections
   - `<name>-card.jpg` - fallback
   - `<name>-original.webp` - preserved ratio
   - `<name>.meta.json` - colors + AI description

4. **Update project markdown** to use: `/images/projects/processed/<name>-card.webp`

Note: Set `GEMINI_API_KEY` in `.env` for AI image descriptions.
