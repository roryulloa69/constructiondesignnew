// Script to generate favicon PNGs from SVG
// Run with: npm run generate-favicons

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import sharp
import sharp from 'sharp';

const sizes = [
  { size: 32, filename: 'favicon-32x32.png' },
  { size: 16, filename: 'favicon-16x16.png' },
  { size: 180, filename: 'apple-touch-icon.png' },
];

const svgPath = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
  if (!fs.existsSync(svgPath)) {
    console.error('❌ favicon.svg not found at:', svgPath);
    process.exit(1);
  }

  console.log('🎨 Generating favicons...');

  for (const { size, filename } of sizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, filename));
      console.log(`✅ Generated ${filename} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error generating ${filename}:`, error.message);
    }
  }

  console.log('\n✨ Favicon generation complete!');
  console.log('📁 Files created in public/ folder');
}

generateFavicons();

