/*
  # Notion Integration Schema

  1. New Tables
    - `notion_connections` - Stores Notion OAuth connections
    - `notion_database_mappings` - Maps Notion databases to content types
    - `notion_sync_history` - Tracks sync history
    - `notion_sync_settings` - Stores sync settings
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

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

-- Enable Row Level Security
ALTER TABLE notion_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_database_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_sync_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_sync_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Notion Connections policies
CREATE POLICY "Users can view their own Notion connections"
  ON notion_connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Notion connections"
  ON notion_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Notion connections"
  ON notion_connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Notion connections"
  ON notion_connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notion Database Mappings policies
CREATE POLICY "Users can view their own database mappings"
  ON notion_database_mappings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own database mappings"
  ON notion_database_mappings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own database mappings"
  ON notion_database_mappings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own database mappings"
  ON notion_database_mappings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notion Sync History policies
CREATE POLICY "Users can view their own sync history"
  ON notion_sync_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync history"
  ON notion_sync_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync history"
  ON notion_sync_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notion Sync Settings policies
CREATE POLICY "Users can view their own sync settings"
  ON notion_sync_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync settings"
  ON notion_sync_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync settings"
  ON notion_sync_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS notion_database_mappings_user_id_idx ON notion_database_mappings(user_id);
CREATE INDEX IF NOT EXISTS notion_database_mappings_database_id_idx ON notion_database_mappings(database_id);
CREATE INDEX IF NOT EXISTS notion_sync_history_user_id_idx ON notion_sync_history(user_id);
CREATE INDEX IF NOT EXISTS notion_sync_history_timestamp_idx ON notion_sync_history(timestamp);