import { useEffect, useRef, useState, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const NUM_SEGS = 5;
const BOTTOM_GAP = 2;
const SEG_SPAN = 360 / NUM_SEGS - BOTTOM_GAP;
const START_OFFSET = 270;

const SEG_META = [
  { 
    id: "01", 
    label: ["MULTI", "PORTAL"],   
    title: "MULTI-PORTAL ARCHITECTURE", 
    description: "Build and manage multiple portals from a single codebase with shared components and reusable UI elements. Scale seamlessly across different brands, regions, and user types without duplicating your infrastructure or maintaining separate codebases. Our architecture supports independent deployments while maintaining consistency and reducing maintenance overhead across your entire ecosystem." 
  },
  { 
    id: "02", 
    label: ["CENTRALIZ"],         
    title: "CENTRALIZED MANAGEMENT",     
    description: "Control all your portals, users, and system configurations from one unified and intuitive dashboard. Streamline your daily operations and significantly reduce administrative overhead with a single source of truth for your entire platform. Access real-time analytics, user activity logs, and system performance metrics all in one centralized location for better decision making." 
  },
  { 
    id: "03", 
    label: ["ACCESS", "CONTROL"], 
    title: "ACCESS CONTROL",             
    description: "Define granular roles and permissions for every user across all portals with precision and flexibility. Protect your sensitive business data with enterprise-grade authentication protocols and fine-grained authorization policies that adapt to your organizational structure. Implement multi-factor authentication, single sign-on, and custom permission sets tailored to your specific security requirements." 
  },
  { 
    id: "04", 
    label: ["LIVE", "SYNC"],      
    title: "LIVE SYNC",                  
    description: "Experience real-time data synchronization across all portals, devices, and user sessions. Changes propagate instantly throughout the system so every user always sees the most current information without manual refresh or page reload. Our WebSocket-powered sync engine ensures data consistency and provides a seamless collaborative experience for teams working across different locations and time zones." 
  },
  { 
    id: "05", 
    label: ["PORTFOLIO"],         
    title: "PORTFOLIO",                  
    description: "Showcase and manage your complete portfolio of projects within one cohesive and branded platform. Present your clients with a polished, professional experience that highlights your best work and demonstrates your capabilities. Organize projects by category, track progress metrics, and share success stories with customizable portfolio views that reflect your unique brand identity." 
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────
const CX = 340, CY = 340;
const GOLD = "#FFD700", BLUE = "#0066FF";
const FILL = "#0f1e38", FILL_HOVER = "#1a3060", INNER_FILL = "#07101e", BG = "#0B0F19";
const LIGHT_BG = "#FFFFFF", LIGHT_FILL = "#f0f4ff", LIGHT_FILL_HOVER = "#dce6ff";
const LIGHT_INNER_FILL = "#f8faff", LIGHT_DESC = "#6B7280";

const OUTER_R = 320, STRIP_OUTER = 320, STRIP_INNER = 294;
const SEG_OUTER = 278, SEG_INNER = 130, INNER_CIRCLE_R = 116;
const LABEL_R = 206, NUM_R = (STRIP_OUTER + STRIP_INNER) / 2;
const DEST_MAX = 450;
const ARC_HEIGHT_OUT = 28;
const ARC_HEIGHT_IN  = 0;
const OPEN_DUR  = 1400;
const CLOSE_DUR = 1700;
const HANDOFF_MS = 420;

// ─── Types ───────────────────────────────────────────────────────────────────
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

interface FlyState {
  left: number;
  top: number;
  width: number;
  height: number;
  seg: Segment;
}

interface Journey {
  slotCx: number; slotCy: number; slotW: number; slotH: number;
  endCx: number;  endCy: number;  destW: number;  destH: number;
}

// ─── SVG Helpers ─────────────────────────────────────────────────────────────
const toRad = (deg: number) => (deg * Math.PI) / 180;
const polar = (r: number, deg: number, cx = CX, cy = CY) => ({
  x: cx + r * Math.cos(toRad(deg)),
  y: cy + r * Math.sin(toRad(deg)),
});

function arcPath(r: number, s: number, e: number, cx = CX, cy = CY) {
  let end = e; if (end < s) end += 360;
  const lg = end - s > 180 ? 1 : 0;
  const a = polar(r, s, cx, cy), b = polar(r, e, cx, cy);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${lg} 1 ${b.x} ${b.y}`;
}

function donutSeg(oR: number, iR: number, s: number, e: number, cx = CX, cy = CY) {
  let end = e; if (end < s) end += 360;
  const lg = end - s > 180 ? 1 : 0;
  const os = polar(oR, s, cx, cy), oe = polar(oR, e, cx, cy);
  const ie = polar(iR, e, cx, cy), is_ = polar(iR, s, cx, cy);
  return `M ${os.x} ${os.y} A ${oR} ${oR} 0 ${lg} 1 ${oe.x} ${oe.y} L ${ie.x} ${ie.y} A ${iR} ${iR} 0 ${lg} 0 ${is_.x} ${is_.y} Z`;
}

// ─── Easing ──────────────────────────────────────────────────────────────────
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

// ─── ViewBox Calculator ───────────────────────────────────────────────────────
function computeVB(s: number, e: number, oR = 278, iR = 130, cx = 340, cy = 340, pad = 14) {
  const toR = (d: number) => (d * Math.PI) / 180;
  let end = e; if (end < s) end += 360;
  const pts: number[][] = [];
  for (let d = s; d <= end; d += 2) {
    const a = toR(d);
    pts.push([cx + oR * Math.cos(a), cy + oR * Math.sin(a)], [cx + iR * Math.cos(a), cy + iR * Math.sin(a)]);
  }
  for (let d = s; d <= end; d += 2) {
    const a = toR(d);
    pts.push([cx + 320 * Math.cos(a), cy + 320 * Math.sin(a)], [cx + 294 * Math.cos(a), cy + 294 * Math.sin(a)]);
  }
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad, maxY = Math.max(...ys) + pad;
  return `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`;
}

function vbSize(vb: string) {
  const parts = vb.split(" ").map(Number);
  return { w: parts[2], h: parts[3] };
}

function fitSize(w: number, h: number, max: number) {
  const scale = Math.min(max / w, max / h);
  return { w: w * scale, h: h * scale };
}

// ─── Segments ────────────────────────────────────────────────────────────────
function calcSegments(): Segment[] {
  return Array.from({ length: NUM_SEGS }, (_, i) => {
    const segAngle = 360 / NUM_SEGS;
    const centerDeg = (START_OFFSET + i * segAngle) % 360;
    const half = SEG_SPAN / 2;
    const startDeg = (centerDeg - half + 360) % 360;
    const endDeg = ((centerDeg + half) % 360 - BOTTOM_GAP + 360) % 360;
    return { ...SEG_META[i], startDeg, endDeg, centerDeg, index: i, vb: computeVB(startDeg, endDeg) };
  });
}
const SEGMENTS = calcSegments();

// ─── Typewriter Hook ──────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 20, delay = 300) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed(""); setDone(false); let i = 0;
    t.current = setTimeout(() => {
      const tick = () => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i < text.length) t.current = setTimeout(tick, speed);
        else setDone(true);
      };
      tick();
    }, delay);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [text, speed, delay]);

  return { displayed, done };
}

// ─── Segment Paths ────────────────────────────────────────────────────────────
function SegPaths({
  seg, fill, innerFill, color, sw = 2,
}: {
  seg: Segment; fill: string; innerFill: string; color: string; sw?: number;
}) {
  const np = polar(NUM_R, seg.centerDeg);
  const lp = polar(LABEL_R, seg.centerDeg);
  return (
    <>
      <path d={arcPath(OUTER_R, seg.startDeg, seg.endDeg)} fill="none" stroke={color} strokeWidth={sw} />
      <path d={donutSeg(STRIP_OUTER, STRIP_INNER, seg.startDeg, seg.endDeg)} fill={innerFill} stroke={color} strokeWidth={sw} />
      <path d={arcPath(STRIP_INNER, seg.startDeg, seg.endDeg)} fill="none" stroke={color} strokeWidth={sw} />
      <path d={donutSeg(SEG_OUTER, SEG_INNER, seg.startDeg, seg.endDeg)} fill={fill} stroke={color} strokeWidth={sw} />
      <path d={arcPath(SEG_OUTER, seg.startDeg, seg.endDeg)} fill="none" stroke={color} strokeWidth={sw} />
      <path d={arcPath(SEG_INNER, seg.startDeg, seg.endDeg)} fill="none" stroke={color} strokeWidth={sw} />
      <text x={np.x} y={np.y} textAnchor="middle" dominantBaseline="central" fill={color} fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" letterSpacing="1.5">
        {seg.id}
      </text>
      {seg.label.map((line, i) => (
        <text key={i} x={lp.x} y={lp.y + (i - (seg.label.length - 1) / 2) * 21} textAnchor="middle" dominantBaseline="central" fill={color} fontFamily="Arial,sans-serif" fontSize="14" fontWeight="700" letterSpacing="2.5">
          {line}
        </text>
      ))}
    </>
  );
}

// ─── Info Panel ───────────────────────────────────────────────────────────────
function InfoPanel({ seg, visible, theme, isMobile }: { seg: Segment; visible: boolean; theme: string; isMobile: boolean }) {
  const { displayed, done } = useTypewriter(seg.description);
  const titleColor = theme === "dark" ? GOLD : BLUE;
  const descColor  = theme === "dark" ? "#D1D5DB" : LIGHT_DESC;
  const dotColor   = theme === "dark" ? GOLD : BLUE;

  const titleFontSize = isMobile ? 16 : 22;
  const descFontSize = isMobile ? 13 : 17;
  const minHeight = isMobile ? 80 : 120;

  return (
    <div style={{ 
      opacity: visible ? 1 : 0, 
      transition: "opacity 0.5s ease", 
      maxWidth: isMobile ? "90vw" : 480,
      position: "relative",
      marginTop: isMobile ? 0 : 40,
      padding: isMobile ? "0 10px" : 0,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 10 : 14, marginBottom: isMobile ? 8 : 20 }}>
        <p style={{ 
          color: titleColor, 
          fontFamily: "Arial,sans-serif", 
          fontSize: titleFontSize,
          fontWeight: 700, 
          letterSpacing: 1.2, 
          lineHeight: 1.5, 
          margin: 0 
        }}>
          {seg.title}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 10 : 14, position: "relative" }}>
        <p style={{ 
          color: descColor, 
          fontFamily: "Arial,sans-serif", 
          fontSize: descFontSize,
          lineHeight: isMobile ? 1.6 : 1.9,
          margin: 0, 
          minHeight: minHeight,
          width: "100%" 
        }}>
          {displayed}
          {!done && (
            <span style={{ display: "inline-block", width: 2.5, height: isMobile ? 14 : 17, backgroundColor: dotColor, marginLeft: 3, verticalAlign: "middle", animation: "tw-blink 0.75s step-end infinite" }} />
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  const [activeSeg, setActiveSeg]       = useState<Segment | null>(null);
  const [showInfo, setShowInfo]         = useState(false);
  const [animating, setAnimating]       = useState(false);
  const [hoveredId, setHoveredId]       = useState<string | null>(null);
  const [wheelReady, setWheelReady]     = useState(false);
  const [theme, setTheme]               = useState("dark");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [fly, setFly]               = useState<FlyState | null>(null);
  const [flyVisible, setFlyVisible] = useState(true);

  const wheelRef     = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef       = useRef<number | null>(null);
  const startRef     = useRef<number | null>(null);
  const journeyRef   = useRef<Journey | null>(null);
  const handoffRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpeningRef = useRef(false);

  // ── Check mobile ────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── Theme detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  // ── Wheel entrance ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setWheelReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  // ── Scroll lock ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeSeg) return;

    const scrollY = window.scrollY;
    setScrollPosition(scrollY);
    
    document.body.style.position = "fixed";
    document.body.style.top      = `-${scrollY}px`;
    document.body.style.left     = "0";
    document.body.style.right    = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.left     = "";
      document.body.style.right    = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [activeSeg]);

  // ── Slot info helper ────────────────────────────────────────────────────────
  function getSlotInfo(seg: Segment) {
    const wEl = wheelRef.current, cEl = containerRef.current;
    if (!wEl || !cEl) return null;
    const wRect = wEl.getBoundingClientRect(), cRect = cEl.getBoundingClientRect();
    const svgScale = wRect.width / 680;
    const midR = (SEG_OUTER + SEG_INNER) / 2;
    const rad  = toRad(seg.centerDeg);
    const slotCx = (wRect.left - cRect.left) + (CX + midR * Math.cos(rad)) * svgScale;
    const slotCy = (wRect.top  - cRect.top)  + (CY + midR * Math.sin(rad)) * svgScale;
    const { w: vbW, h: vbH } = vbSize(seg.vb);
    const slotW = vbW * svgScale;
    const slotH = vbH * svgScale;
    return { slotCx, slotCy, slotW, slotH, cRect };
  }

  // ── Actual open logic ──────────────────────────────────────────────────────
  const openSegment = useCallback((seg: Segment) => {
    if (isOpeningRef.current) return;
    isOpeningRef.current = true;

    const info = getSlotInfo(seg);
    if (!info) {
      isOpeningRef.current = false;
      return;
    }
    const { slotCx, slotCy, slotW, slotH, cRect } = info;

    const { w: vbW, h: vbH } = vbSize(seg.vb);
    const maxDest = isMobile ? 280 : DEST_MAX;
    const { w: destW, h: destH } = fitSize(vbW, vbH, maxDest);

    let endCx, endCy;
    if (isMobile) {
      endCx = cRect.width * 0.5;
      endCy = cRect.height * 0.22 + destH / 2;
    } else {
      endCx = cRect.width * 0.10 + destW / 2;
      endCy = cRect.height * 0.5;
      if (seg.index === 1 || seg.index === 2 || seg.index === 4) {
        endCy = cRect.height * 0.5 + 60;
      }
    }

    journeyRef.current = { slotCx, slotCy, slotW, slotH, endCx, endCy, destW, destH };

    if (handoffRef.current) { clearTimeout(handoffRef.current); handoffRef.current = null; }
    setFlyVisible(true);
    setFly({ left: slotCx - slotW / 2, top: slotCy - slotH / 2, width: slotW, height: slotH, seg });
    setActiveSeg(seg);
    setAnimating(true);
    setShowInfo(false);
    setOverlayVisible(false);

    requestAnimationFrame(() => requestAnimationFrame(() => setOverlayVisible(true)));

    startRef.current = null;
    const go = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / OPEN_DUR, 1);
      const t   = easeInOut(raw);

      const cx = slotCx + (endCx - slotCx) * t;
      const cy = slotCy + (endCy - slotCy) * t - ARC_HEIGHT_OUT * Math.sin(raw * Math.PI) ** 2;
      const w  = slotW  + (destW  - slotW)  * t;
      const h  = slotH  + (destH  - slotH)  * t;

      setFly({ left: cx - w / 2, top: cy - h / 2, width: w, height: h, seg });

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(go);
      } else {
        setFly({ left: endCx - destW / 2, top: endCy - destH / 2, width: destW, height: destH, seg });
        setAnimating(false);
        isOpeningRef.current = false;
        setTimeout(() => setShowInfo(true), 150);
      }
    };
    rafRef.current = requestAnimationFrame(go);
  }, [isMobile]);

  // ── Click: scroll to wheel then open ──────────────────────────────────────
  const handleClick = useCallback((seg: Segment) => {
    if (animating || activeSeg || isOpeningRef.current) return;

    // ✅ Check if wheel is visible
    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      
      // If wheel is not fully visible, scroll to it first
      if (!isVisible) {
        const scrollY = window.scrollY;
        const targetY = rect.top + scrollY - 100; // 100px top margin
        
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
        
        // Wait for scroll to complete then open
        setTimeout(() => {
          openSegment(seg);
        }, 600);
        
        return;
      }
    }

    // Wheel is visible, open immediately
    openSegment(seg);
  }, [animating, activeSeg, openSegment]);

  // ── Close: segment glides back ─────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (animating || !activeSeg) return;
    setShowInfo(false);
    setOverlayVisible(false);
    
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    window.scrollTo(0, scrollPosition);
    
    const j = journeyRef.current;
    if (!j) { setActiveSeg(null); setFly(null); isOpeningRef.current = false; return; }
    const { slotCx, slotCy, slotW, slotH, endCx, endCy, destW, destH } = j;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setAnimating(true);
    startRef.current = null;

    const go = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / CLOSE_DUR, 1);
      const t   = easeOutQuart(raw);

      const cx = endCx + (slotCx - endCx) * t;
      const cy = endCy + (slotCy - endCy) * t - ARC_HEIGHT_IN * Math.sin(raw * Math.PI);
      const w  = destW + (slotW - destW) * t;
      const h  = destH + (slotH - destH) * t;

      setFly(prev => prev ? { ...prev, left: cx - w / 2, top: cy - h / 2, width: w, height: h } : prev);

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(go);
      } else {
        setAnimating(false);
        setActiveSeg(null);
        setFlyVisible(false);
        isOpeningRef.current = false;
        handoffRef.current = setTimeout(() => {
          setFly(null);
          handoffRef.current = null;
        }, HANDOFF_MS);
      }
    };
    rafRef.current = requestAnimationFrame(go);
  }, [animating, activeSeg, scrollPosition]);

  // ── ESC key ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [handleClose]);

  // ── Theme-aware colors ───────────────────────────────────────────────────────
  const isDark      = theme === "dark";
  const bgColor     = isDark ? BG         : LIGHT_BG;
  const segFill     = isDark ? FILL       : LIGHT_FILL;
  const segFillHov  = isDark ? FILL_HOVER : LIGHT_FILL_HOVER;
  const innerFill   = isDark ? INNER_FILL : LIGHT_INNER_FILL;
  const textColor   = isDark ? GOLD       : BLUE;
  const heading1    = isDark ? "#FFFFFF"  : "#1F2937";
  const heading2    = isDark ? GOLD       : BLUE;
  const subColor    = isDark ? "#9CA3AF"  : "#6B7280";

  const wheelMaxWidth = isMobile ? 320 : 520;

  return (
    <>
      <style>{`@keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <section
        ref={containerRef}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          width: "100%", minHeight: isMobile ? "auto" : "100vh", 
          padding: isMobile ? "30px 12px 40px" : "60px 16px",
          backgroundColor: bgColor, boxSizing: "border-box", position: "relative", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 16 : 40 }}>
          <h2 style={{ fontFamily: "'Poppins',Arial,sans-serif", fontSize: isMobile ? "clamp(18px,5vw,24px)" : "clamp(22px,3.5vw,34px)", fontWeight: 700, letterSpacing: "-0.3px", margin: 0 }}>
            <span style={{ color: heading1 }}>Comprehensive</span>{" "}
            <span style={{ color: heading2 }}>System Features</span>
          </h2>
          <p style={{ marginTop: isMobile ? 2 : 8, fontSize: isMobile ? 10 : 13, color: subColor, fontFamily: "Arial,sans-serif", letterSpacing: 1 }}>
            Explore our powerful platform capabilities
          </p>
          <div style={{ margin: "6px auto 0", height: 2, width: isMobile ? 80 : 160, backgroundColor: heading2, opacity: 0.6 }} />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          style={{
            width: "100%", maxWidth: wheelMaxWidth, position: "relative",
            opacity: wheelReady ? 1 : 0,
            transform: wheelReady ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
            transition: wheelReady ? "opacity 1.1s ease, transform 1.5s ease" : "none",
          }}
        >
          <svg width="100%" viewBox="0 0 680 680" xmlns="http://www.w3.org/2000/svg">
            {SEGMENTS.map((seg) => {
              const isActive = activeSeg?.id === seg.id;
              const isHov    = hoveredId === seg.id && !activeSeg;
              return (
                <g
                  key={seg.id}
                  onClick={() => !activeSeg && !animating && handleClick(seg)}
                  onMouseEnter={() => !activeSeg && setHoveredId(seg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    cursor: activeSeg ? "default" : "pointer",
                    opacity: isActive ? 0.12 : 1,
                    transition: `opacity ${HANDOFF_MS}ms ease, transform 0.15s ease`,
                    transform: isHov && !activeSeg ? "scale(1.015)" : "scale(1)",
                    transformOrigin: `${CX}px ${CY}px`,
                    pointerEvents: activeSeg ? "none" : "auto",
                  }}
                >
                  <SegPaths seg={seg} fill={isHov ? segFillHov : segFill} innerFill={innerFill} color={textColor} sw={isHov ? 2.2 : 2} />
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={INNER_CIRCLE_R} fill={innerFill} stroke={textColor} strokeWidth="2" />
            <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central" fill={textColor} fontFamily="Arial,sans-serif" fontSize={isMobile ? "14" : "22"} fontWeight="700" letterSpacing="3">
              Neezamiya
            </text>
          </svg>
        </div>

        {/* Dim overlay */}
        {activeSeg && (
          <div
            onClick={handleClose}
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              backgroundColor: "rgba(0,0,0,0.92)",
              opacity: overlayVisible ? 1 : 0,
              transition: "opacity 0.45s ease",
              pointerEvents: animating ? "none" : "auto",
            }}
          />
        )}

        {/* Info panel */}
        {activeSeg && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: isMobile ? "relative" : "absolute",
              right: isMobile ? "auto" : "10%",
              top: isMobile ? "auto" : "50%",
              transform: isMobile ? "none" : "translateY(-50%)",
              width: isMobile ? "100%" : 480,
              maxWidth: isMobile ? "100%" : "36vw",
              zIndex: 30,
              pointerEvents: animating ? "none" : "auto",
              marginTop: isMobile ? 0 : 0,
              padding: isMobile ? "0 10px" : 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <InfoPanel seg={activeSeg} visible={showInfo} theme={theme} isMobile={isMobile} />
          </div>
        )}

        {/* Flying segment */}
        {fly && (
          <div
            style={{
              position: "absolute",
              left: fly.left,
              top: fly.top,
              width: fly.width,
              height: fly.height,
              opacity: flyVisible ? 1 : 0,
              transition: `opacity ${HANDOFF_MS}ms ease`,
              zIndex: 20,
              pointerEvents: "none",
              willChange: "left, top, width, height, opacity",
            }}
          >
            <svg width={fly.width} height={fly.height} viewBox={fly.seg.vb} xmlns="http://www.w3.org/2000/svg">
              <SegPaths seg={fly.seg} fill={segFillHov} innerFill={innerFill} color={textColor} sw={2.5} />
            </svg>
          </div>
        )}
      </section>
    </>
  );
}