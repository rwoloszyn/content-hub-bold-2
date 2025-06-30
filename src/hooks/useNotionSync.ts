import { useState, useEffect } from 'react';

export interface NotionDatabase {
  id: string;
  name: string;
  description: string;
  type: 'database' | 'page';
  properties: Array<{
    name: string;
    type: string;
  }>;
  itemCount: number;
  lastSync?: Date;
  isConnected: boolean;
}

export interface SyncHistoryItem {
  id: string;
  databaseName: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  itemsProcessed: number;
  errorMessage?: string;
}

export interface SyncSettings {
  autoSync: boolean;
  syncInterval: number;
  syncDirection: 'one-way' | 'two-way';
  conflictResolution: 'overwrite' | 'merge' | 'manual';
  enableNotifications: boolean;
  syncOnCreate: boolean;
  syncOnUpdate: boolean;
  syncOnDelete: boolean;
}

const mockDatabases: NotionDatabase[] = [
  {
    id: 'db-1',
    name: 'Content Calendar',
    description: 'Track all content creation and publishing schedules',
    type: 'database',
    properties: [
      { name: 'Title', type: 'title' },
      { name: 'Status', type: 'select' },
      { name: 'Publish Date', type: 'date' },
      { name: 'Platform', type: 'multi_select' },
      { name: 'Author', type: 'person' }
    ],
    itemCount: 45,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isConnected: true,
  },
  {
    id: 'db-2',
    name: 'Blog Posts',
    description: 'Manage blog post ideas, drafts, and published articles',
    type: 'database',
    properties: [
      { name: 'Title', type: 'title' },
      { name: 'Status', type: 'select' },
      { name: 'Category', type: 'select' },
      { name: 'Tags', type: 'multi_select' },
      { name: 'Word Count', type: 'number' }
    ],
    itemCount: 23,
    lastSync: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isConnected: true,
  },
];

const mockSyncHistory: SyncHistoryItem[] = [
  {
    id: 'sync-1',
    databaseName: 'Content Calendar',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'success',
    itemsProcessed: 12,
  },
  {
    id: 'sync-2',
    databaseName: 'Blog Posts',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'success',
    itemsProcessed: 5,
  },
  {
    id: 'sync-3',
    databaseName: 'Content Calendar',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'error',
    itemsProcessed: 0,
    errorMessage: 'Database access denied',
  },
];

const defaultSyncSettings: SyncSettings = {
  autoSync: true,
  syncInterval: 30,
  syncDirection: 'one-way',
  conflictResolution: 'overwrite',
  enableNotifications: true,
  syncOnCreate: true,
  syncOnUpdate: true,
  syncOnDelete: false,
};

export function useNotionSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryItem[]>([]);
  const [syncSettings, setSyncSettings] = useState<SyncSettings>(defaultSyncSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading connection status
    const loadConnectionStatus = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user has connected to Notion before
      const connected = localStorage.getItem('notion-connected') === 'true';
      setIsConnected(connected);
      
      if (connected) {
        setDatabases(mockDatabases);
        setSyncHistory(mockSyncHistory);
      }
      
      setLoading(false);
    };

    loadConnectionStatus();
  }, []);

  const connectToNotion = async (credentials: any) => {
    setLoading(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // In a real implementation, this would make an API call to connect
      localStorage.setItem('notion-connected', 'true');
      localStorage.setItem('notion-credentials', JSON.stringify(credentials));
      
      setIsConnected(true);
      setDatabases(mockDatabases);
      setSyncHistory(mockSyncHistory);
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to connect to Notion');
    } finally {
      setLoading(false);
    }
  };

  const disconnectFromNotion = async () => {
    setLoading(true);
    
    // Simulate disconnection process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.removeItem('notion-connected');
    localStorage.removeItem('notion-credentials');
    
    setIsConnected(false);
    setDatabases([]);
    setSyncHistory([]);
    
    setLoading(false);
  };

  const syncDatabase = async (databaseId: string) => {
    const database = databases.find(db => db.id === databaseId);
    if (!database) return;

    // Add pending sync to history
    const pendingSync: SyncHistoryItem = {
      id: `sync-${Date.now()}`,
      databaseName: database.name,
      timestamp: new Date(),
      status: 'pending',
      itemsProcessed: 0,
    };
    
    setSyncHistory(prev => [pendingSync, ...prev]);

    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update sync history with result
    const completedSync: SyncHistoryItem = {
      ...pendingSync,
      status: 'success',
      itemsProcessed: Math.floor(Math.random() * 20) + 1,
    };

    setSyncHistory(prev => 
      prev.map(sync => 
        sync.id === pendingSync.id ? completedSync : sync
      )
    );

    // Update database last sync time
    setDatabases(prev =>
      prev.map(db =>
        db.id === databaseId
          ? { ...db, lastSync: new Date() }
          : db
      )
    );
  };

  const updateSyncSettings = (newSettings: SyncSettings) => {
    setSyncSettings(newSettings);
    localStorage.setItem('notion-sync-settings', JSON.stringify(newSettings));
  };

  const refreshDatabases = async () => {
    setLoading(true);
    
    // Simulate API call to refresh databases
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would fetch updated database list
    setDatabases(mockDatabases);
    
    setLoading(false);
  };

  return {
    isConnected,
    databases,
    syncHistory,
    syncSettings,
    loading,
    connectToNotion,
    disconnectFromNotion,
    syncDatabase,
    updateSyncSettings,
    refreshDatabases,
  };
}