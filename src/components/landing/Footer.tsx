
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import { 
  Home, Eye, Layout, User, 
  Mail, Phone, Globe, Shield, 
  Quote, Compass, MessageCircle,
  Briefcase, BookOpen, Users, 
  Brain, Layers
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ==========================================
// BRAND COLORS
// ==========================================
const GOLD = "#E8CA5E";
const CHOCOLATE = "#7B3F00";
const BLUE = "#0066FF";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    checkTheme();
    
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  // ✅ ALL 5 PRODUCTS ADDED BACK
  const products = [
    { name: 'Portfolio Site Management', icon: Briefcase },
    { name: 'Admission Automation System', icon: BookOpen },
    { name: 'Parent Teacher Management System', icon: Users },
    { name: 'AI Exam Generator', icon: Brain },
    { name: 'Learning Resource Management', icon: Layers },
  ];

  // ==========================================
  // THEME-BASED COLORS
  // ==========================================

  // 1️⃣ Background - FULL WHITE in white mode
  const getBgStyle = () => {
    if (isDark) {
      return `radial-gradient(ellipse at 15% 20%, rgba(30,110,190,0.20), transparent 45%),
              radial-gradient(ellipse at 85% 15%, rgba(20,80,150,0.15), transparent 50%),
              linear-gradient(180deg, #090920 0%, #0d0d2b 40%, #10102f 100%)`;
    }
    return `#FFFFFF`;
  };

  // 2️⃣ Text Colors - Full Black in light, Full White in dark
  const getTextColor = () => {
    return isDark ? '#FFFFFF' : '#000000';
  };

  const getTextMuted = () => {
    return isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
  };

  const getTextLight = () => {
    return isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  };

  // 3️⃣ Borders
  const getBorderColor = () => {
    return isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  };

  // 4️⃣ Card/Quote Background
  const getQuoteBg = () => {
    return isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)';
  };

  const getQuoteShadow = () => {
    return isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)';
  };

  // 5️⃣ Icon Container - Gold in dark, Chocolate in light
  const getIconBg = () => {
    return isDark ? 'rgba(255,255,255,0.04)' : 'rgba(123,63,0,0.06)';
  };

  const getIconShadow = () => {
    return isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.04)';
  };

  // 6️⃣ Link Colors
  const getLinkColor = () => {
    return isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)';
  };

  // 7️⃣ Logo Border
  const getLogoBorder = () => {
    return isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  };

  const getLogoShadow = () => {
    return isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)';
  };

  // 8️⃣ Wave Fill - MUCH DARKER in light mode
  const getWaveFill = () => {
    return isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.12)';
  };

  // 9️⃣ Accent Color - Gold in dark, Chocolate in light
  const getAccentColor = () => {
    return isDark ? GOLD : CHOCOLATE;
  };

  // 🔟 Ring Opacity
  const getRingOpacity = () => {
    return isDark ? '0.06' : '0.08';
  };

  // 1️⃣1️⃣ Product link hover color
  const getProductHoverColor = () => {
    return isDark ? GOLD : CHOCOLATE;
  };

  // 1️⃣2️⃣ Quote icon color
  const getQuoteIconColor = () => {
    return isDark ? GOLD : CHOCOLATE;
  };

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        background: getBgStyle(),
        fontFamily: "'Inter', sans-serif",
        borderTop: isDark ? `1px solid ${getBorderColor()}` : 'none',
      }}
    >
      {/* ─── DECORATIVE RINGS ─── */}
      <svg 
        className="absolute bottom-[-60px] left-[-60px] w-[200px] h-[200px] pointer-events-none z-0"
        viewBox="0 0 260 260"
      >
        <circle cx="0" cy="260" r="90" fill="none" stroke={`rgba(232,202,94,${getRingOpacity()})`} strokeWidth="1"/>
        <circle cx="0" cy="260" r="130" fill="none" stroke={`rgba(232,202,94,${getRingOpacity()})`} strokeWidth="1"/>
        <circle cx="0" cy="260" r="170" fill="none" stroke={`rgba(232,202,94,${getRingOpacity()})`} strokeWidth="1"/>
      </svg>

      {/* ─── MAIN FOOTER ─── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 px-6 sm:px-8 py-8 md:py-10 pb-16">
        
        {/* ── COL 1: Brand ── */}
        <div className="col-brand">
          <div className="flex items-center gap-3 mb-1">
            {/* LARGER LOGO */}
            <div 
              className="w-[64px] h-[64px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                background: '#fff',
                border: `2px solid ${getLogoBorder()}`,
                boxShadow: getLogoShadow(),
              }}
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              {/* PSM only - REMOVED PORTFOLIO SYSTEM */}
              <div className="text-[28px] font-bold transition-colors duration-300 cursor-pointer"
                style={{ 
                  color: getTextColor(),
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: '1.1',
                }}
              >
                PSM
              </div>
            </div>
          </div>
          
          {/* ✅ REMOVED: Accent Line under logo */}
          {/* <div 
            className="h-[2px] w-[90px] rounded-[2px] mt-1 mb-3"
            style={{
              background: `linear-gradient(to right, ${getAccentColor()}, ${getAccentColor()})`,
            }}
          /> */}

          <p 
            className="text-[14px] leading-[1.65] max-w-[280px] transition-colors duration-300"
            style={{ 
              color: getTextMuted(),
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Empowering educational institutions with modern portfolio management solutions.
          </p>

          {/* ── QUOTE - EXPANDED TEXT ── */}
          <div 
            className="mt-4 flex items-start gap-2.5 max-w-[280px] cursor-pointer transition-all duration-300 hover:shadow-md"
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: getQuoteBg(),
              border: `1px solid ${getBorderColor()}`,
              boxShadow: getQuoteShadow(),
            }}
          >
            <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: getQuoteIconColor() }} />
            <p 
              className="text-[12px] leading-[1.6] italic transition-colors duration-300"
              style={{ 
                color: getTextMuted(),
                fontFamily: "'Inter', sans-serif",
              }}
            >
              "Empowering the next generation of learners through innovative portfolio solutions, 
              transforming educational experiences one institution at a time."
            </p>
          </div>
        </div>

        {/* ── COL 2: Products ── */}
        <div className="col-products md:px-6">
          <div className="flex items-center gap-3 mb-1.5">
            
            <div className="text-[20px] font-bold transition-colors duration-300 cursor-pointer"
              style={{ 
                color: getTextColor(),
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Products
            </div>
          </div>
          
          {/* ✅ REMOVED: Accent Line under Products */}
          {/* <div 
            className="h-[2px] w-[70px] rounded-[2px] mb-4"
            style={{
              background: `linear-gradient(to right, ${getAccentColor()}, ${getAccentColor()})`,
            }}
          /> */}

          <ul className="flex flex-col gap-3">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <li key={product.name}>
                  <Link
                    href="#"
                    className="flex items-center gap-3 text-[14px] transition-all duration-200 cursor-pointer group"
                    style={{
                      color: getLinkColor(),
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = getProductHoverColor();
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = getLinkColor();
                      e.currentTarget.style.transform = 'translateX(0px)';
                    }}
                  >
                    {/* ROUNDED ICON CONTAINER - Chocolate in light mode */}
                    <span 
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{ 
                        background: getIconBg(),
                        border: `1px solid ${getBorderColor()}`,
                      }}
                    >
                      <Icon className="w-[14px] h-[14px] transition-colors duration-200" style={{ 
                        color: getAccentColor() // Chocolate in light, Gold in dark
                      }} />
                    </span>
                    {product.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── COL 3: Get in Touch ── */}
        <div className="col-contact md:px-4">
          <div className="flex items-center gap-3 mb-1.5">
          
            <div className="text-[20px] font-bold transition-colors duration-300 cursor-pointer"
              style={{ 
                color: getTextColor(),
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Get in Touch
            </div>
          </div>
          
          {/* ✅ REMOVED: Accent Line under Get in Touch */}
          {/* <div 
            className="h-[2px] w-[70px] rounded-[2px] mb-4"
            style={{
              background: `linear-gradient(to right, ${getAccentColor()}, ${getAccentColor()})`,
            }}
          /> */}

          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                style={{ 
                  background: getIconBg(),
                  border: `1px solid ${getBorderColor()}`,
                  boxShadow: getIconShadow(),
                }}
              >
                <Mail className="w-[15px] h-[15px]" style={{ color: getAccentColor() }} />
              </div>
              <span className="text-[14px] transition-colors duration-300 group-hover:text-[#E8CA5E]" style={{ 
                color: getLinkColor(),
              }}>
                neezamiya@gmail.com
              </span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                style={{ 
                  background: getIconBg(),
                  border: `1px solid ${getBorderColor()}`,
                  boxShadow: getIconShadow(),
                }}
              >
                <Phone className="w-[15px] h-[15px]" style={{ color: getAccentColor() }} />
              </div>
              <span className="text-[14px] transition-colors duration-300 group-hover:text-[#E8CA5E]" style={{ 
                color: getLinkColor(),
              }}>
                03237594869
              </span>
            </div>

            {/* SECOND PHONE NUMBER */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                style={{ 
                  background: getIconBg(),
                  border: `1px solid ${getBorderColor()}`,
                  boxShadow: getIconShadow(),
                }}
              >
                <Phone className="w-[15px] h-[15px]" style={{ color: getAccentColor() }} />
              </div>
              <span className="text-[14px] transition-colors duration-300 group-hover:text-[#E8CA5E]" style={{ 
                color: getLinkColor(),
              }}>
                03193236529
              </span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                style={{ 
                  background: getIconBg(),
                  border: `1px solid ${getBorderColor()}`,
                  boxShadow: getIconShadow(),
                }}
              >
                <Globe className="w-[15px] h-[15px]" style={{ color: getAccentColor() }} />
              </div>
              <span className="text-[14px] transition-colors duration-300 group-hover:text-[#E8CA5E]" style={{ 
                color: getLinkColor(),
              }}>
                https://neezamiya.com/
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── WAVE SECTION - MUCH DARKER ─── */}
      <div 
        className="relative w-full h-[100px] z-10"
        style={{
          boxShadow: 'none',
        }}
      >
        {/* Wave SVG - Much darker in light mode */}
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,35 C150,65 300,15 450,35 C600,65 750,15 900,32 C1000,45 1050,35 1200,30 L1200,100 L0,100 Z"
                fill={getWaveFill()}/>
        </svg>

        {/* Left Text */}
        <div className="absolute left-6 sm:left-8 bottom-4 z-[5]">
          <span className="text-[12px] flex items-center gap-1.5" style={{ 
            color: getTextLight()
          }}>
            <Shield className="w-3 h-3" style={{ color: getAccentColor() }} />
            © {currentYear} All Rights Reserved. PSM
          </span>
        </div>

        {/* Right Text */}
        <div className="absolute right-6 sm:right-8 bottom-4 z-[5]">
          <span className="text-[12px] flex items-center gap-1" style={{ 
            color: getTextLight()
          }}>
            Powered by{' '}
            <span className="font-semibold transition-colors duration-300 hover:opacity-80 cursor-pointer" style={{ color: getAccentColor() }}>
              Nestick Tech
            </span>
          </span>
        </div>
      </div>

    </footer>
  );
}