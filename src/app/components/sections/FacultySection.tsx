'use client';

import React, { useState } from 'react';
import { Faculty, College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiUsers, FiMail, FiBriefcase, FiBook } from 'react-icons/fi';
import Image from 'next/image';

interface FacultySectionProps {
  data: Faculty[];
  college: College;
  onUpdate: (data: Faculty[]) => void;
}

export function FacultySection({ data, onUpdate }: FacultySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [faculty, setFaculty] = useState<Faculty[]>(data);

  const addFaculty = () => {
    const newFaculty: Faculty = {
      id: `fac-${Date.now()}`,
      name: '',
      position: '',
      department: '',
      email: '',
      bio: '',
      order: faculty.length + 1,
    };
    setFaculty([...faculty, newFaculty]);
  };

  const updateFaculty = (index: number, field: keyof Faculty, value: string) => {
    const updatedFaculty = [...faculty];
    updatedFaculty[index] = { ...updatedFaculty[index], [field]: value };
    setFaculty(updatedFaculty);
  };

  const removeFaculty = (index: number) => {
    setFaculty(faculty.filter((_, i) => i !== index));
  };

  const saveChanges = () => {
    onUpdate(faculty);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setFaculty(data);
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Faculty Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage faculty members and their information</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <FiEdit2 className="w-4 h-4 mr-2" />
            Manage Faculty
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
          {/* Add Faculty Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Faculty Members
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add and manage faculty member profiles
              </p>
            </div>
            <Button onClick={addFaculty}>
              <FiPlus className="w-4 h-4 mr-2" />
              Add Faculty Member
            </Button>
          </div>

          {/* Faculty List in Edit Mode */}
          <div className="space-y-6">
            {faculty.map((member, index) => (
              <div
                key={member.id}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Faculty Member #{index + 1}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.name || 'New faculty member'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFaculty(index)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Image */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Profile Image
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Upload a professional headshot (PNG/JPG, max 500KB)
                      </p>
                    </div>
                    <UploadImage
                      value={member.image}
                      onChange={(url) => updateFaculty(index, 'image', url)}
                      onRemove={() => updateFaculty(index, 'image', '')}
                      aspectRatio="square"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Basic Information */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiUsers className="w-4 h-4 inline mr-2" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFaculty(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Dr. John Smith"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiBriefcase className="w-4 h-4 inline mr-2" />
                          Position *
                        </label>
                        <input
                          type="text"
                          value={member.position}
                          onChange={(e) => updateFaculty(index, 'position', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Professor & Head of Department"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiBook className="w-4 h-4 inline mr-2" />
                          Department *
                        </label>
                        <input
                          type="text"
                          value={member.department}
                          onChange={(e) => updateFaculty(index, 'department', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Computer Science"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiMail className="w-4 h-4 inline mr-2" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateFaculty(index, 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="john.smith@college.edu"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Biography *
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Write a brief professional biography
                      </p>
                      <textarea
                        value={member.bio}
                        onChange={(e) => updateFaculty(index, 'bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Brief biography about the faculty member's experience, qualifications, and achievements..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* View Mode - Faculty Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((member) => (
            <div
              key={member.id}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className="text-center mb-6">
                {member.image ? (
                  <div className="relative mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="mx-auto rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                  {member.name}
                </h3>
                <div className="space-y-2">
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    {member.position}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.department}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                  {member.bio}
                </p>
                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    <FiMail className="w-4 h-4 mr-2" />
                    {member.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isEditing && faculty.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiUsers className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            No Faculty Members Added
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Get started by adding your first faculty member to showcase your academic team.
          </p>
          <Button onClick={() => setIsEditing(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Faculty Member
          </Button>
        </div>
      )}
    </div>
  );
}