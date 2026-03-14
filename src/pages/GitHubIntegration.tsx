import { GitHubConnect } from '../components/GitHubConnect';

export function GitHubIntegration() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          GitHub Integration
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your GitHub repositories to seamlessly sync content and collaborate with your team.
        </p>
      </div>

      <GitHubConnect />
    </div>
  );
}
