import React from 'react';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { ContentItem } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  contentItems: ContentItem[];
}

const statusIcons = {
  draft: Clock,
  scheduled: Clock,
  published: CheckCircle,
  failed: XCircle,
};

const statusColors = {
  draft: 'text-gray-500',
  scheduled: 'text-yellow-500',
  published: 'text-green-500',
  failed: 'text-red-500',
};

export function RecentActivity({ contentItems }: RecentActivityProps) {
  const recentItems = contentItems
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentItems.map((item) => {
          const StatusIcon = statusIcons[item.status];
          return (
            <div key={item.id} className="flex items-center space-x-3">
              <StatusIcon className={`w-5 h-5 ${statusColors[item.status]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">
                  {item.status === 'published' ? 'Published' : 
                   item.status === 'scheduled' ? 'Scheduled' : 
                   item.status === 'draft' ? 'Saved as draft' : 'Failed to publish'} 
                  {' '}{formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex -space-x-1">
                {item.platforms.slice(0, 3).map((platform, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center"
                    title={platform.type}
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {platform.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}