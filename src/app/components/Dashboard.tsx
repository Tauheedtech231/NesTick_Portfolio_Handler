'use client';

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { CollegeData, SectionType } from '@/app/lib/gsap';
import { PortalLayout } from '@/app/components/layout/PortalLayout';
import { PreviewPane } from '@/app/components/PreviewModal';
import { AboutSection } from '@/app/components/sections/AboutSection';
import { FacultySection } from '@/app/components/sections/FacultySection';
import { EventsSection } from '@/app/components/sections/EventsSection';
import { GallerySection } from '@/app/components/sections/GallerySection';
import { CoursesSection } from '@/app/components/sections/CoursesSection';
import { ContactSection } from '@/app/components/sections/ContactSection';
import { Lock, Bell, Eye, Grid3X3, Users, Calendar, Image, BookOpen, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardProps {
  initialData: CollegeData;
}

/* eslint-disable */
const CURRENT_COLLEGE_ID = '1762352574095';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetCollege: string;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  modules: {
    about: boolean;
    faculty: boolean;
    events: boolean;
    gallery: boolean;
    achievements: boolean;
    courses: boolean;
    contact: boolean;
  };
  // Add other college properties that might exist in CollegeData
  about?: any;
  faculty?: any;
  events?: any;
  gallery?: any;
  achievements?: any;
  courses?: any;
  contact?: any;
}

