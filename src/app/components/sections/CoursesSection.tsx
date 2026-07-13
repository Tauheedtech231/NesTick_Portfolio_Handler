'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiBook, 
  FiClock, FiUser, FiAward, FiRefreshCw, FiCheck,
  FiBriefcase, FiUsers, FiCalendar, FiSearch
} from 'react-icons/fi';
import { FaCertificate, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';

/* eslint-disable */

interface CoursesSectionProps {
  college: College;
  templateId?: number;
}

interface Program {
  id: number;
  name: string;
  full: string;
  duration: string;
  level: string;
  image?: string;
  description?: string;
  eligibility?: string;
}

interface LevelData {
  id: string;
  label: string;
  countLabel: string;
  programs: Program[];
}

interface Highlight {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface CoursesData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  highlights: Highlight[];
  levels: LevelData[];
}

const defaultLevels: LevelData[] = [
  {
    id: 'school',
    label: 'School Level',
    countLabel: '06 Programs',
    programs: [
      { id: 1, name: 'Primary School', full: 'Primary Education (Grade 1–5)', duration: '5 Years', level: 'school' },
      { id: 2, name: 'Middle School', full: 'Middle School Education (Grade 6–8)', duration: '3 Years', level: 'school' },
      { id: 3, name: 'Matriculation', full: 'Matric (Science Group)', duration: '2 Years', level: 'school' },
      { id: 4, name: 'Matriculation (Arts)', full: 'Matric (Arts Group)', duration: '2 Years', level: 'school' },
      { id: 5, name: 'Matriculation (Commerce)', full: 'Matric (Commerce Group)', duration: '2 Years', level: 'school' },
      { id: 6, name: 'Islamic Studies (Foundation)', full: 'Dars-e-Nizami / Islamic Foundation Course', duration: '2 Years', level: 'school' },
    ],
  },
  {
    id: 'olevel',
    label: 'O-Level',
    countLabel: '08 Programs',
    programs: [
      { id: 7, name: 'English Language', full: 'Cambridge O-Level English', duration: '2 Years', level: 'olevel' },
      { id: 8, name: 'Mathematics', full: 'Cambridge O-Level Mathematics', duration: '2 Years', level: 'olevel' },
      { id: 9, name: 'Physics', full: 'Cambridge O-Level Physics', duration: '2 Years', level: 'olevel' },
      { id: 10, name: 'Chemistry', full: 'Cambridge O-Level Chemistry', duration: '2 Years', level: 'olevel' },
      { id: 11, name: 'Biology', full: 'Cambridge O-Level Biology', duration: '2 Years', level: 'olevel' },
      { id: 12, name: 'Accounting', full: 'Cambridge O-Level Accounting', duration: '2 Years', level: 'olevel' },
      { id: 13, name: 'Business Studies', full: 'Cambridge O-Level Business Studies', duration: '2 Years', level: 'olevel' },
      { id: 14, name: 'Computer Science', full: 'Cambridge O-Level Computer Science', duration: '2 Years', level: 'olevel' },
    ],
  },
  {
    id: 'alevel',
    label: 'A-Level',
    countLabel: '07 Programs',
    programs: [
      { id: 15, name: 'Physics', full: 'Cambridge A-Level Physics', duration: '2 Years', level: 'alevel' },
      { id: 16, name: 'Chemistry', full: 'Cambridge A-Level Chemistry', duration: '2 Years', level: 'alevel' },
      { id: 17, name: 'Biology', full: 'Cambridge A-Level Biology', duration: '2 Years', level: 'alevel' },
      { id: 18, name: 'Mathematics', full: 'Cambridge A-Level Mathematics', duration: '2 Years', level: 'alevel' },
      { id: 19, name: 'Economics', full: 'Cambridge A-Level Economics', duration: '2 Years', level: 'alevel' },
      { id: 20, name: 'Computer Science', full: 'Cambridge A-Level Computer Science', duration: '2 Years', level: 'alevel' },
      { id: 21, name: 'Business Studies', full: 'Cambridge A-Level Business Studies', duration: '2 Years', level: 'alevel' },
    ],
  },
  {
    id: 'college',
    label: 'College Level',
    countLabel: '10 Programs',
    programs: [
      { id: 22, name: 'BA', full: 'Bachelor of Arts', duration: '4 Years', level: 'college' },
      { id: 23, name: 'B.Sc', full: 'Bachelor of Science', duration: '4 Years', level: 'college' },
      { id: 24, name: 'B.Com', full: 'Bachelor of Commerce', duration: '4 Years', level: 'college' },
      { id: 25, name: 'BS (CS)', full: 'Bachelor of Science in Computer Science', duration: '4 Years', level: 'college' },
      { id: 26, name: 'BS (IT)', full: 'Bachelor of Science in Information Technology', duration: '4 Years', level: 'college' },
      { id: 27, name: 'BBA', full: 'Bachelor of Business Administration', duration: '4 Years', level: 'college' },
      { id: 28, name: 'B.Ed', full: 'Bachelor of Education', duration: '4 Years', level: 'college' },
      { id: 29, name: 'LLB', full: 'Bachelor of Laws', duration: '5 Years', level: 'college' },
      { id: 30, name: 'DPT', full: 'Doctor of Physical Therapy', duration: '5 Years', level: 'college' },
      { id: 31, name: 'ADP', full: 'Associate Degree Program', duration: '2 Years', level: 'college' },
    ],
  },
  {
    id: 'tech',
    label: 'Technical Level',
    countLabel: '09 Programs',
    programs: [
      { id: 32, name: 'Diploma in IT', full: 'Diploma in Information Technology', duration: '2 Years', level: 'tech' },
      { id: 33, name: 'Diploma in Civil', full: 'Diploma in Civil Engineering', duration: '3 Years', level: 'tech' },
      { id: 34, name: 'Diploma in Electrical', full: 'Diploma in Electrical Engineering', duration: '3 Years', level: 'tech' },
      { id: 35, name: 'Diploma in Mechanical', full: 'Diploma in Mechanical Engineering', duration: '3 Years', level: 'tech' },
      { id: 36, name: 'Graphic Design', full: 'Diploma in Graphic Design', duration: '1 Year', level: 'tech' },
      { id: 37, name: 'Web Development', full: 'Diploma in Web Development', duration: '1 Year', level: 'tech' },
      { id: 38, name: 'AutoCAD', full: 'Diploma in AutoCAD', duration: '6 Months', level: 'tech' },
      { id: 39, name: 'Spoken English', full: 'Spoken English Certification', duration: '6 Months', level: 'tech' },
      { id: 40, name: 'Short Courses', full: 'Various Short Technical Courses', duration: '3–6 Months', level: 'tech' },
    ],
  },
];

const defaultCoursesData: CoursesData = {
  heroTitle: "Our Programs",
  heroSubtitle: "Discover your path to success with our diverse range of programs",
  heroImage: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1074&auto=format&fit=crop",
  highlights: [
    { id: 1, icon: "FaCertificate", title: "Internationally Recognized", description: "Certifications accepted by global organizations" },
    { id: 2, icon: "FaCalendarAlt", title: "Flexible Schedule", description: "Weekend, evening & online batches" },
    { id: 3, icon: "FaShieldAlt", title: "Career Support", description: "Placement assistance for all graduates" }
  ],
  levels: defaultLevels
};

const iconMap: Record<string, any> = {
  FaCertificate: FaCertificate,
  FaCalendarAlt: FaCalendarAlt,
  FaShieldAlt: FaShieldAlt,
  default: FiAward
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || iconMap.default;
};

export function CoursesSection({ college, templateId }: CoursesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [coursesData, setCoursesData] = useState<CoursesData>(defaultCoursesData);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getActiveTemplateId = () => {
    return templateId || college.template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt(college.id);
  };

  // Load from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Programs&college_id=${collegeId}&_=${timestamp}`;
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          setLastUpdated(data.sections[0].updated_at);
          
          if (dbContent) {
            setCoursesData({
              heroTitle: dbContent.heroTitle || defaultCoursesData.heroTitle,
              heroSubtitle: dbContent.heroSubtitle || defaultCoursesData.heroSubtitle,
              heroImage: dbContent.heroImage || defaultCoursesData.heroImage,
              highlights: dbContent.highlights || defaultCoursesData.highlights,
              levels: dbContent.levels || defaultCoursesData.levels
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load:', error);
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
      
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: activeTemplateId,
          section_name: "Programs",
          college_id: collegeId,
          content: coursesData
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
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Level handlers
  const addLevel = () => {
    const newId = `level_${Date.now()}`;
    setCoursesData(prev => ({
      ...prev,
      levels: [...prev.levels, {
        id: newId,
        label: 'New Level',
        countLabel: '0 Programs',
        programs: []
      }]
    }));
  };

  const updateLevel = (index: number, field: string, value: string) => {
    const newLevels = [...coursesData.levels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    setCoursesData(prev => ({ ...prev, levels: newLevels }));
  };

  const removeLevel = (index: number) => {
    setCoursesData(prev => ({
      ...prev,
      levels: prev.levels.filter((_, i) => i !== index)
    }));
  };

  // Program handlers
  const addProgram = (levelIndex: number) => {
    const newLevels = [...coursesData.levels];
    const newId = Date.now() + Math.random() * 1000;
    newLevels[levelIndex].programs.push({
      id: newId,
      name: 'New Program',
      full: 'Full program name',
      duration: '2 Years',
      level: newLevels[levelIndex].id
    });
    // Update count label
    newLevels[levelIndex].countLabel = `${newLevels[levelIndex].programs.length} Programs`;
    setCoursesData(prev => ({ ...prev, levels: newLevels }));
  };

  const updateProgram = (levelIndex: number, programIndex: number, field: string, value: string) => {
    const newLevels = [...coursesData.levels];
    newLevels[levelIndex].programs[programIndex] = { 
      ...newLevels[levelIndex].programs[programIndex], 
      [field]: value 
    };
    setCoursesData(prev => ({ ...prev, levels: newLevels }));
  };

  const removeProgram = (levelIndex: number, programIndex: number) => {
    const newLevels = [...coursesData.levels];
    newLevels[levelIndex].programs = newLevels[levelIndex].programs.filter((_, i) => i !== programIndex);
    newLevels[levelIndex].countLabel = `${newLevels[levelIndex].programs.length} Programs`;
    setCoursesData(prev => ({ ...prev, levels: newLevels }));
  };

  // Highlight handlers
  const addHighlight = () => {
    const newId = Math.max(...coursesData.highlights.map(h => h.id), 0) + 1;
    setCoursesData(prev => ({
      ...prev,
      highlights: [...prev.highlights, { id: newId, icon: "FaCertificate", title: "", description: "" }]
    }));
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    const newHighlights = [...coursesData.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setCoursesData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const removeHighlight = (index: number) => {
    setCoursesData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (levelIndex: number, programIndex: number, fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      updateProgram(levelIndex, programIndex, 'image', fileOrString);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProgram(levelIndex, programIndex, 'image', reader.result as string);
    };
    reader.readAsDataURL(fileOrString);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <FiCheck className="w-5 h-5" />
            <div>
              <p className="font-medium">Programs Saved Successfully!</p>
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Programs Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage programs content</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Programs
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
              <FiBook className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Modify programs content. Changes will be saved to database.
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
                value={coursesData.heroTitle}
                onChange={(e) => setCoursesData(prev => ({ ...prev, heroTitle: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={coursesData.heroSubtitle}
                onChange={(e) => setCoursesData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image URL</label>
              <input
                type="text"
                value={coursesData.heroImage}
                onChange={(e) => setCoursesData(prev => ({ ...prev, heroImage: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Highlights</h3>
            {isEditing && (
              <Button size="sm" onClick={addHighlight} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Highlight
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {coursesData.highlights.map((highlight, index) => (
              <div key={highlight.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium">Highlight {index + 1}</span>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeHighlight(index)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={highlight.icon}
                    onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                    disabled={!isEditing}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  >
                    <option value="FaCertificate">Certificate</option>
                    <option value="FaCalendarAlt">Calendar</option>
                    <option value="FaShieldAlt">Shield</option>
                  </select>
                  <input
                    type="text"
                    value={highlight.title}
                    onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Title"
                    className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    value={highlight.description}
                    onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Description"
                    className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Levels and Programs */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Program Levels</h3>
            {isEditing && (
              <Button size="sm" onClick={addLevel} className="bg-teal-600">
                <FiPlus className="w-3 h-3 mr-1" /> Add Level
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {coursesData.levels.map((level, levelIndex) => (
              <div key={level.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Level #{levelIndex + 1}</span>
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
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Count Label</label>
                    <input
                      type="text"
                      value={level.countLabel}
                      onChange={(e) => updateLevel(levelIndex, 'countLabel', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
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
                      <div key={program.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200">
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
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 dark:text-gray-400">Program Image</label>
                            <UploadImage
                              value={program.image || ''}
                              onChange={(file) => handleImageUpload(levelIndex, programIndex, file)}
                              onRemove={() => handleImageUpload(levelIndex, programIndex, '')}
                              aspectRatio="video"
                              disabled={!isEditing}
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

export default CoursesSection;