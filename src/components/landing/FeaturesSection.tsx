import { useEffect, useRef, useState, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const NUM_SEGS = 5;
const BOTTOM_GAP = 2;
const SEG_SPAN = 360 / NUM_SEGS - BOTTOM_GAP;
const START_OFFSET = 270;

const SEG_META = [
  { id: "01", label: ["MULTI", "PORTAL"],   title: "MULTI-PORTAL ARCHITECTURE", description: "Build and manage multiple portals from a single codebase with shared components. Scale seamlessly across brands, regions, and user types without duplicating your infrastructure." },
  { id: "02", label: ["CENTRALIZ"],         title: "CENTRALIZED MANAGEMENT",     description: "Control all your portals, users, and configurations from one unified dashboard. Streamline operations and reduce overhead with a single source of truth for your entire platform." },
  { id: "03", label: ["ACCESS", "CONTROL"], title: "ACCESS CONTROL",             description: "Define granular roles and permissions for every user across all portals. Protect sensitive data with enterprise-grade authentication and fine-grained authorization policies." },
  { id: "04", label: ["LIVE", "SYNC"],      title: "LIVE SYNC",                  description: "Real-time data synchronization across all portals and devices. Changes propagate instantly so every user always sees the most current information without manual refresh." },
  { id: "05", label: ["PORTFOLIO"],         title: "PORTFOLIO",                  description: "Showcase and manage your complete portfolio of projects within one cohesive platform. Present clients with a polished, branded experience that highlights your best work." },
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
const FLY_SIZE = 300;

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
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
function useTypewriter(text: string, speed = 16, delay = 400) {
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
function InfoPanel({ seg, visible, theme, onClose }: { seg: Segment; visible: boolean; theme: string; onClose: () => void }) {
  const { displayed, done } = useTypewriter(seg.description);
  const titleColor = theme === "dark" ? GOLD : BLUE;
  const descColor  = theme === "dark" ? "#D1D5DB" : LIGHT_DESC;
  const dotColor   = theme === "dark" ? GOLD : BLUE;

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease", maxWidth: 340, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
        <span style={{ flexShrink: 0, marginTop: 5, width: 10, height: 10, borderRadius: "50%", backgroundColor: dotColor }} />
        <p style={{ color: titleColor, fontFamily: "Arial,sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 1, lineHeight: 1.45, margin: 0 }}>
          {seg.title}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, position: "relative" }}>
        <span style={{ flexShrink: 0, marginTop: 7, width: 7, height: 7, borderRadius: "50%", backgroundColor: dotColor, opacity: 0.5 }} />
        <p style={{ color: descColor, fontFamily: "Arial,sans-serif", fontSize: 13.5, lineHeight: 1.78, margin: 0, minHeight: 80, width: "100%" }}>
          {displayed}
          {!done && (
            <span style={{ display: "inline-block", width: 2, height: 13, backgroundColor: dotColor, marginLeft: 2, verticalAlign: "middle", animation: "tw-blink 0.75s step-end infinite" }} />
          )}
        </p>
        {/* Cross icon - always visible, bigger size */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close"
          style={{
            position: "absolute",
            right: -40,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: titleColor,
            fontSize: 42,
            lineHeight: 1,
            padding: "8px 12px",
            opacity: 0.7,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            zIndex: 1000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  const [activeSeg, setActiveSeg]   = useState<Segment | null>(null);
  const [showInfo, setShowInfo]     = useState(false);
  const [animating, setAnimating]   = useState(false);
  const [hoveredId, setHoveredId]   = useState<string | null>(null);
  const [wheelReady, setWheelReady] = useState(false);
  const [theme, setTheme]           = useState("dark");

  // fly: only position changes — scale is ALWAYS 1
  const [fly, setFly] = useState<{ left: number; top: number; seg: Segment } | null>(null);

  const wheelRef     = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef       = useRef<number | null>(null);
  const startRef     = useRef<number | null>(null);
  const journeyRef   = useRef<{ slotLeft: number; slotTop: number; endLeft: number; endTop: number } | null>(null);

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

  // ── Scroll lock (runs when detail is open) ──────────────────────────────────
  useEffect(() => {
    if (!activeSeg) return;

    const scrollY = window.scrollY;
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

  // ── Slot position helper ────────────────────────────────────────────────────
  function getSlotInfo(seg: Segment) {
    const wEl = wheelRef.current, cEl = containerRef.current;
    if (!wEl || !cEl) return null;
    const wRect = wEl.getBoundingClientRect(), cRect = cEl.getBoundingClientRect();
    const svgScale = wRect.width / 680;
    const midR = (SEG_OUTER + SEG_INNER) / 2;
    const rad  = toRad(seg.centerDeg);
    const slotCx = (wRect.left - cRect.left) + (CX + midR * Math.cos(rad)) * svgScale;
    const slotCy = (wRect.top  - cRect.top)  + (CY + midR * Math.sin(rad)) * svgScale;
    // top-left of FLY_SIZE div centred over the slot
    const slotLeft = slotCx - FLY_SIZE / 2;
    const slotTop  = slotCy - FLY_SIZE / 2;
    return { slotLeft, slotTop, cRect };
  }

  // ── Click: segment flies out to left (10% from left edge) ──────────────────
  const handleClick = useCallback((seg: Segment) => {
    if (animating || activeSeg) return;
    const info = getSlotInfo(seg);
    if (!info) return;
    const { slotLeft, slotTop, cRect } = info;

    // Landing: 10% from left, vertically centred
    const endLeft = cRect.width * 0.10;
    const endTop  = cRect.height * 0.5 - FLY_SIZE / 2;

    journeyRef.current = { slotLeft, slotTop, endLeft, endTop };

    setFly({ left: slotLeft, top: slotTop, seg });
    setActiveSeg(seg);
    setAnimating(true);
    setShowInfo(false);

    const DUR = 1400; startRef.current = null;
    const go = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DUR, 1);
      const t   = ease(raw);
      const left = slotLeft + (endLeft - slotLeft) * t;
      const top  = slotTop  + (endTop  - slotTop)  * t - 36 * Math.sin(raw * Math.PI);
      // scale stays 1 the entire time
      setFly(prev => prev ? { ...prev, left, top } : prev);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(go);
      } else {
        setFly(prev => prev ? { ...prev, left: endLeft, top: endTop } : prev);
        setAnimating(false);
        setTimeout(() => setShowInfo(true), 150);
      }
    };
    rafRef.current = requestAnimationFrame(go);
  }, [animating, activeSeg]);

  // ── Close: segment returns to slot, full size, no shrink ───────────────────
  const handleClose = useCallback(() => {
    if (animating || !activeSeg) return;
    setShowInfo(false);
    const j = journeyRef.current;
    if (!j) { setActiveSeg(null); setFly(null); return; }
    const { slotLeft, slotTop, endLeft, endTop } = j;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setAnimating(true);
    startRef.current = null;

    const DUR = 1400;
    const go = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DUR, 1);
      const t   = ease(raw);
      // Only position animates — scale stays 1, no shrink
      const left = endLeft + (slotLeft - endLeft) * t;
      const top  = endTop  + (slotTop  - endTop)  * t;
      setFly(prev => prev ? { ...prev, left, top } : prev);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(go);
      } else {
        // Segment has reached the slot — remove flying div, wheel segment fades in
        setAnimating(false);
        setActiveSeg(null);
        setFly(null);
      }
    };
    rafRef.current = requestAnimationFrame(go);
  }, [animating, activeSeg]);

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

  return (
    <>
      <style>{`@keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <section
        ref={containerRef}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          width: "100%", minHeight: "100vh", padding: "60px 16px",
          backgroundColor: bgColor, boxSizing: "border-box", position: "relative", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins',Arial,sans-serif", fontSize: "clamp(22px,3.5vw,34px)", fontWeight: 700, letterSpacing: "-0.3px", margin: 0 }}>
            <span style={{ color: heading1 }}>Comprehensive</span>{" "}
            <span style={{ color: heading2 }}>System Features</span>
          </h2>
          <p style={{ marginTop: 8, fontSize: 13, color: subColor, fontFamily: "Arial,sans-serif", letterSpacing: 1 }}>
            Explore our powerful platform capabilities
          </p>
          <div style={{ margin: "12px auto 0", height: 2, width: 160, backgroundColor: heading2, opacity: 0.6 }} />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          style={{
            width: "100%", maxWidth: 520, position: "relative",
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
                    // Ghost when active — fades back in when segment returns
                    opacity: isActive ? 0.12 : 1,
                    transition: "opacity 0.25s ease, transform 0.15s ease",
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
            <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central" fill={textColor} fontFamily="Arial,sans-serif" fontSize="22" fontWeight="700" letterSpacing="3">
              Neezamiya
            </text>
          </svg>
        </div>

        {/* Dim overlay — z:10, does NOT cover flying segment */}
        {activeSeg && (
          <div
            onClick={handleClose}
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              backgroundColor: "rgba(0,0,0,0.6)",
              transition: "background-color 0.4s ease",
              pointerEvents: animating ? "none" : "auto",
            }}
          />
        )}

        {/* Info panel — 10% from right, z:30 */}
        {activeSeg && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: "10%",          // ← 10% gap from right
              top: "50%",
              transform: "translateY(-50%)",
              width: 320,
              maxWidth: "28vw",
              zIndex: 30,
              pointerEvents: animating ? "none" : "auto",
            }}
          >
            <InfoPanel seg={activeSeg} visible={showInfo} theme={theme} onClose={handleClose} />
          </div>
        )}

        {/* Flying segment — scale ALWAYS 1, only left/top animates — z:20 */}
        {fly && (
          <div
            style={{
              position: "absolute",
              left: fly.left,
              top: fly.top,
              width: FLY_SIZE,
              height: FLY_SIZE,
              zIndex: 20,               // above overlay (10), below info panel (30)
              pointerEvents: "none",
              willChange: "left, top",
              // 10% gap from left edge is handled via endLeft = cRect.width * 0.10 in handleClick
            }}
          >
            <svg width={FLY_SIZE} height={FLY_SIZE} viewBox={fly.seg.vb} xmlns="http://www.w3.org/2000/svg">
              <SegPaths seg={fly.seg} fill={segFillHov} innerFill={innerFill} color={textColor} sw={2.5} />
            </svg>
          </div>
        )}
      </section>
    </>
  );
}