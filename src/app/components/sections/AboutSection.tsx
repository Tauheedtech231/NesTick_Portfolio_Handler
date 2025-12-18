'use client';

import React, { useState, useEffect } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
/* eslint-disable */
interface AboutSectionProps {
  college: College;
}

interface FormDataType {
  logo?: string;
  coverImage?: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  mission: string;
  vision: string;
  establishedYear: string;
  tagline: string;
  stats: Array<{ id: number; value: number; suffix: string; label: string }>;
  pillars: Array<{ id: number; title: string; description: string }>;
  whyChooseUs: Array<{ id: number; title: string; description: string }>;
  highlights: Array<{ id: number; text: string }>;
  accreditation: string;
}

export function AboutSection({ college }: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Default form data
  const defaultFormData: FormDataType = {
    name: college.name || '',
    shortDescription: college.shortDescription || '',
    longDescription: college.longDescription || '',
    mission: college.mission || '',
    vision: college.vision || '',
    logo: college.logo || undefined,
    coverImage: college.coverImage || undefined,
    establishedYear: '2008',
    tagline: 'Pakistan Premier Safety Training Institute',
    accreditation: 'Registered with TEVTA, PSB & International Bodies',
    stats: [
      { id: 1, value: 15, suffix: '+', label: 'Years Experience' },
      { id: 2, value: 5000, suffix: '+', label: 'Professionals' },
      { id: 3, value: 98, suffix: '%', label: 'Success Rate' },
      { id: 4, value: 50, suffix: '+', label: 'Industry Partners' },
    ],
    pillars: [
      { id: 1, title: 'Industry Leadership', description: '15+ years of excellence in safety training, setting industry standards and benchmarks for professional development.' },
      { id: 2, title: 'Expert Training', description: 'Internationally certified trainers with real-world experience delivering practical, hands-on safety education.' },
      { id: 3, title: 'Global Standards', description: 'Curriculum aligned with NEBOSH, IOSH, OSHA, and other international safety certification requirements.' },
      { id: 4, title: 'Certified Excellence', description: '98% certification success rate with comprehensive assessment and continuous improvement programs.' },
    ],
    whyChooseUs: [
      { id: 1, title: 'Proven Excellence', description: 'Consistently rated 4.9+ by professionals across industries' },
      { id: 2, title: 'Expert Faculty', description: 'Industry veterans with 20+ years of safety experience' },
      { id: 3, title: 'Industry Partnerships', description: 'Collaborations with top organizations for placement' },
      { id: 4, title: 'Flexible Scheduling', description: 'Weekend, evening, and customized corporate batches' },
      { id: 5, title: 'Premium Facilities', description: 'State-of-the-art training labs and equipment' },
      { id: 6, title: 'Post-Course Support', description: 'Lifetime career guidance and certification renewal' },
    ],
    highlights: [
      { id: 1, text: 'NEBOSH Certification Programs' },
      { id: 2, text: 'IOSH Managing Safely' },
      { id: 3, text: 'OSHA Standards Training' },
      { id: 4, text: 'Fire Safety Training' },
      { id: 5, text: 'First Aid & CPR Certification' },
      { id: 6, text: 'Risk Assessment Training' },
    ],
  };

  const [formData, setFormData] = useState<FormDataType>(defaultFormData);

  const MAX_LENGTH: Record<string, number> = {
    name: 100,
    shortDescription: 200,
    longDescription: 1000,
    mission: 500,
    vision: 500,
    establishedYear: 10,
    tagline: 200,
    accreditation: 300,
  };

  // ✅ Load data from database on initial load with template_id = 2
  useEffect(() => {
    const loadFromDatabase = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/sections?template_id=2&section_name=About`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data);
          
          if (data.sections && data.sections.length > 0) {
            const section = data.sections[0];
            const dbContent = section.content;
            
            // Update form data from database
            const newFormData: FormDataType = {
              name: dbContent.name || defaultFormData.name,
              shortDescription: dbContent.shortDescription || defaultFormData.shortDescription,
              longDescription: dbContent.longDescription || defaultFormData.longDescription,
              mission: dbContent.mission || defaultFormData.mission,
              vision: dbContent.vision || defaultFormData.vision,
              establishedYear: dbContent.establishedYear || defaultFormData.establishedYear,
              tagline: dbContent.tagline || defaultFormData.tagline,
              accreditation: dbContent.accreditation || defaultFormData.accreditation,
              logo: dbContent.logo || defaultFormData.logo,
              coverImage: dbContent.coverImage || defaultFormData.coverImage,
              stats: Array.isArray(dbContent.stats) && dbContent.stats.length > 0 
                ? dbContent.stats 
                : defaultFormData.stats,
              pillars: Array.isArray(dbContent.pillars) && dbContent.pillars.length > 0 
                ? dbContent.pillars 
                : defaultFormData.pillars,
              whyChooseUs: Array.isArray(dbContent.whyChooseUs) && dbContent.whyChooseUs.length > 0 
                ? dbContent.whyChooseUs 
                : defaultFormData.whyChooseUs,
              highlights: Array.isArray(dbContent.highlights) && dbContent.highlights.length > 0 
                ? dbContent.highlights.map((item: string | { id: number; text: string }, index: number) => ({
                    id: index + 1,
                    text: typeof item === 'string' ? item : item.text
                  }))
                : defaultFormData.highlights,
            };
            
            setFormData(newFormData);
          }
        } else {
          console.error('Failed to fetch from database:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to load from database:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFromDatabase();
  }, []);

  // Handle success popup display
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const updateForm = (patch: Partial<FormDataType>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Prepare content for database with template_id = 2
      const dbContent = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        mission: formData.mission,
        vision: formData.vision,
        establishedYear: formData.establishedYear,
        tagline: formData.tagline,
        accreditation: formData.accreditation,
        logo: formData.logo || null,
        coverImage: formData.coverImage || null,
        stats: formData.stats,
        pillars: formData.pillars,
        whyChooseUs: formData.whyChooseUs,
        highlights: formData.highlights.map(item => item.text),
      };
      
      // Save to database with template_id = 2
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: 2,
          section_name: "About",
          content: dbContent
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        throw new Error('Failed to save to database');
      }
      
      await response.json();
      
      // Show success popup
      setShowSuccessPopup(true);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reload from database on cancel
    const loadFromDatabase = async () => {
      try {
        const response = await fetch(
          `/api/sections?template_id=2&section_name=About`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.sections && data.sections.length > 0) {
            const section = data.sections[0];
            const dbContent = section.content;
            
            const newFormData: FormDataType = {
              name: dbContent.name || defaultFormData.name,
              shortDescription: dbContent.shortDescription || defaultFormData.shortDescription,
              longDescription: dbContent.longDescription || defaultFormData.longDescription,
              mission: dbContent.mission || defaultFormData.mission,
              vision: dbContent.vision || defaultFormData.vision,
              establishedYear: dbContent.establishedYear || defaultFormData.establishedYear,
              tagline: dbContent.tagline || defaultFormData.tagline,
              accreditation: dbContent.accreditation || defaultFormData.accreditation,
              logo: dbContent.logo || defaultFormData.logo,
              coverImage: dbContent.coverImage || defaultFormData.coverImage,
              stats: Array.isArray(dbContent.stats) && dbContent.stats.length > 0 
                ? dbContent.stats 
                : defaultFormData.stats,
              pillars: Array.isArray(dbContent.pillars) && dbContent.pillars.length > 0 
                ? dbContent.pillars 
                : defaultFormData.pillars,
              whyChooseUs: Array.isArray(dbContent.whyChooseUs) && dbContent.whyChooseUs.length > 0 
                ? dbContent.whyChooseUs 
                : defaultFormData.whyChooseUs,
              highlights: Array.isArray(dbContent.highlights) && dbContent.highlights.length > 0 
                ? dbContent.highlights.map((item: string | { id: number; text: string }, index: number) => ({
                    id: index + 1,
                    text: typeof item === 'string' ? item : item.text
                  }))
                : defaultFormData.highlights,
            };
            
            setFormData(newFormData);
          }
        }
      } catch (error) {
        console.error('Failed to reload from database:', error);
      }
    };
    
    loadFromDatabase();
    setIsEditing(false);
  };

  const handleTextChange = (key: keyof FormDataType, value: string) => {
    if (value.length <= (MAX_LENGTH[key] || 1000)) updateForm({ [key]: value });
  };

  // ✅ Array handlers for stats, pillars, whyChooseUs, highlights
  const handleArrayItemChange = (arrayName: 'stats' | 'pillars' | 'whyChooseUs' | 'highlights', index: number, field: string, value: any) => {
    const array = [...formData[arrayName]];
    if (arrayName === 'highlights') {
      array[index] = { ...array[index], text: value };
    } else {
      array[index] = { ...array[index], [field]: value };
    }
    updateForm({ [arrayName]: array });
  };

  const addArrayItem = (arrayName: 'stats' | 'pillars' | 'whyChooseUs' | 'highlights') => {
    const array = [...formData[arrayName]];
    const newId = Math.max(...array.map(item => item.id), 0) + 1;
    
    const newItem = arrayName === 'stats' 
      ? { id: newId, value: 0, suffix: '+', label: 'New Stat' }
      : arrayName === 'pillars'
      ? { id: newId, title: 'New Pillar', description: 'Description here' }
      : arrayName === 'whyChooseUs'
      ? { id: newId, title: 'New Feature', description: 'Description here' }
      : { id: newId, text: 'New Highlight' };
    
    updateForm({ [arrayName]: [...array, newItem] });
  };

  const removeArrayItem = (arrayName: 'stats' | 'pillars' | 'whyChooseUs' | 'highlights', index: number) => {
    const array = [...formData[arrayName]];
    array.splice(index, 1);
    updateForm({ [arrayName]: array });
  };

  // ✅ Image handler
  const handleImageChange = (key: 'logo' | 'coverImage', fileOrString: File | string) => {
    if (typeof fileOrString === 'string') {
      updateForm({ [key]: fileOrString });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateForm({ [key]: reader.result as string });
    };
    reader.readAsDataURL(fileOrString);
  };

  // Content blocks in fixed order for better UX
  const contentSections = [
    {
      id: 'logo',
      type: 'image' as const,
      field: 'logo' as const,
      label: 'Logo',
      description: 'Upload your institute logo (PNG/JPG)'
    },
    {
      id: 'coverImage',
      type: 'image' as const,
      field: 'coverImage' as const,
      label: 'Cover Image',
      description: 'Add a banner image for your institute'
    },
    {
      id: 'name',
      type: 'text' as const,
      field: 'name' as const,
      label: 'Institute Name',
      description: 'Enter the official name of your institute'
    },
    {
      id: 'tagline',
      type: 'text' as const,
      field: 'tagline' as const,
      label: 'Tagline',
      description: 'Short description shown below the name'
    },
    {
      id: 'establishedYear',
      type: 'text' as const,
      field: 'establishedYear' as const,
      label: 'Established Year',
      description: 'Year when your institute was founded'
    },
    {
      id: 'shortDescription',
      type: 'text' as const,
      field: 'shortDescription' as const,
      label: 'Introduction',
      description: 'Brief introduction about your institute'
    },
    {
      id: 'longDescription',
      type: 'text' as const,
      field: 'longDescription' as const,
      label: 'Detailed History',
      description: 'Comprehensive overview of your institute'
    },
    {
      id: 'mission',
      type: 'text' as const,
      field: 'mission' as const,
      label: 'Mission Statement',
      description: 'What your institute aims to achieve'
    },
    {
      id: 'vision',
      type: 'text' as const,
      field: 'vision' as const,
      label: 'Vision Statement',
      description: 'Future aspirations of your institute'
    },
    {
      id: 'accreditation',
      type: 'text' as const,
      field: 'accreditation' as const,
      label: 'Accreditation',
      description: 'Government and industry recognitions'
    },
  ];

  // Array sections
  const arraySections = [
    {
      id: 'highlights',
      type: 'array' as const,
      field: 'highlights' as const,
      label: 'Training Programs',
      description: 'List of your key training programs',
      fields: [{ name: 'text', label: 'Program Name', type: 'text' }]
    },
    {
      id: 'stats',
      type: 'array' as const,
      field: 'stats' as const,
      label: 'Impact Statistics',
      description: 'Numbers that showcase your success',
      fields: [
        { name: 'value', label: 'Value', type: 'number' },
        { name: 'suffix', label: 'Suffix (+, %, etc.)', type: 'text' },
        { name: 'label', label: 'Label', type: 'text' }
      ]
    },
    {
      id: 'pillars',
      type: 'array' as const,
      field: 'pillars' as const,
      label: 'Excellence Pillars',
      description: 'Your key strengths and differentiators',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]
    },
    {
      id: 'whyChooseUs',
      type: 'array' as const,
      field: 'whyChooseUs' as const,
      label: 'Why Choose Us',
      description: 'Features that make you stand out',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06B6D4]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-xl border border-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <FiCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium">Changes Saved Successfully!</p>
              <p className="text-sm text-gray-300">Your About section has been updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Section</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage institute information and branding</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <FiEdit2 className="w-4 h-4 mr-2" /> Edit Information
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCancel}>
                <FiX className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <FiSave className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  You can now modify all institute information. Changes will be saved directly to the database.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Main Content Sections */}
          {contentSections.map((section) => (
            <ContentSection
              key={section.id}
              section={section}
              isEditing={isEditing}
              formData={formData}
              onTextChange={handleTextChange}
              onImageChange={handleImageChange}
              maxLength={MAX_LENGTH}
            />
          ))}

          {/* Array Sections */}
          {arraySections.map((section) => (
            <ArraySection
              key={section.id}
              section={section}
              isEditing={isEditing}
              formData={formData}
              onArrayItemChange={handleArrayItemChange}
              onAddArrayItem={addArrayItem}
              onRemoveArrayItem={removeArrayItem}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Content Section Component
interface ContentSectionProps {
  section: {
    id: string;
    type: 'text' | 'image';
    field: keyof FormDataType;
    label: string;
    description: string;
  };
  isEditing: boolean;
  formData: FormDataType;
  onTextChange: (key: keyof FormDataType, value: string) => void;
  onImageChange: (key: 'logo' | 'coverImage', file: File | string) => void;
  maxLength: Record<string, number>;
}

function ContentSection({
  section,
  isEditing,
  formData,
  onTextChange,
  onImageChange,
  maxLength
}: ContentSectionProps) {
  const renderContent = () => {
    switch (section.type) {
      case 'text':
        const isTextArea = ['shortDescription', 'longDescription', 'mission', 'vision', 'accreditation'].includes(section.field);
        const charCount = (formData[section.field] as string || '').length;
        const charLimit = maxLength[section.field] || 1000;
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                {section.label}
              </label>
              <span className={`text-xs ${charCount > charLimit * 0.8 ? 'text-orange-500' : 'text-gray-500'}`}>
                {charCount}/{charLimit}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {section.description}
            </p>
            
            {isTextArea ? (
              <textarea
                value={formData[section.field] as string || ''}
                onChange={(e) => onTextChange(section.field, e.target.value)}
                disabled={!isEditing}
                rows={section.field === 'longDescription' ? 6 : 4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder={`Enter ${section.label.toLowerCase()}...`}
              />
            ) : (
              <input
                type="text"
                value={formData[section.field] as string || ''}
                onChange={(e) => onTextChange(section.field, e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder={`Enter ${section.label.toLowerCase()}...`}
              />
            )}
          </div>
        );

      case 'image':
        const isLogo = section.field === 'logo';
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {section.label}
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {section.description}
              </p>
            </div>
            
            <UploadImage
              value={formData[section.field] as string}
              onChange={(file) => onImageChange(section.field as 'logo' | 'coverImage', file)}
              onRemove={() => onImageChange(section.field as 'logo' | 'coverImage', '')}
              aspectRatio={isLogo ? "square" : "banner"}
              disabled={!isEditing}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:border-gray-300 dark:hover:border-gray-600">
      {renderContent()}
    </div>
  );
}

// Array Section Component
interface ArraySectionProps {
  section: {
    id: string;
    type: 'array';
    field: 'stats' | 'pillars' | 'whyChooseUs' | 'highlights';
    label: string;
    description: string;
    fields: Array<{ name: string; label: string; type: string }>;
  };
  isEditing: boolean;
  formData: FormDataType;
  onArrayItemChange: (arrayName: 'stats' | 'pillars' | 'whyChooseUs' | 'highlights', index: number, field: string, value: any) => void;
  onAddArrayItem: (arrayName: 'stats' | 'pillars' | 'whyChooseUs' | 'highlights') => void;
  onRemoveArrayItem: (arrayName: 'stats' | 'pillars' | 'whyChooseUs' | 'highlights', index: number) => void;
}

function ArraySection({
  section,
  isEditing,
  formData,
  onArrayItemChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: ArraySectionProps) {
  const array = formData[section.field];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            {section.label}
          </label>
          {isEditing && (
            <Button
              type="button"
              size="sm"
              onClick={() => onAddArrayItem(section.field)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FiPlus className="w-3 h-3 mr-1" /> Add Item
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {section.description}
        </p>
        
        <div className="space-y-4">
          {array.map((item, index) => (
            <div key={item.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {section.label} {index + 1}
                </span>
                {isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveArrayItem(section.field, index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {section.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={item[field.name as keyof typeof item] as number || ''}
                        onChange={(e) => onArrayItemChange(section.field, index, field.name, e.target.value)}
                        disabled={!isEditing}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700 resize-none"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === 'number' ? (
                      <input
                        type="number"
                        value={item[field.name as keyof typeof item] as number || ''}
                        onChange={(e) => onArrayItemChange(section.field, index, field.name, parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={item[field.name as keyof typeof item] as number || ''}
                        onChange={(e) => onArrayItemChange(section.field, index, field.name, e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}