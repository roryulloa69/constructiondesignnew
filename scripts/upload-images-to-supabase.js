
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env file manually
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        let val = value.trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        envVars[key.trim()] = val;
    }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Could not find valid Supabase credentials in .env file.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET_NAME = 'portfolio-images';
const ASSETS_DIR = path.resolve(__dirname, '../src/assets/projects');
const PUBLIC_IMAGES_DIR = path.resolve(__dirname, '../public/images');

function getFolder(filename) {
    const lowerName = filename.toLowerCase();

    if (lowerName.includes('pool') || lowerName.includes('cabana')) return 'hospitality-pool';
    if (lowerName.includes('miami')) return 'miami-beach';
    if (lowerName.includes('alpine')) return 'alpine-ranch';
    if (lowerName.includes('syracuse')) return 'syracuse';
    if (lowerName.includes('montana')) return 'montana';
    if (lowerName.includes('southcoast')) return 'southcoast';
    if (lowerName.includes('carmel-valley')) return 'carmel-valley';
    if (lowerName.includes('carmel-knolls')) return 'carmel-knolls';
    if (lowerName.includes('carmel')) return 'carmel-custom'; // Catch-all for other carmel
    if (lowerName.includes('north-florida')) return 'north-florida';
    if (lowerName.includes('development')) return 'development';
    if (lowerName.includes('abaco')) return 'abaco';
    if (lowerName.includes('civil')) return 'civil';
    if (lowerName.includes('cleanup')) return 'cleanup';
    if (lowerName.startsWith('pg-')) return 'pacific-grove';
    if (lowerName.includes('links')) return 'links';
    if (lowerName.includes('laguna')) return 'laguna';
    if (lowerName.includes('bigsur')) return 'bigsur';
    if (lowerName.includes('beachfront')) return 'beachfront';
    if (lowerName.includes('lds')) return 'lds';

    return 'misc';
}

async function uploadFile(filePath, fileName) {
    const folder = getFolder(fileName);
    const storagePath = `${folder}/${fileName}`;
    const fileBuffer = fs.readFileSync(filePath);

    // Check if file exists
    const { data: list } = await supabase.storage.from(BUCKET_NAME).list(folder, {
        limit: 1,
        search: fileName
    });

    if (list && list.length > 0) {
        console.log(`Skipping ${storagePath} (already exists)`);
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
        return { url: data.publicUrl, folder, fileName };
    }

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
            contentType: 'image/webp',
            upsert: true
        });

    if (error) {
        console.error(`Error uploading ${storagePath}:`, error.message);
        return null;
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    console.log(`Uploaded ${storagePath}`);
    return { url: publicUrlData.publicUrl, folder, fileName };
}

async function main() {
    console.log(`Starting upload to bucket: ${BUCKET_NAME}`);

    // Ensure bucket exists (same as before)
    const { data: buckets } = await supabase.storage.listBuckets();
    if (buckets) {
        const bucketExists = buckets.find(b => b.name === BUCKET_NAME);
        if (!bucketExists) {
            await supabase.storage.createBucket(BUCKET_NAME, { public: true });
        }
    }

    const uploadedFiles = [];

    // Process assets/projects
    if (fs.existsSync(ASSETS_DIR)) {
        const files = fs.readdirSync(ASSETS_DIR);
        for (const file of files) {
            if (file.match(/\.(webp|png|jpg|jpeg)$/i)) {
                const result = await uploadFile(path.join(ASSETS_DIR, file), file);
                if (result) uploadedFiles.push(result);
            }
        }
    }

    // Process public/images
    if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
        const files = fs.readdirSync(PUBLIC_IMAGES_DIR);
        for (const file of files) {
            if (file.match(/\.(webp|png|jpg|jpeg)$/i)) {
                const result = await uploadFile(path.join(PUBLIC_IMAGES_DIR, file), file);
                if (result) uploadedFiles.push(result);
            }
        }
    }

    // Write a mapping file to help us update projects.ts
    fs.writeFileSync(
        path.join(__dirname, 'image-mapping.json'),
        JSON.stringify(uploadedFiles, null, 2)
    );

    console.log('Upload complete! Mapping saved to scripts/image-mapping.json');
}

main();
