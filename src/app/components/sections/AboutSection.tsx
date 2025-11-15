'use client';

import React, { useState, useEffect } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiVideo, FiYoutube, FiTrash2, FiInfo } from 'react-icons/fi';

interface AboutSectionProps {
  college: College;
}

// Extended form data with video support
interface FormDataType {
  logo?: string;
  coverImage?: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  mission: string;
  vision: string;
  videoUrl?: string;
  localVideo?: string; // base64 for local videos
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
    videoUrl: '',
    localVideo: undefined,
  });

  const [showVideoSection, setShowVideoSection] = useState(false);

  const MAX_LENGTH: Record<keyof FormDataType, number> = {
    name: 50,
    shortDescription: 150,
    longDescription: 500,
    mission: 200,
    vision: 200,
    logo: 0,
    coverImage: 0,
    videoUrl: 500,
    localVideo: 0,
  };

  // ✅ Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      setFormData(parsedData.formData || parsedData);
      
      // Check if video content exists
      if (parsedData.videoUrl || parsedData.localVideo) {
        setShowVideoSection(true);
      }
    }
  }, [STORAGE_KEY]);

  const updateForm = (patch: Partial<FormDataType>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const dataToSave = {
      formData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setIsEditing(false);
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
        videoUrl: '',
        localVideo: undefined,
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

  // ✅ Video handlers
  const handleVideoUrlChange = (url: string) => {
    updateForm({ videoUrl: url, localVideo: undefined });
  };

  const handleLocalVideoChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateForm({ localVideo: reader.result as string, videoUrl: '' });
    };
    reader.readAsDataURL(file);
  };

  const removeVideo = () => {
    updateForm({ videoUrl: '', localVideo: undefined });
    setShowVideoSection(false);
  };

  const addVideoSection = () => {
    setShowVideoSection(true);
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
            <Button onClick={handleSave}>
              <FiSave className="w-4 h-4 mr-2" /> Save Changes
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
                You can now modify all college information. Changes will be saved to your browsers storage.
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

        {/* Video Section */}
        {(showVideoSection || isEditing) && (
          <VideoSection
            formData={formData}
            isEditing={isEditing}
            onVideoUrlChange={handleVideoUrlChange}
            onLocalVideoChange={handleLocalVideoChange}
            onRemoveVideo={removeVideo}
            onRemoveSection={() => setShowVideoSection(false)}
          />
        )}

        {/* Add Video Section Button */}
        {isEditing && !showVideoSection && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
            <FiVideo className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Add Video Content
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Enhance your college profile with a video tour or promotional content
            </p>
            <Button onClick={addVideoSection}>
              <FiVideo className="w-4 h-4 mr-2" /> Add Video Section
            </Button>
          </div>
        )}
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

// Video Section Component
interface VideoSectionProps {
  formData: FormDataType;
  isEditing: boolean;
  onVideoUrlChange: (url: string) => void;
  onLocalVideoChange: (file: File) => void;
  onRemoveVideo: () => void;
  onRemoveSection: () => void;
}

function VideoSection({
  formData,
  isEditing,
  onVideoUrlChange,
  onLocalVideoChange,
  onRemoveVideo,
  onRemoveSection
}: VideoSectionProps) {
  const [videoUrlInput, setVideoUrlInput] = useState(formData.videoUrl || '');

  const handleUrlSubmit = () => {
    if (videoUrlInput.trim()) {
      onVideoUrlChange(videoUrlInput.trim());
    }
  };

  const handleLocalVideoUpload = (file: File) => {
    onLocalVideoChange(file);
  };

  const handleRemove = () => {
    onRemoveVideo();
    onRemoveSection();
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  const hasVideoContent = formData.videoUrl || formData.localVideo;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FiVideo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add a video tour or promotional content
            </p>
          </div>
        </div>
        {isEditing && (
          <Button variant="destructive" size="sm" onClick={handleRemove}>
            <FiTrash2 className="w-4 h-4 mr-2" /> Remove
          </Button>
        )}
      </div>

      {/* Video Preview */}
      {hasVideoContent && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Video Preview</h4>
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
            {formData.localVideo ? (
              <video
                controls
                className="w-full h-full object-contain"
                src={formData.localVideo}
              />
            ) : formData.videoUrl && isYouTubeUrl(formData.videoUrl) ? (
              <iframe
                src={getYouTubeEmbedUrl(formData.videoUrl)}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                <div className="text-center">
                  <FiVideo className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Invalid video URL</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <div className="space-y-6">
          {/* YouTube URL Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <FiYoutube className="w-4 h-4 inline mr-2" />
              YouTube Video URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <Button 
                onClick={handleUrlSubmit} 
                disabled={!videoUrlInput.trim()}
                className="whitespace-nowrap"
              >
                Add YouTube Video
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Paste a YouTube video URL to embed it on your page
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-800 text-gray-500">Or</span>
            </div>
          </div>

          {/* Local Video Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <FiVideo className="w-4 h-4 inline mr-2" />
              Upload Local Video
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size <= 10 * 1024 * 1024) { // 10MB limit
                      handleLocalVideoUpload(file);
                    } else {
                      alert('Please select a video file under 10MB');
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FiVideo className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload a video file (MP4, max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}