'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { LogOut, User, X } from "lucide-react";
/* eslint-disable */

// Define types
interface Theme {
  id: string;
  name: string;
  description: string;
  image: string;
  zipFile: string;
  liveUrl?: string;
  type: 'free' | 'paid';
  createdAt: string;
}

interface BuyNowFormData {
  name: string;
  collegeName: string;
  email: string;
  whatsapp: string;
  selectedPlan: string;
  themeName: string;
}

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // New states for themes and buy now modal
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const [buyNowFormData, setBuyNowFormData] = useState<BuyNowFormData>({
    name: '',
    collegeName: '',
    email: '',
    whatsapp: '',
    selectedPlan: 'basic',
    themeName: ''
  });

  // Form validation states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Refs for animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);
  const themeCardsRef = useRef<HTMLDivElement[]>([]);
  const formElementsRef = useRef<HTMLDivElement[]>([]);
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
      case 'whatsapp':
        if (!value.trim()) return ' number is required';
        if (!validatePhone(value)) return 'Please enter a valid phone number';
        return '';
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'collegeName':
        if (!value.trim()) return 'College name is required';
        return '';
      default:
        return '';
    }
  };

  // Check for duplicate email for free themes
  const isDuplicateEmail = (email: string, themeId: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const existingRequests = JSON.parse(localStorage.getItem('requested_college') || '[]');
    return existingRequests.some((request: any) => 
      request.email.toLowerCase() === email.toLowerCase() && 
      request.theme.id === themeId &&
      request.theme.type === 'free'
    );
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

  // Load themes from localStorage
  useEffect(() => {
    const loadThemes = () => {
      if (typeof window !== 'undefined') {
        const storedThemes = localStorage.getItem('themes');
        if (storedThemes) {
          try {
            setThemes(JSON.parse(storedThemes));
          } catch (error) {
            console.error('Error parsing themes from localStorage:', error);
          }
        }
      }
    };

    loadThemes();
    
    const handleStorageChange = () => {
      loadThemes();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle current user
  useEffect(() => {
    const user = localStorage.getItem('loggedInCollege');
    console.log("The logged in user:", user);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('loggedInCollege');
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInCollege');
    setUser(null);
    window.location.href = '/';
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Buy Now Modal Handlers
  const handleBuyNowClick = (theme: Theme) => {
    setSelectedTheme(theme);
    setBuyNowFormData(prev => ({
      ...prev,
      themeName: theme.name
    }));
    setFormErrors({});
    setTouchedFields({});
    setIsBuyNowModalOpen(true);
  };

  const handleBuyNowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: Record<string, string> = {};
    Object.keys(buyNowFormData).forEach(key => {
      if (key !== 'selectedPlan' && key !== 'themeName') {
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

    // Check for duplicate email for free themes
    if (selectedTheme?.type === 'free' && isDuplicateEmail(buyNowFormData.email, selectedTheme.id)) {
      setFormErrors(prev => ({ 
        ...prev, 
        email: 'You have already requested this free theme with this email address.' 
      }));
      return;
    }
    
    // Save to localStorage
    const existingRequests = JSON.parse(localStorage.getItem('requested_college') || '[]');
    const newRequest = {
      ...buyNowFormData,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      theme: selectedTheme
    };
    
    localStorage.setItem('requested_college', JSON.stringify([...existingRequests, newRequest]));
    
    // Show success popup
    setShowSuccessPopup(true);
    setIsBuyNowModalOpen(false);
    
    // Reset form
    setBuyNowFormData({
      name: '',
      collegeName: '',
      email: '',
      whatsapp: '',
      selectedPlan: 'basic',
      themeName: ''
    });
    setFormErrors({});
    setTouchedFields({});
  };

  const handlePreviewClick = (themeId: string) => {
    window.open(`/Portfolio_Handler/themes/${themeId}`, '_blank');
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

      // Theme cards animation with parallax effect
      themeCardsRef.current.forEach((card, index) => {
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
  }, [mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300" />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500 font-sans overflow-x-hidden">
      {/* Enhanced Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 ease-in-out shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Portfolio Handler
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {['home', 'features', 'themes', 'about', 'contact'].map((item) => (
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
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {user.adminName || 'Admin'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transition-all"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => (window.location.href = '/auth/login')}
                    className="hidden lg:block bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ease-in-out hover:bg-gray-800 dark:hover:bg-gray-100"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => (window.location.href = '/auth/sign_up')}
                    className="hidden lg:block bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ease-in-out hover:bg-gray-800 dark:hover:bg-gray-100"
                  >
                    Sign Up
                  </button>
                </>
              )}

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
              {['home', 'features', 'themes', 'about', 'contact'].map((item) => (
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

              {!user && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <button
                    onClick={() => (window.location.href = '/auth/login')}
                    className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => (window.location.href = '/auth/sign_up')}
                    className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 
                   bg-gradient-to-br from-gray-50 via-white to-gray-100 
                   dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 
                   relative overflow-hidden transition-colors duration-700"
      >
        <div className="absolute top-10 left-10 w-72 h-72 bg-gray-300 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 leading-tight">
            Simplify College Portfolios{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-size-200 animate-gradient">
              One Unified Platform
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Manage events, themes, and profiles effortlessly in one place. Built for modern educational institutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <button
              onClick={() => {
                const section = document.getElementById("themes");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full sm:w-auto bg-gray-900 text-white dark:bg-white dark:text-gray-900 
                         px-8 py-4 md:px-10 md:py-5 rounded-2xl font-semibold text-lg md:text-xl 
                         transition-all duration-500 ease-in-out transform hover:scale-105 
                         shadow-2xl hover:shadow-gray-400/40 dark:hover:shadow-gray-600/60 
                         relative overflow-hidden"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-500"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful <span className="text-gray-900 dark:text-white">Features</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage student portfolios efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Unified Dashboard",
                description: "A centralized control panel to manage portfolio activities, student data, and insights — all from one place.",
                icon: "📊",
              },
              {
                title: "Theme Management",
                description: "Easily switch between light and dark themes, or customize the interface according to your institution's style.",
                icon: "🎨",
              },
              {
                title: "Data Tools",
                description: "Powerful import/export options, bulk management, and detailed analytics to simplify workflows.",
                icon: "📈",
              },
              {
                title: "Multi-College Support",
                description: "Designed to handle multiple institutions with independent workspaces and role-based access.",
                icon: "🏫",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => addToRefs(el, featureCardsRef)}
                className="group bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl 
                           border border-gray-100 dark:border-gray-700 transition-all duration-500 
                           ease-in-out transform hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div
                    className="w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                               rounded-2xl flex items-center justify-center mb-6 text-2xl"
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gray-900/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Theme Preview Section */}
      <section
        id="themes"
        className="py-20 md:py-28 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Beautiful Portfolio Themes
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {themes.length > 0 
                ? "Professionally designed templates for every academic discipline" 
                : "No themes uploaded yet. Upload themes from the admin panel to see them here."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {themes.length > 0 ? (
              themes.map((theme) => (
                <div
                  key={theme.id}
                  ref={el => addToRefs(el, themeCardsRef)}
                  className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105"
                >
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={theme.image}
                      alt={theme.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-xs font-semibold text-white/90 bg-black/30 px-2 py-1 rounded-full">
                        Portfolio Theme
                      </span>
                      <span className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${
                        theme.type === 'free' ? 'bg-green-500/80' : 'bg-blue-500/80'
                      }`}>
                        {theme.type === 'free' ? 'Free' : 'Paid'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {theme.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                      {theme.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handlePreviewClick(theme.id)}
                        className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleBuyNowClick(theme)}
                        className="flex-1 border border-gray-900 dark:border-white text-gray-900 dark:text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
                      >
                        {theme.type === 'free' ? 'Get Free' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [
                {
                  id: 'demo-1',
                  name: "Modern Professional",
                  description: "Clean, corporate design perfect for business and engineering portfolios.",
                  image: "/port1.jpg",
                  type: 'free' as const,
                },
                {
                  id: 'demo-2',
                  name: "Creative Arts",
                  description: "Vibrant and expressive layout for art, design, and media students.",
                  image: "/port2.jpg",
                  type: 'paid' as const,
                },
                {
                  id: 'demo-3',
                  name: "Academic Classic",
                  description: "Traditional layout with modern elements for research and academic portfolios.",
                  image: "/port3.jpg",
                  type: 'free' as const,
                },
              ].map((theme) => (
                <div
                  key={theme.id}
                  className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 opacity-60"
                >
                  <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">No Preview Available</span>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-xs font-semibold text-white/90 bg-black/30 px-2 py-1 rounded-full">
                        Portfolio Theme
                      </span>
                      <span className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${
                        theme.type === 'free' ? 'bg-green-500/80' : 'bg-blue-500/80'
                      }`}>
                        {theme.type === 'free' ? 'Free' : 'Paid'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {theme.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                      {theme.description}
                    </p>
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Upload themes in admin panel to enable purchasing
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-500"
      >
        <div className="absolute top-0 left-0 right-0 transform -translate-y-1">
          <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-16">
            <path
              fill={isDarkMode ? "#111827" : "#ffffff"}
              fillOpacity="1"
              d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
            About The <span className="text-gray-900 dark:text-white">System</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 md:mb-12 max-w-3xl mx-auto">
            College Portfolio Handler System centralizes digital portfolios for institutions, 
            making it easier to manage, customize, and present student achievements professionally. 
            Streamline the entire portfolio lifecycle from creation to showcase.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {[
              { number: "500+", label: "Colleges Supported" },
              { number: "50K+", label: "Active Portfolios" },
              { number: "99%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 bg-gray-900 dark:bg-white rounded-2xl 
                             flex items-center justify-center mx-auto mb-3 transition-all duration-500 
                             ease-in-out transform group-hover:scale-110"
                >
                  <span className="text-white dark:text-gray-900 text-xl md:text-2xl font-bold">
                    {stat.number}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Contact Form Section */}
      <section
        id="contact"
        ref={contactRef}
        className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-gray-900 transition-colors duration-500"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get In <span className="text-gray-900 dark:text-white">Touch</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Reach out to us for any inquiries about our portfolio management system. 
                  We are here to help you streamline your institutions portfolio process.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    iconBg: "bg-gray-900 dark:bg-white",
                    iconColor: "text-white dark:text-gray-900",
                    label: "Phone",
                    value: "+92 319 3236529",
                    svg: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    )
                  },
                  {
                    iconBg: "bg-gray-900 dark:bg-white",
                    iconColor: "text-white dark:text-gray-900",
                    label: "Email",
                    value: "support@portfoliohandler.com",
                    svg: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    )
                  },
                  {
                    iconBg: "bg-gray-900 dark:bg-white",
                    iconColor: "text-white dark:text-gray-900",
                    label: "Website",
                    value: "https://nesticktech.com",
                    svg: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.031 3 3 7.031 3 12s4.031 9 9 9 9-4.031 9-9-4.031-9-9-9zM2 12h20M12 2a10 10 0 010 20M12 2v20" />
                    ),
                    href: "https://nesticktech.com"
                  },
                  {
                    iconBg: "bg-gray-900 dark:bg-white",
                    iconColor: "text-white dark:text-gray-900",
                    label: "Office Hours",
                    value: "Mon - Fri | 9:00 AM - 6:00 PM",
                    svg: (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    )
                  }
                ].map((item) => (
                  <div key={item.label} className="flex items-center space-x-4">
                    <div className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <svg className={`w-6 h-6 ${item.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.svg}
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-600 dark:text-gray-300">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-500">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  />
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  />
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="demo">Request Demo</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Tell us about your inquiry..."
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 resize-none"
                  />
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-900/20 border border-green-800 rounded-xl">
                    <p className="text-green-200 text-center">
                      ✅ Thank you for your message! We will get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl">
                    <p className="text-red-200 text-center">
                      ❌ There was an error sending your message. Please try again.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gray-700 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-600 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                  Portfolio Handler
                </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Simplifying college portfolio management with cutting-edge technology and elegant design.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <div className="space-y-4">
                {['Features', 'Themes', 'About', 'Contact'].map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="block text-gray-400 hover:text-white transition-colors duration-300 text-left w-full"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <p>support@portfoliohandler.com</p>
                <p>+92 319 3236529</p>
                <p>Mon - Fri | 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left">
              © 2025 College Portfolio Handler System. All rights reserved.
            </div>

            <div className="flex space-x-4">
              {[
                { href: "https://x.com/nesticktech", label: "X" },
                { href: "https://web.facebook.com/people/Nestick-Tech/61567617353923/", label: "f" },
                { href: "https://www.instagram.com/nesticktech/", label: "I" },
                { href: "https://www.linkedin.com/in/abdullah-amin005", label: "in" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-sm font-semibold">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Buy Now Modal */}
      {isBuyNowModalOpen && selectedTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTheme.name} – Submit Request
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
                  name="collegeName"
                  value={buyNowFormData.collegeName}
                  onChange={handleBuyNowInputChange}
                  onBlur={handleInputBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-all ${
                    formErrors.collegeName && touchedFields.collegeName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your college name"
                />
                {formErrors.collegeName && touchedFields.collegeName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.collegeName}</p>
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
                  name="whatsapp"
                  value={buyNowFormData.whatsapp}
                  onChange={handleBuyNowInputChange}
                  onBlur={handleInputBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-all ${
                    formErrors.whatsapp && touchedFields.whatsapp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your WhatsApp number"
                />
                {formErrors.whatsapp && touchedFields.whatsapp && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.whatsapp}</p>
                )}
              </div>

              {selectedTheme.type === 'paid' && (
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
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 mt-4"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
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
                Request Submitted!
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our team will contact you shortly.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Website:</strong> https://nesticktech.com
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Contact:</strong> +92 319 3236529
                </p>
              </div>

              <button
                onClick={() => setShowSuccessPopup(false)}
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