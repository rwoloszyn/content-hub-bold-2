import React from 'react';
import { TrendingUp, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

interface EngagementTrendsProps {
  timeRange: string;
  detailed?: boolean;
}

export function EngagementTrends({ timeRange, detailed = false }: EngagementTrendsProps) {
  const engagementData = [
    { date: 'Jan 1', likes: 450, comments: 89, shares: 67, views: 2400 },
    { date: 'Jan 8', likes: 520, comments: 102, shares: 78, views: 2800 },
    { date: 'Jan 15', likes: 680, comments: 134, shares: 95, views: 3200 },
    { date: 'Jan 22', likes: 590, comments: 118, shares: 82, views: 2900 },
    { date: 'Jan 29', likes: 750, comments: 156, shares: 112, views: 3600 },
    { date: 'Feb 5', likes: 820, comments: 178, shares: 134, views: 3900 },
    { date: 'Feb 12', likes: 920, comments: 198, shares: 156, views: 4200 },
  ];

  const maxValue = Math.max(...engagementData.flatMap(d => [d.likes, d.comments, d.shares, d.views]));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {detailed ? 'Detailed Engagement Trends' : 'Engagement Trends'}
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-gray-600">Likes</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">Comments</span>
          </div>
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">Shares</span>
          </div>
          {detailed && (
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">Views</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between space-x-1">
          {engagementData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex flex-col items-center justify-end h-full space-y-1">
                {detailed && (
                  <div
                    className="w-full bg-purple-500 rounded-t-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ height: `${(data.views / maxValue) * 200}px` }}
                    title={`Views: ${data.views.toLocaleString()}`}
                  ></div>
                )}
                <div
                  className="w-full bg-red-500 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${(data.likes / maxValue) * 150}px` }}
                  title={`Likes: ${data.likes.toLocaleString()}`}
                ></div>
                <div
                  className="w-full bg-blue-500 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${(data.comments / maxValue) * 100}px` }}
                  title={`Comments: ${data.comments.toLocaleString()}`}
                ></div>
                <div
                  className="w-full bg-green-500 rounded-b-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${(data.shares / maxValue) * 80}px` }}
                  title={`Shares: ${data.shares.toLocaleString()}`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{data.date}</span>
            </div>
          ))}
        </div>
      </div>

      {detailed && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-semibold text-gray-900">4.7K</span>
            </div>
            <p className="text-sm text-gray-600">Total Likes</p>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+18.5%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-semibold text-gray-900">975</span>
            </div>
            <p className="text-sm text-gray-600">Total Comments</p>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+22.3%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Share2 className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-semibold text-gray-900">724</span>
            </div>
            <p className="text-sm text-gray-600">Total Shares</p>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+15.7%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-purple-500 mr-2" />
              <span className="font-semibold text-gray-900">23.1K</span>
            </div>
            <p className="text-sm text-gray-600">Total Views</p>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.8%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}