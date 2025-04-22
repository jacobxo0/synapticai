# Mind Mate Production Rollback Plan

## Quick Reference

### Emergency Rollback (1-Click)
```bash
# Frontend (Vercel)
vercel rollback <last-stable-deployment>

# Backend (Railway)
railway rollback <last-stable-deployment>
```

### Full Rollback (5-10 minutes)
```bash
# 1. Stop traffic
vercel scale 0
railway scale 0

# 2. Restore database
pg_restore -d $DATABASE_URL backup_latest.sql.gz

# 3. Restore storage
node scripts/storage-restore.js

# 4. Deploy previous version
vercel deploy --prod --prebuilt
railway up --detach
```

## Rollback Triggers

### Automatic Rollback Conditions
- API error rate > 5% for 5 minutes
- Frontend error rate > 2% for 5 minutes
- Database connection failures > 10/minute
- Cache hit rate < 80% for 15 minutes

### Manual Rollback Conditions
- Critical security vulnerability
- Data corruption detected
- Performance degradation > 50%
- User-reported issues > 100 in 1 hour

## Rollback Procedures

### 1. Frontend Rollback (Vercel)
```bash
# List deployments
vercel ls

# Rollback to specific version
vercel rollback <deployment-id>

# Verify health
curl https://mindmate.app/health
```

### 2. Backend Rollback (Railway)
```bash
# List deployments
railway deployments

# Rollback to specific version
railway rollback <deployment-id>

# Verify health
curl https://api.mindmate.app/health
```

### 3. Database Rollback
```bash
# List available backups
aws s3 ls s3://mindmate-backups/database/

# Restore specific backup
pg_restore -d $DATABASE_URL backup_20240101.sql.gz

# Verify data integrity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

### 4. Storage Rollback
```bash
# Restore from backup
node scripts/storage-restore.js --date 20240101

# Verify files
aws s3 ls s3://mindmate-files/
```

## Monitoring During Rollback

### Metrics to Watch
- Error rates
- Response times
- Cache hit rates
- Database connections
- Memory usage

### Alert Thresholds
| Metric | Warning | Critical | Auto-rollback |
|--------|---------|----------|---------------|
| Error Rate | 2% | 5% | Yes |
| Response Time | 500ms | 1000ms | No |
| Cache Hit | 85% | 80% | Yes |
| DB Connections | 80% | 90% | Yes |

## Communication Plan

### Internal Notification
```bash
# Send rollback notification
curl -X POST https://hooks.slack.com/services/... \
  -H 'Content-Type: application/json' \
  -d '{"text":"🚨 Production rollback initiated"}'
```

### External Communication
```markdown
# Status Page Update
Title: Service Degradation
Status: Investigating
Impact: High
Message: We're currently experiencing issues and have initiated a rollback to restore service.
```

## Post-Rollback Verification

### 1. System Health
- [ ] API endpoints responding
- [ ] Database queries successful
- [ ] Cache functioning
- [ ] Storage accessible

### 2. Data Integrity
- [ ] User data intact
- [ ] File storage complete
- [ ] Cache data valid
- [ ] Audit logs continuous

### 3. Performance
- [ ] Response times normal
- [ ] Error rates baseline
- [ ] Resource usage stable
- [ ] Cache hit rates optimal

## Rollback Documentation

### Update Deployment Log
```bash
# Add rollback entry
echo "$(date) - Rollback to v1.0.0 - Reason: High error rates" >> deployment.log
```

### Update Incident Report
```markdown
## Incident Report
- Time: [TIMESTAMP]
- Version: v1.0.0
- Reason: High error rates
- Duration: [DURATION]
- Impact: [IMPACT]
- Resolution: Rollback to previous version
```

## Emergency Contacts

### Infrastructure Team
- Primary: infrastructure@mindmate.app
- Secondary: devops@mindmate.app
- Emergency: +1-XXX-XXX-XXXX

### Service Providers
- Vercel Support: support@vercel.com
- Railway Support: support@railway.app
- Supabase Support: support@supabase.com 