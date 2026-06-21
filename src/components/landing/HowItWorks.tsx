"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Step {
  num: string;
  ttl: string;
  dsc: string;
  tag: string;
  details: string[];
}

interface ColPos {
  x: number;
  y: number;
}

interface StepPos {
  x: number;
  y: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    num: "01",
    ttl: "Template Selection",
    dsc: "Colleges browse through professional portfolio templates specifically designed for educational institutions, selecting the one that best fits their brand and requirements",
    tag: "",
    details: [],
  },
  {
    num: "02",
    ttl: "Admin Approval",
    dsc: "Main admin reviews the request and sends login credentials to college thorugh email and college find the credentials in their inbox.",
    tag: "",
    details: ["Credentials generated", "Email sent to college"],
  },
  {
    num: "03",
    ttl: "College Login",
    dsc: "College logs in securely using the credentials provided by admin.",
    tag: "",
    details: ["Username & password", "Secure portal access","Dashboard access"],
  },
  {
    num: "04",
    ttl: "Content Management",
    dsc: "College admin fills in their data — courses, faculty, gallery — and saves.",
    tag: "",
    details: ["Data entered", "Content saved"],
  },
  {
    num: "05",
    ttl: "Live Publication",
    dsc: "Portfolio goes live instantly. Real-time updates publish content to the world.",
    tag: "LIVE ✦",
    details: [],
  },
];

const COLLEGES = ["College A", "College B", "College C", "College D"];

// ─── SVG helpers ─────────────────────────────────────────────────────────────
function svgLine(
  svg: SVGSVGElement,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  wid: string
): SVGLineElement {
  const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", String(x1));
  l.setAttribute("y1", String(y1));
  l.setAttribute("x2", String(x2));
  l.setAttribute("y2", String(y2));
  l.setAttribute("stroke", color);
  l.setAttribute("stroke-width", "1.5");
  l.setAttribute("opacity", "0");
  l.id = "w-" + wid;
  svg.appendChild(l);
  return l;
}

function svgCurve(
  svg: SVGSVGElement,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  wid: string
): SVGPathElement {
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const cx = (x1 + x2) / 2;
  p.setAttribute("d", `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`);
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", color);
  p.setAttribute("stroke-width", "1.5");
  p.setAttribute("opacity", "0");
  p.id = "w-" + wid;
  svg.appendChild(p);
  return p;
}

