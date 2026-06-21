/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Palette,
  Plus,
  Trash2,
  Upload,
  Link,
  X,
  DollarSign,
  Network,
  Briefcase as BriefcaseIcon,
  Store,
  Code2,
  Award,
  Rocket,
  Star,
  Clock,
} from 'lucide-react';
import { PartnerBenefitsCards } from '@/components/landing/PartnerBenefitsCards'; 
import { PartnerWhyChoose } from '@/components/landing/PartnerWhyChoose'; 
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

// Partner Types
const partnerTypes = [
  { value: 'institute', label: 'Institute', icon: Building2 },
  { value: 'bd', label: 'Business Development (BD)', icon: TrendingUp },
  { value: 'marketing_firm', label: 'Marketing Firm', icon: Network },
  { value: 'investor', label: 'Investor', icon: DollarSign },
  { value: 'software_house', label: 'Software House', icon: BriefcaseIcon },
  { value: 'other', label: 'Other', icon: Store },
];

// Developer Specializations
const developerSpecializations = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'WordPress Developer',
  'Shopify Developer',
  'React/Next.js Specialist',
  'UI/UX Developer',
  'Mobile App Developer',
  'E-commerce Developer',
  'CMS Developer',
  'Other'
];

// Experience Levels
const experienceLevels = [
  'Fresher (0-1 years)',
  'Junior (1-3 years)',
  'Intermediate (3-5 years)',
  'Senior (5-8 years)',
  'Expert (8+ years)'
];

// Skills Options
const skillOptions = [
  'HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 
  'Node.js', 'Python', 'PHP', 'Laravel', 'WordPress', 
  'Shopify', 'MongoDB', 'MySQL', 'Tailwind CSS', 'Bootstrap',
  'GraphQL', 'REST API', 'Git', 'Figma to Code'
];

