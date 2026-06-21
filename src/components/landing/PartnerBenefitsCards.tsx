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
  { id: 1, icon: Handshake, title: "Strategic Collaboration", desc: "Work with us to shape the future of education.", color: "#E8CA5E" },
  { id: 2, icon: TrendingUp, title: "Growth Opportunities", desc: "Access to a growing network of institutions.", color: "#00E0FF" },
  { id: 3, icon: Shield, title: "Priority Support", desc: "Dedicated support team for all your needs.", color: "#1F4381" },
  { id: 4, icon: Zap, title: "Early Access", desc: "Get early access to new features and products.", color: "#E8CA5E" },
  { id: 5, icon: BarChart3, title: "Analytics Dashboard", desc: "Comprehensive insights into your performance.", color: "#00E0FF" },
  { id: 6, icon: Globe, title: "Global Reach", desc: "Connect with institutions across the globe.", color: "#1F4381" },
];

const CARD_W = 155;
const CARD_H = 175;
const AREA_H = 380; // Increased height for more spacing
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
  // LEFT TO RIGHT FLOW - Enter from left, exit from right
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
}

export function PartnerBenefitsCards({ benefits, theme, isInView }: PartnerBenefitsCardsProps) {
  const BENEFITS = benefits || DEFAULT_BENEFITS;
  const areaRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<CardPosition[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get visible benefits based on device
  const getVisibleBenefits = useCallback(() => {
    if (isMobile) {
      // Show only first 3 benefits on mobile
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

  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#F5F5F5';
  const getCardBg = () => theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)';
  const getBorderColor = () => theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(0, 0, 0, 0.06)';
  const getTextColor = () => theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const getTextMuted = () => theme === 'dark' ? '#9CA3AF' : '#6B7280';
  
  // Adjust card size for mobile - SMALLER
  const getCardDimensions = () => {
    if (isMobile) {
      return { width: 110, height: 130 };
    }
    return { width: CARD_W, height: CARD_H };
  };

  const { width: cardW, height: cardH } = getCardDimensions();
  const LAST_CARD_LEFT_OFFSET = isMobile ? 5 : 20;

  // Custom position adjustments for mobile to avoid overlap
  const getCustomPosition = (index: number, originalX: number, originalY: number) => {
    if (!isMobile) return { x: originalX, y: originalY };
    
    // Adjust these values to control spacing
    const firstCardLeftGap = 20;      // Left gap for first card
    const firstCardTopGap = 15;       // Top gap for first card
    
    const secondCardLeftGap = 20;    // More left gap for second card (negative = move left)
    const secondCardTopGap = 0;       // Top gap for second card
    
    const thirdCardLeftGap = 20;      // Left gap for third card
    const thirdCardTopGap = 20;      // Top gap for third card (negative = move up)
    
    let adjustedX = originalX;
    let adjustedY = originalY;
    
    // First card (index 0): Add left and top gap
    if (index === 0) {
      adjustedX = originalX + firstCardLeftGap;
      adjustedY = originalY + firstCardTopGap;
    }
    
    // Second card (index 1): Move more to the left
    if (index === 1) {
      adjustedX = originalX + secondCardLeftGap;
      adjustedY = originalY + secondCardTopGap;
    }
    
    // Third card (index 2): Add top gap and left gap
    if (index === 2 && visibleBenefits.length > 2) {
      adjustedX = originalX + thirdCardLeftGap;
      adjustedY = originalY + thirdCardTopGap;
    }
    
    return { x: adjustedX, y: adjustedY };
  };

  return (
    <section 
      className="w-full rounded-xl px-5 pt-6 pb-10 relative overflow-visible"
      style={{ backgroundColor: getBgColor() }}
    >
      {/* Arc area */}
      <div
        ref={areaRef}
        className="relative w-full"
        style={{ height: AREA_H }}
      >
        {positions.length > 0 &&
          positions.map((pos, i) => {
            const benefit = visibleBenefits[i];
            if (!benefit) return null; // guard against race conditions where visibleBenefits grew
            const customPos = getCustomPosition(i, pos.x, pos.y);
            const delay = 0.1 + (i * 0.08);

            return (
              <div
                key={benefit.id}
                className="absolute group cursor-pointer rounded-xl text-center transition-all duration-500 hover:scale-105 hover:shadow-xl"
                style={{
                  left: customPos.x + (i === visibleBenefits.length - 1 ? LAST_CARD_LEFT_OFFSET : 0),
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
                }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                  style={{
                    background: `radial-gradient(circle at center, ${benefit.color}20, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                  {/* Title */}
                  <p className="font-bold leading-tight mb-1 font-sans tracking-wide text-center"
                    style={{ 
                      color: getTextColor(),
                      fontSize: isMobile ? '9px' : '14px',
                    }}
                  >
                    {benefit.title}
                  </p>

                  {/* Description */}
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

      {/* Mobile indicator dots */}
      {isMobile && visibleBenefits.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {visibleBenefits.map((_, idx) => (
            <div
              key={idx}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: idx === 0 ? '16px' : '5px',
                background: idx === 0 ? '#E8CA5E' : (theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}