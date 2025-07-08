import { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  ExternalLink,
  Shield,
  Key,
  AlertCircle,
  Info,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { PlatformType } from '../../types';

interface ConnectionWizardProps {
  platform: PlatformType;
  onClose: () => void;
  onComplete: (credentials: any) => Promise<void>;
}

const platformConfig = {
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    instructions: [
      'Go to Facebook Developers Console',
      'Create a new app or select existing one',
      'Add Facebook Login product',
      'Configure OAuth redirect URIs',
      'Get your App ID and App Secret'
    ]
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['user_profile', 'user_media'],
    instructions: [
      'Create Instagram Basic Display App',
      'Configure OAuth redirect URIs',
      'Add test users if needed',
      'Get your App ID and App Secret',
      'Generate access token'
    ]
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
    instructions: [
      'Go to Twitter Developer Portal',
      'Create a new project and app',
      'Generate API keys and tokens',
      'Configure OAuth 2.0 settings',
      'Set up callback URLs'
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['r_liteprofile', 'w_member_social'],
    instructions: [
      'Go to LinkedIn Developers',
      'Create a new app',
      'Add Sign In with LinkedIn product',
      'Configure OAuth 2.0 redirect URLs',
      'Get your Client ID and Client Secret'
    ]
  },
  pinterest: {
    name: 'Pinterest',
    color: '#BD081C',
    authUrl: 'https://www.pinterest.com/oauth/',
    scopes: ['read_public', 'write_public'],
    instructions: [
      'Go to Pinterest Developers',
      'Create a new app',
      'Configure OAuth settings',
      'Set redirect URIs',
      'Get your App ID and App Secret'
    ]
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    authUrl: 'https://www.tiktok.com/auth/authorize/',
    scopes: ['user.info.basic', 'video.upload'],
    instructions: [
      'Go to TikTok Developers',
      'Create a new app',
      'Configure Login Kit',
      'Set up redirect URLs',
      'Get your Client Key and Client Secret'
    ]
  },
  wordpress: {
    name: 'WordPress',
    color: '#21759B',
    authUrl: 'https://public-api.wordpress.com/oauth2/authorize',
    scopes: ['auth', 'posts'],
    instructions: [
      'Go to WordPress.com Developer Console',
      'Create a new application',
      'Configure OAuth redirect URIs',
      'Get your Client ID and Client Secret',
      'Set up your WordPress site connection'
    ]
  },
  medium: {
    name: 'Medium',
    color: '#00AB6C',
    authUrl: 'https://medium.com/m/oauth/authorize',
    scopes: ['basicProfile', 'publishPost'],
    instructions: [
      'Go to Medium Settings',
      'Navigate to Integration tokens',
      'Generate a new integration token',
      'Copy the generated token',
      'Use token for API authentication'
    ]
  }
};

export function ConnectionWizard({ platform, onClose, onComplete }: ConnectionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [connectionMethod, setConnectionMethod] = useState<'oauth' | 'manual'>('oauth');
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    accessToken: '',
    refreshToken: '',
  });
  const [showSecrets, setShowSecrets] = useState({
    clientSecret: false,
    accessToken: false,
    refreshToken: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = platformConfig[platform];
  const totalSteps = connectionMethod === 'oauth' ? 3 : 4;

  const handleOAuthConnect = () => {
    setIsConnecting(true);
    
    // Simulate OAuth flow
    const authUrl = `${config.authUrl}?client_id=your_client_id&redirect_uri=${encodeURIComponent(window.location.origin)}&scope=${config.scopes.join(',')}&response_type=code`;
    
    // In a real implementation, this would open a popup or redirect to: authUrl
    // window.location.href = authUrl;
    setTimeout(() => {
      setIsConnecting(false);
      setCurrentStep(3);
    }, 2000);
  };

  const handleManualConnect = async () => {
    if (!credentials.clientId || !credentials.clientSecret) {
      setError('Please fill in all required fields');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await onComplete({
        method: 'manual',
        ...credentials,
        platform,
      });
    } catch (err) {
      setError('Failed to connect. Please check your credentials.');
      setIsConnecting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: config.color }}
                ></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect {config.name}
              </h3>
              <p className="text-gray-600">
                Choose how you'd like to connect your {config.name} account
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setConnectionMethod('oauth')}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                  connectionMethod === 'oauth'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">OAuth Connection (Recommended)</h4>
                    <p className="text-sm text-gray-600">
                      Secure, one-click connection using {config.name}'s official OAuth flow
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setConnectionMethod('manual')}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                  connectionMethod === 'manual'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Manual Setup</h4>
                    <p className="text-sm text-gray-600">
                      Enter API credentials manually for advanced configuration
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">What you'll get:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Post scheduling and publishing</li>
                    <li>• Analytics and performance tracking</li>
                    <li>• Content optimization suggestions</li>
                    <li>• Automated cross-posting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        if (connectionMethod === 'oauth') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Authorize {config.name}
                </h3>
                <p className="text-gray-600">
                  Click the button below to securely connect your {config.name} account
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-3">Permissions Required:</h4>
                <div className="space-y-2">
                  {config.scopes.map((scope: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{scope}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOAuthConnect}
                disabled={isConnecting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: config.color }}
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Connect with {config.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-900 mb-1">Security Notice</h5>
                    <p className="text-sm text-yellow-800">
                      You'll be redirected to {config.name}'s secure login page. 
                      We never see or store your login credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Setup Instructions
                </h3>
                <p className="text-gray-600">
                  Follow these steps to get your {config.name} API credentials
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Step-by-step guide:</h4>
                <ol className="space-y-3">
                  {config.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900 mb-1">Need Help?</h5>
                    <p className="text-sm text-blue-800 mb-2">
                      Check out our detailed setup guide for {config.name}
                    </p>
                    <button className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center space-x-1">
                      <span>View Setup Guide</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

      case 3:
        if (connectionMethod === 'oauth') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Successfully Connected!
                </h3>
                <p className="text-gray-600">
                  Your {config.name} account has been connected successfully
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-medium text-green-900 mb-3">Connection Details:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Account:</span>
                    <span className="text-green-900 font-medium">@your_username</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Permissions:</span>
                    <span className="text-green-900 font-medium">Full Access</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Status:</span>
                    <span className="text-green-900 font-medium">Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">What's next?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Start creating and scheduling content</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>View analytics and performance metrics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Set up automated posting schedules</span>
                  </li>
                </ul>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Enter API Credentials
                </h3>
                <p className="text-gray-600">
                  Paste your {config.name} API credentials below
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID / App ID *
                  </label>
                  <input
                    type="text"
                    value={credentials.clientId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                    placeholder="Enter your client ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Secret / App Secret *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.clientSecret ? 'text' : 'password'}
                      value={credentials.clientSecret}
                      onChange={(e) => setCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                      placeholder="Enter your client secret"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(prev => ({ ...prev, clientSecret: !prev.clientSecret }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.clientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Token (optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.accessToken ? 'text' : 'password'}
                      value={credentials.accessToken}
                      onChange={(e) => setCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
                      placeholder="Enter access token if available"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(prev => ({ ...prev, accessToken: !prev.accessToken }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.accessToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Callback URL</h5>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono">
                    {window.location.origin}/auth/callback/{platform}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/auth/callback/${platform}`)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add this URL to your {config.name} app's redirect URIs
                </p>
              </div>
            </div>
          );
        }

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Successfully Connected!
              </h3>
              <p className="text-gray-600">
                Your {config.name} account has been connected successfully
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-medium text-green-900 mb-3">Connection Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Platform:</span>
                  <span className="text-green-900 font-medium">{config.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Method:</span>
                  <span className="text-green-900 font-medium">Manual Setup</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Status:</span>
                  <span className="text-green-900 font-medium">Active</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">What's next?</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Start creating and scheduling content</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>View analytics and performance metrics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Set up automated posting schedules</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2 && connectionMethod === 'oauth') return true;
    if (currentStep === 3 && connectionMethod === 'manual') {
      return credentials.clientId && credentials.clientSecret;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 3 && connectionMethod === 'manual') {
      handleManualConnect();
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Platform Connection</h2>
            <p className="text-gray-600 mt-1">Step {currentStep} of {totalSteps}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep > 1 ? 'Back' : 'Cancel'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isConnecting}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>
              {currentStep === totalSteps ? 'Finish' : 
               currentStep === 3 && connectionMethod === 'manual' ? 'Connect' : 
               'Next'}
            </span>
            {currentStep < totalSteps && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}