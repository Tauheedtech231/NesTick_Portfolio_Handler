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
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  FileText,
  LucideIcon,
  User,
  Sparkles,
  LogOut
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
  { type: 'link', href: '/Portfolio_Handler/credientials_manage', icon: User, label: 'Credentials' },
  { type: 'link', href: '/Portfolio_Handler/modules', icon: Layers, label: 'Modules' },
  { type: 'link', href: '/Portfolio_Handler/announcements', icon: Megaphone, label: 'Announcements' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  useEffect(() => {
    // Get current logged-in user from localStorage
    const loginUser = localStorage.getItem('login_user');
    if (loginUser) {
      try {
        const parsed = JSON.parse(loginUser);
        setAdminEmail(parsed.email);
        // Extract name from email or use default
        const nameFromEmail = parsed.email?.split('@')[0] || 'Admin';
        setAdminName(nameFromEmail);
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDarkNow);
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
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

  const handleLogout = () => {
    localStorage.removeItem('login_user');
    localStorage.removeItem('superAdminTest');
    router.push('/');
  };

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${collapsed ? 'w-20' : 'w-64'}
        ${isDarkMode 
          ? 'bg-gradient-to-b from-[#0B0F19] to-[#0F172A] border-[#1E293B]' 
          : 'bg-gradient-to-b from-gray-50 to-white border-gray-200'
        }
        border-r min-h-screen shadow-xl flex flex-col justify-between
        transition-all duration-500 relative`}
    >
      {/* Decorative gradient line at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FFD700]/70 to-transparent`} />

      <div className="p-4 flex flex-col h-full">

        {/* ==== Header ==== */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-xl font-extrabold bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 bg-clip-text text-transparent tracking-tight">
                    Portfolio
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse Button */}
          <button
            onClick={toggleSidebar}
            className={`flex p-2 rounded-lg transition-all duration-300 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-[#FFD700] hover:bg-[#1E293B]' 
                : 'text-gray-600 hover:text-[#FFD700] hover:bg-gray-200'
            }`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* ==== Search Bar ==== */}
        {!collapsed && (
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border outline-none transition-all duration-300 text-sm ${
                isDarkMode
                  ? 'bg-[#0B0F19] border-[#1E293B] text-white placeholder:text-gray-500 focus:border-[#FFD700]'
                  : 'bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD700]'
              }`}
            />
            <Search
              size={16}
              className={`absolute right-3 top-2.5 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
          </div>
        )}

        {/* ==== Navigation ==== */}
        <nav className="flex flex-col gap-1 flex-1">
          {filteredMenu.map((item) => {
            // Check if item is dropdown
            if (isDropdown(item)) {
              const isActive = isDropdownActive(item.children);
              const isOpen = openDropdown === item.label;
              
              return (
                <div key={item.label} className="flex flex-col">
                  <button
                    onClick={() => !collapsed ? handleDropdownToggle(item.label) : router.push(item.children[0].href)}
                    className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-all duration-300
                      ${
                        isActive
                          ? `bg-gradient-to-r from-[#FFD700]/10 to-transparent border-l-2 border-[#FFD700] text-[#FFD700]`
                          : isDarkMode
                            ? 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={20}
                        className={`transition-all duration-300 ${
                          isActive
                            ? 'text-[#FFD700]'
                            : isDarkMode
                              ? 'text-gray-500 group-hover:text-[#FFD700]'
                              : 'text-gray-500 group-hover:text-[#FFD700]'
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
                        size={14}
                        className={`transform transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        } ${isActive ? 'text-[#FFD700]' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
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
                        className="ml-9 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                ${
                                  isChildActive
                                    ? 'bg-[#FFD700]/10 text-[#FFD700] border-l-2 border-[#FFD700]'
                                    : isDarkMode
                                      ? 'text-gray-500 hover:bg-[#1E293B] hover:text-gray-300'
                                      : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                }`}
                            >
                              <child.icon
                                size={14}
                                className={isChildActive ? 'text-[#FFD700]' : 'text-gray-500'}
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
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-all duration-300
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFD700]/10 to-transparent border-l-2 border-[#FFD700] text-[#FFD700]'
                        : isDarkMode
                          ? 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                >
                  <item.icon
                    size={20}
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'text-[#FFD700]'
                        : isDarkMode
                          ? 'text-gray-500 group-hover:text-[#FFD700]'
                          : 'text-gray-500 group-hover:text-[#FFD700]'
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`mt-auto pt-4 border-t ${
              isDarkMode ? 'border-[#1E293B]' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 flex items-center justify-center border border-[#FFD700]/30">
                <User className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {adminName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {adminEmail || 'admin@portfolio.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 group"
            >
              <LogOut size={16} className="group-hover:scale-110 transition-transform" />
              Logout
            </button>
          </motion.div>
        )}

        {/* Collapsed Admin Avatar */}
        {collapsed && (
          <div className={`mt-auto pt-4 border-t ${
            isDarkMode ? 'border-[#1E293B]' : 'border-gray-200'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 flex items-center justify-center border border-[#FFD700]/30 mx-auto">
              <User className="w-5 h-5 text-[#FFD700]" />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}