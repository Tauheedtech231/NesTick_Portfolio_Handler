'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!isMounted) {
    return <div className="w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />;
  }

  return (
    <label className="relative inline-block w-14 h-8 cursor-pointer select-none" aria-label="Theme toggle">
      {/* Hidden Checkbox */}
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="sr-only"
      />

      {/* Track - Black & White Only */}
      <div
        className={`absolute inset-0 rounded-full border-2 transition-colors duration-200
          ${isDark ? 'bg-black border-gray-700' : 'bg-white border-gray-300'}
        `}
      />

      {/* Sliding Knob - Black & White Only */}
      <motion.div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg
          ${isDark ? 'bg-white' : 'bg-black'}
        `}
        animate={{ x: isDark ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Checkmark Icon - Dark Mode */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`absolute w-4 h-4 transition-opacity duration-200 ${
            isDark ? 'opacity-100' : 'opacity-0'
          } text-black`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>

        {/* Cross Icon - Light Mode */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`absolute w-4 h-4 transition-opacity duration-200 ${
            isDark ? 'opacity-0' : 'opacity-100'
          } text-white`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </motion.div>
    </label>
  );
}