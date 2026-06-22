// app/page.tsx
'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
/* eslint-disable */

// Import components
import HeroSection from "@/components/landing/HeroSection";
import TemplatesSection from "@/components/landing/TemplatesSection";
import OtherSections from "@/components/landing/OtherSections";
import Footer from "@/components/landing/Footer";
import PreviewModal from "@/components/landing/PreviewModal";
import Navbar from "@/components/landing/Navbar";

// Import interfaces
import type { Template, ContactFormData } from "@/app/types/landing";
import PartnerProductSection from "@/components/PartnerProductSection";

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
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Preview Modal State
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    imageUrl: '',
    templateName: '',
    description: '',
    liveUrl: null as string | null,
  });

  // Refs for animations
  const heroRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('login_user');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = '/auth/login';
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

  // Smooth scrolling function (for anchor links on same page)
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

  // Preview Modal Handler
  const handlePreviewClick = (imageUrl: string, templateName: string, description: string, liveUrl?: string | null) => {
    setPreviewModal({
      isOpen: true,
      imageUrl,
      templateName,
      description,
      liveUrl: liveUrl || null,
    });
  };

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

  // Enhanced animations (only for sections, not navbar)
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      // Hero section animation
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

      // Features cards animation
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

      // Template cards animation
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
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection 
        scrollToSection={scrollToSection}
        heroRef={heroRef}
      />
      <PartnerProductSection />

      {/* Templates Section */}
      <TemplatesSection
        templates={templates}
        loadingTemplates={loadingTemplates}
        handlePreviewClick={handlePreviewClick}
        handleBuyNowClick={handleBuyNowClick}
        addToRefs={addToRefs}
        templateCardsRef={templateCardsRef}
      />

      {/* Other Sections (Features, About, Contact) */}
      <OtherSections
        featuresRef={featuresRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
        scrollToSection={scrollToSection}
        addToRefs={addToRefs}
        featureCardsRef={featureCardsRef}
        formElementsRef={formElementsRef}
        isDarkMode={isDarkMode}
      />

      {/* Footer */}
      <Footer />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
        imageUrl={previewModal.imageUrl}
        templateName={previewModal.templateName}
        description={previewModal.description}
        liveUrl={previewModal.liveUrl}
      />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Request Submitted Successfully!
              </h3>
              
              <p className="text-gray-400 mb-4">
                {successMessage}
              </p>

              <p className="text-gray-400 mb-6 text-sm">
                Our team at <strong className="text-[#38BDF8]">Nestick Tech</strong> will contact you shortly to discuss your requirements.
              </p>

              <div className="bg-[#0B0F19] rounded-lg p-4 mb-6">
                <a 
                  href="https://nesticktech.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#38BDF8] hover:underline font-medium text-lg block mb-2"
                  style={{ cursor: 'pointer' }}
                >
                  https://nesticktech.com
                </a>
                <p className="text-sm text-gray-400">
                  <strong>Contact:</strong> +92 319 3236529
                </p>
              </div>

              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setSuccessMessage('');
                }}
                className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ cursor: 'pointer' }}
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