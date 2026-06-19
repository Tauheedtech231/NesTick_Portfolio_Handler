'use client';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';

// Product images (high-quality Unsplash)
const PRODUCT_IMAGES: Record<string, string> = {
  pgm: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format',
  lms: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop&auto=format',
  lrm: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=400&fit=crop&auto=format',
  epp: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop&auto=format',
  pas: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop&auto=format',
  ptmo: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop&auto=format',
  cosm: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format',
  muto: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop&auto=format',
  mutomai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format',
};

const PRODUCTS = [
  { id: 'pgm',    label: 'PGM',     desc: 'Product Growth Management — plan and track product growth strategy.',    dot: { bg: '#EAF3DE', color: '#3B6D11' } },
  { id: 'lms',    label: 'LMS',     desc: 'Learning Management System — deliver training and courses at scale.',     dot: { bg: '#E6F1FB', color: '#185FA5' } },
  { id: 'lrm',    label: 'LRM',     desc: 'Lead Relationship Management — nurture and convert leads efficiently.',   dot: { bg: '#FAEEDA', color: '#854F0B' } },
  { id: 'epp',    label: 'EPP',     desc: 'Endpoint Protection Platform — secure every device in your network.',    dot: { bg: '#EEEDFE', color: '#534AB7' } },
  { id: 'pas',    label: 'PAS',     desc: 'Privileged Access Security — control sensitive system access tightly.',   dot: { bg: '#FBEAF0', color: '#993556' } },
  { id: 'ptmo',   label: 'PTMO',    desc: 'Project & Task Management Office — keep projects on time and on budget.', dot: { bg: '#E1F5EE', color: '#0F6E56' } },
  { id: 'cosm',   label: 'AI COSM', desc: 'AI-powered Cosmos platform — intelligent automation and insights.',      dot: { bg: '#FAECE7', color: '#993C1D' } },
  { id: 'muto',   label: 'Muto',    desc: 'Muto messaging — real-time team communication and collaboration.',       dot: { bg: '#E6F1FB', color: '#185FA5' } },
  { id: 'mutomai',label: 'Mutomai', desc: 'Mutomai AI assistant — your intelligent productivity companion.',         dot: { bg: '#EAF3DE', color: '#3B6D11' } },
];