/* Announcements Section */
const AnnouncementsSection: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Bell className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Announcements</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Latest updates from administration</p>
      </div>
      {announcements.length > 0 && (
        <span className="ml-auto bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-full">
          {announcements.length}
        </span>
      )}
    </div>

    {announcements.length === 0 ? (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-500 text-sm">No announcements yet</p>
      </div>
    ) : (
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div
            key={announcement.id}
            className={cn(
              'p-4 rounded-xl border transition-all duration-200 hover:shadow-sm cursor-pointer',
              index === 0
                ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700'
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                {announcement.title}
              </h4>
              {index === 0 && (
                <span className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-full shrink-0 ml-2">
                  New
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">
              {announcement.message}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span>
                {new Date(announcement.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* Status Card */
const StatusCard: React.FC<{ status: 'active' | 'inactive'; collegeName: string }> = ({ status, collegeName }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{collegeName}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Principal Portal Dashboard</p>
      </div>
      <div
        className={cn(
          'px-3 py-1 rounded-full text-sm font-medium border transition-colors',
          status === 'active'
            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
            : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600'
        )}
      >
        {status === 'active' ? 'Active' : 'Inactive'}
      </div>
    </div>

    {status === 'inactive' && (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <Lock className="w-4 h-4" />
          <p className="text-sm font-medium">Portal Access Restricted</p>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">
          Your college portal is currently locked. Please contact{' '}
          <a
            href="https://nesticktech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            nesticktech.com
          </a>{' '}
          to enable access.
        </p>
      </div>
    )}
  </div>
);

/* Module Cards */
const ModuleCards: React.FC<{ activeModules: (keyof College['modules'])[] }> = ({ activeModules }) => {
  const moduleIcons = { about: Grid3X3, faculty: Users, events: Calendar, gallery: Image, courses: BookOpen, contact: Phone, achievements: Eye };
  const moduleLabels = { about: 'About College', faculty: 'Faculty', events: 'Events', gallery: 'Gallery', courses: 'Courses', contact: 'Contact', achievements: 'Achievements' };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Grid3X3 className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Modules</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your college portfolio sections</p>
        </div>
      </div>

      {activeModules.length === 0 ? (
        <div className="text-center py-8">
          <Grid3X3 className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-500 text-sm">No active modules configured</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeModules.map((module) => {
            const IconComponent = moduleIcons[module];
            return (
              <div
                key={module}
                className={cn(
                  'group p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                  'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                    <IconComponent className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{moduleLabels[module]}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* Section Components */
const sectionComponents: Record<SectionType, React.ComponentType<any>> = {
  dashboard: () => (
    <div className="text-gray-500 dark:text-gray-300 text-center py-16">
      <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p className="text-sm">Dashboard Overview</p>
    </div>
  ),
  about: AboutSection,
  faculty: FacultySection,
  events: EventsSection,
  gallery: GallerySection,
  courses: CoursesSection,
  contact: ContactSection,
  flexible: () => (
    <div className="text-gray-500 dark:text-gray-500 text-center py-16">
      <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p className="text-sm">Flexible section content</p>
    </div>
  ),
};

export default function DashboardPage({ initialData }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
  const [collegeData, setCollegeData] = useState<CollegeData>(initialData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeModules, setActiveModules] = useState<(keyof College['modules'])[]>([]);

  useEffect(() => {
    gsap.fromTo('.section-content', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }, [activeSection]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const rawColleges = localStorage.getItem('colleges');
    const colleges: College[] = rawColleges ? JSON.parse(rawColleges) : [];
    const found = colleges.find((c) => c.id === CURRENT_COLLEGE_ID);

    if (found) {
      setCollegeData((prev) => ({
        ...prev,
        college: { ...prev.college, ...found },
      }));
    }

    const sourceModules = found?.modules ?? (collegeData.college as any)?.modules ?? {};
    const enabled = Object.keys(sourceModules).filter((k) => sourceModules[k as keyof typeof sourceModules]) as (keyof College['modules'])[];
    setActiveModules(enabled);

    const rawAnnouncements = localStorage.getItem('announcements');
    const annArr: Announcement[] = rawAnnouncements ? JSON.parse(rawAnnouncements) : [];
    const filtered = annArr.filter((a) => a.targetCollege === 'all' || a.targetCollege === CURRENT_COLLEGE_ID);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAnnouncements(filtered);
  }, []);

  const persistCollegeToLocal = (updatedCollege: College) => {
    if (typeof window === 'undefined') return;
    const rawColleges = localStorage.getItem('colleges');
    const colleges: College[] = rawColleges ? JSON.parse(rawColleges) : [];

    const idx = colleges.findIndex((c) => c.id === updatedCollege.id);
    if (idx >= 0) colleges[idx] = updatedCollege;
    else colleges.push(updatedCollege);

    localStorage.setItem('colleges', JSON.stringify(colleges));
  };

  const updateSectionData = (section: SectionType, data: any) => {
    setCollegeData((prev) => {
      const updated = structuredClone(prev);
      if (section === 'about') updated.college = { ...updated.college, ...data };
      else (updated as any)[section] = data;

      // Ensure we have the required properties for College type
persistCollegeToLocal({
  id: updated.college.id,
  name: updated.college.name,
  status: (updated.college as any).status,
  modules: { ...updated.college as any  }.modules,
});

      return updated;
    });
  };

  // Add safe access to college properties with fallbacks
const collegeStatus = (collegeData.college as any)?.status || 'active';

  const collegeName = collegeData.college?.name || 'College Portal';
  const collegeModules = (collegeData.college as any)?.modules || {
    about: true,
    faculty: true,
    events: true,
    gallery: true,
    achievements: true,
    courses: true,
    contact: true,
  };

  // Portal locked view
  if (collegeStatus === 'inactive') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-gray-900 dark:text-gray-100" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Portal Locked</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Your college portal is currently locked. Please contact administration to enable access.
          </p>
          <a
            href="https://nesticktech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  const ActiveComponent = sectionComponents[activeSection];
  const sectionData =
    activeSection === 'about'
      ? collegeData.college
      : activeSection === 'contact'
      ? collegeData.college?.contact
      : (collegeData as any)[activeSection];

  return (
    <PortalLayout
      collegeName={collegeName}
      onPreview={() => setIsPreviewOpen(true)}
      activeSection={activeSection}
      onSectionChange={(s) => setActiveSection(s)}
    >
      {activeSection === 'dashboard' ? (
        <div className="space-y-6">
          <StatusCard status={collegeStatus} collegeName={collegeName} />
          <AnnouncementsSection announcements={announcements} />
          <ModuleCards activeModules={activeModules} />
        </div>
      ) : (
        <div className="section-content transition-all duration-300 ease-in-out">
          <ActiveComponent
            data={sectionData}
            college={collegeData.college}
            onUpdate={(data: any) => updateSectionData(activeSection, data)}
            disabled={collegeStatus === 'inactive'}
          />
        </div>
      )}

      <PreviewPane isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} data={collegeData} />
    </PortalLayout>
  );
}