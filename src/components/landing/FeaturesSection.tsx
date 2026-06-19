'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from 'react-intersection-observer';
import {
  Layout,
  Building2,
  Settings,
  Zap,
  Shield,
  BarChart3,
  LucideIcon,
} from "lucide-react";
import { TiArrowSortedDown } from "react-icons/ti";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  fill: string;
  stroke: string;
  tagBg: string;
  tagColor: string;
  tag: string;
  bar: string;
  shortLabel: string;
}

interface FeaturesSectionProps {
  featuresRef?: React.RefObject<HTMLDivElement | null>;
  addToRefs?: (
    el: HTMLDivElement | null,
    refArray: React.MutableRefObject<HTMLDivElement[]>
  ) => void;
  featureCardsRef?: React.MutableRefObject<HTMLDivElement[]>;
}

const features: Feature[] = [
  {
    title: "Ready-Made Portfolio Templates",
    description:
      "Professional templates for colleges with standard sections: Home, About, Services, Faculty, Gallery, Contact. Easily customizable for any educational institute.",
    icon: Layout,
    fill: "#CECBF6",
    stroke: "#534AB7",
    tagBg: "#EEEDFE",
    tagColor: "#3C3489",
    tag: "Templates",
    bar: "#534AB7",
    shortLabel: "Portfolio",
  },
  {
    title: "Multi-Portal Architecture",
    description:
      "Three-tier system: Generic Portal for previews, Main Admin Portal for centralized control, and College Admin Portal for individual institution management.",
    icon: Building2,
    fill: "#9FE1CB",
    stroke: "#0F6E56",
    tagBg: "#E1F5EE",
    tagColor: "#085041",
    tag: "Architecture",
    bar: "#1D9E75",
    shortLabel: "Portals",
  },
  {
    title: "Centralized Management",
    description:
      "Add/edit/delete colleges, approve template requests, upload new templates, and manage sections per college from a single dashboard.",
    icon: Settings,
    fill: "#B5D4F4",
    stroke: "#185FA5",
    tagBg: "#E6F1FB",
    tagColor: "#0C447C",
    tag: "Core Hub",
    bar: "#378ADD",
    shortLabel: "Management",
  },
  {
    title: "Real-Time Content Updates",
    description:
      "Changes made by college admins reflect instantly on live websites with live synchronization to the centralized database.",
    icon: Zap,
    fill: "#F5C4B3",
    stroke: "#993C1D",
    tagBg: "#FAECE7",
    tagColor: "#712B13",
    tag: "Live Sync",
    bar: "#D85A30",
    shortLabel: "Live Sync",
  },
  {
    title: "Role-Based Access Control",
    description:
      "Three-tier access: Generic users view templates, College admins manage their content, Main admin has full system control.",
    icon: Shield,
    fill: "#F4C0D1",
    stroke: "#993556",
    tagBg: "#FBEAF0",
    tagColor: "#72243E",
    tag: "Security",
    bar: "#D4537E",
    shortLabel: "Access Ctrl",
  },
  {
    title: "Scalable Infrastructure",
    description:
      "Built to support multiple institutions simultaneously with independent workspaces and robust data management tools.",
    icon: BarChart3,
    fill: "#C0DD97",
    stroke: "#3B6D11",
    tagBg: "#EAF3DE",
    tagColor: "#27500A",
    tag: "Scale",
    bar: "#639922",
    shortLabel: "Scalable",
  },
];

