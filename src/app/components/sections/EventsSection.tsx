'use client';

import React, { useState, useEffect } from 'react';
import { Event, College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiCalendar, FiMapPin, FiStar } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';
/* eslint-disable */

interface EventsSectionProps {
  college: College;
}

export function EventsSection({ college }: EventsSectionProps) {
  const STORAGE_KEY = `events_${college.id}`;
  const [isEditing, setIsEditing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Load events data from database
  useEffect(() => {
    const loadEventsData = async () => {
      setIsLoading(true);
      try {
        // Try loading from localStorage first for quick display
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedData = JSON.parse(saved);
          setEvents(parsedData.events || []);
        }

        // Then load from database
        const response = await fetch(
          `/api/sections?template_id=1&section_name=Events`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.sections && data.sections.length > 0) {
            const dbContent = data.sections[0].content;
            if (dbContent && dbContent.events) {
              setEvents(dbContent.events);
              // Also save to localStorage for offline access
              localStorage.setItem(STORAGE_KEY, JSON.stringify({
                events: dbContent.events,
                loadedAt: new Date().toISOString()
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error loading events data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventsData();
  }, [STORAGE_KEY]);

  const addEvent = () => {
    const newEvent: Event = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      type: 'event',
      featured: false,
      image: undefined,
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (index: number, field: keyof Event, value: any) => {
    const updatedEvents = [...events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setEvents(updatedEvents);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        events,
        savedAt: new Date().toISOString()
      }));

      // Save to database
      const dbContent = {
        events: events.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          type: event.type,
          featured: event.featured || false,
          image: event.image || null
        }))
      };

      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: 1,
          section_name: "Events",
          content: dbContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      const result = await response.json();
      console.log('Saved events to database:', result);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving events:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = () => {
    // Reload from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      setEvents(parsedData.events || []);
    }
    setIsEditing(false);
  };

  // Handle image upload for events
  const handleImageChange = (index: number, fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      updateEvent(index, 'image', fileOrString);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateEvent(index, 'image', reader.result as string);
    };
    reader.readAsDataURL(fileOrString);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading events data...</span>
        </div>
      </div>
    );
  }

  const featuredEvents = events.filter(event => event.featured);
  const regularEvents = events.filter(event => !event.featured);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events & Announcements</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage college events, announcements, and important dates</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <FiEdit2 className="w-4 h-4 mr-2" />
            Manage Events
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

      {isEditing ? (
        <div className="space-y-6">
          {/* Add Event Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Events & Announcements
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add and manage college events and announcements
              </p>
            </div>
            <Button onClick={addEvent}>
              <FiPlus className="w-4 h-4 mr-2" />
              Add New Event
            </Button>
          </div>

          {/* Events List in Edit Mode */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FiCalendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Event #{index + 1}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.title || 'New event'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEvent(index)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Event Image */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Event Image
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Upload event banner image (PNG/JPG, max 500KB)
                      </p>
                    </div>
                    <UploadImage
                      value={event.image}
                      onChange={(file) => handleImageChange(index, file)}
                      onRemove={() => updateEvent(index, 'image', '')}
                      aspectRatio="video"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Event Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={event.title || ''}
                        onChange={(e) => updateEvent(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Annual Tech Symposium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiCalendar className="w-4 h-4 inline mr-2" />
                          Date *
                        </label>
                        <input
                          type="date"
                          value={event.date}
                          onChange={(e) => updateEvent(index, 'date', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiMapPin className="w-4 h-4 inline mr-2" />
                          Location *
                        </label>
                        <input
                          type="text"
                          value={event.location || ''}
                          onChange={(e) => updateEvent(index, 'location', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Main Campus Auditorium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Event Type
                        </label>
                        <select
                          value={event.type || 'event'}
                          onChange={(e) => updateEvent(index, 'type', e.target.value as 'event' | 'announcement')}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="event">Event</option>
                          <option value="announcement">Announcement</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-3 pt-6">
                        <input
                          type="checkbox"
                          id={`featured-${index}`}
                          checked={event.featured || false}
                          onChange={(e) => updateEvent(index, 'featured', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`featured-${index}`} className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                          <FiStar className="w-4 h-4 mr-2" />
                          Featured Event
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Description *
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Provide details about the event or announcement
                      </p>
                      <textarea
                        value={event.description || ''}
                        onChange={(e) => updateEvent(index, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Describe the event details, agenda, and important information..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* View Mode - Events Display */
        <div className="space-y-8">
          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FiStar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Featured Events
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Highlighted events and announcements
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white transition-all hover:shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-3 opacity-90">
                      <FiCalendar className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {formatDate(event.date)}
                      </span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium ml-2">
                        {event.type}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold mb-3">{event.title || 'Untitled Event'}</h4>
                    <p className="opacity-90 mb-4 leading-relaxed">{event.description || 'No description available'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        {event.location || 'Location not specified'}
                      </span>
                      <div className="flex items-center gap-2 text-yellow-300">
                        <FiStar className="w-4 h-4" />
                        Featured
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Events */}
          {regularEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upcoming Events
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All scheduled events and announcements
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
                      <FiCalendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                      {event.title || 'Untitled Event'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {event.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiMapPin className="w-4 h-4" />
                        {event.location || 'Location not specified'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isEditing && events.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            No Events Scheduled
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start by adding your first event or announcement to keep students and staff informed.
          </p>
          <Button onClick={() => setIsEditing(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      )}
    </div>
  );
}