function activateWire(wid: string, color: string) {
  const el = document.getElementById("w-" + wid);
  if (!el) return;
  el.setAttribute("stroke", color);
  el.setAttribute("stroke-dasharray", "6 5");
  el.setAttribute("opacity", "1");
  el.classList.add("hiw-live-wire");
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const typeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Detect theme
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

  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#0B0F19',
        cardBg: 'rgba(15, 23, 42, 0.85)',
        cardBorder: 'rgba(30, 41, 59, 0.5)',
        text: '#FFFFFF',
        textMuted: '#9CA3AF',
        heading: '#FFFFFF',
        accent: '#E8CA5E',
        accentLight: 'rgba(232, 202, 94, 0.15)',
        gpoBg: 'rgba(232, 202, 94, 0.08)',
        gpoBorder: 'rgba(232, 202, 94, 0.3)',
        gpoText: '#E8CA5E',
        collegeBg: 'rgba(232, 202, 94, 0.05)',
        collegeBorder: 'rgba(232, 202, 94, 0.2)',
        collegeText: 'rgba(232, 202, 94, 0.7)',
        liveColor: '#22c55e',
        liveBg: 'rgba(34,197,94,0.15)',
        wireColor: 'rgba(232, 202, 94, 0.8)',
        wireDim: 'rgba(232, 202, 94, 0)',
        pulseColor: 'rgba(232, 202, 94, 0.4)',
        doneColor: 'rgba(232, 202, 94, 0.2)',
      };
    } else {
      return {
        bg: '#FFFFFF',
        cardBg: '#FFFFFF',
        cardBorder: 'rgba(0, 0, 0, 0.06)',
        text: '#1F2937',
        textMuted: '#6B7280',
        heading: '#1F2937',
        accent: '#0066FF',
        accentLight: 'rgba(0, 102, 255, 0.08)',
        gpoBg: 'rgba(0, 102, 255, 0.06)',
        gpoBorder: 'rgba(0, 102, 255, 0.2)',
        gpoText: '#0066FF',
        collegeBg: 'rgba(0, 102, 255, 0.04)',
        collegeBorder: 'rgba(0, 102, 255, 0.15)',
        collegeText: 'rgba(0, 102, 255, 0.6)',
        liveColor: '#16a34a',
        liveBg: 'rgba(22,163,74,0.1)',
        wireColor: 'rgba(0, 102, 255, 0.7)',
        wireDim: 'rgba(0, 102, 255, 0)',
        pulseColor: 'rgba(0, 102, 255, 0.3)',
        doneColor: 'rgba(0, 102, 255, 0.15)',
      };
    }
  };

  const colors = getThemeColors();

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    typeTimersRef.current.forEach(clearTimeout);
    typeTimersRef.current = [];
  }, []);

  const t = useCallback((fn: () => void, ms: number) => {
    timerRef.current.push(setTimeout(fn, ms));
  }, []);

  const typeDescription = useCallback((cardIndex: number, text: string, delay: number): Promise<void> => {
    return new Promise((resolve) => {
      const descEl = document.getElementById(`dsc${cardIndex}`);
      if (!descEl) { resolve(); return; }
      
      descEl.textContent = "";
      let charIndex = 0;
      
      const typeChar = () => {
        if (charIndex < text.length) {
          descEl.textContent += text[charIndex];
          charIndex++;
          const timer = setTimeout(typeChar, 30);
          typeTimersRef.current.push(timer);
        } else {
          resolve();
        }
      };
      
      setTimeout(typeChar, delay);
    });
  }, []);

  const showCard = useCallback(
    async (i: number, delay: number) => {
      await new Promise<void>((resolve) => {
        t(() => {
          const card = document.getElementById("sc" + i);
          if (!card) { resolve(); return; }
          card.classList.add("hiw-visible", "hiw-pulse");
          
          typeDescription(i, STEPS[i].dsc, 400).then(() => {
            setTimeout(() => {
              card.classList.remove("hiw-pulse");
              card.classList.add("hiw-done");
            }, 300);
            resolve();
          });
        }, delay);
      });
    },
    [t, typeDescription]
  );

  const showDetail = useCallback((card: number, line: number) => {
    const d = document.getElementById(`dl${card}_${line}`);
    if (d) d.classList.add("hiw-dl-show");
  }, []);

  const build = useCallback(() => {
    clearTimers();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.innerHTML = "";

    const W = canvas.parentElement?.offsetWidth
      ? canvas.parentElement.offsetWidth - 40
      : 600;

    const GPO_W = 150, GPO_H = 135;
    const COL_W = 90,  COL_H = 65;
    const SW = 150,    SH = 195;
    const H = 480;
    canvas.style.height = `${H}px`;

    const gpoX = 0;
    const gpoY = (H - GPO_H) / 2;
    const gpoCX = gpoX + GPO_W;

    const colPos: ColPos[] = [
      { x: W * 0.22, y: H * 0.04 },
      { x: W * 0.22, y: H * 0.28 },
      { x: W * 0.22, y: H * 0.54 },
      { x: W * 0.22, y: H * 0.78 },
    ];

    // Calculate last card position - right edge with 0.1rem gap
    const gapFromRight = 1.6;
    const lastCardX = W - SW - gapFromRight;

    const stepPos: StepPos[] = [
      { x: W * 0.41,       y: H * 0.04 },
      { x: W * 0.41,       y: H * 0.52 },
      { x: W * 0.65,       y: H * 0.04 },
      { x: W * 0.65,       y: H * 0.52 },
      { x: lastCardX,      y: H * 0.27 },
    ];

    // ── SVG layer ──────────────────────────────────────────────────────────
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText = `position:absolute;top:0;left:0;width:${W}px;height:${H}px;pointer-events:none;overflow:visible`;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    canvas.appendChild(svg);

    // ── PSM Box ────────────────────────────────────────────────────────────
    const gpo = document.createElement("div");
    gpo.id = "hiw-gpo";
    gpo.style.cssText = `position:absolute;left:${gpoX}px;top:${gpoY}px;width:${GPO_W}px;height:${GPO_H}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-radius:16px;border:2px solid ${colors.gpoBorder};background:${colors.gpoBg};transition:border-color .4s,box-shadow .4s;font-family:'Poppins',sans-serif`;
    gpo.innerHTML = `
      <div style="font-size:22px;font-weight:800;color:${colors.gpoText};letter-spacing:1px;font-family:'Poppins',sans-serif">PSM</div>
      <div style="font-size:10px;color:${theme === 'dark' ? 'rgba(232,202,94,0.5)' : 'rgba(0,102,255,0.5)'};font-family:'Calibri Light',sans-serif">System</div>
      <div id="hiw-gpo-ring" style="width:8px;height:8px;border-radius:50%;background:${colors.accent};margin-top:2px;opacity:0;transition:opacity .4s"></div>
    `;
    canvas.appendChild(gpo);

    // ── College Nodes ──────────────────────────────────────────────────────
    COLLEGES.forEach((c, i) => {
      const d = document.createElement("div");
      d.id = "cn" + i;
      d.style.cssText = `position:absolute;left:${colPos[i].x}px;top:${colPos[i].y}px;width:${COL_W}px;height:${COL_H}px;border-radius:10px;border:1px solid ${colors.collegeBorder};background:${colors.collegeBg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;transition:border-color .3s,box-shadow .3s;font-family:'Poppins',sans-serif`;
      d.innerHTML = `<span style="font-size:19px">🎓</span><span style="font-size:9px;color:${colors.collegeText};font-weight:600;font-family:'Poppins',sans-serif">${c}</span>`;
      canvas.appendChild(d);
    });

    // ── Step Cards ─────────────────────────────────────────────────────────
    STEPS.forEach((s, i) => {
      const d = document.createElement("div");
      d.id = "sc" + i;
      
      d.style.cssText = `position:absolute;left:${stepPos[i].x}px;top:${stepPos[i].y}px;width:${SW}px;height:${SH}px;border-radius:14px;border:1px solid ${colors.cardBorder};background:${colors.cardBg};padding:16px 14px 14px;text-align:center;opacity:0;transform:scale(.94);transition:opacity .45s ease,transform .45s ease,border-color .3s,box-shadow .3s;backdrop-filter:blur(4px);font-family:'Poppins',sans-serif`;
      
      const details = s.details
        .map(
          (dt, j) =>
            `<div id="dl${i}_${j}" style="display:flex;align-items:center;gap:5px;margin-top:6px;opacity:0;transform:translateX(-4px);transition:opacity .3s,transform .3s;font-size:9px;color:${colors.textMuted};justify-content:center;font-family:'Calibri Light',sans-serif"><span style="width:5px;height:5px;border-radius:50%;background:${colors.accent};flex-shrink:0;display:inline-block"></span>${dt}</div>`
        )
        .join("");
      
      const badgeHtml = s.tag ? `
        <span id="tag${i}" style="display:inline-block;margin-top:8px;font-size:8.5px;font-weight:700;letter-spacing:1px;padding:2px 10px;border-radius:20px;background:${colors.liveBg};color:${colors.liveColor};opacity:0;transition:opacity .4s;font-family:'Poppins',sans-serif">${s.tag}</span>
      ` : '';
      
      d.innerHTML = `
        <div style="font-size:11px;font-weight:700;color:${colors.accent};letter-spacing:2px;margin-bottom:4px;font-family:'Poppins',sans-serif">${s.num}</div>
        <div style="font-size:12px;font-weight:700;color:${colors.text};margin-bottom:6px;line-height:1.2;font-family:'Poppins',sans-serif">${s.ttl}</div>
        <div id="dsc${i}" style="font-size:9.5px;color:${colors.textMuted};line-height:1.6;min-height:42px;font-family:'Calibri Light',sans-serif"></div>
        ${details}
        ${badgeHtml}
      `;
      canvas.appendChild(d);
    });

    // ── All wires start with opacity 0 ────────────────────────────────────
    const busX = gpoX + GPO_W + 8;
    const dim = 'rgba(0,0,0,0)';

    svgLine(svg, gpoCX, gpoY + GPO_H * 0.28, busX + 14, gpoY + GPO_H * 0.28, dim, "bt");
    svgLine(svg, busX + 14, gpoY + GPO_H * 0.28, busX + 14, colPos[0].y + COL_H / 2, dim, "bv0");
    svgLine(svg, busX + 14, colPos[0].y + COL_H / 2, colPos[0].x, colPos[0].y + COL_H / 2, dim, "bh0");
    svgLine(svg, busX + 14, gpoY + GPO_H * 0.28, busX + 14, colPos[1].y + COL_H / 2, dim, "bv1");
    svgLine(svg, busX + 14, colPos[1].y + COL_H / 2, colPos[1].x, colPos[1].y + COL_H / 2, dim, "bh1");

    svgLine(svg, gpoCX, gpoY + GPO_H * 0.72, busX + 14, gpoY + GPO_H * 0.72, dim, "bb");
    svgLine(svg, busX + 14, gpoY + GPO_H * 0.72, busX + 14, colPos[2].y + COL_H / 2, dim, "bv2");
    svgLine(svg, busX + 14, colPos[2].y + COL_H / 2, colPos[2].x, colPos[2].y + COL_H / 2, dim, "bh2");
    svgLine(svg, busX + 14, gpoY + GPO_H * 0.72, busX + 14, colPos[3].y + COL_H / 2, dim, "bv3");
    svgLine(svg, busX + 14, colPos[3].y + COL_H / 2, colPos[3].x, colPos[3].y + COL_H / 2, dim, "bh3");

    COLLEGES.forEach((_, i) => {
      svgCurve(svg, colPos[i].x + COL_W, colPos[i].y + COL_H / 2, stepPos[0].x, stepPos[0].y + SH / 2, dim, "cs" + i);
    });

    svgCurve(svg, stepPos[0].x + SW / 2, stepPos[0].y + SH, stepPos[1].x + SW / 2, stepPos[1].y, dim, "s01");
    svgCurve(svg, stepPos[1].x + SW, stepPos[1].y + SH / 2, stepPos[2].x, stepPos[2].y + SH / 2, dim, "s12");
    svgCurve(svg, stepPos[2].x + SW / 2, stepPos[2].y + SH, stepPos[3].x + SW / 2, stepPos[3].y, dim, "s23");
    svgCurve(svg, stepPos[3].x + SW, stepPos[3].y + SH / 2, stepPos[4].x + SW / 2, stepPos[4].y + SH / 2, dim, "s34");

    // ── Animation Sequence ─────────────────────────────────────────────────
    const cnOn = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.borderColor = colors.accent;
      el.style.boxShadow = `0 0 12px ${theme === 'dark' ? 'rgba(232,202,94,0.35)' : 'rgba(0,102,255,0.2)'}`;
    };

    // t=0: PSM on
    t(() => {
      const g = document.getElementById("hiw-gpo");
      const r = document.getElementById("hiw-gpo-ring");
      if (g) { 
        g.style.borderColor = colors.accent; 
        g.style.boxShadow = `0 0 30px ${theme === 'dark' ? 'rgba(232,202,94,0.4)' : 'rgba(0,102,255,0.25)'},0 0 70px ${theme === 'dark' ? 'rgba(232,202,94,0.1)' : 'rgba(0,102,255,0.08)'}`; 
      }
      if (r) { r.style.opacity = "1"; r.style.animation = "hiw-ring-pulse 1s ease-in-out infinite"; }
    }, 0);

    // t=500: top bus
    t(() => { 
      const wireColor = colors.wireColor;
      ["bt","bv0","bh0","bv1","bh1"].forEach(w => activateWire(w, wireColor)); 
    }, 500);
    t(() => { cnOn("cn0"); setTimeout(() => cnOn("cn1"), 180); }, 900);

    // t=1200: bottom bus
    t(() => { 
      const wireColor = colors.wireColor;
      ["bb","bv2","bh2","bv3","bh3"].forEach(w => activateWire(w, wireColor)); 
    }, 1200);
    t(() => { cnOn("cn2"); setTimeout(() => cnOn("cn3"), 180); }, 1550);

    // t=2000: col → step0 wires
    t(() => { 
      const wireColor = colors.wireColor;
      ["cs0","cs1","cs2","cs3"].forEach(w => activateWire(w, wireColor)); 
    }, 2000);

    // t=2400: Template Selection
    t(async () => {
      await showCard(0, 0);
      
      t(() => { activateWire("s01", colors.wireColor); }, 300);
      
      t(async () => {
        await showCard(1, 0);
        setTimeout(() => showDetail(1, 0), 400);
        setTimeout(() => showDetail(1, 1), 800);
        
        t(() => { activateWire("s12", colors.wireColor); }, 300);
        
        t(async () => {
          await showCard(2, 0);
          setTimeout(() => showDetail(2, 0), 400);
          setTimeout(() => showDetail(2, 1), 800);
          
          t(() => { activateWire("s23", colors.wireColor); }, 300);
          
          t(async () => {
            await showCard(3, 0);
            setTimeout(() => showDetail(3, 0), 400);
            setTimeout(() => showDetail(3, 1), 800);
            
            t(() => { activateWire("s34", colors.wireColor); }, 300);
            
            t(async () => {
              await showCard(4, 0);
              setTimeout(() => { 
                const tag = document.getElementById("tag4"); 
                if (tag) tag.style.opacity = "1"; 
              }, 600);
              
              t(() => { build(); }, 3000);
            }, 100);
          }, 100);
        }, 100);
      }, 100);
    }, 2400);

  }, [clearTimers, t, showCard, showDetail, theme, colors]);

  useEffect(() => {
    build();
    const handleResize = () => build();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimers();
      window.removeEventListener("resize", handleResize);
    };
  }, [build, clearTimers]);

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes hiw-ring-pulse {
          0%,100%{transform:scale(1);opacity:1}
          50%{transform:scale(.6);opacity:.3}
        }
        @keyframes hiw-dash-flow {
          to{stroke-dashoffset:-18}
        }
        .hiw-live-wire {
          animation: hiw-dash-flow .55s linear infinite !important;
        }
        .hiw-visible {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        .hiw-pulse {
          border-color: ${theme === 'dark' ? 'rgba(232,202,94,0.8)' : 'rgba(0,102,255,0.6)'} !important;
          box-shadow: 0 0 22px ${theme === 'dark' ? 'rgba(232,202,94,0.3)' : 'rgba(0,102,255,0.2)'} !important;
        }
        .hiw-done {
          border-color: ${theme === 'dark' ? 'rgba(232,202,94,0.25)' : 'rgba(0,102,255,0.15)'} !important;
        }
        .hiw-dl-show {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>

      <div className="w-full rounded-2xl px-5 pb-12"
        style={{ backgroundColor: colors.bg }}
      >
        {/* Heading */}
        <div className="mb-7 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[3px]"
            style={{ 
              color: colors.accent,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            System Overview
          </span>
          <h2 className={`mt-2 text-3xl font-extrabold`}
            style={{ 
              color: colors.text,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            How It{" "}
            <span style={{ color: colors.accent }}>
              Works
            </span>
          </h2>
        </div>

        {/* Canvas — JS draws everything inside here */}
        <div ref={canvasRef} className="relative w-full" />
      </div>
    </>
  );
}