'use client';

import { MainLayout } from '../components/layout/main-layout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Announcement, College } from '@/app/types';
import { Plus, Edit2, Trash2, Calendar, X } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetCollege: 'all',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedAnnouncements = localStorage.getItem('announcements');
    console.log("the announcement",storedAnnouncements)
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
    } else {
      updatedAnnouncements = [...announcements, announcementData];
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      const updatedAnnouncements = announcements.filter((ann) => ann.id !== id);
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    }
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

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 transition-colors duration-300"
      >
        {/* Header (Responsive) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
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
             bg-gray-900 text-white dark:bg-gray-100 dark:text-black
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
  className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300"
>
  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
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
      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
        Title
      </label>
      <input
        type="text"
        required
        value={formData.title}
        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                   rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
        placeholder="Enter announcement title"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
        Message
      </label>
      <textarea
        required
        rows={4}
        value={formData.message}
        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                   rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
        placeholder="Enter announcement message"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
        Target College
      </label>
      <select
        value={formData.targetCollege}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, targetCollege: e.target.value }))
        }
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                   rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
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
        className="px-4 py-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 shadow-md transition-all duration-300"
      >
        {editingAnnouncement ? 'Update' : 'Create'} Announcement
      </button>
    </div>
  </form>
</motion.div>

          </motion.div>
        )}

        {/* Announcements List */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300">
  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
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
          className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
        >
          <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {announcement.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {announcement.message}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
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
                className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white p-2 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(announcement.id)}
                className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white p-2 transition-colors"
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
