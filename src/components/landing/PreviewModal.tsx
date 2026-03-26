// components/landing/PreviewModal.tsx
'use client';

import { X, ExternalLink, Eye } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  templateName: string;
  description: string;
  liveUrl: string | null;
}

export default function PreviewModal({
  isOpen,
  onClose,
  imageUrl,
  templateName,
  description,
  liveUrl
}: PreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0F172A] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#1E293B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0F172A] border-b border-[#1E293B] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{templateName}</h3>
              <p className="text-sm text-gray-400">Template Preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Image */}
          <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6 bg-[#1E293B]">
            <Image
              src={imageUrl}
              alt={templateName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-white font-semibold text-lg mb-2">About this template</h4>
            <p className="text-gray-400 leading-relaxed">{description}</p>
          </div>

          {/* Live Demo Button */}
          {liveUrl && (
            <div className="mt-6">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1D4ED8]/30 transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}