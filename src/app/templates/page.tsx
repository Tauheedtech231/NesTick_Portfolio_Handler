/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { 
  Eye, Sparkles, X, CheckCircle, 
  Star, ChevronRight, Send, 
  Layout, Diamond, Gem, Palette
} from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import TestimonialSection from '../components/TestimonialSection';
import HeroSection from './HeroSection';
import TemplatesGrid from './TemplatesGrid';
import FeaturedTemplates from './FeaturedTemplates';
import ContactSection from './ContactSection';

interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
  featured?: boolean;
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

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [featuredTemplates, setFeaturedTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    imageUrl: '',
    templateName: '',
    description: '',
    liveUrl: null as string | null,
  });

  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isDesignSubmitting, setIsDesignSubmitting] = useState(false);
  const [designSubmitSuccess, setDesignSubmitSuccess] = useState(false);
  const [designFormData, setDesignFormData] = useState<DesignFormData>({
    name: '',
    email: '',
    phone: '',
    designType: '',
    inspiration: '',
    description: ''
  });
  const [designFormErrors, setDesignFormErrors] = useState<Record<string, string>>({});

  // Detect theme changes
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

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const response = await fetch('/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      if (data.success) {
        const allTemplates = data.templates;
        const paidTemplates = allTemplates.filter((t: Template) => t.type === 'paid');
        setFeaturedTemplates(paidTemplates.slice(0, 2));
        setTemplates(allTemplates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // UPDATED: Redirect to /buynow page
  const handleBuyNowClick = (template: Template) => {
    const templateData = {
      id: template.id,
      name: template.name,
      type: template.type,
      image: template.image,
      description: template.description
    };
    
    sessionStorage.setItem('selectedTemplate', JSON.stringify(templateData));
    window.location.href = '/buynow';
  };

  // UPDATED: Redirect to /details/[id] page
  const handleDetailsClick = (template: Template) => {
    const templateData = {
      id: template.id,
      name: template.name,
      type: template.type,
      image: template.image,
      description: template.description,
      live_url: template.live_url,
      created_at: template.created_at
    };
    
    sessionStorage.setItem('selectedTemplateDetails', JSON.stringify(templateData));
    window.location.href = `/details/${template.id}`;
  };

  const handleDesignClick = () => {
    setIsDesignModalOpen(true);
    setDesignSubmitSuccess(false);
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

  const handlePreviewClick = (imageUrl: string, templateName: string, description: string, liveUrl?: string | null) => {
    setPreviewModal({
      isOpen: true,
      imageUrl,
      templateName,
      description,
      liveUrl: liveUrl || null,
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, imageUrl: '', templateName: '', description: '', liveUrl: null });
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <main className="min-h-screen pt-16  overflow-x-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
        }}
      >
        <HeroSection theme={theme} onDesignClick={handleDesignClick} />
        
        <TemplatesGrid
          templates={templates}
          loadingTemplates={loadingTemplates}
          theme={theme}
          onPreviewClick={handlePreviewClick}
          onBuyNowClick={handleBuyNowClick}
          onDetailsClick={handleDetailsClick}
        />

        <FeaturedTemplates
          featuredTemplates={featuredTemplates}
          theme={theme}
          onBuyNowClick={handleBuyNowClick}
        />

      </main>

      <TestimonialSection />
      <ContactSection theme={theme} />
      <Footer />

      {/* Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closePreviewModal}>
          <div className="relative rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            style={{
              backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              border: '1px solid',
              borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 p-4 border-b"
              style={{
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                borderColor: theme === 'dark' ? 'rgba(30,41,59,0.5)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                  }}
                >
                  <Eye className="w-4 h-4" style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold"
                    style={{ 
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {previewModal.templateName}
                  </h3>
                  <p className="text-xs"
                    style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    Template Preview
                  </p>
                </div>
              </div>
              <button onClick={closePreviewModal} className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-4 h-4" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-70px)]">
              <div className="relative w-full h-80 rounded-lg overflow-hidden mb-4"
                style={{ backgroundColor: theme === 'dark' ? '#1E293B' : '#F0F0F0' }}
              >
                <Image src={previewModal.imageUrl} alt={previewModal.templateName} fill className="object-contain" />
              </div>
              <h4 className="text-base font-semibold mb-1"
                style={{ 
                  color: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                About this template
              </h4>
              <p className="text-sm leading-relaxed mb-4"
                style={{ 
                  color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                {previewModal.description}
              </p>
              {previewModal.liveUrl && (
                <a href={previewModal.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
                  style={{
                    backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                    color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Eye size={14} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}

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
              className="relative bg-[#0F172A] rounded-2xl w-full max-w-2xl mt-8 mb-8 shadow-2xl border border-blue-500/30 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-[#0F172A] z-10"
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
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      Your Design
                    </h2>
                    <p className="text-sm" style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                      fontFamily: "'Calibri Light', sans-serif",
                    }}>
                      Share your creative vision with us
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDesignModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors"
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
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      Request Submitted!
                    </h3>
                    <p className="text-gray-400" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
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
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={designFormData.name}
                          onChange={handleDesignInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            designFormErrors.name ? 'border-red-500' : 'border-gray-700'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
                          placeholder="Enter your full name"
                        />
                        {designFormErrors.name && (
                          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                            {designFormErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={designFormData.email}
                          onChange={handleDesignInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            designFormErrors.email ? 'border-red-500' : 'border-gray-700'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
                          placeholder="you@example.com"
                        />
                        {designFormErrors.email && (
                          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
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
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={designFormData.phone}
                          onChange={handleDesignInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            designFormErrors.phone ? 'border-red-500' : 'border-gray-700'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
                          placeholder="+92 300 1234567"
                        />
                        {designFormErrors.phone && (
                          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                            {designFormErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Design Type *
                        </label>
                        <select
                          name="designType"
                          value={designFormData.designType}
                          onChange={handleDesignInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                            designFormErrors.designType ? 'border-red-500' : 'border-gray-700'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
                        >
                          <option value="">Select design type</option>
                          {designTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {designFormErrors.designType && (
                          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                            {designFormErrors.designType}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5"
                        style={{ 
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        What inspires you? (Optional)
                      </label>
                      <input
                        type="text"
                        name="inspiration"
                        value={designFormData.inspiration}
                        onChange={handleDesignInputChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          fontFamily: "'Calibri Light', sans-serif",
                        }}
                        placeholder="e.g., Modern minimalism, Nature, Technology, Art Deco..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5"
                        style={{ 
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Describe your design requirements *
                      </label>
                      <textarea
                        name="description"
                        value={designFormData.description}
                        onChange={handleDesignInputChange}
                        rows={4}
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
                          designFormErrors.description ? 'border-red-500' : 'border-gray-700'
                        }`}
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          fontFamily: "'Calibri Light', sans-serif",
                        }}
                        placeholder="Tell us about your vision, preferred colors, style, features you need, etc..."
                      />
                      {designFormErrors.description && (
                        <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                          {designFormErrors.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isDesignSubmitting}
                      className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
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
                    </button>
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
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Request Submitted!
              </h3>
              <p className="text-sm mb-4" style={{ 
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                fontFamily: "'Calibri Light', sans-serif",
              }}>
                {successMessage}
              </p>
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setSuccessMessage('');
                }}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                  color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                  fontFamily: "'Poppins', sans-serif",
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