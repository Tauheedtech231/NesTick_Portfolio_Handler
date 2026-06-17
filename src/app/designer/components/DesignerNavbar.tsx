// app/designer/components/DesignerNavbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  Sun, 
  Moon, 
  User, 
  LogOut,
  Palette
} from 'lucide-react';
import Link from 'next/link';

interface DesignerNavbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function DesignerNavbar({ 
  sidebarCollapsed, 
  onMenuClick, 
  isDarkMode, 
  onThemeToggle 
}: DesignerNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [designerName, setDesignerName] = useState('Designer');
  const [designerEmail, setDesignerEmail] = useState('');

  // Get designer info from sessionStorage
  useEffect(() => {
    const auth = sessionStorage.getItem('designer_auth');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        setDesignerName(parsed.user?.name || 'Designer');
        setDesignerEmail(parsed.user?.email || '');
      } catch (e) {
        console.error('Error parsing designer info');
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('designer_auth');
    router.push('/designer/login');
  };

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/designer') return 'Dashboard';
    if (pathname === '/designer/my-designs') return 'My Designs';
    if (pathname === '/designer/upload-design') return 'Upload New Design';
    if (pathname === '/designer/earnings') return 'Earnings';
    if (pathname === '/designer/profile') return 'Profile';
    return '';
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Menu Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <Link href="/designer" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Palette size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:inline">
              Designer Studio
            </span>
          </Link>
        </div>

        {/* Center - Page Title */}
        <div className="hidden md:block">
          <h1 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-600" />}
          </button>

          {/* Profile - Simplified without dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {designerName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{designerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{designerEmail}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg cursor-pointer"
            >
              <LogOut size={16} /> 
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}