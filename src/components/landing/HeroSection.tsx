// components/HeroSection.tsx
'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';

// Dynamically import Three.js background with no SSR
const ThreeNetworkBackground = dynamic(
  () => import('../../components/ThreeNetworkBackground'),
  { ssr: false }
);

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({ scrollToSection, heroRef }: HeroSectionProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const rotatingTexts = [
    "Build, Manage & Showcase Your College Portfolio",
    "A centralized platform where institutions can create, customize, and control their digital presence with ease."
  ];

  // Auto-rotate text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants:Variants = {
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

  const badgeVariants:Variants = {
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

  const rotatingTextVariants:Variants = {
    enter: {
      y: 20,
      opacity: 0,
      scale: 0.95,
    },
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants:Variants = {
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
      className="relative h-[50%] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0B0F19] pt-24 md:pt-24 "
    >
      {/* Three.js Network Background */}
      <ThreeNetworkBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/80 via-[#0B0F19]/50 to-[#0B0F19] pointer-events-none" />

      {/* Animated particles overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D4ED8]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center"
        >
          {/* Top Center Badge - Above Heading */}
          <motion.div
            variants={badgeVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm shadow-lg mb-4 md:mb-6"
          >
            <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-sm font-medium text-gray-300">
              🎓 Connected College Portfolio Ecosystem
            </span>
          </motion.div>

          {/* Original Heading - Preserved */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight"
          >
            Simplify College Portfolios{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] via-[#38BDF8] to-[#1D4ED8] bg-size-200 animate-gradient">
              One Unified Platform
            </span>
          </motion.h1>

          {/* Rotating Text with Enter/Exit Animation */}
          <div className="min-h-[80px] md:min-h-[100px] mb-6 md:mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                variants={rotatingTextVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4"
              >
                {rotatingTexts[currentTextIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Original Button - Preserved */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mt-2 md:mt-4"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => scrollToSection("templates")}
              className="group relative w-full sm:w-auto bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white px-6 py-3 md:px-8 md:py-4 mb-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg transition-all duration-500 shadow-2xl hover:shadow-[#1D4ED8]/40 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#38BDF8] to-[#1D4ED8] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </section>
  );
}