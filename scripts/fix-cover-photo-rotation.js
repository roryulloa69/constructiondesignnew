/**
 * Script to fix upside-down cover photos
 * Sets rotation_angle to 0 for the first image (cover) of each project
 * 
 * Usage: node scripts/fix-cover-photo-rotation.js
 * 
 * Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const envFile = readFileSync(envPath, 'utf-8');
    const envVars = {};
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.warn('Could not read .env file, using process.env');
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
  console.error('\nOptions:');
  console.error('1. Create a .env file in the project root with:');
  console.error('   VITE_SUPABASE_URL=your_supabase_url');
  console.error('   VITE_SUPABASE_ANON_KEY=your_anon_key');
  console.error('\n2. Or set them as environment variables:');
  console.error('   export VITE_SUPABASE_URL=your_supabase_url');
  console.error('   export VITE_SUPABASE_ANON_KEY=your_anon_key');
  console.error('\n3. Or use the admin interface at /admin to fix cover photos manually');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCoverPhotoRotations() {
  try {
    console.log('Fetching all projects...');
    
    // Get all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title');
    
    if (projectsError) throw projectsError;
    
    console.log(`Found ${projects.length} projects`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    // For each project, get the first image (cover) and set rotation to 0
    for (const project of projects) {
      // Get the first image (lowest display_order)
      const { data: coverImage, error: imageError } = await supabase
        .from('project_images')
        .select('id, rotation_angle, display_order')
        .eq('project_id', project.id)
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle();
      
      if (imageError) {
        console.error(`Error fetching cover image for project ${project.title}:`, imageError);
        continue;
      }
      
      if (!coverImage) {
        console.log(`  ⏭️  ${project.title}: No cover image found`);
        skippedCount++;
        continue;
      }
      
      // If rotation is not 0, fix it
      if (coverImage.rotation_angle !== 0 && coverImage.rotation_angle !== null) {
        const { error: updateError } = await supabase
          .from('project_images')
          .update({ rotation_angle: 0 })
          .eq('id', coverImage.id);
        
        if (updateError) {
          console.error(`  ❌ ${project.title}: Failed to update rotation -`, updateError.message);
        } else {
          console.log(`  ✅ ${project.title}: Fixed rotation from ${coverImage.rotation_angle}° to 0°`);
          fixedCount++;
        }
      } else {
        console.log(`  ✓ ${project.title}: Already upright (rotation: ${coverImage.rotation_angle || 0}°)`);
        skippedCount++;
      }
    }
    
    console.log('\n--- Summary ---');
    console.log(`Fixed: ${fixedCount} cover photos`);
    console.log(`Skipped: ${skippedCount} (already upright or no cover image)`);
    console.log(`Total projects: ${projects.length}`);
    
  } catch (error) {
    console.error('Error fixing cover photo rotations:', error);
    process.exit(1);
  }
}

// Run the script
fixCoverPhotoRotations()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

