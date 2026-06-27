// app/about/page.tsx
/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  Users,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { PartnerSection } from '@/components/landing/PartnerSection';
import JourneySection from './JourneySection';
import { HeroSection } from './HeroSection'; 
import { PurposeSection } from './PurposeSection'; 

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Team data
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
  const teamRef = useRef(null);
  const contactRef = useRef(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [duplicatedTeam, setDuplicatedTeam] = useState<typeof teamMembers>([]);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: teamRef,
    offset: ["start end", "end start"]
  });

  const sliderX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -200, -400, -600, -800]
  );

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

  useEffect(() => {
    const copies = [...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers];
    setDuplicatedTeam(copies);
  }, []);

  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+92 319 3236529", href: "tel:+923193236529", description: "Available Mon-Fri, 9AM-6PM" },
    { icon: Mail, label: "Email", value: "support@portfoliohandler.com", href: "mailto:support@portfoliohandler.com", description: "We reply within 24 hours" },
    { icon: MapPin, label: "Office", value: "Daska, Pakistan", href: null, description: "Serving globally from Daska" },
    { icon: Clock, label: "Business Hours", value: "Monday - Friday", href: null, description: "9:00 AM - 6:00 PM (PKT)" },
  ];

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

  // ── Theme-based colors ──
  const isDark = theme === 'dark';
  const bgPrimary = isDark ? '#0B0F19' : '#F5F5F5';
  const bgSecondary = isDark ? '#0B0F19' : '#F5F5F5';
  const textPrimary = isDark ? '#FFFFFF' : '#1F2937';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';
  const accentColor = isDark ? '#E8CA5E' : '#0066FF';
  const accentLight = isDark ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 102, 255, 0.08)';
  const borderColor = isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(0, 0, 0, 0.08)';
  const inputBg = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)';
  const inputText = isDark ? '#FFFFFF' : '#1F2937';
  const placeholderColor = isDark ? '#6B7280' : '#9CA3AF';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)';
  const iconBg = isDark ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 102, 255, 0.08)';
  const teamNameColor = isDark ? '#E2E8F0' : '#1F2937';
  const teamRoleBg = isDark ? '#1F4381' : '#E8CA5E';
  const teamRoleColor = isDark ? '#FFFFFF' : '#1F2937';
  const buttonBg = isDark ? '#E8CA5E' : '#0066FF';
  const buttonText = isDark ? '#1F4381' : '#FFFFFF';

  return (
    <>
      <Navbar />
      <main 
        className="min-h-screen pt-16 lg:pt-20 overflow-hidden"
        style={{ 
          backgroundColor: bgPrimary, 
          fontFamily: "'Poppins', sans-serif",
          transition: 'background-color 0.6s ease'
        }}
      >
        {/* ─── HERO SECTION ─── */}
        <HeroSection />

        {/* ─── PURPOSE SECTION (Mission & Vision) ─── */}
        <PurposeSection />

        {/* ─── Journey Section ─── */}
        <JourneySection />

        {/* ─── Partner Section ─── */}
        <PartnerSection onPartnerSubmit={(data) => {
          console.log('New partner application:', data);
        }} />

        {/* ─── Team Slider ─── */}
        <section ref={teamRef} className="py-12 md:py-16 overflow-hidden" style={{ 
          background: bgSecondary,
          transition: 'background-color 0.6s ease'
        }}>
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
                  backgroundColor: accentLight,
                  border: 'none',
                  transition: 'background-color 0.6s ease',
                }}
              >
                <Users className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span className="text-xs font-medium tracking-wide" style={{ 
                  color: textSecondary,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease'
                }}>
                  Our Team
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-serif tracking-tight" style={{ 
                color: textPrimary,
                fontFamily: "'Poppins', sans-serif",
                transition: 'color 0.6s ease'
              }}>
                Meet Our{' '}
                <span className="inline-block" style={{ color: accentColor }}>
                  Leadership
                </span>
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide" style={{ 
                color: textSecondary,
                fontFamily: "'Calibri Light', sans-serif",
                transition: 'color 0.6s ease'
              }}>
                The passionate team driving innovation at Portfolio Handler
              </p>
            </motion.div>

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
                              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                            }}
                          >
                            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {member.initials}
                            </span>
                          </div>
                          
                          <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium whitespace-nowrap transition-all duration-300 group-hover:scale-105`}
                            style={{
                              backgroundColor: teamRoleBg,
                              color: teamRoleColor,
                              opacity: 0.95,
                              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                              fontFamily: "'Poppins', sans-serif",
                              transition: 'background-color 0.6s ease, color 0.6s ease',
                            }}
                          >
                            {member.role}
                          </div>
                        </div>
                        
                        <span className={`text-sm md:text-base font-semibold tracking-wide group-hover:text-[#6366F1] transition-colors duration-300 text-center`}
                          style={{
                            color: teamNameColor,
                            fontFamily: "'Poppins', sans-serif",
                            transition: 'color 0.6s ease',
                          }}
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
        <section ref={contactRef} className="py-12 md:py-16" style={{ 
          background: bgPrimary,
          transition: 'background-color 0.6s ease'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={contactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
                style={{
                  backgroundColor: accentLight,
                  border: 'none',
                  transition: 'background-color 0.6s ease',
                }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span className="text-xs font-medium tracking-wide" style={{ 
                  color: textSecondary,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease'
                }}>
                  Get In Touch
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-serif tracking-tight" style={{ 
                color: textPrimary,
                fontFamily: "'Poppins', sans-serif",
                transition: 'color 0.6s ease'
              }}>
                Let's{' '}
                <span className="inline-block" style={{ color: accentColor }}>
                  Connect
                </span>
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide" style={{ 
                color: textSecondary,
                fontFamily: "'Calibri Light', sans-serif",
                transition: 'color 0.6s ease'
              }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={contactInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 md:p-8"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif tracking-tight" style={{ 
                  color: textPrimary,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease'
                }}>
                  <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ 
                        backgroundColor: iconBg,
                        transition: 'background-color 0.6s ease'
                      }}>
                        <item.icon className="w-5 h-5" style={{ color: accentColor }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-medium mb-0.5 tracking-wide" style={{ 
                          color: textSecondary,
                          fontFamily: "'Poppins', sans-serif",
                          transition: 'color 0.6s ease'
                        }}>
                          {item.label}
                        </h3>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-semibold hover:underline transition-colors block" style={{ 
                            color: accentColor,
                            fontFamily: "'Poppins', sans-serif",
                            transition: 'color 0.6s ease'
                          }}>
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold" style={{ 
                            color: textPrimary,
                            fontFamily: "'Poppins', sans-serif",
                            transition: 'color 0.6s ease'
                          }}>
                            {item.value}
                          </p>
                        )}
                        <p className="text-xs mt-1 font-light" style={{ 
                          color: textSecondary,
                          fontFamily: "'Calibri Light', sans-serif",
                          transition: 'color 0.6s ease'
                        }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={contactInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 md:p-8"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif tracking-tight" style={{ 
                  color: textPrimary,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease'
                }}>
                  <Mail className="w-5 h-5" style={{ color: accentColor }} />
                  Send us a Message
                </h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ 
                      color: textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'color 0.6s ease'
                    }}>
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
                        backgroundColor: inputBg,
                        borderColor: borderColor,
                        borderWidth: '1px',
                        color: inputText,
                        fontFamily: "'Calibri Light', sans-serif",
                        transition: 'background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ 
                      color: textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'color 0.6s ease'
                    }}>
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
                        backgroundColor: inputBg,
                        borderColor: borderColor,
                        borderWidth: '1px',
                        color: inputText,
                        fontFamily: "'Calibri Light', sans-serif",
                        transition: 'background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ 
                      color: textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'color 0.6s ease'
                    }}>
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={contactFormData.subject}
                      onChange={handleContactInputChange}
                      required
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        backgroundColor: inputBg,
                        borderColor: borderColor,
                        borderWidth: '1px',
                        color: inputText,
                        fontFamily: "'Calibri Light', sans-serif",
                        transition: 'background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease',
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
                    <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ 
                      color: textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'color 0.6s ease'
                    }}>
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
                        backgroundColor: inputBg,
                        borderColor: borderColor,
                        borderWidth: '1px',
                        color: inputText,
                        fontFamily: "'Calibri Light', sans-serif",
                        transition: 'background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: buttonBg,
                      color: buttonText,
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'background-color 0.6s ease, color 0.6s ease',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: buttonText }}>
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
                      <p className="text-green-400 text-xs" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                        Thank you! We'll get back to you soon.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <p className="text-red-400 text-xs" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
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