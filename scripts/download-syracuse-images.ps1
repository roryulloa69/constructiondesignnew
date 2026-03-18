# Script to download Syracuse images from Dropbox and replace existing ones
param(
    [string]$DropboxUrl = "https://www.dropbox.com/scl/fo/jzboudbve00fw3opezjcc/AM1AcPqWQYrKsytyiFnMaeU?rlkey=slfwaqylh90a9y3f0q4zm9cuh&st=vi4waawx&dl=1",
    [string]$OutputDir = "C:\Users\roryu\Downloads\syracuse-new"
)

Write-Host "Downloading Syracuse images from Dropbox..."
Write-Host "Note: Dropbox folder downloads may require manual download."
Write-Host "Please download the images manually and place them in: $OutputDir"
Write-Host ""
Write-Host "After downloading, run the replacement script."

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "Created directory: $OutputDir"
}

Write-Host ""
Write-Host "To download manually:"
Write-Host "1. Open the Dropbox link in your browser"
Write-Host "2. Select all images"
Write-Host "3. Download them to: $OutputDir"
Write-Host "4. Ensure images are named in order (e.g., image1.jpg, image2.jpg, etc.)"

