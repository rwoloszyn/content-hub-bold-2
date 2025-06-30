/*
  # Fix page views RLS policies for anonymous users

  1. Security Changes
    - Add policy to allow anonymous users to insert page views with null user_id
    - Add policy to allow anonymous users to view page views with null user_id
    - Keep existing policies for authenticated users intact

  2. Changes Made
    - CREATE POLICY for anonymous INSERT operations
    - CREATE POLICY for anonymous SELECT operations
    - These policies only apply when user_id IS NULL (anonymous tracking)
*/

-- Allow anonymous users to insert page views (with null user_id)
CREATE POLICY "Anonymous users can insert page views"
  ON page_views
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Allow anonymous users to view page views (with null user_id)
CREATE POLICY "Anonymous users can view anonymous page views"
  ON page_views
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Allow anonymous users to update page views (with null user_id) for time tracking
CREATE POLICY "Anonymous users can update anonymous page views"
  ON page_views
  FOR UPDATE
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);