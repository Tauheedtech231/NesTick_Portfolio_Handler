'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiCalendar, 
  FiMapPin, FiStar, FiClock, FiUsers, FiCheck, FiRefreshCw 
} from 'react-icons/fi';

/* eslint-disable */

interface EventsSectionProps {
  college: College;
  templateId?: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  day: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  category: string;
  featuredImage: string;
}

const defaultCategories = ["Admission", "Career", "Academic", "Networking", "Sports", "Cultural"];

export function EventsSection({ college, templateId }: EventsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getActiveTemplateId = () => {
    return templateId || college.template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt(college.id);
  };

  // Load events from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Events&college_id=${collegeId}&_=${timestamp}`;
      
      console.log('🔄 [Events] Fetching events data from:', url);
      
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
            if (dbContent.events && Array.isArray(dbContent.events)) {
              setEvents(dbContent.events);
            }
            if (dbContent.categories && Array.isArray(dbContent.categories)) {
              setCategories(dbContent.categories);
            }
            console.log('✅ [Events] Loaded', dbContent.events?.length || 0, 'events');
          }
        }
      }
    } catch (error) {
      console.error('❌ [Events] Failed to load:', error);
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
        events: events,
        categories: categories
      };
      
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: activeTemplateId,
          section_name: "Events",
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
      console.error('Error saving events:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Add new event
  const addEvent = () => {
    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    const newEvent: Event = {
      id: newId,
      title: '',
      date: new Date().toISOString().split('T')[0],
      day: getDayName(new Date()),
      time: '10:00 AM - 4:00 PM',
      location: '',
      description: '',
      capacity: 100,
      category: categories[0] || 'General',
      featuredImage: ''
    };
    setEvents([...events, newEvent]);
  };

  const getDayName = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Update event
  const updateEvent = (index: number, field: keyof Event, value: any) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-update day when date changes
    if (field === 'date') {
      updated[index].day = getDayName(new Date(value));
    }
    
    setEvents(updated);
  };

  // Remove event
  const removeEvent = (index: number) => {
    if (confirm('Are you sure you want to remove this event?')) {
      setEvents(events.filter((_, i) => i !== index));
    }
  };

  // Move event up/down
  const moveEvent = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === events.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...events];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setEvents(updated);
  };

  // Handle image upload
  const handleImageUpload = (index: number, fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      updateEvent(index, 'featuredImage', fileOrString);
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      updateEvent(index, 'featuredImage', reader.result as string);
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
    if (confirm(`Remove category "${category}"? Events will be set to "General".`)) {
      const updatedEvents = events.map(e => 
        e.category === category ? { ...e, category: 'General' } : e
      );
      setEvents(updatedEvents);
      setCategories(categories.filter(c => c !== category));
    }
  };

  const refreshData = async () => {
    await loadFromDatabase(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
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
              <p className="text-sm text-green-100">Events updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage campus events and announcements</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Manage Events
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
              <FiCalendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Add, remove, or reorder events. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode */}
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

            {/* Events Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Events</h3>
                <Button onClick={addEvent} className="bg-teal-600">
                  <FiPlus className="w-4 h-4 mr-2" /> Add Event
                </Button>
              </div>

              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Order: {index + 1}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveEvent(index, 'up')}
                            className="p-1 text-gray-500 hover:text-teal-600"
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveEvent(index, 'down')}
                            className="p-1 text-gray-500 hover:text-teal-600"
                            disabled={index === events.length - 1}
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvent(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
                        <UploadImage
                          value={event.featuredImage}
                          onChange={(file) => handleImageUpload(index, file)}
                          onRemove={() => updateEvent(index, 'featuredImage', '')}
                          aspectRatio="video"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => updateEvent(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            placeholder="Event title"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                            <input
                              type="date"
                              value={event.date}
                              onChange={(e) => updateEvent(index, 'date', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Day</label>
                            <input
                              type="text"
                              value={event.day}
                              onChange={(e) => updateEvent(index, 'day', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                              placeholder="Monday"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                          <input
                            type="text"
                            value={event.time}
                            onChange={(e) => updateEvent(index, 'time', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            placeholder="10:00 AM - 4:00 PM"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                          <input
                            type="text"
                            value={event.location}
                            onChange={(e) => updateEvent(index, 'location', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            placeholder="Main Campus Auditorium"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity</label>
                            <input
                              type="number"
                              value={event.capacity}
                              onChange={(e) => updateEvent(index, 'capacity', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select
                              value={event.category}
                              onChange={(e) => updateEvent(index, 'category', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                          <textarea
                            value={event.description}
                            onChange={(e) => updateEvent(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white resize-none"
                            placeholder="Event description"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {events.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No events added yet. Click "Add Event" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* View Mode - Simple list (will be replaced by live template styling) */
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                <div className="flex gap-4">
                  {event.featuredImage && (
                    <img src={event.featuredImage} alt={event.title} className="w-24 h-24 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {event.date} ({event.day})</span>
                      <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {event.time}</span>
                      <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" /> {event.location}</span>
                      <span className="flex items-center gap-1"><FiUsers className="w-3 h-3" /> Capacity: {event.capacity}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{event.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isEditing && events.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
              <FiCalendar className="w-10 h-10 text-teal-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">No Events Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Click "Manage Events" to add events.</p>
            <Button onClick={() => setIsEditing(true)} className="bg-teal-600">
              <FiPlus className="w-4 h-4 mr-2" /> Add Events
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default EventsSection;