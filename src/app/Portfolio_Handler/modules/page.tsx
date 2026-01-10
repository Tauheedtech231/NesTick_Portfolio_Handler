// app/modules/page.tsx
'use client';

import { MainLayout } from '../components/layout/main-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { Plus, X, AlertTriangle, CheckCircle, Building2, RefreshCw, Key, Save } from 'lucide-react';
/* eslint-disable */

// Types
interface College {
  id: number;
  name: string;
  status: string;
  template_id?: number;
}

interface Section {
  id: number;
  college_id: number;
  template_id: number;
  section_name: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface NewSectionFormData {
  section_name: string;
  is_active: number;
}

export default function ModulesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingSection, setUpdatingSection] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showAddSectionForm, setShowAddSectionForm] = useState<boolean>(false);
  const [newSectionForm, setNewSectionForm] = useState<NewSectionFormData>({
    section_name: '',
    is_active: 1
  });
  const [isAddingSection, setIsAddingSection] = useState<boolean>(false);

  // Fetch colleges from API
  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges');
      if (!response.ok) {
        throw new Error('Failed to fetch colleges');
      }
      const data = await response.json();
      setColleges(data.data || data);
      
      // Select first college by default if available
      if (data.data?.length > 0 && !selectedCollegeId) {
        setSelectedCollegeId(data.data[0].id.toString());
        setSelectedCollege(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
      addToast('Failed to load colleges', 'error');
    }
  };

  // Fetch sections for selected college using its template_id
  const fetchSections = async (college: College | null) => {
    if (!college || !college.id) {
      setSections([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Use the college's template_id from the backend
      const templateId = college.template_id;
      
      if (!templateId) {
        throw new Error('College does not have a template assigned');
      }
      
      const response = await fetch(`/api/colleges/${college.id}/sections?template_id=${templateId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }
      const result = await response.json();
      
      // Check if result.data is an array, otherwise use result
      const sectionsData = Array.isArray(result.data) ? result.data : 
                          Array.isArray(result) ? result : [];
      
      setSections(sectionsData);
    } catch (error: any) {
      console.error('Error fetching sections:', error);
      // Don't show error if there are no sections - this is normal
      if (error.message !== 'No sections found for this college and template') {
        addToast(error.message || 'Failed to load sections', 'error');
      }
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh sections for current college
  const refreshSections = () => {
    if (selectedCollege) {
      fetchSections(selectedCollege);
      addToast('Sections refreshed', 'success');
    }
  };

  // Toggle section activation (enable/disable)
  const toggleSection = async (sectionId: number, currentActive: number) => {
    if (updatingSection === sectionId) return;
    
    setUpdatingSection(sectionId);
    const newActiveStatus = currentActive === 1 ? 0 : 1;
    
    try {
      const response = await fetch(`/api/main_admin/modules_sections/${sectionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: newActiveStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update section');
      }

      const result = await response.json();

      // Update local state immediately
      setSections(prev => 
        prev.map(section => 
          section.id === sectionId 
            ? { 
                ...section, 
                is_active: newActiveStatus, 
                updated_at: result.data?.updated_at || new Date().toISOString() 
              }
            : section
        )
      );

      addToast(
        `"${result.data?.section_name || 'Section'} ${newActiveStatus === 1 ? 'enabled' : 'disabled'} successfully"`,
        'success'
      );
    } catch (error: any) {
      console.error('Error updating section:', error);
      addToast(error.message || 'Failed to update section', 'error');
    } finally {
      setUpdatingSection(null);
    }
  };

  // Add new section
  const addNewSection = async () => {
    if (!selectedCollege || !selectedCollege.template_id) {
      addToast('Please select a college with assigned template', 'error');
      return;
    }

    if (!newSectionForm.section_name.trim()) {
      addToast('Please enter section name', 'error');
      return;
    }

    setIsAddingSection(true);
    
    try {
      const response = await fetch('/api/main_admin/modules_sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          college_id: selectedCollege.id,
          template_id: selectedCollege.template_id,
          section_name: newSectionForm.section_name,
          is_active: newSectionForm.is_active
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to add section');
      }

      // Add new section to list
      if (result.data) {
        setSections(prev => [result.data, ...prev]);
      }

      // Reset form
      setNewSectionForm({
        section_name: '',
        is_active: 1
      });
      setShowAddSectionForm(false);

      addToast('Section added successfully', 'success');
    } catch (error: any) {
      console.error('Error adding section:', error);
      addToast(error.message || 'Failed to add section', 'error');
    } finally {
      setIsAddingSection(false);
    }
  };

  // Count active and inactive sections
  const activeCount = sections.filter(s => s.is_active === 1).length;
  const inactiveCount = sections.filter(s => s.is_active === 0).length;

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

  // Handle college selection
  const handleCollegeSelect = (collegeId: string) => {
    setSelectedCollegeId(collegeId);
    const college = colleges.find(c => c.id.toString() === collegeId);
    setSelectedCollege(college || null);
    setShowAddSectionForm(false);
    if (college) {
      fetchSections(college);
    }
  };

  // Effects
  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    if (selectedCollegeId) {
      const college = colleges.find(c => c.id.toString() === selectedCollegeId);
      if (college) {
        fetchSections(college);
      }
    }
  }, [selectedCollegeId, colleges]);

  // Common sections that can be added
  const commonSections = [
    'About Us',
    'Faculty',
    'Events',
    'Gallery',
    'Achievements',
    'Contact',
    'Courses',
    'Admissions',
    'Departments',
    'Research',
    'Library',
    'Placements',
    'Alumni',
    'News'
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

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-white dark:bg-gray-900 p-6 space-y-6 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              College Template Sections
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage content sections for college portfolio templates
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshSections}
              disabled={!selectedCollege}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg 
                         transition-all duration-300 transform hover:scale-105 dark:bg-gray-100 dark:text-gray-900 
                         dark:hover:bg-gray-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAddSectionForm(true)}
              disabled={!selectedCollege || !selectedCollege.template_id}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg 
                         transition-all duration-300 transform hover:scale-105 dark:bg-white dark:text-black 
                         dark:hover:bg-gray-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              <span>Add Section</span>
            </button>
          </div>
        </div>

        {/* College selector */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select College
          </label>
          <select
            value={selectedCollegeId}
            onChange={(e) => handleCollegeSelect(e.target.value)}
            className="w-full md:w-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300 focus:border-transparent 
                       transition-all duration-300 appearance-none cursor-pointer"
            disabled={colleges.length === 0}
          >
            <option value="">{colleges.length === 0 ? 'Loading colleges...' : 'Select a college'}</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name} {college.template_id ? `(Template #${college.template_id})` : ''}
              </option>
            ))}
          </select>
          {selectedCollege && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">College Name</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedCollege.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                  <p className={`text-base font-semibold ${
                    selectedCollege.status === 'active' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedCollege.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Template ID</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {selectedCollege.template_id ? `#${selectedCollege.template_id}` : 'Not Assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">College ID</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">#{selectedCollege.id}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add New Section Form */}
        {showAddSectionForm && selectedCollege && selectedCollege.template_id && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="text-gray-600 dark:text-gray-400" /> Add New Section
              </h3>
              <button
                onClick={() => setShowAddSectionForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Name *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newSectionForm.section_name}
                  onChange={(e) => setNewSectionForm({...newSectionForm, section_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300"
                  placeholder="Enter section name (e.g., About Us)"
                />
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <ToggleSwitch
                      enabled={newSectionForm.is_active === 1}
                      onChange={() => setNewSectionForm({
                        ...newSectionForm, 
                        is_active: newSectionForm.is_active === 1 ? 0 : 1
                      })}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {newSectionForm.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Common sections suggestions */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Common Sections:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSections.map((section) => (
                    <button
                      key={section}
                      type="button"
                      onClick={() => setNewSectionForm({...newSectionForm, section_name: section})}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 
                                 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 
                                 dark:hover:bg-gray-700 transition-colors"
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Key size={16} className="text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Section will be added to:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 dark:text-blue-400">College:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedCollege.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 dark:text-blue-400">Template ID:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedCollege.template_id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 dark:text-blue-400">College ID:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedCollege.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddSectionForm(false)}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addNewSection}
                disabled={isAddingSection || !newSectionForm.section_name.trim()}
                className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg 
                           transition-all duration-300 transform hover:scale-105 dark:bg-white dark:text-black 
                           dark:hover:bg-gray-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingSection ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Add Section</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Sections list */}
        {selectedCollege ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {!selectedCollege.template_id ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-600 dark:text-yellow-500 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      No Template Assigned
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      This college does not have a template assigned. Please assign a template in the college settings 
                      to manage sections.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedCollege.name} - Template Sections
                      </h2>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Template #{selectedCollege.template_id} • 
                          <span className="font-medium text-gray-900 dark:text-white ml-1">
                            {sections.length} section(s) ({activeCount} active, {inactiveCount} inactive)
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Toggle to enable/disable sections
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-300"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Loading sections...</p>
                  </div>
                ) : sections.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 size={40} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Sections Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                      This college doesn't have any sections configured for Template #{selectedCollege.template_id}. 
                      Click "Add Section" to create new sections.
                    </p>
                    <button
                      onClick={() => setShowAddSectionForm(true)}
                      className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg 
                                 transition-all duration-300 transform hover:scale-105 dark:bg-white dark:text-black 
                                 dark:hover:bg-gray-200 flex items-center space-x-2 mx-auto"
                    >
                      <Plus size={18} />
                      <span>Add First Section</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-6 transition-colors duration-200 ${
                          section.is_active === 1 
                            ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50' 
                            : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/40'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${
                              section.is_active === 1 
                                ? 'bg-green-500' 
                                : 'bg-gray-400'
                            }`} />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {section.section_name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              section.is_active === 1
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                            }`}>
                              {section.is_active === 1 ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                              ID: {section.id}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm ml-6">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 dark:text-gray-400">Created:</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {new Date(section.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {new Date(section.updated_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 dark:text-gray-400">Template:</span>
                              <span className="text-gray-700 dark:text-gray-300">#{section.template_id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                              Status
                            </span>
                            <span className={`text-sm ${
                              section.is_active === 1
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {section.is_active === 1 ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          
                          <div className="relative">
                            <ToggleSwitch
                              enabled={section.is_active === 1}
                              onChange={() => toggleSection(section.id, section.is_active)}
                              disabled={updatingSection === section.id}
                            />
                            {updatingSection === section.id && (
                              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 dark:border-t-gray-300 rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
              Please select a college to manage its template sections.
            </p>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
}