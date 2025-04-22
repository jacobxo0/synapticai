# Deployment Guide

## Frontend Deployment

The frontend is deployed using Vercel with automated CI/CD through GitHub Actions.

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_API_URL`: API endpoint URL
- `NEXT_PUBLIC_VERCEL_ENV`: Deployment environment (production/staging)

### Health Check

A health check endpoint is available at `/api/health` that returns:
- Status
- Timestamp
- Environment
- Version

### Deployment Workflow

1. Push to `main` or `staging` branch
2. GitHub Actions workflow:
   - Installs dependencies
   - Builds project
   - Deploys to Vercel
   - Verifies deployment via health check

### Manual Deployment

```bash
# Install dependencies
yarn install

# Build project
yarn build

# Deploy to Vercel
vercel deploy --prod
```

### Troubleshooting

1. Check deployment logs in Vercel dashboard
2. Verify environment variables
3. Test health check endpoint
4. Review GitHub Actions workflow status 