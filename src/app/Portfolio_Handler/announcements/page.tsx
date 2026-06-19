// app/announcements/page.tsx
'use client';
/* eslint-disable */

import { MainLayout } from '../components/layout/main-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Building2,
  MessageSquare,
  Calendar,
  Globe,
  Search,
  Sparkles
} from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  message: string;
  college_id: number | null;
  college_name: string | null;
  created_at: string;
  updated_at: string;
}

interface College {
  id: number;
  name: string;
  status: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface AnnouncementFormData {
  title: string;
  message: string;
  college_id: number | null;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState<boolean>(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    message: '',
    college_id: null
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  // Fetch colleges
  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges');
      if (!response.ok) throw new Error('Failed to fetch colleges');
      const data = await response.json();
      setColleges(data.data || data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      addToast('Failed to load colleges', 'error');
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const url = selectedCollege === 'all' 
        ? '/api/main_admin/announcements'
        : `/api/main_admin/announcements?college_id=${selectedCollege}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch announcements');
      const data = await response.json();
      setAnnouncements(data.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      addToast('Failed to load announcements', 'error');
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  // Toast system
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = editingAnnouncement 
        ? `/api/main_admin/announcements/${editingAnnouncement.id}`
        : '/api/main_admin/announcements';
      
      const method = editingAnnouncement ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save announcement');
      }

      await fetchAnnouncements();
      
      setFormData({ title: '', message: '', college_id: null });
      setShowAnnouncementForm(false);
      setEditingAnnouncement(null);
      
      addToast(
        editingAnnouncement 
          ? 'Announcement updated successfully' 
          : 'Announcement created successfully',
        'success'
      );
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      addToast(error.message || 'Failed to save announcement', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!announcementToDelete) return;
    
    try {
      const response = await fetch(`/api/main_admin/announcements/${announcementToDelete.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete announcement');
      }

      await fetchAnnouncements();
      
      setAnnouncementToDelete(null);
      addToast('Announcement deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      addToast(error.message || 'Failed to delete announcement', 'error');
    }
  };

  // Handle edit
  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      college_id: announcement.college_id
    });
    setShowAnnouncementForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ title: '', message: '', college_id: null });
    setEditingAnnouncement(null);
    setShowAnnouncementForm(false);
  };

  // Filter announcements based on search
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = searchQuery === '' || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (announcement.college_name || 'All Colleges').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Effects
  useEffect(() => {
    fetchColleges();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedCollege]);

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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {announcementToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setAnnouncementToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${cardBg} rounded-2xl shadow-xl w-full max-w-md border ${borderColor}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-500/10 rounded-full border border-red-500/30">
                    <AlertTriangle className="text-red-400" size={24} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${textColor}`}>
                      Delete Announcement
                    </h3>
                    <p className={`text-sm ${textSecondary}`}>
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                
                <p className={`${textSecondary} mb-6`}>
                  Are you sure you want to delete the announcement <strong className={textColor}>"{announcementToDelete.title}"</strong>?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setAnnouncementToDelete(null)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${textSecondary} hover:text-white 
                             border ${borderColor} hover:bg-[#1E293B] transition-all duration-200`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl 
                             hover:bg-red-500/20 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Form Modal - Fixed with reduced height and gaps */}
      <AnimatePresence>
        {showAnnouncementForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`${cardBg} rounded-2xl shadow-xl w-full max-w-lg border ${borderColor}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed position, not sticky */}
              <div className={`px-6 py-4 border-b ${borderColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${textColor} flex items-center gap-2`}>
                      <Sparkles className="text-[#FFD700]" size={18} />
                      {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                    </h3>
                  </div>
                  <button
                    onClick={resetForm}
                    className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <X size={18} className={textSecondary} />
                  </button>
                </div>
              </div>

              {/* Form with reduced spacing */}
              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-1`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-3 py-2 text-sm border ${borderColor} rounded-lg 
                             ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-gray-50 text-gray-900'}
                             focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-300`}
                    placeholder="Enter announcement title"
                    maxLength={255}
                    required
                  />
                  <p className={`text-xs ${textSecondary} mt-0.5`}>
                    {formData.title.length}/255 characters
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-1`}>
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className={`w-full px-3 py-2 text-sm border ${borderColor} rounded-lg 
                             ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-gray-50 text-gray-900'}
                             focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-300 resize-none`}
                    placeholder="Enter announcement message"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${textSecondary} mb-1`}>
                    Target College
                  </label>
                  <select
                    value={formData.college_id || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      college_id: e.target.value ? parseInt(e.target.value) : null
                    })}
                    className={`w-full px-3 py-2 text-sm border ${borderColor} rounded-lg 
                             ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-gray-50 text-gray-900'}
                             focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-300`}
                  >
                    <option value="">All Colleges (Global Announcement)</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                  <p className={`text-xs ${textSecondary} mt-0.5`}>
                    Select specific college or leave empty for global announcement
                  </p>
                </div>

                <div className={`flex justify-end gap-3 pt-3 border-t ${borderColor}`}>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium ${textSecondary} 
                             border ${borderColor} hover:bg-[#1E293B] hover:text-white transition-all duration-200`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-1.5 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black font-semibold rounded-lg 
                             text-sm shadow-md shadow-[#FFD700]/30 hover:shadow-lg hover:shadow-[#FFD700]/40 hover:scale-105
                             transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>{editingAnnouncement ? 'Update' : 'Create'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`min-h-screen ${bgColor} p-6 space-y-6 transition-colors duration-300`}
      >
        {/* Header - White heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-2xl lg:text-2xl font-bold text-white">
              Announcements
            </h1>
            <p className={`${textSecondary} mt-2 text-sm`}>
              Create and manage announcements for colleges
            </p>
          </div>
          <div className="flex space-x-3">
            {/* Refresh Button - Navy Blue */}
            <button
              onClick={fetchAnnouncements}
              className="px-4 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-white font-medium rounded-xl 
                       transition-all duration-300 flex items-center space-x-2"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
            
            {/* New Announcement Button - Golden */}
            <button
              onClick={() => setShowAnnouncementForm(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black font-semibold rounded-xl 
                       shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/40 hover:scale-105
                       transition-all duration-300 flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>New Announcement</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Search Announcements
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, message, or college..."
                  className={`w-full pl-10 pr-4 py-3 border ${borderColor} rounded-xl 
                           ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-gray-50 text-gray-900'}
                           focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-300`}
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Filter by College
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className={`w-full px-4 py-3 border ${borderColor} rounded-xl 
                         ${isDarkMode ? 'bg-[#0B0F19] text-white' : 'bg-gray-50 text-gray-900'}
                         focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-300`}
              >
                <option value="all">All Announcements</option>
                <option value="global">Global Announcements Only</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name} Only
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <div className={`${isDarkMode ? 'bg-[#0B0F19]' : 'bg-gray-100'} p-4 rounded-xl w-full border ${borderColor}`}>
                <p className={`text-xs font-medium ${textSecondary}`}>Showing</p>
                <p className={`text-xl font-bold ${textColor}`}>
                  {filteredAnnouncements.length} announcement(s)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
          <div className={`${isDarkMode ? 'bg-[#0B0F19]' : 'bg-gray-50'} px-6 py-4 border-b ${borderColor}`}>
            <h2 className={`text-xl font-semibold ${textColor}`}>
              Announcements List
            </h2>
            <p className={`${textSecondary} text-sm`}>
              {selectedCollege === 'all' 
                ? 'All announcements (global and college-specific)' 
                : selectedCollege === 'global'
                ? 'Global announcements only'
                : `Announcements for selected college only`}
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-3 border-[#1E293B] border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
              <p className={textSecondary}>Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className={`text-lg font-semibold ${textColor} mb-2`}>
                No Announcements Found
              </h3>
              <p className={`${textSecondary} max-w-md mx-auto mb-6`}>
                {searchQuery || selectedCollege !== 'all'
                  ? 'No announcements match your filters. Try adjusting your search criteria.'
                  : 'No announcements have been created yet. Click "New Announcement" to create your first one.'}
              </p>
              {!searchQuery && selectedCollege === 'all' && (
                <button
                  onClick={() => setShowAnnouncementForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black font-semibold rounded-xl 
                           shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/40 hover:scale-105
                           transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <Plus size={18} />
                  <span>Create First Announcement</span>
                </button>
              )}
            </div>
          ) : (
            <div className={`divide-y ${borderColor}`}>
              {filteredAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 ${isDarkMode ? 'hover:bg-[#1E293B]/50' : 'hover:bg-gray-50'} transition-colors duration-200`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/30">
                          <MessageSquare size={18} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className={`text-lg font-semibold ${textColor}`}>
                              {announcement.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                              announcement.college_id 
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                : 'bg-green-500/10 text-green-400 border border-green-500/30'
                            }`}>
                              {announcement.college_id 
                                ? announcement.college_name || 'Specific College'
                                : 'Global'}
                            </span>
                          </div>
                          
                          <p className={`${textSecondary} mt-2 whitespace-pre-line text-sm`}>
                            {truncateText(announcement.message, 300)}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Calendar size={12} />
                              <span>Created: {formatDate(announcement.created_at)}</span>
                            </div>
                            {announcement.updated_at !== announcement.created_at && (
                              <div className="flex items-center space-x-2">
                                <span>•</span>
                                <span>Updated: {formatDate(announcement.updated_at)}</span>
                              </div>
                            )}
                            {announcement.college_id ? (
                              <div className="flex items-center space-x-2">
                                <span>•</span>
                                <Building2 size={12} />
                                <span>{announcement.college_name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span>•</span>
                                <Globe size={12} />
                                <span>All Colleges</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit announcement"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setAnnouncementToDelete(announcement)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete announcement"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
}