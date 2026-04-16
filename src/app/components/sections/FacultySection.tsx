'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiUsers, 
  FiMail, 
  FiCheck, FiRefreshCw, FiLinkedin,} from 'react-icons/fi';


/* eslint-disable */

interface FacultySectionProps {
  college: College;
  templateId?: number;
}

interface FacultyMember {
  id: number;
  name: string;
  position: string;
  designation: string;
  linkedin?: string;
  email?: string;
  quote: string;
  expertise: string[];
  experience: string;
  description: string;
  image: string;
  order: number;
}

export function FacultySection({ college, templateId }: FacultySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getActiveTemplateId = () => {
    return templateId || college.template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt(college.id);
  };

  // Load faculty from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Faculty&college_id=${collegeId}&_=${timestamp}`;
      
      console.log('🔄 [Faculty] Fetching faculty data from:', url);
      
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
          
          if (dbContent && dbContent.faculty && Array.isArray(dbContent.faculty)) {
            setFaculty(dbContent.faculty);
            console.log('✅ [Faculty] Loaded', dbContent.faculty.length, 'faculty members');
          } else {
            setFaculty([]);
          }
        }
      }
    } catch (error) {
      console.error('❌ [Faculty] Failed to load:', error);
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
        faculty: faculty
      };
      
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: activeTemplateId,
          section_name: "Faculty",
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
      console.error('Error saving faculty:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Add new faculty
  const addFaculty = () => {
    const newId = Math.max(...faculty.map(f => f.id), 0) + 1;
    const newFaculty: FacultyMember = {
      id: newId,
      name: '',
      position: '',
      designation: '',
      linkedin: '',
      email: '',
      quote: '',
      expertise: [],
      experience: '',
      description: '',
      image: '',
      order: faculty.length
    };
    setFaculty([...faculty, newFaculty]);
  };

  // Update faculty
  const updateFaculty = (index: number, field: keyof FacultyMember, value: any) => {
    const updated = [...faculty];
    updated[index] = { ...updated[index], [field]: value };
    setFaculty(updated);
  };

  // Remove faculty
  const removeFaculty = (index: number) => {
    if (confirm('Are you sure you want to remove this faculty member?')) {
      setFaculty(faculty.filter((_, i) => i !== index));
    }
  };

  // Move faculty up/down
  const moveFaculty = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faculty.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...faculty];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Update order numbers
    updated.forEach((f, idx) => { f.order = idx; });
    setFaculty(updated);
  };

  // Handle expertise array
  const addExpertise = (index: number) => {
    const updated = [...faculty];
    updated[index].expertise = [...(updated[index].expertise || []), ''];
    setFaculty(updated);
  };

  const updateExpertise = (index: number, expIndex: number, value: string) => {
    const updated = [...faculty];
    updated[index].expertise[expIndex] = value;
    setFaculty(updated);
  };

  const removeExpertise = (index: number, expIndex: number) => {
    const updated = [...faculty];
    updated[index].expertise = updated[index].expertise.filter((_, i) => i !== expIndex);
    setFaculty(updated);
  };

  // Handle image upload
  const handleImageUpload = (index: number, fileOrString: File | string) => {
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

  const refreshData = async () => {
    await loadFromDatabase(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading faculty...</p>
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
              <p className="text-sm text-green-100">Faculty updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Faculty Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage faculty members</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Manage Faculty
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
              <FiUsers className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Add, remove, or reorder faculty members. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Faculty Members</h3>
              <Button onClick={addFaculty} className="bg-teal-600">
                <FiPlus className="w-4 h-4 mr-2" /> Add Faculty
              </Button>
            </div>

            <div className="space-y-4">
              {faculty.map((member, index) => (
                <div key={member.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Order: {index + 1}</span>
                      <div className="flex gap-1">
                        <button onClick={() => moveFaculty(index, 'up')} className="p-1 text-gray-500 hover:text-teal-600" disabled={index === 0}>↑</button>
                        <button onClick={() => moveFaculty(index, 'down')} className="p-1 text-gray-500 hover:text-teal-600" disabled={index === faculty.length - 1}>↓</button>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFaculty(index)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image</label>
                      <UploadImage
                        value={member.image}
                        onChange={(file) => handleImageUpload(index, file)}
                        onRemove={() => updateFaculty(index, 'image', '')}
                        aspectRatio="square"
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFaculty(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          placeholder="Dr. Sarah Johnson"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                          <input
                            type="text"
                            value={member.position}
                            onChange={(e) => updateFaculty(index, 'position', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            placeholder="Dean of Academic Affairs"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Designation</label>
                          <input
                            type="text"
                            value={member.designation}
                            onChange={(e) => updateFaculty(index, 'designation', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            placeholder="Professor of Computer Science"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
                          <input
                            type="text"
                            value={member.linkedin || ''}
                            onChange={(e) => updateFaculty(index, 'linkedin', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            value={member.email || ''}
                            onChange={(e) => updateFaculty(index, 'email', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                            placeholder="sarah@college.edu"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</label>
                        <input
                          type="text"
                          value={member.experience}
                          onChange={(e) => updateFaculty(index, 'experience', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          placeholder="15+ Years"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quote</label>
                        <textarea
                          value={member.quote}
                          onChange={(e) => updateFaculty(index, 'quote', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white resize-none"
                          placeholder="Education is not the learning of facts, but the training of the mind to think."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea
                          value={member.description}
                          onChange={(e) => updateFaculty(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white resize-none"
                          placeholder="A visionary educator who bridges cutting-edge technology with accessible learning..."
                        />
                      </div>

                      {/* Expertise */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expertise</label>
                          <button onClick={() => addExpertise(index)} className="text-teal-600 text-sm hover:underline">+ Add</button>
                        </div>
                        <div className="space-y-2">
                          {member.expertise.map((exp, expIndex) => (
                            <div key={expIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={exp}
                                onChange={(e) => updateExpertise(index, expIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white text-sm"
                                placeholder="AI Research"
                              />
                              <button onClick={() => removeExpertise(index, expIndex)} className="text-red-500 px-2">✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {faculty.length === 0 && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No faculty members added yet. Click "Add Faculty" to get started.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* View Mode - Simple list (will be replaced by live template styling) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((member) => (
              <div key={member.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="text-center mb-4">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-teal-500" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto">
                      <FiUsers className="w-12 h-12 text-teal-500" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{member.name}</h3>
                  <p className="text-teal-600 dark:text-teal-400 font-medium">{member.designation}</p>
                  <p className="text-gray-500 text-sm">{member.position}</p>
                  <p className="text-gray-400 text-sm mt-1">{member.experience}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm text-center italic">"{member.quote}"</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {member.expertise.slice(0, 3).map((exp, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">{exp}</span>
                  ))}
                </div>
                <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-teal-600">
                      <FiLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-teal-600">
                      <FiMail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isEditing && faculty.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
              <FiUsers className="w-10 h-10 text-teal-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">No Faculty Members Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Click "Manage Faculty" to add faculty members.</p>
            <Button onClick={() => setIsEditing(true)} className="bg-teal-600">
              <FiPlus className="w-4 h-4 mr-2" /> Add Faculty
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default FacultySection;