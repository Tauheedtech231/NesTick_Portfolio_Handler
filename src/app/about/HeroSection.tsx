'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MobileHeroSection } from './MobileHeroSection';

// ─── Stars ───
function Stars({ theme }: { theme: 'light' | 'dark' }) {
  const dots = [
    { x: "6%",  y: "8%",  r: 1,   op: 0.5 },
    { x: "17%", y: "15%", r: 1.2, op: 0.4 },
    { x: "30%", y: "6%",  r: 0.8, op: 0.6 },
    { x: "47%", y: "4%",  r: 1,   op: 0.5 },
    { x: "84%", y: "5%",  r: 0.8, op: 0.6 },
    { x: "95%", y: "13%", r: 1,   op: 0.3 },
    { x: "7%",  y: "37%", r: 0.8, op: 0.3 },
    { x: "91%", y: "74%", r: 1,   op: 0.4 },
    { x: "63%", y: "91%", r: 1.5, op: 0.7, color: theme === 'dark' ? "#4da6ff" : "#0066FF" },
    { x: "71%", y: "17%", r: 1.5, op: 0.6, color: theme === 'dark' ? "#4da6ff" : "#0066FF" },
    { x: "79%", y: "82%", r: 1,   op: 0.5, color: theme === 'dark' ? "#4da6ff" : "#0066FF" },
    { x: "40%", y: "94%", r: 5,   op: 0.65, color: "#E8CA5E" }, // ← UPDATED: Gold
  ];
  return (
    <>
      {dots.map((d, i) => (
        <div key={i} style={{
          position:"absolute", left:d.x, top:d.y,
          width:d.r*2, height:d.r*2,
          borderRadius:"50%", background:d.color??"white",
          opacity:d.op, pointerEvents:"none",
        }}/>
      ))}
    </>
  );
}

