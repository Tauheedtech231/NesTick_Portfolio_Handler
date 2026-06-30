'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, Globe2, Palette, X, Send, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

interface DesignFormData {
  name: string;
  email: string;
  phone: string;
  designType: string;
  inspiration: string;
  description: string;
}

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

export default function HeroSection({ scrollToSection, heroRef }: HeroSectionProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [parallaxRef, setParallaxRef] = useState<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<DesignFormData>({
    name: '',
    email: '',
    phone: '',
    designType: '',
    inspiration: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const handleLearn = () => {
    router.push('/templates');
  };
  
  const handleDesignClick = () => {
    setIsModalOpen(true);
    setSubmitSuccess(false);
  };
  
  // Auto-play video when loaded
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, [videoLoaded]);
  
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
  
  // Simple parallax effect on mouse move
  useEffect(() => {
    if (!parallaxRef) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 10;
      const yPercent = (clientY / innerHeight - 0.5) * 5;
      
      if (parallaxRef) {
        parallaxRef.style.transform = `translate(${xPercent}px, ${yPercent}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [parallaxRef]);
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.designType) errors.designType = 'Please select a design type';
    if (!formData.description.trim()) errors.description = 'Please describe your requirements';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/design-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          designType: '',
          inspiration: '',
          description: ''
        });
        
        // Close modal after 3 seconds
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Design request error:', error);
      alert('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      designType: '',
      inspiration: '',
      description: ''
    });
    setFormErrors({});
    setSubmitSuccess(false);
  };

  return (
    <>
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden w-full"
        style={{ 
          fontFamily: "'Poppins', sans-serif",
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#FFFFFF',
        }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <div 
            ref={(el) => setParallaxRef(el)}
            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out will-change-transform"
          >
            <div className="absolute inset-0 w-full h-full">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay
                onLoadedData={() => setVideoLoaded(true)}
                style={{
                  opacity: videoLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              >
                <source src="/v.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Fallback gradient */}
              {!videoLoaded && (
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, #0B0F19, #1F4381)'
                      : 'linear-gradient(135deg, #FFFFFF, #e8edf5)'
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Overlay - Dark mode only */}
        {theme === 'dark' && (
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: 'rgba(11, 15, 25, 0.7)',
            }}
          />
        )}

        {/* Main Content */}
        <div className="relative z-20 container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col items-center justify-center text-center">
            
            {/* ─── Premium Badge ─── */}
            <div 
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-6 sm:mb-8 mt-8 sm:mt-18 transition-all duration-500"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 100, 255, 0.08)',
                border: 'none',
              }}
            >
              <Globe2 
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
              />
              <span 
                className="text-[10px] sm:text-xs md:text-sm font-medium"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                }}
              >
                Trusted by 500+ Educational Institutions
              </span>
            </div>

            {/* ─── HEADINGS ─── */}
            <div className="mb-5 sm:mb-7">
              <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-bold leading-[1.2] sm:leading-[1.3] mb-3 sm:mb-4 max-w-5xl">
                <span 
                  className="block font-serif tracking-tight"
                  style={{ 
                    fontFamily: "'Poppins', sans-serif",
                    color: '#FFFFFF', // ← Always white
                  }}
                >
                  Journey Through the
                </span>
              </h1>
              <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-bold leading-[1.2] sm:leading-[1.3]">
                <span className="block">
                  <span 
                    className="font-serif" 
                    style={{ 
                      fontFamily: "'Poppins', sans-serif",
                      color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                    }}
                  >
                    Galaxy of
                  </span>{' '}
                  <span 
                    className="font-serif" 
                    style={{ 
                      fontFamily: "'Poppins', sans-serif",
                      color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                    }}
                  >
                    College Portfolios
                  </span>
                </span>
              </h1>
            </div>

            {/* ─── SUBHEADING - Always White ─── */}
            <p 
              className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-2 mb-8 sm:mb-10 font-light tracking-wide"
              style={{ 
                fontFamily: "'Calibri Light', sans-serif",
                color: '#FFFFFF', // ← Always white
              }}
            >
              Like the ancient libraries of Baghdad, we preserve and showcase educational excellence. 
              A centralized constellation where institutions create, customize, and control their digital 
              presence across the universe of learning.
            </p>

            {/* ─── CTA Buttons ─── */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              
              {/* ── LEARN MORE BUTTON ── */}
              <button
                onClick={handleLearn}
                className="group relative inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ 
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                  color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                  borderRadius: '50px',
                  border: 'none',
                }}
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* ── YOUR DESIGN BUTTON - Always White Text ── */}
              <button
                onClick={handleDesignClick}
                className="group relative inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ 
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: 'transparent',
                  color: '#FFFFFF', // ← Always white
                  borderRadius: '50px',
                  border: '2px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)',
                }}
              >
                <Palette className="w-4 h-4" />
                <span>Your Design</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-1 opacity-50">
            <span 
              className="text-[9px] uppercase tracking-wider"
              style={{ 
                fontFamily: "'Poppins', sans-serif",
                color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF', // ← Always white
              }}
            >
              Scroll
            </span>
            <div 
              className="w-4 h-6 rounded-full flex justify-center"
              style={{
                border: `2px solid ${theme === 'dark' ? '#FFFFFF' : '#FFFFFF'}`,
              }}
            >
              <div 
                className="w-0.5 h-1.5 rounded-full mt-1 animate-bounce"
                style={{
                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                }}
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
          }
          .will-change-transform {
            will-change: transform;
          }
        `}</style>
      </section>

      {/* ─── MODAL ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex justify-center p-4 overflow-y-auto"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.9)' : 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative rounded-2xl w-full max-w-2xl my-8 shadow-2xl overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.2)' : 'rgba(0, 100, 255, 0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div 
                className="px-6 py-5 flex items-center justify-between sticky top-0 z-10"
                style={{
                  borderBottom: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
                  backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : '#FFFFFF',
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 100, 255, 0.08)',
                    }}
                  >
                    <Palette 
                      className="w-5 h-5"
                      style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                    />
                  </div>
                  <div>
                    <h2 
                      className="text-xl font-bold"
                      style={{ 
                        fontFamily: "'Poppins', sans-serif",
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                    >
                      Your Design
                    </h2>
                    <p 
                      className="text-sm"
                      style={{ 
                        fontFamily: "'Calibri Light', sans-serif",
                        color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                      }}
                    >
                      Share your creative vision with us
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                {submitSuccess ? (
                  <div className="p-12 text-center">
                    <div 
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
                      }}
                    >
                      <CheckCircle 
                        className="w-8 h-8"
                        style={{ color: '#22C55E' }}
                      />
                    </div>
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        fontFamily: "'Poppins', sans-serif",
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      }}
                    >
                      Request Submitted!
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ 
                        fontFamily: "'Calibri Light', sans-serif",
                        color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                      }}
                    >
                      Thank you for sharing your design ideas. Our team will review and contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label 
                          className="block text-sm font-medium mb-1.5"
                          style={{ 
                            fontFamily: "'Poppins', sans-serif",
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                            formErrors.name 
                              ? 'border-red-500' 
                              : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : '#F9FAFB',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontFamily: "'Calibri Light', sans-serif",
                            outline: 'none',
                          }}
                          placeholder="Enter your full name"
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-1.5"
                          style={{ 
                            fontFamily: "'Poppins', sans-serif",
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                            formErrors.email 
                              ? 'border-red-500' 
                              : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : '#F9FAFB',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontFamily: "'Calibri Light', sans-serif",
                            outline: 'none',
                          }}
                          placeholder="you@example.com"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label 
                          className="block text-sm font-medium mb-1.5"
                          style={{ 
                            fontFamily: "'Poppins', sans-serif",
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                            formErrors.phone 
                              ? 'border-red-500' 
                              : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : '#F9FAFB',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontFamily: "'Calibri Light', sans-serif",
                            outline: 'none',
                          }}
                          placeholder="+92 300 1234567"
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                            {formErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-1.5"
                          style={{ 
                            fontFamily: "'Poppins', sans-serif",
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          Design Type *
                        </label>
                        <select
                          name="designType"
                          value={formData.designType}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                            formErrors.designType 
                              ? 'border-red-500' 
                              : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                          }`}
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : '#F9FAFB',
                            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                            fontFamily: "'Calibri Light', sans-serif",
                            outline: 'none',
                          }}
                        >
                          <option value="">Select design type</option>
                          {designTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {formErrors.designType && (
                          <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                            {formErrors.designType}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label 
                        className="block text-sm font-medium mb-1.5"
                        style={{ 
                          fontFamily: "'Poppins', sans-serif",
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        }}
                      >
                        What inspires you? (Optional)
                      </label>
                      <input
                        type="text"
                        name="inspiration"
                        value={formData.inspiration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : '#F9FAFB',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
                          fontFamily: "'Calibri Light', sans-serif",
                          outline: 'none',
                        }}
                        placeholder="e.g., Modern minimalism, Nature, Technology, Art Deco..."
                      />
                    </div>

                    <div>
                      <label 
                        className="block text-sm font-medium mb-1.5"
                        style={{ 
                          fontFamily: "'Poppins', sans-serif",
                          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        }}
                      >
                        Describe your design requirements *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none ${
                          formErrors.description 
                            ? 'border-red-500' 
                            : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}
                        style={{
                          backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : '#F9FAFB',
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          fontFamily: "'Calibri Light', sans-serif",
                          outline: 'none',
                        }}
                        placeholder="Tell us about your vision, preferred colors, style, features you need, etc..."
                      />
                      {formErrors.description && (
                        <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                          {formErrors.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                        color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                        border: 'none',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
    </>
  );
}