/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion, useInView, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, 
  Rocket, 
  Target,
  Eye,
  Infinity,
  Award,
  TrendingUp,
  Globe,
  Brain,
  Users,
  Crown,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { PartnerSection } from '@/components/landing/PartnerSection';
import JourneySection from './JourneySection'; // 👈 Import new component

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Actual team data with avatar colors
const teamMembers = [
  {
    id: 1,
    name: 'Talha Zaheer',
    role: 'CTO',
    avatarColor: '#6366F1',
    initials: 'TZ',
  },
  {
    id: 2,
    name: 'Abdullah Amin',
    role: 'Founder',
    avatarColor: '#8B5CF6',
    initials: 'AA',
  },
  {
    id: 3,
    name: 'Nimra Ali',
    role: 'Creative Lead',
    avatarColor: '#EC4899',
    initials: 'NA',
  },
  {
    id: 4,
    name: 'Muhammad Tauheed',
    role: 'Senior Developer',
    avatarColor: '#06B6D4',
    initials: 'MT',
  },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Team slider state
  const [duplicatedTeam, setDuplicatedTeam] = useState<typeof teamMembers>([]);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });

  // Scroll parallax for team slider
  const { scrollYProgress } = useScroll({
    target: teamRef,
    offset: ["start end", "end start"]
  });

  const sliderX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -200, -400, -600, -800]
  );

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

  // Create seamless infinite loop for team
  useEffect(() => {
    const copies = [...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers];
    setDuplicatedTeam(copies);
  }, []);

  // Contact Form State
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Contact Info
  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+92 319 3236529", href: "tel:+923193236529", description: "Available Mon-Fri, 9AM-6PM" },
    { icon: Mail, label: "Email", value: "support@portfoliohandler.com", href: "mailto:support@portfoliohandler.com", description: "We reply within 24 hours" },
    { icon: MapPin, label: "Office", value: "Daska, Pakistan", href: null, description: "Serving globally from Daska" },
    { icon: Clock, label: "Business Hours", value: "Monday - Friday", href: null, description: "9:00 AM - 6:00 PM (PKT)" },
  ];

  // Form Handlers
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactFormData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setContactFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeInLeftVariants: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      }
    }
  };

  const fadeInRightVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      }
    }
  };

  const fromBottomVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
        delay: 0.2,
      }
    }
  };

  // Theme-based colors
  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#F5F5F5';
  const getTextColor = () => theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const getTextSecondary = () => theme === 'dark' ? '#D1D5DB' : '#4B5563';
  const getTextMuted = () => theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const getAccentColor = () => theme === 'dark' ? '#E8CA5E' : '#00A0FF';
  const getBorderColor = () => theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(0, 0, 0, 0.06)';
  const getInputBg = () => theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#E5E7EB';

  return (
    <>
      <Navbar />
      <main 
        className="min-h-screen pt-16 lg:pt-20 overflow-hidden"
        style={{ backgroundColor: getBgColor(), fontFamily: "'Poppins', sans-serif" }}
      >
        {/* ─── Hero Section ─── */}
        <section ref={heroRef} className="relative overflow-hidden flex items-center justify-center min-h-[50vh]">
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInLeftVariants}
              className="mb-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-[2rem] rounded-full mb-4 mx-auto w-fit"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
                  border: 'none',
                }}
              >
                <Sparkles className="w-3.5 h-3.5"
                  style={{ color: getAccentColor() }}
                />
                <span className="text-xs font-medium tracking-wide"
                  style={{ 
                    color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  About Us
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 leading-tight max-w-3xl mx-auto font-serif tracking-tight">
                <span className="block" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Building{' '}
                  <span className="inline-block"
                    style={{ color: getAccentColor() }}
                  >
                    Digital Futures
                  </span>
                </span>
                <span className="block" style={{ fontFamily: "'Poppins', sans-serif" }}>Since 2021</span>
              </h1>
            </motion.div>

            <motion.p
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fromBottomVariants}
              className="text-base md:text-lg max-w-2xl mx-auto font-light tracking-wide"
              style={{ 
                color: theme === 'dark' ? '#D1D5DB' : '#E5E7EB',
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              Helping institutions manage and showcase student portfolios — simply and efficiently.
            </motion.p>
          </div>
        </section>

        {/* ─── Mission & Vision ─── */}
        <section ref={missionRef} className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Mission */}
              <motion.div
                initial="hidden"
                animate={missionInView ? "visible" : "hidden"}
                variants={fadeInLeftVariants}
                className="group"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
                      }}
                    >
                      <Target className="w-6 h-6"
                        style={{ color: getAccentColor() }}
                      />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight"
                      style={{ 
                        color: getTextColor(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Our Mission
                    </h2>
                  </div>
                  <p className="leading-relaxed text-base md:text-lg font-light tracking-wide"
                    style={{ 
                      color: getTextSecondary(),
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    To empower educational institutions with cutting-edge portfolio management technology 
                    that simplifies administration, enhances student visibility, and creates lasting digital 
                    legacies for academic achievements.
                  </p>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial="hidden"
                animate={missionInView ? "visible" : "hidden"}
                variants={fadeInRightVariants}
                className="group"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
                      }}
                    >
                      <Eye className="w-6 h-6"
                        style={{ color: getAccentColor() }}
                      />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight"
                      style={{ 
                        color: getTextColor(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Our Vision
                    </h2>
                  </div>
                  <p className="leading-relaxed text-base md:text-lg font-light tracking-wide"
                    style={{ 
                      color: getTextSecondary(),
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    To become the global standard for educational portfolio management, connecting 
                    institutions, students, and opportunities through innovative technology that 
                    showcases potential and celebrates achievement.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Journey Section ─── */}
        <JourneySection />

        {/* ─── Partner Section ─── */}
        <PartnerSection onPartnerSubmit={(data) => {
          console.log('New partner application:', data);
        }} />

        {/* ─── Team Slider ─── */}
        <section ref={teamRef} className="py-12 md:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
                  border: 'none',
                }}
              >
                <Users className="w-3.5 h-3.5"
                  style={{ color: getAccentColor() }}
                />
                <span className="text-xs font-medium tracking-wide"
                  style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Our Team
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-serif tracking-tight"
                style={{ 
                  color: getTextColor(),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Meet Our{' '}
                <span className="inline-block"
                  style={{ color: getAccentColor() }}
                >
                  Leadership
                </span>
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide"
                style={{ 
                  color: getTextMuted(),
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                The passionate team driving innovation at Portfolio Handler
              </p>
            </motion.div>

            {/* Team Slider */}
            <div className="relative w-full overflow-hidden">
              <motion.div 
                className="relative w-full"
                style={{ x: sliderX }}
              >
                <div className="flex gap-6 md:gap-8 lg:gap-10 items-stretch py-4 w-max">
                  {duplicatedTeam.map((member, index) => (
                    <div
                      key={`${member.id}-${index}`}
                      className="flex-shrink-0 group w-[180px] md:w-[200px] lg:w-[220px]"
                    >
                      <div className="flex flex-col items-center transition-all duration-300">
                        <div className="relative mb-3">
                          <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
                          <div 
                            className={`relative w-20 h-18 hover:cursor-pointer md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#6366F1]/20 overflow-hidden`}
                            style={{
                              backgroundColor: member.avatarColor,
                              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                            }}
                          >
                            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {member.initials}
                            </span>
                          </div>
                          
                          <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium whitespace-nowrap transition-all duration-300 group-hover:scale-105`}
                            style={{
                              backgroundColor: theme === 'dark' ? '#1F4381' : '#00A0FF',
                              color: '#FFFFFF',
                              opacity: 0.95,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {member.role}
                          </div>
                        </div>
                        
                        <span className={`text-sm md:text-base font-semibold tracking-wide ${theme === 'dark' ? 'text-[#E2E8F0]' : 'text-[#334155]'} group-hover:text-[#6366F1] transition-colors duration-300 text-center`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {member.name}
                        </span>
                        
                        <div className="w-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] group-hover:w-12 transition-all duration-300 mt-1 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Contact Section ─── */}
        <section ref={contactRef} className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={contactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
                  border: 'none',
                }}
              >
                <Mail className="w-3.5 h-3.5"
                  style={{ color: getAccentColor() }}
                />
                <span className="text-xs font-medium tracking-wide"
                  style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Get In Touch
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-serif tracking-tight"
                style={{ 
                  color: getTextColor(),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Let's{' '}
                <span className="inline-block"
                  style={{ color: getAccentColor() }}
                >
                  Connect
                </span>
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide"
                style={{ 
                  color: getTextMuted(),
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Contact Info */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={contactInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 md:p-8"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif tracking-tight"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Sparkles className="w-5 h-5"
                    style={{ color: getAccentColor() }}
                  />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
                        }}
                      >
                        <item.icon className="w-5 h-5"
                          style={{ color: getAccentColor() }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-medium mb-0.5 tracking-wide"
                          style={{ 
                            color: getTextMuted(),
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {item.label}
                        </h3>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-semibold hover:underline transition-colors block"
                            style={{ 
                              color: getAccentColor(),
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold"
                            style={{ 
                              color: getTextColor(),
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {item.value}
                          </p>
                        )}
                        <p className="text-xs mt-1 font-light"
                          style={{ 
                            color: getTextMuted(),
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side - Contact Form */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={contactInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 md:p-8"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif tracking-tight"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Mail className="w-5 h-5"
                    style={{ color: getAccentColor() }}
                  />
                  Send us a Message
                </h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide"
                      style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors placeholder:text-gray-500"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        borderWidth: '1px',
                        color: getTextColor(),
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide"
                      style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactFormData.email}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors placeholder:text-gray-500"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        borderWidth: '1px',
                        color: getTextColor(),
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide"
                      style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={contactFormData.subject}
                      onChange={handleContactInputChange}
                      required
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        borderWidth: '1px',
                        color: getTextColor(),
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership Opportunity</option>
                      <option value="Demo Request">Demo Request</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide"
                      style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={contactFormData.message}
                      onChange={handleContactInputChange}
                      required
                      rows={4}
                      placeholder="Tell us about your inquiry..."
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors resize-none placeholder:text-gray-500"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        borderWidth: '1px',
                        color: getTextColor(),
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: getAccentColor(),
                      color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }}
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <p className="text-green-400 text-xs"
                        style={{ fontFamily: "'Calibri Light', sans-serif" }}
                      >
                        Thank you! We'll get back to you soon.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <p className="text-red-400 text-xs"
                        style={{ fontFamily: "'Calibri Light', sans-serif" }}
                      >
                        Failed to send. Please try again.
                      </p>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}