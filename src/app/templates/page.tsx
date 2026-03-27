'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Search, Sparkles, Eye, X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';


interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
}

interface BuyNowFormData {
  name: string;
  college: string;
  email: string;
  phone: string;
  selectedPlan: string;
  templateName: string;
  templateId: number;
  templateType: 'free' | 'paid';
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Modal states
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Preview modal state
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    imageUrl: '',
    templateName: '',
    description: '',
    liveUrl: null as string | null,
  });

  // Form data state
  const [buyNowFormData, setBuyNowFormData] = useState<BuyNowFormData>({
    name: '',
    college: '',
    email: '',
    phone: '',
    selectedPlan: 'basic',
    templateName: '',
    templateId: 0,
    templateType: 'free',
  });

  // Form validation states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Validation functions
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
      default:
        return '';
    }
  };

  // Check for duplicate email for free templates
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

  // Fetch templates from backend
  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const response = await fetch('/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      if (data.success) setTemplates(data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter templates based on search
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Buy Now click
  const handleBuyNowClick = (template: Template) => {
    setSelectedTemplate(template);
    setBuyNowFormData({
      name: '',
      college: '',
      email: '',
      phone: '',
      selectedPlan: 'basic',
      templateName: template.name,
      templateId: template.id,
      templateType: template.type,
    });
    setFormErrors({});
    setTouchedFields({});
    setIsBuyNowModalOpen(true);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBuyNowFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle input blur for validation
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleBuyNowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: Record<string, string> = {};
    ['name', 'college', 'email', 'phone'].forEach(key => {
      const error = validateField(key, buyNowFormData[key as keyof BuyNowFormData] as string);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Mark all fields as touched to show errors
      const allTouched = ['name', 'college', 'email', 'phone'].reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouchedFields(allTouched);
      return;
    }

    // Check for duplicate email for free templates
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
    
    // Submit request to API
    try {
      setIsSubmitting(true);
      
      const requestData = {
        template_id: selectedTemplate!.id,
        name: buyNowFormData.name.trim(),
        college: buyNowFormData.college.trim(),
        email: buyNowFormData.email.toLowerCase().trim(),
        phone: buyNowFormData.phone.trim(),
        plan: selectedTemplate?.type === 'paid' ? buyNowFormData.selectedPlan : undefined,
        type: selectedTemplate!.type
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

      // Show success popup
      setSuccessMessage(`Request submitted successfully! Our team will contact you shortly.`);
      setShowSuccessPopup(true);
      setIsBuyNowModalOpen(false);
      
      // Reset form
      setBuyNowFormData({
        name: '',
        college: '',
        email: '',
        phone: '',
        selectedPlan: 'basic',
        templateName: '',
        templateId: 0,
        templateType: 'free',
      });
      setFormErrors({});
      setTouchedFields({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Submit request error:', error);
      alert(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0F19] pt-16 lg:pt-20">
        {/* Hero Section - Reduced padding */}
        <section className="relative overflow-hidden py-10 md:py-12 lg:py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#1D4ED8]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#38BDF8]/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-4xl mx-auto"
            >
              {/* Badge - Smaller */}
              <motion.div variants={fromBottomVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-xs font-medium text-gray-300">Our Templates</span>
              </motion.div>

              {/* Heading - Smaller font */}
              <motion.h1 variants={fromLeftVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Beautiful{' '}
                <span className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
                  Portfolio Templates
                </span>
              </motion.h1>

              {/* Description - Smaller font */}
              <motion.p variants={fromRightVariants} className="text-base md:text-lg text-gray-400 mb-6 max-w-3xl mx-auto">
                Choose from our collection of professionally designed templates. Each template is fully customizable to match your institution&apos;s brand and requirements.
              </motion.p>

              {/* Search Bar - Smaller */}
              <motion.div variants={fromBottomVariants} className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-xl opacity-0 transition-opacity duration-300 ${isSearchFocused ? 'opacity-20' : ''}`} />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search templates by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 p-1 rounded-full hover:bg-[#1E293B] transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Results Count - Smaller */}
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">
                    {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} available
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Templates Grid - Reduced top padding */}
        <section className="py-8 md:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loadingTemplates ? (
              <div className="flex justify-center items-center py-16">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-[#1D4ED8]/20 border-t-[#1D4ED8] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
                  </div>
                </div>
              </div>
            ) : filteredTemplates.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
              >
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="group bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden transition-all duration-500 hover:border-[#38BDF8]/50 hover:shadow-xl hover:shadow-[#1D4ED8]/10 flex flex-col h-full"
                  >
                    {/* Image Container - Smaller height */}
                    <div className="h-48 relative overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10" />
                      <Image
                        src={template.image}
                        alt={template.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                        }}
                      />
                      
                      {/* Badges - Smaller */}
                      <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                        <span className="text-[10px] font-semibold text-white/90 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/20">
                          Portfolio Template
                        </span>
                        <span
                          className={`text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm ${
                            template.type === 'free' 
                              ? 'bg-green-500/80 border border-green-400/30' 
                              : 'bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] border border-[#38BDF8]/30'
                          }`}
                        >
                          {template.type === 'free' ? 'Free' : 'Premium'}
                        </span>
                      </div>
                      
                      {/* Preview Overlay - Now with two buttons */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center gap-3">
                        <button
                          onClick={() => handlePreviewClick(template.image, template.name, template.description, template.live_url)}
                          className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-white/20 border border-white/20"
                        >
                          <Eye size={12} />
                          Preview
                        </button>
                        <button
                          onClick={() => handleBuyNowClick(template)}
                          className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <ShoppingCart size={12} />
                          Buy Now
                        </button>
                      </div>
                    </div>

                    {/* Content area - Smaller padding */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#38BDF8] transition-colors duration-300">
                        {template.name}
                      </h3>
                      
                      <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Price Badge */}
                      <div className="mt-auto pt-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${
                            template.type === 'free' 
                              ? 'text-green-400' 
                              : 'text-transparent bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text'
                          }`}>
                            {template.type === 'free' ? 'Free' : 'Starting from $49'}
                          </span>
                          <button
                            onClick={() => handleBuyNowClick(template)}
                            className="py-1.5 px-3 rounded-lg font-semibold text-xs transition-all duration-300 hover:scale-105 flex items-center gap-1.5 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white shadow-lg shadow-[#1D4ED8]/20 hover:shadow-[#1D4ED8]/40"
                          >
                            <ShoppingCart size={10} />
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Glow Line */}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-3 bg-[#0F172A] rounded-full flex items-center justify-center border border-[#1E293B]">
                  <Search className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No templates found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your search to find what you&apos;re looking for.</p>
              </div>
            )}
          </div>
        </section>

        {/* Preview Modal */}
        {previewModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closePreviewModal}>
            <div className="relative bg-[#0F172A] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#1E293B]" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#0F172A] border-b border-[#1E293B] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{previewModal.templateName}</h3>
                    <p className="text-xs text-gray-400">Template Preview</p>
                  </div>
                </div>
                <button onClick={closePreviewModal} className="p-1.5 rounded-full hover:bg-[#1E293B] transition-colors">
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto max-h-[calc(90vh-70px)]">
                <div className="relative w-full h-80 rounded-lg overflow-hidden mb-4 bg-[#1E293B]">
                  <Image src={previewModal.imageUrl} alt={previewModal.templateName} fill className="object-contain" />
                </div>
                <h4 className="text-white font-semibold text-base mb-1">About this template</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{previewModal.description}</p>
                {previewModal.liveUrl && (
                  <a href={previewModal.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white font-semibold text-sm rounded-lg hover:shadow-lg transition-all duration-300">
                    <Eye size={14} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Buy Now Modal */}
        {isBuyNowModalOpen && selectedTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0F172A] rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-[#1E293B]">
              <div className="flex items-center justify-between p-5 border-b border-[#1E293B]">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Submit your request</p>
                </div>
                <button
                  onClick={() => setIsBuyNowModalOpen(false)}
                  className="p-1.5 hover:bg-[#1E293B] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleBuyNowSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={buyNowFormData.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#0B0F19] text-white focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] transition-all ${
                      formErrors.name && touchedFields.name ? 'border-red-500' : 'border-[#1E293B]'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && touchedFields.name && (
                    <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    College Name *
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={buyNowFormData.college}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#0B0F19] text-white focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] transition-all ${
                      formErrors.college && touchedFields.college ? 'border-red-500' : 'border-[#1E293B]'
                    }`}
                    placeholder="Enter your college name"
                  />
                  {formErrors.college && touchedFields.college && (
                    <p className="text-red-500 text-[10px] mt-1">{formErrors.college}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={buyNowFormData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#0B0F19] text-white focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] transition-all ${
                      formErrors.email && touchedFields.email ? 'border-red-500' : 'border-[#1E293B]'
                    }`}
                    placeholder="Enter your email"
                  />
                  {formErrors.email && touchedFields.email && (
                    <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={buyNowFormData.phone}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-[#0B0F19] text-white focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] transition-all ${
                      formErrors.phone && touchedFields.phone ? 'border-red-500' : 'border-[#1E293B]'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && touchedFields.phone && (
                    <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {selectedTemplate.type === 'paid' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Select Plan *
                    </label>
                    <select
                      name="selectedPlan"
                      value={buyNowFormData.selectedPlan}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-[#1E293B] rounded-lg bg-[#0B0F19] text-white focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] transition-all"
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
                  className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0F172A] rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 scale-100 border border-[#1E293B]">
              <div className="text-center">
                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">
                  Request Submitted Successfully!
                </h3>
                
                <p className="text-gray-400 text-sm mb-4">
                  {successMessage}
                </p>

                <p className="text-gray-400 text-xs mb-5">
                  Our team at <strong className="text-white">Nestick Tech</strong> will contact you shortly to discuss your requirements.
                </p>

                <div className="bg-[#0B0F19] rounded-lg p-3 mb-5">
                  <a 
                    href="https://nesticktech.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#38BDF8] hover:text-[#1D4ED8] font-medium text-sm block mb-1"
                  >
                    https://nesticktech.com
                  </a>
                  <p className="text-xs text-gray-500">
                    <strong>Contact:</strong> +92 319 3236529
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    setSuccessMessage('');
                  }}
                  className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}