/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import { 
  Home, Eye, Layout, User, 
  Mail, Phone, Globe, Shield, 
  Quote, Compass, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ==========================================
// BRAND COLORS - SIRF SUBTLE HIGHLIGHTS
// ==========================================
const GOLD = "#E8CA5E";
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

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Vision', path: '/vision', icon: Eye },
    { name: 'Templates', path: '/templates', icon: Layout },
    { name: 'About', path: '/about', icon: User },
  ];

  if (!theme) return null;

  const isDark = theme === 'dark';

  // ==========================================
  // WHITE MODE - FULL WHITE WITH SHADOW
  // BLACK MODE - AS IS
  // ==========================================

  // 1️⃣ Background - FULL WHITE in white mode
  const getBgStyle = () => {
    if (isDark) {
      return `radial-gradient(ellipse at 15% 20%, rgba(30,110,190,0.20), transparent 45%),
              radial-gradient(ellipse at 85% 15%, rgba(20,80,150,0.15), transparent 50%),
              linear-gradient(180deg, #090920 0%, #0d0d2b 40%, #10102f 100%)`;
    }
    // White mode: FULL WHITE background
    return `#FFFFFF`;
  };

  // 2️⃣ Text Colors - Better contrast in white mode
  const getTextColor = () => {
    return isDark ? '#F1F5F9' : '#0F172A';
  };

  const getTextMuted = () => {
    return isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.55)';
  };

  const getTextLight = () => {
    return isDark ? 'rgba(255,255,255,0.35)' : 'rgba(15,23,42,0.35)';
  };

  // 3️⃣ Borders - Subtle
  const getBorderColor = () => {
    return isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  };

  // 4️⃣ Card/Quote Background - White mode with shadow
  const getQuoteBg = () => {
    return isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)';
  };

  const getQuoteShadow = () => {
    return isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)';
  };

  // 5️⃣ Icon Container - Minimal
  const getIconBg = () => {
    return isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)';
  };

  const getIconShadow = () => {
    return isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.04)';
  };

  // 6️⃣ Link Colors
  const getLinkColor = () => {
    return isDark ? 'rgba(255,255,255,0.60)' : 'rgba(15,23,42,0.55)';
  };

  // 7️⃣ Logo Border
  const getLogoBorder = () => {
    return isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  };

  const getLogoShadow = () => {
    return isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)';
  };

  // 8️⃣ Wave Fill - More visible in white mode
  const getWaveFill = () => {
    return isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  };

  // 9️⃣ Wave Shadow - REMOVED
  const getWaveShadow = () => {
    return 'none'; // Shadow completely removed
  };

  // 🔟 Gold Ring Opacity - More visible in white mode
  const getRingOpacity = () => {
    return isDark ? '0.06' : '0.08';
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
      {/* ─── DECORATIVE RINGS - SUBTLE ─── */}
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
            <div 
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                background: '#fff',
                border: `2px solid ${getLogoBorder()}`,
                boxShadow: getLogoShadow(),
              }}
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={52}
                height={52}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="text-[22px] font-bold transition-colors duration-300 cursor-pointer"
                style={{ 
                  color: getTextColor(),
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: '1.1',
                }}
              >
                Portfolio Handler
              </div>
            </div>
          </div>
          
          {/* Gold Accent Line - SUBTLE HIGHLIGHT */}
          <div 
            className="h-[2px] w-[90px] rounded-[2px] mt-1 mb-3"
            style={{
              background: `linear-gradient(to right, ${GOLD}, ${GOLD})`,
            }}
          />

          <p 
            className="text-[13px] leading-[1.65] max-w-[280px] transition-colors duration-300"
            style={{ 
              color: getTextMuted(),
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Empowering educational institutions with modern portfolio management solutions.
          </p>

          {/* ── QUOTE - WHITE MODE WITH SHADOW ── */}
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
            <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
            <p 
              className="text-[12px] leading-[1.6] italic transition-colors duration-300"
              style={{ 
                color: getTextMuted(),
                fontFamily: "'Inter', sans-serif",
              }}
            >
              "Building the future of education, one portfolio at a time."
            </p>
          </div>
        </div>

        {/* ── COL 2: Quick Links ── */}
        <div className="col-links md:px-6">
          <div className="flex items-center gap-3 mb-1.5">
            <div 
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ 
                background: getIconBg(),
                border: `1px solid ${getBorderColor()}`,
                boxShadow: getIconShadow(),
              }}
            >
              <Compass className="w-[18px] h-[18px]" style={{ color: GOLD }} />
            </div>
            <div className="text-[18px] font-bold transition-colors duration-300 cursor-pointer"
              style={{ 
                color: getTextColor(),
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Quick Links
            </div>
          </div>
          
          {/* Gold Accent Line - SUBTLE */}
          <div 
            className="h-[2px] w-[70px] rounded-[2px] mb-4"
            style={{
              background: `linear-gradient(to right, ${GOLD}, ${GOLD})`,
            }}
          />

          <ul className="flex flex-col gap-3">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="flex items-center gap-3 text-[14px] transition-all duration-200 cursor-pointer group"
                    style={{
                      color: getLinkColor(),
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = GOLD;
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = getLinkColor();
                      e.currentTarget.style.transform = 'translateX(0px)';
                    }}
                  >
                    <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-[15px] h-[15px] transition-colors duration-200" style={{ 
                        color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)'
                      }} />
                    </span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── COL 3: Get in Touch ── */}
        <div className="col-contact md:px-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div 
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ 
                background: getIconBg(),
                border: `1px solid ${getBorderColor()}`,
                boxShadow: getIconShadow(),
              }}
            >
              <MessageCircle className="w-[18px] h-[18px]" style={{ color: GOLD }} />
            </div>
            <div className="text-[18px] font-bold transition-colors duration-300 cursor-pointer"
              style={{ 
                color: getTextColor(),
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Get in Touch
            </div>
          </div>
          
          {/* Gold Accent Line - SUBTLE */}
          <div 
            className="h-[2px] w-[70px] rounded-[2px] mb-4"
            style={{
              background: `linear-gradient(to right, ${GOLD}, ${GOLD})`,
            }}
          />

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
                <Mail className="w-[15px] h-[15px]" style={{ color: GOLD }} />
              </div>
              <span className="text-[13px] transition-colors duration-300 group-hover:text-[#E8CA5E]" style={{ 
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
                <Phone className="w-[15px] h-[15px]" style={{ color: GOLD }} />
              </div>
              <span className="text-[13px] transition-colors duration-300 group-hover:text-[#E8CA5E]" style={{ 
                color: getLinkColor(),
              }}>
                03237594869
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
                <Globe className="w-[15px] h-[15px]" style={{ color: GOLD }} />
              </div>
              <span className="text-[13px] transition-colors duration-300 group-hover:text-[#E8CA5E]" style={{ 
                color: getLinkColor(),
              }}>
                nesticktech.com
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── WAVE SECTION - SHADOW REMOVED ─── */}
      <div 
        className="relative w-full h-[100px] z-10"
        style={{
          boxShadow: 'none', // Shadow completely removed
        }}
      >
        {/* Wave SVG - More visible in white mode */}
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,35 C150,65 300,15 450,35 C600,65 750,15 900,32 C1000,45 1050,35 1200,30 L1200,100 L0,100 Z"
                fill={getWaveFill()}/>
        </svg>

        {/* Left Text */}
        <div className="absolute left-6 sm:left-8 bottom-4 z-[5]">
          <span className="text-[11px] flex items-center gap-1.5" style={{ 
            color: getTextLight()
          }}>
            <Shield className="w-3 h-3" style={{ color: GOLD }} />
            © {currentYear} All Rights Reserved. Neezamiya
          </span>
        </div>

        {/* Right Text */}
        <div className="absolute right-6 sm:right-8 bottom-4 z-[5]">
          <span className="text-[11px] flex items-center gap-1" style={{ 
            color: getTextLight()
          }}>
            Powered by{' '}
            <span className="font-semibold transition-colors duration-300 hover:opacity-80 cursor-pointer" style={{ color: GOLD }}>
              Nestick Tech
            </span>
          </span>
        </div>
      </div>

    </footer>
  );
}