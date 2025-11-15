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

interface AlertMessage {
  type: 'success' | 'error' | 'warning';
  message: string;
  title: string;
}

export function GallerySection({ data, onUpdate }: GallerySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>(data);
  const [filter, setFilter] = useState<'all' | 'award' | 'photo' | 'achievement'>('all');
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // GSAP animations
  useEffect(() => {
    gsap.fromTo('.gallery-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
    );
  }, [gallery, filter]);

  // Alert auto-dismiss
  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  const showAlert = (type: AlertMessage['type'], title: string, message: string) => {
    const newAlert: AlertMessage = {
      type,
      title,
      message,
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter((_, index) => index !== id));
  };

  const getAlertStyles = (type: AlertMessage['type']) => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-xl shadow-2xl border-l-4 max-w-sm w-full transform transition-all duration-300 mx-auto";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200`;
      case 'error':
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200`;
      default:
        return `${baseStyles} bg-gray-50 dark:bg-gray-900/20 border-gray-500`;
    }
  };

  const getAlertIcon = (type: AlertMessage['type']) => {
    const iconClass = "w-5 h-5 flex-shrink-0 mt-0.5";
    
    switch (type) {
      case 'success':
        return <FiCheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <FiAlertCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <FiAlertCircle className={`${iconClass} text-yellow-500`} />;
      default:
        return <FiAlertCircle className={iconClass} />;
    }
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
    showAlert('success', 'Item Added', 'New gallery item has been created. Fill in the details and upload an image.');
  };

  const updateItem = (index: number, field: keyof GalleryItem, value: string) => {
    if (field === 'description' && value.length > 500) {
      showAlert('warning', 'Character Limit', 'Description cannot exceed 500 characters.');
      return;
    }

    const updatedGallery = [...gallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    setGallery(updatedGallery);
  };

  const removeItem = (index: number) => {
    const itemTitle = gallery[index].title || `Item ${index + 1}`;
    setGallery(gallery.filter((_, i) => i !== index));
    showAlert('warning', 'Item Removed', `"${itemTitle}" has been removed from the gallery.`);
  };

  const saveChanges = () => {
    const invalidItems = gallery.filter(item => 
      !item.title.trim() || !item.description.trim() || !item.image
    );

    if (invalidItems.length > 0) {
      showAlert('error', 'Validation Error', 
        `Please fill all required fields (title, description, and image) for ${invalidItems.length} item(s).`
      );
      return;
    }

    onUpdate(gallery);
    setIsEditing(false);
    showAlert('success', 'Changes Saved', 'All gallery changes have been successfully saved!');
  };

  const cancelEditing = () => {
    setGallery(data);
    setIsEditing(false);
    showAlert('warning', 'Changes Cancelled', 'All unsaved changes have been discarded.');
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Alert Messages */}
      {alerts.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 pointer-events-none w-full max-w-sm">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={getAlertStyles(alert.type)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                <p className="text-sm opacity-90">{alert.message}</p>
              </div>
              <button
                onClick={() => removeAlert(index)}
                className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

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
                    onClick={() => removeItem(index)}
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
                        Upload gallery image (PNG/JPG, max 500KB)
                      </p>
                    </div>
                    <UploadImage
                      value={item.image}
                      onChange={(url) => updateItem(index, 'image', url)}
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
                        value={item.title}
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
                          value={item.category}
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
        /* View Mode - Gallery Items */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiImage className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {getCategoryIcon(item.category)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {new Date(item.date).toLocaleDateString()}
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {item.description}
                </p>
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description.length} characters
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
  );
}