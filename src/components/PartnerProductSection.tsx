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

  // ─── FIXED: Theme detection with immediate update ──────────────────────────
  const checkTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      document.documentElement.classList.toggle('dark', defaultTheme === 'dark');
    }
  };

  useEffect(() => {
    // Initial theme check
    checkTheme();

    // Listen for localStorage changes from navbar
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue as 'light' | 'dark' | null;
        if (newTheme) {
          setTheme(newTheme);
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
      }
    };

    // Listen for class changes on document element (as fallback)
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    window.addEventListener('storage', handleStorageChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isInView && !countersStarted) {
      setCountersStarted(true);
    }
  }, [isInView, countersStarted]);

  // Main drawing function - SAME AS BEFORE
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const context = ctx;
    
    const container = canvas.parentElement;
    const containerWidth = container ? container.clientWidth : 1200;
    
    const aspectRatio = 1200 / 480;
    const W = containerWidth;
    const H = W / aspectRatio;
    
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";

    // ── FLAT BACKGROUND ──
    if (theme === 'dark') {
      context.fillStyle = '#0B0F19';
      context.fillRect(0, 0, W, H);
    } else {
      context.fillStyle = '#F8FAFF';
      context.fillRect(0, 0, W, H);
    }

    // ── SCALE FACTOR ──
    const scale = W / 1200;
    
    // ── CENTER OFFSET ──
    const centerOffset = (W - 1200 * scale) / 2 - 25;

    // ── HELPERS ──
    function hexPts(cx: number, cy: number, r: number) {
      const p: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        p.push([
          cx * scale + r * scale * Math.cos(a) + centerOffset,
          cy * scale + r * scale * Math.sin(a)
        ]);
      }
      return p;
    }

    function octPts(cx: number, cy: number, r: number) {
      const p: [number, number][] = [];
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 - Math.PI / 8;
        p.push([
          cx * scale + r * scale * Math.cos(a) + centerOffset,
          cy * scale + r * scale * Math.sin(a)
        ]);
      }
      return p;
    }

    function mid(a: [number, number], b: [number, number]): [number, number] {
      return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
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
        
        const r1 = Math.min(radius * scale, len1/2);
        const r2 = Math.min(radius * scale, len2/2);
        
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
        context.shadowBlur = gb * scale || 22 * scale;
      }
      roundPolygon(context, pts, radius);
      if (fill) {
        context.fillStyle = fill;
        context.fill();
      }
      if (sc) {
        context.strokeStyle = sc;
        context.lineWidth = sw * scale;
        context.stroke();
      }
      context.restore();
    }

    // ── GLOW CURVE LINE ──
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
        const width = [9 * scale, 3.5 * scale, 1.6 * scale][pass];
        context.save();
        context.shadowColor = shadowColor;
        context.shadowBlur = glowIntensity[pass] * scale;
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

    // ── ICONS ──
    function iHandshake(cx: number, cy: number, scaleFactor: number = 1, offsetY: number = 0) {
      const color = theme === 'dark' ? '#5bc9fb' : '#3B82F6';
      const scx = cx * scale + centerOffset, scy = cy * scale;
      const y0 = scy + 44 * scale + offsetY * scale;
      context.save();
      context.translate(scx, scy);
      context.scale(scaleFactor * scale, scaleFactor * scale);
      context.translate(-scx, -scy);
      context.strokeStyle = color;
      context.lineWidth = 1.8;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = color;
      context.shadowBlur = (theme === 'dark' ? 6 : 4);
      context.beginPath();
      context.moveTo(scx - 22, y0 + 5);
      context.lineTo(scx - 11, y0 - 1);
      context.quadraticCurveTo(scx, y0 - 10, scx + 11, y0 - 1);
      context.lineTo(scx + 22, y0 + 5);
      context.stroke();
      context.beginPath();
      context.moveTo(scx - 11, y0 - 1);
      context.quadraticCurveTo(scx, y0 + 10, scx + 11, y0 - 1);
      context.stroke();
      context.restore();
    }

    function iDocs(cx: number, cy: number, scaleFactor: number = 1, offsetY: number = 0) {
      const color = theme === 'dark' ? '#5bc9fb' : '#3B82F6';
      const scx = cx * scale + centerOffset, scy = cy * scale;
      context.save();
      context.translate(scx, scy);
      context.scale(scaleFactor * scale, scaleFactor * scale);
      context.translate(-scx, -scy);
      context.strokeStyle = color;
      context.lineWidth = 1.5;
      context.lineCap = "round";
      context.shadowColor = color;
      context.shadowBlur = (theme === 'dark' ? 5 : 3);
      const bx = scx - 12,
        by = scy + 24 + offsetY;
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

    function iPeople(cx: number, cy: number, scaleFactor: number = 1, offsetY: number = 0) {
      const color = theme === 'dark' ? '#5bc9fb' : '#3B82F6';
      const scx = cx * scale + centerOffset, scy = cy * scale;
      const y0 = scy + 24 * scale + offsetY * scale;
      context.save();
      context.translate(scx, scy);
      context.scale(scaleFactor * scale, scaleFactor * scale);
      context.translate(-scx, -scy);
      context.strokeStyle = color;
      context.lineWidth = 1.5;
      context.lineCap = "round";
      context.shadowColor = color;
      context.shadowBlur = (theme === 'dark' ? 5 : 3);
      context.beginPath();
      context.arc(scx - 16, y0, 5.5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.arc(scx, y0 - 2, 6, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.arc(scx + 16, y0, 5.5, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(scx - 24, y0 + 19);
      context.quadraticCurveTo(scx - 16, y0 + 10, scx - 8, y0 + 14);
      context.stroke();
      context.beginPath();
      context.moveTo(scx - 10, y0 + 19);
      context.quadraticCurveTo(scx, y0 + 10, scx + 10, y0 + 19);
      context.stroke();
      context.beginPath();
      context.moveTo(scx + 8, y0 + 14);
      context.quadraticCurveTo(scx + 16, y0 + 10, scx + 24, y0 + 19);
      context.stroke();
      context.restore();
    }

    function iArrow(cx: number, cy: number, scaleFactor: number = 1) {
      const color = theme === 'dark' ? '#5bc9fb' : '#3B82F6';
      const scx = cx * scale + centerOffset, scy = cy * scale;
      const y0 = scy + 40 * scale;
      context.save();
      context.translate(scx, scy);
      context.scale(scaleFactor * scale, scaleFactor * scale);
      context.translate(-scx, -scy);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = color;
      context.shadowBlur = (theme === 'dark' ? 7 : 4);
      context.beginPath();
      context.moveTo(scx - 19, y0 + 8);
      context.lineTo(scx - 6, y0 - 5);
      context.lineTo(scx + 4, y0 + 4);
      context.lineTo(scx + 19, y0 - 14);
      context.stroke();
      context.beginPath();
      context.moveTo(scx + 10, y0 - 14);
      context.lineTo(scx + 19, y0 - 14);
      context.lineTo(scx + 19, y0 - 6);
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
      const labelColor = theme === 'dark' ? '#93C5FD' : '#000000';
      const valColor = theme === 'dark' ? '#FFFFFF' : '#000000';
      const shadowColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      
      const isHovered = hoveredBox === boxIndex;
      const glowIntensity = isHovered ? 50 : (theme === 'dark' ? 16 : 6);
      const shadowOpacity = theme === 'dark' ? 1 : 0.5;
      
      const op = hexPts(cx, cy, R);
      const ip = hexPts(cx, cy, Ri);
      
      polyRounded(op, fillColor, strokeColor, theme === 'dark' ? 1.5 : 1, shadowColor, glowIntensity * shadowOpacity, 12);
      
      if (theme === 'light') {
        context.save();
        context.shadowColor = 'rgba(0,0,0,0.06)';
        context.shadowBlur = 16 * scale;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4 * scale;
        roundPolygon(context, op, 12);
        context.fillStyle = 'transparent';
        context.fill();
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1 * scale;
        context.stroke();
        context.restore();
      }
      
      polyRounded(ip, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 8);
      
      context.save();
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.font = `${labelSize * scale}px Arial,sans-serif`;
      context.fillText(label, cx * scale + centerOffset, cy * scale + labelOffY * scale);
      context.fillStyle = valColor;
      context.font = `bold ${valSize * scale}px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText(val, cx * scale + centerOffset, cy * scale + valOffY * scale);
      context.restore();
      
      icon(cx, cy, 0.85, iconOffsetY);
    }

    // ══════════════════════════════════
    //  LAYOUT
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
      twLMOriginal[1] + 30 * scale
    ];
    
    const twUpperEdge = mid(twP[6], twP[7]);
    
    const twActiveUsersPoint: [number, number] = [
      twUpperEdge[0] + 20 * scale,
      twUpperEdge[1] + 40 * scale
    ];
    
    const twTemplatesPoint: [number, number] = [
      twUpperEdge[0] - 20 * scale,
      twUpperEdge[1] + 155 * scale
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
      tpTopOffset[1] + 32 * scale
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
      gCurve(x1, y1, x2, y2, cx - 30 * scale, y1 + 10 * scale, cx + 30 * scale, y2 - 10 * scale);
    }

    {
      const x1 = tpStartPoint[0], y1 = tpStartPoint[1];
      const x2 = twTemplatesPoint[0], y2 = twTemplatesPoint[1];
      gCurve(x1, y1, x2, y2, x1 + 40 * scale, y1 - 10 * scale, x2 - 30 * scale, y2 + 15 * scale);
    }

    {
      const x1 = twActiveUsersPoint[0], y1 = twActiveUsersPoint[1];
      const x2 = auLeft[0], y2 = auLeft[1];
      gCurve(x1, y1, x2, y2, x1 + 50 * scale, y1 - 20 * scale, x2 - 60 * scale, y2 - 10 * scale);
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
        context.shadowBlur = 16 * scale;
        context.shadowOffsetY = 4 * scale;
        roundPolygon(context, tpP_rounded, 12);
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1 * scale;
        context.stroke();
        context.restore();
      }
      
      polyRounded(tpPi_rounded, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 8);
      context.save();
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.font = `${13 * scale}px Arial,sans-serif`;
      context.fillText("Templates", TP.cx * scale + centerOffset, TP.cy * scale - 28 * scale);
      context.fillStyle = valColor;
      context.font = `bold ${30 * scale}px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText(countersStarted ? "15+" : "0", TP.cx * scale + centerOffset, TP.cy * scale + 12 * scale);
      context.restore();
      iDocs(TP.cx, TP.cy, 0.85, -8);
    }

    // CENTER OCTAGON
    {
      const fillColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      const strokeColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      const innerStroke = theme === 'dark' ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.7)';
      const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
      
      const twP_rounded = octPts(TW.cx, TW.cy, TWr);
      const twPi_rounded = octPts(TW.cx, TW.cy, TWri);
      const glowIntensity = theme === 'dark' ? 40 : 12;
      const shadowOpacity = theme === 'dark' ? 1 : 0.5;
      
      polyRounded(twP_rounded, fillColor, strokeColor, theme === 'dark' ? 1.5 : 1, '#3B82F6', glowIntensity * shadowOpacity, 14);
      
      if (theme === 'light') {
        context.save();
        context.shadowColor = 'rgba(0,0,0,0.06)';
        context.shadowBlur = 20 * scale;
        context.shadowOffsetY = 4 * scale;
        roundPolygon(context, twP_rounded, 14);
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1 * scale;
        context.stroke();
        context.restore();
      }
      
      polyRounded(twPi_rounded, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 10);
      context.save();
      context.textAlign = "center";
      context.fillStyle = textColor;
      context.font = `bold ${26 * scale}px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText("TRUSTED", TW.cx * scale + centerOffset, TW.cy * scale - 4 * scale);
      context.fillText("WORLDWIDE", TW.cx * scale + centerOffset, TW.cy * scale + 36 * scale);
      context.restore();
    }

    // 3. ACTIVE USERS (Box 2)
    {
      const fillColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      const strokeColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      const innerStroke = theme === 'dark' ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.7)';
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
        context.shadowBlur = 16 * scale;
        context.shadowOffsetY = 4 * scale;
        roundPolygon(context, auP_rounded, 12);
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1 * scale;
        context.stroke();
        context.restore();
      }
      
      polyRounded(auPi_rounded, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 8);
      context.save();
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.font = `${12 * scale}px Arial,sans-serif`;
      context.fillText("Active Users", AU.cx * scale + centerOffset, AU.cy * scale - 28 * scale);
      context.fillStyle = valColor;
      context.font = `bold ${28 * scale}px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText(countersStarted ? "1500+" : "0", AU.cx * scale + centerOffset, AU.cy * scale + 10 * scale);
      context.restore();
      iPeople(AU.cx, AU.cy, 0.85, 12);
    }

    // 4. SUCCESS RATE (Box 3)
    {
      const fillColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
      const strokeColor = theme === 'dark' ? '#3B82F6' : '#3B82F6';
      const innerStroke = theme === 'dark' ? 'rgba(96,165,250,0.9)' : 'rgba(59,130,246,0.7)';
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
        context.shadowBlur = 16 * scale;
        context.shadowOffsetY = 4 * scale;
        roundPolygon(context, srP_rounded, 12);
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 1 * scale;
        context.stroke();
        context.restore();
      }
      
      polyRounded(srPi_rounded, null, innerStroke, theme === 'dark' ? 3.5 : 2.5, null, 0, 8);
      context.save();
      context.textAlign = "center";
      context.fillStyle = labelColor;
      context.font = `${13 * scale}px Arial,sans-serif`;
      context.fillText("Success Rate", SR.cx * scale + centerOffset, SR.cy * scale - 26 * scale);
      context.fillStyle = valColor;
      context.font = `bold ${32 * scale}px Arial,sans-serif`;
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.fillText(countersStarted ? "97%" : "0%", SR.cx * scale + centerOffset, SR.cy * scale + 16 * scale);
      context.restore();
      iArrow(SR.cx, SR.cy, 0.85);
    }
  };

  // Redraw when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [theme, isInView, countersStarted, hoveredBox]);

  // Resize handler with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        drawCanvas();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

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
      
      const scale = canvas.width / 1200;
      const offsetX = 120;
      const BOTTOM_PUSH = 10;
      const centerOffset = (canvas.width - 1200 * scale) / 2 - 25;
      const boxes = [
        { cx: (100 + offsetX) * scale + centerOffset, cy: (218 + BOTTOM_PUSH) * scale, R: 72 * scale, index: 0 },
        { cx: (240 + offsetX) * scale + centerOffset, cy: (318 + BOTTOM_PUSH) * scale, R: 72 * scale, index: 1 },
        { cx: (780 + offsetX) * scale + centerOffset, cy: (142 + BOTTOM_PUSH) * scale, R: 72 * scale, index: 2 },
        { cx: (920 + offsetX) * scale + centerOffset, cy: (245 + BOTTOM_PUSH) * scale, R: 72 * scale, index: 3 },
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

  return (
    <>
      <motion.div
        ref={sectionRef}
        className="relative w-full overflow-hidden hidden md:block"
        style={{ 
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F8FAFF',
          width: '100%',
        }}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-full flex justify-center">
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "1200px",
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