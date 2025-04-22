# Mind Mate Analytics Setup

## Overview
This documentation describes the analytics implementation for Mind Mate, using PostHog as our privacy-first analytics platform.

## Setup Instructions

1. **Environment Configuration**
   - Copy `.env.local` to your project root
   - Replace `NEXT_PUBLIC_POSTHOG_KEY` with your PostHog project key
   - Update `NEXT_PUBLIC_POSTHOG_HOST` if using a custom PostHog instance

2. **Installation**
   ```bash
   npm install posthog-js
   ```

## Usage

### In React Components
```typescript
import { useAnalytics } from '../hooks/useAnalytics';

const MyComponent = () => {
  const { trackFeatureUse, trackAIInteraction } = useAnalytics('page_name');

  const handleFeatureUse = () => {
    trackFeatureUse('feature_name', 'interaction_type');
  };

  return (
    // Your component JSX
  );
};
```

### Direct Service Usage
```typescript
import { AnalyticsService } from '../services/analytics';

// Track page view
AnalyticsService.trackPageView('page_name');

// Track feature usage
AnalyticsService.trackFeatureUse('feature_name', 'interaction_type');

// Track AI interaction
AnalyticsService.trackAIInteraction('interaction_type', responseTime, success);
```

## Dashboard Access
1. Log in to PostHog at https://app.posthog.com
2. Navigate to your project
3. Access the following dashboards:
   - User Activity Overview
   - Feature Usage
   - Engagement Metrics
   - AI Interaction Analytics

## Data Export
1. Navigate to the PostHog dashboard
2. Select the desired date range
3. Click "Export" to download data in CSV format
4. Use the API for automated exports

## Privacy Considerations
- No PII is collected
- IP addresses are not stored
- Session recording is disabled
- Data retention: 30 days

## Troubleshooting
1. Check browser console for analytics errors
2. Verify PostHog initialization in `analytics.ts`
3. Ensure environment variables are properly set
4. Check network tab for failed analytics requests

## Support
For analytics-related issues, contact the development team or refer to:
- [PostHog Documentation](https://posthog.com/docs)
- [TRACKING_SCHEMA.md](./TRACKING_SCHEMA.md)
- [USAGE_DASHBOARD.md](./USAGE_DASHBOARD.md) 