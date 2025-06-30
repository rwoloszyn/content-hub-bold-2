export interface MediaItem {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  type: 'image' | 'video' | 'document';
  size: number;
  dimensions?: string;
  uploadedAt: Date;
  folderId?: string;
  tags: string[];
  isFavorite: boolean;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
  };
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  itemCount: number;
  createdAt: Date;
}

export interface MediaUploadProgress {
  fileId: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}