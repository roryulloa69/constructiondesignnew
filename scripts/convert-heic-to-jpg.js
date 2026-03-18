// Script to convert HEIC images to JPG
// Run with: node scripts/convert-heic-to-jpg.js <source-directory>
// Example: node scripts/convert-heic-to-jpg.js "C:\Users\username\OneDrive\POOL FINAL"
// Or use environment variable: SOURCE_DIR="path/to/dir" node scripts/convert-heic-to-jpg.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import convert from 'heic-convert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get source directory from command-line argument or environment variable
const sourceDir = process.argv[2] || process.env.SOURCE_DIR || process.env.POOL_SOURCE_DIR;

if (!sourceDir) {
  console.error('❌ Error: Source directory not specified');
  console.error('\nUsage:');
  console.error('  node scripts/convert-heic-to-jpg.js <source-directory>');
  console.error('  Example: node scripts/convert-heic-to-jpg.js "C:\\Users\\username\\OneDrive\\POOL FINAL"');
  console.error('\nOr set environment variable:');
  console.error('  SOURCE_DIR="path/to/dir" node scripts/convert-heic-to-jpg.js');
  console.error('  POOL_SOURCE_DIR="path/to/dir" node scripts/convert-heic-to-jpg.js');
  process.exit(1);
}

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Error: Source directory does not exist: ${sourceDir}`);
  process.exit(1);
}

const outputDir = path.join(__dirname, '../src/assets/projects');

async function convertHeicToJpg() {
  console.log('🔄 Converting HEIC files to JPG...\n');

  // Get all HEIC files (case-insensitive)
  const files = fs.readdirSync(sourceDir).filter(file => 
    file.toLowerCase().endsWith('.heic')
  );

  if (files.length === 0) {
    console.log('❌ No HEIC files found');
    return;
  }

  let startNumber = 17; // Start from pool-design-17.jpg

  for (const file of files.sort()) {
    const sourcePath = path.join(sourceDir, file);
    const outputFilename = `pool-design-${startNumber}.jpg`;
    const outputPath = path.join(outputDir, outputFilename);

    try {
      console.log(`Converting ${file}...`);
      
      const inputBuffer = fs.readFileSync(sourcePath);
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.92
      });

      fs.writeFileSync(outputPath, outputBuffer);
      console.log(`✅ ${file} -> ${outputFilename}`);
      startNumber++;
    } catch (error) {
      console.error(`❌ Error converting ${file}:`, error.message);
    }
  }

  console.log(`\n✨ Conversion complete! ${startNumber - 17} files converted.`);
  console.log(`📁 Files created in src/assets/projects/`);
}

convertHeicToJpg();

