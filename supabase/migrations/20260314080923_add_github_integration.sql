/*
  # Add GitHub Repository Integration

  1. New Tables
    - `github_connections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `github_username` (text) - GitHub username
      - `repository_name` (text) - Repository name
      - `access_token` (text) - GitHub PAT (encrypted in practice)
      - `is_active` (boolean) - Connection status
      - `last_synced_at` (timestamptz) - Last sync timestamp
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on github_connections table
    - Users can only view/manage their own connections
    - Add index on user_id for efficient queries

  3. Important Notes
    - Tokens should be encrypted in production
    - Users need GitHub Personal Access Token with repo scope
*/

CREATE TABLE IF NOT EXISTS github_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  github_username text NOT NULL,
  repository_name text NOT NULL,
  access_token text NOT NULL,
  is_active boolean DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, repository_name)
);

ALTER TABLE github_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own github connections"
  ON github_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own github connections"
  ON github_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own github connections"
  ON github_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own github connections"
  ON github_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_github_connections_user_id ON github_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_github_connections_active ON github_connections(is_active) WHERE is_active = true;
