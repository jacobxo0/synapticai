# MindMate Deployment Guide

## Required Secrets

### Vercel (Frontend)
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID

### Railway (Backend)
- `RAILWAY_TOKEN`: Your Railway authentication token
- `RAILWAY_PROJECT_ID`: Your Railway project ID

### API Configuration
- `NEXT_PUBLIC_API_URL`: Production API URL (e.g., https://api.mindmate.app)
- `NEXT_PUBLIC_APP_URL`: Production app URL (e.g., https://mindmate.app)

### Database
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection URL

### Authentication
- `NEXTAUTH_URL`: Production NextAuth URL
- `NEXTAUTH_SECRET`: Secret key for NextAuth (min 32 chars)

### AI Services
- `CLAUDE_API_KEY`: Anthropic Claude API key
- `OPENAI_API_KEY`: OpenAI API key

### Monitoring
- `SENTRY_DSN`: Sentry DSN for error tracking
- `SENTRY_ORG`: Sentry organization name
- `SENTRY_PROJECT`: Sentry project name
- `SENTRY_AUTH_TOKEN`: Sentry authentication token

### Analytics
- `POSTHOG_API_KEY`: PostHog API key
- `POSTHOG_PROJECT_ID`: PostHog project ID
- `NEXT_PUBLIC_POSTHOG_KEY`: Public PostHog key
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host URL

### Notifications
- `SLACK_WEBHOOK_URL`: Slack webhook URL for notifications

### Storage
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## Deployment Process

1. Set up all required secrets in your GitHub repository:
   ```bash
   # Example: Setting a secret
   gh secret set VERCEL_TOKEN -b"your-token"
   ```

2. Push to main branch or trigger workflow manually:
   ```bash
   # Frontend deployment
   gh workflow run frontend.yml

   # Backend deployment
   gh workflow run backend.yml
   ```

3. Monitor deployment status in GitHub Actions

4. Verify deployment:
   - Frontend: https://mindmate.app
   - Backend: https://api.mindmate.app/health
   - Database: Check Railway dashboard
   - Monitoring: Check Sentry and PostHog dashboards

## Rollback Procedure

1. Frontend:
   ```bash
   vercel rollback
   ```

2. Backend:
   ```bash
   railway rollback
   ```

3. Database:
   ```bash
   yarn prisma migrate reset
   ```

## Troubleshooting

1. Check GitHub Actions logs for deployment errors
2. Verify all secrets are properly set
3. Check Vercel and Railway dashboards for deployment status
4. Monitor Sentry for any errors
5. Check PostHog for analytics data

## Support

For deployment issues, contact:
- DevOps: devops@mindmate.app
- Technical Support: support@mindmate.app 