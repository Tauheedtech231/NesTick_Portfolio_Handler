/* eslint-disable @typescript-eslint/no-explicit-any */
// app/designer/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DesignerSidebar } from './components/DesignerSidebar';
import { DesignerNavbar } from './components/DesignerNavbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [designer, setDesigner] = useState<any>(null);

  // Check authentication
  useEffect(() => {
    // Don't check auth on login page
    if (pathname === '/designer/login') {
      setLoading(false);
      setIsAuthenticated(true); // Allow login page to render
      return;
    }

    const auth = sessionStorage.getItem('designer_auth');
    console.log('Auth check:', auth);
    
    if (!auth) {
      console.log('No auth found, redirecting to login');
      router.replace('/designer/login');
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const authData = JSON.parse(auth);
      if (authData.user && authData.user.id) {
        setDesigner(authData.user);
        setIsAuthenticated(true);
      } else {
        console.log('Invalid auth data, redirecting to login');
        sessionStorage.removeItem('designer_auth');
        router.replace('/designer/login');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error parsing auth:', error);
      sessionStorage.removeItem('designer_auth');
      router.replace('/designer/login');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('designer_theme');
    const isDark = savedTheme === 'dark' || (savedTheme === null && true);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('designer_theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Show loading spinner for protected routes
  if (loading && pathname !== '/designer/login') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, don't show sidebar/navbar
  if (pathname === '/designer/login') {
    return <>{children}</>;
  }

  // If not authenticated, don't render protected content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <DesignerNavbar 
        sidebarCollapsed={sidebarCollapsed} 
        onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />
      <div className="flex pt-16">
        <DesignerSidebar collapsed={sidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}