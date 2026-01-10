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
  Search
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

      // Refresh announcements
      await fetchAnnouncements();
      
      // Reset form
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

      // Refresh announcements
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
        {announcementToDelete && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                    <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete Announcement
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the announcement <strong>"{announcementToDelete.title}"</strong>?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setAnnouncementToDelete(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                             border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                             transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                             transition-colors duration-200 flex items-center space-x-2"
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

      {/* Announcement Form Modal */}
      <AnimatePresence>
        {showAnnouncementForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 my-8"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300"
                      placeholder="Enter announcement title"
                      maxLength={255}
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.title.length}/255 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300"
                      placeholder="Enter announcement message"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target College
                    </label>
                    <select
                      value={formData.college_id || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        college_id: e.target.value ? parseInt(e.target.value) : null
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300"
                    >
                      <option value="">All Colleges (Global Announcement)</option>
                      {colleges.map((college) => (
                        <option key={college.id} value={college.id}>
                          {college.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Select specific college or leave empty for global announcement
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                               rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg 
                               transition-all duration-300 transform hover:scale-105 dark:bg-white dark:text-black 
                               dark:hover:bg-gray-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>{editingAnnouncement ? 'Update' : 'Create'} Announcement</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
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
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Announcements
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage announcements for colleges
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchAnnouncements}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg 
                       transition-all duration-300 transform hover:scale-105 dark:bg-gray-100 dark:text-gray-900 
                       dark:hover:bg-gray-300 flex items-center space-x-2"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAnnouncementForm(true)}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg 
                       transition-all duration-300 transform hover:scale-105 dark:bg-white dark:text-black 
                       dark:hover:bg-gray-200 flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>New Announcement</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Announcements
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, message, or college..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by College
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300"
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
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg w-full">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Showing</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {filteredAnnouncements.length} announcement(s)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Announcements List
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {selectedCollege === 'all' 
                ? 'All announcements (global and college-specific)' 
                : selectedCollege === 'global'
                ? 'Global announcements only'
                : `Announcements for selected college only`}
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-300"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Announcements Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery || selectedCollege !== 'all'
                  ? 'No announcements match your filters. Try adjusting your search criteria.'
                  : 'No announcements have been created yet. Click "New Announcement" to create your first one.'}
              </p>
              {!searchQuery && selectedCollege === 'all' && (
                <button
                  onClick={() => setShowAnnouncementForm(true)}
                  className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg 
                           transition-all duration-300 transform hover:scale-105 dark:bg-white dark:text-black 
                           dark:hover:bg-gray-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus size={18} />
                  <span>Create First Announcement</span>
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {announcement.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                announcement.college_id 
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {announcement.college_id 
                                  ? announcement.college_name || 'Specific College'
                                  : 'Global'}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
                            {truncateText(announcement.message, 300)}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                              <Calendar size={14} />
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
                                <Building2 size={14} />
                                <span>{announcement.college_name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span>•</span>
                                <Globe size={14} />
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
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 
                                 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit announcement"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setAnnouncementToDelete(announcement)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 
                                 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete announcement"
                      >
                        <Trash2 size={18} />
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