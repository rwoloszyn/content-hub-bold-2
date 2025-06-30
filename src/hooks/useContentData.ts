import { useState, useEffect } from 'react';
import { ContentItem, CalendarEvent, Platform } from '../types';
import { mockContentItems, mockCalendarEvents, mockPlatforms } from '../utils/mockData';
import { analyticsService } from '../services/analyticsService';

export function useContentData() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContentItems(mockContentItems);
      setCalendarEvents(mockCalendarEvents);
      setPlatforms(mockPlatforms);
      setLoading(false);
    };

    loadData();
  }, []);

  const addContentItem = (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: ContentItem = {
      ...item,
      id: `content-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setContentItems(prev => [newItem, ...prev]);

    // Track content creation
    analyticsService.trackContentCreated(item.type);
    
    return newItem;
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      )
    );

    // Track content update
    analyticsService.event('Content', 'Updated', updates.type || 'unknown');
  };

  const deleteContentItem = (id: string) => {
    // Track content deletion
    const item = contentItems.find(item => item.id === id);
    if (item) {
      analyticsService.event('Content', 'Deleted', item.type);
    }
    
    setContentItems(prev => prev.filter(item => item.id !== id));
    setCalendarEvents(prev => prev.filter(event => event.contentId !== id));
  };

  const scheduleContent = (contentId: string, date: Date, time: string, platforms: string[]) => {
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: contentItems.find(item => item.id === contentId)?.title || 'Untitled',
      date,
      time,
      platforms: platforms as any[],
      status: 'scheduled',
      contentId,
    };
    setCalendarEvents(prev => [...prev, newEvent]);

    // Track content scheduling
    analyticsService.event('Content', 'Scheduled', platforms.join(','));
  };

  return {
    contentItems,
    calendarEvents,
    platforms,
    loading,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    scheduleContent,
  };
}