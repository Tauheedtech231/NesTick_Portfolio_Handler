// components/landing/OtherSections.tsx
'use client';

import { motion, useInView, Variants } from "framer-motion";
import { 
  Sparkles, 
  Building2, 
  Layout, 
  Zap, 
  Shield, 
  BarChart3,
  Phone,
  Mail,
  Globe,
  Clock,
  ArrowRight,
  CheckCircle2,
  Crown,
  Users,
  FileText,
  Settings,
  Globe2,
  Lock,
  Database
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface OtherSectionsProps {
  featuresRef: React.RefObject<HTMLDivElement | null>;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
  contactFormData: ContactFormData;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  handleContactInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleContactSubmit: (e: React.FormEvent) => Promise<void>;
  scrollToSection: (sectionId: string) => void;
  addToRefs: (
    el: HTMLDivElement | null,
    refArray: React.MutableRefObject<HTMLDivElement[]>
  ) => void;
  featureCardsRef: React.MutableRefObject<HTMLDivElement[]>;
  formElementsRef: React.MutableRefObject<HTMLDivElement[]>;
  isDarkMode: boolean;
}

export default function OtherSections({
  featuresRef,
  aboutRef,
  contactRef,
  contactFormData,
  isSubmitting,
  submitStatus,
  handleContactInputChange,
  handleContactSubmit,
  scrollToSection,
  addToRefs,
  featureCardsRef,
  formElementsRef,
  isDarkMode
}: OtherSectionsProps) {
  
  const features = [
    {
      title: "Ready-Made Portfolio Templates",
      description: "Professional templates for colleges with standard sections: Home, About, Services, Faculty, Gallery, Contact. Easily customizable for any educational institute.",
      icon: Layout,
      color: "#1D4ED8",
      gradient: "from-[#1D4ED8]/10 to-[#38BDF8]/10"
    },
    {
      title: "Multi-Portal Architecture",
      description: "Three-tier system: Generic Portal for previews, Main Admin Portal for centralized control, and College Admin Portal for individual institution management.",
      icon: Building2,
      color: "#8B5CF6",
      gradient: "from-[#8B5CF6]/10 to-[#6366F1]/10"
    },
    {
      title: "Centralized Management",
      description: "Add/edit/delete colleges, approve template requests, upload new templates, and manage sections per college from a single dashboard.",
      icon: Settings,
      color: "#22C55E",
      gradient: "from-[#22C55E]/10 to-[#86EFAC]/10"
    },
    {
      title: "Real-Time Content Updates",
      description: "Changes made by college admins reflect instantly on live websites with live synchronization to the centralized database.",
      icon: Zap,
      color: "#F59E0B",
      gradient: "from-[#F59E0B]/10 to-[#FBBF24]/10"
    },
    {
      title: "Role-Based Access Control",
      description: "Three-tier access: Generic users view templates, College admins manage their content, Main admin has full system control.",
      icon: Shield,
      color: "#EF4444",
      gradient: "from-[#EF4444]/10 to-[#F87171]/10"
    },
    {
      title: "Scalable Infrastructure",
      description: "Built to support multiple institutions simultaneously with independent workspaces and robust data management tools.",
      icon: BarChart3,
      color: "#06B6D4",
      gradient: "from-[#06B6D4]/10 to-[#0891B2]/10"
    }
  ];

  const portals = [
    {
      title: "Generic Portal",
      description: "Public-facing portal for previewing templates and submitting requests. No login required for basic access.",
      features: ["Template Preview", "Request Submission", "Public Access"],
      icon: Globe2,
      color: "#1D4ED8"
    },
    {
      title: "Main Admin Portal",
      description: "Central control center for system administrators to manage all colleges and system-wide settings.",
      features: ["College Management", "Template Approval", "System Analytics", "Global Settings"],
      icon: Crown,
      color: "#8B5CF6"
    },
    {
      title: "College Admin Portal",
      description: "Secure portal for individual colleges to manage their content, portfolios, and student data.",
      features: ["Content Management", "Student Portfolios", "College Settings", "Local Analytics"],
      icon: Users,
      color: "#22C55E"
    }
  ];

  const stats = [
    { label: "Institutions Supported", value: "500+", description: "Colleges and educational institutes", icon: Building2, color: "#1D4ED8" },
    { label: "Active Portfolios", value: "50K+", description: "Student portfolios managed", icon: FileText, color: "#38BDF8" },
    { label: "System Uptime", value: "99.9%", description: "Reliable service availability", icon: Database, color: "#22C55E" },
    { label: "Admin Satisfaction", value: "98%", description: "Positive feedback rate", icon: Users, color: "#F59E0B" }
  ];

  const steps = [
    { step: "01", title: "Template Selection", description: "Colleges browse and select from professional portfolio templates tailored for education" },
    { step: "02", title: "Centralized Approval", description: "Main admin reviews and approves template requests with customization options" },
    { step: "03", title: "Content Management", description: "College admins manage their content through a secure, dedicated portal" },
    { step: "04", title: "Live Publication", description: "Real-time updates ensure instant publication of portfolio content" }
  ];

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+92 319 3236529", href: null },
    { icon: Mail, label: "Email", value: "support@portfoliohandler.com", href: "mailto:support@portfoliohandler.com" },
    { icon: Globe, label: "Website", value: "https://nesticktech.com", href: "https://nesticktech.com" },
    { icon: Clock, label: "Office Hours", value: "Mon - Fri | 9:00 AM - 6:00 PM", href: null }
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
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[#1D4ED8]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#38BDF8]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-sm font-medium text-gray-300">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Comprehensive{' '}
              <span className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
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
                  className="group relative bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 md:p-8 transition-all duration-500 hover:border-[#38BDF8]/50 hover:shadow-2xl hover:shadow-[#1D4ED8]/10 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[${feature.color}]/20 to-[${feature.color}]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-[#38BDF8]" style={{ color: feature.color }} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#38BDF8] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed text-base mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>Active Feature</span>
                    </div>
                  </div>
                  
                  {/* Bottom Glow Line */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              );
            })}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
              <Building2 className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-sm font-medium text-gray-300">Three-Tier Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Streamlined{' '}
              <span className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
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
                <Zap className="w-6 h-6 text-[#38BDF8]" />
                How It Works
              </h3>
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={step.step} className="flex items-start group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] flex items-center justify-center flex-shrink-0 mr-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#38BDF8] transition-colors">
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
              className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#38BDF8]" />
                System Impact & Reach
              </h3>
              <div className="space-y-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center p-4 bg-[#0B0F19] rounded-xl group hover:bg-[#1E293B] transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 to-[#38BDF8]/10 flex items-center justify-center mr-4">
                        <Icon className="w-6 h-6 text-[#38BDF8]" />
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
            className="mt-16 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 md:p-12 border border-[#1E293B]"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Three-Tier Portal Architecture
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
                    className="bg-[#0B0F19] rounded-2xl p-6 border border-[#1E293B] transition-all duration-300 hover:scale-105 hover:border-[#38BDF8]/30"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[${portal.color}]/20 to-[${portal.color}]/10 flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-[#38BDF8]" style={{ color: portal.color }} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{portal.title}</h4>
                    <p className="text-gray-400 mb-4 text-sm">{portal.description}</p>
                    <div className="space-y-2">
                      {portal.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-400 text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#22C55E]" />
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

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className="py-20 md:py-28 px-4 sm:px-6 bg-[#0B0F19] relative overflow-hidden border-t border-[#1E293B]"
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
              <Mail className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-sm font-medium text-gray-300">Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Get In{' '}
              <span className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h3>
                <p className="text-gray-400 mb-8">
                  Reach out to us for any inquiries about our portfolio management system. 
                  We are here to help you streamline your institutions portfolio process.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center space-x-4 p-4 bg-[#0F172A] rounded-xl border border-[#1E293B] hover:border-[#38BDF8]/30 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1D4ED8]/20 to-[#38BDF8]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#38BDF8]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#38BDF8] transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8"
            >
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactFormData.name}
                    onChange={handleContactInputChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactFormData.email}
                    onChange={handleContactInputChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={contactFormData.subject}
                    onChange={handleContactInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div ref={el => addToRefs(el, formElementsRef)}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactFormData.message}
                    onChange={handleContactInputChange}
                    required
                    rows={5}
                    placeholder="Tell us about your inquiry..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#38BDF8] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#1D4ED8]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <p className="text-green-400 text-center">✅ Thank you for your message! We will get back to you soon.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-center">❌ There was an error sending your message. Please try again.</p>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}