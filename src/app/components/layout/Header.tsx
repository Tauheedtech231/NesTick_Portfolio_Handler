'use client';
import React from 'react';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';

interface HeaderProps {
  collegeName?: string;
  logo?: string; // ✅ logo prop
}

export function Header({ collegeName, logo }: HeaderProps) {
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

        {/* ==== Right Side: Theme + Logo ==== */}
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
        </div>
      </div>
    </header>
  );
}
