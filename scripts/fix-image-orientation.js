import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, extname, basename, dirname } from "path";

const roots = ["src/assets/projects", "src/assets"];
const sourceExtensions = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"];

let processedCount = 0;
let rotatedCount = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip redundant recursion into projects from assets root (already covered)
      if (!(dir.endsWith("src/assets") && entry.name === "projects")) {
        await walk(full);
      }
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (sourceExtensions.includes(ext)) {
        await convertWithOrientation(full, ext);
      }
    }
  }
}

async function convertWithOrientation(filePath, ext) {
  const baseName = basename(filePath, ext);
  const outputPath = join(dirname(filePath), `${baseName}.webp`);

  try {
    const metadata = await sharp(filePath).metadata();

    await sharp(filePath)
      .rotate() // Apply orientation metadata
      .webp({ quality: 85 })
      .toFile(outputPath);

    processedCount++;
    if (metadata.orientation && metadata.orientation !== 1) {
      rotatedCount++;
      console.log(
        `✅ Rotated ${filePath} (orientation=${metadata.orientation})`
      );
    } else {
      console.log(`ℹ️  Rebuilt ${filePath} (no orientation metadata)`);
    }
  } catch (error) {
    console.error(`❌ Failed to process ${filePath}: ${error.message}`);
  }
}

async function main() {
  for (const root of roots) {
    try {
      await walk(root);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
  }

  console.log("\n📊 Orientation Fix Summary");
  console.log(`Processed sources: ${processedCount}`);
  console.log(`Images rotated using EXIF metadata: ${rotatedCount}`);
  console.log(
    `Images rebuilt without rotation (already correct or missing metadata): ${
      processedCount - rotatedCount
    }`
  );
}

main().catch((error) => {
  console.error("Orientation fix failed:", error);
  process.exit(1);
});

