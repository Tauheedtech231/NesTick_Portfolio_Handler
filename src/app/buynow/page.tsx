/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle, Send, 
  Layout, Diamond, Gem, Palette,
  ArrowLeft, Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
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
  templateId: number;
  templateType: 'free' | 'paid';
  requirements: string;
  timeline: string;
  hearAbout: string;
}

interface DesignFormData {
  name: string;
  email: string;
  phone: string;
  designType: string;
  inspiration: string;
  description: string;
}

// Plans Data
const plans = [
  {
    name: "Basic",
    color: "#1F4381",
    bgColor: "rgba(31, 67, 129, 0.15)",
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

const designTypes = [
  'Portfolio Website',
  'Educational Platform',
  'E-commerce Site',
  'Corporate Website',
  'Mobile App Design',
  'Brand Identity',
  'UI/UX Design',
  'Other'
];

export default function BuyNowPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [template, setTemplate] = useState<Template | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isDesignSubmitting, setIsDesignSubmitting] = useState(false);
  const [designSubmitSuccess, setDesignSubmitSuccess] = useState(false);

  const [buyNowFormData, setBuyNowFormData] = useState<BuyNowFormData>({
    name: '',
    college: '',
    email: '',
    phone: '',
    designation: '',
    studentCount: '',
    selectedPlan: 'Most Featured',
    templateName: '',
    templateId: 0,
    templateType: 'free',
    requirements: '',
    timeline: '',
    hearAbout: '',
  });

  const [designFormData, setDesignFormData] = useState<DesignFormData>({
    name: '',
    email: '',
    phone: '',
    designType: '',
    inspiration: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [designFormErrors, setDesignFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Detect theme
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    checkTheme();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Load template from sessionStorage
  useEffect(() => {
    const storedTemplate = sessionStorage.getItem('selectedTemplate');
    if (storedTemplate) {
      try {
        const parsed = JSON.parse(storedTemplate);
        setTemplate(parsed);
        setBuyNowFormData(prev => ({
          ...prev,
          templateName: parsed.name,
          templateId: parsed.id,
          templateType: parsed.type,
        }));
      } catch (error) {
        console.error('Error parsing template:', error);
        router.push('/templates');
      }
    } else {
      // If no template found, redirect back
      router.push('/templates');
    }
  }, [router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!validatePhone(value)) return 'Please enter a valid phone number';
        return '';
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'college':
        if (!value.trim()) return 'College name is required';
        return '';
      case 'designation':
        if (!value.trim()) return 'Designation is required';
        return '';
      default:
        return '';
    }
  };

  const checkDuplicateRequest = async (email: string, templateId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/templates/template-requests/check-duplicate?email=${encodeURIComponent(email)}&template_id=${templateId}`);
      const data = await response.json();
      return data.duplicate || false;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBuyNowFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleDesignInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDesignFormData(prev => ({ ...prev, [name]: value }));
    if (designFormErrors[name]) {
      setDesignFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateDesignForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!designFormData.name.trim()) errors.name = 'Name is required';
    if (!designFormData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(designFormData.email)) errors.email = 'Valid email is required';
    if (!designFormData.phone.trim()) errors.phone = 'Phone number is required';
    if (!designFormData.designType) errors.designType = 'Please select a design type';
    if (!designFormData.description.trim()) errors.description = 'Please describe your requirements';
    
    setDesignFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDesignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDesignForm()) return;
    
    setIsDesignSubmitting(true);
    
    try {
      const response = await fetch('/api/design-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designFormData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDesignSubmitSuccess(true);
        setDesignFormData({
          name: '',
          email: '',
          phone: '',
          designType: '',
          inspiration: '',
          description: ''
        });
        
        setTimeout(() => {
          setIsDesignModalOpen(false);
          setDesignSubmitSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Design request error:', error);
      alert('Failed to submit your request. Please try again.');
    } finally {
      setIsDesignSubmitting(false);
    }
  };

  const handleBuyNowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!template) return;
    
    const errors: Record<string, string> = {};
    ['name', 'college', 'email', 'phone', 'designation'].forEach(key => {
      const error = validateField(key, buyNowFormData[key as keyof BuyNowFormData] as string);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const allTouched = ['name', 'college', 'email', 'phone', 'designation'].reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouchedFields(allTouched);
      return;
    }

    if (template.type === 'free') {
      const isDuplicate = await checkDuplicateRequest(buyNowFormData.email, template.id);
      if (isDuplicate) {
        setFormErrors(prev => ({ 
          ...prev, 
          email: 'You have already submitted a request for this template with this email.' 
        }));
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      const requestData = {
        template_id: template.id,
        name: buyNowFormData.name.trim(),
        college: buyNowFormData.college.trim(),
        email: buyNowFormData.email.toLowerCase().trim(),
        phone: buyNowFormData.phone.trim(),
        designation: buyNowFormData.designation.trim(),
        student_count: buyNowFormData.studentCount,
        plan: template.type === 'paid' ? buyNowFormData.selectedPlan : undefined,
        type: template.type,
        requirements: buyNowFormData.requirements,
        timeline: buyNowFormData.timeline,
        hear_about: buyNowFormData.hearAbout
      };

      const response = await fetch('/api/templates/template-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit request');
      }

      setSuccessMessage(`Request submitted successfully! Our team will contact you shortly.`);
      setShowSuccessPopup(true);
      
      setBuyNowFormData({
        name: '',
        college: '',
        email: '',
        phone: '',
        designation: '',
        studentCount: '',
        selectedPlan: 'Most Featured',
        templateName: '',
        templateId: 0,
        templateType: 'free',
        requirements: '',
        timeline: '',
        hearAbout: '',
      });
      setFormErrors({});
      setTouchedFields({});

    } catch (error: any) {
      console.error('Submit request error:', error);
      alert(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDesignClick = () => {
    setIsDesignModalOpen(true);
    setDesignSubmitSuccess(false);
  };

  const getTemplateFeatures = (templateName: string): string[] => {
    const featuresMap: { [key: string]: string[] } = {
      "Modern Professional": [
        "Clean and corporate design",
        "Fully responsive layout",
        "SEO optimized structure",
        "Easy customization options",
        "Contact form integration",
        "Project showcase gallery"
      ],
      "Creative Arts": [
        "Vibrant visual design",
        "Portfolio grid layout",
        "Social media integration",
        "Blog section included",
        "Multi-color schemes"
      ],
      "Academic Classic": [
        "Research paper showcase",
        "Publication timeline",
        "Citation management",
        "CV/Resume section",
        "Conference listings",
        "Academic achievements"
      ]
    };

    const defaultFeatures = [
      "Modern responsive design",
      "Easy to customize",
      "Fast loading performance",
      "Cross-browser compatible",
      "Mobile-first approach",
      "Clean code structure"
    ];

    return featuresMap[templateName] || defaultFeatures;
  };

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#E8CA5E] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      
      <main className="min-h-screen pt-16 lg:pt-20 overflow-x-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/templates">
            <motion.button
              whileHover={{ x: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors duration-200"
              style={{
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Templates
            </motion.button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full"
                style={{ backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
              />
              <h1 className="text-2xl md:text-3xl font-bold">
                <span style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}>
                  Get
                </span>{' '}
                <span style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}>
                  {template.name}
                </span>
              </h1>
            </div>
            <p className="text-sm"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              Fill in the details below to request this template
            </p>
          </div>

          {/* Main Content - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form - 2/3 width */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl shadow-xl"
                style={{
                  backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                }}
              >
                <div className="p-6 border-b"
                  style={{
                    borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      template.type === 'free' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {template.type === 'free' ? 'Free Template' : 'Premium Template'}
                    </span>
                    <p className="text-xs"
                      style={{ 
                        color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                      }}
                    >
                      Fill the form to get started
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <form onSubmit={handleBuyNowSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={buyNowFormData.name}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            formErrors.name && touchedFields.name ? 'border-red-500' : ''
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            border: '1px solid',
                            borderColor: formErrors.name && touchedFields.name 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'text',
                          }}
                          placeholder="Enter your full name"
                        />
                        {formErrors.name && touchedFields.name && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Designation *
                        </label>
                        <input
                          type="text"
                          name="designation"
                          value={buyNowFormData.designation}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            formErrors.designation && touchedFields.designation ? 'border-red-500' : ''
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            border: '1px solid',
                            borderColor: formErrors.designation && touchedFields.designation 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'text',
                          }}
                          placeholder="e.g., Principal, IT Head"
                        />
                        {formErrors.designation && touchedFields.designation && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {formErrors.designation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          College Name *
                        </label>
                        <input
                          type="text"
                          name="college"
                          value={buyNowFormData.college}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            formErrors.college && touchedFields.college ? 'border-red-500' : ''
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            border: '1px solid',
                            borderColor: formErrors.college && touchedFields.college 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'text',
                          }}
                          placeholder="Enter your college name"
                        />
                        {formErrors.college && touchedFields.college && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {formErrors.college}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          No. of Students
                        </label>
                        <select
                          name="studentCount"
                          value={buyNowFormData.studentCount}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-200"
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            border: '1px solid',
                            borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'pointer',
                          }}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={buyNowFormData.email}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            formErrors.email && touchedFields.email ? 'border-red-500' : ''
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            border: '1px solid',
                            borderColor: formErrors.email && touchedFields.email 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'text',
                          }}
                          placeholder="Enter your email"
                        />
                        {formErrors.email && touchedFields.email && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={buyNowFormData.phone}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          required
                          className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            formErrors.phone && touchedFields.phone ? 'border-red-500' : ''
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            border: '1px solid',
                            borderColor: formErrors.phone && touchedFields.phone 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'text',
                          }}
                          placeholder="+92 300 1234567"
                        />
                        {formErrors.phone && touchedFields.phone && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {formErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Plan Selection for Paid Templates */}
                    {template.type === 'paid' && (
                      <div>
                        <label className="block text-xs font-medium mb-2"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Select Your Plan *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {plans.map((plan) => {
                            const PlanIcon = plan.icon;
                            return (
                              <label
                                key={plan.name}
                                className={`cursor-pointer rounded-xl p-3 transition-all duration-200 border-2 ${
                                  buyNowFormData.selectedPlan === plan.name
                                    ? `border-[${plan.color}] bg-[${plan.bgColor}]`
                                    : 'border-transparent hover:bg-opacity-5'
                                }`}
                                style={{
                                  borderColor: buyNowFormData.selectedPlan === plan.name ? plan.color : 'transparent',
                                  backgroundColor: buyNowFormData.selectedPlan === plan.name 
                                    ? plan.bgColor 
                                    : (theme === 'dark' ? 'rgba(15,23,42,0.5)' : 'rgba(0,0,0,0.03)'),
                                  cursor: 'pointer',
                                }}
                              >
                                <input
                                  type="radio"
                                  name="selectedPlan"
                                  value={plan.name}
                                  checked={buyNowFormData.selectedPlan === plan.name}
                                  onChange={handleInputChange}
                                  className="hidden"
                                />
                                <div className="flex items-center gap-2 mb-2">
                                  <PlanIcon className="w-4 h-4" style={{ color: plan.color }} />
                                  <span className="font-semibold text-sm" style={{ 
                                    color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                                  }}>
                                    {plan.name}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {plan.features.slice(0, 3).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                      <CheckCircle className="w-2.5 h-2.5" style={{ color: plan.color }} />
                                      <span className="text-[10px] truncate"
                                        style={{ 
                                          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                                        }}
                                      >
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium mb-1.5"
                        style={{ 
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        }}
                      >
                        Expected Timeline
                      </label>
                      <select
                        name="timeline"
                        value={buyNowFormData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          border: '1px solid',
                          borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Select timeline</option>
                        <option value="Immediate">Immediate (ASAP)</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="Planning stage">Just planning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5"
                        style={{ 
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        }}
                      >
                        Specific Requirements
                      </label>
                      <textarea
                        name="requirements"
                        value={buyNowFormData.requirements}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 resize-none"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          border: '1px solid',
                          borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          cursor: 'text',
                        }}
                        placeholder="Tell us about your specific needs..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5"
                        style={{ 
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        }}
                      >
                        How did you hear about us?
                      </label>
                      <select
                        name="hearAbout"
                        value={buyNowFormData.hearAbout}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          border: '1px solid',
                          borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Select option</option>
                        <option value="Google">Google Search</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Referral">Referral</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: template.type === 'free'
                          ? '#22C55E'
                          : (theme === 'dark' ? '#E8CA5E' : '#0066FF'),
                        color: template.type === 'free'
                          ? '#FFFFFF'
                          : (theme === 'dark' ? '#1F4381' : '#FFFFFF'),
                        cursor: 'pointer',
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - 1/3 width */}
        {/* Sidebar - 1/3 width */}
<div className="lg:col-span-1">
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="sticky top-24"
  >
    <div className="rounded-2xl shadow-xl overflow-hidden"
      style={{
        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
        border: '1px solid',
        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
      }}
    >
      {/* Template Image */}
      <div className="relative h-48 bg-gray-800">
        <Image
          src={template.image}
          alt={template.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 left-3 z-10">
          <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
            style={{
              backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
              color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
            }}
          >
            <Star className="w-2.5 h-2.5" />
            {template.type === 'free' ? 'Free' : 'Premium'}
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Template Name */}
        <h3 className="text-lg font-bold mb-2"
          style={{ 
            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
          }}
        >
          {template.name}
        </h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-3"
          style={{ 
            color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
          }}
        >
          {template.description}
        </p>

        {/* Key Features */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider"
            style={{ 
              color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
            }}
          >
            Key Features
          </h4>
          {getTemplateFeatures(template.name).slice(0, 4).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 flex-shrink-0"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
              />
              <span className="text-xs"
                style={{ 
                  color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Why Choose Us - BENEFITS SECTION (NEW) */}
        <div className="space-y-2 mb-4 pt-3 border-t"
          style={{
            borderColor: theme === 'dark' ? 'rgba(30,41,59,0.5)' : 'rgba(0,0,0,0.06)',
          }}
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            style={{ 
              color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
            }}
          >
            <span className="w-1 h-4 rounded-full"
              style={{ backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
            />
            Why Choose Us
          </h4>
          
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(232,202,94,0.15)' : 'rgba(0,102,255,0.08)',
                }}
              >
                <span className="text-[10px] font-bold"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                >
                  1
                </span>
              </div>
              <div>
                <p className="text-xs font-medium"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Expert Design Team
                </p>
                <p className="text-[10px]"
                  style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                >
                  Professional designers with 5+ years experience
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(232,202,94,0.15)' : 'rgba(0,102,255,0.08)',
                }}
              >
                <span className="text-[10px] font-bold"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                >
                  2
                </span>
              </div>
              <div>
                <p className="text-xs font-medium"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Fast Turnaround
                </p>
                <p className="text-[10px]"
                  style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                >
                  Get your template ready within 24-48 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(232,202,94,0.15)' : 'rgba(0,102,255,0.08)',
                }}
              >
                <span className="text-[10px] font-bold"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                >
                  3
                </span>
              </div>
              <div>
                <p className="text-xs font-medium"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  24/7 Support
                </p>
                <p className="text-[10px]"
                  style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                >
                  Dedicated support team always here to help
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(232,202,94,0.15)' : 'rgba(0,102,255,0.08)',
                }}
              >
                <span className="text-[10px] font-bold"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                >
                  4
                </span>
              </div>
              <div>
                <p className="text-xs font-medium"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Quality Guarantee
                </p>
                <p className="text-[10px]"
                  style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                >
                  100% satisfaction guaranteed or money back
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Design Request Button */}
        <div className="pt-4 border-t"
          style={{
            borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
          }}
        >
          <motion.button
            onClick={handleDesignClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: '1px solid',
              borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
              color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
              cursor: 'pointer',
            }}
          >
            <Palette className="w-4 h-4" />
            Custom Design Request
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
</div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Design Modal */}
      <AnimatePresence>
        {isDesignModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex justify-center items-start p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setIsDesignModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative rounded-2xl w-full max-w-2xl mt-8 mb-8 shadow-2xl border border-blue-500/30 overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 px-6 py-5 border-b flex items-center justify-between z-10"
                style={{
                  backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ 
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    }}>
                      Your Design
                    </h2>
                    <p className="text-sm" style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                    }}>
                      Share your creative vision with us
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDesignModalOpen(false)}
                  className="p-2 rounded-full hover:bg-black/10 transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  <X className="w-5 h-5" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                {designSubmitSuccess ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ 
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    }}>
                      Request Submitted!
                    </h3>
                    <p className="text-gray-400">
                      Thank you for sharing your design ideas. Our team will review and contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDesignSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={designFormData.name}
                          onChange={handleDesignInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            designFormErrors.name ? 'border-red-500' : 'border-gray-700'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            borderColor: designFormErrors.name 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'text',
                          }}
                          placeholder="Enter your full name"
                        />
                        {designFormErrors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {designFormErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={designFormData.email}
                          onChange={handleDesignInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            designFormErrors.email ? 'border-red-500' : 'border-gray-700'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            borderColor: designFormErrors.email 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'text',
                          }}
                          placeholder="you@example.com"
                        />
                        {designFormErrors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {designFormErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={designFormData.phone}
                          onChange={handleDesignInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            designFormErrors.phone ? 'border-red-500' : 'border-gray-700'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            borderColor: designFormErrors.phone 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'text',
                          }}
                          placeholder="+92 300 1234567"
                        />
                        {designFormErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {designFormErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Design Type *
                        </label>
                        <select
                          name="designType"
                          value={designFormData.designType}
                          onChange={handleDesignInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            designFormErrors.designType ? 'border-red-500' : 'border-gray-700'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            borderColor: designFormErrors.designType 
                              ? '#EF4444' 
                              : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">Select design type</option>
                          {designTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {designFormErrors.designType && (
                          <p className="text-red-500 text-xs mt-1">
                            {designFormErrors.designType}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5"
                        style={{ 
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        }}
                      >
                        What inspires you? (Optional)
                      </label>
                      <input
                        type="text"
                        name="inspiration"
                        value={designFormData.inspiration}
                        onChange={handleDesignInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          cursor: 'text',
                        }}
                        placeholder="e.g., Modern minimalism, Nature, Technology, Art Deco..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5"
                        style={{ 
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        }}
                      >
                        Describe your design requirements *
                      </label>
                      <textarea
                        name="description"
                        value={designFormData.description}
                        onChange={handleDesignInputChange}
                        rows={4}
                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
                          designFormErrors.description ? 'border-red-500' : 'border-gray-700'
                        }`}
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          borderColor: designFormErrors.description 
                            ? '#EF4444' 
                            : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          cursor: 'text',
                        }}
                        placeholder="Tell us about your vision, preferred colors, style, features you need, etc..."
                      />
                      {designFormErrors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {designFormErrors.description}
                        </p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isDesignSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ cursor: 'pointer' }}
                    >
                      {isDesignSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Request
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl p-6 max-w-md w-full"
            style={{
              backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              border: '1px solid',
              borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
            }}
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-lg font-bold mb-2"
                style={{ 
                  color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                }}
              >
                Request Submitted!
              </h3>
              <p className="text-sm mb-4" style={{ 
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
              }}>
                {successMessage}
              </p>
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setSuccessMessage('');
                }}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                  color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}