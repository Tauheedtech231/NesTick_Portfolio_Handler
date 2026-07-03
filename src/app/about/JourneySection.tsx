'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface Milestone {
  id: number;
  cy: number;
  year: string;
  title: string;
  desc: string[];
  side: 'left' | 'right';
  dotX: number;
}

// ─── All Y coordinates reduced by 30px ───
const milestones: Milestone[] = [
  {
    id: 0,
    cy: 55,    // was 85
    dotX: 222,
    year: "'21",
    title: 'Start of NestickTech',
    desc: ['Founded with a vision for digital', 'solutions in education.'],
    side: 'right',
  },
  {
    id: 1,
    cy: 180,   // was 210
    dotX: 215,
    year: "'22",
    title: 'Good Client Base',
    desc: ['Strong client base across', 'Pakistan established.'],
    side: 'left',
  },
  {
    id: 2,
    cy: 292,   // was 322
    dotX: 258,
    year: "'23",
    title: 'Global Expansion',
    desc: ['Expanded operations serving', 'clients worldwide.'],
    side: 'right',
  },
  {
    id: 3,
    cy: 388,   // was 418
    dotX: 182,
    year: "'24",
    title: 'Launch — Neezamiya',
    desc: ['Educational management', 'system launched.'],
    side: 'left',
  },
  {
    id: 4,
    cy: 492,   // was 522
    dotX: 232,
    year: "'25",
    title: 'Launch of PSM',
    desc: ['Portfolio Site management', 'revolutionizing institutions.'],
    side: 'right',
  },
  {
    id: 5,
    cy: 600,   // was 630
    dotX: 190,
    year: "'26",
    title: 'Ready to Conquer',
    desc: ['AI-powered solutions and', 'global market leadership.'],
    side: 'left',
  },
];

// ─── PATH - shifted up by 30px ───
const PATH_D =
  'M222,55 C228,70 200,120 215,180 C228,222 272,248 258,292 C244,330 168,345 182,388 C196,425 245,450 232,492 C220,528 172,545 190,600';

const GOLD = '#E8CA5E';
const BLUE = '#0066FF';

