# Add New Project

Create a new project page for the portfolio.

**Project name**: $ARGUMENTS

## Steps

1. Create `src/content/projects/<slug>.md` with frontmatter:
   ```yaml
   ---
   title: "Project Title"
   description: "Brief description (1-2 sentences)"
   image: "/images/projects/processed/<slug>-card.webp"
   tags: ["Tag1", "Tag2", "Tag3"]
   featured: false
   order: <next number>
   ---
   ```

2. Write content sections:
   - ## Contexte (project background)
   - ## Mon role (responsibilities)
   - ## Solution technique (technical details)
   - ## Resultats (outcomes/metrics)

3. Check if image exists in `public/images/projects/`. If so, run `npm run images:process` to generate processed versions.

4. Verify the project appears on `/projets` page.

Ask for any missing information (description, tags, role, etc.).
