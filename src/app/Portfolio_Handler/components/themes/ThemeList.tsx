/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/app/types';
import {
  getThemesFromLocalStorage,
  removeThemeFromLocalStorage,
} from '../../utils/themeStorage';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react'; // ✅ Added icon

export default function ThemeList() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThemes = () => {
    setLoading(true);
    setTimeout(() => {
      setThemes(getThemesFromLocalStorage());
      setLoading(false);
    }, 300); // small delay for smoother UX
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this theme?')) {
      removeThemeFromLocalStorage(id);
      fetchThemes();
    }
  };

  if (themes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 text-center">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Uploaded Themes
          </h2>
          <button
            onClick={fetchThemes}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Refresh Themes"
          >
            <RefreshCcw
              size={20}
              className={`${
                loading ? 'animate-spin text-blue-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No themes uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-black dark:text-white">
          Uploaded Themes
        </h2>
        <button
          onClick={fetchThemes}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Refresh Themes"
        >
          <RefreshCcw
            size={20}
            className={`${
              loading ? 'animate-spin text-blue-500' : 'text-gray-600 dark:text-gray-300'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 flex flex-col"
          >
            <img
              src={theme.image}
              alt={theme.name}
              className="w-full h-40 sm:h-48 object-cover"
            />

            <div className="p-3 flex flex-col flex-1">
              <h3 className="text-base font-semibold text-black dark:text-white mb-1 truncate">
                {theme.name}
              </h3>

              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {theme.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-auto">
                <Link
                  href={`/Portfolio_Handler/themes/${theme.id}`}
                  className="flex-1 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black py-2 px-4 rounded-xl text-xs sm:text-sm text-center font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Preview
                </Link>

                {theme.liveUrl && (
                  <a
                    href={theme.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-black dark:border-white text-black dark:text-white py-2 px-4 rounded-xl text-xs sm:text-sm text-center font-semibold shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                  >
                    Live Demo
                  </a>
                )}

                <button
                  onClick={() => handleDelete(theme.id)}
                  className="flex-1 border border-red-600 text-red-600 dark:text-red-400 dark:border-red-400 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:bg-red-50 dark:hover:bg-red-900 hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
