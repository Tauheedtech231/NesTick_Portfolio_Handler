// app/components/sections/AboutSection.tsx (UPDATED)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { 
  FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck,
  FiCompass, FiUsers, FiImage as FiMountain, FiShield,
  FiStar, FiBookOpen, FiTarget, FiPocket, FiHeart, FiBriefcase, FiRefreshCw
} from 'react-icons/fi';
import { FaSeedling } from "react-icons/fa"

/* eslint-disable */

interface AboutSectionProps {
  college: College;
  templateId?: number;
}

interface AboutFormData {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  
  // History Section
  historyTitle: string;
  historyDescription: string;
  historyImage: string;
  establishedYear: string;
  heritageTitle: string;
  heritageDescription: string;
  
  // Vision & Mission
  vision: string;
  mission: string;
  guidingTitle: string;
  guidingSubtitle: string;
  
  // Story
  story: string[];
  
  // Values
  values: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
  }>;
  
  // Stats
  stats: Array<{ id: number; value: number; suffix: string; label: string }>;
}

const iconMap: Record<string, any> = {
  compass: FiCompass,
  seedling: FaSeedling,
  users: FiUsers,
  mountain: FiMountain,
  shield: FiShield,
  star: FiStar,
  book: FiBookOpen,
  target: FiTarget,
  rocket: FiPocket,
  heart: FiHeart,
  briefcase: FiBriefcase,
  default: FiStar
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName.toLowerCase()] || iconMap.default;
};

const defaultFormData: AboutFormData = {
  // Hero Section
  heroTitle: 'About Nestick College',
  heroSubtitle: 'Shaping futures through excellence in education, innovation, and character building since 1985',
  heroImage: '',
  
  // History Section
  historyTitle: 'Since 1985',
  historyDescription: 'Established in 1985, Nestick College has been at the forefront of educational excellence for nearly four decades. What began as a small institution with just 200 students has grown into a premier educational hub serving over 10,000 students annually.',
  historyImage: '',
  establishedYear: '1985',
  heritageTitle: 'Prestigious Heritage',
  heritageDescription: 'Our campus blends historic architecture with modern facilities.',
  
  // Vision & Mission
  vision: 'To be a globally recognized institution that empowers students to become innovative leaders, critical thinkers, and responsible citizens who drive positive change in an interconnected world.',
  mission: 'To provide transformative education through innovative curricula, world-class faculty, and state-of-the-art facilities that foster intellectual growth, ethical values, and lifelong learning.',
  guidingTitle: 'Our Guiding',
  guidingSubtitle: 'Principles',
  
  // Story
  story: [
    'What began as a modest initiative with three classrooms has gradually evolved into a respected learning community.',
    'Along the way, we\'ve learned that meaningful education isn\'t about scaling rapidly, but about deepening connections.',
    'The core intention remains unchanged: to create spaces where learning feels relevant, rigorous, and remarkably human.'
  ],
  
  // Values
  values: [
    { id: 1, title: 'Thoughtful Engagement', description: 'We prioritize meaningful dialogue over passive reception.', icon: 'compass' },
    { id: 2, title: 'Practical Wisdom', description: 'Knowledge finds its worth in application.', icon: 'seedling' },
    { id: 3, title: 'Individual Attention', description: 'We maintain small cohorts and close relationships.', icon: 'users' },
    { id: 4, title: 'Sustainable Growth', description: 'We measure success in long-term impact.', icon: 'mountain' }
  ],
  
  // Stats
  stats: [
    { id: 1, value: 15, suffix: '+', label: 'Years Experience' },
    { id: 2, value: 5000, suffix: '+', label: 'Professionals' },
    { id: 3, value: 98, suffix: '%', label: 'Success Rate' },
    { id: 4, value: 50, suffix: '+', label: 'Industry Partners' }
  ]
};

