import React, { useState } from 'react';
import { 
  Globe, 
  Server, 
  Upload, 
  Check, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Loader2,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useDeployment } from '../../hooks/useDeployment';

export function DeploymentSettings() {
  const { 
    deployStatus, 
    isDeploying, 
    lastDeployment, 
    deployProject, 
    getDeploymentStatus 
  } = useDeployment();
  
  const [showDeployConfirm, setShowDeployConfirm] = useState(false);
  const [deploymentNote, setDeploymentNote] = useState('');

  const handleDeploy = async () => {
    await deployProject(deploymentNote);
    setShowDeployConfirm(false);
    setDeploymentNote('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Deployment Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Deployment Status</h3>
        </div>
        
        <div className="space-y-4">
          {lastDeployment ? (
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              lastDeployment.status === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : lastDeployment.status === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center space-x-3">
                {lastDeployment.status === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : lastDeployment.status === 'error' ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Clock className="w-6 h-6 text-blue-600" />
                )}
                <div>
                  <h4 className={`font-medium ${
                    lastDeployment.status === 'success' 
                      ? 'text-green-900' 
                      : lastDeployment.status === 'error'
                      ? 'text-red-900'
                      : 'text-blue-900'
                  }`}>
                    {lastDeployment.status === 'success' 
                      ? 'Deployment Successful' 
                      : lastDeployment.status === 'error'
                      ? 'Deployment Failed'
                      : 'Deployment In Progress'}
                  </h4>
                  <p className={`text-sm ${
                    lastDeployment.status === 'success' 
                      ? 'text-green-700' 
                      : lastDeployment.status === 'error'
                      ? 'text-red-700'
                      : 'text-blue-700'
                  }`}>
                    {lastDeployment.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {lastDeployment.status === 'success' && lastDeployment.url && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(lastDeployment.url!)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={lastDeployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Server className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No deployments yet</p>
            </div>
          )}

          {lastDeployment?.status === 'success' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Deployment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployment URL:</span>
                  <a
                    href={lastDeployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                  >
                    <span>{lastDeployment.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployment ID:</span>
                  <span className="text-gray-900 font-mono">{lastDeployment.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployed at:</span>
                  <span className="text-gray-900">{lastDeployment.timestamp.toLocaleString()}</span>
                </div>
                {lastDeployment.note && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deployment note:</span>
                    <span className="text-gray-900">{lastDeployment.note}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {lastDeployment?.status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Error Details</h4>
              <p className="text-sm text-red-700">{lastDeployment.error || 'An unknown error occurred during deployment.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Deploy Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Upload className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Deploy Your Site</h3>
          </div>
          
          {isDeploying && (
            <div className="flex items-center space-x-2 text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Deploying...</span>
            </div>
          )}
        </div>
        
        {showDeployConfirm ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Deployment Confirmation</h4>
                  <p className="text-sm text-blue-800">
                    You're about to deploy your ContentHub application to production. This will make your changes live to all users.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deployment Note (optional)
              </label>
              <input
                type="text"
                value={deploymentNote}
                onChange={(e) => setDeploymentNote(e.target.value)}
                placeholder="e.g., Added new features, Fixed bugs"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Deploying...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Confirm Deployment</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowDeployConfirm(false)}
                disabled={isDeploying}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Deploy your ContentHub application to make it accessible online. Your deployment will be built with the latest changes and optimized for production.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Automatic Deployments</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your site will automatically deploy when you push changes to the main branch.
                </p>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700">Enabled</span>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Manual Deployments</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Trigger a deployment manually to publish your latest changes.
                </p>
                <button
                  onClick={() => setShowDeployConfirm(true)}
                  disabled={isDeploying}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deploying...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Deploy Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deployment History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment History</h3>
        
        <div className="space-y-3">
          {lastDeployment ? (
            <>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {lastDeployment.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : lastDeployment.status === 'error' ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {lastDeployment.note || 'Deployment'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lastDeployment.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lastDeployment.status === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : lastDeployment.status === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {lastDeployment.status}
                  </span>
                  {lastDeployment.url && (
                    <a
                      href={lastDeployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Initial deployment
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    success
                  </span>
                  <a
                    href="https://contenthub-demo.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No deployment history yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Deployment Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Production Branch</h4>
              <p className="text-sm text-gray-600">The branch that will be deployed to production</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                main
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Build Command</h4>
              <p className="text-sm text-gray-600">Command used to build your site</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-mono">
                npm run build
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Publish Directory</h4>
              <p className="text-sm text-gray-600">Directory containing deployment-ready HTML/CSS/JS</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-mono">
                dist
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Environment Variables</h4>
              <p className="text-sm text-gray-600">Configure environment-specific settings</p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Custom Domain */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Custom Domain</h3>
          </div>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Add Domain
          </button>
        </div>
        
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No custom domains configured</p>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            Add Custom Domain
          </button>
        </div>
      </div>
    </div>
  );
}