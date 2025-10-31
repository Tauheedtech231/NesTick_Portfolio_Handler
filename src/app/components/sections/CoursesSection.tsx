'use client';

import React, { useState } from 'react';
import { Course } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button'; 
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiBook} from 'react-icons/fi';
/* eslint-disable */

interface CoursesSectionProps {
  data: Course[];
  college: any;
  onUpdate: (data: Course[]) => void;
}

export function CoursesSection({ data, college, onUpdate }: CoursesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [courses, setCourses] = useState<Course[]>(data);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const addCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: '',
      duration: '',
      department: '',
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

  const saveChanges = () => {
    onUpdate(courses);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setCourses(data);
    setIsEditing(false);
  };

  const departments = ['all', ...new Set(courses.map(course => course.department))];
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
          {departments.map((dept) => (
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
          <Button onClick={addCourse} variant="secondary">
            <FiPlus className="w-4 h-4 mr-2" />
            Add New Course
          </Button>

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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Department *
                        </label>
                        <input
                          type="text"
                          value={course.department}
                          onChange={(e) => updateCourse(index, 'department', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Computer Science"
                        />
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
                {/* <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.department}
                </span> */}
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

              {/* <div className="flex gap-2">
                {course.syllabus && (
                  <Button variant="secondary" size="sm" asChild>
                    <a href={course.syllabus} target="_blank" rel="noopener noreferrer">
                      <FiDownload className="w-4 h-4 mr-2" />
                      Syllabus
                    </a>
                  </Button>
                )}
                {course.feeStructure && (
                  <Button variant="secondary" size="sm" asChild>
                    <a href={course.feeStructure} target="_blank" rel="noopener noreferrer">
                      <FiDownload className="w-4 h-4 mr-2" />
                      Fee Structure
                    </a>
                  </Button>
                )}
              </div> */}
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