/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from "framer-motion";
import { 
  Globe2,
  Crown,
  Users,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";

const portals = [
  {
    title: "General Site",
    description: "Public-facing portal for previewing templates and submitting requests. No login required for basic access.",
    features: ["Template Preview", "Request Submission", "Public Access"],
    icon: Globe2,
    color: "blue",
    tag: null,
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    shadowColor: "rgba(59, 130, 246, 0.4)",
  },
  {
    title: "Main Admin Portal",
    description: "Central control center for system administrators to manage all colleges and system-wide settings.",
    features: ["College Management", "Template Approval", "System Analytics", "Global Settings"],
    icon: Crown,
    color: "gold",
    tag: "Primary Control",
    gradient: "from-amber-400 via-amber-500 to-amber-600",
    shadowColor: "rgba(245, 158, 11, 0.4)",
  },
  {
    title: "College Admin Portal",
    description: "Secure portal for individual colleges to manage their content, portfolios, and student data.",
    features: ["Content Management", "Student Portfolios", "College Settings", "Local Analytics"],
    icon: Users,
    color: "teal",
    tag: null,
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    shadowColor: "rgba(16, 185, 129, 0.4)",
  }
];

export default function PortalArchitecture() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  const isDark = theme === 'dark';
  const GOLD = '#E8CA5E';
  const BLUE = '#0066FF';
  const accentColor = isDark ? GOLD : BLUE;

  const getColors = (color: string) => {
    const colors = {
      blue: {
        accent: isDark ? '#3b82f6' : '#0066FF',
        uline: isDark ? '#3b82f6' : '#0066FF',
        checkColor: isDark ? '#3b82f6' : '#0066FF',
        ringBorder: isDark ? 'rgba(59,130,246,0.6)' : 'rgba(0,102,255,0.5)',
        ringBorderLight: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(0,102,255,0.3)',
        beamBg: 'from-blue-500/25',
        beamOpacity: 'opacity-40',
        cardShadow: isDark 
          ? '0 8px 32px rgba(59,130,246,0.08), 0 4px 16px rgba(59,130,246,0.04)'
          : '0 8px 32px rgba(0,102,255,0.06), 0 4px 16px rgba(0,102,255,0.03)',
      },
      gold: {
        accent: isDark ? '#fbbf24' : '#0066FF',
        uline: isDark ? '#fbbf24' : '#0066FF',
        checkColor: isDark ? '#fbbf24' : '#0066FF',
        ringBorder: isDark ? 'rgba(251,191,36,0.8)' : 'rgba(0,102,255,0.5)',
        ringBorderLight: isDark ? 'rgba(251,191,36,0.5)' : 'rgba(0,102,255,0.3)',
        beamBg: 'from-amber-500/40',
        beamOpacity: 'opacity-60',
        cardShadow: isDark
          ? '0 8px 32px rgba(251,191,36,0.12), 0 4px 16px rgba(251,191,36,0.06)'
          : '0 8px 32px rgba(0,102,255,0.06), 0 4px 16px rgba(0,102,255,0.03)',
      },
      teal: {
        accent: isDark ? '#2dd4bf' : '#0066FF',
        uline: isDark ? '#2dd4bf' : '#0066FF',
        checkColor: isDark ? '#2dd4bf' : '#0066FF',
        ringBorder: isDark ? 'rgba(45,212,191,0.6)' : 'rgba(0,102,255,0.5)',
        ringBorderLight: isDark ? 'rgba(45,212,191,0.4)' : 'rgba(0,102,255,0.3)',
        beamBg: 'from-emerald-500/25',
        beamOpacity: 'opacity-40',
        cardShadow: isDark
          ? '0 8px 32px rgba(45,212,191,0.08), 0 4px 16px rgba(45,212,191,0.04)'
          : '0 8px 32px rgba(0,102,255,0.06), 0 4px 16px rgba(0,102,255,0.03)',
      }
    };
    return colors[color as keyof typeof colors];
  };

  const getAccentColor = () => {
    return isDark ? GOLD : BLUE;
  };

  const getBorderColor = () => {
    return isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  };

  const getPortalBg = () => {
    return isDark ? 'rgba(13, 18, 29, 0.7)' : '#FFFFFF';
  };

  const getTextColor = () => {
    return isDark ? '#FFFFFF' : '#1F2937';
  };

  const getTextSecondary = () => {
    return isDark ? '#9CA3AF' : '#4B5563';
  };

  const getCardShadow = () => {
    return isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)';
  };

  // 3D Icon Component - Fixed: No scale on hover
  const ThreeDIcon = ({ icon: Icon, gradient, shadowColor }: any) => {
    return (
      <motion.div 
        className="relative w-14 h-14 group cursor-pointer mx-auto"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* 3D Shadow/Depth Effect */}
        <div 
          className="absolute inset-0 rounded-full blur-md transition-all duration-300"
          style={{ 
            background: `radial-gradient(ellipse, ${shadowColor}, transparent)`,
            transform: 'translateY(4px) rotateX(5deg)',
          }}
        />
        
        {/* Main Icon Container with 3D Transform */}
        <motion.div
          className="relative w-full h-full rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${gradient})`,
            boxShadow: `0 8px 32px ${shadowColor}`,
            transform: 'perspective(400px) rotateX(8deg) rotateY(-5deg)',
            transformStyle: 'preserve-3d',
          }}
          whileHover={{
            rotateX: 0,
            rotateY: 0,
            scale: 1.05,
            boxShadow: `0 12px 40px ${shadowColor}`,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          whileTap={{
            scale: 0.95,
            rotateX: 5,
            rotateY: 0,
          }}
        >
          {/* 3D Top Face Highlight */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
              transform: 'translateZ(2px)',
            }}
          />
          
          {/* 3D Bottom Face Shadow */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(0deg, rgba(0,0,0,0.2) 0%, transparent 60%)',
              transform: 'translateZ(-1px)',
            }}
          />
          
          {/* Icon with 3D Depth */}
          <motion.div
            className="relative z-10"
            style={{
              transform: 'translateZ(4px)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            }}
          >
            <Icon 
              className="w-7 h-7 text-white" 
              strokeWidth={2}
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            />
          </motion.div>
          
          {/* 3D Edge Glow */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              transform: 'translateZ(1px)',
            }}
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="mt-10">
      {/* Header - UPDATED with better contrast */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div 
            className="inline-block px-3 py-1 rounded-full mb-3 cursor-pointer"
            style={{
              border: 'none',
              backgroundColor: isDark ? 'rgba(232,184,75,0.05)' : 'rgba(0,102,255,0.08)',
            }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold"
              style={{
                color: accentColor,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Three-Tier Architecture
            </span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold mb-3 font-serif">
            <span style={{ 
              color: getTextColor(),
              fontFamily: "'Poppins', sans-serif",
            }}>
              Portal
            </span>{' '}
            <span style={{ 
              color: accentColor,
              fontFamily: "'Poppins', sans-serif",
            }}>
              Architecture
            </span>
          </h3>
          
          <p className="max-w-3xl mx-auto font-light"
            style={{ 
              color: getTextSecondary(),
              fontFamily: "'Calibri Light', sans-serif",
            }}
          >
            Our system is built on a robust multi-portal architecture designed for maximum efficiency and security
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-12" style={{ background: accentColor, opacity: 0.3 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
            <div className="h-px w-12" style={{ background: accentColor, opacity: 0.3 }} />
          </div>
        </motion.div>
      </div>
      
      {/* Cards Grid - UPDATED with better light mode styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
        {portals.map((portal, index) => {
          const colors = getColors(portal.color);
          const Icon = portal.icon;
          const isCenter = index === 1;

          return (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -6,
              }}
              className={`relative flex flex-col items-center rounded-2xl p-6 overflow-hidden cursor-pointer`}
              style={{
                backgroundColor: getPortalBg(),
                backdropFilter: 'blur(12px)',
                border: isCenter 
                  ? `2px solid ${accentColor}`
                  : `1px solid ${getBorderColor()}`,
                boxShadow: isCenter 
                  ? (isDark 
                    ? `0 0 40px ${accentColor}20, 0 8px 32px ${accentColor}10`
                    : `0 0 40px rgba(0,102,255,0.08), 0 8px 32px rgba(0,102,255,0.04)`)
                  : getCardShadow(),
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                height: 'auto',
              }}
            >
              {/* Tech Corners */}
              <div className="absolute top-16 left-0 w-3 h-10 border-l-2 opacity-20 pointer-events-none"
                style={{ borderColor: colors.accent, clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }}
              />
              <div className="absolute top-16 right-0 w-3 h-10 border-r-2 opacity-20 pointer-events-none"
                style={{ borderColor: colors.accent, clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)', transform: 'scaleX(-1)' }}
              />

              {/* 3D Icon */}
              <ThreeDIcon 
                icon={Icon}
                gradient={portal.gradient}
                shadowColor={portal.shadowColor}
              />

              {/* Title */}
              <h4 className="text-xl font-bold mt-4 mb-2 text-center"
                style={{ 
                  color: getTextColor(),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {portal.title}
              </h4>

              {/* Underline */}
              <div className="w-8 h-0.5 mb-4 rounded-full"
                style={{ backgroundColor: colors.accent, opacity: 0.6 }}
              />

              {/* Description */}
              <p className="text-sm text-center leading-relaxed mb-4 max-w-[220px]"
                style={{ 
                  color: getTextSecondary(),
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                {portal.description}
              </p>

              {/* Features */}
              <ul className="w-full space-y-2 text-sm">
                {portal.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center group/item cursor-default"
                    style={{ 
                      color: getTextSecondary(),
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border flex items-center justify-center mr-3 transition-colors flex-shrink-0"
                      style={{ 
                        borderColor: `${colors.accent}40`,
                      }}
                    >
                      <CheckCircle2 
                        className="w-2.5 h-2.5"
                        style={{ color: colors.accent }}
                      />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Center badge - UPDATED */}
              {isCenter && (
                <div className="mt-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.1em]"
                  style={{
                    backgroundColor: isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)',
                    color: accentColor,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  ★ Primary Portal
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}