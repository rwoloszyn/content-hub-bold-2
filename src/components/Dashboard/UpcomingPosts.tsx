import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { format, isToday, isTomorrow } from 'date-fns';

interface UpcomingPostsProps {
  events: CalendarEvent[];
}

export function UpcomingPosts({ events }: UpcomingPostsProps) {
  const upcomingEvents = events
    .filter(event => event.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Posts</h3>
      <div className="space-y-4">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming posts scheduled</p>
          </div>
        ) : (
          upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {event.title}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(event.date)} at {event.time}
                </p>
              </div>
              <div className="flex -space-x-1">
                {event.platforms.slice(0, 2).map((platform, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center"
                    title={platform}
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {platform.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ))}
                {event.platforms.length > 2 && (
                  <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{event.platforms.length - 2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}