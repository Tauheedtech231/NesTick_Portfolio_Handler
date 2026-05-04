/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { 
  Search, Sparkles, Eye, X, Info, CheckCircle, Filter,
  Star, ChevronRight, Mail, Send, Phone, Clock, 
  Layout, Diamond, Gem, User, Building2, GraduationCap, Palette
} from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import TestimonialSection from '../components/TestimonialSection';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'free' | 'paid'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
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

  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    template: null as Template | null,
  });

  // Design Modal States
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

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

  // Parallax effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      parallaxElements.forEach((el) => {
        (el as HTMLElement).style.transform = `translateY(${scrolled * 0.5}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleBuyNowClick = (template: Template) => {
    setSelectedTemplate(template);
    setBuyNowFormData({
      name: '',
      college: '',
      email: '',
      phone: '',
      designation: '',
      studentCount: '',
      selectedPlan: 'Most Featured',
      templateName: template.name,
      templateId: template.id,
      templateType: template.type,
      requirements: '',
      timeline: '',
      hearAbout: '',
    });
    setFormErrors({});
    setTouchedFields({});
    setIsBuyNowModalOpen(true);
  };

  const handleDetailsClick = (template: Template) => {
    setDetailsModal({
      isOpen: true,
      template: template,
    });
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

  const handleBuyNowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    if (selectedTemplate?.type === 'free') {
      const isDuplicate = await checkDuplicateRequest(buyNowFormData.email, selectedTemplate.id);
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
        template_id: selectedTemplate!.id,
        name: buyNowFormData.name.trim(),
        college: buyNowFormData.college.trim(),
        email: buyNowFormData.email.toLowerCase().trim(),
        phone: buyNowFormData.phone.trim(),
        designation: buyNowFormData.designation.trim(),
        student_count: buyNowFormData.studentCount,
        plan: selectedTemplate?.type === 'paid' ? buyNowFormData.selectedPlan : undefined,
        type: selectedTemplate!.type,
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
      setIsBuyNowModalOpen(false);
      
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          subject: 'Template Page Inquiry',
          message: contactForm.message
        })
      });
      
      if (response.ok) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setContactSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Contact error:', error);
    } finally {
      setContactSubmitting(false);
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

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 12,
        duration: 0.5,
      },
    },
  };

  const heroVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const fromLeftVariants: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const fromRightVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const fromBottomVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 12,
        duration: 0.6,
        delay: 0.2,
      },
    },
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
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-20 overflow-x-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
        }}
      >
        {/* Hero Section with "Your Design" Button */}
        <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
          <div 
            className="parallax-bg absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10"
              style={{
                backgroundColor: theme === 'dark' ? '#1F4381' : '#00A0FF',
              }}
            />
            <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-10"
              style={{
                backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fromBottomVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto w-fit"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
                  border: 'none',
                }}
              >
                <Sparkles className="w-3.5 h-3.5"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                />
                <span className="text-xs font-medium"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                >
                  Our Templates
                </span>
              </motion.div>

              <motion.h1 variants={fromLeftVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-serif tracking-tight">
                <span className="relative inline-block"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Beautiful
                </span>{' '}
                <span className="inline-block bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
                  Portfolio Templates
                </span>
              </motion.h1>

              <motion.p variants={fromRightVariants} className="text-base md:text-lg max-w-3xl mx-auto mb-8 font-light tracking-wide"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              >
                Choose from our collection of professionally designed templates. Each template is fully customizable to match your institution&apos;s brand and requirements.
              </motion.p>

              {/* Two CTA Buttons */}
              <motion.div variants={fromBottomVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  onClick={() => document.getElementById('templates-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                    color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                  }}
                >
                  <span>Browse Templates</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={handleDesignClick}
                  className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent border-2"
                  style={{
                    borderColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                    color: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                  }}
                >
                  <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Your Design</span>
                </button>
              </motion.div>

              {/* Search and Filter Bar */}
              <motion.div variants={fromBottomVariants} className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="relative flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      />
                      <input
                        type="text"
                        placeholder="Search templates by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none transition-colors duration-300 font-sans"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                          borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                          borderWidth: '1px',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                        }}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-sans"
                      style={{
                        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                      }}
                    >
                      <Filter className="w-4 h-4" />
                      <span className="text-sm hidden sm:inline">Filter</span>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 p-2 rounded-xl flex gap-2"
                      style={{
                        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                      }}
                    >
                      <button
                        onClick={() => setSelectedType('all')}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 font-sans tracking-wide"
                        style={{
                          backgroundColor: selectedType === 'all'
                            ? (theme === 'dark' ? '#E8CA5E' : '#00A0FF')
                            : 'transparent',
                          color: selectedType === 'all'
                            ? (theme === 'dark' ? '#1F4381' : '#FFFFFF')
                            : (theme === 'dark' ? '#9CA3AF' : '#6B7280'),
                        }}
                      >
                        All Templates
                      </button>
                      <button
                        onClick={() => setSelectedType('free')}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 font-sans tracking-wide"
                        style={{
                          backgroundColor: selectedType === 'free'
                            ? '#22C55E'
                            : 'transparent',
                          color: selectedType === 'free'
                            ? '#FFFFFF'
                            : (theme === 'dark' ? '#9CA3AF' : '#6B7280'),
                        }}
                      >
                        Free
                      </button>
                      <button
                        onClick={() => setSelectedType('paid')}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 font-sans tracking-wide"
                        style={{
                          backgroundColor: selectedType === 'paid'
                            ? (theme === 'dark' ? '#E8CA5E' : '#00A0FF')
                            : 'transparent',
                          color: selectedType === 'paid'
                            ? (theme === 'dark' ? '#1F4381' : '#FFFFFF')
                            : (theme === 'dark' ? '#9CA3AF' : '#6B7280'),
                        }}
                      >
                        Premium
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs font-sans tracking-wide"
                    style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                  >
                    {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} available
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Templates Grid */}
        <section id="templates-grid" className="py-8 md:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loadingTemplates ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-10 h-10 border-4 rounded-full animate-spin"
                  style={{
                    borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.2)' : 'rgba(0, 160, 255, 0.2)',
                    borderTopColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                  }}
                />
              </div>
            ) : filteredTemplates.length > 0 ? (
              <>
                {/* Standard Templates */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      className="group rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col h-full cursor-pointer"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid',
                        borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <div className="h-48 relative overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                        <div className="w-full h-full transition-transform duration-500 group-hover:scale-110">
                          <Image
                            src={template.image}
                            alt={template.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                            }}
                          />
                        </div>
                        
                        <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                          <span className="text-[10px] font-medium text-white/90 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                            Template
                          </span>
                          <span className={`text-[10px] font-medium text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm ${
                            template.type === 'free' 
                              ? 'bg-green-500/80' 
                              : (theme === 'dark' ? 'bg-[#E8CA5E] text-[#1F4381]' : 'bg-[#00A0FF] text-white')
                          }`}>
                            {template.type === 'free' ? 'Free' : 'Premium'}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handlePreviewClick(template.image, template.name, template.description, template.live_url)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center cursor-pointer"
                        >
                          <div className="px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5"
                            style={{
                              backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                              color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                            }}
                          >
                            <Eye size={12} />
                            Preview
                          </div>
                        </button>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold mb-2 transition-colors duration-300"
                          style={{
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          }}
                        >
                          {template.name}
                        </h3>
                        
                        <p className="text-sm leading-relaxed mb-4 line-clamp-2"
                          style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                        >
                          {template.description}
                        </p>

                        <div className="mt-auto pt-4 flex gap-2">
                          <button
                            onClick={() => handleDetailsClick(template)}
                            className="flex-1 py-2 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                            style={{
                              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                              border: '1px solid',
                              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                              color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                            }}
                          >
                            <Info size={14} />
                            Details
                          </button>
                          <button
                            onClick={() => handleBuyNowClick(template)}
                            className="flex-1 py-2 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                            style={{
                              backgroundColor: template.type === 'free'
                                ? '#22C55E'
                                : (theme === 'dark' ? '#E8CA5E' : '#00A0FF'),
                              color: template.type === 'free'
                                ? '#FFFFFF'
                                : (theme === 'dark' ? '#1F4381' : '#FFFFFF'),
                            }}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Featured Templates Section */}
                {featuredTemplates.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 pt-8 border-t"
                    style={{
                      borderColor: theme === 'dark' ? 'rgba(232,202,94,0.2)' : 'rgba(0,160,255,0.2)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#E8CA5E] to-[#00E0FF]" />
                      <h2 className="text-2xl md:text-3xl font-bold font-serif">
                        <span className="text-white">Featured</span>{' '}
                        <span className="bg-gradient-to-r from-[#E8CA5E] to-[#00E0FF] bg-clip-text text-transparent">
                          Premium Templates
                        </span>
                      </h2>
                      <ChevronRight className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {featuredTemplates.map((template, idx) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.2 }}
                          className="relative rounded-2xl overflow-hidden group"
                          style={{
                            backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                            border: '1px solid',
                            borderColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                            boxShadow: `0 0 20px ${theme === 'dark' ? 'rgba(232,202,94,0.1)' : 'rgba(0,160,255,0.1)'}`
                          }}
                        >
                          <div className="absolute top-4 right-4 z-20">
                            <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                              style={{
                                backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                                color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                              }}
                            >
                              <Star className="w-3 h-3" />
                              Featured
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                              <div className="w-full h-full transition-transform duration-500 group-hover:scale-110">
                                <Image
                                  src={template.image}
                                  alt={template.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div className="md:w-3/5 p-6">
                              <h3 className="text-xl font-bold mb-2"
                                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                              >
                                {template.name}
                              </h3>
                              <p className="text-sm mb-4 line-clamp-3"
                                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                              >
                                {template.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Premium Design</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">Fully Responsive</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Easy Customize</span>
                              </div>
                              <button
                                onClick={() => handleBuyNowClick(template)}
                                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                style={{
                                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                                  color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                                }}
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                  }}
                >
                  <Search className="w-6 h-6"
                    style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                  />
                </div>
                <h3 className="text-lg font-bold mb-1 font-serif tracking-tight"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  No templates found
                </h3>
                <p className="text-sm font-light tracking-wide"
                  style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                >
                  Try adjusting your search or filter to find what you&apos;re looking for.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <TestimonialSection />

      {/* Contact Section before Footer */}
      <section className="py-16 px-4 sm:px-6"
        style={{
          backgroundColor: theme === 'dark' ? '#0F172A' : '#F9FAFB',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
                }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }} />
                <span className="text-xs font-medium" style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}>
                  Contact Us
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif tracking-tight"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                Have Questions?
                <br />
                <span className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
                  We're Here to Help
                </span>
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Whether you're looking for a custom template, need assistance with your existing portfolio, or want to discuss your requirements, our team is ready to assist you.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">support@nesticktech.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">+92 319 3236529</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Mon-Fri, 9AM - 6PM PKT</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 md:p-8"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                border: '1px solid',
                borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              {contactSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}>
                    Message Sent!
                  </h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-gray-400">Full Name *</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#00A0FF] transition-all"
                      style={{
                        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-gray-400">Email *</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#00A0FF] transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                          borderWidth: '1px',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                        }}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-gray-400">Phone *</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#00A0FF] transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                          borderWidth: '1px',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                        }}
                        placeholder="+92 300 1234567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-gray-400">Message *</label>
                    <textarea
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#00A0FF] transition-all resize-none"
                      style={{
                        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                      placeholder="Tell us about your requirements..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                      color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                    }}
                  >
                    {contactSubmitting ? 'Sending...' : 'Send Message'}
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

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
                    style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                  >
                    {previewModal.templateName}
                  </h3>
                  <p className="text-xs"
                    style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
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
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              >
                About this template
              </h4>
              <p className="text-sm leading-relaxed mb-4"
                style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
              >
                {previewModal.description}
              </p>
              {previewModal.liveUrl && (
                <a href={previewModal.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
                  style={{
                    backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                    color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
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

      {/* Details Modal */}
      <AnimatePresence>
        {detailsModal.isOpen && detailsModal.template && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setDetailsModal({ isOpen: false, template: null })}>
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              style={{
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 p-5 border-b"
                style={{
                  backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                  borderColor: theme === 'dark' ? 'rgba(232,202,94,0.2)' : 'rgba(0,0,0,0.1)',
                }}
              >
                <button
                  onClick={() => setDetailsModal({ isOpen: false, template: null })}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/10 transition-all duration-300"
                >
                  <X className="w-5 h-5" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
                </button>
                <h3 className="text-2xl font-bold pr-8 font-serif tracking-tight"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  {detailsModal.template.name}
                </h3>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    detailsModal.template.type === 'free' 
                      ? 'bg-green-500 text-white' 
                      : (theme === 'dark' ? 'bg-[#E8CA5E] text-[#1F4381]' : 'bg-[#00A0FF] text-white')
                  }`}>
                    {detailsModal.template.type === 'free' ? 'Free Template' : 'Premium Template'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={detailsModal.template.image}
                    alt={detailsModal.template.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2"
                    style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                  >
                    Description
                  </h4>
                  <p className="leading-relaxed"
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    {detailsModal.template.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3"
                    style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                  >
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getTemplateFeatures(detailsModal.template.name).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4"
                          style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                        />
                        <span className="text-sm"
                          style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-4 mb-6"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs mb-1"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        Template ID
                      </p>
                      <p className="text-sm"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        #{detailsModal.template.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        Created
                      </p>
                      <p className="text-sm"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        {new Date(detailsModal.template.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        Type
                      </p>
                      <p className="text-sm capitalize"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        {detailsModal.template.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        Compatibility
                      </p>
                      <p className="text-sm"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        All Devices
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setDetailsModal({ isOpen: false, template: null });
                      handlePreviewClick(detailsModal.template!.image, detailsModal.template!.name, detailsModal.template!.description, detailsModal.template!.live_url);
                    }}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      border: '1px solid',
                      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                    }}
                  >
                    <Eye size={16} />
                    Preview Template
                  </button>
                  <button
                    onClick={() => {
                      setDetailsModal({ isOpen: false, template: null });
                      handleBuyNowClick(detailsModal.template!);
                    }}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: detailsModal.template.type === 'free'
                        ? '#22C55E'
                        : (theme === 'dark' ? '#E8CA5E' : '#00A0FF'),
                      color: detailsModal.template.type === 'free'
                        ? '#FFFFFF'
                        : (theme === 'dark' ? '#1F4381' : '#FFFFFF'),
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Buy Now Modal - Scrollable Form with top margin */}
      {isBuyNowModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl shadow-2xl w-full max-w-2xl mt-8 mb-8"
            style={{
              backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              border: '1px solid',
              borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
            }}
          >
            {/* Close Button - Top Right */}
            <button
              onClick={() => setIsBuyNowModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
            </button>

            {/* Header */}
            <div className="sticky top-0 p-6 pr-12 border-b bg-inherit rounded-t-2xl"
              style={{
                borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              }}
            >
              <h3 className="text-xl font-bold font-serif tracking-tight"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                Get {selectedTemplate.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedTemplate.type === 'free' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                }`}>
                  {selectedTemplate.type === 'free' ? 'Free Template' : 'Premium Template'}
                </span>
                <p className="text-xs"
                  style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                >
                  Fill the form to get started
                </p>
              </div>
            </div>

            {/* Scrollable Form */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <form onSubmit={handleBuyNowSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5"
                      style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                      className={`w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all ${
                        formErrors.name && touchedFields.name ? 'border-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && touchedFields.name && (
                      <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5"
                      style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                      className={`w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all ${
                        formErrors.designation && touchedFields.designation ? 'border-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                      placeholder="e.g., Principal, IT Head"
                    />
                    {formErrors.designation && touchedFields.designation && (
                      <p className="text-red-500 text-[10px] mt-1">{formErrors.designation}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5"
                      style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                      className={`w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all ${
                        formErrors.college && touchedFields.college ? 'border-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                      placeholder="Enter your college name"
                    />
                    {formErrors.college && touchedFields.college && (
                      <p className="text-red-500 text-[10px] mt-1">{formErrors.college}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5"
                      style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                    >
                      No. of Students
                    </label>
                    <select
                      name="studentCount"
                      value={buyNowFormData.studentCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all"
                      style={{
                        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
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
                      style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                      className={`w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all ${
                        formErrors.email && touchedFields.email ? 'border-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && touchedFields.email && (
                      <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5"
                      style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                      className={`w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all ${
                        formErrors.phone && touchedFields.phone ? 'border-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        borderWidth: '1px',
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                      placeholder="+92 300 1234567"
                    />
                    {formErrors.phone && touchedFields.phone && (
                      <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Plan Selection for Paid Templates */}
                {selectedTemplate.type === 'paid' && (
                  <div>
                    <label className="block text-xs font-medium mb-2"
                      style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                    >
                      Select Your Plan *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {plans.map((plan) => {
                        const PlanIcon = plan.icon;
                        return (
                          <label
                            key={plan.name}
                            className={`cursor-pointer rounded-xl p-3 transition-all border-2 ${
                              buyNowFormData.selectedPlan === plan.name
                                ? `border-[${plan.color}] bg-[${plan.bgColor}]`
                                : 'border-transparent bg-gray-800/50 hover:bg-gray-700/50'
                            }`}
                            style={{
                              borderColor: buyNowFormData.selectedPlan === plan.name ? plan.color : 'transparent',
                              backgroundColor: buyNowFormData.selectedPlan === plan.name ? plan.bgColor : (theme === 'dark' ? 'rgba(15,23,42,0.5)' : 'rgba(0,0,0,0.05)'),
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
                              <span className="font-semibold text-sm" style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}>
                                {plan.name}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {plan.features.slice(0, 3).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <CheckCircle className="w-2.5 h-2.5" style={{ color: plan.color }} />
                                  <span className="text-[10px] text-gray-400 truncate">{feature}</span>
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
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    Expected Timeline
                  </label>
                  <select
                    name="timeline"
                    value={buyNowFormData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                      borderWidth: '1px',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
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
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    Specific Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={buyNowFormData.requirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all resize-none"
                    style={{
                      backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                      borderWidth: '1px',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    }}
                    placeholder="Tell us about your specific needs..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5"
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    How did you hear about us?
                  </label>
                  <select
                    name="hearAbout"
                    value={buyNowFormData.hearAbout}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-[#00A0FF] transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                      borderWidth: '1px',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 mt-2 disabled:opacity-50 sticky bottom-0"
                  style={{
                    backgroundColor: selectedTemplate.type === 'free'
                      ? '#22C55E'
                      : (theme === 'dark' ? '#E8CA5E' : '#00A0FF'),
                    color: selectedTemplate.type === 'free'
                      ? '#FFFFFF'
                      : (theme === 'dark' ? '#1F4381' : '#FFFFFF'),
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Design Modal - Scrollable Form */}
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
                    <h2 className="text-xl font-bold" style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}>
                      You Design
                    </h2>
                    <p className="text-sm" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>
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
                    <h3 className="text-xl font-bold mb-2" style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}>
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
                          style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                          }}
                          placeholder="Enter your full name"
                        />
                        {designFormErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{designFormErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                          }}
                          placeholder="you@example.com"
                        />
                        {designFormErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{designFormErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                          }}
                          placeholder="+92 300 1234567"
                        />
                        {designFormErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{designFormErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5"
                          style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                          }}
                        >
                          <option value="">Select design type</option>
                          {designTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {designFormErrors.designType && (
                          <p className="text-red-500 text-xs mt-1">{designFormErrors.designType}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5"
                        style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                        }}
                        placeholder="e.g., Modern minimalism, Nature, Technology, Art Deco..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5"
                        style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
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
                        }}
                        placeholder="Tell us about your vision, preferred colors, style, features you need, etc..."
                      />
                      {designFormErrors.description && (
                        <p className="text-red-500 text-xs mt-1">{designFormErrors.description}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isDesignSubmitting}
                      className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                Request Submitted!
              </h3>
              <p className="text-sm mb-4" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>
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
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}