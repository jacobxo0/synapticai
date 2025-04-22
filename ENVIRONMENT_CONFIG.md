# Mind Mate Environment Configuration

## Environment Structure

### Development (`dev`)
- Local development environment
- Mock services and test data
- Debug logging enabled
- No rate limiting

### Staging (`staging`)
- Pre-production environment
- Real services with test data
- Production-like configuration
- Reduced rate limits

### Production (`prod`)
- Live environment
- Real services and data
- Optimized configuration
- Full rate limiting

## Service Configuration

### Vercel (Frontend)
```yaml
# vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.mindmate.app",
    "NEXT_PUBLIC_SENTRY_DSN": "@sentry-dsn",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-key"
  }
}
```

### Railway (Backend)
```yaml
# railway.toml
[build]
builder = "nixpacks"
buildCommand = "yarn build"

[deploy]
startCommand = "yarn start"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "on_failure"

[env]
NODE_ENV = "production"
PORT = "3000"
```

### Supabase
```sql
-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);
```

## Monitoring Configuration

### Sentry
```javascript
// sentry.client.config.js
export const config = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
};
```

### Logtail
```javascript
// logtail.config.js
export const config = {
  sourceToken: process.env.LOGTAIL_TOKEN,
  environment: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL || 'info',
};
```

## Security Configuration

### CORS
```typescript
// cors.config.ts
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://mindmate.app']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};
```

### Rate Limiting
```typescript
// rate-limit.config.ts
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
};
```

## Backup Configuration

### Database
```bash
# backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL > backup_$DATE.sql
gzip backup_$DATE.sql
```

### File Storage
```typescript
// storage.config.ts
export const storageConfig = {
  bucket: 'mindmate-files',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ],
};
```

## Environment Variables

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `DATABASE_URL` | Database connection | `postgresql://...` |
| `REDIS_URL` | Redis connection | `redis://...` |
| `SUPABASE_URL` | Supabase URL | `https://...` |
| `SUPABASE_KEY` | Supabase key | `eyJ...` |
| `SENTRY_DSN` | Sentry DSN | `https://...` |
| `LOGTAIL_TOKEN` | Logtail token | `lt_...` |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `LOG_LEVEL` | Logging level | `info` |
| `CACHE_TTL` | Cache TTL | `3600` |
| `RATE_LIMIT_WINDOW` | Rate limit window | `15m` |
| `RATE_LIMIT_MAX` | Rate limit max | `100` | 