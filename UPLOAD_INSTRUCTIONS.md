# Upload Syracuse Images - Instructions

## Option 1: Using Admin Panel (Recommended - Easiest)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Admin Panel:**
   - Go to `http://localhost:5173/admin` (or your dev server URL)
   - Log in if needed

3. **Upload Images:**
   - Scroll to "Image Gallery Manager"
   - Select "Syracuse House" from the project dropdown
   - Click the upload area (or drag & drop)
   - Select all 49 images from: `C:\Dropbox\Portfolio Photos\syracuse`
   - Wait for upload to complete

## Option 2: Using Script (Requires Service Role Key)

If you want to use the script, you'll need your Supabase Service Role Key:

1. Get your Service Role Key from Supabase Dashboard:
   - Go to Project Settings → API
   - Copy the "service_role" key (NOT the anon key)

2. Update the script to use service role key, or run:
   ```bash
   VITE_SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" node scripts/upload-syracuse-images.js "C:\Dropbox\Portfolio Photos\syracuse"
   ```

**Note:** The service role key has full admin access - keep it secure and never commit it to git!

## Current Status

- ✅ Script created and ready
- ✅ Found 49 images in `C:\Dropbox\Portfolio Photos\syracuse`
- ❌ Script needs admin authentication (use Option 1 or provide service role key)

