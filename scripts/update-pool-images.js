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
  console.error('And provide service role key as: node scripts/update-pool-images.js [service-role-key]');
  process.exit(1);
}

console.log(`Connecting to Supabase: ${supabaseUrl}`);
console.log(`Using key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Pool design images in order (matching projects.ts)
const poolImages = [
  { path: '/assets/projects/pool-design-cover.jpg', title: 'Pool Design Cover', order: 0 },
  { path: '/assets/projects/pool-design-1.jpg', title: 'Pool Design 1', order: 1 },
  { path: '/assets/projects/pool-design-2.jpg', title: 'Pool Design 2', order: 2 },
  { path: '/assets/projects/pool-design-3.jpg', title: 'Pool Design 3', order: 3 },
  { path: '/assets/projects/pool-design-4.jpg', title: 'Pool Design 4', order: 4 },
  { path: '/assets/projects/pool-design-5.jpg', title: 'Pool Design 5', order: 5 },
  { path: '/assets/projects/pool-design-6.jpg', title: 'Pool Design 6', order: 6 },
  { path: '/assets/projects/pool-design-7.jpg', title: 'Pool Design 7', order: 7 },
  { path: '/assets/projects/pool-design-8.jpg', title: 'Pool Design 8', order: 8 },
  { path: '/assets/projects/pool-design-9.jpg', title: 'Pool Design 9', order: 9 },
  { path: '/assets/projects/pool-design-10.jpg', title: 'Pool Design 10', order: 10 },
  { path: '/assets/projects/pool-design-11.jpg', title: 'Pool Design 11', order: 11 },
  { path: '/assets/projects/pool-design-12.jpg', title: 'Pool Design 12', order: 12 },
  { path: '/assets/projects/pool-design-13.jpg', title: 'Pool Design 13', order: 13 },
  { path: '/assets/projects/pool-design-14.jpg', title: 'Pool Design 14', order: 14 },
  { path: '/assets/projects/pool-design-15.jpg', title: 'Pool Design 15', order: 15 },
  { path: '/assets/projects/pool-design-16.jpg', title: 'Pool Design 16', order: 16 },
  { path: '/assets/projects/pool-design-17.jpg', title: 'Pool Design 17', order: 17 },
  { path: '/assets/projects/pool-design-18.jpg', title: 'Pool Design 18', order: 18 },
  { path: '/assets/projects/pool-design-19.jpg', title: 'Pool Design 19', order: 19 },
  { path: '/assets/projects/pool-design-20.jpg', title: 'Pool Design 20', order: 20 },
  { path: '/assets/projects/pool-design-21.jpg', title: 'Pool Design 21', order: 21 },
  { path: '/assets/projects/pool-design-22.jpg', title: 'Pool Design 22', order: 22 },
  { path: '/assets/projects/pool-design-23.jpg', title: 'Pool Design 23', order: 23 },
  { path: '/assets/projects/pool-design-24.jpg', title: 'Pool Design 24', order: 24 },
  { path: '/assets/projects/pool-design-25.jpg', title: 'Pool Design 25', order: 25 },
  { path: '/assets/projects/pool-design-26.jpg', title: 'Pool Design 26', order: 26 },
  { path: '/assets/projects/pool-design-27.jpg', title: 'Pool Design 27', order: 27 },
  { path: '/assets/projects/pool-design-28.jpg', title: 'Pool Design 28', order: 28 },
  { path: '/assets/projects/pool-design-29.jpg', title: 'Pool Design 29', order: 29 },
  { path: '/assets/projects/pool-design-30.jpg', title: 'Pool Design 30', order: 30 },
  { path: '/assets/projects/pool-design-31.jpg', title: 'Pool Design 31', order: 31 },
  { path: '/assets/projects/pool-design-32.jpg', title: 'Pool Design 32', order: 32 },
  { path: '/assets/projects/pool-design-33.jpg', title: 'Pool Design 33', order: 33 },
  { path: '/assets/projects/pool-design-34.jpg', title: 'Pool Design 34', order: 34 },
  { path: '/assets/projects/pool-design-35.jpg', title: 'Pool Design 35', order: 35 },
  { path: '/assets/projects/pool-design-36.jpg', title: 'Pool Design 36', order: 36 },
  { path: '/assets/projects/pool-design-37.jpg', title: 'Pool Design 37', order: 37 },
  { path: '/assets/pool-testimonial.jpg', title: 'Pool Testimonial', order: 38 },
];

async function updatePoolImages() {
  console.log(`\nUpdating pool images for project: ${PROJECT_ID}\n`);

  // First, get existing images
  const { data: existingImages, error: fetchError } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .order('display_order', { ascending: true });

  if (fetchError) {
    console.error('Error fetching existing images:', fetchError.message);
    return;
  }

  console.log(`Found ${existingImages?.length || 0} existing images in database`);

  let updatedCount = 0;
  let createdCount = 0;
  let errorCount = 0;

  // Update or create each image
  for (let i = 0; i < poolImages.length; i++) {
    const img = poolImages[i];
    const existing = existingImages?.find(img => img.display_order === i);

    try {
      if (existing) {
        // Update existing image
        const { error: updateError } = await supabase
          .from('project_images')
          .update({
            image_url: img.path,
            title: img.title,
            display_order: img.order,
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error(`  ❌ Failed to update image ${i + 1} (${img.title}):`, updateError.message);
          errorCount++;
        } else {
          console.log(`  ✅ Updated image ${i + 1}: ${img.title}`);
          updatedCount++;
        }
      } else {
        // Create new image
        const { error: insertError } = await supabase
          .from('project_images')
          .insert({
            project_id: PROJECT_ID,
            image_url: img.path,
            title: img.title,
            display_order: img.order,
            is_before: false,
            is_after: false,
          });

        if (insertError) {
          console.error(`  ❌ Failed to create image ${i + 1} (${img.title}):`, insertError.message);
          errorCount++;
        } else {
          console.log(`  ✅ Created image ${i + 1}: ${img.title}`);
          createdCount++;
        }
      }
    } catch (error) {
      console.error(`  ❌ Error processing image ${i + 1}:`, error.message);
      errorCount++;
    }
  }

  // Delete any extra images that shouldn't be there
  if (existingImages && existingImages.length > poolImages.length) {
    const extraImages = existingImages.slice(poolImages.length);
    console.log(`\nFound ${extraImages.length} extra images to delete...`);
    
    for (const extra of extraImages) {
      const { error: deleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('id', extra.id);

      if (deleteError) {
        console.error(`  ❌ Failed to delete extra image:`, deleteError.message);
      } else {
        console.log(`  ✅ Deleted extra image: ${extra.title || extra.id}`);
      }
    }
  }

  console.log(`\n✅ Update complete!`);
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Created: ${createdCount}`);
  console.log(`   Errors: ${errorCount}`);
}

updatePoolImages().catch(console.error);

