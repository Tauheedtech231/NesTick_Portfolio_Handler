'use client';
import { HomeIcon, Building2 } from 'lucide-react';
import { ThemeToggleProfessional } from '../../../components/layout/ThemeToggleProfessional';

export function Navbar() {
  const handleNavigateHome = () => (window.location.href = '/');
  const handleNavigateCollege = () => (window.location.href = '/College_Portfolio_Handler');

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-8 py-4 shadow-sm transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Brand/Logo placeholder */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
              <span className="text-white dark:text-gray-900 font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
              Portfolio Handler
            </span>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
          {/* Home Button */}
          <button
            onClick={handleNavigateHome}
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-95 text-sm sm:text-base transition-all duration-300"
          >
            <HomeIcon size={18} />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* College Portfolio Button */}
          <button
            onClick={handleNavigateCollege}
            className="flex items-center gap-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-medium px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-700 dark:hover:bg-gray-200 active:scale-95 text-sm sm:text-base transition-all duration-300"
          >
            <Building2 size={18} />
            <span className="hidden sm:inline">College Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </button>

          {/* Professional Theme Toggle */}
          <ThemeToggleProfessional />
        </div>
      </div>
    </nav>
  );
}