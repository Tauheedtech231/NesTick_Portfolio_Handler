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

  // ─── REFERENCE GOLD COLOR ONLY ────────────────────────────────────────────
  const gold = '#E8CA5E';  // ← CHANGED: Only this

  return (
    <footer
      className="relative overflow-hidden transition-colors duration-300"
      style={{
        background: isDark ? '#0d1235' : '#f8f9fa',  // ← SAME AS BEFORE
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,  // ← SAME
        fontFamily: "'Inter', sans-serif",  // ← SAME
      }}
    >
      {/* ─── DECORATIVE RINGS - Only gold updated ─── */}
      <svg 
        className="absolute bottom-[-60px] left-[-60px] w-[200px] h-[200px] pointer-events-none z-0"
        viewBox="0 0 260 260"
      >
        <circle cx="0" cy="260" r="90" fill="none" stroke={isDark ? "rgba(232, 202, 94, 0.18)" : "rgba(232, 202, 94, 0.12)"} strokeWidth="1"/>
        <circle cx="0" cy="260" r="130" fill="none" stroke={isDark ? "rgba(232, 202, 94, 0.18)" : "rgba(232, 202, 94, 0.12)"} strokeWidth="1"/>
        <circle cx="0" cy="260" r="170" fill="none" stroke={isDark ? "rgba(232, 202, 94, 0.18)" : "rgba(232, 202, 94, 0.12)"} strokeWidth="1"/>
      </svg>

      {/* ─── MAIN FOOTER ─── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 px-6 sm:px-8 py-8 md:py-10">
        
        {/* ── COL 1: Brand ── */}
        <div className="col-brand">
          <div className="flex items-center gap-3 mb-1">
            <div 
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer"
              style={{
                background: '#fff',
                border: `2px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'}`,  // ← SAME
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
                  color: isDark ? '#ffffff' : '#1a1a2e',  // ← SAME
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
              background: `linear-gradient(to right, ${gold}, ${gold})`,  // ← UPDATED: gold
            }}
          />

          <p 
            className="text-[13px] leading-[1.65] max-w-[280px] transition-colors duration-300"
            style={{ 
              color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.50)',  // ← SAME
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
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',  // ← SAME
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,  // ← SAME
            }}
          >
            <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: isDark ? gold : gold }} />  {/* ← UPDATED: gold */}
            <p 
              className="text-[12px] leading-[1.6] italic transition-colors duration-300"
              style={{ 
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',  // ← SAME
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
                background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',  // ← SAME
              }}
            >
              <Compass className="w-[18px] h-[18px]" style={{ color: gold }} />  {/* ← UPDATED: gold */}
            </div>
            <div className="text-[18px] font-bold transition-colors duration-300 cursor-pointer"
              style={{ 
                color: isDark ? '#ffffff' : '#1a1a2e',  // ← SAME
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Quick Links
            </div>
          </div>
          
          <div 
            className="h-[2px] w-[70px] rounded-[2px] mb-4"
            style={{
              background: `linear-gradient(to right, ${gold}, ${gold})`,  // ← UPDATED: gold
            }}
          />

          <ul className="flex flex-col gap-3">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="flex items-center gap-3 text-[14px] transition-colors duration-200 hover:text-[#E8CA5E] cursor-pointer"  // ← UPDATED: gold hover
                    style={{
                      color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',  // ← SAME
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: 'none',
                    }}
                  >
                    <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-[15px] h-[15px]" style={{ 
                        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'  // ← SAME
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
                background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',  // ← SAME
              }}
            >
              <MessageCircle className="w-[18px] h-[18px]" style={{ color: gold }} />  {/* ← UPDATED: gold */}
            </div>
            <div className="text-[18px] font-bold transition-colors duration-300 cursor-pointer"
              style={{ 
                color: isDark ? '#ffffff' : '#1a1a2e',  // ← SAME
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Get in Touch
            </div>
          </div>
          
          <div 
            className="h-[2px] w-[70px] rounded-[2px] mb-4"
            style={{
              background: `linear-gradient(to right, ${gold}, ${gold})`,  // ← UPDATED: gold
            }}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 cursor-pointer">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',  // ← SAME
                }}
              >
                <Mail className="w-[15px] h-[15px]" style={{ color: gold }} />  {/* ← UPDATED: gold */}
              </div>
              <span className="text-[13px] transition-colors duration-300" style={{ 
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',  // ← SAME
              }}>
                neezamiya@gmail.com
              </span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',  // ← SAME
                }}
              >
                <Phone className="w-[15px] h-[15px]" style={{ color: gold }} />  {/* ← UPDATED: gold */}
              </div>
              <span className="text-[13px] transition-colors duration-300" style={{ 
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',  // ← SAME
              }}>
                03237594869
              </span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer">
              <div 
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: isDark ? 'rgba(100,60,220,0.35)' : 'rgba(100,60,220,0.10)',  // ← SAME
                }}
              >
                <Globe className="w-[15px] h-[15px]" style={{ color: gold }} />  {/* ← UPDATED: gold */}
              </div>
              <span className="text-[13px] transition-colors duration-300" style={{ 
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',  // ← SAME
              }}>
                nesticktech.com
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── BOTTOM BAR ─── */}
      <div 
        className="relative z-10 border-t px-6 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 transition-colors duration-300"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',  // ← SAME
        }}
      >
        <div className="flex items-center gap-2 text-[12px] transition-colors duration-300 cursor-pointer" style={{ 
          color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',  // ← SAME
        }}>
          <Shield className="w-3.5 h-3.5" style={{ 
            color: gold  // ← UPDATED: gold
          }} />
          © {currentYear} Portfolio Handler. All rights reserved.
        </div>
        <div className="text-[12px] flex items-center gap-1 transition-colors duration-300 cursor-pointer" style={{ 
          color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',  // ← SAME
        }}>
          Powered by{' '}
          <span className="font-semibold" style={{ color: gold }}>  {/* ← UPDATED: gold */}
            Nestick Tech
          </span>
        </div>
      </div>

    </footer>
  );
}