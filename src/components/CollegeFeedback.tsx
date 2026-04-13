'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Sparkles, Users, Heart, School, Briefcase, Calendar } from "lucide-react";

interface FeedbackData {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  rating: number;
  feedback: string;
  suggestions: string;
  date: string;
  status: string;
}

// Single default avatar image for all users
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&q=80";

// College Portfolio related dummy feedback
const DUMMY_COLLEGE_FEEDBACKS: FeedbackData[] = [
  {
    id: 'dummy-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'College Administrator',
    institution: 'Stanford University',
    rating: 5,
    feedback: 'Portfolio Handler has revolutionized how we manage student portfolios. The interface is intuitive and the analytics are spot-on!',
    suggestions: 'Would love to see more integration options with existing LMS platforms.',
    date: '2024-12-15T10:30:00Z',
    status: 'approved'
  },
  {
    id: 'dummy-2',
    name: 'Prof. Michael Chen',
    email: 'm.chen@techinstitute.edu',
    role: 'Faculty Member',
    institution: 'MIT',
    rating: 5,
    feedback: 'Excellent platform for tracking student progress. The customization options are fantastic.',
    suggestions: 'Adding a mobile app would make it even better.',
    date: '2024-12-10T14:20:00Z',
    status: 'approved'
  },
  {
    id: 'dummy-3',
    name: 'Emily Rodriguez',
    email: 'emily.r@students.ucla.edu',
    role: 'Student',
    institution: 'UCLA',
    rating: 4,
    feedback: 'Great tool for showcasing my projects! The templates are beautiful and easy to use.',
    suggestions: 'More template options for creative portfolios would be nice.',
    date: '2024-12-05T09:15:00Z',
    status: 'approved'
  },
  {
    id: 'dummy-4',
    name: 'David Kim',
    email: 'd.kim@harvard.edu',
    role: 'IT Manager',
    institution: 'Harvard University',
    rating: 5,
    feedback: 'Secure, reliable, and feature-rich. Our team loves the collaboration features.',
    suggestions: 'API documentation could be more detailed.',
    date: '2024-11-28T16:45:00Z',
    status: 'approved'
  },
  {
    id: 'dummy-5',
    name: 'Lisa Thompson',
    email: 'l.thompson@columbia.edu',
    role: 'Department Head',
    institution: 'Columbia University',
    rating: 5,
    feedback: 'Outstanding platform that has improved our department\'s efficiency significantly.',
    suggestions: 'Real-time collaboration features would be a game-changer.',
    date: '2024-11-20T11:00:00Z',
    status: 'approved'
  },
  {
    id: 'dummy-6',
    name: 'Prof. James Wilson',
    email: 'j.wilson@princeton.edu',
    role: 'Academic Dean',
    institution: 'Princeton University',
    rating: 5,
    feedback: 'The portfolio assessment tools are exactly what we needed. It has streamlined our evaluation process.',
    suggestions: 'Would be great to have AI-powered feedback suggestions.',
    date: '2024-11-15T09:00:00Z',
    status: 'approved'
  }
];

