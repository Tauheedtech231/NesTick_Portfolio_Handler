'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { ThemeToggleProfessional } from './ThemeToggleProfessional';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  collegeName?: string;
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

export function Header({ collegeName, isSidebarOpen, toggleSidebar }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

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
    window.location.href = '/College_Portfolio_Handler/login';
  };

  const handleLogin = () => {
    window.open('/College_Portfolio_Handler/login', '_blank');
  };

  // ✅ Logo click handler - redirect to home
  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6 
      }}
      className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 shadow-lg shadow-gray-200/20 dark:shadow-gray-800/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left: Mobile Menu Button Only */}
        <div className="flex items-center gap-2">
          {toggleSidebar && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="md:hidden p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </motion.button>
          )}

          {/* Professional Logo/Brand with Animation - Clickable */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1
            }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotate: [-2, 2, -2, 0],
                transition: { duration: 0.3 }
              }}
              className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center shadow-lg shadow-gray-900/20 dark:shadow-white/10"
            >
              <LayoutDashboard className="w-5 h-5 text-white dark:text-gray-900" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="hidden sm:block"
            >
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                Dashboard
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium -mt-0.5">
                College Management
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Theme Toggle + Auth with Animations */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeToggleProfessional />
          </motion.div>

          {isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="flex items-center gap-2"
            >
            

              {/* Sign Out Button */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md shadow-red-600/20 hover:shadow-red-600/40 flex items-center gap-2"
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.4 }}
                >
                  <LogOut className="w-4 h-4" />
                </motion.div>
                <span className="hidden sm:inline">Sign Out</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
              className="px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-gradient-to-r from-gray-900 to-gray-800 text-white dark:from-white dark:to-gray-100 dark:text-gray-900 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-white shadow-md shadow-gray-900/20 dark:shadow-white/10 flex items-center gap-2"
            >
              <motion.span
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Login
              </motion.span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Subtle Gradient Border Animation */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
        style={{ transformOrigin: "left" }}
      />
    </motion.header>
  );
}