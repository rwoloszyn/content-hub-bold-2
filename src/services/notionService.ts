import { Client } from '@notionhq/client';
import { supabase } from './supabaseClient';
import { sentryService } from './sentryService';
import { analyticsService } from './analyticsService';
import { User } from '../types';

// Configuration
const NOTION_CLIENT_ID = import.meta.env.VITE_NOTION_CLIENT_ID;
const NOTION_CLIENT_SECRET = import.meta.env.VITE_NOTION_CLIENT_SECRET;
const NOTION_REDIRECT_URI = import.meta.env.VITE_NOTION_REDIRECT_URI || `${window.location.origin}/auth/callback/notion`;

export interface NotionDatabase {
  id: string;
  title: string;
  description?: string;
  properties: Record<string, any>;
  lastEditedTime: string;
  url: string;
  icon?: {
    type: string;
    emoji?: string;
    file?: {
      url: string;
    };
  };
}

export interface NotionPage {
  id: string;
  title: string;
  properties: Record<string, any>;
  lastEditedTime: string;
  url: string;
  content?: any;
}

export interface NotionConnection {
  accessToken: string;
  workspaceId: string;
  workspaceName: string;
  workspaceIcon?: string;
  botId: string;
  expiresAt?: string;
  connectedAt: string;
}

class NotionService {
  private client: Client | null = null;
  private currentUser: User | null = null;
  private connection: NotionConnection | null = null;
  private initialized = false;

  async initialize(user?: User): Promise<boolean> {
    if (this.initialized) return true;
    
    try {
      if (user) {
        this.currentUser = user;
      }

      // Check if we have a stored connection
      const { data, error } = await supabase
        .from('notion_connections')
        .select('*')
        .eq('user_id', this.currentUser?.id)
        .single();

      if (error || !data) {
        console.log('No Notion connection found');
        return false;
      }

      this.connection = {
        accessToken: data.access_token,
        workspaceId: data.workspace_id,
        workspaceName: data.workspace_name,
        workspaceIcon: data.workspace_icon,
        botId: data.bot_id,
        expiresAt: data.expires_at,
        connectedAt: data.connected_at,
      };

      // Initialize Notion client
      this.client = new Client({
        auth: this.connection.accessToken,
      });

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Notion service:', error);
      sentryService.captureException(error as Error);
      return false;
    }
  }

  isConnected(): boolean {
    return this.initialized && !!this.client && !!this.connection;
  }

