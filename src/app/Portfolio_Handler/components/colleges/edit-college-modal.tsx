// components/colleges/edit-college-modal.tsx
'use client';
import { College } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { useState } from 'react';

interface EditCollegeModalProps {
  college: College;
  isOpen: boolean;
  onClose: () => void;
  onSave: (collegeData: Partial<College>) => void;
}

export function EditCollegeModal({ college, isOpen, onClose, onSave }: EditCollegeModalProps) {
  const [formData, setFormData] = useState({
    name: college.name,
    representativeName: college.representativeName,
    logo: college.logo,
    status: college.status,
    theme: college.theme,
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl transition-colors duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit College
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* College Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    College Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* Representative Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.representativeName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, representativeName: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as 'active' | 'inactive',
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, theme: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="classic">Classic</option>
                    <option value="elegant">Elegant</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  College Logo
                </label>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
                  {formData.logo && (
                    <img
                      src={formData.logo}
                      alt="College logo"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  )}
                  <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <Upload size={20} className="text-gray-600 dark:text-gray-300" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Upload Logo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0 pt-6 border-t border-gray-200 dark:border-gray-700">
  <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-gray-600 transition"
  >
    Cancel
  </button>
  <button
    type="submit"
    className="px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 transition"
  >
    Save Changes
  </button>
</div>

            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
