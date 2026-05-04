// components/landing/BuyNowModal.tsx
'use client';

import { X, Sparkles, CheckCircle, Layout, Diamond, Gem } from 'lucide-react';
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
  designation: string;
  studentCount: string;
  selectedPlan: string;
  templateName: string;
  requirements: string;
  timeline: string;
  hearAbout: string;
}

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: Template | null;
  formData: BuyNowFormData;
  formErrors: Record<string, string>;
  touchedFields: Record<string, boolean>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// Plans Data
const plans = [
  {
    name: "Basic",
    color: "#1F4381",
    bgColor: "rgba(31, 67, 129, 0.15)",
    lightBg: "rgba(31, 67, 129, 0.08)",
    icon: Layout,
    features: [
      "Portfolio site",
      "Basic template",
      "24/7 support",
      "Full customization",
      "Admin control",
      "Drag & drop site management"
    ]
  },
  {
    name: "Most Featured",
    color: "#E8CA5E",
    bgColor: "rgba(232, 202, 94, 0.15)",
    lightBg: "rgba(232, 202, 94, 0.08)",
    icon: Diamond,
    features: [
      "LMS / Admission automation",
      "Portfolio site (free)",
      "24/7 support",
      "Free maintenance at P.S.",
      "Admin control",
      "Multi portal and customizable apps"
    ]
  },
  {
    name: "Premium",
    color: "#00E0FF",
    bgColor: "rgba(0, 224, 255, 0.15)",
    lightBg: "rgba(0, 224, 255, 0.08)",
    icon: Gem,
    features: [
      "Complete ERP",
      "Portfolio site (free)",
      "70% off on paid templates",
      "Free maintenance at P.S.",
      "Customizable ERP system",
      "24/7 support"
    ]
  }
];

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
  const [activePlan, setActivePlan] = useState(formData.selectedPlan || "Most Featured");

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

  // Get current plan details
  const currentPlan = plans.find(p => p.name === activePlan) || plans[1];

  if (!isOpen || !selectedTemplate) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0F172A] rounded-2xl w-full max-w-2xl my-4 sm:my-8 shadow-2xl border border-[#1E293B] overflow-y-auto max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-[#0F172A] border-b border-[#1E293B] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-lg sm:rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">{selectedTemplate.name}</h3>
              <p className="text-xs sm:text-sm text-gray-400">Submit your request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[#1E293B] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Two Column Layout for Name and Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                onBlur={onBlur}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                  formErrors.name && touchedFields.name ? 'border-red-500' : 'border-[#1E293B]'
                }`}
                placeholder="Enter full name"
              />
              {formErrors.name && touchedFields.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={onInputChange}
                onBlur={onBlur}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                  formErrors.designation && touchedFields.designation ? 'border-red-500' : 'border-[#1E293B]'
                }`}
                placeholder="e.g., Principal, IT Head"
              />
              {formErrors.designation && touchedFields.designation && (
                <p className="text-red-500 text-xs mt-1">{formErrors.designation}</p>
              )}
            </div>
          </div>

          {/* Two Column Layout for College and Student Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                College Name *
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={onInputChange}
                onBlur={onBlur}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                  formErrors.college && touchedFields.college ? 'border-red-500' : 'border-[#1E293B]'
                }`}
                placeholder="Enter college name"
              />
              {formErrors.college && touchedFields.college && (
                <p className="text-red-500 text-xs mt-1">{formErrors.college}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Number of Students
              </label>
              <select
                name="studentCount"
                value={formData.studentCount}
                onChange={onInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all"
              >
                <option value="">Select range</option>
                <option value="< 500">Less than 500</option>
                <option value="500 - 1000">500 - 1,000</option>
                <option value="1000 - 5000">1,000 - 5,000</option>
                <option value="5000 - 10000">5,000 - 10,000</option>
                <option value="> 10000">More than 10,000</option>
              </select>
            </div>
          </div>

          {/* Two Column Layout for Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                onBlur={onBlur}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                  formErrors.email && touchedFields.email ? 'border-red-500' : 'border-[#1E293B]'
                }`}
                placeholder="Enter email address"
              />
              {formErrors.email && touchedFields.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                onBlur={onBlur}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all ${
                  formErrors.phone && touchedFields.phone ? 'border-red-500' : 'border-[#1E293B]'
                }`}
                placeholder="+92 300 1234567"
              />
              {formErrors.phone && touchedFields.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Plan Selection for Paid Templates */}
          {selectedTemplate.type === 'paid' && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                Select Your Plan *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {plans.map((plan) => {
                  const PlanIcon = plan.icon;
                  const isSelected = activePlan === plan.name;
                  return (
                    <label
                      key={plan.name}
                      className={`cursor-pointer rounded-xl p-3 sm:p-4 transition-all border-2 ${
                        isSelected
                          ? `border-[${plan.color}]`
                          : 'border-transparent hover:border-gray-600'
                      }`}
                      style={{
                        borderColor: isSelected ? plan.color : 'transparent',
                        backgroundColor: isSelected ? plan.bgColor : (typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'rgba(15,23,42,0.5)' : 'rgba(0,0,0,0.05)'),
                      }}
                    >
                      <input
                        type="radio"
                        name="selectedPlan"
                        value={plan.name}
                        checked={isSelected}
                        onChange={(e) => {
                          setActivePlan(e.target.value);
                          onInputChange(e);
                        }}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 mb-2">
                        <PlanIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: plan.color }} />
                        <span className="font-semibold text-sm sm:text-base" style={{ color: isSelected ? plan.color : (typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#1F2937') }}>
                          {plan.name}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" style={{ color: plan.color }} />
                            <span className="text-[10px] sm:text-xs text-gray-400 truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Selected Plan Full Details */}
              <div className="mt-3 p-2.5 sm:p-3 rounded-lg" style={{ backgroundColor: currentPlan.lightBg }}>
                <p className="text-[10px] sm:text-xs text-gray-400 mb-1">✨ {currentPlan.name} Plan includes:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {currentPlan.features.map((feature, idx) => (
                    <span key={idx} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-gray-800/50 text-gray-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Dropdown */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Expected Timeline
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={onInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all"
            >
              <option value="">Select timeline</option>
              <option value="Immediate">Immediate (ASAP)</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="Planning stage">Just planning/researching</option>
            </select>
          </div>

          {/* Requirements Textarea */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Specific Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={onInputChange}
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all resize-none"
              placeholder="Tell us about your specific needs, features you're looking for, etc."
            />
          </div>

          {/* How did you hear about us */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              How did you hear about us?
            </label>
            <select
              name="hearAbout"
              value={formData.hearAbout}
              onChange={onInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all"
            >
              <option value="">Select option</option>
              <option value="Google">Google Search</option>
              <option value="Social Media">Social Media</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Email">Email</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] mt-3 sm:mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}