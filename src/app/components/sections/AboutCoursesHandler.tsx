/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/AboutCoursesHandler.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiCheck,
  FiRefreshCw, FiPlus, FiTrash2
} from 'react-icons/fi';

interface AboutCoursesHandlerProps {
  college: College;
  templateId?: number;
}

interface CourseData {
  id: string;
  name: string;
  introduction: string;
  curriculum: string[];
  whatYouLearn: string[];
}

interface AboutCoursesFormData {
  sectionTitle: string;
  sectionSubtitle: string;
  badgeText: string;
  courses: CourseData[];
}

const defaultCourses: CourseData[] = [
  {
    id: 'olevel',
    name: 'O-Level',
    introduction: 'Cambridge O-Level is an internationally recognized qualification designed for students aged 14-16. It provides a strong foundation for further academic study and professional development.',
    curriculum: [
      'English Language & Literature',
      'Mathematics (Extended)',
      'Physics',
      'Chemistry',
      'Biology',
      'Accounting',
      'Business Studies',
      'Computer Science'
    ],
    whatYouLearn: [
      'Critical thinking and analytical skills',
      'Scientific inquiry and experimentation',
      'Mathematical problem-solving',
      'Effective communication in English',
      'Business and financial literacy',
      'Digital literacy and programming fundamentals'
    ]
  },
  {
    id: 'alevel',
    name: 'A-Level',
    introduction: 'Cambridge A-Level is an advanced qualification for students aged 16-19, preparing them for university education and professional careers. It offers in-depth study of specialized subjects.',
    curriculum: [
      'Physics (Advanced)',
      'Chemistry (Advanced)',
      'Biology (Advanced)',
      'Mathematics (Pure & Applied)',
      'Economics',
      'Computer Science (Advanced)',
      'Business Studies (Advanced)'
    ],
    whatYouLearn: [
      'Advanced scientific research methods',
      'Complex mathematical modeling',
      'Economic analysis and policy',
      'Software development and algorithms',
      'Strategic business management',
      'Independent research and critical evaluation'
    ]
  },
  {
    id: 'school',
    name: 'School Level',
    introduction: 'School Level education provides a comprehensive foundation in core academic subjects, preparing students for higher studies and developing essential life skills.',
    curriculum: [
      'Primary Education (Grade 1-5)',
      'Middle School (Grade 6-8)',
      'Matriculation (Science Group)',
      'Matriculation (Arts Group)',
      'Matriculation (Commerce Group)',
      'Islamic Studies Foundation'
    ],
    whatYouLearn: [
      'Basic literacy and numeracy',
      'Science and environmental awareness',
      'Social studies and civic education',
      'Arts and creative expression',
      'Physical education and health',
      'Character development and ethics'
    ]
  }
];

const defaultFormData: AboutCoursesFormData = {
  sectionTitle: 'Explore Our Programs',
  sectionSubtitle: 'Discover our comprehensive academic programs designed to shape future leaders and innovators.',
  badgeText: 'Academic Programs',
  courses: defaultCourses
};

export function AboutCoursesHandler({ college, templateId }: AboutCoursesHandlerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<AboutCoursesFormData>(defaultFormData);
  const [lastUpdated, setLastUpdated] = useState('');

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
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=AboutCourses&college_id=${collegeId}&_=${timestamp}`;
      
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
              courses: dbContent.courses || defaultFormData.courses
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load about courses data:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [templateId, college.template_id, college.id]);

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
          section_name: "AboutCourses",
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

  // ✅ Course handlers
  const addCourse = () => {
    const newId = `course_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, {
        id: newId,
        name: 'New Course',
        introduction: 'Course introduction here...',
        curriculum: ['Curriculum item 1', 'Curriculum item 2'],
        whatYouLearn: ['Learning outcome 1', 'Learning outcome 2']
      }]
    }));
  };

  const updateCourse = (index: number, field: string, value: string) => {
    const newCourses = [...formData.courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setFormData(prev => ({ ...prev, courses: newCourses }));
  };

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  // ✅ Array item handlers
  const addArrayItem = (courseIndex: number, field: 'curriculum' | 'whatYouLearn') => {
    const newCourses = [...formData.courses];
    newCourses[courseIndex][field].push(`New ${field === 'curriculum' ? 'curriculum' : 'learning outcome'} item`);
    setFormData(prev => ({ ...prev, courses: newCourses }));
  };

  const updateArrayItem = (courseIndex: number, field: 'curriculum' | 'whatYouLearn', itemIndex: number, value: string) => {
    const newCourses = [...formData.courses];
    newCourses[courseIndex][field][itemIndex] = value;
    setFormData(prev => ({ ...prev, courses: newCourses }));
  };

  const removeArrayItem = (courseIndex: number, field: 'curriculum' | 'whatYouLearn', itemIndex: number) => {
    const newCourses = [...formData.courses];
    newCourses[courseIndex][field] = newCourses[courseIndex][field].filter((_, i) => i !== itemIndex);
    setFormData(prev => ({ ...prev, courses: newCourses }));
  };

  useEffect(() => {
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading courses data...</p>
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
              <p className="font-medium">Courses Saved Successfully!</p>
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Courses Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage courses content</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2 cursor-pointer"
              onClick={() => loadFromDatabase(true)}
            >
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Courses
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="cursor-pointer">
                  <FiX className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
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
                  Modify courses content. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section Settings */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section Settings</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Badge Text</label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Section Title</label>
              <input
                type="text"
                value={formData.sectionTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, sectionTitle: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Section Subtitle</label>
              <textarea
                value={formData.sectionSubtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, sectionSubtitle: e.target.value }))}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text"
              />
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Courses</h3>
            {isEditing && (
              <Button size="sm" onClick={addCourse} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
                <FiPlus className="w-3 h-3 mr-1" /> Add Course
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {formData.courses.map((course, courseIndex) => (
              <div key={course.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Course #{courseIndex + 1}</span>
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeCourse(courseIndex)} className="text-red-500 cursor-pointer">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Course Name</label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(courseIndex, 'name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 cursor-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Introduction</label>
                    <textarea
                      value={course.introduction}
                      onChange={(e) => updateCourse(courseIndex, 'introduction', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 cursor-text"
                    />
                  </div>

                  {/* Curriculum */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Curriculum</label>
                      {isEditing && (
                        <Button size="sm" variant="outline" onClick={() => addArrayItem(courseIndex, 'curriculum')} className="text-teal-600 cursor-pointer">
                          <FiPlus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {course.curriculum.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateArrayItem(courseIndex, 'curriculum', itemIndex, e.target.value)}
                            disabled={!isEditing}
                            className="flex-1 px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 cursor-text"
                          />
                          {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => removeArrayItem(courseIndex, 'curriculum', itemIndex)} className="text-red-500 cursor-pointer">
                              <FiTrash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What You Learn */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">What You Learn</label>
                      {isEditing && (
                        <Button size="sm" variant="outline" onClick={() => addArrayItem(courseIndex, 'whatYouLearn')} className="text-teal-600 cursor-pointer">
                          <FiPlus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {course.whatYouLearn.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateArrayItem(courseIndex, 'whatYouLearn', itemIndex, e.target.value)}
                            disabled={!isEditing}
                            className="flex-1 px-3 py-1.5 border rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 cursor-text"
                          />
                          {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => removeArrayItem(courseIndex, 'whatYouLearn', itemIndex)} className="text-red-500 cursor-pointer">
                              <FiTrash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.courses.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No courses added yet. Click "Add Course" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AboutCoursesHandler;