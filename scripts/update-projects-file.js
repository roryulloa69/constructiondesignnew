
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_FILE = path.resolve(__dirname, '../src/data/projects.ts');
const MAPPING_FILE = path.resolve(__dirname, 'image-mapping.json');

if (!fs.existsSync(MAPPING_FILE)) {
    console.error('Mapping file not found. Run upload-images-to-supabase.js first.');
    process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
// Create a map of filename -> url
// Note: We might have duplicate filenames in different folders (src/assets vs public), but our upload logic
// handled them by folder in Supabase.
// Ideally, the project file imports use unique variable names or paths.
// But the imports in projects.ts are mostly looking for specific file names.
// Let's rely on the fileName to resolve.
const urlMap = {};
mapping.forEach(item => {
    urlMap[item.fileName] = item.url;
});

let content = fs.readFileSync(PROJECTS_FILE, 'utf-8');

// 1. Remove all imports that point to image files
const importRegex = /^import\s+(\w+)\s+from\s+["']@\/assets\/.*\/([^"']+)["'];?$/gm;
// We need to capture the variable name and the filename to replace usages later.
// However, replacing imports is tricky because we want to define the variable as a string constant instead.

// Plan:
// 1. Find all image imports
// 2. Replace them with const declarations using the mapped URL.

let newContent = content.replace(importRegex, (match, varName, fileName) => {
    // Determine the actual filename from the path
    // The regex above captures the filename in group 2
    // But wait, the path might be complex: @/assets/projects/foo/bar.webp
    // My regex above assumes @/assets/.../filename

    // Let's assume filename is the base name
    const baseName = path.basename(fileName);

    if (urlMap[baseName]) {
        return `const ${varName} = "${urlMap[baseName]}";`;
    } else {
        // If not found in map, maybe it wasn't uploaded or has different extension?
        // Check for alternative extensions
        const nameWithoutExt = baseName.split('.')[0];
        const variants = Object.keys(urlMap).filter(k => k.startsWith(nameWithoutExt + '.'));
        if (variants.length > 0) {
            return `const ${varName} = "${urlMap[variants[0]]}";`;
        }

        console.warn(`Warning: No URL found for ${baseName} (${varName}). Keeping original import.`);
        return match;
    }
});

// Also handle the public/image ones if they were imported?
// projects.ts had: image: "/images/pool-sunset-lights.png"
// We should replace those string literals too.
// "image: "/images/..." -> "image: "https://..."

// Replace string literals starting with /images/
newContent = newContent.replace(/"\/images\/([^"]+)"/g, (match, fileName) => {
    if (urlMap[fileName]) {
        return `"${urlMap[fileName]}"`;
    }
    return match;
});

// Write result
fs.writeFileSync(PROJECTS_FILE, newContent);
console.log('Updated projects.ts with Supabase URLs');
