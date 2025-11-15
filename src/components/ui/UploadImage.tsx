'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { FiUpload, FiLink, FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface UploadImageProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
  disabled?: boolean; // ✅ Added disabled prop
}

interface AlertMessage {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  duration?: number;
}

const MAX_FILE_SIZE = 500 * 1024; // ✅ 500 KB limit

export function UploadImage({
  value,
  onChange,
  onRemove,
  className,
  aspectRatio = 'square',
  disabled = false, // ✅ Default to false
}: UploadImageProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[21/9]',
  };

  // Auto-remove alerts after their duration
  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts(prev => prev.slice(1));
      }, alerts[0].duration || 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  const showAlert = useCallback((type: AlertMessage['type'], title: string, message: string, duration = 5000) => {
    const newAlert: AlertMessage = {
      id: Date.now().toString(),
      type,
      title,
      message,
      duration,
    };
    
    setAlerts(prev => [...prev, newAlert]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (disabled) return; // ✅ Prevent if disabled
      
      if (file.size > MAX_FILE_SIZE) {
        showAlert(
          'error',
          'File Too Large',
          `Please select an image smaller than 500KB. Your file is ${(file.size / 1024).toFixed(0)}KB.`,
          6000
        );
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showAlert(
          'error',
          'Invalid File Type',
          'Please select a valid image file (JPEG, PNG, GIF, or WebP).',
          5000
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => {
        showAlert('info', 'Uploading', 'Processing your image...', 3000);
      };

      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        showAlert(
          'success',
          'Upload Successful!',
          'Your image has been uploaded successfully.',
          4000
        );
      };

      reader.onerror = () => {
        showAlert(
          'error',
          'Upload Failed',
          'Failed to process the image. Please try again.',
          5000
        );
      };

      reader.readAsDataURL(file);
    },
    [onChange, showAlert, disabled] // ✅ Added disabled to dependencies
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return; // ✅ Prevent if disabled
      
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        handleFileSelect(imageFile);
      } else {
        showAlert(
          'error',
          'Invalid File',
          'Please drop a valid image file.',
          4000
        );
      }
    },
    [handleFileSelect, showAlert, disabled] // ✅ Added disabled to dependencies
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return; // ✅ Prevent if disabled
      
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
      
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelect, disabled] // ✅ Added disabled to dependencies
  );

  const handleUrlSubmit = useCallback(
    (e: React.FormEvent) => {
      if (disabled) {
        e.preventDefault();
        return; // ✅ Prevent if disabled
      }
      
      e.preventDefault();
      if (imageUrl) {
        // Basic URL validation
        try {
          new URL(imageUrl);
          onChange(imageUrl);
          setImageUrl('');
          setShowUrlInput(false);
          showAlert(
            'success',
            'URL Added',
            'Image URL has been added successfully.',
            4000
          );
        } catch {
          showAlert(
            'error',
            'Invalid URL',
            'Please enter a valid image URL.',
            5000
          );
        }
      }
    },
    [imageUrl, onChange, showAlert, disabled] // ✅ Added disabled to dependencies
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (disabled) return; // ✅ Prevent if disabled
    
    e.preventDefault();
    setIsDragOver(true);
  }, [disabled]); // ✅ Added disabled to dependencies

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (disabled) return; // ✅ Prevent if disabled
    
    e.preventDefault();
    setIsDragOver(false);
  }, [disabled]); // ✅ Added disabled to dependencies

  const getAlertStyles = (type: AlertMessage['type']) => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-xl shadow-2xl border-l-4 max-w-sm w-full transform transition-all duration-300 mx-auto";
    
    switch (type) {
      case 'error':
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200`;
      case 'success':
        return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200`;
      case 'info':
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200`;
      default:
        return `${baseStyles} bg-gray-50 dark:bg-gray-900/20 border-gray-500`;
    }
  };

  const getAlertIcon = (type: AlertMessage['type']) => {
    const iconClass = "w-5 h-5 flex-shrink-0 mt-0.5";
    
    switch (type) {
      case 'error':
        return <FiAlertCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <FiAlertCircle className={`${iconClass} text-yellow-500`} />;
      case 'success':
        return <FiCheckCircle className={`${iconClass} text-green-500`} />;
      case 'info':
        return <FiInfo className={`${iconClass} text-blue-500`} />;
      default:
        return <FiInfo className={iconClass} />;
    }
  };

  // ✅ When image is already uploaded
  if (value) {
    return (
      <>
        {/* Alert Messages - TOP CENTER POSITION */}
        {alerts.length > 0 && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 pointer-events-none w-full max-w-sm">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={cn(
                  getAlertStyles(alert.type),
                  "animate-in slide-in-from-top-full duration-500 pointer-events-auto"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                  <p className="text-sm opacity-90">{alert.message}</p>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={cn('relative group', className)}>
          <div
            className={cn(
              'relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
              aspectClasses[aspectRatio],
              disabled && 'opacity-60' // ✅ Add opacity when disabled
            )}
          >
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={value.startsWith('data:')}
            />
            {!disabled && ( // ✅ Only show remove button when not disabled
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
            )}
          </div>
        </div>
      </>
    );
  }

  // ✅ When no image is uploaded yet
  return (
    <>
      {/* Alert Messages - TOP CENTER POSITION */}
      {alerts.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 pointer-events-none w-full max-w-sm">
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className={cn(
                getAlertStyles(alert.type),
                "animate-in slide-in-from-top-full duration-500 pointer-events-auto"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                <p className="text-sm opacity-90">{alert.message}</p>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={cn(
          'border-2 border-dashed rounded-xl transition-colors',
          isDragOver && !disabled
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : disabled
            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed' // ✅ Disabled styles
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          aspectClasses[aspectRatio],
          className
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className={cn(
          "flex flex-col items-center justify-center h-full p-6 text-center",
          disabled && "opacity-60" // ✅ Add opacity when disabled
        )}>
          <FiUpload className={cn(
            "w-8 h-8 mb-2",
            disabled ? "text-gray-400" : "text-gray-400"
          )} />
          <p className={cn(
            "text-sm mb-4",
            disabled ? "text-gray-500 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"
          )}>
            {disabled ? "Upload disabled" : "Drag & drop an image or"}
          </p>

          {!disabled && ( // ✅ Only show buttons when not disabled
            <>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  Browse Files
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowUrlInput(true)}
                  disabled={disabled}
                >
                  <FiLink className="w-4 h-4 mr-1" />
                  Paste URL
                </Button>
              </div>

              {/* File size info */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Max file size: 500KB • Supported: JPG, PNG, GIF, WebP
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileInput}
                className="hidden"
                disabled={disabled}
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
                      required
                      disabled={disabled}
                    />
                    <Button type="submit" size="sm" disabled={disabled}>
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}