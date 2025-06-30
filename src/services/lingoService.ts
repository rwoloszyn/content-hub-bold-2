import { User } from '../types';

// Configuration
const LINGO_API_KEY = import.meta.env.VITE_LINGO_API_KEY;
const LINGO_SPACE_ID = import.meta.env.VITE_LINGO_SPACE_ID;

// Asset types
export interface DesignToken {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'typography' | 'spacing' | 'shadow' | 'radius';
  description?: string;
  category?: string;
}

export interface DesignAsset {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'logo' | 'illustration';
  url: string;
  thumbnailUrl: string;
  description?: string;
  tags: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

class LingoService {
  private initialized = false;
  private currentUser: User | null = null;
  private colorTokens: DesignToken[] = [];
  private typographyTokens: DesignToken[] = [];
  private spacingTokens: DesignToken[] = [];
  private assets: DesignAsset[] = [];
  private styleGuides: any[] = [];

  async initialize(user?: User): Promise<void> {
    if (this.initialized || !LINGO_API_KEY || !LINGO_SPACE_ID) {
      // If no API key is provided, generate mock data
      this.generateMockData();
      this.initialized = true;
      return;
    }

    try {
      console.log('Initializing Lingo with Space ID:', LINGO_SPACE_ID);
      
      if (user) {
        this.currentUser = user;
      }

      // In a real implementation, we would initialize the Lingo SDK here
      // For this demo, we'll use mock data
      this.generateMockData();

      this.initialized = true;
      console.log('Lingo initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Lingo:', error);
      // Fallback to mock data
      this.generateMockData();
      this.initialized = true;
    }
  }

  async refreshData(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
      return;
    }

    try {
      // In a real implementation, this would refresh data from Lingo
      // For this demo, we'll just regenerate mock data
      this.generateMockData();
    } catch (error) {
      console.error('Failed to refresh Lingo data:', error);
      throw error;
    }
  }

  getColorTokens(): DesignToken[] {
    return this.colorTokens;
  }

  getTypographyTokens(): DesignToken[] {
    return this.typographyTokens;
  }

  getSpacingTokens(): DesignToken[] {
    return this.spacingTokens;
  }

  getAssets(type?: string, tags?: string[]): DesignAsset[] {
    let filteredAssets = [...this.assets];
    
    if (type) {
      filteredAssets = filteredAssets.filter(asset => asset.type === type);
    }
    
    if (tags && tags.length > 0) {
      filteredAssets = filteredAssets.filter(asset => 
        tags.some(tag => asset.tags.includes(tag))
      );
    }
    
    return filteredAssets;
  }

