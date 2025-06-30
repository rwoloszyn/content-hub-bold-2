import React, { useState } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Folder, 
  Image, 
  Video, 
  File,
  Plus,
  MoreHorizontal,
  Download,
  Trash2,
  Edit3,
  Copy,
  Eye,
  Star,
  Tag
} from 'lucide-react';
import { MediaGrid } from './MediaGrid';
import { MediaUpload } from './MediaUpload';
import { MediaFolders } from './MediaFolders';
import { MediaFilters } from './MediaFilters';
import { useMediaLibrary } from '../../hooks/useMediaLibrary';

export function MediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    mediaItems,
    folders,
    loading,
    uploadMedia,
    deleteMedia,
    updateMedia,
    createFolder,
    deleteFolder,
    moveToFolder,
  } = useMediaLibrary();

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || item.folderId === selectedFolder;
    const matchesType = selectedMediaType === 'all' || item.type === selectedMediaType;
    
    return matchesSearch && matchesFolder && matchesType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      selectedItems.forEach(id => deleteMedia(id));
      setSelectedItems([]);
    }
  };

  const handleBulkMove = (folderId: string) => {
    selectedItems.forEach(id => moveToFolder(id, folderId));
    setSelectedItems([]);
  };

  const getStorageUsed = () => {
    const totalBytes = mediaItems.reduce((sum, item) => sum + item.size, 0);
    const totalMB = totalBytes / (1024 * 1024);
    return totalMB.toFixed(1);
  };

  const getItemCounts = () => {
    return {
      total: mediaItems.length,
      images: mediaItems.filter(item => item.type === 'image').length,
      videos: mediaItems.filter(item => item.type === 'video').length,
      documents: mediaItems.filter(item => item.type === 'document').length,
    };
  };

  const counts = getItemCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-600 mt-1">
            {counts.total} files • {getStorageUsed()} MB used
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Storage Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Storage Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium">{getStorageUsed()} MB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((parseFloat(getStorageUsed()) / 1000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">1 GB total storage</div>
            </div>
          </div>

          {/* Media Type Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Media Types</h3>
            <div className="space-y-2">
              {[
                { type: 'all', label: 'All Files', count: counts.total, icon: File },
                { type: 'image', label: 'Images', count: counts.images, icon: Image },
                { type: 'video', label: 'Videos', count: counts.videos, icon: Video },
                { type: 'document', label: 'Documents', count: counts.documents, icon: File },
              ].map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.type}
                    onClick={() => setSelectedMediaType(filter.type as any)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedMediaType === filter.type
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{filter.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">{filter.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Folders */}
          <MediaFolders
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
            onCreateFolder={createFolder}
            onDeleteFolder={deleteFolder}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search media files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                  <option value="type">Sort by Type</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>

                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mt-4 p-3 bg-primary-50 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-primary-700">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => e.target.value && handleBulkMove(e.target.value)}
                    className="text-sm border border-primary-300 rounded px-2 py-1"
                    defaultValue=""
                  >
                    <option value="">Move to folder...</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkDelete}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="text-sm text-primary-700 hover:text-primary-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Media Grid/List */}
          <MediaGrid
            items={sortedItems}
            viewMode={viewMode}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onDeleteItem={deleteMedia}
            onUpdateItem={updateMedia}
            loading={loading}
          />
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <MediaUpload
          onClose={() => setShowUploadModal(false)}
          onUpload={uploadMedia}
          selectedFolder={selectedFolder !== 'all' ? selectedFolder : undefined}
        />
      )}
    </div>
  );
}