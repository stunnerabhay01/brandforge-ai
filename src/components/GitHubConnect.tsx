import { useState } from 'react';
import { Github, Loader2, Check, AlertCircle, Trash2 } from 'lucide-react';
import {
  validateGitHubToken,
  listUserRepositories,
  saveGitHubConnection,
  getUserGitHubConnections,
  deleteGitHubConnection,
} from '../services/github';
import { GitHubConnection, GitHubRepository } from '../lib/supabase';

export function GitHubConnect() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [connections, setConnections] = useState<GitHubConnection[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleValidateToken = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const isValid = await validateGitHubToken(token);
      if (!isValid) {
        setError('Invalid GitHub token. Please check and try again.');
        return;
      }

      const userRepos = await listUserRepositories(token);
      setRepos(userRepos);
      setSuccess('Token validated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate token');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectRepository = async () => {
    if (!selectedRepo) {
      setError('Please select a repository');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await saveGitHubConnection('unknown', selectedRepo, token);
      setSuccess('Repository connected successfully!');
      setToken('');
      setSelectedRepo('');
      setRepos([]);
      setShowForm(false);
      await loadConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect repository');
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const conns = await getUserGitHubConnections();
      setConnections(conns);
    } catch (err) {
      console.error('Failed to load connections:', err);
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    try {
      await deleteGitHubConnection(connectionId);
      setSuccess('Connection removed successfully');
      await loadConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete connection');
    }
  };

  const handleLoadConnections = async () => {
    setLoading(true);
    try {
      await loadConnections();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Github className="w-6 h-6 text-gray-900 dark:text-white" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            GitHub Repository Connection
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 dark:text-green-200 text-sm">{success}</p>
          </div>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Github className="w-4 h-4" />
            Connect Repository
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Create a token at{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  github.com/settings/tokens
                </a>{' '}
                with repo scope
              </p>
            </div>

            <button
              onClick={handleValidateToken}
              disabled={!token || loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating...
                </>
              ) : (
                'Validate Token'
              )}
            </button>

            {repos.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Repository
                </label>
                <select
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a repository...</option>
                  {repos.map((repo) => (
                    <option key={repo.name} value={repo.name}>
                      {repo.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRepo && (
              <button
                onClick={handleConnectRepository}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Repository'
                )}
              </button>
            )}

            <button
              onClick={() => {
                setShowForm(false);
                setToken('');
                setSelectedRepo('');
                setRepos([]);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connected Repositories
          </h3>
          <button
            onClick={handleLoadConnections}
            disabled={loading}
            className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {connections.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No repositories connected yet.
          </p>
        ) : (
          <div className="space-y-3">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {conn.repository_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {conn.github_username}
                  </p>
                  {conn.last_synced_at && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Last synced: {new Date(conn.last_synced_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteConnection(conn.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Delete connection"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
