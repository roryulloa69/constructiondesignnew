import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectsFile = join(__dirname, '../src/data/projects.ts');

async function resolveConflictsAndUpdatePaths() {
  try {
    console.log('📖 Reading projects.ts...');
    let content = await readFile(projectsFile, 'utf-8');
    
    console.log('🔧 Resolving merge conflicts (keeping HEAD/WebP version)...');
    
    // Split by lines to process more carefully
    const lines = content.split('\n');
    const resolvedLines = [];
    let inConflict = false;
    let inIncomingSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect conflict markers
      if (line.trim() === '<<<<<<< HEAD') {
        inConflict = true;
        inIncomingSection = false;
        // Skip the marker, keep HEAD content
        continue;
      }
      
      if (line.trim() === '=======') {
        inIncomingSection = true;
        // Skip the marker, ignore incoming content
        continue;
      }
      
      // If we see export, we're past all conflicts
      if (line.trim().startsWith('export ')) {
        inConflict = false;
        inIncomingSection = false;
        resolvedLines.push(line);
        continue;
      }
      
      // If in incoming section, skip it
      if (inIncomingSection) {
        // Check if we hit another conflict marker
        if (line.trim() === '<<<<<<< HEAD') {
          inIncomingSection = false;
          // Don't add this line, it will be handled in next iteration
          continue;
        }
        // Skip all lines in incoming section
        continue;
      }
      
      // Add HEAD lines
      resolvedLines.push(line);
    }
    
    content = resolvedLines.join('\n');
    
    console.log('🔄 Updating import paths to root directory...');
    
    // Mapping of old subdirectory paths to new root paths
    const pathMappings = {
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
    
    // Update all import paths
    for (const [oldPath, newPath] of Object.entries(pathMappings)) {
      const regex = new RegExp(`@/assets/projects/${oldPath.replace(/\//g, '\\/')}([^"]+\\.webp")`, 'g');
      content = content.replace(regex, `@/assets/projects/${newPath}$1`);
    }
    
    await writeFile(projectsFile, content, 'utf-8');
    console.log('✅ Resolved conflicts and updated import paths');
    
    // Verify no conflicts remain
    const remainingConflicts = content.match(/<<<<<<<|=======|>>>>>>>/g);
    if (remainingConflicts) {
      console.log(`⚠️  Warning: Found ${remainingConflicts.length} remaining conflict markers`);
    } else {
      console.log('✅ All conflicts resolved');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resolveConflictsAndUpdatePaths();

