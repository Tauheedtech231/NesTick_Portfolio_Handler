/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useRef, useState, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle,
  MessageCircle,
  Sparkles,
  Building2,
  FileText,
  User,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useSearchParams } from "next/navigation";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  designation: string;
  collegeName: string;
  collegeType: string;
  studentCount: string;
  city: string;
  country: string;
  interestedPlan: string;
  requirements: string;
  timeline: string;
  budget: string;
  hearAboutUs: string;
  message: string;
}

// Flip Card Component
function ContactFlipCard({ 
  icon: Icon, 
  label, 
  value, 
  description, 
  href 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  description: string; 
  href?: string | null;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-36 w-full cursor-pointer perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#1E293B] rounded-xl p-4 backface-hidden flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#1D4ED8]/20 to-[#38BDF8]/10 flex items-center justify-center mb-3">
            <Icon className="w-6 h-6 text-[#38BDF8]" />
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">{label}</h3>
          {href ? (
            <a href={href} className="text-white text-sm font-semibold hover:text-[#38BDF8] transition-colors">
              {value}
            </a>
          ) : (
            <p className="text-white text-sm font-semibold">{value}</p>
          )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D4ED8]/10 to-[#38BDF8]/10 border border-[#38BDF8]/30 rounded-xl p-4 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Main Content Component that uses useSearchParams
function ContactContent() {
  const searchParams = useSearchParams();
  const planFromQuery = searchParams.get('plan');
  
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    designation: '',
    collegeName: '',
    collegeType: '',
    studentCount: '',
    city: '',
    country: 'Pakistan',
    interestedPlan: planFromQuery || '',
    requirements: '',
    timeline: '',
    budget: '',
    hearAboutUs: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<'personal' | 'college' | 'requirements'>('personal');
  
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePersonalSection = () => {
    return contactFormData.name && contactFormData.email && contactFormData.phone && contactFormData.designation;
  };

  const validateCollegeSection = () => {
    return contactFormData.collegeName && contactFormData.collegeType && contactFormData.studentCount && contactFormData.city;
  };

  const validateRequirementsSection = () => {
    return contactFormData.interestedPlan && contactFormData.timeline;
  };

  const handleNextSection = () => {
    if (activeSection === 'personal' && validatePersonalSection()) {
      setActiveSection('college');
    } else if (activeSection === 'college' && validateCollegeSection()) {
      setActiveSection('requirements');
    }
  };

  const handlePreviousSection = () => {
    if (activeSection === 'college') {
      setActiveSection('personal');
    } else if (activeSection === 'requirements') {
      setActiveSection('college');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRequirementsSection()) {
      setSubmitStatus('error');
      return;
    }
    
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
        setContactFormData({
          name: '',
          email: '',
          phone: '',
          designation: '',
          collegeName: '',
          collegeType: '',
          studentCount: '',
          city: '',
          country: 'Pakistan',
          interestedPlan: '',
          requirements: '',
          timeline: '',
          budget: '',
          hearAboutUs: '',
          message: ''
        });
        setActiveSection('personal');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { 
      icon: Phone, 
      label: "Phone", 
      value: "+92 319 3236529", 
      href: "tel:+923193236529",
      description: "Available Mon-Fri, 9AM-6PM"
    },
    { 
      icon: Mail, 
      label: "Email", 
      value: "support@portfoliohandler.com", 
      href: "mailto:support@portfoliohandler.com",
      description: "We reply within 24 hours"
    },
    { 
      icon: MapPin, 
      label: "Office", 
      value: "Daska, Pakistan", 
      href: null,
      description: "Serving globally from Daska"
    },
    { 
      icon: Clock, 
      label: "Business Hours", 
      value: "Monday - Friday", 
      href: null,
      description: "9:00 AM - 6:00 PM (PKT)"
    },
  ];

  const fromBottomVariants: Variants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 12,
        duration: 0.7,
      },
    },
  };

  const fadeInRightVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen mt-[3rem] bg-[#0B0F19]">
        {/* Hero Section */}
        <section className="relative min-h-[35vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#0B0F19]">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fromBottomVariants}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-20 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-xs font-medium text-gray-300">Contact Sales</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Let&apos;s Discuss Your{' '}
                <span className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
                  Requirements
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                Fill out the form below and our sales team will get back to you within 24 hours with a customized solution.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-center mb-2"
              >
                <a
                  href="https://wa.me/923193236529?text=Hello%2C%20I%20want%20to%20discuss%20my%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                  <span className="text-sm opacity-80">→</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section ref={sectionRef} className="py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F19]">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeInRightVariants}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 md:p-8"
            >
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection('personal')}
                    className={`flex-1 text-center pb-3 border-b-2 transition-all duration-200 ${
                      activeSection === 'personal' 
                        ? 'border-[#38BDF8] text-[#38BDF8]' 
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    <span className="text-sm font-medium">Personal Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => activeSection !== 'personal' && setActiveSection('college')}
                    className={`flex-1 text-center pb-3 border-b-2 transition-all duration-200 ${
                      activeSection === 'college' 
                        ? 'border-[#38BDF8] text-[#38BDF8]' 
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 inline mr-2" />
                    <span className="text-sm font-medium">College Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => activeSection !== 'personal' && activeSection !== 'college' && setActiveSection('requirements')}
                    className={`flex-1 text-center pb-3 border-b-2 transition-all duration-200 ${
                      activeSection === 'requirements' 
                        ? 'border-[#38BDF8] text-[#38BDF8]' 
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    <span className="text-sm font-medium">Requirements</span>
                  </button>
                </div>
                
                <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] transition-all duration-500 rounded-full"
                    style={{ 
                      width: activeSection === 'personal' ? '33.33%' : activeSection === 'college' ? '66.66%' : '100%' 
                    }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="w-full">
                {/* Personal Information Section */}
                {activeSection === 'personal' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={contactFormData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Designation <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="designation"
                          value={contactFormData.designation}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Principal, IT Head"
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={contactFormData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email address"
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={contactFormData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., +92 300 1234567"
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* College Information Section */}
                {activeSection === 'college' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          College/Institute Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="collegeName"
                          value={contactFormData.collegeName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your college/institute name"
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          College Type <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="collegeType"
                          value={contactFormData.collegeType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        >
                          <option value="">Select type</option>
                          <option value="University">University</option>
                          <option value="College">College</option>
                          <option value="Institute">Institute</option>
                          <option value="School">School</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Number of Students <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="studentCount"
                          value={contactFormData.studentCount}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        >
                          <option value="">Select range</option>
                          <option value="Less than 500">Less than 500</option>
                          <option value="500 - 1,000">500 - 1,000</option>
                          <option value="1,000 - 5,000">1,000 - 5,000</option>
                          <option value="5,000 - 10,000">5,000 - 10,000</option>
                          <option value="More than 10,000">More than 10,000</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          City <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={contactFormData.city}
                          onChange={handleInputChange}
                          required
                          placeholder="City"
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={contactFormData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Requirements Section */}
                {activeSection === 'requirements' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Interested Plan <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="interestedPlan"
                          value={contactFormData.interestedPlan}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        >
                          <option value="">Select plan</option>
                          <option value="Basic">Basic</option>
                          <option value="Most Featured">Most Featured</option>
                          <option value="Premium">Premium</option>
                          <option value="Custom">Custom Enterprise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expected Timeline <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="timeline"
                          value={contactFormData.timeline}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                        >
                          <option value="">Select timeline</option>
                          <option value="Immediate">Immediate (ASAP)</option>
                          <option value="1-3 months">1-3 months</option>
                          <option value="3-6 months">3-6 months</option>
                          <option value="6-12 months">6-12 months</option>
                          <option value="Planning stage">Just planning</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specific Requirements
                      </label>
                      <textarea
                        name="requirements"
                        value={contactFormData.requirements}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about your specific needs..."
                        className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Message
                      </label>
                      <textarea
                        name="message"
                        value={contactFormData.message}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Any other information you'd like to share..."
                        className="w-full px-4 py-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  {activeSection !== 'personal' && (
                    <button
                      type="button"
                      onClick={handlePreviousSection}
                      className="px-8 py-3 rounded-lg bg-[#1E293B] text-white font-medium text-sm hover:bg-[#2D3A52] transition-all duration-200"
                    >
                      Previous
                    </button>
                  )}
                  
                  {activeSection !== 'requirements' ? (
                    <button
                      type="button"
                      onClick={handleNextSection}
                      className="flex-1 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-[1.02]"
                    >
                      Next <ArrowRight className="w-4 h-4 inline ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>Submit Request <Send className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-sm">Thank you! Our team will contact you within 24 hours.</p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm">Failed to submit. Please try again.</p>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {contactInfo.map((item, index) => (
                <ContactFlipCard key={index} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Google Map */}
        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden">
              <div className="h-[400px] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54436.77164929107!2d74.12957351460726!3d32.32371256198378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f17e2b03d6d0d%3A0x8e6f0b5c9e2a5b1d!2sDaska%2C%20Sialkot%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                  title="Portfolio Handler Location"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </>
  );
}

// Main exported component with Suspense
export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}