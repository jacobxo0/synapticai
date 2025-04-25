# Remove all files and directories except .backup and .git
Get-ChildItem -Path . -Exclude '.backup', '.git' | Remove-Item -Recurse -Force

# Restore essential files from backup
Copy-Item -Path ".backup\package.json" -Destination "."
Copy-Item -Path ".backup\tsconfig.json" -Destination "."
Copy-Item -Path ".backup\.gitignore" -Destination "."

# Create minimal Next.js app structure
New-Item -ItemType Directory -Force -Path "app"
New-Item -ItemType Directory -Force -Path "public"
New-Item -ItemType Directory -Force -Path "types"

# Create minimal app/page.tsx
@"
export default function Home() {
  return (
    <main>
      <h1>Welcome to SynapticAI</h1>
    </main>
  );
}
"@ | Out-File -FilePath "app\page.tsx" -Encoding utf8

# Create minimal app/layout.tsx
@"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
"@ | Out-File -FilePath "app\layout.tsx" -Encoding utf8

# Create minimal next.config.js
@"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
"@ | Out-File -FilePath "next.config.js" -Encoding utf8

# Install dependencies
yarn install

# Initialize Git if needed
if (-not (Test-Path ".git")) {
    git init
    $vercelConfig = Get-Content ".backup\vercel-config.json" | ConvertFrom-Json
    git remote add origin $vercelConfig.remote
}

Write-Host "Project reset complete! Run 'yarn dev' to start the development server." 