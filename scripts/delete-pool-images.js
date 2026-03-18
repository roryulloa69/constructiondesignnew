import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  try {
    const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf8');
    const envVars = {};
    envFile.split(/\r?\n/).forEach(line => {
      if (line.trim().startsWith('#') || !line.trim()) return;
      
      const match = line.match(/^([^=]+)=["']?([^"']*)["']?$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        value = value.replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    });
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

const env = { ...process.env, ...loadEnv() };

const PROJECT_ID = 'hospitality-pool';

const supabaseUrl = env.VITE_SUPABASE_URL;
const serviceRoleKey = process.argv[2] || env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = serviceRoleKey || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL is set in your .env file');
  console.error('And provide service role key as: node scripts/delete-pool-images.js [service-role-key]');
  process.exit(1);
}

console.log(`Connecting to Supabase: ${supabaseUrl}`);
console.log(`Using key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function deletePoolImages() {
  console.log(`\nDeleting all pool images for project: ${PROJECT_ID}\n`);

  // Get existing images
  const { data: existingImages, error: fetchError } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', PROJECT_ID);

  if (fetchError) {
    console.error('Error fetching existing images:', fetchError.message);
    return;
  }

  if (!existingImages || existingImages.length === 0) {
    console.log('No pool images found in database.');
    return;
  }

  console.log(`Found ${existingImages.length} images to delete`);

  // Delete from storage if they're in Supabase storage
  const filesToDelete = existingImages
    .map(img => {
      const urlParts = img.image_url.split('/');
      const pathIndex = urlParts.findIndex(part => part === PROJECT_ID);
      if (pathIndex !== -1) {
        return urlParts.slice(pathIndex).join('/');
      }
      return null;
    })
    .filter(Boolean);

  if (filesToDelete.length > 0) {
    console.log(`Deleting ${filesToDelete.length} files from storage...`);
    const { error: storageError } = await supabase.storage
      .from('project-images')
      .remove(filesToDelete);

    if (storageError) {
      console.error('Error deleting from storage:', storageError.message);
    } else {
      console.log('✅ Deleted files from storage');
    }
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('project_images')
    .delete()
    .eq('project_id', PROJECT_ID);

  if (deleteError) {
    console.error('❌ Error deleting from database:', deleteError.message);
  } else {
    console.log(`✅ Successfully deleted ${existingImages.length} images from database`);
  }
}

deletePoolImages().catch(console.error);

