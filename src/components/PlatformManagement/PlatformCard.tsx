import { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Calendar,
  Eye
} from 'lucide-react';
import { Platform, PlatformType } from '../../types';
import { format } from 'date-fns';

interface PlatformCardProps {
  platform: Platform;
  platformInfo: {
    type: PlatformType;
    name: string;
    description: string;
    features: string[];
    color: string;
    icon: string;
  };
  onDisconnect: () => void;
  onSettings: () => void;
}

export function PlatformCard({ platform, platformInfo, onDisconnect, onSettings }: PlatformCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = () => {
    if (!platform.connected) return 'text-red-600';
    if (platform.lastSync && new Date().getTime() - platform.lastSync.getTime() < 24 * 60 * 60 * 1000) {
      return 'text-green-600';
    }
    return 'text-yellow-600';
  };

  const getStatusIcon = () => {
    if (!platform.connected) return AlertTriangle;
    if (platform.lastSync && new Date().getTime() - platform.lastSync.getTime() < 24 * 60 * 60 * 1000) {
      return CheckCircle;
    }
    return AlertTriangle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${platformInfo.color}20` }}
          >
            <div 
              className="w-6 h-6 rounded"
              style={{ backgroundColor: platformInfo.color }}
            ></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onSettings}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onDisconnect}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Disconnect"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{platformInfo.name}</h3>
            <p className="text-sm text-gray-600">@{platform.username}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-4 h-4 ${getStatusColor()}`} />
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {platform.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-gray-400 mr-1" />
              <span className="font-semibold text-gray-900">
                {platform.followers?.toLocaleString() || '0'}
              </span>
            </div>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BarChart3 className="w-4 h-4 text-gray-400 mr-1" />
              <span className="font-semibold text-gray-900">
                {platform.engagement || '0%'}
              </span>
            </div>
            <p className="text-xs text-gray-500">Engagement</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-gray-400 mr-1" />
              <span className="font-semibold text-gray-900">
                {platform.scheduledPosts || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">Scheduled</p>
          </div>
        </div>

        {/* Last Sync */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Last sync:</span>
          <span>
            {platform.lastSync 
              ? format(platform.lastSync, 'MMM d, h:mm a')
              : 'Never'
            }
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg text-sm transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Sync</span>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Platform Features</h4>
          <div className="space-y-2">
            {platformInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="font-medium text-gray-900 mb-2">Connection Details</h5>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Account ID:</span>
                <span className="font-mono">{platform.accountId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Connected:</span>
                <span>{platform.connectedAt ? format(platform.connectedAt, 'MMM d, yyyy') : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Permissions:</span>
                <span className="text-green-600">Full Access</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}