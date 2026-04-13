// app/feedback/page.tsx
'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Star, 
  Sparkles, 
  Send, 
  CheckCircle, 
  XCircle,
  MessageCircle,
  Quote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

interface FeedbackFormData {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  rating: number;
  feedback: string;
  suggestions: string;
  date: string;
}

// Professional mock feedback data
const MOCK_FEEDBACKS: FeedbackFormData[] = [
  {
    id: 'mock-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'College Administrator',
    institution: 'Stanford University',
    rating: 5,
    feedback: 'Portfolio Handler has revolutionized how we manage student portfolios. The interface is intuitive and the analytics are spot-on!',
    suggestions: '',
    date: '2024-12-15T10:30:00Z'
  },
  {
    id: 'mock-2',
    name: 'Prof. Michael Chen',
    email: 'm.chen@techinstitute.edu',
    role: 'Faculty Member',
    institution: 'MIT',
    rating: 5,
    feedback: 'Excellent platform for tracking student progress. The customization options are fantastic.',
    suggestions: '',
    date: '2024-12-10T14:20:00Z'
  },
  {
    id: 'mock-3',
    name: 'Emily Rodriguez',
    email: 'emily.r@students.ucla.edu',
    role: 'Student',
    institution: 'UCLA',
    rating: 4,
    feedback: 'Great tool for showcasing my projects! The templates are beautiful and easy to use.',
    suggestions: '',
    date: '2024-12-05T09:15:00Z'
  }
];

