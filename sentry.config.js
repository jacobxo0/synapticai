const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin
  silent: true, // Suppresses all logs
  org: "mindmate",
  project: "mindmate-v2",
  
  // Performance monitoring
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  
  // Error tracking
  errorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.npm_package_version,
  
  // Custom tags
  tags: {
    deployment: process.env.VERCEL_ENV,
    region: process.env.VERCEL_REGION,
  },
  
  // Ignore specific errors
  ignoreErrors: [
    // Network errors
    "Network request failed",
    "Failed to fetch",
    
    // Browser-specific errors
    "ResizeObserver loop limit exceeded",
    
    // Third-party errors
    "ChunkLoadError",
  ],
  
  // Performance monitoring thresholds
  performance: {
    // Cold start time
    coldStartThreshold: 500,
    
    // API response time
    apiResponseThreshold: 200,
    
    // Page load time
    pageLoadThreshold: 3000,
  },
  
  // Alert rules
  alertRules: [
    {
      // High error rate
      condition: "error.rate > 1%",
      actions: [
        {
          type: "email",
          recipients: ["alerts@mindmate.app"],
        },
        {
          type: "slack",
          channel: "#production-alerts",
        },
      ],
    },
    {
      // Slow API response
      condition: "p95(transaction.duration) > 1000ms",
      actions: [
        {
          type: "email",
          recipients: ["alerts@mindmate.app"],
        },
        {
          type: "slack",
          channel: "#production-alerts",
        },
      ],
    },
    {
      // High memory usage
      condition: "memory.usage > 80%",
      actions: [
        {
          type: "email",
          recipients: ["alerts@mindmate.app"],
        },
        {
          type: "slack",
          channel: "#production-alerts",
        },
      ],
    },
  ],
};

module.exports = withSentryConfig(
  {
    // Your existing Next.js config
    reactStrictMode: true,
    swcMinify: true,
  },
  sentryWebpackPluginOptions
); 