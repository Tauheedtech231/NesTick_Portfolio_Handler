'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LogOut, User, Menu, X } from 'lucide-react';
import { ThemeToggleProfessional } from './ThemeToggleProfessional'; // Custom professional toggle

interface HeaderProps {
  collegeName?: string;
  logo?: string;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

interface AuthCollege {
  email: string;
  name: string;
  collegeId: string;
  token: string;
  timestamp: number;
}

export function Header({ collegeName, logo, isSidebarOpen, toggleSidebar }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authCollege = localStorage.getItem('auth_college');
      if (authCollege) {
        try {
          const authData: AuthCollege = JSON.parse(authCollege);
          const isExpired = Date.now() - authData.timestamp > 24 * 60 * 60 * 1000; // 24h
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
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_college') checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_college');
    setIsAuthenticated(false);
    setUserName('');
    setIsDropdownOpen(false);
    window.location.href = '/College_Portfolio_Handler/login';
  };

  const handleLogin = () => {
    window.open('/College_Portfolio_Handler/login', '_blank');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">

        {/* Left: College Brand + Mobile Menu */}
        <div className="flex items-center gap-2">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            {logo && (
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                <Image
                  src={logo}
                  alt={`${collegeName || 'College'} logo`}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {collegeName || 'College Name'}
            </h1>
          </motion.div>
        </div>

        {/* Right: Professional Theme Toggle + Auth */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* ✅ Professional Theme Toggle */}
          <ThemeToggleProfessional />

          {/* Authentication Section */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                         bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white 
                         hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{userName}</span>
              </button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-1">
                      {JSON.parse(localStorage.getItem('auth_college') || '{}').email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 
                             hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                       bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Overlay for dropdown close */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}