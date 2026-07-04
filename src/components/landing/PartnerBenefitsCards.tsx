"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  Handshake, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Globe,
  LucideIcon
} from 'lucide-react';

interface Benefit {
  id?: number;
  icon: LucideIcon;
  title: string;
  desc?: string;
  description?: string;
  color: string;
  details?: string[];
}

const DEFAULT_BENEFITS: Benefit[] = [
  { id: 1, icon: Handshake, title: "Strategic Collaboration", desc: "Work with us to shape the future of education.", color: "#2563EB" },
  { id: 2, icon: TrendingUp, title: "Growth Opportunities", desc: "Access to a growing network of institutions.", color: "#F59E0B" },
  { id: 3, icon: Shield, title: "Priority Support", desc: "Dedicated support team for all your needs.", color: "#2563EB" },
  { id: 4, icon: Zap, title: "Early Access", desc: "Get early access to new features and products.", color: "#F59E0B" },
  { id: 5, icon: BarChart3, title: "Analytics Dashboard", desc: "Comprehensive insights into your performance.", color: "#2563EB" },
  { id: 6, icon: Globe, title: "Global Reach", desc: "Connect with institutions across the globe.", color: "#F59E0B" },
];

const CARD_W = 155;
const CARD_H = 175;
const AREA_H = 380;
const SAMPLES = 1000;
const EDGE_PADDING = 0.08;

interface Point {
  x: number;
  y: number;
}

interface CardPosition {
  x: number;
  y: number;
}