  async searchAssets(query: string): Promise<DesignAsset[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    const searchTerms = query.toLowerCase().split(' ');
    
    return this.assets.filter(asset => {
      const searchableText = `${asset.name} ${asset.description || ''} ${asset.tags.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  async getAssetById(id: string): Promise<DesignAsset | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.assets.find(asset => asset.id === id) || null;
  }

  async getColorTokenById(id: string): Promise<DesignToken | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.colorTokens.find(token => token.id === id) || null;
  }

  async getTypographyTokenById(id: string): Promise<DesignToken | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.typographyTokens.find(token => token.id === id) || null;
  }

  // For development/testing purposes
  generateMockData(): void {
    // Generate mock color tokens
    this.colorTokens = [
      {
        id: 'color-1',
        name: 'Primary',
        value: '#3b82f6',
        type: 'color',
        category: 'Brand'
      },
      {
        id: 'color-2',
        name: 'Secondary',
        value: '#8b5cf6',
        type: 'color',
        category: 'Brand'
      },
      {
        id: 'color-3',
        name: 'Accent',
        value: '#f59e0b',
        type: 'color',
        category: 'Brand'
      },
      {
        id: 'color-4',
        name: 'Success',
        value: '#10b981',
        type: 'color',
        category: 'Feedback'
      },
      {
        id: 'color-5',
        name: 'Error',
        value: '#ef4444',
        type: 'color',
        category: 'Feedback'
      },
      {
        id: 'color-6',
        name: 'Warning',
        value: '#f59e0b',
        type: 'color',
        category: 'Feedback'
      },
      {
        id: 'color-7',
        name: 'Info',
        value: '#3b82f6',
        type: 'color',
        category: 'Feedback'
      },
      {
        id: 'color-8',
        name: 'Gray 50',
        value: '#f9fafb',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-9',
        name: 'Gray 100',
        value: '#f3f4f6',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-10',
        name: 'Gray 200',
        value: '#e5e7eb',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-11',
        name: 'Gray 300',
        value: '#d1d5db',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-12',
        name: 'Gray 400',
        value: '#9ca3af',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-13',
        name: 'Gray 500',
        value: '#6b7280',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-14',
        name: 'Gray 600',
        value: '#4b5563',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-15',
        name: 'Gray 700',
        value: '#374151',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-16',
        name: 'Gray 800',
        value: '#1f2937',
        type: 'color',
        category: 'Neutral'
      },
      {
        id: 'color-17',
        name: 'Gray 900',
        value: '#111827',
        type: 'color',
        category: 'Neutral'
      }
    ];

    // Generate mock typography tokens
    this.typographyTokens = [
      {
        id: 'typography-1',
        name: 'Heading 1',
        value: JSON.stringify({
          fontFamily: 'Inter, sans-serif',
          fontSize: '2.25rem',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.025em'
        }),
        type: 'typography',
        category: 'Headings'
      },
      {
        id: 'typography-2',
        name: 'Heading 2',
        value: JSON.stringify({
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.875rem',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.025em'
        }),
        type: 'typography',
        category: 'Headings'
      },
      {
        id: 'typography-3',
        name: 'Heading 3',
        value: JSON.stringify({
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.5rem',
          fontWeight: '600',
          lineHeight: '1.2',
          letterSpacing: '-0.025em'
        }),
        type: 'typography',
        category: 'Headings'
      },
      {
        id: 'typography-4',
        name: 'Body',
        value: JSON.stringify({
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: '1.5',
          letterSpacing: '0'
        }),
        type: 'typography',
        category: 'Body'
      },
      {
        id: 'typography-5',
        name: 'Body Small',
        value: JSON.stringify({
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '1.5',
          letterSpacing: '0'
        }),
        type: 'typography',
        category: 'Body'
      },
      {
        id: 'typography-6',
        name: 'Button',
        value: JSON.stringify({
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          fontWeight: '500',
          lineHeight: '1.5',
          letterSpacing: '0'
        }),
        type: 'typography',
        category: 'UI'
      },
      {
        id: 'typography-7',
        name: 'Caption',
        value: JSON.stringify({
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          fontWeight: '400',
          lineHeight: '1.5',
          letterSpacing: '0'
        }),
        type: 'typography',
        category: 'UI'
      }
    ];

    // Generate mock spacing tokens
    this.spacingTokens = [
      {
        id: 'spacing-1',
        name: 'xs',
        value: '0.25rem',
        type: 'spacing',
        category: 'Spacing'
      },
      {
        id: 'spacing-2',
        name: 'sm',
        value: '0.5rem',
        type: 'spacing',
        category: 'Spacing'
      },
      {
        id: 'spacing-3',
        name: 'md',
        value: '1rem',
        type: 'spacing',
        category: 'Spacing'
      },
      {
        id: 'spacing-4',
        name: 'lg',
        value: '1.5rem',
        type: 'spacing',
        category: 'Spacing'
      },
      {
        id: 'spacing-5',
        name: 'xl',
        value: '2rem',
        type: 'spacing',
        category: 'Spacing'
      },
      {
        id: 'spacing-6',
        name: '2xl',
        value: '3rem',
        type: 'spacing',
        category: 'Spacing'
      }
    ];

    // Generate mock assets
    this.assets = [
      {
        id: 'asset-1',
        name: 'Logo Primary',
        type: 'logo',
        url: 'https://via.placeholder.com/200x80?text=Logo',
        thumbnailUrl: 'https://via.placeholder.com/100x40?text=Logo',
        description: 'Primary logo for light backgrounds',
        tags: ['logo', 'brand', 'primary'],
        category: 'Logos',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'asset-2',
        name: 'Logo Inverse',
        type: 'logo',
        url: 'https://via.placeholder.com/200x80/333333/FFFFFF?text=Logo',
        thumbnailUrl: 'https://via.placeholder.com/100x40/333333/FFFFFF?text=Logo',
        description: 'Inverse logo for dark backgrounds',
        tags: ['logo', 'brand', 'inverse'],
        category: 'Logos',
        createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'asset-3',
        name: 'User Avatar',
        type: 'icon',
        url: 'https://via.placeholder.com/24/3b82f6/FFFFFF?text=U',
        thumbnailUrl: 'https://via.placeholder.com/24/3b82f6/FFFFFF?text=U',
        description: 'User avatar icon',
        tags: ['icon', 'user', 'avatar'],
        category: 'Icons',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'asset-4',
        name: 'Settings Icon',
        type: 'icon',
        url: 'https://via.placeholder.com/24/3b82f6/FFFFFF?text=S',
        thumbnailUrl: 'https://via.placeholder.com/24/3b82f6/FFFFFF?text=S',
        description: 'Settings gear icon',
        tags: ['icon', 'settings', 'gear'],
        category: 'Icons',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'asset-5',
        name: 'Hero Image',
        type: 'image',
        url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        thumbnailUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Team collaboration hero image',
        tags: ['image', 'hero', 'team', 'collaboration'],
        category: 'Images',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'asset-6',
        name: 'Social Media Graphic',
        type: 'image',
        url: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        thumbnailUrl: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Social media sharing graphic',
        tags: ['image', 'social', 'marketing'],
        category: 'Images',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'asset-7',
        name: 'Product Illustration',
        type: 'illustration',
        url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        thumbnailUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Product feature illustration',
        tags: ['illustration', 'product', 'feature'],
        category: 'Illustrations',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];
  }
}

export const lingoService = new LingoService();

// Initialize with mock data if no API key is provided
if (!LINGO_API_KEY || !LINGO_SPACE_ID) {
  lingoService.generateMockData();
}