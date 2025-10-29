'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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
  
  // Refs for animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const themesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const featureCardsRef = useRef<HTMLDivElement[]>([]);
  const themeCardsRef = useRef<HTMLDivElement[]>([]);
  const formElementsRef = useRef<HTMLDivElement[]>([]);

  // Add to refs array
  const addToRefs = (el: HTMLDivElement | null, refArray: React.MutableRefObject<HTMLDivElement[]>) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
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

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real application, you would send the data to your backend here
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio Handler
              </span>
            </div>
            
            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
             {['home', 'features', 'themes', 'about', 'contact'].map((item) => (
  <button
    key={item}
    onClick={() => scrollToSection(item)}
    className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-out group"
  >
    <span className="font-medium text-sm uppercase tracking-wide">
      {item.charAt(0).toUpperCase() + item.slice(1)}
    </span>

    {/* Perfectly aligned animated underline */}
    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out group-hover:w-full"></span>
  </button>
))}

            </div>
            
            {/* Enhanced Right side buttons */}
            <div className="flex items-center space-x-3">
          

              {/* Enhanced Admin Portal Button */}
              <button
  onClick={() => window.location.href = "/Portfolio_Handler"}
  className="hidden lg:block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
>
  <span className="relative z-10">Admin Portal</span>
  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</button>


              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                  <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className="lg:hidden h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl mt-3 shadow-xl"
          >
            <div className="pt-4 pb-6 space-y-2">
              {['home', 'features', 'themes', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out font-medium py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-base group"
                >
                  <span className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                  </span>
                </button>
              ))}
              <button
  onClick={() => window.location.href = "/Portfolio_Handler"}
  className="w-full mx-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg mt-4"
>
  Admin Portal
