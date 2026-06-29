/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  Mail, 
  Tag, 
  MessageSquare,
  Send,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    checkTheme();
    
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Theme colors - Same as Partner Section
  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#F5F5F5';
  const getBorderColor = () => theme === 'dark' ? 'rgba(30, 41, 59, 0.2)' : 'rgba(0, 0, 0, 0.04)';
  const getTextColor = () => theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const getTextSecondary = () => theme === 'dark' ? '#D1D5DB' : '#4B5563';
  const getTextMuted = () => theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const getAccentColor = () => '#60A5FA';
  const getInputBg = () => theme === 'dark' ? 'rgba(11, 15, 25, 0.8)' : 'rgba(245, 245, 245, 0.8)';
  const getButtonBg = () => '#60A5FA';
  const getButtonText = () => '#FFFFFF';
  const getCurveColor = () => theme === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(0, 0, 0, 0.1)';

  const getInputStyle = () => ({
    width: '100%',
    padding: '0.7rem 1rem 0.7rem 2.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    backgroundColor: getInputBg(),
    border: `1px solid ${getBorderColor()}`,
    color: getTextColor(),
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: "'Calibri Light', sans-serif",
  });

  const getTextareaStyle = () => ({
    width: '100%',
    padding: '0.7rem 1rem 0.7rem 2.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    backgroundColor: getInputBg(),
    border: `1px solid ${getBorderColor()}`,
    color: getTextColor(),
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: "'Calibri Light', sans-serif",
    resize: 'none' as const,
    minHeight: '120px',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'message') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setShowSuccessModal(true);
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setCharCount(0);
      
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact info items
  const contactItems = [
    {
      icon: MapPin,
      title: 'Office Address',
      details: ['123 Business Avenue,', 'Main Boulevard, Lahore, Pakistan']
    },
    {
      icon: Phone,
      title: 'Contact Info',
      details: ['+92 322 4700200', 'info@mansolhab.com']
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Monday – Saturday', '9:00 AM – 5:00 PM', 'Sunday: Closed']
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-10 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: getBgColor(), fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Contact Info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 relative z-10">
              <div className="mb-8 md:mb-10">
                <h1 className="text-3xl md:text-4xl  font-bold font-serif leading-tight cursor-pointer"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Get in<br />
                  <span 
                    className="relative inline-block"
                    style={{ color: getAccentColor() }}
                  >
                    Touch
                 
                  </span>
                 
                </h1>
                <p 
                  className="mt-4 max-w-xs leading-relaxed cursor-pointer text-sm"
                  style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Calibri Light', sans-serif",
                  }}
                >
                  Have questions about our courses or training programs? We're here to help you.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-8 relative">
                {/* Curved Timeline Line - Pure Black/Dark */}
                <svg 
                  className="absolute left-[18px] top-6 bottom-6 w-8 h-[calc(100%-48px)]"
                  style={{ color: getCurveColor() }}
                  preserveAspectRatio="none" 
                  viewBox="0 0 40 100" 
                  fill="none"
                >
                  <path 
                    d="M7 0 Q 45 50 7 100" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
                
                {/* Top Dot - Connected to curve top */}
              {/* Top Dot - Slightly right push */}
<div 
  className="absolute w-2.5 h-2.5 rounded-full"
  style={{ 
    backgroundColor: getAccentColor(),
    left: 'calc(14px + 0.2rem)',
    top: '17px',
  }}
/>
                
                {/* Middle Dot - 0.5rem left push */}
                <div 
                  className="absolute left-[38px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                  style={{ 
                    backgroundColor: getAccentColor(),
                    transform: 'translateY(-50%) translateX(-0.3rem)',
                  }}
                />
                
                {/* Bottom Dot - 1.5rem bottom push + 1rem left push */}
              <div 
  className="absolute w-2.5 h-2.5 rounded-full"
  style={{ 
    backgroundColor: getAccentColor(),
    left: 'calc(14px + .5rem)',    // ← 2rem RIGHT push
    bottom: 'calc(-.5rem + 0px)',
  }}
