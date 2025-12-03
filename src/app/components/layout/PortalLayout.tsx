'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SectionType } from '@/app/lib/gsap';

interface Template {
  id: number;
  name: string;
}
/* eslint-disable */

interface PortalLayoutProps {
  logo?: string;
  children: React.ReactNode;
  onPreview: () => void;
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export function PortalLayout({
  logo,
  children,
  onPreview,
  activeSection,
  onSectionChange,
}: PortalLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeModules, setActiveModules] = useState<string[]>([
    'about',
    'faculty',
    'courses',
    'events',
    'gallery',
    'contact',
  ]);
  const [templateName, setTemplateName] = useState<string>('Loading...');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch template data from /api/templates (example: first template)
  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch('/api/templates');
        if (!res.ok) throw new Error('Failed to fetch templates');

        const templates: Template[] = await res.json();
        if (templates.length === 0) {
          setErrorMessage('No templates found.');
          setTemplateName('Default Template');
          return;
        }

        const currentTemplate = templates[0];
        setTemplateName(currentTemplate.name);
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || 'Error fetching templates');
        setTemplateName('Default Template');
      }
    }

    fetchTemplate();
  }, []);

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
        {/* Header */}
        <Header
          collegeName={templateName} // Template name in header
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
