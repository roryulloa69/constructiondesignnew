import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectsFile = join(__dirname, '../src/data/projects.ts');

// Mapping of old subdirectory paths to new root paths
const pathMappings = {
  // Remove subdirectory names, keep just the filename
  'carmel-house-2/': '',
  'hillside-cleanup/': '',
  'southcoast-remodel-design-build/': '',
  'laguna-grande-design-build/': '',
  'bigsur-mountain-remodel/': '',
  'carmel-valley-design-build/': '',
  'north-florida-renovation/': '',
  'pacific-grove-design-build/': '',
  'syracuse-house/': '',
  'hospitality-pool/': '',
  'coastal-hillside-restoration-2/': '',
  'carmel-house-remdl-23/': '',
  'bahamas-beachfront-estate/': '',
  'bahamas-abaco-development/': '',
  'civil-engineering/': '',
  'development/': '',
  'high-alpine-ranch/': '',
  'montana-condo/': '',
  'miami-beach-condo/': '',
};

async function updateImports() {
  try {
    console.log('📖 Reading projects.ts...');
    let content = await readFile(projectsFile, 'utf-8');
    
    // Remove merge conflict markers - keep HEAD version, remove incoming
    console.log('🔧 Resolving merge conflicts (keeping HEAD/WebP version)...');
    // Remove everything between ======= and >>>>>>> (incoming changes) - multiline match
    content = content.replace(/=======\n[\s\S]*?>>>>>>> [^\n]+\n/g, '');
    // Remove <<<<<<< HEAD markers
    content = content.replace(/^<<<<<<< HEAD\n/gm, '');
    
    console.log('🔄 Updating import paths to root directory...');
    
    // Update all import paths
    for (const [oldPath, newPath] of Object.entries(pathMappings)) {
      const regex = new RegExp(`@/assets/projects/${oldPath.replace(/\//g, '\\/')}([^"]+\\.webp")`, 'g');
      content = content.replace(regex, `@/assets/projects/${newPath}$1`);
    }
    
    // Count how many replacements were made
    let count = 0;
    for (const oldPath of Object.keys(pathMappings)) {
      const regex = new RegExp(`@/assets/projects/${oldPath.replace(/\//g, '\\/')}`, 'g');
      const matches = content.match(regex);
      if (matches) {
        count += matches.length;
      }
    }
    
    await writeFile(projectsFile, content, 'utf-8');
    console.log(`✅ Updated import paths (removed subdirectory references)`);
    console.log(`📊 Processed ${Object.keys(pathMappings).length} path patterns`);
    
  } catch (error) {
    console.error('❌ Error updating imports:', error.message);
    process.exit(1);
  }
}

updateImports();

