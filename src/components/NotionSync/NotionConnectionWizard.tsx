import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  ExternalLink,
  Shield,
  Key,
  BookOpen,
  AlertTriangle,
  Info,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { notionService } from '../../services/notionService';

interface NotionConnectionWizardProps {
  onClose: () => void;
  onComplete: (credentials: any) => Promise<void>;
}

export function NotionConnectionWizard({ onClose, onComplete }: NotionConnectionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [connectionMethod, setConnectionMethod] = useState<'oauth' | 'integration'>('oauth');
  const [credentials, setCredentials] = useState({
    integrationToken: '',
    workspaceId: '',
  });
  const [showToken, setShowToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = connectionMethod === 'oauth' ? 3 : 4;

  const handleOAuthConnect = () => {
    setIsConnecting(true);
    
    try {
      // Redirect to Notion OAuth
      onComplete({
        method: 'oauth'
      });
    } catch (error) {
      console.error('OAuth connection failed:', error);
      setError('Failed to connect to Notion. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleIntegrationConnect = async () => {
    if (!credentials.integrationToken) {
      setError('Please enter your integration token');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await onComplete({
        method: 'integration',
        ...credentials,
      });
    } catch (err) {
      setError('Failed to connect. Please check your integration token.');
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
              <div className="w-16 h-16 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect to Notion
              </h3>
              <p className="text-gray-600">
                Choose how you'd like to connect your Notion workspace
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
                      Secure, one-click connection using Notion's official OAuth flow
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setConnectionMethod('integration')}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                  connectionMethod === 'integration'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Integration Token</h4>
                    <p className="text-sm text-gray-600">
                      Use a Notion integration token for advanced configuration
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
                    <li>• Sync content with Notion databases</li>
                    <li>• Two-way synchronization</li>
                    <li>• Automated content organization</li>
                    <li>• Real-time collaboration features</li>
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
                  Authorize Notion Access
                </h3>
                <p className="text-gray-600">
                  Click the button below to securely connect your Notion workspace
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-3">Permissions Required:</h4>
                <div className="space-y-2">
                  {[
                    'Read database structure and content',
                    'Create and update database entries',
                    'Access workspace information',
                    'Manage page properties'
                  ].map((permission, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOAuthConnect}
                disabled={isConnecting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Connect with Notion</span>
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-900 mb-1">Security Notice</h5>
                    <p className="text-sm text-yellow-800">
                      You'll be redirected to Notion's secure login page. 
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
                  Create Notion Integration
                </h3>
                <p className="text-gray-600">
                  Follow these steps to create a Notion integration
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Step-by-step guide:</h4>
                <ol className="space-y-3">
                  {[
                    'Go to https://www.notion.so/my-integrations',
                    'Click "New integration" button',
                    'Enter integration name (e.g., "ContentHub")',
                    'Select your workspace',
                    'Click "Submit" to create the integration',
                    'Copy the "Internal Integration Token"'
                  ].map((instruction, index) => (
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
                      Check out Notion's official guide for creating integrations
                    </p>
                    <a 
                      href="https://developers.notion.com/docs/getting-started" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center space-x-1"
                    >
                      <span>View Notion Guide</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
                  Your Notion workspace has been connected successfully
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-medium text-green-900 mb-3">Connection Details:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Workspace:</span>
                    <span className="text-green-900 font-medium">My Workspace</span>
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
                    <span>Browse and connect your databases</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Set up automated content syncing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Configure sync preferences</span>
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
                  Enter Integration Token
                </h3>
                <p className="text-gray-600">
                  Paste your Notion integration token below
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Integration Token *
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={credentials.integrationToken}
                      onChange={(e) => setCredentials(prev => ({ ...prev, integrationToken: e.target.value }))}
                      placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your integration token starts with "secret_"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workspace ID (optional)
                  </label>
                  <input
                    type="text"
                    value={credentials.workspaceId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, workspaceId: e.target.value }))}
                    placeholder="Enter workspace ID if known"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Important Notes:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Make sure to share your databases with the integration</li>
                  <li>• The integration needs appropriate permissions to read/write</li>
                  <li>• You can manage integration settings in Notion anytime</li>
                </ul>
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
                Your Notion integration has been set up successfully
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-medium text-green-900 mb-3">Connection Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Method:</span>
                  <span className="text-green-900 font-medium">Integration Token</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Status:</span>
                  <span className="text-green-900 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Permissions:</span>
                  <span className="text-green-900 font-medium">Read/Write</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">What's next?</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Browse and connect your databases</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Set up automated content syncing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Configure sync preferences</span>
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
    if (currentStep === 3 && connectionMethod === 'integration') {
      return credentials.integrationToken.trim().length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 3 && connectionMethod === 'integration') {
      handleIntegrationConnect();
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
            <h2 className="text-xl font-semibold text-gray-900">Notion Connection</h2>
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
               currentStep === 3 && connectionMethod === 'integration' ? 'Connect' : 
               'Next'}
            </span>
            {currentStep < totalSteps && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}