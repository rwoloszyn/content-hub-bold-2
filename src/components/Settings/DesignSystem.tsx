import { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  Grid, 
  Image, 
  RefreshCw, 
  Search, 
  Copy, 
  Check,
  Info,
  ExternalLink,
  Download,
  Zap
} from 'lucide-react';
import { lingoService, DesignToken, DesignAsset } from '../../services/lingoService';

export function DesignSystem() {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'assets'>('colors');
  const [colorTokens, setColorTokens] = useState<DesignToken[]>([]);
  const [typographyTokens, setTypographyTokens] = useState<DesignToken[]>([]);
  const [spacingTokens, setSpacingTokens] = useState<DesignToken[]>([]);
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [assetFilter, setAssetFilter] = useState<string>('all');

  useEffect(() => {
    loadDesignSystem();
  }, []);

  const loadDesignSystem = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await lingoService.initialize();
      
      setColorTokens(lingoService.getColorTokens());
      setTypographyTokens(lingoService.getTypographyTokens());
      setSpacingTokens(lingoService.getSpacingTokens());
      setAssets(lingoService.getAssets());
    } catch (err) {
      console.error('Failed to load design system:', err);
      setError('Failed to load design system. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      await lingoService.refreshData();
      
      setColorTokens(lingoService.getColorTokens());
      setTypographyTokens(lingoService.getTypographyTokens());
      setSpacingTokens(lingoService.getSpacingTokens());
      setAssets(lingoService.getAssets());
    } catch (err) {
      console.error('Failed to refresh design system:', err);
      setError('Failed to refresh design system. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItemId(id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setAssets(lingoService.getAssets());
      return;
    }
    
    try {
      const results = await lingoService.searchAssets(searchQuery);
      setAssets(results);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
    }
  };

  const handleAssetFilterChange = (filter: string) => {
    setAssetFilter(filter);
    
    if (filter === 'all') {
      setAssets(lingoService.getAssets());
    } else {
      setAssets(lingoService.getAssets(filter));
    }
  };

  const filterColorsByCategory = (category: string) => {
    return colorTokens.filter(token => token.category === category);
  };

  const getColorCategories = () => {
    const categories = new Set<string>();
    colorTokens.forEach(token => {
      if (token.category) {
        categories.add(token.category);
      }
    });
    return Array.from(categories);
  };

  const getTypographyCategories = () => {
    const categories = new Set<string>();
    typographyTokens.forEach(token => {
      if (token.category) {
        categories.add(token.category);
      }
    });
    return Array.from(categories);
  };

  const filterTypographyByCategory = (category: string) => {
    return typographyTokens.filter(token => token.category === category);
  };

  const parseTypographyValue = (value: string) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return {
        fontFamily: 'System font',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Design System</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
            </button>
            
            <a
              href="https://www.lingoapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Lingo</span>
            </a>
          </div>
        </div>
        
        <p className="text-gray-600">
          Access and use design tokens, colors, typography, and assets from your Lingo design system.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'colors'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Colors</span>
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'typography'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Typography</span>
          </button>
          <button
            onClick={() => setActiveTab('spacing')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'spacing'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Spacing</span>
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'assets'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Assets</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-8">
                {getColorCategories().map(category => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filterColorsByCategory(category).map(color => (
                        <div 
                          key={color.id} 
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div 
                            className="h-24 w-full" 
                            style={{ backgroundColor: color.value }}
                          ></div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900">{color.name}</h4>
                              <button
                                onClick={() => handleCopy(color.value, color.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title="Copy color value"
                              >
                                {copiedItemId === color.id ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 font-mono">{color.value}</p>
                            {color.description && (
                              <p className="text-xs text-gray-500 mt-2">{color.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <div className="space-y-8">
                {getTypographyCategories().map(category => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                    <div className="space-y-4">
                      {filterTypographyByCategory(category).map(typography => {
                        const typographyValue = parseTypographyValue(typography.value);
                        return (
                          <div 
                            key={typography.id} 
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">{typography.name}</h4>
                              <button
                                onClick={() => handleCopy(typography.value, typography.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title="Copy typography values"
                              >
                                {copiedItemId === typography.id ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            
                            <div 
                              className="mb-4 p-3 bg-gray-50 rounded-lg"
                              style={{
                                fontFamily: typographyValue.fontFamily,
                                fontSize: typographyValue.fontSize,
                                fontWeight: typographyValue.fontWeight,
                                lineHeight: typographyValue.lineHeight,
                                letterSpacing: typographyValue.letterSpacing
                              }}
                            >
                              The quick brown fox jumps over the lazy dog
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div>
                                <span className="font-medium">Font Family:</span> {typographyValue.fontFamily}
                              </div>
                              <div>
                                <span className="font-medium">Font Size:</span> {typographyValue.fontSize}
                              </div>
                              <div>
                                <span className="font-medium">Font Weight:</span> {typographyValue.fontWeight}
                              </div>
                              <div>
                                <span className="font-medium">Line Height:</span> {typographyValue.lineHeight}
                              </div>
                              <div>
                                <span className="font-medium">Letter Spacing:</span> {typographyValue.letterSpacing}
                              </div>
                            </div>
                            
                            {typography.description && (
                              <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                                {typography.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Spacing Tab */}
            {activeTab === 'spacing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {spacingTokens.map(spacing => (
                    <div 
                      key={spacing.id} 
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{spacing.name}</h4>
                        <button
                          onClick={() => handleCopy(spacing.value, spacing.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Copy spacing value"
                        >
                          {copiedItemId === spacing.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="bg-primary-100 border border-primary-200"
                          style={{ width: spacing.value, height: spacing.value }}
                        ></div>
                        <span className="text-sm text-gray-600 font-mono">{spacing.value}</span>
                      </div>
                      
                      {spacing.description && (
                        <p className="text-xs text-gray-500">{spacing.description}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                {spacingTokens.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Grid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No spacing tokens found</h4>
                    <p className="text-gray-600">
                      No spacing tokens are available in your Lingo design system.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Assets Tab */}
            {activeTab === 'assets' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex-1 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={assetFilter}
                      onChange={(e) => handleAssetFilterChange(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Assets</option>
                      <option value="image">Images</option>
                      <option value="icon">Icons</option>
                      <option value="logo">Logos</option>
                      <option value="illustration">Illustrations</option>
                    </select>
                    
                    <button
                      onClick={handleSearch}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Assets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {assets.map(asset => (
                    <div 
                      key={asset.id} 
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={asset.thumbnailUrl}
                          alt={asset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{asset.name}</h4>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleCopy(asset.url, asset.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              title="Copy asset URL"
                            >
                              {copiedItemId === asset.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <a
                              href={asset.url}
                              download={asset.name}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              title="Download asset"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{asset.type}</p>
                        {asset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {asset.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {asset.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{asset.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {assets.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No assets found</h4>
                    <p className="text-gray-600">
                      {searchQuery 
                        ? `No assets matching "${searchQuery}" were found.` 
                        : 'No assets are available in your Lingo design system.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lingo Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">About Lingo Integration</h4>
            <p className="text-sm text-blue-800 mb-3">
              This design system is powered by Lingo, a tool for organizing and sharing design assets. 
              To update these assets, make changes in your Lingo workspace.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://www.lingoapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center space-x-1"
              >
                <span>Learn more about Lingo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://help.lingoapp.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center space-x-1"
              >
                <span>Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}