function getBezierPoint(t: number, W: number, H: number): Point {
  const p0: Point = { x: W * (0.02 + EDGE_PADDING), y: H * 0.08 };
  const p1: Point = { x: W * 0.35, y: H * 0.60 };
  const p2: Point = { x: W * 0.65, y: H * 0.60 };
  const p3: Point = { x: W * (0.98 - EDGE_PADDING), y: H * 0.08 };
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

function computeCardPositions(W: number, H: number, n: number): CardPosition[] {
  const pts: Point[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    pts.push(getBezierPoint(i / SAMPLES, W, H));
  }

  const cumLen: number[] = [0];
  for (let i = 1; i <= SAMPLES; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    cumLen.push(cumLen[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const totalLen = cumLen[SAMPLES];

  function tAtLength(target: number): number {
    for (let i = 1; i <= SAMPLES; i++) {
      if (cumLen[i] >= target) {
        const frac = (target - cumLen[i - 1]) / (cumLen[i] - cumLen[i - 1]);
        return (i - 1 + frac) / SAMPLES;
      }
    }
    return 1;
  }

  return Array.from({ length: n }, (_, i) => {
    const t = tAtLength((i / (n - 1)) * totalLen);
    const pos = getBezierPoint(t, W, H);
    return { x: pos.x - CARD_W / 2, y: pos.y - CARD_H / 2 };
  });
}

interface PartnerBenefitsCardsProps {
  benefits?: Benefit[];
  theme: 'light' | 'dark';
  isInView: boolean;
  activeColor?: string;
  shadowColor?: string;
}

export function PartnerBenefitsCards({ 
  benefits, 
  theme, 
  isInView,
  activeColor = '#0066FF', // Brand Blue
  shadowColor = 'rgba(0, 102, 255, 0.15)'
}: PartnerBenefitsCardsProps) {
  const BENEFITS = benefits || DEFAULT_BENEFITS;
  const areaRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<CardPosition[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getVisibleBenefits = useCallback(() => {
    if (isMobile) {
      return BENEFITS.slice(0, 3);
    }
    return BENEFITS;
  }, [isMobile, BENEFITS]);

  const visibleBenefits = getVisibleBenefits();

  const recalculate = useCallback(() => {
    if (!areaRef.current) return;
    const W = areaRef.current.offsetWidth;
    setPositions(computeCardPositions(W, AREA_H, visibleBenefits.length));
  }, [visibleBenefits.length]);

  useEffect(() => {
    recalculate();
    window.addEventListener("resize", recalculate);
    return () => window.removeEventListener("resize", recalculate);
  }, [recalculate]);

  // ===== THEME COLORS =====

  // 1️⃣ Light Theme - Depth & Contrast with gradients
  const getBgColor = () => {
    if (theme === 'dark') return '#0B0F19';
    return 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)';
  };

  // 2️⃣ Card Background - Clean white with subtle gradient
  const getCardBg = () => {
    if (theme === 'dark') return 'rgba(15, 23, 42, 0.85)';
    return 'rgba(255, 255, 255, 0.95)';
  };

  // 3️⃣ Card Border - Subtle & refined
  const getBorderColor = () => {
    if (theme === 'dark') return 'rgba(30, 41, 59, 0.4)';
    return 'rgba(0, 0, 0, 0.06)';
  };

  // 4️⃣ Card Shadow - Layered shadows for depth
  const getCardShadow = () => {
    if (theme === 'dark') {
      return '0 4px 24px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)';
    }
    return '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(37, 99, 235, 0.06), 0 2px 8px rgba(0,0,0,0.04)';
  };

  // 5️⃣ Card Hover Shadow - Premium hover effect
  const getCardHoverShadow = () => {
    if (theme === 'dark') {
      return '0 8px 40px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)';
    }
    return '0 8px 40px rgba(37, 99, 235, 0.10), 0 4px 16px rgba(0,0,0,0.06)';
  };

  // 6️⃣ Text Colors - Better contrast
  const getTextColor = () => {
    if (theme === 'dark') return '#F1F5F9';
    return '#0F172A';
  };

  const getTextMuted = () => {
    if (theme === 'dark') return '#94A3B8';
    return '#475569';
  };

  // ✅ 7️⃣ Icon Color - Uses activeColor for both modes
  const getIconColor = () => {
    // In dark mode, use a slightly lighter version for better visibility
    if (theme === 'dark') {
      // If activeColor is a hex, make it lighter
      return activeColor;
    }
    return activeColor;
  };

  // ✅ 8️⃣ Icon Background - Subtle glow
  const getIconBg = () => {
    if (theme === 'dark') {
      return `${activeColor}15`;
    }
    return `${activeColor}08`;
  };

  // 9️⃣ Card Dimensions
  const getCardDimensions = () => {
    if (isMobile) {
      return { width: 110, height: 130 };
    }
    return { width: CARD_W, height: CARD_H };
  };

  const { width: cardW, height: cardH } = getCardDimensions();

  const getCustomPosition = (index: number, originalX: number, originalY: number) => {
    if (!isMobile) {
      if (index === 0) {
        return { 
          x: originalX - 20,   
          y: originalY + 30    
        };
      }
      
      if (index === visibleBenefits.length - 1) {
        return {
          x: originalX + (1.3 * 16), 
          y: originalY + (2 * 16),   
        };
      }
      return { x: originalX, y: originalY };
    }
    
    const firstCardLeftGap = 20;
    const firstCardTopGap = 15;
    const secondCardLeftGap = 20;
    const secondCardTopGap = 0;
    const thirdCardLeftGap = 20;
    const thirdCardTopGap = 20;
    
    let adjustedX = originalX;
    let adjustedY = originalY;
    
    if (index === 0) {
      adjustedX = originalX + firstCardLeftGap - 10 - 16;
      adjustedY = originalY + firstCardTopGap - 8 + 16;
    }
    
    if (index === 1) {
      adjustedX = originalX + secondCardLeftGap;
      adjustedY = originalY + secondCardTopGap;
    }
    
    if (index === 2 && visibleBenefits.length > 2) {
      adjustedX = originalX + thirdCardLeftGap;
      adjustedY = originalY + thirdCardTopGap;
    }
    
    if (index === visibleBenefits.length - 1) {
      adjustedX += (0.3 * 16);
      adjustedY += (1 * 16);
    }
    
    return { x: adjustedX, y: adjustedY };
  };

  return (
    <section 
      className="w-full rounded-xl px-5 pt-6 pb-10 relative overflow-visible"
      style={{ 
        background: getBgColor(),
        boxShadow: theme === 'light' ? 'inset 0 1px 0 rgba(255,255,255,0.8)' : 'none'
      }}
    >
      <div
        ref={areaRef}
        className="relative w-full"
        style={{ height: AREA_H }}
      >
        {positions.length > 0 &&
          positions.map((pos, i) => {
            const benefit = visibleBenefits[i];
            if (!benefit) return null;
            const customPos = getCustomPosition(i, pos.x, pos.y);
            const delay = 0.1 + (i * 0.08);

            return (
              <div
                key={benefit.id || i}
                className="absolute group cursor-pointer rounded-2xl text-center transition-all duration-500 hover:-translate-y-1"
                style={{
                  left: customPos.x,
                  top: customPos.y,
                  width: cardW,
                  height: cardH,
                  zIndex: i + 1,
                  padding: isMobile ? "10px 8px" : "20px 14px",
                  backgroundColor: getCardBg(),
                  border: `1px solid ${getBorderColor()}`,
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? `scale(1)` : `scale(0.8) translateX(-60px)`,
                  transition: `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: getCardShadow(),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = getCardHoverShadow();
                  e.currentTarget.style.borderColor = theme === 'light' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = getCardShadow();
                  e.currentTarget.style.borderColor = getBorderColor();
                }}
              >
                {/* Subtle gradient glow - only on hover */}
                <div 
                  className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${activeColor}15, transparent 70%)`,
                    zIndex: 0,
                  }}
                />

                {/* ✅ Icon with active color - properly handled for both modes */}
                <div 
                  className="relative z-10 mb-1.5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    color: getIconColor(), // Uses activeColor
                  }}
                >
                  {benefit.icon && <benefit.icon size={isMobile ? 20 : 28} strokeWidth={1.8} />}
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                  <p className="font-bold leading-tight mb-1 font-sans tracking-wide text-center"
                    style={{ 
                      color: getTextColor(),
                      fontSize: isMobile ? '9px' : '14px',
                    }}
                  >
                    {benefit.title}
                  </p>

                  <p className="leading-relaxed font-light text-center"
                    style={{ 
                      color: getTextMuted(),
                      fontSize: isMobile ? '7px' : '10px',
                    }}
                  >
                    {benefit.description || benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* Mobile indicator dots - refined */}
      {isMobile && visibleBenefits.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {visibleBenefits.map((_, idx) => (
            <div
              key={idx}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: idx === 0 ? '16px' : '5px',
                background: idx === 0 ? activeColor : (theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'),
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}