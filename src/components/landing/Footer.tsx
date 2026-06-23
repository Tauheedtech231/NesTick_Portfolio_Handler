'use client';

import { Heart, Sparkles, GraduationCap, BookOpen, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // Wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight ?? 200;
    };

    resize();
    window.addEventListener("resize", resize);

    // Wave colors - Dark mode: gold, Light mode: solid blue
    const waves = theme === 'dark' ? [
      { amp: 20, freq: 0.011, speed: 0.00035, yRatio: 0.45, color: "rgba(255,210,0,0.55)", lw: 3.5 },
      { amp: 15, freq: 0.017, speed: 0.0005,  yRatio: 0.38, color: "rgba(255,210,0,0.3)", lw: 2.5 },
      { amp: 26, freq: 0.007, speed: 0.00025, yRatio: 0.58, color: "rgba(0,120,255,0.25)", lw: 4.0 },
      { amp: 12, freq: 0.023, speed: 0.0006,  yRatio: 0.32, color: "rgba(255,230,80,0.2)", lw: 2.0 },
      { amp: 20, freq: 0.014, speed: 0.0004,  yRatio: 0.52, color: "rgba(0,90,220,0.18)", lw: 3.0 },
    ] : [
      { amp: 20, freq: 0.011, speed: 0.00035, yRatio: 0.45, color: "#1A73E8", lw: 3.5 },
      { amp: 15, freq: 0.017, speed: 0.0005,  yRatio: 0.38, color: "#1A73E8", lw: 2.5 },
      { amp: 26, freq: 0.007, speed: 0.00025, yRatio: 0.58, color: "#1A73E8", lw: 4.0 },
      { amp: 12, freq: 0.023, speed: 0.0006,  yRatio: 0.32, color: "#1A73E8", lw: 2.0 },
      { amp: 20, freq: 0.014, speed: 0.0004,  yRatio: 0.52, color: "#1A73E8", lw: 3.0 },
    ];

    const draw = (ts: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      waves.forEach((wv) => {
        const off = ts * wv.speed;
        ctx.beginPath();
        ctx.strokeStyle = wv.color;
        ctx.lineWidth = wv.lw;
        ctx.shadowColor = theme === 'dark' ? "rgba(255,210,0,0.3)" : "rgba(26,115,232,0.2)";
        ctx.shadowBlur = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let x = 0; x <= w; x += 2) {
          const y =
            h * wv.yRatio +
            Math.sin(x * wv.freq + off) * wv.amp +
            Math.sin(x * wv.freq * 1.6 + off * 0.75) * wv.amp * 0.35;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Vision", path: "/vision" },
    { name: "Templates", path: "/templates" },
    { name: "About", path: "/about" }
  ];
  
  const quickLinks = [
    { name: "Vision", path: "/vision" },
    { name: "Templates", path: "/templates" },
    { name: "About", path: "/about" }
  ];
  
  const barHeights = [10, 18, 14, 20, 11];

  return (
    <footer
      className="relative w-full font-sans transition-colors duration-500"
      style={{
        background: theme === 'dark'
          ? "linear-gradient(135deg, #000814 0%, #001233 50%, #000814 100%)"
          : "#FFFFFF",
      }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: theme === 'dark'
            ? "radial-gradient(rgba(255,215,0,0.04) 1px, transparent 1px)"
            : "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Glow effects - Dark mode only */}
      {theme === 'dark' && (
        <>
          <div
            className="pointer-events-none absolute left-0 top-0 z-[2] h-48 w-48"
            style={{ background: "radial-gradient(ellipse, rgba(0,80,200,0.18) 0%, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 z-[2] h-48 w-48"
            style={{ background: "radial-gradient(ellipse, rgba(0,60,180,0.15) 0%, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-5 z-[2] h-44 w-80 -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 70%)" }}
          />
        </>
      )}

   {/* Navbar */}
<nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-9 py-3 md:py-4">
  {/* Logo */}
  <Link
    href="/"
    className="flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
  >
    <div 
      className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 overflow-hidden rounded-xl"
      style={{
        background: theme === 'dark' 
          ? "rgba(255,220,0,0.08)"
          : "rgba(0,0,0,0.04)",
        border: theme === 'dark'
          ? "1px solid rgba(255,220,0,0.2)"
          : "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Image
        src="/logo.jpg"
        alt="Portfolio Handler Logo"
        fill
        className="object-cover"
      />
    </div>
  </Link>

  {/* Navigation - CENTER */}
  <ul className="hidden md:flex gap-7 absolute left-1/2 transform -translate-x-1/2">
    {navLinks.map((link) => (
      <li key={link.name}>
        <Link
          href={link.path}
          className="text-[14px] font-medium transition-all duration-300 cursor-pointer relative group"
          style={{
            color: theme === 'dark' ? "rgba(255,255,255,0.6)" : "#000000",
          }}
        >
          {link.name}
          <span 
            className="absolute -bottom-0.5 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
            style={{
              background: theme === 'dark' 
                ? "linear-gradient(90deg, #ffd700, #ffed4a)"
                : "#1A73E8",
            }}
          />
        </Link>
      </li>
    ))}
  </ul>

  {/* Contact Info - Email & Phone only */}
  <div className="hidden sm:flex flex-col items-end gap-1">
    <div className="flex items-center gap-2">
      <Mail className="w-3.5 h-3.5" style={{ color: theme === 'dark' ? "#ffd700" : "#1A73E8" }} />
      <span 
        className="text-[12px] md:text-[13px] font-medium whitespace-nowrap"
        style={{
          color: theme === 'dark' ? "rgba(255,255,255,0.6)" : "#000000",
        }}
      >
        neezamiya@gmail.com
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Phone className="w-3.5 h-3.5" style={{ color: theme === 'dark' ? "#ffd700" : "#1A73E8" }} />
      <span 
        className="text-[12px] md:text-[13px] font-medium whitespace-nowrap"
        style={{
          color: theme === 'dark' ? "rgba(255,255,255,0.6)" : "#000000",
        }}
      >
        03237594869
      </span>
    </div>
  </div>

  {/* Mobile Contact Icons */}
  <div className="flex sm:hidden items-center gap-2">
    <Link
      href="mailto:neezamiya@gmail.com"
      className="p-2 rounded-lg transition-colors"
      style={{
        color: theme === 'dark' ? "rgba(255,255,255,0.5)" : "#000000",
        background: theme === 'dark' ? "rgba(255,220,0,0.05)" : "rgba(0,0,0,0.03)",
      }}
    >
      <Mail className="w-4 h-4" />
    </Link>
    <Link
      href="tel:03237594869"
      className="p-2 rounded-lg transition-colors"
      style={{
        color: theme === 'dark' ? "rgba(255,255,255,0.5)" : "#000000",
        background: theme === 'dark' ? "rgba(255,220,0,0.05)" : "rgba(0,0,0,0.03)",
      }}
    >
      <Phone className="w-4 h-4" />
    </Link>
  </div>
</nav>

      {/* Body: waves + content */}
      <div className="relative h-44 sm:h-48 md:h-52 w-full">
        <canvas ref={canvasRef} className="absolute inset-0 z-[1] h-full w-full" />

        <div className="absolute inset-0 z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-9 py-3 md:py-4">
          {/* Quick Links - Desktop only */}
          <div className="hidden md:block">
            <p
              className="mb-2 md:mb-3 text-[10px] md:text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2"
              style={{
                color: theme === 'dark' ? "rgba(255,215,0,0.4)" : "#000000",
              }}
            >
              <BookOpen className="w-3 h-3" />
              Quick Links
            </p>
            <ul className="flex flex-col gap-1.5 md:gap-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-[13px] md:text-[14px] transition-all duration-300 cursor-pointer hover:translate-x-1 inline-block font-medium"
                    style={{
                      color: theme === 'dark' ? "rgba(255,255,255,0.5)" : "#000000",
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand title - CENTER */}
          <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <div className="flex items-center gap-1.5 md:gap-2">
              <GraduationCap 
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                style={{
                  color: theme === 'dark' ? "#ffd700" : "#000000",
                  opacity: 0.7
                }}
              />
              <h1
                className="text-[18px] sm:text-[24px] md:text-[34px] font-bold tracking-tight text-center"
                style={{
                  color: theme === 'dark' ? "#ffd700" : "#000000",
                }}
              >
                Portfolio Handler
              </h1>
            </div>
            <p 
              className="text-[8px] sm:text-[10px] md:text-xs font-light tracking-wider"
              style={{
                color: theme === 'dark' ? "rgba(255,255,255,0.3)" : "#000000",
              }}
            >
              Empowering Education
            </p>
          </div>

          {/* Trusted by + Badge - Desktop only */}
          <div className="hidden md:flex min-w-[120px] flex-col items-center gap-2">
            <span 
              className="text-[11px] flex items-center gap-1.5"
              style={{
                color: theme === 'dark' ? "rgba(255,215,0,0.45)" : "#000000",
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: theme === 'dark' ? "#ffd700" : "#1A73E8" }} />
              Trusted by 500+
            </span>

            {/* Trust Badge */}
            <svg
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[60px] w-[60px] md:h-[74px] md:w-[74px] cursor-pointer transition-transform duration-300 hover:scale-110"
              style={{ animation: "badgefloat 3s ease-in-out infinite" }}
            >
              <defs>
                <radialGradient id="gOuter" cx="50%" cy="35%" r="55%">
                  <stop offset="0%" stopColor={theme === 'dark' ? "#fff5a0" : "#1A73E8"} />
                  <stop offset="50%" stopColor={theme === 'dark' ? "#e6ac00" : "#1A73E8"} />
                  <stop offset="100%" stopColor={theme === 'dark' ? "#7a5500" : "#1A73E8"} />
                </radialGradient>
                <radialGradient id="gInner" cx="50%" cy="35%" r="55%">
                  <stop offset="0%" stopColor={theme === 'dark' ? "#001a4d" : "#FFFFFF"} />
                  <stop offset="100%" stopColor={theme === 'dark' ? "#000814" : "#F5F5F5"} />
                </radialGradient>
                <radialGradient id="gShine" cx="38%" cy="28%" r="55%">
                  <stop offset="0%" stopColor={theme === 'dark' ? "#fff9c0" : "#FFFFFF"} stopOpacity="0.45" />
                  <stop offset="100%" stopColor={theme === 'dark' ? "#e6ac00" : "#1A73E8"} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ribbon */}
              <path d="M27 57 L36 63 L45 57 L45 51 L36 55 L27 51Z" fill={theme === 'dark' ? "#c8920a" : "#1A73E8"} />
              <path d="M27 51 L36 55 L45 51" stroke={theme === 'dark' ? "#7a5500" : "#0D47A1"} strokeWidth="0.5" fill="none" />

              {/* Outer disc */}
              <circle cx="36" cy="33" r="24" fill="url(#gOuter)" stroke={theme === 'dark' ? "#9a7000" : "#1A73E8"} strokeWidth="0.5" />

              {/* Sunburst spikes */}
              <g transform="translate(36,33)" fill={theme === 'dark' ? "#f5d020" : "#1A73E8"} opacity="0.85">
                <polygon points="0,-24 1.6,-19 -1.6,-19" />
                <polygon points="0,24 1.6,19 -1.6,19" />
                <polygon points="-24,0 -19,1.6 -19,-1.6" />
                <polygon points="24,0 19,1.6 19,-1.6" />
                <polygon points="-17,-17 -13.5,-13.5 -13,-14.5" />
                <polygon points="17,-17 13,-14.5 13.5,-13.5" />
                <polygon points="-17,17 -13.5,13.5 -13,14.5" />
                <polygon points="17,17 13,14.5 13.5,13.5" />
                <polygon points="-22,-9 -17,-7 -17.5,-10" />
                <polygon points="22,-9 17.5,-10 17,-7" />
                <polygon points="-9,-22 -10,-17.5 -7,-17" />
                <polygon points="9,-22 7,-17 10,-17.5" />
                <polygon points="-22,9 -17.5,10 -17,7" />
                <polygon points="22,9 17,7 17.5,10" />
                <polygon points="-9,22 -7,17 -10,17.5" />
                <polygon points="9,22 10,17.5 7,17" />
              </g>

              {/* Ring border */}
              <circle cx="36" cy="33" r="20" fill="none" stroke={theme === 'dark' ? "#f0c800" : "#1A73E8"} strokeWidth="1.5" />

              {/* Shine */}
              <circle cx="36" cy="33" r="24" fill="url(#gShine)" />

              {/* Inner */}
              <circle cx="36" cy="33" r="17" fill="url(#gInner)" stroke={theme === 'dark' ? "#1a3a80" : "#1A73E8"} strokeWidth="0.8" />
              <circle cx="36" cy="33" r="16" fill="none" stroke={theme === 'dark' ? "#2a52a0" : "#1A73E8"} strokeWidth="0.5" strokeDasharray="2 2" />

              {/* Graduation cap */}
              <g transform="translate(36,33)">
                <polygon points="0,-9 8,-5 0,-1 -8,-5" fill={theme === 'dark' ? "#ffd700" : "#1A73E8"} stroke={theme === 'dark' ? "#b8860b" : "#0D47A1"} strokeWidth="0.4" />
                <polygon points="0,-9 8,-5 0,-1 -8,-5" fill={theme === 'dark' ? "#fff9a0" : "#BBDEFB"} opacity="0.25" />
                <rect x="-1" y="-1" width="2" height="5" rx="0.5" fill={theme === 'dark' ? "#ffd700" : "#1A73E8"} />
                <line x1="8" y1="-5" x2="9" y2="0" stroke={theme === 'dark' ? "#ffd700" : "#1A73E8"} strokeWidth="1" />
                <circle cx="9" cy="1.5" r="1.8" fill={theme === 'dark' ? "#ffd700" : "#1A73E8"} />
                <text x="-5.5" y="9" fill={theme === 'dark' ? "#ffd700" : "#1A73E8"} fontSize="5" textAnchor="middle" fontFamily="Inter,sans-serif">★</text>
                <text x="5.5" y="9" fill={theme === 'dark' ? "#ffd700" : "#1A73E8"} fontSize="5" textAnchor="middle" fontFamily="Inter,sans-serif">★</text>
              </g>
            </svg>

            {/* Sound bars */}
            <div className="flex h-4 md:h-5 items-end gap-[3px]">
              {barHeights.map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-sm"
                  style={{
                    height: `${h}px`,
                    background: theme === 'dark'
                      ? "linear-gradient(180deg, #ffd700, #7a5c00)"
                      : "linear-gradient(180deg, #1A73E8, #1A73E8)",
                    animation: `barpulse 2s ease-in-out ${i * 0.1}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-9 py-2.5 md:py-3.5 gap-2 md:gap-0"
        style={{
          borderTop: theme === 'dark'
            ? "1px solid rgba(255,215,0,0.08)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <span 
          className="text-[9px] sm:text-[10px] md:text-[11px] flex items-center gap-1.5 md:gap-2"
          style={{
            color: theme === 'dark' ? "rgba(255,255,255,0.2)" : "#000000",
          }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: theme === 'dark' ? "#ffd700" : "#1A73E8" }} />
          © {currentYear} Portfolio Handler. All rights reserved.
        </span>
        <span 
          className="text-[9px] sm:text-[10px] md:text-[11px] flex items-center gap-1 md:gap-1.5"
          style={{
            color: theme === 'dark' ? "rgba(255,255,255,0.2)" : "#000000",
          }}
        >
          Made with{" "}
          <Heart className="w-2.5 h-2.5 md:w-3 md:h-3 animate-pulse" style={{ color: theme === 'dark' ? "#ffd700" : "#1A73E8" }} />{" "}
          by{" "}
          <a 
            href="https://nesticktech.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-all duration-300 font-medium cursor-pointer hover:underline"
            style={{
              color: theme === 'dark' ? "rgba(255,255,255,0.3)" : "#000000",
            }}
          >
            Nestick Tech
          </a>
        </span>
      </div>

      <style>{`
        @keyframes badgefloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes barpulse {
          from { opacity: 0.4; transform: scaleY(0.55); }
          to   { opacity: 1;   transform: scaleY(1); }
        }
      `}</style>
    </footer>
  );
}