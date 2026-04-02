// components/HeroSection.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
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
      {/* 3D Interactive Background */}
      <Hero3DBackground />

      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/60 via-transparent to-[#0B0F19] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/40 via-transparent to-[#0B0F19]/40 pointer-events-none" />

      {/* Animated particles overlay with golden accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D4ED8]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-5xl px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Badge with golden border */}
          <motion.div
            variants={badgeVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/20 backdrop-blur-md border border-[#FFD700]/40 shadow-lg shadow-[#FFD700]/10 mb-4 mt-[1rem]"
          >
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-sm font-medium text-gray-200">
              🎓 Connected College Portfolio Ecosystem
            </span>
          </motion.div>

          {/* Heading with golden gradient */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 max-w-3xl"
          >
            <span className="block">Simplify College Portfolios</span>
            <span className="block bg-gradient-to-r from-[#FFD700] via-[#38BDF8] to-[#FFD700] bg-clip-text text-transparent animate-gradient">
              In One Platform
            </span>
          </motion.h1>

          {/* Subheading - Hardcoded with subtle golden glow */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm mb-5"
          >
            Build, Manage & Showcase Your College Portfolio - A centralized platform where institutions can create, customize, and control their digital presence with ease.
          </motion.p>

          {/* Button with golden accent */}
<motion.div
  variants={itemVariants}
  className="flex justify-center items-center"
>
  <motion.button
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
    onClick={() => scrollToSection("templates")}
    className="group bg-[#FFD700] text-black px-6 py-3 md:px-7 md:py-3.5 rounded-xl font-semibold text-sm md:text-base mb-4 shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
  >
    Get Started
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
  </motion.button>
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