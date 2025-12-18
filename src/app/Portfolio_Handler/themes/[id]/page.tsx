'use client';


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Theme } from '@/app/types';
import { getThemeFromLocalStorage } from '../../utils/themeStorage';
import Image from 'next/image';

export default function ThemePreviewPage() {
  const params = useParams();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    if (params.id) {
      const foundTheme = getThemeFromLocalStorage(params.id as string);
      if (foundTheme) setTheme(foundTheme);
    }
  }, [params.id]);

  if (!theme) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Theme Not Found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-black dark:text-white mb-8">
          {theme.name}
        </h1>

        {/* Theme Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full h-64 sm:h-96">
            <Image
              src={theme.image}
              alt={theme.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 space-y-5">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
              {theme.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-6">
              <div>
                <span className="font-semibold text-black dark:text-white">ZIP File:</span>
                <p className="text-gray-600 dark:text-gray-400 break-all">
                  {theme.zipFile}
                </p>
              </div>

              {theme.liveUrl && (
                <div>
                  <span className="font-semibold text-black dark:text-white">Live URL:</span>
                  <p className="text-gray-600 dark:text-gray-400 break-all">
                    {theme.liveUrl}
                  </p>
                </div>
              )}

              <div>
                <span className="font-semibold text-black dark:text-white">Uploaded:</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(theme.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Live Preview Button */}
            {theme.liveUrl && (
              <div className="pt-6 text-center">
                <a
                  href={theme.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-8 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                >
                  🔗 Live Preview
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
