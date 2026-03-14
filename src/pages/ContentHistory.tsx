import { useState, useEffect } from 'react';
import { Copy, Check, Trash2, Filter } from 'lucide-react';
import { supabase, GeneratedContent } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type FilterType = 'all' | 'post' | 'hook' | 'story' | 'calendar';

export function ContentHistory() {
  const { user } = useAuth();
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadContent();
    }
  }, [user, filter]);

  const loadContent = async () => {
    setLoading(true);
    let query = supabase
      .from('generated_content')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('content_type', filter);
    }

    const { data } = await query;
    setContent(data || []);
    setLoading(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      await supabase.from('generated_content').delete().eq('id', id);
      loadContent();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post': return 'Post';
      case 'hook': return 'Hook';
      case 'story': return 'Story';
      case 'calendar': return 'Calendar';
      default: return type;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'twitter': return 'bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300';
      case 'instagram': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Content History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          All your generated content in one place
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by type:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'post', 'hook', 'story', 'calendar'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : content.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No content found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {content.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 group hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                    {getTypeLabel(item.content_type)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(item.platform)}`}>
                    {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(item.content, item.id)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              {item.topic && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-medium">Topic:</span> {item.topic}
                </p>
              )}

              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{item.content}</p>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                {new Date(item.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
