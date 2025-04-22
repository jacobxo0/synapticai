# Deployment Guide

## Staging Deployment

1. **Prerequisites**
   - Vercel account
   - Claude API key
   - GitHub repository access

2. **Environment Setup**
   - Copy `.env.production.example` to `.env.production`
   - Set your Claude API key
   - Set `NEXT_PUBLIC_USE_MOCK_CLAUDE=false`

3. **Vercel Setup**
   - Connect your GitHub repository
   - Add environment variables:
     ```
     NEXT_PUBLIC_CLAUDE_API_KEY=your_api_key_here
     NEXT_PUBLIC_USE_MOCK_CLAUDE=false
     ```

4. **Deployment**
   - Push to `main` branch
   - Vercel will automatically deploy
   - Check deployment status in Vercel dashboard

## Production Checklist

- [ ] All tests passing
- [ ] Environment variables set
- [ ] Claude API key configured
- [ ] Mock mode disabled
- [ ] Performance metrics checked
- [ ] Error tracking enabled

## Troubleshooting

1. **Deployment Failed**
   - Check Vercel logs
   - Verify environment variables
   - Ensure API key is valid

2. **API Errors**
   - Check Claude API status
   - Verify API key permissions
   - Review error logs

3. **Build Errors**
   - Clear Vercel cache
   - Check dependency versions
   - Review build logs 