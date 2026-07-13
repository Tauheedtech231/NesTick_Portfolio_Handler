/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/ProgramsCoursesSection.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiBook, FiBriefcase, FiSearch
} from 'react-icons/fi';

interface ProgramsCoursesSectionProps {
  college: College;
  templateId?: number;
  sectionType: 'programs' | 'courses';
}

interface Program {
  id: number;
  name: string;
  full: string;
  duration: string;
  level: string;
  description?: string;
  eligibility?: string;
}

interface LevelData {
  id: string;
  label: string;
  color: string;
  programs: Program[];
}

interface FormData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  levels: LevelData[];
}

const defaultLevels: LevelData[] = [
  {
    id: 'school',
    label: 'School Level',
    color: '#2f56fb',
    programs: [
      { id: 1, name: 'Primary School', full: 'Primary Education (Grade 1–5)', duration: '5 Years', level: 'school' },
      { id: 2, name: 'Middle School', full: 'Middle School Education (Grade 6–8)', duration: '3 Years', level: 'school' },
      { id: 3, name: 'Matriculation', full: 'Matric (Science Group)', duration: '2 Years', level: 'school' },
    ]
  },
  {
    id: 'college',
    label: 'College Level',
    color: '#0D9488',
    programs: [
      { id: 4, name: 'BA', full: 'Bachelor of Arts', duration: '4 Years', level: 'college' },
      { id: 5, name: 'B.Sc', full: 'Bachelor of Science', duration: '4 Years', level: 'college' },
      { id: 6, name: 'B.Com', full: 'Bachelor of Commerce', duration: '4 Years', level: 'college' },
    ]
  }
];

const defaultFormData: FormData = {
  heroTitle: 'Our Programs',
  heroSubtitle: 'Discover your path to success with our diverse range of programs',
  heroImage: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1074&auto=format&fit=crop',
  levels: defaultLevels
};

const colorOptions = [
  { value: '#2f56fb', label: 'Blue' },
  { value: '#0D9488', label: 'Teal' },
  { value: '#7c3aed', label: 'Purple' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#0ea5e9', label: 'Sky' },
  { value: '#ef4444', label: 'Red' },
  { value: '#22c55e', label: 'Green' },
  { value: '#ec4899', label: 'Pink' },
];

export function ProgramsCoursesSection({ college, templateId, sectionType }: ProgramsCoursesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [lastUpdated, setLastUpdated] = useState('');

  const sectionName = sectionType === 'programs' ? 'Programs' : 'Courses';
  const sectionLabel = sectionType === 'programs' ? 'Programs' : 'Courses';

  const getActiveTemplateId = () => {
    return templateId || (college as any).template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt((college as any).id);
  };

  // ✅ Load from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=${sectionName}&college_id=${collegeId}&_=${timestamp}`;
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          setLastUpdated(data.sections[0].updated_at);
          
          if (dbContent && Object.keys(dbContent).length > 0) {
            setFormData({
              ...defaultFormData,
              ...dbContent,
              levels: dbContent.levels || defaultFormData.levels
            });
          }
        }
      }
    } catch (error) {
      console.error(`Failed to load ${sectionName} data:`, error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [templateId, college.template_id, college.id, sectionName]);

  // ✅ Save to database
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: activeTemplateId,
          section_name: sectionName,
          college_id: collegeId,
          content: formData
        })
      });
      
      if (response.ok) {
        setShowSuccessPopup(true);
        setIsEditing(false);
        await loadFromDatabase(false);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Level handlers
  const addLevel = () => {
    const newId = `level_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      levels: [...prev.levels, {
        id: newId,
        label: 'New Level',
        color: '#2f56fb',
        programs: []
      }]
    }));
  };

  const updateLevel = (index: number, field: string, value: string) => {
    const newLevels = [...formData.levels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    setFormData(prev => ({ ...prev, levels: newLevels }));
  };

  const removeLevel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      levels: prev.levels.filter((_, i) => i !== index)
    }));
  };

  // ✅ Program handlers
  const addProgram = (levelIndex: number) => {
    const newLevels = [...formData.levels];
    const newId = Date.now() + Math.random() * 1000;
    newLevels[levelIndex].programs.push({
      id: newId,
      name: 'New Program',
      full: 'Full program name',
      duration: '2 Years',
      level: newLevels[levelIndex].id
    });
    setFormData(prev => ({ ...prev, levels: newLevels }));
  };

  const updateProgram = (levelIndex: number, programIndex: number, field: string, value: string) => {
    const newLevels = [...formData.levels];
    newLevels[levelIndex].programs[programIndex] = { 
      ...newLevels[levelIndex].programs[programIndex], 
      [field]: value 
    };
    setFormData(prev => ({ ...prev, levels: newLevels }));
  };

  const removeProgram = (levelIndex: number, programIndex: number) => {
    const newLevels = [...formData.levels];
    newLevels[levelIndex].programs = newLevels[levelIndex].programs.filter((_, i) => i !== programIndex);
    setFormData(prev => ({ ...prev, levels: newLevels }));
  };

  useEffect(() => {
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading {sectionLabel} data...</p>
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
              <p className="font-medium">{sectionLabel} Saved Successfully!</p>
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{sectionLabel} Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage {sectionLabel.toLowerCase()} content</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => loadFromDatabase(true)}>
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit {sectionLabel}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <FiX className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                  <FiSave className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save All Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Modify {sectionLabel.toLowerCase()} content. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Settings */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hero Settings</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, heroTitle: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image URL</label>
              <input
                type="text"
                value={formData.heroImage}
                onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Levels and Programs */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sectionLabel} Levels</h3>
            {isEditing && (
              <Button size="sm" onClick={addLevel} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Level
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {formData.levels.map((level, levelIndex) => (
              <div key={level.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Level #{levelIndex + 1}</span>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeLevel(levelIndex)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Level Label</label>
                    <input
                      type="text"
                      value={level.label}
                      onChange={(e) => updateLevel(levelIndex, 'label', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Color</label>
                    <select
                      value={level.color}
                      onChange={(e) => updateLevel(levelIndex, 'color', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      {colorOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Programs</h4>
                    {isEditing && (
                      <Button size="sm" variant="outline" onClick={() => addProgram(levelIndex)} className="text-teal-600">
                        <FiPlus className="w-3 h-3 mr-1" /> Add Program
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {level.programs.map((program, programIndex) => (
                      <div key={program.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Program #{programIndex + 1}</span>
                          {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => removeProgram(levelIndex, programIndex)} className="text-red-500">
                              <FiTrash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400">Name</label>
                            <input
                              type="text"
                              value={program.name}
                              onChange={(e) => updateProgram(levelIndex, programIndex, 'name', e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-2 py-1 border rounded text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400">Full Name</label>
                            <input
                              type="text"
                              value={program.full}
                              onChange={(e) => updateProgram(levelIndex, programIndex, 'full', e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-2 py-1 border rounded text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400">Duration</label>
                            <input
                              type="text"
                              value={program.duration}
                              onChange={(e) => updateProgram(levelIndex, programIndex, 'duration', e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-2 py-1 border rounded text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400">Level</label>
                            <input
                              type="text"
                              value={program.level || ''}
                              onChange={(e) => updateProgram(levelIndex, programIndex, 'level', e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-2 py-1 border rounded text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProgramsCoursesSection;