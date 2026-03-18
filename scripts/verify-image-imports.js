import { readFileSync } from 'fs';
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectsDir = join(__dirname, '../src/assets/projects');
const projectsTsPath = join(__dirname, '../src/data/projects.ts');

// Read all webp files in projects directory
const files = await readdir(projectsDir);
const webpFiles = files.filter(f => f.endsWith('.webp')).map(f => f.toLowerCase());

// Read projects.ts file
const content = readFileSync(projectsTsPath, 'utf-8');

// Extract all import paths
const importRegex = /from "@\/assets\/projects\/([^"]+\.webp)"/g;
const imports = [];
let match;
while ((match = importRegex.exec(content)) !== null) {
  imports.push(match[1].toLowerCase());
}

// Also check for imports from @/assets/ (root assets)
const rootImportRegex = /from "@\/assets\/([^"]+\.webp)"/g;
while ((match = rootImportRegex.exec(content)) !== null) {
  const filePath = match[1].toLowerCase();
  // Check if it's in projects or root assets
  if (filePath.startsWith('projects/')) {
    imports.push(filePath.replace('projects/', ''));
  } else {
    // Root asset - check separately
    const rootAssetsDir = join(__dirname, '../src/assets');
    try {
      const rootFiles = await readdir(rootAssetsDir);
      const rootWebpFiles = rootFiles.filter(f => f.endsWith('.webp')).map(f => f.toLowerCase());
      if (!rootWebpFiles.includes(filePath)) {
        console.log(`❌ Missing root asset: ${filePath}`);
      }
    } catch (e) {
      console.log(`⚠️  Could not check root assets: ${e.message}`);
    }
  }
}

// Find missing files
const missing = [];
const found = [];

for (const imported of imports) {
  if (webpFiles.includes(imported)) {
    found.push(imported);
  } else {
    missing.push(imported);
  }
}

console.log(`\n📊 Verification Results:\n`);
console.log(`✅ Found: ${found.length} files`);
console.log(`❌ Missing: ${missing.length} files\n`);

if (missing.length > 0) {
  console.log('Missing files:');
  missing.forEach(file => {
    console.log(`  - ${file}`);
  });
} else {
  console.log('✨ All imported files exist!');
}

// Also check for files that exist but aren't imported (optional info)
const unused = webpFiles.filter(f => !imports.includes(f));
if (unused.length > 0 && unused.length < 50) {
  console.log(`\nℹ️  ${unused.length} files exist but aren't imported (may be unused):`);
  unused.slice(0, 20).forEach(file => {
    console.log(`  - ${file}`);
  });
  if (unused.length > 20) {
    console.log(`  ... and ${unused.length - 20} more`);
  }
}

