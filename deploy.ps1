# Quick Deployment Script for Windows PowerShell
# This script helps you deploy changes to mcdesign.bio

Write-Host "🚀 Deployment Helper for mcdesign.bio" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
    exit 1
}

# Show current status
Write-Host "📊 Current Git Status:" -ForegroundColor Yellow
git status --short

Write-Host ""
$hasChanges = git diff --quiet --exit-code 2>$null; if ($LASTEXITCODE -ne 0) { $hasChanges = $true } else { $hasChanges = $false }
$hasUnstaged = git diff --quiet 2>$null; if ($LASTEXITCODE -ne 0) { $hasUnstaged = $true } else { $hasUnstaged = $false }

if (-not $hasUnstaged -and -not (git diff --cached --quiet 2>$null)) {
    Write-Host "✅ You have staged changes ready to commit" -ForegroundColor Green
} elseif ($hasUnstaged) {
    Write-Host "⚠️  You have uncommitted changes" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  No uncommitted changes" -ForegroundColor Blue
}

Write-Host ""
Write-Host "📝 Steps to deploy:" -ForegroundColor Cyan
Write-Host "1. Stage changes: git add ." -ForegroundColor White
Write-Host "2. Commit changes: git commit -m 'Your message'" -ForegroundColor White
Write-Host "3. Push to GitHub: git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "✨ Vercel will automatically deploy once you push to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Check deployment status:" -ForegroundColor Cyan
Write-Host "   Visit: https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""

# Ask if user wants to proceed
$response = Read-Host "Do you want to test the build locally first? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "🔨 Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful! Ready to deploy." -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed. Please fix errors before deploying." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "💡 Tip: Run 'git status' to see what changes need to be committed" -ForegroundColor Cyan

