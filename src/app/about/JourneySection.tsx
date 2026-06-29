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

const milestones: Milestone[] = [
  {
    id: 0,
    cy: 85,
    dotX: 222,
    year: "'21",
    title: 'Start of NestickTech',
    desc: ['Founded with a vision for digital', 'solutions in education.'],
    side: 'right',
  },
  {
    id: 1,
    cy: 210,
    dotX: 215,
    year: "'22",
    title: 'Good Client Base',
    desc: ['Strong client base across', 'Pakistan established.'],
    side: 'left',
  },
  {
    id: 2,
    cy: 322,
    dotX: 258,
    year: "'23",
    title: 'Global Expansion',
    desc: ['Expanded operations serving', 'clients worldwide.'],
    side: 'right',
  },
  {
    id: 3,
    cy: 418,
    dotX: 182,
    year: "'24",
    title: 'Launch — Neezamiya',
    desc: ['Educational management', 'system launched.'],
    side: 'left',
  },
  {
    id: 4,
    cy: 522,
    dotX: 232,
    year: "'25",
    title: 'Launch of PBM',
    desc: ['Portfolio Business Manager', 'revolutionizing institutions.'],
    side: 'right',
  },
  {
    id: 5,
    cy: 630,
    dotX: 190,
    year: "'26",
    title: 'Ready to Conquer',
    desc: ['AI-powered solutions and', 'global market leadership.'],
    side: 'left',
  },
];

// ─── PATH - Same but will be thinner ───
const PATH_D =
  'M222,85 C228,100 200,150 215,210 C228,252 272,278 258,322 C244,360 168,375 182,418 C196,455 245,480 232,522 C220,558 172,575 190,630';

