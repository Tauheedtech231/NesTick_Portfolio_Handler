// components/landing/OtherSections.tsx
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
  CreditCard,
  Check
} from "lucide-react";

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
        className="py-8 px-4 sm:px-6 bg-[#0B0F19] relative overflow-hidden"
      >
        {/* Background decorative elements with brand colors */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[#1F4381]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#E8CA5E]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E0FF]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8CA5E] border border-[#E8CA5E]/30 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-[#1F4381]" />
              <span className="text-sm font-medium text-[#1F4381]">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-white mb-4">
              Comprehensive{' '}
              <span className="bg-gradient-to-r from-[#E8CA5E] to-[#00E0FF] bg-clip-text text-transparent">
                System Features
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
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
                  className="group relative bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 md:p-8 transition-all duration-500 hover:border-[#00E0FF]/50 hover:shadow-2xl hover:shadow-[#00E0FF]/10 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[${feature.color}]/20 to-[${feature.color}]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" style={{ color: feature.color }} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00E0FF] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed text-base mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-[#E8CA5E]" />
                      <span>Active Feature</span>
                    </div>
                  </div>
                  
                  {/* Bottom Glow Line with brand colors */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1F4381] via-[#E8CA5E] to-[#00E0FF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4 sm:px-6 bg-[#0F172A]/30 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E8CA5E]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1F4381]/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12 md:mb-16">
            {/* Left Side - Heading */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F4381]/10 border border-[#E8CA5E]/30 backdrop-blur-sm mb-4">
                <Rocket className="w-4 h-4 text-[#E8CA5E]" />
                <span className="text-sm font-medium text-gray-300">Pricing Plans</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4">
                <span className="text-white">
                  Choose Your
                </span>{' '}
                <span className="bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl lg:max-w-full">
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
                  className={`relative bg-[#0F172A] border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl ${
                    pkg.popular 
                      ? 'border-[#E8CA5E]/50 shadow-[#E8CA5E]/20 shadow-xl' 
                      : 'border-[#1E293B] hover:border-[#00E0FF]/30'
                  }`}
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
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-[${pkg.color}]/20 to-[${pkg.color}]/10 flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8" style={{ color: pkg.color }} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">{pkg.price}</span>
                      {pkg.period && <span className="text-gray-400">{pkg.period}</span>}
                    </div>
                    <p className="text-gray-400 text-sm">{pkg.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-[#E8CA5E]" />
                        <span className="text-gray-300">{feature}</span>
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
                        : 'bg-[#1E293B] text-white hover:bg-[#2D3A4E]'
                    }`}
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
            <p className="text-gray-400 text-sm">
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
        className="py-20 md:py-28 px-4 sm:px-6 bg-[#0B0F19] relative overflow-hidden border-t border-[#1E293B]"
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8CA5E] border border-[#E8CA5E]/30 backdrop-blur-sm mb-4">
              <Building2 className="w-4 h-4 text-[#1F4381]" />
              <span className="text-sm font-medium text-[#1F4381]">Three-Tier Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-white mb-6">
              Streamlined{' '}
              <span className="bg-gradient-to-r from-[#E8CA5E] to-[#00E0FF] bg-clip-text text-transparent">
                Portfolio Management
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-4xl mx-auto">
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
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
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
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#00E0FF] transition-colors">
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
              className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 hover:border-[#00E0FF]/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#E8CA5E]" />
                System Impact & Reach
              </h3>
              <div className="space-y-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center p-4 bg-[#0B0F19] rounded-xl group hover:bg-[#1E293B] transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F4381]/20 to-[#E8CA5E]/10 flex items-center justify-center mr-4">
                        <Icon className="w-6 h-6 text-[#E8CA5E]" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-400">{stat.label}</span>
                          <span className="text-xl font-bold text-white">{stat.value}</span>
                        </div>
                        <p className="text-sm text-gray-500">{stat.description}</p>
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
            className="mt-16 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 md:p-12 border border-[#1E293B] hover:border-[#00E0FF]/30 transition-all duration-300"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-white">
                  Three-Tier
                </span>{' '}
                <span className="bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] bg-clip-text text-transparent">
                  Portal Architecture
                </span>
              </h3>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Our system is built on a robust multi-portal architecture designed for maximum efficiency and security
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {portals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <div
                    key={portal.title}
                    className="bg-[#0B0F19] rounded-2xl p-6 border border-[#1E293B] transition-all duration-300 hover:scale-105 hover:border-[#00E0FF]/40 hover:shadow-lg hover:shadow-[#00E0FF]/10"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[${portal.color}]/20 to-[${portal.color}]/10 flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" style={{ color: portal.color }} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{portal.title}</h4>
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
    </>
  );
}