// ─── Node Icons ───
const PortfolioIcon = ({ isHovered, theme }: { isHovered?: boolean, theme: 'light' | 'dark' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isHovered ? "#E8CA5E" : (theme === 'dark' ? "#4da6ff" : "#0066FF")} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/>
  </svg>
);
const ShieldIcon = ({ isHovered, theme }: { isHovered?: boolean, theme: 'light' | 'dark' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isHovered ? "#E8CA5E" : (theme === 'dark' ? "#4da6ff" : "#0066FF")} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const ChartIcon = ({ isHovered, theme }: { isHovered?: boolean, theme: 'light' | 'dark' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isHovered ? "#E8CA5E" : (theme === 'dark' ? "#4da6ff" : "#0066FF")} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="10" y1="20" x2="10" y2="4"/>
    <line x1="14" y1="20" x2="14" y2="12"/><line x1="18" y1="20" x2="18" y2="8"/>
    <polyline points="6,14 10,8 14,12 18,6"/>
  </svg>
);
const GlobeNodeIcon = ({ isHovered, theme }: { isHovered?: boolean, theme: 'light' | 'dark' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isHovered ? "#E8CA5E" : (theme === 'dark' ? "#4da6ff" : "#0066FF")} strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const NODES = [
  { icon: PortfolioIcon, label: ["SMART PORTFOLIOS"], angleOffset: 0 },
  { icon: ShieldIcon, label: ["SECURE &","RELIABLE"], angleOffset: Math.PI / 2 },
  { icon: ChartIcon, label: ["DATA DRIVEN","INSIGHTS"], angleOffset: Math.PI },
  { icon: GlobeNodeIcon, label: ["GLOBAL","PRESENCE"], angleOffset: (3 * Math.PI) / 2 },
];

const ORBIT_RADIUS = 188;

// ─── Orbital Diagram ───
function OrbitalDiagram({ theme }: { theme: 'light' | 'dark' }) {
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [nAngle, setNAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [nHovered, setNHovered] = useState(false);
  const [orbitHovered, setOrbitHovered] = useState(false);
  const [nodeHovered, setNodeHovered] = useState(false);
  
  const nHoverRafRef = useRef<number>(0);
  const nHoverLastRef = useRef<number | null>(null);

  const rafRef = useRef<number>(0);
  const lastRef = useRef<number | null>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ angle: number } | null>(null);
  const nAngleRef = useRef(nAngle);
  nAngleRef.current = nAngle;

  const isHovered = nHovered || orbitHovered || nodeHovered;

  const primaryColor = theme === 'dark' ? '#4da6ff' : '#0066FF';
  const primaryLight = theme === 'dark' ? 'rgba(77,166,255,0.30)' : 'rgba(0,102,255,0.20)';
  const primaryGlow = theme === 'dark' ? 'rgba(77,166,255,0.09)' : 'rgba(0,102,255,0.06)';
  const borderColor = theme === 'dark' ? 'rgba(77,166,255,0.12)' : 'rgba(0,102,255,0.15)';
  const bgColor = theme === 'dark' ? '#0a1535' : '#f0f4ff';
  const textColor = theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

  useEffect(() => {
    if (paused) return;
    const step = (ts: number) => {
      if (lastRef.current !== null) {
        const dt = ts - lastRef.current;
        setAngle(prev => prev + (dt / 1000) * (Math.PI / 9));
      }
      lastRef.current = ts;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, [paused]);

  useEffect(() => {
    if (!isHovered || isDragging) {
      cancelAnimationFrame(nHoverRafRef.current);
      nHoverLastRef.current = null;
      return;
    }
    const step = (ts: number) => {
      if (nHoverLastRef.current !== null) {
        const dt = ts - nHoverLastRef.current;
        setNAngle(prev => prev + (dt / 1000) * (Math.PI / 3));
      }
      nHoverLastRef.current = ts;
      nHoverRafRef.current = requestAnimationFrame(step);
    };
    nHoverRafRef.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(nHoverRafRef.current); nHoverLastRef.current = null; };
  }, [isHovered, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!planetRef.current) return;
    const rect = planetRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startA = Math.atan2(e.clientY - cy, e.clientX - cx);
    dragStartRef.current = { angle: nAngleRef.current - startA };
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!planetRef.current || !dragStartRef.current) return;
      const rect = planetRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const a = Math.atan2(e.clientY - cy, e.clientX - cx);
      setNAngle(dragStartRef.current.angle + a);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging]);

  const C = 240;

  return (
    <div style={{ 
      position: "relative", 
      width: 480, 
      height: 480, 
      maxWidth: "100%", 
      maxHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>

      {[
        { size: 480, border: `1px solid ${theme === 'dark' ? 'rgba(77,166,255,0.05)' : 'rgba(0,102,255,0.05)'}`, shadow: "none" },
        { 
          size: 376, 
          border: `1px solid ${isHovered ? 'rgba(232,202,94,0.3)' : borderColor}`, // ← UPDATED: Gold
          shadow: isHovered 
            ? "0 0 30px rgba(232,202,94,0.15)" // ← UPDATED: Gold
            : `0 0 18px ${primaryGlow}`,
        },
        { size: 260, border: `1px dashed ${theme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`, shadow: "none" },
        { 
          size: 152, 
          border: `1.2px solid ${isHovered ? 'rgba(232,202,94,0.6)' : 'rgba(232,202,94,0.32)'}`, // ← UPDATED: Gold
          shadow: isHovered 
            ? "0 0 25px rgba(232,202,94,0.25)" // ← UPDATED: Gold
            : "0 0 14px rgba(232,202,94,0.12)", // ← UPDATED: Gold
        },
      ].map(({ size, border, shadow }, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: size, height: size,
          marginTop: -size / 2, marginLeft: -size / 2,
          borderRadius: "50%",
          border,
          boxShadow: shadow,
          pointerEvents: "none",
          transition: "border 0.6s ease, box-shadow 0.6s ease",
        }} />
      ))}

      <div
        ref={orbitRef}
        onMouseEnter={() => setOrbitHovered(true)}
        onMouseLeave={() => setOrbitHovered(false)}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 376,
          height: 376,
          marginTop: -188,
          marginLeft: -188,
          borderRadius: "50%",
          boxShadow: isHovered
            ? "0 0 60px rgba(232,202,94,0.15), inset 0 0 40px rgba(232,202,94,0.08)" // ← UPDATED: Gold
            : `0 0 40px ${primaryGlow}, inset 0 0 30px ${primaryGlow}`,
          pointerEvents: "auto",
          cursor: "pointer",
          transition: "box-shadow 0.6s ease",
        }}
      />

      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 200,
        height: 200,
        marginTop: -100,
        marginLeft: -100,
        borderRadius: "50%",
        background: isHovered
          ? "radial-gradient(circle, rgba(232,202,94,0.35) 0%, rgba(232,202,94,0.05) 68%)" // ← UPDATED: Gold
          : `radial-gradient(circle, ${primaryLight} 0%, transparent 68%)`,
        transition: "opacity 0.6s ease, background 0.6s ease",
        opacity: isHovered ? 1 : 0.65,
        pointerEvents: "none",
      }} />

      <div
        ref={planetRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setNHovered(true)}
        onMouseLeave={() => { setNHovered(false); }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 140,
          height: 140,
          marginTop: -70,
          marginLeft: -70,
          borderRadius: "50%",
          background: isHovered
            ? "radial-gradient(circle at 38% 35%, #f5c842 0%, #E8CA5E 35%, #c49b2a 70%, #7a5e0a 100%)" // ← UPDATED: Gold
            : theme === 'dark'
              ? "radial-gradient(circle at 38% 35%, #6ab4ff 0%, #1a4a9e 35%, #091535 70%, #030918 100%)"
              : "radial-gradient(circle at 38% 35%, #7abfff 0%, #3b82f6 35%, #1a4a9e 70%, #0d1b3e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          cursor: isDragging ? "grabbing" : "grab",
          transform: `rotate(${nAngle}rad) scale(${isHovered ? 1.09 : 1})`,
          transition: isDragging
            ? "box-shadow 0.2s, transform 0s"
            : "box-shadow 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1), background 0.6s ease",
          boxShadow: isHovered
            ? `0 0 0 2px ${primaryColor}, 0 0 36px ${primaryColor}88, 0 0 70px ${primaryColor}44`
            : `0 0 0 1px ${borderColor}, 0 0 20px ${primaryColor}33`,
          userSelect: "none",
          willChange: "transform",
        }}
      >
        <svg style={{ position: "absolute", inset: 0, borderRadius: "50%" }} viewBox="0 0 116 116" fill="none">
          <path
            d="M 20 44 A 58 58 0 0 1 58 6"
            stroke={isHovered ? "#E8CA5E" : primaryColor} // ← UPDATED: Gold
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transition: "stroke 0.6s ease" }}
          />
          <path
            d="M 20 44 A 58 58 0 0 0 58 110"
            stroke={isHovered ? "rgba(232,202,94,0.6)" : `${primaryColor}33`} // ← UPDATED: Gold
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transition: "stroke 0.6s ease" }}
          />
        </svg>

        <span style={{
          fontSize: 40,
          fontWeight: 900,
          fontStyle: "italic",
          color: '#FFFFFF',
          position: "relative",
          zIndex: 1,
          transform: `rotate(${-nAngle}rad)`,
          display: "block",
          lineHeight: 1,
          transition: isDragging
            ? "transform 0s"
            : "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          pointerEvents: "none",
          willChange: "transform",
          letterSpacing: "3px",
          textShadow: `0 0 30px ${primaryColor}66, 0 0 60px ${primaryColor}33`,
        }}>
          PSM
        </span>
      </div>

      {NODES.map((node, i) => {
        const a = angle + node.angleOffset;
        const x = C + ORBIT_RADIUS * Math.sin(a);
        const y = C - ORBIT_RADIUS * Math.cos(a);
        const IconComponent = node.icon;
        return (
          <div
            key={i}
            onMouseEnter={() => {
              setPaused(true);
              setNodeHovered(true);
            }}
            onMouseLeave={() => {
              setPaused(false);
              setNodeHovered(false);
            }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%,-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              zIndex: 4,
              willChange: "left,top",
            }}
          >
            <div
              className="orbit-node-icon"
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: isHovered ? "#1a0d04" : bgColor,
                border: isHovered
                  ? "1px solid rgba(232,202,94,0.5)" // ← UPDATED: Gold
                  : `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.6s ease, background 0.6s ease, box-shadow 0.22s, transform 0.22s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = isHovered
                  ? "rgba(232,202,94,0.85)" // ← UPDATED: Gold
                  : borderColor;
                el.style.boxShadow = isHovered
                  ? "0 0 18px rgba(232,202,94,0.45)" // ← UPDATED: Gold
                  : `0 0 18px ${primaryGlow}`;
                el.style.transform = "scale(1.12)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = isHovered
                  ? "rgba(232,202,94,0.5)" // ← UPDATED: Gold
                  : borderColor;
                el.style.boxShadow = "none";
                el.style.transform = "scale(1)";
              }}
            >
              <IconComponent isHovered={isHovered} theme={theme} />
            </div>
            <div style={{ textAlign: "center" }}>
              {node.label.map((l, j) => (
                <div key={j} style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "1.2px",
                  color: isHovered
                    ? "rgba(232,202,94,0.7)" // ← UPDATED: Gold
                    : textColor,
                  lineHeight: 1.5,
                  whiteSpace: "nowrap",
                  transition: "color 0.6s ease",
                }}>{l}</div>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{
        position: "absolute",
        top: "50%",
        left: "calc(50% - 130px)",
        width: 7,
        height: 7,
        marginTop: -3.5,
        borderRadius: "50%",
        background: "#E8CA5E", // ← UPDATED: Gold
        boxShadow: isHovered
          ? "0 0 12px rgba(232,202,94,0.9)" // ← UPDATED: Gold
          : "0 0 8px rgba(232,202,94,0.8)", // ← UPDATED: Gold
        pointerEvents: "none",
        transition: "box-shadow 0.6s ease",
      }} />
      <div style={{
        position: "absolute",
        top: "calc(50% - 186px)",
        left: "calc(50% + 80px)",
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: isHovered ? "#E8CA5E" : primaryColor, // ← UPDATED: Gold
        opacity: isHovered ? 0.9 : 0.8,
        pointerEvents: "none",
        transition: "background 0.6s ease, opacity 0.6s ease",
      }} />
      <div style={{
        position: "absolute",
        top: "calc(50% + 140px)",
        left: "calc(50% - 170px)",
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: isHovered ? "#E8CA5E" : primaryColor, // ← UPDATED: Gold
        opacity: isHovered ? 0.7 : 0.55,
        pointerEvents: "none",
        transition: "background 0.6s ease, opacity 0.6s ease",
      }} />

      {isHovered && !isDragging && (
        <div style={{
          position: "absolute",
          top: "calc(50% + 66px)",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 8,
          letterSpacing: "2px",
          color: "rgba(232,202,94,0.6)", // ← UPDATED: Gold
          fontWeight: 600,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 10,
          fontFamily: "inherit",
          transition: "color 0.6s ease",
        }}>
          DRAG TO ROTATE
        </div>
      )}
    </div>
  );
}

// ─── Hero ───
export function HeroSection() {
  const router = useRouter();
  const [btnHovered, setBtnHovered] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const bgGradient = theme === 'dark'
    ? "radial-gradient(ellipse at 65% 50%, #0d1e4a 0%, #070c1e 55%, #03050d 100%)"
    : "radial-gradient(ellipse at 65% 50%, #e8edf5 0%, #d5dde8 55%, #c5cfe0 100%)";
  
  const textColor = theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const textMuted = theme === 'dark' ? 'rgba(255,255,255,0.58)' : 'rgba(31,41,55,0.7)';
  const textMutedLight = theme === 'dark' ? 'rgba(255,255,255,0.42)' : 'rgba(31,41,55,0.5)';
  const primaryColor = theme === 'dark' ? '#4da6ff' : '#0066FF';
  const accentColor = '#E8CA5E'; // ← UPDATED: Gold
  const dividerColor = theme === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.15)';
  const btnBg = theme === 'dark' ? 'rgba(77,166,255,0.08)' : 'rgba(0,102,255,0.06)';
  const btnBorder = theme === 'dark' ? 'rgba(77,166,255,0.35)' : 'rgba(0,102,255,0.25)';
  const btnBorderDefault = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const btnTextColor = theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const btnIconBg = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const btnIconBorder = theme === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)';

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-90px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(120px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .hero-left  { animation: slideInLeft  0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-right { animation: slideInRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }

        .hero-eyebrow  { animation: slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .hero-h1-l1    { animation: slideInLeft 0.75s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .hero-h1-l2    { animation: slideInLeft 0.75s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .hero-divider  { animation: slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) 0.28s both; }
        .hero-p        { animation: slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) 0.36s both; }
        .hero-btn-wrap { animation: slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) 0.44s both; }

        /* ── DESKTOP HIDE ON MOBILE ── */
        @media (max-width: 768px) {
          .desktop-hero {
            display: none !important;
          }
        }

        /* ── MOBILE HIDE ON DESKTOP ── */
        @media (min-width: 769px) {
          .mobile-hero {
            display: none !important;
          }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .hero-container {
            flex-direction: column !important;
            padding: 40px 5% !important;
            gap: 30px !important;
            min-height: auto !important;
            padding-top: 100px !important;
          }
          .hero-left {
            flex: 1 1 auto !important;
            width: 100% !important;
            text-align: center !important;
          }
          .hero-left p {
            max-width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .hero-left .hero-eyebrow {
            justify-content: center !important;
          }
          .hero-left .hero-divider {
            justify-content: center !important;
          }
          .hero-left .hero-btn-wrap {
            display: flex !important;
            justify-content: center !important;
          }
          .hero-right {
            flex: 1 1 auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 480px !important;
            margin-right: 0 !important;
            justify-content: center !important;
            padding-top: 0 !important;
          }
          .hero-right > div {
            transform: scale(0.75) !important;
            transform-origin: center !important;
            margin-top: 0 !important;
          }
        }

        @media (max-width: 768px) {
          .hero-right {
            min-height: 420px !important;
          }
          .hero-right > div {
            transform: scale(0.65) !important;
          }
        }

        @media (max-width: 640px) {
          .hero-container {
            padding: 30px 4% !important;
            padding-top: 80px !important;
            gap: 20px !important;
          }
          .hero-right {
            min-height: 380px !important;
          }
          .hero-right > div {
            transform: scale(0.6) !important;
          }
          .hero-h1-l1, .hero-h1-l2 span {
            font-size: clamp(28px, 8vw, 36px) !important;
          }
          .hero-p {
            font-size: 12px !important;
          }
          .hero-btn-wrap button {
            padding: 8px 14px 8px 18px !important;
            gap: 10px !important;
          }
          .hero-btn-wrap button span {
            font-size: 12px !important;
          }
          .hero-btn-wrap button div {
            width: 28px !important;
            height: 28px !important;
          }
          .hero-btn-wrap button div svg {
            width: 11px !important;
            height: 11px !important;
          }
        }
      `}</style>

      {/* ─── DESKTOP HERO ─── */}
      <section 
        className="desktop-hero hero-container"
        style={{
          minHeight: "100vh",
          background: bgGradient,
          display: "flex",
          alignItems: "center",
          padding: "0 6%",
          marginTop: "-1rem",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Inter',sans-serif",
          transition: "background 0.6s ease, margin-top 0.3s ease",
        }}
      >
        <Stars theme={theme} />

        {/* LEFT */}
        <div className="hero-left" style={{ flex: "0 0 42%", position: "relative", zIndex: 2 }}>
          <div className="hero-eyebrow" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: dividerColor }} />
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase", color: textMutedLight }}>
              About Us
            </span>
          </div>

          <h1 style={{ margin: 0, lineHeight: 1.05 }}>
            <span className="hero-h1-l1" style={{ display: "block", fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, color: textColor }}>
              Building
            </span>
            <span className="hero-h1-l2" style={{ display: "block" }}>
              <span style={{ fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, color: accentColor }}>Digital </span>
              <span style={{ fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, color: primaryColor }}>Futures</span>
            </span>
          </h1>

          <div className="hero-divider" style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0 26px" }}>
            <div style={{ width: 40, height: 1, background: dividerColor }} />
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "3.5px", color: textMutedLight, textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Since 2021
            </span>
            <div style={{ width: 40, height: 1, background: dividerColor }} />
          </div>

          <p className="hero-p" style={{ fontSize: 13.5, lineHeight: 1.7, color: textMuted, maxWidth: 380, margin: "0 0 40px" }}>
            We empower institutions to manage and showcase College portfolios —{" "}
            <span style={{ color: accentColor, fontWeight: 600, fontStyle: "italic" }}>
              simply, securely and efficiently.
            </span>
          </p>

          <div className="hero-btn-wrap">
            <button
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              onClick={() => router.push('/products')}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: btnHovered ? btnBg : "transparent",
                border: `1px solid ${btnHovered ? accentColor : btnBorderDefault}`, // ← UPDATED: Gold
                borderRadius: 50,
                cursor: "pointer",
                padding: "10px 20px 10px 24px",
                transition: "background 0.25s, border-color 0.25s, transform 0.2s",
                transform: btnHovered ? "translateX(4px)" : "translateX(0)",
                position: "relative",
              }}
            >
              <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 -z-10"
                style={{ 
                  opacity: btnHovered ? 1 : 0,
                  background: theme === 'dark' 
                    ? 'rgba(232,202,94,0.20)' // ← UPDATED: Gold
                    : 'rgba(0,102,255,0.15)',
                  filter: 'blur(20px)',
                }} />
              <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 -z-10"
                style={{ 
                  opacity: btnHovered ? 1 : 0,
                  background: theme === 'dark' 
                    ? 'rgba(232,202,94,0.10)' // ← UPDATED: Gold
                    : 'rgba(0,102,255,0.08)',
                  filter: 'blur(30px)',
                }} />
              <span className="absolute inset-[-4px] rounded-full border-2 opacity-0 transition-opacity duration-500 blur-sm"
                style={{ 
                  opacity: btnHovered ? 1 : 0,
                  borderColor: theme === 'dark' 
                    ? 'rgba(232,202,94,0.30)' // ← UPDATED: Gold
                    : 'rgba(0,102,255,0.25)',
                }} />

              <span style={{
                color: btnHovered ? accentColor : btnTextColor, // ← UPDATED: Gold
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "color 0.25s",
                letterSpacing: "0.3px",
              }}>
                Explore Our Solutions
              </span>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: btnHovered ? (theme === 'dark' ? 'rgba(232,202,94,0.15)' : 'rgba(0,102,255,0.10)') : btnIconBg, // ← UPDATED: Gold
                border: `1px solid ${btnHovered ? accentColor : btnIconBorder}`, // ← UPDATED: Gold
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.25s, border-color 0.25s, transform 0.25s",
                transform: btnHovered ? "translateX(3px)" : "translateX(0)",
                flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={btnHovered ? accentColor : (theme === 'dark' ? "white" : "#1F2937")} // ← UPDATED: Gold
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: "stroke 0.25s" }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT - Orbit */}
        <div className="hero-right" style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          marginRight: "-4rem",
          transition: "margin-right 0.3s ease",
        }}>
          <OrbitalDiagram theme={theme} />
        </div>
      </section>

      {/* ─── MOBILE HERO ─── */}
      <div className="mobile-hero">
        <MobileHeroSection />
      </div>
    </>
  );
}