export default function StudentFeedback() {
  const [selected, setSelected] = useState<FeedbackData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [circleSize, setCircleSize] = useState(500);
  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  useEffect(() => {
    setMounted(true);
    
    const calculateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      if (vw >= 1024) {
        const minSize = Math.min(vw * 0.45, vh * 0.7, 700);
        setCircleSize(minSize);
      } else {
        const minSize = Math.min(vw * 0.8, vh * 0.4, 450);
        setCircleSize(minSize);
      }
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    
    // Load feedbacks from localStorage
    loadFeedbacks();
    
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  const loadFeedbacks = () => {
    setIsLoading(true);
    try {
      // Get user feedbacks from localStorage
      const storedFeedbacks = localStorage.getItem('userFeedbacks');
      const userFeedbacks: FeedbackData[] = storedFeedbacks ? JSON.parse(storedFeedbacks) : [];
      
      // Filter only approved feedbacks
      const approvedFeedbacks = userFeedbacks.filter(f => f.status === 'approved');
      
      if (approvedFeedbacks.length > 0) {
        // Show user feedbacks first, then dummy data if needed
        let combined = [...approvedFeedbacks];
        
        // Add dummy data if we have less than 6 feedbacks total
        if (combined.length < 6) {
          const dummyNeeded = DUMMY_COLLEGE_FEEDBACKS.slice(0, 6 - combined.length);
          combined = [...combined, ...dummyNeeded];
        }
        
        setAllFeedbacks(combined);
      } else {
        // Show dummy data if no approved feedbacks
        setAllFeedbacks(DUMMY_COLLEGE_FEEDBACKS);
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setAllFeedbacks(DUMMY_COLLEGE_FEEDBACKS);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh feedbacks when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userFeedbacks') {
        loadFeedbacks();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for feedback submission
    const handleFeedbackSubmitted = () => {
      loadFeedbacks();
    };
    
    window.addEventListener('feedbackSubmitted', handleFeedbackSubmitted);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('feedbackSubmitted', handleFeedbackSubmitted);
    };
  }, []);

  // Handle feedback click
  const handleFeedbackClick = (feedback: FeedbackData) => {
    console.log('Feedback clicked:', feedback);
    setSelected(feedback);
  };

  if (!mounted || isLoading) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-3 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.2)' : 'rgba(0, 160, 255, 0.2)',
              borderTopColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
            }}
          />
          <p className="text-sm"
            style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
          >
            Loading feedbacks...
          </p>
        </div>
      </section>
    );
  }

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  
  const ringSizes = {
    large: isDesktop ? circleSize * 1.3 : circleSize * 1.2,
    medium: circleSize,
    small: isDesktop ? circleSize * 0.75 : circleSize * 0.7,
    orbit: isDesktop ? circleSize * 0.75 : circleSize * 0.7
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start lg:justify-center py-12 lg:py-8 overflow-hidden"
      style={{
        backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
      }}
    >
      {/* Background - No gradients, just subtle blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{
            backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
          }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{
            backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Center Content */}
        <div className="text-center max-w-2xl px-4 mb-8 lg:mb-12 mt-8 lg:mt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 lg:mb-6 mx-auto w-fit"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 160, 255, 0.1)',
              border: 'none',
            }}
          >
            <School className="w-3.5 h-3.5"
              style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
            />
            <span className="text-xs font-medium font-sans tracking-wide"
              style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
            >
              College Portfolio Management
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-serif"
            style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
          >
            Portfolio Handler
          </h2>
          <p className="mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg font-light tracking-wide"
            style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
          >
            Trusted by leading educational institutions for portfolio management
          </p>
          
          {/* Stats Badge */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-xs font-sans tracking-wide"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              <Users className="w-3 h-3"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              />
              <span>{allFeedbacks.length}+ Feedbacks</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-sans tracking-wide"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              <Star className="w-3 h-3"
                style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
              />
              <span>
                {allFeedbacks.length > 0 
                  ? (allFeedbacks.reduce((acc, f) => acc + f.rating, 0) / allFeedbacks.length).toFixed(1)
                  : '0'} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Orbit Container */}
        <div className="relative w-full flex items-center justify-center overflow-visible min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
          <div 
            className="relative flex items-center justify-center"
            style={{ 
              width: ringSizes.large,
              height: ringSizes.large
            }}
          >
            {/* Rings - Very subtle, almost invisible */}
            <div 
              className="absolute rounded-full"
              style={{ 
                width: ringSizes.large,
                height: ringSizes.large,
                border: `1px solid ${theme === 'dark' ? 'rgba(232, 202, 94, 0.1)' : 'rgba(0, 160, 255, 0.1)'}`,
              }}
            />
            <div 
              className="absolute rounded-full"
              style={{ 
                width: ringSizes.medium,
                height: ringSizes.medium,
                border: `1px solid ${theme === 'dark' ? 'rgba(232, 202, 94, 0.08)' : 'rgba(0, 160, 255, 0.08)'}`,
              }}
            />
            <div 
              className="absolute rounded-full"
              style={{ 
                width: ringSizes.small,
                height: ringSizes.small,
                border: `1px solid ${theme === 'dark' ? 'rgba(232, 202, 94, 0.05)' : 'rgba(0, 160, 255, 0.05)'}`,
              }}
            />
            
            {/* Rotating Orbit with Feedback Images */}
            <div 
              className="absolute"
              style={{ 
                width: ringSizes.orbit,
                height: ringSizes.orbit
              }}
            >
              <motion.div 
                className="relative w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                {allFeedbacks.map((feedback, index) => {
                  const angle = (index / allFeedbacks.length) * 360;
                  const radius = ringSizes.orbit / 2;

                  return (
                    <div
                      key={feedback.id}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
                        transformOrigin: '0 0',
                      }}
                    >
                      <motion.button
                        onClick={() => handleFeedbackClick(feedback)}
                        onMouseEnter={() => setHoveredId(feedback.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="relative rounded-full border-4 shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                        style={{ 
                          width: isDesktop ? Math.min(90, ringSizes.orbit * 0.2) : Math.min(70, ringSizes.orbit * 0.2),
                          height: isDesktop ? Math.min(90, ringSizes.orbit * 0.2) : Math.min(70, ringSizes.orbit * 0.2),
                          backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                          borderColor: hoveredId === feedback.id ? (theme === 'dark' ? '#E8CA5E' : '#00A0FF') : '#FFFFFF',
                          marginLeft: isDesktop ? -45 : -35,
                          marginTop: isDesktop ? -45 : -35
                        }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={DEFAULT_AVATAR}
                          alt={feedback.name}
                          fill
                          className="object-cover opacity-80"
                          sizes={isDesktop ? "90px" : "70px"}
                        />
                        {/* Initials overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-lg font-sans tracking-wide">
                          {getInitials(feedback.name)}
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.button>
                    </div>
                  );
                })}
              </motion.div>
            </div>
            
            {/* Center Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                }}
              >
                <Sparkles className="w-8 h-8 lg:w-12 lg:h-12"
                  style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Feedback */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="rounded-3xl max-w-md w-full text-center shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                border: `1px solid ${theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 160, 255, 0.3)'}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top bar */}
              <div className="h-2"
                style={{
                  backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                }}
              />
              
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10"
                style={{
                  backgroundColor: theme === 'dark' ? '#1E293B' : '#F0F0F0',
                  color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-8">
                {/* Profile Image */}
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 animate-pulse"
                    style={{ borderColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                  />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4"
                    style={{
                      borderColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                      backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                    }}
                  >
                    <Image
                      src={DEFAULT_AVATAR}
                      alt={selected.name}
                      fill
                      className="object-cover opacity-80"
                      sizes="112px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white font-bold text-2xl font-sans tracking-wide">
                      {getInitials(selected.name)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-1 font-serif tracking-tight"
                  style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
                >
                  {selected.name}
                </h3>
                <p className="font-medium text-sm mb-2 font-sans tracking-wide"
                  style={{ color: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                >
                  {selected.role}
                </p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <School className="w-3 h-3"
                    style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                  />
                  <p className="text-xs font-light tracking-wide"
                    style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                  >
                    {selected.institution}
                  </p>
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < selected.rating
                          ? `fill-current text-current`
                          : 'fill-none'
                      }`}
                      style={{
                        color: i < selected.rating
                          ? (theme === 'dark' ? '#E8CA5E' : '#00A0FF')
                          : (theme === 'dark' ? '#374151' : '#D1D5DB'),
                      }}
                    />
                  ))}
                </div>

                {/* Quote icon */}
                <Quote className="w-8 h-8 mx-auto mb-3"
                  style={{ color: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 160, 255, 0.3)' }}
                />

                <p className="leading-relaxed mb-4 relative text-sm font-light tracking-wide"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  &quot;{selected.feedback}&quot;
                </p>

                {selected.suggestions && selected.suggestions.trim() !== '' && (
                  <div className="mt-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: theme === 'dark' ? '#1E293B' : '#F0F0F0',
                    }}
                  >
                    <p className="text-xs mb-1 font-sans tracking-wide"
                      style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    >
                      💡 Suggestion:
                    </p>
                    <p className="text-xs font-light tracking-wide"
                      style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                    >
                      {selected.suggestions}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-1 mt-3">
                  <Calendar className="w-3 h-3"
                    style={{ color: theme === 'dark' ? '#6B7280' : '#9CA3AF' }}
                  />
                  <p className="text-xs font-light tracking-wide"
                    style={{ color: theme === 'dark' ? '#6B7280' : '#9CA3AF' }}
                  >
                    {new Date(selected.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Decorative dots */}
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                  />
                  <div className="w-2 h-2 rounded-full opacity-60"
                    style={{ backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF' }}
                  />
                  <div className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme === 'dark' ? '#B11217' : '#B11217' }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}