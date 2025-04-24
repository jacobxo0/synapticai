import { useEffect, useRef } from 'react';
import { trackPageView, trackScroll, trackTime, trackFeatureUse } from '@/services/analytics';
import { AnalyticsEvent } from '@/types/core';

type AnalyticsHook = {
  trackEvent: (event: AnalyticsEvent) => void;
};

export const useAnalytics = (): AnalyticsHook => {
  const startTime = useRef<number>(Date.now());
  const lastScrollDepth = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((window.scrollY / scrollHeight) * 100);
      
      if (scrollDepth > lastScrollDepth.current + 10) {
        lastScrollDepth.current = scrollDepth;
        const timeOnPage = (Date.now() - startTime.current) / 1000;
        trackScroll(window.location.pathname, scrollDepth, timeOnPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const timeOnPage = (Date.now() - startTime.current) / 1000;
      trackTime(window.location.pathname, timeOnPage, 'exit');
    };
  }, []);

  const trackEvent = (event: AnalyticsEvent): void => {
    switch (event.name) {
      case 'synapticai.page.viewed':
        trackPageView(event.properties?.page_name || window.location.pathname, event.properties);
        startTime.current = Date.now();
        lastScrollDepth.current = 0;
        break;
      case 'synapticai.engagement.scroll':
        if (event.properties?.scroll_depth !== undefined && event.properties?.time_on_page !== undefined) {
          trackScroll(
            event.properties.page_name || window.location.pathname,
            event.properties.scroll_depth,
            event.properties.time_on_page
          );
        }
        break;
      case 'synapticai.engagement.time':
        if (event.properties?.duration !== undefined) {
          trackTime(
            event.properties.page_name || window.location.pathname,
            event.properties.duration,
            event.properties.exit_type || 'manual'
          );
        }
        break;
      case 'synapticai.feature.used':
        if (event.properties?.feature_name && event.properties?.interaction_type) {
          trackFeatureUse(
            event.properties.feature_name,
            event.properties.interaction_type,
            event.properties
          );
        }
        break;
    }
  };

  return { trackEvent };
}; 