import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { analyticsService } from '../services/analyticsService';

export function useAnalytics() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    pageViews: 0,
    events: 0,
    activeUsers: 0,
    conversionRate: 0,
  });
  const [topPages, setTopPages] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load summary data
      const { data: pageViewsData, error: pageViewsError } = await supabase
        .from('page_views')
        .select('id', { count: 'exact' });
        
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id', { count: 'exact' });
        
      const { data: usersData, error: usersError } = await supabase
        .from('page_views')
        .select('user_id')
        .not('user_id', 'is', null);
        
      if (pageViewsError || eventsError || usersError) {
        throw new Error('Failed to load summary data');
      }
      
      // Calculate unique users
      const uniqueUsers = new Set();
      usersData?.forEach(item => {
        if (item.user_id) uniqueUsers.add(item.user_id);
      });
      
      // Calculate conversion rate (example: percentage of users who made a purchase)
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('user_id')
        .not('user_id', 'is', null);
        
      if (purchasesError) {
        throw new Error('Failed to load purchases data');
      }
      
      const purchasingUsers = new Set();
      purchasesData?.forEach(item => {
        if (item.user_id) purchasingUsers.add(item.user_id);
      });
      
      const conversionRate = uniqueUsers.size > 0 
        ? (purchasingUsers.size / uniqueUsers.size) * 100 
        : 0;
      
      setSummary({
        pageViews: pageViewsData?.length || 0,
        events: eventsData?.length || 0,
        activeUsers: uniqueUsers.size,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      });
      
      // Load top pages
      const { data: topPagesData, error: topPagesError } = await supabase
        .from('page_views')
        .select('page_url, page_title')
        .order('timestamp', { ascending: false })
        .limit(100);
        
      if (topPagesError) {
        throw new Error('Failed to load top pages');
      }
      
      // Aggregate page views
      const pageViewsMap = {};
      topPagesData?.forEach(page => {
        const url = page.page_url;
        if (!pageViewsMap[url]) {
          pageViewsMap[url] = {
            url,
            title: page.page_title,
            views: 0,
          };
        }
        pageViewsMap[url].views++;
      });
      
      setTopPages(Object.values(pageViewsMap)
        .sort((a, b) => b.views - a.views)
        .slice(0, 10));
      
      // Load top events
      const { data: topEventsData, error: topEventsError } = await supabase
        .from('events')
        .select('event_name, category, action')
        .order('timestamp', { ascending: false })
        .limit(100);
        
      if (topEventsError) {
        throw new Error('Failed to load top events');
      }
      
      // Aggregate events
      const eventsMap = {};
      topEventsData?.forEach(event => {
        const key = `${event.category}_${event.action}`;
        if (!eventsMap[key]) {
          eventsMap[key] = {
            category: event.category,
            action: event.action,
            count: 0,
          };
        }
        eventsMap[key].count++;
      });
      
      setTopEvents(Object.values(eventsMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10));
      
      // Load user activity over time
      const { data: userActivityData, error: userActivityError } = await supabase
        .from('events')
        .select('timestamp, user_id')
        .order('timestamp', { ascending: true });
        
      if (userActivityError) {
        throw new Error('Failed to load user activity');
      }
      
      // Group by day
      const activityByDay = {};
      userActivityData?.forEach(event => {
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        if (!activityByDay[date]) {
          activityByDay[date] = {
            date,
            activeUsers: new Set(),
            totalEvents: 0,
          };
        }
        if (event.user_id) {
          activityByDay[date].activeUsers.add(event.user_id);
        }
        activityByDay[date].totalEvents++;
      });
      
      // Convert sets to counts
      setUserActivity(Object.values(activityByDay).map(day => ({
        date: day.date,
        activeUsers: day.activeUsers.size,
        totalEvents: day.totalEvents,
      })));
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const trackEvent = async (category: string, action: string, label?: string, value?: number, properties?: Record<string, any>) => {
    return analyticsService.event(category, action, label, value, properties);
  };

  const trackPageView = async (path: string, title?: string) => {
    return analyticsService.pageView(path, title);
  };

  const runAnalyticsQuery = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('run_analytics_query', {
        query_string: query
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Query failed:', err);
      setError('Failed to run query. Please check your query parameters and try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    summary,
    topPages,
    topEvents,
    userActivity,
    loadAnalyticsData,
    trackEvent,
    trackPageView,
    runAnalyticsQuery
  };
}