'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Handshake, 
  Building2, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Globe,
  Send,
  CheckCircle,
  XCircle,
  Users,
  Sparkles,
  FileText,
} from 'lucide-react';

interface PartnerFormData {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  organizationType: string;
  country: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

interface PartnerSectionProps {
  onPartnerSubmit?: (data: PartnerFormData) => void;
}

const organizationTypes = [
  'Educational Institution',
  'Tech Company',
  'Investment Firm',
  'NGO',
  'Government Body',
  'Media Partner',
  'Research Organization',
  'Other'
];

const countries = [
  'Pakistan', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Saudi Arabia',
  'India', 'Bangladesh', 'Malaysia', 'Singapore', 'Germany', 'France',
  'Turkey', 'Egypt', 'South Africa', 'Other'
];

export function PartnerSection({ onPartnerSubmit }: PartnerSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [formData, setFormData] = useState<PartnerFormData>({
    id: '',
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    organizationType: '',
    country: '',
    message: '',
    submittedAt: '',
    status: 'pending'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  // Load existing partners from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('partners');
    if (stored) {
      try {
        const partners = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading partners:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveToLocalStorage = (data: PartnerFormData) => {
    const existing = localStorage.getItem('partners');
    let partners: PartnerFormData[] = [];
    
    if (existing) {
      try {
        partners = JSON.parse(existing);
      } catch (error) {
        console.error('Error parsing partners:', error);
      }
    }
    
    partners.unshift(data);
    localStorage.setItem('partners', JSON.stringify(partners));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const newPartner: PartnerFormData = {
        ...formData,
        id: `PART-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      saveToLocalStorage(newPartner);
      
      if (onPartnerSubmit) {
        onPartnerSubmit(newPartner);
      }
      
      setSubmitStatus('success');
      setShowSuccessModal(true);
      
      setFormData({
        id: '',
        organizationName: '',
        contactPerson: '',
        email: '',
        phone: '',
        organizationType: '',
        country: '',
        message: '',
        submittedAt: '',
        status: 'pending'
      });
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 5000);
      
    } catch (error) {
      console.error('Partner form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnershipBenefits = [
    { icon: Handshake, title: "Strategic Collaboration", description: "Work with us to shape the future of educational technology", color: "#E8CA5E" },
    { icon: TrendingUp, title: "Growth Opportunities", description: "Access to a growing network of institutions worldwide", color: "#00E0FF" },
    { icon: Shield, title: "Priority Support", description: "Dedicated support team for all your needs", color: "#1F4381" },
    { icon: Zap, title: "Early Access", description: "Get early access to new features and products", color: "#E8CA5E" },
    { icon: BarChart3, title: "Analytics Dashboard", description: "Comprehensive insights into your performance", color: "#00E0FF" },
    { icon: Globe, title: "Global Reach", description: "Connect with institutions across the globe", color: "#1F4381" }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{
        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
      }}
    >
      {/* Blended Background - No visible borders */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-3xl opacity-15"
          style={{
            backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
          }}
        />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-3xl opacity-15"
          style={{
            backgroundColor: theme === 'dark' ? '#00E0FF' : '#00A0FF',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full blur-3xl opacity-10"
          style={{
            backgroundColor: theme === 'dark' ? '#1F4381' : '#00A0FF',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto w-fit"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.1)',
              border: 'none',
            }}
          >
            <Handshake className="w-3.5 h-3.5 md:w-4 md:h-4"
              style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
            />
            <span className="text-xs md:text-sm font-medium font-sans tracking-wide"
              style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
            >
              Join Our Network
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-serif tracking-tight">
            <span className="text-white">Become a </span>
            <span className="inline-block"
              style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
            >
              Strategic Partner
            </span>
          </h2>
          
          <p className="text-sm md:text-base max-w-2xl mx-auto px-4 font-light tracking-wide"
            style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
          >
            Join hands with us to revolutionize educational portfolio management across the globe.
            Together, we can create a lasting impact on millions of students.
          </p>
        </motion.div>

        {/* Benefits Grid - Stats removed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
        >
          {partnershipBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Smooth gradient overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${benefit.color}15, transparent 70%)`,
                  }}
                />
                
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.1)',
                    }}
                  >
                    <Icon className="w-5 h-5 md:w-7 md:h-7" style={{ color: benefit.color }} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 font-sans tracking-wide"
                    style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed font-light"
                    style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Main Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Side - Partnership Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="rounded-xl md:rounded-2xl p-5 md:p-8"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              border: '1px solid',
              borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                }}
              >
                <Building2 className="w-5 h-5 md:w-6 md:h-6"
                  style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }}
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold font-serif tracking-tight"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                Why Partner With Us?
              </h3>
            </div>

            <div className="space-y-4 md:space-y-6">
              <p className="text-sm md:text-base leading-relaxed font-light tracking-wide"
                style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
              >
                We&lsquo;re building the future of educational technology, and we&lsquo;re looking for passionate partners 
                who share our vision. Whether you&lsquo;re an educational institution, a tech company, or an investor, 
                there&apos;s a place for you in our ecosystem.
              </p>

              <div className="p-4 md:p-5 rounded-r-xl"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.1)' : 'rgba(0, 160, 255, 0.05)',
                  borderLeft: `4px solid ${theme === 'dark' ? '#E8CA5E' : '#00A0FF'}`,
                }}
              >
                <p className="text-xs md:text-sm italic leading-relaxed font-light"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  &quot;Together, we can bridge the gap between traditional education and digital innovation, 
                  making quality portfolio management accessible to every student across the globe.&quot;
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                    }}
                  >
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4"
                      style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-semibold"
                      style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                    >
                      Neezamiya Team
                    </p>
                    <p className="text-[8px] md:text-[10px]"
                      style={{ color: theme === 'dark' ? '#6B7280' : '#9CA3AF' }}
                    >
                      Building the Future of Education
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3 flex items-center gap-2 font-sans"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4"
                    style={{ color: theme === 'dark' ? '#00E0FF' : '#00A0FF' }}
                  />
                  Partnership Types:
                </h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {organizationTypes.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium transition-all duration-300"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.1)',
                        color: theme === 'dark' ? '#00E0FF' : '#00A0FF',
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Partner Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-xl md:rounded-2xl p-5 md:p-8"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              border: '1px solid',
              borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: theme === 'dark' ? '#00E0FF' : '#00A0FF',
                  }}
                >
                  <FileText className="w-5 h-5 md:w-6 md:h-6"
                    style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold font-serif tracking-tight"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  Partner Application
                </h3>
              </div>
              <div className="text-[10px] md:text-xs font-sans"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              >
                All fields are required *
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-[10px] md:text-xs font-medium mb-1 font-sans tracking-wide"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your organization name"
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 transition-all duration-300 font-sans placeholder:text-gray-500"
                  style={{
                    backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                    borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                    borderWidth: '1px',
                    color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  }}
                />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-medium mb-1 font-sans tracking-wide"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  placeholder="Full name of contact person"
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 transition-all duration-300 font-sans placeholder:text-gray-500"
                  style={{
                    backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                    borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                    borderWidth: '1px',
                    color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1 font-sans tracking-wide"
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="contact@organization.com"
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 transition-all duration-300 font-sans placeholder:text-gray-500"
                    style={{
                      backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                      borderWidth: '1px',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1 font-sans tracking-wide"
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 transition-all duration-300 font-sans placeholder:text-gray-500"
                    style={{
                      backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                      borderWidth: '1px',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1 font-sans tracking-wide"
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    Organization Type *
                  </label>
                  <select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 transition-all duration-300 font-sans"
                    style={{
                      backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                      borderWidth: '1px',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    }}
                  >
                    <option value="">Select type</option>
                    {organizationTypes.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1 font-sans tracking-wide"
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 transition-all duration-300 font-sans"
                    style={{
                      backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                      borderWidth: '1px',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    }}
                  >
                    <option value="">Select country</option>
                    {countries.map((country, idx) => (
                      <option key={idx} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-medium mb-1 font-sans tracking-wide"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  Message / Partnership Interest *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Tell us about your organization and how you'd like to partner with us..."
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 transition-all duration-300 resize-none font-sans placeholder:text-gray-500"
                  style={{
                    backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                    borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                    borderWidth: '1px',
                    color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 md:py-3 px-4 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group font-sans"
                style={{
                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                  color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Partnership Request
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {submitStatus === 'error' && (
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400" />
                  <p className="text-red-400 text-[10px] md:text-xs font-sans">Failed to submit. Please try again.</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="rounded-xl md:rounded-2xl p-5 md:p-8 max-w-md w-full mx-4 text-center animate-scaleIn"
            style={{
              backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
              border: '1px solid',
              borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 160, 255, 0.3)',
            }}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-3 md:mb-4">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 font-serif"
              style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
            >
              Application Submitted!
            </h3>
            <p className="text-xs md:text-sm mb-4 font-light"
              style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
            >
              Thank you for your interest in partnering with Neezamiya. Our team will review your application and contact you within 48 hours.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-5 py-2 md:px-6 md:py-2 rounded-lg font-semibold text-xs md:text-sm hover:scale-105 transition-transform font-sans"
              style={{
                backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}