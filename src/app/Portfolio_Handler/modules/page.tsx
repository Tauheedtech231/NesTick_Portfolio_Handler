// app/modules/page.tsx
'use client';

import { MainLayout } from '../components/layout/main-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { College } from '@/app/types';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { Users, Calendar, Image, Trophy, Building2, Phone, Plus, Trash2, Edit, Save, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function ModulesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');

  const [customModules, setCustomModules] = useState<
    { key: string; label: string; description: string }[]
  >([]);

  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ label: '', description: '' });

  const [moduleToDelete, setModuleToDelete] = useState<{ key: string; label: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

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

  // Toast notification system
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Check if module name already exists
  const isDuplicateModule = (name: string, excludeKey?: string): boolean => {
    const allModules = [
      { key: 'about', label: 'About Us' },
      { key: 'faculty', label: 'Faculty' },
      { key: 'events', label: 'Events' },
      { key: 'gallery', label: 'Gallery' },
      { key: 'achievements', label: 'Achievements' },
      { key: 'contact', label: 'Contact' },
      ...customModules
    ];

    return allModules.some(module => 
      module.label.toLowerCase() === name.toLowerCase() && 
      module.key !== excludeKey
    );
  };

  // Toggle module activation
  const handleToggle = (key: string) => {
    if (!selectedCollege) return;

    const updatedModules = {
      ...(selectedCollege.modules ?? {}),
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

  // Start editing a module
  const startEditing = (module: { key: string; label: string; description: string }) => {
    setEditingModule(module.key);
    setEditFormData({
      label: module.label,
      description: module.description
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingModule(null);
    setEditFormData({ label: '', description: '' });
  };

  // Save edited module
  const saveEditedModule = () => {
    if (!editingModule) return;

    // Check for duplicates (excluding the current module being edited)
    if (isDuplicateModule(editFormData.label, editingModule)) {
      addToast('A module with this name already exists!', 'error');
      return;
    }

    const updatedCustomModules = customModules.map(module =>
      module.key === editingModule
        ? {
            ...module,
            label: editFormData.label,
            description: editFormData.description,
            key: editFormData.label.toLowerCase().replace(/\s+/g, '-') // Update key if name changed
          }
        : module
    );

    setCustomModules(updatedCustomModules);
    localStorage.setItem('customModules', JSON.stringify(updatedCustomModules));
    setEditingModule(null);
    setEditFormData({ label: '', description: '' });
    addToast('Module updated successfully!', 'success');
  };

  // Delete a custom module
  const deleteCustomModule = () => {
    if (!moduleToDelete) return;

    const key = moduleToDelete.key;
    const updatedCustomModules = customModules.filter(module => module.key !== key);
    setCustomModules(updatedCustomModules);
    localStorage.setItem('customModules', JSON.stringify(updatedCustomModules));

    // Also remove this module from all colleges' module settings
    const updatedColleges = colleges.map(college => {
      if (college.modules && college.modules[key] !== undefined) {     
        const { [key]: removed, ...remainingModules } = college.modules;
        return { ...college, modules: remainingModules };
      }
      return college;
    });

    setColleges(updatedColleges);
    localStorage.setItem('colleges', JSON.stringify(updatedColleges));

    // Update selected college if it's the current one
    if (selectedCollege) {
      const currentCollege = updatedColleges.find(col => col.id === selectedCollegeId);
      setSelectedCollege(currentCollege || null);
    }

    // Show success message and close modal
    addToast(`Module "${moduleToDelete.label}" deleted successfully!`, 'success');
    setModuleToDelete(null);
  };

  // Add new custom module
  const handleAddCustom = () => {
    if (!newModuleName.trim()) {
      addToast('Please enter a module name', 'error');
      return;
    }

    // Check for duplicates
    if (isDuplicateModule(newModuleName)) {
      addToast('A module with this name already exists! Please choose a different name.', 'error');
      return;
    }

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
    addToast('Module added successfully!', 'success');
  };

  // Predefined modules (cannot be edited or deleted)
  const predefinedModules = [
    { key: 'about', icon: Building2, label: 'About Us', description: 'College information and overview' },
    { key: 'faculty', icon: Users, label: 'Faculty', description: 'Staff and faculty members' },
    { key: 'events', icon: Calendar, label: 'Events', description: 'Upcoming events and calendar' },
    { key: 'gallery', icon: Image, label: 'Gallery', description: 'Photo and media gallery' },
    { key: 'achievements', icon: Trophy, label: 'Achievements', description: 'Awards and accomplishments' },
    { key: 'contact', icon: Phone, label: 'Contact', description: 'Contact details and inquiries' },
  ];

  const modules = [
    ...predefinedModules,
    ...customModules.map((m) => ({
      key: m.key,
      icon: Plus,
      label: m.label,
      description: m.description,
      isCustom: true // Flag to identify custom modules
    })),
  ];

  return (
    <MainLayout>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border ${
              toast.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <X size={20} className="text-red-600" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`p-1 rounded-full hover:bg-opacity-20 ${
                toast.type === 'success' 
                  ? 'hover:bg-green-600 text-green-600' 
                  : 'hover:bg-red-600 text-red-600'
              }`}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {moduleToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                    <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete Module
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the module <strong>{moduleToDelete.label}</strong>? 
                  This will remove it from all colleges and cannot be recovered.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setModuleToDelete(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                             border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                             transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteCustomModule}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                             transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Delete Module</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-white dark:bg-gray-900 p-6 space-y-6 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Module Control
          </h1>
        </div>

        {/* College selector */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select College
          </label>
          <select
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="text-gray-600 dark:text-gray-400" /> Add Custom Module
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Module Name"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={newModuleDescription}
              onChange={(e) => setNewModuleDescription(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCollege.name} - Module Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Enable or disable content modules for this college
                </p>
              </div>

              <div className="p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {modules.map((mod, i) => {
                  const isCustom = 'isCustom' in mod;
                  const isEditing = editingModule === mod.key;

                  return (
                    <motion.div
                      key={mod.key}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg 
                                 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <mod.icon className="text-gray-700 dark:text-gray-300" size={24} />
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editFormData.label}
                                onChange={(e) => setEditFormData({...editFormData, label: e.target.value})}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded
                                         bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                                placeholder="Module name"
                              />
                              <input
                                type="text"
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded
                                         bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                                placeholder="Description"
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {mod.label}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {mod.description}
                              </p>
                              {isCustom && (
                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mt-1">
                                  Custom
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCustom && (
                          <>
                            {isEditing ? (
                              <>
                                <button
                                  onClick={saveEditedModule}
                                  className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
                                  title="Save"
                                >
                                  <Save size={16} />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(mod)}
                                  className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => setModuleToDelete({ key: mod.key, label: mod.label })}
                                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </>
                        )}
                        
                        <ToggleSwitch
                          enabled={selectedCollege.modules?.[mod.key] ?? false}
                          onChange={() => handleToggle(mod.key)}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm text-center border border-gray-200 dark:border-gray-700"
          >
            <Building2 size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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