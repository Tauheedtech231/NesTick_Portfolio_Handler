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
  User,
  Briefcase,
  Megaphone,
  Target,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Globe as GlobeIcon,
} from 'lucide-react';
import { PartnerBenefitsCards } from '@/components/landing/PartnerBenefitsCards'; 
import { PartnerWhyChoose } from '@/components/landing/PartnerWhyChoose'; 
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import  ContactSection  from './ContactSection';

// 5 Partner Types - Only Business Developer is Gold, rest Blue
const partnerTypes = [
  { value: 'designer', label: 'Designer', icon: Palette, color: '#0066FF' },
  { value: 'developer', label: 'Developer', icon: Code2, color: '#0066FF' },
  { value: 'business_dev', label: 'Business Developer', icon: TrendingUp, color: '#E8CA5E' }, // ← GOLD
  { value: 'marketing_agency', label: 'Marketing Agency', icon: Megaphone, color: '#0066FF' },
  { value: 'sales', label: 'Sales Person', icon: Target, color: '#0066FF' },
];

// Benefits data for each partner type - Dynamic colors based on active tab
const partnerBenefitsMap = {
  designer: [
    { icon: Palette, title: "Creative Freedom", description: "Express your artistic vision without limits." },
    { icon: Award, title: "60% Revenue Share", description: "Earn competitive commissions on every sale." },
    { icon: Globe, title: "Global Exposure", description: "Showcase your work to institutions worldwide." },
    { icon: Users, title: "Direct Client Access", description: "Connect and collaborate with clients directly." },
    { icon: Star, title: "Featured Spotlight", description: "Get highlighted as a top designer." },
    { icon: Rocket, title: "Early Access", description: "Be the first to try new design tools." },
  ],
  developer: [
    { icon: Code2, title: "70% Revenue Share", description: "Highest commission rate on template sales." },
    { icon: Clock, title: "Flexible Schedule", description: "Work on your own terms and timeline." },
    { icon: Globe, title: "Global Clients", description: "Access to international client base." },
    { icon: Shield, title: "Technical Support", description: "Dedicated mentorship and support team." },
    { icon: DollarSign, title: "Early Payments", description: "Get paid faster with milestone bonuses." },
    { icon: Users, title: "Developer Community", description: "Join 100+ experienced developers." },
  ],
  business_dev: [
    { icon: Handshake, title: "Strategic Partnership", description: "Build long-term business relationships." },
    { icon: TrendingUp, title: "Growth Potential", description: "Access to 500+ educational institutions." },
    { icon: DollarSign, title: "Attractive Commission", description: "Earn recurring revenue from referrals." },
    { icon: Users, title: "Wide Network", description: "Connect with industry leaders and influencers." },
    { icon: Award, title: "Industry Recognition", description: "Become a trusted partner in EdTech." },
    { icon: Rocket, title: "Co-creation", description: "Shape the future of educational technology." },
  ],
  marketing_agency: [
    { icon: Megaphone, title: "Marketing Reach", description: "Access to a growing market of institutions." },
    { icon: Users, title: "Client Base", description: "Connect with schools, colleges, and universities." },
    { icon: DollarSign, title: "Lucrative Commissions", description: "Earn competitive referral commissions." },
    { icon: Globe, title: "Global Presence", description: "Expand your agency's footprint worldwide." },
    { icon: Shield, title: "Priority Support", description: "Get dedicated account management." },
    { icon: Award, title: "Agency Recognition", description: "Be featured as a preferred marketing partner." },
  ],
  sales: [
    { icon: Target, title: "Sales Commission", description: "Earn up to 40% commission on sales." },
    { icon: Users, title: "Lead Generation", description: "Access to quality leads and prospects." },
    { icon: DollarSign, title: "Recurring Income", description: "Build a steady stream of recurring revenue." },
    { icon: Award, title: "Performance Bonuses", description: "Earn additional bonuses for top performance." },
    { icon: Rocket, title: "Fast Track Growth", description: "Rapid career advancement opportunities." },
    { icon: Globe, title: "Global Opportunities", description: "Work with institutions across the world." },
  ],
};

// Form interfaces
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