export default function FeedbackPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [formData, setFormData] = useState<Omit<FeedbackFormData, 'id' | 'date'>>({
    name: '',
    email: '',
    role: '',
    institution: '',
    rating: 0,
    feedback: '',
    suggestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [savedFeedbacks, setSavedFeedbacks] = useState<FeedbackFormData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

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

  // Load feedbacks from localStorage on mount
  useEffect(() => {
    const loadFeedbacks = () => {
      try {
        const storedFeedbacks = localStorage.getItem('userFeedbacks');
        if (storedFeedbacks && JSON.parse(storedFeedbacks).length > 0) {
          setSavedFeedbacks(JSON.parse(storedFeedbacks));
        } else {
          // Initialize with mock data if no data exists
          localStorage.setItem('userFeedbacks', JSON.stringify(MOCK_FEEDBACKS));
          setSavedFeedbacks(MOCK_FEEDBACKS);
        }
      } catch (error) {
        console.error('Error loading feedbacks:', error);
        setSavedFeedbacks(MOCK_FEEDBACKS);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedbacks();
  }, []);

  // Save feedbacks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && savedFeedbacks.length > 0) {
      localStorage.setItem('userFeedbacks', JSON.stringify(savedFeedbacks));
    }
  }, [savedFeedbacks, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const newFeedback: FeedbackFormData = {
        ...formData,
        id: `feedback-${Date.now()}`,
        date: new Date().toISOString()
      };

      const updatedFeedbacks = [newFeedback, ...savedFeedbacks];
      setSavedFeedbacks(updatedFeedbacks);

      setFormData({
        name: '',
        email: '',
        role: '',
        institution: '',
        rating: 0,
        feedback: '',
        suggestions: ''
      });

      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving feedback:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % savedFeedbacks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + savedFeedbacks.length) % savedFeedbacks.length);
  };

  const ratingLabels = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  const roleOptions = [
    'College Administrator',
    'Faculty Member',
    'Student',
    'IT Manager',
    'Department Head',
    'Other'
  ];

  // Get theme-based colors
  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#F5F5F5';
  const getCardBgColor = () => theme === 'dark' ? '#0F172A' : '#FFFFFF';
  const getBorderColor = () => theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const getAccentColor = () => theme === 'dark' ? '#FFD700' : '#00A0FF';
  const getTextColor = () => theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const getSubTextColor = () => theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const getInputBgColor = () => theme === 'dark' ? '#0B0F19' : '#F8FAFC';

  // Animation variants
  const fadeInUpVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      }
    }
  };

  // Get displayed feedbacks (mix of mock and user feedbacks)
  const displayedFeedbacks = savedFeedbacks.length > 0 ? savedFeedbacks : MOCK_FEEDBACKS;

  return (
    <>
      <Navbar />
      <main 
        className="min-h-screen pt-16 lg:pt-20 overflow-hidden transition-colors duration-500"
        style={{ backgroundColor: getBgColor() }}
      >
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden flex items-center justify-center min-h-[40vh]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
              style={{ backgroundColor: getAccentColor() }}
            />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
              style={{ backgroundColor: getAccentColor() }}
            />
          </div>

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
            >
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm mb-4"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 160, 255, 0.1)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 160, 255, 0.3)'}`
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: getAccentColor() }} />
                <span className="text-xs font-medium font-sans tracking-wide" style={{ color: getSubTextColor() }}>
                  We Value Your Opinion
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4 leading-tight font-serif tracking-tight">
                <span style={{ color: getTextColor() }}>Share Your </span>
                <span style={{ color: getAccentColor() }}>Feedback</span>
              </h1>

              <p className="text-base md:text-lg max-w-2xl mx-auto font-light tracking-wide transition-colors duration-500"
                style={{ color: getSubTextColor() }}
              >
                Your feedback helps us improve and serve you better. 
                Share your experience with Portfolio Handler.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Feedback Slider Section */}
        <section className="py-12 w-full transition-colors duration-500"
          style={{ backgroundColor: getBgColor() }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif tracking-tight transition-colors duration-500"
                  style={{ color: getTextColor() }}
                >
                  What Our Users Say
                </h2>
                <p className="font-light tracking-wide transition-colors duration-500"
                  style={{ color: getSubTextColor() }}
                >
                  Real feedback from our community
                </p>
              </motion.div>

              {displayedFeedbacks.length > 0 && (
                <div className="relative">
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 rounded-full p-2 transition-all duration-300"
                    style={{
                      backgroundColor: theme === 'dark' ? '#1E293B' : '#E2E8F0',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = getAccentColor();
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
                      e.currentTarget.style.color = theme === 'dark' ? '#FFFFFF' : '#1F2937';
                    }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="overflow-hidden px-4">
                    <div 
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {displayedFeedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="w-full flex-shrink-0 px-4"
                        >
                          <div 
                            className="rounded-2xl p-6 md:p-8 transition-all duration-300"
                            style={{
                              backgroundColor: getCardBgColor(),
                              border: `1px solid ${getBorderColor()}`,
                              boxShadow: theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
                            }}
                          >
                            <Quote className="w-10 h-10 mb-4 opacity-50" style={{ color: getAccentColor() }} />
                            <p className="text-base md:text-lg italic mb-6 font-light tracking-wide transition-colors duration-500"
                              style={{ color: getSubTextColor() }}
                            >
                              &quot;{feedback.feedback}&quot;
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold font-sans tracking-wide transition-colors duration-500"
                                  style={{ color: getTextColor() }}
                                >
                                  {feedback.name}
                                </h4>
                                <p className="text-sm font-light transition-colors duration-500"
                                  style={{ color: getSubTextColor() }}
                                >
                                  {feedback.role} at {feedback.institution}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < feedback.rating
                                        ? 'fill-current'
                                        : 'text-gray-600 fill-none'
                                    }`}
                                    style={{ color: i < feedback.rating ? getAccentColor() : undefined }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 rounded-full p-2 transition-all duration-300"
                    style={{
                      backgroundColor: theme === 'dark' ? '#1E293B' : '#E2E8F0',
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = getAccentColor();
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
                      e.currentTarget.style.color = theme === 'dark' ? '#FFFFFF' : '#1F2937';
                    }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Dots indicator */}
              {displayedFeedbacks.length > 0 && (
                <div className="flex justify-center gap-2 mt-6">
                  {displayedFeedbacks.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? 'w-8'
                          : 'w-2'
                      }`}
                      style={{
                        backgroundColor: currentSlide === index ? getAccentColor() : (theme === 'dark' ? '#4B5563' : '#D1D5DB')
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section ref={formRef} className="py-16 w-full transition-colors duration-500"
          style={{ backgroundColor: getBgColor() }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl p-6 md:p-8 transition-all duration-500"
                style={{
                  backgroundColor: getCardBgColor(),
                  border: `1px solid ${getBorderColor()}`,
                  boxShadow: theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
                }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 font-serif tracking-tight transition-colors duration-500"
                  style={{ color: getTextColor() }}
                >
                  <MessageCircle className="w-5 h-5" style={{ color: getAccentColor() }} />
                  Tell Us About Your Experience
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5 font-sans tracking-wide transition-colors duration-500"
                      style={{ color: getSubTextColor() }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-colors font-sans"
                      style={{
                        backgroundColor: getInputBgColor(),
                        border: `1px solid ${getBorderColor()}`,
                        color: getTextColor(),
                      }}
                      onFocus={(e) => e.target.style.borderColor = getAccentColor()}
                      onBlur={(e) => e.target.style.borderColor = getBorderColor()}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5 font-sans tracking-wide transition-colors duration-500"
                      style={{ color: getSubTextColor() }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-colors font-sans"
                      style={{
                        backgroundColor: getInputBgColor(),
                        border: `1px solid ${getBorderColor()}`,
                        color: getTextColor(),
                      }}
                      onFocus={(e) => e.target.style.borderColor = getAccentColor()}
                      onBlur={(e) => e.target.style.borderColor = getBorderColor()}
                    />
                  </div>

                  {/* Role and Institution - 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 font-sans tracking-wide transition-colors duration-500"
                        style={{ color: getSubTextColor() }}
                      >
                        Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-colors font-sans"
                        style={{
                          backgroundColor: getInputBgColor(),
                          border: `1px solid ${getBorderColor()}`,
                          color: getTextColor(),
                        }}
                        onFocus={(e) => e.target.style.borderColor = getAccentColor()}
                        onBlur={(e) => e.target.style.borderColor = getBorderColor()}
                      >
                        <option value="">Select role</option>
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5 font-sans tracking-wide transition-colors duration-500"
                        style={{ color: getSubTextColor() }}
                      >
                        Institution Name *
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        required
                        placeholder="Your college/university"
                        className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-colors font-sans"
                        style={{
                          backgroundColor: getInputBgColor(),
                          border: `1px solid ${getBorderColor()}`,
                          color: getTextColor(),
                        }}
                        onFocus={(e) => e.target.style.borderColor = getAccentColor()}
                        onBlur={(e) => e.target.style.borderColor = getBorderColor()}
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5 font-sans tracking-wide transition-colors duration-500"
                      style={{ color: getSubTextColor() }}
                    >
                      Rating *
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingClick(rating)}
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors duration-200 ${
                              rating <= (hoveredRating || formData.rating)
                                ? 'fill-current'
                                : 'fill-none'
                            }`}
                            style={{ 
                              color: rating <= (hoveredRating || formData.rating) ? getAccentColor() : (theme === 'dark' ? '#4B5563' : '#D1D5DB')
                            }}
                          />
                        </button>
                      ))}
                      {formData.rating > 0 && (
                        <span className="text-sm ml-2 font-sans tracking-wide" style={{ color: getAccentColor() }}>
                          {ratingLabels[formData.rating as keyof typeof ratingLabels]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5 font-sans tracking-wide transition-colors duration-500"
                      style={{ color: getSubTextColor() }}
                    >
                      Your Feedback *
                    </label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Tell us about your experience with Portfolio Handler..."
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-colors resize-none font-sans"
                      style={{
                        backgroundColor: getInputBgColor(),
                        border: `1px solid ${getBorderColor()}`,
                        color: getTextColor(),
                      }}
                      onFocus={(e) => e.target.style.borderColor = getAccentColor()}
                      onBlur={(e) => e.target.style.borderColor = getBorderColor()}
                    />
                  </div>

                  {/* Suggestions */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5 font-sans tracking-wide transition-colors duration-500"
                      style={{ color: getSubTextColor() }}
                    >
                      Suggestions for Improvement
                    </label>
                    <textarea
                      name="suggestions"
                      value={formData.suggestions}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any suggestions to help us serve you better?"
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-colors resize-none font-sans"
                      style={{
                        backgroundColor: getInputBgColor(),
                        border: `1px solid ${getBorderColor()}`,
                        color: getTextColor(),
                      }}
                      onFocus={(e) => e.target.style.borderColor = getAccentColor()}
                      onBlur={(e) => e.target.style.borderColor = getBorderColor()}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-sans tracking-wide"
                    style={{
                      backgroundColor: getAccentColor(),
                      color: theme === 'dark' ? '#000000' : '#FFFFFF',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Feedback
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="p-2.5 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: 'none' }}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <p className="text-green-400 text-xs font-sans tracking-wide">Thank you! Your feedback has been saved.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-2.5 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none' }}
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <p className="text-red-400 text-xs font-sans tracking-wide">Failed to save feedback. Please try again.</p>
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