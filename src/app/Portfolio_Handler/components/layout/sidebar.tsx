/* eslint-disable */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
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
  Search,
  ChevronDown,
  FileText,
  LucideIcon
} from 'lucide-react';

// Define proper TypeScript interfaces
interface MenuItemLink {
  type: 'link';
  href: string;
  icon: LucideIcon;
  label: string;
}

interface MenuItemDropdown {
  type: 'dropdown';
  label: string;
  icon: LucideIcon;
  children: MenuItemLink[];
}

type MenuItem = MenuItemLink | MenuItemDropdown;

const menuItems: MenuItem[] = [
  { type: 'link', href: '/Portfolio_Handler', icon: LayoutDashboard, label: 'Dashboard' },
  { 
    type: 'dropdown',
    label: 'Colleges',
    icon: Building2,
    children: [
      { type: 'link', href: '/Portfolio_Handler/colleges', icon: Building2, label: 'All Colleges' },
      { type: 'link', href: '/Portfolio_Handler/Requested_template', icon: FileText, label: 'Requested Templates' }
    ]
  },
  { type: 'link', href: '/Portfolio_Handler/themes', icon: Palette, label: 'Templates' },
  { type: 'link', href: '/Portfolio_Handler/modules', icon: Layers, label: 'Modules' },
  { type: 'link', href: '/Portfolio_Handler/announcements', icon: Megaphone, label: 'Announcements' },
  { type: 'link', href: '/Portfolio_Handler/backup', icon: Database, label: 'Data & Backup' },
  { type: 'link', href: '/Portfolio_Handler/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  useEffect(() => {
    const admin = localStorage.getItem('superAdminTest');
    if (admin) {
      try {
        const parsed = JSON.parse(admin);
        setAdminEmail(parsed.email);
      } catch {
        console.error("Invalid admin data in localStorage");
      }
    }
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleDropdownToggle = (label: string) => {
    if (openDropdown === label) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(label);
    }
  };

  const isDropdownActive = (children: MenuItemLink[]) => {
    return children.some(child => pathname === child.href);
  };

  // Type guard to check if item is dropdown
  const isDropdown = (item: MenuItem): item is MenuItemDropdown => {
    return item.type === 'dropdown';
  };

  // Type guard to check if item is link
  const isLink = (item: MenuItem): item is MenuItemLink => {
    return item.type === 'link';
  };

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${collapsed ? 'w-20' : 'w-64'}
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700
        min-h-screen shadow-md flex flex-col justify-between
        transition-all duration-500`}
    >
      <div className="p-4 flex flex-col h-full">

        {/* ==== Header ==== */}
        <div className="flex items-center justify-between mb-6">
          {/* Desktop: Left heading */}
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight hidden lg:block">
            Admin Portal
          </h1>

          {/* Mobile: Right heading */}
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight block lg:hidden ml-auto">
            Admin Portal
          </h1>

          {/* Desktop: Collapse Arrow */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* ==== Rounded Search Bar ==== */}
        {!collapsed && (
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
            />
            <Search
              size={18}
              className="absolute right-4 top-2.5 text-gray-500 dark:text-gray-400"
            />
          </div>
        )}

        {/* ==== Navigation ==== */}
        <nav className="flex flex-col gap-1">
          {filteredMenu.map((item) => {
            // Check if item is dropdown
            if (isDropdown(item)) {
              const isActive = isDropdownActive(item.children);
              const isOpen = openDropdown === item.label;
              
              return (
                <div key={item.label} className="flex flex-col">
                  <button
                    onClick={() => !collapsed ? handleDropdownToggle(item.label) : router.push(item.children[0].href)}
                    className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                      ${
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={20}
                        className={`transition-transform duration-300 ${
                          isActive
                            ? 'scale-110 text-gray-900 dark:text-white'
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
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  
                  {/* Dropdown Content */}
                  <AnimatePresence>
                    {!collapsed && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                ${
                                  isChildActive
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-l-4 border-gray-900 dark:border-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                                }`}
                            >
                              <child.icon
                                size={16}
                                className={`${
                                  isChildActive
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            
            // Regular menu item (type === 'link')
            if (isLink(item)) {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                    ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-l-4 border-gray-900 dark:border-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                >
                  <item.icon
                    size={20}
                    className={`transition-transform duration-300 ${
                      isActive
                        ? 'scale-110 text-gray-900 dark:text-white'
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
            }
            
            return null;
          })}
        </nav>

        {/* ==== Admin Details at Bottom ==== */}
        {!collapsed && (
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-1">
              Admin Info
            </h3>
            {adminEmail ? (
              <p className="text-xs text-gray-600 dark:text-gray-400">{adminEmail}</p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-500">No admin found</p>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}