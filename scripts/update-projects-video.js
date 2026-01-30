
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_FILE = path.resolve(__dirname, '../src/data/projects.ts');
const MAPPING_FILE = path.resolve(__dirname, 'video-mapping.json');

if (!fs.existsSync(MAPPING_FILE)) {
    console.error('Mapping file not found.');
    process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
const urlMap = {};
mapping.forEach(item => {
    urlMap[item.fileName] = item.url;
});

let content = fs.readFileSync(PROJECTS_FILE, 'utf-8');

// Replace imports ending in .mov
const importRegex = /^import\s+(\w+)\s+from\s+["']@\/assets\/.*\/([^"']+\.mov)["'];?$/gm;

content = content.replace(importRegex, (match, varName, fileName) => {
    const baseName = path.basename(fileName);
    if (urlMap[baseName]) {
        return `const ${varName} = "${urlMap[baseName]}";`;
    }
    return match;
});

fs.writeFileSync(PROJECTS_FILE, content);
console.log('Updated projects.ts with Supabase Video URLs');
