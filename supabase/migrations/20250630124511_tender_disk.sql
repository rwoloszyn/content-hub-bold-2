/*
  # Saved Queries Table

  1. New Tables
    - `saved_queries` - Stores saved analytics queries
  
  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users
*/

-- Saved Queries Table
CREATE TABLE IF NOT EXISTS saved_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  name text NOT NULL,
  query text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE saved_queries ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own saved queries"
  ON saved_queries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved queries"
  ON saved_queries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved queries"
  ON saved_queries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved queries"
  ON saved_queries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS saved_queries_user_id_idx ON saved_queries(user_id);