interface PartnerFormData {
  id: string;
  partnerType: string;
  otherDomain: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  links: string[];
  proposalFile: File | null;
  cvFile: File | null;
  proposalFileName: string;
  cvFileName: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

interface DesignerFormData {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  company: string;
  specialization: string;
  experience: string;
  portfolio: string;
  cvFile: File | null;
  cvFileName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface DeveloperFormData {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  specialization: string;
  experience: string;
  skills: string[];
  portfolio: string;
  cvFile: File | null;
  cvFileName: string;
  bio: string;
  location: string;
  bankAccountDetails: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PartnerSectionProps {
  onPartnerSubmit?: (data: PartnerFormData) => void;
  onDesignerSubmit?: (data: DesignerFormData) => void;
  onDeveloperSubmit?: (data: DeveloperFormData) => void;
}

const countries = [
  'Pakistan', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Saudi Arabia',
  'India', 'Bangladesh', 'Malaysia', 'Singapore', 'Germany', 'France',
  'Turkey', 'Egypt', 'South Africa', 'Other'
];

const specializations = [
  'UI/UX Design',
  'Graphic Design',
  'Web Design',
  'Portfolio Design',
  'Brand Identity',
  'Motion Graphics',
  'Illustration',
  'Other'
];

// Benefits data
const partnershipBenefits = [
  { 
    icon: Handshake, 
    title: "Strategic Collaboration", 
    description: "Work with us to shape the future of educational technology.",
    color: "#E8CA5E",
    details: ["Co-branding opportunities", "Joint marketing campaigns", "Product feedback sessions", "Revenue sharing"]
  },
  { 
    icon: TrendingUp, 
    title: "Growth Opportunities", 
    description: "Access to a growing network of institutions worldwide.",
    color: "#00E0FF",
    details: ["Lead generation", "Cross-promotion", "Referral programs", "International exposure"]
  },
  { 
    icon: Shield, 
    title: "Priority Support", 
    description: "Dedicated support team for all your needs.",
    color: "#1F4381",
    details: ["24/7 support", "Dedicated account manager", "Technical consultation", "Onboarding assistance"]
  },
  { 
    icon: Zap, 
    title: "Early Access", 
    description: "Get early access to new features and products.",
    color: "#E8CA5E",
    details: ["Beta program access", "Feature previews", "Product roadmap insights", "Testing opportunities"]
  },
  { 
    icon: BarChart3, 
    title: "Analytics Dashboard", 
    description: "Comprehensive insights into your performance.",
    color: "#00E0FF",
    details: ["Real-time metrics", "Custom reports", "Performance tracking", "Data visualization"]
  },
  { 
    icon: Globe, 
    title: "Global Reach", 
    description: "Connect with institutions across the globe.",
    color: "#1F4381",
    details: ["International exposure", "Global partnerships", "Cross-border opportunities", "Multi-language support"]
  }
];

export default function PartnerSection({ onPartnerSubmit, onDesignerSubmit, onDeveloperSubmit }: PartnerSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeForm, setActiveForm] = useState<'partner' | 'designer' | 'developer'>('partner');
  
  // Partner Form State
  const [formData, setFormData] = useState<PartnerFormData>({
    id: '',
    partnerType: '',
    otherDomain: '',
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    links: [''],
    proposalFile: null,
    cvFile: null,
    proposalFileName: '',
    cvFileName: '',
    submittedAt: '',
    status: 'pending'
  });
  
  // Designer Form State
  const [designerForm, setDesignerForm] = useState<DesignerFormData>({
    id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    specialization: '',
    experience: '',
    portfolio: '',
    cvFile: null,
    cvFileName: '',
    submittedAt: '',
    status: 'pending'
  });

  // Developer Form State
  const [developerForm, setDeveloperForm] = useState<DeveloperFormData>({
    id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    specialization: '',
    experience: '',
    skills: [],
    portfolio: '',
    cvFile: null,
    cvFileName: '',
    bio: '',
    location: '',
    bankAccountDetails: '',
    submittedAt: '',
    status: 'pending'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Theme colors - unified background
  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#F5F5F5';
  const getCardBg = () => theme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.4)';
  const getBorderColor = () => theme === 'dark' ? 'rgba(30, 41, 59, 0.2)' : 'rgba(0, 0, 0, 0.04)';
  const getTextColor = () => theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const getTextSecondary = () => theme === 'dark' ? '#D1D5DB' : '#4B5563';
  const getTextMuted = () => theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const getAccentColor = () => theme === 'dark' ? '#E8CA5E' : '#00A0FF';
  const getInputBg = () => theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : 'rgba(245, 245, 245, 0.8)';
  const getButtonBg = () => theme === 'dark' ? '#E8CA5E' : '#00A0FF';
  const getButtonText = () => theme === 'dark' ? '#1F4381' : '#FFFFFF';

  // Get category content
  const getCategoryContent = () => {
    if (activeForm === 'partner') {
      return {
        title: 'Why Partner With Us?',
        description: "We're building the future of educational technology, and we're looking for passionate partners who share our vision. Together, we can create meaningful impact in education.",
        benefits: [
          { icon: Handshake, text: "Strategic collaboration with industry leaders", color: "#E8CA5E" },
          { icon: TrendingUp, text: "Revenue sharing and growth opportunities", color: "#00E0FF" },
          { icon: Shield, text: "Priority support and dedicated resources", color: "#1F4381" },
          { icon: Users, text: "Access to 500+ educational institutions", color: "#E8CA5E" },
          { icon: Award, text: "Industry recognition and credibility", color: "#00E0FF" },
          { icon: Rocket, text: "Co-create innovative solutions", color: "#1F4381" }
        ],
        quote: "Join us in transforming how institutions manage and showcase student portfolios. Be part of a movement that celebrates student achievement."
      };
    } else if (activeForm === 'designer') {
      return {
        title: 'Why Become a Designer?',
        description: "Join our creative community of designers and template creators. Showcase your talent, earn revenue, and help institutions build beautiful portfolios.",
        benefits: [
          { icon: Palette, text: "Creative freedom and artistic expression", color: "#EC4899" },
          { icon: Award, text: "Competitive revenue sharing (up to 60%)", color: "#8B5CF6" },
          { icon: Globe, text: "Global exposure and portfolio showcase", color: "#EC4899" },
          { icon: Users, text: "Direct client access and feedback", color: "#8B5CF6" },
          { icon: Star, text: "Featured designer spotlight", color: "#EC4899" },
          { icon: Rocket, text: "Early access to new design tools", color: "#8B5CF6" }
        ],
        quote: "Design templates that power educational institutions worldwide. Your creativity shapes how institutions present themselves."
      };
    } else {
      return {
        title: 'Why Become a Developer?',
        description: "Join our developer community! Get paid for building templates from approved designs. Work on exciting projects and earn competitive revenue sharing.",
        benefits: [
          { icon: Code2, text: "70% Revenue Share on every template sale", color: "#3B82F6" },
          { icon: Clock, text: "Flexible work schedule - work on your terms", color: "#60A5FA" },
          { icon: Globe, text: "Global exposure to international clients", color: "#3B82F6" },
          { icon: Shield, text: "Dedicated technical support and mentorship", color: "#60A5FA" },
          { icon: DollarSign, text: "Early payments and milestone bonuses", color: "#3B82F6" },
          { icon: Rocket, text: "Exciting project assignments and challenges", color: "#60A5FA" },
          { icon: Users, text: "Community of 100+ experienced developers", color: "#3B82F6" },
          { icon: Award, text: "Recognition and performance rewards", color: "#60A5FA" }
        ],
        quote: "Build templates that make a difference. Every line of code you write helps institutions showcase student achievements."
      };
    }
  };

  const categoryContent = getCategoryContent();

  const getInputStyle = () => ({
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    backgroundColor: getInputBg(),
    border: `1px solid ${getBorderColor()}`,
    color: getTextColor(),
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: "'Calibri Light', sans-serif",
  });

  const getInputHoverStyle = {
    borderColor: getAccentColor(),
  };

  // Partner Form Handlers
  const addLinkField = () => {
    if (formData.links.length < 7) {
      setFormData(prev => ({ ...prev, links: [...prev.links, ''] }));
    }
  };

  const removeLinkField = (index: number) => {
    if (formData.links.length > 1) {
      setFormData(prev => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index)
      }));
    }
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'proposal' | 'cv', isDesigner: boolean = false, isDeveloper: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('File size must be less than 20MB');
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF, DOC, DOCX, JPG, or PNG files only');
      return;
    }

