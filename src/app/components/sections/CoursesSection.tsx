'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; 
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiBook, FiTag, FiClock, FiCreditCard, FiUser, FiStar, FiAward } from 'react-icons/fi';
import { FaCertificate, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
/* eslint-disable */
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

interface College {
  id: string;
  name: string;
}

interface CoursesSectionProps {
  college: College;
}

export function CoursesSection({ }: CoursesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [coursesData, setCoursesData] = useState<CoursesData>({
    sectionTitle: "Our Featured Programs",
    sectionDescription: "Industry-recognized safety training programs with hands-on experience and expert guidance",
    highlights: [
      {
        id: 1,
        icon: "FaCertificate",
        title: "Internationally Recognized",
        description: "Certifications accepted by global organizations and regulatory bodies"
      },
      {
        id: 2,
        icon: "FaCalendarAlt",
        title: "Flexible Schedule",
        description: "Weekend, evening & online batches to fit your busy schedule"
      },
      {
        id: 3,
        icon: "FaShieldAlt",
        title: "Career Support",
        description: "Placement assistance and ongoing career guidance for all graduates"
      }
    ],
    courses: [
      {
        id: 1,
        image: "/cu1.jpg",
        title: "Basic First Aid",
        participants: 25,
        duration: "8h",
        instructor: "Masol Hab",
        category: "First Aid Training",
        rating: 4.8,
        description: "Essential first aid techniques for workplace emergencies",
        features: ["CPR Certification", "Emergency Response", "Wound Care"],
        level: "Beginner",
        price: "$199"
      },
      {
        id: 2,
        image: "/cu2.jpg",
        title: "Integrated Safety & Compliance",
        participants: 42,
        duration: "40h",
        instructor: "Masol Hab",
        category: "All In One",
        rating: 4.9,
        description: "Comprehensive safety training covering 7 critical modules",
        features: ["7 Modules", "Certification", "Practical Training"],
        level: "Advanced",
        price: "$899"
      }
    ]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ✅ Load courses data from database
  useEffect(() => {
    const loadCoursesData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/sections?template_id=2&section_name=Courses`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded courses data from database:', data);
          
          if (data.sections && data.sections.length > 0) {
            const dbContent = data.sections[0].content;
            console.log('Database content:', dbContent);
            
            if (dbContent) {
              setCoursesData({
                sectionTitle: dbContent.sectionTitle || coursesData.sectionTitle,
                sectionDescription: dbContent.sectionDescription || coursesData.sectionDescription,
                highlights: dbContent.highlights || coursesData.highlights,
                courses: dbContent.courses || coursesData.courses
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading courses data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCoursesData();
  }, []);

  // Icon mapping
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'FaCertificate': return FaCertificate;
      case 'FaCalendarAlt': return FaCalendarAlt;
      case 'FaShieldAlt': return FaShieldAlt;
      default: return FiAward;
    }
  };

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
    setCoursesData(prev => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));
  };

  const updateCourse = (index: number, field: keyof Course, value: any) => {
    const updatedCourses = [...coursesData.courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCoursesData(prev => ({ ...prev, courses: updatedCourses }));
  };

  const removeCourse = (index: number) => {
    setCoursesData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

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

  const updateHighlight = (index: number, field: keyof Highlight, value: string) => {
    const updatedHighlights = [...coursesData.highlights];
    updatedHighlights[index] = { ...updatedHighlights[index], [field]: value };
    setCoursesData(prev => ({ ...prev, highlights: updatedHighlights }));
  };

  const removeHighlight = (index: number) => {
    setCoursesData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addFeature = (courseIndex: number) => {
    const updatedCourses = [...coursesData.courses];
    updatedCourses[courseIndex].features.push("");
    setCoursesData(prev => ({ ...prev, courses: updatedCourses }));
  };

  const updateFeature = (courseIndex: number, featureIndex: number, value: string) => {
    const updatedCourses = [...coursesData.courses];
    updatedCourses[courseIndex].features[featureIndex] = value;
    setCoursesData(prev => ({ ...prev, courses: updatedCourses }));
  };

  const removeFeature = (courseIndex: number, featureIndex: number) => {
    const updatedCourses = [...coursesData.courses];
    updatedCourses[courseIndex].features.splice(featureIndex, 1);
    setCoursesData(prev => ({ ...prev, courses: updatedCourses }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    
    try {
      // Validate required fields
      const invalidCourses = coursesData.courses.filter(course => 
        !course.title.trim() || !course.description.trim()
      );

      if (invalidCourses.length > 0) {
        alert(`Please fill all required fields for ${invalidCourses.length} course(s).`);
        setIsSaving(false);
        return;
      }

      // Save to database
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: 2,
          section_name: "Courses",
          content: coursesData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      const result = await response.json();
      console.log('Saved courses to database:', result);
      
      setIsEditing(false);
      
      // Reload data from database
      const refreshResponse = await fetch(
        `/api/sections?template_id=2&section_name=Courses`
      );
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.sections && refreshData.sections.length > 0) {
          const refreshContent = refreshData.sections[0].content;
          if (refreshContent) {
            setCoursesData(refreshContent);
          }
        }
      }
    } catch (error) {
      console.error('Error saving courses:', error);
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
        `/api/sections?template_id=2&section_name=Courses`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          if (dbContent) {
            setCoursesData(dbContent);
          }
        }
      }
    } catch (error) {
      console.error('Error reloading courses data:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  // Handle image upload for courses
  const handleImageChange = (index: number, fileOrString: File | string) => {
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

  // Get unique categories
  const categories = ['all', ...new Set(coursesData.courses.map(course => course.category).filter(Boolean))];
  const filteredCourses = selectedCategory === 'all' 
    ? coursesData.courses 
    : coursesData.courses.filter(course => course.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage training programs and course offerings</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <FiEdit2 className="w-4 h-4 mr-2" />
            Manage Courses
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
        <div className="space-y-8">
          {/* Section Title & Description */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section Header</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={coursesData.sectionTitle}
                  onChange={(e) => setCoursesData(prev => ({ ...prev, sectionTitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Our Featured Programs"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Section Description
                </label>
                <textarea
                  value={coursesData.sectionDescription}
                  onChange={(e) => setCoursesData(prev => ({ ...prev, sectionDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Industry-recognized safety training programs..."
                />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Highlights</h3>
              <Button onClick={addHighlight} size="sm">
                <FiPlus className="w-4 h-4 mr-2" /> Add Highlight
              </Button>
            </div>
            <div className="space-y-4">
              {coursesData.highlights.map((highlight, index) => {
                const IconComponent = getIconComponent(highlight.icon);
                return (
                  <div key={highlight.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Highlight {index + 1}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHighlight(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Icon
                        </label>
                        <select
                          value={highlight.icon}
                          onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="FaCertificate">Certificate</option>
                          <option value="FaCalendarAlt">Calendar</option>
                          <option value="FaShieldAlt">Shield</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={highlight.title}
                          onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Internationally Recognized"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          value={highlight.description}
                          onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                          placeholder="Certifications accepted by global organizations..."
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Course Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Training Programs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add and manage safety training programs
              </p>
            </div>
            <Button onClick={addCourse}>
              <FiPlus className="w-4 h-4 mr-2" />
              Add New Course
            </Button>
          </div>

          {/* Courses List in Edit Mode */}
          <div className="space-y-6">
            {coursesData.courses.map((course, index) => (
              <div
                key={course.id}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FiBook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Course #{index + 1}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.title || 'New course'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCourse(index)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Course Image */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Course Image
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Upload course image
                      </p>
                    </div>
                    <UploadImage
                      value={course.image}
                      onChange={(file) => handleImageChange(index, file)}
                      onRemove={() => updateCourse(index, 'image', '')}
                      aspectRatio="video"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Course Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          value={course.title}
                          onChange={(e) => updateCourse(index, 'title', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Basic First Aid Training"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Category *
                        </label>
                        <input
                          type="text"
                          value={course.category}
                          onChange={(e) => updateCourse(index, 'category', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="First Aid Training"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiClock className="w-4 h-4 inline mr-2" />
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={course.duration}
                          onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="8h"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiUser className="w-4 h-4 inline mr-2" />
                          Instructor *
                        </label>
                        <input
                          type="text"
                          value={course.instructor}
                          onChange={(e) => updateCourse(index, 'instructor', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Masol Hab"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiCreditCard className="w-4 h-4 inline mr-2" />
                          Price *
                        </label>
                        <input
                          type="text"
                          value={course.price}
                          onChange={(e) => updateCourse(index, 'price', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="$199"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiUser className="w-4 h-4 inline mr-2" />
                          Participants
                        </label>
                        <input
                          type="number"
                          value={course.participants}
                          onChange={(e) => updateCourse(index, 'participants', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="25"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          <FiStar className="w-4 h-4 inline mr-2" />
                          Rating
                        </label>
                        <input
                          type="number"
                          value={course.rating}
                          onChange={(e) => updateCourse(index, 'rating', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="4.8"
                          step="0.1"
                          min="0"
                          max="5"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Level
                      </label>
                      <select
                        value={course.level}
                        onChange={(e) => updateCourse(index, 'level', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Description *
                      </label>
                      <textarea
                        value={course.description}
                        onChange={(e) => updateCourse(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Describe the course..."
                      />
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                          Features
                        </label>
                        <Button
                          size="sm"
                          onClick={() => addFeature(index)}
                          variant="outline"
                        >
                          <FiPlus className="w-4 h-4 mr-2" /> Add Feature
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {course.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="Feature"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeature(index, featureIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="space-y-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {coursesData.sectionTitle}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {coursesData.sectionDescription}
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {coursesData.highlights.map((highlight) => {
              const IconComponent = getIconComponent(highlight.icon);
              return (
                <div
                  key={highlight.id}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                {/* Course Image */}
                {course.image && (
                  <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiClock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiUser className="w-4 h-4" />
                      <span>{course.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiUser className="w-4 h-4" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiTag className="w-4 h-4" />
                      <span>{course.level}</span>
                    </div>
                  </div>

                  {/* Features */}
                  {course.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {course.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {course.price}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        / course
                      </span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FiBook className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                No Courses Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {selectedCategory !== 'all' 
                  ? `No courses found in ${selectedCategory} category.` 
                  : 'No courses available at the moment.'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}