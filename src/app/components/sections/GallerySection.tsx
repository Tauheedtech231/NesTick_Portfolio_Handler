'use client';

import React, { useEffect, useState } from 'react';
import { GalleryItem, College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiAward, FiImage, FiStar, FiCheck } from 'react-icons/fi';
import Image from 'next/image';

interface GallerySectionProps {
  college: College;
}

export function GallerySection({ college }: GallerySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'award' | 'photo' | 'achievement'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ✅ Load gallery data from database
  useEffect(() => {
    const loadGalleryData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/sections?template_id=2&section_name=Gallery`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.sections && data.sections.length > 0) {
            const dbContent = data.sections[0].content;
            if (dbContent && dbContent.gallery) {
              setGallery(dbContent.gallery);
            }
          }
        }
      } catch (error) {
        console.error('Error loading gallery data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGalleryData();
  }, []);

  // Handle success popup display
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const addItem = () => {
    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      category: 'photo',
    };
    setGallery([...gallery, newItem]);
  };

  const updateItem = (index: number, field: keyof GalleryItem, value: string) => {
    if (field === 'description' && value.length > 500) {
      alert('Description cannot exceed 500 characters.');
      return;
    }

    const updatedGallery = [...gallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    setGallery(updatedGallery);
  };

  const removeItem = (index: number) => {
    const itemTitle = gallery[index].title || `Item ${index + 1}`;
    if (window.confirm(`Are you sure you want to remove "${itemTitle}"?`)) {
      setGallery(gallery.filter((_, i) => i !== index));
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    
    // Validate required fields
    const invalidItems = gallery.filter(item => 
      !item.title.trim() || !item.description.trim() || !item.image
    );

    if (invalidItems.length > 0) {
      alert(`Please fill all required fields (title, description, and image) for ${invalidItems.length} item(s).`);
      setIsSaving(false);
      return;
    }

    try {
      // Save to database with template_id = 2
      const dbContent = {
        gallery: gallery.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          date: item.date,
          image: item.image,
          category: item.category || 'photo'
        }))
      };

      console.log('Saving gallery data:', dbContent);

      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: 2,
          section_name: "Gallery",
          content: dbContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      const result = await response.json();
      console.log('Saved gallery to database:', result);
      
      // Show success popup
      setShowSuccessPopup(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving gallery:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = async () => {
    // Reload from database
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/sections?template_id=2&section_name=Gallery`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          if (dbContent && dbContent.gallery) {
            setGallery(dbContent.gallery);
          }
        }
      }
    } catch (error) {
      console.error('Error reloading gallery data:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  // Handle image upload for gallery items
  const handleImageChange = (index: number, fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      updateItem(index, 'image', fileOrString);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateItem(index, 'image', reader.result as string);
    };
    reader.readAsDataURL(fileOrString);
  };

  const filteredItems = filter === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === filter);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'award': return <FiAward className="w-4 h-4" />;
      case 'photo': return <FiImage className="w-4 h-4" />;
      case 'achievement': return <FiStar className="w-4 h-4" />;
      default: return <FiImage className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'award': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'photo': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'achievement': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading gallery data...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-xl border border-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <FiCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium">Changes Saved Successfully!</p>
              <p className="text-sm text-gray-300">Your Gallery section has been updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery & Achievements</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage photos, awards, and achievements showcase</p>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <FiEdit2 className="w-4 h-4 mr-2" />
              Manage Gallery
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={cancelEditing}
                className="w-full sm:w-auto"
              >
                <FiX className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={saveChanges}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                <FiSave className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilter('award')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === 'award'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FiAward className="w-4 h-4 inline mr-2" />
              Awards
            </button>
            <button
              onClick={() => setFilter('photo')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === 'photo'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FiImage className="w-4 h-4 inline mr-2" />
              Photos
            </button>
            <button
              onClick={() => setFilter('achievement')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === 'achievement'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FiStar className="w-4 h-4 inline mr-2" />
              Achievements
            </button>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-6">
            {/* Add Item Button */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Gallery Items
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add and manage gallery items, awards, and achievements
                </p>
              </div>
              <Button onClick={addItem}>
                <FiPlus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </div>

            {/* Gallery Items in Edit Mode */}
            <div className="space-y-6">
              {gallery.map((item, index) => (
                <div
                  key={item.id}
                  className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FiImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Gallery Item #{index + 1}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.title || 'New gallery item'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to remove this gallery item?')) {
                          removeItem(index);
                        }
                      }}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Item Image */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Image
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Upload gallery image (PNG/JPG)
                        </p>
                      </div>
                      <UploadImage
                        value={item.image}
                        onChange={(file) => handleImageChange(index, file)}
                        onRemove={() => updateItem(index, 'image', '')}
                        aspectRatio="video"
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => updateItem(index, 'title', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Best Engineering College Award"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                            Date *
                          </label>
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) => updateItem(index, 'date', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                            Category *
                          </label>
                          <select
                            value={item.category || 'photo'}
                            onChange={(e) => updateItem(index, 'category', e.target.value as "photo")}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <option value="photo">Photo</option>
                            <option value="award">Award</option>
                            <option value="achievement">Achievement</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                            Description * (Max 500 characters)
                          </label>
                          <span className={`text-xs ${
                            (item.description?.length || 0) > 450 
                              ? 'text-red-500' 
                              : (item.description?.length || 0) > 400 
                              ? 'text-yellow-500' 
                              : 'text-gray-500'
                          }`}>
                            {item.description?.length || 0}/500
                          </span>
                        </div>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Describe this achievement or photo..."
                          maxLength={500}
                        />
                        {(item.description?.length || 0) >= 500 && (
                          <p className="text-xs text-red-500 mt-1">
                            Maximum character limit reached
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* View Mode - Gallery Items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title || 'Gallery image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiImage className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category || 'photo')}`}>
                      {getCategoryIcon(item.category || 'photo')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                      {item.title || 'Untitled Item'}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {item.description || 'No description available'}
                  </p>
                  
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(item.description?.length || 0)} characters
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isEditing && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FiImage className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No {filter !== 'all' ? filter : ''} Items Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {filter === 'all' 
                ? 'Start by adding your first gallery item to showcase achievements and photos.' 
                : `No ${filter} items found. Try a different filter or add new items.`
              }
            </p>
            <Button onClick={() => setIsEditing(true)}>
              <FiPlus className="w-4 h-4 mr-2" />
              Add Gallery Item
            </Button>
          </div>
        )}
      </div>
    </>
  );
}