import { PlatformType, PlatformPreview } from '../types';

export const platformConfig = {
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    charLimit: 63206,
    icon: 'facebook',
    aspectRatio: '16:9',
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    charLimit: 2200,
    icon: 'instagram',
    aspectRatio: '1:1',
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    charLimit: 280,
    icon: 'twitter',
    aspectRatio: '16:9',
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    charLimit: 3000,
    icon: 'linkedin',
    aspectRatio: '16:9',
  },
  pinterest: {
    name: 'Pinterest',
    color: '#BD081C',
    charLimit: 500,
    icon: 'pinterest',
    aspectRatio: '2:3',
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    charLimit: 300,
    icon: 'video',
    aspectRatio: '9:16',
  },
  wordpress: {
    name: 'WordPress',
    color: '#21759B',
    charLimit: 100000,
    icon: 'globe',
    aspectRatio: '16:9',
  },
  medium: {
    name: 'Medium',
    color: '#00AB6C',
    charLimit: 100000,
    icon: 'book-open',
    aspectRatio: '16:9',
  },
};

export function generatePlatformPreview(
  content: string,
  platformType: PlatformType,
  imageUrl?: string
): PlatformPreview {
  const config = platformConfig[platformType];
  const charCount = content.length;
  const truncated = charCount > config.charLimit;
  const text = truncated ? content.substring(0, config.charLimit - 3) + '...' : content;

  return {
    text,
    truncated,
    charCount,
    charLimit: config.charLimit,
    aspectRatio: config.aspectRatio,
    imageUrl,
  };
}

export function getPlatformIcon(platformType: PlatformType): string {
  return platformConfig[platformType].icon;
}

export function getPlatformColor(platformType: PlatformType): string {
  return platformConfig[platformType].color;
}