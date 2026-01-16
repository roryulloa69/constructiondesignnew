import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, '..', 'src', 'assets', 'projects');

async function applySunsetLook() {
  try {
    const files = await fs.readdir(TARGET_DIR);
    // Filter for pool-design images (Ultra Luxe Pool project)
    const poolImages = files.filter(f => f.startsWith('pool-design-') && f.endsWith('.webp'));

    console.log(`Found ${poolImages.length} images to process.`);

    for (const file of poolImages) {
      const filePath = path.join(TARGET_DIR, file);
      const tempPath = filePath + '.temp.webp';

      console.log(`Processing ${file}...`);

      try {
        const inputBuffer = await fs.readFile(filePath);
        
        await sharp(inputBuffer)
          .modulate({
            saturation: 1.2, // Boost colors
            brightness: 0.95, // Slightly darker for evening vibe
          })
          .tint({ r: 255, g: 235, b: 215 }) // Subtle warm sunset tint
          .toFile(tempPath);

        // Replace original
        // Delete original first to avoid permission issues on Windows
        try {
          await fs.unlink(filePath);
        } catch (e) {
            // If unlink fails, rename might still work or fail
        }
        
        await fs.rename(tempPath, filePath);
        console.log(`✅ Updated ${file}`);
      } catch (err) {
        console.error(`❌ Failed to process ${file}:`, err);
        // Cleanup
        try { await fs.unlink(tempPath); } catch {}
      }
    }
    console.log('✨ All images updated with sunset look!');
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

applySunsetLook();
