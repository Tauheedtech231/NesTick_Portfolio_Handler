// components/landing/PartnerSection.tsx
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
  Award,
  Users,
  Sparkles,
  FileText,
  Eye,
  Download
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
  const [recentPartners, setRecentPartners] = useState<PartnerFormData[]>([]);
  const [showRecentModal, setShowRecentModal] = useState(false);

  // Load existing partners from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('partners');
    if (stored) {
      try {
        const partners = JSON.parse(stored);
        setRecentPartners(partners.slice(-5).reverse());
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
    setRecentPartners(partners.slice(-5).reverse());
  };

  const generatePDF = (data: PartnerFormData) => {
    const content = `
      PARTNERSHIP APPLICATION
      =======================
      Application ID: ${data.id}
      Date: ${new Date(data.submittedAt).toLocaleString()}
      
      ORGANIZATION DETAILS
      --------------------
      Organization Name: ${data.organizationName}
      Organization Type: ${data.organizationType}
      Country: ${data.country}
      
      CONTACT PERSON
      --------------
      Name: ${data.contactPerson}
      Email: ${data.email}
      Phone: ${data.phone}
      
      MESSAGE
      -------
      ${data.message}
      
      Status: ${data.status}
    `;
    
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `partner-application-${data.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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

  const stats = [
    { value: "50+", label: "Active Partners", icon: Users },
    { value: "30+", label: "Countries", icon: Globe },
    { value: "500+", label: "Institutions", icon: Building2 },
    { value: "98%", label: "Satisfaction Rate", icon: Award }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#E8CA5E]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#00E0FF]/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#1F4381]/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F4381]/10 border border-[#E8CA5E]/30 backdrop-blur-sm mb-4">
            <Handshake className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E8CA5E]" />
            <span className="text-xs md:text-sm font-medium text-gray-300 font-sans tracking-wide">Join Our Network</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-serif tracking-tight">
            <span className="text-white">Become a </span>
            <span className="bg-gradient-to-r from-[#E8CA5E] via-[#00E0FF] to-[#E8CA5E] bg-clip-text text-transparent animate-gradient">
              Strategic Partner
            </span>
          </h2>
          
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto px-4 font-light tracking-wide">
            Join hands with us to revolutionize educational portfolio management across the globe.
            Together, we can create a lasting impact on millions of students.
          </p>
        </motion.div>

        {/* Stats Section - Mobile Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] rounded-xl md:rounded-2xl p-3 md:p-4 text-center hover:border-[#00E0FF]/30 transition-all duration-300 group"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-[#1F4381]/20 to-[#E8CA5E]/10 flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 md:w-6 md:h-6 text-[#E8CA5E]" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-white font-sans tracking-tight">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-gray-400 font-sans">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Benefits Grid - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
        >
          {partnershipBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-[#00E0FF]/40 hover:shadow-xl hover:shadow-[#00E0FF]/10 transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br from-[#1F4381]/20 to-[#E8CA5E]/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 md:w-7 md:h-7" style={{ color: benefit.color }} />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 font-sans tracking-wide">{benefit.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light">{benefit.description}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Main Form Section - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Side - Partnership Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] rounded-xl md:rounded-2xl p-5 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] flex items-center justify-center">
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-[#1F4381]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white font-serif tracking-tight">Why Partner With Us?</h3>
            </div>

            <div className="space-y-4 md:space-y-6">
              <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light tracking-wide">
                We&apos;re building the future of educational technology, and we&apos;re looking for passionate partners 
                who share our vision. Whether you&apos;re an educational institution, a tech company, or an investor, 
                there&apos;s a place for you in our ecosystem.
              </p>

              <div className="p-4 md:p-5 bg-gradient-to-r from-[#E8CA5E]/10 to-[#00E0FF]/10 border-l-4 border-[#E8CA5E] rounded-r-xl">
                <p className="text-gray-300 text-xs md:text-sm italic leading-relaxed font-light">
                  &quot;Together, we can bridge the gap between traditional education and digital innovation, 
                  making quality portfolio management accessible to every student across the globe.&quot;
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] flex items-center justify-center">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#1F4381]" />
                  </div>
                  <div>
                    <p className="text-[#E8CA5E] text-[10px] md:text-xs font-semibold">Neezamiya Team</p>
                    <p className="text-gray-500 text-[8px] md:text-[10px]">Building the Future of Education</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold text-xs md:text-sm mb-2 md:mb-3 flex items-center gap-2 font-sans">
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#00E0FF]" />
                  Partnership Types:
                </h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {organizationTypes.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 md:px-3 md:py-1.5 rounded-full bg-[#1F4381]/20 border border-[#00E0FF]/20 text-[#00E0FF] text-[10px] md:text-xs font-medium hover:bg-[#1F4381]/40 transition-all duration-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowRecentModal(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-[#1F4381]/20 border border-[#00E0FF]/30 text-[#00E0FF] text-xs md:text-sm font-medium hover:bg-[#1F4381]/40 transition-all duration-300 group"
              >
                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                View Recent Partners
              </button>
            </div>
          </motion.div>

          {/* Right Side - Partner Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] rounded-xl md:rounded-2xl p-5 md:p-8"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-[#00E0FF] to-[#1F4381] flex items-center justify-center">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white font-serif tracking-tight">Partner Application</h3>
              </div>
              <div className="text-[10px] md:text-xs text-gray-500 font-sans">All fields are required *</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-300 mb-1 font-sans tracking-wide">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your organization name"
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-xs md:text-sm focus:outline-none focus:border-[#00E0FF] focus:ring-1 focus:ring-[#00E0FF] transition-all duration-300 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-300 mb-1 font-sans tracking-wide">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  placeholder="Full name of contact person"
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-xs md:text-sm focus:outline-none focus:border-[#00E0FF] focus:ring-1 focus:ring-[#00E0FF] transition-all duration-300 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-medium text-gray-300 mb-1 font-sans tracking-wide">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="contact@organization.com"
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-xs md:text-sm focus:outline-none focus:border-[#00E0FF] focus:ring-1 focus:ring-[#00E0FF] transition-all duration-300 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-medium text-gray-300 mb-1 font-sans tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-xs md:text-sm focus:outline-none focus:border-[#00E0FF] focus:ring-1 focus:ring-[#00E0FF] transition-all duration-300 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-medium text-gray-300 mb-1 font-sans tracking-wide">
                    Organization Type *
                  </label>
                  <select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs md:text-sm focus:outline-none focus:border-[#00E0FF] focus:ring-1 focus:ring-[#00E0FF] transition-all duration-300 font-sans"
                  >
                    <option value="">Select type</option>
                    {organizationTypes.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-medium text-gray-300 mb-1 font-sans tracking-wide">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs md:text-sm focus:outline-none focus:border-[#00E0FF] focus:ring-1 focus:ring-[#00E0FF] transition-all duration-300 font-sans"
                  >
                    <option value="">Select country</option>
                    {countries.map((country, idx) => (
                      <option key={idx} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-300 mb-1 font-sans tracking-wide">
                  Message / Partnership Interest *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Tell us about your organization and how you'd like to partner with us..."
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-xs md:text-sm focus:outline-none focus:border-[#00E0FF] focus:ring-1 focus:ring-[#00E0FF] transition-all duration-300 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] py-2.5 md:py-3 px-4 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#E8CA5E]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group font-sans"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 md:h-4 md:w-4 text-[#1F4381]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <div className="p-2 md:p-3 bg-red-500/10 border border-red-500/30 rounded-lg md:rounded-xl flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400" />
                  <p className="text-red-400 text-[10px] md:text-xs font-sans">Failed to submit. Please try again.</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Modal - Mobile Responsive */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#E8CA5E]/30 rounded-xl md:rounded-2xl p-5 md:p-8 max-w-md w-full mx-4 text-center animate-scaleIn">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-3 md:mb-4">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 font-serif">Application Submitted!</h3>
            <p className="text-gray-400 text-xs md:text-sm mb-4 font-light">
              Thank you for your interest in partnering with Neezamiya. Our team will review your application and contact you within 48 hours.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-5 py-2 md:px-6 md:py-2 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] rounded-lg font-semibold text-xs md:text-sm hover:scale-105 transition-transform font-sans"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Recent Partners Modal - Mobile Responsive */}
      {/* {showRecentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4" onClick={() => setShowRecentModal(false)}>
          <div className="bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#E8CA5E]/30 rounded-xl md:rounded-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] flex items-center justify-center">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-[#1F4381]" />
                </div>
                <h3 className="text-base md:text-xl font-bold text-white font-serif tracking-tight">Recent Partners</h3>
              </div>
              <button
                onClick={() => setShowRecentModal(false)}
                className="p-1.5 md:p-2 rounded-lg hover:bg-[#1E293B] transition-colors"
              >
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] space-y-3 md:space-y-4">
              {recentPartners.length === 0 ? (
                <div className="text-center py-6 md:py-8">
                  <Handshake className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm md:text-base font-light">No partners yet. Be the first to apply!</p>
                </div>
              ) : (
                recentPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-[#0F172A]/50 border border-[#1E293B] rounded-lg md:rounded-xl p-3 md:p-4 hover:border-[#00E0FF]/30 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold text-white text-sm md:text-base font-sans">{partner.organizationName}</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">{partner.organizationType}</p>
                      </div>
                      <span className="text-[8px] md:text-[10px] text-gray-500">{new Date(partner.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-500 mb-2">
                      Contact: {partner.contactPerson} | {partner.email}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400 line-clamp-2">{partner.message}</p>
                    <div className="mt-2 md:mt-3 flex items-center gap-2">
                      <span className={`text-[8px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full ${
                        partner.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        partner.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {partner.status}
                      </span>
                      <button
                        onClick={() => generatePDF(partner)}
                        className="text-[8px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full bg-[#1F4381]/20 text-[#00E0FF] hover:bg-[#1F4381]/40 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-2.5 h-2.5 md:w-3 md:h-3" /> Export
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )} */}

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
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}