'use client';
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Faculty, College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiUsers, 
  FiMail, FiBriefcase, FiBook, FiAward, FiTool,
  FiCheck
} from 'react-icons/fi';
import Image from 'next/image';

interface FacultySectionProps {
  college: College;
}

// Extended interface with optional fields
interface ExtendedFaculty extends Faculty {
  experience?: string;
  skills?: string[];
}

export function FacultySection({  }: FacultySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [faculty, setFaculty] = useState<ExtendedFaculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ✅ Load faculty data from database with template_id = 2
  useEffect(() => {
    const loadFacultyData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/sections?template_id=2&section_name=Faculty`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched faculty data:', data);
          
          if (data.sections && data.sections.length > 0) {
            const dbContent = data.sections[0].content;
            if (dbContent && dbContent.faculty) {
              // Ensure all fields are present with default values
              const facultyData = dbContent.faculty.map((member: any) => ({
                id: member.id || `fac-${Date.now()}`,
                name: member.name || '',
                position: member.position || '',
                department: member.department || '',
                email: member.email || '',
                bio: member.bio || '',
                experience: member.experience || '',
                skills: member.skills || [],
                image: member.image || undefined,
                order: member.order || 0,
              }));
              setFaculty(facultyData);
            }
          }
        } else {
          console.error('Failed to fetch faculty data');
        }
      } catch (error) {
        console.error('Error loading faculty data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacultyData();
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

  const addFaculty = () => {
    const newFaculty: ExtendedFaculty = {
      id: `fac-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      position: '',
      department: '',
      email: '',
      bio: '',
      experience: '',
      skills: [],
      image: undefined,
      order: faculty.length + 1,
    };
    setFaculty([...faculty, newFaculty]);
  };

  const updateFaculty = (index: number, field: keyof ExtendedFaculty, value: any) => {
    const updatedFaculty = [...faculty];
    updatedFaculty[index] = { ...updatedFaculty[index], [field]: value };
    setFaculty(updatedFaculty);
  };

  const updateSkill = (index: number, skillIndex: number, value: string) => {
    const updatedFaculty = [...faculty];
    const skills = [...(updatedFaculty[index].skills || [])];
    skills[skillIndex] = value;
    updatedFaculty[index] = { ...updatedFaculty[index], skills };
    setFaculty(updatedFaculty);
  };

  const addSkill = (index: number) => {
    const updatedFaculty = [...faculty];
    const skills = [...(updatedFaculty[index].skills || [])];
    skills.push('');
    updatedFaculty[index] = { ...updatedFaculty[index], skills };
    setFaculty(updatedFaculty);
  };

  const removeSkill = (index: number, skillIndex: number) => {
    const updatedFaculty = [...faculty];
    const skills = [...(updatedFaculty[index].skills || [])];
    skills.splice(skillIndex, 1);
    updatedFaculty[index] = { ...updatedFaculty[index], skills };
    setFaculty(updatedFaculty);
  };

  const removeFaculty = (index: number) => {
    setFaculty(faculty.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // Save to database with template_id = 2
      const dbContent = {
        faculty: faculty.map(member => ({
          id: member.id,
          name: member.name || '',
          position: member.position || '',
          department: member.department || '',
          email: member.email || '',
          bio: member.bio || '',
          experience: member.experience || '',
          skills: member.skills || [],
          image: member.image || null,
          order: member.order || 0
        }))
      };

      console.log('Saving faculty data:', dbContent);

      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: 2,
          section_name: "Faculty",
          content: dbContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      const result = await response.json();
      console.log('Saved faculty to database:', result);
      
      // Show success popup
      setShowSuccessPopup(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving faculty:', error);
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
        `/api/sections?template_id=2&section_name=Faculty`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          if (dbContent && dbContent.faculty) {
            setFaculty(dbContent.faculty);
          }
        }
      }
    } catch (error) {
      console.error('Error reloading faculty data:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  // Handle image upload for faculty member
  const handleImageChange = (index: number, fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      updateFaculty(index, 'image', fileOrString);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateFaculty(index, 'image', reader.result as string);
    };
    reader.readAsDataURL(fileOrString);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading faculty data...</span>
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
              <p className="text-sm text-gray-300">Your Faculty section has been updated.</p>
            </div>
          </div>
        </div>
      )}

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
            {/* Add Faculty Button */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Faculty Members
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add and manage faculty member profiles (all fields are optional)
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
                      onClick={() => {
                        if (window.confirm('Are you sure you want to remove this faculty member?')) {
                          removeFaculty(index);
                        }
                      }}
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
                          Upload a professional headshot (optional)
                        </p>
                      </div>
                      <UploadImage
                        value={member.image}
                        onChange={(file) => handleImageChange(index, file)}
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
                            Full Name (optional)
                          </label>
                          <input
                            type="text"
                            value={member.name || ''}
                            onChange={(e) => updateFaculty(index, 'name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Dr. John Smith"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                            <FiBriefcase className="w-4 h-4 inline mr-2" />
                            Position/Designation (optional)
                          </label>
                          <input
                            type="text"
                            value={member.position || ''}
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
                            Department (optional)
                          </label>
                          <input
                            type="text"
                            value={member.department || ''}
                            onChange={(e) => updateFaculty(index, 'department', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Computer Science"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                            <FiMail className="w-4 h-4 inline mr-2" />
                            Email (optional)
                          </label>
                          <input
                            type="email"
                            value={member.email || ''}
                            onChange={(e) => updateFaculty(index, 'email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="john.smith@college.edu"
                          />
                        </div>
                      </div>

                      {/* NEW: Experience Field */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiAward className="w-4 h-4 inline mr-2" />
                          Experience (optional)
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Years of experience or relevant background
                        </p>
                        <input
                          type="text"
                          value={member.experience || ''}
                          onChange={(e) => updateFaculty(index, 'experience', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="15+ years in safety training"
                        />
                      </div>

                      {/* NEW: Skills Field */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                            <FiTool className="w-4 h-4 inline mr-2" />
                            Skills (optional)
                          </label>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addSkill(index)}
                            variant="outline"
                          >
                            <FiPlus className="w-4 h-4 mr-2" /> Add Skill
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Add relevant skills or expertise areas
                        </p>
                        <div className="space-y-2">
                          {(member.skills || []).map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={skill}
                                onChange={(e) => updateSkill(index, skillIndex, e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Skill or expertise"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSkill(index, skillIndex)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Bio/Description (optional)
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Write a brief professional biography
                        </p>
                        <textarea
                          value={member.bio || ''}
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
          /* View Mode - Faculty Cards with all fields */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.sort((a, b) => (a.order || 0) - (b.order || 0)).map((member) => (
              <div
                key={member.id}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <div className="text-center mb-6">
                  {member.image ? (
                    <div className="relative mx-auto mb-4">
                      <Image
                        src={member.image}
                        alt={member.name || 'Faculty Member'}
                        width={96}
                        height={96}
                        className="mx-auto rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg">
                      {member.name ? member.name.split(' ').map(n => n[0]).join('') : 'FM'}
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                    {member.name || 'Faculty Member'}
                  </h3>
                  <div className="space-y-2">
                    {member.position && (
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                        {member.position}
                      </p>
                    )}
                    {member.department && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {member.department}
                      </p>
                    )}
                    {member.experience && (
                      <p className="text-green-600 dark:text-green-400 text-sm">
                        {member.experience}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {member.bio && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                      {member.bio}
                    </p>
                  )}
                  
                  {/* Skills display */}
                  {(member.skills || []).length > 0 && (
                    <div className="pt-3">
                      <div className="flex flex-wrap gap-2">
                        {member.skills?.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {(member.skills?.length || 0) > 4 && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{(member.skills?.length || 0) - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {member.email && (
                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        <FiMail className="w-4 h-4 mr-2" />
                        {member.email}
                      </a>
                    </div>
                  )}
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
    </>
  );
}