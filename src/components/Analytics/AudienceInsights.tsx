import React from 'react';
import { Users, MapPin, Clock, Smartphone } from 'lucide-react';

interface AudienceInsightsProps {
  timeRange: string;
}

export function AudienceInsights({ timeRange }: AudienceInsightsProps) {
  const demographicData = [
    { ageGroup: '18-24', percentage: 28, color: 'bg-blue-500' },
    { ageGroup: '25-34', percentage: 35, color: 'bg-green-500' },
    { ageGroup: '35-44', percentage: 22, color: 'bg-purple-500' },
    { ageGroup: '45-54', percentage: 12, color: 'bg-yellow-500' },
    { ageGroup: '55+', percentage: 3, color: 'bg-red-500' },
  ];

  const locationData = [
    { country: 'United States', percentage: 45, flag: '🇺🇸' },
    { country: 'Canada', percentage: 18, flag: '🇨🇦' },
    { country: 'United Kingdom', percentage: 12, flag: '🇬🇧' },
    { country: 'Australia', percentage: 8, flag: '🇦🇺' },
    { country: 'Germany', percentage: 7, flag: '🇩🇪' },
    { country: 'Others', percentage: 10, flag: '🌍' },
  ];

  return (
    <div className="space-y-6">
      {/* Audience Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-primary-500" />
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">24.8K</h3>
          <p className="text-gray-600">Total Followers</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-8 h-8 text-green-500" />
            <span className="text-sm text-blue-600 font-medium">6 countries</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">45%</h3>
          <p className="text-gray-600">From United States</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-500" />
            <span className="text-sm text-purple-600 font-medium">Peak time</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">2-4 PM</h3>
          <p className="text-gray-600">Most Active Hours</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Smartphone className="w-8 h-8 text-accent-500" />
            <span className="text-sm text-accent-600 font-medium">Mobile first</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">78%</h3>
          <p className="text-gray-600">Mobile Users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Demographics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Age Demographics</h3>
          <div className="space-y-4">
            {demographicData.map((demo) => (
              <div key={demo.ageGroup} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{demo.ageGroup}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${demo.color}`}
                      style={{ width: `${demo.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{demo.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
          <div className="space-y-4">
            {locationData.map((location) => (
              <div key={location.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{location.flag}</span>
                  <span className="text-sm font-medium text-gray-700">{location.country}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary-500"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{location.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Patterns */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Audience Activity Patterns</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-2">{day}</div>
              <div className="space-y-1">
                {Array.from({ length: 24 }, (_, hour) => {
                  const activity = Math.random() * 100;
                  const intensity = activity > 70 ? 'bg-green-500' : 
                                  activity > 40 ? 'bg-yellow-500' : 
                                  activity > 20 ? 'bg-blue-500' : 'bg-gray-200';
                  return (
                    <div
                      key={hour}
                      className={`w-full h-1 rounded ${intensity}`}
                      title={`${hour}:00 - ${activity.toFixed(0)}% active`}
                    ></div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">High Activity (70%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Medium Activity (40-70%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Low Activity (20-40%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span className="text-gray-600">Minimal Activity (&lt;20%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}