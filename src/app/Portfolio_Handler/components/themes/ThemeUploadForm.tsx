'use client';
/* eslint-disable */

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
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
      // Validation
      if (!formData.name || !formData.description || !formData.image) {
        setErrorMessage('Please fill all required fields');
        setIsSubmitting(false);
        return;
      }

      // Convert image to base64
      const imageBase64 = await fileToBase64(formData.image);

      // Prepare data for API
      const templateData = {
        name: formData.name,
        description: formData.description,
        image: imageBase64,
        live_url: formData.liveUrl || null,
        type: formData.type
      };

      // Call API to create template
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

      // Reset form on success
      setFormData({
        name: '',
        description: '',
        image: null,
        liveUrl: '',
        type: 'free',
      });
      setImagePreview('');
      setShowSuccess(true);

      // Auto-hide success after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error: any) {
      console.error('Template upload error:', error);
      setErrorMessage(error.message || '❌ Error uploading template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700 relative">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-5">
        Upload New Template
      </h2>

      {/* ✅ Success check animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 right-4 flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg shadow-md"
          >
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
            <span className="font-medium text-sm">Template Uploaded!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ❌ Error message */}
      {errorMessage && (
        <div className="p-2 text-sm rounded mb-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Template Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-sm text-black dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-sm text-black dark:text-white"
            required
          />
        </div>

        {/* Template Type Selection */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Template Type *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="free"
                checked={formData.type === 'free'}
                onChange={handleInputChange}
                className="mr-2 text-black dark:text-white focus:ring-black dark:focus:ring-white"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Free</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="paid"
                checked={formData.type === 'paid'}
                onChange={handleInputChange}
                className="mr-2 text-black dark:text-white focus:ring-black dark:focus:ring-white"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Paid</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Preview Image *
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-black hover:file:bg-gray-200"
            required
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-28 h-28 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Live Preview URL (Optional)
          </label>
          <input
            type="url"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleInputChange}
            placeholder="https://demo.template.com"
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-sm text-black dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-1.5 px-4 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Uploading...' : 'Upload Template'}
        </button>
      </form>
    </div>
  );
}