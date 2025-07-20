import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FileSearch, 
  Image, 
  Users, 
  Settings,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Blog Generator', href: '/blog-generator', icon: FileText },
  { name: 'Resume Analyzer', href: '/resume-analyzer', icon: FileSearch },
  { name: 'Image Generator', href: '/image-generator', icon: Image },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Admin Panel', href: '/admin', icon: Users, adminOnly: true },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const filteredItems = sidebarItems.filter(item => 
    !item.adminOnly || (user?.email === 'admin@aitools.com')
  );

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
      <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 pt-5 pb-4 overflow-y-auto">
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Usage</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.plan}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((user?.usageTokens || 0) / (user?.maxTokens || 1)) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {user?.usageTokens || 0} / {user?.maxTokens || 0} tokens
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}