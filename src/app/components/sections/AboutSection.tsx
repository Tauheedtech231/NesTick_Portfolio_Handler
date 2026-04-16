// app/components/sections/AboutSection.tsx (COMPLETELY FIXED)

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

// Complete data structure matching live template (without video)
interface AboutFormData {
  // Basic Info
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  establishedYear: string;
  
  // Story (array of paragraphs)
  story: string[];
  
  // Mission & Vision
  mission: string;
  vision: string;
  
  // Philosophy
  philosophy: {
    heading: string;
    points: string[];
  };
  
  // Values
  values: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
  }>;
  
  // Approach
  approach: {
    heading: string;
    description: string;
    aspects: Array<{
      title: string;
      description: string;
    }>;
  };
  
  // Why Choose Us
  whyChooseUs: {
    intro: string;
    points: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  
  // Stats
  stats: Array<{ id: number; value: number; suffix: string; label: string }>;
  highlights: Array<{ id: number; text: string }>;
  
  // Images
  logo?: string;
  coverImage?: string;
}

// Icon mapping for values and whyChooseUs
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
  name: '',
  tagline: 'Where thoughtful education shapes meaningful futures',
  shortDescription: 'For more than a decade, we\'ve quietly cultivated an environment where education transcends routine learning—where students discover not just knowledge, but purpose.',
  longDescription: '',
  establishedYear: '2010',
  
  story: [
    'What began as a modest initiative with three classrooms has gradually evolved into a respected learning community.',
    'Along the way, we\'ve learned that meaningful education isn\'t about scaling rapidly, but about deepening connections.',
    'The core intention remains unchanged: to create spaces where learning feels relevant, rigorous, and remarkably human.'
  ],
  
  mission: 'To nurture curious minds through education that values depth over breadth, understanding over memorization, and personal growth alongside academic achievement.',
  vision: 'To create a learning community where education adapts to human needs, not institutional requirements.',
  
  philosophy: {
    heading: 'Our educational philosophy is simple but deliberate:',
    points: [
      'Learning should feel like discovery, not consumption',
      'Depth in a few areas matters more than surface exposure to many',
      'Practical application grounds theoretical understanding',
      'Mentorship amplifies independent learning'
    ]
  },
  
  values: [
    { id: 1, title: 'Thoughtful Engagement', description: 'We prioritize meaningful dialogue over passive reception.', icon: 'compass' },
    { id: 2, title: 'Practical Wisdom', description: 'Knowledge finds its worth in application.', icon: 'seedling' },
    { id: 3, title: 'Individual Attention', description: 'We maintain small cohorts and close relationships.', icon: 'users' },
    { id: 4, title: 'Sustainable Growth', description: 'We measure success in long-term impact.', icon: 'mountain' }
  ],
  
  approach: {
    heading: 'How We Approach Education',
    description: 'Rather than following trends, we\'ve developed approaches that align with how people actually learn.',
    aspects: [
      { title: 'Blended Rhythm', description: 'Alternating intensive study with reflective practice.' },
      { title: 'Contextual Projects', description: 'Assignments rooted in actual challenges.' },
      { title: 'Iterative Feedback', description: 'Continuous, constructive dialogue.' },
      { title: 'Cross-disciplinary Threads', description: 'Connecting concepts across traditional boundaries.' }
    ]
  },
  
  whyChooseUs: {
    intro: 'While many institutions promise results, we focus on the journey.',
    points: [
      { title: 'Faculty who prioritize presence', description: 'Educators first, experts second.', icon: 'users' },
      { title: 'Curriculum with breathing room', description: 'Space to think is built into the schedule.', icon: 'book' },
      { title: 'Assessment as dialogue', description: 'Feedback through conversation, not just grades.', icon: 'target' },
      { title: 'Community as curriculum', description: 'Learning happens in relationship.', icon: 'heart' },
      { title: 'Long-term partnership', description: 'Our relationship doesn\'t end at graduation.', icon: 'shield' }
    ]
  },
  
  stats: [
    { id: 1, value: 15, suffix: '+', label: 'Years Experience' },
    { id: 2, value: 5000, suffix: '+', label: 'Professionals' },
    { id: 3, value: 98, suffix: '%', label: 'Success Rate' },
    { id: 4, value: 50, suffix: '+', label: 'Industry Partners' }
  ],
  
  highlights: [
    { id: 1, text: 'NEBOSH Certification Programs' },
    { id: 2, text: 'IOSH Managing Safely' },
    { id: 3, text: 'OSHA Standards Training' },
    { id: 4, text: 'Fire Safety Training' }
  ],
  
  logo: undefined,
  coverImage: undefined
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

  // ✅ Get college ID from props
  const getCollegeId = () => {
    return parseInt((college as any).id);
  };

  // ✅ Load fresh data from database with no cache
  const loadFromDatabase = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      
      // ✅ Add timestamp to prevent caching
      const timestamp = Date.now();
      const url = `/api/sections?template_id=${activeTemplateId}&section_name=About&college_id=${collegeId}&_=${timestamp}`;
      
      console.log('🔄 [AboutSection] Fetching fresh data from:', url);
      console.log('🏫 [AboutSection] For College ID:', collegeId);
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log(`📡 [AboutSection] API Response Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 [AboutSection] Raw API Response:', JSON.stringify(data, null, 2));
        
        if (data.sections && data.sections.length > 0) {
          const dbContent = data.sections[0].content;
          const updatedAt = data.sections[0].updated_at;
          
          console.log('💾 [AboutSection] Database Content:', dbContent);
          console.log('🕐 [AboutSection] Last Updated:', updatedAt);
          
          setLastUpdated(updatedAt);
          
          if (dbContent && Object.keys(dbContent).length > 0) {
            // Merge database content with defaults
            const newFormData = {
              ...defaultFormData,
              ...dbContent,
              stats: dbContent.stats || defaultFormData.stats,
              values: dbContent.values || defaultFormData.values,
              approach: dbContent.approach || defaultFormData.approach,
              philosophy: dbContent.philosophy || defaultFormData.philosophy,
              whyChooseUs: dbContent.whyChooseUs || defaultFormData.whyChooseUs,
              story: dbContent.story || defaultFormData.story,
              highlights: dbContent.highlights || defaultFormData.highlights
            };
            
            console.log('✅ [AboutSection] Form Data Updated from DB');
            console.log('📝 [AboutSection] Name:', newFormData.name);
            console.log('📝 [AboutSection] Mission:', newFormData.mission?.substring(0, 50) + '...');
            
            setFormData(newFormData);
          } else {
            console.log('⚠️ [AboutSection] No content in database, using defaults');
            setFormData(defaultFormData);
          }
        } else {
          console.log('⚠️ [AboutSection] No sections found, using defaults');
          setFormData(defaultFormData);
        }
      } else {
        console.error('❌ [AboutSection] API Error:', response.status, response.statusText);
        setFormData(defaultFormData);
      }
    } catch (error) {
      console.error('❌ [AboutSection] Failed to load:', error);
      setFormData(defaultFormData);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [templateId, college.template_id, college.id]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    console.log('🔄 [AboutSection] useEffect triggered - Loading fresh data');
    loadFromDatabase(true);
  }, [loadFromDatabase]);

  // ✅ Save to database with college_id
  const handleSave = async () => {
    setIsSaving(true);
    console.log('💾 [AboutSection] Starting save operation...');
    
    try {
      const activeTemplateId = getActiveTemplateId();
      const collegeId = getCollegeId();
      
      console.log('🏫 [AboutSection] Saving for College ID:', collegeId);
      
      const contentToSave = {
        name: formData.name,
        tagline: formData.tagline,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        establishedYear: formData.establishedYear,
        story: formData.story,
        mission: formData.mission,
        vision: formData.vision,
        philosophy: formData.philosophy,
        values: formData.values,
        approach: formData.approach,
        whyChooseUs: formData.whyChooseUs,
        stats: formData.stats,
        highlights: formData.highlights,
        logo: formData.logo,
        coverImage: formData.coverImage
      };
      
      console.log('📤 [AboutSection] Saving content:', {
        template_id: activeTemplateId,
        section_name: "About",
        college_id: collegeId,
        content: {
          name: contentToSave.name,
          mission_preview: contentToSave.mission?.substring(0, 50) + '...',
          stats_count: contentToSave.stats?.length,
          values_count: contentToSave.values?.length
        }
      });
      
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: activeTemplateId,
          section_name: "About",
          college_id: collegeId,  // ✅ IMPORTANT: college_id passed here!
          content: contentToSave
        })
      });
      
      console.log(`📡 [AboutSection] Save API Response Status: ${response.status}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ [AboutSection] Save successful:', result);
        
        setShowSuccessPopup(true);
        setIsEditing(false);
        
        // ✅ Reload fresh data after save
        console.log('🔄 [AboutSection] Reloading fresh data after save...');
        await loadFromDatabase(false);
        
        // Hide popup after 3 seconds
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        const error = await response.json();
        console.error('❌ [AboutSection] Save failed:', error);
        alert('Failed to save changes: ' + (error.error || error.message));
      }
    } catch (error) {
      console.error('❌ [AboutSection] Error saving:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Manual refresh handler
  const handleRefresh = async () => {
    console.log('🔄 [AboutSection] Manual refresh triggered');
    await loadFromDatabase(true);
  };

  // Array handlers
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

  const addPhilosophyPoint = () => {
    setFormData(prev => ({
      ...prev,
      philosophy: { ...prev.philosophy, points: [...prev.philosophy.points, 'New philosophy point...'] }
    }));
  };

  const updatePhilosophyPoint = (index: number, value: string) => {
    const newPoints = [...formData.philosophy.points];
    newPoints[index] = value;
    setFormData(prev => ({ ...prev, philosophy: { ...prev.philosophy, points: newPoints } }));
  };

  const removePhilosophyPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      philosophy: { ...prev.philosophy, points: prev.philosophy.points.filter((_, i) => i !== index) }
    }));
  };

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

  const addApproachAspect = () => {
    setFormData(prev => ({
      ...prev,
      approach: { ...prev.approach, aspects: [...prev.approach.aspects, { title: 'New Aspect', description: 'Description' }] }
    }));
  };

  const updateApproachAspect = (index: number, field: string, value: string) => {
    const newAspects = [...formData.approach.aspects];
    newAspects[index] = { ...newAspects[index], [field]: value };
    setFormData(prev => ({ ...prev, approach: { ...prev.approach, aspects: newAspects } }));
  };

  const removeApproachAspect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      approach: { ...prev.approach, aspects: prev.approach.aspects.filter((_, i) => i !== index) }
    }));
  };

  const addWhyChooseUsPoint = () => {
    setFormData(prev => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        points: [...prev.whyChooseUs.points, { title: 'New Feature', description: 'Description', icon: 'star' }]
      }
    }));
  };

  const updateWhyChooseUsPoint = (index: number, field: string, value: string) => {
    const newPoints = [...formData.whyChooseUs.points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setFormData(prev => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, points: newPoints } }));
  };

  const removeWhyChooseUsPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      whyChooseUs: { ...prev.whyChooseUs, points: prev.whyChooseUs.points.filter((_, i) => i !== index) }
    }));
  };

  const handleImageChange = (key: 'logo' | 'coverImage', fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      setFormData(prev => ({ ...prev, [key]: fileOrString }));
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
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage complete about page content</p>
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
                <FiEdit2 className="w-4 h-4 mr-2" /> Edit All Content
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
                  You can modify all about page content. Changes will be saved to database and reflected on live template.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the UI sections - same as before */}
        <div className="space-y-8">
          {/* Basic Info Section */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institute Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  placeholder="Institute Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  disabled={!isEditing}
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
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <UploadImage
                  value={formData.logo}
                  onChange={(file) => handleImageChange('logo', file)}
                  onRemove={() => handleImageChange('logo', '')}
                  aspectRatio="square"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <UploadImage
                  value={formData.coverImage}
                  onChange={(file) => handleImageChange('coverImage', file)}
                  onRemove={() => handleImageChange('coverImage', '')}
                  aspectRatio="banner"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Story (Paragraphs)</h3>
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

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mission</h3>
              <textarea
                value={formData.mission}
                onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                           disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vision</h3>
              <textarea
                value={formData.vision}
                onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                           disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            </div>
          </div>

          {/* Philosophy */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Philosophy</h3>
              {isEditing && (
                <Button size="sm" onClick={addPhilosophyPoint} className="bg-teal-600">
                  <FiPlus className="w-3 h-3 mr-1" /> Add Point
                </Button>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heading</label>
              <input
                type="text"
                value={formData.philosophy.heading}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  philosophy: { ...prev.philosophy, heading: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                           disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            </div>
            <div className="space-y-3">
              {formData.philosophy.points.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updatePhilosophyPoint(index, e.target.value)}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                               disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                  {isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => removePhilosophyPoint(index)} className="text-red-500">
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
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

          {/* Approach */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Approach</h3>
              {isEditing && (
                <Button size="sm" onClick={addApproachAspect} className="bg-teal-600">
                  <FiPlus className="w-3 h-3 mr-1" /> Add Aspect
                </Button>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.approach.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  approach: { ...prev.approach, description: e.target.value }
                }))}
                disabled={!isEditing}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="space-y-4">
              {formData.approach.aspects.map((aspect, index) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between mb-3">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Aspect {index + 1}</span>
                    {isEditing && (
                      <Button variant="ghost" size="sm" onClick={() => removeApproachAspect(index)} className="text-red-500">
                        <FiTrash2 />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={aspect.title}
                      onChange={(e) => updateApproachAspect(index, 'title', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Title"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                    <textarea
                      value={aspect.description}
                      onChange={(e) => updateApproachAspect(index, 'description', e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      placeholder="Description"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Why Choose Us</h3>
              {isEditing && (
                <Button size="sm" onClick={addWhyChooseUsPoint} className="bg-teal-600">
                  <FiPlus className="w-3 h-3 mr-1" /> Add Point
                </Button>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intro Text</label>
              <textarea
                value={formData.whyChooseUs.intro}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  whyChooseUs: { ...prev.whyChooseUs, intro: e.target.value }
                }))}
                disabled={!isEditing}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="space-y-4">
              {formData.whyChooseUs.points.map((point, index) => (
                <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between mb-3">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Point {index + 1}</span>
                    {isEditing && (
                      <Button variant="ghost" size="sm" onClick={() => removeWhyChooseUsPoint(index)} className="text-red-500">
                        <FiTrash2 />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={point.title}
                      onChange={(e) => updateWhyChooseUsPoint(index, 'title', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Title"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                    <textarea
                      value={point.description}
                      onChange={(e) => updateWhyChooseUsPoint(index, 'description', e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      placeholder="Description"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                    <select
                      value={point.icon}
                      onChange={(e) => updateWhyChooseUsPoint(index, 'icon', e.target.value)}
                      disabled={!isEditing}
                      className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      <option value="users">Users</option>
                      <option value="book">Book</option>
                      <option value="target">Target</option>
                      <option value="heart">Heart</option>
                      <option value="shield">Shield</option>
                      <option value="star">Star</option>
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