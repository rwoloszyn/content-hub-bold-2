import { useState } from 'react';
import { 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { 
  deployProject, 
  getDeploymentStatus as getDeploymentStatusService,
  DeploymentStatus 
} from '../../services/deploymentService';

export function DeploymentSettings() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [environments, setEnvironments] = useState([
    { id: 1, name: 'Production', url: 'https://myapp.com', status: 'active' as const },
    { id: 2, name: 'Staging', url: 'https://staging.myapp.com', status: 'active' as const },
    { id: 3, name: 'Development', url: 'https://dev.myapp.com', status: 'inactive' as const }
  ]);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const result = await deployProject({
        build_command: 'npm run build',
        output_directory: 'dist',
        deploy_message: 'Manual deployment from settings'
      });
      console.log('Deployment result:', result);
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const refreshDeploymentStatus = async () => {
    try {
      const status = await getDeploymentStatusService();
      if (status) {
        console.log('Deployment status:', status);
      }
    } catch (error) {
      console.error('Failed to get deployment status:', error);
    }
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
          {/* This section is no longer directly tied to a deployment status object */}
          {/* It will be replaced with a placeholder or removed if not needed */}
          <div className="text-center py-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Deployment Status</h4>
            <p className="text-gray-500">No current deployment status available.</p>
            <button
              onClick={refreshDeploymentStatus}
              disabled={isDeploying}
              className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </>
              )}
            </button>
          </div>

          {/* This section is no longer directly tied to a deployment status object */}
          {/* It will be replaced with a placeholder or removed if not needed */}
          {false && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Deployment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployment URL:</span>
                  <span className="text-gray-900">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployment ID:</span>
                  <span className="text-gray-900 font-mono">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployed at:</span>
                  <span className="text-gray-900">N/A</span>
                </div>
                {/* Deployment note is not available in the new structure */}
              </div>
            </div>
          )}

          {/* This section is no longer directly tied to a deployment status object */}
          {/* It will be replaced with a placeholder or removed if not needed */}
          {/* Error details are not available in the new structure */}
        </div>
      </div>

      {/* Deploy Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Deploy Your Site</h3>
          </div>
          
          {isDeploying && (
            <div className="flex items-center space-x-2 text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Deploying...</span>
            </div>
          )}
        </div>
        
        {/* This section is no longer directly tied to a deployment confirmation state */}
        {/* It will be replaced with a placeholder or removed if not needed */}
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
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-700">Enabled</span>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Manual Deployments</h4>
              <p className="text-sm text-gray-600 mb-3">
                Trigger a deployment manually to publish your latest changes.
              </p>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deploying...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Deploy Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment History</h3>
        
        <div className="space-y-3">
          {/* This section is no longer directly tied to a deployment status object */}
          {/* It will be replaced with a placeholder or removed if not needed */}
          <div className="text-center py-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Deployment History</h4>
            <p className="text-gray-500">No deployment history available.</p>
          </div>
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