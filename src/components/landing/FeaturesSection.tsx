import { useEffect, useRef, useState, useCallback, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const NUM_SEGS = 5;
const BOTTOM_GAP = 2;
const SEG_SPAN = 360 / NUM_SEGS - BOTTOM_GAP;
const START_OFFSET = 270;

const SEG_META = [
  { id: "01", label: ["MULTI", "PORTAL"], title: "MULTI-PORTAL ARCHITECTURE", description: "Build and manage multiple portals from a single codebase with shared components. Scale seamlessly across brands, regions, and user types without duplicating your infrastructure." },
  { id: "02", label: ["CENTRALIZ"], title: "CENTRALIZED MANAGEMENT", description: "Control all your portals, users, and configurations from one unified dashboard. Streamline operations and reduce overhead with a single source of truth for your entire platform." },
  { id: "03", label: ["ACCESS", "CONTROL"], title: "ACCESS CONTROL", description: "Define granular roles and permissions for every user across all portals. Protect sensitive data with enterprise-grade authentication and fine-grained authorization policies." },
  { id: "04", label: ["LIVE", "SYNC"], title: "LIVE SYNC", description: "Real-time data synchronization across all portals and devices. Changes propagate instantly so every user always sees the most current information without manual refresh." },
  { id: "05", label: ["PORTFOLIO"], title: "PORTFOLIO", description: "Showcase and manage your complete portfolio of projects within one cohesive platform. Present clients with a polished, branded experience that highlights your best work." },
];

// ─── Calculate Segments ──────────────────────────────────────────────────

function calculateSegments() {
  const segments = [];
  const segAngle = 360 / NUM_SEGS;
  
  for (let i = 0; i < NUM_SEGS; i++) {
    const centerDeg = (START_OFFSET + i * segAngle) % 360;
    const halfSpan = SEG_SPAN / 2;
    const startDeg = (centerDeg - halfSpan + 360) % 360;
    const endDeg = (centerDeg + halfSpan) % 360;
    const finalEndDeg = (endDeg - BOTTOM_GAP + 360) % 360;
    
    segments.push({
      ...SEG_META[i],
      id: SEG_META[i].id,
      label: SEG_META[i].label,
      title: SEG_META[i].title,
      description: SEG_META[i].description,
      startDeg: startDeg,
      endDeg: finalEndDeg,
      centerDeg,
      index: i
    });
  }
  
  return segments.map(seg => {
    const vb = computeVB(seg.startDeg, seg.endDeg);
    return { ...seg, vb };
  });
}

function computeVB(startDeg: number, endDeg: number, outerR = 278, innerR = 130, cx = 340, cy = 340, pad = 10) {
  const toR = (d: number) => (d * Math.PI) / 180;
  let end = endDeg; if (end < startDeg) end += 360;
  const points: number[][] = [];
  for (let d = startDeg; d <= end; d += 2) {
    const a = toR(d);
    points.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
    points.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
  }
  for (let d = startDeg; d <= end; d += 2) {
    const a = toR(d);
    points.push([cx + 320 * Math.cos(a), cy + 320 * Math.sin(a)]);
    points.push([cx + 294 * Math.cos(a), cy + 294 * Math.sin(a)]);
  }
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;
  return `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`;
}

const SEGMENTS = calculateSegments();

// ─── Constants ────────────────────────────────────────────────────────────────

const CX = 340, CY = 340;
const GOLD = "#FFD700", BLUE = "#0066FF";
const FILL = "#0f1e38", FILL_HOVER = "#1a3060", INNER_FILL = "#07101e", BG = "#0B0F19";
const LIGHT_BG = "#FFFFFF", LIGHT_FILL = "#f0f4ff", LIGHT_FILL_HOVER = "#dce6ff";
const LIGHT_INNER_FILL = "#f8faff", LIGHT_DESC = "#6B7280";

const OUTER_R = 320, STRIP_OUTER = 320, STRIP_INNER = 294;
const SEG_OUTER = 278, SEG_INNER = 130, INNER_CIRCLE_R = 116;
const LABEL_R = 206, NUM_R = (STRIP_OUTER + STRIP_INNER) / 2;

// ─── SVG Helpers ─────────────────────────────────────────────────────────────

const toRad = (deg: number) => (deg * Math.PI) / 180;
const polar = (r: number, deg: number, cx = CX, cy = CY) => ({
  x: cx + r * Math.cos(toRad(deg)),
  y: cy + r * Math.sin(toRad(deg)),
});

function arcPath(r: number, startDeg: number, endDeg: number, cx = CX, cy = CY) {
  let end = endDeg; if (end < startDeg) end += 360;
  const large = end - startDeg > 180 ? 1 : 0;
  const s = polar(r, startDeg, cx, cy), e = polar(r, endDeg, cx, cy);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function donutSegment(outerR: number, innerR: number, startDeg: number, endDeg: number, cx = CX, cy = CY) {
  let end = endDeg; if (end < startDeg) end += 360;
  const large = end - startDeg > 180 ? 1 : 0;
  const os = polar(outerR, startDeg, cx, cy), oe = polar(outerR, endDeg, cx, cy);
  const ie = polar(innerR, endDeg, cx, cy), is_ = polar(innerR, startDeg, cx, cy);
  return [`M ${os.x} ${os.y}`, `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`, `A ${innerR} ${innerR} 0 ${large} 0 ${is_.x} ${is_.y}`, "Z"].join(" ");
}

// ─── Easing ──────────────────────────────────────────────────────────────────

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ─── Typewriter Hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 16, delay = 500) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    timerRef.current = setTimeout(() => {
      const tick = () => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i < text.length) timerRef.current = setTimeout(tick, speed);
        else setDone(true);
      };
      timerRef.current = setTimeout(tick, speed);
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, speed, delay]);

  return { displayed, done };
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface Segment {
  id: string;
  label: string[];
  title: string;
  description: string;
  startDeg: number;
  endDeg: number;
  centerDeg: number;
  index: number;
  vb: string;
}

