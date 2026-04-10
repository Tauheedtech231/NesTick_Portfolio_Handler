// components/HeroSection.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight, GraduationCap, Sparkles, Globe2, Compass } from 'lucide-react';
import Hero3DBackground from '../Hero3DBackground';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({ scrollToSection, heroRef }: HeroSectionProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const badgeVariants: Variants = {
    hidden: { y: -20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
        delay: 0.4,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[50vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden pt-20"
    >
      {/* 3D Interactive Background - Galaxy/Baghdad Concept */}
      <Hero3DBackground />

      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1F4381]/40 via-transparent to-[#0B0F19] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1F4381]/30 via-transparent to-[#1F4381]/30 pointer-events-none" />

      {/* Animated particles with brand colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1F4381]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00E0FF]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E8CA5E]/10 rounded-full blur-3xl animate-pulse delay-500" />
        {/* Star-like particles for galaxy effect */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-[#E8CA5E] rounded-full opacity-70 animate-ping" />
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-[#00E0FF] rounded-full opacity-60 animate-pulse" />
        <div className="absolute bottom-32 left-1/4 w-0.5 h-0.5 bg-[#E8CA5E] rounded-full opacity-80 animate-ping delay-300" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#1F4381] rounded-full opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-[#00E0FF] rounded-full opacity-60 animate-ping delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-5xl px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Badge with brand colors */}
          <motion.div
            variants={badgeVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F4381]/30 backdrop-blur-md border border-[#E8CA5E]/40 shadow-lg shadow-[#E8CA5E]/10 mb-4 mt-[1rem]"
          >
            <Compass className="w-4 h-4 text-[#00E0FF]" />
            <Globe2 className="w-4 h-4 text-[#E8CA5E]" />
            <span className="text-sm font-medium text-gray-200">
              🌌 Galaxy of Educational Portfolios | Baghdad Heritage of Knowledge
            </span>
          </motion.div>

          {/* Heading with brand gradient */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 max-w-3xl"
          >
            <span className="block">Journey Through the</span>
            <span className="block bg-gradient-to-r from-[#E8CA5E] via-[#00E0FF] to-[#E8CA5E] bg-clip-text text-transparent animate-gradient">
              Galaxy of College Portfolios
            </span>
          </motion.h1>

          {/* Subheading with brand accent glow */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm mb-5"
          >
            Like the ancient libraries of Baghdad, we preserve and showcase educational excellence. 
            A centralized constellation where institutions create, customize, and control their digital 
            presence across the universe of learning.
          </motion.p>

          {/* CTA Buttons with brand colors */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col mb-4 sm:flex-row justify-center items-center gap-4"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => scrollToSection("templates")}
              className="group bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] px-6 py-3 md:px-7 md:py-3.5 rounded-xl font-semibold text-sm md:text-base shadow-2xl hover:shadow-[#E8CA5E]/50 transition-all duration-300 flex items-center gap-2"
            >
              Explore the Galaxy
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => scrollToSection("about")}
              className="group bg-transparent border-2 border-[#00E0FF] text-[#00E0FF] px-6 py-3 md:px-7 md:py-3.5 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 hover:bg-[#00E0FF]/10 hover:shadow-lg hover:shadow-[#00E0FF]/30 flex items-center gap-2"
            >
              Discover Our Legacy
              <Compass className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Scroll indicator with brand color */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("features")}
          >
            <span className="text-xs text-gray-400">Scroll to explore</span>
            <div className="w-5 h-8 border-2 border-[#00E0FF]/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-1 h-2 bg-[#E8CA5E] rounded-full mt-1"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}