import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const roots = ["src/assets/projects", "src/assets"];

const flagged = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Avoid infinite recursion by skipping nested projects inside assets root (already covered)
      if (!(dir.endsWith("src/assets") && entry.name === "projects")) {
        await walk(full);
      }
    } else if (entry.isFile() && entry.name.endsWith(".webp")) {
      try {
        const metadata = await sharp(full).metadata();
        if (metadata.orientation && metadata.orientation !== 1) {
          flagged.push({ file: full, orientation: metadata.orientation });
        }
      } catch (error) {
        console.error(`Error processing ${full}: ${error.message}`);
      }
    }
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

  if (flagged.length === 0) {
    console.log("No EXIF orientation issues detected.");
  } else {
    console.log("Files needing rotation:");
    flagged.forEach(({ file, orientation }) =>
      console.log(`${file} (orientation=${orientation})`)
    );
  }
}

main().catch((error) => {
  console.error("Orientation check failed:", error);
  process.exit(1);
});


