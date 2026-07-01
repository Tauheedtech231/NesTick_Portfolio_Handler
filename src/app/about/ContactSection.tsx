/* eslint-disable react/no-unescaped-entities */
// components/landing/ContactSection.tsx
'use client';

import { motion, useInView } from 'framer-motion';
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
  User,
  Tag,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactSectionProps {
  theme?: 'light' | 'dark';
}

// ─── UPDATED: Real Contact Info ──────────────────────────────────────────────
const contactInfo = [
  { 
    icon: Phone, 
    label: "Developer", 
    value: "03237594869", 
    href: "tel:+923237594869", 
    description: "Available Mon-Fri, 9AM-6PM" 
  },
  { 
    icon: Phone, 
    label: "Founder", 
    value: "03193236529", 
    href: "tel:+923193236529", 
    description: "Available Mon-Fri, 9AM-6PM" 
  },
  { 
    icon: Mail, 
    label: "Email", 
    value: "neezamiya@gmail.com", 
    href: "mailto:neezamiya@gmail.com", 
    description: "We reply within 24 hours" 
  },
  { 
    icon: MapPin, 
    label: "Office", 
    value: "Lahore, Pakistan", 
    href: null, 
    description: "Serving globally from Lahore" 
  },
  { 
    icon: Clock, 
    label: "Business Hours", 
    value: "Monday - Friday", 
    href: null, 
    description: "9:00 AM - 6:00 PM (PKT)" 
  },
];

export default function ContactSection({ theme: propTheme }: ContactSectionProps) {
  const contactRef = useRef(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });

  // Theme detection
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

  const currentTheme = propTheme || theme;

  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
  const isDark = currentTheme === 'dark';
  const bgPrimary = isDark ? '#0B0F19' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#1F2937';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const accentColor = isDark ? '#E8CA5E' : '#0066FF';
  const accentLight = isDark ? 'rgba(232,202,94,0.12)' : 'rgba(0,102,255,0.06)';
  const borderColor = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  const inputBg = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)';
  const inputText = isDark ? '#FFFFFF' : '#1F2937';
  const buttonBg = isDark ? '#E8CA5E' : '#0066FF';
  const buttonText = isDark ? '#1F4381' : '#FFFFFF';

  return (
    <section ref={contactRef} className="py-10" style={{ 
      background: bgPrimary,
      transition: 'background-color 0.6s ease'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          
          {/* ─── LEFT - Contact Info ──────────────────────────────────────── */}
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
                  style={{ border: 'none' }}
                >
                  {/* Icon - Rounded with Glow */}
                  <div 
                    className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                      border: `2px solid ${accentColor}`,
                      boxShadow: `0 0 20px ${accentColor}25`,
                    }}
                  >
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

          {/* ─── RIGHT - Contact Form ──────────────────────────────────────── */}
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
              {/* Name */}
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ 
                  color: textSecondary,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease'
                }}>
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={contactFormData.name}
                    onChange={handleContactInputChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-500"
                    style={{
                      backgroundColor: inputBg,
                      borderColor: borderColor,
                      borderWidth: '1px',
                      color: inputText,
                      fontFamily: "'Calibri Light', sans-serif",
                      transition: 'background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = accentColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ 
                  color: textSecondary,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease'
                }}>
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={contactFormData.email}
                    onChange={handleContactInputChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-500"
                    style={{
                      backgroundColor: inputBg,
                      borderColor: borderColor,
                      borderWidth: '1px',
                      color: inputText,
                      fontFamily: "'Calibri Light', sans-serif",
                      transition: 'background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = accentColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ 
                  color: textSecondary,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease'
                }}>
                  Subject *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Tag className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <select
                    name="subject"
                    value={contactFormData.subject}
                    onChange={handleContactInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundColor: inputBg,
                      borderColor: borderColor,
                      borderWidth: '1px',
                      color: inputText,
                      fontFamily: "'Calibri Light', sans-serif",
                      transition: 'background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = accentColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership">Partnership Opportunity</option>
                    <option value="Demo Request">Demo Request</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4" style={{ color: textSecondary }} />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ 
                  color: textSecondary,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease'
                }}>
                  Message *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 pointer-events-none">
                    <MessageSquare className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <textarea
                    name="message"
                    value={contactFormData.message}
                    onChange={handleContactInputChange}
                    required
                    rows={4}
                    placeholder="Tell us about your inquiry..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all resize-none placeholder:text-gray-500"
                    style={{
                      backgroundColor: inputBg,
                      borderColor: borderColor,
                      borderWidth: '1px',
                      color: inputText,
                      fontFamily: "'Calibri Light', sans-serif",
                      transition: 'background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = accentColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: buttonBg,
                  color: buttonText,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'background-color 0.6s ease, color 0.6s ease',
                  boxShadow: `0 4px 20px ${accentColor}30`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}