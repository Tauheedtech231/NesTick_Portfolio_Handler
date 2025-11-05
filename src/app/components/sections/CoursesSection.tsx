'use client';

import React, { useState, useEffect } from 'react';
import { Course } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button'; 
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiBook, FiChevronDown, FiTag } from 'react-icons/fi';
/* eslint-disable */

interface CoursesSectionProps {
  data: Course[];
  college: any;
  onUpdate: (data: Course[]) => void;
}

interface Department {
  id: string;
  name: string;
  createdAt: string;
}

export function CoursesSection({ data, college, onUpdate }: CoursesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [courses, setCourses] = useState<Course[]>(data);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState<number | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  // Load departments from localStorage on component mount
  useEffect(() => {
    const savedDepartments = localStorage.getItem('departments');
    if (savedDepartments) {
      setDepartments(JSON.parse(savedDepartments));
    } else {
      // Initialize with default departments if none exist
      const defaultDepartments: Department[] = [
        { id: 'dept-1', name: 'Computer Science', createdAt: new Date().toISOString() },
        { id: 'dept-2', name: 'Electrical Engineering', createdAt: new Date().toISOString() },
        { id: 'dept-3', name: 'Mechanical Engineering', createdAt: new Date().toISOString() },
        { id: 'dept-4', name: 'Business Administration', createdAt: new Date().toISOString() },
        { id: 'dept-5', name: 'Arts and Sciences', createdAt: new Date().toISOString() },
      ];
      setDepartments(defaultDepartments);
      localStorage.setItem('departments', JSON.stringify(defaultDepartments));
    }
  }, []);

  // Save departments to localStorage whenever departments change
  useEffect(() => {
    if (departments.length > 0) {
      localStorage.setItem('departments', JSON.stringify(departments));
    }
  }, [departments]);

  // Save courses to localStorage whenever courses change (in edit mode)
  useEffect(() => {
    if (isEditing && courses.length > 0) {
      localStorage.setItem('courses', JSON.stringify(courses));
    }
  }, [courses, isEditing]);

  const addCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: '',
      duration: '',
      department: departments.length > 0 ? departments[0].name : '',
      description: '',
      credits: 0,
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (index: number, field: keyof Course, value: any) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const addNewDepartment = () => {
    if (newDepartmentName.trim() && !departments.find(dept => 
      dept.name.toLowerCase() === newDepartmentName.trim().toLowerCase()
    )) {
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name: newDepartmentName.trim(),
        createdAt: new Date().toISOString(),
      };
      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      setNewDepartmentName('');
      
      // If we're adding a department while editing a course, update that course's department
      if (showDepartmentDropdown !== null) {
        updateCourse(showDepartmentDropdown, 'department', newDepartment.name);
      }
    }
  };

  const selectDepartment = (courseIndex: number, departmentName: string) => {
    updateCourse(courseIndex, 'department', departmentName);
    setShowDepartmentDropdown(null);
  };

  const saveChanges = () => {
    onUpdate(courses);
    setIsEditing(false);
    // Also save to localStorage for persistence
    localStorage.setItem('courses', JSON.stringify(courses));
  };

  const cancelEditing = () => {
    // Restore from localStorage or original data
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      setCourses(data);
    }
    setIsEditing(false);
  };

  // Get unique departments for filter from current courses
  const availableDepartments = ['all', ...new Set(courses.map(course => course.department).filter(Boolean))];
  const filteredCourses = departmentFilter === 'all' 
    ? courses 
    : courses.filter(course => course.department === departmentFilter);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage academic programs and course offerings</p>
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
              className="w-full sm:w-auto"
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex flex-wrap gap-2 mb-6">
          {availableDepartments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-4 py-2 rounded-xl transition-all ${
                departmentFilter === dept
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Button onClick={addCourse} variant="secondary">
              <FiPlus className="w-4 h-4 mr-2" />
              Add New Course
            </Button>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{departments.length}</span> departments available
            </div>
          </div>

          <div className="grid gap-6">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Course #{index + 1}
                  </h3>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Image
                    </label>
                    <UploadImage
                      value={course.image}
                      onChange={(url) => updateCourse(index, 'image', url)}
                      onRemove={() => updateCourse(index, 'image', '')}
                      aspectRatio="video"
                    />
                  </div>

                  {/* Course Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Course Name *
                      </label>
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Computer Science and Engineering"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={course.duration}
                          onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="4 Years"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Department *
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowDepartmentDropdown(showDepartmentDropdown === index ? null : index)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left flex items-center justify-between"
                          >
                            <span>{course.department || 'Select Department'}</span>
                            <FiChevronDown className="w-4 h-4 text-gray-500" />
                          </button>
                          
                          {showDepartmentDropdown === index && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                              {/* Existing Departments */}
                              {departments.map((dept) => (
                                <button
                                  key={dept.id}
                                  onClick={() => selectDepartment(index, dept.name)}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <FiTag className="w-3 h-3 text-gray-500" />
                                  {dept.name}
                                </button>
                              ))}
                              
                              {/* Add New Department */}
                              <div className="border-t border-gray-200 dark:border-gray-600 p-3">
                                <div className="flex gap-2 mb-2">
                                  <input
                                    type="text"
                                    value={newDepartmentName}
                                    onChange={(e) => setNewDepartmentName(e.target.value)}
                                    placeholder="New department name"
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    onKeyPress={(e) => e.key === 'Enter' && addNewDepartment()}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={addNewDepartment}
                                    disabled={!newDepartmentName.trim()}
                                  >
                                    <FiPlus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Credits *
                        </label>
                        <input
                          type="number"
                          value={course.credits}
                          onChange={(e) => updateCourse(index, 'credits', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="160"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Syllabus URL
                        </label>
                        <input
                          type="url"
                          value={course.syllabus || ''}
                          onChange={(e) => updateCourse(index, 'syllabus', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="https://example.com/syllabus.pdf"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Fee Structure URL
                        </label>
                        <input
                          type="url"
                          value={course.feeStructure || ''}
                          onChange={(e) => updateCourse(index, 'feeStructure', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="https://example.com/fees.pdf"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={course.description}
                        onChange={(e) => updateCourse(index, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                        placeholder="Describe the course curriculum, objectives, and career opportunities..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {course.name}
                </h3>
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.department}
                </span>
              </div>

              {course.image && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {course.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                  <div className="font-semibold text-blue-700 dark:text-blue-300">
                    {course.duration}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Credits</div>
                  <div className="font-semibold text-green-700 dark:text-green-300">
                    {course.credits}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEditing && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiBook className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Courses Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {departmentFilter !== 'all' 
              ? `No courses found in ${departmentFilter} department.` 
              : 'Start by adding your first course.'
            }
          </p>
          <Button onClick={() => setIsEditing(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      )}
    </div>
  );
}