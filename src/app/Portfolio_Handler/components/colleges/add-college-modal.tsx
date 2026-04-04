'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Building2, User, ToggleLeft, ToggleRight, Palette, Image as ImageIcon } from 'lucide-react';
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

  const themeOptions = [
    { value: 'modern', label: 'Modern', color: 'from-blue-500 to-cyan-500' },
    { value: 'minimal', label: 'Minimal', color: 'from-gray-500 to-slate-500' },
    { value: 'classic', label: 'Classic', color: 'from-amber-500 to-orange-500' },
    { value: 'elegant', label: 'Elegant', color: 'from-purple-500 to-pink-500' },
    { value: 'bold', label: 'Bold', color: 'from-red-500 to-rose-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#0F172A] rounded-2xl shadow-2xl w-full max-w-2xl 
                       border border-[#1E293B] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Gradient */}
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FFD700]/70 to-transparent" />
              <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                    <Building2 size={20} className="text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Add New College
                    </h2>
                    <p className="text-sm text-gray-500">Fill in the details to register a new college</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E293B] transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* College Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    College Name *
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter college name"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] 
                                 text-white placeholder:text-gray-600 text-sm
                                 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
                                 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Representative Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Representative Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.representativeName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, representativeName: e.target.value }))
                      }
                      placeholder="Enter representative name"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] 
                                 text-white placeholder:text-gray-600 text-sm
                                 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
                                 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Status *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status: prev.status === 'active' ? 'inactive' : 'active',
                        }))
                      }
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] 
                                 text-white text-sm transition-all duration-300 hover:border-[#FFD700]/50"
                    >
                      <span className="flex items-center gap-2">
                        {formData.status === 'active' ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-500">Active</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-red-500">Inactive</span>
                          </>
                        )}
                      </span>
                      {formData.status === 'active' ? (
                        <ToggleRight size={20} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={20} className="text-red-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Theme *
                  </label>
                  <div className="relative">
                    <Palette size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
                    <select
                      value={formData.theme}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          theme: e.target.value as ThemeType,
                        }))
                      }
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] 
                                 text-white text-sm appearance-none cursor-pointer
                                 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
                                 transition-all duration-300"
                    >
                      {themeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${
                      formData.theme === 'modern' ? 'bg-blue-500' :
                      formData.theme === 'minimal' ? 'bg-gray-500' :
                      formData.theme === 'classic' ? 'bg-amber-500' :
                      formData.theme === 'elegant' ? 'bg-purple-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </div>

              {/* Theme Preview */}
              <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
                <p className="text-xs text-gray-500 mb-2">Theme Preview</p>
                <div className={`h-2 rounded-full bg-gradient-to-r ${
                  formData.theme === 'modern' ? 'from-blue-500 to-cyan-500' :
                  formData.theme === 'minimal' ? 'from-gray-500 to-slate-500' :
                  formData.theme === 'classic' ? 'from-amber-500 to-orange-500' :
                  formData.theme === 'elegant' ? 'from-purple-500 to-pink-500' : 'from-red-500 to-rose-500'
                }`} />
                <p className="text-xs text-gray-600 mt-2">
                  {themeOptions.find(o => o.value === formData.theme)?.label} theme will be applied
                </p>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  College Logo
                </label>
                <div className="flex items-center gap-4">
                  {formData.logo && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#FFD700]/30 bg-[#0B0F19]">
                      <Image src={formData.logo} alt="College logo" fill className="object-cover" />
                    </div>
                  )}
                  <label
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1E293B] 
                               bg-[#0B0F19] cursor-pointer text-gray-400 text-sm
                               hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-all duration-300
                               group"
                  >
                    <Upload size={16} className="group-hover:scale-110 transition-transform" />
                    <span>{formData.logo ? 'Change Logo' : 'Upload Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.logo && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, logo: '' }))}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Recommended: Square image, PNG or JPG format
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 
                             hover:text-white hover:bg-[#1E293B] transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 
                             text-black font-semibold text-sm shadow-lg shadow-[#FFD700]/30
                             hover:shadow-xl hover:shadow-[#FFD700]/40 hover:scale-105 
                             transition-all duration-300 flex items-center gap-2"
                >
                  <Building2 size={16} />
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