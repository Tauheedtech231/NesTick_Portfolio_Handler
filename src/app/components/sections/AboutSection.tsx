'use client';

import React, { useState, useEffect } from 'react';
import { College } from '@/app/lib/gsap';
import { Button } from '@/components/ui/button';
import { UploadImage } from '@/components/ui/UploadImage';
import { FiEdit2, FiSave, FiX, FiVideo, FiYoutube, FiTrash2 } from 'react-icons/fi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Define block types for drag and drop
type ContentBlockType = 'text' | 'image' | 'video';

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  field?: keyof FormDataType;
  label: string;
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

  // Define content blocks with their order
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { id: 'logo', type: 'image', field: 'logo', label: 'College Logo' },
    { id: 'coverImage', type: 'image', field: 'coverImage', label: 'Cover Image' },
    { id: 'name', type: 'text', field: 'name', label: 'College Name' },
    { id: 'shortDescription', type: 'text', field: 'shortDescription', label: 'Short Description' },
    { id: 'longDescription', type: 'text', field: 'longDescription', label: 'Long Description' },
    { id: 'mission', type: 'text', field: 'mission', label: 'Mission' },
    { id: 'vision', type: 'text', field: 'vision', label: 'Vision' },
  ]);

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

  // Configure drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ✅ Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      setFormData(parsedData.formData || parsedData);
      
      // Load block order if saved
      if (parsedData.contentBlocks) {
        setContentBlocks(parsedData.contentBlocks);
      }
    }
  }, [STORAGE_KEY]);

  const updateForm = (patch: Partial<FormDataType>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const dataToSave = {
      formData,
      contentBlocks,
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
      if (parsedData.contentBlocks) {
        setContentBlocks(parsedData.contentBlocks);
      }
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
  };

  // ✅ Drag and drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setContentBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ✅ Add video block
  const addVideoBlock = () => {
    const videoBlock: ContentBlock = {
      id: `video-${Date.now()}`,
      type: 'video',
      label: 'Video Content'
    };
    setContentBlocks(prev => [...prev, videoBlock]);
  };

  // ✅ Remove block (only for video blocks)
  const removeBlock = (blockId: string) => {
    if (blockId.startsWith('video-')) {
      setContentBlocks(prev => prev.filter(block => block.id !== blockId));
      removeVideo();
    }
  };

  // Check if video block exists
  const hasVideoBlock = contentBlocks.some(block => block.type === 'video');

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

      {isEditing && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Drag & Drop Enabled</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Drag blocks to rearrange content order
              </p>
            </div>
            {!hasVideoBlock && (
              <Button onClick={addVideoBlock} variant="outline" size="sm">
                <FiVideo className="w-4 h-4 mr-2" /> Add Video
              </Button>
            )}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={contentBlocks} strategy={verticalListSortingStrategy}>
          <div className="grid gap-6">
            {contentBlocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                isEditing={isEditing}
                formData={formData}
                onTextChange={handleTextChange}
                onImageChange={handleImageChange}
                onVideoUrlChange={handleVideoUrlChange}
                onLocalVideoChange={handleLocalVideoChange}
                onRemoveVideo={removeVideo}
                onRemoveBlock={() => removeBlock(block.id)}
                maxLength={MAX_LENGTH}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Sortable Block Component
interface SortableBlockProps {
  block: ContentBlock;
  isEditing: boolean;
  formData: FormDataType;
  onTextChange: (key: keyof FormDataType, value: string) => void;
  onImageChange: (key: 'logo' | 'coverImage', file: File | string) => void;
  onVideoUrlChange: (url: string) => void;
  onLocalVideoChange: (file: File) => void;
  onRemoveVideo: () => void;
  onRemoveBlock: () => void;
  maxLength: Record<keyof FormDataType, number>;
}

function SortableBlock({
  block,
  isEditing,
  formData,
  onTextChange,
  onImageChange,
  onVideoUrlChange,
  onLocalVideoChange,
  onRemoveVideo,
  onRemoveBlock,
  maxLength
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        if (!block.field) return null;
        
        const isTextArea = ['shortDescription', 'longDescription', 'mission', 'vision'].includes(block.field);
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
              {block.label} ({(formData[block.field] ?? '').length}/{maxLength[block.field]})
            </label>
            {isTextArea ? (
              <textarea
                value={formData[block.field] || ''}
                onChange={(e) => onTextChange(block.field!, e.target.value)}
                disabled={!isEditing}
                rows={block.field === 'longDescription' ? 4 : 2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 resize-none"
              />
            ) : (
              <input
                type="text"
                value={formData[block.field] || ''}
                onChange={(e) => onTextChange(block.field!, e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            )}
          </div>
        );

      case 'image':
        if (!block.field) return null;
        
        const isLogo = block.field === 'logo';
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {block.label} (PNG/JPG, max 500KB)
            </label>
            <UploadImage
              value={formData[block.field]}
              onChange={(file) => onImageChange(block.field as 'logo' | 'coverImage', file)}
              onRemove={() => onImageChange(block.field as 'logo' | 'coverImage', '')}
              aspectRatio={isLogo ? "square" : "banner"}
            />
          </div>
        );

      case 'video':
        return (
          <VideoBlock
            formData={formData}
            isEditing={isEditing}
            onVideoUrlChange={onVideoUrlChange}
            onLocalVideoChange={onLocalVideoChange}
            onRemoveVideo={onRemoveVideo}
            onRemoveBlock={onRemoveBlock}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group ${
        isEditing ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Drag handle */}
      {isEditing && (
        <div className="absolute -left-8 top-0 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
            <div className="w-4 h-4 flex flex-col justify-between">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

// Video Block Component
interface VideoBlockProps {
  formData: FormDataType;
  isEditing: boolean;
  onVideoUrlChange: (url: string) => void;
  onLocalVideoChange: (file: File) => void;
  onRemoveVideo: () => void;
  onRemoveBlock: () => void;
}

function VideoBlock({
  formData,
  isEditing,
  onVideoUrlChange,
  onLocalVideoChange,
  onRemoveVideo,
  onRemoveBlock
}: VideoBlockProps) {
  const [videoUrlInput, setVideoUrlInput] = useState(formData.videoUrl || '');

  const handleUrlSubmit = () => {
    onVideoUrlChange(videoUrlInput);
  };

  const handleLocalVideoUpload = (file: File) => {
    onLocalVideoChange(file);
  };

  const handleRemove = () => {
    onRemoveVideo();
    onRemoveBlock();
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiVideo className="w-5 h-5" /> Video Content
        </h3>
        {isEditing && (
          <Button variant="destructive" size="sm" onClick={handleRemove}>
            <FiTrash2 className="w-4 h-4 mr-2" /> Remove
          </Button>
        )}
      </div>

      {/* Video Preview */}
      {(formData.videoUrl || formData.localVideo) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Preview:</h4>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
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
              <div className="w-full h-full flex items-center justify-center text-white">
                Invalid video URL
              </div>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <div className="space-y-4">
          {/* YouTube URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FiYoutube className="w-4 h-4 inline mr-2" />
              YouTube URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <Button onClick={handleUrlSubmit} disabled={!videoUrlInput}>
                Add URL
              </Button>
            </div>
          </div>

          {/* Local Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FiVideo className="w-4 h-4 inline mr-2" />
              Upload Local Video (MP4, max 10MB)
            </label>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
                  handleLocalVideoUpload(file);
                } else {
                  alert('Please select a video file under 10MB');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}