import React from 'react';
import { Filter, Calendar, Tag, Star } from 'lucide-react';

interface MediaFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function MediaFilters({ onFilterChange }: MediaFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="space-y-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Date
          </label>
          <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Any time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
          </select>
        </div>

        {/* File Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Size
          </label>
          <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Any size</option>
            <option value="small">Small (&lt; 1MB)</option>
            <option value="medium">Medium (1-10MB)</option>
            <option value="large">Large (&gt; 10MB)</option>
          </select>
        </div>

        {/* Favorites */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">Favorites only</span>
          </label>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="space-y-2">
            {['marketing', 'social-media', 'campaign', 'product'].map((tag) => (
              <label key={tag} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}