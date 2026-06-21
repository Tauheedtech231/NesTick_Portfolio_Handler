"use client";

import React, { useEffect, useState } from "react";

/**
 * SocialProofBar
 * Hexagon stat cluster — "Trusted Worldwide"
 * Built with Next.js + TypeScript + Tailwind CSS
 *
 * Layout (left -> right):
 *  Clients (500+) -> Templates (30+) -> TRUSTED WORLDWIDE (center) -> Active Users (20.0K+) -> Success Rate (99%)
 *
 * Connecting gradient glow lines run between hexagons, with a dotted world-map
 * background.
 */

interface HexStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  size: "sm" | "lg" | "xl";
  className?: string;
  theme?: 'light' | 'dark';
}

function HexStat({ label, value, icon, size, className = "", theme = 'dark' }: HexStatProps) {
  const dims =
    size === "xl"
      ? "w-[265px] h-[300px]"
      : size === "lg"
      ? "w-[200px] h-[225px]"
      : "w-[178px] h-[200px]";

  // Get colors based on theme
  const getColors = () => {
    if (theme === 'dark') {
      return {
        stroke: '#3fd0ff',
        innerStroke: '#1c5670',
        fill: '#07111f',
        labelColor: '#E5E7EB',
        valueColor: '#FFFFFF',
      };
    } else {
      return {
        stroke: '#0066FF',
        innerStroke: '#60A5FA',
        fill: '#F8FAFC',
        labelColor: '#4B5563',
        valueColor: '#1F2937',
      };
    }
  };

  const colors = getColors();

  return (
    <div className={`absolute ${dims} ${className}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <svg
        viewBox="0 0 200 230"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <polygon
          points="100,2 197,58 197,172 100,228 3,172 3,58"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="2.5"
        />
        <polygon
          points="100,16 184,64 184,166 100,214 16,166 16,64"
          fill="none"
          stroke={colors.innerStroke}
          strokeWidth="1"
        />
      </svg>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center">
        <span className="text-[11px] font-normal" style={{ 
          color: colors.labelColor,
          fontFamily: "'Poppins', sans-serif",
        }}>
          {label}
        </span>
        <span className="text-[22px] font-extrabold tracking-wide" style={{ 
          color: colors.valueColor,
          fontFamily: "'Poppins', sans-serif",
        }}>
          {value}
        </span>
        <div className="mt-0.5">{icon}</div>
      </div>
    </div>
  );
}

function CenterHex({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  // Get colors based on theme
  const getColors = () => {
    if (theme === 'dark') {
      return {
        stroke: '#3fd0ff',
        innerStroke: '#1c5670',
        fill: '#07111f',
        textColor: '#FFFFFF',
      };
    } else {
      return {
        stroke: '#0066FF',
        innerStroke: '#60A5FA',
        fill: '#F8FAFC',
        textColor: '#1F2937',
      };
    }
  };

  const colors = getColors();

  return (
    <div className="absolute left-[443px] top-[107px] h-[300px] w-[265px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <svg
        viewBox="0 0 265 300"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <polygon
          points="132,3 262,75 262,225 132,297 2,225 2,75"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="3"
        />
        <polygon
          points="132,20 245,84 245,216 132,280 19,216 19,84"
          fill="none"
          stroke={colors.innerStroke}
          strokeWidth="1"
        />
      </svg>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center">
        <span className="text-[26px] font-extrabold leading-tight tracking-wide" style={{ 
          color: colors.textColor,
          fontFamily: "'Poppins', sans-serif",
        }}>
          TRUSTED
          <br />
          WORLDWIDE
        </span>
      </div>
    </div>
  );
}

function HandshakeIcon({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const color = theme === 'dark' ? '#ffffff' : '#1F2937';
  return (
    <svg width="28" height="18" viewBox="0 0 34 22" fill="none">
      <path d="M2 11 L9 6 L15 11 L9 16 Z" fill={color} opacity="0.95" />
      <path d="M32 11 L25 6 L19 11 L25 16 Z" fill={color} opacity="0.95" />
      <rect x="13" y="9.5" width="8" height="3" rx="1.5" fill={color} />
    </svg>
  );
}

function TemplatesIcon({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const color = theme === 'dark' ? '#ffffff' : '#1F2937';
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
      <rect
        x="5"
        y="2"
        width="14"
        height="18"
        rx="1.5"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
      />
      <line x1="8" y1="7" x2="16" y2="7" stroke={color} strokeWidth="1.3" />
      <line x1="8" y1="10.5" x2="16" y2="10.5" stroke={color} strokeWidth="1.3" />
      <line x1="8" y1="14" x2="13" y2="14" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

function UsersIcon({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const color = theme === 'dark' ? '#ffffff' : '#1F2937';
  const colorDim = theme === 'dark' ? '#ffffff' : '#4B5563';
  return (
    <svg width="26" height="18" viewBox="0 0 30 22" fill="none">
      <circle cx="15" cy="6" r="4" fill={color} />
      <path d="M5 20 C5 14 10 12 15 12 C20 12 25 14 25 20 Z" fill={color} />
      <circle cx="4" cy="9" r="3" fill={colorDim} opacity="0.85" />
      <path
        d="M-2 20 C-2 16 1 14 4 14 C5.5 14 6.8 14.5 7.7 15.4 C5.5 16.6 4.5 18 4.3 20 Z"
        fill={colorDim}
        opacity="0.85"
      />
      <circle cx="26" cy="9" r="3" fill={colorDim} opacity="0.85" />
      <path
        d="M32 20 C32 16 29 14 26 14 C24.5 14 23.2 14.5 22.3 15.4 C24.5 16.6 25.5 18 25.7 20 Z"
        fill={colorDim}
        opacity="0.85"
      />
    </svg>
  );
}

function SuccessIcon({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const color = theme === 'dark' ? '#ffffff' : '#1F2937';
  return (
    <svg width="22" height="18" viewBox="0 0 28 22" fill="none">
      <polyline
        points="1,20 9,11 14,15 26,2"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="18,2 26,2 26,10"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DottedWorldMap({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const dotColor = theme === 'dark' ? '#16456b' : '#93C5FD';
  
  const mask = [
    "0000111100000000000001111111000000000000000000000000000000000",
    "0001111110000000111111111111110000000000111111110000000000000",
    "0011111111000011111111111111111000000001111111111100000000000",
    "0111111111100111111111111111111100000111111111111111000000000",
    "0111111111111111111111111111111110001111111111111111100000000",
    "0011111111111111111111111111111111111111111111111111110000000",
    "0001111111110011111111111111111111111111111111111111111000000",
    "0000011111000001111111111111111111111111111111111111111100000",
    "0000001110000000111111111111111111111111111111111111111110000",
    "0000000000000001111111111111111111111111111111111111111111000",
    "0000000111000011111111111111111111111111111111111111111111100",
    "0000001111100011111111111111111111111111111111111111111111000",
    "0000011111110001111111111111111111111111111111111111111100000",
    "0000111111111001111111111111111111111111111111111111111000000",
    "0000111111111111111111111111111111111111111111111110000000000",
    "0000011111111111111111111111111111111111111111110000000000000",
    "0000001111111111111111111111111111111111111111000000000000000",
    "0000000111111111111111111111111111111111111100000000000000000",
    "0000000011111111111111111111111111111111110000000000000000000",
    "0000000001111111111111111111111111111111000000000000000000000",
    "0000000000111111111111111111111111111110000000000000000000000",
    "0000000000011111111111111111111111111100000000000000000000000",
    "0000000000001111111111111111111111110000000000000000000000000",
    "0000000000000111111111111111111111000000000000000000000000000",
    "0000000000000011111111111111111100000000000000000000000000000",
    "0000000000000001111111111111110000000000000000000000000000000",
    "0000000000000000111111111111000000000000000000000000000000000",
    "0000000000000000001111111100000000000000000000000000000000000",
  ];

  const gridCols = mask[0].length;
  const gridRows = mask.length;
  const scaleX = 1153 / gridCols;
  const scaleY = 514 / gridRows;

  const dots: { x: number; y: number; r: number; o: number }[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      if (mask[r][c] === "1") {
        if (rand() < 0.18) continue;
        const x = c * scaleX + rand() * scaleX * 0.4;
        const y = r * scaleY + rand() * scaleY * 0.4;
        dots.push({ x, y, r: 1.1 + rand() * 0.6, o: 0.5 + rand() * 0.5 });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 1153 514"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x.toFixed(1)}
          cy={d.y.toFixed(1)}
          r={d.r.toFixed(1)}
          fill={dotColor}
          opacity={d.o.toFixed(2)}
        />
      ))}
    </svg>
  );
}

function ConnectingLines({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const getColors = () => {
    if (theme === 'dark') {
      return {
        gradientStart: '#3fd0ff',
        gradientMid: '#7fe3ff',
        gradientEnd: '#bff3ff',
        stroke: '#3fd0ff',
        sparkle1: '#bff3ff',
        sparkle2: '#ffffff',
      };
    } else {
      return {
        gradientStart: '#0066FF',
        gradientMid: '#3B82F6',
        gradientEnd: '#60A5FA',
        stroke: '#0066FF',
        sparkle1: '#60A5FA',
        sparkle2: '#1F2937',
      };
    }
  };

  const colors = getColors();

  return (
    <svg
      viewBox="0 0 1153 514"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    >
      <defs>
        <linearGradient id="streakGradL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.gradientStart} stopOpacity="0.15" />
          <stop offset="60%" stopColor={colors.gradientMid} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.gradientEnd} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="streakGradR" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.gradientEnd} stopOpacity="1" />
          <stop offset="40%" stopColor={colors.gradientMid} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.gradientStart} stopOpacity="0.15" />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="wideGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Clients -> Center */}
      <path
        d="M 218 263 L 445 257"
        stroke="url(#streakGradL)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#softGlow)"
      />
      <path
        d="M 218 263 L 445 257"
        stroke={colors.stroke}
        strokeWidth="6"
        fill="none"
        filter="url(#wideGlow)"
        opacity="0.35"
      />

      {/* Center -> Success Rate */}
      <path
        d="M 705 257 L 925 276"
        stroke="url(#streakGradR)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#softGlow)"
      />
      <path
        d="M 705 257 L 925 276"
        stroke={colors.stroke}
        strokeWidth="6"
        fill="none"
        filter="url(#wideGlow)"
        opacity="0.35"
      />

      {/* Center -> Active Users */}
      <path
        d="M 600 150 C 610 110, 650 85, 690 95 C 715 102, 730 120, 735 145"
        stroke="url(#streakGradR)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#softGlow)"
      />
      <path
        d="M 600 150 C 610 110, 650 85, 690 95 C 715 102, 730 120, 735 145"
        stroke={colors.stroke}
        strokeWidth="6"
        fill="none"
        filter="url(#wideGlow)"
        opacity="0.35"
      />
      <circle cx="630" cy="105" r="1.6" fill={colors.sparkle1} />
      <circle cx="670" cy="90" r="1.2" fill={colors.sparkle2} opacity="0.8" />
      <circle cx="715" cy="115" r="1.4" fill={colors.sparkle1} opacity="0.85" />

      {/* Center -> Templates */}
      <path
        d="M 480 340 C 460 365, 430 380, 398 378"
        stroke="url(#streakGradL)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#softGlow)"
      />
      <path
        d="M 480 340 C 460 365, 430 380, 398 378"
        stroke={colors.stroke}
        strokeWidth="6"
        fill="none"
        filter="url(#wideGlow)"
        opacity="0.35"
      />
      <circle cx="440" cy="372" r="1.4" fill={colors.sparkle1} opacity="0.85" />

      {/* sparkle particles along straight connectors */}
      <circle cx="260" cy="262" r="1.6" fill={colors.sparkle2} />
      <circle cx="320" cy="260" r="1.2" fill={colors.sparkle2} opacity="0.8" />
      <circle cx="380" cy="258" r="1.4" fill={colors.sparkle1} opacity="0.85" />
      <circle cx="760" cy="262" r="1.6" fill={colors.sparkle2} />
      <circle cx="820" cy="268" r="1.2" fill={colors.sparkle2} opacity="0.8" />
      <circle cx="880" cy="273" r="1.4" fill={colors.sparkle1} opacity="0.85" />
    </svg>
  );
}

export default function SocialProofBar() {
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

  // Get background color based on theme
  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#F8FAFC';

  return (
    <div className="relative w-full overflow-hidden" style={{ 
      backgroundColor: getBgColor(),
      fontFamily: "'Poppins', sans-serif",
      height: '514px',
    }}>
      <div className="relative mx-auto w-[1153px] max-w-full h-full">
        <DottedWorldMap theme={theme} />
        <ConnectingLines theme={theme} />

        <div className="absolute inset-0 z-[2]">
          <HexStat
            label="Clients"
            value="500+"
            icon={<HandshakeIcon theme={theme} />}
            size="sm"
            className="left-[40px] top-[163px]"
            theme={theme}
          />
          <HexStat
            label="Templates"
            value="30+"
            icon={<TemplatesIcon theme={theme} />}
            size="sm"
            className="left-[220px] top-[268px]"
            theme={theme}
          />
          <CenterHex theme={theme} />
          <HexStat
            label="Active Users"
            value="20.0K+"
            icon={<UsersIcon theme={theme} />}
            size="lg"
            className="left-[735px] top-[33px]"
            theme={theme}
          />
          <HexStat
            label="Success Rate"
            value="99%"
            icon={<SuccessIcon theme={theme} />}
            size="lg"
            className="left-[925px] top-[163px]"
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}