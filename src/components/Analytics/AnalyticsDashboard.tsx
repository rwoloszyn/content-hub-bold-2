import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  Calendar, 
  Users, 
  Eye, 
  Zap, 
  DollarSign,
  RefreshCw,
  Download,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { AnalyticsQueryBuilder } from './AnalyticsQueryBuilder';

export function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
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
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [savedQueries, setSavedQueries] = useState<Array<{ name: string, query: string }>>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'query-builder'>('dashboard');

  useEffect(() => {
    loadAnalyticsData();
    loadSavedQueries();
  }, []);

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

  const loadSavedQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_queries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setSavedQueries(data || []);
    } catch (err) {
      console.error('Failed to load saved queries:', err);
    }
  };

  const handleRunQuery = (results: any[], query: string) => {
    setQueryResults(results);
    setCurrentQuery(query);
  };

  const handleSaveQuery = async (name: string, query: string) => {
    try {
      const { error } = await supabase
        .from('saved_queries')
        .insert({
          name,
          query,
          created_at: new Date().toISOString(),
        });
        
      if (error) {
        throw error;
      }
      
      // Reload saved queries
      loadSavedQueries();
    } catch (err) {
      console.error('Failed to save query:', err);
      setError('Failed to save query. Please try again.');
    }
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleExportData = () => {
    // This would export the data to CSV
    console.log('Export data');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Track and analyze your content performance and user behavior
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'dashboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('query-builder')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'query-builder'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Query Builder</span>
          </button>
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {activeTab === 'dashboard' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{summary.pageViews.toLocaleString()}</h3>
              <p className="text-gray-600">Page Views</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{summary.events.toLocaleString()}</h3>
              <p className="text-gray-600">Total Events</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{summary.activeUsers.toLocaleString()}</h3>
              <p className="text-gray-600">Active Users</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{summary.conversionRate}%</h3>
              <p className="text-gray-600">Conversion Rate</p>
            </div>
          </div>

          {/* User Activity Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ) : userActivity.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No activity data available
              </div>
            ) : (
              <div className="h-64 relative">
                {/* This would be a real chart in a production app */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <LineChart className="w-16 h-16 text-gray-300" />
                  <span className="absolute text-gray-500">User Activity Chart Placeholder</span>
                </div>
              </div>
            )}
          </div>

          {/* Top Pages and Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : topPages.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No page view data available
                </div>
              ) : (
                <div className="space-y-3">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={page.url}>
                          {page.title || page.url}
                        </p>
                        <p className="text-xs text-gray-500 truncate" title={page.url}>
                          {page.url}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {page.views} views
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Events</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : topEvents.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No event data available
                </div>
              ) : (
                <div className="space-y-3">
                  {topEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.category} / {event.action}
                        </p>
                      </div>
                      <div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {event.count} times
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Query Builder */}
          <AnalyticsQueryBuilder 
            onRunQuery={handleRunQuery} 
            onSaveQuery={handleSaveQuery} 
          />

          {/* Saved Queries */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Queries</h3>
            
            {savedQueries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No saved queries yet. Build and save a query to see it here.
              </div>
            ) : (
              <div className="space-y-3">
                {savedQueries.map((savedQuery, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{savedQuery.name}</h4>
                      <button
                        onClick={() => {
                          // Load and run this query
                          setCurrentQuery(savedQuery.query);
                          // This would parse and set up the query builder UI
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Load Query
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                      {savedQuery.query}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Query Results */}
          {queryResults.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Query Results</h3>
                <button
                  onClick={handleExportData}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Results</span>
                </button>
              </div>
              
              <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded mb-4 overflow-x-auto">
                {currentQuery}
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(queryResults[0] || {}).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {queryResults.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value: any, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}