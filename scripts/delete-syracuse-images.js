/**
 * Script to delete all Syracuse project images from Supabase storage and database
 * Run this with: node scripts/delete-syracuse-images.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const PROJECT_ID = 'syracuse-house';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllSyracuseImages() {
  console.log('Starting deletion of all Syracuse images...');

  try {
    // Fetch all database images for Syracuse
    const { data: images, error: fetchError } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', PROJECT_ID);

    if (fetchError) {
      throw fetchError;
    }

    if (!images || images.length === 0) {
      console.log('No database images found to delete.');
      return;
    }

    console.log(`Found ${images.length} images in database`);

    // Delete from Supabase storage
    const filesToDelete = images
      .map(img => {
        // Extract path from URL
        const urlParts = img.image_url.split('/');
        const pathIndex = urlParts.findIndex(part => part === PROJECT_ID);
        if (pathIndex !== -1) {
          return urlParts.slice(pathIndex).join('/');
        }
        // Fallback: try to extract filename
        const fileName = urlParts[urlParts.length - 1];
        return `${PROJECT_ID}/${fileName}`;
      })
      .filter(path => path.includes(PROJECT_ID));

    console.log(`Attempting to delete ${filesToDelete.length} files from storage...`);

    if (filesToDelete.length > 0) {
      // Delete files in batches
      const batchSize = 100;
      for (let i = 0; i < filesToDelete.length; i += batchSize) {
        const batch = filesToDelete.slice(i, i + batchSize);
        const { error: storageError } = await supabase.storage
          .from('project-images')
          .remove(batch);

        if (storageError) {
          console.error(`Error deleting batch ${i / batchSize + 1}:`, storageError);
        } else {
          console.log(`Deleted batch ${i / batchSize + 1} (${batch.length} files)`);
        }
      }
    }

    // Delete from database
    console.log('Deleting images from database...');
    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .eq('project_id', PROJECT_ID);

    if (deleteError) {
      throw deleteError;
    }

    console.log(`Successfully deleted ${images.length} images from database and storage!`);
  } catch (error) {
    console.error('Error deleting images:', error);
    process.exit(1);
  }
}

deleteAllSyracuseImages();

