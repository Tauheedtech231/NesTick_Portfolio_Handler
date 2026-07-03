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
  XCircle,
  ArrowRight
} from 'lucide-react';

// ==========================================
// BRAND COLORS - Consistent with PartnerSection
// ==========================================
const GOLD = "#E8CA5E";
const BLUE = "#0066FF";

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

  // ==========================================
  // DESIGNER CHANGES: THEME COLORS WITH DEPTH
  // ==========================================

  // 1️⃣ Background - Gradient for depth (not flat)
  const getBgColor = () => {
    if (theme === 'dark') return '#0B0F19';
    // Light theme: subtle gradient for visual depth
    return 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)';
  };

  // 2️⃣ Card Background - Clean with subtle depth
  const getCardBg = () => {
    if (theme === 'dark') return 'rgba(15, 23, 42, 0.6)';
    return 'rgba(255, 255, 255, 0.92)';
  };

  // 3️⃣ Border - Subtle & refined
  const getBorderColor = () => {
    if (theme === 'dark') return 'rgba(30, 41, 59, 0.5)';
    return 'rgba(0, 0, 0, 0.06)';
  };

  // 4️⃣ Text Colors - Better contrast for readability
  const getTextColor = () => {
    if (theme === 'dark') return '#F1F5F9';
    return '#0F172A'; // Darker for better contrast
  };

  const getTextSecondary = () => {
    if (theme === 'dark') return '#D1D5DB';
    return '#334155';
  };

  const getTextMuted = () => {
    if (theme === 'dark') return '#94A3B8';
    return '#475569'; // Better readability
  };

  // 5️⃣ Input Background - Consistent with theme
  const getInputBg = () => {
    if (theme === 'dark') return 'rgba(11, 15, 25, 0.8)';
    return 'rgba(249, 250, 251, 0.9)';
  };

  // 6️⃣ Button - Brand colors (Blue in light, Gold in dark)
  const getButtonBg = () => {
    return theme === 'dark' ? GOLD : BLUE;
  };

  const getButtonText = () => {
    return theme === 'dark' ? '#1F4381' : '#FFFFFF';
  };

  // 7️⃣ Accent Color - Consistent Gold
  const getAccentColor = () => GOLD;

  // 8️⃣ Icon Background
  const getIconBg = () => {
    if (theme === 'dark') return '#1F2937';
    return '#f1f5f9';
  };

  const getIconBorder = () => GOLD;
  const getIconColor = () => theme === 'dark' ? '#FFFFFF' : '#0F172A';

  // 9️⃣ Curve & Line Colors
  const getCurveColor = () => {
    if (theme === 'dark') return 'rgba(148, 163, 184, 0.3)';
    return 'rgba(0, 0, 0, 0.15)';
  };

  const getCenterLineColor = () => {
    if (theme === 'dark') return 'rgba(148, 163, 184, 0.3)';
    return 'rgba(0, 0, 0, 0.15)';
  };

  // 🔟 Arrow Circle
  const getArrowCircleBg = () => GOLD;
  const getArrowColor = () => '#FFFFFF';

  // 1️⃣1️⃣ Input Style - Larger & refined
  const getInputStyle = () => ({
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.8rem',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    backgroundColor: getInputBg(),
    border: `1px solid ${getBorderColor()}`,
    color: getTextColor(),
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Calibri Light', sans-serif",
    boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.02)' : 'none',
  });

  const getTextareaStyle = () => ({
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.8rem',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    backgroundColor: getInputBg(),
    border: `1px solid ${getBorderColor()}`,
    color: getTextColor(),
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Calibri Light', sans-serif",
    resize: 'none' as const,
    minHeight: '140px',
    boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.02)' : 'none',
  });

  // 1️⃣2️⃣ Focus Style
  const getFocusStyle = () => ({
    borderColor: getAccentColor(),
    boxShadow: `0 0 0 4px ${getAccentColor()}15`,
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

  const contactItems = [
    {
      icon: MapPin,
      title: 'Office Address',
      details: ['Johar Town,', 'Lahore, Pakistan']
    },
    {
      icon: Phone,
      title: 'Contact Info',
      details: ['03237594869', 'neezamiya@gmail.com']
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
      className="py-12 px-4 sm:px-6 relative overflow-hidden"
      style={{ 
        background: getBgColor(), 
        fontFamily: "'Poppins', sans-serif",
        boxShadow: theme === 'light' ? 'inset 0 1px 0 rgba(255,255,255,0.8)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            backgroundColor: getCardBg(),
            border: `1px solid ${getBorderColor()}`,
            boxShadow: theme === 'light' 
              ? '0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' 
              : '0 4px 24px rgba(0,0,0,0.2)',
          }}
        >
          <div className="flex flex-col md:flex-row relative">
            {/* ─── CENTER DIVIDER LINE WITH ARROW ─── */}
            <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center z-20">
              <div className="flex-1 w-[2px]"
                style={{ 
                  background: `linear-gradient(to bottom, transparent, ${getCenterLineColor()})`,
                }}
              />
              
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative cursor-pointer group transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  backgroundColor: getArrowCircleBg(),
                  border: `2px solid ${getAccentColor()}`,
                  zIndex: 2,
                  boxShadow: `0 0 30px ${getAccentColor()}20`,
                }}
              >
                <ArrowRight 
                  className="w-6 h-6 relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(232,202,94,0.6)] group-hover:scale-110"
                  style={{ color: getArrowColor() }}
                />
              </div>
              
              <div className="flex-1 w-[2px]"
                style={{ 
                  background: `linear-gradient(to top, transparent, ${getCenterLineColor()})`,
                }}
              />
            </div>

            {/* Left Column - Contact Info - 50% width */}
            <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 relative z-10 pr-6 md:pr-10">
              <div className="mb-8 md:mb-10">
                <h1 className="text-2xl md:text-3xl font-bold font-serif leading-tight cursor-pointer"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Let's<br />
                  <span 
                    className="inline-block"
                    style={{ 
                      color: getAccentColor(),
                    }}
                  >
                    Connect
                  </span>
                </h1>
                <p 
                  className="mt-4 max-w-xs leading-relaxed cursor-pointer text-base"
                  style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Calibri Light', sans-serif",
                  }}
                >
                  Have questions about our courses or training programs? We're here to help you.
                </p>
              </div>

              {/* Contact Details - WITH CURVE SHAPE AND GAPS */}
              <div className="space-y-10 relative">
                
                {/* Curved Timeline Line */}
                <svg 
                  className="absolute left-[10px] top-6 bottom-6 w-8 h-[calc(100%-48px)]"
                  preserveAspectRatio="none" 
                  viewBox="0 0 40 100" 
                  fill="none"
                >
                  <path 
                    d="M7 0 Q 45 50 7 100" 
                    stroke={getCurveColor()} 
                    strokeWidth="2.5" 
                    fill="none"
                  />
                </svg>
                
                {/* Top Dot - GOLD */}
                <div 
                  className="absolute w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: getAccentColor(),
                    left: 'calc(6px + 0.2rem)',
                    top: '17px',
                  }}
                />
                
                {/* Middle Dot - GOLD */}
                <div 
                  className="absolute w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: getAccentColor(),
                    left: 'calc(6px + 1.2rem)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                
                {/* Bottom Dot - GOLD */}
                <div 
                  className="absolute w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: getAccentColor(),
                    left: 'calc(6px + 0.2rem)',
                    bottom: 'calc(-1.5rem + 0px)',
                  }}
                />

                {contactItems.map((item, index) => {
                  let plValue = 'pl-14';
                  
                  if (index === 0) {
                    plValue = 'pl-16';
                  } else if (index === 1) {
                    plValue = 'pl-20';
                  } else if (index === 2) {
                    plValue = 'pl-16';
                  }
                  
                  return (
                    <div key={index} className={`flex items-start gap-6 ${plValue} cursor-pointer`}>
                      <div 
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                          backgroundColor: getIconBg(),
                          border: `2px solid ${getIconBorder()}`,
                          boxShadow: theme === 'light' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                        }}
                      >
                        <item.icon 
                          className="w-5 h-5" 
                          style={{ color: getIconColor() }}
                        />
                      </div>
                      <div>
                        <h3 
                          className="font-semibold text-base"
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
                            className="text-sm leading-relaxed"
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
                  );
                })}
              </div>
            </div>

            {/* Right Column - Form - 50% width */}
            <div 
              className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 border-t md:border-t-0 pl-6 md:pl-10"
              style={{ borderColor: getBorderColor() }}
            >
              <div className="mb-8">
                <h2 
                  className="text-2xl md:text-3xl font-bold font-serif text-center cursor-pointer"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Send us a{' '}
                  <span 
                    className="inline-block"
                    style={{ 
                      color: getAccentColor(),
                    }}
                  >
                    Message
                  </span>
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="relative group cursor-pointer">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User 
                      className="w-5 h-5 transition-colors"
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
                    className="w-full rounded-xl focus:outline-none transition-all cursor-text"
                    style={getInputStyle()}
                    onFocus={(e) => {
                      Object.assign(e.currentTarget.style, getFocusStyle());
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        e.currentTarget.style.borderColor = getBorderColor();
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>

                {/* Email Field */}
                <div className="relative group cursor-pointer">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail 
                      className="w-5 h-5 transition-colors"
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
                    className="w-full rounded-xl focus:outline-none transition-all cursor-text"
                    style={getInputStyle()}
                    onFocus={(e) => {
                      Object.assign(e.currentTarget.style, getFocusStyle());
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        e.currentTarget.style.borderColor = getBorderColor();
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>

                {/* Subject Field */}
                <div className="relative group cursor-pointer">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Tag 
                      className="w-5 h-5 transition-colors"
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
                    className="w-full rounded-xl focus:outline-none transition-all cursor-text"
                    style={getInputStyle()}
                    onFocus={(e) => {
                      Object.assign(e.currentTarget.style, getFocusStyle());
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        e.currentTarget.style.borderColor = getBorderColor();
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>

                {/* Message Field */}
                <div className="relative group cursor-pointer">
                  <div className="absolute left-3 top-3 pointer-events-none">
                    <MessageSquare 
                      className="w-5 h-5 transition-colors"
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
                    className="w-full rounded-xl focus:outline-none transition-all resize-none cursor-text"
                    style={getTextareaStyle()}
                    onFocus={(e) => {
                      Object.assign(e.currentTarget.style, getFocusStyle());
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        e.currentTarget.style.borderColor = getBorderColor();
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-end pt-1">
                  <span 
                    className="text-xs font-medium mr-3"
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
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg"
                    style={{
                      backgroundColor: getButtonBg(),
                      color: getButtonText(),
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: theme === 'light' 
                        ? '0 4px 16px rgba(0, 102, 255, 0.25)' 
                        : '0 4px 16px rgba(232, 202, 94, 0.25)',
                    }}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <Send className="w-6 h-6 md:w-7 md:h-7" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal - Updated with theme */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div 
            className="rounded-xl md:rounded-2xl p-5 md:p-8 max-w-md w-full mx-4 text-center animate-scaleIn"
            style={{
              backgroundColor: getCardBg(),
              border: `1px solid ${getBorderColor()}`,
              boxShadow: theme === 'light' 
                ? '0 20px 60px rgba(0,0,0,0.10)' 
                : '0 20px 60px rgba(0,0,0,0.30)',
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
            backgroundColor: getCardBg(),
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