interface SegmentPathsProps {
  seg: Segment;
  fillColor: string;
  innerFillColor: string;
  textColor: string;
  strokeWidth?: number;
}

interface WheelSVGProps {
  hiddenId: string | null;
  onClick: (seg: Segment) => void;
  theme: string;
  segmentRefs: React.MutableRefObject<{ [key: string]: SVGGElement | null }>;
}

interface FlyingSegmentSVGProps {
  seg: Segment;
  theme: string;
  animStyle: React.CSSProperties;
  isVisible: boolean;
}

interface InfoPanelProps {
  seg: Segment;
  visible: boolean;
  theme: string;
}

interface FeatureDetailProps {
  seg: Segment;
  wheelRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  theme: string;
  segmentRefs: React.MutableRefObject<{ [key: string]: SVGGElement | null }>;
}

// ─── Segment Paths ─────────────────────────────────────────────────────────

function SegmentPaths({ seg, fillColor, innerFillColor, textColor, strokeWidth = 2 }: SegmentPathsProps) {
  const numPos = polar(NUM_R, seg.centerDeg);
  const lblPos = polar(LABEL_R, seg.centerDeg);

  return (
    <>
      <path 
        d={arcPath(OUTER_R, seg.startDeg, seg.endDeg)} 
        fill="none" 
        stroke={textColor} 
        strokeWidth={strokeWidth}
      />
      <path 
        d={donutSegment(STRIP_OUTER, STRIP_INNER, seg.startDeg, seg.endDeg)} 
        fill={innerFillColor} 
        stroke={textColor} 
        strokeWidth={strokeWidth}
      />
      <path 
        d={arcPath(STRIP_INNER, seg.startDeg, seg.endDeg)} 
        fill="none" 
        stroke={textColor} 
        strokeWidth={strokeWidth}
      />
      <path 
        d={donutSegment(SEG_OUTER, SEG_INNER, seg.startDeg, seg.endDeg)} 
        fill={fillColor} 
        stroke={textColor} 
        strokeWidth={strokeWidth}
      />
      <path 
        d={arcPath(SEG_OUTER, seg.startDeg, seg.endDeg)} 
        fill="none" 
        stroke={textColor} 
        strokeWidth={strokeWidth}
      />
      <path 
        d={arcPath(SEG_INNER, seg.startDeg, seg.endDeg)} 
        fill="none" 
        stroke={textColor} 
        strokeWidth={strokeWidth}
      />
      <text 
        x={numPos.x} y={numPos.y} 
        textAnchor="middle" dominantBaseline="central"
        fill={textColor} 
        fontFamily="Arial,sans-serif" 
        fontSize="13" 
        fontWeight="700" 
        letterSpacing="1.5"
      >
        {seg.id}
      </text>
      {seg.label.map((line: string, i: number) => (
        <text 
          key={i} 
          x={lblPos.x} y={lblPos.y + (i - (seg.label.length - 1) / 2) * 21}
          textAnchor="middle" dominantBaseline="central"
          fill={textColor} 
          fontFamily="Arial,sans-serif" 
          fontSize="14" 
          fontWeight="700" 
          letterSpacing="2.5"
        >
          {line}
        </text>
      ))}
    </>
  );
}

