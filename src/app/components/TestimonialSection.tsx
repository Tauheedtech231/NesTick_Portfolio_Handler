/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  color: string;
  initials: string;
  badge: string;
  badgeClass: string;
}

const GOLD = "#E8CA5E";
const BLUE = "#0066FF";

const testimonialsData: Testimonial[] = [
  {
    id: 0,
    name: "M. Tauheed",
    role: "UI/UX Designer",
    text: "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
    color: "yellow",
    initials: "MT",
    badge: "★",
    badgeClass: "badge-yellow"
  },
  {
    id: 1,
    name: "Emily Johnson",
    role: "Web Developer",
    text: "The learning experience was amazing! The instructors are very knowledgeable and the curriculum is well-structured.",
    color: "purple",
    initials: "EJ",
    badge: "♥",
    badgeClass: "badge-purple"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    text: "This platform transformed my career. The practical approach to teaching really helped me understand complex concepts easily.",
    color: "blue",
    initials: "MC",
    badge: "👍",
    badgeClass: "badge-blue"
  },
  {
    id: 3,
    name: "Sophia Martinez",
    role: "Graphic Designer",
    text: "Excellent content and great support. The projects are real-world based which helped me build a strong portfolio.",
    color: "yellow",
    initials: "SM",
    badge: "✦",
    badgeClass: "badge-yellow"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Data Scientist",
    text: "One of the best decisions I made for my education. The community is supportive and the resources are top-notch.",
    color: "purple",
    initials: "JW",
    badge: "◆",
    badgeClass: "badge-purple"
  },
  {
    id: 5,
    name: "Sarah Ahmed",
    role: "Marketing Lead",
    text: "The platform helped us streamline our marketing efforts. The analytics and reporting features are exceptional.",
    color: "blue",
    initials: "SA",
    badge: "●",
    badgeClass: "badge-blue"
  }
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });
  const [isMobile, setIsMobile] = useState(false);

  // Animation refs
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number>(null);
  const lastSwitchTime = useRef<number>(performance.now());
  const globalPhase = useRef<number>(0);

  // Avatar states
  const [avatarStates, setAvatarStates] = useState(() => 
    testimonialsData.map((_, i) => ({
      radius: i === 0 ? 0 : 1,
      tween: null as any
    }))
  );

  const N = testimonialsData.length;
  const SPACING = 360 / N;
  
  // Dynamic sizing based on screen
  const getDimensions = () => {
    if (typeof window === 'undefined') return { radius: 220, dockY: -110, avatarSize: 80 };
    
    const width = window.innerWidth;
    if (width < 480) {
      return { radius: 140, dockY: -70, avatarSize: 50 };
    } else if (width < 768) {
      return { radius: 170, dockY: -85, avatarSize: 60 };
    } else if (width < 1024) {
      return { radius: 200, dockY: -100, avatarSize: 70 };
    } else {
      return { radius: 220, dockY: -110, avatarSize: 80 };
    }
  };

  const [dimensions, setDimensions] = useState(getDimensions());
  const RADIUS = dimensions.radius;
  const DOCK_Y = dimensions.dockY;
  const AVATAR_SIZE = dimensions.avatarSize;
  const ROT_DEG_PER_MS = 360 / 20000;
  const SWITCH_MS = 8000;
  const WALK_MS = 700;

  // Detect theme and screen size
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDimensions(getDimensions());
    };
    
    checkTheme();
    checkScreenSize();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // ─── Animation Functions ──────────────────────────────────────────────────
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const polar = (deg: number, r: number) => {
    const rad = deg * Math.PI / 180;
    return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
  };

  const goToIndex = useCallback((newIndex: number) => {
    if (newIndex === activeIndex) return;
    const now = performance.now();
    const oldActive = activeIndex;

    setAvatarStates(prev => {
      const newStates = [...prev];
      newStates[oldActive] = { 
        ...newStates[oldActive], 
        tween: { start: now, duration: WALK_MS, from: newStates[oldActive].radius, to: 1 } 
      };
      newStates[newIndex] = { 
        ...newStates[newIndex], 
        tween: { start: now, duration: WALK_MS, from: newStates[newIndex].radius, to: 0 } 
      };
      return newStates;
    });

    setActiveIndex(newIndex);
    lastSwitchTime.current = now;
  }, [activeIndex]);

  // ─── Animation Loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const frame = (now: number) => {
      const dt = now - lastSwitchTime.current;
      lastSwitchTime.current = now;

      globalPhase.current = (globalPhase.current + ROT_DEG_PER_MS * dt) % 360;

      // Auto switch
      if (now - lastSwitchTime.current >= SWITCH_MS) {
        goToIndex((activeIndex + 1) % N);
      }

      // Update avatar positions
      setAvatarStates(prev => {
        const newStates = prev.map((av, i) => {
          let radius = av.radius;
          if (av.tween) {
            const t = Math.min(1, (now - av.tween.start) / av.tween.duration);
            radius = av.tween.from + (av.tween.to - av.tween.from) * easeInOutCubic(t);
            if (t >= 1) av.tween = null;
          }
          return { ...av, radius };
        });
        return newStates;
      });

      animationRef.current = requestAnimationFrame(frame);
    };

    animationRef.current = requestAnimationFrame(frame);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeIndex, goToIndex, N]);

  // ─── Apply transforms to avatars ──────────────────────────────────────
  useEffect(() => {
    avatarRefs.current.forEach((el, i) => {
      if (!el) return;
      const state = avatarStates[i];
      const angle = (globalPhase.current + i * SPACING) % 360;
      const { x: rx, y: ry } = polar(angle, RADIUS * state.radius);
      const x = rx;
      const y = ry + DOCK_Y * (1 - state.radius);
      const scale = 0.7 + (0.98 - 0.7) * (1 - state.radius);
      
      el.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${scale})`;
      el.style.zIndex = state.radius < 0.3 ? '6' : '2';
      
      el.classList.toggle('docked', state.radius < 0.3);
      
      const color = testimonialsData[i].color;
      if (state.radius < 0.3) {
        el.classList.add(`ring-${color}`);
      } else {
        el.classList.remove(`ring-${color}`);
      }
    });
  }, [avatarStates, RADIUS, DOCK_Y]);

  // ─── Get colors based on theme ──────────────────────────────────────────
  const getColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#0B0F19',
        text: '#FFFFFF',
        textSecondary: '#D1D5DB',
        accent: GOLD,
        accentLight: 'rgba(232, 202, 94, 0.15)',
        modalBg: 'rgba(11, 15, 25, 0.95)',
        border: 'rgba(30, 41, 59, 0.5)',
        circleColor: GOLD, // Gold for dark mode
        circleBorder: 'rgba(255,255,255,0.06)',
        circleDashed: 'rgba(255,255,255,0.08)',
      };
    } else {
      return {
        bg: '#F8FAFF', // Subtle off-white
        text: '#1F2937',
        textSecondary: '#4B5563', // Darker for better contrast
        accent: BLUE,
        accentLight: 'rgba(0, 102, 255, 0.08)',
        modalBg: 'rgba(255, 255, 255, 0.95)',
        border: 'rgba(0, 0, 0, 0.06)',
        circleColor: BLUE, // Blue for light mode
        circleBorder: 'rgba(0, 102, 255, 0.08)',
        circleDashed: 'rgba(0, 102, 255, 0.12)',
      };
    }
  };

  const colors = getColors();

  // ─── Feedback handlers ──────────────────────────────────────────────────
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
        setShowFeedbackModal(false);
        setFeedbackData({
          name: '',
          email: '',
          message: '',
          rating: 5
        });
        alert('Thank you for your feedback!');
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

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const RatingStars = ({ rating, onChange }: { rating: number; onChange: (value: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-xl md:text-2xl cursor-pointer transition-all duration-200 hover:scale-110"
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

  const activeTestimonial = testimonialsData[activeIndex];

  // Get circle container size
  const getCircleSize = () => {
    if (typeof window === 'undefined') return { width: 520, height: 520 };
    const width = window.innerWidth;
    if (width < 480) return { width: 320, height: 320 };
    if (width < 768) return { width: 380, height: 380 };
    if (width < 1024) return { width: 460, height: 460 };
    return { width: 520, height: 520 };
  };

  const circleSize = getCircleSize();

  return (
    <>
      <section 
        className="py-8 md:py-12 lg:py-16 px-4 sm:px-6 relative overflow-hidden min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: colors.bg,
          fontFamily: "'Poppins', sans-serif",
          transition: 'background-color 0.6s ease',
        }}
      >
        <div className="max-w-6xl mx-auto w-full">
          
          {/* ─── Header ─────────────────────────────────────────────────────── */}
          <div className="text-center mb-6 md:mb-8 lg:mb-10">
            <h2 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold cursor-default"
              style={{ 
                color: colors.text,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              What Our Clients <br /> 
              <span style={{ color: colors.accent }}>Say About Us</span>
            </h2>
          </div>

          {/* ─── Main Layout - Circle with Dots Left & Feedback Right ────── */}
          <div className={`flex flex-col ${!isMobile ? 'lg:flex-row' : ''} items-center justify-center gap-4 lg:gap-4`}>
            
            {/* Left Side - Dots (12px size) */}
            <div className={`flex ${!isMobile ? 'lg:flex-col' : 'flex-row'} gap-3 order-2 ${!isMobile ? 'lg:order-1' : ''} ${!isMobile ? 'ml-0 lg:ml-40' : ''} flex-wrap justify-center`}>
              {testimonialsData.map((item, idx) => (
                <button
                  key={item.id}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx ? 'scale-125' : 'scale-100'
                  }`}
                  style={{
                    width: isMobile ? '10px' : '12px',
                    height: isMobile ? '10px' : '12px',
                    backgroundColor: activeIndex === idx 
                      ? colors.accent
                      : theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                    boxShadow: activeIndex === idx 
                      ? `0 0 20px ${colors.accent}`
                      : 'none',
                  }}
                  onClick={() => goToIndex(idx)}
                  aria-label={`Show ${item.name}`}
                />
              ))}
            </div>

            {/* Center - Big Circle with Avatars */}
            <div 
              className="relative flex items-center justify-center order-1 lg:order-2"
              style={{
                width: circleSize.width,
                height: circleSize.height,
              }}
            >
              {/* Outer Circle Line - Theme aware */}
              <div 
                className="absolute rounded-full"
                style={{
                  width: circleSize.width - 60,
                  height: circleSize.height - 60,
                  border: `2px solid ${colors.circleBorder}`,
                  background: 'transparent', // No gradient
                }}
              />
              
              {/* Orbit Circle Line - Theme aware */}
              <div 
                className="absolute rounded-full"
                style={{
                  width: circleSize.width - 100,
                  height: circleSize.height - 100,
                  border: `1.5px dashed ${colors.circleDashed}`,
                }}
              />

              {/* Pivot for Avatars */}
              <div className="pivot">
                {testimonialsData.map((item, i) => (
                  <div
                    key={item.id}
                    ref={(el) => { avatarRefs.current[i] = el; }}
                    className="avatar"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: AVATAR_SIZE,
                      height: AVATAR_SIZE,
                      borderRadius: '50%',
                    }}
                  >
                    {/* Avatar Circle with Initials */}
                    <div 
                      className="avatar-circle"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '14px' : '24px',
                        fontWeight: '700',
                        color: '#fff',
                        background: `linear-gradient(135deg, ${item.color === 'yellow' ? '#facc15' : item.color === 'purple' ? '#8b5cf6' : '#38bdf8'}, ${item.color === 'yellow' ? '#f59e0b' : item.color === 'purple' ? '#7c3aed' : '#0ea5e9'})`,
                        border: '2px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {item.initials}
                    </div>
                    <div className="avatar-name">{item.name}</div>
                    <div 
                      className={`avatar-badge ${item.badgeClass}`}
                      style={{
                        width: isMobile ? '20px' : '26px',
                        height: isMobile ? '20px' : '26px',
                        fontSize: isMobile ? '9px' : '11px',
                      }}
                    >
                      {item.badge}
                    </div>
                  </div>
                ))}
              </div>

              {/* Center Card - Testimonial Display */}
              <div 
                className="center-card"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: isMobile ? '160px' : (circleSize.width < 460 ? '200px' : '240px'),
                  maxWidth: '90%',
                  textAlign: 'center',
                  zIndex: 5,
                  background: theme === 'dark' ? 'rgba(11, 15, 25, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(16px)',
                  padding: isMobile ? '12px 10px' : '18px 16px',
                  borderRadius: '24px',
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                }}
              >
                <div 
                  className="text-xl md:text-2xl font-bold leading-none mb-0.5"
                  style={{ color: colors.accent }}
                >
                  &ldquo;
                </div>
                <p 
                  className="text-[10px] sm:text-[11px] md:text-xs leading-relaxed mb-1.5 md:mb-2"
                  style={{ 
                    color: colors.textSecondary,
                    minHeight: isMobile ? '30px' : '40px',
                    lineHeight: '1.5',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {activeTestimonial.text.length > (isMobile ? 80 : 110) 
                    ? activeTestimonial.text.substring(0, isMobile ? 80 : 110) + '...' 
                    : activeTestimonial.text}
                </p>
                <h4 
                  className="font-bold text-xs sm:text-sm md:text-base leading-tight"
                  style={{ color: colors.text }}
                >
                  {activeTestimonial.name}
                </h4>
                <p 
                  className="text-[8px] sm:text-[9px] md:text-[10px]"
                  style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                >
                  {activeTestimonial.role}
                </p>
              </div>
            </div>

            {/* Right Side - Feedback Button */}
            <div className={`order-3 ${!isMobile ? 'mr-0 lg:mr-2' : 'mt-2'}`}>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 lg:px-8 lg:py-4 rounded-2xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-xl whitespace-nowrap"
                style={{
                  backgroundColor: colors.accent,
                  color: theme === 'dark' ? '#0B0F19' : '#FFFFFF',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                ✍️ Give Feedback
              </button>
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
              className="relative w-full max-w-lg rounded-2xl p-5 md:p-6 lg:p-8"
              style={{
                backgroundColor: colors.modalBg,
                border: `1px solid ${colors.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-3 right-3 md:top-4 md:right-4 p-1 rounded-full hover:bg-gray-100/10 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.text }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 
                className="text-lg md:text-xl lg:text-2xl font-bold mb-2"
                style={{ 
                  color: colors.text,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Share Your Feedback
              </h3>
              <p 
                className="text-xs md:text-sm mb-4 md:mb-5"
                style={{ 
                  color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                }}
              >
                We value your opinion. Help us improve our services.
              </p>

              <form onSubmit={handleFeedbackSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label 
                    className="block text-xs md:text-sm font-medium mb-1.5"
                    style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
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
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs md:text-sm font-medium mb-1.5"
                    style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
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
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border text-xs md:text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs md:text-sm font-medium mb-2"
                    style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                    }}
                  >
                    Rating *
                  </label>
                  <RatingStars 
                    rating={feedbackData.rating} 
                    onChange={(value) => setFeedbackData(prev => ({ ...prev, rating: value }))} 
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs md:text-sm font-medium mb-1.5"
                    style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
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
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-xl border text-xs md:text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                    placeholder="Tell us about your experience..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: colors.accent,
                    color: theme === 'dark' ? '#0B0F19' : '#FFFFFF',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .pivot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0;
          height: 0;
        }

        .avatar {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          will-change: transform;
          transition: filter 0.3s;
        }

        .avatar-name {
          position: absolute;
          bottom: -22px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 600;
          color: #e5e7eb;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          padding: 2px 12px;
          border-radius: 20px;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.08);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .avatar.docked .avatar-name {
          opacity: 1;
          background: rgba(0, 0, 0, 0.85);
        }

        .avatar-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #0d0d24;
        }

        .badge-yellow { 
          background: #241c04; 
          color: #facc15; 
          box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.5); 
        }
        .badge-purple { 
          background: #241833; 
          color: #8b5cf6; 
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.5); 
        }
        .badge-blue { 
          background: #04202b; 
          color: #38bdf8; 
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.5); 
        }

        .ring-yellow { box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.55); }
        .ring-purple { box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.55); }
        .ring-blue { box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.55); }

        /* Mobile specific overrides */
        @media (max-width: 480px) {
          .avatar-name {
            font-size: 7px !important;
            bottom: -16px !important;
            padding: 1px 6px !important;
          }
          .avatar-badge {
            border-width: 2px !important;
          }
        }

        /* Tablet specific adjustments */
        @media (min-width: 481px) and (max-width: 768px) {
          .avatar-name {
            font-size: 8px !important;
            bottom: -18px !important;
            padding: 1px 8px !important;
          }
        }
      `}</style>
    </>
  );
}