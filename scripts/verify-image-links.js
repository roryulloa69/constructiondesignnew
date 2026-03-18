import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read projects.ts file
const projectsFile = readFileSync(join(__dirname, '..', 'src', 'data', 'projects.ts'), 'utf8');

// Extract all import statements for images
const importRegex = /import\s+\w+\s+from\s+["']@\/assets\/projects\/([^"']+)["']/g;
const imports = [];
let match;
while ((match = importRegex.exec(projectsFile)) !== null) {
  imports.push(match[1]);
}

// Get all actual files in the projects directory
const assetsDir = join(__dirname, '..', 'src', 'assets', 'projects');
const fs = await import('fs/promises');
const files = await fs.readdir(assetsDir);
const imageFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

console.log(`\nChecking ${imports.length} image imports against ${imageFiles.length} actual files...\n`);

// Check for missing files
const missingFiles = [];
const unusedFiles = [];
const foundFiles = new Set();

imports.forEach(importPath => {
  if (!imageFiles.includes(importPath)) {
    missingFiles.push(importPath);
  } else {
    foundFiles.add(importPath);
  }
});

// Check for unused files (files that exist but aren't imported)
imageFiles.forEach(file => {
  if (!foundFiles.has(file)) {
    unusedFiles.push(file);
  }
});

// Report results
if (missingFiles.length > 0) {
  console.log(`❌ Missing ${missingFiles.length} files:\n`);
  missingFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log('');
} else {
  console.log('✅ All imported images exist!\n');
}

if (unusedFiles.length > 0) {
  console.log(`ℹ️  ${unusedFiles.length} files exist but aren't imported (may be intentional):\n`);
  unusedFiles.slice(0, 20).forEach(file => {
    console.log(`   - ${file}`);
  });
  if (unusedFiles.length > 20) {
    console.log(`   ... and ${unusedFiles.length - 20} more`);
  }
  console.log('');
}

console.log(`\nSummary:`);
console.log(`   Total imports: ${imports.length}`);
console.log(`   Files found: ${foundFiles.size}`);
console.log(`   Missing files: ${missingFiles.length}`);
console.log(`   Unused files: ${unusedFiles.length}`);

