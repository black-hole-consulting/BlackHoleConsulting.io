---
description: Create a new blog article
argument-hint: <topic>
---

# Add New Blog Article

Create a new blog post.

**Topic**: $ARGUMENTS

## Steps

1. Create `src/content/blog/<slug>.md` with frontmatter:
   ```yaml
   ---
   title: "Article Title"
   description: "Meta description for SEO (150-160 chars)"
   pubDate: <today's date YYYY-MM-DD>
   heroImage: "/images/blog/<slug>.webp"
   tags: ["Tag1", "Tag2"]
   draft: false
   ---
   ```

2. Write article with:
   - Engaging introduction
   - Clear headings (## and ###)
   - Code examples if relevant (with syntax highlighting)
   - Conclusion with key takeaways

3. If heroImage is needed, check `public/images/blog/` or suggest creating one.

4. Verify article appears on `/blog` page and renders correctly.

Ask for target audience, key points, and tone if not specified.
