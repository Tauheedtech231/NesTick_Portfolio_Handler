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

  // Base section definitions
  const allSections = [
    { id: 'dashboard', name: 'Dashboard', icon: FiImage }, // Dashboard always on top
    { id: 'about', name: 'About College', icon: FiHome },
    { id: 'faculty', name: 'Faculty', icon: FiUsers },
    { id: 'events', name: 'Events & Announcements', icon: FiCalendar },
    { id: 'gallery', name: 'Gallery', icon: FiImage },
    { id: 'courses', name: 'Courses', icon: FiBook },
    { id: 'contact', name: 'Contact Info', icon: FiMail },
  ];

  // Filter modules based on active modules array, but always include dashboard
  const activeSections = allSections.filter(
    (section) => section.id === 'dashboard' || modules.includes(section.id)
  );

  return (
    <aside
      className={cn(
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-black dark:text-white">Navigation</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-xl text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isCollapsed ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {activeSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id as SectionType)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200',
                activeSection === section.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{section.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Preview Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
