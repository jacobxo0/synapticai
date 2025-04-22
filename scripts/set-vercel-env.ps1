# Project configuration
$projectId = "prj_fa8FqZhRiO8SVUeU4uCC5DzhtVdC"
$projectName = "synapticai"

# Required environment variables
$envVars = @{
    "NEXTAUTH_URL" = "https://synapticai.vercel.app"
    "NEXTAUTH_SECRET" = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))
    "GITHUB_ID" = "your-github-oauth-id"
    "GITHUB_SECRET" = "your-github-oauth-secret"
    "DATABASE_URL" = "your-production-postgresql-url"
    "REDIS_URL" = "your-production-redis-url"
    "REDIS_TOKEN" = "your-redis-token"
    "NEXT_PUBLIC_CLAUDE_API_KEY" = "your-claude-api-key"
    "ANTHROPIC_API_KEY" = "your-anthropic-api-key"
    "NEXT_PUBLIC_USE_MOCK_CLAUDE" = "false"
    "NEXT_PUBLIC_SENTRY_DSN" = "your-sentry-dsn"
    "LOGTAIL_TOKEN" = "your-logtail-token"
    "NEXT_PUBLIC_POSTHOG_KEY" = "your-posthog-key"
    "NEXT_PUBLIC_POSTHOG_HOST" = "your-posthog-host"
}

# Optional environment variables with defaults
$optEnvVars = @{
    "LOG_LEVEL" = "info"
    "CACHE_TTL" = "3600"
    "NODE_ENV" = "production"
}

# Ensure we're using the correct project
Write-Host "Linking to project $projectName ($projectId)..."
vercel link --project $projectId

# Function to check if variable exists
function Test-VercelEnvVar {
    param($varName)
    $result = vercel env ls --project $projectId | Select-String $varName
    return $result -ne $null
}

# Function to set environment variable
function Set-VercelEnvVar {
    param($varName, $varValue)
    Write-Host "Setting $varName for project $projectName..."
    $value = $varValue
    if ($varValue -eq "your-github-oauth-id" -or 
        $varValue -eq "your-github-oauth-secret" -or 
        $varValue -eq "your-production-postgresql-url" -or 
        $varValue -eq "your-production-redis-url" -or 
        $varValue -eq "your-redis-token" -or 
        $varValue -eq "your-claude-api-key" -or 
        $varValue -eq "your-anthropic-api-key" -or 
        $varValue -eq "your-sentry-dsn" -or 
        $varValue -eq "your-logtail-token" -or 
        $varValue -eq "your-posthog-key" -or 
        $varValue -eq "your-posthog-host") {
        $value = Read-Host "Enter value for $varName"
    }
    # Create a temporary file with the value
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $value
    Get-Content $tempFile | vercel env add $varName production --project $projectId
    Remove-Item $tempFile
}

# Set required variables
foreach ($key in $envVars.Keys) {
    if (-not (Test-VercelEnvVar $key)) {
        Set-VercelEnvVar $key $envVars[$key]
    } else {
        Write-Host "$key already exists, skipping..."
    }
}

# Set optional variables
foreach ($key in $optEnvVars.Keys) {
    if (-not (Test-VercelEnvVar $key)) {
        Set-VercelEnvVar $key $optEnvVars[$key]
    } else {
        Write-Host "$key already exists, skipping..."
    }
}

Write-Host "Environment variables set successfully for project $projectName!" 