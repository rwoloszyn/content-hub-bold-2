import React from 'react';
import { 
  MoreHorizontal, 
  Calendar, 
  Edit3, 
  Trash2, 
  Copy, 
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { ContentItem } from '../../types';
import { format } from 'date-fns';

interface ContentCardProps {
  content: ContentItem;
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (content: ContentItem) => void;
  onSchedule: (content: ContentItem) => void;
}

const statusIcons = {
  draft: Clock,
  scheduled: Calendar,
  published: CheckCircle,
  failed: XCircle,
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export function ContentCard({ 
  content, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onSchedule 
}: ContentCardProps) {
  const StatusIcon = statusIcons[content.status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      {content.mediaUrl && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={content.mediaUrl}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {content.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {content.content}
            </p>
          </div>
          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[content.status]}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
          </div>
          
          {content.aiGenerated && (
            <div className="flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
              AI Generated
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>
            {content.status === 'published' && content.publishedDate
              ? `Published ${format(new Date(content.publishedDate), 'MMM d')}`
              : content.status === 'scheduled' && content.scheduledDate
              ? `Scheduled ${format(new Date(content.scheduledDate), 'MMM d')}`
              : `Updated ${format(new Date(content.updatedAt), 'MMM d')}`}
          </span>
          
          <div className="flex -space-x-1">
            {content.platforms.slice(0, 3).map((platform, index) => (
              <div
                key={index}
                className="w-5 h-5 bg-gray-100 rounded-full border border-white flex items-center justify-center"
                title={platform.type}
              >
                <span className="text-xs font-medium text-gray-600">
                  {platform.type.charAt(0).toUpperCase()}
                </span>
              </div>
            ))}
            {content.platforms.length > 3 && (
              <div className="w-5 h-5 bg-gray-200 rounded-full border border-white flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{content.platforms.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(content)}
            className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          
          {content.status === 'draft' && (
            <button
              onClick={() => onSchedule(content)}
              className="flex-1 bg-accent-50 hover:bg-accent-100 text-accent-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
          )}
          
          <button
            onClick={() => onDuplicate(content)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(content.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}