/>

                {contactItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pl-14 cursor-pointer">
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: getInputBg(),
                        border: `1px solid ${getBorderColor()}`,
                      }}
                    >
                      <item.icon 
                        className="w-4 h-4" 
                        style={{ color: getAccentColor() }}
                      />
                    </div>
                    <div>
                      <h3 
                        className="font-semibold text-sm"
                        style={{ 
                          color: getTextColor(),
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {item.title}
                      </h3>
                      {item.details.map((line, idx) => (
                        <p 
                          key={idx}
                          className="text-xs leading-relaxed"
                          style={{ 
                            color: getTextMuted(),
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Form */}
            <div 
              className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 border-t md:border-t-0 md:border-l"
              style={{ borderColor: getBorderColor() }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-xl md:text-2xl font-bold font-serif cursor-pointer"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Send us a{' '}
                  <span style={{ color: getAccentColor() }}>Message</span>
                </h2>
            
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="relative group cursor-pointer">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User 
                      className="w-4 h-4 transition-colors"
                      style={{ color: getTextMuted() }}
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-lg focus:outline-none transition-all cursor-text"
                    style={getInputStyle()}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = getAccentColor();
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        e.currentTarget.style.borderColor = getBorderColor();
                      }
                    }}
                  />
                </div>

                {/* Email Field */}
                <div className="relative group cursor-pointer">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail 
                      className="w-4 h-4 transition-colors"
                      style={{ color: getTextMuted() }}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-lg focus:outline-none transition-all cursor-text"
                    style={getInputStyle()}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = getAccentColor();
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        e.currentTarget.style.borderColor = getBorderColor();
                      }
                    }}
                  />
                </div>

                {/* Subject Field */}
                <div className="relative group cursor-pointer">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Tag 
                      className="w-4 h-4 transition-colors"
                      style={{ color: getTextMuted() }}
                    />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                    className="w-full rounded-lg focus:outline-none transition-all cursor-text"
                    style={getInputStyle()}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = getAccentColor();
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        e.currentTarget.style.borderColor = getBorderColor();
                      }
                    }}
                  />
                </div>

                {/* Message Field */}
                <div className="relative group cursor-pointer">
                  <div className="absolute left-3 top-3 pointer-events-none">
                    <MessageSquare 
                      className="w-4 h-4 transition-colors"
                      style={{ color: getTextMuted() }}
                    />
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your message here"
                    rows={4}
                    maxLength={MAX_CHARS}
                    className="w-full rounded-lg focus:outline-none transition-all resize-none cursor-text"
                    style={getTextareaStyle()}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = getAccentColor();
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        e.currentTarget.style.borderColor = getBorderColor();
                      }
                    }}
                  />
                </div>

             {/* Bottom Row */}
<div className="flex items-center justify-end pt-1">
  <span 
    className="text-[10px] font-medium mr-3"
    style={{ 
      color: getTextMuted(),
      fontFamily: "'Calibri Light', sans-serif",
    }}
  >
    {charCount} / {MAX_CHARS}
  </span>
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
    style={{
      backgroundColor: getButtonBg(),
      color: getButtonText(),
      fontFamily: "'Poppins', sans-serif",
    }}
  >
    {isSubmitting ? (
      <svg className="animate-spin w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ) : (
      <Send className="w-5 h-5 md:w-6 md:h-6" />
    )}
  </button>
</div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div 
            className="rounded-xl md:rounded-2xl p-5 md:p-8 max-w-md w-full mx-4 text-center animate-scaleIn"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: `1px solid ${getBorderColor()}`,
            }}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-3 md:mb-4">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
            </div>
            <h3 
              className="text-lg md:text-xl font-bold mb-2 font-serif"
              style={{ 
                color: getTextColor(),
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Message Sent!
            </h3>
            <p 
              className="text-xs md:text-sm mb-4 font-light"
              style={{ 
                color: getTextSecondary(),
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              Thank you for reaching out! We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-5 py-2 md:px-6 md:py-2 rounded-lg font-semibold text-xs md:text-sm hover:scale-105 transition-transform cursor-pointer"
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

      {submitStatus === 'error' && (
        <div 
          className="fixed bottom-4 right-4 p-3 md:p-4 rounded-lg flex items-center gap-3 animate-slideUp border"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
          <p className="text-red-400 text-[10px] md:text-xs" style={{ fontFamily: "'Calibri Light', sans-serif" }}>Failed to send message. Please try again.</p>
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}