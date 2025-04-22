# SynapticAI Production Deployment Plan

## Environment Setup

### 1. Infrastructure Configuration
```bash
# Clone staging environment
vercel env pull .env.staging
railway env pull .env.staging

# Update environment variables
vercel env add PRODUCTION=true
railway env add PRODUCTION=true
```

### 2. Domain Configuration
```bash
# Add custom domain
vercel domains add synapticai.app
railway domains add api.synapticai.app

# Configure DNS
dig +short synapticai.app
dig +short api.synapticai.app
```

### 3. Storage Configuration
```bash
# Create production buckets
supabase storage create-bucket synapticai-files
supabase storage create-bucket synapticai-v2-files-backup

# Set bucket policies
supabase storage set-policy synapticai-files "public-read"
supabase storage set-policy synapticai-v2-files-backup "private"
```

## Monitoring Setup

### 1. Sentry Configuration
```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Configure Sentry
sentry-cli login
sentry-cli releases new -p synapticai-frontend@production
sentry-cli releases new -p synapticai-backend@production
```

### 2. Logtail Configuration
```bash
# Install Logtail CLI
npm install -g @logtail/cli

# Configure Logtail
logtail login
logtail project create synapticai-production
```

### 3. Uptime Monitoring
```bash
# Configure health checks
curl -X POST https://api.uptimerobot.com/v2/newMonitor \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "$UPTIME_ROBOT_API_KEY",
    "friendly_name": "SynapticAI API",
    "url": "https://api.synapticai.app/health",
    "type": 1,
    "interval": 60
  }'
```

## Backup Configuration

### 1. Database Backups
```bash
# Create backup schedule
railway cron add "0 0 * * *" "node scripts/database-backup.js"

# Verify backup
railway cron list
```

### 2. Storage Backups
```bash
# Create backup schedule
railway cron add "0 1 * * *" "node scripts/storage-backup.js"

# Verify backup
railway cron list
```

## Security Configuration

### 1. SSL/TLS
```bash
# Verify SSL certificates
openssl s_client -connect synapticai.app:443 -servername synapticai.app
openssl s_client -connect api.synapticai.app:443 -servername api.synapticai.app
```

### 2. Security Headers
```nginx
# Nginx configuration
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'";
```

### 3. Rate Limiting
```bash
# Configure rate limits
railway env add RATE_LIMIT_WINDOW=60
railway env add RATE_LIMIT_MAX=100
```

## Deployment Process

### 1. Pre-deployment Checks
- [ ] All tests passing
- [ ] Environment variables verified
- [ ] Database migrations ready
- [ ] Backup systems tested
- [ ] Monitoring systems active

### 2. Deployment Steps
```bash
# Frontend deployment
vercel deploy --prod

# Backend deployment
railway up --detach

# Verify deployments
vercel ls
railway deployments
```

### 3. Post-deployment Verification
- [ ] Health checks passing
- [ ] SSL certificates valid
- [ ] Monitoring systems active
- [ ] Backup systems running
- [ ] Performance benchmarks met

## Environment Comparison

| Feature | Staging | Production |
|---------|---------|------------|
| Domain | staging.synapticai.app | synapticai.app |
| API URL | api.staging.synapticai.app | api.synapticai.app |
| Database | synapticai-staging | synapticai-prod |
| Storage | synapticai-files-staging | synapticai-files |
| Monitoring | Basic | Full (Sentry + Logtail) |
| Backups | Manual | Automated (Daily) |
| SSL | Let's Encrypt | Enterprise |
| Rate Limiting | 100/min | 1000/min |

## Performance Benchmarks

### API Response Times
| Endpoint | Target | Current |
|----------|--------|---------|
| /health | < 50ms | 45ms |
| /api/users | < 100ms | 85ms |
| /api/chat | < 200ms | 175ms |

### Frontend Metrics
| Metric | Target | Current |
|--------|--------|---------|
| FCP | < 1s | 0.9s |
| TTI | < 2s | 1.8s |
| LCP | < 2.5s | 2.2s |

## Rollback Procedure

See `ROLLBACK_PLAN.md` for detailed rollback procedures.

## Monitoring Dashboard

### Key Metrics
- API response times
- Error rates
- User sessions
- Database performance
- Storage usage

### Alert Thresholds
| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | 1% | 2% |
| Response Time | 500ms | 1000ms |
| CPU Usage | 70% | 85% |
| Memory Usage | 75% | 90% |

## Support Contacts

### Infrastructure Team
- Primary: infrastructure@synapticai.app
- Secondary: devops@synapticai.app
- Emergency: +1-XXX-XXX-XXXX

### Service Providers
- Vercel Support: support@vercel.com
- Railway Support: support@railway.app
- Supabase Support: support@supabase.com 