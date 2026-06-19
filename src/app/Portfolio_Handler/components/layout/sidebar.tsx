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
  Bell,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Briefcase,
  UserPlus,
  Brush,
  Grid,
  Blocks,
  Key,
  Shield,
  Code2
} from 'lucide-react';

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
      { type: 'link', href: '/Portfolio_Handler/Requested_template', icon: FileText, label: 'Requested Templates' },
      { type: 'link', href: '/Portfolio_Handler/credientials_manage', icon: Key, label: 'Credentials' }
    ]
  },
  { 
    type: 'dropdown',
    label: 'Templates',
    icon: Palette,
    children: [
      { type: 'link', href: '/Portfolio_Handler/themes', icon: Grid, label: 'All Templates' },
      { type: 'link', href: '/Portfolio_Handler/modules', icon: Blocks, label: 'Modules' }
    ]
  },
  { type: 'link', href: '/Portfolio_Handler/announcements', icon: Megaphone, label: 'Announcements' },
  { type: 'link', href: '/Portfolio_Handler/partners-designers', icon: Users, label: 'Partners ' },
  { 
    type: 'dropdown',
    label: 'Designers',
    icon: Brush,
    children: [
      { type: 'link', href: '/Portfolio_Handler/design-management', icon: Brush, label: 'Design Management' },
      { type: 'link', href: '/Portfolio_Handler/designers', icon: Users, label: 'Designers' }
    ]
  },
  { 
    type: 'dropdown',
    label: 'Developers',
    icon: Code2,
    children: [
      { type: 'link', href: '/Portfolio_Handler/developer-management', icon: Users, label: 'Developer Requests' },
      { type: 'link', href: '/Portfolio_Handler/submitted-designs', icon: FileText, label: 'Submitted Designs' }
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingDesignsCount, setPendingDesignsCount] = useState(0);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  // Function to update navbar links using localStorage
  const updateNavbarLinks = (children: MenuItemLink[]) => {
    const navLinks = children.map(child => ({
      href: child.href,
      label: child.label,
      icon: child.icon.name
    }));
    localStorage.setItem('navbar_links', JSON.stringify(navLinks));
    window.dispatchEvent(new Event('storage'));
  };

  const clearNavbarLinks = () => {
    localStorage.removeItem('navbar_links');
    window.dispatchEvent(new Event('storage'));
  };

  // Logo click handler
  const handleLogoClick = () => {
    router.push('/');
    clearNavbarLinks();
  };

  useEffect(() => {
    const loginUser = localStorage.getItem('login_user');
    if (loginUser) {
      try {
        const parsed = JSON.parse(loginUser);
        setAdminEmail(parsed.email);
        const nameFromEmail = parsed.email?.split('@')[0] || 'Admin';
        setAdminName(nameFromEmail);
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }
    
    fetchPendingCount();
    fetchPendingDesignsCount();

    const currentPath = window.location.pathname;
    let foundLinks = false;
    
    for (const item of menuItems) {
      if (item.type === 'dropdown') {
        const matchingChild = item.children.find(child => child.href === currentPath);
        if (matchingChild) {
          const navLinks = item.children.map(child => ({
            href: child.href,
            label: child.label,
            icon: child.icon.name
          }));
          localStorage.setItem('navbar_links', JSON.stringify(navLinks));
          window.dispatchEvent(new Event('storage'));
          foundLinks = true;
          break;
        }
      }
    }
    
    if (!foundLinks) {
      localStorage.removeItem('navbar_links');
      window.dispatchEvent(new Event('storage'));
    }
  }, []);

  const fetchPendingCount = async () => {
    try {
      const designersRes = await fetch('/api/designers?status=pending');
      const designersData = await designersRes.json();
      
      const partnersRes = await fetch('/api/partners?status=pending');
      const partnersData = await partnersRes.json();
      
      const count = (designersData.data?.length || 0) + (partnersData.data?.length || 0);
      setPendingCount(count);
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  const fetchPendingDesignsCount = async () => {
    try {
      const designsRes = await fetch('/api/admin/designs?status=pending');
      const designsData = await designsRes.json();
      
      const count = designsData.designs?.length || 0;
      setPendingDesignsCount(count);
    } catch (error) {
      console.error('Error fetching pending designs count:', error);
    }
  };

  const filteredMenu = menuItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Dropdown click - Redirect to first child AND update navbar
  const handleDropdownClick = (children: MenuItemLink[]) => {
    const firstChild = children[0];
    
    const currentLinks = localStorage.getItem('navbar_links');
    if (currentLinks) {
      try {
        const parsed = JSON.parse(currentLinks);
        const isSame = parsed.length === children.length && 
          parsed.every((link: any, index: number) => link.href === children[index].href);
        if (isSame) {
          clearNavbarLinks();
          router.push('/Portfolio_Handler');
          return;
        }
      } catch {}
    }
    
    updateNavbarLinks(children);
    
    if (firstChild) {
      router.push(firstChild.href);
    }
  };

  const isDropdownActive = (children: MenuItemLink[]) => {
    return children.some(child => pathname === child.href);
  };

  const isDropdown = (item: MenuItem): item is MenuItemDropdown => {
    return item.type === 'dropdown';
  };

  const isLink = (item: MenuItem): item is MenuItemLink => {
    return item.type === 'link';
  };

  const handleLogout = () => {
    localStorage.removeItem('login_user');
    localStorage.removeItem('superAdminTest');
    clearNavbarLinks();
    router.push('/');
  };

  const handleLinkClick = () => {
    clearNavbarLinks();
  };

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${collapsed ? 'w-20' : 'w-64'}
        bg-[#0B0F19] border-r border-blue-600/30
        min-h-screen shadow-2xl flex flex-col justify-between
        transition-all duration-500 relative overflow-hidden`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 opacity-30" />

      <div className="p-4 flex flex-col h-full relative z-10">

        {/* Header - Logo Clickable */}
        <div className="flex items-center justify-between mb-6">
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo.jpg" 
                alt="Neezamiya Logo" 
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <h1 className="text-lg font-extrabold text-white tracking-tight cursor-pointer">
                    Neezamiya
                  </h1>
                  <p className="text-[12px] text-gray-500 -mt-1 cursor-default">Admin Portal</p>
                </div>
              </motion.div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="flex p-2 rounded-lg transition-all duration-300 text-gray-400 hover:text-yellow-400 hover:bg-[#1E293B] cursor-pointer"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Search Bar - Font size kept small */}
        {!collapsed && (
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-blue-600/30 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-300 text-sm relative z-10 cursor-text"
            />
            <Search size={16} className="absolute right-3 top-2.5 text-gray-500 z-10 pointer-events-none" />
          </div>
        )}

        {/* Pending Notification */}
        {!collapsed && pendingCount > 0 && (
          <div className="mb-2">
            <Link
              href="/Portfolio_Handler/partners-designers"
              onClick={handleLinkClick}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-600/10 border border-blue-600/30 hover:bg-blue-600/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-yellow-400" />
                <span className="text-sm text-white">Pending Approvals</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-yellow-500 text-black text-xs font-bold">
                {pendingCount}
              </span>
            </Link>
          </div>
        )}

        {/* Pending Designs Notification */}
        {!collapsed && pendingDesignsCount > 0 && (
          <div className="mb-4">
            <Link
              href="/Portfolio_Handler/design-management"
              onClick={handleLinkClick}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-600/10 border border-purple-600/30 hover:bg-purple-600/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Brush size={16} className="text-purple-400" />
                <span className="text-sm text-white">Pending Designs</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs font-bold">
                {pendingDesignsCount}
              </span>
            </Link>
          </div>
        )}

        {/* Navigation - Increased font size */}
        <nav className="flex flex-col gap-1 flex-1">
          {filteredMenu.map((item) => {
            if (isDropdown(item)) {
              const isActive = isDropdownActive(item.children);
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleDropdownClick(item.children)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-300 cursor-pointer w-full text-left
                    ${isActive
                      ? 'bg-blue-600/10 border-l-2 border-blue-600 text-blue-400'
                      : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                    }`}
                >
                  <item.icon size={20} className={isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-yellow-400'} />
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
                </button>
              );
            }
            
            if (isLink(item)) {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-300 cursor-pointer
                    ${isActive
                      ? 'bg-blue-600/10 border-l-2 border-blue-600 text-blue-400'
                      : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                    }`}
                >
                  <item.icon size={20} className={isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-yellow-400'} />
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
                  {item.label === 'Partners ' && pendingCount > 0 && !collapsed && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-[10px] font-bold">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            }
            
            return null;
          })}
        </nav>

        {/* Admin Details at Bottom */}
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-auto pt-4 border-t border-blue-600/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-600/30">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white cursor-default">
                  {adminName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate cursor-default">
                  {adminEmail || 'admin@neeZamiya.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-600/30 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-all duration-300 group cursor-pointer"
            >
              <LogOut size={16} className="group-hover:scale-110 transition-transform" />
              Logout
            </button>
          </motion.div>
        )}

        {/* Collapsed Admin Avatar */}
        {collapsed && (
          <div className="mt-auto pt-4 border-t border-blue-600/30">
            <div className="relative w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-600/30 mx-auto">
              <User className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}