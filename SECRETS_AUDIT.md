# Mind Mate GitHub Secrets Audit

## Current Secrets Status

### Required Secrets
| Secret | Status | Workflows | Notes |
|--------|--------|-----------|-------|
| `RAILWAY_TOKEN` | ✅ Present | backend.yml, ci.yml | Railway API token |
| `RAILWAY_PROJECT_ID` | ✅ Present | backend.yml, ci.yml | Railway project identifier |
| `RAILWAY_SERVICE_ID` | ✅ Present | backend.yml, ci.yml | Railway service identifier |
| `SUPABASE_URL` | ✅ Present | backend.yml, ci.yml | Supabase project URL |
| `SUPABASE_KEY` | ✅ Present | backend.yml, ci.yml | Supabase service key |
| `VERCEL_PROJECT_ID` | ✅ Present | frontend.yml | Vercel project identifier |
| `VERCEL_TOKEN` | ✅ Present | frontend.yml | Vercel API token |
| `VERCEL_ORG_ID` | ✅ Present | frontend.yml | Vercel organization ID |
| `NEXT_PUBLIC_API_URL` | ✅ Present | frontend.yml | API endpoint URL |
| `DATABASE_URL` | ✅ Present | backend.yml | Database connection string |
| `REDIS_URL` | ✅ Present | backend.yml | Redis connection string |
| `DOCKER_USERNAME` | ✅ Present | ci.yml | Docker Hub username |
| `DOCKER_PASSWORD` | ✅ Present | ci.yml | Docker Hub password |
| `NEXT_PUBLIC_SENTRY_DSN` | ✅ Present | frontend.yml | Sentry DSN for error tracking |

### Optional Secrets
| Secret | Status | Workflows | Fallback |
|--------|--------|-----------|----------|
| `NODE_ENV` | ⚠️ Missing | ci.yml | `development` |
| `NEXT_PUBLIC_GA_ID` | ⚠️ Missing | frontend.yml | `''` |
| `NEXT_PUBLIC_STRIPE_KEY` | ⚠️ Missing | frontend.yml | `''` |

## Fix Log

### 1. Added Missing Secrets
```bash
# Add NODE_ENV
gh secret set NODE_ENV --body "production"

# Add Google Analytics ID
gh secret set NEXT_PUBLIC_GA_ID --body "UA-XXXXXXXXX-X"

# Add Stripe key
gh secret set NEXT_PUBLIC_STRIPE_KEY --body "pk_test_XXXXXXXX"
```

### 2. Updated Workflows
```yaml
# .github/workflows/ci.yml
env:
  NODE_ENV: ${{ secrets.NODE_ENV || 'development' }}
  NEXT_PUBLIC_GA_ID: ${{ secrets.NEXT_PUBLIC_GA_ID || '' }}
  NEXT_PUBLIC_STRIPE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_KEY || '' }}
```

### 3. Added Fallback Configuration
```env
# .env.ci
NODE_ENV=development
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_STRIPE_KEY=
```

## Secret Management Instructions

### 1. Adding New Secrets
```bash
# Add a new secret
gh secret set SECRET_NAME --body "secret_value"

# Verify secret
gh secret list
```

### 2. Updating Existing Secrets
```bash
# Update secret
gh secret set SECRET_NAME --body "new_value"

# Verify update
gh secret list
```

### 3. Removing Secrets
```bash
# Remove secret
gh secret delete SECRET_NAME

# Verify removal
gh secret list
```

## Workflow Secret Usage

### Backend Workflow
```yaml
# .github/workflows/backend.yml
env:
  RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  RAILWAY_PROJECT_ID: ${{ secrets.RAILWAY_PROJECT_ID }}
  RAILWAY_SERVICE_ID: ${{ secrets.RAILWAY_SERVICE_ID }}
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  REDIS_URL: ${{ secrets.REDIS_URL }}
```

### Frontend Workflow
```yaml
# .github/workflows/frontend.yml
env:
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
  NEXT_PUBLIC_SENTRY_DSN: ${{ secrets.NEXT_PUBLIC_SENTRY_DSN }}
  NEXT_PUBLIC_GA_ID: ${{ secrets.NEXT_PUBLIC_GA_ID || '' }}
  NEXT_PUBLIC_STRIPE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_KEY || '' }}
```

### CI Workflow
```yaml
# .github/workflows/ci.yml
env:
  RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  RAILWAY_PROJECT_ID: ${{ secrets.RAILWAY_PROJECT_ID }}
  RAILWAY_SERVICE_ID: ${{ secrets.RAILWAY_SERVICE_ID }}
  DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
  DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
  NODE_ENV: ${{ secrets.NODE_ENV || 'development' }}
```

## Security Notes

### 1. Secret Rotation
- Rotate all secrets every 90 days
- Use `gh secret rotate` for automated rotation
- Update documentation after rotation

### 2. Access Control
- Limit secret access to required workflows
- Use environment-specific secrets when possible
- Review access logs monthly

### 3. Emergency Procedures
```bash
# Emergency secret rotation
gh secret rotate --all

# Verify all workflows
gh workflow list
```

## Support

### Infrastructure Team
- Primary: infrastructure@mindmate.app
- Secondary: devops@mindmate.app
- Emergency: +1-XXX-XXX-XXXX

### Service Providers
- GitHub Support: support@github.com
- Vercel Support: support@vercel.com
- Railway Support: support@railway.app 