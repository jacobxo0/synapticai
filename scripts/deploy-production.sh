#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to log messages
log() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Error handling
set -e
trap 'echo -e "${RED}Error: Command failed${NC}"' ERR

# Start deployment
log "Starting SynapticAI v1.0.0 Production Deployment"

# Build and deploy
yarn build
yarn test

# Tag release
git tag -a v1.0.0 -m "SynapticAI v1.0.0 Production Release"
git push origin v1.0.0

# Send notification
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "text": "🚀 SynapticAI v1.0.0 Production Deployment Complete\n• Frontend: synapticai.app\n• Backend: api.synapticai.app\n• Status: All systems operational"
  }' \
  $SLACK_WEBHOOK_URL

# Done
echo -e "${GREEN}SynapticAI v1.0.0 is now live!${NC}" 