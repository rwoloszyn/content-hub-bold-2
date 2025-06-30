import { useState, useEffect } from 'react';
import { ContentItem, CalendarEvent, Platform } from '../types';
import { mockContentItems, mockCalendarEvents, mockPlatforms } from '../utils/mockData';

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
  };

  const deleteContentItem = (id: string) => {
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