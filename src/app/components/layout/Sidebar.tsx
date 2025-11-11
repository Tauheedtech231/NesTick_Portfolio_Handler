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
  FiChevronRight
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  onPreview: () => void;
  modules: string[]; // active module IDs as array
}

export function Sidebar({ activeSection, onSectionChange, onPreview, modules }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const allSections = [
    { id: 'dashboard', name: 'Dashboard', icon: FiImage },
    { id: 'about', name: 'About College', icon: FiHome },
    { id: 'faculty', name: 'Faculty', icon: FiUsers },
    { id: 'events', name: 'Events & Announcements', icon: FiCalendar },
    { id: 'gallery', name: 'Gallery', icon: FiImage },
    { id: 'courses', name: 'Courses', icon: FiBook },
    { id: 'contact', name: 'Contact Info', icon: FiMail },
  ];

  const activeSections = allSections.filter(
    (section) => section.id === 'dashboard' || modules.includes(section.id)
  );

  return (
    <aside
      className={cn(
        'bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 min-h-screen shadow-md transition-all duration-500 flex flex-col justify-between',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* ==== Header Section ==== */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed ? (
          <div>
            <h2 className="text-xl font-extrabold text-black dark:text-white tracking-tight">
              College Portal
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Editor Dashboard
            </p>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <span className="text-2xl text-black dark:text-white font-bold">C</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          {isCollapsed ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* ==== Navigation ==== */}
      <nav className="flex-1 flex flex-col gap-1 p-4">
        {activeSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id as SectionType)}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 w-full text-left',
                isActive
                  ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-l-4 border-gray-800 dark:border-white'
                  : 'text-gray-700 hover:text-black hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white'
              )}
            >
              <Icon
                size={20}
                className={cn(
                  'transition-transform duration-300',
                  isActive
                    ? 'scale-110 text-black dark:text-white'
                    : 'group-hover:scale-110 text-gray-600 dark:text-gray-300'
                )}
              />
              {!isCollapsed && <span>{section.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* ==== Preview Button ==== */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          onClick={onPreview}
          className={cn(
            'w-full flex items-center justify-center bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all duration-300',
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
