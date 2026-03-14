/*
  # BrandForge AI Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `profession` (text) - User's profession
      - `target_audience` (text) - Target audience description
      - `niche` (text) - Content niche
      - `goals` (text) - User's branding goals
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `generated_content`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content_type` (text) - Type: 'post', 'hook', 'story', 'calendar'
      - `platform` (text) - Platform: 'linkedin', 'twitter', 'instagram', 'all'
      - `topic` (text) - Content topic
      - `content` (text) - Generated content
      - `metadata` (jsonb) - Additional data like profession, audience used
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only read/write their own data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  profession text DEFAULT '',
  target_audience text DEFAULT '',
  niche text DEFAULT '',
  goals text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL,
  platform text NOT NULL,
  topic text DEFAULT '',
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content"
  ON generated_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content"
  ON generated_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content"
  ON generated_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at DESC);