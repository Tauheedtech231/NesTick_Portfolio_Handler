/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
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

  if (!theme) return null;

  const isDark = theme === 'dark';

  // ─── Theme Colors ──────────────────────────────────────────────────────────
  const textMuted = isDark ? '#9db3c9' : '#5a6a7a';

  return (
    <footer className="relative w-full overflow-hidden" style={{
      background: isDark
        ? `radial-gradient(ellipse at 15% 20%, rgba(30,110,190,0.35), transparent 45%),
           radial-gradient(ellipse at 85% 15%, rgba(20,80,150,0.3), transparent 50%),
           linear-gradient(180deg, #090920 0%, #0d0d2b 40%, #10102f 100%)`
        : `radial-gradient(ellipse at 15% 20%, rgba(30,110,190,0.10), transparent 45%),
           radial-gradient(ellipse at 85% 15%, rgba(20,80,150,0.08), transparent 50%),
           linear-gradient(180deg, #f0f2f8 0%, #e8ecf5 40%, #e0e4f0 100%)`,
    }}>
      {/* ─── Content ─── */}
      <div className="relative z-[3] flex justify-between flex-wrap gap-[30px] px-[56px] py-[44px] pb-[20px] max-w-[1100px] mx-auto">
        
        {/* ── Brand Column ── */}
        <div className="flex-1 min-w-[260px]" style={{ flex: '1.1' }}>
          <div className="flex items-center gap-4 mb-[14px]">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden" style={{
              boxShadow: '0 0 15px rgba(255,255,255,0.15)'
            }}>
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-[22px] font-bold mb-1.5" style={{ color: '#fff' }}>Portfolio Handler</h2>
              <div className="relative w-[38px] h-[3px] rounded-[2px] bg-[#e6b800]">
                <div className="absolute -right-[10px] -top-[2px] w-[6px] h-[6px] rounded-full bg-[#e6b800]"></div>
              </div>
            </div>
          </div>
          
          <p className="text-sm leading-[1.6] mt-[14px] mb-5 max-w-[280px]" style={{ color: textMuted }}>
            Empowering educational institutions with modern portfolio management solutions.
          </p>
          
          <div className="relative border rounded-lg px-5 py-[18px] pl-[50px] max-w-[300px]" style={{
            borderColor: 'rgba(230,184,0,0.5)',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <div className="absolute left-[14px] top-[8px] text-[38px] leading-none font-serif font-bold" style={{ color: '#e6b800' }}>
              &ldquo;
            </div>
            <p className="text-sm italic leading-[1.6]" style={{ color: isDark ? '#e8f0f5' : '#1a2a3a' }}>
              "Building the future of education, one portfolio at a time."
            </p>
          </div>
        </div>

        {/* ── Quick Links Column ── */}
        <div className="flex-1 min-w-[260px]">
          <h3 className="text-[20px] font-bold mb-2" style={{ color: '#fff' }}>Quick Links</h3>
          <div className="relative w-[38px] h-[3px] rounded-[2px] bg-[#e6b800] mb-[22px]">
            <div className="absolute -right-[10px] -top-[2px] w-[6px] h-[6px] rounded-full bg-[#e6b800]"></div>
          </div>
          
          {[
            { name: 'Home', icon: 'home', path: '/' },
            { name: 'Vision', icon: 'vision', path: '/vision' },
            { name: 'Templates', icon: 'templates', path: '/templates' },
            { name: 'About', icon: 'about', path: '/about' },
          ].map((item) => (
            <Link key={item.name} href={item.path} className="flex items-center gap-[14px] mb-[18px] cursor-pointer group">
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0" style={{
                background: `radial-gradient(circle at 35% 30%, #2472b8, #0f3556)`,
                color: '#bfe3ff'
              }}>
                {item.icon === 'home' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/>
                  </svg>
                )}
                {item.icon === 'vision' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
                {item.icon === 'templates' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                )}
                {item.icon === 'about' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
                  </svg>
                )}
              </div>
              <span className="text-[15px] flex-1" style={{ color: isDark ? '#e8f0f5' : '#1a2a3a' }}>{item.name}</span>
              <span className="text-sm" style={{ color: textMuted }}>&#8250;</span>
            </Link>
          ))}
        </div>

        {/* ── Contact Column ── */}
        <div className="flex-1 min-w-[260px]">
          <h3 className="text-[20px] font-bold mb-2" style={{ color: '#fff' }}>Get in Touch</h3>
          <div className="relative w-[38px] h-[3px] rounded-[2px] bg-[#e6b800] mb-[22px]">
            <div className="absolute -right-[10px] -top-[2px] w-[6px] h-[6px] rounded-full bg-[#e6b800]"></div>
          </div>
          
          <div className="flex items-center gap-[14px] mb-[18px] cursor-pointer">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0" style={{
              background: `radial-gradient(circle at 35% 30%, #2472b8, #0f3556)`,
              color: '#bfe3ff'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 6 10-6"/>
              </svg>
            </div>
            <span className="text-sm" style={{ color: isDark ? '#e8f0f5' : '#1a2a3a' }}>neezamiya@gmail.com</span>
          </div>
          
          <div className="flex items-center gap-[14px] mb-[18px] cursor-pointer">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0" style={{
              background: `radial-gradient(circle at 35% 30%, #2472b8, #0f3556)`,
              color: '#bfe3ff'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1z"/>
              </svg>
            </div>
            <span className="text-sm" style={{ color: isDark ? '#e8f0f5' : '#1a2a3a' }}>03237594869</span>
          </div>
          
          <div className="flex items-center gap-[14px] mb-[18px] cursor-pointer">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0" style={{
              background: `radial-gradient(circle at 35% 30%, #2472b8, #0f3556)`,
              color: '#bfe3ff'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10c-2.5-2.5-4-6-4-10s1.5-7.5 4-10z"/>
              </svg>
            </div>
            <span className="text-sm" style={{ color: isDark ? '#e8f0f5' : '#1a2a3a' }}>nesticktech.com</span>
          </div>
        </div>
      </div>

      {/* ─── Decorative Wave Section ─── */}
      <div className="relative w-full h-[180px] mt-2.5">
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1100 180" preserveAspectRatio="none">
          <path className="wave-fill" d="M0,90 C150,140 300,40 450,90 C600,140 750,40 900,80 C1000,105 1050,90 1100,70 L1100,180 L0,180 Z"
                fill={isDark ? "rgba(20,90,160,0.25)" : "rgba(20,90,160,0.08)"} style={{
            animation: 'waveShift 8s ease-in-out infinite',
            transformOrigin: 'center',
          }}/>
          <path className="wave-line" d="M0,100 C150,60 300,130 450,95 C600,60 750,130 900,90 C1000,65 1050,90 1100,110"
                stroke="#e6b800" strokeWidth="1.5" fill="none" opacity="0.6" style={{
            strokeDasharray: '6 8',
            animation: 'flowLine 6s linear infinite',
          }}/>
          <path className="wave-line slow" d="M0,110 C150,150 300,70 450,105 C600,140 750,60 900,100 C1000,120 1050,100 1100,85"
                stroke="#3487c9" strokeWidth="1.5" fill="none" opacity="0.5" style={{
            strokeDasharray: '6 8',
            animation: 'flowLine 9s linear infinite reverse',
          }}/>
        </svg>

      

   

        {/* Diamond */}
        <svg className="absolute right-[70px] bottom-[70px] w-[60px] h-[60px] z-[2] drop-shadow-[0_0_15px_rgba(40,140,220,0.5)]" viewBox="0 0 100 100" style={{
          animation: 'floatRotate 6s ease-in-out infinite',
          transformOrigin: 'center',
        }}>
          <polygon points="50,5 90,35 50,95 10,35" fill="#2472b8" opacity="0.9"/>
          <polygon points="50,5 90,35 50,50" fill="#4fa8e0"/>
          <polygon points="50,5 10,35 50,50" fill="#6a5bd0"/>
          <polygon points="10,35 50,95 50,50" fill="#1a4d7a"/>
          <polygon points="90,35 50,95 50,50" fill="#1f5a8c"/>
        </svg>

        {/* Plane */}
        <svg className="absolute right-[55px] top-[30px] w-[90px] z-[2] drop-shadow-[0_0_10px_rgba(40,140,220,0.4)]" viewBox="0 0 100 80" style={{
          animation: 'planeFly 4.5s ease-in-out infinite',
        }}>
          <polygon points="5,45 95,10 60,75 45,50" fill="#2f86c9"/>
          <polygon points="45,50 60,75 50,55" fill="#2472b8"/>
          <polygon points="5,45 45,50 25,35" fill="#7ec4ec"/>
          <path d="M60,75 C75,60 90,40 95,10" stroke="#e6b800" strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.6"/>
        </svg>

        {/* ─── N BADGE REMOVED ─── */}

        {/* Sparks */}
        <div className="absolute w-[5px] h-[5px] rounded-full" style={{
          left: '355px',
          top: '25px',
          background: '#e6b800',
          boxShadow: '0 0 8px 2px rgba(230,184,0,0.7)',
          animation: 'twinkle 2.4s ease-in-out infinite',
        }}></div>
        <div className="absolute w-[5px] h-[5px] rounded-full" style={{
          right: '210px',
          top: '35px',
          background: '#e6b800',
          boxShadow: '0 0 8px 2px rgba(230,184,0,0.7)',
          animation: 'twinkle 2.4s ease-in-out infinite 0.6s',
        }}></div>
        <div className="absolute w-[4px] h-[4px] rounded-full" style={{
          right: '60px',
          top: '8px',
          background: '#e6b800',
          boxShadow: '0 0 8px 2px rgba(230,184,0,0.7)',
          animation: 'twinkle 2.4s ease-in-out infinite 1.2s',
        }}></div>
      </div>

     
   

      {/* ─── CSS Animations ─── */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes flowLine {
          to { stroke-dashoffset: -140; }
        }
        @keyframes waveShift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatRotate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(6deg); }
        }
        @keyframes capBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-3deg); }
        }
        @keyframes planeFly {
          0% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(-8px,-10px) rotate(-4deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
      `}</style>
    </footer>
  );
}