export function AboutSection({ college, templateId }: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<AboutFormData>(defaultFormData);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getActiveTemplateId = () => {
    return templateId || (college as any).template_id || 1;
  };

  const getCollegeId = () => {
    return parseInt((college as any).id);
  };

  // Load from database
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      const timestamp = Date.now();
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=About&college_id=${collegeId}&_=${timestamp}`;
      
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
              values: dbContent.values || defaultFormData.values,
              story: dbContent.story || defaultFormData.story,
              stats: dbContent.stats || defaultFormData.stats
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load about data:', error);
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
          section_name: "About",
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

  // Manual refresh handler
  const handleRefresh = async () => {
    await loadFromDatabase(true);
  };

  // Story handlers
  const addStoryParagraph = () => {
    setFormData(prev => ({ ...prev, story: [...prev.story, 'New paragraph...'] }));
  };

  const updateStoryParagraph = (index: number, value: string) => {
    const newStory = [...formData.story];
    newStory[index] = value;
    setFormData(prev => ({ ...prev, story: newStory }));
  };

  const removeStoryParagraph = (index: number) => {
    setFormData(prev => ({ ...prev, story: prev.story.filter((_, i) => i !== index) }));
  };

  // Value handlers
  const addValue = () => {
    const newId = Math.max(...formData.values.map(v => v.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      values: [...prev.values, { id: newId, title: 'New Value', description: 'Description', icon: 'star' }]
    }));
  };

  const updateValue = (index: number, field: string, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setFormData(prev => ({ ...prev, values: newValues }));
  };

  const removeValue = (index: number) => {
    setFormData(prev => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }));
  };

  // Image handlers - only upload, no URL paste
  const handleImageChange = (key: 'heroImage' | 'historyImage', fileOrString: File | string) => {
    // If it's a string (URL), ignore it - we only allow upload
    if (typeof fileOrString === 'string') {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [key]: reader.result as string }));
    };
    reader.readAsDataURL(fileOrString);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading about section data...</p>
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
              <p className="text-sm text-green-100">Data refreshed from database.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage about page content</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-teal-600 dark:text-teal-400">Template ID: {getActiveTemplateId()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">College ID: {getCollegeId()}</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit Content
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
                  Upload images directly from your computer. URL paste is not allowed.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* ===== HERO SECTION ===== */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hero Section</h3>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image (Upload Only)</label>
                <UploadImage
                  value={formData.heroImage}
                  onChange={(file) => handleImageChange('heroImage', file)}
                  onRemove={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
                  aspectRatio="banner"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* ===== HISTORY SECTION ===== */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">History Section</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">History Title (e.g. Since 1985)</label>
                <input
                  type="text"
                  value={formData.historyTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, historyTitle: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">History Description</label>
                <textarea
                  value={formData.historyDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, historyDescription: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Established Year</label>
                <input
                  type="text"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heritage Title</label>
                <input
                  type="text"
                  value={formData.heritageTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, heritageTitle: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heritage Description</label>
                <input
                  type="text"
                  value={formData.heritageDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, heritageDescription: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">History Image (Upload Only)</label>
                <UploadImage
                  value={formData.historyImage}
                  onChange={(file) => handleImageChange('historyImage', file)}
                  onRemove={() => setFormData(prev => ({ ...prev, historyImage: '' }))}
                  aspectRatio="banner"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* ===== VISION & MISSION ===== */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vision & Mission</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vision</label>
                <textarea
                  value={formData.vision}
                  onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mission</label>
                <textarea
                  value={formData.mission}
                  onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guiding Title</label>
                  <input
                    type="text"
                    value={formData.guidingTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, guidingTitle: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guiding Subtitle</label>
                  <input
                    type="text"
                    value={formData.guidingSubtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, guidingSubtitle: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== STORY ===== */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Story</h3>
              {isEditing && (
                <Button size="sm" onClick={addStoryParagraph} className="bg-teal-600">
                  <FiPlus className="w-3 h-3 mr-1" /> Add Paragraph
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {formData.story.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateStoryParagraph(index, e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                    className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                    placeholder={`Paragraph ${index + 1}`}
                  />
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removeStoryParagraph(index)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ===== VALUES ===== */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Core Values</h3>
              {isEditing && (
                <Button size="sm" onClick={addValue} className="bg-teal-600">
                  <FiPlus className="w-3 h-3 mr-1" /> Add Value
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {formData.values.map((value, index) => (
                <div key={value.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between mb-3">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Value {index + 1}</span>
                    {isEditing && (
                      <Button variant="ghost" size="sm" onClick={() => removeValue(index)} className="text-red-500">
                        <FiTrash2 />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => updateValue(index, 'title', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Title"
                      className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                    <textarea
                      value={value.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      placeholder="Description"
                      className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                    <select
                      value={value.icon}
                      onChange={(e) => updateValue(index, 'icon', e.target.value)}
                      disabled={!isEditing}
                      className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      <option value="compass">Compass</option>
                      <option value="seedling">Seedling</option>
                      <option value="users">Users</option>
                      <option value="mountain">Mountain</option>
                      <option value="shield">Shield</option>
                      <option value="star">Star</option>
                      <option value="heart">Heart</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutSection;