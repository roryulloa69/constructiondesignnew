
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
const BUCKET_NAME = 'portfolio-images'; // We will use the same bucket for simplicity, or could make a 'videos' one.
// Let's stick to 'portfolio-images' but put it in a 'videos' folder for organization.
const VIDEO_DIR = path.resolve(__dirname, '../src/assets/projects');

async function uploadFile(filePath, fileName) {
    const storagePath = `videos/${fileName}`;
    const fileBuffer = fs.readFileSync(filePath);

    // Check if file exists
    const { data: list } = await supabase.storage.from(BUCKET_NAME).list('videos', {
        limit: 1,
        search: fileName
    });

    if (list && list.length > 0) {
        console.log(`Skipping ${storagePath} (already exists)`);
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
        return { url: data.publicUrl, fileName };
    }

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
            contentType: 'video/quicktime', // .mov is quicktime usually
            upsert: true
        });

    if (error) {
        console.error(`Error uploading ${storagePath}:`, error.message);
        return null;
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    console.log(`Uploaded ${storagePath}`);
    return { url: publicUrlData.publicUrl, fileName };
}

async function main() {
    console.log(`Starting video upload to bucket: ${BUCKET_NAME}`);

    const uploadedFiles = [];

    // Process assets/projects for .mov files
    if (fs.existsSync(VIDEO_DIR)) {
        const files = fs.readdirSync(VIDEO_DIR);
        for (const file of files) {
            if (file.match(/\.(mov|mp4|webm)$/i)) {
                const result = await uploadFile(path.join(VIDEO_DIR, file), file);
                if (result) uploadedFiles.push(result);
            }
        }
    }

    // Write mapping
    fs.writeFileSync(
        path.join(__dirname, 'video-mapping.json'),
        JSON.stringify(uploadedFiles, null, 2)
    );

    console.log('Video upload complete! Mapping saved to scripts/video-mapping.json');
}

main();
