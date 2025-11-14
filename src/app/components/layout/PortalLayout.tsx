'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import {
  FiMenu,
  FiUser,
  FiBookOpen,
  FiCamera,
  FiCalendar,
  FiUsers,
  FiPhoneCall,
  FiEye,
} from 'react-icons/fi';
import { SectionType } from '@/app/lib/gsap';
import { College, Announcement } from '@/app/types/index';

interface PortalLayoutProps {
  collegeName: string;
  logo?: string;
  children: React.ReactNode;
  onPreview: () => void;
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export function PortalLayout({
  collegeName,
  logo,
  children,
  onPreview,
  activeSection,
  onSectionChange,
}: PortalLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 🔥 GET CURRENT LOGGED-IN COLLEGE ID
  const getCurrentCollegeId = () => {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem('auth_college');
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed?.collegeId || null;
    } catch (err) {
      return null;
    }
  };

  const CURRENT_COLLEGE_ID = getCurrentCollegeId();

  useEffect(() => {
    if (!CURRENT_COLLEGE_ID) {
      setErrorMessage('No logged-in college found. Showing all modules.');
      setActiveModules(['about', 'faculty', 'courses', 'events', 'gallery', 'contact']);
      return;
    }

    // Load college data from localStorage
    const rawColleges = localStorage.getItem('colleges');
    const colleges: College[] = rawColleges ? JSON.parse(rawColleges) : [];
    const found = colleges.find((c) => c.id === CURRENT_COLLEGE_ID);

    if (found) {
      const sourceModules = found.modules ?? {};
      const enabled = Object.keys(sourceModules).filter(
        (k) => sourceModules[k as keyof typeof sourceModules]
      );
      setActiveModules(enabled as (keyof College['modules'])[]);
    } else {
      setActiveModules(['about', 'faculty', 'courses', 'events', 'gallery', 'contact']);
      setErrorMessage(
        'No college data found for this account. Showing all modules.'
      );
    }

    // Load announcements
    const rawAnnouncements = localStorage.getItem('announcements');
    const annArr: Announcement[] = rawAnnouncements ? JSON.parse(rawAnnouncements) : [];

    const filtered = annArr
      .filter(
        (a) => a.targetCollege === 'all' || a.targetCollege === CURRENT_COLLEGE_ID
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setAnnouncements(filtered);
  }, [CURRENT_COLLEGE_ID]);

  const allSections: { id: SectionType; label: string; icon: React.ReactNode }[] = [
    { id: 'about', label: 'About', icon: <FiUser /> },
    { id: 'faculty', label: 'Faculty', icon: <FiUsers /> },
    { id: 'courses', label: 'Courses', icon: <FiBookOpen /> },
    { id: 'events', label: 'Events', icon: <FiCalendar /> },
    { id: 'gallery', label: 'Gallery', icon: <FiCamera /> },
    { id: 'contact', label: 'Contact', icon: <FiPhoneCall /> },
  ];

  const mobileSections = allSections.filter(
    (s) => activeModules.includes(s.id as keyof College['modules'])
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Header collegeName={collegeName} logo={logo} />

      {errorMessage && (
        <div className="bg-red-500 text-white text-center py-2 font-medium">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-1 relative">
        <aside
          className={`fixed sm:static top-0 left-0 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 w-64 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 transition-transform duration-300 z-40`}
        >
          <Sidebar
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            onPreview={onPreview}
            modules={activeModules}
          />
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 sm:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 w-full sm:ml-0 overflow-y-auto">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="sm:hidden mb-4 p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center gap-2 shadow-md hover:opacity-90 transition-all duration-300"
          >
            <FiMenu className="w-5 h-5" />
            Menu
          </button>

          {children}
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <ul className="flex justify-around items-center py-2">
          {mobileSections.map((item) => (
            <li
              key={item.id}
              className={`flex flex-col items-center text-sm cursor-pointer transition-colors ${
                activeSection === item.id
                  ? 'text-black dark:text-white font-semibold'
                  : 'text-gray-700 dark:text-gray-400'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              {item.label}
            </li>
          ))}

          <li
            onClick={onPreview}
            className="flex flex-col items-center text-sm cursor-pointer text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <FiEye className="text-xl mb-1" />
            Preview
          </li>
        </ul>
      </nav>
    </div>
  );
}