export default function JourneySection() {
  const svgWrapRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [progress, setProgress] = useState(0);
  const [visibleMilestones, setVisibleMilestones] = useState<Set<number>>(new Set());
  const [totalLength, setTotalLength] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // ── Theme detection ──────────────────────────────────────────────────────────
  useEffect(() => {
    setIsClient(true);
    const check = () =>
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  // ── Path length ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isClient) return;
    const path = document.getElementById('road-main') as SVGPathElement | null;
    if (path) setTotalLength(path.getTotalLength());
  }, [isClient]);

  // ── Scroll progress ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isClient || totalLength === 0) return;

    const handleScroll = () => {
      const wrap = svgWrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      
      const startPx = vh * 0.4;
      const endPx = -rect.height * 0.6;
      
      const p = Math.max(0, Math.min(1, (startPx - rect.top) / (startPx - endPx)));
      setProgress(p);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient, totalLength]);

  // ── Intersection observer for milestone reveal ───────────────────────────────
  useEffect(() => {
    if (!isClient) return;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0,
    };

    const observers: IntersectionObserver[] = [];

    milestones.forEach((m) => {
      const el = document.getElementById(`dot-inner-${m.id}`);
      if (!el) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setVisibleMilestones((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) next.add(m.id);
            else next.delete(m.id);
            return next;
          });
        });
      }, options);

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isClient]);

  // ── Animate road stroke ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isClient || totalLength === 0) return;
    const offset = totalLength * (1 - progress);
    const ids = ['road-glow', 'road-mid', 'road-main', 'road-edge-l', 'road-edge-r', 'road-dashes'];
    ids.forEach((id) => {
      const el = document.getElementById(id) as SVGPathElement | null;
      if (el) el.style.strokeDashoffset = String(offset);
    });
  }, [progress, totalLength, isClient]);

  // ── Derived values ───────────────────────────────────────────────────────────
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#f8fafc' : '#1A2332';
  const textMuted = isDark ? '#9CA3AF' : '#6B7A8F';
  const bgColor = isDark ? '#0B0F19' : '#F4F7FC';
  const badgeBg = isDark ? 'rgba(232,202,94,0.15)' : 'rgba(0,102,255,0.08)';
  const circleFill = isDark ? '#1c1712' : '#FFFFFF';
  const circleStroke = isDark ? '#1c1712' : '#e8eef5';
  
  const roadColors = isDark ? {
    glow: 'rgba(232,202,94,0.15)',
    mid: 'rgba(232,202,94,0.30)',
    base: 'rgba(30,41,59,0.4)',
    gradient: ['#E8CA5E', '#E8CA5E', '#E8CA5E', '#c49b2a'],
    edge: 'rgba(232,202,94,0.4)',
    dash: 'rgba(232,202,94,0.6)',
  } : {
    glow: 'rgba(0,102,255,0.12)',
    mid: 'rgba(0,102,255,0.20)',
    base: 'rgba(200,210,225,0.5)',
    gradient: ['#0066FF', '#0066FF', '#3385FF', '#0044aa'],
    edge: 'rgba(0,102,255,0.25)',
    dash: 'rgba(0,102,255,0.4)',
  };

  // ── Check if mobile ──────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-specific sizing
  const dotRadius = isMobile ? 14 : 16;
  const outerRadius = isMobile ? 18 : 20;
  const yearFontSize = isMobile ? 11 : 10;
  const titleFontSize = isMobile ? 13 : 11;
  const descFontSize = isMobile ? 11 : 6;
  const textXOffset = isMobile ? 30 : 30;
  // Card top position - where the card starts
  const cardTopOffset = isMobile ? -14 : -12;
  // Text inside card - pushed 2rem (32px) down from card top
  const textYOffset = isMobile ? 18 : 16; // 2rem padding from card top
  const lineHeight = isMobile ? 16 : 11;

  const roadStrokeWidths = {
    glow: isMobile ? 6 : 6,
    mid: isMobile ? 3 : 3,
    base: isMobile ? 8 : 6,
    main: isMobile ? 4 : 3.5,
    edgeL: isMobile ? 1 : 1,
    edgeR: isMobile ? 1 : 1,
    dashes: isMobile ? 1.5 : 1.5,
  };

  // Get accent color based on theme
  const accentColor = isDark ? GOLD : BLUE;

  return (
    <section
      className="py-4 md:py-16 overflow-hidden w-full"
      style={{ 
        backgroundColor: bgColor, 
        fontFamily: "'Poppins', sans-serif", 
        transition: 'background-color 0.6s ease',
        position: 'relative',
      }}
    >
      {/* Subtle background gradient for light mode */}
      {!isDark && (
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 position-relative" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
          className="text-center mb-2 md:mb-3"
        >
          <div
            className="inline-flex mt-[0.5rem] items-center gap-2 px-3 py-1 rounded-full mb-1 mx-auto w-fit"
            style={{ backgroundColor: badgeBg }}
          >
            <Rocket className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="text-xs font-medium tracking-wide" style={{ color: textMuted }}>
              Our Journey
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl mt-[0.5rem] font-bold mb-0 tracking-tight"
            style={{ color: textPrimary }}
          >
            The Story of{' '}
            <span style={{ color: accentColor }}>Growth &amp; Innovation</span>
          </h2>

          <p
            className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide mt-1"
            style={{ color: textMuted }}
          >
            From humble beginnings to transforming portfolio management across institutions worldwide.
          </p>
        </motion.div>

        {/* ── SVG Timeline ───────────────────────────────────────────────────── */}
        <div ref={svgWrapRef} className="w-full flex justify-center -mt-4 md:-mt-6">
          <div className="w-full max-w-full">
            <svg
              viewBox="0 0 480 650"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', maxWidth: '100%' }}
            >
              <defs>
                <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={roadColors.gradient[0]} />
                  <stop offset="35%"  stopColor={roadColors.gradient[1]} />
                  <stop offset="70%"  stopColor={roadColors.gradient[2]} />
                  <stop offset="100%" stopColor={roadColors.gradient[3]} />
                </linearGradient>

                <radialGradient id="circleFill" cx="50%" cy="40%" r="65%">
                  <stop offset="0%"   stopColor={circleFill} />
                  <stop offset="100%" stopColor={isDark ? '#070502' : '#f0f4f9'} />
                </radialGradient>

                <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                </radialGradient>

                <filter id="glowLg" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2" />
                </filter>
                <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.06)" />
                </filter>
              </defs>

              {/* ── Road layers ──────────────────────────────────── */}

              <path
                id="road-glow"
                d={PATH_D}
                fill="none"
                stroke={roadColors.glow}
                strokeWidth={roadStrokeWidths.glow}
                strokeLinecap="round"
                opacity={isDark ? 0.5 : 0.3}
                filter="url(#glowLg)"
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              <path
                id="road-mid"
                d={PATH_D}
                fill="none"
                stroke={roadColors.mid}
                strokeWidth={roadStrokeWidths.mid}
                strokeLinecap="round"
                opacity={isDark ? 0.6 : 0.4}
                filter="url(#softGlow)"
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              <path
                d={PATH_D}
                fill="none"
                stroke={roadColors.base}
                strokeWidth={roadStrokeWidths.base}
                strokeLinecap="round"
              />

              <path
                id="road-main"
                d={PATH_D}
                fill="none"
                stroke="url(#roadGrad)"
                strokeWidth={roadStrokeWidths.main}
                strokeLinecap="round"
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              <path
                id="road-edge-l"
                d={PATH_D}
                fill="none"
                stroke={roadColors.edge}
                strokeWidth={roadStrokeWidths.edgeL}
                strokeLinecap="round"
                opacity={isDark ? 0.6 : 0.4}
                transform={`translate(${isMobile ? -2.5 : -2.5},0)`}
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              <path
                id="road-edge-r"
                d={PATH_D}
                fill="none"
                stroke={roadColors.edge}
                strokeWidth={roadStrokeWidths.edgeR}
                strokeLinecap="round"
                opacity={isDark ? 0.6 : 0.4}
                transform={`translate(${isMobile ? 2.5 : 2.5},0)`}
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              <path
                id="road-dashes"
                d={PATH_D}
                fill="none"
                stroke={roadColors.dash}
                strokeWidth={roadStrokeWidths.dashes}
                strokeLinecap="round"
                strokeDasharray={isMobile ? "8 10" : "10 10"}
                opacity={isDark ? 0.7 : 0.5}
              />

              {/* ── Milestones ──────────────────────────────────────────────── */}
              {milestones.map((m) => {
                const isVisible = visibleMilestones.has(m.id);
                const isRight = m.side === 'right';
                const xOffset = isRight ? (isMobile ? 35 : 40) : (isMobile ? -35 : -40);
                const textX = isRight ? m.dotX + (isMobile ? 28 : 30) : m.dotX - (isMobile ? 28 : 30);
                const textAnchor = isRight ? 'start' : 'end';
                const dotAccent = isDark ? GOLD : BLUE;

                // Card background for milestone text (light mode only)
                const cardBg = isDark ? 'transparent' : 'rgba(255,255,255,0.9)';
                const cardRadius = isMobile ? 6 : 4;

                // Card dimensions
                const cardWidth = isRight ? 160 : 150;
                const cardHeight = isMobile ? 70 : 62;

                // Card Y position (top of card)
                const cardY = m.cy + cardTopOffset;

                return (
                  <g key={m.id}>
                    {/* Glow behind dot */}
                    <circle
                      cx={m.dotX}
                      cy={m.cy}
                      r={outerRadius + 12}
                      fill="url(#dotGlow)"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: 'opacity 0.6s ease',
                      }}
                    />

                    {/* Outer ring */}
                    <circle
                      id={`dot-outer-${m.id}`}
                      cx={m.dotX}
                      cy={m.cy}
                      r={outerRadius}
                      fill="none"
                      stroke={dotAccent}
                      strokeWidth={isMobile ? 3 : 2.5}
                      style={{
                        opacity: isVisible ? 0.6 : 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />

                    {/* Inner filled circle */}
                    <circle
                      id={`dot-inner-${m.id}`}
                      cx={m.dotX}
                      cy={m.cy}
                      r={dotRadius}
                      fill="url(#circleFill)"
                      stroke={isDark ? dotAccent : '#e0e6f0'}
                      strokeWidth={isMobile ? 2.5 : 2}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: 'opacity 0.4s ease 0.05s',
                        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    />

                    {/* Year label */}
                    <text
                      x={m.dotX}
                      y={m.cy + (isMobile ? 4 : 4)}
                      textAnchor="middle"
                      fontSize={yearFontSize}
                      fontWeight={700}
                      fill={isDark ? '#FFFFFF' : '#1A2332'}
                      fontFamily="Poppins, sans-serif"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: 'opacity 0.3s ease 0.15s',
                      }}
                    >
                      {m.year}
                    </text>

                    {/* Title + description with card background - TEXT PUSHED 2rem INSIDE CARD */}
                    <g
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                          ? 'translateX(0)'
                          : `translateX(${xOffset}px)`,
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                      }}
                    >
                      {/* Card background */}
                      {!isDark && (
                        <rect
                          x={isRight ? textX - (isMobile ? 4 : 6) : textX - cardWidth + 10}
                          y={cardY}
                          width={cardWidth}
                          height={cardHeight}
                          rx={cardRadius}
                          fill={cardBg}
                          filter="url(#cardShadow)"
                          style={{
                            opacity: 0.6,
                            transition: 'opacity 0.3s ease',
                          }}
                        />
                      )}
                      
                      {/* Title - positioned 2rem (32px) from card top */}
                      <text
                        x={textX}
                        y={cardY + textYOffset}
                        fontSize={titleFontSize}
                        fontWeight={700}
                        fill={isDark ? dotAccent : BLUE}
                        textAnchor={textAnchor}
                        fontFamily="Poppins, sans-serif"
                      >
                        {m.title}
                      </text>
                      
                      {/* Description - positioned below title */}
                      {m.desc.map((line, i) => (
                        <text
                          key={i}
                          x={textX}
                          y={cardY + textYOffset + (isMobile ? 18 : 14) + i * lineHeight}
                          fontSize={descFontSize}
                          fill={textMuted}
                          textAnchor={textAnchor}
                          fontFamily="Poppins, sans-serif"
                          letterSpacing="0.2"
                          fontWeight={isMobile ? 600 : 400}
                        >
                          {line}
                        </text>
                      ))}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}