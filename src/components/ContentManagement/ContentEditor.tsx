import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Eye, 
  Calendar, 
  Image, 
  Video, 
  FileText, 
  Hash,
  Globe,
  Clock,
  Zap,
  Palette
} from 'lucide-react';
import { ContentItem, PlatformType } from '../../types';
import { PlatformSelector } from './PlatformSelector';
import { MediaSelector } from './MediaSelector';
import { ScheduleModal } from './ScheduleModal';
import { LingoAssetSelector } from './LingoAssetSelector';
import { lingoService } from '../../services/lingoService';

interface ContentEditorProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onSchedule?: (content: ContentItem, date: Date, time: string, platforms: PlatformType[]) => void;
}

export function ContentEditor({ 
  content, 
  isOpen, 
  onClose, 
  onSave, 
  onSchedule 
}: ContentEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'post' as ContentItem['type'],
    status: 'draft' as ContentItem['status'],
    platforms: [] as any[],
    tags: [] as string[],
    mediaUrl: '',
    aiGenerated: false,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [showLingoSelector, setShowLingoSelector] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        content: content.content,
        type: content.type,
        status: content.status,
        platforms: content.platforms,
        tags: content.tags,
        mediaUrl: content.mediaUrl || '',
        aiGenerated: content.aiGenerated || false,
      });
    } else {
      // Reset form for new content
      setFormData({
        title: '',
        content: '',
        type: 'post',
        status: 'draft',
        platforms: [],
        tags: [],
        mediaUrl: '',
        aiGenerated: false,
      });
    }
    setTagInput('');
    setErrors({});
  }, [content, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (formData.content.length > 10000) {
      newErrors.content = 'Content must be less than 10,000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    onSave({
      ...formData,
      author: {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah@contenthub.com',
      },
    });
    onClose();
  };

  const handleSchedule = () => {
    if (!validateForm()) return;
    setShowScheduleModal(true);
  };

  const handleScheduleConfirm = (date: Date, time: string, platforms: PlatformType[]) => {
    if (content && onSchedule) {
      onSchedule(content, date, time, platforms);
    }
    setShowScheduleModal(false);
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === document.activeElement) {
      e.preventDefault();
      addTag();
    }
  };

  const handleLingoAssetSelect = (asset: any) => {
    setFormData(prev => ({
      ...prev,
      mediaUrl: asset.url
    }));
    setShowLingoSelector(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {content ? 'Edit Content' : 'Create New Content'}
              </h2>
              <p className="text-gray-600 mt-1">
                {content ? 'Update your content and settings' : 'Create engaging content for your audience'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`p-2 rounded-lg transition-colors ${
                  previewMode 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title="Toggle Preview"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {previewMode ? (
              <div className="p-6 overflow-y-auto h-full">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {formData.title || 'Untitled'}
                    </h3>
                    {formData.mediaUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={formData.mediaUrl}
                          alt="Content media"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {formData.content || 'No content yet...'}
                      </p>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto h-full">
                {/* Main Content Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a compelling title..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'post', label: 'Post', icon: FileText },
                        { value: 'article', label: 'Article', icon: FileText },
                        { value: 'video', label: 'Video', icon: Video },
                        { value: 'image', label: 'Image', icon: Image },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: value as any }))}
                          className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                            formData.type === value
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Content *
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formData.content.length}/10,000
                        </span>
                        <button
                          type="button"
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          title="Generate with AI"
                        >
                          <Zap className="w-4 h-4" />
                          <span>AI Generate</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your content here..."
                      rows={12}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                        errors.content ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.content && (
                      <p className="text-red-600 text-sm mt-1">{errors.content}</p>
                    )}
                  </div>

                  {/* Media */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Media
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {formData.mediaUrl ? (
                        <div className="relative">
                          <img
                            src={formData.mediaUrl}
                            alt="Selected media"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, mediaUrl: '' }))}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-3">Add media to your content</p>
                          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowMediaSelector(true)}
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              Choose from Library
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowLingoSelector(true)}
                              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Palette className="w-4 h-4" />
                              <span>Choose from Lingo</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  {/* Platforms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platforms
                    </label>
                    <PlatformSelector
                      selectedPlatforms={formData.platforms}
                      onPlatformChange={(platforms) => 
                        setFormData(prev => ({ ...prev, platforms }))
                      }
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add a tag..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Hash className="w-4 h-4" />
                        </button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                            >
                              #{tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 text-primary-500 hover:text-primary-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Generated Toggle */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.aiGenerated}
                        onChange={(e) => setFormData(prev => ({ ...prev, aiGenerated: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">AI Generated Content</span>
                    </label>
                  </div>

                  {/* Publishing Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Publishing Info</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {content ? 'Last updated' : 'Will be created'} {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>
                          {formData.platforms.length} platform{formData.platforms.length !== 1 ? 's' : ''} selected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {content && (
                <button
                  onClick={handleSchedule}
                  className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{content ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Selector Modal */}
      {showMediaSelector && (
        <MediaSelector
          onClose={() => setShowMediaSelector(false)}
          onSelect={(mediaUrl) => {
            setFormData(prev => ({ ...prev, mediaUrl }));
            setShowMediaSelector(false);
          }}
        />
      )}

      {/* Lingo Asset Selector Modal */}
      {showLingoSelector && (
        <LingoAssetSelector
          onClose={() => setShowLingoSelector(false)}
          onSelect={(asset) => {
            setFormData(prev => ({ ...prev, mediaUrl: asset.url }));
            setShowLingoSelector(false);
          }}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleConfirm}
          platforms={formData.platforms.map(p => p.type)}
        />
      )}
    </>
  );
}