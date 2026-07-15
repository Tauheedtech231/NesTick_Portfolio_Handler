/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/sections/HeroSection.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiRefreshCw, FiImage, FiMonitor, FiSmartphone
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
  desktopImage: string;
  mobileImage: string;
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
      title: 'Nestick College',
      desc: 'Leading educational institution in Pakistan...',
      cta: 'Get Started',
      ctaLink: '/admission',
      desktopImage: '',
      mobileImage: ''
    },
    {
      eyebrow: 'Our Programs',
      title: 'Academic Excellence',
      desc: 'Explore our diverse range of academic programs...',
      cta: 'View Programs',
      ctaLink: '/programs',
      desktopImage: '',
      mobileImage: ''
    },
    {
      eyebrow: 'Campus Life',
      title: 'Beyond Academics',
      desc: 'Experience vibrant campus life...',
      cta: 'Explore Campus',
      ctaLink: '/student-life',
      desktopImage: '',
      mobileImage: ''
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

  // ✅ Load from database - WITH BACKWARD COMPATIBILITY
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=Hero&college_id=${collegeId}&_=${timestamp}`;
      
      console.log('🔄 [Hero] Loading from:', url);
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 [Hero] API Response:', data);
        
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          setLastUpdated(data.sections[0].updated_at);
          
          if (dbContent && Object.keys(dbContent).length > 0) {
            // ✅ BACKWARD COMPATIBILITY: Convert old format to new format
            let slides = dbContent.slides || defaultFormData.slides;
            
            console.log('📋 [Hero] Raw slides from DB:', slides);
            
            // ✅ Convert each slide
            slides = slides.map((slide: any) => ({
              eyebrow: slide.eyebrow || '',
              title: slide.title || '',
              desc: slide.desc || '',
              cta: slide.cta || '',
              ctaLink: slide.ctaLink || '',
              // ✅ If desktopImage doesn't exist, use old 'image' field
              desktopImage: slide.desktopImage || slide.image || '',
              // ✅ If mobileImage doesn't exist, use old 'mobileImage' or empty
              mobileImage: slide.mobileImage || ''
            }));
            
            console.log('✅ [Hero] Converted slides:', slides);
            
            setFormData({
              ...defaultFormData,
              ...dbContent,
              slides: slides
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
        desktopImage: '',
        mobileImage: ''
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

  // ✅ Image handlers - only upload, no URL paste
  const handleImageChange = (index: number, key: 'desktopImage' | 'mobileImage', fileOrString: File | string) => {
    // If it's a string (URL), ignore it - we only allow upload
    if (typeof fileOrString === 'string') {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlides = [...formData.slides];
      newSlides[index] = { ...newSlides[index], [key]: reader.result as string };
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
            <Button 
              variant="outline" 
              className="gap-2 cursor-pointer"
              onClick={() => loadFromDatabase(true)}
            >
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Slides
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="cursor-pointer">
                  <FiX className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 cursor-pointer disabled:cursor-not-allowed">
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
                  Upload images directly from your computer. URL paste is not allowed.
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
                  <Button variant="ghost" size="sm" onClick={() => removeSlide(index)} className="text-red-500 cursor-pointer">
                    <FiTrash2 />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Eyebrow */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Eyebrow</label>
                  <input
                    type="text"
                    value={slide.eyebrow}
                    onChange={(e) => updateSlide(index, 'eyebrow', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(index, 'title', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* CTA Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">CTA Button Text</label>
                  <input
                    type="text"
                    value={slide.cta}
                    onChange={(e) => updateSlide(index, 'cta', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* CTA Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">CTA Link</label>
                  <input
                    type="text"
                    value={slide.ctaLink}
                    onChange={(e) => updateSlide(index, 'ctaLink', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Description</label>
                  <textarea
                    value={slide.desc}
                    onChange={(e) => updateSlide(index, 'desc', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* Desktop Image - Laptop */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FiMonitor className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Desktop / Laptop Image <span className="text-xs text-gray-400">(Upload only)</span>
                    </label>
                  </div>
                  <UploadImage
                    value={slide.desktopImage || ''}
                    onChange={(file) => handleImageChange(index, 'desktopImage', file)}
                    onRemove={() => {
                      const newSlides = [...formData.slides];
                      newSlides[index] = { ...newSlides[index], desktopImage: '' };
                      setFormData(prev => ({ ...prev, slides: newSlides }));
                    }}
                    aspectRatio="banner"
                    disabled={!isEditing}
                  />
                  {slide.desktopImage && (
                    <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                      <FiCheck className="w-3 h-3" /> Desktop image uploaded
                    </div>
                  )}
                </div>

                {/* Mobile Image */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FiSmartphone className="w-4 h-4 text-green-600" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Mobile Image <span className="text-xs text-gray-400">(Upload only)</span>
                    </label>
                  </div>
                  <UploadImage
                    value={slide.mobileImage || ''}
                    onChange={(file) => handleImageChange(index, 'mobileImage', file)}
                    onRemove={() => {
                      const newSlides = [...formData.slides];
                      newSlides[index] = { ...newSlides[index], mobileImage: '' };
                      setFormData(prev => ({ ...prev, slides: newSlides }));
                    }}
                    aspectRatio="banner"
                    disabled={!isEditing}
                  />
                  {slide.mobileImage && (
                    <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                      <FiCheck className="w-3 h-3" /> Mobile image uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* Device-styled preview: laptop frame + mobile frame shown together for every slide */}
              <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
                  <FiImage className="w-4 h-4" /> Live Preview
                </h4>
                <div className="flex flex-wrap items-start gap-8">
                  {/* Desktop / laptop frame - always visible */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                      <FiMonitor className="w-3 h-3" /> Desktop / Laptop
                    </span>
                    <div className="w-64 rounded-t-lg border-4 border-gray-800 bg-gray-800 overflow-hidden shadow-md">
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      </div>
                      {slide.desktopImage ? (
                        <img
                          src={slide.desktopImage}
                          alt="Desktop preview"
                          className="w-full h-32 object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="w-full h-32 flex flex-col items-center justify-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-400">
                          <FiMonitor className="w-6 h-6" />
                          <span className="text-[10px]">No desktop image yet</span>
                        </div>
                      )}
                    </div>
                    <div className="w-20 h-2 bg-gray-700 rounded-b-md"></div>
                    <div className="w-32 h-1.5 bg-gray-400 rounded-full"></div>
                  </div>

                  {/* Mobile / phone frame - always visible */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <FiSmartphone className="w-3 h-3" /> Mobile
                    </span>
                    <div className="w-24 rounded-2xl border-4 border-gray-800 bg-gray-800 overflow-hidden shadow-md">
                      <div className="flex justify-center py-1 bg-gray-800">
                        <span className="w-6 h-1 rounded-full bg-gray-600"></span>
                      </div>
                      {slide.mobileImage ? (
                        <img
                          src={slide.mobileImage}
                          alt="Mobile preview"
                          className="w-full h-40 object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="w-full h-40 flex flex-col items-center justify-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-400">
                          <FiSmartphone className="w-5 h-5" />
                          <span className="text-[10px] text-center px-1">No mobile image yet</span>
                        </div>
                      )}
                      <div className="flex justify-center py-1.5 bg-gray-800">
                        <span className="w-6 h-6 rounded-full border-2 border-gray-600"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isEditing && (
            <Button onClick={addSlide} className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer">
              <FiPlus className="w-4 h-4 mr-2" /> Add New Slide
            </Button>
          )}

          {/* Settings */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Background Color</label>
                <input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">Accent Color</label>
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600 cursor-text disabled:cursor-not-allowed"
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