const SVG_W = 680;
const SVG_H = 360;
const PIE_CX = 240;
const PIE_CY = 180;
const PIE_R = 130;
const STEP = 360 / features.length;

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function makeSegPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = polarToXY(cx, cy, r, a1);
  const e = polarToXY(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M${cx},${cy}L${s.x},${s.y}A${r},${r},0,${large},1,${e.x},${e.y}Z`;
}

export default function FeaturesSection({
  featuresRef,
  addToRefs,
  featureCardsRef,
}: FeaturesSectionProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [typedText, setTypedText] = useState("");
  const [cardPos, setCardPos] = useState<{ 
    left: number; 
    top: number; 
    centerX: number; 
    centerY: number;
    topX: number;
    topY: number;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { ref: headingRef, inView: headingInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

  const { ref: pieRef, inView: pieInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

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

  const getColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#0B0F19',
        cardBg: 'rgba(15, 23, 42, 0.95)',
        border: 'rgba(30, 41, 59, 0.5)',
        text: '#FFFFFF',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        accent: '#E8CA5E',
        accentLight: 'rgba(232, 202, 94, 0.15)',
        heading: '#FFFFFF',
        subheading: '#9CA3AF',
        cardBorder: 'rgba(30, 41, 59, 0.5)',
        cardBgLight: 'rgba(15, 23, 42, 0.4)',
      };
    } else {
      return {
        bg: '#FFFFFF',
        cardBg: '#FFFFFF',
        border: 'rgba(0, 0, 0, 0.06)',
        text: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        accent: '#0066FF',
        accentLight: 'rgba(0, 102, 255, 0.08)',
        heading: '#1F2937',
        subheading: '#6B7280',
        cardBorder: 'rgba(0, 0, 0, 0.06)',
        cardBgLight: '#FAFAFA',
      };
    }
  };

  const colors = getColors();

  // Pie top position
  const PIE_TOP_X = PIE_CX;
  const PIE_TOP_Y = PIE_CY - PIE_R - 5;

  const computeCardPosition = useCallback(() => {
    if (!wrapRef.current || !svgRef.current) return null;

    const wrapRect = wrapRef.current.getBoundingClientRect();
    const svgEl = svgRef.current;
    const scale = svgEl.clientWidth / SVG_W;

    const CARD_W = 360;
    const CARD_H = 190;
    const PAD = 20;

    let cardLeft = wrapRect.width - CARD_W - PAD - 20;
    let cardTop = (wrapRect.height - CARD_H) / 2;

    if (cardTop < 8) cardTop = 8;
    if (cardTop + CARD_H > wrapRect.height - 8) {
      cardTop = wrapRect.height - CARD_H - 8;
    }
    if (cardLeft < PAD) cardLeft = PAD;
    if (cardLeft + CARD_W > wrapRect.width - PAD) {
      cardLeft = wrapRect.width - CARD_W - PAD;
    }

    return {
      left: cardLeft,
      top: cardTop,
      centerX: cardLeft + CARD_W / 2,
      centerY: cardTop + CARD_H / 2,
      topX: cardLeft + CARD_W / 2,
      topY: cardTop,
    };
  }, []);

  const startTyping = useCallback((text: string) => {
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    setTypedText("");
    setIsTyping(true);
    let pos = 0;
    typeTimerRef.current = setInterval(() => {
      pos++;
      setTypedText(text.slice(0, pos));
      if (pos >= text.length) {
        clearInterval(typeTimerRef.current!);
        setIsTyping(false);
      }
    }, 18);
  }, []);

  const handleEnter = useCallback(
    (idx: number) => {
      if (activeIdx === idx) return;
      setActiveIdx(idx);
      const pos = computeCardPosition();
      setCardPos(pos);
      startTyping(features[idx].description);
    },
    [activeIdx, computeCardPosition, startTyping]
  );

  useEffect(() => {
    if (pieInView && isInitialLoad) {
      setIsInitialLoad(false);
      const pos = computeCardPosition();
      setCardPos(pos);
      startTyping(features[0].description);
    }
  }, [pieInView, isInitialLoad, computeCardPosition, startTyping]);

  useEffect(() => {
    const handleResize = () => {
      const pos = computeCardPosition();
      setCardPos(pos);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [computeCardPosition]);

  useEffect(() => {
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    };
  }, []);

  const f = activeIdx !== null ? features[activeIdx] : features[0];
  const progress =
    f && typedText.length > 0
      ? Math.round((typedText.length / f.description.length) * 100)
      : 0;

  // Get arrow path - from pie top to arrow top (8px above card)
// Get arrow path - from pie top to arrow top center edge
const getArrowPath = () => {
  if (!cardPos || !svgRef.current || !wrapRef.current) return '';
  
  const svgEl = svgRef.current;
  const wrapRect = wrapRef.current.getBoundingClientRect();
  const svgRect = svgEl.getBoundingClientRect();
  
  const scaleX = SVG_W / svgRect.width;
  const scaleY = SVG_H / svgRect.height;
  
  const startX = PIE_TOP_X;
  const startY = PIE_TOP_Y;
  
  const cardXRelativeToSVG = (cardPos.topX + wrapRect.left - svgRect.left);
  const cardYRelativeToSVG = (cardPos.topY + wrapRect.top - svgRect.top);
  
  // Line ends at arrow top edge (12px above card center, which is arrow top)
  // Arrow is 24px tall, so top is at -12px from center
  const endX = cardXRelativeToSVG * scaleX;
  const endY = (cardYRelativeToSVG - 12) * scaleY; // Arrow top edge
  
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 60;
  
  return `M ${startX} ${startY} Q ${midX} ${midY}, ${endX} ${endY}`;
};

  const arrowPath = getArrowPath();

  // Get arrow position - above card top
  // Get arrow position - arrow centered above card
const getArrowPos = () => {
  if (!cardPos || !svgRef.current || !wrapRef.current) return null;
  
  const svgEl = svgRef.current;
  const wrapRect = wrapRef.current.getBoundingClientRect();
  const svgRect = svgEl.getBoundingClientRect();
  
  const scaleX = SVG_W / svgRect.width;
  const scaleY = SVG_H / svgRect.height;
  
  const cardXRelativeToSVG = (cardPos.topX + wrapRect.left - svgRect.left);
  const cardYRelativeToSVG = (cardPos.topY + wrapRect.top - svgRect.top);
  
  return {
    x: cardXRelativeToSVG * scaleX,
    y: (cardYRelativeToSVG - 6) * scaleY, // Arrow center (12px above card top + 6px adjustment)
  };
};

  const arrowPos = getArrowPos();

  return (
    <section
      ref={featuresRef}
      className="w-full py-16 px-4 overflow-hidden"
      style={{ backgroundColor: colors.bg }}
      aria-label="System features"
    >
      <div className="max-w-6xl mx-auto">
        <div
          ref={headingRef}
          className="text-center mb-10"
          style={{
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? 'translateX(0)' : 'translateX(-150px)',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-4xl font-bold font-serif tracking-tight"
            style={{ color: colors.heading }}
          >
            Comprehensive <span style={{ color: colors.accent }}>System Features</span>
          </h2>
          <p
            className="text-sm md:text-base mt-2 font-light"
            style={{ color: colors.subheading }}
          >
            Hover over each feature to explore
          </p>
        </div>

        <div
          ref={pieRef}
          className="relative w-full"
          style={{ 
            minHeight: 420,
            opacity: pieInView ? 1 : 0,
            transform: pieInView ? 'translateY(0)' : 'translateY(120px)',
            transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div ref={wrapRef} className="relative w-full" style={{ minHeight: 420 }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full block"
              aria-hidden="true"
            >
              {features.map((feat, i) => {
                const a1 = i * STEP;
                const a2 = a1 + STEP;
                const mid = a1 + STEP / 2;
                const lp = polarToXY(PIE_CX, PIE_CY, PIE_R * 0.55, mid);
                const isActive = activeIdx === i;
                const isDimmed = activeIdx !== null && !isActive;

                return (
                  <g
                    key={i}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => handleEnter(i)}
                  >
                    <path
                      d={makeSegPath(PIE_CX, PIE_CY, PIE_R, a1, a2)}
                      fill={feat.fill}
                      stroke={feat.stroke}
                      strokeWidth={2.5}
                      style={{
                        opacity: isDimmed ? 0.3 : 1,
                        transition: "opacity 0.2s ease",
                      }}
                    />
                    <text
                      x={lp.x}
                      y={lp.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={9}
                      fontWeight={600}
                      fill={feat.stroke}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {feat.shortLabel}
                    </text>
                  </g>
                );
              })}

              {/* Curved line + TiArrowSortedDown icon */}
              {cardPos && arrowPath && arrowPos && (
                <>
                  {/* Main curved line */}
                  <path
                    d={arrowPath}
                    fill="none"
                    stroke={f.stroke}
                    strokeWidth={1.5}
                    opacity={0.6}
                    strokeLinecap="round"
                  />
                  
                  {/* Glow dot at pie top */}
                  <circle
                    cx={PIE_TOP_X}
                    cy={PIE_TOP_Y}
                    r="8"
                    fill={f.stroke}
                    opacity={0.15}
                  >
                    <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Solid dot at pie top */}
                  <circle
                    cx={PIE_TOP_X}
                    cy={PIE_TOP_Y}
                    r="3.5"
                    fill={f.stroke}
                    opacity={0.8}
                  />
                  <circle
                    cx={PIE_TOP_X}
                    cy={PIE_TOP_Y}
                    r="1.5"
                    fill="#FFFFFF"
                    opacity={0.7}
                  />
                  
                  {/* TiArrowSortedDown icon - above card top */}
                  <foreignObject
                    x={arrowPos.x - 12}
                    y={arrowPos.y - 12}
                    width={24}
                    height={24}
                  >
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: f.stroke,
                        fontSize: '24px',
                        opacity: 0.9,
                      }}
                    >
                      <TiArrowSortedDown />
                    </div>
                  </foreignObject>
                </>
              )}
            </svg>

            {/* Card */}
            {cardPos && f && (
              <div
                ref={cardRef}
                className="absolute pointer-events-none"
                style={{
                  left: cardPos.left,
                  top: cardPos.top,
                  width: 360,
                  animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                  zIndex: 10,
                }}
              >
                <div
                  className="rounded-xl p-5 shadow-lg relative"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `2px solid ${f.stroke}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        background: f.fill,
                        border: `2px solid ${f.stroke}`,
                      }}
                    />
                    <span
                      className="text-base font-semibold leading-tight flex-1"
                      style={{ color: colors.text }}
                    >
                      {f.title}
                    </span>
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full ml-auto flex-shrink-0 font-medium"
                      style={{ background: f.tagBg, color: f.tagColor }}
                    >
                      {f.tag}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 mb-3">
                    <f.icon
                      size={16}
                      style={{ color: f.stroke, marginTop: 2, flexShrink: 0 }}
                    />
                    <p
                      className="text-sm leading-relaxed min-h-[48px]"
                      style={{ color: colors.textSecondary }}
                    >
                      {typedText}
                      {isTyping && (
                        <span
                          className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                          style={{
                            background: colors.textMuted,
                            animation: "blink 0.7s step-end infinite",
                          }}
                        />
                      )}
                    </p>
                  </div>

                  <div className="h-1 w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.cardBgLight }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-75"
                      style={{
                        width: `${progress}%`,
                        background: f.bar,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92) translateX(20px); }
          to   { opacity: 1; transform: scale(1) translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}