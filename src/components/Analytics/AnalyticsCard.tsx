import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const colorClasses = {
  primary: 'bg-primary-500 text-primary-50',
  secondary: 'bg-secondary-500 text-secondary-50',
  accent: 'bg-accent-500 text-accent-50',
  success: 'bg-green-500 text-green-50',
  warning: 'bg-yellow-500 text-yellow-50',
  error: 'bg-red-500 text-red-50',
};

export function AnalyticsCard({ title, value, change, icon: Icon, color }: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className={change.type === 'increase' ? 'text-green-600' : 'text-red-600'}>
              {change.type === 'increase' ? '↗' : '↘'} {Math.abs(change.value)}%
            </span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}