'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogOut, X, LayoutDashboard } from "lucide-react";
/* eslint-disable */

// Import components
import HeroSection from "@/components/landing/HeroSection";
import TemplatesSection from "@/components/landing/TemplatesSection";
import OtherSections from "@/components/landing/OtherSections";

// Import interfaces
import type { Template, BuyNowFormData, ContactFormData } from "@/app/types/landing";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  // State for dark mode and mobile menu
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Contact form state
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Templates state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [buyNowFormData, setBuyNowFormData] = useState<BuyNowFormData>({
    name: '',
    college: '',
    email: '',
    phone: '',
    selectedPlan: 'basic',
    templateName: ''
  });

  // Form validation states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);
  const templateCardsRef = useRef<HTMLDivElement[]>([]);
  const formElementsRef = useRef<HTMLDivElement[]>([]);
  
  // User state
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add to refs array
  const addToRefs = (el: HTMLDivElement | null, refArray: React.MutableRefObject<HTMLDivElement[]>) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };

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

  // Handle input blur for validation
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle buy now input change with validation
  const handleBuyNowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  // Fetch templates from backend
  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const response = await fetch('/api/templates');
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.templates);
      } else {
        console.error('Failed to load templates:', data.message);
      }
    } catch (err: any) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // User authentication check
  useEffect(() => {
    const checkUserAuthentication = () => {
      if (typeof window !== 'undefined') {
        const loginUser = localStorage.getItem('login_user');
        
        if (loginUser) {
          setUser(JSON.parse(loginUser));
        } else {
          setUser(null);
        }
      }
    };

    checkUserAuthentication();

    const handleStorageChange = () => {
      checkUserAuthentication();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check if user is super admin
  const isSuperAdmin = () => {
    return user && user.email === 'nestick@gmail.com';
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('login_user');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  // Handle dashboard redirect for super admin
  const handleDashboardRedirect = () => {
    window.location.href = '/Portfolio_Handler';
  };

  // Handle mounting and system preference
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isSystemDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (mounted) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, mounted]);

  // Mobile menu animations
  useEffect(() => {
    if (mobileMenuRef.current && mounted) {
      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  }, [isMobileMenuOpen, mounted]);

  // Smooth scrolling function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Contact form handlers
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setContactFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Buy Now Modal Handlers
  const handleBuyNowClick = (template: Template) => {
    setSelectedTemplate(template);
    setBuyNowFormData(prev => ({
      ...prev,
      templateName: template.name
    }));
    setFormErrors({});
    setTouchedFields({});
    setIsBuyNowModalOpen(true);
  };

  const handleBuyNowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: Record<string, string> = {};
    Object.keys(buyNowFormData).forEach(key => {
      if (key !== 'selectedPlan' && key !== 'templateName') {
        const error = validateField(key, buyNowFormData[key as keyof BuyNowFormData]);
        if (error) errors[key] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(buyNowFormData).reduce((acc, key) => {
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

      // Show success popup with request ID
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
        templateName: ''
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

  const handlePreviewClick = (imageUrl: string, templateName: string, description: string) => {
    // Create a modal for preview
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[60] bg-black bg-opacity-75 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">${templateName}</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <img src="${imageUrl}" alt="${templateName}" class="w-full h-auto rounded-lg mb-4 max-h-[60vh] object-contain" />
          <p class="text-gray-600 dark:text-gray-300">${description}</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.name || user.adminName || user.email || 'User';
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  // Enhanced animations with better performance
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      // Hero section animation with stagger
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 80 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2,
          ease: "power3.out",
          delay: 0.2
        }
      );

      // Features cards animation with staggered delay
      featureCardsRef.current.forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
              markers: false
            }
          }
        );
      });

      // Template cards animation with parallax effect
      templateCardsRef.current.forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, scale: 0.9, rotationY: 10 },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 0.7,
            delay: index * 0.15,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // About section animation
      gsap.fromTo(aboutRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Contact section animation
      gsap.fromTo(contactRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Form elements animation
      formElementsRef.current.forEach((element, index) => {
        gsap.fromTo(element,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [mounted, templates]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300" />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 font-sans overflow-x-hidden">
      {/* Navbar (keep it here as it's part of the main layout) */}
     <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 ease-in-out shadow-sm">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
          <span className="text-white dark:text-black font-bold text-sm">P</span>
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Portfolio Handler
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-1">
        {['home', 'features', 'templates', 'about', 'contact'].map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item)}
            className="relative px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ease-out group"
          >
            <span className="font-medium text-sm uppercase tracking-wide">
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-900 dark:bg-white rounded-full transition-all duration-500 ease-out group-hover:w-full"></span>
          </button>
        ))}
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center space-x-3">
        {user ? (
          <div className="hidden lg:flex items-center space-x-3">
            {/* Dashboard Button - Only for nestick@gmail.com */}
            {isSuperAdmin() && (
              <button
                onClick={handleDashboardRedirect}
                className="flex items-center space-x-2 px-5.5 py-2.75 rounded-xl
                  bg-black text-white dark:bg-white dark:text-black
                  hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-sm"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span className="font-medium">Admin Dashboard</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-5.5 py-2.75 rounded-xl
                bg-black text-white dark:bg-white dark:text-black
                hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-sm"
              >
              <LogOut className="w-4.5 h-4.5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        ) : (
          <>
            {/* Login & Sign Up Buttons */}
            <button
              onClick={() => (window.location.href = '/auth/login')}
              className="hidden lg:block bg-gray-900 text-white dark:bg-white dark:text-black px-5.5 py-2.75 rounded-xl font-semibold text-sm transition-all duration-300 ease-in-out hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Login
            </button>
            <button
              onClick={() => (window.location.href = '/auth/sign_up')}
              className="hidden lg:block bg-gray-900 text-white dark:bg-white dark:text-black px-5.5 py-2.75 rounded-xl font-semibold text-sm transition-all duration-300 ease-in-out hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Sign Up
            </button>
          </>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
            <span
              className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 transform ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 transform ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </div>
        </button>
      </div>
    </div>

    {/* Mobile Menu Content */}
    {isMobileMenuOpen && (
      <div className="lg:hidden mt-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-3 rounded-xl shadow-lg">
        {['home', 'features', 'templates', 'about', 'contact'].map((item) => (
          <button
            key={item}
            onClick={() => {
              scrollToSection(item);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-gray-800 dark:text-gray-200 font-medium text-sm py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}

        {user && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {isSuperAdmin() && (
              <button
                onClick={handleDashboardRedirect}
                className="w-full flex items-center justify-center px-4 py-2 mb-2 text-sm
                  bg-black text-white dark:bg-white dark:text-black
                  hover:bg-gray-800 dark:hover:bg-gray-200 transition-all rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin Dashboard
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm
                bg-black text-white dark:bg-white dark:text-black
                hover:bg-gray-800 dark:hover:bg-gray-200 transition-all rounded-lg"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        )}

        {!user && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={() => (window.location.href = '/auth/login')}
              className="w-full bg-gray-900 text-white dark:bg-white dark:text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => (window.location.href = '/auth/sign_up')}
              className="w-full bg-gray-900 text-white dark:bg-white dark:text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    )}
  </div>
</nav>

      {/* Hero Section */}
      <HeroSection 
        scrollToSection={scrollToSection}
        heroRef={heroRef}
      />

      {/* Templates Section */}
      <TemplatesSection
        templates={templates}
        loadingTemplates={loadingTemplates}
        handlePreviewClick={handlePreviewClick}
        handleBuyNowClick={handleBuyNowClick}
        addToRefs={addToRefs}
        templateCardsRef={templateCardsRef}
      />

      {/* Other Sections (Features, About, Contact, Footer) */}
      <OtherSections
        featuresRef={featuresRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
        contactFormData={contactFormData}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        handleContactInputChange={handleContactInputChange}
        handleContactSubmit={handleContactSubmit}
        scrollToSection={scrollToSection}
        addToRefs={addToRefs}
        featureCardsRef={featureCardsRef}
        formElementsRef={formElementsRef}
        isDarkMode={isDarkMode}
      />

      {/* Buy Now Modal (keep in main component) */}
      {isBuyNowModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTemplate.name} – Submit Request
              </h3>
              <button
                onClick={() => setIsBuyNowModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleBuyNowSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={buyNowFormData.name}
                  onChange={handleBuyNowInputChange}
                  onBlur={handleInputBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-all ${
                    formErrors.name && touchedFields.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && touchedFields.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  College Name *
                </label>
                <input
                  type="text"
                  name="college"
                  value={buyNowFormData.college}
                  onChange={handleBuyNowInputChange}
                  onBlur={handleInputBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-all ${
                    formErrors.college && touchedFields.college ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your college name"
                />
                {formErrors.college && touchedFields.college && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.college}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={buyNowFormData.email}
                  onChange={handleBuyNowInputChange}
                  onBlur={handleInputBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-all ${
                    formErrors.email && touchedFields.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
                {formErrors.email && touchedFields.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={buyNowFormData.phone}
                  onChange={handleBuyNowInputChange}
                  onBlur={handleInputBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-all ${
                    formErrors.phone && touchedFields.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && touchedFields.phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>

              {selectedTemplate.type === 'paid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Plan *
                  </label>
                  <select
                    name="selectedPlan"
                    value={buyNowFormData.selectedPlan}
                    onChange={handleBuyNowInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-all"
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
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup (keep in main component) */}
      {showSuccessPopup && (
     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Request Submitted Successfully!
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {successMessage}
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                Our team at <strong>Nestick Tech</strong> will contact you shortly to discuss your requirements.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <a 
                  href="https://nesticktech.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg block mb-2"
                >
                  https://nesticktech.com
                </a>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Contact:</strong> +92 319 3236529
                </p>
              </div>

              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setSuccessMessage('');
                }}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
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