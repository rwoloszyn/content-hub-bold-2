/*
  # Fix Anonymous Access for Analytics Tables

  1. Changes
    - Add RLS policies for anonymous users to insert events
    - Add RLS policies for anonymous users to insert purchases
  
  2. Security
    - Anonymous users can only access records with null user_id
    - Maintains existing policies for authenticated users
*/

-- Allow anonymous users to insert events (with null user_id)
CREATE POLICY "Anonymous users can insert events"
  ON events
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Allow anonymous users to view events (with null user_id)
CREATE POLICY "Anonymous users can view anonymous events"
  ON events
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Allow anonymous users to insert purchases (with null user_id)
CREATE POLICY "Anonymous users can insert purchases"
  ON purchases
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Allow anonymous users to view purchases (with null user_id)
CREATE POLICY "Anonymous users can view anonymous purchases"
  ON purchases
  FOR SELECT
  TO anon
  USING (user_id IS NULL);