import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Save,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useNotionSync, DatabaseMapping } from '../../hooks/useNotionSync';
import { notionService, NotionDatabase } from '../../services/notionService';
import { ContentItem } from '../../types';

interface NotionContentMapperProps {
  database: NotionDatabase;
  existingMapping?: DatabaseMapping;
  onSave: (mapping: Omit<DatabaseMapping, 'id' | 'lastSynced'>) => Promise<void>;
  onCancel: () => void;
}

export function NotionContentMapper({
  database,
  existingMapping,
  onSave,
  onCancel
}: NotionContentMapperProps) {
  const [contentType, setContentType] = useState<'post' | 'article' | 'video' | 'image'>(
    existingMapping?.contentType || 'post'
  );
  const [propertyMappings, setPropertyMappings] = useState<Record<string, string>>(
    existingMapping?.propertyMappings || {}
  );
  const [autoSync, setAutoSync] = useState(existingMapping?.autoSync ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Content fields based on content type
  const contentFields = {
    post: ['title', 'content', 'status', 'tags', 'platforms'],
    article: ['title', 'content', 'excerpt', 'status', 'tags', 'author', 'coverImage'],
    video: ['title', 'description', 'videoUrl', 'thumbnail', 'duration', 'status', 'tags'],
    image: ['title', 'description', 'imageUrl', 'status', 'tags'],
  };

  // Get database properties
  const databaseProperties = Object.entries(database.properties).map(([name, property]) => ({
    name,
    type: (property as any).type,
  }));

  const handleAddMapping = (contentField: string) => {
    setPropertyMappings(prev => ({
      ...prev,
      [contentField]: '',
    }));
  };

  const handleRemoveMapping = (contentField: string) => {
    setPropertyMappings(prev => {
      const newMappings = { ...prev };
      delete newMappings[contentField];
      return newMappings;
    });
  };

  const handlePropertyChange = (contentField: string, propertyName: string) => {
    setPropertyMappings(prev => ({
      ...prev,
      [contentField]: propertyName,
    }));
  };

  const handleSaveMapping = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onSave({
        databaseId: database.id,
        databaseName: database.title,
        propertyMappings,
        contentType,
        autoSync,
      });
    } catch (err) {
      console.error('Failed to save mapping:', err);
      setError('Failed to save mapping. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewContent = async () => {
    setIsPreviewLoading(true);
    setError(null);

    try {
      // Get a sample page from the database
      const { results } = await notionService.getDatabaseItems(database.id, { pageSize: 1 });
      
      if (results.length === 0) {
        setError('No content found in this database to preview.');
        setIsPreviewLoading(false);
        return;
      }

      const page = results[0];
      
      // Map Notion page to content
      const contentMap: Record<string, string> = {};
      
      for (const [contentField, notionProperty] of Object.entries(propertyMappings)) {
        contentMap[contentField] = notionProperty;
      }
      
      const content = await notionService.mapNotionPageToContent(page.id, contentMap);
      
      // Create preview content item
      const previewItem: ContentItem = {
        id: `preview-${Date.now()}`,
        title: content.title || 'Untitled',
        content: content.content || '',
        type: contentType,
        status: 'draft',
        platforms: [],
        createdAt: new Date(page.lastEditedTime),
        updatedAt: new Date(),
        author: {
          id: 'preview',
          name: content.author || 'Author',
          email: 'preview@example.com',
        },
        tags: content.tags || [],
      };

      if (content.imageUrl) {
        previewItem.mediaUrl = content.imageUrl;
      }

      setPreviewContent(previewItem);
    } catch (err) {
      console.error('Failed to preview content:', err);
      setError('Failed to preview content. Please try again.');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const getAvailableContentFields = () => {
    const fields = contentFields[contentType];
    return fields.filter(field => !propertyMappings[field]);
  };

  const isValidMapping = () => {
    // At minimum, title mapping is required
    return propertyMappings.title && propertyMappings.title.length > 0;
  };

  return (
    <div className="space-y-6">
      {/* Content Type Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'post', label: 'Social Post' },
            { value: 'article', label: 'Article' },
            { value: 'video', label: 'Video' },
            { value: 'image', label: 'Image' },
          ].map(type => (
            <button
              key={type.value}
              onClick={() => setContentType(type.value as any)}
              className={`p-3 border-2 rounded-lg transition-all ${
                contentType === type.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Mappings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Property Mappings</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviewContent}
              disabled={!isValidMapping() || isPreviewLoading}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPreviewLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>Preview</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Mapping Instructions</h4>
              <p className="text-sm text-blue-800">
                Map your Notion database properties to content fields. At minimum, you must map the "title" field.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Existing Mappings */}
          {Object.entries(propertyMappings).map(([contentField, propertyName]) => (
            <div key={contentField} className="flex items-center space-x-3">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  {contentField.charAt(0).toUpperCase() + contentField.slice(1)}
                  {contentField === 'title' && ' *'}
                </label>
              </div>
              
              <div className="flex-1">
                <select
                  value={propertyName}
                  onChange={(e) => handlePropertyChange(contentField, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a property</option>
                  {databaseProperties.map(property => (
                    <option key={property.name} value={property.name}>
                      {property.name} ({property.type})
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => handleRemoveMapping(contentField)}
                disabled={contentField === 'title'}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add Mapping Button */}
          {getAvailableContentFields().length > 0 && (
            <div className="pt-2">
              <div className="flex items-center space-x-3">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700">
                    Add Field
                  </label>
                </div>
                
                <div className="flex-1">
                  <select
                    value=""
                    onChange={(e) => e.target.value && handleAddMapping(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a field to add</option>
                    {getAvailableContentFields().map(field => (
                      <option key={field} value={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={() => {}}
                  className="p-2 text-gray-400 opacity-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto Sync Option */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Auto Sync</h4>
            <p className="text-sm text-gray-600">Automatically sync this database based on your sync settings</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      {/* Content Preview */}
      {previewContent && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Content Preview</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{previewContent.title}</h4>
            
            {previewContent.mediaUrl && (
              <div className="mb-4">
                <img
                  src={previewContent.mediaUrl}
                  alt={previewContent.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="text-gray-700 whitespace-pre-wrap mb-4">
              {previewContent.content}
            </div>
            
            {previewContent.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewContent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSaveMapping}
          disabled={!isValidMapping() || isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Mapping</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Eye icon component
function Eye({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}