    if (isDeveloper) {
      setDeveloperForm(prev => ({ ...prev, cvFile: file, cvFileName: file.name }));
    } else if (isDesigner) {
      setDesignerForm(prev => ({ ...prev, cvFile: file, cvFileName: file.name }));
    } else {
      if (type === 'proposal') {
        setFormData(prev => ({ ...prev, proposalFile: file, proposalFileName: file.name }));
      } else {
        setFormData(prev => ({ ...prev, cvFile: file, cvFileName: file.name }));
      }
    }
  };

  const removeFile = (type: 'proposal' | 'cv', isDesigner: boolean = false, isDeveloper: boolean = false) => {
    if (isDeveloper) {
      setDeveloperForm(prev => ({ ...prev, cvFile: null, cvFileName: '' }));
    } else if (isDesigner) {
      setDesignerForm(prev => ({ ...prev, cvFile: null, cvFileName: '' }));
    } else {
      if (type === 'proposal') {
        setFormData(prev => ({ ...prev, proposalFile: null, proposalFileName: '' }));
      } else {
        setFormData(prev => ({ ...prev, cvFile: null, cvFileName: '' }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDesignerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDesignerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDeveloperChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDeveloperForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setDeveloperForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const validLinks = formData.links.filter(link => link.trim() !== '');
      let proposalBase64 = '';
      let cvBase64 = '';

      if (formData.proposalFile) proposalBase64 = await fileToBase64(formData.proposalFile);
      if (formData.cvFile) cvBase64 = await fileToBase64(formData.cvFile);

      const newPartner: any = {
        id: `PART-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        partnerType: formData.partnerType,
        otherDomain: formData.partnerType === 'other' ? formData.otherDomain : null,
        organizationName: formData.organizationName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        message: formData.message,
        links: validLinks,
        proposalFile: proposalBase64,
        proposalFileName: formData.proposalFileName,
        cvFile: cvBase64,
        cvFileName: formData.cvFileName,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed');
      
      if (onPartnerSubmit) onPartnerSubmit(newPartner);
      
      setSuccessMessage('Partnership application submitted successfully! Our team will contact you within 48 hours.');
      setSubmitStatus('success');
      setShowSuccessModal(true);
      
      setFormData({
        id: '',
        partnerType: '',
        otherDomain: '',
        organizationName: '',
        contactPerson: '',
        email: '',
        phone: '',
        country: '',
        message: '',
        links: [''],
        proposalFile: null,
        cvFile: null,
        proposalFileName: '',
        cvFileName: '',
        submittedAt: '',
        status: 'pending'
      });
      
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      console.error('Partner form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDesignerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      let cvBase64 = '';
      if (designerForm.cvFile) cvBase64 = await fileToBase64(designerForm.cvFile);

      const newDesigner: any = {
        id: `DES-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: designerForm.name,
        email: designerForm.email,
        password: designerForm.password,
        phone: designerForm.phone,
        company: designerForm.company,
        specialization: designerForm.specialization,
        experience: designerForm.experience,
        portfolio: designerForm.portfolio,
        cvFile: cvBase64,
        cvFileName: designerForm.cvFileName,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch('/api/designers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDesigner),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      
      if (onDesignerSubmit) onDesignerSubmit(newDesigner);
      
      setSuccessMessage('Designer registration submitted successfully! Our team will review and approve within 48 hours.');
      setSubmitStatus('success');
      setShowSuccessModal(true);
      
      setDesignerForm({
        id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        company: '',
        specialization: '',
        experience: '',
        portfolio: '',
        cvFile: null,
        cvFileName: '',
        submittedAt: '',
        status: 'pending'
      });
      
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      console.error('Designer form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeveloperSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      let cvBase64 = '';
      if (developerForm.cvFile) cvBase64 = await fileToBase64(developerForm.cvFile);

      const newDeveloper: any = {
        id: `DEV-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: developerForm.name,
        email: developerForm.email,
        password: developerForm.password,
        phone: developerForm.phone,
        companyName: developerForm.companyName,
        specialization: developerForm.specialization,
        experience: developerForm.experience,
        skills: developerForm.skills,
        portfolio: developerForm.portfolio,
        cvFile: cvBase64,
        cvFileName: developerForm.cvFileName,
        bio: developerForm.bio,
        location: developerForm.location,
        bankAccountDetails: developerForm.bankAccountDetails,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch('/api/developers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeveloper),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      
      if (onDeveloperSubmit) onDeveloperSubmit(newDeveloper);
      
      setSuccessMessage('Developer registration submitted successfully! Our team will review and contact you within 48 hours.');
      setSubmitStatus('success');
      setShowSuccessModal(true);
      
      setDeveloperForm({
        id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        companyName: '',
        specialization: '',
        experience: '',
        skills: [],
        portfolio: '',
        cvFile: null,
        cvFileName: '',
        bio: '',
        location: '',
        bankAccountDetails: '',
        submittedAt: '',
        status: 'pending'
      });
      
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      console.error('Developer form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <>
   <Navbar/>
    <section  id="partner-section" ref={sectionRef} className="py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: getBgColor(), fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mt-5 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto w-fit"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
            }}
          >
            <Handshake className="w-3.5 h-3.5 md:w-4 md:h-4"
              style={{ color: getAccentColor() }}
            />
            <span className="text-xs  md:text-sm font-medium tracking-wide"
              style={{ 
                color: getTextMuted(),
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Join Our Network
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-serif tracking-tight">
            <span style={{ color: getTextColor(), fontFamily: "'Poppins', sans-serif" }}>Become a </span>
            <span className="inline-block" style={{ color: getAccentColor(), fontFamily: "'Poppins', sans-serif" }}>
              Partner, Designer or Developer
            </span>
          </h2>
          
          <p className="text-sm md:text-base max-w-2xl mx-auto px-4 font-light tracking-wide"
            style={{ 
              color: getTextMuted(),
              fontFamily: "'Calibri Light', sans-serif",
            }}
          >
            Join our ecosystem of partners, designers, and developers to revolutionize educational portfolio management.
          </p>
        </motion.div>

        {/* Category Selection - 3 Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          <button
            onClick={() => setActiveForm('partner')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
              activeForm === 'partner'
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Building2 className="w-4 h-4" />
            Organization Partner
          </button>
          <button
            onClick={() => setActiveForm('designer')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
              activeForm === 'designer'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Palette className="w-4 h-4" />
            Designer / Template Creator
          </button>
          <button
            onClick={() => setActiveForm('developer')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
              activeForm === 'developer'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Code2 className="w-4 h-4" />
            Developer / Agency
          </button>
        </motion.div>

        {/* Benefits Cards Component */}
        <PartnerBenefitsCards 
          benefits={partnershipBenefits}
          theme={theme}
          isInView={isInView}
        />

        {/* Form Section - Blended Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Side - Why Choose Component */}
          <PartnerWhyChoose
            activeForm={activeForm}
            theme={theme}
            isInView={isInView}
            categoryContent={categoryContent}
          />

          {/* Right Side - Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-xl md:rounded-2xl p-5 md:p-8"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: getAccentColor() }}
                >
                  <FileText className="w-5 h-5 md:w-6 md:h-6" style={{ color: getButtonText() }} />
                </div>
                <h3 className="text-lg md:text-xl font-bold font-serif tracking-tight"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {activeForm === 'partner' && 'Partner Application'}
                  {activeForm === 'designer' && 'Designer Registration'}
                  {activeForm === 'developer' && 'Developer Registration'}
                </h3>
              </div>
              <div className="text-[10px] md:text-xs"
                style={{ 
                  color: getTextMuted(),
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                * Required fields
              </div>
            </div>

            {/* Partner Form */}
            {activeForm === 'partner' && (
              <form onSubmit={handlePartnerSubmit} className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Partner Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {partnerTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <label
                          key={type.value}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                            formData.partnerType === type.value
                              ? 'bg-teal-500/20 border-teal-500'
                              : 'bg-gray-800/50 border-gray-700'
                          } border`}
                          style={{ borderColor: getBorderColor() }}
                        >
                          <input
                            type="radio"
                            name="partnerType"
                            value={type.value}
                            checked={formData.partnerType === type.value}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <Icon className="w-4 h-4" style={{ color: formData.partnerType === type.value ? '#00E0FF' : getTextMuted() }} />
                          <span className="text-xs" style={{ 
                            color: getTextColor(),
                            fontFamily: "'Poppins', sans-serif",
                          }}>{type.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {formData.partnerType === 'other' && (
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Please specify your domain *</label>
                    <input
                      type="text"
                      name="otherDomain"
                      value={formData.otherDomain}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Investor, Consultant, etc."
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your organization name"
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                    style={getInputStyle()}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Contact Person *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    placeholder="Full name of contact person"
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                    style={getInputStyle()}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="contact@organization.com"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                    style={getInputStyle()}
                  >
                    <option value="">Select country</option>
                    {countries.map((country, idx) => (
                      <option key={idx} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Links (Optional - Max 7)</label>
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <div className="relative flex-1">
                        
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => updateLink(index, e.target.value)}
                          placeholder={`Link ${index + 1} (e.g., https://...)`}
                          className="w-full pl-8 pr-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                          style={getInputStyle()}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                          onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                        />
                      </div>
                      {formData.links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLinkField(index)}
                          className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                  {formData.links.length < 7 && (
                    <button
                      type="button"
                      onClick={addLinkField}
                      className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors mt-1"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add another link ({formData.links.length}/7)
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Upload Proposal (Optional - PDF/DOC/IMG, Max 20MB)</label>
                  <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-teal-500 transition-colors"
                    style={{
                      borderColor: getBorderColor(),
                      backgroundColor: getInputBg(),
                    }}
                    onClick={() => document.getElementById('proposalUpload')?.click()}
                  >
                    <input
                      id="proposalUpload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, 'proposal', false)}
                      className="hidden"
                    />
                    {formData.proposalFileName ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-400" />
                          <span className="text-xs" style={{ 
                            color: getTextColor(),
                            fontFamily: "'Calibri Light', sans-serif",
                          }}>{formData.proposalFileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile('proposal', false); }}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6" style={{ color: getTextMuted() }} />
                        <p className="text-xs" style={{ 
                          color: getTextMuted(),
                          fontFamily: "'Calibri Light', sans-serif",
                        }}>Click to upload or drag and drop</p>
                        <p className="text-[10px]" style={{ 
                          color: getTextMuted(),
                          fontFamily: "'Calibri Light', sans-serif",
                        }}>PDF, DOC, DOCX, JPG, PNG up to 20MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Upload CV/Resume (Optional - Max 20MB)</label>
                  <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-teal-500 transition-colors"
                    style={{
                      borderColor: getBorderColor(),
                      backgroundColor: getInputBg(),
                    }}
                    onClick={() => document.getElementById('partnerCvUpload')?.click()}
                  >
                    <input
                      id="partnerCvUpload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, 'cv', false)}
                      className="hidden"
                    />
                    {formData.cvFileName ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-400" />
                          <span className="text-xs" style={{ 
                            color: getTextColor(),
                            fontFamily: "'Calibri Light', sans-serif",
                          }}>{formData.cvFileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile('cv', false); }}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6" style={{ color: getTextMuted() }} />
                        <p className="text-xs" style={{ 
                          color: getTextMuted(),
                          fontFamily: "'Calibri Light', sans-serif",
                        }}>Upload your CV/Resume</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Message / Partnership Interest *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Tell us about your organization and how you'd like to partner with us..."
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                    style={getInputStyle()}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 md:py-3 px-4 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: getButtonBg(),
                    color: getButtonText(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Partnership Request
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Designer Form */}
            {activeForm === 'designer' && (
              <form onSubmit={handleDesignerSubmit} className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={designerForm.name}
                    onChange={handleDesignerChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                    style={getInputStyle()}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={designerForm.email}
                      onChange={handleDesignerChange}
                      required
                      placeholder="designer@example.com"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={designerForm.password}
                      onChange={handleDesignerChange}
                      required
                      placeholder="Create a password"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={designerForm.phone}
                      onChange={handleDesignerChange}
                      required
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Company/Studio (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={designerForm.company}
                      onChange={handleDesignerChange}
                      placeholder="Your company name"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Specialization *</label>
                    <select
                      name="specialization"
                      value={designerForm.specialization}
                      onChange={handleDesignerChange}
                      required
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                    >
                      <option value="">Select specialization</option>
                      {specializations.map((spec, idx) => (
                        <option key={idx} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Experience (Years) *</label>
                    <select
                      name="experience"
                      value={designerForm.experience}
                      onChange={handleDesignerChange}
                      required
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Portfolio Link (Optional)</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={designerForm.portfolio}
                    onChange={handleDesignerChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                    style={getInputStyle()}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Upload CV/Resume (Optional - Max 20MB)</label>
                  <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-teal-500 transition-colors"
                    style={{
                      borderColor: getBorderColor(),
                      backgroundColor: getInputBg(),
                    }}
                    onClick={() => document.getElementById('designerCvUpload')?.click()}
                  >
                    <input
                      id="designerCvUpload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, 'cv', true)}
                      className="hidden"
                    />
                    {designerForm.cvFileName ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-400" />
                          <span className="text-xs" style={{ 
                            color: getTextColor(),
                            fontFamily: "'Calibri Light', sans-serif",
                          }}>{designerForm.cvFileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile('cv', true); }}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6" style={{ color: getTextMuted() }} />
                        <p className="text-xs" style={{ 
                          color: getTextMuted(),
                          fontFamily: "'Calibri Light', sans-serif",
                        }}>Upload your CV/Resume</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 md:py-3 px-4 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: getButtonBg(),
                    color: getButtonText(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      Register as Designer
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Developer Form */}
            {activeForm === 'developer' && (
              <form onSubmit={handleDeveloperSubmit} className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={developerForm.name}
                      onChange={handleDeveloperChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={developerForm.email}
                      onChange={handleDeveloperChange}
                      required
                      placeholder="developer@example.com"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={developerForm.password}
                      onChange={handleDeveloperChange}
                      required
                      placeholder="Create a password"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={developerForm.phone}
                      onChange={handleDeveloperChange}
                      required
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Company Name (Optional)</label>
                    <input
                      type="text"
                      name="companyName"
                      value={developerForm.companyName}
                      onChange={handleDeveloperChange}
                      placeholder="Your company/agency name"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Location (Optional)</label>
                    <input
                      type="text"
                      name="location"
                      value={developerForm.location}
                      onChange={handleDeveloperChange}
                      placeholder="City, Country"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Specialization *</label>
                    <select
                      name="specialization"
                      value={developerForm.specialization}
                      onChange={handleDeveloperChange}
                      required
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                    >
                      <option value="">Select specialization</option>
                      {developerSpecializations.map((spec, idx) => (
                        <option key={idx} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Experience *</label>
                    <select
                      name="experience"
                      value={developerForm.experience}
                      onChange={handleDeveloperChange}
                      required
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                      style={getInputStyle()}
                    >
                      <option value="">Select experience</option>
                      {experienceLevels.map((exp, idx) => (
                        <option key={idx} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Skills *</label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg border" style={{ borderColor: getBorderColor(), backgroundColor: getInputBg() }}>
                    {skillOptions.map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs cursor-pointer transition-all ${
                          developerForm.skills.includes(skill)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        style={{ fontFamily: "'Calibri Light', sans-serif" }}
                      >
                        <input
                          type="checkbox"
                          value={skill}
                          checked={developerForm.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="hidden"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Portfolio/GitHub Link (Optional)</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={developerForm.portfolio}
                    onChange={handleDeveloperChange}
                    placeholder="https://github.com/yourusername or https://yourportfolio.com"
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                    style={getInputStyle()}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Bio / About You (Optional)</label>
                  <textarea
                    name="bio"
                    value={developerForm.bio}
                    onChange={handleDeveloperChange}
                    rows={3}
                    placeholder="Tell us about yourself, your experience, and what kind of projects you're interested in..."
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                    style={getInputStyle()}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Bank Account Details (For Payments - Optional)</label>
                  <textarea
                    name="bankAccountDetails"
                    value={developerForm.bankAccountDetails}
                    onChange={handleDeveloperChange}
                    rows={2}
                    placeholder="Bank name, Account holder name, Account number, IBAN (if applicable)"
                    className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                    style={getInputStyle()}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium mb-1" style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}>Upload CV/Resume (Optional - Max 20MB)</label>
                  <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    style={{
                      borderColor: getBorderColor(),
                      backgroundColor: getInputBg(),
                    }}
                    onClick={() => document.getElementById('developerCvUpload')?.click()}
                  >
                    <input
                      id="developerCvUpload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, 'cv', false, true)}
                      className="hidden"
                    />
                    {developerForm.cvFileName ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-xs" style={{ 
                            color: getTextColor(),
                            fontFamily: "'Calibri Light', sans-serif",
                          }}>{developerForm.cvFileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile('cv', false, true); }}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6" style={{ color: getTextMuted() }} />
                        <p className="text-xs" style={{ 
                          color: getTextMuted(),
                          fontFamily: "'Calibri Light', sans-serif",
                        }}>Upload your CV/Resume</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 md:py-3 px-4 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: '#3B82F6',
                    color: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Register as Developer
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {submitStatus === 'error' && (
              <div className="p-2 md:p-3 rounded-lg flex items-center gap-2 mt-3"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                <p className="text-red-400 text-[10px] md:text-xs" style={{ fontFamily: "'Calibri Light', sans-serif" }}>Failed to submit. Please try again.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="rounded-xl md:rounded-2xl p-5 md:p-8 max-w-md w-full mx-4 text-center animate-scaleIn"
            style={{
              backgroundColor: getCardBg(),
              border: `1px solid ${getBorderColor()}`,
            }}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-3 md:mb-4">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 font-serif"
              style={{ 
                color: getTextColor(),
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {activeForm === 'partner' && 'Application Submitted!'}
              {activeForm === 'designer' && 'Registration Successful!'}
              {activeForm === 'developer' && 'Registration Submitted!'}
            </h3>
            <p className="text-xs md:text-sm mb-4 font-light"
              style={{ 
                color: getTextSecondary(),
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              {successMessage}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-5 py-2 md:px-6 md:py-2 rounded-lg font-semibold text-xs md:text-sm hover:scale-105 transition-transform"
              style={{
                backgroundColor: getButtonBg(),
                color: getButtonText(),
                fontFamily: "'Poppins', sans-serif",
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
   <Footer/>
   </>
  );
}