// ─── Wheel SVG ────────────────────────────────────────────────────────────────

function WheelSVG({ hiddenId, onClick, theme, segmentRefs }: WheelSVGProps) {
  const fillColor = theme === "dark" ? FILL : LIGHT_FILL;
  const innerFill = theme === "dark" ? INNER_FILL : LIGHT_INNER_FILL;
  const textColor = theme === "dark" ? GOLD : BLUE;
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <svg width="100%" viewBox="0 0 680 680" xmlns="http://www.w3.org/2000/svg">
      {SEGMENTS.map((seg) => {
        const isHidden = hiddenId === seg.id;
        const isHovered = hoveredId === seg.id && !hiddenId;
        const hoverFill = isHovered 
          ? (theme === "dark" ? FILL_HOVER : LIGHT_FILL_HOVER) 
          : fillColor;
        
        return (
          <g 
            key={seg.id}
            ref={el => {
              if (el) {
                segmentRefs.current[seg.id] = el;
              }
            }}
            onClick={() => !hiddenId && onClick(seg)}
            onMouseEnter={() => !hiddenId && setHoveredId(seg.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              cursor: hiddenId ? "default" : "pointer",
              opacity: isHidden ? 0 : 1,
              pointerEvents: isHidden ? "none" : "auto",
              transform: isHovered ? "scale(1.015)" : "scale(1)",
              transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transformOrigin: `${CX}px ${CY}px`,
              willChange: "transform",
            }}
          >
            <SegmentPaths
              seg={seg}
              fillColor={hoverFill}
              innerFillColor={innerFill}
              textColor={textColor}
              strokeWidth={isHovered ? 2.1 : 2}
            />
          </g>
        );
      })}
      
      <circle 
        cx={CX} cy={CY} r={INNER_CIRCLE_R}
        fill={theme === "dark" ? INNER_FILL : LIGHT_INNER_FILL}
        stroke={textColor} 
        strokeWidth="2" 
      />
      <text 
        x={CX} y={CY} 
        textAnchor="middle" dominantBaseline="central"
        fill={textColor} 
        fontFamily="Arial,sans-serif" 
        fontSize="22" 
        fontWeight="700" 
        letterSpacing="3"
      >
        Neezamiya
      </text>
    </svg>
  );
}

// ─── Flying Segment ───────────────────────────────────────────────────────────

function FlyingSegmentSVG({ seg, theme, animStyle, isVisible }: FlyingSegmentSVGProps) {
  const fillColor = theme === "dark" ? FILL_HOVER : LIGHT_FILL_HOVER;
  const innerFill = theme === "dark" ? INNER_FILL : LIGHT_INNER_FILL;
  const textColor = theme === "dark" ? GOLD : BLUE;
  const glowColor = theme === "dark" ? "rgba(255,215,0,0.22)" : "rgba(0,102,255,0.18)";

  if (!isVisible) return null;

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0,
      width: 300, height: 300,
      filter: `drop-shadow(0 16px 40px ${glowColor}) drop-shadow(0 4px 12px ${glowColor})`,
      willChange: "transform",
      transformOrigin: "150px 150px",
      ...animStyle,
    }}>
      <svg width="300" height="300" viewBox={seg.vb} xmlns="http://www.w3.org/2000/svg">
        <SegmentPaths
          seg={seg}
          fillColor={fillColor}
          innerFillColor={innerFill}
          textColor={textColor}
          strokeWidth={2.5}
        />
      </svg>
    </div>
  );
}

// ─── Info Panel ───────────────────────────────────────────────────────────────

