import { ContentItem, CalendarEvent, Platform, User } from '../types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Sarah Johnson',
  email: 'sarah@contenthub.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
};

export const mockPlatforms: Platform[] = [
  { 
    type: 'facebook', 
    connected: true, 
    username: 'sarah.johnson', 
    lastSync: new Date(),
    followers: 12500,
    engagement: '4.2%',
    scheduledPosts: 3,
    accountId: 'fb_123456789',
    connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  { 
    type: 'instagram', 
    connected: true, 
    username: '@sarahjohnson', 
    lastSync: new Date(),
    followers: 8900,
    engagement: '6.8%',
    scheduledPosts: 5,
    accountId: 'ig_987654321',
    connectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  { 
    type: 'twitter', 
    connected: true, 
    username: '@sarahjohnson', 
    lastSync: new Date(),
    followers: 5600,
    engagement: '3.1%',
    scheduledPosts: 2,
    accountId: 'tw_456789123',
    connectedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
  },
  { 
    type: 'linkedin', 
    connected: true, 
    username: 'Sarah Johnson', 
    lastSync: new Date(),
    followers: 3400,
    engagement: '5.9%',
    scheduledPosts: 1,
    accountId: 'li_789123456',
    connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  { type: 'pinterest', connected: false },
  { type: 'tiktok', connected: false },
  { 
    type: 'wordpress', 
    connected: true, 
    username: 'sarahjohnson.blog', 
    lastSync: new Date(),
    followers: 2100,
    engagement: '8.4%',
    scheduledPosts: 1,
    accountId: 'wp_321654987',
    connectedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
  },
  { type: 'medium', connected: false },
];

export const mockContentItems: ContentItem[] = [
  {
    id: 'content-1',
    title: '5 Tips for Better Content Marketing',
    content: 'Content marketing is evolving rapidly. Here are 5 essential tips to stay ahead: 1) Focus on value-driven content 2) Leverage AI tools effectively 3) Maintain consistent brand voice 4) Optimize for multiple platforms 5) Track and analyze performance metrics.',
    type: 'post',
    status: 'published',
    platforms: [
      { type: 'facebook', connected: true, username: 'sarah.johnson' },
      { type: 'linkedin', connected: true, username: 'Sarah Johnson' },
    ],
    publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    author: mockUser,
    tags: ['marketing', 'content', 'tips'],
    aiGenerated: true,
    mediaUrl: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'content-2',
    title: 'The Future of AI in Creative Industries',
    content: 'Artificial Intelligence is transforming how we create, distribute, and consume content. From automated video editing to personalized content recommendations, AI is becoming an indispensable tool for creators and marketers alike.',
    type: 'article',
    status: 'scheduled',
    platforms: [
      { type: 'wordpress', connected: true, username: 'sarahjohnson.blog' },
      { type: 'medium', connected: false },
    ],
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    author: mockUser,
    tags: ['ai', 'creativity', 'future', 'technology'],
    aiGenerated: false,
    mediaUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'content-3',
    title: 'Quick Tutorial: Social Media Automation',
    content: 'Learn how to automate your social media posting while maintaining authenticity and engagement. This quick guide covers the best tools and practices.',
    type: 'video',
    status: 'draft',
    platforms: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    author: mockUser,
    tags: ['tutorial', 'automation', 'social-media'],
    aiGenerated: false,
    mediaUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'The Future of AI in Creative Industries',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: '09:00',
    platforms: ['wordpress'],
    status: 'scheduled',
    contentId: 'content-2',
  },
  {
    id: 'event-2',
    title: 'Weekly Newsletter',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '10:00',
    platforms: ['linkedin', 'facebook'],
    status: 'scheduled',
    contentId: 'content-4',
  },
];