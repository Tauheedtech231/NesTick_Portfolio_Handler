// app/developer/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Upload, 
  CheckCircle, 
  DollarSign, 
  Wallet, 
  Bell, 
  User,
  LogOut,
  Menu,
  X,
  Code2,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';

interface Developer {
  id: number;
  name: string;
  email: string;
  specialization: string;
}

const navItems = [
  { name: 'Dashboard', href: '/developer', icon: LayoutDashboard },
  { name: 'My Assigned Designs', href: '/developer/assigned-designs', icon: FolderOpen },
  { name: 'Submit Design', href: '/developer/submit-design', icon: Upload },
  { name: 'Completed Designs', href: '/developer/completed-designs', icon: CheckCircle },
  { name: 'Earnings', href: '/developer/earnings', icon: DollarSign },
  { name: 'Withdrawals', href: '/developer/withdrawals', icon: Wallet },
  { name: 'Notifications', href: '/developer/notifications', icon: Bell },
  { name: 'Profile', href: '/developer/profile', icon: User },
];

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const checkAuth = () => {
      const auth = sessionStorage.getItem('developer_auth');
      if (!auth) {
        router.push('/designer/login?type=developer');
        return;
      }
      
      try {
        const parsed = JSON.parse(auth);
        if (parsed.user && parsed.user.id) {
          setDeveloper(parsed.user);
        } else {
          router.push('/designer/login?type=developer');
        }
      } catch {
        router.push('/designer/login?type=developer');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Theme detection
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setTheme(isDarkNow ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true });

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleDesktopMode = (event: MediaQueryListEvent | MediaQueryList) => {
      const isMatching = event.matches;
      setIsDesktop(isMatching);
      if (isMatching) {
        setSidebarOpen(true);
      }
    };

    handleDesktopMode(mediaQuery);
    mediaQuery.addEventListener('change', handleDesktopMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleDesktopMode);
    };
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('developer_auth');
    router.push('/designer/login?type=developer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!developer) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-purple-600 text-white shadow-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isDesktop || sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Developer Hub</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{developer.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/developer' && pathname?.startsWith(item.href));
              
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-purple-500' : 'group-hover:text-purple-500 transition-colors'} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="text-purple-500" />}
                </button>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:ml-72 min-h-screen"
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </motion.main>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}