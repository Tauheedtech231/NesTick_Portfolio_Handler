"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * SocialProofBarMobile
 * Mobile responsive hexagon stat cluster with rounded corners (same as desktop) — "Trusted Worldwide"
 * Built with Next.js + TypeScript + Tailwind CSS
 */

interface HexStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  theme?: 'light' | 'dark';
  delay?: number;
  onClick?: () => void;
}

interface HexStatData {
  label: string;
  value: string;
  iconType: 'handshake' | 'users' | 'templates' | 'success';
  delay: number;
}

// Icons
const HandshakeIcon = ({ color = '#ffffff' }: { color?: string }) => (
  <svg width="26" height="18" viewBox="0 0 34 22" fill="none">
    <path d="M2 11 L9 6 L15 11 L9 16 Z" fill={color} />
    <path d="M32 11 L25 6 L19 11 L25 16 Z" fill={color} />
    <rect x="13" y="9.5" width="8" height="3" rx="1.5" fill={color} />
  </svg>
);

const UsersIcon = ({ color = '#ffffff' }: { color?: string }) => (
  <svg width="26" height="18" viewBox="0 0 30 22" fill="none">
    <circle cx="15" cy="6" r="4" fill={color} />
    <path d="M5 20 C5 14 10 12 15 12 C20 12 25 14 25 20 Z" fill={color} />
    <circle cx="4" cy="9" r="3" fill={color} opacity="0.8" />
    <circle cx="26" cy="9" r="3" fill={color} opacity="0.8" />
  </svg>
);

const TemplatesIcon = ({ color = '#ffffff' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
    <rect x="5" y="2" width="14" height="18" rx="1.5" fill="none" stroke={color} strokeWidth="1.6" />
    <line x1="8" y1="7" x2="16" y2="7" stroke={color} strokeWidth="1.3" />
    <line x1="8" y1="10.5" x2="16" y2="10.5" stroke={color} strokeWidth="1.3" />
    <line x1="8" y1="14" x2="13" y2="14" stroke={color} strokeWidth="1.3" />
  </svg>
);

const SuccessIcon = ({ color = '#ffffff' }: { color?: string }) => (
  <svg width="22" height="18" viewBox="0 0 28 22" fill="none">
    <polyline points="1,20 9,11 14,15 26,2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="18,2 26,2 26,10" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getIcon = (type: string, color: string) => {
  switch(type) {
    case 'handshake': return <HandshakeIcon color={color} />;
    case 'users': return <UsersIcon color={color} />;
    case 'templates': return <TemplatesIcon color={color} />;
    case 'success': return <SuccessIcon color={color} />;
    default: return null;
  }
};

// Counter Component
const Counter = ({ 
  target, 
  suffix, 
  theme,
  isInView 
}: { 
  target: number; 
  suffix: string; 
  theme: 'light' | 'dark';
  isInView: boolean;
}) => {
  const [count, setCount] = useState(0);
  const color = theme === 'dark' ? '#FFFFFF' : '#1F2937';

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 1200;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, target]);

  const displayValue = count === 0 ? '0' : count + suffix;

  return (
    <span 
      className="text-[20px] font-extrabold tracking-wide"
      style={{ color, fontFamily: "'Poppins', sans-serif" }}
    >
      {isInView ? displayValue : '0'}
    </span>
  );
};

// Individual Hexagon Component - Same rounded corners as desktop
const HexStat = ({ label, value, icon, theme = 'dark', delay = 0, onClick }: HexStatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-50px" });

  const getColors = () => {
    if (theme === 'dark') {
      return {
        stroke: '#3B82F6',
        innerStroke: 'rgba(96,165,250,0.9)',
        fill: '#0F172A',
        labelColor: '#93C5FD',
        valueColor: '#FFFFFF',
        shadow: '#3B82F6'
      };
    } else {
      return {
        stroke: '#3B82F6',
        innerStroke: 'rgba(59,130,246,0.8)',
        fill: '#FFFFFF',
        labelColor: '#4B5563',
        valueColor: '#1F2937',
        shadow: '#3B82F6'
      };
    }
  };

  const colors = getColors();

  // Parse value for counter
  const parseValue = (val: string) => {
    const match = val.match(/^([\d.]+)([+\s%]*)?/);
    if (!match) return { number: 0, suffix: '' };
    return {
      number: parseFloat(match[1]),
      suffix: val.replace(match[1], '')
    };
  };

  const { number, suffix } = parseValue(value);

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center cursor-pointer"
      style={{ 
        width: '140px', 
        height: '158px',
        fontFamily: "'Poppins', sans-serif"
      }}
      initial={{ opacity: 0, x: -50, scale: 0.8 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -50, scale: 0.8 }}
      transition={{ 
        duration: 0.7, 
        delay: delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        scale: 1.08,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
      }}
      onClick={onClick}
    >
      <svg
        width="140"
        height="158"
        viewBox="0 0 140 158"
        className="absolute inset-0 h-full w-full"
      >
        {/* Outer hexagon - rounded corners like desktop */}
        <polygon
          points="70,2 137,41.5 137,116.5 70,156 3,116.5 3,41.5"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Inner hexagon - rounded corners like desktop */}
        <polygon
          points="70,12 128,47.5 128,110.5 70,146 12,110.5 12,47.5"
          fill="none"
          stroke={colors.innerStroke}
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Glow shadow - rounded corners like desktop */}
        <polygon
          points="70,2 137,41.5 137,116.5 70,156 3,116.5 3,41.5"
          fill="none"
          stroke={colors.shadow}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.15"
          style={{ filter: 'blur(12px)' }}
        />
      </svg>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none p-2">
        <span className="text-[11px] font-normal tracking-wide" style={{ 
          color: colors.labelColor,
          fontFamily: "'Poppins', sans-serif",
        }}>
          {label}
        </span>
        <Counter 
          target={number} 
          suffix={suffix} 
          theme={theme}
          isInView={isInView}
        />
        <div className="mt-0.5 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// Center Octagon Component - Same rounded corners as desktop
