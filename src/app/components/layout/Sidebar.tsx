'use client';

import React from 'react';
import { SectionType } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiImage,
  FiBook,
  FiMail,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiSearch
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  onPreview: () => void;
  modules: string[];
}

export function Sidebar({ activeSection, onSectionChange, onPreview, modules }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const allSections = [
    { id: 'dashboard', name: 'Dashboard', icon: FiImage },
    { id: 'about', name: 'About College', icon: FiHome },
    { id: 'faculty', name: 'Faculty', icon: FiUsers },
    { id: 'events', name: 'Events & Announcements', icon: FiCalendar },
    { id: 'gallery', name: 'Gallery', icon: FiImage },
    { id: 'courses', name: 'Courses', icon: FiBook },
    { id: 'contact', name: 'Contact Info', icon: FiMail },
  ];

  const filteredSections = allSections
    .filter(section => section.id === 'dashboard' || modules.includes(section.id))
    .filter(section => section.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside
      className={cn(
        'flex flex-col justify-between min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md transition-all duration-500',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed ? (
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              College Portal
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Editor Dashboard
            </p>
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-900 dark:text-white">C</span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-4 py-3 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
            />
            <FiSearch className="absolute right-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-4 items-start">
        {filteredSections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id as SectionType)}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all duration-300',
                isActive
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-l-4 border-gray-900 dark:border-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              )}
            >
              <Icon
                size={20}
                className={cn(
                  'transition-transform duration-300',
                  isActive
                    ? 'scale-110 text-gray-900 dark:text-white'
                    : 'group-hover:scale-110 text-gray-600 dark:text-gray-300'
                )}
              />
              {!isCollapsed && <span>{section.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Preview Button */}
      <div className="flex-shrink-0 mt-auto p-4 border-t border-gray-200 dark:border-gray-700 w-full">
        <Button
          onClick={onPreview}
          className={cn(
            'w-full flex items-center justify-center bg-gray-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-all duration-300',
            isCollapsed ? 'px-3' : 'px-4'
          )}
        >
          <FiEye className="w-4 h-4 mr-2" />
          {!isCollapsed && 'Preview Portfolio'}
        </Button>
      </div>
    </aside>
  );
}
