// app/about/page.tsx
'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { 
  Sparkles, 
  Rocket, 
  Target,
  Eye,
  Infinity,
  Award,
  TrendingUp,
  Globe,
  Brain,
  Users,
  Crown,
  Briefcase,
  Code,
  Palette,
  Megaphone,
  Star,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  XCircle,
 
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
/* eslint-disable */
// Dynamically import 3D Particles with no SSR
const ParticlesBackground = dynamic(
  () => import('@/components/landing/ParticlesBackground'),
  { ssr: false }
);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const journeyRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const journeyInView = useInView(journeyRef, { once: true, amount: 0.2 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });

  // Contact Form State
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Team members data with hierarchy
  const teamMembers = [
    {
      id: 1,
      name: 'Hamza Hassan',
      role: 'Chief Executive Officer',
      level: 'executive',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop',
      icon: Crown,
      color: 'from-[#6366F1] to-[#8B5CF6]',
    },
    {
      id: 2,
      name: 'Abdullah Amin',
      role: 'Senior Business Analyst',
      level: 'management',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
      icon: Briefcase,
      color: 'from-[#22C55E] to-[#86EFAC]',
    },
    {
      id: 3,
      name: 'Haris Ashar',
      role: 'Business Developer',
      level: 'management',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop',
      icon: Briefcase,
      color: 'from-[#F59E0B] to-[#FBBF24]',
    },
    {
      id: 4,
      name: 'Tauheed',
      role: 'Web Developer',
      level: 'technical',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
      icon: Code,
      color: 'from-[#EF4444] to-[#F87171]',
    },
    {
      id: 5,
      name: 'Miss Maryam',
      role: 'Creative Lead',
      level: 'creative',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1887&auto=format&fit=crop',
      icon: Palette,
      color: 'from-[#EC4899] to-[#F472B6]',
    },
    {
      id: 6,
      name: 'Miss Palwasha',
      role: 'Marketing Lead',
      level: 'marketing',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
      icon: Megaphone,
      color: 'from-[#06B6D4] to-[#0891B2]',
    },
  ];

  // Contact Info
  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+92 319 3236529", href: "tel:+923193236529", description: "Available Mon-Fri, 9AM-6PM" },
    { icon: Mail, label: "Email", value: "support@portfoliohandler.com", href: "mailto:support@portfoliohandler.com", description: "We reply within 24 hours" },
    { icon: MapPin, label: "Office", value: "Daska, Pakistan", href: null, description: "Serving globally from Daska" },
    { icon: Clock, label: "Business Hours", value: "Monday - Friday", href: null, description: "9:00 AM - 6:00 PM (PKT)" },
  ];

  // Form Handlers
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

  // Animation variants
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

  const fromBottomVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
        delay: 0.2,
      }
    }
  };

  const timelineItemVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 50,
      }
    }),
  };

  // Journey Timeline Data
  const journeyMilestones = [
    { year: "2020", title: "The Beginning", description: "Portfolio Handler was founded with a vision to transform educational portfolio management.", icon: Rocket },
    { year: "2021", title: "First Milestone", description: "Launched MVP with 10+ partner institutions across Pakistan.", icon: Award },
    { year: "2022", title: "Rapid Growth", description: "Reached 100+ institutions and introduced premium features.", icon: TrendingUp },
    { year: "2023", title: "Global Expansion", description: "Expanded services to international markets with new partnerships.", icon: Globe },
    { year: "2024", title: "AI Innovation", description: "Launched AI-powered portfolio features and reached 500+ institutions.", icon: Brain },
    { year: "2025", title: "Scale & Impact", description: "Crossed 1000+ institutions globally with 98% satisfaction rate.", icon: Users },
    { year: "2026", title: "Future Ready", description: "Launching next-gen AI analytics & immersive portfolio experiences.", icon: Infinity },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0F19] pt-16 lg:pt-20 overflow-hidden">
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden flex items-center justify-center min-h-[50vh]">
          <ParticlesBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/80 via-[#0B0F19]/50 to-[#0B0F19] pointer-events-none" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#1D4ED8]/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#38BDF8]/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInLeftVariants}
              className="mb-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-[2rem] rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-xs font-medium text-gray-300">About Us</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight max-w-3xl mx-auto">
                <span className="block">
                  Building{' '}
                  <span className="text-[#FFD700]">
                    Digital Futures
                  </span>
                </span>
                <span className="block">Since 2020</span>
              </h1>
            </motion.div>

            <motion.p
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fromBottomVariants}
              className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Helping institutions manage and showcase student portfolios — simply and efficiently.
            </motion.p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section ref={missionRef} className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Mission Card */}
              <motion.div
                initial="hidden"
                animate={missionInView ? "visible" : "hidden"}
                variants={fadeInLeftVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1D4ED8]/20 to-[#FFD700]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-[#0F172A]/80 backdrop-blur-sm border border-[#1E293B] rounded-2xl p-6 md:p-8 group-hover:border-[#FFD700]/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#FFD700] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                    To empower educational institutions with cutting-edge portfolio management technology 
                    that simplifies administration, enhances student visibility, and creates lasting digital 
                    legacies for academic achievements.
                  </p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star className="w-4 h-4 text-[#FFD700]" />
                  </div>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                initial="hidden"
                animate={missionInView ? "visible" : "hidden"}
                variants={fadeInRightVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1D4ED8]/20 to-[#FFD700]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-[#0F172A]/80 backdrop-blur-sm border border-[#1E293B] rounded-2xl p-6 md:p-8 group-hover:border-[#FFD700]/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#FFD700] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h2>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                    To become the global standard for educational portfolio management, connecting 
                    institutions, students, and opportunities through innovative technology that 
                    showcases potential and celebrates achievement.
                  </p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star className="w-4 h-4 text-[#FFD700]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Journey Timeline Section - Fixed Dynamic Center Line */}
        <section ref={journeyRef} className="py-12 md:py-16 bg-[#0F172A]/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={journeyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-3">
                <Rocket className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-xs font-medium text-gray-300">Our Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                The Story of <span className="text-[#FFD700]">Growth & Innovation</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                From humble beginnings to transforming portfolio management across institutions worldwide.
              </p>
            </motion.div>

            <div className="relative">
              {/* Dynamic Center Line - Animates on scroll */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full">
                <motion.div 
                  className="w-full h-full bg-gradient-to-b from-[#1D4ED8] via-[#FFD700] to-[#38BDF8]"
                  initial={{ scaleY: 0, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ transformOrigin: 'top' }}
                />
              </div>
              
              <div className="space-y-6 md:space-y-8">
                {journeyMilestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  return (
                    <motion.div
                      key={milestone.year}
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={timelineItemVariants}
                      className={`relative flex flex-col md:flex-row items-center gap-4 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <motion.div 
                          className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 md:p-5 hover:border-[#FFD700]/40 hover:shadow-xl hover:shadow-[#FFD700]/10 transition-all duration-300 group"
                          whileHover={{ x: index % 2 === 0 ? -5 : 5, transition: { duration: 0.3 } }}
                        >
                          <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} justify-start`}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1D4ED8]/20 to-[#FFD700]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Icon className="w-4 h-4 text-[#38BDF8]" />
                            </div>
                            <span className="text-sm font-bold text-[#FFD700]">{milestone.year}</span>
                          </div>
                          <h3 className={`text-base md:text-lg font-bold text-white mb-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-left`}>
                            {milestone.title}
                          </h3>
                          <p className={`text-gray-400 text-xs md:text-sm ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-left leading-relaxed`}>
                            {milestone.description}
                          </p>
                        </motion.div>
                      </div>
                      
                      <div className="relative z-10">
                        <motion.div 
                          className="w-10 h-10 bg-gradient-to-r from-[#1D4ED8] via-[#FFD700] to-[#38BDF8] rounded-full flex items-center justify-center shadow-lg shadow-[#FFD700]/30"
                          whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
                        >
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex-1 hidden md:block"></div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/10 border border-[#FFD700]/20">
                <Infinity className="w-4 h-4 text-[#FFD700]" />
                <span className="text-xs text-gray-400">And beyond... The journey continues</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Structure Tree */}
        <section ref={teamRef} className="py-12 md:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-3">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-xs font-medium text-gray-300">Our Team</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Team <span className="text-[#FFD700]">Structure</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                Meet the passionate team behind Portfolio Handler
              </p>
            </motion.div>

            {/* Tree Container */}
            <div className="relative flex flex-col items-center">
              {/* Level 1: CEO */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative z-10 mb-8"
              >
                <div className="relative">
                  <motion.div 
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gradient-to-b from-[#FFD700] to-transparent"
                    style={{ transformOrigin: 'top' }}
                  />
                  
                  <div className="bg-gradient-to-r from-[#6366F1] via-[#FFD700] to-[#8B5CF6] p-[2px] rounded-2xl hover:scale-105 transition-transform duration-300">
                    <div className="bg-[#0F172A] rounded-2xl p-4 w-72">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#FFD700]">
                          <Image
                            src={teamMembers[0].image}
                            alt={teamMembers[0].name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-base font-bold text-white">{teamMembers[0].name}</p>
                          <p className="text-xs text-[#FFD700]">{teamMembers[0].role}</p>
                        </div>
                        <Crown className="w-5 h-5 text-[#FFD700]" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Horizontal line connector */}
              <div className="relative w-full max-w-2xl h-0.5 mb-8">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
                  style={{ transformOrigin: 'left' }}
                />
                
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute -bottom-6 left-1/4 w-0.5 h-6 bg-gradient-to-b from-[#22C55E] to-transparent"
                  style={{ transformOrigin: 'top' }}
                />
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute -bottom-6 right-1/4 w-0.5 h-6 bg-gradient-to-b from-[#F59E0B] to-transparent"
                  style={{ transformOrigin: 'top' }}
                />
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gradient-to-b from-[#EF4444] to-transparent"
                  style={{ transformOrigin: 'top' }}
                />
              </div>

              {/* Level 2: Management */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 w-full max-w-4xl">
                {teamMembers.slice(1, 4).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    className="relative group"
                    whileHover={{ y: -3 }}
                  >
                    <div className="relative">
                      <motion.div 
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                        className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gradient-to-b"
                        style={{ 
                          transformOrigin: 'top',
                          background: index === 0 ? 'linear-gradient(to bottom, #22C55E, transparent)' : 
                                      index === 1 ? 'linear-gradient(to bottom, #F59E0B, transparent)' : 
                                      'linear-gradient(to bottom, #EF4444, transparent)'
                        }}
                      />
                      
                      <div className={`bg-gradient-to-r ${member.color} p-[2px] rounded-xl group-hover:scale-105 transition-transform duration-300`}>
                        <div className="bg-[#0F172A] rounded-xl p-3">
                          <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: member.color.split(' ')[1] }}>
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">{member.name}</p>
                              <p className="text-[10px]" style={{ color: member.color.split(' ')[1] }}>{member.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Horizontal line connector */}
              <div className="relative w-full max-w-4xl h-0.5 mb-8">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#22C55E] via-[#FFD700] via-[#EF4444] to-[#EC4899]"
                  style={{ transformOrigin: 'left' }}
                />
                
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="absolute -bottom-6 left-1/4 w-0.5 h-6 bg-gradient-to-b from-[#EF4444] to-transparent"
                  style={{ transformOrigin: 'top' }}
                />
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                  className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gradient-to-b from-[#EC4899] to-transparent"
                  style={{ transformOrigin: 'top' }}
                />
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="absolute -bottom-6 right-1/4 w-0.5 h-6 bg-gradient-to-b from-[#06B6D4] to-transparent"
                  style={{ transformOrigin: 'top' }}
                />
              </div>

              {/* Level 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
                {teamMembers.slice(4, 7).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.9 + index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -3 }}
                  >
                    <div className={`bg-gradient-to-r ${member.color} p-[2px] rounded-xl hover:scale-105 transition-transform duration-300`}>
                      <div className="bg-[#0F172A] rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: member.color.split(' ')[1] }}>
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{member.name}</p>
                            <p className="text-[10px]" style={{ color: member.color.split(' ')[1] }}>{member.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

    {/* Contact Form Section - Below Team */}
<section ref={contactRef} className="py-12 md:py-16 bg-[#0F172A]/30">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={contactInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-10"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-3">
        <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span className="text-xs font-medium text-gray-300">Get In Touch</span>
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
        Let&apos;s <span className="text-[#FFD700]">Connect</span>
      </h2>
      <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
        Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side - Contact Info in Single Card with List */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={contactInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] rounded-2xl p-6 md:p-8 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FFD700]" />
          Contact Information
        </h3>
        
        {/* Contact Info List - Single Card with List Items */}
        <div className="space-y-4">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#1E293B]/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#1D4ED8]/20 to-[#FFD700]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <item.icon className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-gray-400 mb-0.5">{item.label}</h3>
                {item.href ? (
                  <a href={item.href} className="text-white text-sm font-semibold hover:text-[#38BDF8] transition-colors block">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-white text-sm font-semibold">{item.value}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right Side - Contact Form in Separate Card */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={contactInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] rounded-2xl p-6 md:p-8 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#38BDF8]" />
          Send us a Message
        </h3>
        
        <form onSubmit={handleContactSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={contactFormData.name}
              onChange={handleContactInputChange}
              required
              placeholder="Enter your full name"
              className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contactFormData.email}
              onChange={handleContactInputChange}
              required
              placeholder="Enter your email address"
              className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-medium text-gray-300 mb-1.5">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={contactFormData.subject}
              onChange={handleContactInputChange}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#38BDF8] transition-colors"
            >
              <option value="">Select a subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Partnership">Partnership Opportunity</option>
              <option value="Demo Request">Demo Request</option>
              <option value="Feedback">Feedback</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-medium text-gray-300 mb-1.5">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={contactFormData.message}
              onChange={handleContactInputChange}
              required
              rows={4}
              placeholder="Tell us about your inquiry..."
              className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-[#1D4ED8]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              <p className="text-green-400 text-xs">Thank you! We'll get back to you soon.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <p className="text-red-400 text-xs">Failed to send. Please try again.</p>
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