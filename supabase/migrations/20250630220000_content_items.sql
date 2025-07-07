/*
  # Content Items Schema

  1. New Tables
    - `content_items` - Stores all content items (posts, articles, videos, etc.)
    - `content_schedules` - Stores scheduling information for content
    - `ai_generations` - Stores AI generation history and metadata
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Content Items Table
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('post', 'article', 'video', 'image')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  platforms jsonb DEFAULT '[]'::jsonb,
  scheduled_date timestamptz,
  published_date timestamptz,
  tags text[] DEFAULT '{}',
  ai_generated boolean DEFAULT false,
  media_url text,
  preview jsonb,
  notion_id text,
  notion_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Content Schedules Table
CREATE TABLE IF NOT EXISTS content_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  scheduled_date timestamptz NOT NULL,
  scheduled_time text NOT NULL,
  platforms text[] NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- AI Generations Table
CREATE TABLE IF NOT EXISTS ai_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  content_id uuid REFERENCES content_items(id) ON DELETE SET NULL,
  prompt text NOT NULL,
  generated_content text NOT NULL,
  template_id text,
  template_name text,
  variables jsonb,
  model text NOT NULL,
  provider text NOT NULL,
  usage_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Content Items policies
CREATE POLICY "Users can view their own content items"
  ON content_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content items"
  ON content_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content items"
  ON content_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content items"
  ON content_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Content Schedules policies
CREATE POLICY "Users can view their own content schedules"
  ON content_schedules
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content schedules"
  ON content_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content schedules"
  ON content_schedules
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content schedules"
  ON content_schedules
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- AI Generations policies
CREATE POLICY "Users can view their own AI generations"
  ON ai_generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI generations"
  ON ai_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI generations"
  ON ai_generations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI generations"
  ON ai_generations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS content_items_user_id_idx ON content_items(user_id);
CREATE INDEX IF NOT EXISTS content_items_created_at_idx ON content_items(created_at);
CREATE INDEX IF NOT EXISTS content_items_updated_at_idx ON content_items(updated_at);
CREATE INDEX IF NOT EXISTS content_items_status_idx ON content_items(status);
CREATE INDEX IF NOT EXISTS content_items_type_idx ON content_items(type);
CREATE INDEX IF NOT EXISTS content_items_ai_generated_idx ON content_items(ai_generated);

CREATE INDEX IF NOT EXISTS content_schedules_user_id_idx ON content_schedules(user_id);
CREATE INDEX IF NOT EXISTS content_schedules_content_id_idx ON content_schedules(content_id);
CREATE INDEX IF NOT EXISTS content_schedules_scheduled_date_idx ON content_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS content_schedules_status_idx ON content_schedules(status);

CREATE INDEX IF NOT EXISTS ai_generations_user_id_idx ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS ai_generations_content_id_idx ON ai_generations(content_id);
CREATE INDEX IF NOT EXISTS ai_generations_created_at_idx ON ai_generations(created_at);
CREATE INDEX IF NOT EXISTS ai_generations_model_idx ON ai_generations(model);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_schedules_updated_at
  BEFORE UPDATE ON content_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 