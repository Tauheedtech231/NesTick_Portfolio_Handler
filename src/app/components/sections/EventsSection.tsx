'use client';

import React, { useState } from 'react';
import { Event } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi';
import { formatDate, cn } from '@/lib/utils';
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
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
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
          <Button onClick={addEvent} variant="secondary">
            <FiPlus className="w-4 h-4 mr-2" />
            Add New Event
          </Button>

          <div className="grid gap-6">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Event #{index + 1}
                  </h3>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Image
                    </label>
                    <UploadImage
                      value={event.image}
                      onChange={(url) => updateEvent(index, 'image', url)}
                      onRemove={() => updateEvent(index, 'image', '')}
                      aspectRatio="video"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => updateEvent(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Annual Tech Symposium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={event.date}
                          onChange={(e) => updateEvent(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          value={event.location}
                          onChange={(e) => updateEvent(index, 'location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Main Campus Auditorium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type
                        </label>
                        <select
                          value={event.type}
                          onChange={(e) => updateEvent(index, 'type', e.target.value as 'event' | 'announcement')}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="event">Event</option>
                          <option value="announcement">Announcement</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`featured-${index}`}
                          checked={event.featured}
                          onChange={(e) => updateEvent(index, 'featured', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`featured-${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Featured Event
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={event.description}
                        onChange={(e) => updateEvent(index, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
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
       <div className="space-y-8">
  {/* Featured Events */}
  {featuredEvents.length > 0 && (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Featured Events
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-black dark:bg-white rounded-2xl p-6 text-white dark:text-black transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3 opacity-90">
              <FiCalendar className="w-5 h-5" />
              <span className="text-sm font-medium">
                {formatDate(event.date)}
              </span>
            </div>
            <h4 className="text-xl font-bold mb-2">{event.title}</h4>
            <p className="opacity-80 mb-4">{event.description}</p>
            <div className="flex items-center justify-between text-sm opacity-90">
              <span>📍 {event.location}</span>
              <span className="px-3 py-1 border border-white dark:border-black rounded-full text-xs font-medium">
                {event.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Regular Events */}
  {regularEvents.length > 0 && (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Upcoming Events
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-300 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
              <FiCalendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(event.date)}</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-500">
                📍 {event.location}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
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

      {!isEditing && events.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Events Scheduled
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by adding your first event or announcement.
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