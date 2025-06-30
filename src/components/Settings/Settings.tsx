import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard, 
  Download, 
  Trash2,
  Settings as SettingsIcon,
  Key,
  Database,
  Zap,
  HelpCircle,
  ExternalLink,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info,
  Server
} from 'lucide-react';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { AppearanceSettings } from './AppearanceSettings';
import { LanguageSettings } from './LanguageSettings';
import { SubscriptionSettings } from './SubscriptionSettings';
import { DataSettings } from './DataSettings';
import { IntegrationSettings } from './IntegrationSettings';
import { SupportSettings } from './SupportSettings';
import { DeploymentSettings } from './DeploymentSettings';
import { DomainSettings } from './DomainSettings';
import { DesignSystem } from './DesignSystem';

export function Settings() {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const settingsTabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your personal information and preferences',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Configure notification preferences and alerts',
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Password, two-factor authentication, and security settings',
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of your workspace',
    },
    {
      id: 'language',
      label: 'Language & Region',
      icon: Globe,
      description: 'Set your language, timezone, and regional preferences',
    },
    {
      id: 'subscription',
      label: 'Subscription & Billing',
      icon: CreditCard,
      description: 'Manage your subscription and billing information',
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Zap,
      description: 'Manage connected services and API settings',
    },
    {
      id: 'deployment',
      label: 'Deployment',
      icon: Server,
      description: 'Deploy and manage your ContentHub instance',
    },
    {
      id: 'domains',
      label: 'Domains',
      icon: Globe,
      description: 'Manage custom domains for your site',
    },
    {
      id: 'design-system',
      label: 'Design System',
      icon: Palette,
      description: 'Access design tokens and assets from Lingo',
    },
    {
      id: 'data',
      label: 'Data & Privacy',
      icon: Database,
      description: 'Export data, privacy settings, and account deletion',
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: HelpCircle,
      description: 'Get help, contact support, and access documentation',
    },
  ];

  const handleSaveChanges = () => {
    // Save all pending changes
    setHasUnsavedChanges(false);
    // Show success message
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'notifications':
        return <NotificationSettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'security':
        return <SecuritySettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'appearance':
        return <AppearanceSettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'language':
        return <LanguageSettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'subscription':
        return <SubscriptionSettings />;
      case 'integrations':
        return <IntegrationSettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'deployment':
        return <DeploymentSettings />;
      case 'domains':
        return <DomainSettings />;
      case 'design-system':
        return <DesignSystem />;
      case 'data':
        return <DataSettings />;
      case 'support':
        return <SupportSettings />;
      default:
        return <ProfileSettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
    }
  };

  const currentTab = settingsTabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <SettingsIcon className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              </div>

              <nav className="space-y-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'
                      }`} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Account Status */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pro Plan</p>
                    <p className="text-xs text-gray-500">Active until Dec 2024</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('subscription')}
                  className="w-full text-left text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Manage subscription
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentTab?.label}</h1>
                  <p className="text-gray-600 mt-1">{currentTab?.description}</p>
                </div>
                
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-amber-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Unsaved changes</span>
                    </div>
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}