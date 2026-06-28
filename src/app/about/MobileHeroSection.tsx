'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Mobile Hero Section ───
export function MobileHeroSection() {
  const router = useRouter();
  const [btnHovered, setBtnHovered] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const bgColor = theme === 'dark' ? '#020b1c' : '#f0f4ff';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const textMuted = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const borderColor = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const borderColorBlue = theme === 'dark' ? 'rgba(74, 158, 255, 0.3)' : 'rgba(0, 102, 255, 0.2)';
  const borderColorBlueLight = theme === 'dark' ? 'rgba(74, 158, 255, 0.15)' : 'rgba(0, 102, 255, 0.1)';
  const bgCard = theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
  const btnBg = theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)';
  const btnBorder = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const glowColor = theme === 'dark' 
    ? 'rgba(74, 158, 255, 0.2)' 
    : 'rgba(0, 102, 255, 0.15)';

  return (
    <>
      <style>{`
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-orbit {
          animation: rotate-slow 20s linear infinite;
        }
        .glow-blue {
          box-shadow: 0 0 40px ${glowColor};
        }
        .glow-yellow-dot {
          box-shadow: 0 0 10px rgba(255, 180, 0, 0.8);
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .node-icon-bg {
          background: ${bgCard};
          border-color: ${borderColorBlue};
        }
        .node-text {
          color: ${textMuted};
        }
      `}</style>

      {/* ─── Main Content ─── */}
      <main className={`pt-24 pb-12 px-6 flex flex-col items-center min-h-screen transition-colors duration-300`}
        style={{ background: bgColor, color: textColor }}>
        
        {/* ─── HeroTextSection ─── */}
        <section className="w-full max-w-md mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-4 rounded-full" style={{ background: textMuted }}></span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: textMuted }}>
              About Us
            </span>
          </div>
          
          <h1 className="text-4xl font-black leading-tight mb-4">
            Building<br />
            <span className="text-[#ffb400]">Digital</span><br />
            <span className="text-[#4a9eff]">Futures</span>
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12" style={{ background: borderColor }}></div>
            <span className="text-[10px] tracking-[0.3em] font-bold" style={{ color: textMuted }}>
              SINCE 2021
            </span>
            <div className="h-[1px] w-12" style={{ background: borderColor }}></div>
          </div>
          
          <p className="text-sm leading-relaxed max-w-[300px]" style={{ color: textMuted }}>
            We empower institutions to manage and showcase College portfolios —{" "}
            <span className="text-[#ffb400] italic font-bold">
              simply, securely and efficiently.
            </span>
          </p>
          
          <div className="mt-8">
            <button
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              onClick={() => router.push('/products')}
              className="group flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300"
              style={{
                border: `1px solid ${btnHovered ? '#ffb400' : btnBorder}`,
                background: btnHovered ? 'rgba(255, 180, 0, 0.08)' : btnBg,
              }}
            >
              <span className="text-xs font-bold tracking-wide">
                Explore Our Solutions
              </span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300`}
                style={{
                  background: btnHovered ? '#ffb400' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${btnHovered ? '#ffb400' : 'rgba(255,255,255,0.15)'}`
                }}>
                <svg className="h-3.5 w-3.5" fill="none" stroke={btnHovered ? '#000' : '#fff'} viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </button>
          </div>
        </section>

        {/* ─── OrbitalUI ─── */}
        <section className="relative w-full aspect-square max-w-[380px] flex items-center justify-center">
          
          {/* Outer Orbit Rings - Closer to center */}
          <div className="absolute w-[85%] h-[85%] rounded-full border" style={{ borderColor: borderColorBlue }}></div>
          <div className="absolute w-[70%] h-[70%] rounded-full border" style={{ borderColor: borderColorBlueLight }}></div>
          <div className="absolute w-[55%] h-[55%] rounded-full border border-dashed" style={{ borderColor: borderColorBlueLight }}></div>
          
          {/* Central PSM Logo Sphere - No curve, straight text */}
          <div className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center border transition-all duration-300 glow-blue`}
            style={{
              background: theme === 'dark' 
                ? 'radial-gradient(circle at 38% 35%, #6ab4ff 0%, #1a4a9e 35%, #091535 70%, #030918 100%)'
                : 'radial-gradient(circle at 38% 35%, #7abfff 0%, #3b82f6 35%, #1a4a9e 70%, #0d1b3e 100%)',
              borderColor: borderColorBlue,
            }}>
            <div className="text-2xl font-black tracking-wider text-white">
              PSM
            </div>
            <div className="absolute inset-1.5 rounded-full border" style={{ borderColor: 'rgba(74, 158, 255, 0.2)' }}></div>
          </div>
          
          {/* Animated Rotating Container for Orbiting Elements */}
          <div className="absolute w-full h-full animate-orbit">
            
            {/* Feature 1: Secure & Reliable - Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[15%] flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg border flex items-center justify-center node-icon-bg"
                style={{ borderColor: borderColorBlue }}>
                <svg className="h-3.5 w-3.5 text-[#4a9eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[6px] font-bold tracking-[0.12em] text-center uppercase node-text">
                Secure &amp;<br />Reliable
              </span>
            </div>
            
            {/* Feature 2: Data Driven Insights - Right */}
            <div className="absolute top-1/2 right-0 translate-x-[15%] -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg border flex items-center justify-center node-icon-bg"
                style={{ borderColor: borderColorBlue }}>
                <svg className="h-3.5 w-3.5 text-[#4a9eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[6px] font-bold tracking-[0.12em] text-center uppercase node-text">
                Data Driven<br />Insights
              </span>
            </div>
            
            {/* Feature 3: Global Presence - Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[15%] flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg border flex items-center justify-center node-icon-bg"
                style={{ borderColor: borderColorBlue }}>
                <svg className="h-3.5 w-3.5 text-[#4a9eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[6px] font-bold tracking-[0.12em] text-center uppercase node-text">
                Global<br />Presence
              </span>
            </div>
            
            {/* Feature 4: Smart Portfolios - Left */}
            <div className="absolute top-1/2 left-0 -translate-x-[15%] -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg border flex items-center justify-center node-icon-bg"
                style={{ borderColor: borderColorBlue }}>
                <svg className="h-3.5 w-3.5 text-[#4a9eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[6px] font-bold tracking-[0.12em] text-center uppercase node-text">
                Smart<br />Portfolios
              </span>
            </div>
            
            {/* Moving Yellow Dot - Closer to center */}
            <div className="absolute top-[30%] left-[12%] w-1.5 h-1.5 bg-[#ffb400] rounded-full glow-yellow-dot"></div>
          </div>
          
          {/* Static Decorative Stars/Dots */}
          <div className="absolute top-8 right-8 w-1 h-1 rounded-full" style={{ background: '#4a9eff' }}></div>
          <div className="absolute bottom-16 left-16 w-1 h-1 rounded-full opacity-50" style={{ background: '#4a9eff' }}></div>
          <div className="absolute top-1/4 left-4 w-0.5 h-0.5 rounded-full opacity-30" style={{ background: '#fff' }}></div>
        </section>
      </main>

      {/* ─── FooterDecoration ─── */}
      <footer className="fixed bottom-0 left-0 w-full p-4 pointer-events-none opacity-20">
        <div className="flex justify-center space-x-1">
          <div className="w-1 h-1 rounded-full" style={{ background: '#4a9eff' }}></div>
          <div className="w-1 h-1 rounded-full" style={{ background: '#4a9eff' }}></div>
          <div className="w-1 h-1 rounded-full" style={{ background: '#4a9eff' }}></div>
        </div>
      </footer>
    </>
  );
}