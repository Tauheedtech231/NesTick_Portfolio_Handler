'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { FiUpload, FiLink, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface UploadImageProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
}

export function UploadImage({
  value,
  onChange,
  onRemove,
  className,
  aspectRatio = 'square'
}: UploadImageProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[21/9]'
  };

  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) handleFileSelect(imageFile);
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl('');
      setShowUrlInput(false);
    }
  }, [imageUrl, onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // ✅ When image is already uploaded
  if (value) {
    return (
      <div className={cn('relative group', className)}>
        <div className={cn('relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800', aspectClasses[aspectRatio])}>
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={value.startsWith('data:')} // ✅ Prevents Next.js optimization error for base64
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="rounded-full"
            >
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ When no image is uploaded yet
  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-xl transition-colors',
        isDragOver 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
        aspectClasses[aspectRatio],
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Drag & drop an image or
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowUrlInput(true)}
          >
            <FiLink className="w-4 h-4 mr-1" />
            Paste URL
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {showUrlInput && (
          <form onSubmit={handleUrlSubmit} className="mt-4 w-full">
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" size="sm">Add</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
