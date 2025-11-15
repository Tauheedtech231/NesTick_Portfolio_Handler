'use client';

import React, { useState } from 'react';
import { Event } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiCalendar, FiMapPin, FiStar } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';
/* eslint-disable */

interface EventsSectionProps {
  data: Event[];
  college: any;
  onUpdate: (data: Event[]) => void;
}

export function EventsSection({ data, college, onUpdate }: EventsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [events, setEvents] = useState<Event[]>(data);
/* eslint-disable */

  const addEvent = () => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      type: 'event',
      featured: false,
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

  const saveChanges = () => {
    onUpdate(events);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setEvents(data);
    setIsEditing(false);
  };

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
              className="w-full sm:w-auto"
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save Changes
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
                      onChange={(url) => updateEvent(index, 'image', url)}
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
                        value={event.title}
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
                          value={event.location}
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
                          value={event.type}
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
                          checked={event.featured}
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
                        value={event.description}
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
                    <h4 className="text-xl font-bold mb-3">{event.title}</h4>
                    <p className="opacity-90 mb-4 leading-relaxed">{event.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        {event.location}
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
                      {event.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiMapPin className="w-4 h-4" />
                        {event.location}
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