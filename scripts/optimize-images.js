import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 80;
const MAX_SIZE_KB = 300;

async function optimizeImage(inputBuffer, outputPath) {
  const metadata = await sharp(inputBuffer).metadata();

  let quality = QUALITY;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    await sharp(inputBuffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality })
      .toFile(outputPath);

    const stats = await fs.stat(outputPath);
    const sizeKB = stats.size / 1024;

    console.log(`  Attempt ${attempts + 1}: ${sizeKB.toFixed(0)} KB (quality: ${quality})`);

    if (sizeKB <= MAX_SIZE_KB) {
      console.log(`  ✅ Success: ${sizeKB.toFixed(0)} KB`);
      return;
    }

    // Reduce quality for next attempt
    quality -= 10;
    attempts++;
  }

  console.log(`  ⚠️ Could not reduce below ${MAX_SIZE_KB} KB, using quality ${quality + 10}`);
}

async function processDirectory(dirPath) {
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      continue;
    }

    const sizeKB = stat.size / 1024;

    if (sizeKB <= MAX_SIZE_KB) {
      // console.log(`⏭️  Skipping ${file} (${sizeKB.toFixed(0)} KB - already optimized)`);
      continue;
    }

    console.log(`\n🔧 Optimizing ${file} (${sizeKB.toFixed(0)} KB)...`);

    const tempPath = fullPath + '.tmp.webp';

    try {
      const inputBuffer = await fs.readFile(fullPath);
      await optimizeImage(inputBuffer, tempPath);

      // Replace original
      const originalExt = path.extname(file);
      const newPath = fullPath.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');
      
      // On Windows, rename might fail if target exists. Try to delete target first.
      if (newPath === fullPath) {
        try {
            await fs.unlink(fullPath);
        } catch (e) {
            // ignore if file doesn't exist (though it should)
        }
      }
      
      await fs.rename(tempPath, newPath);
      
      if (originalExt.toLowerCase() !== '.webp' && newPath !== fullPath) {
          // If we converted a jpg/png to webp, delete the original
          try {
            await fs.unlink(fullPath);
            console.log(`  🗑️ Deleted original ${originalExt} file`);
          } catch (e) {
            // ignore
          }
      }

      console.log(`✅ Optimized ${file}`);
    } catch (error) {
      console.error(`❌ Error optimizing ${file}:`, error.message);

      // Clean up temp file
      try {
        await fs.unlink(tempPath);
      } catch {}
    }
  }
}

async function main() {
  const projectsDir = path.join(__dirname, '..', 'src', 'assets', 'projects');

  console.log('🚀 Starting image optimization...');
  console.log(`📁 Directory: ${projectsDir}`);
  console.log(`🎯 Target: ≤${MAX_SIZE_KB} KB per image\n`);

  await processDirectory(projectsDir);

  console.log('\n✨ Optimization complete!');
}

main().catch(console.error);
