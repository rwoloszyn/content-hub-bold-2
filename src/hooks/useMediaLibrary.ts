import { useState, useEffect } from 'react';
import { MediaItem, MediaFolder } from '../types/media';

// Mock data for demonstration
const mockMediaItems: MediaItem[] = [
  {
    id: 'media-1',
    name: 'hero-banner.jpg',
    url: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnail: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=300',
    type: 'image',
    size: 2048576,
    dimensions: '1920x1080',
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    folderId: 'folder-1',
    tags: ['marketing', 'hero', 'banner'],
    isFavorite: true,
    metadata: { width: 1920, height: 1080, format: 'JPEG' },
  },
  {
    id: 'media-2',
    name: 'product-demo.mp4',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300',
    type: 'video',
    size: 5242880,
    dimensions: '1280x720',
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ['product', 'demo', 'video'],
    isFavorite: false,
    metadata: { width: 1280, height: 720, duration: 30, format: 'MP4' },
  },
  {
    id: 'media-3',
    name: 'brand-guidelines.pdf',
    url: '/documents/brand-guidelines.pdf',
    type: 'document',
    size: 1048576,
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    folderId: 'folder-2',
    tags: ['brand', 'guidelines', 'document'],
    isFavorite: false,
    metadata: { format: 'PDF' },
  },
  {
    id: 'media-4',
    name: 'social-post-1.jpg',
    url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
    type: 'image',
    size: 1536000,
    dimensions: '1080x1080',
    uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    folderId: 'folder-1',
    tags: ['social', 'instagram', 'square'],
    isFavorite: true,
    metadata: { width: 1080, height: 1080, format: 'JPEG' },
  },
  {
    id: 'media-5',
    name: 'team-photo.jpg',
    url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300',
    type: 'image',
    size: 3072000,
    dimensions: '1920x1280',
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ['team', 'corporate', 'people'],
    isFavorite: false,
    metadata: { width: 1920, height: 1280, format: 'JPEG' },
  },
];

const mockFolders: MediaFolder[] = [
  {
    id: 'folder-1',
    name: 'Marketing Assets',
    itemCount: 2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'folder-2',
    name: 'Brand Resources',
    itemCount: 1,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'folder-3',
    name: 'Social Media',
    itemCount: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export function useMediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMediaItems(mockMediaItems);
      setFolders(mockFolders);
      setLoading(false);
    };

    loadData();
  }, []);

  const uploadMedia = async (files: File[], folderId?: string, tags?: string[]) => {
    // Simulate upload process
    const newItems: MediaItem[] = files.map(file => ({
      id: `media-${Date.now()}-${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      size: file.size,
      uploadedAt: new Date(),
      folderId,
      tags: tags || [],
      isFavorite: false,
      metadata: {
        format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
      },
    }));

    setMediaItems(prev => [...newItems, ...prev]);

    // Update folder item count
    if (folderId) {
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId 
            ? { ...folder, itemCount: folder.itemCount + files.length }
            : folder
        )
      );
    }
  };

  const deleteMedia = (id: string) => {
    const item = mediaItems.find(item => item.id === id);
    setMediaItems(prev => prev.filter(item => item.id !== id));

    // Update folder item count
    if (item?.folderId) {
      setFolders(prev => 
        prev.map(folder => 
          folder.id === item.folderId 
            ? { ...folder, itemCount: Math.max(0, folder.itemCount - 1) }
            : folder
        )
      );
    }
  };

  const updateMedia = (id: string, updates: Partial<MediaItem>) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const createFolder = (name: string, parentId?: string) => {
    const newFolder: MediaFolder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      itemCount: 0,
      createdAt: new Date(),
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = (folderId: string) => {
    // Move items from deleted folder to root
    setMediaItems(prev => 
      prev.map(item => 
        item.folderId === folderId 
          ? { ...item, folderId: undefined }
          : item
      )
    );
    
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
  };

  const moveToFolder = (itemId: string, folderId: string) => {
    const item = mediaItems.find(item => item.id === itemId);
    if (!item) return;

    // Update item folder
    setMediaItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, folderId }
          : item
      )
    );

    // Update folder counts
    setFolders(prev => 
      prev.map(folder => {
        if (folder.id === item.folderId) {
          return { ...folder, itemCount: Math.max(0, folder.itemCount - 1) };
        }
        if (folder.id === folderId) {
          return { ...folder, itemCount: folder.itemCount + 1 };
        }
        return folder;
      })
    );
  };

  return {
    mediaItems,
    folders,
    loading,
    uploadMedia,
    deleteMedia,
    updateMedia,
    createFolder,
    deleteFolder,
    moveToFolder,
  };
}