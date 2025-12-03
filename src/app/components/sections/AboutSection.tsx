'use client';

import React, { useState, useEffect } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiInfo } from 'react-icons/fi';

interface AboutSectionProps {
  college: College;
}

// Form data without video support
interface FormDataType {
  logo?: string;
  coverImage?: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  mission: string;
  vision: string;
}

export function AboutSection({ college }: AboutSectionProps) {
  const STORAGE_KEY = `about_${college.id}`;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: college.name || '',
    shortDescription: college.shortDescription || '',
    longDescription: college.longDescription || '',
    mission: college.mission || '',
    vision: college.vision || '',
    logo: college.logo || undefined,
    coverImage: college.coverImage || undefined,
  });

  const [isSaving, setIsSaving] = useState(false);

  const MAX_LENGTH: Record<keyof FormDataType, number> = {
    name: 50,
    shortDescription: 150,
    longDescription: 500,
    mission: 200,
    vision: 200,
    logo: 0,
    coverImage: 0,
  };

  // ✅ Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      setFormData(parsedData.formData || parsedData);
    }
  }, [STORAGE_KEY]);

  // ✅ Load data from database on initial load
  useEffect(() => {
    const loadFromDatabase = async () => {
      try {
        const response = await fetch(
          `/api/sections?template_id=1&section_name=About`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.sections && data.sections.length > 0) {
            const dbContent = data.sections[0].content;
            
            // Update form data from database
            setFormData(prev => ({
              ...prev,
              name: dbContent.text?.name || prev.name,
              shortDescription: dbContent.text?.shortDescription || prev.shortDescription,
              longDescription: dbContent.text?.longDescription || prev.longDescription,
              mission: dbContent.text?.mission || prev.mission,
              vision: dbContent.text?.vision || prev.vision,
              logo: dbContent.images?.logo || prev.logo,
              coverImage: dbContent.images?.coverImage || prev.coverImage,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load from database:', error);
      }
    };
    
    loadFromDatabase();
  }, []);

  const updateForm = (patch: Partial<FormDataType>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage
      const dataToSave = {
        formData,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      
      // Prepare content for database
      const dbContent = {
        text: {
          name: formData.name,
          shortDescription: formData.shortDescription,
          longDescription: formData.longDescription,
          mission: formData.mission,
          vision: formData.vision
        },
        images: {
          logo: formData.logo || null,
          coverImage: formData.coverImage || null
        }
      };
      
      // Save to database
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: 1,
          section_name: "About",
          content: dbContent
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save to database');
      }
      
      const result = await response.json();
      console.log('Saved to database:', result);
      
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      setFormData(parsedData.formData || parsedData);
    } else {
      setFormData({
        name: college.name || '',
        shortDescription: college.shortDescription || '',
        longDescription: college.longDescription || '',
        mission: college.mission || '',
        vision: college.vision || '',
        logo: college.logo || undefined,
        coverImage: college.coverImage || undefined,
      });
    }
    setIsEditing(false);
  };

  const handleTextChange = (key: keyof FormDataType, value: string) => {
    if (value.length <= MAX_LENGTH[key]) updateForm({ [key]: value });
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
      label: 'College Logo',
      description: 'Upload your college logo (PNG/JPG, max 500KB)'
    },
    {
      id: 'coverImage',
      type: 'image' as const,
      field: 'coverImage' as const,
      label: 'Cover Image',
      description: 'Add a banner image for your college (PNG/JPG, max 500KB)'
    },
    {
      id: 'name',
      type: 'text' as const,
      field: 'name' as const,
      label: 'College Name',
      description: 'Enter the official name of your college'
    },
    {
      id: 'shortDescription',
      type: 'text' as const,
      field: 'shortDescription' as const,
      label: 'Short Description',
      description: 'Brief introduction about your college (max 150 characters)'
    },
    {
      id: 'longDescription',
      type: 'text' as const,
      field: 'longDescription' as const,
      label: 'Detailed Description',
      description: 'Comprehensive overview of your college (max 500 characters)'
    },
    {
      id: 'mission',
      type: 'text' as const,
      field: 'mission' as const,
      label: 'Mission Statement',
      description: 'What your college aims to achieve (max 200 characters)'
    },
    {
      id: 'vision',
      type: 'text' as const,
      field: 'vision' as const,
      label: 'Vision Statement',
      description: 'Future aspirations of your college (max 200 characters)'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About College</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage college information and branding</p>
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
                You can now modify all college information. Changes will be saved to your browsers storage and database.
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
      </div>
    </div>
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
  maxLength: Record<keyof FormDataType, number>;
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
        const isTextArea = ['shortDescription', 'longDescription', 'mission', 'vision'].includes(section.field);
        const charCount = (formData[section.field] ?? '').length;
        const charLimit = maxLength[section.field];
        
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
                value={formData[section.field] || ''}
                onChange={(e) => onTextChange(section.field, e.target.value)}
                disabled={!isEditing}
                rows={section.field === 'longDescription' ? 5 : 3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder={`Enter ${section.label.toLowerCase()}...`}
              />
            ) : (
              <input
                type="text"
                value={formData[section.field] || ''}
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
              value={formData[section.field]}
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