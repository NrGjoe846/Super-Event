import { useEffect } from 'react';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const trackEvent = ({ category, action, label, value }: AnalyticsEvent) => {
    try {
      // Send to analytics service
      console.log('Analytics event:', { category, action, label, value });
      
      // Track in localStorage for demo
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push({
        category,
        action,
        label,
        value,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const trackPageView = (page: string) => {
    trackEvent({
      category: 'Page View',
      action: 'view',
      label: page,
    });
  };

  const trackSearch = (query: string, results: number) => {
    trackEvent({
      category: 'Search',
      action: 'query',
      label: query,
      value: results,
    });
  };

  const trackBooking = (venueId: string, amount: number) => {
    trackEvent({
      category: 'Booking',
      action: 'complete',
      label: venueId,
      value: amount,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackBooking,
  };
};
