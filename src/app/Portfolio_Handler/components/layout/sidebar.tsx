'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Palette,
  Layers,
  Database,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { href: '/Portfolio_Handler', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/Portfolio_Handler/colleges', icon: Building2, label: 'Colleges' },
  { href: '/Portfolio_Handler/themes', icon: Palette, label: 'Themes' },
  { href: '/Portfolio_Handler/modules', icon: Layers, label: 'Modules' },
  { href: '/Portfolio_Handler/announcements', icon: Megaphone, label: 'Announcements' },
  { href: '/Portfolio_Handler/backup', icon: Database, label: 'Data & Backup' },
  { href: '/Portfolio_Handler/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 min-h-screen shadow-md flex flex-col justify-between transition-all duration-500`}
    >
      {/* ==== Top Section ==== */}
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed ? (
            <div>
              <h1 className="text-xl font-extrabold text-black dark:text-white tracking-tight">
                Portfolio Handler
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Admin Portal
              </p>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <span className="text-2xl text-black dark:text-white font-bold">P</span>
            </div>
          )}

          {/* Collapse button */}
          <button
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-l-4 border-gray-800 dark:border-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon
                  size={20}
                  className={`transition-transform duration-300 ${
                    isActive
                      ? 'scale-110 text-black dark:text-white'
                      : 'group-hover:scale-110 text-gray-600 dark:text-gray-300'
                  }`}
                />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}
