"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SocialProofBarMobile from "./landing/SocialProofBarMobile";

export default function SocialProofBar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [countersStarted, setCountersStarted] = useState(false);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  useEffect(() => {
    const checkTheme = () => setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    checkTheme();
    const observer = new MutationObserver(() => checkTheme());
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && !countersStarted) {
      setCountersStarted(true);
    }
  }, [isInView, countersStarted]);

  // Main drawing function
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const context = ctx;
    // Make canvas responsive - use container width
    const container = canvas.parentElement;
    const containerWidth = container ? container.clientWidth : 1200;
    // Calculate height based on aspect ratio (1200:480 = 2.5:1)
    const aspectRatio = 1200 / 480;
    const W = containerWidth;
    const H = W / aspectRatio;
    
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.borderRadius = "12px";
    canvas.style.cursor = "pointer";

    // ── FLAT BACKGROUND with subtle gradient for depth ──
    if (theme === 'dark') {
      context.fillStyle = '#0B0F19';
      context.fillRect(0, 0, W, H);
    } else {
      // Light mode: subtle gradient for depth
      const gradient = context.createLinearGradient(0, 0, 0, H);
      gradient.addColorStop(0, '#F8FAFF');
      gradient.addColorStop(0.5, '#F4F7FC');
      gradient.addColorStop(1, '#EEF2F7');
      context.fillStyle = gradient;
      context.fillRect(0, 0, W, H);
      
      // Subtle decorative dots for light mode depth
      context.fillStyle = 'rgba(59, 130, 246, 0.03)';
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        context.beginPath();
        context.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
        context.fill();
      }
    }

    // ── MAP DOTS ──
    (function () {
      const dotColor = theme === 'dark' ? 'rgba(45,110,158,0.15)' : 'rgba(59,130,246,0.06)';
      context.fillStyle = dotColor;
      function d(x: number, y: number) {
        context.beginPath();
        context.arc(x, y, 2.2, 0, Math.PI * 2);
        context.fill();
      }
      const tl = [
        [22, 38], [48, 38], [74, 38], [100, 38], [126, 38], [152, 38], [178, 38],
        [22, 64], [48, 64], [74, 64], [100, 64], [126, 64], [152, 64],
        [22, 90], [48, 90], [74, 90], [100, 90], [126, 90],
        [22, 116], [48, 116], [74, 116], [100, 116],
        [22, 142], [48, 142], [74, 142]
      ];
      tl.forEach((p) => d(p[0], p[1]));
      for (let r = 0; r < 6; r++)
        for (let c = 0; c < 16; c++)
          if ((r + c) % 2 === 0 || r < 3) d(660 + c * 30, 34 + r * 28);
      for (let r = 0; r < 5; r++)
        for (let c = 0; c < 16; c++) if ((r + c) % 2 === 0) d(670 + c * 28, 340 + r * 28);
      [[22, 348], [48, 348], [22, 374], [48, 374], [74, 374], [22, 400]].forEach((p) => d(p[0], p[1]));
    })();

    // ── HELPERS ──
    function hexPts(cx: number, cy: number, r: number) {
      const p: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
      return p;
    }

    function roundPolygon(ctxParam: CanvasRenderingContext2D, pts: [number, number][], radius: number) {
      if (pts.length < 3) return;
      ctxParam.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const p1 = pts[i];
        const p2 = pts[(i + 1) % pts.length];
        const p0 = pts[(i - 1 + pts.length) % pts.length];
        
        const dx1 = p1[0] - p0[0], dy1 = p1[1] - p0[1];
        const dx2 = p2[0] - p1[0], dy2 = p2[1] - p1[1];
        const len1 = Math.sqrt(dx1*dx1 + dy1*dy1);
        const len2 = Math.sqrt(dx2*dx2 + dy2*dy2);
        
        if (len1 === 0 || len2 === 0) continue;
        
        const r1 = Math.min(radius, len1/2);
        const r2 = Math.min(radius, len2/2);
        
        const cx1 = p1[0] - (dx1/len1) * r1;
        const cy1 = p1[1] - (dy1/len1) * r1;
        const cx2 = p1[0] + (dx2/len2) * r2;
        const cy2 = p1[1] + (dy2/len2) * r2;
        
        if (i === 0) {
          ctxParam.moveTo(cx1, cy1);
        }
        ctxParam.lineTo(cx1, cy1);
        ctxParam.quadraticCurveTo(p1[0], p1[1], cx2, cy2);
      }
      ctxParam.closePath();
    }

    function octPts(cx: number, cy: number, r: number) {
      const p: [number, number][] = [];
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 - Math.PI / 8;
        p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
      return p;
    }

    function mid(a: [number, number], b: [number, number]): [number, number] {
      return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    }

    function polyRounded(
      pts: [number, number][],
      fill: string | null,
      sc: string | null,
      sw: number,
      gc: string | null,
      gb: number,
      radius: number = 10
    ) {
      context.save();
      if (gc) {
        context.shadowColor = gc;
        context.shadowBlur = gb || 22;
      }
      roundPolygon(context, pts, radius);
      if (fill) {
        context.fillStyle = fill;
        context.fill();
      }
      if (sc) {
        context.strokeStyle = sc;
        context.lineWidth = sw;
        context.stroke();
      }
      context.restore();
    }

    // ── GLOW CURVE LINE - Improved for light mode ──
    function gCurve(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      cp1x: number,
      cp1y: number,
      cp2x: number,
      cp2y: number
    ) {
      const steps = 80;
      const colors = theme === 'dark' 
        ? ['rgba(0,210,255,', 'rgba(0,230,255,', 'rgba(200,248,255,']
        : ['rgba(59,130,246,', 'rgba(96,165,250,', 'rgba(147,197,253,'];
      const shadowColor = theme === 'dark' ? '#00ddff' : '#3B82F6';
      const glowIntensity = theme === 'dark' ? [16, 8, 4] : [8, 4, 2];
      const alphaMultiplier = theme === 'dark' ? 1 : 0.6;
      
      for (let pass = 0; pass < 3; pass++) {
        const width = [9, 3.5, 1.6][pass];
        context.save();
        context.shadowColor = shadowColor;
        context.shadowBlur = glowIntensity[pass];
        context.lineCap = "round";
        for (let i = 0; i < steps; i++) {
          const t0 = i / steps,
            t1 = (i + 1) / steps;
          const tm = (t0 + t1) / 2;
          const fade = Math.sin(tm * Math.PI);
          const alpha = [0.07, 0.3, 1.0][pass] * fade * alphaMultiplier;
          context.strokeStyle = colors[pass] + alpha + ")";
          context.lineWidth = width;
          function bp(t: number) {
            const mt = 1 - t;
            return [
              mt * mt * mt * x1 + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * x2,
              mt * mt * mt * y1 + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * y2,
            ];
          }
          const p0 = bp(t0),
            p1 = bp(t1);
          context.beginPath();
          context.moveTo(p0[0], p0[1]);
          context.lineTo(p1[0], p1[1]);
          context.stroke();
        }
        context.restore();
      }
    }

    // ── ICONS with better visibility in light mode ──
    function iHandshake(cx: number, cy: number, scale: number = 1, offsetY: number = 0) {
      const color = theme === 'dark' ? '#5bc9fb' : '#3B82F6';
      const y0 = cy + 44 + offsetY;
      context.save();
      context.translate(cx, cy);
      context.scale(scale, scale);
      context.translate(-cx, -cy);
      context.strokeStyle = color;
      context.lineWidth = 1.8;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = color;
      context.shadowBlur = theme === 'dark' ? 6 : 4;
      context.beginPath();
      context.moveTo(cx - 22, y0 + 5);
      context.lineTo(cx - 11, y0 - 1);
      context.quadraticCurveTo(cx, y0 - 10, cx + 11, y0 - 1);
      context.lineTo(cx + 22, y0 + 5);
      context.stroke();
      context.beginPath();
      context.moveTo(cx - 11, y0 - 1);
      context.quadraticCurveTo(cx, y0 + 10, cx + 11, y0 - 1);
      context.stroke();
      context.restore();
    }

    function iDocs(cx: number, cy: number, scale: number = 1, offsetY: number = 0) {
      const color = theme === 'dark' ? '#5bc9fb' : '#3B82F6';
      context.save();
      context.translate(cx, cy);
      context.scale(scale, scale);
      context.translate(-cx, -cy);
      context.strokeStyle = color;
      context.lineWidth = 1.5;
      context.lineCap = "round";
      context.shadowColor = color;
      context.shadowBlur = theme === 'dark' ? 5 : 3;
      const bx = cx - 12,
        by = cy + 24 + offsetY;
      context.strokeRect(bx + 7, by + 5, 18, 20);
      const fillColor = theme === 'dark' ? '#0b1d38' : '#F0F4FF';
      context.fillStyle = fillColor;
      context.fillRect(bx, by, 18, 20);
      context.strokeRect(bx, by, 18, 20);
      [5, 10, 15].forEach((dy) => {
        context.beginPath();
        context.moveTo(bx + 3, by + dy);
        context.lineTo(bx + 15, by + dy);
        context.stroke();
      });
      context.restore();
    }

    function iPeople(cx: number, cy: number, scale: number = 1, offsetY: number = 0) {
      const color = theme === 'dark' ? '#5bc9fb' : '#3B82F6';
      const y0 = cy + 24 + offsetY;
      context.save();
      context.translate(cx, cy);
      context.scale(scale, scale);
      context.translate(-cx, -cy);
      context.strokeStyle = color;
      context.lineWidth = 1.5;
      context.lineCap = "round";
      context.shadowColor = color;
      context.shadowBlur = theme === 'dark' ? 5 : 3;
      context.beginPath();
      context.arc(cx - 16, y0, 5.5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.arc(cx, y0 - 2, 6, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.arc(cx + 16, y0, 5.5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(cx - 24, y0 + 19);
      context.quadraticCurveTo(cx - 16, y0 + 10, cx - 8, y0 + 14);
      context.stroke();
      context.beginPath();
      context.moveTo(cx - 10, y0 + 19);
      context.quadraticCurveTo(cx, y0 + 10, cx + 10, y0 + 19);
      context.stroke();
      context.beginPath();
      context.moveTo(cx + 8, y0 + 14);
      context.quadraticCurveTo(cx + 16, y0 + 10, cx + 24, y0 + 19);
      context.stroke();
      context.restore();
    }

    function iArrow(cx: number, cy: number, scale: number = 1) {
      const color = theme === 'dark' ? '#5bc9fb' : '#3B82F6';
      const y0 = cy + 40;
      context.save();
      context.translate(cx, cy);
      context.scale(scale, scale);
      context.translate(-cx, -cy);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = color;
      context.shadowBlur = theme === 'dark' ? 7 : 4;
      context.beginPath();
      context.moveTo(cx - 19, y0 + 8);
      context.lineTo(cx - 6, y0 - 5);
      context.lineTo(cx + 4, y0 + 4);
      context.lineTo(cx + 19, y0 - 14);
      context.stroke();
      context.beginPath();
      context.moveTo(cx + 10, y0 - 14);
      context.lineTo(cx + 19, y0 - 14);
      context.lineTo(cx + 19, y0 - 6);
      context.stroke();
      context.restore();
    }

    function drawHexRounded(
      cx: number,
      cy: number,
      R: number,
      Ri: number,
      label: string,
      val: string,
      icon: (cx: number, cy: number, scale: number, offsetY?: number) => void,
      labelOffY: number,
      valOffY: number,
      labelSize: number = 13,
      valSize: number = 34,
      boxIndex: number | null = null,
      iconOffsetY: number = 0
    ) {
      const fillColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      const strokeColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      const innerStroke = theme === 'dark' ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.7)';
      // ✅ Full Black in light mode, White in dark mode
      const labelColor = theme === 'dark' ? '#93C5FD' : '#000000';
      const valColor = theme === 'dark' ? '#FFFFFF' : '#000000';
      const shadowColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      
      const isHovered = hoveredBox === boxIndex;
      const glowIntensity = isHovered ? 50 : (theme === 'dark' ? 16 : 6);
      const shadowOpacity = theme === 'dark' ? 1 : 0.5;
      
      const op = hexPts(cx, cy, R);
      const ip = hexPts(cx, cy, Ri);
      
      polyRounded(op, fillColor, strokeColor, theme === 'dark' ? 1.5 : 1, shadowColor, glowIntensity * shadowOpacity, 12);
      
      // Light mode: subtle card shadow for depth
      if (theme === 'light') {
        context.save();
        context.shadowColor = 'rgba(0,0,0,0.06)';
        context.shadowBlur = 16;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        roundPolygon(context, op, 12);
        context.fillStyle = 'transparent';
        context.fill();
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1;
        context.stroke();
        context.restore();
      }
      
      polyRounded(ip, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 8);
      
      context.save();
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.font = `${labelSize}px Arial,sans-serif`;
      context.fillText(label, cx, cy + (labelOffY || 0));
      context.fillStyle = valColor;
      context.font = `bold ${valSize}px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText(val, cx, cy + (valOffY || 0));
      context.restore();
      
      icon(cx, cy, 0.85, iconOffsetY);
    }

    // ══════════════════════════════════
    //  LAYOUT - Smaller boxes
    // ══════════════════════════════════

    const R = 72;
    const Ri = 60;
    const offsetX = 120;
    const BOTTOM_PUSH = 10;

    // CENTER OCTAGON
    const TW = { cx: 510 + offsetX, cy: 230 + BOTTOM_PUSH };
    const TWr = 125,
      TWri = 108;
    const twP = octPts(TW.cx, TW.cy, TWr);
    const twPi = octPts(TW.cx, TW.cy, TWri);
    
    const twLMOriginal = mid(twP[4], twP[5]);
    const twLM: [number, number] = [
      twLMOriginal[0],
      twLMOriginal[1] + 30
    ];
    
    const twUpperEdge = mid(twP[6], twP[7]);
    
    const twActiveUsersPoint: [number, number] = [
      twUpperEdge[0] + 20,
      twUpperEdge[1] + 40
    ];
    
    const twTemplatesPoint: [number, number] = [
      twUpperEdge[0] - 20,
      twUpperEdge[1] + 155
    ];

    // CLIENTS - Box 0
    const CL = { cx: 100 + offsetX, cy: 218 + BOTTOM_PUSH };
    const clP = hexPts(CL.cx, CL.cy, R);
    const clRight = clP[0];

    // TEMPLATES - Box 1
    const TP = { cx: 240 + offsetX, cy: 318 + BOTTOM_PUSH };
    const tpP = hexPts(TP.cx, TP.cy, R);
    const tpTopLeft = tpP[5];
    const tpTopRight = tpP[0];
    const tpTopOffset = mid(tpTopLeft, tpTopRight);
    const tpStartPoint: [number, number] = [
      tpTopOffset[0],
      tpTopOffset[1] + 32
    ];

    // ACTIVE USERS - Box 2
    const AU = { cx: 780 + offsetX, cy: 142 + BOTTOM_PUSH };
    const auP = hexPts(AU.cx, AU.cy, R);
    const auLeft = auP[3];

    // SUCCESS RATE - Box 3
    const SR = { cx: 920 + offsetX, cy: 245 + BOTTOM_PUSH };
    const srP = hexPts(SR.cx, SR.cy, R);
    const srLeft = srP[3];

    // ── CONNECTIONS ──
    {
      const x1 = clRight[0], y1 = clRight[1];
      const x2 = srLeft[0], y2 = srLeft[1];
      const cx = twLM[0], cy = twLM[1];
      gCurve(x1, y1, x2, y2, cx - 30, y1 + 10, cx + 30, y2 - 10);
    }

    {
      const x1 = tpStartPoint[0], y1 = tpStartPoint[1];
      const x2 = twTemplatesPoint[0], y2 = twTemplatesPoint[1];
      gCurve(x1, y1, x2, y2, x1 + 40, y1 - 10, x2 - 30, y2 + 15);
    }

    {
      const x1 = twActiveUsersPoint[0], y1 = twActiveUsersPoint[1];
      const x2 = auLeft[0], y2 = auLeft[1];
      gCurve(x1, y1, x2, y2, x1 + 50, y1 - 20, x2 - 60, y2 - 10);
    }

    // ── DRAW BOXES ──

    // 1. CLIENTS (Box 0)
    drawHexRounded(
      CL.cx, CL.cy, R, Ri, 
      "Clients", countersStarted ? "35+" : "0", 
      iHandshake, -28, 18, 13, 32, 0, -14
    );

    // 2. TEMPLATES (Box 1)
    {
      const fillColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      const strokeColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      const innerStroke = theme === 'dark' ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.7)';
      // ✅ Full Black in light mode, White in dark mode
      const labelColor = theme === 'dark' ? '#93C5FD' : '#000000';
      const valColor = theme === 'dark' ? '#FFFFFF' : '#000000';
      
      const isHovered = hoveredBox === 1;
      const glowIntensity = isHovered ? 50 : (theme === 'dark' ? 16 : 6);
      const shadowOpacity = theme === 'dark' ? 1 : 0.5;
      
      const tpP_rounded = hexPts(TP.cx, TP.cy, R);
      const tpPi_rounded = hexPts(TP.cx, TP.cy, Ri);
      polyRounded(tpP_rounded, fillColor, strokeColor, theme === 'dark' ? 1.5 : 1, '#3B82F6', glowIntensity * shadowOpacity, 12);
      
      if (theme === 'light') {
        context.save();
        context.shadowColor = 'rgba(0,0,0,0.06)';
        context.shadowBlur = 16;
        context.shadowOffsetY = 4;
        roundPolygon(context, tpP_rounded, 12);
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1;
        context.stroke();
        context.restore();
      }
      
      polyRounded(tpPi_rounded, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 8);
      context.save();
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.font = `13px Arial,sans-serif`;
      context.fillText("Templates", TP.cx, TP.cy - 28);
      context.fillStyle = valColor;
      context.font = `bold 30px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText(countersStarted ? "15+" : "0", TP.cx, (TP.cy + 12));
      context.restore();
      iDocs(TP.cx, TP.cy, 0.85, -8);
    }

    // CENTER OCTAGON
    {
      const fillColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      const strokeColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      const innerStroke = theme === 'dark' ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.7)';
      // ✅ Full Black in light mode, White in dark mode
      const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
      
      const twP_rounded = octPts(TW.cx, TW.cy, TWr);
      const twPi_rounded = octPts(TW.cx, TW.cy, TWri);
      const glowIntensity = theme === 'dark' ? 40 : 12;
      const shadowOpacity = theme === 'dark' ? 1 : 0.5;
      
      polyRounded(twP_rounded, fillColor, strokeColor, theme === 'dark' ? 1.5 : 1, '#3B82F6', glowIntensity * shadowOpacity, 14);
      
      if (theme === 'light') {
        context.save();
        context.shadowColor = 'rgba(0,0,0,0.06)';
        context.shadowBlur = 20;
        context.shadowOffsetY = 4;
        roundPolygon(context, twP_rounded, 14);
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1;
        context.stroke();
        context.restore();
      }
      
      polyRounded(twPi_rounded, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 10);
      context.save();
      context.textAlign = "center";
      context.fillStyle = textColor;
      context.font = "bold 26px Arial,sans-serif";
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText("TRUSTED", TW.cx, TW.cy - 4);
      context.fillText("WORLDWIDE", TW.cx, TW.cy + 36);
      context.restore();
    }

    // 3. ACTIVE USERS (Box 2)
    {
      const fillColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      const strokeColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      const innerStroke = theme === 'dark' ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.7)';
      // ✅ Full Black in light mode, White in dark mode
      const labelColor = theme === 'dark' ? '#93C5FD' : '#000000';
      const valColor = theme === 'dark' ? '#FFFFFF' : '#000000';
      
      const isHovered = hoveredBox === 2;
      const glowIntensity = isHovered ? 50 : (theme === 'dark' ? 16 : 6);
      const shadowOpacity = theme === 'dark' ? 1 : 0.5;
      
      const auP_rounded = hexPts(AU.cx, AU.cy, R);
      const auPi_rounded = hexPts(AU.cx, AU.cy, Ri);
      polyRounded(auP_rounded, fillColor, strokeColor, theme === 'dark' ? 1.5 : 1, '#3B82F6', glowIntensity * shadowOpacity, 12);
      
      if (theme === 'light') {
        context.save();
        context.shadowColor = 'rgba(0,0,0,0.06)';
        context.shadowBlur = 16;
        context.shadowOffsetY = 4;
        roundPolygon(context, auP_rounded, 12);
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1;
        context.stroke();
        context.restore();
      }
      
      polyRounded(auPi_rounded, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 8);
      context.save();
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.font = `12px Arial,sans-serif`;
      context.fillText("Active Users", AU.cx, (AU.cy - 28));
      context.fillStyle = valColor;
      context.font = `bold 28px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText(countersStarted ? "1500+" : "0", AU.cx, (AU.cy + 10));
      context.restore();
      iPeople(AU.cx, AU.cy - 10, 0.85, 12);
    }

    // 4. SUCCESS RATE (Box 3)
    {
      const fillColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      const strokeColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      const innerStroke = theme === 'dark' ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.7)';
      // ✅ Full Black in light mode, White in dark mode
      const labelColor = theme === 'dark' ? '#93C5FD' : '#000000';
      const valColor = theme === 'dark' ? '#FFFFFF' : '#000000';
      
      const isHovered = hoveredBox === 3;
      const glowIntensity = isHovered ? 50 : (theme === 'dark' ? 16 : 6);
      const shadowOpacity = theme === 'dark' ? 1 : 0.5;
      
      const srP_rounded = hexPts(SR.cx, SR.cy, R);
      const srPi_rounded = hexPts(SR.cx, SR.cy, Ri);
      polyRounded(srP_rounded, fillColor, strokeColor, theme === 'dark' ? 1.5 : 1, '#3B82F6', glowIntensity * shadowOpacity, 12);
      
      if (theme === 'light') {
        context.save();
        context.shadowColor = 'rgba(0,0,0,0.06)';
        context.shadowBlur = 16;
        context.shadowOffsetY = 4;
        roundPolygon(context, srP_rounded, 12);
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1;
        context.stroke();
        context.restore();
      }
      
      polyRounded(srPi_rounded, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 8);
      context.save();
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.font = `13px Arial,sans-serif`;
      context.fillText("Success Rate", SR.cx, SR.cy - 26);
      context.fillStyle = valColor;
      context.font = `bold 32px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText(countersStarted ? "97%" : "0%", SR.cx, SR.cy + 16);
      context.restore();
      iArrow(SR.cx, SR.cy, 0.85);
    }
  };

  // Redraw when hover changes
  useEffect(() => {
    drawCanvas();
  }, [theme, isInView, countersStarted, hoveredBox]);

  // Mouse event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;
      
      const offsetX = 120;
      const BOTTOM_PUSH = 10;
      const boxes = [
        { cx: 100 + offsetX, cy: 218 + BOTTOM_PUSH, R: 72, index: 0 },
        { cx: 240 + offsetX, cy: 318 + BOTTOM_PUSH, R: 72, index: 1 },
        { cx: 780 + offsetX, cy: 142 + BOTTOM_PUSH, R: 72, index: 2 },
        { cx: 920 + offsetX, cy: 245 + BOTTOM_PUSH, R: 72, index: 3 },
      ];
      
      let foundIndex: number | null = null;
      for (const box of boxes) {
        const dist = Math.sqrt((mouseX - box.cx) ** 2 + (mouseY - box.cy) ** 2);
        if (dist < box.R * 1.2) {
          foundIndex = box.index;
          break;
        }
      }
      
      setHoveredBox(foundIndex);
      canvas.style.cursor = foundIndex !== null ? 'pointer' : 'default';
    };

    const handleMouseLeave = () => {
      setHoveredBox(null);
      canvas.style.cursor = 'default';
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#F8FAFF';

  return (
    <>
      <motion.div
        ref={sectionRef}
        className="relative w-full overflow-hidden hidden md:block"
        style={{ backgroundColor: getBgColor() }}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-full flex justify-center">
          <canvas
            ref={canvasRef}
            className="w-full max-w-full"
            style={{
              borderRadius: "12px",
              display: "block",
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
              cursor: "pointer",
            }}
          />
        </div>
      </motion.div>

      <div className="block md:hidden">
        <SocialProofBarMobile />
      </div>
    </>
  );
}