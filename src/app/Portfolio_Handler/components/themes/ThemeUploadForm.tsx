'use client';
/* eslint-disable */

import { useState } from 'react';
import { CheckCircle, Upload, X, Image as ImageIcon, Link, FileText, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplateFormData {
  name: string;
  description: string;
  image: File | null;
  liveUrl: string;
  type: 'free' | 'paid';
}

export default function TemplateUploadForm() {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    image: null,
    liveUrl: '',
    type: 'free',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'type' ? value as 'free' | 'paid' : value 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setShowSuccess(false);

    try {
      if (!formData.name || !formData.description || !formData.image) {
        setErrorMessage('Please fill all required fields');
        setIsSubmitting(false);
        return;
      }

      const imageBase64 = await fileToBase64(formData.image);

      const templateData = {
        name: formData.name,
        description: formData.description,
        image: imageBase64,
        live_url: formData.liveUrl || null,
        type: formData.type
      };

      const response = await fetch('/api/templates/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create template');
      }

      setFormData({
        name: '',
        description: '',
        image: null,
        liveUrl: '',
        type: 'free',
      });
      setImagePreview('');
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error: any) {
      console.error('Template upload error:', error);
      setErrorMessage(error.message || '❌ Error uploading template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview('');
  };

  return (
    <div className="bg-[#0F172A] rounded-2xl shadow-xl border border-[#1E293B] overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFD700] via-[#FFD700]/70 to-transparent" />
        <div className="p-4 sm:p-5 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Upload New Template
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Add a new portfolio template to the collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mx-4 sm:mx-5 mt-4 sm:mt-5 flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-2 rounded-xl"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium text-[11px]">Template uploaded successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 sm:mx-5 mt-4 sm:mt-5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[11px]"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Template Name */}
          <div>
            <label className="block text-[10px] font-medium text-gray-400 mb-1">
              Template Name *
            </label>
            <div className="relative">
              <Tag size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter template name"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-600 text-[12px] focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-300 cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Template Type */}
          <div>
            <label className="block text-[10px] font-medium text-gray-400 mb-1">
              Template Type *
            </label>
            <div className="flex gap-4 h-[38px] items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value="free"
                  checked={formData.type === 'free'}
                  onChange={handleInputChange}
                  className="w-3.5 h-3.5 accent-[#FFD700] cursor-pointer"
                />
                <span className={`text-[12px] ${formData.type === 'free' ? 'text-[#FFD700]' : 'text-gray-400'} group-hover:text-white transition-colors`}>
                  Free
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value="paid"
                  checked={formData.type === 'paid'}
                  onChange={handleInputChange}
                  className="w-3.5 h-3.5 accent-[#FFD700] cursor-pointer"
                />
                <span className={`text-[12px] ${formData.type === 'paid' ? 'text-[#FFD700]' : 'text-gray-400'} group-hover:text-white transition-colors`}>
                  Paid
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-medium text-gray-400 mb-1">
            Description *
          </label>
          <div className="relative">
            <FileText size={14} className="absolute left-3 top-2.5 text-gray-500" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe the template features and benefits..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-600 text-[12px] focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-300 resize-none cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-[10px] font-medium text-gray-400 mb-1">
            Preview Image *
          </label>
          <div className={`relative ${imagePreview ? 'border-2 border-[#FFD700]/30 rounded-xl overflow-hidden' : ''}`}>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-[#1E293B] bg-[#0B0F19] cursor-pointer hover:border-[#FFD700]/50 transition-all duration-300 group">
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  <Upload size={20} className="text-gray-500 group-hover:text-[#FFD700] transition-colors mb-1.5" />
                  <p className="text-[11px] text-gray-500 group-hover:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">PNG, JPG, WEBP (Max 5MB)</p>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/90 hover:bg-red-600 text-white transition-all duration-300 cursor-pointer"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px]">
                  Preview Image
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview URL */}
        <div>
          <label className="block text-[10px] font-medium text-gray-400 mb-1">
            Live Preview URL <span className="text-gray-600">(Optional)</span>
          </label>
          <div className="relative">
            <Link size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleInputChange}
              placeholder="https://demo.template.com"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-600 text-[12px] focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black font-semibold py-2.5 px-4 rounded-xl text-[12px] shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload Template
            </>
          )}
        </button>
      </form>
    </div>
  );
}