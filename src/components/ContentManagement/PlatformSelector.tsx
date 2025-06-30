import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Globe } from 'lucide-react';
import { Platform, PlatformType } from '../../types';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformChange: (platforms: Platform[]) => void;
}

const availablePlatforms = [
  { type: 'facebook' as PlatformType, name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { type: 'instagram' as PlatformType, name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { type: 'twitter' as PlatformType, name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { type: 'linkedin' as PlatformType, name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { type: 'pinterest' as PlatformType, name: 'Pinterest', icon: Globe, color: '#BD081C' },
  { type: 'tiktok' as PlatformType, name: 'TikTok', icon: Globe, color: '#000000' },
];

export function PlatformSelector({ selectedPlatforms, onPlatformChange }: PlatformSelectorProps) {
  const togglePlatform = (platformType: PlatformType) => {
    const isSelected = selectedPlatforms.some(p => p.type === platformType);
    
    if (isSelected) {
      onPlatformChange(selectedPlatforms.filter(p => p.type !== platformType));
    } else {
      const newPlatform: Platform = {
        type: platformType,
        connected: true,
        username: `user_${platformType}`,
      };
      onPlatformChange([...selectedPlatforms, newPlatform]);
    }
  };

  return (
    <div className="space-y-3">
      {availablePlatforms.map((platform) => {
        const Icon = platform.icon;
        const isSelected = selectedPlatforms.some(p => p.type === platform.type);
        
        return (
          <button
            key={platform.type}
            onClick={() => togglePlatform(platform.type)}
            className={`w-full flex items-center space-x-3 p-3 border-2 rounded-lg transition-all ${
              isSelected
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${platform.color}20` }}
            >
              <Icon 
                className="w-4 h-4" 
                style={{ color: platform.color }}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">{platform.name}</p>
              <p className="text-sm text-gray-500">
                {isSelected ? 'Selected' : 'Click to select'}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              isSelected 
                ? 'bg-primary-500 border-primary-500' 
                : 'border-gray-300'
            }`}>
              {isSelected && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}