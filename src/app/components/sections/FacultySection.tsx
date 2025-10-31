'use client';

import React, { useState } from 'react';
import { Faculty, College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiUsers } from 'react-icons/fi';
import Image from 'next/image';
interface FacultySectionProps {
  data: Faculty[];
  college: College;
  onUpdate: (data: Faculty[]) => void;
}

export function FacultySection({ data, onUpdate }: FacultySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [faculty, setFaculty] = useState<Faculty[]>(data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
    setEditingIndex(faculty.length);
  };

  const updateFaculty = (index: number, field: keyof Faculty, value: string) => {
    const updatedFaculty = [...faculty];
    updatedFaculty[index] = { ...updatedFaculty[index], [field]: value };
    setFaculty(updatedFaculty);
  };

  const removeFaculty = (index: number) => {
    setFaculty(faculty.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const saveChanges = () => {
    onUpdate(faculty);
    setIsEditing(false);
    setEditingIndex(null);
  };

  const cancelEditing = () => {
    setFaculty(data);
    setIsEditing(false);
    setEditingIndex(null);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
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
          <Button onClick={addFaculty} variant="secondary">
            <FiPlus className="w-4 h-4 mr-2" />
            Add New Faculty Member
          </Button>

          <div className="grid gap-6">
            {faculty.map((member, index) => (
              <div
                key={member.id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Faculty Member #{index + 1}
                  </h3>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Image
                    </label>
                    <UploadImage
                      value={member.image}
                      onChange={(url) => updateFaculty(index, 'image', url)}
                      onRemove={() => updateFaculty(index, 'image', '')}
                      aspectRatio="square"
                    />
                  </div>

                  {/* Basic Information */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFaculty(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Dr. John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Position *
                        </label>
                        <input
                          type="text"
                          value={member.position}
                          onChange={(e) => updateFaculty(index, 'position', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Professor & Head of Department"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Department *
                        </label>
                        <input
                          type="text"
                          value={member.department}
                          onChange={(e) => updateFaculty(index, 'department', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateFaculty(index, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="john.smith@college.edu"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Biography *
                      </label>
                      <textarea
                        value={member.bio}
                        onChange={(e) => updateFaculty(index, 'bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                        placeholder="Brief biography about the faculty member..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-center mb-4">
                {member.image ? (
                 <Image
  src={member.image}
  alt={member.name}
  width={80}   // 20 * 4 (Tailwind w-20 = 5rem = 80px)
  height={80}  // h-20
  className="mx-auto rounded-full mb-3 object-cover"
/>
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold mb-3">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-1">
                  {member.position}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.department}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {member.bio}
              </p>
              <div className="text-center">
                <a
                  href={`mailto:${member.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  {member.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEditing && faculty.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiUsers className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Faculty Members Added
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by adding your first faculty member.
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