/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Rocket } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const milestones = [
  {
    cx: 265, cy: 65, side: 'R',
    title: "Start of NestickTech",
    desc: "Nestick Tech was founded with a vision to provide innovative digital solutions for educational institutions."
  },
  {
    cx: 250, cy: 178, side: 'L',
    title: "Good Client Base Established",
    desc: "Successfully built a strong client base across Pakistan, earning trust through quality service and support."
  },
  {
    cx: 305, cy: 298, side: 'R',
    title: "Global Expansion",
    desc: "Expanded operations internationally, serving clients worldwide with customized digital solutions."
  },
  {
    cx: 205, cy: 393, side: 'L',
    title: "Launch of 1st Product — Neezamiya",
    desc: "Launched our flagship product 'Neezamiya' - a comprehensive educational management system."
  },
  {
    cx: 265, cy: 508, side: 'R',
    title: "Launch of PBM",
    desc: "Introduced Portfolio Business Manager (PBM) – revolutionizing portfolio handling for institutions."
  },
  {
    cx: 215, cy: 600, side: 'L',
    title: "Ready to Conquer This Year",
    desc: "Setting our sights on new heights with AI-powered solutions and global market leadership."
  }
];

// Road ends exactly at last milestone cy=600
const ROAD_PATH =
  "M270,15 C275,35 260,45 265,55 C270,90 235,130 250,178 C265,220 320,250 305,298 C290,335 190,350 205,393 C220,430 280,460 265,508 C250,545 195,560 215,600";

// ─── FONT SIZES ──────────────────────────────────────────────────────────────
const TITLE_SIZE = 12;
const DESC_SIZE  = 8;
const TITLE_LH   = 18;
const DESC_LH    = 11;
const GAP        = 4;

// ─── POSITIONING ─────────────────────────────────────────────────────────────
const RIGHT_X     = 340;
const RIGHT_MAXW  = 200;

const LEFT_X      = 12;
const LEFT_CIRCLE_GAP = 28;

