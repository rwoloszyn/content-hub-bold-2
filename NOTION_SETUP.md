# Notion Integration Setup Guide

This guide will help you set up the Notion integration for your Content Hub application.

## Prerequisites

1. A Notion account
2. A Supabase project with the required database tables
3. Your Content Hub application running locally or deployed

## Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "Create new integration"
3. Fill in the integration details:
   - **Name**: Content Hub (or your preferred name)
   - **Description**: Integration for syncing content with Content Hub
   - **Associated workspace**: Select your workspace
4. Click "Submit"

## Step 2: Configure OAuth (for public integrations)

If you want to allow users to connect their own Notion workspaces:

1. In your integration settings, go to the "OAuth Domain & URIs" section
2. Add your redirect URI:
   - For local development: `http://localhost:3000/auth/callback/notion`
   - For production: `https://yourdomain.com/auth/callback/notion`
3. Copy the **Client ID** and **Client Secret**

## Step 3: Set Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Notion Integration Configuration
VITE_NOTION_CLIENT_ID=your_notion_client_id_here
VITE_NOTION_CLIENT_SECRET=your_notion_client_secret_here
VITE_NOTION_REDIRECT_URI=http://localhost:3000/auth/callback/notion

# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 4: Database Setup

Make sure your Supabase database has the required tables. Run the following SQL in your Supabase SQL editor:

```sql
-- Notion Connections Table
CREATE TABLE IF NOT EXISTS notion_connections (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  access_token text NOT NULL,
  workspace_id text NOT NULL,
  workspace_name text NOT NULL,
  workspace_icon text,
  bot_id text NOT NULL,
  expires_at timestamptz,
  connected_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Notion Database Mappings Table
CREATE TABLE IF NOT EXISTS notion_database_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  database_id text NOT NULL,
  database_name text NOT NULL,
  property_mappings jsonb NOT NULL,
  content_type text NOT NULL,
  auto_sync boolean NOT NULL DEFAULT true,
  last_synced timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, database_id)
);

-- Notion Sync History Table
CREATE TABLE IF NOT EXISTS notion_sync_history (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  database_id text NOT NULL,
  database_name text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL,
  items_processed integer NOT NULL DEFAULT 0,
  error_message text,
  completed_at timestamptz
);

-- Notion Sync Settings Table
CREATE TABLE IF NOT EXISTS notion_sync_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  auto_sync boolean NOT NULL DEFAULT true,
  sync_interval integer NOT NULL DEFAULT 30,
  sync_direction text NOT NULL DEFAULT 'one-way',
  conflict_resolution text NOT NULL DEFAULT 'overwrite',
  enable_notifications boolean NOT NULL DEFAULT true,
  sync_on_create boolean NOT NULL DEFAULT true,
  sync_on_update boolean NOT NULL DEFAULT true,
  sync_on_delete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE notion_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_database_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_sync_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_sync_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own notion connections" ON notion_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own database mappings" ON notion_database_mappings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sync history" ON notion_sync_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sync settings" ON notion_sync_settings
  FOR ALL USING (auth.uid() = user_id);
```

## Step 5: Test the Integration

1. Start your application
2. Navigate to the Notion Integration page
3. Click the "Debug" button to check configuration
4. Open browser console to see debug information
5. Click "Connect Notion" to test the connection

## Troubleshooting

### Common Issues

1. **"NOTION_CLIENT_ID is not set"**
   - Check that your environment variables are set correctly
   - Restart your development server after adding environment variables

2. **"Failed to connect to Notion"**
   - Verify your Client ID and Client Secret are correct
   - Check that your redirect URI matches exactly (including protocol)

3. **"No databases found"**
   - Make sure your Notion integration has access to the databases you want to sync
   - Check that the databases exist in your Notion workspace

4. **"Failed to sync database"**
   - Check that the database properties are mapped correctly
   - Verify that the integration has permission to read the database

5. **"Content not pulling"**
   - Check the content mapping configuration
   - Verify that pages exist in the database
   - Look for errors in the browser console

### Debug Steps

1. Click the "Debug" button in the Notion Integration page
2. Open browser console to see detailed debug logs
3. Check the Network tab for API call errors
4. Verify Supabase tables exist and have correct schema
5. Test the connection step by step

### API Endpoints

The integration uses the following Notion API endpoints:
- `https://api.notion.com/v1/oauth/authorize` - OAuth authorization
- `https://api.notion.com/v1/oauth/token` - Token exchange
- `https://api.notion.com/v1/search` - Database search
- `https://api.notion.com/v1/databases/{id}` - Database details
- `https://api.notion.com/v1/databases/{id}/query` - Database content
- `https://api.notion.com/v1/blocks/{id}/children` - Page content

## Support

If you're still having issues:
1. Check the browser console for detailed error messages
2. Use the Debug button to check configuration
3. Verify all environment variables are set correctly
4. Make sure the Supabase tables exist and have the correct schema 