export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'post' | 'article' | 'video' | 'image';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platforms: Platform[];
  scheduledDate?: Date;
  publishedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  tags: string[];
  aiGenerated?: boolean;
  mediaUrl?: string;
  preview?: {
    [key in PlatformType]?: PlatformPreview;
  };
}

export type Platform = {
  type: PlatformType;
  connected: boolean;
  username?: string;
  lastSync?: Date;
  followers?: number;
  engagement?: string;
  scheduledPosts?: number;
  accountId?: string;
  connectedAt?: Date;
};

export type PlatformType = 
  | 'facebook' 
  | 'instagram' 
  | 'twitter' 
  | 'linkedin' 
  | 'pinterest' 
  | 'tiktok' 
  | 'wordpress' 
  | 'medium';

export interface PlatformPreview {
  text: string;
  truncated: boolean;
  charCount: number;
  charLimit: number;
  aspectRatio?: string;
  imageUrl?: string;
}

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'social' | 'blog' | 'marketing' | 'creative' | 'video';
  variables: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  platforms: PlatformType[];
  status: 'scheduled' | 'published' | 'failed';
  contentId: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}