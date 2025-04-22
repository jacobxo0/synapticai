#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login..."
    vercel login
fi

# Run Prisma migrations
echo "📦 Running Prisma migrations..."
yarn prisma migrate deploy

# Build the application
echo "🏗️ Building application..."
yarn build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed!"
    exit 1
fi

# Verify environment variables
echo "🔍 Verifying environment variables..."
vercel env ls

echo "🎉 Deployment process completed!" 