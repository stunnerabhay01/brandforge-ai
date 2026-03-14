import { Sparkles, Zap, Target, Calendar, TrendingUp, Users } from 'lucide-react';

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">BrandForge AI</span>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Get Started
        </button>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Build Your Personal Brand with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Create engaging content for LinkedIn, Twitter, and Instagram in seconds.
            Let AI craft your viral hooks, storytelling posts, and content calendar.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
          >
            Start Creating Free
            <Sparkles className="ml-2 w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            title="AI Content Generator"
            description="Generate engaging posts tailored to your niche and audience in seconds"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            title="Viral Hook Creator"
            description="Craft attention-grabbing hooks that stop the scroll and boost engagement"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            title="Storytelling Posts"
            description="Create compelling narrative posts that connect with your audience"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            title="Weekly Planner"
            description="Get a 7-day content calendar to stay consistent with your posting"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            title="Multi-Platform"
            description="Optimize content for LinkedIn, Twitter, and Instagram automatically"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            title="Content History"
            description="Save and access all your generated content in one place"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
