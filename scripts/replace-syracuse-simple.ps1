# Simple script to replace Syracuse images
# Usage: Place new images in a folder, then run this script

param(
    [string]$SourceFolder = "C:\Users\roryu\Downloads"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Syracuse Image Replacement ===" -ForegroundColor Cyan
Write-Host ""

# Get project root
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$targetDir = Join-Path $projectRoot "src\assets\projects"

# Find image files in source folder
Write-Host "Looking for images in: $SourceFolder" -ForegroundColor Yellow
$sourceImages = Get-ChildItem -Path $SourceFolder -File | 
    Where-Object { $_.Extension -match '\.(jpg|jpeg|png|JPG|JPEG|PNG)$' } | 
    Sort-Object Name

if ($sourceImages.Count -eq 0) {
    Write-Host "ERROR: No images found in $SourceFolder" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Download images from Dropbox"
    Write-Host "2. Place them in: $SourceFolder"
    Write-Host "3. Run this script again"
    exit 1
}

Write-Host "Found $($sourceImages.Count) images" -ForegroundColor Green
Write-Host ""

# Get existing Syracuse images
$existingImages = Get-ChildItem -Path $targetDir -Filter "syracuse-*.jpg" | 
    Sort-Object { 
        $num = ($_.BaseName -replace 'syracuse-', '')
        if ($num -match '^\d+$') { [int]$num } else { 999999 }
    }

Write-Host "Found $($existingImages.Count) existing Syracuse images" -ForegroundColor Green
Write-Host ""

# Backup
Write-Host "Creating backup..." -ForegroundColor Yellow
$backupDir = Join-Path $targetDir "syracuse-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

foreach ($img in $existingImages) {
    Copy-Item $img.FullName -Destination (Join-Path $backupDir $img.Name) -Force
}
Write-Host "[OK] Backup created" -ForegroundColor Green
Write-Host ""

# Replace in order
Write-Host "Replacing images..." -ForegroundColor Yellow
$replaceCount = [Math]::Min($sourceImages.Count, $existingImages.Count)

for ($i = 0; $i -lt $replaceCount; $i++) {
    $sourceImage = $sourceImages[$i]
    $targetImage = $existingImages[$i]
    
    Write-Host "  [$($i+1)/$replaceCount] $($targetImage.Name)"
    Copy-Item $sourceImage.FullName -Destination $targetImage.FullName -Force
}

Write-Host ""
Write-Host "[SUCCESS] Replaced $replaceCount images!" -ForegroundColor Green
Write-Host "Backup: $backupDir"

