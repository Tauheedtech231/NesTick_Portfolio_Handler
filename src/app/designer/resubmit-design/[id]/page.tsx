/* eslint-disable @typescript-eslint/no-explicit-any */
// app/designer/resubmit-design/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react'; // ✅ Add useRef
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, 
  Image as ImageIcon, 
  DollarSign,
  X,
  Plus,
  Save,
  Globe,
  Figma,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Trash2
} from 'lucide-react';

export default function ResubmitDesignPage() {
  const router = useRouter();
  const params = useParams();
  const designId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [designerId, setDesignerId] = useState<number | null>(null);
  
  // ✅ Add ref to persist designerId across renders
  const designerIdRef = useRef<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    price: '',
    designFile: null as File | null,
    figmaUrl: '',
    liveUrl: '',
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [originalPreviewImage, setOriginalPreviewImage] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const categories = ['Portfolio', 'Business', 'Creative', 'Engineering', 'Medical', 'Education', 'Technology'];

  useEffect(() => {
    const auth = sessionStorage.getItem('designer_auth');
    console.log("the auth", auth);
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        const id = authData.user?.id;
        setDesignerId(id);
        designerIdRef.current = id; // ✅ Store in ref
        console.log("✅ Designer ID set:", id);
      } catch (e) {
        console.error('Error parsing auth');
      }
    }
  }, []);

  useEffect(() => {
    if (designerId && designId) {
      fetchDesignData();
    }
  }, [designerId, designId]);

  const fetchDesignData = async () => {
    try {
      const response = await fetch(`/api/designers/designs?designerId=${designerId}&designId=${designId}`);
      const data = await response.json();
      
      if (data.success && data.designs && data.designs.length > 0) {
        const design = data.designs[0];
        
        if (design.status !== 'rejected') {
          alert('Only rejected designs can be resubmitted');
          router.push('/designer/my-designs');
          return;
        }
        
        if (design.is_permanently_rejected) {
          alert('This design is permanently rejected and cannot be resubmitted');
          router.push('/designer/my-designs');
          return;
        }
        
        setFormData({
          title: design.title || '',
          description: design.description || '',
          category: design.category || '',
          tags: design.tags || [],
          price: design.price?.toString() || '',
          designFile: null,
          figmaUrl: design.figma_url || '',
          liveUrl: design.live_url || '',
        });
        
        setOriginalPreviewImage(design.preview_image);
        setPreviewImage(design.preview_image);
        setIsImageChanged(false);
      } else {
        alert('Design not found');
        router.push('/designer/my-designs');
      }
    } catch (error) {
      console.error('Error fetching design:', error);
      alert('Failed to load design data');
      router.push('/designer/my-designs');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      setFormData(prev => ({ ...prev, designFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsImageChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setPreviewImage(originalPreviewImage);
    setFormData(prev => ({ ...prev, designFile: null }));
    setIsImageChanged(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // ✅ Use ref value - this will always have the correct value
    const currentDesignerId = designerIdRef.current;
    console.log("🔍 Using designerId from ref:", currentDesignerId);

    if (!currentDesignerId) {
      setError('Session expired. Please refresh the page and try again.');
      setSubmitting(false);
      return;
    }

    if (!formData.title.trim()) {
      setError('Title is required');
      setSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setSubmitting(false);
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      setSubmitting(false);
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      setSubmitting(false);
      return;
    }
    if (!formData.liveUrl) {
      setError('Live URL is required');
      setSubmitting(false);
      return;
    }

    try {
      let imageUrl = originalPreviewImage;
      
      if (formData.designFile) {
        imageUrl = await fileToBase64(formData.designFile);
      }

      const designData = {
        id: parseInt(designId),
        designer_id: currentDesignerId, // ✅ Use ref value
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        price: parseFloat(formData.price),
        preview_image: imageUrl,
        figma_url: formData.figmaUrl,
        live_url: formData.liveUrl,
        status: 'pending'
      };

      console.log("📤 Sending designData:", designData);

      const response = await fetch('/api/designer/designs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData)
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (response.ok && data.success) {
        alert('Design resubmitted successfully! It will be reviewed by our team.');
        router.push('/designer/my-designs');
      } else {
        setError(data.error || 'Failed to resubmit design. Please try again.');
      }
    } catch (error) {
      console.error('Resubmit error:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/designer/my-designs"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resubmit Design</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your design based on admin feedback and resubmit for review
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Design Preview with Upload Option */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design Preview</h3>
          
          {/* Current Preview */}
          {previewImage && (
            <div className="mb-4">
              <div className="relative inline-block">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-600" 
                />
                {isImageChanged && (
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Reset to original"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              {isImageChanged && (
                <p className="text-xs text-green-600 mt-2">New image selected. Will replace current preview.</p>
              )}
            </div>
          )}

          {/* Upload New Image */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">Upload new preview image</p>
            <p className="text-xs text-gray-400 mb-4">PNG, JPG, or GIF (max 5MB)</p>
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Choose File
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
          
          {originalPreviewImage && !isImageChanged && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Current image shown. Upload new to replace.
            </p>
          )}
        </div>

        {/* Design Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition-colors">
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Important Links</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Globe size={16} /> Live Demo URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                required
                placeholder="https://your-live-demo.com"
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Figma size={16} /> Figma URL (Optional)
              </label>
              <input
                type="url"
                value={formData.figmaUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, figmaUrl: e.target.value }))}
                placeholder="https://figma.com/file/..."
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 cursor-pointer py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Resubmitting...
              </>
            ) : (
              <>
                <Save size={18} /> Resubmit for Review
              </>
            )}
          </button>
          <Link
            href="/designer/my-designs"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}