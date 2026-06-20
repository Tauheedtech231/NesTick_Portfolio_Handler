'use client';

import { motion, Variants } from "framer-motion";
import { 
  Building2, 
  Zap, 
  BarChart3,
  CheckCircle2,
  Crown,
  Users,
  FileText,
  Settings,
  Globe2,
  Lock,
  Database,
  Star,
  Rocket,
  Package,
  Diamond,
  Gem,
  Check,
  Phone,
  Headphones,
  Sliders,
  ShieldCheck,
  BookOpen,
  Server,
  ShoppingBag,
  Layers,
  Briefcase,
  Layout
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";

interface OtherSectionsProps {
  featuresRef: React.RefObject<HTMLDivElement | null>;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
  scrollToSection: (sectionId: string) => void;
  addToRefs: (
    el: HTMLDivElement | null,
    refArray: React.MutableRefObject<HTMLDivElement[]>
  ) => void;
  featureCardsRef: React.MutableRefObject<HTMLDivElement[]>;
  formElementsRef: React.MutableRefObject<HTMLDivElement[]>;
  isDarkMode: boolean;
}

// Packages Data
const packages = [
  {
    name: "Basic",
    price: "Contact Us",
    period: "",
    description: "Perfect starting point for small colleges and institutions",
    features: [
      { text: "Portfolio site", icon: Layout, included: true },
      { text: "Basic template", icon: Sliders, included: true },
      { text: "24/7 support", icon: Headphones, included: true },
      { text: "Full customization", icon: Settings, included: true },
      { text: "Admin control", icon: ShieldCheck, included: true },
      { text: "Drag & drop site management", icon: Layers, included: true }
    ],
    icon: Package,
    popular: false,
    ctaText: "Contact Sales"
  },
  {
    name: "Most Featured",
    price: "Contact Us",
    period: "",
    description: "Ideal for growing institutions with advanced needs",
    features: [
      { text: "LMS / Admission automation", icon: BookOpen, included: true },
      { text: "Portfolio site (free)", icon: Layout, included: true },
      { text: "24/7 support", icon: Headphones, included: true },
      { text: "Free maintenance at P.S.", icon: Server, included: true },
      { text: "Admin control", icon: ShieldCheck, included: true },
      { text: "Multi portal and customizable apps", icon: Layers, included: true }
    ],
    icon: Diamond,
    popular: true,
    ctaText: "Contact Sales"
  },
  {
    name: "Premium",
    price: "Contact Us",
    period: "",
    description: "Complete ERP solution for large universities",
    features: [
      { text: "Complete ERP", icon: Briefcase, included: true },
      { text: "Portfolio site (free)", icon: Layout, included: true },
      { text: "70% off on paid templates", icon: ShoppingBag, included: true },
      { text: "Free maintenance at P.S.", icon: Server, included: true },
      { text: "Customizable ERP system", icon: Settings, included: true },
      { text: "24/7 support", icon: Headphones, included: true }
    ],
    icon: Gem,
    popular: false,
    ctaText: "Contact Sales"
  }
];

const portals = [
  {
    title: "Generic Portal",
    description: "Public-facing portal for previewing templates and submitting requests. No login required for basic access.",
    features: ["Template Preview", "Request Submission", "Public Access"],
    icon: Globe2,
  },
  {
    title: "Main Admin Portal",
    description: "Central control center for system administrators to manage all colleges and system-wide settings.",
    features: ["College Management", "Template Approval", "System Analytics", "Global Settings"],
    icon: Crown,
  },
  {
    title: "College Admin Portal",
    description: "Secure portal for individual colleges to manage their content, portfolios, and student data.",
    features: ["Content Management", "Student Portfolios", "College Settings", "Local Analytics"],
    icon: Users,
  }
];

export default function OtherSections({
  featuresRef,
  aboutRef,
  addToRefs,
  featureCardsRef,
}: OtherSectionsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  const getSectionBg = () => {
    return theme === 'dark' ? '#0B0F19' : '#FFFFFF';
  };

  const getCardBg = () => {
    return theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF';
  };

  const getBorderColor = () => {
    return theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  };

  const getAccentColor = () => {
    return theme === 'dark' ? '#E8CA5E' : '#0066FF';
  };

  const getAccentBg = () => {
    return theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)';
  };

  const getPortalBg = () => {
    return theme === 'dark' ? 'rgba(11, 15, 25, 0.3)' : 'rgba(248, 249, 250, 0.5)';
  };

  return (
    <>
      {/* Features Section - Using separate component */}
      <FeaturesSection />

      {/* Packages Section */}
      <section className="py-12 md:py-16 lg:py-10 px-4 sm:px-6"
        style={{
          backgroundColor: getSectionBg(),
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto lg:mx-0 w-fit"
                style={{
                  backgroundColor: getAccentBg(),
                }}
              >
                <Rocket className="w-3.5 h-3.5"
                  style={{ color: getAccentColor() }}
                />
                <span className="text-xs font-medium"
                  style={{ color: getAccentColor() }}
                >
                  Pricing Plans
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 font-serif tracking-tight">
                <span className="relative inline-block"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Choose Your
                </span>{' '}
                <span className="inline-block"
                  style={{ color: getAccentColor() }}
                >
                  Perfect Plan
                </span>
              </h2>
              
              <p className="text-lg md:text-xl font-light"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              >
                Flexible solutions tailored to fit your institution&apos;s needs and scale
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className={`relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl ${
                    pkg.popular ? 'shadow-lg' : ''
                  }`}
                  style={{
                    backgroundColor: getCardBg(),
                    border: pkg.popular 
                      ? `2px solid ${getAccentColor()}`
                      : `1px solid ${getBorderColor()}`,
                    boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
                        style={{
                          backgroundColor: getAccentColor(),
                          color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                        }}
                      >
                        <Star className="w-3 h-3" />
                        Most Featured
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        backgroundColor: getAccentBg(),
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: getAccentColor() }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2"
                      style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                    >
                      {pkg.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold"
                        style={{ color: getAccentColor() }}
                      >
                        {pkg.price}
                      </span>
                    </div>
                    <p className="text-sm"
                      style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    >
                      {pkg.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: feature.included ? getAccentBg() : 'rgba(107, 114, 128, 0.1)',
                            }}
                          >
                            {feature.included ? (
                              <Check className="w-3 h-3" style={{ color: getAccentColor() }} />
                            ) : (
                              <Lock className="w-3 h-3" style={{ color: '#6B7280' }} />
                            )}
                          </div>
                          <FeatureIcon className="w-3.5 h-3.5" style={{ color: feature.included ? getAccentColor() : '#6B7280' }} />
                          <span style={{ color: feature.included ? (theme === 'dark' ? '#D1D5DB' : '#4B5563') : '#6B7280' }}>
                            {feature.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <Link href="/contact">
                    <button
                      className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                      style={{
                        backgroundColor: pkg.popular ? getAccentColor() : (theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#F5F5F5'),
                        color: pkg.popular ? (theme === 'dark' ? '#1F4381' : '#FFFFFF') : (theme === 'dark' ? '#D1D5DB' : '#4B5563'),
                      }}
                    >
                      {pkg.ctaText}
                      <Phone className="w-4 h-4" />
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="py-12 md:py-16 lg:py-20 px-4 sm:px-6"
        style={{
          backgroundColor: getSectionBg(),
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto w-fit"
              style={{
                backgroundColor: getAccentBg(),
              }}
            >
              <Building2 className="w-3.5 h-3.5"
                style={{ color: getAccentColor() }}
              />
              <span className="text-xs font-medium"
                style={{ color: getAccentColor() }}
              >
                Three-Tier Architecture
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 font-serif tracking-tight">
              <span className="relative inline-block"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                Streamlined
              </span>{' '}
              <span className="inline-block"
                style={{ color: getAccentColor() }}
              >
                Portfolio Management
              </span>
            </h2>
            
            <p className="text-lg md:text-xl max-w-4xl mx-auto font-light"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              The College Portfolio Handler System centralizes digital portfolios for educational institutions, 
              providing a comprehensive platform to create, manage, and showcase student achievements professionally 
              across multiple colleges and departments.
            </p>
          </motion.div>

          {/* How It Works - Full Width */}
          <div className="w-full">
            <HowItWorks />
          </div>

          {/* Portal Architecture Section - No card background */}
          <div className="mt-12 md:mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 font-serif">
                <span style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}>
                  Three-Tier
                </span>{' '}
                <span style={{ color: getAccentColor() }}>
                  Portal Architecture
                </span>
              </h3>
              <p className="max-w-3xl mx-auto font-light"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              >
                Our system is built on a robust multi-portal architecture designed for maximum efficiency and security
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {portals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <div
                    key={portal.title}
                    className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      backgroundColor: getPortalBg(),
                      border: `1px solid ${getBorderColor()}`,
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: getAccentBg(),
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: getAccentColor() }} />
                    </div>
                    <h4 className="text-xl font-bold mb-3"
                      style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                    >
                      {portal.title}
                    </h4>
                    <p className="mb-4 text-sm"
                      style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    >
                      {portal.description}
                    </p>
                    <div className="space-y-2">
                      {portal.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm"
                          style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 flex-shrink-0"
                            style={{ color: getAccentColor() }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}