</button>

            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 leading-tight">
            Simplify College Portfolios{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
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
  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-semibold text-lg md:text-xl transition-all duration-500 ease-in-out transform hover:scale-105 shadow-2xl hover:shadow-3xl relative overflow-hidden group"
>
  <span className="relative z-10">Get Started Free</span>
  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</button>

           
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" ref={featuresRef} className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful <span className="text-blue-600 dark:text-blue-400">Features</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage student portfolios efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Unified Dashboard",
                description: "Centralized control panel for managing all portfolio activities, student data, and institutional insights in one intuitive interface.",
                icon: "📊"
              },
              {
                title: "Theme Management",
                description: "Customize portfolio appearances with pre-built themes or create your own branding with easy-to-use design tools.",
                icon: "🎨"
              },
              {
                title: "Data Tools",
                description: "Import/export capabilities, bulk operations, and advanced analytics to streamline portfolio management workflows.",
                icon: "📈"
              },
              {
                title: "Multi-College Support",
                description: "Scalable architecture supporting multiple institutions with separate workspaces and customized access controls.",
                icon: "🏫"
              },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                ref={el => addToRefs(el, featureCardsRef)}
                className="group bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-500 ease-in-out transform hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                    {feature.description}
                  </p>
                </div>
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Theme Preview Section */}
      <section
        id="themes"
        className="py-20 md:py-28 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden"
      >
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Beautiful <span className="text-purple-600 dark:text-purple-400">Portfolio Themes</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Professionally designed templates for every academic discipline
            </p>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Modern Professional",
                description:
                  "Clean, corporate design perfect for business and engineering portfolios.",
                image: "/port1.jpg",
                category: "Business & Engineering",
              },
              {
                name: "Creative Arts",
                description:
                  "Vibrant and expressive layout for art, design, and media students.",
                image: "/port2.jpg",
                category: "Arts & Design",
              },
              {
                name: "Academic Classic",
                description:
                  "Traditional layout with modern elements for research and academic portfolios.",
                image: "/port3.jpg",
                category: "Research & Academia",
              },
            ].map((theme) => (
              <div
                key={theme.name}
                ref={el => addToRefs(el, themeCardsRef)}
                className="group bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105"
              >
                {/* Image Section */}
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500"></div>
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold text-white/90 bg-black/30 px-2 py-1 rounded-full">
                      {theme.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {theme.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" ref={aboutRef} className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Enhanced Wave Divider */}
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
            About The <span className="text-green-600 dark:text-green-400">System</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 md:mb-12 max-w-3xl mx-auto">
            College Portfolio Handler System is built to centralize digital portfolios for institutions, 
            making it easier to manage, customize, and present student achievements professionally. 
            Our platform streamlines the entire portfolio lifecycle from creation to showcase.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {[
              { number: "500+", label: "Colleges Supported" },
              { number: "50K+", label: "Active Portfolios" },
              { number: "99%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={stat.label} className="group">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-500 ease-in-out transform group-hover:scale-110">
                  <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
      <section id="contact" ref={contactRef} className="py-20 md:py-28 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get In <span className="text-blue-600 dark:text-blue-400">Touch</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
  <div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Contact Information
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-8">
      Reach out to us for any inquiries about our portfolio management system. 
      We’re here to help you streamline your institution’s portfolio process.
    </p>
  </div>

  <div className="space-y-6">
    {/* Phone */}
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
        <svg
          className="w-6 h-6 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
        <p className="text-gray-600 dark:text-gray-300">+92 319 3236529</p>
      </div>
    </div>

    {/* Email */}
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
        <svg
          className="w-6 h-6 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">Email</p>
        <p className="text-gray-600 dark:text-gray-300">
          support@portfoliohandler.com
        </p>
      </div>
    </div>

    {/* Website */}
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
        <svg
          className="w-6 h-6 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3C7.031 3 3 7.031 3 12s4.031 9 9 9 9-4.031 9-9-4.031-9-9-9zM2 12h20M12 2a10 10 0 010 20M12 2v20"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">Website</p>
        <a
          href="https://nesticktech.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          https://nesticktech.com
        </a>
      </div>
    </div>

    {/* Office Hours */}
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
        <svg
          className="w-6 h-6 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">
          Office Hours
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Mon - Fri | 9:00 AM - 6:00 PM
        </p>
      </div>
    </div>
  </div>
</div>


            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Subject Field */}
                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="demo">Request Demo</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message Field */}
                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <div ref={el => addToRefs(el, formElementsRef)}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-500 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <p className="text-green-800 dark:text-green-200 text-center">
                      ✅ Thank you for your message! We will get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-800 dark:text-red-200 text-center">
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
  {/* Soft background glow */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
  </div>

  <div className="container mx-auto max-w-6xl relative z-10">
    {/* Grid layout */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
      
      {/* Brand Section */}
      <div className="col-span-2 md:col-span-1 lg:col-span-2">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Portfolio Handler
          </span>
        </div>
        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
          Simplifying college portfolio management with cutting-edge technology and elegant design.
        </p>
      </div>

      {/* Quick Links */}
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

      {/* Contact Section */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
        <div className="space-y-3 text-gray-400">
          <p>support@portfoliohandler.com</p>
          <p>+92 319 3236529</p>
          <p>Mon - Fri | 9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
      <div className="text-gray-400 text-center md:text-left">
        © 2025 College Portfolio Handler System. All rights reserved.
      </div>

      {/* Social Links */}
      <div className="flex space-x-4">
        <a
          href="https://x.com/nesticktech"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110"
        >
          <span className="text-sm font-semibold">X</span>
        </a>

        <a
          href="https://web.facebook.com/people/Nestick-Tech/61567617353923/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110"
        >
          <span className="text-sm font-semibold">f</span>
        </a>

        <a
          href="https://www.instagram.com/nesticktech/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-110"
        >
          <span className="text-sm font-semibold">I</span>
        </a>

        <a
          href="https://www.linkedin.com/in/abdullah-amin005"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-400 transition-all duration-300 transform hover:scale-110"
        >
          <span className="text-sm font-semibold">in</span>
        </a>
      </div>
    </div>
  </div>
</footer>


    </div>
  );
}