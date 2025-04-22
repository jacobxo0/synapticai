import posthog from 'posthog-js';

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // We'll handle page views manually
    capture_pageleave: false,
    autocapture: false, // Disable automatic event capture
    disable_session_recording: true, // Disable session recording for privacy
  });
}

export const AnalyticsService = {
  // Page Views
  trackPageView: (pageName: string, properties?: Record<string, any>) => {
    posthog.capture('synapticai.page.viewed', {
      page_name: pageName,
      device_type: getDeviceType(),
      ...properties,
    });
  },

  // Feature Usage
  trackFeatureUse: (
    featureName: string,
    interactionType: string,
    properties?: Record<string, any>
  ) => {
    posthog.capture('synapticai.feature.used', {
      feature_name: featureName,
      interaction_type: interactionType,
      ...properties,
    });
  },

  // Engagement
  trackScroll: (pageName: string, scrollDepth: number, timeOnPage: number) => {
    posthog.capture('synapticai.engagement.scroll', {
      page_name: pageName,
      scroll_depth: scrollDepth,
      time_on_page: timeOnPage,
    });
  },

  trackTime: (pageName: string, duration: number, exitType: string) => {
    posthog.capture('synapticai.engagement.time', {
      page_name: pageName,
      duration,
      exit_type: exitType,
    });
  },

  // AI Interactions
  trackAIInteraction: (
    interactionType: string,
    responseTime: number,
    success: boolean
  ) => {
    posthog.capture('synapticai.ai.interaction', {
      interaction_type: interactionType,
      response_time: responseTime,
      success,
    });
  },

  // Utility function to get device type
  getDeviceType: () => {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet/i.test(userAgent)) return 'tablet';
    return 'desktop';
  },
};

// Export for use in components
export const {
  trackPageView,
  trackFeatureUse,
  trackScroll,
  trackTime,
  trackAIInteraction,
} = AnalyticsService; 