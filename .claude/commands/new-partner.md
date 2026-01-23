---
description: Add a new partner to the network page
---

# Add New Partner

Add a new partner to the `/partenaires` page.

## Information to Collect

Use AskUserQuestion to gather all required information:

### 1. Basic Info
- **Name**: Full name (e.g., "Jean Dupont")
- **Title**: Professional title (e.g., "DevOps Engineer", "Data Scientist")
- **Company**: Current company (optional)

### 2. Description
- Short description (2-3 sentences) about the collaboration and expertise
- Keep it fun and personal, like talking about a friend

### 3. Skills
- 3-5 technical skills or areas of expertise
- Examples: "Kubernetes", "Python", "AWS", "React", "Machine Learning"

### 4. Collaboration Stats
- Years of collaboration (number)
- Number of projects together (number)
- Has mutual recommendation? (yes/no)
- Special expertise badge? (optional, e.g., "Expert IA", "Expert DevOps")

### 5. Links
- LinkedIn URL (required)
- GitHub URL (optional)
- Personal website URL (optional)

### 6. Avatar Image
Ask the user to provide a path to the partner's photo. The image will be:
- Copied to `public/images/partners/<id>.webp`
- Converted to WebP format if needed
- Resized to 200x200px for optimal performance

If no image is provided, use DiceBear placeholder:
`https://api.dicebear.com/7.x/notionists-neutral/svg?seed=<name>`

### 7. Node Color
Ask for preferred color for the network graph node:
- Purple: #6366f1
- Pink: #ec4899
- Orange: #f59e0b
- Green: #10b981
- Red: #ef4444
- Violet: #8b5cf6
- Cyan: #06b6d4
- Or custom hex color

## Steps

1. Ask questions using AskUserQuestion (can batch related questions)

2. If image path provided:
   ```bash
   # Create partners directory if needed
   mkdir -p public/images/partners

   # Convert and resize image
   magick <source> -resize 200x200^ -gravity center -extent 200x200 public/images/partners/<id>.webp
   ```

3. Generate unique ID from name:
   - Lowercase
   - Replace spaces with hyphens
   - Remove accents
   - Example: "Jean Dupont" -> "jean-dupont"

4. Add partner to `src/data/partners.ts`:
   ```typescript
   {
     id: '<id>',
     name: '<name>',
     title: '<title>',
     company: '<company>', // omit if not provided
     avatar: '/images/partners/<id>.webp', // or DiceBear URL
     description: '<description>',
     skills: ['<skill1>', '<skill2>', ...],
     badges: [
       { type: 'years', label: 'ans de collaboration', value: <years> },
       { type: 'projects', label: 'projets ensemble', value: <projects> },
       // Add mutual badge if applicable
       // Add expertise badge if applicable
     ],
     links: {
       linkedin: '<linkedin-url>',
       github: '<github-url>', // if provided
       website: '<website-url>', // if provided
     },
     color: '<color>',
   },
   ```

5. Run build to verify: `npm run build`

6. Show summary of added partner

## Example Partner Entry

```typescript
{
  id: 'marie-tech',
  name: 'Marie Technicienne',
  title: 'Cloud Architect',
  company: 'CloudCorp',
  avatar: '/images/partners/marie-tech.webp',
  description: 'Architecte cloud de talent. Nos migrations sont toujours un succes grace a sa vision strategique.',
  skills: ['AWS', 'Terraform', 'Kubernetes', 'Architecture'],
  badges: [
    { type: 'years', label: 'ans de collaboration', value: 4 },
    { type: 'projects', label: 'projets ensemble', value: 8 },
    { type: 'mutual', label: 'Recommandation mutuelle' },
  ],
  links: {
    linkedin: 'https://linkedin.com/in/marie-tech',
    github: 'https://github.com/marie-tech',
  },
  color: '#06b6d4',
},
```
