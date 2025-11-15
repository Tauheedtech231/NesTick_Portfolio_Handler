'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggleProfessional() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!isMounted) return <div className="w-20 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />;

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-20 h-10 rounded-full cursor-pointer flex items-center transition-all duration-500
                  ${isDark ? 'bg-black' : 'bg-white'} border border-gray-400 dark:border-gray-600 shadow-sm`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sliding Knob */}
      <motion.div
        className={`absolute top-0.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md 
                    ${isDark ? 'bg-white' : 'bg-black'}`}
        animate={{ x: isDark ? 44 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {isDark ? <Moon className="w-5 h-5 text-black" /> : <Sun className="w-5 h-5 text-white" />}
      </motion.div>

      {/* Minimal static Sun/Moon background icons */}
      <div className="absolute w-full h-full flex items-center justify-between px-2">
        <Sun className={`w-4 h-4 ${isDark ? 'opacity-30 text-white' : 'text-black'}`} />
        <Moon className={`w-4 h-4 ${isDark ? 'text-white' : 'opacity-30 text-black'}`} />
      </div>
    </button>
  );
}
