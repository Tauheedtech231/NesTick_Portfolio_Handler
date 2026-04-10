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
  LogOut,
  Crown,
  Settings,
  HelpCircle,
  Bell
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
        bg-gradient-to-b from-[#0B0F19] to-[#0F172A] border-r border-[#E8CA5E]/20
        min-h-screen shadow-2xl flex flex-col justify-between
        transition-all duration-500 relative overflow-hidden`}
    >
      {/* Decorative gradient lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8CA5E] via-[#00E0FF] to-[#E8CA5E]" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8CA5E] via-[#00E0FF] to-[#E8CA5E] opacity-30" />
      
      {/* Animated background glow */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E8CA5E]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00E0FF]/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="p-4 flex flex-col h-full relative z-10">

        {/* ==== Header ==== */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg blur-md opacity-60 bg-[#E8CA5E]" />
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8CA5E] to-[#A57F2A] flex items-center justify-center shadow-lg shadow-[#E8CA5E]/30">
                <Crown className="w-4 h-4 text-[#1F4381]" />
              </div>
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <h1 className="text-lg font-extrabold bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] bg-clip-text text-transparent tracking-tight">
                      Neezamiya
                    </h1>
                    <p className="text-[10px] text-gray-500 -mt-1">Admin Portal</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse Button */}
          <button
            onClick={toggleSidebar}
            className="flex p-2 rounded-lg transition-all duration-300 text-gray-400 hover:text-[#E8CA5E] hover:bg-[#1E293B]"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* ==== Search Bar ==== */}
        {!collapsed && (
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#E8CA5E]/20 to-[#00E0FF]/20 blur-md opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00E0FF] transition-all duration-300 text-sm relative z-10"
            />
            <Search
              size={16}
              className="absolute right-3 top-2.5 text-gray-500 z-10"
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
                          ? 'bg-gradient-to-r from-[#E8CA5E]/10 to-transparent border-l-2 border-[#E8CA5E] text-[#E8CA5E]'
                          : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={20}
                        className={`transition-all duration-300 ${
                          isActive
                            ? 'text-[#E8CA5E]'
                            : 'text-gray-500 group-hover:text-[#00E0FF]'
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
                        } ${isActive ? 'text-[#E8CA5E]' : 'text-gray-500'}`}
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
                                    ? 'bg-gradient-to-r from-[#00E0FF]/10 to-transparent text-[#00E0FF] border-l-2 border-[#00E0FF]'
                                    : 'text-gray-500 hover:bg-[#1E293B] hover:text-gray-300'
                                }`}
                            >
                              <child.icon
                                size={14}
                                className={isChildActive ? 'text-[#00E0FF]' : 'text-gray-500'}
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
                        ? 'bg-gradient-to-r from-[#E8CA5E]/10 to-transparent border-l-2 border-[#E8CA5E] text-[#E8CA5E]'
                        : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                    }`}
                >
                  <item.icon
                    size={20}
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'text-[#E8CA5E]'
                        : 'text-gray-500 group-hover:text-[#00E0FF]'
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
            className="mt-auto pt-4 border-t border-[#1E293B]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl blur-sm bg-[#E8CA5E]/50 opacity-50" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8CA5E]/20 to-[#00E0FF]/10 flex items-center justify-center border border-[#E8CA5E]/30">
                  <User className="w-5 h-5 text-[#E8CA5E]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">
                  {adminName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {adminEmail || 'admin@neeZamiya.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#E8CA5E]/10 to-[#A57F2A]/5 border border-[#E8CA5E]/30 text-[#E8CA5E] text-sm font-medium hover:bg-gradient-to-r hover:from-[#E8CA5E]/20 hover:to-[#A57F2A]/10 hover:border-[#E8CA5E]/50 transition-all duration-300 group"
            >
              <LogOut size={16} className="group-hover:scale-110 transition-transform" />
              Logout
            </button>
          </motion.div>
        )}

        {/* Collapsed Admin Avatar */}
        {collapsed && (
          <div className="mt-auto pt-4 border-t border-[#1E293B]">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-sm bg-[#E8CA5E]/50 opacity-50" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8CA5E]/20 to-[#00E0FF]/10 flex items-center justify-center border border-[#E8CA5E]/30 mx-auto">
                <User className="w-5 h-5 text-[#E8CA5E]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}