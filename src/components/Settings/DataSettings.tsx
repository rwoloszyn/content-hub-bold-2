import { useState } from 'react';
import { 
  Shield, 
  Download, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileText,
  Settings
} from 'lucide-react';

export function DataSettings() {
  const [exportInProgress, setExportInProgress] = useState(false);
  const [deleteAccountStep, setDeleteAccountStep] = useState(0);
  const [confirmText, setConfirmText] = useState('');

  const dataTypes = [
    {
      id: 'content',
      name: 'Content & Posts',
      description: 'All your created content, drafts, and published posts',
      size: '2.3 MB',
      lastUpdated: '2 hours ago',
    },
    {
      id: 'analytics',
      name: 'Analytics Data',
      description: 'Performance metrics, engagement data, and reports',
      size: '1.8 MB',
      lastUpdated: '1 day ago',
    },
    {
      id: 'media',
      name: 'Media Files',
      description: 'Images, videos, and other uploaded media',
      size: '45.2 MB',
      lastUpdated: '3 hours ago',
    },
    {
      id: 'settings',
      name: 'Account Settings',
      description: 'Profile information, preferences, and configurations',
      size: '0.1 MB',
      lastUpdated: '1 week ago',
    },
  ];

  const privacySettings = [
    {
      id: 'analytics',
      name: 'Analytics Tracking',
      description: 'Allow us to collect usage analytics to improve the product',
      enabled: true,
    },
    {
      id: 'marketing',
      name: 'Marketing Communications',
      description: 'Receive product updates, tips, and promotional emails',
      enabled: false,
    },
    {
      id: 'thirdParty',
      name: 'Third-party Integrations',
      description: 'Share data with connected platforms for enhanced functionality',
      enabled: true,
    },
    {
      id: 'publicProfile',
      name: 'Public Profile',
      description: 'Make your profile visible to other ContentHub users',
      enabled: true,
    },
  ];

  const handleExportData = async (dataType?: string) => {
    setExportInProgress(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setExportInProgress(false);
    
    // In a real implementation, this would trigger a download
    console.log('Export completed for:', dataType || 'all data');
  };

  const handleDeleteAccount = () => {
    if (deleteAccountStep === 0) {
      setDeleteAccountStep(1);
    } else if (deleteAccountStep === 1 && confirmText === 'DELETE MY ACCOUNT') {
      // Process account deletion
      console.log('Account deletion initiated');
      setDeleteAccountStep(2);
    }
  };

  const handlePrivacyToggle = (settingId: string) => {
    // Handle privacy setting toggle
    console.log('Toggle privacy setting:', settingId);
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Download className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Export Your Data</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Download a copy of your data in a portable format. This includes all your content, 
          settings, and analytics data.
        </p>

        <div className="space-y-4 mb-6">
          {dataTypes.map((dataType) => (
            <div key={dataType.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">{dataType.name}</h4>
                  <p className="text-sm text-gray-600">{dataType.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{dataType.size}</span>
                    <span>•</span>
                    <span>Updated {dataType.lastUpdated}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleExportData(dataType.id)}
                disabled={exportInProgress}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exportInProgress ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Export</span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <h4 className="font-medium text-blue-900">Export All Data</h4>
            <p className="text-sm text-blue-700">Download a complete archive of all your data</p>
          </div>
          <button
            onClick={() => handleExportData()}
            disabled={exportInProgress}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowe transition-colors"
          >
            {exportInProgress ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Control how your data is used and shared. You can adjust these settings at any time.
        </p>

        <div className="space-y-4">
          {privacySettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{setting.name}</h4>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={setting.enabled}
                  onChange={() => handlePrivacyToggle(setting.id)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Retention</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Automatic Data Cleanup</h4>
            <p className="text-sm text-gray-600 mb-3">
              Automatically delete old data to keep your account clean and secure.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Delete draft content after</span>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option value="never">Never</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Delete analytics data after</span>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option value="never">Never</option>
                  <option value="365">1 year</option>
                  <option value="730">2 years</option>
                  <option value="1095">3 years</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Delete unused media after</span>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option value="never">Never</option>
                  <option value="180">6 months</option>
                  <option value="365">1 year</option>
                  <option value="730">2 years</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GDPR Compliance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">GDPR & Compliance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Your Rights</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Right to access your personal data</li>
                <li>• Right to rectify inaccurate data</li>
                <li>• Right to erase your data</li>
                <li>• Right to restrict processing</li>
                <li>• Right to data portability</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View Privacy Policy
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Contact Data Protection Officer
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Trash2 className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
        </div>
        
        {deleteAccountStep === 0 && (
          <div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Warning: This action cannot be undone</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• All your content and data will be permanently deleted</li>
                    <li>• Your subscription will be cancelled immediately</li>
                    <li>• Connected integrations will be disconnected</li>
                    <li>• You will lose access to all team workspaces</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Before deleting your account, consider exporting your data or downgrading to a free plan instead.
            </p>
            
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              I want to delete my account
            </button>
          </div>
        )}

        {deleteAccountStep === 1 && (
          <div>
            <p className="text-gray-600 mb-4">
              To confirm account deletion, please type <strong>DELETE MY ACCOUNT</strong> in the field below:
            </p>
            
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE MY ACCOUNT"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
            />
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'DELETE MY ACCOUNT'}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Delete My Account
              </button>
              <button
                onClick={() => {
                  setDeleteAccountStep(0);
                  setConfirmText('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {deleteAccountStep === 2 && (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Account Deletion Initiated</h4>
            <p className="text-gray-600">
              Your account deletion request has been submitted. You will receive a confirmation email shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}