'use client';

import React, { useEffect, useState } from 'react';
import { GalleryItem } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiAward, FiImage, FiStar, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import { gsap } from 'gsap';

interface GallerySectionProps {
  data: GalleryItem[];
  college: string;
  onUpdate: (data: GalleryItem[]) => void;
}

interface PopupMessage {
  type: 'success' | 'error' | 'warning';
  message: string;
  title: string;
}

export function GallerySection({ data, onUpdate }: GallerySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>(data);
  const [filter, setFilter] = useState<'all' | 'award' | 'photo' | 'achievement'>('all');
  const [popup, setPopup] = useState<PopupMessage | null>(null);

  // GSAP animations
  useEffect(() => {
    gsap.fromTo('.gallery-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
    );
  }, [gallery, filter]);

  // Popup auto-dismiss
  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => {
        setPopup(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const showPopup = (type: PopupMessage['type'], title: string, message: string) => {
    setPopup({ type, title, message });
    // Animate popup entrance
    gsap.fromTo('.popup-message',
      { opacity: 0, y: -50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  // Custom image upload handler with size validation
  const handleImageUpload = (index: number, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check file size (10KB = 10240 bytes)
      if (file.size > 10240) {
        showPopup('error', 'File Too Large', 'Image must be smaller than 10KB. Please choose a smaller file.');
        reject(new Error('File size exceeds 10KB limit'));
        return;
      }

      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        showPopup('error', 'Invalid File', 'Please select a valid image file.');
        reject(new Error('Invalid file type'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        showPopup('success', 'Image Uploaded', 'Image has been successfully uploaded!');
        resolve(result);
      };
      reader.onerror = () => {
        showPopup('error', 'Upload Failed', 'Failed to upload image. Please try again.');
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const addItem = () => {
    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}`,
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      category: 'photo',
    };
    setGallery([...gallery, newItem]);
    showPopup('success', 'Item Added', 'New gallery item has been created. Fill in the details and upload an image.');
  };

  const updateItem = (index: number, field: keyof GalleryItem, value: string) => {
    // Validate description length
    if (field === 'description' && value.length > 500) {
      showPopup('warning', 'Character Limit', 'Description cannot exceed 500 characters.');
      return;
    }

    const updatedGallery = [...gallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    setGallery(updatedGallery);
  };

  const removeItem = (index: number) => {
    const itemTitle = gallery[index].title || `Item ${index + 1}`;
    setGallery(gallery.filter((_, i) => i !== index));
    showPopup('warning', 'Item Removed', `"${itemTitle}" has been removed from the gallery.`);
  };

  const saveChanges = () => {
    // Validate required fields before saving
    const invalidItems = gallery.filter(item => 
      !item.title.trim() || !item.description.trim() || !item.image
    );

    if (invalidItems.length > 0) {
      showPopup('error', 'Validation Error', 
        `Please fill all required fields (title, description, and image) for ${invalidItems.length} item(s).`
      );
      return;
    }

    onUpdate(gallery);
    setIsEditing(false);
    showPopup('success', 'Changes Saved', 'All gallery changes have been successfully saved!');
  };

  const cancelEditing = () => {
    setGallery(data);
    setIsEditing(false);
    showPopup('warning', 'Changes Cancelled', 'All unsaved changes have been discarded.');
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
      case 'award': return 'from-yellow-500 to-orange-500';
      case 'photo': return 'from-blue-500 to-cyan-500';
      case 'achievement': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPopupStyles = (type: PopupMessage['type']) => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-l-4 p-4 transform transition-all duration-300";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500`;
      case 'error':
        return `${baseStyles} border-red-500`;
      case 'warning':
        return `${baseStyles} border-yellow-500`;
      default:
        return `${baseStyles} border-gray-500`;
    }
  };

  const getPopupIcon = (type: PopupMessage['type']) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <FiAlertCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return <FiAlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl">
      {/* Popup Message */}
      {popup && (
        <div className={`popup-message ${getPopupStyles(popup.type)}`}>
          <div className="flex items-start space-x-3">
            {getPopupIcon(popup.type)}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {popup.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {popup.message}
              </p>
            </div>
            <button
              onClick={() => setPopup(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-4000 ${
                popup.type === 'success' ? 'bg-green-500' :
                popup.type === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
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
              className="w-full sm:w-auto"
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save Changes
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
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('award')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'award'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
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
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
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
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
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
          <Button onClick={addItem} variant="secondary">
            <FiPlus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>

          <div className="grid gap-6">
            {gallery.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Gallery Item #{index + 1}
                  </h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Item Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image * (Max 10KB)
                    </label>
                    <div className="space-y-2">
                      <UploadImage
                        value={item.image}
                        onChange={(url) => updateItem(index, 'image', url)}
                        onRemove={() => updateItem(index, 'image', '')}
                        aspectRatio="video"
                        // Add custom validation if UploadImage component supports it
                        // If not, we'll handle it through our custom function
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supported formats: JPG, PNG, GIF • Maximum size: 10KB
                      </p>
                      {item.image && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ✓ Image uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Best Engineering College Award"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateItem(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category *
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(index, 'category', e.target.value as "photo")}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="photo">Photo</option>
                          <option value="award">Award</option>
                          <option value="achievement">Achievement</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description * (Max 500 characters)
                        </label>
                        <span className={`text-xs ${
                          item.description.length > 450 
                            ? 'text-red-500' 
                            : item.description.length > 400 
                            ? 'text-yellow-500' 
                            : 'text-gray-500'
                        }`}>
                          {item.description.length}/500
                        </span>
                      </div>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                        placeholder="Describe this achievement or photo..."
                        maxLength={500}
                      />
                      {item.description.length >= 500 && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-48 bg-gradient-to-r ${getCategoryColor(item.category)} relative overflow-hidden`}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                    {getCategoryIcon(item.category)}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white">
                  {getCategoryIcon(item.category)}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(item.category)} text-white`}>
                    {item.category}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {new Date(item.date).toLocaleDateString()}
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                  {item.description}
                </p>
                
                {/* Character count in view mode */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description.length} characters
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEditing && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiImage className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No {filter !== 'all' ? filter : ''} Items Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter === 'all' 
              ? 'Start by adding your first gallery item.' 
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
  );
}