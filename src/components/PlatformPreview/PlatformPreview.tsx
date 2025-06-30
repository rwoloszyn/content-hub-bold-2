import React, { useState } from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { PlatformType } from '../../types';
import { platformConfig } from '../../utils/platformHelpers';

interface PlatformPreviewProps {
  content: string;
  imageUrl?: string;
  selectedPlatforms: PlatformType[];
}

const platformIcons: Record<PlatformType, React.ComponentType<any>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  pinterest: Globe,
  tiktok: Globe,
  wordpress: Globe,
  medium: Globe,
};

export function PlatformPreview({ content, imageUrl, selectedPlatforms }: PlatformPreviewProps) {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [activePlatform, setActivePlatform] = useState<PlatformType>(selectedPlatforms[0] || 'facebook');

  const config = platformConfig[activePlatform];
  const Icon = platformIcons[activePlatform];
  
  const truncatedContent = content.length > config.charLimit 
    ? content.substring(0, config.charLimit - 3) + '...'
    : content;

  const deviceSizes = {
    mobile: 'max-w-sm',
    tablet: 'max-w-md',
    desktop: 'max-w-2xl',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Platform Preview</h3>
        
        <div className="flex items-center space-x-4">
          {/* Device Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveDevice('mobile')}
              className={`p-2 rounded-md transition-colors ${
                activeDevice === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveDevice('tablet')}
              className={`p-2 rounded-md transition-colors ${
                activeDevice === 'tablet'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveDevice('desktop')}
              className={`p-2 rounded-md transition-colors ${
                activeDevice === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          {/* Platform Toggle */}
          <div className="flex items-center space-x-2">
            {selectedPlatforms.map((platform) => {
              const PlatformIcon = platformIcons[platform];
              const platformConfig_item = platformConfig[platform];
              
              return (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={`p-2 rounded-lg transition-colors ${
                    activePlatform === platform
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: activePlatform === platform ? `${platformConfig_item.color}20` : undefined,
                    color: activePlatform === platform ? platformConfig_item.color : undefined,
                  }}
                >
                  <PlatformIcon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex justify-center">
        <div className={`w-full ${deviceSizes[activeDevice]} bg-gray-50 rounded-xl overflow-hidden`}>
          {/* Mock Platform Header */}
          <div 
            className="px-4 py-3 flex items-center space-x-3 border-b border-gray-200"
            style={{ backgroundColor: `${config.color}10` }}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: config.color }}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{config.name}</h4>
              <p className="text-xs text-gray-500">Preview Mode</p>
            </div>
          </div>

          {/* Content Preview */}
          <div className="p-4 bg-white">
            <div className="flex items-start space-x-3 mb-3">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">Sarah Johnson</span>
                  <span className="text-sm text-gray-500">• 2 hours ago</span>
                </div>
              </div>
            </div>

            {imageUrl && (
              <div className="mb-3 overflow-hidden rounded-lg">
                <img
                  src={imageUrl}
                  alt="Post content"
                  className="w-full h-48 object-cover"
                  style={{
                    aspectRatio: config.aspectRatio,
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              <p className="text-gray-900 whitespace-pre-wrap">{truncatedContent}</p>
              
              {content.length > config.charLimit && (
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  See more
                </button>
              )}

              {/* Character Count */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>
                  {content.length} / {config.charLimit} characters
                </span>
                {content.length > config.charLimit && (
                  <span className="text-red-500 font-medium">Content will be truncated</span>
                )}
              </div>
            </div>
          </div>

          {/* Mock Engagement */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>❤️ 24</span>
                <span>💬 5</span>
                <span>🔄 2</span>
              </div>
              <span>Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}