export default function ProductZigzag() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isClient, setIsClient] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [typedText, setTypedText] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nezRef = useRef<HTMLDivElement>(null);
  const [mPosition, setMPosition] = useState<{ x: number; y: number } | null>(null);
  const [imagePositions, setImagePositions] = useState<{ x: number; y: number; color: string; label: string }[]>([]);
  
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
        accent: '#E8CA5E',
        accentLight: 'rgba(232, 202, 94, 0.15)',
        lineColor: 'rgba(59, 130, 246, 0.3)',
        lineColorStrong: '#3B82F6',
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
        accent: '#0066FF',
        accentLight: 'rgba(0, 102, 255, 0.08)',
        lineColor: 'rgba(59, 130, 246, 0.2)',
        lineColorStrong: '#3B82F6',
      };
    }
  };

  const colors = getColors();

  // Get positions of all elements
  const updatePositions = () => {
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    // Get 'm' position
    const nezElement = nezRef.current;
    if (nezElement) {
      const mSpan = nezElement.querySelector('span');
      if (mSpan) {
        const mRect = mSpan.getBoundingClientRect();
        setMPosition({
          x: mRect.left + mRect.width / 2 - containerRect.left,
          y: mRect.top + mRect.height / 2 - containerRect.top,
        });
      }
    }
    
    // Get image positions
    const imageElements = document.querySelectorAll('.image-card');
    const positions: { x: number; y: number; color: string; label: string }[] = [];
    
    imageElements.forEach((img, index) => {
      const rect = img.getBoundingClientRect();
      const isEven = index % 2 === 0;
      const x = isEven 
        ? rect.left + rect.width - 20 - containerRect.left 
        : rect.left + 20 - containerRect.left;
      const y = rect.top + rect.height / 2 - containerRect.top;
      
      const colors_list = ['#3B6D11', '#185FA5', '#854F0B', '#534AB7', '#993556', '#0F6E56', '#993C1D', '#185FA5', '#3B6D11'];
      positions.push({
        x,
        y,
        color: colors_list[index % colors_list.length],
        label: PRODUCTS[index]?.label || '',
      });
    });
    
    setImagePositions(positions);
  };

  // Update positions on resize and scroll
  useEffect(() => {
    if (!isClient) return;
    
    updatePositions();
    const timeoutId = setTimeout(updatePositions, 100);
    const timeoutId2 = setTimeout(updatePositions, 500);
    
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [isClient, theme]);

  // Scroll progress tracking
  useEffect(() => {
    if (!isClient) return;

    let rafId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startOffset = 100;
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

  // Draw scroll-based beams
  useEffect(() => {
    if (!isClient || !mPosition || imagePositions.length === 0) return;

    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    const ns = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';

    const progress = scrollProgress;
    const totalSegments = imagePositions.length;
    const progressPerSegment = 1 / totalSegments;

    // Add glow filter
    const defs = document.createElementNS(ns, 'defs');
    
    const glowFilter = document.createElementNS(ns, 'filter');
    glowFilter.setAttribute('id', 'beamGlow');
    glowFilter.setAttribute('x', '-50%');
    glowFilter.setAttribute('y', '-50%');
    glowFilter.setAttribute('width', '200%');
    glowFilter.setAttribute('height', '200%');
    
    const blur1 = document.createElementNS(ns, 'feGaussianBlur');
    blur1.setAttribute('stdDeviation', '6');
    blur1.setAttribute('result', 'blur1');
    
    const blur2 = document.createElementNS(ns, 'feGaussianBlur');
    blur2.setAttribute('stdDeviation', '12');
    blur2.setAttribute('result', 'blur2');
    
    const merge = document.createElementNS(ns, 'feMerge');
    const mergeNode1 = document.createElementNS(ns, 'feMergeNode');
    mergeNode1.setAttribute('in', 'blur2');
    const mergeNode2 = document.createElementNS(ns, 'feMergeNode');
    mergeNode2.setAttribute('in', 'blur1');
    const mergeNode3 = document.createElementNS(ns, 'feMergeNode');
    mergeNode3.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mergeNode1);
    merge.appendChild(mergeNode2);
    merge.appendChild(mergeNode3);
    
    glowFilter.appendChild(blur1);
    glowFilter.appendChild(blur2);
    glowFilter.appendChild(merge);
    defs.appendChild(glowFilter);

    const dotGlow = document.createElementNS(ns, 'filter');
    dotGlow.setAttribute('id', 'dotGlow');
    dotGlow.setAttribute('x', '-100%');
    dotGlow.setAttribute('y', '-100%');
    dotGlow.setAttribute('width', '300%');
    dotGlow.setAttribute('height', '300%');
    
    const dotBlur = document.createElementNS(ns, 'feGaussianBlur');
    dotBlur.setAttribute('stdDeviation', '8');
    dotBlur.setAttribute('result', 'blur');
    
    const dotMerge = document.createElementNS(ns, 'feMerge');
    const dotMerge1 = document.createElementNS(ns, 'feMergeNode');
    dotMerge1.setAttribute('in', 'blur');
    const dotMerge2 = document.createElementNS(ns, 'feMergeNode');
    dotMerge2.setAttribute('in', 'SourceGraphic');
    dotMerge.appendChild(dotMerge1);
    dotMerge.appendChild(dotMerge2);
    
    dotGlow.appendChild(dotBlur);
    dotGlow.appendChild(dotMerge);
    defs.appendChild(dotGlow);
    
    svg.appendChild(defs);

    // Draw beams based on scroll progress
    let lastDrawnIndex = -1;
    
    for (let i = 0; i < imagePositions.length - 1; i++) {
      const segmentStart = i * progressPerSegment;
      const segmentEnd = (i + 1) * progressPerSegment;
      
      let segmentProgress = 0;
      if (progress > segmentStart) {
        segmentProgress = Math.min(1, (progress - segmentStart) / progressPerSegment);
      }
      
      if (segmentProgress > 0) {
        lastDrawnIndex = i;
        const start = imagePositions[i];
        const end = imagePositions[i + 1];
        
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2 - 40;
        
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const pathLength = Math.sqrt(dx * dx + dy * dy) * 1.5;
        
        const d = `M ${start.x} ${start.y} C ${start.x + 60} ${start.y - 30}, ${midX - 60} ${midY}, ${midX} ${midY} C ${midX + 60} ${midY}, ${end.x - 60} ${end.y - 30}, ${end.x} ${end.y}`;
        
        // Thick beam with glow
        const beam = document.createElementNS(ns, 'path');
        beam.setAttribute('d', d);
        beam.setAttribute('fill', 'none');
        beam.setAttribute('stroke', start.color);
        beam.setAttribute('stroke-width', '8');
        beam.setAttribute('stroke-opacity', '0.3');
        beam.setAttribute('filter', 'url(#beamGlow)');
        beam.setAttribute('stroke-dasharray', String(pathLength));
        beam.setAttribute('stroke-dashoffset', String(pathLength * (1 - segmentProgress)));
        svg.appendChild(beam);
        
        // Inner beam
        const innerBeam = document.createElementNS(ns, 'path');
        innerBeam.setAttribute('d', d);
        innerBeam.setAttribute('fill', 'none');
        innerBeam.setAttribute('stroke', start.color);
        innerBeam.setAttribute('stroke-width', '3');
        innerBeam.setAttribute('stroke-opacity', '0.6');
        innerBeam.setAttribute('stroke-dasharray', String(pathLength));
        innerBeam.setAttribute('stroke-dashoffset', String(pathLength * (1 - segmentProgress)));
        svg.appendChild(innerBeam);
        
        // Moving dot at the end of beam
        if (segmentProgress > 0.1 && segmentProgress < 1) {
          const dot = document.createElementNS(ns, 'circle');
          const t = segmentProgress;
          const dotX = start.x + (end.x - start.x) * t;
          const dotY = start.y + (end.y - start.y) * t - 30 * Math.sin(t * Math.PI);
          dot.setAttribute('cx', String(dotX));
          dot.setAttribute('cy', String(dotY));
          dot.setAttribute('r', '6');
          dot.setAttribute('fill', start.color);
          dot.setAttribute('opacity', '0.8');
          dot.setAttribute('filter', 'url(#dotGlow)');
          svg.appendChild(dot);
        }
      }
    }

    // Draw final beam to 'm'
    if (progress >= 0.95 && imagePositions.length > 0) {
      const last = imagePositions[imagePositions.length - 1];
      const lastSegmentProgress = (progress - (imagePositions.length - 1) * progressPerSegment) / progressPerSegment;
      
      if (lastSegmentProgress > 0) {
        const midX = (last.x + mPosition.x) / 2;
        const midY = (last.y + mPosition.y) / 2 - 60;
        
        const d = `M ${last.x} ${last.y} C ${last.x + 80} ${last.y - 50}, ${midX - 80} ${midY}, ${midX} ${midY} C ${midX + 80} ${midY}, ${mPosition.x - 80} ${mPosition.y - 50}, ${mPosition.x} ${mPosition.y}`;
        
        const dx = mPosition.x - last.x;
        const dy = mPosition.y - last.y;
        const pathLength = Math.sqrt(dx * dx + dy * dy) * 2;
        
        // Thick beam with glow
        const finalBeam = document.createElementNS(ns, 'path');
        finalBeam.setAttribute('d', d);
        finalBeam.setAttribute('fill', 'none');
        finalBeam.setAttribute('stroke', '#3B82F6');
        finalBeam.setAttribute('stroke-width', '10');
        finalBeam.setAttribute('stroke-opacity', '0.25');
        finalBeam.setAttribute('filter', 'url(#beamGlow)');
        finalBeam.setAttribute('stroke-dasharray', String(pathLength));
        finalBeam.setAttribute('stroke-dashoffset', String(pathLength * (1 - Math.min(1, lastSegmentProgress * 2))));
        svg.appendChild(finalBeam);
        
        // Medium beam
        const midBeam = document.createElementNS(ns, 'path');
        midBeam.setAttribute('d', d);
        midBeam.setAttribute('fill', 'none');
        midBeam.setAttribute('stroke', '#3B82F6');
        midBeam.setAttribute('stroke-width', '5');
        midBeam.setAttribute('stroke-opacity', '0.5');
        midBeam.setAttribute('stroke-dasharray', String(pathLength));
        midBeam.setAttribute('stroke-dashoffset', String(pathLength * (1 - Math.min(1, lastSegmentProgress * 2))));
        svg.appendChild(midBeam);
        
        // Inner bright beam
        const innerBeam2 = document.createElementNS(ns, 'path');
        innerBeam2.setAttribute('d', d);
        innerBeam2.setAttribute('fill', 'none');
        innerBeam2.setAttribute('stroke', '#60A5FA');
        innerBeam2.setAttribute('stroke-width', '2');
        innerBeam2.setAttribute('stroke-opacity', '0.8');
        innerBeam2.setAttribute('stroke-dasharray', String(pathLength));
        innerBeam2.setAttribute('stroke-dashoffset', String(pathLength * (1 - Math.min(1, lastSegmentProgress * 2))));
        svg.appendChild(innerBeam2);
        
        // Moving dot on final beam
        if (lastSegmentProgress > 0.1) {
          const dot = document.createElementNS(ns, 'circle');
          const t = Math.min(1, lastSegmentProgress * 1.5);
          const dotX = last.x + (mPosition.x - last.x) * t;
          const dotY = last.y + (mPosition.y - last.y) * t - 50 * Math.sin(t * Math.PI);
          dot.setAttribute('cx', String(dotX));
          dot.setAttribute('cy', String(dotY));
          dot.setAttribute('r', '8');
          dot.setAttribute('fill', '#3B82F6');
          dot.setAttribute('filter', 'url(#dotGlow)');
          svg.appendChild(dot);
        }
        
        // Glow ring at 'm' when fully connected
        if (lastSegmentProgress >= 1) {
          const ring = document.createElementNS(ns, 'circle');
          ring.setAttribute('cx', String(mPosition.x));
          ring.setAttribute('cy', String(mPosition.y));
          ring.setAttribute('r', '16');
          ring.setAttribute('fill', 'none');
          ring.setAttribute('stroke', '#3B82F6');
          ring.setAttribute('stroke-width', '3');
          ring.setAttribute('stroke-opacity', '0.4');
          ring.setAttribute('filter', 'url(#beamGlow)');
          svg.appendChild(ring);
          
          const ring2 = document.createElementNS(ns, 'circle');
          ring2.setAttribute('cx', String(mPosition.x));
          ring2.setAttribute('cy', String(mPosition.y));
          ring2.setAttribute('r', '10');
          ring2.setAttribute('fill', 'none');
          ring2.setAttribute('stroke', '#60A5FA');
          ring2.setAttribute('stroke-width', '2');
          ring2.setAttribute('stroke-opacity', '0.6');
          svg.appendChild(ring2);
        }
      }
    }
  }, [scrollProgress, imagePositions, mPosition, isClient]);

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

  const modalContentVariants: Variants = {
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
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 0.7s step-end infinite;
        }
        .product-row {
          position: relative;
          z-index: 2;
        }
        .product-image {
          border-radius: 16px;
          object-fit: cover;
          width: 100%;
          height: 260px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: transform 0.5s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .product-image:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 40px rgba(0,0,0,0.15);
        }
        .image-card {
          border-radius: 16px;
          overflow: hidden;
          background: ${colors.cardBg};
          border: 1px solid ${colors.border};
          box-shadow: ${theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)'};
          transition: transform 0.3s, box-shadow 0.3s;
          height: 260px;
          position: relative;
          cursor: pointer;
        }
        .image-card:hover {
          transform: translateY(-4px);
          box-shadow: ${theme === 'dark' ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(0,0,0,0.1)'};
        }
        .text-section {
          background: transparent !important;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 260px;
          border: none !important;
          box-shadow: none !important;
          cursor: pointer;
        }
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          padding: 0 10px;
        }
        .product-layout.reverse {
          direction: rtl;
        }
        .product-layout.reverse .text-section {
          direction: ltr;
        }
        .product-layout.reverse .image-card {
          direction: ltr;
        }
        /* Product dot cursor */
        .product-dot {
          cursor: pointer;
        }
        /* Buy button cursor */
        .buy-button {
          cursor: pointer !important;
        }
        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .product-layout.reverse {
            direction: ltr;
          }
          .text-section {
            min-height: auto;
            padding: 12px 0;
          }
          .image-card {
            height: 220px;
          }
          .product-image {
            height: 220px;
          }
        }
      `}</style>
      
      <Navbar />
      
      <div 
        ref={containerRef}
        style={{ 
          padding: '80px 0 40px',
          position: 'relative',
          backgroundColor: colors.bg,
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* SVG for scroll-based beams */}
        <svg
          ref={svgRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'visible',
          }}
        />

        {/* Products Header */}
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto 50px',
          textAlign: 'center',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 3,
          padding: '0 10px',
        }}>
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto w-fit"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)',
              cursor: 'default',
            }}
          >
            <span className="text-xs font-medium" style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}>
              Our Products
            </span>
          </div>
          
          <h2 style={{ 
            fontSize: '2.5rem',
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

        {/* Product rows */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 70,
          position: 'relative',
          maxWidth: '1100px',
          margin: '0 auto',
          zIndex: 2,
        }}>
          {PRODUCTS.map((p, i) => {
            const isEven = i % 2 === 0;
            
            return (
              <div
                key={p.id}
                className="product-row"
              >
                <div 
                  className={`product-layout ${!isEven ? 'reverse' : ''}`}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {/* Text Section */}
                  <div 
                    className="text-section"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => console.log(`Clicked: ${p.label}`)}
                  >
                    <div 
                      className="product-dot"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: p.dot.bg,
                        color: p.dot.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 16,
                        cursor: 'pointer',
                      }}
                    >
                      {p.label.charAt(0)}
                    </div>
                    
                    <h3 style={{ 
                      fontSize: 24,
                      fontWeight: 700,
                      margin: '0 0 10px',
                      color: colors.text,
                      cursor: 'pointer',
                    }}>
                      {p.label}
                    </h3>
                    
                    <p style={{ 
                      fontSize: 15,
                      color: colors.textSecondary,
                      margin: 0,
                      lineHeight: 1.7,
                      minHeight: '70px',
                      maxWidth: '90%',
                      cursor: 'pointer',
                    }}>
                      {hoveredIndex === i ? (
                        <>
                          {typedText}
                          <span className="cursor-blink" style={{ color: colors.accent }}>|</span>
                        </>
                      ) : (
                        p.desc
                      )}
                    </p>
                  </div>

                  {/* Image Section */}
                  <div 
                    className="image-card"
                    onClick={() => console.log(`Clicked image: ${p.label}`)}
                  >
                    <img
                      src={PRODUCT_IMAGES[p.id]}
                      alt={p.label}
                      className="product-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        cursor: 'pointer',
                      }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${p.dot.color}15, transparent 60%)`,
                        pointerEvents: 'none',
                        borderRadius: '16px',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Neezamiya with Buy Now Button */}
        <div
          ref={nezRef}
          style={{
            width: '100%',
            maxWidth: '1100px',
            margin: '60px auto 0',
            textAlign: 'center',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 3,
            padding: '30px 10px',
          }}
        >
          <h3 style={{ 
            fontSize: '2.5rem',
            fontWeight: 700,
            margin: '0 0 20px',
            color: colors.text,
            fontFamily: 'serif',
            letterSpacing: '-0.025em',
            position: 'relative',
          }}>
            Neeza<span style={{ color: '#3B82F6', display: 'inline-block', position: 'relative' }}>m</span>iya
          </h3>
          
          <button
            className="buy-button"
            onClick={openModal}
            style={{
              padding: '14px 48px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: colors.accent,
              color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
              boxShadow: `0 4px 20px ${theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 102, 255, 0.3)'}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 8px 40px ${theme === 'dark' ? 'rgba(232, 202, 94, 0.4)' : 'rgba(0, 102, 255, 0.4)'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 4px 20px ${theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 102, 255, 0.3)'}`;
            }}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Modal */}
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
                  className="p-2 rounded-full hover:bg-black/10 transition-all duration-300"
                  style={{ cursor: 'pointer' }}
                >
                  <X className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </button>
              </div>

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
                          cursor: 'text',
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
                            cursor: 'text',
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
                            cursor: 'text',
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
                          cursor: 'pointer',
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
                          cursor: 'text',
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
                        cursor: modalSubmitting ? 'not-allowed' : 'pointer',
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
      
      <Footer />
    </>
  );
}