'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
}

interface FeedbackData {
  name: string;
  email: string;
  message: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Parker Robert",
    role: "UI Designer",
    text: "when an unknown printer took a galley of type and scrambled to make a type specimen book. It has survived not only five centuries, but also the leap into electronic."
  },
  {
    id: 2,
    name: "Emily Johnson",
    role: "Web Developer",
    text: "The learning experience was amazing! The instructors are very knowledgeable and the curriculum is well-structured."
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Product Manager",
    text: "This platform transformed my career. The practical approach to teaching really helped me understand complex concepts easily."
  },
  {
    id: 4,
    name: "Sophia Martinez",
    role: "Graphic Designer",
    text: "Excellent content and great support. The projects are real-world based which helped me build a strong portfolio."
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Data Scientist",
    text: "One of the best decisions I made for my education. The community is supportive and the resources are top-notch."
  },
  {
    id: 6,
    name: "Sarah Ahmed",
    role: "Marketing Lead",
    text: "The platform helped us streamline our marketing efforts. The analytics and reporting features are exceptional."
  }
];

export default function TestimonialSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    name: '',
    email: '',
    message: '',
    rating: 5
  });

  const itemsPerPage = 3;
  const totalItems = testimonials.length;

  // Detect theme
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

  // ─── NO AUTO-SLIDE ─────────────────────────────────────────────────────────
  // Auto-slide removed completely

  // Check if feedback already submitted
  useEffect(() => {
    const hasSubmitted = localStorage.getItem('feedbackSubmitted');
    if (hasSubmitted === 'true') {
      setFeedbackSubmitted(true);
    }
  }, []);

  // ─── Only Dot Click ──────────────────────────────────────────────────────
  const goToIndex = (index: number) => {
    if (index === startIndex) return;
    setStartIndex(index);
  };

  // ─── Get current items ──────────────────────────────────────────────────────
  const getCurrentItems = () => {
    const items: Testimonial[] = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (startIndex + i) % totalItems;
      items.push(testimonials[index]);
    }
    return items;
  };

  const currentItems = getCurrentItems();

  // ─── TEMPLATES COLORS ──────────────────────────────────────────────────────
  const getColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#0B0F19',
        cardBg: '#0F172A',
        text: '#FFFFFF',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        border: 'rgba(30, 41, 59, 0.5)',
        accent: '#E8CA5E',
        accentLight: 'rgba(232, 202, 94, 0.15)',
        inputBg: 'rgba(11, 15, 25, 0.8)',
        modalBg: 'rgba(11, 15, 25, 0.95)',
      };
    } else {
      return {
        bg: '#FFFFFF',
        cardBg: '#F8F9FA',
        text: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        border: 'rgba(0, 0, 0, 0.06)',
        accent: '#0066FF',
        accentLight: 'rgba(0, 102, 255, 0.08)',
        inputBg: 'rgba(249, 250, 251, 0.9)',
        modalBg: 'rgba(255, 255, 255, 0.95)',
      };
    }
  };

  const colors = getColors();

  // ─── Feedback handlers ─────────────────────────────────────────────────────
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('feedbackSubmitted', 'true');
        localStorage.setItem('feedbackData', JSON.stringify(feedbackData));
        
        setFeedbackSubmitted(true);
        setShowFeedbackModal(false);
        
        setFeedbackData({
          name: '',
          email: '',
          message: '',
          rating: 5
        });
      } else {
        throw new Error(result.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  // ─── Rating Stars ──────────────────────────────────────────────────────────
  const RatingStars = ({ rating, onChange }: { rating: number; onChange: (value: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-xl cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              color: star <= rating ? colors.accent : (theme === 'dark' ? '#374151' : '#D1D5DB'),
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <section 
        className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: colors.bg,
          fontFamily: "'Poppins', sans-serif",
          transition: 'background-color 0.6s ease',
        }}
      >
        <div className="max-w-6xl mx-auto">
          
          {/* ─── Header ─────────────────────────────────────────────────────── */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
              style={{
                backgroundColor: colors.accentLight,
              }}
            >
              <span className="text-xs font-medium" style={{ 
                color: colors.accent,
                fontFamily: "'Poppins', sans-serif",
              }}>
                💬 Testimonials
              </span>
            </div>

            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif cursor-default"
              style={{ 
                color: colors.text,
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '6px',
              }}
            >
              What Our Clients <br /> Say About Us
            </h2>

            <p 
              className="text-sm md:text-base font-light tracking-wide cursor-default"
              style={{ 
                color: colors.textSecondary,
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              Real stories from real people who trusted us
            </p>
          </div>

          {/* ─── SLIDER - 3 Items ───────────────────────────────────────────── */}
          <div className="relative overflow-hidden">
            
            {/* Cards Grid - 3 items - NO SMOOTHNESS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {currentItems.map((testimonial, idx) => (
                <div
                  key={`${startIndex}-${testimonial.id}`}
                  className="rounded-2xl p-5 md:p-6 flex flex-col items-center text-center transition-all duration-200"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    boxShadow: theme === 'dark' 
                      ? '0 4px 20px rgba(0,0,0,0.2)' 
                      : '0 4px 20px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Quote */}
                  <div className="text-3xl leading-none mb-2" style={{ color: colors.accent }}>
                    “
                  </div>
                  
                  <p 
                    className="text-sm leading-relaxed mb-4 line-clamp-4"
                    style={{ 
                      color: colors.textSecondary,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    {testimonial.text}
                  </p>
                  
                  <div className="w-10 h-0.5 rounded-full mb-3" style={{ backgroundColor: colors.accent }} />
                  
                  <h4 
                    className="font-semibold text-sm"
                    style={{ 
                      color: colors.text,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {testimonial.name}
                  </h4>
                  <p 
                    className="text-xs"
                    style={{ 
                      color: colors.textMuted,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Dots Indicator - 6 Dots ───────────────────────────────────── */}
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className="h-2 rounded-full transition-all duration-200 cursor-pointer"
                style={{
                  width: startIndex === idx ? "28px" : "8px",
                  backgroundColor: startIndex === idx 
                    ? colors.accent 
                    : (theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
                }}
              />
            ))}
          </div>

          {/* ─── FEEDBACK BUTTON ───────────────────────────────────────────── */}
          {!feedbackSubmitted ? (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="mt-6 mx-auto block px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: colors.accent,
                color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              ✍️ Give Feedback
            </button>
          ) : (
            <div 
              className="mt-6 mx-auto flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-default w-fit"
              style={{
                backgroundColor: colors.accentLight,
                border: `1px solid ${colors.accent}`,
              }}
            >
              <span className="text-sm" style={{ color: colors.accent }}>
                ✅ Thank you for your feedback!
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ─── FEEDBACK MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-lg rounded-2xl p-6 md:p-8"
              style={{
                backgroundColor: colors.modalBg,
                border: `1px solid ${colors.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100/10 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.text }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 
                className="text-xl md:text-2xl font-bold mb-2 font-serif cursor-default"
                style={{ 
                  color: colors.text,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Share Your Feedback
              </h3>
              <p 
                className="text-sm mb-5 cursor-default"
                style={{ 
                  color: colors.textSecondary,
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                We value your opinion. Help us improve our services.
              </p>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-1.5 cursor-default"
                    style={{ 
                      color: colors.textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={feedbackData.name}
                    onChange={handleFeedbackChange}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all cursor-text"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.text,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-1.5 cursor-default"
                    style={{ 
                      color: colors.textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={feedbackData.email}
                    onChange={handleFeedbackChange}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all cursor-text"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.text,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2 cursor-default"
                    style={{ 
                      color: colors.textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Rating *
                  </label>
                  <RatingStars 
                    rating={feedbackData.rating} 
                    onChange={(value) => setFeedbackData(prev => ({ ...prev, rating: value }))} 
                  />
                  <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                    {feedbackData.rating === 5 && '⭐ Excellent'}
                    {feedbackData.rating === 4 && '⭐ Very Good'}
                    {feedbackData.rating === 3 && '⭐ Good'}
                    {feedbackData.rating === 2 && '⭐ Fair'}
                    {feedbackData.rating === 1 && '⭐ Poor'}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-1.5 cursor-default"
                    style={{ 
                      color: colors.textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Your Feedback *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={feedbackData.message}
                    onChange={handleFeedbackChange}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all resize-none cursor-text"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.text,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                    placeholder="Tell us about your experience..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: colors.accent,
                    color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}