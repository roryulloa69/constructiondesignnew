# Complete script to replace Syracuse images
# This script will guide you through downloading and replacing images

param(
    [string]$SourceFolder = $null
)

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Syracuse Image Replacement Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get project root - use absolute path
$projectRoot = "C:\Users\roryu\OneDrive\Desktop\Portfolio\constructiondesignnew-e33525f5"
$targetDir = Join-Path $projectRoot "src\assets\projects"

# Verify path exists
if (-not (Test-Path $targetDir)) {
    Write-Host "ERROR: Target directory not found: $targetDir" -ForegroundColor Red
    exit 1
}
$dropboxUrl = "https://www.dropbox.com/scl/fo/jzboudbve00fw3opezjcc/AM1AcPqWQYrKsytyiFnMaeU?rlkey=slfwaqylh90a9y3f0q4zm9cuh&st=vi4waawx&dl=0"

# If source folder not provided, use default
if (-not $SourceFolder) {
    $SourceFolder = "C:\Users\roryu\Downloads\syracuse-new"
}

Write-Host "Step 1: Preparing..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $SourceFolder -Force | Out-Null

# Check if images already exist - sort numerically by extracting number from filename
$sourceImages = Get-ChildItem -Path $SourceFolder -File -ErrorAction SilentlyContinue | 
    Where-Object { $_.Extension -match '\.(jpg|jpeg|png|JPG|JPEG|PNG)$' } | 
    Sort-Object { 
        # Extract number from filename like "syracuse1 (1).jpg" -> 1
        if ($_.Name -match '\((\d+)\)') {
            [int]$matches[1]
        } elseif ($_.Name -match '(\d+)') {
            [int]$matches[1]
        } else {
            999999
        }
    }

if ($sourceImages.Count -eq 0) {
    Write-Host ""
    Write-Host "No images found in: $SourceFolder" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please download the images from Dropbox:" -ForegroundColor Cyan
    Write-Host "1. Opening Dropbox link in your browser..." -ForegroundColor Yellow
    Start-Process $dropboxUrl
    Write-Host ""
    Write-Host "2. In the browser:" -ForegroundColor Yellow
    Write-Host "   - Select all images (Ctrl+A or Cmd+A)"
    Write-Host "   - Click 'Download'"
    Write-Host "   - Save to: $SourceFolder" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Once downloaded, press Enter to continue..." -ForegroundColor Yellow
    Read-Host
    
    # Check again - sort numerically by extracting number from filename
    $sourceImages = Get-ChildItem -Path $SourceFolder -File -ErrorAction SilentlyContinue | 
        Where-Object { $_.Extension -match '\.(jpg|jpeg|png|JPG|JPEG|PNG)$' } | 
        Sort-Object { 
            # Extract number from filename like "syracuse1 (1).jpg" -> 1
            if ($_.Name -match '\((\d+)\)') {
                [int]$matches[1]
            } elseif ($_.Name -match '(\d+)') {
                [int]$matches[1]
            } else {
                999999
            }
        }
    
    if ($sourceImages.Count -eq 0) {
        Write-Host ""
        Write-Host "ERROR: Still no images found in $SourceFolder" -ForegroundColor Red
        Write-Host "Please ensure images are downloaded and try again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Found $($sourceImages.Count) images to use" -ForegroundColor Green
Write-Host ""

# Get existing Syracuse images
Write-Host "Step 2: Finding existing Syracuse images..." -ForegroundColor Yellow
$existingImages = Get-ChildItem -Path $targetDir -Filter "syracuse-*.jpg" | 
    Sort-Object { 
        $num = ($_.BaseName -replace 'syracuse-', '')
        if ($num -match '^\d+$') { [int]$num } else { 999999 }
    }

Write-Host "Found $($existingImages.Count) existing images" -ForegroundColor Green
Write-Host ""

if ($existingImages.Count -eq 0) {
    Write-Host "ERROR: No existing Syracuse images found!" -ForegroundColor Red
    exit 1
}

# Backup
Write-Host "Step 3: Creating backup..." -ForegroundColor Yellow
$backupDir = Join-Path $targetDir "syracuse-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

foreach ($img in $existingImages) {
    Copy-Item $img.FullName -Destination (Join-Path $backupDir $img.Name) -Force
}
Write-Host "[OK] Backup created at: $backupDir" -ForegroundColor Green
Write-Host ""

# Replace in order
Write-Host "Step 4: Replacing images (maintaining order)..." -ForegroundColor Yellow
$replaceCount = [Math]::Min($sourceImages.Count, $existingImages.Count)

Write-Host ""
for ($i = 0; $i -lt $replaceCount; $i++) {
    $sourceImage = $sourceImages[$i]
    $targetImage = $existingImages[$i]
    
    Write-Host "  [$($i+1)/$replaceCount] $($targetImage.Name) <- $($sourceImage.Name)" -ForegroundColor Gray
    Copy-Item $sourceImage.FullName -Destination $targetImage.FullName -Force
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Replaced $replaceCount images" -ForegroundColor Green
Write-Host "Backup saved to: $backupDir" -ForegroundColor Cyan

if ($sourceImages.Count -gt $existingImages.Count) {
    $extraCount = $sourceImages.Count - $existingImages.Count
    Write-Host ""
    Write-Host "Note: $extraCount additional images were not used." -ForegroundColor Yellow
    Write-Host "      You may need to add them manually to the project." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Images have been replaced while maintaining the original order." -ForegroundColor Cyan
Write-Host ""
