import React from 'react';
import { FileText, Calendar, Share2, TrendingUp, Users, Eye } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { UpcomingPosts } from './UpcomingPosts';
import { ContentItem, CalendarEvent } from '../../types';

interface DashboardProps {
  contentItems: ContentItem[];
  calendarEvents: CalendarEvent[];
}

export function Dashboard({ contentItems, calendarEvents }: DashboardProps) {
  const stats = {
    totalContent: contentItems.length,
    publishedThisMonth: contentItems.filter(item => 
      item.status === 'published' && 
      item.publishedDate && 
      new Date(item.publishedDate).getMonth() === new Date().getMonth()
    ).length,
    scheduledPosts: contentItems.filter(item => item.status === 'scheduled').length,
    draftContent: contentItems.filter(item => item.status === 'draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Content"
          value={stats.totalContent}
          change={{ value: 12, type: 'increase' }}
          icon={FileText}
          color="primary"
        />
        <StatsCard
          title="Published This Month"
          value={stats.publishedThisMonth}
          change={{ value: 8, type: 'increase' }}
          icon={TrendingUp}
          color="success"
        />
        <StatsCard
          title="Scheduled Posts"
          value={stats.scheduledPosts}
          icon={Calendar}
          color="accent"
        />
        <StatsCard
          title="Draft Content"
          value={stats.draftContent}
          icon={FileText}
          color="secondary"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
            <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                <p className="text-gray-500">Analytics chart would go here</p>
                <p className="text-sm text-gray-400 mt-1">Connect platforms to see detailed metrics</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <RecentActivity contentItems={contentItems} />
        </div>
      </div>

      {/* Platform Overview and Upcoming Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
          <div className="space-y-4">
            {[
              { name: 'Facebook', posts: 12, engagement: '4.2k', color: 'bg-blue-500' },
              { name: 'Instagram', posts: 8, engagement: '2.8k', color: 'bg-pink-500' },
              { name: 'LinkedIn', posts: 6, engagement: '1.9k', color: 'bg-blue-600' },
              { name: 'Twitter', posts: 15, engagement: '3.1k', color: 'bg-sky-500' },
            ].map((platform) => (
              <div key={platform.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                  <span className="font-medium text-gray-900">{platform.name}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{platform.posts} posts</span>
                  <span>{platform.engagement} engagement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <UpcomingPosts events={calendarEvents} />
        </div>
      </div>
    </div>
  );
}