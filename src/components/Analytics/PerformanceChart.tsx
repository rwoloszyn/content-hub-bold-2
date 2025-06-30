import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceChartProps {
  timeRange: string;
}

export function PerformanceChart({ timeRange }: PerformanceChartProps) {
  // Mock data for demonstration
  const chartData = [
    { date: 'Jan 1', reach: 12000, engagement: 850, impressions: 18000 },
    { date: 'Jan 8', reach: 15000, engagement: 1200, impressions: 22000 },
    { date: 'Jan 15', reach: 18000, engagement: 1450, impressions: 26000 },
    { date: 'Jan 22', reach: 16000, engagement: 1100, impressions: 24000 },
    { date: 'Jan 29', reach: 20000, engagement: 1600, impressions: 30000 },
    { date: 'Feb 5', reach: 22000, engagement: 1800, impressions: 32000 },
    { date: 'Feb 12', reach: 25000, engagement: 2100, impressions: 35000 },
  ];

  const maxReach = Math.max(...chartData.map(d => d.reach));
  const maxEngagement = Math.max(...chartData.map(d => d.engagement));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-gray-600">Reach</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
            <span className="text-gray-600">Engagement</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between space-x-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex flex-col items-center space-y-1">
                {/* Reach Bar */}
                <div
                  className="w-full bg-primary-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${(data.reach / maxReach) * 180}px` }}
                  title={`Reach: ${data.reach.toLocaleString()}`}
                ></div>
                {/* Engagement Bar */}
                <div
                  className="w-full bg-accent-500 rounded-b-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${(data.engagement / maxEngagement) * 60}px` }}
                  title={`Engagement: ${data.engagement.toLocaleString()}`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{data.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">125.4K</p>
          <p className="text-sm text-gray-600">Total Reach</p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+15.2%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">8.9K</p>
          <p className="text-sm text-gray-600">Total Engagement</p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8.7%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">7.1%</p>
          <p className="text-sm text-gray-600">Engagement Rate</p>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+2.1%</span>
          </div>
        </div>
      </div>
    </div>
  );
}