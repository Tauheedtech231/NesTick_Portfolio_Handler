'use client';
import { Moon, Sun, Home as HomeIcon, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const settings = localStorage.getItem('settings');
    if (settings) {
      const { darkMode } = JSON.parse(settings);
      setDarkMode(darkMode);
      if (darkMode) document.documentElement.classList.add('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      if (prefersDark) document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    const settings = localStorage.getItem('settings');
    const currentSettings = settings ? JSON.parse(settings) : {};
    const updatedSettings = { ...currentSettings, darkMode: newDarkMode };
    localStorage.setItem('settings', JSON.stringify(updatedSettings));

    if (newDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleNavigateHome = () => (window.location.href = '/');
  const handleNavigateCollege = () => (window.location.href = '/College_Portfolio_Handler');

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-8 py-3 shadow-sm transition-colors duration-500">
      <div className="flex justify-between items-center">
        {/* Left side (empty or can hold logo later) */}
        <div className="flex-1">
          {/* Optional logo placeholder */}
        </div>

        {/* Right side (buttons + dark mode) */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
          {/* Home Button */}
          <button
            onClick={handleNavigateHome}
            className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-teal-500 text-white font-medium px-3 sm:px-4 py-2 rounded-xl shadow-md hover:opacity-90 active:scale-95 text-sm sm:text-base transition-all duration-300"
          >
            <HomeIcon size={18} />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* College Portfolio Button */}
          <button
            onClick={handleNavigateCollege}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium px-3 sm:px-4 py-2 rounded-xl shadow-md hover:opacity-90 active:scale-95 text-sm sm:text-base transition-all duration-300"
          >
            <Building2 size={18} />
            <span className="hidden sm:inline">College Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
