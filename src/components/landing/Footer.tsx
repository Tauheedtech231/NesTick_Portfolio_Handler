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

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Detect theme changes
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

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Vision', path: '/vision', icon: Eye },
    { name: 'Templates', path: '/templates', icon: Layout },
    { name: 'About', path: '/about', icon: User },
  ];

  if (!theme) return null;

  const isDark = theme === 'dark';
  const gold = '#E8CA5E';

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        background: isDark
          ? `radial-gradient(ellipse at 15% 20%, rgba(30,110,190,0.35), transparent 45%),
             radial-gradient(ellipse at 85% 15%, rgba(20,80,150,0.3), transparent 50%),
             linear-gradient(180deg, #090920 0%, #0d0d2b 40%, #10102f 100%)`
          : `radial-gradient(ellipse at 15% 20%, rgba(30,110,190,0.10), transparent 45%),
             radial-gradient(ellipse at 85% 15%, rgba(20,80,150,0.08), transparent 50%),
             linear-gradient(180deg, #f0f2f8 0%, #e8ecf5 40%, #e0e4f0 100%)`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ─── DECORATIVE RINGS ─── */}
      <svg 
        className="absolute bottom-[-60px] left-[-60px] w-[200px] h-[200px] pointer-events-none z-0"
        viewBox="0 0 260 260"
      >
        <circle cx="0" cy="260" r="90" fill="none" stroke={isDark ? "rgba(232, 202, 94, 0.18)" : "rgba(232, 202, 94, 0.12)"} strokeWidth="1"/>
        <circle cx="0" cy="260" r="130" fill="none" stroke={isDark ? "rgba(232, 202, 94, 0.18)" : "rgba(232, 202, 94, 0.12)"} strokeWidth="1"/>
        <circle cx="0" cy="260" r="170" fill="none" stroke={isDark ? "rgba(232, 202, 94, 0.18)" : "rgba(232, 202, 94, 0.12)"} strokeWidth="1"/>
      </svg>

      {/* ─── MAIN FOOTER ─── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 px-6 sm:px-8 py-8 md:py-8 pb-16">
        
        {/* ── COL 1: Brand ── */}
        <div className="col-brand">
          <div className="flex items-center gap-3 mb-1">
            <div 
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer"
              style={{
                background: '#fff',
                border: `2px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'}`,
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
                  color: isDark ? '#ffffff' : '#1a1a2e',
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: '1.1',
                }}
              >
                Portfolio Handler
              </div>
            </div>
          </div>
          
          <div 
            className="h-[2px] w-[90px] rounded-[2px] mt-1 mb-3"
            style={{
              background: `linear-gradient(to right, ${gold}, ${gold})`,
            }}
          />

          <p 
            className="text-[13px] leading-[1.65] max-w-[280px] transition-colors duration-300"
            style={{ 
              color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.50)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Empowering educational institutions with modern portfolio management solutions.
          </p>

          {/* ── QUOTE UNDER DESCRIPTION ── */}
          <div 
            className="mt-4 flex items-start gap-2.5 max-w-[280px] cursor-pointer"
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: gold }} />
            <p 
              className="text-[12px] leading-[1.6] italic transition-colors duration-300"
              style={{ 
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
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
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer"
              style={{ 
                background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',
              }}
            >
              <Compass className="w-[18px] h-[18px]" style={{ color: gold }} />
            </div>
            <div className="text-[18px] font-bold transition-colors duration-300 cursor-pointer"
              style={{ 
                color: isDark ? '#ffffff' : '#1a1a2e',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Quick Links
            </div>
          </div>
          
          <div 
            className="h-[2px] w-[70px] rounded-[2px] mb-4"
            style={{
              background: `linear-gradient(to right, ${gold}, ${gold})`,
            }}
          />

          <ul className="flex flex-col gap-3">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="flex items-center gap-3 text-[14px] transition-colors duration-200 hover:text-[#E8CA5E] cursor-pointer"
                    style={{
                      color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: 'none',
                    }}
                  >
                    <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-[15px] h-[15px]" style={{ 
                        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'
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
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer"
              style={{ 
                background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',
              }}
            >
              <MessageCircle className="w-[18px] h-[18px]" style={{ color: gold }} />
            </div>
            <div className="text-[18px] font-bold transition-colors duration-300 cursor-pointer"
              style={{ 
                color: isDark ? '#ffffff' : '#1a1a2e',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Get in Touch
            </div>
          </div>
          
          <div 
            className="h-[2px] w-[70px] rounded-[2px] mb-4"
            style={{
              background: `linear-gradient(to right, ${gold}, ${gold})`,
            }}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 cursor-pointer">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',
                }}
              >
                <Mail className="w-[15px] h-[15px]" style={{ color: gold }} />
              </div>
              <span className="text-[13px] transition-colors duration-300" style={{ 
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
              }}>
                neezamiya@gmail.com
              </span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',
                }}
              >
                <Phone className="w-[15px] h-[15px]" style={{ color: gold }} />
              </div>
              <span className="text-[13px] transition-colors duration-300" style={{ 
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
              }}>
                03237594869
              </span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',
                }}
              >
                <Globe className="w-[15px] h-[15px]" style={{ color: gold }} />
              </div>
              <span className="text-[13px] transition-colors duration-300" style={{ 
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
              }}>
                nesticktech.com
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── WAVE SECTION ─── */}
      <div className="relative w-full h-[100px] z-10">
        {/* Wave SVG */}
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,35 C150,65 300,15 450,35 C600,65 750,15 900,32 C1000,45 1050,35 1200,30 L1200,100 L0,100 Z"
                fill={isDark ? "rgba(20,90,160,0.15)" : "rgba(20,90,160,0.05)"}/>
        </svg>

        {/* Left Text */}
        <div className="absolute left-6 sm:left-8 bottom-4 z-[5]">
          <span className="text-[11px] flex items-center gap-1.5" style={{ 
            color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'
          }}>
            <Shield className="w-3 h-3" style={{ color: gold }} />
            © {currentYear} All Rights Reserved. Neezamiya
          </span>
        </div>

        {/* Right Text */}
        <div className="absolute right-6 sm:right-8 bottom-4 z-[5]">
          <span className="text-[11px] flex items-center gap-1" style={{ 
            color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'
          }}>
            Powered by{' '}
            <span className="font-semibold" style={{ color: gold }}>
              Nestick Tech
            </span>
          </span>
        </div>
      </div>

    </footer>
  );
}