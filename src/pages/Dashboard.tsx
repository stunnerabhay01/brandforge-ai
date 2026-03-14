import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Calendar, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    thisWeek: 0,
    hooks: 0,
    stories: 0,
  });

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    const { data } = await supabase
      .from('generated_content')
      .select('content_type, created_at')
      .eq('user_id', user?.id);

    if (data) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      setStats({
        totalPosts: data.filter((d) => d.content_type === 'post').length,
        thisWeek: data.filter((d) => new Date(d.created_at) > weekAgo).length,
        hooks: data.filter((d) => d.content_type === 'hook').length,
        stories: data.filter((d) => d.content_type === 'story').length,
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's your content overview.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          label="Total Posts"
          value={stats.totalPosts}
          bgColor="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />}
          label="This Week"
          value={stats.thisWeek}
          bgColor="bg-green-50 dark:bg-green-900/30"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
          label="Viral Hooks"
          value={stats.hooks}
          bgColor="bg-orange-50 dark:bg-orange-900/30"
        />
        <StatCard
          icon={<Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          label="Stories"
          value={stats.stories}
          bgColor="bg-purple-50 dark:bg-purple-900/30"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ActionCard
          title="Generate New Content"
          description="Create engaging posts, viral hooks, and storytelling content with AI"
          buttonText="Start Creating"
          onClick={() => onNavigate('generator')}
          gradient="from-blue-500 to-blue-600"
        />
        <ActionCard
          title="View Content History"
          description="Access all your previously generated content and reuse them"
          buttonText="View History"
          onClick={() => onNavigate('history')}
          gradient="from-purple-500 to-purple-600"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: number; bgColor: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function ActionCard({ title, description, buttonText, onClick, gradient }: {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="mb-6 opacity-90">{description}</p>
      <button
        onClick={onClick}
        className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}
