// app/designer-portal/page.tsx
'use client';

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './components/DashboardPage';
import { DesignsPage } from './components/DesignsPage';
import { UploadPage } from './components/UploadPage';
import { EarningsPage } from './components/EarningsPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ProfilePage } from './components/ProfilePage';

// Mock data with proper typing
export const designs = [
  { id: 1, name: 'School Admin Dashboard', status: 'approved' as const, price: 89, category: 'Admin Dashboard', views: 4200, sales: 16, hue: 230 },
  { id: 2, name: 'Student Portal v2', status: 'approved' as const, price: 65, category: 'Student Portal', views: 3100, sales: 12, hue: 160 },
  { id: 3, name: 'Library Portal', status: 'pending' as const, price: 75, category: 'Library System', views: 1200, sales: 0, hue: 45 },
  { id: 4, name: 'Timetable Manager', status: 'approved' as const, price: 55, category: 'Timetable System', views: 1600, sales: 8, hue: 270 },
  { id: 5, name: 'Finance Module Pro', status: 'rejected' as const, price: 45, category: 'Finance', views: 800, sales: 0, hue: 355 },
  { id: 6, name: 'HR Management UI', status: 'pending' as const, price: 99, category: 'HR Management', views: 960, sales: 0, hue: 195 },
  { id: 7, name: 'Exam Scheduler', status: 'approved' as const, price: 70, category: 'Exam Management', views: 2100, sales: 9, hue: 310 },
  { id: 8, name: 'Parent Communication', status: 'approved' as const, price: 60, category: 'Communication', views: 1800, sales: 7, hue: 20 },
  { id: 9, name: 'Admin Dashboard v4', status: 'approved' as const, price: 110, category: 'Admin Dashboard', views: 3900, sales: 14, hue: 240 },
];

export const transactions = [
  { design: 'School Admin Dashboard', buyer: 'Al-Noor Academy', date: 'Apr 03, 2026', amount: 89, commission: 13.35, payout: 75.65, status: 'paid' as const },
  { design: 'Student Portal v2', buyer: 'Dar Al-Ulum School', date: 'Apr 01, 2026', amount: 65, commission: 9.75, payout: 55.25, status: 'paid' as const },
  { design: 'School Admin Dashboard', buyer: 'Future Stars Academy', date: 'Mar 28, 2026', amount: 89, commission: 13.35, payout: 75.65, status: 'paid' as const },
  { design: 'Timetable Manager', buyer: 'Bright Minds School', date: 'Mar 22, 2026', amount: 55, commission: 8.25, payout: 46.75, status: 'pending' as const },
  { design: 'Student Portal v2', buyer: 'Al-Hikma Institute', date: 'Mar 19, 2026', amount: 65, commission: 9.75, payout: 55.25, status: 'paid' as const },
  { design: 'Library Portal', buyer: 'Riyadh Int\'l School', date: 'Mar 15, 2026', amount: 75, commission: 11.25, payout: 63.75, status: 'paid' as const },
  { design: 'School Admin Dashboard', buyer: 'Knowledge Garden', date: 'Mar 10, 2026', amount: 89, commission: 13.35, payout: 75.65, status: 'paid' as const },
];

export const monthlyEarnings = [280, 420, 380, 620, 510, 740, 690, 880, 760, 340];
export const monthlyViews = [3200, 4800, 3900, 6100, 5400, 7200, 6800];
export const monthlySales = [12, 18, 14, 22, 19, 28, 24];
export const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

export default function DesignerPortal() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage setActivePage={setActivePage} />;
      case 'designs': return <DesignsPage setActivePage={setActivePage} />;
      case 'upload': return <UploadPage setActivePage={setActivePage} />;
      case 'earnings': return <EarningsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'profile': return <ProfilePage />;
      default: return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07080F]">
      <Sidebar sidebarOpen={sidebarOpen} activePage={activePage} setActivePage={setActivePage} />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActivePage={setActivePage} />
        <div className="p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}