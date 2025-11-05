'use client';

import React, { useState, useEffect } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';

interface AboutSectionProps {
  college: College;
}

// Typed form data
interface FormDataType {
  logo?: string;        // base64 string
  coverImage?: string;  // base64 string
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

  const MAX_LENGTH: Record<keyof FormDataType, number> = {
    name: 50,
    shortDescription: 150,
    longDescription: 500,
    mission: 200,
    vision: 200,
    logo: 0,
    coverImage: 0,
  };

  const MAX_FILE_SIZE_MB = 2;
  const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFormData(JSON.parse(saved));
  }, [STORAGE_KEY]);

  const updateForm = (patch: Partial<FormDataType>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFormData(JSON.parse(saved));
    else
      setFormData({
        name: college.name || '',
        shortDescription: college.shortDescription || '',
        longDescription: college.longDescription || '',
        mission: college.mission || '',
        vision: college.vision || '',
        logo: college.logo || undefined,
        coverImage: college.coverImage || undefined,
      });
    setIsEditing(false);
  };

  const handleTextChange = (key: keyof FormDataType, value: string) => {
    if (value.length <= MAX_LENGTH[key]) updateForm({ [key]: value });
  };

  // Handle image change
const handleImageChange = (key: 'logo' | 'coverImage', fileOrString: File | string) => {
  if (typeof fileOrString === 'string') {
    // already base64
    updateForm({ [key]: fileOrString });
    return;
  }

  // file validation
  if (!ALLOWED_FILE_TYPES.includes(fileOrString.type)) {
    alert('Only PNG or JPG files are allowed!');
    return;
  }

  if (fileOrString.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    alert('File size exceeds 2MB!');
    return;
  }



  const reader = new FileReader();
  reader.onloadend = () => {
    updateForm({ [key]: reader.result as string });
  };
  reader.readAsDataURL(fileOrString);
};


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About College</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage college info and branding</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <FiEdit2 className="w-4 h-4 mr-2" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              <FiX className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSave}>
              <FiSave className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {/* Logo & Cover */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              College Logo (PNG/JPG, max 2MB)
            </label>
            <UploadImage
              value={formData.logo}
              onChange={(file) => handleImageChange('logo', file )}
              onRemove={() => updateForm({ logo: undefined })}
              aspectRatio="square"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image (PNG/JPG, max 2MB)
            </label>
            <UploadImage
              value={formData.coverImage}
              onChange={(file) => handleImageChange('coverImage', file)}
              onRemove={() => updateForm({ coverImage: undefined })}
              aspectRatio="banner"
            />
          </div>
        </div>

        {/* Text Fields */}
        <div className="grid gap-4">
          {(['name', 'shortDescription', 'longDescription', 'mission', 'vision'] as (keyof FormDataType)[]).map((key) => {
            const isTextArea = ['shortDescription', 'longDescription', 'mission', 'vision'].includes(key);
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
  {key.replace(/([A-Z])/g, ' $1')} ({(formData[key] ?? '').length}/{MAX_LENGTH[key]})
</label>

                {isTextArea ? (
                  <textarea
                    value={formData[key]}
                    onChange={(e) => handleTextChange(key, e.target.value)}
                    disabled={!isEditing}
                    rows={key === 'longDescription' ? 4 : 2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[key]}
                    onChange={(e) => handleTextChange(key, e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
