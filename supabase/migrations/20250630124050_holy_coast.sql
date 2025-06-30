/*
  # Analytics Schema Setup

  1. New Tables
    - `page_views` - Tracks user page views
    - `events` - Tracks user events/actions
    - `purchases` - Tracks subscription purchases
    - `user_properties` - Stores user-specific properties
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  page_url text NOT NULL,
  page_title text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  referrer text,
  time_on_page integer,
  device_type text NOT NULL,
  browser text NOT NULL,
  os text NOT NULL,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event_name text NOT NULL,
  category text NOT NULL,
  action text NOT NULL,
  label text,
  value numeric,
  properties jsonb,
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  page_url text NOT NULL,
  referrer text,
  device_type text NOT NULL,
  browser text NOT NULL,
  os text NOT NULL,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id text NOT NULL,
  currency text NOT NULL,
  price numeric NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  device_type text NOT NULL,
  browser text NOT NULL,
  os text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User Properties Table
CREATE TABLE IF NOT EXISTS user_properties (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_properties ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Page Views policies
CREATE POLICY "Authenticated users can insert their own page views"
  ON page_views
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can view their own page views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Events policies
CREATE POLICY "Authenticated users can insert their own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can view their own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Purchases policies
CREATE POLICY "Authenticated users can insert their own purchases"
  ON purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can view their own purchases"
  ON purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- User Properties policies
CREATE POLICY "Authenticated users can upsert their own properties"
  ON user_properties
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS page_views_user_id_idx ON page_views(user_id);
CREATE INDEX IF NOT EXISTS page_views_timestamp_idx ON page_views(timestamp);
CREATE INDEX IF NOT EXISTS page_views_session_id_idx ON page_views(session_id);

CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_timestamp_idx ON events(timestamp);
CREATE INDEX IF NOT EXISTS events_event_name_idx ON events(event_name);
CREATE INDEX IF NOT EXISTS events_category_action_idx ON events(category, action);
CREATE INDEX IF NOT EXISTS events_session_id_idx ON events(session_id);

CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_timestamp_idx ON purchases(timestamp);
CREATE INDEX IF NOT EXISTS purchases_product_id_idx ON purchases(product_id);