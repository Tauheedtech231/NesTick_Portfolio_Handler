'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiBook, FiTag, 
  FiClock, FiCreditCard, FiUser, FiStar, FiAward, FiRefreshCw, FiCheck
} from 'react-icons/fi';
import { FaCertificate, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';

/* eslint-disable */

interface CoursesSectionProps {
  college: College;
  templateId?: number;
}

interface Course {
  id: number;
  image: string;
  title: string;
  participants: number;
  duration: string;
  instructor: string;
  category: string;
  rating: number;
  description: string;
  features: string[];
  level: string;
  price: string;
}

interface Highlight {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface CoursesData {
  sectionTitle: string;
  sectionDescription: string;
  highlights: Highlight[];
  courses: Course[];
}

const defaultCoursesData: CoursesData = {
  sectionTitle: "Our Featured Programs",
  sectionDescription: "Industry-recognized safety training programs with hands-on experience and expert guidance",
  highlights: [
    { id: 1, icon: "FaCertificate", title: "Internationally Recognized", description: "Certifications accepted by global organizations" },
    { id: 2, icon: "FaCalendarAlt", title: "Flexible Schedule", description: "Weekend, evening & online batches" },
    { id: 3, icon: "FaShieldAlt", title: "Career Support", description: "Placement assistance for all graduates" }
  ],
  courses: []
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getActiveTemplateId = () => {
    return templateId || college.template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt(college.id);
  };

  // Load courses from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Courses&college_id=${collegeId}&_=${timestamp}`;
      
      console.log('🔄 [Courses] Fetching courses data from:', url);
      
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
          
          if (dbContent) {
            setCoursesData({
              sectionTitle: dbContent.sectionTitle || defaultCoursesData.sectionTitle,
              sectionDescription: dbContent.sectionDescription || defaultCoursesData.sectionDescription,
              highlights: dbContent.highlights || defaultCoursesData.highlights,
              courses: dbContent.courses || []
            });
            console.log('✅ [Courses] Loaded', dbContent.courses?.length || 0, 'courses');
          }
        }
      }
    } catch (error) {
      console.error('❌ [Courses] Failed to load:', error);
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
          section_name: "Courses",
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
        const error = await response.json();
        alert('Failed to save: ' + (error.error || error.message));
      }
    } catch (error) {
      console.error('Error saving courses:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Add course
  const addCourse = () => {
    const newId = Math.max(...coursesData.courses.map(c => c.id), 0) + 1;
    const newCourse: Course = {
      id: newId,
      image: "",
      title: "",
      participants: 0,
      duration: "",
      instructor: "",
      category: "",
      rating: 4.0,
      description: "",
      features: [],
      level: "Beginner",
      price: "$0"
    };
    setCoursesData(prev => ({ ...prev, courses: [...prev.courses, newCourse] }));
  };

  // Update course
  const updateCourse = (index: number, field: keyof Course, value: any) => {
    const updatedCourses = [...coursesData.courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCoursesData(prev => ({ ...prev, courses: updatedCourses }));
  };

  // Remove course
  const removeCourse = (index: number) => {
    if (confirm('Are you sure you want to remove this course?')) {
      setCoursesData(prev => ({
        ...prev,
        courses: prev.courses.filter((_, i) => i !== index)
      }));
    }
  };

  // Move course up/down
  const moveCourse = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === coursesData.courses.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...coursesData.courses];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setCoursesData(prev => ({ ...prev, courses: updated }));
  };

  // Add highlight
  const addHighlight = () => {
    const newId = Math.max(...coursesData.highlights.map(h => h.id), 0) + 1;
    const newHighlight: Highlight = {
      id: newId,
      icon: "FaCertificate",
      title: "",
      description: ""
    };
    setCoursesData(prev => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight]
    }));
  };

  // Update highlight
  const updateHighlight = (index: number, field: keyof Highlight, value: string) => {
    const updatedHighlights = [...coursesData.highlights];
    updatedHighlights[index] = { ...updatedHighlights[index], [field]: value };
    setCoursesData(prev => ({ ...prev, highlights: updatedHighlights }));
  };

  // Remove highlight
  const removeHighlight = (index: number) => {
    setCoursesData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Add feature
  const addFeature = (courseIndex: number) => {
    const updatedCourses = [...coursesData.courses];
    updatedCourses[courseIndex].features.push("");
    setCoursesData(prev => ({ ...prev, courses: updatedCourses }));
  };

  // Update feature
  const updateFeature = (courseIndex: number, featureIndex: number, value: string) => {
    const updatedCourses = [...coursesData.courses];
    updatedCourses[courseIndex].features[featureIndex] = value;
    setCoursesData(prev => ({ ...prev, courses: updatedCourses }));
  };

  // Remove feature
  const removeFeature = (courseIndex: number, featureIndex: number) => {
    const updatedCourses = [...coursesData.courses];
    updatedCourses[courseIndex].features.splice(featureIndex, 1);
    setCoursesData(prev => ({ ...prev, courses: updatedCourses }));
  };

  // Handle image upload
  const handleImageUpload = (index: number, fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      updateCourse(index, 'image', fileOrString);
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      updateCourse(index, 'image', reader.result as string);
    };
    reader.readAsDataURL(fileOrString);
  };

  const refreshData = async () => {
    await loadFromDatabase(true);
  };

  const categories = ['all', ...new Set(coursesData.courses.map(c => c.category).filter(Boolean))];
  const filteredCourses = selectedCategory === 'all' 
    ? coursesData.courses 
    : coursesData.courses.filter(c => c.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading courses...</p>
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
              <p className="font-medium">Changes Saved Successfully!</p>
              <p className="text-sm text-green-100">Courses updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage training programs and courses</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Manage Courses
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
              <FiBook className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Add, remove, or reorder courses. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing ? (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section Header</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={coursesData.sectionTitle}
                    onChange={(e) => setCoursesData(prev => ({ ...prev, sectionTitle: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section Description</label>
                  <textarea
                    value={coursesData.sectionDescription}
                    onChange={(e) => setCoursesData(prev => ({ ...prev, sectionDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Highlights</h3>
                <Button size="sm" onClick={addHighlight} className="bg-teal-600">
                  <FiPlus className="w-3 h-3 mr-1" /> Add Highlight
                </Button>
              </div>
              <div className="space-y-4">
                {coursesData.highlights.map((highlight, index) => {
                  const IconComponent = getIconComponent(highlight.icon);
                  return (
                    <div key={highlight.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-teal-500" />
                          <span className="font-medium">Highlight {index + 1}</span>
                        </div>
                        <button onClick={() => removeHighlight(index)} className="text-red-500">
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                          value={highlight.icon}
                          onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                          className="px-3 py-2 border rounded-lg dark:bg-gray-800"
                        >
                          <option value="FaCertificate">Certificate</option>
                          <option value="FaCalendarAlt">Calendar</option>
                          <option value="FaShieldAlt">Shield</option>
                        </select>
                        <input
                          type="text"
                          value={highlight.title}
                          onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                          placeholder="Title"
                          className="px-3 py-2 border rounded-lg dark:bg-gray-800"
                        />
                        <input
                          type="text"
                          value={highlight.description}
                          onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="px-3 py-2 border rounded-lg dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courses */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Courses</h3>
                <Button onClick={addCourse} className="bg-teal-600">
                  <FiPlus className="w-4 h-4 mr-2" /> Add Course
                </Button>
              </div>

              <div className="space-y-4">
                {coursesData.courses.map((course, index) => (
                  <div key={course.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Course {index + 1}</span>
                        <div className="flex gap-1">
                          <button onClick={() => moveCourse(index, 'up')} className="p-1 text-gray-500 hover:text-teal-600" disabled={index === 0}>↑</button>
                          <button onClick={() => moveCourse(index, 'down')} className="p-1 text-gray-500 hover:text-teal-600" disabled={index === coursesData.courses.length - 1}>↓</button>
                        </div>
                      </div>
                      <button onClick={() => removeCourse(index)} className="text-red-500">
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Image</label>
                        <UploadImage
                          value={course.image}
                          onChange={(file) => handleImageUpload(index, file)}
                          onRemove={() => updateCourse(index, 'image', '')}
                          aspectRatio="video"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={course.title}
                          onChange={(e) => updateCourse(index, 'title', e.target.value)}
                          placeholder="Course Title"
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={course.category}
                            onChange={(e) => updateCourse(index, 'category', e.target.value)}
                            placeholder="Category"
                            className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={course.duration}
                            onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                            placeholder="Duration (e.g., 12 weeks)"
                            className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={course.instructor}
                            onChange={(e) => updateCourse(index, 'instructor', e.target.value)}
                            placeholder="Instructor"
                            className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={course.price}
                            onChange={(e) => updateCourse(index, 'price', e.target.value)}
                            placeholder="Price (e.g., $199)"
                            className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={course.participants}
                            onChange={(e) => updateCourse(index, 'participants', parseInt(e.target.value) || 0)}
                            placeholder="Participants"
                            className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          />
                          <select
                            value={course.level}
                            onChange={(e) => updateCourse(index, 'level', e.target.value)}
                            className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <textarea
                          value={course.description}
                          onChange={(e) => updateCourse(index, 'description', e.target.value)}
                          rows={3}
                          placeholder="Course Description"
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white resize-none"
                        />
                        
                        {/* Features */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
                            <button onClick={() => addFeature(index)} className="text-teal-600 text-sm">+ Add</button>
                          </div>
                          <div className="space-y-2">
                            {course.features.map((feature, fIdx) => (
                              <div key={fIdx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={feature}
                                  onChange={(e) => updateFeature(index, fIdx, e.target.value)}
                                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white text-sm"
                                  placeholder="Feature"
                                />
                                <button onClick={() => removeFeature(index, fIdx)} className="text-red-500 px-2">✕</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {coursesData.courses.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No courses added yet. Click "Add Course" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{coursesData.sectionTitle}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{coursesData.sectionDescription}</p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coursesData.highlights.map((highlight) => {
                const IconComponent = getIconComponent(highlight.icon);
                return (
                  <div key={highlight.id} className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border">
                    <IconComponent className="w-10 h-10 text-teal-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{highlight.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{highlight.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border hover:shadow-lg transition-all">
                  {course.image && (
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                      <span className="text-sm font-medium text-yellow-500">★ {course.rating}</span>
                    </div>
                    <p className="text-teal-600 text-sm mb-3">{course.category}</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <span>🕒 {course.duration}</span>
                      <span>👨‍🏫 {course.instructor}</span>
                      <span>👥 {course.participants}</span>
                      <span>📚 {course.level}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.features.slice(0, 3).map((f, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">{f}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{course.price}</span>
                      <Button className="bg-teal-600 hover:bg-teal-700">Enroll Now</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-16">
                <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Courses Found</h3>
                <p className="text-gray-500">No courses available in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default CoursesSection;