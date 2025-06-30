import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Calendar,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import { PerformanceChart } from './PerformanceChart';
import { PlatformBreakdown } from './PlatformBreakdown';
import { TopContent } from './TopContent';
import { AudienceInsights } from './AudienceInsights';
import { EngagementTrends } from './EngagementTrends';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { withPerformanceMonitoring } from '../PerformanceMonitor';
import { sentryService } from '../../services/sentryService';
import { ErrorBoundary } from '../ErrorBoundary';

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '1y', label: 'Last year' },
];

const platforms = [
  { value: 'all', label: 'All Platforms' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
];

function AnalyticsComponent() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'audience' | 'content' | 'advanced'>('overview');
  const [error, setError] = useState<Error | null>(null);

  const overallMetrics = {
    totalReach: 125420,
    totalEngagement: 8934,
    totalImpressions: 245680,
    engagementRate: 7.1,
    followerGrowth: 12.5,
    clickThroughRate: 2.8,
  };

  useEffect(() => {
    // Add breadcrumb for analytics view
    sentryService.addBreadcrumb({
      category: 'analytics',
      message: `Viewing ${activeTab} analytics`,
      data: { timeRange: selectedTimeRange, platform: selectedPlatform },
      level: 'info'
    });
    
    // Set tags for analytics context
    sentryService.setTags({
      'analytics.tab': activeTab,
      'analytics.timeRange': selectedTimeRange,
      'analytics.platform': selectedPlatform
    });
  }, [activeTab, selectedTimeRange, selectedPlatform]);

  const handleExportData = () => {
    try {
      // Simulate an error for testing Sentry (1% chance)
      if (Math.random() < 0.01) {
        throw new Error('Test error in analytics export');
      }
      
      console.log('Exporting analytics data...');
      // TODO: Implement data export functionality
      
      // Add breadcrumb for export
      sentryService.addBreadcrumb({
        category: 'analytics',
        message: 'Exported analytics data',
        data: { timeRange: selectedTimeRange, platform: selectedPlatform },
        level: 'info'
      });
    } catch (err) {
      // Capture the error in Sentry
      sentryService.captureException(err instanceof Error ? err : new Error(String(err)));
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800 mb-1">Error loading analytics</h3>
            <p className="text-red-700 mb-3">{error.message}</p>
            <button 
              onClick={() => setError(null)}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {platforms.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
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
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'engagement', label: 'Engagement', icon: Heart },
            { id: 'audience', label: 'Audience', icon: Users },
            { id: 'content', label: 'Content Performance', icon: TrendingUp },
            { id: 'advanced', label: 'Advanced Analytics', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <ErrorBoundary fallback={(error, resetError) => (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">Error loading analytics data</h3>
              <p className="text-red-700 mb-3">{error.message}</p>
              <button 
                onClick={resetError}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <AnalyticsCard
                title="Total Reach"
                value={overallMetrics.totalReach.toLocaleString()}
                change={{ value: 15.2, type: 'increase' }}
                icon={Eye}
                color="primary"
              />
              <AnalyticsCard
                title="Engagement"
                value={overallMetrics.totalEngagement.toLocaleString()}
                change={{ value: 8.7, type: 'increase' }}
                icon={Heart}
                color="success"
              />
              <AnalyticsCard
                title="Impressions"
                value={overallMetrics.totalImpressions.toLocaleString()}
                change={{ value: 12.3, type: 'increase' }}
                icon={Activity}
                color="accent"
              />
              <AnalyticsCard
                title="Engagement Rate"
                value={`${overallMetrics.engagementRate}%`}
                change={{ value: 2.1, type: 'increase' }}
                icon={TrendingUp}
                color="secondary"
              />
              <AnalyticsCard
                title="Follower Growth"
                value={`+${overallMetrics.followerGrowth}%`}
                change={{ value: 5.4, type: 'increase' }}
                icon={Users}
                color="success"
              />
              <AnalyticsCard
                title="Click-Through Rate"
                value={`${overallMetrics.clickThroughRate}%`}
                change={{ value: 0.3, type: 'decrease' }}
                icon={Share2}
                color="warning"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart timeRange={selectedTimeRange} />
              <PlatformBreakdown platform={selectedPlatform} />
            </div>

            {/* Engagement Trends */}
            <EngagementTrends timeRange={selectedTimeRange} />
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Total Likes"
                value="5,234"
                change={{ value: 12.5, type: 'increase' }}
                icon={Heart}
                color="success"
              />
              <AnalyticsCard
                title="Comments"
                value="1,892"
                change={{ value: 8.3, type: 'increase' }}
                icon={MessageCircle}
                color="primary"
              />
              <AnalyticsCard
                title="Shares"
                value="1,808"
                change={{ value: 15.7, type: 'increase' }}
                icon={Share2}
                color="accent"
              />
              <AnalyticsCard
                title="Saves"
                value="967"
                change={{ value: 22.1, type: 'increase' }}
                icon={Calendar}
                color="secondary"
              />
            </div>
            <EngagementTrends timeRange={selectedTimeRange} detailed />
          </div>
        )}

        {activeTab === 'audience' && (
          <AudienceInsights timeRange={selectedTimeRange} />
        )}

        {activeTab === 'content' && (
          <TopContent timeRange={selectedTimeRange} platform={selectedPlatform} />
        )}
        
        {activeTab === 'advanced' && (
          <AnalyticsDashboard />
        )}
      </ErrorBoundary>
    </div>
  );
}

// Wrap the component with performance monitoring
export const Analytics = withPerformanceMonitoring(AnalyticsComponent, {
  id: 'analytics-page',
  description: 'Analytics dashboard performance monitoring'
});