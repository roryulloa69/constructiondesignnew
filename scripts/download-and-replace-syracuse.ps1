# Script to download Syracuse images from Dropbox and replace existing ones
param(
    [string]$DropboxUrl = "https://www.dropbox.com/scl/fo/jzboudbve00fw3opezjcc/AM1AcPqWQYrKsytyiFnMaeU?rlkey=slfwaqylh90a9y3f0q4zm9cuh&st=vi4waawx&dl=1"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Syracuse Image Replacement Script ===" -ForegroundColor Cyan
Write-Host ""

# Get project root
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$targetDir = Join-Path $projectRoot "src\assets\projects"
$tempDir = Join-Path $env:TEMP "syracuse-download-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$zipFile = Join-Path $tempDir "syracuse-images.zip"

# Create temp directory
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    Write-Host "Step 1: Downloading images from Dropbox..." -ForegroundColor Yellow
    
    # Try to download as ZIP (Dropbox folder links with dl=1 should download as ZIP)
    try {
        $response = Invoke-WebRequest -Uri $DropboxUrl -OutFile $zipFile -UseBasicParsing
        Write-Host "  [OK] Downloaded ZIP file" -ForegroundColor Green
        
        # Extract ZIP
        Write-Host "Step 2: Extracting images..." -ForegroundColor Yellow
        $extractDir = Join-Path $tempDir "extracted"
        Expand-Archive -Path $zipFile -DestinationPath $extractDir -Force
        Write-Host "  [OK] Extracted images" -ForegroundColor Green
        
        # Find all images in extracted folder (may be in subdirectories)
        $sourceImages = Get-ChildItem -Path $extractDir -Recurse -File | 
            Where-Object { $_.Extension -match '\.(jpg|jpeg|png|JPG|JPEG|PNG)$' } | 
            Sort-Object Name
        
    } catch {
        Write-Host "  [WARNING] Could not download directly from Dropbox" -ForegroundColor Yellow
        Write-Host "  Please download the images manually:" -ForegroundColor Yellow
        Write-Host "  1. Open: $DropboxUrl" -ForegroundColor Cyan
        Write-Host "  2. Download all images"
        Write-Host "  3. Place them in: $tempDir" -ForegroundColor Cyan
        Write-Host "  4. Press Enter when done..."
        Read-Host
        
        $sourceImages = Get-ChildItem -Path $tempDir -File | 
            Where-Object { $_.Extension -match '\.(jpg|jpeg|png|JPG|JPEG|PNG)$' } | 
            Sort-Object Name
    }
    
    if ($sourceImages.Count -eq 0) {
        Write-Host "ERROR: No images found!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  Found $($sourceImages.Count) images" -ForegroundColor Green
    Write-Host ""
    
    # Get existing Syracuse images
    Write-Host "Step 3: Finding existing Syracuse images..." -ForegroundColor Yellow
    $existingImages = Get-ChildItem -Path $targetDir -Filter "syracuse-*.jpg" | 
        Sort-Object { 
            $num = ($_.BaseName -replace 'syracuse-', '')
            if ($num -match '^\d+$') { [int]$num } else { 999999 }
        }
    
    Write-Host "  Found $($existingImages.Count) existing images" -ForegroundColor Green
    Write-Host ""
    
    # Backup existing images
    Write-Host "Step 4: Backing up existing images..." -ForegroundColor Yellow
    $backupDir = Join-Path $targetDir "syracuse-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    foreach ($img in $existingImages) {
        Copy-Item $img.FullName -Destination (Join-Path $backupDir $img.Name) -Force
    }
    Write-Host "  [OK] Backup created: $backupDir" -ForegroundColor Green
    Write-Host ""
    
    # Replace images in order
    Write-Host "Step 5: Replacing images (maintaining order)..." -ForegroundColor Yellow
    $replaceCount = [Math]::Min($sourceImages.Count, $existingImages.Count)
    
    for ($i = 0; $i -lt $replaceCount; $i++) {
        $sourceImage = $sourceImages[$i]
        $targetImage = $existingImages[$i]
        
        Write-Host "  [$($i+1)/$replaceCount] $($targetImage.Name) <- $($sourceImage.Name)"
        
        # Copy the new image, preserving the target filename
        Copy-Item $sourceImage.FullName -Destination $targetImage.FullName -Force
    }
    
    Write-Host ""
    Write-Host "[SUCCESS] Successfully replaced $replaceCount images!" -ForegroundColor Green
    
    # Handle extra images
    if ($sourceImages.Count -gt $existingImages.Count) {
        $extraCount = $sourceImages.Count - $existingImages.Count
        Write-Host ""
        Write-Host "WARNING: There are $extraCount additional images that were not replaced." -ForegroundColor Yellow
        Write-Host "   You may need to add them manually or update the project configuration."
    }
    
    Write-Host ""
    Write-Host "=== Replacement Complete ===" -ForegroundColor Cyan
    Write-Host "Images have been replaced while maintaining the original order."
    Write-Host "Backup saved to: $backupDir"
    
} finally {
    # Cleanup temp directory
    if (Test-Path $tempDir) {
        Write-Host ""
        Write-Host "Cleaning up temporary files..." -ForegroundColor DarkGray
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
