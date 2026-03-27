// app/about/page.tsx
'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
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
  Users
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import CollegeFeedback from '@/components/landing/CollegeFeedback';
import Footer from '@/components/landing/Footer';

// Dynamically import 3D Particles with no SSR
const ParticlesBackground = dynamic(
  () => import('@/components/landing/ParticlesBackground'),
  { ssr: false }
);

export default function AboutPage() {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const journeyRef = useRef(null);
  const feedbackRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const journeyInView = useInView(journeyRef, { once: true, amount: 0.2 });
  const feedbackInView = useInView(feedbackRef, { once: true, amount: 0.2 });

  // Animation variants with proper Types
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

  const timelineItemVariants:Variants = {
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

  // Journey Timeline Data - Extended to 2026
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
      <main className="min-h-screen bg-[#0B0F19] pt-16 lg:pt-20">
        {/* Hero Section with 3D Particles - No Scroll Indicator */}
     <section
  ref={heroRef}
  className="relative overflow-hidden flex items-center justify-center"
>
  {/* 3D Particles Background */}
  <ParticlesBackground />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/80 via-[#0B0F19]/50 to-[#0B0F19] pointer-events-none" />

  {/* Floating Orbs */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#1D4ED8]/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#38BDF8]/5 rounded-full blur-3xl animate-pulse delay-1000" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    
    {/* Badge + Heading */}
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

      {/* ✅ Updated Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight max-w-3xl mx-auto">
        <span className="block">
          Building{' '}
          <span className="bg-gradient-to-r from-[#1D4ED8] via-[#38BDF8] to-[#1D4ED8] bg-clip-text text-transparent">
            Digital Futures
          </span>
        </span>
        <span className="block">Since 2020</span>
      </h1>
    </motion.div>

    {/* ✅ Short Subheading */}
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

        {/* Mission & Vision Section - Reduced font */}
        <section ref={missionRef} className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Mission */}
              <motion.div
                initial="hidden"
                animate={missionInView ? "visible" : "hidden"}
                variants={fadeInLeftVariants}
                className="border-l-4 border-[#38BDF8] pl-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-6 h-6 text-[#38BDF8]" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-gray-400 leading-relaxed text-base">
                  To empower educational institutions with cutting-edge portfolio management technology 
                  that simplifies administration, enhances student visibility, and creates lasting digital 
                  legacies for academic achievements.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial="hidden"
                animate={missionInView ? "visible" : "hidden"}
                variants={fadeInRightVariants}
                className="border-l-4 border-[#38BDF8] pl-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-6 h-6 text-[#38BDF8]" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-gray-400 leading-relaxed text-base">
                  To become the global standard for educational portfolio management, connecting 
                  institutions, students, and opportunities through innovative technology that 
                  showcases potential and celebrates achievement.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Life Journey Story - Reduced padding */}
        <section ref={journeyRef} className="py-12 bg-[#0F172A]/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={journeyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-3">
                <Rocket className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-xs font-medium text-gray-300">Our Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">The Story of Growth & Innovation</h2>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                From humble beginnings to transforming portfolio management across institutions worldwide.
              </p>
            </motion.div>

            {/* Vertical Timeline */}
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#1D4ED8] via-[#38BDF8] to-[#1D4ED8]" />
              
              <div className="space-y-8">
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
                      className={`relative flex flex-col md:flex-row items-center gap-5 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 hover:border-[#38BDF8]/30 hover:shadow-xl transition-all duration-300 group">
                          <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} justify-start`}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1D4ED8]/20 to-[#38BDF8]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Icon className="w-4 h-4 text-[#38BDF8]" />
                            </div>
                            <span className="text-sm font-bold text-[#38BDF8]">{milestone.year}</span>
                          </div>
                          <h3 className={`text-base font-bold text-white mb-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-left`}>
                            {milestone.title}
                          </h3>
                          <p className={`text-gray-400 text-xs ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-left`}>
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-full flex items-center justify-center shadow-lg shadow-[#1D4ED8]/30">
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="flex-1 hidden md:block"></div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Future Promise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20">
                <Infinity className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-xs text-gray-400">And beyond... The journey continues</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* College Feedback Section */}
        <section ref={feedbackRef} >
          <CollegeFeedback />
        </section>
      </main>
      <Footer />
    </>
  );
}