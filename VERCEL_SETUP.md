# Vercel Setup Guide

## Current Configuration

**GitHub Repository**: `https://github.com/rulloa1/constructiondesignnew-e33525f5.git`  
**Custom Domain**: `mcdesign.bio`  
**Project**: `constructiondesignnew-e33525f5`

## Quick Setup Steps

### Option 1: Connect via Vercel Dashboard (Recommended)

1. **Visit Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import from GitHub: `rulloa1/constructiondesignnew-e33525f5`
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Vite (or Auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Custom Domain**
   - Go to **Settings** → **Domains**
   - Add: `mcdesign.bio`
   - Follow DNS configuration instructions

5. **Verify Auto-Deploy**
   - Go to **Settings** → **Git**
   - Ensure **Production Branch** is: `main`
   - Ensure **Auto-deploy** is enabled

### Option 2: Connect via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link Project**:
   ```bash
   vercel link
   ```
   - Select your existing project or create a new one
   - Follow the prompts

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## Verify Connection

### Check GitHub Integration
1. Go to Vercel Dashboard → Your Project → **Settings** → **Git**
2. Should show: `rulloa1/constructiondesignnew-e33525f5`
3. Production Branch: `main`

### Check Domain
1. Go to **Settings** → **Domains**
2. Should show: `mcdesign.bio` with ✅ status
3. If not configured, add it and follow DNS setup

### Test Deployment
1. Make a small change
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Check Vercel Dashboard → **Deployments**
4. Should see a new deployment starting automatically

## Troubleshooting

### Project Not Found
- Go to https://vercel.com/dashboard
- Click "Add New..." → "Project"
- Import from GitHub

### Domain Not Working
- Check DNS settings at your domain registrar
- Ensure DNS points to Vercel (check Vercel dashboard for exact values)
- Wait 24-48 hours for DNS propagation

### Auto-Deploy Not Working
- Check Vercel → Settings → Git
- Verify webhook in GitHub: Settings → Webhooks
- Should see a Vercel webhook URL

## Current Configuration Files

- `vercel.json` - Vercel configuration (SPA rewrite rules)
- `.github/workflows/deploy-check.yml` - GitHub Actions for build verification

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View project info
vercel inspect

# List deployments
vercel ls

# Check domain
vercel domains ls
```

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/rulloa1/constructiondesignnew-e33525f5

