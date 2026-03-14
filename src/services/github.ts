import { supabase, GitHubConnection, GitHubRepository } from '../lib/supabase';

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-api`;

export async function validateGitHubToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        action: 'validate',
        token,
      }),
    });

    const data = await response.json();
    return !data.error;
  } catch {
    return false;
  }
}

export async function listUserRepositories(token: string): Promise<GitHubRepository[]> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'list-repos',
      token,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export async function getRepositoryInfo(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubRepository> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'get-repo',
      token,
      owner,
      repo,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export async function saveGitHubConnection(
  githubUsername: string,
  repositoryName: string,
  token: string
): Promise<GitHubConnection> {
  const { data, error } = await supabase
    .from('github_connections')
    .insert([
      {
        github_username: githubUsername,
        repository_name: repositoryName,
        access_token: token,
        is_active: true,
      },
    ])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserGitHubConnections(): Promise<GitHubConnection[]> {
  const { data, error } = await supabase
    .from('github_connections')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data || [];
}

export async function deleteGitHubConnection(connectionId: string): Promise<void> {
  const { error } = await supabase
    .from('github_connections')
    .delete()
    .eq('id', connectionId);

  if (error) throw error;
}

export async function updateConnectionStatus(
  connectionId: string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from('github_connections')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', connectionId);

  if (error) throw error;
}
