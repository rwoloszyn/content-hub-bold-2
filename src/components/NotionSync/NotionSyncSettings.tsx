import { useState, useEffect } from 'react';
import { 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Info,
  Save,
  X
} from 'lucide-react';
import { useNotionSync } from '../../hooks/useNotionSync';
import { NotionDatabase } from '../../services/notionService';

interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // in minutes
  syncDirection: 'one-way' | 'two-way';
  conflictResolution: 'overwrite' | 'merge' | 'manual';
  enableNotifications: boolean;
  syncOnCreate: boolean;
  syncOnUpdate: boolean;
  syncOnDelete: boolean;
}

interface NotionSyncSettingsProps {
  settings: SyncSettings;
  onUpdateSettings: (settings: SyncSettings) => void;
  onDisconnect: () => void;
  onClose?: () => void;
}

export function NotionSyncSettings({ 
  settings, 
  onUpdateSettings, 
  onDisconnect,
  onClose 
}: NotionSyncSettingsProps) {
  const [localSettings, setLocalSettings] = useState<SyncSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof SyncSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setHasChanges(false);
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect from Notion? This will stop all syncing and remove access to your databases.')) {
      onDisconnect();
      if (onClose) onClose();
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Sync Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Configuration</h3>
        
        <div className="space-y-4">
          {/* Auto Sync */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Automatic Sync</h4>
              <p className="text-sm text-gray-600">Enable automatic synchronization with Notion</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoSync}
                onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Sync Interval */}
          {localSettings.autoSync && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Interval
              </label>
              <select
                value={localSettings.syncInterval}
                onChange={(e) => handleSettingChange('syncInterval', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={5}>Every 5 minutes</option>
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every hour</option>
                <option value={240}>Every 4 hours</option>
                <option value={1440}>Daily</option>
              </select>
            </div>
          )}

          {/* Sync Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sync Direction
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="syncDirection"
                  value="one-way"
                  checked={localSettings.syncDirection === 'one-way'}
                  onChange={(e) => handleSettingChange('syncDirection', e.target.value)}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-medium text-gray-900">One-way (ContentHub → Notion)</span>
                  <p className="text-sm text-gray-600">Changes only sync from ContentHub to Notion</p>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="syncDirection"
                  value="two-way"
                  checked={localSettings.syncDirection === 'two-way'}
                  onChange={(e) => handleSettingChange('syncDirection', e.target.value)}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Two-way (Bidirectional)</span>
                  <p className="text-sm text-gray-600">Changes sync in both directions</p>
                </div>
              </label>
            </div>
          </div>

          {/* Conflict Resolution */}
          {localSettings.syncDirection === 'two-way' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conflict Resolution
              </label>
              <select
                value={localSettings.conflictResolution}
                onChange={(e) => handleSettingChange('conflictResolution', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="overwrite">Overwrite (ContentHub wins)</option>
                <option value="merge">Smart merge</option>
                <option value="manual">Manual resolution</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                How to handle conflicts when the same content is modified in both places
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sync Triggers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Triggers</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sync on Create</h4>
              <p className="text-sm text-gray-600">Automatically sync when new content is created</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.syncOnCreate}
                onChange={(e) => handleSettingChange('syncOnCreate', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sync on Update</h4>
              <p className="text-sm text-gray-600">Automatically sync when content is modified</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.syncOnUpdate}
                onChange={(e) => handleSettingChange('syncOnUpdate', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sync on Delete</h4>
              <p className="text-sm text-gray-600">Automatically sync when content is deleted</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.syncOnDelete}
                onChange={(e) => handleSettingChange('syncOnDelete', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Sync Notifications</h4>
            <p className="text-sm text-gray-600">Get notified about sync status and conflicts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.enableNotifications}
              onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      {/* Connection Management */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Management</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Connected to Notion</h4>
                <p className="text-sm text-green-700">Integration is active and working</p>
              </div>
            </div>
            <div className="text-sm text-green-600">
              Connected 2 days ago
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Disconnect Warning</h4>
                <p className="text-sm text-yellow-800 mb-3">
                  Disconnecting will stop all syncing and remove access to your Notion databases. 
                  Your existing content will remain in both platforms.
                </p>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Disconnect from Notion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes */}
      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-medium">You have unsaved changes</span>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Notion Sync Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}