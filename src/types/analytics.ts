export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export interface AnalyticsPageView {
  path: string;
  url: string;
  title: string;
}

export interface AnalyticsUser {
  userId: string;
  traits?: Record<string, any>;
} 