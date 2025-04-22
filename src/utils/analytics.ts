import { AnalyticsEvent } from '@/types/analytics';

export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.track(event.name, event.properties);
  }
};

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.page({
      path,
      url: window.location.href,
      title: document.title,
    });
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.identify(userId, traits);
  }
}; 