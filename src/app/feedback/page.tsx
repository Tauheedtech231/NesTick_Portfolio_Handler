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
  ThumbsUp,
  Smile,
  Award,
  Users,
  TrendingUp,
  Heart,
  Mail,
  User,
  Briefcase,
  Calendar,
  Quote,
  MessageCircle,
  Save,
  History,
  Trash2
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

export default function FeedbackPage() {
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
  const [showHistory, setShowHistory] = useState(false);

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  // Load feedbacks from localStorage on mount
  useEffect(() => {
    const storedFeedbacks = localStorage.getItem('userFeedbacks');
    if (storedFeedbacks) {
      setSavedFeedbacks(JSON.parse(storedFeedbacks));
    }
  }, []);

  // Save feedbacks to localStorage whenever they change
  useEffect(() => {
    if (savedFeedbacks.length > 0) {
      localStorage.setItem('userFeedbacks', JSON.stringify(savedFeedbacks));
    }
  }, [savedFeedbacks]);

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

    try {
      // Create new feedback object
      const newFeedback: FeedbackFormData = {
        ...formData,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };

      // Save to localStorage
      const updatedFeedbacks = [newFeedback, ...savedFeedbacks];
      setSavedFeedbacks(updatedFeedbacks);
      localStorage.setItem('userFeedbacks', JSON.stringify(updatedFeedbacks));

      // Reset form
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

  const deleteFeedback = (id: string) => {
    const updated = savedFeedbacks.filter(f => f.id !== id);
    setSavedFeedbacks(updated);
    if (updated.length === 0) {
      localStorage.removeItem('userFeedbacks');
    } else {
      localStorage.setItem('userFeedbacks', JSON.stringify(updated));
    }
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

  const fadeInLeftVariants: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      }
    }
  };

  const fadeInRightVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      }
    }
  };

  const stats = [
    { icon: Users, label: "Active Users", value: "500+", color: "#FFD700" },
    { icon: ThumbsUp, label: "Satisfaction Rate", value: "98%", color: "#FFD700" },
    { icon: TrendingUp, label: "Monthly Feedback", value: "150+", color: "#FFD700" },
    { icon: Award, label: "Avg Rating", value: "4.8", color: "#FFD700" }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0F19] pt-16 lg:pt-20 overflow-hidden">
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden flex items-center justify-center min-h-[45vh]">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#0B0F19]" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 backdrop-blur-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span className="text-xs font-medium text-gray-300">We Value Your Opinion</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Share Your{' '}
                <span className="bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 bg-clip-text text-transparent">
                  Feedback
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                Your feedback helps us improve and serve you better. 
                Share your experience with Portfolio Handler.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 text-center hover:border-[#FFD700]/30 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section ref={formRef} className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Form */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#FFD700]" />
                  Tell Us About Your Experience
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
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
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
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
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Role and Institution - 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Role *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
                        >
                          <option value="">Select role</option>
                          {roleOptions.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
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
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Rating *
                    </label>
                    <div className="flex items-center gap-2">
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
                        <span className="text-sm text-[#FFD700] ml-2">
                          {ratingLabels[formData.rating as keyof typeof ratingLabels]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Your Feedback *
                    </label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Tell us about your experience with Portfolio Handler..."
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors resize-none"
                    />
                  </div>

                  {/* Suggestions */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Suggestions for Improvement
                    </label>
                    <textarea
                      name="suggestions"
                      value={formData.suggestions}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any suggestions to help us serve you better?"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#FFD700] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button - Full Golden */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FFD700] text-black py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#FFD700]/90 hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
                      <p className="text-green-400 text-xs">Thank you! Your feedback has been saved.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <p className="text-red-400 text-xs">Failed to save feedback. Please try again.</p>
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Right Side - Quote & History Toggle */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Quote Card */}
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#FFD700]/20 rounded-2xl p-6 text-center">
                  <Quote className="w-10 h-10 text-[#FFD700] mx-auto mb-4 opacity-50" />
                  <p className="text-gray-300 italic text-sm">
                    &quot;Your feedback is the compass that guides our journey towards excellence. 
                    Every suggestion helps us build a better platform for educational institutions worldwide.&quot;
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-xs text-gray-500">Team Portfolio Handler</span>
                  </div>
                </div>

                {/* History Toggle Button */}
                {savedFeedbacks.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full bg-[#0F172A] border border-[#FFD700]/30 text-[#FFD700] py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#FFD700]/10 flex items-center justify-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    {showHistory ? 'Hide' : 'Show'} Your Feedback History ({savedFeedbacks.length})
                  </button>
                )}

                {/* Clear History Button */}
                {savedFeedbacks.length > 0 && (
                  <button
                    onClick={clearAllFeedbacks}
                    className="w-full bg-red-500/10 border border-red-500/30 text-red-400 py-2 px-4 rounded-xl text-xs transition-all duration-300 hover:bg-red-500/20 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear All History
                  </button>
                )}
              </motion.div>
            </div>

            {/* Feedback History Section */}
            {showHistory && savedFeedbacks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#FFD700]" />
                  Your Feedback History
                </h3>
                <div className="space-y-4">
                  {savedFeedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 hover:border-[#FFD700]/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{feedback.name}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{feedback.role}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{feedback.institution}</span>
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
                          onClick={() => deleteFeedback(feedback.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{feedback.feedback}</p>
                      {feedback.suggestions && (
                        <p className="text-gray-500 text-xs italic">
                          Suggestion: {feedback.suggestions}
                        </p>
                      )}
                      <p className="text-gray-600 text-xs mt-2">
                        {new Date(feedback.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}