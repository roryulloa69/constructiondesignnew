import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectsFile = join(__dirname, '../src/data/projects.ts');

async function updateImports() {
  try {
    console.log('📖 Reading projects.ts...');
    const content = await readFile(projectsFile, 'utf-8');
    
    console.log('🔄 Updating import paths from .jpg to .webp...');
    
    // Replace all .jpg extensions with .webp in import statements
    // This handles both single and double quotes, and various path formats
    const updated = content.replace(
      /from\s+["']@\/assets\/projects\/[^"']+\.jpg["']/g,
      (match) => match.replace(/\.jpg["']$/, '.webp"')
    );
    
    // Count how many replacements were made
    const matches = content.match(/from\s+["']@\/assets\/projects\/[^"']+\.jpg["']/g);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      await writeFile(projectsFile, updated, 'utf-8');
      console.log(`✅ Updated ${count} import paths from .jpg to .webp`);
    } else {
      console.log('⚠️  No .jpg imports found to update');
    }
    
    // Also check for any remaining .jpg references
    const remainingJpg = updated.match(/\.jpg["']/g);
    if (remainingJpg) {
      console.log(`⚠️  Warning: Found ${remainingJpg.length} remaining .jpg references`);
    } else {
      console.log('✅ All .jpg references have been updated to .webp');
    }
    
  } catch (error) {
    console.error('❌ Error updating imports:', error.message);
    process.exit(1);
  }
}

updateImports();

