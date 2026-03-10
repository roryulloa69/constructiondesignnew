import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { lstat } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectsDir = join(__dirname, '../src/assets/projects');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

let convertedCount = 0;
let errorCount = 0;
let skippedCount = 0;

async function convertImageToWebP(filePath) {
  try {
    const ext = extname(filePath);
    const baseName = basename(filePath, ext);
    const dir = dirname(filePath);
    const webpPath = join(dir, `${baseName}.webp`);

    // Check if WebP already exists
    try {
      await stat(webpPath);
      console.log(`⏭️  Skipped (WebP exists): ${filePath}`);
      skippedCount++;
      return;
    } catch {
      // WebP doesn't exist, proceed with conversion
    }

    // Convert to WebP with quality 85 (good balance of quality and size)
    await sharp(filePath)
      .webp({ quality: 85 })
      .toFile(webpPath);

    console.log(`✅ Converted: ${filePath} → ${webpPath}`);
    convertedCount++;

    // Delete original JPG/PNG file
    await unlink(filePath);
    console.log(`🗑️  Deleted original: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
    errorCount++;
  }
}

async function processDirectory(dir, depth = 0) {
  try {
    const entries = await readdir(dir);
    const indent = '  '.repeat(depth);
    
    if (depth === 0) {
      console.log(`\n📂 Found ${entries.length} entries in root directory\n`);
    }

    for (const entryName of entries) {
      const fullPath = join(dir, entryName);
      
      try {
        const stats = await lstat(fullPath);
        
        if (stats.isDirectory()) {
          // Skip _unused folder
          if (entryName === '_unused') {
            console.log(`${indent}⏭️  Skipping directory: ${entryName}`);
            continue;
          }
          // Recursively process subdirectories
          await processDirectory(fullPath, depth + 1);
        } else if (stats.isFile()) {
          const ext = extname(entryName);
          if (imageExtensions.includes(ext)) {
            await convertImageToWebP(fullPath);
          }
        }
      } catch (statError) {
        console.error(`❌ Error checking ${fullPath}:`, statError.message);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dir}:`, error.message);
    errorCount++;
  }
}

async function main() {
  console.log('🚀 Starting WebP conversion...\n');
  console.log(`📁 Processing directory: ${projectsDir}\n`);

  await processDirectory(projectsDir);

  console.log('\n📊 Conversion Summary:');
  console.log(`✅ Converted: ${convertedCount} images`);
  console.log(`⏭️  Skipped: ${skippedCount} images (WebP already exists)`);
  console.log(`❌ Errors: ${errorCount} images`);
  console.log(`\n✨ Total processed: ${convertedCount + skippedCount + errorCount} images`);
}

main().catch(console.error);

