import { useEffect, useRef, useCallback } from 'react';
import { AnalyticsService } from '../services/analytics';

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

type AnalyticsHook = {
  trackFeatureUse: (featureName: string, properties?: Record<string, unknown>) => void;
  trackAIInteraction: (interactionType: string, properties?: Record<string, unknown>) => void;
};

export const useAnalytics = (pageName: string): AnalyticsHook => {
  const startTime = useRef<number>(Date.now());
  const maxScroll = useRef<number>(0);
  const isTracking = useRef<boolean>(true);

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (!isTracking.current) return;
    AnalyticsService.trackEvent(event.name, event.properties);
  }, []);

  useEffect(() => {
    // Track page view on mount
    trackEvent({ name: 'page_view', properties: { page: pageName } });

    // Track scroll depth
    const handleScroll = () => {
      if (!isTracking.current) return;
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;
      
      if (scrollPercentage > maxScroll.current) {
        maxScroll.current = scrollPercentage;
        trackEvent({
          name: 'scroll_depth',
          properties: {
            page: pageName,
            depth: maxScroll.current,
            timestamp: Date.now(),
          },
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track time on page
    const handleVisibilityChange = () => {
      if (!isTracking.current) return;
      
      if (document.visibilityState === 'hidden') {
        const duration = (Date.now() - startTime.current) / 1000;
        trackEvent({
          name: 'time_on_page',
          properties: {
            page: pageName,
            duration,
            exit_type: 'natural',
          },
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    const currentStartTime = startTime.current;
    return () => {
      isTracking.current = false;
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (currentStartTime) {
        const duration = (Date.now() - currentStartTime) / 1000;
        trackEvent({
          name: 'time_on_page',
          properties: {
            page: pageName,
            duration,
            exit_type: 'navigation',
          },
        });
      }
    };
  }, [pageName, trackEvent]);

  return {
    trackFeatureUse: (featureName: string, properties?: Record<string, unknown>) => {
      trackEvent({
        name: 'feature_use',
        properties: { feature: featureName, ...properties },
      });
    },
    trackAIInteraction: (interactionType: string, properties?: Record<string, unknown>) => {
      trackEvent({
        name: 'ai_interaction',
        properties: { type: interactionType, ...properties },
      });
    },
  };
}; 