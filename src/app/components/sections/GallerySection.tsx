'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiImage, FiCheck, FiRefreshCw } from 'react-icons/fi';
import Image from 'next/image';

interface GallerySectionProps {
  college: College;
  templateId?: number;
}

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  category: string;
  order: number;
}

const defaultCategories = ["Campus", "Facilities", "Academics", "Student Life", "Events"];

export function GallerySection({ college, templateId }: GallerySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getActiveTemplateId = () => {
    return templateId || college.template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt(college.id);
  };

  // Load gallery data from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Gallery&college_id=${collegeId}&_=${timestamp}`;
      
      console.log('🔄 [Gallery] Fetching gallery data from:', url);
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          const updatedAt = data.sections[0].updated_at;
          
          setLastUpdated(updatedAt);
          
          if (dbContent) {
            if (dbContent.gallery && Array.isArray(dbContent.gallery)) {
              setGalleryImages(dbContent.gallery);
            }
            if (dbContent.categories && Array.isArray(dbContent.categories)) {
              setCategories(dbContent.categories);
            }
            console.log('✅ [Gallery] Loaded', dbContent.gallery?.length || 0, 'images');
          }
        }
      }
    } catch (error) {
      console.error('❌ [Gallery] Failed to load:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [templateId, college.template_id, college.id]);

  useEffect(() => {
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  // Save to database
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      
      const contentToSave = {
        gallery: galleryImages,
        categories: categories
      };
      
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: activeTemplateId,
          section_name: "Gallery",
          college_id: collegeId,
          content: contentToSave
        })
      });
      
      if (response.ok) {
        setShowSuccessPopup(true);
        setIsEditing(false);
        await loadFromDatabase(false);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        const error = await response.json();
        alert('Failed to save: ' + (error.error || error.message));
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Add new image
  const addImage = () => {
    const newId = Math.max(...galleryImages.map(img => img.id), 0) + 1;
    const newImage: GalleryImage = {
      id: newId,
      src: '',
      title: 'New Image',
      category: categories[0] || 'Campus',
      order: galleryImages.length
    };
    setGalleryImages([...galleryImages, newImage]);
  };

  // Update image
  const updateImage = (index: number, field: keyof GalleryImage, value: string | number) => {
    const updated = [...galleryImages];
    updated[index] = { ...updated[index], [field]: value };
    setGalleryImages(updated);
  };

  // Remove image
  const removeImage = (index: number) => {
    if (confirm('Are you sure you want to remove this image?')) {
      setGalleryImages(galleryImages.filter((_, i) => i !== index));
    }
  };

  // Move image up/down
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === galleryImages.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...galleryImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Update order numbers
    updated.forEach((img, idx) => { img.order = idx; });
    setGalleryImages(updated);
  };

  // Handle image upload
  const handleImageUpload = (index: number, fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      updateImage(index, 'src', fileOrString);
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      updateImage(index, 'src', reader.result as string);
    };
    reader.readAsDataURL(fileOrString);
  };

  // Add new category
  const addCategory = () => {
    const newCategory = prompt('Enter new category name:');
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  // Remove category
  const removeCategory = (category: string) => {
    if (confirm(`Remove category "${category}"? Images with this category will become "Uncategorized".`)) {
      const updatedImages = galleryImages.map(img => 
        img.category === category ? { ...img, category: 'Uncategorized' } : img
      );
      setGalleryImages(updatedImages);
      setCategories(categories.filter(c => c !== category));
    }
  };

  const refreshData = async () => {
    await loadFromDatabase(true);
  };

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <FiCheck className="w-5 h-5" />
            <div>
              <p className="font-medium">Changes Saved Successfully!</p>
              <p className="text-sm text-green-100">Gallery updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage campus gallery images</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} variant="outline" className="gap-2">
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
                <FiEdit2 className="w-4 h-4 mr-2" /> Manage Gallery
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <FiX className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                  <FiSave className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <FiImage className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Add, remove, or reorder gallery images. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter - View Mode */}
        {!isEditing && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === "All"
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                }`}
              >
                All ({galleryImages.length})
              </button>
              {categories.map(cat => {
                const count = galleryImages.filter(img => img.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-teal-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Edit Mode - Manage Images */}
        {isEditing ? (
          <div className="space-y-6">
            {/* Categories Management */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
                <Button size="sm" onClick={addCategory} className="bg-teal-600">
                  <FiPlus className="w-3 h-3 mr-1" /> Add Category
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full border">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                    <button
                      onClick={() => removeCategory(cat)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Images Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gallery Images</h3>
                <Button onClick={addImage} className="bg-teal-600">
                  <FiPlus className="w-4 h-4 mr-2" /> Add Image
                </Button>
              </div>

              <div className="space-y-4">
                {galleryImages.map((image, index) => (
                  <div key={image.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Order: {index + 1}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveImage(index, 'up')}
                            className="p-1 text-gray-500 hover:text-teal-600"
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveImage(index, 'down')}
                            className="p-1 text-gray-500 hover:text-teal-600"
                            disabled={index === galleryImages.length - 1}
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image</label>
                        <UploadImage
                          value={image.src}
                          onChange={(file) => handleImageUpload(index, file)}
                          onRemove={() => updateImage(index, 'src', '')}
                          aspectRatio="video"
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e) => updateImage(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          placeholder="Image title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <select
                          value={image.category}
                          onChange={(e) => updateImage(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {galleryImages.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No images added yet. Click "Add Image" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* View Mode - Gallery Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <FiImage className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-sm truncate">{image.title}</h3>
                    <span className="text-white/80 text-xs">{image.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isEditing && galleryImages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
              <FiImage className="w-10 h-10 text-teal-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">No Images Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Click "Manage Gallery" to add images.</p>
            <Button onClick={() => setIsEditing(true)} className="bg-teal-600">
              <FiPlus className="w-4 h-4 mr-2" /> Add Images
            </Button>
          </div>
        )}
      </div>
    </>
  );
}