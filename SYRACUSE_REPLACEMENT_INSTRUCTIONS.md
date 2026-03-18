# Syracuse Image Replacement Instructions

## Quick Start

To replace all Syracuse project images with new ones from Dropbox:

1. **Download the images:**
   - Open this link in your browser: https://www.dropbox.com/scl/fo/jzboudbve00fw3opezjcc/AM1AcPqWQYrKsytyiFnMaeU?rlkey=slfwaqylh90a9y3f0q4zm9cuh&st=vi4waawx&dl=0
   - Select all images (Ctrl+A or Cmd+A)
   - Click "Download"
   - Save to: `C:\Users\roryu\Downloads\syracuse-new`

2. **Run the replacement script:**
   ```powershell
   .\scripts\replace-syracuse-images.ps1
   ```

The script will:
- ✅ Create a backup of existing images
- ✅ Replace images in the correct order (maintaining syracuse-1.jpg, syracuse-2.jpg, etc.)
- ✅ Preserve the original file names and structure

## What Gets Replaced

The script replaces all existing Syracuse images (syracuse-1.jpg through syracuse-46.jpg) with the new images from Dropbox, maintaining the exact order they appear in the Dropbox folder.

## Backup

All original images are automatically backed up to:
`src/assets/projects/syracuse-backup-[timestamp]/`

## Notes

- Images are replaced in the order they appear in the Dropbox folder
- The script maintains the existing naming convention (syracuse-1.jpg, syracuse-2.jpg, etc.)
- If you have more new images than existing ones, you may need to update `src/data/projects.ts` to include them

