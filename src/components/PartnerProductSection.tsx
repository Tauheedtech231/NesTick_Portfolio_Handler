"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import SocialProofBarMobile from "./landing/SocialProofBarMobile";

interface HexStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  size: "sm" | "lg" | "xl";
  className?: string;
  theme?: 'light' | 'dark';
  delay?: number;
  index?: number;
  segmentId?: string; // For direction-aware lift
}

function HexStat({ 
  label, 
  value, 
  icon, 
  size, 
  className = "", 
  theme = 'dark', 
  delay = 0, 
  index = 0,
  segmentId = ""
}: HexStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  const dims =
    size === "xl"
      ? "w-[265px] h-[300px]"
      : size === "lg"
      ? "w-[200px] h-[225px]"
      : "w-[178px] h-[200px]";

  const getColors = () => {
    if (theme === 'dark') {
      return { 
        stroke: '#E8CA5E', 
        innerStroke: '#8B7A3A', 
        fill: '#0F172A', 
        labelColor: '#D1D5DB', 
        valueColor: '#FFFFFF',
        hoverFill: '#1A2744'
      };
    }
    return { 
      stroke: '#0066FF', 
      innerStroke: '#60A5FA', 
      fill: '#FFFFFF', 
      labelColor: '#6B7280', 
      valueColor: '#1F2937',
      hoverFill: '#F0F4FF'
    };
  };

  const colors = getColors();

  // Direction-aware lift based on segment position
  const getLiftDirection = () => {
    // Center of hexagon positions
    const positions: { [key: string]: { x: number; y: number } } = {
      'clients': { x: -1, y: -1 },
      'templates': { x: -0.7, y: -0.7 },
      'active-users': { x: 0.7, y: -0.7 },
      'success-rate': { x: 1, y: -1 },
      'center': { x: 0, y: -1 },
    };
    return positions[segmentId] || { x: 0, y: -1 };
  };

  const direction = getLiftDirection();
  const liftAmount = 10;

  // Determine animation direction based on index
  const getAnimation = () => {
    if (index === 0) return { x: -100, y: 0 };
    if (index === 1) return { x: -80, y: 30 };
    if (index === 3) return { x: 80, y: -30 };
    if (index === 4) return { x: 100, y: 0 };
    return { x: 0, y: 50 };
  };

  const anim = getAnimation();

  // Smooth floating animation for hexagon only
  const floatVariants: Variants = {
    animate: {
      y: [0, -4, 0, 4, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay * 0.3,
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`absolute ${dims} ${className}`}
      style={{
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        zIndex: 10,
      }}
      initial={{ opacity: 0, x: anim.x, y: anim.y, scale: 0.85 }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.9, 
          delay: delay, 
          ease: [0.22, 1, 0.36, 1] 
        }
      } : { 
        opacity: 0, 
        x: anim.x, 
        y: anim.y, 
        scale: 0.85 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -liftAmount * Math.abs(direction.y),
        x: liftAmount * direction.x,
        scale: 1.06,
        transition: { 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* SVG with floating animation - only hexagon floats */}
      <motion.div
        className="absolute inset-0"
        variants={floatVariants}
        animate="animate"
      >
        <svg viewBox="0 0 200 230" preserveAspectRatio="none" className="h-full w-full">
          <polygon 
            points="100,2 197,58 197,172 100,228 3,172 3,58" 
            fill={isHovered ? colors.hoverFill : colors.fill} 
            stroke={colors.stroke} 
            strokeWidth="2.5"
            style={{ transition: 'fill 0.3s ease' }}
          />
          <polygon 
            points="100,16 184,64 184,166 100,214 16,166 16,64" 
            fill="none" 
            stroke={colors.innerStroke} 
            strokeWidth="1"
            opacity={isHovered ? 0.8 : 0.6}
            style={{ transition: 'opacity 0.3s ease' }}
          />
        </svg>
      </motion.div>

      {/* Text content - NO floating animation */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center pointer-events-none">
        <span className="text-[11px] font-normal" style={{ color: colors.labelColor, fontFamily: "'Poppins', sans-serif" }}>
          {label}
        </span>
        <Counter value={value} theme={theme} isInView={isInView} />
        <div className="mt-0.5">{icon}</div>
      </div>
    </motion.div>
  );
}

// Counter Component
function Counter({ value, theme, isInView }: { value: string; theme: 'light' | 'dark'; isInView: boolean }) {
  const [count, setCount] = useState(0);
  const color = theme === 'dark' ? '#FFFFFF' : '#1F2937';

  const parseValue = (val: string) => {
    const match = val.match(/^([\d.]+)([+\s%]*)?/);
    if (!match) return { number: 0, suffix: '' };
    return {
      number: parseFloat(match[1]),
      suffix: val.replace(match[1], '')
    };
  };

  const { number, suffix } = parseValue(value);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 1500;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(number * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, number]);

  const getDisplayValue = () => {
    if (count === 0) return '0';
    if (value.includes('%')) return Math.round(count) + '%';
    if (value.includes('K') && number >= 1000) return (count / 1000).toFixed(1) + 'K+';
    if (number >= 1000) return (count / 1000).toFixed(1) + 'K';
    return Math.round(count).toString();
  };

  return (
    <span 
      className="text-[22px] font-extrabold tracking-wide"
      style={{ color, fontFamily: "'Poppins', sans-serif" }}
    >
      {isInView ? getDisplayValue() : '0'}
    </span>
  );
}

function CenterHex({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  const getColors = () => {
    if (theme === 'dark') return { 
      stroke: '#E8CA5E', 
      innerStroke: '#8B7A3A', 
      fill: '#0F172A', 
      textColor: '#FFFFFF',
      hoverFill: '#1A2744'
    };
    return { 
      stroke: '#0066FF', 
      innerStroke: '#60A5FA', 
      fill: '#FFFFFF', 
      textColor: '#1F2937',
      hoverFill: '#F0F4FF'
    };
  };
  const colors = getColors();

  const floatVariants: Variants = {
    animate: {
      y: [0, -3, 0, 3, 0],
      transition: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.2,
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="absolute left-[443px] top-[107px] h-[300px] w-[265px]"
      style={{
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        zIndex: 10,
      }}
      initial={{ opacity: 0, scale: 0.6, y: 60 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
          duration: 1, 
          delay: 0.3, 
          ease: [0.22, 1, 0.36, 1] 
        }
      } : { 
        opacity: 0, 
        scale: 0.6, 
        y: 60 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -12,
        scale: 1.06,
        transition: { 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* SVG with floating animation */}
      <motion.div
        className="absolute inset-0"
        variants={floatVariants}
        animate="animate"
      >
        <svg viewBox="0 0 265 300" preserveAspectRatio="none" className="h-full w-full">
          <polygon 
            points="132,3 262,75 262,225 132,297 2,225 2,75" 
            fill={isHovered ? colors.hoverFill : colors.fill} 
            stroke={colors.stroke} 
            strokeWidth="3"
            style={{ transition: 'fill 0.3s ease' }}
          />
          <polygon 
            points="132,20 245,84 245,216 132,280 19,216 19,84" 
            fill="none" 
            stroke={colors.innerStroke} 
            strokeWidth="1"
            opacity={isHovered ? 0.8 : 0.6}
            style={{ transition: 'opacity 0.3s ease' }}
          />
        </svg>
      </motion.div>
      
      {/* Text content - NO floating animation */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-[26px] font-extrabold leading-tight tracking-wide" style={{ color: colors.textColor, fontFamily: "'Poppins', sans-serif" }}>
          TRUSTED<br />WORLDWIDE
        </span>
      </div>
    </motion.div>
  );
}

function HandshakeIcon({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const color = theme === 'dark' ? '#E8CA5E' : '#0066FF';
  return (
    <svg width="28" height="18" viewBox="0 0 34 22" fill="none">
      <path d="M2 11 L9 6 L15 11 L9 16 Z" fill={color} opacity="0.95" />
      <path d="M32 11 L25 6 L19 11 L25 16 Z" fill={color} opacity="0.95" />
      <rect x="13" y="9.5" width="8" height="3" rx="1.5" fill={color} />
    </svg>
  );
}

function TemplatesIcon({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const color = theme === 'dark' ? '#E8CA5E' : '#0066FF';
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
      <rect x="5" y="2" width="14" height="18" rx="1.5" fill="none" stroke={color} strokeWidth="1.6" />
      <line x1="8" y1="7" x2="16" y2="7" stroke={color} strokeWidth="1.3" />
      <line x1="8" y1="10.5" x2="16" y2="10.5" stroke={color} strokeWidth="1.3" />
      <line x1="8" y1="14" x2="13" y2="14" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

function UsersIcon({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const color = theme === 'dark' ? '#E8CA5E' : '#0066FF';
  const colorDim = theme === 'dark' ? '#8B7A3A' : '#93C5FD';
  return (
    <svg width="26" height="18" viewBox="0 0 30 22" fill="none">
      <circle cx="15" cy="6" r="4" fill={color} />
      <path d="M5 20 C5 14 10 12 15 12 C20 12 25 14 25 20 Z" fill={color} />
      <circle cx="4" cy="9" r="3" fill={colorDim} opacity="0.85" />
      <path d="M-2 20 C-2 16 1 14 4 14 C5.5 14 6.8 14.5 7.7 15.4 C5.5 16.6 4.5 18 4.3 20 Z" fill={colorDim} opacity="0.85" />
      <circle cx="26" cy="9" r="3" fill={colorDim} opacity="0.85" />
      <path d="M32 20 C32 16 29 14 26 14 C24.5 14 23.2 14.5 22.3 15.4 C24.5 16.6 25.5 18 25.7 20 Z" fill={colorDim} opacity="0.85" />
    </svg>
  );
}

function SuccessIcon({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const color = theme === 'dark' ? '#E8CA5E' : '#0066FF';
  return (
    <svg width="22" height="18" viewBox="0 0 28 22" fill="none">
      <polyline points="1,20 9,11 14,15 26,2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="18,2 26,2 26,10" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DottedWorldMap({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const dotColor = theme === 'dark' ? '#1A2744' : '#93C5FD';
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
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
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
    <svg viewBox="0 0 1153 514" className="pointer-events-none absolute inset-0 h-full w-full opacity-35">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(1)} fill={dotColor} opacity={d.o.toFixed(2)} />
      ))}
    </svg>
  );
}

function ConnectingLines({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const getColors = () => {
    if (theme === 'dark') {
      return { 
        gradientStart: '#E8CA5E', 
        gradientMid: '#C4A842', 
        gradientEnd: '#8B7A3A', 
        stroke: '#E8CA5E', 
        sparkle1: '#E8CA5E', 
        sparkle2: '#F5E6A3' 
      };
    }
    return { 
      gradientStart: '#0066FF', 
      gradientMid: '#3B82F6', 
      gradientEnd: '#60A5FA', 
      stroke: '#0066FF', 
      sparkle1: '#60A5FA', 
      sparkle2: '#93C5FD' 
    };
  };
  const colors = getColors();
  return (
    <svg viewBox="0 0 1153 514" className="pointer-events-none absolute inset-0 z-[1] h-full w-full">
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
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="wideGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      
      {/* Clients -> Center */}
      <path d="M 218 263 L 445 257" stroke="url(#streakGradL)" strokeWidth="2.5" fill="none" filter="url(#softGlow)" />
      <path d="M 218 263 L 445 257" stroke={colors.stroke} strokeWidth="6" fill="none" filter="url(#wideGlow)" opacity="0.35" />
      
      {/* Center -> Success Rate */}
      <path d="M 705 257 L 985 276" stroke="url(#streakGradR)" strokeWidth="2.5" fill="none" filter="url(#softGlow)" />
      <path d="M 705 257 L 985 276" stroke={colors.stroke} strokeWidth="6" fill="none" filter="url(#wideGlow)" opacity="0.35" />
      
      {/* Center -> Active Users */}
      <path d="M 600 150 C 620 100, 680 70, 740 80 C 770 85, 800 110, 820 145" stroke="url(#streakGradR)" strokeWidth="2.5" fill="none" filter="url(#softGlow)" />
      <path d="M 600 150 C 620 100, 680 70, 740 80 C 770 85, 800 110, 820 145" stroke={colors.stroke} strokeWidth="6" fill="none" filter="url(#wideGlow)" opacity="0.35" />
      
      {/* Center -> Templates */}
      <path d="M 480 340 C 460 365, 430 380, 398 378" stroke="url(#streakGradL)" strokeWidth="2.5" fill="none" filter="url(#softGlow)" />
      <path d="M 480 340 C 460 365, 430 380, 398 378" stroke={colors.stroke} strokeWidth="6" fill="none" filter="url(#wideGlow)" opacity="0.35" />
      
      {/* Sparkles */}
      <circle cx="260" cy="262" r="1.6" fill={colors.sparkle2} />
      <circle cx="320" cy="260" r="1.2" fill={colors.sparkle2} opacity="0.8" />
      <circle cx="380" cy="258" r="1.4" fill={colors.sparkle1} opacity="0.85" />
      <circle cx="630" cy="105" r="1.6" fill={colors.sparkle1} />
      <circle cx="710" cy="85" r="1.2" fill={colors.sparkle2} opacity="0.8" />
      <circle cx="780" cy="115" r="1.4" fill={colors.sparkle1} opacity="0.85" />
      <circle cx="810" cy="262" r="1.6" fill={colors.sparkle2} />
      <circle cx="880" cy="268" r="1.2" fill={colors.sparkle2} opacity="0.8" />
      <circle cx="950" cy="273" r="1.4" fill={colors.sparkle1} opacity="0.85" />
      <circle cx="440" cy="372" r="1.4" fill={colors.sparkle1} opacity="0.85" />
    </svg>
  );
}

export default function SocialProofBar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const checkTheme = () => setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    checkTheme();
    const observer = new MutationObserver(() => checkTheme());
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Match background with other sections
  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#FFFFFF';

  return (
    <>
      {/* Desktop Version */}
      <div
        className="relative w-full overflow-hidden hidden md:block"
        style={{ backgroundColor: getBgColor(), fontFamily: "'Poppins', sans-serif", height: '514px' }}
      >
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
              delay={0.1}
              index={0}
              segmentId="clients"
            />
            <HexStat 
              label="Templates" 
              value="30+" 
              icon={<TemplatesIcon theme={theme} />}
              size="sm" 
              className="left-[220px] top-[268px]" 
              theme={theme} 
              delay={0.25}
              index={1}
              segmentId="templates"
            />
            <CenterHex theme={theme} />
            <HexStat 
              label="Active Users" 
              value="20.0K+" 
              icon={<UsersIcon theme={theme} />}
              size="lg" 
              className="left-[800px] top-[33px]" 
              theme={theme} 
              delay={0.45}
              index={3}
              segmentId="active-users"
            />
            <HexStat 
              label="Success Rate" 
              value="99%" 
              icon={<SuccessIcon theme={theme} />}
              size="lg" 
              className="left-[900px] top-[217px]" 
              theme={theme} 
              delay={0.6}
              index={4}
              segmentId="success-rate"
            />
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="block md:hidden">
        <SocialProofBarMobile />
      </div>
    </>
  );
}