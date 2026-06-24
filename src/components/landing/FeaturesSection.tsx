"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SegmentData {
  id: string;
  startDeg: number;
  endDeg: number;
  label: string[];
  centerDeg: number;
  title: string;
  description: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SEGMENTS: SegmentData[] = [
  {
    id: "01",
    startDeg: 238,
    endDeg: 302,
    label: ["MULTI", "PORTAL"],
    centerDeg: 270,
    title: "MULTI-PORTAL ARCHITECTURE",
    description:
      "Build and manage multiple portals from a single codebase with shared components. Scale seamlessly across brands, regions, and user types without duplicating your infrastructure.",
  },
  {
    id: "02",
    startDeg: 310,
    endDeg: 14,
    label: ["CENTRALIZ"],
    centerDeg: 342,
    title: "CENTRALIZED MANAGEMENT",
    description:
      "Control all your portals, users, and configurations from one unified dashboard. Streamline operations and reduce overhead with a single source of truth for your entire platform.",
  },
  {
    id: "03",
    startDeg: 22,
    endDeg: 86,
    label: ["ACCESS", "CONTROL"],
    centerDeg: 54,
    title: "ACCESS CONTROL",
    description:
      "Define granular roles and permissions for every user across all portals. Protect sensitive data with enterprise-grade authentication and fine-grained authorization policies.",
  },
  {
    id: "04",
    startDeg: 94,
    endDeg: 158,
    label: ["LIVE", "SYNC"],
    centerDeg: 126,
    title: "LIVE SYNC",
    description:
      "Real-time data synchronization across all portals and devices. Changes propagate instantly so every user always sees the most current information without manual refresh.",
  },
  {
    id: "05",
    startDeg: 166,
    endDeg: 230,
    label: ["PORTFOLIO"],
    centerDeg: 198,
    title: "PORTFOLIO",
    description:
      "Showcase and manage your complete portfolio of projects within one cohesive platform. Present clients with a polished, branded experience that highlights your best work.",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const CX = 340;
const CY = 340;
const GOLD = "#c8921e";
const BLUE = "#0066FF";
const FILL = "#0f1e38";
const FILL_HOVER = "#1a3060";
const INNER_FILL = "#07101e";
const BG = "#0B0F19";

// Light mode colors
const LIGHT_BG = "#FFFFFF";
const LIGHT_FILL = "#f0f4ff";
const LIGHT_FILL_HOVER = "#dce6ff";
const LIGHT_INNER_FILL = "#f8faff";
const LIGHT_DESC = "#6B7280";
const LIGHT_CARD_BG = "#FFFFFF";

// ─── MAIN WHEEL SIZES (INCREASED) ──────────────────────────────────────────
const OUTER_R = 320;        // Was 268
const STRIP_OUTER = 320;    // Was 268
const STRIP_INNER = 294;    // Was 246
const SEG_OUTER = 278;      // Was 234
const SEG_INNER = 130;      // Was 110
const INNER_CIRCLE_R = 116; // Was 98
const LABEL_R = 206;        // Was 172
const NUM_R = (STRIP_OUTER + STRIP_INNER) / 2;

// ─── POPUP PREVIEW SIZES (KEPT SAME) ──────────────────────────────────────
const POPUP_OUTER_R = 268;
const POPUP_STRIP_OUTER = 268;
const POPUP_STRIP_INNER = 246;
const POPUP_SEG_OUTER = 234;
const POPUP_SEG_INNER = 110;
const POPUP_INNER_CIRCLE_R = 98;
const POPUP_LABEL_R = 172;
const POPUP_NUM_R = (POPUP_STRIP_OUTER + POPUP_STRIP_INNER) / 2;

// ─── SVG Helpers ─────────────────────────────────────────────────────────────

const toRad = (deg: number) => (deg * Math.PI) / 180;

const polar = (r: number, deg: number, cx: number = CX, cy: number = CY) => ({
  x: cx + r * Math.cos(toRad(deg)),
  y: cy + r * Math.sin(toRad(deg)),
});

function arcPath(r: number, startDeg: number, endDeg: number, cx: number = CX, cy: number = CY): string {
  let end = endDeg;
  if (end < startDeg) end += 360;
  const large = end - startDeg > 180 ? 1 : 0;
  const s = polar(r, startDeg, cx, cy);
  const e = polar(r, endDeg, cx, cy);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function donutSegment(
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number,
  cx: number = CX,
  cy: number = CY
): string {
  let end = endDeg;
  if (end < startDeg) end += 360;
  const large = end - startDeg > 180 ? 1 : 0;
  const os = polar(outerR, startDeg, cx, cy);
  const oe = polar(outerR, endDeg, cx, cy);
  const ie = polar(innerR, endDeg, cx, cy);
  const is_ = polar(innerR, startDeg, cx, cy);
  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${is_.x} ${is_.y}`,
    "Z",
  ].join(" ");
}

// ─── Typewriter Hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 20) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const tick = () => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        timerRef.current = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };
    timerRef.current = setTimeout(tick, speed);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed]);

  return { displayed, done };
}

// ─── Segment Preview (popup left side - KEPT SAME SIZE) ───────────────────

function SegmentPreview({ seg, theme }: { seg: SegmentData; theme: 'light' | 'dark' }) {
  const START = 238;
  const END = 302;
  const CENTER = 270;

  // Using POPUP_* constants for preview
  const stripPath = donutSegment(POPUP_STRIP_OUTER, POPUP_STRIP_INNER, START, END);
  const mainPath = donutSegment(POPUP_SEG_OUTER, POPUP_SEG_INNER, START, END);

  const VB_X = 165;
  const VB_Y = 68;
  const VB_W = 350;
  const VB_H = 282;

  const numPos = polar(POPUP_NUM_R, CENTER);
  const lblPos = polar(POPUP_LABEL_R, CENTER);

  const fillColor = theme === 'dark' ? FILL : LIGHT_FILL;
  const innerFill = theme === 'dark' ? INNER_FILL : LIGHT_INNER_FILL;
  const textColor = theme === 'dark' ? GOLD : BLUE;

  return (
    <svg
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Strip */}
      <path d={stripPath} fill={innerFill} stroke={textColor} strokeWidth="2" />
      {/* Main segment */}
      <path d={mainPath} fill={fillColor} stroke={textColor} strokeWidth="2" />

      {/* Number */}
      <text
        x={numPos.x}
        y={numPos.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="2"
      >
        {seg.id}
      </text>

      {/* Labels */}
      {seg.label.map((line, i) => (
        <text
          key={i}
          x={lblPos.x}
          y={lblPos.y + (i - (seg.label.length - 1) / 2) * 24}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="3"
        >
          {line}
        </text>
      ))}
    </svg>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────

function InfoCard({ seg, theme }: { seg: SegmentData; theme: 'light' | 'dark' }) {
  const { displayed, done } = useTypewriter(seg.description, 18);

  const cardBg = theme === 'dark' ? '#0F172A' : LIGHT_CARD_BG;
  const borderColor = theme === 'dark' ? GOLD : BLUE;
  const titleColor = theme === 'dark' ? GOLD : BLUE;
  const descColor = theme === 'dark' ? '#D1D5DB' : LIGHT_DESC;
  const dotColor = theme === 'dark' ? GOLD : BLUE;

  return (
    <div
      className="flex flex-col h-full p-6 rounded"
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: cardBg,
        minHeight: 220,
      }}
    >
      {/* Title */}
      <div className="flex items-start gap-3 mb-5">
        <span
          className="shrink-0 mt-1 rounded-full"
          style={{ width: 12, height: 12, backgroundColor: dotColor }}
        />
        <p
          style={{
            color: titleColor,
            fontFamily: "Arial, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1,
            lineHeight: 1.4,
          }}
        >
          {seg.title}
        </p>
      </div>

      {/* Description — typewriter */}
      <div className="flex items-start gap-3 mb-6 flex-1">
        <span
          className="shrink-0 mt-1 rounded-full"
          style={{ width: 10, height: 10, backgroundColor: dotColor }}
        />
        <p
          style={{
            color: descColor,
            fontFamily: "Arial, sans-serif",
            fontSize: 13,
            lineHeight: 1.7,
            minHeight: 64,
          }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block align-middle ml-0.5 animate-pulse"
              style={{
                width: 2,
                height: 14,
                backgroundColor: dotColor,
                display: "inline-block",
              }}
            />
          )}
        </p>
      </div>

      {/* Bottom line */}
      <div style={{ height: 1.5, width: "72%", backgroundColor: dotColor }} />
    </div>
  );
}

// ─── Popup ────────────────────────────────────────────────────────────────────

function FeaturePopup({
  seg,
  onClose,
  theme,
}: {
  seg: SegmentData;
  onClose: () => void;
  theme: 'light' | 'dark';
}) {
  const bgColor = theme === 'dark' ? BG : LIGHT_BG;
  const overlayColor = theme === 'dark' ? 'rgba(5,9,20,0.88)' : 'rgba(200,200,200,0.7)';
  const borderColor = theme === 'dark' ? GOLD : BLUE;
  const closeColor = theme === 'dark' ? GOLD : BLUE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: overlayColor }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded"
        style={{ border: `1px solid ${borderColor}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded p-6" style={{ backgroundColor: bgColor }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute sm:mt-3 sm:mr-3 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
            style={{
              width: 34,
              height: 34,
              top: '12px',
              right: '12px',
              color: closeColor,
              border: `1.5px solid ${closeColor}`,
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
              backgroundColor: "transparent",
              zIndex: 10,
            }}
          >
            ×
          </button>

          <div className="flex flex-col md:flex-row items-stretch gap-6">
            {/* LEFT — segment preview (KEPT SAME SIZE) */}
            <div
              className="shrink-0 flex items-center justify-center"
              style={{ width: 260, minHeight: 220 }}
            >
              <SegmentPreview seg={seg} theme={theme} />
            </div>

            {/* RIGHT — info card */}
            <div className="flex-1">
              <InfoCard key={seg.id} seg={seg} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wheel SVG ────────────────────────────────────────────────────────────────

function WheelSVG({
  activeId,
  onHover,
  onClick,
  theme,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
  onClick: (seg: SegmentData) => void;
  theme: 'light' | 'dark';
}) {
  const fillColor = theme === 'dark' ? FILL : LIGHT_FILL;
  const fillHover = theme === 'dark' ? FILL_HOVER : LIGHT_FILL_HOVER;
  const innerFill = theme === 'dark' ? INNER_FILL : LIGHT_INNER_FILL;
  const textColor = theme === 'dark' ? GOLD : BLUE;

  return (
    <svg
      width="100%"
      viewBox="0 0 680 680"
      xmlns="http://www.w3.org/2000/svg"
    >
      {SEGMENTS.map((seg) => {
        const isActive = activeId === seg.id;
        const numPos = polar(NUM_R, seg.centerDeg);
        const lblPos = polar(LABEL_R, seg.centerDeg);
        const segFill = isActive ? fillHover : fillColor;

        // ─── DIRECTION-AWARE LIFT ──────────────────────────────
        const angleRad = toRad(seg.centerDeg);
        const liftX = 8 * Math.cos(angleRad);
        const liftY = 8 * Math.sin(angleRad);

        return (
          <g
            key={seg.id}
            onMouseEnter={() => onHover(seg.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(seg)}
            style={{ 
              cursor: "pointer",
              transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transform: isActive 
                ? `translate(${liftX}px, ${liftY}px)` 
                : "translate(0px, 0px)",
            }}
          >
            {/* Outer arc */}
            <path
              d={arcPath(OUTER_R, seg.startDeg, seg.endDeg)}
              fill="none"
              stroke={textColor}
              strokeWidth={isActive ? 2 : 1.3}
            />

            {/* Number strip */}
            <path
              d={donutSegment(STRIP_OUTER, STRIP_INNER, seg.startDeg, seg.endDeg)}
              fill={segFill}
              stroke={textColor}
              strokeWidth="1.0"
              style={{ transition: "fill 0.2s" }}
            />
            <path
              d={arcPath(STRIP_INNER, seg.startDeg, seg.endDeg)}
              fill="none"
              stroke={textColor}
              strokeWidth="1.0"
            />

            {/* Main segment */}
            <path
              d={donutSegment(SEG_OUTER, SEG_INNER, seg.startDeg, seg.endDeg)}
              fill={segFill}
              stroke={textColor}
              strokeWidth="1.1"
              style={{ transition: "fill 0.2s" }}
            />
            <path
              d={arcPath(SEG_OUTER, seg.startDeg, seg.endDeg)}
              fill="none"
              stroke={textColor}
              strokeWidth="1.0"
            />
            <path
              d={arcPath(SEG_INNER, seg.startDeg, seg.endDeg)}
              fill="none"
              stroke={textColor}
              strokeWidth="1.0"
            />

            {/* Number */}
            <text
              x={numPos.x}
              y={numPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={textColor}
              fontFamily="Arial, sans-serif"
              fontSize="12"
              fontWeight="600"
              letterSpacing="1"
            >
              {seg.id}
            </text>

            {/* Labels */}
            {seg.label.map((line, i) => (
              <text
                key={i}
                x={lblPos.x}
                y={lblPos.y + (i - (seg.label.length - 1) / 2) * 19}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontFamily="Arial, sans-serif"
                fontSize="13"
                fontWeight="700"
                letterSpacing="2"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}

      {/* Inner circle */}
      <circle
        cx={CX}
        cy={CY}
        r={INNER_CIRCLE_R}
        fill={innerFill}
        stroke={textColor}
        strokeWidth="1.3"
      />
    </svg>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function FeaturesSection() {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [activeSeg, setActiveSeg] = useState<SegmentData | null>(null);
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

  const handleClick = useCallback((seg: SegmentData) => {
    setActiveSeg(seg);
  }, []);

  const handleClose = useCallback(() => {
    setActiveSeg(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // Get colors based on theme
  const bgColor = theme === 'dark' ? BG : LIGHT_BG;
  const headingColor1 = theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const headingColor2 = theme === 'dark' ? GOLD : BLUE;
  const subColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const lineColor = theme === 'dark' ? GOLD : BLUE;

  return (
    <section
      className="flex flex-col items-center justify-center w-full min-h-screen py-12"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── Heading ── */}
      <div className="mb-10 text-center px-4">
        <h2
          className="text-3xl sm:text-4xl md:text-4xl font-bold font-serif tracking-tight"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <span
            className="relative inline-block"
            style={{ 
              color: headingColor1,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Comprehensive
          </span>{' '}
          <span
            className="inline-block"
            style={{ 
              color: headingColor2,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            System Features
          </span>
        </h2>
        <p
          className="mt-2 text-sm tracking-wide"
          style={{
            color: subColor,
            fontFamily: "'Calibri Light', sans-serif",
            letterSpacing: 1,
          }}
        >
          Explore our powerful platform capabilities
        </p>
        <div
          className="mx-auto mt-3"
          style={{ height: 1.5, width: 160, backgroundColor: lineColor, opacity: 0.6 }}
        />
      </div>

      {/* ── Wheel ── */}
      <div className="w-full max-w-xl px-4">
        <WheelSVG
          activeId={hoverId}
          onHover={setHoverId}
          onClick={handleClick}
          theme={theme}
        />
      </div>

      {/* ── Popup ── */}
      {activeSeg && (
        <FeaturePopup seg={activeSeg} onClose={handleClose} theme={theme} />
      )}
    </section>
  );
}