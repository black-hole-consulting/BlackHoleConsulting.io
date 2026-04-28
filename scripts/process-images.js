#!/usr/bin/env node
/* global process, Buffer */

/**
 * Image Processing Script for Black Hole Consulting
 *
 * Watches public/images/projects/ for new images and:
 * 1. Extracts dominant colors from the image
 * 2. Creates a gradient background matching the image colors
 * 3. Places the full image (no cropping) on the matching background
 * 4. Generates multiple formats in WebP
 *
 * Usage:
 *   npm run images:watch   - Watch mode (continuous)
 *   npm run images:process - Process all existing images once
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import chokidar from 'chokidar';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'public/images/projects');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public/images/projects/processed');

// Image formats to generate (target dimensions)
const FORMATS = [
  { name: 'thumb', width: 400, height: 225 }, // For lists
  { name: 'card', width: 800, height: 450 }, // For cards
  { name: 'hero', width: 1200, height: 675 }, // For hero sections
];

// Supported input formats
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Initialize Gemini AI client
 */
function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    log('Warning: GEMINI_API_KEY not set. AI enhancement will be skipped.', 'yellow');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Enhance image using Gemini AI (get description for alt text)
 */
async function enhanceWithGemini(genAI, imagePath, _imageName) {
  if (!genAI) return null;

  try {
    log(`  Analyzing with Gemini AI...`, 'cyan');

    const imageData = await fs.readFile(imagePath);
    const base64Image = imageData.toString('base64');
    const mimeType = getMimeType(imagePath);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      `Analyze this image for a tech consulting portfolio.
       Provide a brief, professional description (max 100 words)
       that highlights the technical/business aspects visible.
       Focus on: architecture, technology, innovation, digital transformation.`,
    ]);

    const description = result.response.text();
    log(`  ✓ AI Analysis complete`, 'green');

    return { description };
  } catch (error) {
    log(`  Gemini analysis skipped: ${error.message.split('\n')[0]}`, 'yellow');
    return null;
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

/**
 * Extract dominant colors from image edges
 * Samples pixels from the borders to get colors that will blend well
 */
async function extractDominantColors(inputBuffer) {
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Sample multiple areas of the image for better color extraction
  const sampleSize = 50;

  // Get colors from different edges
  const samples = await Promise.all([
    // Top edge
    sharp(inputBuffer)
      .extract({ left: 0, top: 0, width: width, height: sampleSize })
      .resize(1, 1)
      .raw()
      .toBuffer(),
    // Bottom edge
    sharp(inputBuffer)
      .extract({
        left: 0,
        top: Math.max(0, height - sampleSize),
        width: width,
        height: Math.min(sampleSize, height),
      })
      .resize(1, 1)
      .raw()
      .toBuffer(),
    // Left edge
    sharp(inputBuffer)
      .extract({ left: 0, top: 0, width: sampleSize, height: height })
      .resize(1, 1)
      .raw()
      .toBuffer(),
    // Right edge
    sharp(inputBuffer)
      .extract({
        left: Math.max(0, width - sampleSize),
        top: 0,
        width: Math.min(sampleSize, width),
        height: height,
      })
      .resize(1, 1)
      .raw()
      .toBuffer(),
    // Center (for contrast)
    sharp(inputBuffer).resize(1, 1).raw().toBuffer(),
  ]);

  // Convert buffers to RGB objects
  const colorsRgb = samples.map((buf) => ({
    r: buf[0],
    g: buf[1],
    b: buf[2],
  }));

  // Calculate average of edge colors (excluding center)
  const edgeColors = colorsRgb.slice(0, 4);
  const avgEdge = {
    r: Math.round(edgeColors.reduce((sum, c) => sum + c.r, 0) / edgeColors.length),
    g: Math.round(edgeColors.reduce((sum, c) => sum + c.g, 0) / edgeColors.length),
    b: Math.round(edgeColors.reduce((sum, c) => sum + c.b, 0) / edgeColors.length),
  };

  // Create a slightly darker version for gradient end
  const darkerColor = {
    r: Math.round(avgEdge.r * 0.7),
    g: Math.round(avgEdge.g * 0.7),
    b: Math.round(avgEdge.b * 0.7),
  };

  // Create a slightly lighter version for gradient start
  const lighterColor = {
    r: Math.min(255, Math.round(avgEdge.r * 1.1)),
    g: Math.min(255, Math.round(avgEdge.g * 1.1)),
    b: Math.min(255, Math.round(avgEdge.b * 1.1)),
  };

  return {
    primary: avgEdge,
    lighter: lighterColor,
    darker: darkerColor,
    center: colorsRgb[4],
  };
}

/**
 * Convert RGB to hex string
 */
function rgbToHex(rgb) {
  return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
}

/**
 * Create gradient background SVG using extracted colors
 */
function createGradientBackground(width, height, colors) {
  const startColor = rgbToHex(colors.lighter);
  const endColor = rgbToHex(colors.darker);

  return Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${endColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    </svg>
  `);
}

/**
 * Process image with contain + color-matched gradient background
 * Preserves the entire image without cropping
 */
async function processWithMatchingBackground(inputBuffer, targetWidth, targetHeight) {
  // Extract dominant colors from the image
  const dominantColors = await extractDominantColors(inputBuffer);

  // Get original image metadata
  const metadata = await sharp(inputBuffer).metadata();
  const origWidth = metadata.width;
  const origHeight = metadata.height;

  // Calculate the size the image will be after fitting
  const origRatio = origWidth / origHeight;
  const targetRatio = targetWidth / targetHeight;

  let resizedWidth, resizedHeight;
  if (origRatio > targetRatio) {
    // Image is wider - fit to width
    resizedWidth = targetWidth;
    resizedHeight = Math.round(targetWidth / origRatio);
  } else {
    // Image is taller - fit to height
    resizedHeight = targetHeight;
    resizedWidth = Math.round(targetHeight * origRatio);
  }

  // Create gradient background with matching colors
  const background = await sharp(
    createGradientBackground(targetWidth, targetHeight, dominantColors)
  )
    .png()
    .toBuffer();

  // Resize the original image
  const resizedImage = await sharp(inputBuffer)
    .resize(resizedWidth, resizedHeight, { fit: 'inside' })
    .png()
    .toBuffer();

  // Calculate position to center the image
  const left = Math.round((targetWidth - resizedWidth) / 2);
  const top = Math.round((targetHeight - resizedHeight) / 2);

  // Composite: background + centered image
  return {
    buffer: await sharp(background)
      .composite([
        {
          input: resizedImage,
          left,
          top,
        },
      ])
      .toBuffer(),
    colors: dominantColors,
  };
}

/**
 * Process a single image: generate all formats
 */
async function processImage(imagePath, genAI) {
  const fileName = path.basename(imagePath);
  const baseName = path.parse(fileName).name;
  const ext = path.extname(imagePath).toLowerCase();

  // Skip already processed images
  if (imagePath.includes('/processed/')) {
    return;
  }

  // Skip unsupported formats
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    log(`Skipping unsupported format: ${fileName}`, 'yellow');
    return;
  }

  log(`\nProcessing: ${fileName}`, 'bright');

  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Read original image
    const originalBuffer = await fs.readFile(imagePath);
    const metadata = await sharp(originalBuffer).metadata();
    log(`  Original: ${metadata.width}x${metadata.height}`, 'cyan');

    // Extract colors first to show what we found
    log(`  Extracting dominant colors...`, 'cyan');
    const { colors: dominantColors } = await processWithMatchingBackground(
      originalBuffer,
      100,
      100
    );
    log(
      `  ✓ Colors: ${rgbToHex(dominantColors.primary)} → ${rgbToHex(dominantColors.darker)}`,
      'green'
    );

    // Enhance with Gemini (get AI description)
    const aiResult = await enhanceWithGemini(genAI, imagePath, baseName);

    // Generate all format sizes with color-matched background
    for (const format of FORMATS) {
      const outputName = `${baseName}-${format.name}.webp`;
      const outputPath = path.join(OUTPUT_DIR, outputName);

      log(`  Creating ${format.name} (${format.width}x${format.height})...`, 'cyan');

      const { buffer: processedBuffer } = await processWithMatchingBackground(
        originalBuffer,
        format.width,
        format.height
      );

      await sharp(processedBuffer).webp({ quality: 90 }).toFile(outputPath);

      log(`  ✓ ${outputName}`, 'green');
    }

    // Also generate a fallback JPEG for the card size
    const { buffer: jpegBuffer } = await processWithMatchingBackground(originalBuffer, 800, 450);
    const jpegOutputPath = path.join(OUTPUT_DIR, `${baseName}-card.jpg`);
    await sharp(jpegBuffer).jpeg({ quality: 90 }).toFile(jpegOutputPath);
    log(`  ✓ ${baseName}-card.jpg (fallback)`, 'green');

    // Generate original ratio version (no padding, just resized)
    const origOutputPath = path.join(OUTPUT_DIR, `${baseName}-original.webp`);
    await sharp(originalBuffer)
      .resize(1200, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(origOutputPath);
    log(`  ✓ ${baseName}-original.webp (preserved ratio)`, 'green');

    // Save metadata if available
    const metaPath = path.join(OUTPUT_DIR, `${baseName}.meta.json`);
    await fs.writeFile(
      metaPath,
      JSON.stringify(
        {
          originalFile: fileName,
          originalDimensions: `${metadata.width}x${metadata.height}`,
          processedAt: new Date().toISOString(),
          dominantColors: {
            primary: rgbToHex(dominantColors.primary),
            lighter: rgbToHex(dominantColors.lighter),
            darker: rgbToHex(dominantColors.darker),
          },
          aiDescription: aiResult?.description || null,
          formats: [
            ...FORMATS.map((f) => `${baseName}-${f.name}.webp`),
            `${baseName}-card.jpg`,
            `${baseName}-original.webp`,
          ],
        },
        null,
        2
      )
    );
    log(`  ✓ ${baseName}.meta.json`, 'green');

    log(`✓ Completed: ${fileName}`, 'magenta');
  } catch (error) {
    log(`Error processing ${fileName}: ${error.message}`, 'yellow');
    console.error(error);
  }
}

/**
 * Process all existing images in the source directory
 */
async function processAllImages(genAI) {
  log('\nScanning for images to process...', 'blue');

  try {
    const files = await fs.readdir(SOURCE_DIR);
    const imageFiles = files.filter(
      (f) => SUPPORTED_EXTENSIONS.includes(path.extname(f).toLowerCase()) && !f.startsWith('.')
    );

    if (imageFiles.length === 0) {
      log('No images found in source directory.', 'yellow');
      log(`Add images to: ${SOURCE_DIR}`, 'cyan');
      return;
    }

    log(`Found ${imageFiles.length} image(s) to process.`, 'green');

    for (const file of imageFiles) {
      await processImage(path.join(SOURCE_DIR, file), genAI);
    }

    log('\n✓ All images processed!', 'magenta');
  } catch (error) {
    if (error.code === 'ENOENT') {
      log(`Source directory not found. Creating: ${SOURCE_DIR}`, 'yellow');
      await fs.mkdir(SOURCE_DIR, { recursive: true });
    } else {
      throw error;
    }
  }
}

/**
 * Watch mode: monitor directory for new images
 */
function watchImages(genAI) {
  log('\n========================================', 'magenta');
  log(' Black Hole Consulting - Image Processor', 'bright');
  log('========================================\n', 'magenta');
  log(`Watching: ${SOURCE_DIR}`, 'cyan');
  log('Drop images into this folder to process them.', 'blue');
  log('Background color will match the image colors.\n', 'blue');

  const watcher = chokidar.watch(SOURCE_DIR, {
    ignored: [
      /(^|[/\\])\../, // Ignore dotfiles
      /\/processed\//, // Ignore processed folder
      /\.meta\.json$/, // Ignore metadata files
    ],
    persistent: true,
    ignoreInitial: false, // Process existing files on start
    awaitWriteFinish: {
      stabilityThreshold: 1000, // Wait for file to finish writing
      pollInterval: 100,
    },
  });

  watcher.on('add', async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (SUPPORTED_EXTENSIONS.includes(ext)) {
      await processImage(filePath, genAI);
    }
  });

  watcher.on('error', (error) => {
    log(`Watcher error: ${error.message}`, 'yellow');
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('\nShutting down watcher...', 'yellow');
    watcher.close().then(() => {
      log('Goodbye!', 'green');
      process.exit(0);
    });
  });
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const watchMode = args.includes('--watch') || args.includes('-w');

  // Initialize Gemini
  const genAI = initGemini();

  // Ensure directories exist
  await fs.mkdir(SOURCE_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  if (watchMode) {
    watchImages(genAI);
  } else {
    await processAllImages(genAI);
  }
}

main().catch(console.error);
