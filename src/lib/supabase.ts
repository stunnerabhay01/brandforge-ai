import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  profession: string;
  target_audience: string;
  niche: string;
  goals: string;
  created_at: string;
  updated_at: string;
};

export type GeneratedContent = {
  id: string;
  user_id: string;
  content_type: 'post' | 'hook' | 'story' | 'calendar';
  platform: 'linkedin' | 'twitter' | 'instagram' | 'all';
  topic: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type GitHubConnection = {
  id: string;
  user_id: string;
  github_username: string;
  repository_name: string;
  access_token: string;
  is_active: boolean;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GitHubRepository = {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  language: string | null;
  updated_at: string;
};
