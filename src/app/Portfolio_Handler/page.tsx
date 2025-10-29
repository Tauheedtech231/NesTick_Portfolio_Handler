'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Palette, Download } from 'lucide-react';

import { MainLayout } from './components/layout/main-layout';
import { StatsCard } from './components/dashboard/stats-card';
import { College } from '@/app/types';

export default function DashboardPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);

  // Load colleges from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem('colleges');
    if (stored) setColleges(JSON.parse(stored));
  }, []);

  const total = colleges.length;
  const active = colleges.filter(c => c.status === 'active').length;
  const inactive = colleges.filter(c => c.status === 'inactive').length;

  const handleAdd = () => router.push('/Portfolio_Handler/colleges');
  const handleThemes = () => router.push('/Portfolio_Handler/themes');

  const handleBackup = () => {
    const data = {
      colleges: localStorage.getItem('colleges'),
      themes: localStorage.getItem('themes'),
      announcements: localStorage.getItem('announcements'),
      settings: localStorage.getItem('settings'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-backup.json';
    link.click();
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-8 transition-colors duration-300"
      >
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Colleges" value={total.toString()} description="All registered colleges" trend="+2 this month" />
          <StatsCard title="Active Colleges" value={active.toString()} description="Currently active portfolios" trend="+12% from last month" />
          <StatsCard title="Disabled Colleges" value={inactive.toString()} description="Inactive portfolios" trend="-5% from last month" />
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className="flex items-center space-x-3 p-6 rounded-2xl shadow-lg 
            bg-gradient-to-r from-blue-500 to-cyan-400 text-white 
            hover:shadow-cyan-400/40 transition-all duration-300"
          >
            <Plus size={24} />
            <div>
              <h3 className="font-semibold">Add College</h3>
              <p className="text-sm text-cyan-100">Register a new college</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleThemes}
            className="flex items-center space-x-3 p-6 rounded-2xl shadow-lg 
            bg-gradient-to-r from-purple-500 to-pink-500 text-white 
            hover:shadow-pink-400/40 transition-all duration-300"
          >
            <Palette size={24} />
            <div>
              <h3 className="font-semibold">Manage Themes</h3>
              <p className="text-sm text-pink-100">Customize appearance</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBackup}
            className="flex items-center space-x-3 p-6 rounded-2xl shadow-lg 
            bg-gradient-to-r from-green-500 to-emerald-600 text-white 
            hover:shadow-green-400/40 transition-all duration-300"
          >
            <Download size={24} />
            <div>
              <h3 className="font-semibold">Backup Data</h3>
              <p className="text-sm text-emerald-100">Export all data</p>
            </div>
          </motion.button>
        </section>

        {/* Analytics */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
              College Status Distribution
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span>Active Colleges</span>
                <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    style={{ width: `${total ? (active / total) * 100 : 0}%` }}
                  />
                </div>
                <span>{active}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Inactive Colleges</span>
                <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500"
                    style={{ width: `${total ? (inactive / total) * 100 : 0}%` }}
                  />
                </div>
                <span>{inactive}</span>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </MainLayout>
  );
}
