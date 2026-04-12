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
  Check
} from "lucide-react";
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

// Packages Data
const packages = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small colleges starting their digital journey",
    features: [
      "Up to 500 Student Portfolios",
      "Basic Templates (5 templates)",
      "Email Support",
      "Basic Analytics",
      "24/7 Support",
      "1 Admin Account"
    ],
    notIncluded: [
      "Custom Domain",
      "API Access"
    ],
    icon: Package,
    color: "#1F4381",
    popular: false
  },
  {
    name: "Professional",
    price: "$199",
    period: "/month",
    description: "Ideal for growing institutions with advanced needs",
    features: [
      "Up to 2,000 Student Portfolios",
      "Premium Templates (15+ templates)",
      "Priority Support",
      "Advanced Analytics",
      "24/7 Priority Support",
      "5 Admin Accounts",
      "Custom Branding",
      "API Access"
    ],
    notIncluded: [],
    icon: Diamond,
    color: "#E8CA5E",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large universities with custom requirements",
    features: [
      "Unlimited Student Portfolios",
      "All Templates + Custom Design",
      "Dedicated Support Team",
      "Custom Analytics & Reports",
      "24/7 Priority Support",
      "Unlimited Admin Accounts",
      "Custom Branding",
      "API Access",
      "SLA Agreement",
      "On-premise Deployment Option"
    ],
    notIncluded: [],
    icon: Gem,
    color: "#00E0FF",
    popular: false
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
      gradient: "from-[#1F4381]/10 to-[#00E0FF]/10"
    },
    {
      title: "Multi-Portal Architecture",
      description: "Three-tier system: Generic Portal for previews, Main Admin Portal for centralized control, and College Admin Portal for individual institution management.",
      icon: Building2,
      color: "#00E0FF",
      gradient: "from-[#00E0FF]/10 to-[#E8CA5E]/10"
    },
    {
      title: "Centralized Management",
      description: "Add/edit/delete colleges, approve template requests, upload new templates, and manage sections per college from a single dashboard.",
      icon: Settings,
      color: "#E8CA5E",
      gradient: "from-[#E8CA5E]/10 to-[#A57F2A]/10"
    },
    {
      title: "Real-Time Content Updates",
      description: "Changes made by college admins reflect instantly on live websites with live synchronization to the centralized database.",
      icon: Zap,
      color: "#00E0FF",
      gradient: "from-[#00E0FF]/10 to-[#1F4381]/10"
    },
    {
      title: "Role-Based Access Control",
      description: "Three-tier access: Generic users view templates, College admins manage their content, Main admin has full system control.",
      icon: Shield,
      color: "#E8CA5E",
      gradient: "from-[#E8CA5E]/10 to-[#A57F2A]/10"
    },
    {
      title: "Scalable Infrastructure",
      description: "Built to support multiple institutions simultaneously with independent workspaces and robust data management tools.",
      icon: BarChart3,
      color: "#00E0FF",
      gradient: "from-[#00E0FF]/10 to-[#1F4381]/10"
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

  return (
    <>
      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="py-8 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
        }}
      >
        {/* Background decorative elements with brand colors */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              backgroundColor: theme === 'dark' ? '#1F4381' : '#E8CA5E',
            }}
          />
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00E0FF',
            }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-15"
            style={{
              backgroundColor: theme === 'dark' ? '#00E0FF' : '#1F4381',
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-4"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(232, 202, 94, 0.5)',
                borderWidth: '1px',
              }}
            >
              <Sparkles className="w-4 h-4 text-[#00E0FF]" />
              <span className="text-sm font-medium"
                style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
              >
                Powerful Features
              </span>
            </div>
            
            {/* Stylish Heading */}
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 font-serif tracking-tight">
                <span className="relative inline-block"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Comprehensive
                  <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0,5 Q50,8 100,5 T200,5" stroke="#00E0FF" strokeWidth="1.5" fill="none" opacity="0.3" />
                  </svg>
                </span>{' '}
                <span className="bg-gradient-to-r from-[#E8CA5E] via-[#F5D76E] to-[#A57F2A] bg-clip-text text-transparent animate-gradient relative inline-block">
                  System Features
                  <span className="absolute inset-0 bg-gradient-to-r from-[#E8CA5E]/20 via-[#F5D76E]/20 to-[#A57F2A]/20 blur-xl -z-10" />
                </span>
              </h2>
            </div>
            
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
                  className="group relative backdrop-blur-sm border rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feature.color }} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[#00E0FF] transition-colors duration-300"
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
                      <CheckCircle2 className="w-4 h-4 text-[#E8CA5E]" />
                      <span style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}>Active Feature</span>
                    </div>
                  </div>
                  
                  {/* Bottom Glow Line - Blended */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8CA5E]/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#0F172A' : '#F0F0F0',
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              backgroundColor: theme === 'dark' ? '#E8CA5E' : '#1F4381',
            }}
          />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              backgroundColor: theme === 'dark' ? '#1F4381' : '#00E0FF',
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12 md:mb-16">
            {/* Left Side - Stylish Heading */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-4"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                  borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(232, 202, 94, 0.5)',
                  borderWidth: '1px',
                }}
              >
                <Rocket className="w-4 h-4 text-[#E8CA5E]" />
                <span className="text-sm font-medium"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  Pricing Plans
                </span>
              </div>
              
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 font-serif tracking-tight">
                  <span className="relative inline-block"
                    style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                  >
                    Choose Your
                    <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none">
                      <path d="M0,5 Q50,8 100,5 T200,5" stroke="#00E0FF" strokeWidth="1.5" fill="none" opacity="0.3" />
                    </svg>
                  </span>{' '}
                  <span className="bg-gradient-to-r from-[#E8CA5E] via-[#F5D76E] to-[#A57F2A] bg-clip-text text-transparent animate-gradient relative inline-block">
                    Perfect Plan
                    <span className="absolute inset-0 bg-gradient-to-r from-[#E8CA5E]/20 via-[#F5D76E]/20 to-[#A57F2A]/20 blur-xl -z-10" />
                  </span>
                </h2>
              </div>
              
              <p className="text-lg md:text-xl max-w-2xl lg:max-w-full font-light"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              >
                Flexible pricing options tailored to fit your institution&apos;s needs and scale
              </p>
            </motion.div>

            {/* Right Side - Empty */}
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
                  className={`relative backdrop-blur-sm border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl ${
                    pkg.popular 
                      ? 'shadow-xl' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: pkg.popular 
                      ? (theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(232, 202, 94, 0.5)')
                      : (theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(0, 0, 0, 0.05)'),
                    boxShadow: pkg.popular && theme === 'dark' ? '0 4px 20px rgba(232,202,94,0.1)' : 'none',
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#0B0F19] text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${pkg.color}20, ${pkg.color}10)`,
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
                      <span className="text-4xl font-bold"
                        style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
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
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-[#E8CA5E]" />
                        <span style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}>{feature}</span>
                      </div>
                    ))}
                    {pkg.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm opacity-50">
                        <Lock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#0B0F19] hover:shadow-lg hover:shadow-[#E8CA5E]/25'
                        : ''
                    }`}
                    style={{
                      background: !pkg.popular ? (theme === 'dark' ? '#1E293B' : '#E5E7EB') : undefined,
                      color: !pkg.popular ? (theme === 'dark' ? '#D1D5DB' : '#4B5563') : undefined,
                    }}
                  >
                    {pkg.price === "Custom" ? "Contact Sales" : "Get Started"}
                    <ArrowRight className="w-4 h-4 inline-block ml-2" />
                  </button>
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
              All plans include free setup, basic support, and regular updates.
              <br />
              Need a custom solution? <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-[#00E0FF] hover:underline">Contact our sales team</button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
        }}
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-4"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(232, 202, 94, 0.5)',
                borderWidth: '1px',
              }}
            >
              <Building2 className="w-4 h-4 text-[#00E0FF]" />
              <span className="text-sm font-medium"
                style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
              >
                Three-Tier Architecture
              </span>
            </div>
            
            {/* Stylish Heading */}
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-6 font-serif tracking-tight">
                <span className="relative inline-block"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Streamlined
                  <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0,5 Q50,8 100,5 T200,5" stroke="#00E0FF" strokeWidth="1.5" fill="none" opacity="0.3" />
                  </svg>
                </span>{' '}
                <span className="bg-gradient-to-r from-[#E8CA5E] via-[#F5D76E] to-[#A57F2A] bg-clip-text text-transparent animate-gradient relative inline-block">
                  Portfolio Management
                  <span className="absolute inset-0 bg-gradient-to-r from-[#E8CA5E]/20 via-[#F5D76E]/20 to-[#A57F2A]/20 blur-xl -z-10" />
                </span>
              </h2>
            </div>
            
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
                <Zap className="w-6 h-6 text-[#00E0FF]" />
                How It Works
              </h3>
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={step.step} className="flex items-start group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1F4381] to-[#00E0FF] flex items-center justify-center flex-shrink-0 mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 group-hover:text-[#00E0FF] transition-colors"
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
              className="backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 font-serif"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                <BarChart3 className="w-6 h-6 text-[#E8CA5E]" />
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mr-4"
                        style={{
                          background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
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
            className="mt-16 bg-gradient-to-br backdrop-blur-sm rounded-2xl p-8 md:p-12 border transition-all duration-300"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
                <span className="text-white"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Three-Tier
                </span>{' '}
                <span className="bg-gradient-to-r from-[#E8CA5E] via-[#F5D76E] to-[#A57F2A] bg-clip-text text-transparent animate-gradient">
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${portal.color}20, ${portal.color}10)`,
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
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#E8CA5E]" />
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

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}