const CenterHex = ({ theme = 'dark', onClick }: { theme?: 'light' | 'dark'; onClick?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-50px" });

  const getColors = () => {
    if (theme === 'dark') {
      return {
        stroke: '#3B82F6',
        innerStroke: 'rgba(96,165,250,0.9)',
        fill: '#0F172A',
        textColor: '#FFFFFF',
        shadow: '#3B82F6'
      };
    } else {
      return {
        stroke: '#3B82F6',
        innerStroke: 'rgba(59,130,246,0.8)',
        fill: '#FFFFFF',
        textColor: '#1F2937',
        shadow: '#3B82F6'
      };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center cursor-pointer"
      style={{ 
        width: '170px', 
        height: '195px',
        fontFamily: "'Poppins', sans-serif",
        zIndex: 2,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 50 }}
      transition={{ 
        duration: 0.9, 
        delay: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        scale: 1.08,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
      }}
      onClick={onClick}
    >
      <svg
        width="170"
        height="195"
        viewBox="0 0 170 195"
        className="absolute inset-0 h-full w-full"
      >
        {/* Outer octagon - rounded corners like desktop */}
        <polygon
          points="85,3 167,51.75 167,143.25 85,192 3,143.25 3,51.75"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Inner octagon - rounded corners like desktop */}
        <polygon
          points="85,14 158,58.5 158,136.5 85,182 12,136.5 12,58.5"
          fill="none"
          stroke={colors.innerStroke}
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Glow shadow - rounded corners like desktop */}
        <polygon
          points="85,3 167,51.75 167,143.25 85,192 3,143.25 3,51.75"
          fill="none"
          stroke={colors.shadow}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.15"
          style={{ filter: 'blur(16px)' }}
        />
      </svg>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none p-4">
        <span className="text-[18px] font-extrabold leading-tight tracking-wider" style={{ 
          color: colors.textColor,
          fontFamily: "'Poppins', sans-serif",
        }}>
          TRUSTED
          <br />
          WORLDWIDE
        </span>
      </div>
    </motion.div>
  );
};

// World Map Dots Component (Background)
const WorldMapDots = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const dotColor = theme === 'dark' ? 'rgba(45,110,158,0.15)' : 'rgba(59,130,246,0.1)';
  const W = 400, H = 600;
  const mask = [
    "01111100011111111100",
    "11111111111111111111",
    "11111111111111111111",
    "01111111111111111110",
    "00111111111111111100",
    "00011111111111111000",
    "00001111111111110000",
    "00000111111111100000",
    "00000011111111000000",
    "00000001111110000000",
  ];

  const dots: { x: number; y: number; r: number; o: number }[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let row = 0; row < mask.length; row++) {
    for (let col = 0; col < mask[row].length; col++) {
      if (mask[row][col] === '1' && rand() > 0.3) {
        const x = (col / mask[0].length) * W + rand() * 15;
        const y = (row / mask.length) * H + rand() * 40;
        dots.push({ 
          x, 
          y, 
          r: 2.2, 
          o: 0.4 + rand() * 0.5 
        });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 400 600"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
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
};

// Main Component
export default function SocialProofBarMobile() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Handle click events
  const handleHexClick = (label: string) => {
    console.log(`Clicked on ${label}`);
  };

  // Stats data
  const stats: HexStatData[] = [
    { label: 'Clients', value: '35+', iconType: 'handshake', delay: 0 },
    { label: 'Active Users', value: '1500+', iconType: 'users', delay: 0.35 },
    { label: 'Templates', value: '15+', iconType: 'templates', delay: 0.7 },
    { label: 'Success Rate', value: '97%', iconType: 'success', delay: 1.05 },
  ];

  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#FFFFFF';
  const iconColor = theme === 'dark' ? '#5bc9fb' : '#3B82F6';

  const topRow = stats.slice(0, 2);
  const bottomRow = stats.slice(2, 4);

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ 
        backgroundColor: getBgColor(),
        fontFamily: "'Poppins', sans-serif",
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
      }}
    >
      <WorldMapDots theme={theme} />
      
      <div className="relative w-full max-w-[420px] flex flex-col items-center gap-0 z-[2]">
        {/* Top Row */}
        <div className="flex justify-center items-center gap-2 mb-[-18px]">
          {topRow.map((stat) => (
            <HexStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={getIcon(stat.iconType, iconColor)}
              theme={theme}
              delay={stat.delay}
              onClick={() => handleHexClick(stat.label)}
            />
          ))}
        </div>

        {/* Center Hex */}
        <CenterHex 
          theme={theme}
          onClick={() => handleHexClick('Trusted Worldwide')}
        />

        {/* Bottom Row */}
        <div className="flex justify-center items-center gap-2 mt-[-18px]">
          {bottomRow.map((stat) => (
            <HexStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={getIcon(stat.iconType, iconColor)}
              theme={theme}
              delay={stat.delay + 0.3}
              onClick={() => handleHexClick(stat.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}