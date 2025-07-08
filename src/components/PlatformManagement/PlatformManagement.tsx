import { useState } from 'react';
import { 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Info,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';
import { PlatformCard } from './PlatformCard';
import { ConnectionWizard } from './ConnectionWizard';
import { PlatformGuide } from './PlatformGuide';
import { Platform, PlatformType } from '../../types';

interface PlatformManagementProps {
  platforms: Platform[];
  onUpdatePlatform: (platformType: PlatformType, updates: Partial<Platform>) => void;
  onConnectPlatform: (platformType: PlatformType, credentials: any) => Promise<void>;
  onDisconnectPlatform: (platformType: PlatformType) => void;
}

const availablePlatforms: Array<{
  type: PlatformType;
  name: string;
  description: string;
  features: string[];
  color: string;
  icon: string;
}> = [
  {
    type: 'facebook',
    name: 'Facebook',
    description: 'Share posts, images, and videos to your Facebook page',
    features: ['Post scheduling', 'Image & video sharing', 'Analytics', 'Comments management'],
    color: '#1877F2',
    icon: 'facebook',
  },
  {
    type: 'instagram',
    name: 'Instagram',
    description: 'Share photos, stories, and reels to your Instagram account',
    features: ['Photo & video posts', 'Stories', 'Reels', 'Hashtag optimization'],
    color: '#E4405F',
    icon: 'instagram',
  },
  {
    type: 'twitter',
    name: 'Twitter',
    description: 'Tweet updates and engage with your Twitter audience',
    features: ['Tweet scheduling', 'Thread creation', 'Mentions tracking', 'Analytics'],
    color: '#1DA1F2',
    icon: 'twitter',
  },
  {
    type: 'linkedin',
    name: 'LinkedIn',
    description: 'Share professional content to your LinkedIn profile or company page',
    features: ['Professional posts', 'Article publishing', 'Company updates', 'Network analytics'],
    color: '#0A66C2',
    icon: 'linkedin',
  },
  {
    type: 'pinterest',
    name: 'Pinterest',
    description: 'Pin images and ideas to your Pinterest boards',
    features: ['Pin scheduling', 'Board management', 'Rich pins', 'Pinterest analytics'],
    color: '#BD081C',
    icon: 'pinterest',
  },
  {
    type: 'tiktok',
    name: 'TikTok',
    description: 'Share short-form videos to your TikTok account',
    features: ['Video uploads', 'Trending hashtags', 'Analytics', 'Content planning'],
    color: '#000000',
    icon: 'video',
  },
];

export function PlatformManagement({ 
  platforms, 
  onConnectPlatform, 
  onDisconnectPlatform 
}: PlatformManagementProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'connected' | 'available'>('overview');

  const connectedPlatforms = platforms.filter(p => p.connected);
  const availableForConnection = availablePlatforms.filter(
    ap => !platforms.find(p => p.type === ap.type && p.connected)
  );

  const handleConnectPlatform = (platformType: PlatformType) => {
    setSelectedPlatform(platformType);
    setShowWizard(true);
  };

  const handleConnectionComplete = async (credentials: any) => {
    if (selectedPlatform) {
      await onConnectPlatform(selectedPlatform, credentials);
      setShowWizard(false);
      setSelectedPlatform(null);
    }
  };

  const getOverviewStats = () => {
    return {
      totalConnected: connectedPlatforms.length,
      totalReach: connectedPlatforms.reduce((sum, p) => sum + (p.followers || 0), 0),
      lastSync: connectedPlatforms.reduce((latest, p) => {
        if (!p.lastSync) return latest;
        return !latest || p.lastSync > latest ? p.lastSync : latest;
      }, null as Date | null),
      healthScore: Math.round((connectedPlatforms.length / availablePlatforms.length) * 100),
    };
  };

  const stats = getOverviewStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Management</h2>
          <p className="text-gray-600 mt-1">
            Connect and manage your social media accounts
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>Setup Guide</span>
          </button>
          <button
            onClick={() => handleConnectPlatform('facebook')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Platform</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'connected', label: `Connected (${connectedPlatforms.length})`, icon: CheckCircle },
            { id: 'available', label: `Available (${availableForConnection.length})`, icon: Plus },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">
                  {stats.healthScore}% Complete
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalConnected}</h3>
              <p className="text-gray-600">Connected Platforms</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalReach.toLocaleString()}
              </h3>
              <p className="text-gray-600">Total Reach</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.lastSync ? 'Active' : 'Inactive'}
              </h3>
              <p className="text-gray-600">Sync Status</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
              <p className="text-gray-600">Scheduled Posts</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Setup Guide</h4>
                  <p className="text-sm text-gray-600">Learn how to connect platforms</p>
                </div>
              </button>

              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Sync All</h4>
                  <p className="text-sm text-gray-600">Refresh all platform data</p>
                </div>
              </button>

              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Settings</h4>
                  <p className="text-sm text-gray-600">Configure platform settings</p>
                </div>
              </button>
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
            <div className="space-y-4">
              {availablePlatforms.map((platform) => {
                const connected = platforms.find(p => p.type === platform.type && p.connected);
                return (
                  <div key={platform.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: connected ? '#10B981' : '#EF4444' }}
                      ></div>
                      <span className="font-medium text-gray-900">{platform.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {connected ? (
                        <span className="text-sm text-green-600 font-medium">Connected</span>
                      ) : (
                        <button
                          onClick={() => handleConnectPlatform(platform.type)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'connected' && (
        <div className="space-y-6">
          {connectedPlatforms.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Platforms</h3>
              <p className="text-gray-600 mb-4">
                Connect your first platform to start managing your social media presence
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Browse Available Platforms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedPlatforms.map((platform) => {
                const platformInfo = availablePlatforms.find(ap => ap.type === platform.type);
                return (
                  <PlatformCard
                    key={platform.type}
                    platform={platform}
                    platformInfo={platformInfo!}
                    onDisconnect={() => onDisconnectPlatform(platform.type)}
                    onSettings={() => {/* Handle settings */}}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'available' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Ready to expand your reach?</h4>
                <p className="text-blue-700 text-sm">
                  Connect multiple platforms to maximize your content distribution and engagement.
                  Each platform offers unique features and audience targeting capabilities.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableForConnection.map((platform) => (
              <div
                key={platform.type}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: platform.color }}
                    ></div>
                  </div>
                  <button
                    onClick={() => handleConnectPlatform(platform.type)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Connect
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{platform.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{platform.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {platform.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {platform.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{platform.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connection Wizard */}
      {showWizard && selectedPlatform && (
        <ConnectionWizard
          platform={selectedPlatform}
          onClose={() => {
            setShowWizard(false);
            setSelectedPlatform(null);
          }}
          onComplete={handleConnectionComplete}
        />
      )}

      {/* Platform Guide */}
      {showGuide && (
        <PlatformGuide
          onClose={() => setShowGuide(false)}
        />
      )}
    </div>
  );
}