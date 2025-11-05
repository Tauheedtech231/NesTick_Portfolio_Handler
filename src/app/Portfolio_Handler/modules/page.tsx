// app/modules/page.tsx
'use client';

import { MainLayout } from '../components/layout/main-layout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { College } from '@/app/types';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { Users, Calendar, Image, Trophy, Building2, Phone, Plus } from 'lucide-react';

export default function ModulesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');

  const [customModules, setCustomModules] = useState<
    { key: string; label: string; description: string }[]
  >([]);

  // Load data from localStorage
  useEffect(() => {
    const savedColleges = localStorage.getItem('colleges');
    console.log('Saved Colleges:', savedColleges);
    const savedModules = localStorage.getItem('customModules');
    console.log('Saved Custom Modules:', savedModules);

    if (savedColleges) {
      const parsedColleges = JSON.parse(savedColleges);
      setColleges(parsedColleges);

      if (parsedColleges.length > 0) {
        setSelectedCollegeId(parsedColleges[0].id);
        setSelectedCollege(parsedColleges[0]);
      }
    }

    if (savedModules) {
      setCustomModules(JSON.parse(savedModules));
    }
  }, []);

  // Update selected college when dropdown changes
  useEffect(() => {
    const currentCollege = colleges.find((c) => c.id === selectedCollegeId);
    setSelectedCollege(currentCollege || null);
  }, [selectedCollegeId, colleges]);

  // Toggle module activation
  const handleToggle = (key: string) => {
    if (!selectedCollege) return;

   const updatedModules = {
  ...(selectedCollege.modules ?? {}), // ensures modules is always an object
  [key]: !selectedCollege.modules?.[key],
};


    const updatedCollege = { ...selectedCollege, modules: updatedModules };
    const updatedList = colleges.map((col) =>
      col.id === selectedCollegeId ? updatedCollege : col
    );

    setColleges(updatedList);
    setSelectedCollege(updatedCollege);
    localStorage.setItem('colleges', JSON.stringify(updatedList));
  };

  // Predefined + custom modules
  const modules = [
    { key: 'about', icon: Building2, label: 'About Us', description: 'College information and overview' },
    { key: 'faculty', icon: Users, label: 'Faculty', description: 'Staff and faculty members' },
    { key: 'events', icon: Calendar, label: 'Events', description: 'Upcoming events and calendar' },
    { key: 'gallery', icon: Image, label: 'Gallery', description: 'Photo and media gallery' },
    { key: 'achievements', icon: Trophy, label: 'Achievements', description: 'Awards and accomplishments' },
    { key: 'contact', icon: Phone, label: 'Contact', description: 'Contact details and inquiries' },
    ...customModules.map((m) => ({
      key: m.key,
      icon: Plus,
      label: m.label,
      description: m.description,
    })),
  ];

  // Add new custom module
  const handleAddCustom = () => {
    if (!newModuleName.trim()) return;

    const newMod = {
      key: newModuleName.toLowerCase().replace(/\s+/g, '-'),
      label: newModuleName,
      description: newModuleDescription || 'Custom module added by admin',
    };

    const updated = [...customModules, newMod];
    setCustomModules(updated);
    localStorage.setItem('customModules', JSON.stringify(updated));

    setNewModuleName('');
    setNewModuleDescription('');
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors">
            Module Control
          </h1>
        </div>

        {/* College selector */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select College
          </label>
          <select
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select a college</option>
            {colleges.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name} ({col.status})
              </option>
            ))}
          </select>
        </div>

        {/* Custom module section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Plus className="text-gray-600 dark:text-gray-400" /> Add Custom Module
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Module Name"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                         bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                         focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={newModuleDescription}
              onChange={(e) => setNewModuleDescription(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                         bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                         focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            />

            <button
              onClick={handleAddCustom}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg 
                         transition-all duration-300 transform hover:scale-105 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              Add Module
            </button>
          </div>
        </div>

        {/* Module toggles or empty state */}
        {selectedCollege ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedCollege.name} - Module Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Enable or disable content modules for this college
                </p>
              </div>

              <div className="p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {modules.map((mod, i) => (
                  <motion.div
                    key={mod.key}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg 
                               hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                        <mod.icon className="text-gray-700 dark:text-gray-300" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {mod.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    <ToggleSwitch
  enabled={selectedCollege.modules?.[mod.key] ?? false}
  onChange={() => handleToggle(mod.key)}
/>

                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center border border-gray-200 dark:border-gray-700"
          >
            <Building2 size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No College Selected
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please select a college to manage its modules.
            </p>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
}
