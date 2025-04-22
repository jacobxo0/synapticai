# PowerShell script to clean up and reorganize project

# Configuration
$sourcePath = "C:\Users\Jnkri\OneDrive\Skrivebord\Agentprojects"
$targetPath = "C:\Projects\Synaptica"
$envFiles = @(".env", ".env.local", ".env.production")

# Create target directory if it doesn't exist
if (-not (Test-Path $targetPath)) {
    New-Item -ItemType Directory -Path $targetPath
}

# Function to remove read-only attributes
function Remove-ReadOnlyAttribute {
    param (
        [string]$Path
    )
    Get-ChildItem -Path $Path -Recurse | ForEach-Object {
        if ($_.Attributes -band [System.IO.FileAttributes]::ReadOnly) {
            $_.Attributes = $_.Attributes -band -bnot [System.IO.FileAttributes]::ReadOnly
        }
    }
}

# Copy project files (excluding build artifacts)
Write-Host "Copying project files..."
Get-ChildItem -Path $sourcePath -Exclude @("node_modules", ".next", ".vercel", "*.tsbuildinfo") | 
    Copy-Item -Destination $targetPath -Recurse -Force

# Remove read-only attributes
Write-Host "Removing read-only attributes..."
Remove-ReadOnlyAttribute -Path $targetPath

# Clean up environment files
Write-Host "Cleaning up environment files..."
foreach ($envFile in $envFiles) {
    $envPath = Join-Path $targetPath $envFile
    if (Test-Path $envPath) {
        Remove-Item $envPath -Force
    }
}

# Initialize new Git repository
Write-Host "Initializing new Git repository..."
Set-Location $targetPath
Remove-Item -Path ".git" -Recurse -Force -ErrorAction SilentlyContinue
git init

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Pull environment variables from Vercel
Write-Host "Pulling environment variables from Vercel..."
vercel env pull .env.production

# Create .env.local from .env.production
Copy-Item ".env.production" ".env.local"

# Verify setup
Write-Host "Verifying setup..."
npm run build

Write-Host "Cleanup complete! Project is now in $targetPath"
Write-Host "Next steps:"
Write-Host "1. Review and update .env.local with any local-specific settings"
Write-Host "2. Run 'npm run dev' to verify local development"
Write-Host "3. Commit your changes to Git"
Write-Host "4. Deploy to Vercel using 'vercel deploy --prod'" 