'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

// 🧩 Type Definitions
type StatusType = 'active' | 'inactive';
type ThemeType = 'modern' | 'minimal' | 'classic' | 'elegant' | 'bold';

interface AddCollegeFormData {
  name: string;
  representativeName: string;
  logo: string;
  status: StatusType;
  theme: ThemeType;
  modules: {
    about: boolean;
    faculty: boolean;
    events: boolean;
    gallery: boolean;
    achievements: boolean;
  };
}

interface AddCollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collegeData: Omit<AddCollegeFormData, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddCollegeModal({ isOpen, onClose, onSave }: AddCollegeModalProps) {
  // 🧠 Strongly Typed useState
  const [formData, setFormData] = useState<AddCollegeFormData>({
    name: '',
    representativeName: '',
    logo: '',
    status: 'active',
    theme: 'modern',
    modules: {
      about: true,
      faculty: true,
      events: true,
      gallery: true,
      achievements: true,
      
    },
  });

  // 🖼️ Logo Upload Handler
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

  // 💾 Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      name: '',
      representativeName: '',
      logo: '',
      status: 'active',
      theme: 'modern',
      modules: {
        about: true,
        faculty: true,
        events: true,
        gallery: true,
        achievements: true,
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md 
                       rounded-2xl shadow-xl w-full max-w-2xl 
                       border border-gray-200 dark:border-gray-700 
                       transition-colors duration-500"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Add New College
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                               bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100
                               placeholder-gray-400 dark:placeholder-gray-500
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                               transition-colors"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                               bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                               transition-colors"
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
                        status: e.target.value as StatusType,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                               bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                               transition-colors"
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
                      setFormData((prev) => ({
                        ...prev,
                        theme: e.target.value as ThemeType,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                               bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                               transition-colors"
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
                <div className="flex items-center space-x-4">
                  {formData.logo && (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
                      <Image src={formData.logo} alt="College logo" fill className="object-cover" />
                    </div>
                  )}
                  <label
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 
                               rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800 
                               hover:bg-gray-200 dark:hover:bg-gray-700 
                               text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Upload size={20} />
                    <span>Upload Logo</span>
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
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 
                             hover:text-gray-900 dark:hover:text-white 
                             transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                             hover:from-indigo-700 hover:to-purple-700 
                             text-white rounded-lg shadow-md transition-all duration-300"
                >
                  Save College
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
