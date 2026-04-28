#!/usr/bin/env node
/* global process, Buffer, global */

/**
 * Blog Hero Image Generator for Black Hole Consulting
 *
 * Generates hero images for blog posts using Google Imagen 3 API.
 * Reads article metadata (title, description, tags) and creates
 * visually appealing, tech-themed hero images.
 *
 * Usage:
 *   node scripts/generate-blog-hero.js <article-slug>
 *   node scripts/generate-blog-hero.js --all
 *   node scripts/generate-blog-hero.js --missing
 *
 * Examples:
 *   node scripts/generate-blog-hero.js guide-complet-ia-generative-entreprise-2025
 *   node scripts/generate-blog-hero.js --missing  # Only generate for articles without images
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT_DIR, 'src/content/blog');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public/images/blog');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    // Handle commented lines
    if (line.trim().startsWith('#')) continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        value = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/['"]/g, ''));
      }
    }
    // Remove quotes from strings
    else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Parse booleans
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;

    frontmatter[key] = value;
  }

  return frontmatter;
}

/**
 * Generate image prompt from article metadata
 */
function generateImagePrompt(metadata) {
  const { tags = [] } = metadata;

  // Build context from tags
  const tagContext = tags
    .map((tag) => {
      const tagMappings = {
        ia: 'artificial intelligence, neural networks',
        genai: 'generative AI, large language models',
        llm: 'language model, AI text generation',
        rag: 'retrieval augmented generation, knowledge base',
        architecture: 'software architecture, system design',
        cloud: 'cloud computing, servers, data centers',
        aws: 'Amazon Web Services, cloud infrastructure',
        devops: 'CI/CD pipelines, automation',
        terraform: 'infrastructure as code, deployment',
        microservices: 'distributed systems, API architecture',
        react: 'frontend development, user interfaces',
        guide: 'educational, tutorial',
      };
      return tagMappings[tag.toLowerCase()] || tag;
    })
    .join(', ');

  return `Create a professional, modern tech blog hero image.
Style: Dark, futuristic, minimalist with subtle gradients (deep purple to dark blue).
Theme: ${tagContext}
Mood: Professional, innovative, cutting-edge technology.
Elements to include: Abstract geometric shapes, subtle grid patterns, glowing accents in purple/cyan.
Do NOT include any text, logos, or human faces.
The image should be suitable for a professional consulting website header.
Aspect ratio: 16:9, landscape orientation.
Resolution: High quality, sharp details.`;
}

/**
 * Sleep helper for retry logic
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate image using Gemini 3 Pro Image
 */
async function generateImage(apiKey, prompt, outputPath, retries = 3) {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      log(`  Generating image with Gemini 3 Pro Image (attempt ${attempt}/${retries})...`, 'cyan');

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          responseModalities: ['Text', 'Image'],
        },
      });

      // Extract image from response parts
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          await fs.writeFile(outputPath, buffer);
          log(`  ✓ Image generated with Gemini: ${path.basename(outputPath)}`, 'green');
          return true;
        }
      }

      log(`  No image data in response`, 'yellow');
      return false;
    } catch (error) {
      const isOverloaded = error.message?.includes('503') || error.message?.includes('overloaded');
      const isRateLimited = error.message?.includes('429') || error.message?.includes('quota');

      if ((isOverloaded || isRateLimited) && attempt < retries) {
        const waitTime = attempt * 5000; // 5s, 10s, 15s
        log(`  Model busy, waiting ${waitTime / 1000}s before retry...`, 'yellow');
        await sleep(waitTime);
        continue;
      }

      // Handle specific errors
      if (error.message?.includes('not found') || error.message?.includes('not supported')) {
        log(`  Note: Model not available.`, 'yellow');
      }
      throw error;
    }
  }

  return false;
}

/**
 * Get theme colors based on article tags
 */
