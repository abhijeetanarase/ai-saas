import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex">
        {user && showSidebar && <Sidebar />}
        <main className={`flex-1 ${user && showSidebar ? 'lg:pl-64' : ''} pt-8`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}