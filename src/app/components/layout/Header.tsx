'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  collegeName?: string;
  logo?: string;
}

interface AuthCollege {
  email: string;
  name: string;
  collegeId: string;
  token: string;
  timestamp: number;
}

export function Header({ collegeName, logo }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = () => {
      const authCollege = localStorage.getItem('auth_college');
      
      if (authCollege) {
        try {
          const authData: AuthCollege = JSON.parse(authCollege);
          // Optional: Check if token is still valid
          const isExpired = Date.now() - authData.timestamp > 24 * 60 * 60 * 1000; // 24 hours
          
          if (isExpired) {
            localStorage.removeItem('auth_college');
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
            setUserName(authData.name || authData.email);
          }
        } catch {
          localStorage.removeItem('auth_college');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for storage changes (in case of logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_college') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_college');
    setIsAuthenticated(false);
    setUserName('');
    setIsDropdownOpen(false);
    
    // Redirect to login page
    window.location.href = '/College_Portfolio_Handler/login';
  };

  const handleLogin = () => {
    window.open('/College_Portfolio_Handler/login', '_blank');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        
        {/* ==== Left Side: College Brand ==== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white">
            {collegeName || 'College Name'}
          </h1>
        </motion.div>

        {/* ==== Right Side: Theme + Logo + Auth ==== */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          {/* ✅ College Logo */}
          {logo && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 shadow-md">
              <Image
                src={logo}
                alt={`${collegeName || 'College'} logo`}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Authentication Section */}
          {isAuthenticated ? (
            /* ==== Logged In: User Profile & Logout ==== */
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                         bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                         hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{userName}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {JSON.parse(localStorage.getItem('auth_college') || '{}').email}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 
                             hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            /* ==== Not Logged In: Login Button ==== */
            <button
              onClick={handleLogin}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                       bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}