const GOLD = '#E8CA5E'; // ← UPDATED: Templates Gold
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
  const textPrimary = isDark ? '#f8fafc' : '#1F2937';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';
  const bgColor = isDark ? '#0B0F19' : '#F5F5F5';
  const badgeBg = isDark ? 'rgba(232,202,94,0.15)' : 'rgba(0,102,255,0.08)'; // ← UPDATED: Gold
  const circleFill = isDark ? '#1c1712' : '#f0ece6';
  
  // ─── UPDATED: Thinner road colors ───
  const roadColors = isDark ? {
    glow: 'rgba(232,202,94,0.15)', // ← UPDATED: Gold glow
    mid: 'rgba(232,202,94,0.30)', // ← UPDATED: Gold mid
    base: 'rgba(30,41,59,0.4)', // ← UPDATED: Thinner base
    gradient: ['#E8CA5E', '#E8CA5E', '#E8CA5E', '#c49b2a'], // ← UPDATED: Gold
    edge: 'rgba(232,202,94,0.4)', // ← UPDATED: Gold edge
    dash: 'rgba(232,202,94,0.6)', // ← UPDATED: Gold dash
  } : {
    glow: 'rgba(0,102,255,0.12)',
    mid: 'rgba(0,102,255,0.25)',
    base: 'rgba(200,210,225,0.5)',
    gradient: ['#0066FF', '#0066FF', '#3385FF', '#0044aa'],
    edge: 'rgba(0,102,255,0.3)',
    dash: 'rgba(0,102,255,0.5)',
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
  const textYOffset = isMobile ? -10 : -13;
  const lineHeight = isMobile ? 16 : 11;

  // ─── THINNER PATH STROKE WIDTHS ────────────────────────────────────────────
  const roadStrokeWidths = {
    glow: isMobile ? 6 : 6,
    mid: isMobile ? 3 : 3,
    base: isMobile ? 8 : 6, // ← THINNER
    main: isMobile ? 4 : 3.5, // ← THINNER
    edgeL: isMobile ? 1 : 1,
    edgeR: isMobile ? 1 : 1,
    dashes: isMobile ? 1.5 : 1.5,
  };

  return (
    <section
      className="py-4 md:py-6 overflow-hidden w-full"
      style={{ backgroundColor: bgColor, fontFamily: "'Poppins', sans-serif", transition: 'background-color 0.6s ease' }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
          className="text-center mb-4 md:mb-6"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 mx-auto w-fit"
            style={{ backgroundColor: badgeBg }}
          >
            <Rocket className="w-3.5 h-3.5" style={{ color: isDark ? GOLD : BLUE }} />
            <span className="text-xs font-medium tracking-wide" style={{ color: textMuted }}>
              Our Journey
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 tracking-tight"
            style={{ color: textPrimary }}
          >
            The Story of{' '}
            <span style={{ color: isDark ? GOLD : BLUE }}>Growth &amp; Innovation</span>
          </h2>

          <p
            className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide"
            style={{ color: textMuted }}
          >
            From humble beginnings to transforming portfolio management across institutions worldwide.
          </p>
        </motion.div>

        {/* ── SVG Timeline ───────────────────────────────────────────────────── */}
        <div ref={svgWrapRef} className="w-full flex justify-center -mt-2">
          <div className="w-full max-w-full">
            <svg
              viewBox="0 0 480 680"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', maxWidth: '100%' }}
            >
              <defs>
                {/* Road gradient - GOLD for dark, BLUE for light */}
                <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={roadColors.gradient[0]} />
                  <stop offset="35%"  stopColor={roadColors.gradient[1]} />
                  <stop offset="70%"  stopColor={roadColors.gradient[2]} />
                  <stop offset="100%" stopColor={roadColors.gradient[3]} />
                </linearGradient>

                {/* Dot fill */}
                <radialGradient id="circleFill" cx="50%" cy="40%" r="65%">
                  <stop offset="0%"   stopColor={circleFill} />
                  <stop offset="100%" stopColor={isDark ? '#070502' : '#e0d8cc'} />
                </radialGradient>

                {/* Glow filters */}
                <filter id="glowLg" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2" />
                </filter>
              </defs>

              {/* ── Road layers - THINNER ──────────────────────────────────── */}

              {/* 1. Outer glow - THINNER */}
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

              {/* 2. Mid glow - THINNER */}
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

              {/* 3. Asphalt base - THINNER */}
              <path
                d={PATH_D}
                fill="none"
                stroke={roadColors.base}
                strokeWidth={roadStrokeWidths.base}
                strokeLinecap="round"
              />

              {/* 4. Road surface - THINNER */}
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

              {/* 5. Left edge line - THINNER */}
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

              {/* 6. Right edge line - THINNER */}
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

              {/* 7. Center dashed line - THINNER */}
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
                const accentColor = isDark ? GOLD : BLUE;

                return (
                  <g key={m.id}>
                    {/* Outer glow ring */}
                    <circle
                      id={`dot-outer-${m.id}`}
                      cx={m.dotX}
                      cy={m.cy}
                      r={outerRadius}
                      fill={accentColor}
                      filter="url(#softGlow)"
                      style={{
                        opacity: isVisible ? 0.4 : 0,
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
                      stroke={accentColor}
                      strokeWidth={isMobile ? 2.5 : 2.2}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: 'opacity 0.4s ease 0.05s',
                      }}
                    />

                    {/* Year label */}
                    <text
                      x={m.dotX}
                      y={m.cy + (isMobile ? 4 : 4)}
                      textAnchor="middle"
                      fontSize={yearFontSize}
                      fontWeight={700}
                      fill={isDark ? '#FFFFFF' : '#1F2937'}
                      fontFamily="Poppins, sans-serif"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: 'opacity 0.3s ease 0.15s',
                      }}
                    >
                      {m.year}
                    </text>

                    {/* Title + description */}
                    <g
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                          ? 'translateX(0)'
                          : `translateX(${xOffset}px)`,
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                      }}
                    >
                      <text
                        x={textX}
                        y={m.cy + textYOffset}
                        fontSize={titleFontSize}
                        fontWeight={700}
                        fill={accentColor}
                        textAnchor={textAnchor}
                        fontFamily="Poppins, sans-serif"
                      >
                        {m.title}
                      </text>
                      {m.desc.map((line, i) => (
                        <text
                          key={i}
                          x={textX}
                          y={m.cy + textYOffset + (isMobile ? 18 : 13) + i * lineHeight}
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