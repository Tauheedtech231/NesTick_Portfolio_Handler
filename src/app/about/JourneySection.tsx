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
    desc: ['Flagship educational management', 'system launched.'],
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

// FIXED: Path starts exactly at first milestone and ends exactly at last milestone
const PATH_D =
  'M222,85 C228,100 200,150 215,210 C228,252 272,278 258,322 C244,360 168,375 182,418 C196,455 245,480 232,522 C220,558 172,575 190,630';

const GOLD = '#E8CA5E';

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
      
      // FIXED: Better scroll timing - start when section enters viewport
      // and end when section leaves viewport
      const startPx = vh * 0.4; // Start earlier (when section is 40% from top)
      const endPx = -rect.height * 0.6; // End when section is 60% scrolled past
      
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
  const badgeBg = isDark ? 'rgba(31,67,129,0.2)' : 'rgba(0,102,255,0.08)';
  const circleFill = isDark ? '#1c1712' : '#f0ece6';

  return (
    <section
      className="py-4 md:py-6 overflow-hidden w-full"
      style={{ backgroundColor: bgColor, fontFamily: "'Poppins', sans-serif" }}
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
            <Rocket className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <span className="text-xs font-medium tracking-wide" style={{ color: textMuted }}>
              Our Journey
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 tracking-tight"
            style={{ color: textPrimary }}
          >
            The Story of{' '}
            <span style={{ color: GOLD }}>Growth &amp; Innovation</span>
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
          <div className="w-full">
            <svg
              viewBox="0 0 480 680"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Road gradient */}
                <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#a9690f" />
                  <stop offset="35%"  stopColor="#f3b13b" />
                  <stop offset="70%"  stopColor="#ffe08a" />
                  <stop offset="100%" stopColor="#caa24a" />
                </linearGradient>

                {/* Dot fill */}
                <radialGradient id="circleFill" cx="50%" cy="40%" r="65%">
                  <stop offset="0%"   stopColor={circleFill} />
                  <stop offset="100%" stopColor={isDark ? '#070502' : '#e0d8cc'} />
                </radialGradient>

                {/* Glow filters */}
                <filter id="glowLg" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
                <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2.5" />
                </filter>
              </defs>

              {/* ── Road layers ─────────────────────────────────────────────── */}

              {/* 1. Outer glow - made thinner */}
              <path
                id="road-glow"
                d={PATH_D}
                fill="none"
                stroke="#7a4e10"
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.22}
                filter="url(#glowLg)"
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              {/* 2. Mid glow - made thinner */}
              <path
                id="road-mid"
                d={PATH_D}
                fill="none"
                stroke="#ffb238"
                strokeWidth={4}
                strokeLinecap="round"
                opacity={0.4}
                filter="url(#softGlow)"
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              {/* 3. Asphalt base - made thinner */}
              <path
                d={PATH_D}
                fill="none"
                stroke="#3a2a0a"
                strokeWidth={12}
                strokeLinecap="round"
              />

              {/* 4. Road surface - made thinner */}
              <path
                id="road-main"
                d={PATH_D}
                fill="none"
                stroke="url(#roadGrad)"
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              {/* 5. Left edge line - adjusted offset */}
              <path
                id="road-edge-l"
                d={PATH_D}
                fill="none"
                stroke="#7a4400"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.7}
                transform="translate(-3.5,0)"
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              {/* 6. Right edge line - adjusted offset */}
              <path
                id="road-edge-r"
                d={PATH_D}
                fill="none"
                stroke="#7a4400"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.7}
                transform="translate(3.5,0)"
                strokeDasharray={totalLength || 1}
                strokeDashoffset={totalLength || 1}
              />

              {/* 7. Center dashed white line - unchanged */}
              <path
                id="road-dashes"
                d={PATH_D}
                fill="none"
                stroke="#fff8e6"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="12 8"
                opacity={0.85}
              />

              {/* ── Milestones ──────────────────────────────────────────────── */}
              {milestones.map((m) => {
                const isVisible = visibleMilestones.has(m.id);
                const isRight = m.side === 'right';
                const xOffset = isRight ? 40 : -40;
                const textX = isRight ? m.dotX + 30 : m.dotX - 30;
                const textAnchor = isRight ? 'start' : 'end';
                const textYOffset = -13;

                return (
                  <g key={m.id}>
                    {/* Outer glow ring */}
                    <circle
                      id={`dot-outer-${m.id}`}
                      cx={m.dotX}
                      cy={m.cy}
                      r={20}
                      fill={GOLD}
                      filter="url(#softGlow)"
                      style={{
                        opacity: isVisible ? 0.5 : 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />

                    {/* Inner filled circle */}
                    <circle
                      id={`dot-inner-${m.id}`}
                      cx={m.dotX}
                      cy={m.cy}
                      r={16}
                      fill="url(#circleFill)"
                      stroke={GOLD}
                      strokeWidth={2.2}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: 'opacity 0.4s ease 0.05s',
                      }}
                    />

                    {/* Year label */}
                    <text
                      x={m.dotX}
                      y={m.cy + 4}
                      textAnchor="middle"
                      fontSize={10}
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
                        fontSize={11}
                        fontWeight={700}
                        fill={GOLD}
                        textAnchor={textAnchor}
                        fontFamily="Poppins, sans-serif"
                      >
                        {m.title}
                      </text>
                      {m.desc.map((line, i) => (
                        <text
                          key={i}
                          x={textX}
                          y={m.cy + textYOffset + 13 + i * 11}
                          fontSize={8}
                          fill={textMuted}
                          textAnchor={textAnchor}
                          fontFamily="Poppins, sans-serif"
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