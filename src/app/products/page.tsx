'use client';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';

const PRODUCTS = [
  { id: 'pgm',    label: 'PGM',     desc: 'Product Growth Management — plan and track product growth strategy.',    side: 'left',  dot: { bg: '#EAF3DE', color: '#3B6D11' }, lineColor: '#639922' },
  { id: 'lms',    label: 'LMS',     desc: 'Learning Management System — deliver training and courses at scale.',     side: 'right', dot: { bg: '#E6F1FB', color: '#185FA5' }, lineColor: '#185FA5' },
  { id: 'lrm',    label: 'LRM',     desc: 'Lead Relationship Management — nurture and convert leads efficiently.',   side: 'left',  dot: { bg: '#FAEEDA', color: '#854F0B' }, lineColor: '#BA7517' },
  { id: 'epp',    label: 'EPP',     desc: 'Endpoint Protection Platform — secure every device in your network.',    side: 'right', dot: { bg: '#EEEDFE', color: '#534AB7' }, lineColor: '#534AB7' },
  { id: 'pas',    label: 'PAS',     desc: 'Privileged Access Security — control sensitive system access tightly.',   side: 'left',  dot: { bg: '#FBEAF0', color: '#993556' }, lineColor: '#993556' },
  { id: 'ptmo',   label: 'PTMO',    desc: 'Project & Task Management Office — keep projects on time and on budget.', side: 'right', dot: { bg: '#E1F5EE', color: '#0F6E56' }, lineColor: '#0F6E56' },
  { id: 'cosm',   label: 'AI COSM', desc: 'AI-powered Cosmos platform — intelligent automation and insights.',      side: 'left',  dot: { bg: '#FAECE7', color: '#993C1D' }, lineColor: '#993C1D' },
  { id: 'muto',   label: 'Muto',    desc: 'Muto messaging — real-time team communication and collaboration.',       side: 'right', dot: { bg: '#E6F1FB', color: '#185FA5' }, lineColor: '#185FA5' },
  { id: 'mutomai',label: 'Mutomai', desc: 'Mutomai AI assistant — your intelligent productivity companion.',         side: 'left',  dot: { bg: '#EAF3DE', color: '#3B6D11' }, lineColor: '#639922' },
];

