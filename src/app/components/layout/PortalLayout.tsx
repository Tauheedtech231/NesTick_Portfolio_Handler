'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SectionType } from '@/app/lib/gsap';
import { College } from '@/app/types/index';

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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getCurrentCollegeId = () => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('auth_college');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed?.collegeId || null;
    } catch {
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
      setErrorMessage('No college data found for this account. Showing all modules.');
    }
  }, [CURRENT_COLLEGE_ID]);

  return (
    <div className="flex min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-500">
      {/* 🔹 Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          onPreview={onPreview}
          modules={activeModules}
        />
      </div>

      {/* 🔹 Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
        />
      )}

      {/* 🔹 Main Content */}
      <div className="flex-1 flex flex-col transition-colors duration-500 md:ml-0">
        {/* Pass sidebar toggle to Header */}
        <Header
          collegeName={collegeName}
          logo={logo}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />

        {errorMessage && (
          <div className="bg-red-500 text-white text-center py-2 font-medium">
            {errorMessage}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-white dark:bg-black transition-colors duration-500 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
