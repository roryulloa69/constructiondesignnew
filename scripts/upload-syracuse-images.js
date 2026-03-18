/**
 * Script to upload Syracuse project images to Supabase storage
 * Usage: node scripts/upload-syracuse-images.js [path-to-images-folder]
 * 
 * If no path is provided, it will look for images in:
 * - src/assets/projects/ (files matching syracuse-*.jpg or syracuse-*.png)
 * - A folder named 'syracuse-images' in the project root
 */

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file manually
function loadEnv() {
  try {
    const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf8');
    const envVars = {};
    envFile.split(/\r?\n/).forEach(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) return;
      
      const match = line.match(/^([^=]+)=["']?([^"']*)["']?$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
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

const PROJECT_ID = 'syracuse-house';

const supabaseUrl = env.VITE_SUPABASE_URL;
// Use service role key if provided via environment or command line, otherwise use anon key
const serviceRoleKey = process.argv[3] || env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = serviceRoleKey || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL is set in your .env file');
  console.error('And provide service role key as: node scripts/upload-syracuse-images.js [path] [service-role-key]');
  process.exit(1);
}

// Use service role key for admin operations
console.log(`Connecting to Supabase: ${supabaseUrl}`);
console.log(`Using key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function findImageFiles(searchPath) {
  const imageFiles = [];
  
  try {
    const files = await readdir(searchPath, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isFile()) {
        const fileName = file.name.toLowerCase();
        const ext = extname(fileName).toLowerCase();
        
        // Check if it's a Syracuse image (handles various naming patterns)
        if (fileName.includes('syracuse') && 
            (ext === '.jpg' || ext === '.jpeg' || ext === '.png')) {
          imageFiles.push({
            path: join(searchPath, file.name),
            name: file.name,
            ext: ext
          });
        }
      }
    }
    
    // Sort by filename to maintain order (extract number from filename)
    imageFiles.sort((a, b) => {
      // Try to extract number from patterns like "syracuse1 (1).jpg" or "syracuse-1.jpg"
      const numA = parseInt(a.name.match(/\((\d+)\)/)?.[1] || a.name.match(/(\d+)/)?.[1] || '0');
      const numB = parseInt(b.name.match(/\((\d+)\)/)?.[1] || b.name.match(/(\d+)/)?.[1] || '0');
      return numA - numB;
    });
    
  } catch (error) {
    console.error(`Error reading directory ${searchPath}:`, error.message);
  }
  
  return imageFiles;
}

async function uploadImages(imageFiles) {
  console.log(`Found ${imageFiles.length} images to upload\n`);
  
  if (imageFiles.length === 0) {
    console.log('No images found. Please check the path and ensure images are named with "syracuse-" prefix.');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  // First, delete existing images
  console.log('Checking for existing images...');
  const { data: existing } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', PROJECT_ID);

  if (existing && existing.length > 0) {
    console.log(`Found ${existing.length} existing images. Deleting...`);
    
    // Delete from storage
    const filesToDelete = existing
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
      const { error: storageError } = await supabase.storage
        .from('project-images')
        .remove(filesToDelete);
      
      if (storageError) {
        console.error('Error deleting from storage:', storageError.message);
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .eq('project_id', PROJECT_ID);

    if (deleteError) {
      console.error('Error deleting from database:', deleteError.message);
    } else {
      console.log('Existing images deleted successfully.\n');
    }
  }

  // Upload new images
  console.log('Starting upload...\n');
  
  for (let i = 0; i < imageFiles.length; i++) {
    const { path, name, ext } = imageFiles[i];
    
    try {
      console.log(`[${i + 1}/${imageFiles.length}] Uploading ${name}...`);
      
      // Read file
      const fileBuffer = await readFile(path);
      
      // Create file object for Supabase (use ArrayBuffer/Uint8Array)
      const file = new Uint8Array(fileBuffer);
      
      // Upload to Supabase storage
      // Clean filename for storage (remove spaces and special chars)
      const cleanName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageFileName = `${PROJECT_ID}/${Date.now()}-${i}-${cleanName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(storageFileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: `image/${ext.slice(1)}`
        });

      if (uploadError) {
        console.error(`  ❌ Failed: ${uploadError.message}`);
        failCount++;
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(storageFileName);

      // Insert into database
      const { error: dbError } = await supabase
        .from('project_images')
        .insert({
          project_id: PROJECT_ID,
          image_url: publicUrl,
          title: `Syracuse ${i + 1}`,
          description: null,
          display_order: i,
          is_before: false,
          is_after: false,
        });

      if (dbError) {
        console.error(`  ❌ Database error: ${dbError.message}`);
        failCount++;
      } else {
        console.log(`  ✅ Success`);
        successCount++;
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      failCount++;
    }
  }

  console.log(`\n✅ Upload complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
}

async function main() {
  const imagePath = process.argv[2];
  
  let searchPaths = [];
  
  if (imagePath) {
    searchPaths.push(imagePath);
  } else {
    // Default search paths
    searchPaths = [
      join(__dirname, '..', 'src', 'assets', 'projects'),
      join(__dirname, '..', 'syracuse-images'),
      join(__dirname, '..', 'images', 'syracuse'),
    ];
  }

  let imageFiles = [];
  
  for (const searchPath of searchPaths) {
    console.log(`Searching in: ${searchPath}`);
    const files = await findImageFiles(searchPath);
    if (files.length > 0) {
      imageFiles = files;
      console.log(`Found ${files.length} images in ${searchPath}\n`);
      break;
    }
  }

  if (imageFiles.length === 0) {
    console.log('\n❌ No Syracuse images found.');
    console.log('\nPlease either:');
    console.log('  1. Place images in src/assets/projects/ with names like syracuse-1.jpg, syracuse-2.jpg, etc.');
    console.log('  2. Create a folder called "syracuse-images" in the project root');
    console.log('  3. Run: node scripts/upload-syracuse-images.js [path-to-your-images]');
    process.exit(1);
  }

  await uploadImages(imageFiles);
}

main().catch(console.error);