export default function ProductZigzag() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [scrollProgress, setScrollProgress] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nezRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [nezMPosition, setNezMPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [typedText, setTypedText] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    message: ''
  });
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  // Detect theme
  useEffect(() => {
    setIsClient(true);
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

  const getColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#0B0F19',
        cardBg: '#0F172A',
        border: 'rgba(30, 41, 59, 0.5)',
        text: '#FFFFFF',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        cardHover: 'rgba(232, 202, 94, 0.05)',
        nezColor: '#3B82F6',
        accent: '#E8CA5E',
        accentLight: 'rgba(232, 202, 94, 0.15)',
      };
    } else {
      return {
        bg: '#FFFFFF',
        cardBg: '#FFFFFF',
        border: 'rgba(0, 0, 0, 0.06)',
        text: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        cardHover: 'rgba(0, 102, 255, 0.04)',
        nezColor: '#2563EB',
        accent: '#0066FF',
        accentLight: 'rgba(0, 102, 255, 0.08)',
      };
    }
  };

  const colors = getColors();

  // Typewriter effect
  useEffect(() => {
    if (hoveredIndex === null) {
      setTypedText('');
      return;
    }

    const fullText = PRODUCTS[hoveredIndex].desc;
    let index = 0;
    setTypedText('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const typeNextChar = () => {
      if (index < fullText.length) {
        setTypedText(fullText.substring(0, index + 1));
        index++;
        typingTimeoutRef.current = setTimeout(typeNextChar, 35);
      }
    };

    typeNextChar();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [hoveredIndex]);

  // Get Neezamiya 'm' position
  useEffect(() => {
    if (!isClient) return;
    
    const getMPosition = () => {
      const wrapRect = wrapRef.current?.getBoundingClientRect();
      if (!wrapRect) return;
      
      const nezElement = nezRef.current;
      if (!nezElement) return;
      
      const mSpan = nezElement.querySelector('span');
      if (!mSpan) return;
      
      const rect = mSpan.getBoundingClientRect();
      setNezMPosition({
        x: rect.left + rect.width / 2 - wrapRect.left,
        y: rect.top + rect.height / 2 - wrapRect.top,
      });
    };
    
    getMPosition();
    const timeoutId = setTimeout(getMPosition, 100);
    const timeoutId2 = setTimeout(getMPosition, 500);
    
    window.addEventListener('resize', getMPosition);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      window.removeEventListener('resize', getMPosition);
    };
  }, [isClient, theme]);

  // Smooth scroll tracking
  useEffect(() => {
    if (!isClient) return;

    let rafId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    const handleScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect = wrap.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startOffset = 50;
      const endOffset = windowHeight - 100;
      
      const scrollPosition = -rect.top + startOffset;
      const scrollRange = rect.height + startOffset - endOffset;
      
      let progress = 0;
      if (scrollPosition > 0) {
        progress = Math.min(1, scrollPosition / scrollRange);
      }
      
      targetProgress = progress;
    };

    const smoothUpdate = () => {
      currentProgress += (targetProgress - currentProgress) * 0.08;
      
      if (Math.abs(currentProgress - targetProgress) > 0.001) {
        setScrollProgress(currentProgress);
        rafId = requestAnimationFrame(smoothUpdate);
      } else {
        setScrollProgress(targetProgress);
        rafId = requestAnimationFrame(smoothUpdate);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    
    rafId = requestAnimationFrame(smoothUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isClient]);

  function drawLines(progress: number) {
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;

    svg.innerHTML = '';
    const wRect = wrap.getBoundingClientRect();

    type CardInfo = { cx: number; cy: number; side: string; color: string; label: string };
    const cards: CardInfo[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const r = card.getBoundingClientRect();
      const isRight = PRODUCTS[i].side === 'right';
      cards.push({
        cx: (isRight ? r.left : r.right) - wRect.left,
        cy: r.top + r.height / 2 - wRect.top,
        side: isRight ? 'left' : 'right',
        color: PRODUCTS[i].lineColor,
        label: PRODUCTS[i].label,
      });
    });

    let nezX: number, nezY: number;
    if (nezMPosition) {
      nezX = nezMPosition.x;
      nezY = nezMPosition.y;
    } else {
      const nezElement = nezRef.current;
      if (!nezElement) return;
      
      const mSpan = nezElement.querySelector('span');
      if (mSpan) {
        const mRect = mSpan.getBoundingClientRect();
        nezX = mRect.left + mRect.width / 2 - wRect.left;
        nezY = mRect.top + mRect.height / 2 - wRect.top;
      } else {
        const nezRect = nezElement.getBoundingClientRect();
        nezX = nezRect.left + nezRect.width / 2 - wRect.left;
        nezY = nezRect.top + 30 - wRect.top;
      }
    }

    const ns = 'http://www.w3.org/2000/svg';

    const segments: { d: string; color: string; startX: number; startY: number; endX: number; endY: number }[] = [];

    for (let i = 0; i < cards.length - 1; i++) {
      const a = cards[i];
      const b = cards[i + 1];
      const cpAx = a.side === 'right' ? a.cx + 90 : a.cx - 90;
      const cpBx = b.side === 'right' ? b.cx + 90 : b.cx - 90;
      const d = `M ${a.cx} ${a.cy} C ${cpAx} ${a.cy}, ${cpBx} ${b.cy}, ${b.cx} ${b.cy}`;
      segments.push({ d, color: a.color, startX: a.cx, startY: a.cy, endX: b.cx, endY: b.cy });
    }

    const last = cards[cards.length - 1];
    const cpLx = last.side === 'right' ? last.cx + 60 : last.cx - 60;
    const dLast = `M ${last.cx} ${last.cy} C ${cpLx} ${last.cy + 60}, ${nezX} ${nezY - 60}, ${nezX} ${nezY}`;
    segments.push({ 
      d: dLast, 
      color: colors.nezColor,
      startX: last.cx, 
      startY: last.cy, 
      endX: nezX, 
      endY: nezY 
    });

    const totalSegments = segments.length;
    const progressPerSegment = 1 / totalSegments;

    segments.forEach((seg, idx) => {
      const segmentStart = idx * progressPerSegment;
      const segmentEnd = (idx + 1) * progressPerSegment;
      
      let segmentProgress = 0;
      if (progress > segmentStart) {
        segmentProgress = Math.min(1, (progress - segmentStart) / progressPerSegment);
      }

      if (segmentProgress > 0) {
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', seg.color);
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('stroke-opacity', '0.7');
        path.setAttribute('d', seg.d);
        
        const dx = seg.endX - seg.startX;
        const dy = seg.endY - seg.startY;
        const length = Math.sqrt(dx * dx + dy * dy) * 1.5;
        
        path.setAttribute('stroke-dasharray', String(length));
        path.setAttribute('stroke-dashoffset', String(length * (1 - segmentProgress)));
        svg.appendChild(path);

        if (segmentProgress > 0.1 && segmentProgress < 1) {
          const dot = document.createElementNS(ns, 'circle');
          const t = segmentProgress;
          const cx = seg.startX + (seg.endX - seg.startX) * t;
          const cy = seg.startY + (seg.endY - seg.startY) * t;
          dot.setAttribute('cx', String(cx));
          dot.setAttribute('cy', String(cy));
          dot.setAttribute('r', '5');
          dot.setAttribute('fill', seg.color);
          dot.setAttribute('opacity', '0.9');
          dot.setAttribute('filter', 'url(#glow)');
          svg.appendChild(dot);
        }
      }

      if (progress >= segmentEnd) {
        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', String(seg.endX));
        dot.setAttribute('cy', String(seg.endY));
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', seg.color);
        dot.setAttribute('opacity', '0.9');
        svg.appendChild(dot);
      }
    });

    if (progress >= 0.98) {
      const arr = document.createElementNS(ns, 'polygon');
      const s = 8;
      arr.setAttribute('points', `${nezX},${nezY} ${nezX - s / 2},${nezY - s} ${nezX + s / 2},${nezY - s}`);
      arr.setAttribute('fill', colors.nezColor);
      arr.setAttribute('opacity', '0.9');
      svg.appendChild(arr);

      const finalDot = document.createElementNS(ns, 'circle');
      finalDot.setAttribute('cx', String(nezX));
      finalDot.setAttribute('cy', String(nezY));
      finalDot.setAttribute('r', '6');
      finalDot.setAttribute('fill', colors.nezColor);
      finalDot.setAttribute('opacity', '1');
      finalDot.setAttribute('filter', 'url(#glow)');
      svg.appendChild(finalDot);
    }

    const defs = document.createElementNS(ns, 'defs');
    const filter = document.createElementNS(ns, 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const blur = document.createElementNS(ns, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '3');
    blur.setAttribute('result', 'blur');
    
    const merge = document.createElementNS(ns, 'feMerge');
    const mergeNode1 = document.createElementNS(ns, 'feMergeNode');
    mergeNode1.setAttribute('in', 'blur');
    const mergeNode2 = document.createElementNS(ns, 'feMergeNode');
    mergeNode2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mergeNode1);
    merge.appendChild(mergeNode2);
    
    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);
  }

  useEffect(() => {
    if (!isClient) return;
    drawLines(scrollProgress);
  }, [scrollProgress, theme, isClient, nezMPosition]);

  useEffect(() => {
    if (!isClient) return;
    const handleResize = () => drawLines(scrollProgress);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scrollProgress, isClient]);

  // Modal handlers
  const openModal = () => {
    setIsModalOpen(true);
    setModalSuccess(false);
    setModalForm({ name: '', email: '', phone: '', product: '', message: '' });
    setModalErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalSuccess(false);
  };

  const validateModalForm = () => {
    const errors: Record<string, string> = {};
    if (!modalForm.name.trim()) errors.name = 'Name is required';
    if (!modalForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalForm.email)) errors.email = 'Valid email is required';
    if (!modalForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!modalForm.product.trim()) errors.product = 'Please select a product';
    if (!modalForm.message.trim()) errors.message = 'Message is required';
    setModalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateModalForm()) return;
    
    setModalSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setModalSuccess(true);
      setModalForm({ name: '', email: '', phone: '', product: '', message: '' });
      setTimeout(() => {
        closeModal();
        setModalSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setModalSubmitting(false);
    }
  };

  // Modal animation variants
  const modalOverlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalContentVariants:Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 0.7s step-end infinite;
        }
      `}</style>
      <Navbar/>
      <div 
        ref={wrapRef} 
        style={{ 
          padding: '80px 16px 40px', 
          position: 'relative',
          backgroundColor: colors.bg,
          minHeight: '100vh',
        }}
      >
        {/* SVG overlay for lines */}
        <svg
          ref={svgRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', overflow: 'visible',
          }}
        />

        {/* Products Header */}
        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto 30px',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}>
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto w-fit"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)',
            }}
          >
            <span className="text-xs font-medium" style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}>
              Our Products
            </span>
          </div>
          
          <h2 style={{ 
            fontSize: '2.25rem',
            fontWeight: 700,
            margin: 0,
            color: colors.text,
            fontFamily: 'serif',
            letterSpacing: '-0.025em',
          }}>
            Product <span style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}>Suite</span>
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            color: colors.textSecondary, 
            margin: '8px 0 0',
            fontWeight: 300,
          }}>
            Our complete solution suite
          </p>
        </div>

        {/* Product cards */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 80, 
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {PRODUCTS.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                justifyContent: p.side === 'left' ? 'flex-start' : 'flex-end',
                paddingLeft:  p.side === 'left'  ? 20 : 0,
                paddingRight: p.side === 'right' ? 20 : 0,
              }}
            >
              <div
                ref={el => { cardRefs.current[i] = el; }}
                onClick={() => console.log(`Clicked: ${p.label}`)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  width: 220,
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 14,
                  padding: '16px 20px',
                  cursor: 'pointer',
                  transition: 'transform .18s, box-shadow .18s',
                  boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                  minHeight: '100px',
                }}
                onMouseOverCapture={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                }}
                onMouseMoveCapture={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: p.dot.bg, color: p.dot.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, marginBottom: 10,
                }} />
                <h3 style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  margin: '0 0 6px',
                  color: colors.text,
                }}>
                  {p.label}
                </h3>
                <p style={{ 
                  fontSize: 12, 
                  color: colors.textSecondary, 
                  margin: 0, 
                  lineHeight: 1.5,
                  minHeight: '50px',
                }}>
                  {hoveredIndex === i ? (
                    <>
                      {typedText}
                      <span className="cursor-blink" style={{ color: colors.nezColor }}>|</span>
                    </>
                  ) : (
                    p.desc
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Neezamiya with Buy Now Button */}
        <div
          ref={nezRef}
          style={{
            width: '100%',
            maxWidth: '900px',
            margin: '30px auto 0',
            textAlign: 'center',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 2,
            padding: '20px 0',
          }}
        >
          <h3 style={{ 
            fontSize: '2.25rem',
            fontWeight: 700,
            margin: '0 0 16px',
            color: colors.text,
            fontFamily: 'serif',
            letterSpacing: '-0.025em',
          }}>
            Neeza<span style={{ color: colors.nezColor, display: 'inline-block' }}>m</span>iya
          </h3>
          
          <button
            onClick={openModal}
            style={{
              padding: '12px 40px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: colors.accent,
              color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
              boxShadow: `0 4px 16px ${theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 102, 255, 0.3)'}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${theme === 'dark' ? 'rgba(232, 202, 94, 0.4)' : 'rgba(0, 102, 255, 0.4)'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 4px 16px ${theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 102, 255, 0.3)'}`;
            }}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Smooth Modal with AnimatePresence */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
          >
            <motion.div 
              className="relative rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div 
                className="sticky top-0 p-4 border-b flex items-center justify-between"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <h3 className="text-xl font-bold" style={{ color: colors.text }}>
                  Get Started with Neezamiya
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-black/10 transition-all duration-300 cursor-pointer"
                >
                  <X className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {modalSuccess ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.accentLight }}
                    >
                      <CheckCircle className="w-8 h-8" style={{ color: colors.accent }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                      Request Submitted!
                    </h3>
                    <p style={{ color: colors.textSecondary }}>
                      Our team will contact you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleModalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={modalForm.name}
                        onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          borderColor: modalErrors.name ? '#EF4444' : colors.border,
                          borderWidth: '1px',
                          color: colors.text,
                        }}
                        placeholder="John Doe"
                      />
                      {modalErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{modalErrors.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          value={modalForm.email}
                          onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            borderColor: modalErrors.email ? '#EF4444' : colors.border,
                            borderWidth: '1px',
                            color: colors.text,
                          }}
                          placeholder="john@example.com"
                        />
                        {modalErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{modalErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={modalForm.phone}
                          onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                          style={{
                            backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                            borderColor: modalErrors.phone ? '#EF4444' : colors.border,
                            borderWidth: '1px',
                            color: colors.text,
                          }}
                          placeholder="+92 300 1234567"
                        />
                        {modalErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{modalErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                        Interested Product *
                      </label>
                      <select
                        value={modalForm.product}
                        onChange={(e) => setModalForm({ ...modalForm, product: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          borderColor: modalErrors.product ? '#EF4444' : colors.border,
                          borderWidth: '1px',
                          color: colors.text,
                        }}
                      >
                        <option value="">Select a product</option>
                        {PRODUCTS.map((p) => (
                          <option key={p.id} value={p.label}>{p.label} - {p.desc.substring(0, 50)}...</option>
                        ))}
                      </select>
                      {modalErrors.product && (
                        <p className="text-red-500 text-xs mt-1">{modalErrors.product}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                        Message / Requirements *
                      </label>
                      <textarea
                        rows={4}
                        value={modalForm.message}
                        onChange={(e) => setModalForm({ ...modalForm, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
                          borderColor: modalErrors.message ? '#EF4444' : colors.border,
                          borderWidth: '1px',
                          color: colors.text,
                        }}
                        placeholder="Tell us about your requirements..."
                      />
                      {modalErrors.message && (
                        <p className="text-red-500 text-xs mt-1">{modalErrors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={modalSubmitting}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{
                        backgroundColor: colors.accent,
                        color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                      }}
                    >
                      {modalSubmitting ? 'Submitting...' : 'Submit Request'}
                      <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer/>
    </>
  );
}