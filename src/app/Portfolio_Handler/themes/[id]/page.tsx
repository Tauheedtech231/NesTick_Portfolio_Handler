// app/themes/[id]/page.tsx
'use client';
/* eslint-disable */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Theme } from '@/app/types';
import { getThemeFromLocalStorage } from '../../utils/themeStorage';
import Link from 'next/link';
import Image from 'next/image';

export default function ThemePreviewPage() {
  const params = useParams();
  const router = useRouter();
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
    <div className="min-h-screen bg-white dark:bg-gray-900 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/Portfolio_Handler/themes"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-all"
          >
            ← Back to Themes
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white text-center sm:text-right">
            Theme Preview
          </h1>
        </div>

        {/* Theme Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
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
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              {theme.name}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {theme.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <span className="font-semibold text-black dark:text-white">ZIP File:</span>
                <p className="text-gray-600 dark:text-gray-400 break-all">{theme.zipFile}</p>
              </div>

              {theme.liveUrl && (
                <div>
                  <span className="font-semibold text-black dark:text-white">Live URL:</span>
                  <p className="text-gray-600 dark:text-gray-400 truncate">{theme.liveUrl}</p>
                </div>
              )}

              <div>
                <span className="font-semibold text-black dark:text-white">Uploaded:</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(theme.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '#'; // Replace with real download URL later
                  link.download = theme.zipFile;
                  link.click();
                }}
                className="flex-1 sm:flex-none bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-black py-2.5 px-6 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
              >
                ⬇️ Download ZIP
              </button>

              {theme.liveUrl && (
                <a
                  href={theme.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none border border-gray-900 dark:border-white text-gray-900 dark:text-white py-2.5 px-6 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  🔗 Live Preview
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
