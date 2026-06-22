/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Star, ArrowLeft, 
  Sparkles, Calendar, 
  Monitor, Smartphone, Tablet, Globe,
  Award, Code, ChevronDown, Home
} from 'lucide-react';
import { MdArrowRight } from 'react-icons/md';
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
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
}

export default function TemplateDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(true);

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
    const storedTemplate = sessionStorage.getItem('selectedTemplateDetails');
    if (storedTemplate) {
      try {
        const parsed = JSON.parse(storedTemplate);
        setTemplate(parsed);
      } catch (error) {
        console.error('Error parsing template:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  // Handle Buy Now
  const handleBuyNowClick = () => {
    if (!template) return;
    
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

  const getTemplateFeatures = (templateName: string) => {
    const featuresMap: { [key: string]: string[] } = {
      "Modern Professional": [
        "Clean and corporate design",
        "Fully responsive layout",
        "SEO optimized structure",
        "Easy customization options",
        "Contact form integration",
        "Project showcase gallery",
        "Fast loading performance",
        "Cross-browser compatible"
      ],
      "Creative Arts": [
        "Vibrant visual design",
        "Portfolio grid layout",
        "Social media integration",
        "Blog section included",
        "Multi-color schemes",
        "Creative typography",
        "Image gallery with lightbox",
        "Video background support"
      ],
      "Academic Classic": [
        "Research paper showcase",
        "Publication timeline",
        "Citation management",
        "CV/Resume section",
        "Conference listings",
        "Academic achievements",
        "Publication metrics",
        "Collaborator network"
      ]
    };

    const defaultFeatures = [
      "Modern responsive design",
      "Easy to customize",
      "Fast loading performance",
      "Cross-browser compatible",
      "Mobile-first approach",
      "Clean code structure",
      "SEO optimized",
      "Accessibility ready"
    ];

    return featuresMap[templateName] || defaultFeatures;
  };

  // Benefits list for dropdown
  const getBenefitsList = () => {
    return [
      "Fully responsive design that looks perfect on all devices",
      "Lightning fast performance with optimized code",
      "Built with best security practices",
      "Modular and well-documented code",
      "SEO optimized structure",
      "Cross-browser compatible",
      "Accessibility ready (WCAG 2.1 compliant)",
      "24/7 dedicated support"
    ];
  };

  if (loading || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#E8CA5E] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>Loading template details...</p>
        </div>
      </div>
    );
  }

  const features = getTemplateFeatures(template.name);
  const benefitsList = getBenefitsList();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      
      <main className="min-h-screen pt-16 lg:pt-20 overflow-x-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Two Back Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Back to Home */}
            <Link href="/">
              <motion.button
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg"
                style={{
                  color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                  cursor: 'pointer',
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                }}
              >
                <Home className="w-4 h-4" />
                Back to Home
              </motion.button>
            </Link>

            {/* Back to Templates */}
            <Link href="/templates">
              <motion.button
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg"
                style={{
                  color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                  cursor: 'pointer',
                  backgroundColor: theme === 'dark' ? 'rgba(232,202,94,0.1)' : 'rgba(0,102,255,0.06)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(232,202,94,0.2)' : 'rgba(0,102,255,0.15)',
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Templates
              </motion.button>
            </Link>
          </div>

          {/* Main Content - NO CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* Left Column - Image + Quick Stats */}
            <div className="order-1 lg:order-1">
              <div className="sticky top-24">
                {/* Image - Clean, no card */}
                <div className="relative w-full rounded-2xl overflow-hidden"
                  style={{ paddingBottom: '75%' }}
                >
                  <Image
                    src={template.image}
                    alt={template.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  
                  {/* Badges - Floating on image */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs font-medium text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Template
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm ${
                      template.type === 'free' 
                        ? 'bg-green-500/80 text-white' 
                        : (theme === 'dark' ? 'bg-[#E8CA5E] text-[#1F4381]' : 'bg-[#0066FF] text-white')
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {template.type === 'free' ? 'Free' : 'Premium'}
                    </span>
                  </div>
                </div>

                {/* Quick Stats - NOW IN LEFT COLUMN */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-3"
                    style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    At a Glance
                  </h3>
                  <div className="flex flex-wrap items-start gap-4 sm:gap-6">
                    <div className="text-center">
                      <Monitor className="w-5 h-5 mx-auto mb-1"
                        style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                      />
                      <p className="text-xs font-medium"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        Desktop
                      </p>
                      <p className="text-[10px]"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        Optimized
                      </p>
                    </div>
                    <div className="text-center">
                      <Tablet className="w-5 h-5 mx-auto mb-1"
                        style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                      />
                      <p className="text-xs font-medium"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        Tablet
                      </p>
                      <p className="text-[10px]"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        Responsive
                      </p>
                    </div>
                    <div className="text-center">
                      <Smartphone className="w-5 h-5 mx-auto mb-1"
                        style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                      />
                      <p className="text-xs font-medium"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        Mobile
                      </p>
                      <p className="text-[10px]"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        Touch Ready
                      </p>
                    </div>
                    <div className="text-center">
                      <Code className="w-5 h-5 mx-auto mb-1"
                        style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                      />
                      <p className="text-xs font-medium"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        Clean Code
                      </p>
                      <p className="text-[10px]"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        W3C Valid
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Clean, no card */}
                <div className="mt-6 space-y-3">
                  <motion.button
                    onClick={handleBuyNowClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
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
                    <Sparkles className="w-4 h-4" />
                    {template.type === 'free' ? 'Get Free Template' : 'Buy Now - Get Started'}
                  </motion.button>

                  {template.live_url && (
                    <motion.a
                      href={template.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 block text-center"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid',
                        borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                        color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        cursor: 'pointer',
                      }}
                    >
                      <Globe className="w-4 h-4" />
                      View Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Details - NO CARDS */}
            <div className="order-2 lg:order-2">
              <div className="space-y-6">
                {/* Header - Clean */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-8 rounded-full"
                      style={{ backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                    />
                    <h1 className="text-3xl md:text-4xl font-bold"
                      style={{ 
                        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {template.name}
                    </h1>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm"
                      style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm"
                      style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    >
                      <Star className="w-4 h-4" style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }} />
                      <span>ID: #{template.id}</span>
                    </div>
                  </div>
                </div>

                {/* Description - Clean, no card */}
                <div>
                  <h3 className="text-sm font-semibold mb-2"
                    style={{ 
                      color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Description
                  </h3>
                  <p className="text-base leading-relaxed"
                    style={{ 
                      color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    {template.description}
                  </p>
                </div>

                {/* Key Features - Clean, no card */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"
                    style={{ 
                      color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                        />
                        <span className="text-sm"
                          style={{ 
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Choose This Template - DROPDOWN */}
                <div>
                  <button
                    onClick={() => setIsBenefitsOpen(!isBenefitsOpen)}
                    className="w-full flex items-center justify-between py-3 transition-colors duration-200"
                    style={{
                      color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                      cursor: 'pointer',
                      borderBottom: '1px solid',
                      borderColor: theme === 'dark' ? 'rgba(30,41,59,0.3)' : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <span className="text-sm font-semibold flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Award className="w-4 h-4" />
                      Why Choose This Template
                    </span>
                    <motion.div
                      animate={{ rotate: isBenefitsOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isBenefitsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-2.5">
                          {benefitsList.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3 py-1.5"
                              style={{
                                borderBottom: idx < benefitsList.length - 1 ? '1px solid' : 'none',
                                borderColor: theme === 'dark' ? 'rgba(30,41,59,0.08)' : 'rgba(0,0,0,0.04)',
                              }}
                            >
                              <MdArrowRight 
                                className="w-4 h-4 flex-shrink-0 mt-0.5"
                                style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
                              />
                              <span className="text-sm leading-relaxed"
                                style={{ 
                                  color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                                  fontFamily: "'Calibri Light', sans-serif",
                                }}
                              >
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}