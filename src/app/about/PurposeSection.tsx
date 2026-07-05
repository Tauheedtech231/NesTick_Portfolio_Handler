// components/about/PurposeSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function PurposeSection() {
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

  // Theme colors - Gold in dark, Chocolate in light
  const GOLD = '#E8CA5E';
  const CHOCOLATE = '#7B3F00';
  const BLUE = '#0066FF';

  const accentColor = isDark ? GOLD : CHOCOLATE;
  const accentBlue = isDark ? GOLD : BLUE;

  // Background gradient
  const bgGradient = isDark
    ? 'linear-gradient(120deg, #0B0F19 0%, #111827 45%, #0F172A 100%)'
    : 'linear-gradient(120deg, #fdf6ee 0%, #f3f0f6 45%, #eef2fb 100%)';

  const textColor = isDark ? '#FFFFFF' : '#141b3d';
  const textMuted = isDark ? '#D1D5DB' : '#4a5468';
  const borderColor = isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(0, 0, 0, 0.06)';
  const iconBg = isDark ? '#1a2332' : '#FFFFFF';
  const cardBgLeft = isDark 
    ? 'linear-gradient(135deg, #1a2332 0%, #0f172a 100%)'
    : 'linear-gradient(135deg, #fdece0 0%, #fdf7f0 60%)';
  const cardBgRight = isDark
    ? 'linear-gradient(225deg, #1a2332 0%, #0f172a 100%)'
    : 'linear-gradient(225deg, #eaf0fd 0%, #f7f9fe 60%)';
  const dotColor = isDark ? 'rgba(232,202,94,0.2)' : '#f0a878';
  const dotBlueColor = isDark ? 'rgba(232,202,94,0.2)' : '#a9bdf5';
  const centerDotColor = isDark ? '#E8CA5E' : '#9aa3c9';
  const centerBorderColor = isDark ? 'rgba(232,202,94,0.5)' : '#cfd6ec';
  const centerBg = isDark ? '#1a2332' : '#fdfdfe';
  const cardShadow = isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 24px rgba(20,30,60,0.06)';
  const cardBorder = isDark ? `1px solid rgba(232,202,94,0.15)` : 'none';

  return (
    <section
      className="relative w-full overflow-hidden py-8 sm:py-15"
      style={{
        background: bgGradient,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        minHeight: '100vh',
      }}
    >
      <div className="relative max-w-[1280px] mx-auto px-4" style={{ height: '500px' }}>
        {/* Decorative dot grids */}
        <div className="absolute top-5 left-5 grid grid-cols-4 gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ background: dotColor }}
            />
          ))}
        </div>

        <div className="absolute bottom-28 left-14 grid grid-cols-4 gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ background: dotColor }}
            />
          ))}
        </div>

        <div className="absolute bottom-28 right-14 grid grid-cols-4 gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ background: dotBlueColor }}
            />
          ))}
        </div>

        {/* Top circle */}
        <div
          className="absolute -top-36 -right-10 w-64 h-64 rounded-full border"
          style={{ borderColor: borderColor }}
        />

        {/* Header */}
        <div className="text-center mt-3">
          <p
            className="text-xs font-bold tracking-[0.2em]"
            style={{ color: isDark ? '#9CA3AF' : '#5b6b8c' }}
          >
            OUR PURPOSE
          </p>
          <h1
            className="text-4xl font-extrabold mt-1"
            style={{ color: textColor }}
          >
            Purpose &amp; <span style={{ color: accentColor }}>Impact</span>
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="h-0.5 w-10" style={{ background: accentColor }} />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: centerDotColor }}
            />
            <div className="h-0.5 w-10" style={{ background: accentBlue }} />
          </div>
          <p
            className="text-sm max-w-md mx-auto mt-2"
            style={{ color: textMuted }}
          >
            We exist to transform education through innovation, connection, and meaningful impact.
          </p>
        </div>

        {/* Cards area */}
        <div className="relative mt-8 h-[400px]">
          {/* Center connector */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-dashed flex items-center justify-center z-10 cursor-pointer overflow-hidden"
            style={{
              borderColor: centerBorderColor,
              background: centerBg,
              borderWidth: isDark ? '2px' : '1px',
              boxShadow: isDark ? `0 0 30px ${GOLD}20` : 'none',
            }}
            whileHover={{
              scale: 1.08,
              transition: { duration: 0.6, ease: 'easeInOut' },
            }}
            whileTap={{ scale: 0.92 }}
          >
            <motion.div
              className="flex items-center justify-center"
              whileHover={{
                rotate: 360,
                transition: { duration: 0.8, ease: 'easeInOut' },
              }}
            >
              <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
                <circle cx="24" cy="32" r="14" stroke={accentColor} strokeWidth={isDark ? '3' : '2.5'} />
                <circle cx="40" cy="32" r="14" stroke={accentBlue} strokeWidth={isDark ? '3' : '2.5'} />
              </svg>
            </motion.div>
          </motion.div>

          {/* Connector dots top */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col gap-2.5">
            <span
              className="w-1 h-1 rounded-full mx-auto"
              style={{ background: centerDotColor }}
            />
          </div>

          {/* Connector dots bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col gap-2.5">
            <span
              className="w-1 h-1 rounded-full mx-auto"
              style={{ background: centerDotColor }}
            />
          </div>

          {/* LEFT CARD */}
          <motion.div
            className="absolute top-5 left-0 md:left-8 w-[85%] md:w-[520px] h-[360px] cursor-pointer"
            whileHover={{
              scale: 1.02,
              y: -4,
              transition: { duration: 0.3, ease: 'easeInOut' },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: cardBgLeft,
                clipPath: 'polygon(0% 10%, 0% 6%, 6% 0%, 88% 0%, 100% 50%, 88% 100%, 6% 100%, 0% 94%, 0% 55%, 6% 50%)',
                boxShadow: cardShadow,
                border: cardBorder,
              }}
            />
            <motion.div
              className="absolute -left-10 top-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full flex items-center justify-center shadow-xl z-10 cursor-pointer"
              style={{
                background: iconBg,
                boxShadow: isDark ? `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${GOLD}20` : '0 10px 30px rgba(20,30,60,0.12)',
                border: isDark ? `2px solid ${GOLD}` : 'none',
              }}
              whileHover={{
                scale: 1.12,
                rotate: 8,
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <svg viewBox="0 0 64 64" fill="none" className="w-11 h-11">
                <circle cx="32" cy="32" r="22" stroke={accentColor} strokeWidth={isDark ? '3' : '2.5'} />
                <circle cx="32" cy="32" r="13" stroke={accentColor} strokeWidth={isDark ? '3' : '2.5'} />
                <circle cx="32" cy="32" r="4" fill={accentColor} />
                <line x1="32" y1="32" x2="48" y2="16" stroke={accentColor} strokeWidth={isDark ? '3' : '2.5'} strokeLinecap="round" />
                <path d="M42 12 L50 10 L48 18 Z" fill={accentColor} />
              </svg>
            </motion.div>
            <div className="relative z-10 h-full flex items-center pl-28 md:pl-32 pr-4 md:pr-8">
              <div>
                <p className="text-xs font-extrabold tracking-[0.15em] mb-2" style={{ color: accentColor }}>
                  OUR MISSION
                </p>
                <h2 className="text-xl md:text-2xl font-extrabold leading-tight" style={{ color: textColor }}>
                  Empowering<br />Education
                </h2>
                <div className="w-8 h-0.5 my-2.5" style={{ background: accentColor }} />
                <p className="text-xs md:text-sm leading-relaxed max-w-xs" style={{ color: textMuted }}>
                  To empower educational institutions with cutting-edge portfolio management technology that simplifies administration, enhances student visibility, and creates lasting digital legacies.
                </p>
                <motion.div
                  className="w-14 h-8 rounded-full flex items-center justify-center mt-3 cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${accentColor}, ${isDark ? '#f0925a' : '#f0925a'})`,
                    boxShadow: `0 4px 16px ${accentColor}40`,
                  }}
                  whileHover={{
                    scale: 1.08,
                    x: 4,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 stroke-white">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            className="absolute top-5 right-0 md:right-8 w-[85%] md:w-[520px] h-[360px] cursor-pointer"
            whileHover={{
              scale: 1.02,
              y: -4,
              transition: { duration: 0.3, ease: 'easeInOut' },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: cardBgRight,
                clipPath: 'polygon(100% 10%, 100% 6%, 94% 0%, 12% 0%, 0% 50%, 12% 100%, 94% 100%, 100% 94%, 100% 55%, 94% 50%)',
                boxShadow: cardShadow,
                border: cardBorder,
              }}
            />
            <motion.div
              className="absolute -right-10 top-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full flex items-center justify-center shadow-xl z-10 cursor-pointer"
              style={{
                background: iconBg,
                boxShadow: isDark ? `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${GOLD}20` : '0 10px 30px rgba(20,30,60,0.12)',
                border: isDark ? `2px solid ${GOLD}` : 'none',
              }}
              whileHover={{
                scale: 1.12,
                rotate: -8,
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <svg viewBox="0 0 64 64" fill="none" className="w-11 h-11">
                <ellipse cx="32" cy="32" rx="24" ry="14" stroke={accentBlue} strokeWidth={isDark ? '3' : '2.5'} />
                <circle cx="32" cy="32" r="8" stroke={accentBlue} strokeWidth={isDark ? '3' : '2.5'} />
                <circle cx="32" cy="32" r="3" fill={accentBlue} />
              </svg>
            </motion.div>
            <div className="relative z-10 h-full flex items-center justify-end pl-4 md:pl-8 pr-28 md:pr-32">
              <div className="text-right">
                <p className="text-xs font-extrabold tracking-[0.15em] mb-2" style={{ color: accentBlue }}>
                  OUR VISION
                </p>
                <h2 className="text-xl md:text-2xl font-extrabold leading-tight" style={{ color: textColor }}>
                  Shaping<br />the Future
                </h2>
                <div className="w-8 h-0.5 my-2.5 ml-auto" style={{ background: accentBlue }} />
                <p className="text-xs md:text-sm leading-relaxed max-w-xs ml-auto" style={{ color: textMuted }}>
                  To become the global standard for educational portfolio management, connecting institutions, students, and opportunities through innovative technology that showcases potential.
                </p>
                <motion.div
                  className="w-14 h-8 rounded-full flex items-center justify-center mt-3 ml-auto cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, ${accentBlue}, ${isDark ? '#3f6bf0' : '#3f6bf0'})`,
                    boxShadow: `0 4px 16px ${accentBlue}40`,
                  }}
                  whileHover={{
                    scale: 1.08,
                    x: -4,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 stroke-white">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .max-w-\\[1280px\\] {
            height: auto !important;
            min-height: 750px;
          }
          .w-\\[520px\\] {
            width: 100% !important;
          }
          .h-\\[360px\\] {
            height: auto !important;
            min-height: 320px;
          }
          .absolute.-left-10, .absolute.-right-10 {
            position: relative !important;
            left: auto !important;
            right: auto !important;
            top: -35px !important;
            transform: none !important;
            margin: 0 auto !important;
            width: 60px !important;
            height: 60px !important;
          }
          .pl-28, .pl-32, .pr-28, .pr-32 {
            padding: 14px !important;
          }
          .text-right {
            text-align: center !important;
          }
          .ml-auto {
            margin: 0 auto !important;
          }
        }
        @media (max-width: 480px) {
          .text-4xl {
            font-size: 26px !important;
          }
          .text-sm {
            font-size: 11px !important;
          }
          .w-\\[100px\\] {
            width: 55px !important;
            height: 55px !important;
          }
          .w-11 {
            width: 26px !important;
            height: 26px !important;
          }
          .w-28 {
            width: 24px !important;
            height: 24px !important;
          }
          .h-\\[360px\\] {
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}