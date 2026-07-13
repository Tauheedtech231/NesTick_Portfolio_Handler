/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/HeroSection.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw
} from 'react-icons/fi';

interface HeroSectionProps {
  college: College;
  templateId?: number;
}

interface SlideData {
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  ctaLink: string;
  image: string;
}

interface HeroFormData {
  slides: SlideData[];
  bgColor: string;
  accentColor: string;
  autoSlide: boolean;
  slideInterval: number;
}

const defaultFormData: HeroFormData = {
  slides: [
    {
      eyebrow: 'Welcome To',
      title: 'Aspire College',
      desc: 'Leading educational institution in Pakistan...',
      cta: 'Get Started',
      ctaLink: '/admission',
      image: ''
    },
    {
      eyebrow: 'Our Programs',
      title: 'Academic Excellence',
      desc: 'Explore our diverse range of academic programs...',
      cta: 'View Programs',
      ctaLink: '/programs',
      image: ''
    },
    {
      eyebrow: 'Campus Life',
      title: 'Beyond Academics',
      desc: 'Experience vibrant campus life...',
      cta: 'Explore Campus',
      ctaLink: '/student-life',
      image: ''
    }
  ],
  bgColor: '#F8FAFC',
  accentColor: '#0D9488',
  autoSlide: true,
  slideInterval: 5000
};

export function HeroSection({ college, templateId }: HeroSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<HeroFormData>(defaultFormData);
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
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Hero&college_id=${collegeId}&_=${timestamp}`;
      
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
              slides: dbContent.slides || defaultFormData.slides
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load hero data:', error);
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
          section_name: "Hero",
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

  // ✅ Slide handlers
  const addSlide = () => {
    setFormData(prev => ({
      ...prev,
      slides: [...prev.slides, {
        eyebrow: 'New Slide',
        title: 'Slide Title',
        desc: 'Description here...',
        cta: 'Learn More',
        ctaLink: '#',
        image: ''
      }]
    }));
  };

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...formData.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setFormData(prev => ({ ...prev, slides: newSlides }));
  };

  const removeSlide = (index: number) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index: number, fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      const newSlides = [...formData.slides];
      newSlides[index].image = fileOrString;
      setFormData(prev => ({ ...prev, slides: newSlides }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlides = [...formData.slides];
      newSlides[index].image = reader.result as string;
      setFormData(prev => ({ ...prev, slides: newSlides }));
    };
    reader.readAsDataURL(fileOrString);
  };

  useEffect(() => {
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading hero section data...</p>
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
              <p className="text-sm text-green-100">Hero data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hero Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage hero slider content</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Slides
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
                  You can modify all hero slides content. Changes will be saved to database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slides */}
        <div className="space-y-6">
          {formData.slides.map((slide, index) => (
            <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Slide {index + 1}</h3>
                {isEditing && formData.slides.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeSlide(index)} className="text-red-500">
                    <FiTrash2 />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={slide.eyebrow}
                    onChange={(e) => updateSlide(index, 'eyebrow', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(index, 'title', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={slide.cta}
                    onChange={(e) => updateSlide(index, 'cta', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={slide.ctaLink}
                    onChange={(e) => updateSlide(index, 'ctaLink', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={slide.desc}
                    onChange={(e) => updateSlide(index, 'desc', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slide Image</label>
                  <UploadImage
                    value={slide.image}
                    onChange={(file) => handleImageChange(index, file)}
                    onRemove={() => handleImageChange(index, '')}
                    aspectRatio="banner"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          ))}

          {isEditing && (
            <Button onClick={addSlide} className="w-full bg-teal-600 hover:bg-teal-700">
              <FiPlus className="w-4 h-4 mr-2" /> Add New Slide
            </Button>
          )}

          {/* Settings */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background Color</label>
                <input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Accent Color</label>
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection;