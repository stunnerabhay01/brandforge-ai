import { Home, Sparkles, History, User, LogOut, Moon, Sun, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

type Page = 'dashboard' | 'generator' | 'history' | 'profile' | 'github';

type SidebarProps = {
  currentPage: Page;
  onPageChange: (page: Page) => void;
};

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'generator' as Page, label: 'Content Generator', icon: Sparkles },
    { id: 'history' as Page, label: 'Content History', icon: History },
    { id: 'profile' as Page, label: 'Profile Setup', icon: User },
    { id: 'github' as Page, label: 'GitHub Integration', icon: Github },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">BrandForge AI</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
          <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
