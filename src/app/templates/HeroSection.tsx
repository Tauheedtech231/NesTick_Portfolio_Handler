/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion, Variants } from 'framer-motion';
import { Sparkles, ChevronRight, Palette, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import ParticleNetwork from './ParticleNetwork';

interface HeroSectionProps {
  theme: 'light' | 'dark';
  onDesignClick: () => void;
}

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const fromLeftVariants: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 12,
      duration: 0.6,
    },
  },
};

const fromRightVariants: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 12,
      duration: 0.6,
    },
  },
};

const fromBottomVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 12,
      duration: 0.6,
      delay: 0.2,
    },
  },
};

export default function HeroSection({ theme, onDesignClick }: HeroSectionProps) {
  const [isPulsing, setIsPulsing] = useState(true);

  // Stop pulsing after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Get colors based on theme
  const getColors = () => {
    if (theme === 'dark') {
      return {
        overlay: 'linear-gradient(180deg, rgba(11, 15, 25, 0.7) 0%, rgba(11, 15, 25, 0.3) 100%)',
        badgeBg: 'rgba(232, 202, 94, 0.15)',
        badgeBorder: 'rgba(232, 202, 94, 0.2)',
        badgeColor: '#E8CA5E',
        headingColor: '#FFFFFF',
        headingAccent: '#E8CA5E',
        textColor: '#D1D5DB',
        buttonBg: '#E8CA5E',
        buttonText: '#1F4381',
        borderColor: '#E8CA5E',
        pulseColor: 'rgba(232, 202, 94, 0.4)',
        newBadgeBg: '#E8CA5E',
        newBadgeText: '#1F4381',
      };
    } else {
      return {
        overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 100%)',
        badgeBg: 'rgba(0, 102, 255, 0.1)',
        badgeBorder: 'rgba(0, 102, 255, 0.2)',
        badgeColor: '#0066FF',
        headingColor: '#FFFFFF',
        headingAccent: '#0066FF',
        textColor: '#E5E7EB',
        buttonBg: '#0066FF',
        buttonText: '#FFFFFF',
        borderColor: '#0066FF',
        pulseColor: 'rgba(0, 102, 255, 0.4)',
        newBadgeBg: '#0066FF',
        newBadgeText: '#FFFFFF',
      };
    }
  };

  const colors = getColors();

  return (
    <section 
      className="relative overflow-hidden py-10 md:py-14 lg:py-16 min-h-[75vh] flex items-center"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Particle Network Background */}
      <div className="absolute inset-0 z-0">
        <ParticleNetwork theme={theme} />
      </div>
      
      {/* Overlay gradient for better readability - White mode mein dark overlay */}
      <div 
        className="absolute inset-0 z-1"
        style={{
          background: colors.overlay,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto flex flex-col justify-center"
        >
          <motion.div 
            variants={fromBottomVariants} 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit cursor-pointer"
            style={{
              backgroundColor: colors.badgeBg,
              border: '1px solid',
              borderColor: colors.badgeBorder,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 cursor-pointer"
              style={{ color: colors.badgeColor }}
            />
            <span className="text-xs font-medium cursor-pointer"
              style={{ 
                color: colors.badgeColor,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
               Ready-to-Use Portfolio Templates
            </span>
          </motion.div>

          <motion.h1 
            variants={fromLeftVariants} 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-2 font-serif tracking-tight cursor-default leading-tight"
          >
            <span className="relative inline-block cursor-default"
              style={{ 
                color: colors.headingColor,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Beautiful
            </span>{' '}
            <span className="inline-block cursor-default"
              style={{ 
                color: colors.headingAccent,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Portfolio Templates
            </span>
          </motion.h1>

          <motion.p 
            variants={fromRightVariants} 
            className="text-base md:text-lg max-w-2xl mx-auto mb-4 font-light tracking-wide cursor-default"
            style={{ 
              color: colors.textColor,
              fontFamily: "'Calibri Light', sans-serif",
            }}
          >
            Professionally designed templates for every academic discipline. 
            Fully customizable to match your institution's brand and requirements.
          </motion.p>

          {/* Two CTA Buttons - Full Rounded with Proper Gap */}
          <motion.div 
            variants={fromBottomVariants} 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2"
          >
            {/* Browse Templates Button - Full Rounded */}
            <button
              onClick={() => document.getElementById('templates-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
              style={{
                backgroundColor: colors.buttonBg,
                color: colors.buttonText,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <span>Browse Templates</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform cursor-pointer" />
            </button>
            
            {/* Your Design Button - Full Rounded */}
            <motion.button
              onClick={onDesignClick}
              className="group inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent border-2 cursor-pointer hover:scale-105 active:scale-95 relative"
              style={{
                borderColor: colors.borderColor,
                color: colors.borderColor,
                fontFamily: "'Poppins', sans-serif",
              }}
              animate={isPulsing ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  `0 0 0 0 ${colors.pulseColor}`,
                  `0 0 0 15px ${colors.pulseColor.replace('0.4', '0')}`,
                  `0 0 0 0 ${colors.pulseColor.replace('0.4', '0')}`
                ]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform cursor-pointer" />
              <span>Your Design</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform cursor-pointer" />
              
              {/* Pulsing ring effect */}
              {isPulsing && (
                <span 
                  className="absolute -inset-1 rounded-full animate-ping opacity-40"
                  style={{
                    border: '2px solid',
                    borderColor: colors.borderColor,
                  }}
                />
              )}
              
              {/* Small badge to attract attention */}
              {isPulsing && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[8px] font-bold animate-bounce"
                  style={{
                    backgroundColor: colors.newBadgeBg,
                    color: colors.newBadgeText,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  NEW
                </span>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}