interface BusinessDevFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  experience: string;
  region: string;
  linkedin: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface MarketingAgencyFormData {
  id: string;
  agencyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  services: string;
  teamSize: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SalesPersonFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  experience: string;
  region: string;
  salesTarget: string;
  message: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PartnerSectionProps {
  onPartnerSubmit?: (data: any) => void;
}

// Form field options
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

const experienceLevels = [
  'Fresher (0-1 years)',
  'Junior (1-3 years)',
  'Intermediate (3-5 years)',
  'Senior (5-8 years)',
  'Expert (8+ years)'
];

const skillOptions = [
  'HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 
  'Node.js', 'Python', 'PHP', 'Laravel', 'WordPress', 
  'Shopify', 'MongoDB', 'MySQL', 'Tailwind CSS', 'Bootstrap',
  'GraphQL', 'REST API', 'Git', 'Figma to Code'
];

const regions = [
  'North America',
  'South America',
  'Europe',
  'Middle East',
  'Asia Pacific',
  'Africa',
  'Global'
];

const teamSizes = [
  '1-5',
  '6-10',
  '11-20',
  '21-50',
  '50+'
];

const servicesList = [
  'Digital Marketing',
  'Social Media Management',
  'Content Marketing',
  'SEO/SEM',
  'Brand Strategy',
  'Web Development',
  'Graphic Design',
  'Video Production',
  'Email Marketing',
  'Other'
];

export default function PartnerSection({ onPartnerSubmit }: PartnerSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeForm, setActiveForm] = useState<'designer' | 'developer' | 'business_dev' | 'marketing_agency' | 'sales'>('designer');
  
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

  // Business Dev Form State
  const [businessDevForm, setBusinessDevForm] = useState<BusinessDevFormData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    experience: '',
    region: '',
    linkedin: '',
    message: '',
    submittedAt: '',
    status: 'pending'
  });

  // Marketing Agency Form State
  const [marketingForm, setMarketingForm] = useState<MarketingAgencyFormData>({
    id: '',
    agencyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    services: '',
    teamSize: '',
    message: '',
    submittedAt: '',
    status: 'pending'
  });

  // Sales Form State
  const [salesForm, setSalesForm] = useState<SalesPersonFormData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    experience: '',
    region: '',
    salesTarget: '',
    message: '',
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

  // INSAAN: FIXED - isBusinessDev helper with type assertion
  const isBusinessDev = (activeForm as string) === 'business_dev';

  // Get accent color based on active form - FIXED
  const getActiveColor = () => {
    return isBusinessDev ? '#E8CA5E' : '#0066FF';
  };

  const getActiveColorLight = () => {
    return isBusinessDev ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.15)';
  };

  // Get shadow color for benefits cards hover - FIXED
  const getShadowColor = () => {
    return isBusinessDev ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 102, 255, 0.3)';
  };

  // Theme colors
  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#FFFFFF';
  const getCardBg = () => theme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.8)';
  const getBorderColor = () => theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  const getTextColor = () => theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const getTextSecondary = () => theme === 'dark' ? '#D1D5DB' : '#4B5563';
  const getTextMuted = () => theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const getInputBg = () => theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : 'rgba(249, 250, 251, 0.9)';

  // Button background based on active form - FIXED
  const getButtonBg = () => {
    return isBusinessDev ? '#E8CA5E' : '#0066FF';
  };

  const getButtonText = () => '#FFFFFF';

  // Shadow color for benefits - FIXED
  const getShadowColorForBenefits = () => {
    return isBusinessDev ? 'rgba(232, 202, 94, 0.25)' : 'rgba(0, 102, 255, 0.25)';
  };

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
    borderColor: getActiveColor(),
  };

  // Get category content for each partner type
  const getCategoryContent = () => {
    const contentMap = {
      designer: {
        title: 'Why Become a Designer?',
        description: "Join our creative community of designers and template creators. Showcase your talent, earn revenue, and help institutions build beautiful portfolios.",
        benefits: partnerBenefitsMap.designer,
        quote: "Design templates that power educational institutions worldwide. Your creativity shapes how institutions present themselves."
      },
      developer: {
        title: 'Why Become a Developer?',
        description: "Join our developer community! Get paid for building templates from approved designs. Work on exciting projects and earn competitive revenue sharing.",
        benefits: partnerBenefitsMap.developer,
        quote: "Build templates that make a difference. Every line of code you write helps institutions showcase student achievements."
      },
      business_dev: {
        title: 'Why Become a Business Developer?',
        description: "Drive growth and build strategic partnerships. Connect educational institutions with innovative solutions and earn attractive commissions.",
        benefits: partnerBenefitsMap.business_dev,
        quote: "Be the bridge between innovation and education. Your connections create opportunities for institutions worldwide."
      },
      marketing_agency: {
        title: 'Why Become a Marketing Agency Partner?',
        description: "Expand your agency's reach and help educational institutions build their brand. Access a growing market with lucrative commission opportunities.",
        benefits: partnerBenefitsMap.marketing_agency,
        quote: "Help institutions tell their story. Your marketing expertise transforms how schools connect with their communities."
      },
      sales: {
        title: 'Why Become a Sales Person?',
        description: "Join our sales team and help educational institutions discover transformative solutions. Build your career with competitive commissions and growth opportunities.",
        benefits: partnerBenefitsMap.sales,
        quote: "Every sale you make helps an institution grow. Be part of the educational revolution."
      }
    };
    return contentMap[activeForm];
  };

  const categoryContent = getCategoryContent();

  // File handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'designer' | 'developer') => {
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

    if (type === 'designer') {
      setDesignerForm(prev => ({ ...prev, cvFile: file, cvFileName: file.name }));
    } else {
      setDeveloperForm(prev => ({ ...prev, cvFile: file, cvFileName: file.name }));
    }
  };

  const removeFile = (type: 'designer' | 'developer') => {
    if (type === 'designer') {
      setDesignerForm(prev => ({ ...prev, cvFile: null, cvFileName: '' }));
    } else {
      setDeveloperForm(prev => ({ ...prev, cvFile: null, cvFileName: '' }));
    }
  };

  // Designer handlers
  const handleDesignerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDesignerForm(prev => ({ ...prev, [name]: value }));
  };

  // Developer handlers
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

  // Business Dev handlers
  const handleBusinessDevChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessDevForm(prev => ({ ...prev, [name]: value }));
  };

  // Marketing Agency handlers
  const handleMarketingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMarketingForm(prev => ({ ...prev, [name]: value }));
  };

  // Sales handlers
  const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSalesForm(prev => ({ ...prev, [name]: value }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Submit handlers
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
      
      if (onPartnerSubmit) onPartnerSubmit(newDesigner);
      
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
      
      if (onPartnerSubmit) onPartnerSubmit(newDeveloper);
      
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

  const handleBusinessDevSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const newBusinessDev: any = {
        id: `BD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        partnerType: 'business_dev',
        name: businessDevForm.name,
        email: businessDevForm.email,
        phone: businessDevForm.phone,
        company: businessDevForm.company,
        experience: businessDevForm.experience,
        region: businessDevForm.region,
        linkedin: businessDevForm.linkedin,
        message: businessDevForm.message,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBusinessDev),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      
      if (onPartnerSubmit) onPartnerSubmit(newBusinessDev);
      
      setSuccessMessage('Business Development application submitted successfully! Our team will contact you within 48 hours.');
      setSubmitStatus('success');
      setShowSuccessModal(true);
      
      setBusinessDevForm({
        id: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        experience: '',
        region: '',
        linkedin: '',
        message: '',
        submittedAt: '',
        status: 'pending'
      });
      
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      console.error('Business Dev form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarketingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const newMarketing: any = {
        id: `MA-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        partnerType: 'marketing_agency',
        agencyName: marketingForm.agencyName,
        contactPerson: marketingForm.contactPerson,
        email: marketingForm.email,
        phone: marketingForm.phone,
        website: marketingForm.website,
        services: marketingForm.services,
        teamSize: marketingForm.teamSize,
        message: marketingForm.message,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMarketing),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      
      if (onPartnerSubmit) onPartnerSubmit(newMarketing);
      
      setSuccessMessage('Marketing Agency registration submitted successfully! Our team will review and contact you within 48 hours.');
      setSubmitStatus('success');
      setShowSuccessModal(true);
      
      setMarketingForm({
        id: '',
        agencyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        services: '',
        teamSize: '',
        message: '',
        submittedAt: '',
        status: 'pending'
      });
      
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      console.error('Marketing form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSalesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const newSales: any = {
        id: `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        partnerType: 'sales',
        name: salesForm.name,
        email: salesForm.email,
        phone: salesForm.phone,
        company: salesForm.company,
        experience: salesForm.experience,
        region: salesForm.region,
        salesTarget: salesForm.salesTarget,
        message: salesForm.message,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSales),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      
      if (onPartnerSubmit) onPartnerSubmit(newSales);
      
      setSuccessMessage('Sales Person registration submitted successfully! Our team will contact you within 48 hours.');
      setSubmitStatus('success');
      setShowSuccessModal(true);
      
      setSalesForm({
        id: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        experience: '',
        region: '',
        salesTarget: '',
        message: '',
        submittedAt: '',
        status: 'pending'
      });
      
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      console.error('Sales form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get partner benefits with dynamic colors
  const getCurrentBenefits = () => {
    const benefits = partnerBenefitsMap[activeForm] || partnerBenefitsMap.designer;
    const activeColor = getActiveColor();
    return benefits.map(benefit => ({
      ...benefit,
      color: activeColor,
    }));
  };

  return (
    <>
      <Navbar />
      <section id="partner-section" ref={sectionRef} className="py-12 mt-10 md:py-20 px-4 sm:px-6 relative overflow-hidden cursor-pointer"
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto w-fit cursor-pointer"
              style={{
                backgroundColor: getActiveColorLight(),
              }}
            >
              <Handshake className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: getActiveColor() }} />
              <span className="text-xs md:text-sm font-medium tracking-wide cursor-pointer"
                style={{ 
                  color: getTextMuted(),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Join Our Network
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-serif tracking-tight cursor-pointer">
              <span style={{ color: getTextColor(), fontFamily: "'Poppins', sans-serif" }}>Become a </span>
              <span className="inline-block" style={{ color: getActiveColor(), fontFamily: "'Poppins', sans-serif" }}>
                Partner
              </span>
            </h2>
            
            <p className="text-sm md:text-base max-w-2xl mx-auto px-4 font-light tracking-wide cursor-pointer"
              style={{ 
                color: getTextMuted(),
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              Join our ecosystem of designers, developers, business developers, marketing agencies, and sales professionals.
            </p>
          </motion.div>

          {/* Category Selection - Only Business Developer is Gold, rest Blue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            {partnerTypes.map((type) => {
              const Icon = type.icon;
              const isActive = activeForm === type.value;
              const isYellow = type.color === '#E8CA5E';
              return (
                <button
                  key={type.value}
                  onClick={() => setActiveForm(type.value as any)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor: isActive ? (isYellow ? '#E8CA5E' : '#0066FF') : undefined,
                    color: isActive ? '#FFFFFF' : undefined,
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: isActive ? (isYellow ? '0 4px 20px rgba(232, 202, 94, 0.4)' : '0 4px 20px rgba(0, 102, 255, 0.4)') : undefined,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </motion.div>

          {/* Benefits Cards - Dynamic per partner type with hover shadow */}
          <PartnerBenefitsCards 
            benefits={getCurrentBenefits()}
            theme={theme}
            isInView={isInView}
            activeColor={getActiveColor()}
            shadowColor={getShadowColorForBenefits()}
          />

          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Side - Why Choose - No color passed, stays as is */}
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
                    style={{ backgroundColor: getActiveColor() }}
                  >
                    <FileText className="w-5 h-5 md:w-6 h-6" style={{ color: '#FFFFFF' }} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-serif tracking-tight cursor-pointer"
                    style={{ 
                      color: getTextColor(),
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {activeForm === 'designer' && 'Designer Registration'}
                    {activeForm === 'developer' && 'Developer Registration'}
                    {activeForm === 'business_dev' && 'Business Development Application'}
                    {activeForm === 'marketing_agency' && 'Marketing Agency Registration'}
                    {activeForm === 'sales' && 'Sales Person Registration'}
                  </h3>
                </div>
                <div className="text-[10px] md:text-xs cursor-pointer"
                  style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Calibri Light', sans-serif",
                  }}
                >
                  * Required fields
                </div>
              </div>

              {/* Designer Form */}
              {activeForm === 'designer' && (
                <form onSubmit={handleDesignerSubmit} className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Company (Optional)</label>
                      <input
                        type="text"
                        name="company"
                        value={designerForm.company}
                        onChange={handleDesignerChange}
                        placeholder="Your company name"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Specialization *</label>
                      <select
                        name="specialization"
                        value={designerForm.specialization}
                        onChange={handleDesignerChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                        style={getInputStyle()}
                      >
                        <option value="">Select specialization</option>
                        {specializations.map((spec, idx) => (
                          <option key={idx} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Experience *</label>
                      <select
                        name="experience"
                        value={designerForm.experience}
                        onChange={handleDesignerChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
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
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Portfolio Link (Optional)</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={designerForm.portfolio}
                      onChange={handleDesignerChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Upload CV/Resume (Optional - Max 20MB)</label>
                    <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 transition-colors"
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
                        onChange={(e) => handleFileSelect(e, 'designer')}
                        className="hidden"
                      />
                      {designerForm.cvFileName ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" style={{ color: getActiveColor() }} />
                            <span className="text-xs" style={{ 
                              color: getTextColor(),
                              fontFamily: "'Calibri Light', sans-serif",
                            }}>{designerForm.cvFileName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile('designer'); }}
                            className="p-1 hover:bg-red-500/20 rounded cursor-pointer"
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
                    className="px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mx-auto"
                    style={{
                      backgroundColor: getButtonBg(),
                      color: getButtonText(),
                      fontFamily: "'Poppins', sans-serif",
                      width: 'auto',
                      minWidth: '180px',
                      boxShadow: isBusinessDev ? '0 4px 20px rgba(232, 202, 94, 0.3)' : '0 4px 20px rgba(0, 102, 255, 0.3)',
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

              {/* Developer Form - Same structure as before, keep as is */}
              {activeForm === 'developer' && (
                <form onSubmit={handleDeveloperSubmit} className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {/* All developer form fields - same as before */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Company (Optional)</label>
                      <input
                        type="text"
                        name="companyName"
                        value={developerForm.companyName}
                        onChange={handleDeveloperChange}
                        placeholder="Your company/agency name"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Location (Optional)</label>
                      <input
                        type="text"
                        name="location"
                        value={developerForm.location}
                        onChange={handleDeveloperChange}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Specialization *</label>
                      <select
                        name="specialization"
                        value={developerForm.specialization}
                        onChange={handleDeveloperChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                        style={getInputStyle()}
                      >
                        <option value="">Select specialization</option>
                        {developerSpecializations.map((spec, idx) => (
                          <option key={idx} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Experience *</label>
                      <select
                        name="experience"
                        value={developerForm.experience}
                        onChange={handleDeveloperChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
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
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Skills *</label>
                    <div className="flex flex-wrap gap-2 p-3 rounded-lg border cursor-pointer" style={{ borderColor: getBorderColor(), backgroundColor: getInputBg() }}>
                      {skillOptions.map((skill) => (
                        <label
                          key={skill}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                            developerForm.skills.includes(skill)
                              ? 'text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          } cursor-pointer`}
                          style={{
                            backgroundColor: developerForm.skills.includes(skill) ? getActiveColor() : undefined,
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
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
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Portfolio/GitHub Link (Optional)</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={developerForm.portfolio}
                      onChange={handleDeveloperChange}
                      placeholder="https://github.com/yourusername"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Bio (Optional)</label>
                    <textarea
                      name="bio"
                      value={developerForm.bio}
                      onChange={handleDeveloperChange}
                      rows={2}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all resize-none cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Bank Account Details (Optional)</label>
                    <textarea
                      name="bankAccountDetails"
                      value={developerForm.bankAccountDetails}
                      onChange={handleDeveloperChange}
                      rows={2}
                      placeholder="Bank name, Account holder name, Account number, IBAN"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all resize-none cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
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
                        onChange={(e) => handleFileSelect(e, 'developer')}
                        className="hidden"
                      />
                      {developerForm.cvFileName ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" style={{ color: getActiveColor() }} />
                            <span className="text-xs" style={{ 
                              color: getTextColor(),
                              fontFamily: "'Calibri Light', sans-serif",
                            }}>{developerForm.cvFileName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile('developer'); }}
                            className="p-1 hover:bg-red-500/20 rounded cursor-pointer"
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
                    className="px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mx-auto"
                    style={{
                      backgroundColor: getButtonBg(),
                      color: getButtonText(),
                      fontFamily: "'Poppins', sans-serif",
                      width: 'auto',
                      minWidth: '180px',
                      boxShadow: isBusinessDev ? '0 4px 20px rgba(232, 202, 94, 0.3)' : '0 4px 20px rgba(0, 102, 255, 0.3)',
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
                        Register as Developer
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Business Developer Form */}
              {activeForm === 'business_dev' && (
                <form onSubmit={handleBusinessDevSubmit} className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={businessDevForm.name}
                      onChange={handleBusinessDevChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={businessDevForm.email}
                        onChange={handleBusinessDevChange}
                        required
                        placeholder="bd@company.com"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={businessDevForm.phone}
                        onChange={handleBusinessDevChange}
                        required
                        placeholder="+92 300 1234567"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Company *</label>
                      <input
                        type="text"
                        name="company"
                        value={businessDevForm.company}
                        onChange={handleBusinessDevChange}
                        required
                        placeholder="Your company name"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Experience *</label>
                      <select
                        name="experience"
                        value={businessDevForm.experience}
                        onChange={handleBusinessDevChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                        style={getInputStyle()}
                      >
                        <option value="">Select experience</option>
                        {experienceLevels.map((exp, idx) => (
                          <option key={idx} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Region *</label>
                      <select
                        name="region"
                        value={businessDevForm.region}
                        onChange={handleBusinessDevChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                        style={getInputStyle()}
                      >
                        <option value="">Select region</option>
                        {regions.map((region, idx) => (
                          <option key={idx} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>LinkedIn (Optional)</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={businessDevForm.linkedin}
                        onChange={handleBusinessDevChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Message / Partnership Interest *</label>
                    <textarea
                      name="message"
                      value={businessDevForm.message}
                      onChange={handleBusinessDevChange}
                      required
                      rows={3}
                      placeholder="Tell us about your experience and how you can contribute..."
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all resize-none cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mx-auto"
                    style={{
                      backgroundColor: getButtonBg(),
                      color: getButtonText(),
                      fontFamily: "'Poppins', sans-serif",
                      width: 'auto',
                      minWidth: '180px',
                      boxShadow: isBusinessDev ? '0 4px 20px rgba(232, 202, 94, 0.3)' : '0 4px 20px rgba(0, 102, 255, 0.3)',
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
                        Apply as Business Developer
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Marketing Agency Form - Keep as is */}
              {activeForm === 'marketing_agency' && (
                <form onSubmit={handleMarketingSubmit} className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Agency Name *</label>
                    <input
                      type="text"
                      name="agencyName"
                      value={marketingForm.agencyName}
                      onChange={handleMarketingChange}
                      required
                      placeholder="Your agency name"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Contact Person *</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={marketingForm.contactPerson}
                      onChange={handleMarketingChange}
                      required
                      placeholder="Full name of contact person"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={marketingForm.email}
                        onChange={handleMarketingChange}
                        required
                        placeholder="agency@company.com"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={marketingForm.phone}
                        onChange={handleMarketingChange}
                        required
                        placeholder="+92 300 1234567"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Website (Optional)</label>
                      <input
                        type="url"
                        name="website"
                        value={marketingForm.website}
                        onChange={handleMarketingChange}
                        placeholder="https://youragency.com"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Team Size *</label>
                      <select
                        name="teamSize"
                        value={marketingForm.teamSize}
                        onChange={handleMarketingChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                        style={getInputStyle()}
                      >
                        <option value="">Select team size</option>
                        {teamSizes.map((size, idx) => (
                          <option key={idx} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Services Offered *</label>
                    <select
                      name="services"
                      value={marketingForm.services}
                      onChange={handleMarketingChange}
                      required
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                      style={getInputStyle()}
                    >
                      <option value="">Select primary service</option>
                      {servicesList.map((service, idx) => (
                        <option key={idx} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Message / How Can We Partner? *</label>
                    <textarea
                      name="message"
                      value={marketingForm.message}
                      onChange={handleMarketingChange}
                      required
                      rows={3}
                      placeholder="Tell us about your agency and how we can collaborate..."
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all resize-none cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mx-auto"
                    style={{
                      backgroundColor: getButtonBg(),
                      color: getButtonText(),
                      fontFamily: "'Poppins', sans-serif",
                      width: 'auto',
                      minWidth: '180px',
                      boxShadow: isBusinessDev ? '0 4px 20px rgba(232, 202, 94, 0.3)' : '0 4px 20px rgba(0, 102, 255, 0.3)',
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
                        Register as Marketing Agency
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Sales Person Form - Keep as is */}
              {activeForm === 'sales' && (
                <form onSubmit={handleSalesSubmit} className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={salesForm.name}
                      onChange={handleSalesChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={salesForm.email}
                        onChange={handleSalesChange}
                        required
                        placeholder="sales@company.com"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={salesForm.phone}
                        onChange={handleSalesChange}
                        required
                        placeholder="+92 300 1234567"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Company *</label>
                      <input
                        type="text"
                        name="company"
                        value={salesForm.company}
                        onChange={handleSalesChange}
                        required
                        placeholder="Your company name"
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-text"
                        style={getInputStyle()}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Experience *</label>
                      <select
                        name="experience"
                        value={salesForm.experience}
                        onChange={handleSalesChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                        style={getInputStyle()}
                      >
                        <option value="">Select experience</option>
                        {experienceLevels.map((exp, idx) => (
                          <option key={idx} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Region *</label>
                      <select
                        name="region"
                        value={salesForm.region}
                        onChange={handleSalesChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                        style={getInputStyle()}
                      >
                        <option value="">Select region</option>
                        {regions.map((region, idx) => (
                          <option key={idx} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}>Monthly Sales Target (USD) *</label>
                      <select
                        name="salesTarget"
                        value={salesForm.salesTarget}
                        onChange={handleSalesChange}
                        required
                        className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all cursor-pointer"
                        style={getInputStyle()}
                      >
                        <option value="">Select target</option>
                        <option value="5000">$5,000+</option>
                        <option value="10000">$10,000+</option>
                        <option value="25000">$25,000+</option>
                        <option value="50000">$50,000+</option>
                        <option value="100000">$100,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-xs font-medium mb-1 cursor-pointer" style={{ 
                      color: getTextMuted(),
                      fontFamily: "'Poppins', sans-serif",
                    }}>Message / Why Sales? *</label>
                    <textarea
                      name="message"
                      value={salesForm.message}
                      onChange={handleSalesChange}
                      required
                      rows={3}
                      placeholder="Tell us about your sales experience and why you want to join..."
                      className="w-full px-3 py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all resize-none cursor-text"
                      style={getInputStyle()}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, getInputHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: getBorderColor() })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mx-auto"
                    style={{
                      backgroundColor: getButtonBg(),
                      color: getButtonText(),
                      fontFamily: "'Poppins', sans-serif",
                      width: 'auto',
                      minWidth: '180px',
                      boxShadow: isBusinessDev ? '0 4px 20px rgba(232, 202, 94, 0.3)' : '0 4px 20px rgba(0, 102, 255, 0.3)',
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
                        Apply as Sales Person
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {submitStatus === 'error' && (
                <div className="p-2 md:p-3 rounded-lg flex items-center gap-2 mt-3 cursor-pointer"
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
              <h3 className="text-lg md:text-xl font-bold mb-2 font-serif cursor-pointer"
                style={{ 
                  color: getTextColor(),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Submission Successful!
              </h3>
              <p className="text-xs md:text-sm mb-4 font-light cursor-pointer"
                style={{ 
                  color: getTextSecondary(),
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                {successMessage}
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-5 py-2 md:px-6 md:py-2 rounded-lg font-semibold text-xs md:text-sm hover:scale-105 transition-transform cursor-pointer"
                style={{
                  backgroundColor: getActiveColor(),
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
      <ContactSection/>
      <Footer />
    </>
  );
}