function getThemeColors(tags = []) {
  const tagColors = {
    ia: { primary: '#8b5cf6', secondary: '#6366f1', accent: '#a78bfa' },
    genai: { primary: '#8b5cf6', secondary: '#6366f1', accent: '#a78bfa' },
    llm: { primary: '#8b5cf6', secondary: '#6366f1', accent: '#a78bfa' },
    cloud: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' },
    aws: { primary: '#f97316', secondary: '#ea580c', accent: '#fb923c' },
    devops: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
    architecture: { primary: '#6366f1', secondary: '#4f46e5', accent: '#818cf8' },
    microservices: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' },
    react: { primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee' },
    terraform: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa' },
  };

  for (const tag of tags) {
    const colors = tagColors[tag.toLowerCase()];
    if (colors) return colors;
  }

  // Default purple theme
  return { primary: '#8b5cf6', secondary: '#6366f1', accent: '#a78bfa' };
}

/**
 * Generate SVG icon based on tags
 */
function getIconSvg(tags = []) {
  const tagIcons = {
    ia: `<g transform="translate(540, 280) scale(1.5)">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3"/>
      <path d="M20 50 Q35 30 50 50 T80 50" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M35 25 L50 50 L65 25" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <path d="M35 75 L50 50 L65 75" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/>
    </g>`,
    cloud: `<g transform="translate(520, 270) scale(1.8)">
      <path d="M30 60 C15 60 5 50 10 40 C5 25 25 15 40 20 C50 10 70 15 75 30 C90 30 95 50 80 55 C85 65 65 70 55 65 C45 75 25 70 30 60" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"/>
      <circle cx="25" cy="45" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="45" cy="40" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="65" cy="45" r="3" fill="currentColor" opacity="0.5"/>
    </g>`,
    architecture: `<g transform="translate(530, 270) scale(1.5)">
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
      <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <rect x="40" y="40" width="20" height="20" fill="currentColor" opacity="0.3"/>
      <line x1="10" y1="50" x2="20" y2="50" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="80" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="50" y1="10" x2="50" y2="20" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="50" y1="80" x2="50" y2="90" stroke="currentColor" stroke-width="2" opacity="0.5"/>
    </g>`,
    devops: `<g transform="translate(530, 270) scale(1.5)">
      <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <path d="M40 50 L47 57 L60 44" fill="none" stroke="currentColor" stroke-width="3"/>
    </g>`,
  };

  // Find matching icon based on tags
  for (const tag of tags) {
    const icon = tagIcons[tag.toLowerCase()];
    if (icon) return icon;
  }

  // Default: AI/neural network icon
  return tagIcons.ia;
}

/**
 * Alternative: Generate placeholder image with Sharp
 */
async function generatePlaceholder(metadata, outputPath) {
  try {
    const sharp = (await import('sharp')).default;

    const width = 1200;
    const height = 675;
    const tags = metadata.tags || [];
    const colors = getThemeColors(tags);
    const icon = getIconSvg(tags);

    // Create a gradient background SVG with theme-based colors
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0f;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#111118;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0d0d14;stop-opacity:1" />
          </linearGradient>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${colors.primary}" stroke-width="0.5" opacity="0.15"/>
          </pattern>
          <radialGradient id="glow1" cx="25%" cy="35%" r="40%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.25" />
            <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0" />
          </radialGradient>
          <radialGradient id="glow2" cx="75%" cy="65%" r="35%">
            <stop offset="0%" style="stop-color:${colors.secondary};stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0" />
          </radialGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="30%">
            <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:0.15" />
            <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0" />
          </radialGradient>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
          </filter>
        </defs>

        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#grad)"/>

        <!-- Grid pattern -->
        <rect width="100%" height="100%" fill="url(#grid)"/>

        <!-- Glowing orbs -->
        <ellipse cx="300" cy="240" rx="350" ry="280" fill="url(#glow1)"/>
        <ellipse cx="900" cy="440" rx="300" ry="250" fill="url(#glow2)"/>
        <ellipse cx="600" cy="340" rx="250" ry="200" fill="url(#centerGlow)"/>

        <!-- Decorative circles -->
        <circle cx="150" cy="100" r="80" fill="none" stroke="${colors.primary}" stroke-width="1" opacity="0.1"/>
        <circle cx="1050" cy="575" r="120" fill="none" stroke="${colors.secondary}" stroke-width="1" opacity="0.1"/>
        <circle cx="100" cy="550" r="60" fill="none" stroke="${colors.accent}" stroke-width="0.5" opacity="0.15"/>

        <!-- Diagonal lines -->
        <line x1="0" y1="200" x2="400" y2="0" stroke="${colors.primary}" stroke-width="0.5" opacity="0.1"/>
        <line x1="800" y1="675" x2="1200" y2="400" stroke="${colors.secondary}" stroke-width="0.5" opacity="0.1"/>

        <!-- Central icon -->
        <g style="color: ${colors.accent}" filter="url(#blur)">
          ${icon}
        </g>
        <g style="color: ${colors.accent}">
          ${icon}
        </g>

        <!-- Corner accents -->
        <path d="M0 0 L50 0 L0 50 Z" fill="${colors.primary}" opacity="0.1"/>
        <path d="M1200 675 L1150 675 L1200 625 Z" fill="${colors.secondary}" opacity="0.1"/>
      </svg>
    `;

    await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(outputPath);

    log(`  ✓ Placeholder image created: ${path.basename(outputPath)}`, 'green');
    return true;
  } catch (error) {
    log(`  Error creating placeholder: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Process a single blog article
 */
async function processArticle(slug, options = {}) {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const outputPath = path.join(OUTPUT_DIR, `${slug}.webp`);

  log(`\nProcessing: ${slug}`, 'bright');

  // Check if file exists
  try {
    await fs.access(mdPath);
  } catch {
    log(`  Error: Article not found: ${slug}.md`, 'red');
    return false;
  }

  // Check if image already exists
  if (!options.force) {
    try {
      await fs.access(outputPath);
      log(`  Image already exists. Use --force to regenerate.`, 'yellow');
      return true;
    } catch {
      // Image doesn't exist, continue
    }
  }

  // Read and parse frontmatter
  const content = await fs.readFile(mdPath, 'utf-8');
  const metadata = parseFrontmatter(content);

  if (!metadata) {
    log(`  Error: Could not parse frontmatter`, 'red');
    return false;
  }

  log(`  Title: ${metadata.title}`, 'cyan');
  log(`  Tags: ${(metadata.tags || []).join(', ')}`, 'cyan');

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // If in Gemini mode (CI), try to generate with Gemini
  if (global.useGemini) {
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = generateImagePrompt(metadata);
    log(`  Prompt generated`, 'cyan');

    try {
      const success = await generateImage(apiKey, prompt, outputPath);
      if (success) return true;
    } catch (error) {
      log(`  Gemini error: ${error.message.split('\n')[0]}`, 'yellow');
      log(`  Falling back to placeholder...`, 'yellow');
    }
  } else {
    log(`  Generating placeholder...`, 'cyan');
  }

  return await generatePlaceholder(metadata, outputPath);
}

/**
 * Get all blog articles
 */
async function getAllArticles() {
  const files = await fs.readdir(BLOG_DIR);
  return files.filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
}

/**
 * Main entry point
 */
async function main() {
  log('\n========================================', 'magenta');
  log(' Blog Hero Image Generator', 'bright');
  log('========================================\n', 'magenta');

  // Parse arguments
  const args = process.argv.slice(2);
  const forcePlaceholder = args.includes('--placeholder') || args.includes('-p');
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  const apiKey = process.env.GEMINI_API_KEY;

  // Determine mode: use Gemini only in CI (or if explicitly not placeholder mode)
  const useGemini = isCI && apiKey && !forcePlaceholder;

  if (isCI && !apiKey) {
    log('Error: GEMINI_API_KEY not set (required in CI)', 'red');
    process.exit(1);
  }

  if (useGemini) {
    log('Mode: Gemini 3 Pro Image Generation (CI)\n', 'green');
  } else {
    log('Mode: Placeholder (local development)', 'yellow');
    log('Real images will be generated by GitHub Actions\n', 'cyan');
  }

  // Store mode globally for processArticle
  global.useGemini = useGemini;

  const force = args.includes('--force') || args.includes('-f');
  const processAll = args.includes('--all') || args.includes('-a');
  const processMissing = args.includes('--missing') || args.includes('-m');

  // Filter out flags to get article slugs
  const slugs = args.filter((a) => !a.startsWith('-'));

  if (processAll || processMissing) {
    const articles = await getAllArticles();
    log(`Found ${articles.length} articles`, 'blue');

    for (const slug of articles) {
      if (processMissing) {
        const imagePath = path.join(OUTPUT_DIR, `${slug}.webp`);
        try {
          await fs.access(imagePath);
          log(`\nSkipping: ${slug} (image exists)`, 'yellow');
          continue;
        } catch {
          // Image doesn't exist, process it
        }
      }
      await processArticle(slug, { force });
    }
  } else if (slugs.length > 0) {
    for (const slug of slugs) {
      await processArticle(slug, { force });
    }
  } else {
    log('Usage:', 'blue');
    log('  npm run blog:hero <article-slug>', 'cyan');
    log('  npm run blog:hero:missing', 'cyan');
    log('\nOptions:', 'blue');
    log('  --force, -f       Regenerate even if image exists', 'cyan');
    log('  --all, -a         Process all articles', 'cyan');
    log('  --missing, -m     Process only articles without images', 'cyan');
    log('  --placeholder, -p Force placeholder mode (no Gemini)', 'cyan');
    log('\nModes:', 'blue');
    log('  Local (default):  Generates placeholders for dev preview', 'cyan');
    log('  CI (automatic):   Generates real images with Gemini 3 Pro', 'cyan');
    log('\nExamples:', 'blue');
    log('  npm run blog:hero guide-complet-ia-generative-entreprise-2025', 'cyan');
    log('  npm run blog:hero:missing', 'cyan');
    process.exit(0);
  }

  log('\n✓ Done!', 'magenta');
}

main().catch((error) => {
  log(`\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
