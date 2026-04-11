// components/HeroSection.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight, Compass, Globe2, Star, Moon, Rocket } from 'lucide-react';
import Hero3DBackground from '../Hero3DBackground';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({ scrollToSection, heroRef }: HeroSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Badge - Top to Bottom
  const badgeVariants: Variants = {
    hidden: { y: -50, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
        delay: 0.1,
      },
    },
  };

  // First Heading - Left to Right
  const headingLeftVariants: Variants = {
    hidden: { x: -100, opacity: 0, filter: 'blur(10px)' },
    visible: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 0.8,
        delay: 0.2,
      },
    },
  };

  // Second Heading - Right to Left
  const headingRightVariants: Variants = {
    hidden: { x: 100, opacity: 0, filter: 'blur(10px)' },
    visible: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 0.8,
        delay: 0.3,
      },
    },
  };

  // Subheading - Left to Right
  const subheadingVariants: Variants = {
    hidden: { x: -80, opacity: 0, filter: 'blur(8px)' },
    visible: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 18,
        duration: 0.7,
        delay: 0.4,
      },
    },
  };

  // Buttons - Bottom to Top
  const buttonVariants: Variants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 12,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const floatingIconsVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 0.5,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: 'spring',
      },
    }),
    float: (i: number) => ({
      y: [0, -15, 0],
      x: [0, i % 2 === 0 ? 10 : -10, 0],
      rotate: [0, i * 8, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.5,
      },
    }),
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#07080F] via-[#0B0F19] to-[#07080F]"
    >
      {/* 3D Background */}
      <Hero3DBackground />

      {/* Soft gradient overlays - No visible borders */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080F] via-transparent to-[#1F4381]/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E8CA5E]/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(isMobile ? 20 : 40)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={floatingIconsVariants}
            initial="hidden"
            animate={["visible", "float"]}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 3 === 0 ? (
              <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-[#E8CA5E] opacity-40" />
            ) : i % 3 === 1 ? (
              <Moon className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-[#00E0FF] opacity-30" />
            ) : (
              <Rocket className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-[#1F4381] opacity-50" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Elegant Badge - Top to Bottom with margin */}
          <motion.div
            variants={badgeVariants}
            className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#1F4381]/20 via-[#1F4381]/10 to-transparent backdrop-blur-md border border-[#E8CA5E]/20 shadow-lg mb-6 sm:mb-8 mt-8 sm:mt-12"
          >
            <div className="flex gap-1">
              <Compass className="w-3 h-3 sm:w-4 sm:h-4 text-[#00E0FF] animate-pulse" />
              <Globe2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#E8CA5E] animate-spin-slow" />
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-medium bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
              🌟 Galaxy of Educational Excellence
            </span>
          </motion.div>

          {/* First Heading - Left to Right */}
          <motion.h1
            variants={headingLeftVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl  font-bold leading-[1.2] sm:leading-[1.3] mb-3 sm:mb-4 max-w-5xl"
          >
            <span className="block text-white font-serif tracking-tight">
              Journey Through the
            </span>
          </motion.h1>

          {/* Second Heading - Right to Left */}
          <motion.h1
            variants={headingRightVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl  font-bold leading-[1.2] sm:leading-[1.3] mb-5 sm:mb-7 max-w-5xl"
          >
            <span className="block bg-gradient-to-r from-[#E8CA5E] via-[#00E0FF] to-[#E8CA5E] bg-clip-text text-transparent bg-300% animate-gradient font-serif font-bold">
              Galaxy of College Portfolios
            </span>
          </motion.h1>

          {/* Elegant Subheading - Left to Right */}
          <motion.p
            variants={subheadingVariants}
            className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed sm:leading-relaxed backdrop-blur-sm px-2 mb-8 sm:mb-10 font-light tracking-wide"
          >
            Like the ancient libraries of Baghdad, we preserve and showcase educational excellence. 
            A centralized constellation where institutions create, customize, and control their digital 
            presence across the universe of learning.
          </motion.p>

          {/* CTA Buttons - Bottom to Top */}
          <motion.div
            variants={buttonVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 w-full sm:w-auto px-4 sm:px-0"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => scrollToSection("templates")}
              className="group w-full sm:w-auto bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-2xl hover:shadow-[#E8CA5E]/40 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <span className="relative z-10">Explore the Galaxy</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#A57F2A] to-[#E8CA5E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => scrollToSection("about")}
              className="group w-full sm:w-auto bg-transparent border-2 border-[#00E0FF]/60 text-[#00E0FF] px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-[#00E0FF]/10 hover:shadow-lg hover:shadow-[#00E0FF]/20 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Discover Our Legacy
              <Compass className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-gradient {
          background-size: 300% auto;
          animation: gradient 4s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0B0F19;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #E8CA5E, #00E0FF);
          border-radius: 3px;
        }
        
        /* Smooth font rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Elegant text selection */
        ::selection {
          background: linear-gradient(135deg, #E8CA5E40, #00E0FF40);
          color: #E8CA5E;
        }
      `}</style>
    </section>
  );
}