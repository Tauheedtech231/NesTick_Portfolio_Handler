'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  imageUrl: string;
}

interface FeedbackData {
  name: string;
  email: string;
  message: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 3,
    name: "Michael Chen",
    role: "Product Manager",
    text: "This platform transformed my career. The practical approach to teaching really helped me understand complex concepts easily.",
    imageUrl: "/img3.jpg"
  },
  {
    id: 4,
    name: "Sophia Martinez",
    role: "Graphic Designer",
    text: "Excellent content and great support. The projects are real-world based which helped me build a strong portfolio.",
    imageUrl: "/img4.jpg"
  }
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    name: '',
    email: '',
    message: '',
    rating: 5
  });

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

  // Auto-change testimonial every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Check if feedback already submitted
  useEffect(() => {
    const hasSubmitted = localStorage.getItem('feedbackSubmitted');
    if (hasSubmitted === 'true') {
      setFeedbackSubmitted(true);
    }
  }, []);

  const currentTestimonial = testimonials[currentIndex];

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
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
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
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* ─── LEFT - Description ──────────────────────────────────────────── */}
          <div className="flex-1 max-w-xl md:ml-[2%] z-10">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 cursor-pointer"
              style={{
                backgroundColor: colors.accentLight,
                transition: 'background-color 0.6s ease',
              }}
            >
              <span 
                className="text-xs font-medium"
                style={{ 
                  color: colors.accent,
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.6s ease',
                }}
              >
                💬 Testimonials
              </span>
            </div>

            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-serif cursor-default"
              style={{ 
                color: colors.text,
                fontFamily: "'Poppins', sans-serif",
                transition: 'color 0.6s ease',
              }}
            >
              What Our Clients <br /> Say About Us
            </h2>

            {/* Quote Icon */}
            <div 
              className="text-4xl leading-none mb-3 cursor-default"
              style={{ color: colors.accent }}
            >
              “
            </div>

            {/* Text with animation */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-base md:text-lg leading-relaxed mb-4 cursor-default"
                style={{ 
                  color: colors.textSecondary,
                  fontFamily: "'Calibri Light', sans-serif",
                  transition: 'color 0.6s ease',
                }}
              >
                {currentTestimonial.text}
              </motion.p>
            </AnimatePresence>

            {/* Divider */}
            <div 
              className="w-12 h-0.5 rounded-full mb-4"
              style={{ 
                backgroundColor: colors.accent,
                transition: 'background-color 0.6s ease',
              }}
            />

            {/* Author */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h4 
                  className="font-semibold text-base cursor-default"
                  style={{ 
                    color: colors.text,
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'color 0.6s ease',
                  }}
                >
                  {currentTestimonial.name}
                </h4>
                <p 
                  className="text-sm cursor-default"
                  style={{ 
                    color: colors.textMuted,
                    fontFamily: "'Calibri Light', sans-serif",
                    transition: 'color 0.6s ease',
                  }}
                >
                  {currentTestimonial.role}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots - Only 2 dots */}
            <div className="flex gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: currentIndex === idx ? "24px" : "8px",
                    backgroundColor: currentIndex === idx 
                      ? colors.accent 
                      : (theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
                    transition: 'background-color 0.3s ease, width 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* ─── FEEDBACK BUTTON ───────────────────────────────────────────── */}
            {!feedbackSubmitted ? (
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="mt-6 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
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
                className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-default"
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

          {/* ─── RIGHT - Parallelogram with Background Image (Smaller) ────────────────── */}
          <div className="relative flex-shrink-0 w-full max-w-sm md:max-w-md md:mr-[2%]">
            {/* Wrapper */}
            <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
              
              {/* Parallelogram Container - NO BORDER, SMALLER */}
              <div 
                className="absolute inset-0 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                style={{
                  clipPath: 'polygon(22% 0%, 100% 0%, 78% 100%, 0% 100%)',
                  boxShadow: `0 0 30px ${colors.accent}20`,
                  transition: 'box-shadow 0.6s ease, transform 0.3s ease',
                  border: 'none',
                  transform: 'scale(0.85)',
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src="/back.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {/* Dark/Light overlay for better visibility */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: theme === 'dark' 
                        ? 'linear-gradient(135deg, rgba(11, 15, 25, 0.7), rgba(11, 15, 25, 0.3))'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))',
                    }}
                  />
                </div>

                {/* Profile Image - Centered, increased height */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div 
                    className="relative"
                    style={{
                      width: '70%',
                      height: '85%',
                      overflow: 'hidden',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full h-full relative"
                      >
                        <Image
                          src={currentTestimonial.imageUrl}
                          alt={currentTestimonial.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEEDBACK MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
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
                className="text-sm mb-6 cursor-default"
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
                    className="block text-sm font-medium mb-1.5 cursor-default"
                    style={{ 
                      color: colors.textSecondary,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Rating *
                  </label>
                  <select
                    name="rating"
                    value={feedbackData.rating}
                    onChange={handleFeedbackChange}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer appearance-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.text,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ - Very Good</option>
                    <option value={3}>⭐⭐⭐ - Good</option>
                    <option value={2}>⭐⭐ - Fair</option>
                    <option value={1}>⭐ - Poor</option>
                  </select>
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
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: colors.accent,
                    color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Submit Feedback
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}