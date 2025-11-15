'use client';

import { MainLayout } from '../components/layout/main-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Announcement, College } from '@/app/types';
import { Plus, Edit2, Trash2, Calendar, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetCollege: 'all',
  });

  // Character limits
  const TITLE_LIMIT = 100;
  const MESSAGE_LIMIT = 500;

  useEffect(() => {
    loadData();
  }, []);

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

  const loadData = () => {
    const storedAnnouncements = localStorage.getItem('announcements');
    console.log("the announcement", storedAnnouncements);
    const storedColleges = localStorage.getItem('colleges');

    if (storedAnnouncements) {
      setAnnouncements(JSON.parse(storedAnnouncements));
    }
    if (storedColleges) {
      setColleges(JSON.parse(storedColleges));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check character limits
    if (formData.title.length > TITLE_LIMIT) {
      addToast(`Title cannot exceed ${TITLE_LIMIT} characters`, 'error');
      return;
    }

    if (formData.message.length > MESSAGE_LIMIT) {
      addToast(`Message cannot exceed ${MESSAGE_LIMIT} characters`, 'error');
      return;
    }

    const announcementData: Announcement = {
      id: editingAnnouncement ? editingAnnouncement.id : Date.now().toString(),
      title: formData.title,
      message: formData.message,
      targetCollege: formData.targetCollege,
      createdAt: editingAnnouncement ? editingAnnouncement.createdAt : new Date(),
    };

    let updatedAnnouncements;
    if (editingAnnouncement) {
      updatedAnnouncements = announcements.map((ann) =>
        ann.id === editingAnnouncement.id ? announcementData : ann
      );
      addToast('Announcement updated successfully!', 'success');
    } else {
      updatedAnnouncements = [...announcements, announcementData];
      addToast('Announcement created successfully!', 'success');
    }

    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    resetForm();
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      targetCollege: announcement.targetCollege,
    });
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (!deletingAnnouncement) return;

    const updatedAnnouncements = announcements.filter((ann) => ann.id !== deletingAnnouncement.id);
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    
    addToast('Announcement deleted successfully!', 'success');
    setDeletingAnnouncement(null);
  };

  const resetForm = () => {
    setFormData({ title: '', message: '', targetCollege: 'all' });
    setEditingAnnouncement(null);
    setIsFormOpen(false);
  };

  const getTargetCollegeName = (targetCollege: string) => {
    if (targetCollege === 'all') return 'All Colleges';
    const college = colleges.find((c) => c.id === targetCollege);
    return college ? college.name : 'Unknown College';
  };

  // Character count helpers
  const getTitleCountColor = () => {
    const count = formData.title.length;
    if (count > TITLE_LIMIT) return 'text-red-600';
    if (count > TITLE_LIMIT * 0.8) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const getMessageCountColor = () => {
    const count = formData.message.length;
    if (count > MESSAGE_LIMIT) return 'text-red-600';
    if (count > MESSAGE_LIMIT * 0.8) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-white dark:bg-gray-900 p-6 space-y-6 transition-colors duration-300"
      >
        {/* Header (Responsive) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Announcements
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage college-wide updates and notifications
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 rounded-lg font-semibold 
                       bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900
                       hover:opacity-90 active:scale-95 
                       shadow-md transition-all duration-300 
                       flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus size={18} />
            <span>New Announcement</span>
          </motion.button>
        </div>

        {/* Announcement Form Modal */}
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Title
                    </label>
                    <span className={`text-sm ${getTitleCountColor()}`}>
                      {formData.title.length} / {TITLE_LIMIT}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={TITLE_LIMIT}
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                               rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter announcement title"
                  />
                  {formData.title.length > TITLE_LIMIT && (
                    <p className="text-red-600 text-sm mt-1">
                      Title exceeds character limit!
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Message
                    </label>
                    <span className={`text-sm ${getMessageCountColor()}`}>
                      {formData.message.length} / {MESSAGE_LIMIT}
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    maxLength={MESSAGE_LIMIT}
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                               rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter announcement message"
                  />
                  {formData.message.length > MESSAGE_LIMIT && (
                    <p className="text-red-600 text-sm mt-1">
                      Message exceeds character limit!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                    Target College
                  </label>
                  <select
                    value={formData.targetCollege}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, targetCollege: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                               rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="all">All Colleges</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formData.title.length > TITLE_LIMIT || formData.message.length > MESSAGE_LIMIT}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 
                               dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 
                               shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingAnnouncement ? 'Update' : 'Create'} Announcement
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deletingAnnouncement && (
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
                  
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Are you sure you want to delete this announcement?
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="font-semibold text-red-800 dark:text-red-300">
                        {deletingAnnouncement.title}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1 line-clamp-2">
                        {deletingAnnouncement.message}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Target: {getTargetCollegeName(deletingAnnouncement.targetCollege)}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setDeletingAnnouncement(null)}
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
                      <span>Delete Announcement</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Announcements List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Announcements ({announcements.length})
            </h2>
          </div>

          {sortedAnnouncements.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No announcements yet. Create your first announcement!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {announcement.title}
                        {announcement.title.length > TITLE_LIMIT && (
                          <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                            Too Long
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {announcement.message}
                        {announcement.message.length > MESSAGE_LIMIT && (
                          <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                            Too Long
                          </span>
                        )}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                          {getTargetCollegeName(announcement.targetCollege)}
                        </span>
                        <span>
                          {new Date(announcement.createdAt).toLocaleDateString()} at{' '}
                          {new Date(announcement.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3 sm:mt-0 sm:ml-4">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                        title="Edit announcement"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingAnnouncement(announcement)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
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