  getAuthUrl(): string {
    if (!NOTION_CLIENT_ID) {
      throw new Error('NOTION_CLIENT_ID is not set');
    }

    const state = this.generateState();
    localStorage.setItem('notion_oauth_state', state);

    const params = new URLSearchParams({
      client_id: NOTION_CLIENT_ID,
      response_type: 'code',
      owner: 'user',
      redirect_uri: NOTION_REDIRECT_URI,
      state,
    });

    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async handleOAuthCallback(code: string, state: string): Promise<boolean> {
    try {
      // Verify state
      const savedState = localStorage.getItem('notion_oauth_state');
      if (!savedState || savedState !== state) {
        throw new Error('Invalid state parameter');
      }

      // Clear state from storage
      localStorage.removeItem('notion_oauth_state');

      // Exchange code for access token
      const response = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`)}`,
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: NOTION_REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Failed to exchange code for token');
      }

      const data = await response.json();

      // Store connection in Supabase
      const { error } = await supabase.from('notion_connections').upsert({
        user_id: this.currentUser?.id,
        access_token: data.access_token,
        workspace_id: data.workspace_id,
        workspace_name: data.workspace_name,
        workspace_icon: data.workspace_icon,
        bot_id: data.bot_id,
        expires_at: data.expires_at,
        connected_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

      if (error) {
        throw error;
      }

      // Initialize client with new token
      this.connection = {
        accessToken: data.access_token,
        workspaceId: data.workspace_id,
        workspaceName: data.workspace_name,
        workspaceIcon: data.workspace_icon,
        botId: data.bot_id,
        expiresAt: data.expires_at,
        connectedAt: new Date().toISOString(),
      };

      this.client = new Client({
        auth: data.access_token,
      });

      this.initialized = true;

      // Track successful connection
      analyticsService.event('Integration', 'Connected', 'Notion');

      return true;
    } catch (error) {
      console.error('Failed to handle Notion OAuth callback:', error);
      sentryService.captureException(error);
      
      // Track failed connection
      analyticsService.event('Integration', 'Connection Failed', 'Notion', 0, { error: (error as Error).message });
      
      return false;
    }
  }

  async connectWithToken(token: string, workspaceId?: string): Promise<boolean> {
    try {
      // Initialize client with token
      const client = new Client({
        auth: token,
      });

      // Test the token by making a request
      const response = await client.users.me({});
      
      // Get workspace info
      let workspaceName = 'Notion Workspace';
      let workspaceIcon = null;
      
      if (workspaceId) {
        try {
          // Try to get workspace info if ID is provided
          // Note: This is a workaround as Notion API doesn't have a direct way to get workspace info
          const databases = await client.search({
            filter: {
              property: 'object',
              value: 'database',
            },
            page_size: 1,
          });
          
          if (databases.results.length > 0) {
            const db = databases.results[0];
            workspaceName = db.parent?.workspace_name || workspaceName;
            workspaceIcon = db.parent?.workspace_icon || null;
          }
        } catch (err) {
          console.warn('Could not get workspace info:', err);
        }
      }

      // Store connection in Supabase
      const { error } = await supabase.from('notion_connections').upsert({
        user_id: this.currentUser?.id,
        access_token: token,
        workspace_id: workspaceId || 'unknown',
        workspace_name: workspaceName,
        workspace_icon: workspaceIcon,
        bot_id: response.bot?.id || 'unknown',
        connected_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

      if (error) {
        throw error;
      }

      // Initialize service with new token
      this.connection = {
        accessToken: token,
        workspaceId: workspaceId || 'unknown',
        workspaceName,
        workspaceIcon,
        botId: response.bot?.id || 'unknown',
        connectedAt: new Date().toISOString(),
      };

      this.client = client;
      this.initialized = true;

      // Track successful connection
      analyticsService.event('Integration', 'Connected', 'Notion (Token)');

      return true;
    } catch (error) {
      console.error('Failed to connect with Notion token:', error);
      sentryService.captureException(error);
      
      // Track failed connection
      analyticsService.event('Integration', 'Connection Failed', 'Notion (Token)', 0, { error: (error as Error).message });
      
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      // Delete connection from Supabase
      const { error } = await supabase
        .from('notion_connections')
        .delete()
        .eq('user_id', this.currentUser.id);

      if (error) {
        throw error;
      }

      // Reset service state
      this.client = null;
      this.connection = null;
      this.initialized = false;

      // Track disconnection
      analyticsService.event('Integration', 'Disconnected', 'Notion');

      return true;
    } catch (error) {
      console.error('Failed to disconnect Notion:', error);
      sentryService.captureException(error);
      return false;
    }
  }

  async getDatabases(): Promise<NotionDatabase[]> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      const response = await this.client.search({
        filter: {
          property: 'object',
          value: 'database',
        },
      });

      return response.results.map(db => {
        const database = db as any;
        return {
          id: database.id,
          title: this.extractTitle(database.title),
          description: this.extractDescription(database),
          properties: database.properties,
          lastEditedTime: database.last_edited_time,
          url: database.url,
          icon: database.icon,
        };
      });
    } catch (error) {
      console.error('Failed to get Notion databases:', error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  async getDatabase(databaseId: string): Promise<NotionDatabase> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      const database = await this.client.databases.retrieve({
        database_id: databaseId,
      });

      return {
        id: database.id,
        title: this.extractTitle(database.title),
        properties: database.properties,
        lastEditedTime: database.last_edited_time,
        url: database.url,
        icon: database.icon as any,
      };
    } catch (error) {
      console.error(`Failed to get Notion database ${databaseId}:`, error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  async getDatabaseItems(databaseId: string, options?: {
    filter?: any;
    sorts?: any[];
    pageSize?: number;
    startCursor?: string;
  }): Promise<{
    results: NotionPage[];
    hasMore: boolean;
    nextCursor?: string;
  }> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: options?.filter,
        sorts: options?.sorts,
        page_size: options?.pageSize,
        start_cursor: options?.startCursor,
      });

      const results = response.results.map(page => {
        const notionPage = page as any;
        return {
          id: notionPage.id,
          title: this.extractPageTitle(notionPage),
          properties: notionPage.properties,
          lastEditedTime: notionPage.last_edited_time,
          url: notionPage.url,
        };
      });

      return {
        results,
        hasMore: response.has_more,
        nextCursor: response.next_cursor || undefined,
      };
    } catch (error) {
      console.error(`Failed to get items from Notion database ${databaseId}:`, error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  async getPageContent(pageId: string): Promise<any> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      const blocks = await this.client.blocks.children.list({
        block_id: pageId,
      });

      return blocks.results;
    } catch (error) {
      console.error(`Failed to get content for Notion page ${pageId}:`, error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  async createPage(databaseId: string, properties: Record<string, any>, content?: any[]): Promise<string> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      const page = await this.client.pages.create({
        parent: {
          database_id: databaseId,
        },
        properties,
        children: content,
      });

      // Track page creation
      analyticsService.event('Notion', 'Page Created', databaseId);

      return page.id;
    } catch (error) {
      console.error('Failed to create Notion page:', error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  async updatePage(pageId: string, properties: Record<string, any>): Promise<void> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      await this.client.pages.update({
        page_id: pageId,
        properties,
      });

      // Track page update
      analyticsService.event('Notion', 'Page Updated', pageId);
    } catch (error) {
      console.error(`Failed to update Notion page ${pageId}:`, error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  async deletePage(pageId: string): Promise<void> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      await this.client.pages.update({
        page_id: pageId,
        archived: true,
      });

      // Track page deletion (archival)
      analyticsService.event('Notion', 'Page Archived', pageId);
    } catch (error) {
      console.error(`Failed to delete Notion page ${pageId}:`, error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  // Helper methods to extract data from Notion API responses
  private extractTitle(title: any[]): string {
    if (!title || !Array.isArray(title)) return '';
    return title.map(t => t.plain_text).join('');
  }

  private extractDescription(database: any): string | undefined {
    if (!database.description || !Array.isArray(database.description)) return undefined;
    return database.description.map(d => d.plain_text).join('');
  }

  private extractPageTitle(page: any): string {
    // Find the title property
    const titleKey = Object.keys(page.properties).find(key => 
      page.properties[key].type === 'title'
    );

    if (!titleKey) return 'Untitled';

    const titleProperty = page.properties[titleKey];
    if (!titleProperty.title || !Array.isArray(titleProperty.title)) return 'Untitled';

    return titleProperty.title.map(t => t.plain_text).join('');
  }

  // Methods for content mapping and transformation
  async mapContentToNotionPage(content: any, databaseId: string, propertyMap: Record<string, string>): Promise<string> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      // Get database schema to understand property types
      const database = await this.getDatabase(databaseId);
      
      // Prepare properties based on mapping
      const properties: Record<string, any> = {};
      
      for (const [contentField, notionProperty] of Object.entries(propertyMap)) {
        if (!database.properties[notionProperty]) {
          console.warn(`Property ${notionProperty} not found in database schema`);
          continue;
        }

        const propertyType = database.properties[notionProperty].type;
        const contentValue = this.getNestedValue(content, contentField);
        
        if (contentValue === undefined) {
          console.warn(`Content field ${contentField} not found`);
          continue;
        }

        properties[notionProperty] = this.formatPropertyValue(propertyType, contentValue);
      }

      // Create the page
      const pageId = await this.createPage(databaseId, properties);
      
      return pageId;
    } catch (error) {
      console.error('Failed to map content to Notion page:', error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
  }

  private formatPropertyValue(propertyType: string, value: any): any {
    switch (propertyType) {
      case 'title':
        return {
          title: [
            {
              type: 'text',
              text: {
                content: String(value),
              },
            },
          ],
        };
      
      case 'rich_text':
        return {
          rich_text: [
            {
              type: 'text',
              text: {
                content: String(value),
              },
            },
          ],
        };
      
      case 'number':
        return {
          number: Number(value),
        };
      
      case 'select':
        return {
          select: {
            name: String(value),
          },
        };
      
      case 'multi_select':
        const values = Array.isArray(value) ? value : [value];
        return {
          multi_select: values.map(v => ({ name: String(v) })),
        };
      
      case 'date':
        let dateValue = value;
        if (!(value instanceof Date) && typeof value !== 'string') {
          dateValue = new Date().toISOString();
        } else if (value instanceof Date) {
          dateValue = value.toISOString();
        }
        return {
          date: {
            start: dateValue,
          },
        };
      
      case 'checkbox':
        return {
          checkbox: Boolean(value),
        };
      
      case 'url':
        return {
          url: String(value),
        };
      
      case 'email':
        return {
          email: String(value),
        };
      
      case 'phone_number':
        return {
          phone_number: String(value),
        };
      
      default:
        console.warn(`Unsupported property type: ${propertyType}`);
        return null;
    }
  }

  // Methods for mapping Notion content to app content
  async mapNotionPageToContent(pageId: string, contentMap: Record<string, string>): Promise<any> {
    if (!this.client) {
      await this.initialize();
      if (!this.client) {
        throw new Error('Notion client not initialized');
      }
    }

    try {
      // Get page data
      const page = await this.client.pages.retrieve({
        page_id: pageId,
      });

      // Get page content
      const blocks = await this.getPageContent(pageId);

      // Map properties to content fields
      const content: Record<string, any> = {};
      
      for (const [contentField, notionProperty] of Object.entries(contentMap)) {
        if (!page.properties[notionProperty]) {
          console.warn(`Property ${notionProperty} not found in page`);
          continue;
        }

        content[contentField] = this.extractPropertyValue(page.properties[notionProperty]);
      }

      // Extract text content from blocks
      const textContent = this.convertBlocksToText(blocks);
      content.content = textContent;

      // Add page content if needed
      content.blocks = blocks;
      content.notionId = pageId;
      content.lastEditedTime = page.last_edited_time;

      // If no title was mapped, try to extract from properties
      if (!content.title) {
        const pageTitle = this.extractPageTitle(page);
        content.title = pageTitle;
      }

      return content;
    } catch (error) {
      console.error(`Failed to map Notion page ${pageId} to content:`, error);
      sentryService.captureException(error as Error);
      throw error;
    }
  }

  private extractPropertyValue(property: any): any {
    const type = property.type;
    
    switch (type) {
      case 'title':
        return property.title.map(t => t.plain_text).join('');
      
      case 'rich_text':
        return property.rich_text.map(t => t.plain_text).join('');
      
      case 'number':
        return property.number;
      
      case 'select':
        return property.select?.name;
      
      case 'multi_select':
        return property.multi_select.map(s => s.name);
      
      case 'date':
        return property.date?.start;
      
      case 'checkbox':
        return property.checkbox;
      
      case 'url':
        return property.url;
      
      case 'email':
        return property.email;
      
      case 'phone_number':
        return property.phone_number;
      
      case 'created_time':
        return property.created_time;
      
      case 'last_edited_time':
        return property.last_edited_time;
      
      default:
        console.warn(`Unsupported property type: ${type}`);
        return null;
    }
  }

  // Convert Notion blocks to plain text
  convertBlocksToText(blocks: any[]): string {
    if (!blocks || !Array.isArray(blocks)) return '';

    return blocks.map(block => {
      if (!block.type) return '';

      switch (block.type) {
        case 'paragraph':
          return this.extractRichText(block.paragraph.rich_text) + '\n\n';
        
        case 'heading_1':
          return this.extractRichText(block.heading_1.rich_text) + '\n\n';
        
        case 'heading_2':
          return this.extractRichText(block.heading_2.rich_text) + '\n\n';
        
        case 'heading_3':
          return this.extractRichText(block.heading_3.rich_text) + '\n\n';
        
        case 'bulleted_list_item':
          return '• ' + this.extractRichText(block.bulleted_list_item.rich_text) + '\n';
        
        case 'numbered_list_item':
          // Note: This doesn't handle proper numbering in a sequence
          return '1. ' + this.extractRichText(block.numbered_list_item.rich_text) + '\n';
        
        case 'to_do':
          const checkbox = block.to_do.checked ? '[x]' : '[ ]';
          return `${checkbox} ${this.extractRichText(block.to_do.rich_text)}\n`;
        
        case 'toggle':
          return this.extractRichText(block.toggle.rich_text) + '\n\n';
        
        case 'code':
          return '```\n' + this.extractRichText(block.code.rich_text) + '\n```\n\n';
        
        case 'quote':
          return '> ' + this.extractRichText(block.quote.rich_text) + '\n\n';
        
        case 'divider':
          return '---\n\n';
        
        default:
          return '';
      }
    }).join('');
  }

  private extractRichText(richText: any[]): string {
    if (!richText || !Array.isArray(richText)) return '';
    return richText.map(t => t.plain_text).join('');
  }

  getConnectionInfo(): NotionConnection | null {
    return this.connection;
  }
}

export const notionService = new NotionService();