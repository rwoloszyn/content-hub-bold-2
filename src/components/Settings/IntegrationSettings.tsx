import { useState } from 'react';
import { 
  Zap, 
  ExternalLink, 
  RefreshCw,
  Settings,
  Plus,
  Trash2,
  Key,
  EyeOff,
  Eye,
  Copy,
  Globe,
  Database
} from 'lucide-react';

interface IntegrationSettingsProps {
  onSettingsChange: () => void;
}

export function IntegrationSettings({ onSettingsChange }: IntegrationSettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('sk_live_51234567890abcdef...');

  const connectedIntegrations = [
    {
      id: 'notion',
      name: 'Notion',
      description: 'Sync content with Notion databases',
      status: 'connected',
      connectedAt: '2024-01-15',
      lastSync: '2 hours ago',
      icon: '📝',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with 5000+ apps',
      status: 'connected',
      connectedAt: '2024-01-10',
      lastSync: '1 day ago',
      icon: '⚡',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications in your Slack workspace',
      status: 'error',
      connectedAt: '2024-01-05',
      lastSync: 'Failed',
      icon: '💬',
    },
  ];

  const availableIntegrations = [
    {
      id: 'airtable',
      name: 'Airtable',
      description: 'Sync data with Airtable bases',
      category: 'Database',
      icon: '📊',
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Export data to Google Sheets',
      category: 'Productivity',
      icon: '📈',
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Send notifications to Discord channels',
      category: 'Communication',
      icon: '🎮',
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: 'Send data to custom endpoints',
      category: 'Developer',
      icon: '🔗',
    },
  ];

  const webhooks = [
    {
      id: 'webhook-1',
      name: 'Content Published',
      url: 'https://api.example.com/webhooks/content',
      events: ['content.published', 'content.updated'],
      status: 'active',
      lastTriggered: '2 hours ago',
    },
    {
      id: 'webhook-2',
      name: 'Analytics Update',
      url: 'https://analytics.example.com/webhook',
      events: ['analytics.daily'],
      status: 'inactive',
      lastTriggered: 'Never',
    },
  ];

  const handleDisconnectIntegration = (integrationId: string) => {
    if (window.confirm('Are you sure you want to disconnect this integration?')) {
      console.log('Disconnect integration:', integrationId);
      onSettingsChange();
    }
  };

  const handleConnectIntegration = (integrationId: string) => {
    console.log('Connect integration:', integrationId);
    onSettingsChange();
  };

  const handleRefreshIntegration = (integrationId: string) => {
    console.log('Refresh integration:', integrationId);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const regenerateApiKey = () => {
    if (window.confirm('Are you sure you want to regenerate your API key? This will invalidate the current key.')) {
      console.log('Regenerate API key');
      onSettingsChange();
    }
  };

  return (
    <div className="space-y-6">
      {/* API Access */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Key className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">API Access</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Use the ContentHub API to integrate with your own applications and workflows.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={copyApiKey}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={regenerateApiKey}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Regenerate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Keep your API key secure. Don't share it in publicly accessible areas.
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
              <ExternalLink className="w-4 h-4" />
              <span>View API Documentation</span>
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Rate Limits & Usage
            </button>
          </div>
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Connected Integrations</h3>
        </div>
        
        {connectedIntegrations.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No integrations connected yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {connectedIntegrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        integration.status === 'connected' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>Connected {integration.connectedAt}</span>
                      <span>•</span>
                      <span>Last sync: {integration.lastSync}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRefreshIntegration(integration.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDisconnectIntegration(integration.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Integrations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Plus className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Available Integrations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableIntegrations.map((integration) => (
            <div key={integration.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {integration.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
              
              <button
                onClick={() => handleConnectIntegration(integration.id)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Webhooks</h3>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Webhook</span>
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Send real-time data to your applications when events occur in ContentHub.
        </p>

        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{webhook.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    webhook.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {webhook.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-mono">{webhook.url}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                  <span>Events: {webhook.events.join(', ')}</span>
                  <span>•</span>
                  <span>Last triggered: {webhook.lastTriggered}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Database className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Integration Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep your API keys secure and rotate them regularly</li>
              <li>• Test webhooks in a development environment first</li>
              <li>• Monitor integration health and error rates</li>
              <li>• Follow rate limits to ensure stable performance</li>
              <li>• Use HTTPS endpoints for webhook URLs</li>
            </ul>
            <div className="mt-3">
              <button className="text-blue-700 hover:text-blue-800 text-sm font-medium underline">
                View Integration Best Practices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}