# MindMate V2 Production Deployment Checklist

## Pre-Deployment Checks

### Infrastructure
- [ ] Vercel production environment configured
- [ ] Railway production environment ready
- [ ] Supabase production instance verified
- [ ] Redis production instance ready
- [ ] CDN configuration checked

### Environment Variables
- [ ] `.env.production` variables verified
- [ ] Feature flags configured
- [ ] API keys rotated
- [ ] Claude API quota limits set
- [ ] GDPR consent settings configured

### Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Sentry error tracking configured
- [ ] Uptime monitoring active
- [ ] Performance monitoring ready
- [ ] Log aggregation configured

## Deployment Steps

### 1. Backend Deployment
```bash
# Deploy to Railway
railway up --detach --environment production

# Verify deployment
curl -s https://api.mindmate.app/health
```

### 2. Frontend Deployment
```bash
# Deploy to Vercel
vercel deploy --prod

# Verify deployment
curl -s https://mindmate.app
```

### 3. Database Migration
```bash
# Run migrations
yarn prisma migrate deploy

# Verify schema
yarn prisma db pull
```

## Post-Deployment Validation

### Performance Metrics
- [ ] Cold start time < 500ms
- [ ] API response time < 200ms
- [ ] Page load time < 3s
- [ ] Memory usage < 512MB
- [ ] CPU usage < 50%

### Feature Validation
- [ ] User authentication works
- [ ] Claude integration functional
- [ ] File uploads working
- [ ] Export system operational
- [ ] GDPR consent banners display
- [ ] Feature flags toggle correctly

### Security Checks
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] API keys secured
- [ ] GDPR compliance verified

## Monitoring Setup

### Uptime Monitoring
```yaml
# UptimeRobot Configuration
monitors:
  - name: "MindMate API"
    url: "https://api.mindmate.app/health"
    interval: 60
    alert_contacts:
      - email: "alerts@mindmate.app"
      - slack: "#production-alerts"
  
  - name: "MindMate Frontend"
    url: "https://mindmate.app"
    interval: 60
    alert_contacts:
      - email: "alerts@mindmate.app"
      - slack: "#production-alerts"
```

### Performance Alerts
```yaml
# Sentry Alert Rules
alerts:
  - name: "High Error Rate"
    condition: "error.rate > 1%"
    actions:
      - type: "email"
        recipients: ["alerts@mindmate.app"]
      - type: "slack"
        channel: "#production-alerts"
  
  - name: "Slow API Response"
    condition: "p95(transaction.duration) > 1000ms"
    actions:
      - type: "email"
        recipients: ["alerts@mindmate.app"]
      - type: "slack"
        channel: "#production-alerts"
```

## Rollback Procedures

### 1. Frontend Rollback
```bash
# Revert to previous deployment
vercel rollback

# Verify rollback
curl -s https://mindmate.app
```

### 2. Backend Rollback
```bash
# Revert to previous deployment
railway rollback --environment production

# Verify rollback
curl -s https://api.mindmate.app/health
```

### 3. Database Rollback
```bash
# Revert last migration
yarn prisma migrate reset

# Verify data integrity
yarn prisma db pull
```

## Fallback Systems

### Claude API Fallback
```typescript
// Fallback to secondary API key if quota exceeded
const getClaudeApiKey = async () => {
  try {
    const primaryKey = process.env.CLAUDE_API_KEY;
    const response = await fetch('https://api.anthropic.com/v1/usage', {
      headers: { 'Authorization': `Bearer ${primaryKey}` }
    });
    
    if (response.status === 429) {
      return process.env.CLAUDE_API_KEY_BACKUP;
    }
    
    return primaryKey;
  } catch (error) {
    return process.env.CLAUDE_API_KEY_BACKUP;
  }
};
```

### CDN Fallback
```nginx
# Nginx configuration for CDN fallback
location / {
  proxy_pass https://mindmate.vercel.app;
  proxy_cache_bypass $http_upgrade;
  
  # Fallback to origin if CDN fails
  error_page 502 503 504 = @fallback;
}

location @fallback {
  proxy_pass https://mindmate.app;
  proxy_cache_bypass $http_upgrade;
}
```

## Downtime Plan

### Communication
1. **Internal Alert**
   - Slack: #production-alerts
   - Email: alerts@mindmate.app
   - SMS: On-call engineer

2. **External Communication**
   - Status page updates
   - Twitter updates
   - Email notifications

### Recovery Steps
1. **Immediate Actions**
   - Activate fallback systems
   - Notify team
   - Begin diagnostics

2. **Short-term Fixes**
   - Scale resources
   - Clear caches
   - Restart services

3. **Long-term Solutions**
   - Root cause analysis
   - Infrastructure improvements
   - Process updates

## Ping Test Trace
```bash
# Test API connectivity
curl -v https://api.mindmate.app/health

# Test frontend connectivity
curl -v https://mindmate.app

# Test database connectivity
psql $DATABASE_URL -c "SELECT 1"

# Test Redis connectivity
redis-cli -h $REDIS_HOST ping

# Test Claude API
curl -v https://api.anthropic.com/v1/complete \
  -H "Authorization: Bearer $CLAUDE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test", "max_tokens": 5}'
``` 