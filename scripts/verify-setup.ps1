# PowerShell script to verify project setup

# Configuration
$projectPath = "C:\Projects\Synaptica"

# Function to check if a command exists
function Test-CommandExists {
    param (
        [string]$command
    )
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    } catch {
        return $false
    } finally {
        $ErrorActionPreference = $oldPreference
    }
}

# Verify required tools
Write-Host "Verifying required tools..."
$tools = @("node", "npm", "git", "vercel")
foreach ($tool in $tools) {
    if (Test-CommandExists $tool) {
        Write-Host "✓ $tool is installed"
    } else {
        Write-Host "✗ $tool is not installed"
    }
}

# Check project structure
Write-Host "`nVerifying project structure..."
$requiredFiles = @(
    "package.json",
    "next.config.js",
    "tsconfig.json",
    ".gitignore",
    "app",
    "components",
    "prisma"
)

Set-Location $projectPath
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists"
    } else {
        Write-Host "✗ $file is missing"
    }
}

# Check environment files
Write-Host "`nVerifying environment files..."
$envFiles = @(".env.production", ".env.local")
foreach ($envFile in $envFiles) {
    if (Test-Path $envFile) {
        Write-Host "✓ $envFile exists"
        # Check if file is readable
        try {
            Get-Content $envFile -ErrorAction Stop | Out-Null
            Write-Host "  ✓ File is readable"
        } catch {
            Write-Host "  ✗ File is not readable"
        }
    } else {
        Write-Host "✗ $envFile is missing"
    }
}

# Verify Git setup
Write-Host "`nVerifying Git setup..."
if (Test-Path ".git") {
    Write-Host "✓ Git repository initialized"
    git status | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Git is working correctly"
    } else {
        Write-Host "✗ Git is not working correctly"
    }
} else {
    Write-Host "✗ Git repository not initialized"
}

# Verify dependencies
Write-Host "`nVerifying dependencies..."
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules directory exists"
} else {
    Write-Host "✗ node_modules directory missing"
}

# Verify build
Write-Host "`nVerifying build process..."
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Build successful"
    } else {
        Write-Host "✗ Build failed"
    }
} catch {
    Write-Host "✗ Build failed with error: $_"
}

# Verify development server
Write-Host "`nVerifying development server..."
try {
    Start-Process npm -ArgumentList "run dev" -NoNewWindow
    Start-Sleep -Seconds 5
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Development server is running"
    } else {
        Write-Host "✗ Development server is not responding correctly"
    }
} catch {
    Write-Host "✗ Development server verification failed: $_"
}

Write-Host "`nVerification complete!" 