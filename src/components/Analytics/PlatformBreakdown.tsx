import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface PlatformBreakdownProps {
  platform: string;
}

const platformData = [
  {
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    reach: 45000,
    engagement: 3200,
    posts: 12,
    growth: 8.5,
  },
  {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    reach: 38000,
    engagement: 2800,
    posts: 15,
    growth: 12.3,
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0A66C2',
    reach: 28000,
    engagement: 1900,
    posts: 8,
    growth: 15.7,
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: '#1DA1F2',
    reach: 14420,
    engagement: 1034,
    posts: 18,
    growth: 5.2,
  },
];

export function PlatformBreakdown({ platform }: PlatformBreakdownProps) {
  const totalReach = platformData.reduce((sum, p) => sum + p.reach, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Breakdown</h3>
      
      <div className="space-y-4">
        {platformData.map((platformItem) => {
          const Icon = platformItem.icon;
          const percentage = (platformItem.reach / totalReach) * 100;
          
          return (
            <div key={platformItem.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${platformItem.color}20` }}
                  >
                    <Icon 
                      className="w-4 h-4" 
                      style={{ color: platformItem.color }}
                    />
                  </div>
                  <span className="font-medium text-gray-900">{platformItem.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {platformItem.reach.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: platformItem.color 
                  }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{platformItem.engagement.toLocaleString()} engagement</span>
                <span className="text-green-600">+{platformItem.growth}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalReach.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Reach</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {platformData.reduce((sum, p) => sum + p.posts, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Posts</p>
          </div>
        </div>
      </div>
    </div>
  );
}