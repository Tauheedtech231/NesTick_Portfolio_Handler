'use client';

import { motion, Variants } from "framer-motion";
import { 
  Sparkles, 
  Building2, 
  Layout, 
  Zap, 
  Shield, 
  BarChart3,
  ArrowRight,
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
  Award,
  Package,
  Diamond,
  Gem,
  Check,
  Phone,
  GraduationCap,
  Paintbrush,
  Headphones,
  Sliders,
  ShieldCheck,
  BookOpen,
  Server,
  ShoppingBag,
  Layers,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

// Updated Packages Data as per requirements
const packages = [
  {
    name: "Basic",
    price: "Contact Us",
    period: "",
    description: "Perfect starting point for small colleges and institutions",
    features: [
      { text: "Portfolio site", icon: Layout, included: true },
      { text: "Basic template", icon: Paintbrush, included: true },
      { text: "24/7 support", icon: Headphones, included: true },
      { text: "Full customization", icon: Sliders, included: true },
      { text: "Admin control", icon: ShieldCheck, included: true },
      { text: "Drag & drop site management", icon: Layers, included: true }
    ],
    icon: Package,
    color: "#1F4381",
    bgColor: "rgba(31, 67, 129, 0.15)",
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
    color: "#E8CA5E",
    bgColor: "rgba(232, 202, 94, 0.15)",
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
    color: "#00E0FF",
    bgColor: "rgba(0, 224, 255, 0.15)",
    popular: false,
    ctaText: "Contact Sales"
  }
];

export default function OtherSections({
  featuresRef,
  aboutRef,
  addToRefs,
  featureCardsRef,
}: OtherSectionsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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
  
  const features = [
    {
      title: "Ready-Made Portfolio Templates",
      description: "Professional templates for colleges with standard sections: Home, About, Services, Faculty, Gallery, Contact. Easily customizable for any educational institute.",
      icon: Layout,
      color: "#1F4381",
    },
    {
      title: "Multi-Portal Architecture",
      description: "Three-tier system: Generic Portal for previews, Main Admin Portal for centralized control, and College Admin Portal for individual institution management.",
      icon: Building2,
      color: "#00E0FF",
    },
    {
      title: "Centralized Management",
      description: "Add/edit/delete colleges, approve template requests, upload new templates, and manage sections per college from a single dashboard.",
      icon: Settings,
      color: "#E8CA5E",
    },
    {
      title: "Real-Time Content Updates",
      description: "Changes made by college admins reflect instantly on live websites with live synchronization to the centralized database.",
      icon: Zap,
      color: "#00E0FF",
    },
    {
      title: "Role-Based Access Control",
      description: "Three-tier access: Generic users view templates, College admins manage their content, Main admin has full system control.",
      icon: Shield,
      color: "#E8CA5E",
    },
    {
      title: "Scalable Infrastructure",
      description: "Built to support multiple institutions simultaneously with independent workspaces and robust data management tools.",
      icon: BarChart3,
      color: "#00E0FF",
    }
  ];

  const portals = [
    {
      title: "Generic Portal",
      description: "Public-facing portal for previewing templates and submitting requests. No login required for basic access.",
      features: ["Template Preview", "Request Submission", "Public Access"],
      icon: Globe2,
      color: "#00E0FF"
    },
    {
      title: "Main Admin Portal",
      description: "Central control center for system administrators to manage all colleges and system-wide settings.",
      features: ["College Management", "Template Approval", "System Analytics", "Global Settings"],
      icon: Crown,
      color: "#E8CA5E"
    },
    {
      title: "College Admin Portal",
      description: "Secure portal for individual colleges to manage their content, portfolios, and student data.",
      features: ["Content Management", "Student Portfolios", "College Settings", "Local Analytics"],
      icon: Users,
      color: "#1F4381"
    }
  ];

  const stats = [
    { label: "Institutions Supported", value: "500+", description: "Colleges and educational institutes", icon: Building2, color: "#1F4381" },
    { label: "Active Portfolios", value: "50K+", description: "Student portfolios managed", icon: FileText, color: "#00E0FF" },
    { label: "System Uptime", value: "99.9%", description: "Reliable service availability", icon: Database, color: "#E8CA5E" },
    { label: "Admin Satisfaction", value: "98%", description: "Positive feedback rate", icon: Users, color: "#A57F2A" }
  ];

  const steps = [
    { step: "01", title: "Template Selection", description: "Colleges browse and select from professional portfolio templates tailored for education" },
    { step: "02", title: "Centralized Approval", description: "Main admin reviews and approves template requests with customization options" },
    { step: "03", title: "Content Management", description: "College admins manage their content through a secure, dedicated portal" },
    { step: "04", title: "Live Publication", description: "Real-time updates ensure instant publication of portfolio content" }
  ];

  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants:Variants = {
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

  // Same background for all sections
  const getSectionBg = () => {
    return theme === 'dark' ? '#0B0F19' : '#F5F5F5';
  };

  return (
    <>
      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="py-8 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: getSectionBg(),
        }}
      >
        {/* Simple background decoration - no gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-80 h-80 rounded-full blur-3xl opacity-10"
            style={{
              backgroundColor: theme === 'dark' ? '#1F4381' : '#00A0FF',
            }}
          />
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full blur-3xl opacity-10"
            style={{
              backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
                border: 'none',
              }}
            >
              <Sparkles className="w-4 h-4"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              />
              <span className="text-sm font-medium"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              >
                Powerful Features
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 font-serif tracking-tight">
              <span className="relative inline-block"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                Comprehensive
              </span>{' '}
              <span className="inline-block"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              >
                System Features
              </span>
            </h2>
            
            <p className="text-lg md:text-xl max-w-2xl mx-auto font-light"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              A complete solution for managing educational portfolios with multi-level architecture
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  ref={(el) => addToRefs(el, featureCardsRef)}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feature.color }} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 transition-colors duration-300"
                      style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                    >
                      {feature.title}
                    </h3>
                    
                    <p className="leading-relaxed text-base mb-4"
                      style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    >
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4"
                        style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                      />
                      <span style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>Active Feature</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Packages Section - UPDATED as per requirements */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: getSectionBg(),
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{
              backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
            }}
          />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{
              backgroundColor: theme === 'dark' ? '#1F4381' : '#00A0FF',
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 mx-auto lg:mx-0 w-fit"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
                  border: 'none',
                }}
              >
                <Rocket className="w-4 h-4"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                />
                <span className="text-sm font-medium"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                >
                  Pricing Plans
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 font-serif tracking-tight">
                <span className="relative inline-block"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Choose Your
                </span>{' '}
                <span className="inline-block"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                >
                  Perfect Plan
                </span>
              </h2>
              
              <p className="text-lg md:text-xl max-w-2xl lg:max-w-full font-light"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              >
                Flexible solutions tailored to fit your institution&apos;s needs and scale
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  className={`relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl ${
                    pkg.popular ? 'shadow-xl' : ''
                  }`}
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: pkg.popular 
                      ? `2px solid ${pkg.color}`
                      : `1px solid ${theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)'}`,
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                        style={{
                          backgroundColor: pkg.color,
                          color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                        }}
                      >
                        <Star className="w-3 h-3" />
                        Most Featured
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        backgroundColor: pkg.bgColor,
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: pkg.color }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2"
                      style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                    >
                      {pkg.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold"
                        style={{ color: pkg.color }}
                      >
                        {pkg.price}
                      </span>
                      {pkg.period && <span className="text-gray-400">{pkg.period}</span>}
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
                              backgroundColor: feature.included ? pkg.bgColor : 'rgba(107, 114, 128, 0.2)',
                            }}
                          >
                            {feature.included ? (
                              <Check className="w-3 h-3" style={{ color: pkg.color }} />
                            ) : (
                              <Lock className="w-3 h-3 text-gray-500" />
                            )}
                          </div>
                          <FeatureIcon className="w-3.5 h-3.5" style={{ color: feature.included ? pkg.color : '#6B7280' }} />
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
      backgroundColor: pkg.popular
        ? pkg.color
        : (theme === 'dark' ? '#1E293B' : '#E5E7EB'),
      color: pkg.popular
        ? (theme === 'dark' ? '#1F4381' : '#FFFFFF')
        : (theme === 'dark' ? '#D1D5DB' : '#4B5563'),
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-sm"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              All plans include basic support and regular updates.
              <br />
              Need more information? <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:underline font-medium"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              >Contact our sales team</button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section - Same background */}
      <section
        id="about"
        ref={aboutRef}
        className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: getSectionBg(),
        }}
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 mx-auto w-fit"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
                border: 'none',
              }}
            >
              <Building2 className="w-4 h-4"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              />
              <span className="text-sm font-medium"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              >
                Three-Tier Architecture
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-6 font-serif tracking-tight">
              <span className="relative inline-block"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                Streamlined
              </span>{' '}
              <span className="inline-block"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              >
                Portfolio Management
              </span>
            </h2>
            
            <p className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto font-light"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              The College Portfolio Handler System centralizes digital portfolios for educational institutions, 
              providing a comprehensive platform to create, manage, and showcase student achievements professionally 
              across multiple colleges and departments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Steps Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 font-serif"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                <Zap className="w-6 h-6"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                />
                How It Works
              </h3>
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={step.step} className="flex items-start group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mr-4 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                      }}
                    >
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 transition-colors"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                      >
                        {step.title}
                      </h4>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats & Impact Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl p-8 transition-all duration-300"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                border: '1px solid',
                borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 font-serif"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                <BarChart3 className="w-6 h-6"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                />
                System Impact & Reach
              </h3>
              <div className="space-y-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center p-4 rounded-xl transition-all duration-300"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.5)' : 'rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                        style={{
                          backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm"
                            style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                          >
                            {stat.label}
                          </span>
                          <span className="text-xl font-bold"
                            style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                          >
                            {stat.value}
                          </span>
                        </div>
                        <p className="text-sm"
                          style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                        >
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Portal Architecture Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 rounded-2xl p-8 md:p-12 transition-all duration-300"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              border: '1px solid',
              borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
                <span className="text-white"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Three-Tier
                </span>{' '}
                <span className="inline-block"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                >
                  Portal Architecture
                </span>
              </h3>
              <p className="text-gray-400 max-w-3xl mx-auto font-light">Our system is built on a robust multi-portal architecture designed for maximum efficiency and security</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {portals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <div
                    key={portal.title}
                    className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.5)' : 'rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: portal.color }} />
                    </div>
                    <h4 className="text-xl font-bold mb-3"
                      style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                    >
                      {portal.title}
                    </h4>
                    <p className="text-gray-400 mb-4 text-sm">{portal.description}</p>
                    <div className="space-y-2">
                      {portal.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-400 text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2"
                            style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}