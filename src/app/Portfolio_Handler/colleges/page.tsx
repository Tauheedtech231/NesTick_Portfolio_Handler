'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';

import { MainLayout } from '../components/layout/main-layout';
import { CollegeTable } from '../components/colleges/college-table';
import { AddCollegeModal } from '../components/colleges/add-college-modal';
import { College } from '@/app/types';

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('colleges');
    if (saved) setColleges(JSON.parse(saved));
  }, []);

  const filtered = colleges.filter(c => {
    const bySearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.representativeName.toLowerCase().includes(search.toLowerCase());
    const byStatus = status === 'all' || c.status === status;
    return bySearch && byStatus;
  });
/* eslint-disable */
  const handleAdd = (data: any) => {
    const newCollege: College = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...colleges, newCollege];
    setColleges(updated);
    localStorage.setItem('colleges', JSON.stringify(updated));
    setShowAddModal(false);
    
  };

  // NEW: Handle adding approved colleges from requests
  const handleAddCollege = (newCollege: College) => {
    const collegeWithTimestamps: College = {
      ...newCollege,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...colleges, collegeWithTimestamps];
    setColleges(updated);
    localStorage.setItem('colleges', JSON.stringify(updated));
  };

  const handleEdit = (id: string, changes: Partial<College>) => {
    const updated = colleges.map(c =>
      c.id === id ? { ...c, ...changes, updatedAt: new Date() } : c
    );
    setColleges(updated);
    localStorage.setItem('colleges', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = colleges.filter(c => c.id !== id);
    setColleges(updated);
    localStorage.setItem('colleges', JSON.stringify(updated));
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="min-h-screen bg-white dark:bg-gray-900 p-6 space-y-6 transition-colors duration-300"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            College Management
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl 
                       bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                       shadow-sm hover:opacity-90 active:scale-95 transition-all duration-300"
          >
            <Plus size={18} />
            <span>Add College</span>
          </motion.button>
        </header>

        {/* Filters */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search colleges..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-gray-500 focus:border-transparent 
                           transition-colors duration-300"
              />
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-gray-500 focus:border-transparent
                         transition-colors duration-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </section>

        {/* Table - Updated with onAddCollege prop */}
        <CollegeTable
          colleges={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddCollege={handleAddCollege} // NEW PROP
        />

        {/* Modal */}
        <AddCollegeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      </motion.div>
    </MainLayout>
  );
}