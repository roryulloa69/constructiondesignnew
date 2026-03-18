# Deployment Guide for mcdesign.bio

## Current Setup

Your portfolio is configured for deployment on **Vercel** with the custom domain **mcdesign.bio**.

## How Automatic Deployment Works

### ✅ If Vercel is Connected to GitHub (Recommended)

1. **Make changes locally** in your code
2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
3. **Push to GitHub**:
   ```bash
   git push origin main
   ```
4. **Vercel automatically detects** the push and deploys (usually 1-3 minutes)
5. **Changes appear on www.mcdesign.bio** automatically

### Current Status Check

To verify your Vercel integration is working:

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project (should be linked to `constructiondesignnew-e33525f5`)
3. Check **Settings → Git** to confirm GitHub repository is connected
4. Check **Settings → Domains** to verify `mcdesign.bio` is connected
5. Check **Deployments** tab to see recent deployments

## Manual Deployment (If Needed)

If automatic deployment isn't working, you can deploy manually:

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Deploy via Vercel CLI** (if installed):
   ```bash
   npx vercel --prod
   ```

3. **Or deploy via Vercel Dashboard**:
   - Go to your project on Vercel
   - Click "Deployments" → "Redeploy" → "Use Existing Build" or "Create New Build"

## Troubleshooting

### Changes not appearing on website?

1. **Check if you pushed to GitHub**:
   ```bash
   git status
   git log --oneline -1
   ```

2. **Verify Vercel deployment status**:
   - Check Vercel dashboard for deployment errors
   - Look for build logs in the deployment details

3. **Check domain configuration**:
   - Ensure `mcdesign.bio` is properly configured in Vercel
   - DNS settings should point to Vercel

4. **Clear browser cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Build Errors?

- Check Vercel build logs for specific errors
- Test build locally: `npm run build`
- Ensure all dependencies are in `package.json`

## Quick Deployment Checklist

Before pushing changes:
- [ ] Test changes locally: `npm run dev`
- [ ] Check for linting errors: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] Commit changes with descriptive message
- [ ] Push to GitHub: `git push origin main`
- [ ] Monitor Vercel dashboard for deployment status

## Environment Variables

If you need environment variables (API keys, etc.):
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy after adding variables

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Repository**: https://github.com/rulloa1/constructiondesignnew-e33525f5.git
- **Lovable Project**: https://lovable.dev/projects/8d70aad7-b565-42e6-bddf-8ea85bfd9f37

