#!/bin/bash

# Remove all files and directories except .backup and .git
find . -maxdepth 1 -not -name '.backup' -not -name '.git' -not -name '.' -exec rm -rf {} \;

# Restore essential files from backup
cp .backup/package.json .
cp .backup/tsconfig.json .
cp .backup/.gitignore .

# Create minimal Next.js app structure
mkdir -p app
mkdir -p public
mkdir -p types

# Create minimal app/page.tsx
cat > app/page.tsx << 'EOL'
export default function Home() {
  return (
    <main>
      <h1>Welcome to SynapticAI</h1>
    </main>
  );
}
EOL

# Create minimal app/layout.tsx
cat > app/layout.tsx << 'EOL'
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
EOL

# Create minimal next.config.js
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
EOL

# Install dependencies
yarn install

# Initialize Git if needed
if [ ! -d ".git" ]; then
  git init
  git remote add origin $(jq -r '.remote' .backup/vercel-config.json)
fi

echo "Project reset complete! Run 'yarn dev' to start the development server." 