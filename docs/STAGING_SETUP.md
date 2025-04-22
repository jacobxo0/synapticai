# Staging Environment Setup

## Overview
This document outlines the staging environment configuration for MindMate's frontend application, deployed on Vercel.

## Configuration Files

### 1. Vercel Configuration (`vercel.json`)
- Framework: Next.js
- Build Command: `yarn build`
- Install Command: `yarn install`
- Region: Frankfurt (fra1)
- Environment Variables:
  - `NEXT_PUBLIC_APP_ENV=staging`
  - `NEXT_PUBLIC_API_URL=https://api-staging.mindmate.com`
- Security Headers:
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin

### 2. Environment Variables (`.env.staging`)
- Safe fallback values for staging environment
- Feature flags for testing
- Analytics and monitoring configuration
- Security settings

### 3. GitHub Workflow (`.github/workflows/staging-deploy.yml`)
- Triggers:
  - Push to `main` branch
  - Tags matching `release/*`
- Steps:
  1. Checkout code
  2. Install Node.js and dependencies
  3. Build with staging environment
  4. Deploy to Vercel
  5. Run visual regression tests

## Deployment Process

### Prerequisites
1. Vercel account with project access
2. GitHub repository access
3. Required secrets in GitHub:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `NEXT_PUBLIC_API_URL`

### Deployment Steps
1. Push to `main` branch or create `release/*` tag
2. GitHub Actions workflow triggers
3. Build process runs with staging environment
4. Deployment to Vercel
5. Visual regression tests run
6. Preview URL generated

## Testing Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Feature flags configured
- [ ] API endpoints verified

### Post-Deployment
- [ ] Preview URL accessible
- [ ] API connections working
- [ ] Feature flags functioning
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance metrics within range

### Visual Regression
- [ ] Homepage
- [ ] Reflection flow
- [ ] Feedback widget
- [ ] Mobile responsiveness
- [ ] Dark mode
- [ ] Loading states

## Monitoring

### Performance
- Page load times
- First Contentful Paint
- Time to Interactive
- API response times

### Errors
- Console errors
- Network failures
- API errors
- Client-side exceptions

### Analytics
- User interactions
- Feature usage
- Error rates
- Performance metrics

## Troubleshooting

### Common Issues
1. Build failures
   - Check environment variables
   - Verify dependency versions
   - Review build logs

2. Deployment issues
   - Check Vercel dashboard
   - Review GitHub Actions logs
   - Verify secrets configuration

3. API connectivity
   - Verify API URL
   - Check CORS settings
   - Test API endpoints

### Support
- Vercel Dashboard: [dashboard.vercel.com](https://dashboard.vercel.com)
- GitHub Actions: [github.com/actions](https://github.com/actions)
- Project Documentation: [docs.mindmate.com](https://docs.mindmate.com)

## Preview URL
The staging environment will be available at:
```
https://mindmate-staging.vercel.app
```

Note: This URL is for internal testing only and should not be shared publicly. 