import React, { useState } from 'react';
import { 
  Image, 
  Video, 
  File, 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Edit3, 
  Copy, 
  Eye, 
  Star,
  Calendar,
  HardDrive
} from 'lucide-react';
import { MediaItem } from '../../types/media';
import { format } from 'date-fns';

interface MediaGridProps {
  items: MediaItem[];
  viewMode: 'grid' | 'list';
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onSelectAll: () => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<MediaItem>) => void;
  loading: boolean;
}

export function MediaGrid({
  items,
  viewMode,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDeleteItem,
  onUpdateItem,
  loading
}: MediaGridProps) {
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      default:
        return File;
    }
  };

  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleFavorite = (item: MediaItem) => {
    onUpdateItem(item.id, { isFavorite: !item.isFavorite });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
          <p className="text-gray-600">Upload your first media file to get started</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.length === items.length}
              onChange={onSelectAll}
              className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-500">
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {items.map((item) => {
            const Icon = getFileIcon(item.type);
            return (
              <div
                key={item.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  selectedItems.includes(item.id) ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onSelectItem(item.id)}
                    className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  
                  <div className="grid grid-cols-12 gap-4 w-full items-center">
                    <div className="col-span-5 flex items-center space-x-3">
                      {item.type === 'image' ? (
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        {item.tags.length > 0 && (
                          <p className="text-xs text-gray-500 truncate">
                            {item.tags.join(', ')}
                          </p>
                        )}
                      </div>
                      {item.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">{formatFileSize(item.size)}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">
                        {format(new Date(item.uploadedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div className="col-span-1">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => {
          const Icon = getFileIcon(item.type);
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group ${
                selectedItems.includes(item.id) ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="relative">
                {item.type === 'image' ? (
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
                ) : item.type === 'video' ? (
                  <div className="w-full h-32 bg-gray-900 flex items-center justify-center relative">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Video className="w-8 h-8 text-white" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onSelectItem(item.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 bg-white bg-opacity-90"
                  />
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleFavorite(item)}
                    className={`p-1 rounded-full ${
                      item.isFavorite 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white bg-opacity-90 text-gray-600 hover:text-yellow-500'
                    } transition-colors`}
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-1 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-1 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatFileSize(item.size)}</span>
                  <span>{format(new Date(item.uploadedAt), 'MMM d')}</span>
                </div>
                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-full overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{previewItem.name}</h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-4">
              {previewItem.type === 'image' ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-w-full max-h-96 mx-auto"
                />
              ) : previewItem.type === 'video' ? (
                <video
                  src={previewItem.url}
                  controls
                  className="max-w-full max-h-96 mx-auto"
                />
              ) : (
                <div className="text-center py-8">
                  <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                </div>
              )}
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Size:</span>
                  <span className="ml-2 text-gray-600">{formatFileSize(previewItem.size)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600 capitalize">{previewItem.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Uploaded:</span>
                  <span className="ml-2 text-gray-600">
                    {format(new Date(previewItem.uploadedAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span>
                  <span className="ml-2 text-gray-600">
                    {previewItem.dimensions || 'N/A'}
                  </span>
                </div>
              </div>
              
              {previewItem.tags.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Tags:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => handleDownload(previewItem)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}