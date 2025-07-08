import { useState, useEffect } from 'react';
import { notionService, NotionDatabase, NotionPage } from '../services/notionService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';
import { ContentItem } from '../types';
import { analyticsService } from '../services/analyticsService';
import { sentryService } from '../services/sentryService';

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
  syncInterval: number; // in minutes
  syncDirection: 'one-way' | 'two-way';
  conflictResolution: 'overwrite' | 'merge' | 'manual';
  enableNotifications: boolean;
  syncOnCreate: boolean;
  syncOnUpdate: boolean;
  syncOnDelete: boolean;
}

export interface DatabaseMapping {
  id: string;
  databaseId: string;
  databaseName: string;
  propertyMappings: Record<string, string>;
  contentType: 'post' | 'article' | 'video' | 'image';
  lastSynced?: Date;
  autoSync: boolean;
}

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
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [databaseMappings, setDatabaseMappings] = useState<DatabaseMapping[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryItem[]>([]);
  const [syncSettings, setSyncSettings] = useState<SyncSettings>(defaultSyncSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount and when user changes
  useEffect(() => {
    if (user) {
      initializeNotionSync();
    } else {
      setIsConnected(false);
      setDatabases([]);
      setDatabaseMappings([]);
      setSyncHistory([]);
      setLoading(false);
    }
  }, [user]);

  // Auto-sync timer
  useEffect(() => {
    if (!isConnected || !syncSettings.autoSync) return;

    const interval = setInterval(() => {
      syncAllDatabases();
    }, syncSettings.syncInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [isConnected, syncSettings.autoSync, syncSettings.syncInterval, databaseMappings]);

  const initializeNotionSync = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize Notion service
      const connected = await notionService.initialize(user);
      setIsConnected(connected);

      if (connected) {
        // Load databases
        await refreshDatabases();

        // Load database mappings
        await loadDatabaseMappings();

        // Load sync history
        await loadSyncHistory();

        // Load sync settings
        await loadSyncSettings();
      }
    } catch (err) {
      console.error('Failed to initialize Notion sync:', err);
      setError('Failed to initialize Notion sync. Please try again.');
      sentryService.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const connectToNotion = async (credentials: any): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      let success = false;

      if (credentials.method === 'oauth') {
        // Redirect to Notion OAuth
        window.location.href = notionService.getAuthUrl();
        return true;
      } else if (credentials.method === 'integration') {
        // Connect with integration token
        success = await notionService.connectWithToken(
          credentials.integrationToken,
          credentials.workspaceId
        );
      }

      if (success) {
        setIsConnected(true);
        await refreshDatabases();
        await loadDatabaseMappings();
        await loadSyncHistory();
        await loadSyncSettings();
      }

      return success;
    } catch (err) {
      console.error('Failed to connect to Notion:', err);
      setError('Failed to connect to Notion. Please check your credentials and try again.');
      sentryService.captureException(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthCallback = async (code: string, state: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const success = await notionService.handleOAuthCallback(code, state);

      if (success) {
        setIsConnected(true);
        await refreshDatabases();
        await loadDatabaseMappings();
        await loadSyncHistory();
        await loadSyncSettings();
      }

      return success;
    } catch (err) {
      console.error('Failed to handle Notion OAuth callback:', err);
      setError('Failed to connect to Notion. Please try again.');
      sentryService.captureException(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disconnectFromNotion = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const success = await notionService.disconnect();

      if (success) {
        setIsConnected(false);
        setDatabases([]);
        setDatabaseMappings([]);
        setSyncHistory([]);
      }

      return success;
    } catch (err) {
      console.error('Failed to disconnect from Notion:', err);
      setError('Failed to disconnect from Notion. Please try again.');
      sentryService.captureException(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshDatabases = async (): Promise<void> => {
    if (!isConnected) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedDatabases = await notionService.getDatabases();
      
      // Merge with existing database mappings to show connection status
      const mappings = await loadDatabaseMappings();
      const connectedDatabaseIds = mappings.map(m => m.databaseId);
      
      const enhancedDatabases = fetchedDatabases.map(db => ({
        ...db,
        isConnected: connectedDatabaseIds.includes(db.id),
        lastSync: mappings.find(m => m.databaseId === db.id)?.lastSynced,
      }));
      
      setDatabases(enhancedDatabases);
    } catch (err) {
      console.error('Failed to refresh Notion databases:', err);
      setError('Failed to load Notion databases. Please try again.');
      sentryService.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDatabaseMappings = async (): Promise<DatabaseMapping[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('notion_database_mappings')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      const mappings: DatabaseMapping[] = data.map(item => ({
        id: item.id,
        databaseId: item.database_id,
        databaseName: item.database_name,
        propertyMappings: item.property_mappings,
        contentType: item.content_type,
        lastSynced: item.last_synced ? new Date(item.last_synced) : undefined,
        autoSync: item.auto_sync,
      }));

      setDatabaseMappings(mappings);
      return mappings;
    } catch (err) {
      console.error('Failed to load database mappings:', err);
      sentryService.captureException(err);
      return [];
    }
  };

  const loadSyncHistory = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notion_sync_history')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      const history: SyncHistoryItem[] = data.map(item => ({
        id: item.id,
        databaseName: item.database_name,
        timestamp: new Date(item.timestamp),
        status: item.status,
        itemsProcessed: item.items_processed,
        errorMessage: item.error_message,
      }));

      setSyncHistory(history);
    } catch (err) {
      console.error('Failed to load sync history:', err);
      sentryService.captureException(err);
    }
  };

  const loadSyncSettings = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notion_sync_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default settings
          await updateSyncSettings(defaultSyncSettings);
          setSyncSettings(defaultSyncSettings);
        } else {
          throw error;
        }
      } else if (data) {
        setSyncSettings({
          autoSync: data.auto_sync,
          syncInterval: data.sync_interval,
          syncDirection: data.sync_direction,
          conflictResolution: data.conflict_resolution,
          enableNotifications: data.enable_notifications,
          syncOnCreate: data.sync_on_create,
          syncOnUpdate: data.sync_on_update,
          syncOnDelete: data.sync_on_delete,
        });
      }
    } catch (err) {
      console.error('Failed to load sync settings:', err);
      sentryService.captureException(err);
    }
  };

  const updateSyncSettings = async (newSettings: SyncSettings): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notion_sync_settings')
        .upsert({
          user_id: user.id,
          auto_sync: newSettings.autoSync,
          sync_interval: newSettings.syncInterval,
          sync_direction: newSettings.syncDirection,
          conflict_resolution: newSettings.conflictResolution,
          enable_notifications: newSettings.enableNotifications,
          sync_on_create: newSettings.syncOnCreate,
          sync_on_update: newSettings.syncOnUpdate,
          sync_on_delete: newSettings.syncOnDelete,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        throw error;
      }

      setSyncSettings(newSettings);
    } catch (err) {
      console.error('Failed to update sync settings:', err);
      setError('Failed to update sync settings. Please try again.');
      sentryService.captureException(err);
    }
  };

  const createDatabaseMapping = async (
    databaseId: string,
    databaseName: string,
    propertyMappings: Record<string, string>,
    contentType: 'post' | 'article' | 'video' | 'image',
    autoSync: boolean = true
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('notion_database_mappings')
        .insert({
          user_id: user.id,
          database_id: databaseId,
          database_name: databaseName,
          property_mappings: propertyMappings,
          content_type: contentType,
          auto_sync: autoSync,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      // Refresh mappings
      await loadDatabaseMappings();

      // Track mapping creation
      analyticsService.event('Notion', 'Database Mapped', contentType);

      return data.id;
    } catch (err) {
      console.error('Failed to create database mapping:', err);
      setError('Failed to create database mapping. Please try again.');
      sentryService.captureException(err);
      throw err;
    }
  };

  const updateDatabaseMapping = async (
    mappingId: string,
    updates: Partial<Omit<DatabaseMapping, 'id'>>
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('notion_database_mappings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', mappingId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Refresh mappings
      await loadDatabaseMappings();

      // Track mapping update
      analyticsService.event('Notion', 'Database Mapping Updated');
    } catch (err) {
      console.error('Failed to update database mapping:', err);
      setError('Failed to update database mapping. Please try again.');
      sentryService.captureException(err);
      throw err;
    }
  };

  const deleteDatabaseMapping = async (mappingId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('notion_database_mappings')
        .delete()
        .eq('id', mappingId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Refresh mappings
      await loadDatabaseMappings();

      // Track mapping deletion
      analyticsService.event('Notion', 'Database Mapping Deleted');r
    } catch (err) {
      console.error('Failed to delete database mapping:', err);
      setError('Failed to delete database mapping. Please try again.');
      sentryService.captureException(err);
      throw err;
    }
  };

  const syncDatabase = async (mappingId: string): Promise<SyncHistoryItem> => {
    if (!user) throw new Error('User not authenticated');
    if (!isConnected) throw new Error('Notion not connected');

    const mapping = databaseMappings.find(m => m.id === mappingId);
    if (!mapping) throw new Error('Database mapping not found');

    // Create a pending sync history item
    const syncId = `sync-${Date.now()}`;
    const pendingSync: SyncHistoryItem = {
      id: syncId,
      databaseName: mapping.databaseName,
      timestamp: new Date(),
      status: 'pending',
      itemsProcessed: 0,
    };

    // Add to history
    setSyncHistory(prev => [pendingSync, ...prev]);

    try {
      // Record sync start in database
      const { error: insertError } = await supabase
        .from('notion_sync_history')
        .insert({
          id: syncId,
          user_id: user.id,
          database_id: mapping.databaseId,
          database_name: mapping.databaseName,
          timestamp: pendingSync.timestamp.toISOString(),
          status: 'pending',
          items_processed: 0,
        });

      if (insertError) {
        throw insertError;
      }

      // Get items from Notion database
      const { results: notionPages } = await notionService.getDatabaseItems(mapping.databaseId);

      // Process each page
      const processedItems: ContentItem[] = [];
      
      for (const page of notionPages) {
        try {
          // Map Notion page to content item
          const contentMap: Record<string, string> = {};
          
          // Invert property mappings for content mapping
          for (const [contentField, notionProperty] of Object.entries(mapping.propertyMappings)) {
            contentMap[contentField] = notionProperty;
          }
          
          const content = await notionService.mapNotionPageToContent(page.id, contentMap);
          
          // Add content type
          content.type = mapping.contentType;
          
          // Add to processed items
          processedItems.push(content as ContentItem);
        } catch (pageError) {
          console.error(`Error processing page ${page.id}:`, pageError);
          sentryService.captureException(pageError);
        }
      }

      // Update mapping with last synced time
      await updateDatabaseMapping(mappingId, {
        lastSynced: new Date(),
      });

      // Update sync history
      const successSync: SyncHistoryItem = {
        ...pendingSync,
        status: 'success',
        itemsProcessed: processedItems.length,
      };

      setSyncHistory(prev => 
        prev.map(sync => sync.id === syncId ? successSync : sync)
      );

      // Update sync history in database
      const { error: updateError } = await supabase
        .from('notion_sync_history')
        .update({
          status: 'success',
          items_processed: processedItems.length,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncId);

      if (updateError) {
        throw updateError;
      }

      // Track successful sync
      analyticsService.event('Notion', 'Database Synced', mapping.databaseName, processedItems.length);

      return successSync;
    } catch (err) {
      console.error(`Failed to sync database ${mapping.databaseName}:`, err);
      sentryService.captureException(err);

      // Update sync history with error
      const errorSync: SyncHistoryItem = {
        ...pendingSync,
        status: 'error',
        errorMessage: err.message,
      };

      setSyncHistory(prev => 
        prev.map(sync => sync.id === syncId ? errorSync : sync)
      );

      // Update sync history in database
      await supabase
        .from('notion_sync_history')
        .update({
          status: 'error',
          error_message: err.message,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncId);

      // Track failed sync
      analyticsService.event('Notion', 'Database Sync Failed', mapping.databaseName, 0, { error: err.message });

      return errorSync;
    }
  };

  const syncAllDatabases = async (): Promise<SyncHistoryItem[]> => {
    if (!user) throw new Error('User not authenticated');
    if (!isConnected) throw new Error('Notion not connected');

    const results: SyncHistoryItem[] = [];

    // Only sync databases with autoSync enabled
    const mappingsToSync = databaseMappings.filter(m => m.autoSync);

    for (const mapping of mappingsToSync) {
      try {
        const result = await syncDatabase(mapping.id);
        results.push(result);
      } catch (err) {
        console.error(`Failed to sync database ${mapping.databaseName}:`, err);
        sentryService.captureException(err);
      }
    }

    return results;
  };

  const pullContentFromNotion = async (
    mappingId: string,
    limit: number = 10
  ): Promise<ContentItem[]> => {
    if (!user) throw new Error('User not authenticated');
    if (!isConnected) throw new Error('Notion not connected');

    const mapping = databaseMappings.find(m => m.id === mappingId);
    if (!mapping) throw new Error('Database mapping not found');

    try {
      // Get items from Notion database
      const { results: notionPages } = await notionService.getDatabaseItems(mapping.databaseId, {
        pageSize: limit,
      });

      // Process each page
      const contentItems: ContentItem[] = [];
      
      for (const page of notionPages) {
        try {
          // Map Notion page to content item
          const contentMap: Record<string, string> = {};
          
          // Invert property mappings for content mapping
          for (const [contentField, notionProperty] of Object.entries(mapping.propertyMappings)) {
            contentMap[contentField] = notionProperty;
          }
          
          const content = await notionService.mapNotionPageToContent(page.id, contentMap);
          
          // Add content type and other required fields
          const contentItem: ContentItem = {
            id: `notion-${page.id}`,
            title: content.title || 'Untitled',
            content: content.content || '',
            type: mapping.contentType,
            status: 'draft',
            platforms: [],
            createdAt: new Date(page.lastEditedTime),
            updatedAt: new Date(),
            author: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            tags: content.tags || [],
            notionId: page.id,
            notionUrl: page.url,
          };
          
          // Add to content items
          contentItems.push(contentItem);
        } catch (pageError) {
          console.error(`Error processing page ${page.id}:`, pageError);
          sentryService.captureException(pageError);
        }
      }

      // Track content pull
      analyticsService.event('Notion', 'Content Pulled', mapping.databaseName, contentItems.length);

      return contentItems;
    } catch (err) {
      console.error(`Failed to pull content from Notion database ${mapping.databaseName}:`, err);
      setError(`Failed to pull content from ${mapping.databaseName}. Please try again.`);
      sentryService.captureException(err);
      throw err;
    }
  };

  const pushContentToNotion = async (
    content: ContentItem,
    mappingId: string
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    if (!isConnected) throw new Error('Notion not connected');

    const mapping = databaseMappings.find(m => m.id === mappingId);
    if (!mapping) throw new Error('Database mapping not found');

    try {
      // Create page in Notion
      const pageId = await notionService.mapContentToNotionPage(
        content,
        mapping.databaseId,
        mapping.propertyMappings
      );

      // Track content push
      analyticsService.event('Notion', 'Content Pushed', mapping.databaseName);

      return pageId;
    } catch (err) {
      console.error(`Failed to push content to Notion database ${mapping.databaseName}:`, err);
      setError(`Failed to push content to ${mapping.databaseName}. Please try again.`);
      sentryService.captureException(err);
      throw err;
    }
  };

  return {
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
    refreshDatabases,
    createDatabaseMapping,
    updateDatabaseMapping,
    deleteDatabaseMapping,
    syncDatabase,
    syncAllDatabases,
    updateSyncSettings,
    pullContentFromNotion,
    pushContentToNotion,
  };
}