function InfoPanel({ seg, visible, theme }: InfoPanelProps) {
  const { displayed, done } = useTypewriter(seg.description, 16, 500);
  const titleColor = theme === "dark" ? GOLD : BLUE;
  const descColor = theme === "dark" ? "#D1D5DB" : LIGHT_DESC;
  const dotColor = theme === "dark" ? GOLD : BLUE;

  return (
    <div style={{ 
      opacity: visible ? 1 : 0, 
      transition: "opacity 0.6s ease", 
      maxWidth: 360,
      transform: visible ? "translateY(0)" : "translateY(10px)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 18 }}>
        <span style={{ flexShrink: 0, marginTop: 5, width: 10, height: 10,
          borderRadius: "50%", backgroundColor: dotColor }} />
        <p style={{ color: titleColor, fontFamily: "Arial,sans-serif", fontSize: 15,
          fontWeight: 700, letterSpacing: 1, lineHeight: 1.45, margin: 0 }}>
          {seg.title}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{ flexShrink: 0, marginTop: 7, width: 7, height: 7,
          borderRadius: "50%", backgroundColor: dotColor, opacity: 0.55 }} />
        <p style={{ color: descColor, fontFamily: "Arial,sans-serif", fontSize: 13.5,
          lineHeight: 1.78, margin: 0, minHeight: 80 }}>
          {displayed}
          {!done && (
            <span style={{ display: "inline-block", width: 2, height: 13,
              backgroundColor: dotColor, marginLeft: 2, verticalAlign: "middle",
              animation: "tw-blink 0.75s step-end infinite" }} />
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Feature Detail ───────────────────────────────────────────────────────────

function FeatureDetail({ seg, wheelRef, onClose, theme, segmentRefs }: FeatureDetailProps) {
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({ 
    transform: "translate(0px, 0px) scale(1)",
  });
  const [showInfo, setShowInfo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const originalPosRef = useRef<{ startX: number; startY: number; startScale: number } | null>(null);

  const overlayBg = theme === "dark" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)";

  // Get the segment's original position on the wheel
  const getSegmentOriginalPosition = useCallback(() => {
    const wheelEl = wheelRef?.current;
    const overlayEl = overlayRef?.current;
    if (!wheelEl || !overlayEl) return null;

    const wheelRect = wheelEl.getBoundingClientRect();
    const overlayRect = overlayEl.getBoundingClientRect();
    
    const midR = (SEG_OUTER + SEG_INNER) / 2;
    const svgScale = wheelRect.width / 680;
    const angleRad = toRad(seg.centerDeg);

    const segCenterX = wheelRect.left + (CX + midR * Math.cos(angleRad)) * svgScale;
    const segCenterY = wheelRect.top + (CY + midR * Math.sin(angleRad)) * svgScale;

    const startX = segCenterX - overlayRect.left - 150;
    const startY = segCenterY - overlayRect.top - 150;

    // Calculate exact scale based on actual sizes
    const segWidth = (SEG_OUTER - SEG_INNER) * svgScale;
    const flyingWidth = 300;
    const startScale = segWidth / flyingWidth;

    return { 
      startX, 
      startY, 
      startScale,
    };
  }, [seg, wheelRef]);

  // Animate segment from wheel to center
  useEffect(() => {
    let cancelled = false;

    const coords = getSegmentOriginalPosition();
    if (!coords) return;
    originalPosRef.current = coords;

    const { startX, startY, startScale } = coords;
    
    const overlayRect = overlayRef.current?.getBoundingClientRect();
    if (!overlayRect) return;

    const endX = overlayRect.width * 0.05;
    const endY = overlayRect.height * 0.5 - 150;

    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const liftH = Math.min(dist * 0.08, 40);
    const DURATION = 1600;

    startRef.current = null;
    setIsAnimating(true);

    // Start exactly from original position with correct scale
    setAnimStyle({
      transform: `translate(${startX}px, ${startY}px) scale(${startScale})`,
    });

    const animate = (ts: number) => {
      if (cancelled) return;
      if (startRef.current === null) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DURATION, 1);
      const t = easeInOutQuad(raw);

      const cx = startX + dx * t;
      const cy = startY + dy * t;
      const lift = -liftH * Math.sin(raw * Math.PI);
      const scale = startScale + (1 - startScale) * t;

      setAnimStyle({
        transform: `translate(${cx}px, ${cy + lift}px) scale(${scale})`,
      });

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Final position - exactly scale 1
        setAnimStyle({
          transform: `translate(${endX}px, ${endY}px) scale(1)`,
        });
        setIsAnimating(false);
        setTimeout(() => setShowInfo(true), 200);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [getSegmentOriginalPosition]);

  const handleClose = useCallback(() => {
    if (isAnimating) return;
    
    setShowInfo(false);
    
    if (originalPosRef.current === null) {
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
      return;
    }
    
    const { startX, startY, startScale } = originalPosRef.current;
    
    const overlayRect = overlayRef.current?.getBoundingClientRect();
    if (!overlayRect) { 
      setIsVisible(false);
      onClose(); 
      return; 
    }

    const currentX = overlayRect.width * 0.05;
    const currentY = overlayRect.height * 0.5 - 150;

    const dx = startX - currentX;
    const dy = startY - currentY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const liftH = Math.min(dist * 0.08, 40);
    const DURATION = 1600;

    startRef.current = null;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setIsAnimating(true);

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DURATION, 1);
      const t = easeInOutQuad(raw);

      const cx = currentX + dx * t;
      const cy = currentY + dy * t;
      const lift = -liftH * Math.sin(raw * Math.PI);
      // Scale should go from 1 back to startScale
      const scale = 1 + (startScale - 1) * t;

      setAnimStyle({
        transform: `translate(${cx}px, ${cy + lift}px) scale(${scale})`,
      });

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Exactly back to original position with original scale
        setAnimStyle({
          transform: `translate(${startX}px, ${startY}px) scale(${startScale})`,
        });
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 150);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [onClose, isAnimating]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  if (!isVisible) return null;

  return (
    <div 
      ref={overlayRef}
      onClick={handleClose}
      style={{
        position: "fixed", 
        inset: 0, 
        zIndex: 50,
        backgroundColor: overlayBg,
        transition: "background-color 1s ease",
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", 
          right: "7%", 
          top: "50%",
          transform: "translateY(-50%)", 
          width: 340, 
          maxWidth: "32vw",
        }}
      >
        <InfoPanel seg={seg} visible={showInfo} theme={theme} />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        aria-label="Close"
        style={{
          position: "absolute", 
          top: 20, 
          right: 28,
          background: "transparent", 
          border: "none", 
          cursor: "pointer",
          color: theme === "dark" ? GOLD : BLUE,
          fontSize: 38, 
          lineHeight: 1,
          opacity: showInfo ? 1 : 0,
          transition: "opacity 0.6s ease",
          zIndex: 10,
        }}
      >
        ×
      </button>

      <FlyingSegmentSVG 
        seg={seg} 
        theme={theme} 
        animStyle={animStyle}
        isVisible={isVisible}
      />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function FeaturesSection() {
  const [activeSeg, setActiveSeg] = useState<Segment | null>(null);
  const [hiddenId, setHiddenId] = useState<string | null>(null);
  const [theme, setTheme] = useState("dark");
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const segmentRefs = useRef<{ [key: string]: SVGGElement | null }>({});

  useEffect(() => {
    const check = () =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  const handleClick = useCallback((seg: Segment) => {
    setActiveSeg(seg);
    setHiddenId(seg.id);
  }, []);

  const handleClose = useCallback(() => {
    setActiveSeg(null);
    setHiddenId(null);
  }, []);

  const bgColor = theme === "dark" ? BG : LIGHT_BG;
  const heading1 = theme === "dark" ? "#FFFFFF" : "#1F2937";
  const heading2 = theme === "dark" ? GOLD : BLUE;
  const subColor = theme === "dark" ? "#9CA3AF" : "#6B7280";
  const lineColor = theme === "dark" ? GOLD : BLUE;

  return (
    <>
      <style>{`
        @keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <section style={{
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        width: "100%", 
        minHeight: "100vh",
        padding: "60px 16px",
        backgroundColor: bgColor, 
        boxSizing: "border-box",
        position: "relative",
      }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "'Poppins',Arial,sans-serif",
            fontSize: "clamp(22px, 3.5vw, 34px)", 
            fontWeight: 700,
            letterSpacing: "-0.3px", 
            margin: 0,
          }}>
            <span style={{ color: heading1 }}>Comprehensive</span>{" "}
            <span style={{ color: heading2 }}>System Features</span>
          </h2>
          <p style={{
            marginTop: 8, 
            fontSize: 13, 
            color: subColor,
            fontFamily: "Arial,sans-serif", 
            letterSpacing: 1,
          }}>
            Explore our powerful platform capabilities
          </p>
          <div style={{
            margin: "12px auto 0", 
            height: 2, 
            width: 160,
            backgroundColor: lineColor, 
            opacity: 0.6,
          }} />
        </div>

        <div ref={wheelRef} style={{ width: "100%", maxWidth: 520, position: "relative" }}>
          <WheelSVG
            hiddenId={hiddenId}
            onClick={handleClick}
            theme={theme}
            segmentRefs={segmentRefs}
          />
        </div>

        {activeSeg && (
          <FeatureDetail
            key={activeSeg.id}
            seg={activeSeg}
            wheelRef={wheelRef}
            onClose={handleClose}
            theme={theme}
            segmentRefs={segmentRefs}
          />
        )}
      </section>
    </>
  );
}