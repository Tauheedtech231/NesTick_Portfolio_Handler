/* eslint-disable @typescript-eslint/no-explicit-any */
// app/designer/upload-design/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  Link, 
  Tag, 
  FileText, 
  DollarSign,
  Layers,
  X,
  Plus,
  Save,
  Eye,
  Globe,
  Figma,
  AlertCircle
} from 'lucide-react';

export default function UploadDesignPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    price: '',
    designFile: null as File | null,
    figmaUrl: '',
    liveUrl: '',
    status: 'draft' as 'draft' | 'published'
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [designerId, setDesignerId] = useState<number | null>(null);

  const categories = ['Portfolio', 'Business', 'Creative', 'Engineering', 'Medical', 'Education', 'Technology'];

  // Get designer ID from sessionStorage
  useEffect(() => {
    const auth = sessionStorage.getItem('designer_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        setDesignerId(authData.user?.id);
      } catch (e) {
        console.error('Error parsing auth');
      }
    }
  }, []);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', 'lms_upload');
    cloudinaryFormData.append('folder', 'designer-designs');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dfp9qc0gu/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, designFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setUploading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setUploading(false);
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      setUploading(false);
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      setUploading(false);
      return;
    }
    if (!formData.designFile) {
      setError('Preview image is required');
      setUploading(false);
      return;
    }
    if (!designerId) {
      setError('Please login again');
      setUploading(false);
      return;
    }

    try {
      // First upload image to Cloudinary
      let imageUrl = '';
      try {
        imageUrl = await uploadToCloudinary(formData.designFile);
      } catch (cloudinaryError) {
        setError('Failed to upload image. Please try again.');
        setUploading(false);
        return;
      }

      // Prepare data for API
      const designData = {
        designer_id: designerId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: JSON.stringify(formData.tags),
        price: parseFloat(formData.price),
        preview_image: imageUrl,
        figma_url: formData.figmaUrl,
        live_url: formData.liveUrl,
        status: formData.status === 'published' ? 'pending' : 'draft'
      };

      // Save to database
      const response = await fetch('/api/designers/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Design uploaded successfully! It will be reviewed by our team.');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          tags: [],
          price: '',
          designFile: null,
          figmaUrl: '',
          liveUrl: '',
          status: 'draft'
        });
        setPreviewImage(null);
        
        // Redirect to my designs page
        router.push('/designer/my-designs');
      } else {
        setError(data.error || 'Failed to save design. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload New Design</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your creative work with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Design Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design Preview *</h3>
          <div 
            className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-all ${
              previewImage ? 'border-blue-500' : ''
            }`}
          >
            {previewImage ? (
              <div className="relative">
                <img src={previewImage} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                <button
                  type="button"
                  onClick={() => { setPreviewImage(null); setFormData(prev => ({ ...prev, designFile: null })); }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">Upload your design preview</p>
                <p className="text-xs text-gray-400">PNG, JPG, or GIF (max 5MB)</p>
                <label className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  Choose File
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required={!previewImage} />
                </label>
              </>
            )}
          </div>
        </div>

        {/* Design Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="e.g., Modern Portfolio Template"
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                placeholder="Describe your design, its features, and what makes it unique..."
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (USD) *</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    placeholder="49.99"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tags (e.g., modern, responsive, minimalist)"
                  className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Links (Optional)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Figma size={16} /> Figma URL
              </label>
              <input
                type="url"
                value={formData.figmaUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, figmaUrl: e.target.value }))}
                placeholder="https://figma.com/file/..."
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Globe size={16} /> Live Demo URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://your-demo-link.com"
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Publish Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Publish Settings</h3>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-4 h-4"
              />
              <span className="text-gray-700 dark:text-gray-300">Save as Draft</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="published"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-4 h-4"
              />
              <span className="text-gray-700 dark:text-gray-300">Submit for Review</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Note: Designs submitted for review will be approved by our admin team before becoming available for purchase.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Save size={18} /> Submit for Review
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}