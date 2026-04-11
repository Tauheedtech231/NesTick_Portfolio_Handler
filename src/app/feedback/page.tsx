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
  Heart,
  Mail,
  User,
  Briefcase,
  Calendar,
  Quote,
  MessageCircle,
  History,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X
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
  status: 'pending' | 'approved' | 'rejected';
}

// Dummy feedback data for slider
const DUMMY_FEEDBACKS: FeedbackFormData[] = [
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
  }
];

export default function FeedbackPage() {
  const [formData, setFormData] = useState<Omit<FeedbackFormData, 'id' | 'date' | 'status'>>({
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
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<FeedbackFormData>>({});

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  // Load feedbacks from localStorage on mount
  useEffect(() => {
    const loadFeedbacks = () => {
      try {
        const storedFeedbacks = localStorage.getItem('userFeedbacks');
        if (storedFeedbacks) {
          setSavedFeedbacks(JSON.parse(storedFeedbacks));
        } else {
          localStorage.setItem('userFeedbacks', JSON.stringify(DUMMY_FEEDBACKS));
          setSavedFeedbacks(DUMMY_FEEDBACKS);
        }
      } catch (error) {
        console.error('Error loading feedbacks:', error);
        setSavedFeedbacks(DUMMY_FEEDBACKS);
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
        date: new Date().toISOString(),
        status: 'pending'
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

  const clearAllFeedbacks = () => {
    if (confirm('Are you sure you want to clear all feedback history?')) {
      setSavedFeedbacks([]);
      localStorage.removeItem('userFeedbacks');
    }
  };

  const startEditing = (feedback: FeedbackFormData) => {
    setEditingId(feedback.id);
    setEditFormData({
      name: feedback.name,
      email: feedback.email,
      role: feedback.role,
      institution: feedback.institution,
      rating: feedback.rating,
      feedback: feedback.feedback,
      suggestions: feedback.suggestions
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const saveEdit = (id: string) => {
    const updatedFeedbacks = savedFeedbacks.map(f => 
      f.id === id ? { 
        ...f, 
        ...editFormData,
        date: new Date().toISOString()
      } as FeedbackFormData : f
    );
    setSavedFeedbacks(updatedFeedbacks);
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditRatingClick = (rating: number) => {
    setEditFormData(prev => ({ ...prev, rating }));
  };

  const resetToDummyData = () => {
    if (confirm('Reset to dummy data? This will replace all your current feedback data.')) {
      setSavedFeedbacks(DUMMY_FEEDBACKS);
      localStorage.setItem('userFeedbacks', JSON.stringify(DUMMY_FEEDBACKS));
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % DUMMY_FEEDBACKS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + DUMMY_FEEDBACKS.length) % DUMMY_FEEDBACKS.length);
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

return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0F19] pt-16 lg:pt-20 overflow-hidden">
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden flex items-center justify-center min-h-[40vh]">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#0B0F19]" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 backdrop-blur-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span className="text-xs font-medium text-gray-300 font-sans tracking-wide">We Value Your Opinion</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 leading-tight font-serif tracking-tight">
                Share Your{' '}
                <span className="bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 bg-clip-text text-transparent animate-gradient">
                  Feedback
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light tracking-wide">
                Your feedback helps us improve and serve you better. 
                Share your experience with Portfolio Handler.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Feedback Slider Section - Full Width */}
        <section className="py-12 w-full bg-gradient-to-r from-[#0F172A] to-[#0B0F19]">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-serif tracking-tight">
                  What Our Users Say
                </h2>
                <p className="text-gray-400 font-light tracking-wide">Real feedback from our community</p>
              </motion.div>

              <div className="relative">
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 bg-[#1E293B] hover:bg-[#FFD700] text-white hover:text-black rounded-full p-2 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="overflow-hidden px-4">
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {DUMMY_FEEDBACKS.map((feedback, index) => (
                      <div
                        key={feedback.id}
                        className="w-full flex-shrink-0 px-4"
                      >
                        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 md:p-8 hover:border-[#FFD700]/30 transition-all duration-300">
                          <Quote className="w-10 h-10 text-[#FFD700] mb-4 opacity-50" />
                          <p className="text-gray-300 text-base md:text-lg italic mb-6 font-light tracking-wide">
                            &quot;{feedback.feedback}&quot;
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-white font-sans tracking-wide">{feedback.name}</h4>
                              <p className="text-sm text-gray-400 font-light">{feedback.role} at {feedback.institution}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < feedback.rating
                                      ? 'fill-[#FFD700] text-[#FFD700]'
                                      : 'text-gray-600'
                                  }`}
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
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 bg-[#1E293B] hover:bg-[#FFD700] text-white hover:text-black rounded-full p-2 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {DUMMY_FEEDBACKS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'w-8 bg-[#FFD700]'
                        : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Form Section - Full Width */}
        <section ref={formRef} className="py-16 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Single Column - Form Only */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 font-serif tracking-tight">
                  <MessageCircle className="w-5 h-5 text-[#FFD700]" />
                  Tell Us About Your Experience
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 font-sans tracking-wide">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors font-sans"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 font-sans tracking-wide">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors font-sans"
                      />
                    </div>
                  </div>

                  {/* Role and Institution - 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5 font-sans tracking-wide">
                        Role *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#FFD700] transition-colors font-sans"
                        >
                          <option value="">Select role</option>
                          {roleOptions.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5 font-sans tracking-wide">
                        Institution Name *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          name="institution"
                          value={formData.institution}
                          onChange={handleInputChange}
                          required
                          placeholder="Your college/university"
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 font-sans tracking-wide">
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
                            className={`w-8 h-8 ${
                              rating <= (hoveredRating || formData.rating)
                                ? 'fill-[#FFD700] text-[#FFD700]'
                                : 'text-gray-600 fill-none'
                            } transition-colors duration-200`}
                          />
                        </button>
                      ))}
                      {formData.rating > 0 && (
                        <span className="text-sm text-[#FFD700] ml-2 font-sans tracking-wide">
                          {ratingLabels[formData.rating as keyof typeof ratingLabels]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 font-sans tracking-wide">
                      Your Feedback *
                    </label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Tell us about your experience with Portfolio Handler..."
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors resize-none font-sans"
                    />
                  </div>

                  {/* Suggestions */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 font-sans tracking-wide">
                      Suggestions for Improvement
                    </label>
                    <textarea
                      name="suggestions"
                      value={formData.suggestions}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any suggestions to help us serve you better?"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors resize-none font-sans"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FFD700] text-black py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#FFD700]/90 hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-sans tracking-wide"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    <div className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <p className="text-green-400 text-xs font-sans tracking-wide">Thank you! Your feedback has been saved.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <p className="text-red-400 text-xs font-sans tracking-wide">Failed to save feedback. Please try again.</p>
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Feedback History Section */}
              {savedFeedbacks.length > 0 && (
                <div className="mt-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="bg-[#0F172A] border border-[#FFD700]/30 text-[#FFD700] py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#FFD700]/10 flex items-center gap-2 font-sans tracking-wide"
                    >
                      <History className="w-4 h-4" />
                      {showHistory ? 'Hide' : 'Show'} Your Feedback History ({savedFeedbacks.length})
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={clearAllFeedbacks}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 py-2 px-4 rounded-xl text-xs transition-all duration-300 hover:bg-red-500/20 flex items-center gap-2 font-sans tracking-wide"
                      >
                        Clear All History
                      </button>
                      <button
                        onClick={resetToDummyData}
                        className="bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 px-4 rounded-xl text-xs transition-all duration-300 hover:bg-blue-500/20 flex items-center gap-2 font-sans tracking-wide"
                      >
                        Reset to Sample Data
                      </button>
                    </div>
                  </div>

                  {showHistory && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 max-h-96 overflow-y-auto pr-2"
                    >
                      {savedFeedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 hover:border-[#FFD700]/30 transition-all duration-300"
                        >
                          {editingId === feedback.id ? (
                            // Edit Mode
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1 font-sans tracking-wide">Name</label>
                                  <input
                                    type="text"
                                    value={editFormData.name || ''}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm font-sans"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1 font-sans tracking-wide">Email</label>
                                  <input
                                    type="email"
                                    value={editFormData.email || ''}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm font-sans"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1 font-sans tracking-wide">Role</label>
                                  <select
                                    value={editFormData.role || ''}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm font-sans"
                                  >
                                    {roleOptions.map(role => (
                                      <option key={role} value={role}>{role}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1 font-sans tracking-wide">Institution</label>
                                  <input
                                    type="text"
                                    value={editFormData.institution || ''}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, institution: e.target.value }))}
                                    className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm font-sans"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1 font-sans tracking-wide">Rating</label>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                      key={rating}
                                      type="button"
                                      onClick={() => handleEditRatingClick(rating)}
                                      className="focus:outline-none"
                                    >
                                      <Star
                                        className={`w-5 h-5 ${
                                          rating <= (editFormData.rating || 0)
                                            ? 'fill-[#FFD700] text-[#FFD700]'
                                            : 'text-gray-600 fill-none'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1 font-sans tracking-wide">Feedback</label>
                                <textarea
                                  value={editFormData.feedback || ''}
                                  onChange={(e) => setEditFormData(prev => ({ ...prev, feedback: e.target.value }))}
                                  rows={2}
                                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm font-sans"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1 font-sans tracking-wide">Suggestions</label>
                                <textarea
                                  value={editFormData.suggestions || ''}
                                  onChange={(e) => setEditFormData(prev => ({ ...prev, suggestions: e.target.value }))}
                                  rows={2}
                                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm font-sans"
                                />
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600 flex items-center gap-1 font-sans"
                                >
                                  <X className="w-3 h-3" />
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveEdit(feedback.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#FFD700] text-black text-sm hover:bg-[#FFD700]/90 flex items-center gap-1 font-sans tracking-wide"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-semibold text-white font-sans tracking-wide">{feedback.name}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500 font-light">{feedback.role}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500 font-light">{feedback.institution}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-3 h-3 ${
                                          star <= feedback.rating
                                            ? 'fill-[#FFD700] text-[#FFD700]'
                                            : 'text-gray-600'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <button
                                  onClick={() => startEditing(feedback)}
                                  className="text-gray-500 hover:text-[#FFD700] transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-gray-400 text-sm mb-2 font-light tracking-wide">{feedback.feedback}</p>
                              {feedback.suggestions && (
                                <p className="text-gray-500 text-xs italic font-light">
                                  Suggestion: {feedback.suggestions}
                                </p>
                              )}
                              <p className="text-gray-600 text-xs mt-2 font-light">
                                {new Date(feedback.date).toLocaleDateString()}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}