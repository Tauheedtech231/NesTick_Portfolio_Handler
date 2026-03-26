// components/landing/BuyNowModal.tsx
'use client';

import { X, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Template {
  id: number;
  name: string;
  type: 'free' | 'paid';
}

interface BuyNowFormData {
  name: string;
  college: string;
  email: string;
  phone: string;
  selectedPlan: string;
  templateName: string;
}

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: Template | null;
  formData: BuyNowFormData;
  formErrors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BuyNowModal({
  isOpen,
  onClose,
  selectedTemplate,
  formData,
  formErrors,
  touchedFields,
  isSubmitting,
  onInputChange,
  onBlur,
  onSubmit
}: BuyNowModalProps) {
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

  if (!isOpen || !selectedTemplate) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0F172A] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-[#1E293B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with visible close button */}
        <div className="sticky top-0 bg-[#0F172A] border-b border-[#1E293B] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{selectedTemplate.name}</h3>
              <p className="text-sm text-gray-400">Submit Request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#1E293B] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              onBlur={onBlur}
              required
              className={`w-full px-4 py-2.5 rounded-lg bg-[#0B0F19] border text-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                formErrors.name && touchedFields.name ? 'border-red-500' : 'border-[#1E293B]'
              }`}
              placeholder="Enter your full name"
            />
            {formErrors.name && touchedFields.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              College Name *
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={onInputChange}
              onBlur={onBlur}
              required
              className={`w-full px-4 py-2.5 rounded-lg bg-[#0B0F19] border text-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                formErrors.college && touchedFields.college ? 'border-red-500' : 'border-[#1E293B]'
              }`}
              placeholder="Enter your college name"
            />
            {formErrors.college && touchedFields.college && (
              <p className="text-red-500 text-xs mt-1">{formErrors.college}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              onBlur={onBlur}
              required
              className={`w-full px-4 py-2.5 rounded-lg bg-[#0B0F19] border text-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                formErrors.email && touchedFields.email ? 'border-red-500' : 'border-[#1E293B]'
              }`}
              placeholder="Enter your email"
            />
            {formErrors.email && touchedFields.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              onBlur={onBlur}
              required
              className={`w-full px-4 py-2.5 rounded-lg bg-[#0B0F19] border text-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                formErrors.phone && touchedFields.phone ? 'border-red-500' : 'border-[#1E293B]'
              }`}
              placeholder="Enter your phone number"
            />
            {formErrors.phone && touchedFields.phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
            )}
          </div>

          {selectedTemplate.type === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Plan *
              </label>
              <select
                name="selectedPlan"
                value={formData.selectedPlan}
                onChange={onInputChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all"
              >
                <option value="basic">Basic Plan - $49</option>
                <option value="professional">Professional Plan - $99</option>
                <option value="enterprise">Enterprise Plan - $199</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}