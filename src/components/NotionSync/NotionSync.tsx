import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Database, 
  FileText, 
  Calendar, 
  Users, 
  Zap, 
  Download, 
  Upload, 
  FolderSync as Sync, 
  Clock, 
  Filter, 
  Search,
  ArrowRight,
  Copy
} from 'lucide-react';
import { NotionConnectionWizard } from './NotionConnectionWizard';
import { NotionDatabaseSelector } from './NotionDatabaseSelector';
import { NotionSyncSettings } from './NotionSyncSettings';
import { NotionContentMapper } from './NotionContentMapper';
import { useNotionSync, DatabaseMapping } from '../../hooks/useNotionSync';
import { notionService, NotionDatabase } from '../../services/notionService';
import { useAuth } from '../../hooks/useAuth';
import { useContentData } from '../../hooks/useContentData';
import { ContentItem } from '../../types';

export function NotionSync() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'databases' | 'sync' | 'settings'>('overview');
  const [showConnectionWizard, setShowConnectionWizard] = useState(false);
  const [showDatabaseSelector, setShowDatabaseSelector] = useState(false);
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const [showContentMapper, setShowContentMapper] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<NotionDatabase | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<DatabaseMapping | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const { addContentItem } = useContentData();

  const {
    isConnected,
    databases,
    databaseMappings,
    syncHistory,
    syncSettings,
    loading,
    error,
    connectToNotion,
    handleOAuthCallback,
    disconnectFromNotion,
    syncDatabase,
    updateSyncSettings,
    refreshDatabases,
    createDatabaseMapping,
    updateDatabaseMapping,
    deleteDatabaseMapping,
    pullContentFromNotion
  } = useNotionSync();

  // Check for OAuth callback in URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (code && state) {
      // Handle OAuth callback
      handleOAuthCallback(code, state)
        .then(success => {
          if (success) {
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })
        .catch(err => {
          console.error('Failed to handle OAuth callback:', err);
          setOauthError('Failed to connect to Notion. Please try again.');
        });
    } else if (error) {
      setOauthError(errorDescription || 'Failed to connect to Notion');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnect = async (credentials: any) => {
    await connectToNotion(credentials);
    setShowConnectionWizard(false);
  };

  const handleSelectDatabase = async (database: NotionDatabase) => {
    setSelectedDatabase(database);
    
    // Check if database is already mapped
    const existingMapping = databaseMappings.find(m => m.databaseId === database.id);
    if (existingMapping) {
      setSelectedMapping(existingMapping);
    } else {
      setSelectedMapping(null);
    }
    
    setShowDatabaseSelector(false);
    setShowContentMapper(true);
  };

  const handleSaveMapping = async (mapping: Omit<DatabaseMapping, 'id' | 'lastSynced'>) => {
    if (selectedMapping) {
      // Update existing mapping
      await updateDatabaseMapping(selectedMapping.id, mapping);
    } else {
      // Create new mapping
      await createDatabaseMapping(
        mapping.databaseId,
        mapping.databaseName,
        mapping.propertyMappings,
        mapping.contentType,
        mapping.autoSync
      );
    }
    
    setShowContentMapper(false);
    setSelectedDatabase(null);
    setSelectedMapping(null);
  };

  const handlePullContent = async (mappingId: string) => {
    try {
      const contentItems = await pullContentFromNotion(mappingId, 5);
      
      // Add content items to content library
      contentItems.forEach(item => {
        addContentItem(item);
      });
      
      return contentItems.length;
    } catch (err) {
      console.error('Failed to pull content:', err);
      return 0;
    }
  };

  const getOverviewStats = () => {
    return {
      connectedDatabases: databaseMappings.length,
      totalSyncs: syncHistory.length,
      lastSync: syncHistory.length > 0 ? syncHistory[0].timestamp : null,
      syncedContent: syncHistory.reduce((sum, sync) => sum + sync.itemsProcessed, 0),
    };
  };

  const stats = getOverviewStats();
  const connection = notionService.getConnectionInfo();

  return (
    <div className="space-y-6">
      {/* OAuth Error */}
      {oauthError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800 mb-1">Connection Error</h3>
            <p className="text-red-700">{oauthError}</p>
          </div>
          <button 
            onClick={() => setOauthError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notion Integration</h2>
          <p className="text-gray-600 mt-1">
            Sync your content with Notion databases and workspaces
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <>
              <button
                onClick={() => setShowSyncSettings(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setShowDatabaseSelector(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Database</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowConnectionWizard(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Connect Notion</span>
            </button>
          )}
        </div>
      </div>

      {!isConnected ? (
        /* Connection Required State */
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Notion Workspace</h3>
            <p className="text-gray-600 mb-6">
              Sync your content with Notion databases to streamline your workflow and keep everything organized in one place.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-left p-4 bg-blue-50 rounded-lg">
                <Database className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-blue-900 mb-1">Database Sync</h4>
                <p className="text-sm text-blue-700">Automatically sync content to your Notion databases</p>
              </div>
              <div className="text-left p-4 bg-green-50 rounded-lg">
                <Sync className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-medium text-green-900 mb-1">Two-Way Sync</h4>
                <p className="text-sm text-green-700">Keep content in sync between platforms</p>
              </div>
            </div>

            <button
              onClick={() => setShowConnectionWizard(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Get Started with Notion
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Database },
                { id: 'databases', label: `Databases (${databaseMappings.length})`, icon: FileText },
                { id: 'sync', label: 'Sync History', icon: RefreshCw },
                { id: 'settings', label: 'Settings', icon: Settings },
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
              {/* Connection Info */}
              {connection && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Connected Workspace</h3>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {connection.workspaceIcon ? (
                        <img 
                          src={connection.workspaceIcon} 
                          alt={connection.workspaceName} 
                          className="w-10 h-10 rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-medium">
                          {connection.workspaceName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-green-900">{connection.workspaceName}</h4>
                        <p className="text-sm text-green-700">
                          Connected {new Date(connection.connectedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open('https://www.notion.so/', '_blank')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-green-200 text-green-700 rounded-lg text-sm hover:bg-green-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Notion</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.connectedDatabases}</h3>
                  <p className="text-gray-600">Connected Databases</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Sync className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalSyncs}</h3>
                  <p className="text-gray-600">Total Syncs</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.syncedContent}</h3>
                  <p className="text-gray-600">Items Synced</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.lastSync ? 'Active' : 'Inactive'}
                  </h3>
                  <p className="text-gray-600">Sync Status</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowDatabaseSelector(true)}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">Add Database</h4>
                      <p className="text-sm text-gray-600">Connect a new Notion database</p>
                    </div>
                  </button>

                  <button
                    onClick={refreshDatabases}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">Sync All</h4>
                      <p className="text-sm text-gray-600">Refresh all database connections</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowSyncSettings(true)}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">Configure Sync</h4>
                      <p className="text-sm text-gray-600">Manage sync settings</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Connected Databases */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Connected Databases</h3>
                  <button
                    onClick={() => setShowDatabaseSelector(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Add Database
                  </button>
                </div>
                
                {databaseMappings.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No databases connected yet</p>
                    <button
                      onClick={() => setShowDatabaseSelector(true)}
                      className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Connect your first database
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {databaseMappings.slice(0, 3).map((mapping) => (
                      <div key={mapping.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Database className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{mapping.databaseName}</h4>
                            <p className="text-sm text-gray-600 capitalize">{mapping.contentType} content</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={async () => {
                              const count = await handlePullContent(mapping.id);
                              alert(`Pulled ${count} items from ${mapping.databaseName}`);
                            }}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span>Pull Content</span>
                          </button>
                          <button
                            onClick={() => syncDatabase(mapping.id)}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Sync</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    {databaseMappings.length > 3 && (
                      <button
                        onClick={() => setActiveTab('databases')}
                        className="w-full text-center py-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View all {databaseMappings.length} databases
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'databases' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search databases..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowDatabaseSelector(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Database</span>
                </button>
              </div>

              {databaseMappings.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Databases Mapped</h3>
                  <p className="text-gray-600 mb-4">
                    Connect your first Notion database to start syncing content
                  </p>
                  <button
                    onClick={() => setShowDatabaseSelector(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Browse Databases
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {databaseMappings.map((mapping) => (
                    <div key={mapping.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Database className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                            {mapping.contentType}
                          </span>
                          {mapping.autoSync && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Auto Sync
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{mapping.databaseName}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Mapped Fields:</span>
                          <span className="font-medium">{Object.keys(mapping.propertyMappings).length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Sync:</span>
                          <span className="font-medium">
                            {mapping.lastSynced ? new Date(mapping.lastSynced).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={async () => {
                            const count = await handlePullContent(mapping.id);
                            alert(`Pulled ${count} items from ${mapping.databaseName}`);
                          }}
                          className="flex-1 bg-primary-100 hover:bg-primary-200 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Pull Content
                        </button>
                        <button
                          onClick={() => syncDatabase(mapping.id)}
                          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Sync Now
                        </button>
                        <button 
                          onClick={() => {
                            // Find the database in the databases list
                            const database = databases.find(db => db.id === mapping.databaseId);
                            if (database) {
                              setSelectedDatabase(database);
                              setSelectedMapping(mapping);
                              setShowContentMapper(true);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this mapping?')) {
                              deleteDatabaseMapping(mapping.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sync History</h3>
                  <div className="flex items-center space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>All Databases</option>
                      {databaseMappings.map(mapping => (
                        <option key={mapping.id} value={mapping.id}>{mapping.databaseName}</option>
                      ))}
                    </select>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {syncHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No sync history yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {syncHistory.map((sync) => (
                      <div key={sync.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            sync.status === 'success' ? 'bg-green-100' : 
                            sync.status === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            {sync.status === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : sync.status === 'error' ? (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{sync.databaseName}</h4>
                            <p className="text-sm text-gray-600">
                              {sync.itemsProcessed} items • {sync.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sync.status === 'success' ? 'bg-green-100 text-green-700' :
                            sync.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {sync.status}
                          </span>
                          {sync.status === 'error' && (
                            <button 
                              title={sync.errorMessage}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <NotionSyncSettings
              settings={syncSettings}
              onUpdateSettings={updateSyncSettings}
              onDisconnect={disconnectFromNotion}
            />
          )}
        </>
      )}

      {/* Modals */}
      {showConnectionWizard && (
        <NotionConnectionWizard
          onClose={() => setShowConnectionWizard(false)}
          onComplete={handleConnect}
        />
      )}

      {showDatabaseSelector && (
        <NotionDatabaseSelector
          onClose={() => setShowDatabaseSelector(false)}
          onSelect={handleSelectDatabase}
          databases={databases}
        />
      )}

      {showSyncSettings && (
        <NotionSyncSettings
          settings={syncSettings}
          onUpdateSettings={updateSyncSettings}
          onDisconnect={disconnectFromNotion}
          onClose={() => setShowSyncSettings(false)}
        />
      )}

      {showContentMapper && selectedDatabase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Map Database Fields</h2>
                <p className="text-gray-600 mt-1">{selectedDatabase.title}</p>
              </div>
              <button
                onClick={() => {
                  setShowContentMapper(false);
                  setSelectedDatabase(null);
                  setSelectedMapping(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <NotionContentMapper
                database={selectedDatabase}
                existingMapping={selectedMapping}
                onSave={handleSaveMapping}
                onCancel={() => {
                  setShowContentMapper(false);
                  setSelectedDatabase(null);
                  setSelectedMapping(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// X icon component
function X({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

// Trash2 icon component
function Trash2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}