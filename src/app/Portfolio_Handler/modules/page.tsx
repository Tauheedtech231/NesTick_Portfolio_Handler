// app/modules/page.tsx
'use client';

import { MainLayout } from '../components/layout/main-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { Plus, X, AlertTriangle, CheckCircle, Building2, RefreshCw, Key, Save, Sparkles } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme detection
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDarkNow);
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch colleges from API
  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges');
      if (!response.ok) {
        throw new Error('Failed to fetch colleges');
      }
      const data = await response.json();
      setColleges(data.data || data);
      
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
      const templateId = college.template_id;
      
      if (!templateId) {
        throw new Error('College does not have a template assigned');
      }
      
      const response = await fetch(`/api/colleges/${college.id}/sections?template_id=${templateId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }
      const result = await response.json();
      
      const sectionsData = Array.isArray(result.data) ? result.data : 
                          Array.isArray(result) ? result : [];
      
      setSections(sectionsData);
    } catch (error: any) {
      console.error('Error fetching sections:', error);
      if (error.message !== 'No sections found for this college and template') {
        addToast(error.message || 'Failed to load sections', 'error');
      }
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshSections = () => {
    if (selectedCollege) {
      fetchSections(selectedCollege);
      addToast('Sections refreshed', 'success');
    }
  };

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

      if (result.data) {
        setSections(prev => [result.data, ...prev]);
      }

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

  const activeCount = sections.filter(s => s.is_active === 1).length;
  const inactiveCount = sections.filter(s => s.is_active === 0).length;

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

  const handleCollegeSelect = (collegeId: string) => {
    setSelectedCollegeId(collegeId);
    const college = colleges.find(c => c.id.toString() === collegeId);
    setSelectedCollege(college || null);
    setShowAddSectionForm(false);
    if (college) {
      fetchSections(college);
    }
  };

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

  const bgColor = isDarkMode ? 'bg-[#0B0F19]' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-[#0F172A]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#1E293B]' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';

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
            className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
              toast.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
            ) : (
              <X size={18} className="text-red-600 dark:text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              toast.type === 'success' 
                ? 'text-green-800 dark:text-green-300' 
                : 'text-red-800 dark:text-red-300'
            }`}>
              {toast.message}
            </span>
            <button onClick={() => removeToast(toast.id)}>
              <X size={14} className="text-gray-500 hover:text-gray-700 dark:text-gray-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`min-h-screen ${bgColor} p-6 space-y-6 transition-colors duration-300`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white ">
              College Template Sections
            </h1>
            <p className={`${textSecondary} mt-2 text-sm`}>
              Manage content sections for college portfolio templates
            </p>
          </div>
          <div className="flex space-x-3">
            {/* Refresh Button - Navy Blue */}
            <button
              onClick={refreshSections}
              disabled={!selectedCollege}
              className="px-4 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-white font-medium rounded-xl 
                         transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
            
            {/* Add Section Button - Golden */}
            <button
              onClick={() => setShowAddSectionForm(true)}
              disabled={!selectedCollege || !selectedCollege.template_id}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black font-semibold rounded-xl 
                         shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/40 hover:scale-105
                         transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              <span>Add Section</span>
            </button>
          </div>
        </div>

        {/* College selector */}
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
          <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
            Select College
          </label>
          <select
            value={selectedCollegeId}
            onChange={(e) => handleCollegeSelect(e.target.value)}
            className={`w-full md:w-96 px-4 py-3 border ${borderColor} rounded-xl
                       ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-gray-50 text-gray-900'}
                       focus:ring-2 focus:ring-[#FFD700] focus:border-transparent 
                       transition-all duration-300 appearance-none cursor-pointer`}
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
            <div className={`mt-4 p-4 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-gray-50'} rounded-xl`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>College Name</p>
                  <p className={`text-sm font-semibold ${textColor}`}>{selectedCollege.name}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>Status</p>
                  <p className={`text-sm font-semibold ${
                    selectedCollege.status === 'active' 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {selectedCollege.status}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>Template ID</p>
                  <p className={`text-sm font-semibold ${textColor}`}>
                    {selectedCollege.template_id ? `#${selectedCollege.template_id}` : 'Not Assigned'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${textSecondary}`}>College ID</p>
                  <p className={`text-sm font-semibold ${textColor}`}>#{selectedCollege.id}</p>
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
            className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${textColor} flex items-center gap-2`}>
                <Sparkles className="text-[#FFD700]" size={20} /> Add New Section
              </h3>
              <button
                onClick={() => setShowAddSectionForm(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={textSecondary} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Section Name *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newSectionForm.section_name}
                  onChange={(e) => setNewSectionForm({...newSectionForm, section_name: e.target.value})}
                  className={`w-full px-4 py-3 border ${borderColor} rounded-xl 
                             ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-gray-50 text-gray-900'}
                             focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-300`}
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
                    <span className={`text-sm font-medium ${textSecondary}`}>
                      {newSectionForm.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="mt-4">
                <p className={`text-sm font-medium ${textSecondary} mb-2`}>Common Sections:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSections.map((section) => (
                    <button
                      key={section}
                      type="button"
                      onClick={() => setNewSectionForm({...newSectionForm, section_name: section})}
                      className={`px-3 py-1.5 text-sm border ${borderColor} 
                                 ${textSecondary} rounded-lg ${isDarkMode ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-100'} transition-colors`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Key size={16} className="text-blue-400" />
                <p className="text-sm font-medium text-blue-400">Section will be added to:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">College:</span>
                  <span className={`font-semibold ${textColor}`}>{selectedCollege.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">Template ID:</span>
                  <span className={`font-semibold ${textColor}`}>{selectedCollege.template_id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">College ID:</span>
                  <span className={`font-semibold ${textColor}`}>{selectedCollege.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddSectionForm(false)}
                className={`px-5 py-2.5 border ${borderColor} ${textSecondary} rounded-xl 
                           ${isDarkMode ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-100'} transition-colors duration-200`}
              >
                Cancel
              </button>
              <button
                onClick={addNewSection}
                disabled={isAddingSection || !newSectionForm.section_name.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black font-semibold rounded-xl 
                           shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/40 hover:scale-105
                           transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingSection ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-500 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                      No Template Assigned
                    </h3>
                    <p className="text-yellow-400">
                      This college does not have a template assigned. Please assign a template in the college settings 
                      to manage sections.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
                <div className={`${isDarkMode ? 'bg-[#0B0F19]' : 'bg-gray-50'} px-6 py-4 border-b ${borderColor}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className={`text-xl font-semibold ${textColor}`}>
                        {selectedCollege.name} - Template Sections
                      </h2>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className={`${textSecondary} text-sm`}>
                          Template #{selectedCollege.template_id} • 
                          <span className={`font-medium ${textColor} ml-1`}>
                            {sections.length} section(s) ({activeCount} active, {inactiveCount} inactive)
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm ${textSecondary}`}>
                      Toggle to enable/disable sections
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center">
                    <div className="w-8 h-8 border-3 border-[#1E293B] border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className={textSecondary}>Loading sections...</p>
                  </div>
                ) : sections.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className={`w-20 h-20 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4 border ${borderColor}`}>
                      <Building2 size={40} className="text-gray-500" />
                    </div>
                    <h3 className={`text-lg font-semibold ${textColor} mb-2`}>
                      No Sections Found
                    </h3>
                    <p className={`${textSecondary} max-w-md mx-auto mb-6`}>
                      This college doesn't have any sections configured for Template #{selectedCollege.template_id}. 
                      Click "Add Section" to create new sections.
                    </p>
                    <button
                      onClick={() => setShowAddSectionForm(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black font-semibold rounded-xl 
                                 shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/40 hover:scale-105
                                 transition-all duration-300 flex items-center space-x-2 mx-auto"
                    >
                      <Plus size={18} />
                      <span>Add First Section</span>
                    </button>
                  </div>
                ) : (
                  <div className={`divide-y ${borderColor}`}>
                    {sections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-6 transition-colors duration-200 ${
                          section.is_active === 1 
                            ? `${cardBg} ${isDarkMode ? 'hover:bg-[#1E293B]/50' : 'hover:bg-gray-100'}` 
                            : `${isDarkMode ? 'bg-[#0B0F19]/50' : 'bg-gray-50'} ${isDarkMode ? 'hover:bg-[#1E293B]/30' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${
                              section.is_active === 1 
                                ? 'bg-green-500' 
                                : 'bg-gray-400'
                            }`} />
                            <h3 className={`text-lg font-medium ${textColor}`}>
                              {section.section_name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                              section.is_active === 1
                                ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                            }`}>
                              {section.is_active === 1 ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-lg ${isDarkMode ? 'bg-[#0B0F19] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                              ID: {section.id}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm ml-6">
                            <div className="flex items-center space-x-2">
                              <span className={textSecondary}>Created:</span>
                              <span className={textColor}>
                                {new Date(section.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={textSecondary}>Updated:</span>
                              <span className={textColor}>
                                {new Date(section.updated_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={textSecondary}>Template:</span>
                              <span className={textColor}>#{section.template_id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className={`block text-xs font-medium ${textSecondary}`}>
                              Status
                            </span>
                            <span className={`text-sm ${
                              section.is_active === 1
                                ? 'text-green-500'
                                : textSecondary
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
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-[#FFD700] rounded-full animate-spin"></div>
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
            className={`${cardBg} p-8 rounded-2xl text-center border ${borderColor}`}
          >
            <Building2 size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className={`text-lg font-semibold ${textColor} mb-2`}>
              No College Selected
            </h3>
            <p className={textSecondary}>
              Please select a college to manage its template sections.
            </p>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
}