function wrapLines(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontWeight: number
): string[] {
  if (typeof window === 'undefined') {
    return text.split(' ').reduce<string[]>((acc, w) => {
      if (!acc.length) return [w];
      const last = acc[acc.length - 1];
      return last.length + w.length < 22
        ? [...acc.slice(0, -1), `${last} ${w}`]
        : [...acc, w];
    }, []);
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [text];
  ctx.font = `${fontWeight} ${fontSize}px Poppins`;
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width <= maxWidth || !cur) {
      cur = test;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ─── Per-Milestone animated SVG group ────────────────────────────────────────

type Milestone = {
  cx: number;
  cy: number;
  side: string;
  title: string;
  desc: string;
};

function MilestoneBlock({
  m,
  idx,
  theme,
  accentColor,
  descColor,
  textColor,
}: {
  m: Milestone;
  idx: number;
  theme: 'light' | 'dark';
  accentColor: string;
  descColor: string;
  textColor: string;
}) {
  const ref = useRef(null);

  const isVisible = useInView(ref, {
    once: false,
    margin: '-15% 0px -15% 0px',
  });

  const isRight = m.side === 'R';
  
  let x: number;
  let maxW: number;
  
  if (isRight) {
    x = RIGHT_X;
    maxW = RIGHT_MAXW;
  } else {
    const circleRightEdge = m.cx - 23 - LEFT_CIRCLE_GAP;
    const textEnd = circleRightEdge - 6;
    maxW = textEnd - LEFT_X;
    if (maxW < 60) maxW = 60;
    x = LEFT_X;
  }

  const titleLines = wrapLines(m.title, maxW, TITLE_SIZE, 700);
  const descLines  = wrapLines(m.desc,  maxW, DESC_SIZE,  400);
  const totalH     = titleLines.length * TITLE_LH + GAP + descLines.length * DESC_LH;
  let blockTop     = m.cy - totalH / 2;
  if (blockTop < 10) blockTop = 10;

  const xSlide = isRight ? 60 : -60;
  const t = { duration: 0.55, ease: 'easeOut' as const };

  return (
    <g ref={ref}>
      <motion.circle
        cx={m.cx} cy={m.cy} r={18}
        fill={accentColor}
        filter="url(#ringGlow)"
        animate={{ opacity: isVisible ? 0.55 : 0 }}
        transition={t}
      />

      <motion.circle
        cx={m.cx} cy={m.cy} r={15}
        fill={`url(#circleFill-${theme})`}
        stroke={accentColor}
        strokeWidth={1.8}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.3 }}
        style={{ transformOrigin: `${m.cx}px ${m.cy}px` }}
        transition={{ ...t, delay: 0.05 }}
      />

      <motion.text
        x={m.cx} y={m.cy + 4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={textColor}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        &apos;{20 + idx + 1}
      </motion.text>

      <motion.g
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : xSlide }}
        transition={{ ...t, delay: 0.08 }}
      >
        <text
          x={x}
          y={blockTop + TITLE_LH * 0.78}
          fontSize={TITLE_SIZE}
          fontWeight={700}
          fill={accentColor}
          fontFamily="Poppins, sans-serif"
        >
          {titleLines.map((line, i) => (
            <tspan key={i} x={x} dy={i === 0 ? 0 : TITLE_LH}>{line}</tspan>
          ))}
        </text>

        <text
          x={x}
          y={blockTop + titleLines.length * TITLE_LH + GAP + DESC_LH * 0.78}
          fontSize={DESC_SIZE}
          fill={descColor}
          fontFamily="Poppins, sans-serif"
        >
          {descLines.map((line, i) => (
            <tspan key={i} x={x} dy={i === 0 ? 0 : DESC_LH}>{line}</tspan>
          ))}
        </text>
      </motion.g>
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const headerVisible = useInView(headerRef, {
    once: false,
    margin: '-10% 0px -10% 0px',
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const roadRaw = useTransform(scrollYProgress, [0.05, 0.75], [0, 1]);
  const roadPathLength = useSpring(roadRaw, {
    stiffness: 55,
    damping: 18,
    restDelta: 0.001,
  });

  useEffect(() => {
    const check = () =>
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  const getBg     = () => (theme === 'dark' ? '#0B0F19' : '#F5F5F5');
  const getText   = () => (theme === 'dark' ? '#FFFFFF'  : '#1F2937');
  const getMuted  = () => (theme === 'dark' ? '#9CA3AF'  : '#6B7280');
  const getAccent = () => (theme === 'dark' ? '#E8CA5E'  : '#00A0FF');

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 overflow-hidden"
      style={{ backgroundColor: getBg(), fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div ref={headerRef}>
          <motion.div
            animate={{ opacity: headerVisible ? 1 : 0, y: headerVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
              style={{
                backgroundColor:
                  theme === 'dark' ? 'rgba(31,67,129,0.2)' : 'rgba(0,160,255,0.08)',
              }}
            >
              <Rocket className="w-3.5 h-3.5" style={{ color: getAccent() }} />
              <span
                className="text-xs font-medium tracking-wide"
                style={{ color: getMuted(), fontFamily: "'Poppins', sans-serif" }}
              >
                Our Journey
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tight"
              style={{ color: getText(), fontFamily: "'Poppins', sans-serif" }}
            >
              The Story of{' '}
              <span style={{ color: getAccent() }}>Growth &amp; Innovation</span>
            </h2>

            <p
              className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide"
              style={{ color: getMuted(), fontFamily: "'Calibri Light', sans-serif" }}
            >
              From humble beginnings to transforming portfolio management across
              institutions worldwide.
            </p>
          </motion.div>
        </div>

        {/* ─── SVG Timeline - FULL WIDTH ──────────────────────────────────── */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-full mx-auto">
            <svg
              viewBox="0 0 580 700"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id={`roadGrad-${theme}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={theme === 'dark' ? '#a9690f' : '#0044CC'} />
                  <stop offset="35%"  stopColor={theme === 'dark' ? '#f3b13b' : '#0066FF'} />
                  <stop offset="70%"  stopColor={theme === 'dark' ? '#ffe08a' : '#3399FF'} />
                  <stop offset="100%" stopColor={theme === 'dark' ? '#caa24a' : '#0055DD'} />
                </linearGradient>

                <radialGradient id={`circleFill-${theme}`} cx="50%" cy="40%" r="65%">
                  <stop offset="0%"   stopColor={theme === 'dark' ? '#1c1712' : '#f0ece6'} />
                  <stop offset="100%" stopColor={theme === 'dark' ? '#070502' : '#e0d8cc'} />
                </radialGradient>

                <filter id="softGlow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="5" result="b1" />
                  <feMerge>
                    <feMergeNode in="b1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="bigGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="12" />
                </filter>

                <filter id="ringGlow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="2" />
                </filter>

                <marker
                  id="roadArrowEnd"
                  viewBox="0 0 14 14"
                  refX="11"
                  refY="7"
                  markerWidth="9"
                  markerHeight="9"
                  orient="auto"
                >
                  <path
                    d="M2 2L11 7L2 12"
                    fill="none"
                    stroke={theme === 'dark' ? '#E8CA5E' : '#0066FF'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>

              <rect x="0" y="0" width="580" height="700" fill="transparent" />

              <motion.path
                d={ROAD_PATH}
                fill="none"
                stroke={theme === 'dark' ? '#7a4e10' : '#0044CC'}
                strokeWidth={16}
                strokeLinecap="round"
                opacity={0.28}
                filter="url(#bigGlow)"
                style={{ pathLength: roadPathLength }}
              />

              <motion.path
                d={ROAD_PATH}
                fill="none"
                stroke={theme === 'dark' ? '#ffb238' : '#0066FF'}
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.5}
                filter="url(#softGlow)"
                style={{ pathLength: roadPathLength }}
              />

              <motion.path
                d={ROAD_PATH}
                fill="none"
                stroke={`url(#roadGrad-${theme})`}
                strokeWidth={3.5}
                strokeLinecap="round"
                style={{ pathLength: roadPathLength }}
              />

              <motion.path
                d={ROAD_PATH}
                fill="none"
                stroke={theme === 'dark' ? '#fff8e6' : '#ffffff'}
                strokeWidth={0.8}
                strokeLinecap="round"
                opacity={0.85}
                style={{ pathLength: roadPathLength }}
              />

              {milestones.map((m, idx) => (
                <MilestoneBlock
                  key={idx}
                  m={m}
                  idx={idx}
                  theme={theme}
                  accentColor={getAccent()}
                  descColor={getMuted()}
                  textColor={getText()}
                />
              ))}
              
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}