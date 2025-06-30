import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Image, 
  Video, 
  File, 
  Check,
  Download,
  RefreshCw,
  Tag
} from 'lucide-react';
import { lingoService, DesignAsset } from '../../services/lingoService';

interface LingoAssetBrowserProps {
  assets: DesignAsset[];
  onClose: () => void;
  onImport: (selectedAssets: DesignAsset[]) => void;
}

export function LingoAssetBrowser({ assets, onClose, onImport }: LingoAssetBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'icon' | 'logo' | 'illustration'>('all');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<DesignAsset[]>(assets);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique tags from assets
    const tags = new Set<string>();
    assets.forEach(asset => {
      asset.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));

    // Apply initial filtering
    filterAssets();
  }, [assets]);

  useEffect(() => {
    filterAssets();
  }, [searchQuery, selectedType, selectedTags]);

  const filterAssets = () => {
    let filtered = [...assets];
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(asset => asset.type === selectedType);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(query) || 
        (asset.description && asset.description.toLowerCase().includes(query)) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(asset => 
        selectedTags.every(tag => asset.tags.includes(tag))
      );
    }
    
    setFilteredAssets(filtered);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      await lingoService.refreshData();
      const refreshedAssets = lingoService.getAssets();
      
      // Update available tags
      const tags = new Set<string>();
      refreshedAssets.forEach(asset => {
        asset.tags.forEach(tag => tags.add(tag));
      });
      setAvailableTags(Array.from(tags));
      
      // Update filtered assets
      setFilteredAssets(refreshedAssets);
    } catch (error) {
      console.error('Failed to refresh assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleImport = () => {
    const assetsToImport = assets.filter(asset => selectedAssets.includes(asset.id));
    onImport(assetsToImport);
  };

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'icon': return File;
      case 'logo': return Image;
      case 'illustration': return Image;
      default: return File;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Import from Lingo</h2>
            <p className="text-gray-600 mt-1">Select assets from your Lingo design system</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="icon">Icons</option>
                <option value="logo">Logos</option>
                <option value="illustration">Illustrations</option>
              </select>
              
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Refresh assets"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-700">Filter by Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTagSelection(tag)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assets Grid */}
          <div className="flex-1 overflow-y-auto">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredAssets.map((asset) => {
                  const AssetIcon = getAssetTypeIcon(asset.type);
                  const isSelected = selectedAssets.includes(asset.id);
                  
                  return (
                    <div
                      key={asset.id}
                      onClick={() => toggleAssetSelection(asset.id)}
                      className={`relative bg-white border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary-500 ring-2 ring-primary-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {asset.type === 'icon' ? (
                          <div className="p-4 flex items-center justify-center">
                            <img
                              src={asset.thumbnailUrl}
                              alt={asset.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        ) : (
                          <img
                            src={asset.thumbnailUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-gray-900 truncate" title={asset.name}>
                          {asset.name}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize">{asset.type}</p>
                        
                        {asset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {asset.tags.slice(0, 2).map((tag, index) => (
                              <span 
                                key={index}
                                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {asset.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                +{asset.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedAssets.length} asset{selectedAssets.length !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={selectedAssets.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Import Selected</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}