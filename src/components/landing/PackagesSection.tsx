/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from "framer-motion";
import { 
  Rocket,
  Star,
  Check,
  Lock,
  Phone,
  Package,
  Diamond,
  Gem,
  Layout,
  Sliders,
  Headphones,
  Settings,
  ShieldCheck,
  Layers,
  BookOpen,
  Server,
  ShoppingBag,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Packages Data
const packages = [
  {
    name: "Basic",
    price: "Contact Us",
    period: "",
    description: "Perfect starting point for small colleges and institutions",
    features: [
      { text: "Portfolio site", icon: Layout, included: true },
      { text: "Basic template", icon: Sliders, included: true },
      { text: "24/7 support", icon: Headphones, included: true },
      { text: "Full customization", icon: Settings, included: true },
      { text: "Admin control", icon: ShieldCheck, included: true },
      { text: "Drag & drop site management", icon: Layers, included: true }
    ],
    icon: Package,
    popular: false,
    ctaText: "Contact Sales",
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    shadowColor: "rgba(59, 130, 246, 0.4)",
    cardShadow: "0 20px 60px rgba(59,130,246,0.08), 0 8px 24px rgba(59,130,246,0.04)",
    cardShadowHover: "0 30px 80px rgba(59,130,246,0.15), 0 12px 32px rgba(59,130,246,0.06)",
  },
  {
    name: "Most Featured",
    price: "Contact Us",
    period: "",
    description: "Ideal for growing institutions with advanced needs",
    features: [
      { text: "LMS / Admission automation", icon: BookOpen, included: true },
      { text: "Portfolio site (free)", icon: Layout, included: true },
      { text: "24/7 support", icon: Headphones, included: true },
      { text: "Free maintenance at P.S.", icon: Server, included: true },
      { text: "Admin control", icon: ShieldCheck, included: true },
      { text: "Multi portal and customizable apps", icon: Layers, included: true }
    ],
    icon: Diamond,
    popular: true,
    ctaText: "Contact Sales",
    gradient: "from-amber-400 via-amber-500 to-amber-600",
    shadowColor: "rgba(245, 158, 11, 0.4)",
    cardShadow: "0 20px 60px rgba(245,158,11,0.15), 0 8px 24px rgba(245,158,11,0.06)",
    cardShadowHover: "0 30px 80px rgba(245,158,11,0.25), 0 12px 32px rgba(245,158,11,0.08)",
  },
  {
    name: "Premium",
    price: "Contact Us",
    period: "",
    description: "Complete ERP solution for large universities",
    features: [
      { text: "Complete ERP", icon: Briefcase, included: true },
      { text: "Portfolio site (free)", icon: Layout, included: true },
      { text: "70% off on paid templates", icon: ShoppingBag, included: true },
      { text: "Free maintenance at P.S.", icon: Server, included: true },
      { text: "Customizable ERP system", icon: Settings, included: true },
      { text: "24/7 support", icon: Headphones, included: true }
    ],
    icon: Gem,
    popular: false,
    ctaText: "Contact Sales",
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    shadowColor: "rgba(16, 185, 129, 0.4)",
    cardShadow: "0 20px 60px rgba(16,185,129,0.08), 0 8px 24px rgba(16,185,129,0.04)",
    cardShadowHover: "0 30px 80px rgba(16,185,129,0.15), 0 12px 32px rgba(16,185,129,0.06)",
  }
];

export default function PackagesSection() {
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

  const getSectionBg = () => {
    return theme === 'dark' ? '#0B0F19' : '#FFFFFF';
  };

  const getCardBg = () => {
    return theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : '#FFFFFF';
  };

  const getBorderColor = () => {
    return theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  };

  const getAccentColor = () => {
    return theme === 'dark' ? '#E8CA5E' : '#0066FF';
  };

  const getAccentBg = () => {
    return theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)';
  };

  // 3D Icon Component with Continuous Floating
  const ThreeDIcon = ({ icon: Icon, gradient, shadowColor }: any) => {
    return (
      <motion.div 
        className="relative w-14 h-14 group cursor-pointer mx-auto"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* 3D Shadow/Depth Effect */}
        <div 
          className="absolute inset-0 rounded-full blur-md transition-all duration-300 group-hover:blur-lg group-hover:scale-110"
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
    <section 
      className="py-10 px-4 sm:px-6"
      style={{
        backgroundColor: getSectionBg(),
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto lg:mx-0 w-fit cursor-pointer"
              style={{
                backgroundColor: getAccentBg(),
              }}
            >
              <Rocket className="w-3.5 h-3.5"
                style={{ color: getAccentColor() }}
              />
              <span className="text-xs font-medium"
                style={{ 
                  color: getAccentColor(),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Pricing Plans
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 font-serif tracking-tight">
              <span className="relative inline-block"
                style={{ 
                  color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Choose Your
              </span>{' '}
              <span className="inline-block"
                style={{ 
                  color: getAccentColor(),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Perfect Plan
              </span>
            </h2>
            
            <p className="text-lg md:text-xl font-light"
              style={{ 
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              Flexible solutions tailored to fit your institution&apos;s needs and scale
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            const isPopular = pkg.popular;
            
            // Determine shadow based on theme
            const getShadow = (isHover: boolean = false) => {
              if (isHover) {
                return theme === 'dark'
                  ? pkg.cardShadowHover
                  : pkg.cardShadowHover;
              }
              return theme === 'dark'
                ? pkg.cardShadow
                : pkg.cardShadow;
            };

            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  y: -8,
                  boxShadow: getShadow(true),
                }}
                className={`relative rounded-[2rem] p-6 md:p-8 transition-all duration-300 cursor-pointer ${
                  isPopular ? 'shadow-2xl' : ''
                }`}
                style={{
                  backgroundColor: getCardBg(),
                  border: isPopular 
                    ? `2px solid ${getAccentColor()}`
                    : `1px solid ${getBorderColor()}`,
                  boxShadow: getShadow(false),
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-lg"
                      style={{
                        backgroundColor: getAccentColor(),
                        color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                        fontFamily: "'Poppins', sans-serif",
                        boxShadow: theme === 'dark' 
                          ? '0 4px 20px rgba(232,202,94,0.4)'
                          : '0 4px 20px rgba(0,102,255,0.4)',
                      }}
                    >
                      <Star className="w-3 h-3" fill="currentColor" />
                      Most Featured
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <ThreeDIcon 
                    icon={Icon} 
                    gradient={pkg.gradient}
                    shadowColor={pkg.shadowColor}
                  />
                  <h3 className="text-2xl font-bold mb-2 mt-4"
                    style={{ 
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {pkg.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold"
                      style={{ 
                        color: getAccentColor(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {pkg.price}
                    </span>
                  </div>
                  <p className="text-sm"
                    style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    {pkg.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2 text-sm cursor-default">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: feature.included ? getAccentBg() : 'rgba(107, 114, 128, 0.1)',
                          }}
                        >
                          {feature.included ? (
                            <Check className="w-3 h-3" style={{ color: getAccentColor() }} />
                          ) : (
                            <Lock className="w-3 h-3" style={{ color: '#6B7280' }} />
                          )}
                        </div>
                        <FeatureIcon className="w-3.5 h-3.5" style={{ color: feature.included ? getAccentColor() : '#6B7280' }} />
                        <span style={{ 
                          color: feature.included ? (theme === 'dark' ? '#D1D5DB' : '#4B5563') : '#6B7280',
                          fontFamily: "'Calibri Light', sans-serif",
                        }}>
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Link href="/contact" className="block">
                  <motion.button
                    className="w-full py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      backgroundColor: isPopular ? getAccentColor() : (theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#F5F5F5'),
                      color: isPopular ? (theme === 'dark' ? '#1F4381' : '#FFFFFF') : (theme === 'dark' ? '#D1D5DB' : '#4B5563'),
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: isPopular
                        ? (theme === 'dark' 
                          ? '0 8px 30px rgba(232,202,94,0.3)'
                          : '0 8px 30px rgba(0,102,255,0.2)')
                        : (theme === 'dark'
                          ? '0 4px 15px rgba(0,0,0,0.2)'
                          : '0 4px 15px rgba(0,0,0,0.05)'),
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: isPopular
                        ? (theme === 'dark' 
                          ? '0 12px 40px rgba(232,202,94,0.5)'
                          : '0 12px 40px rgba(0,102,255,0.35)')
                        : (theme === 'dark'
                          ? '0 8px 30px rgba(0,0,0,0.3)'
                          : '0 8px 30px rgba(0,0,0,0.1)'),
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pkg.ctaText}
                    <Phone className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}