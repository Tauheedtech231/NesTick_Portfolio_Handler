'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const products = ["Neezamiya", "Advance POS", "MarX", "Build N"];

const partnerLogos= [
    { id: 1, name: "Saqfiyat", image: "/p1.jpg" },
    { id: 2, name: "Skeler Security", image: "/p2.jpg" },
    { id: 3, name: "Futurizm", image: "/p3.jpg" },
    { id: 4, name: "Pixsy Studio", image: "/p4.jpg" },
  ]; 

interface SliderProps {
  items: React.ReactNode[];
  direction: 'left' | 'right';
  speed?: number;
}

function Slider({ items, direction, speed = 50 }: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;
    let startTime: number | null = null;
    let paused = false;
    let currentOffset = 0;

    const totalWidth = slider.scrollWidth / 3;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      if (!paused) {
        const elapsed = timestamp - startTime;
        const distance = (elapsed / 1000) * speed;
        
        if (direction === 'left') {
          currentOffset = -distance;
        } else {
          currentOffset = distance;
        }
        
        if (Math.abs(currentOffset) >= totalWidth) {
          startTime = timestamp;
          currentOffset = 0;
        }
        
        slider.style.transform = `translateX(${currentOffset}px)`;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => { paused = true; };
    const handleMouseLeave = () => { 
      paused = false; 
      startTime = null;
    };

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, isClient]);

  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div
        ref={sliderRef}
        className="flex gap-4 md:gap-6 will-change-transform"
        style={{ width: 'fit-content' }}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnerProductSection() {
  const [colorPhase, setColorPhase] = useState(0);

  // Continuous color animation between yellow and blue
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    
    const animateColor = () => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds elapsed
      // Cycle every 8 seconds between 0 and 1
      const phase = (elapsed % 8) / 8;
      // Use sine wave for smooth back-and-forth transition
      const smoothPhase = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      setColorPhase(smoothPhase);
      
      animationFrameId = requestAnimationFrame(animateColor);
    };
    
    animationFrameId = requestAnimationFrame(animateColor);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Interpolate between yellow (dark mode) and blue (light mode)
  const getCurrentColor = () => {
    // Yellow: RGB(232, 202, 94)
    // Blue: RGB(0, 160, 255)
    const r = Math.floor(232 + (0 - 232) * colorPhase);
    const g = Math.floor(202 + (160 - 202) * colorPhase);
    const b = Math.floor(94 + (255 - 94) * colorPhase);
    return `rgba(${r}, ${g}, ${b}, 0.08)`;
  };

  const getGlowColor = () => {
    // Yellow: RGB(232, 202, 94)
    // Blue: RGB(0, 160, 255)
    const r = Math.floor(232 + (0 - 232) * colorPhase);
    const g = Math.floor(202 + (160 - 202) * colorPhase);
    const b = Math.floor(94 + (255 - 94) * colorPhase);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };

  const getRadialGradient = () => {
    const mainColor = getCurrentColor();
    const glowColor = getGlowColor();
    return `radial-gradient(circle at center, ${glowColor} 0%, ${mainColor} 50%, transparent 100%)`;
  };

  const getProductBgColor = () => {
    const r = Math.floor(232 + (0 - 232) * colorPhase);
    const g = Math.floor(202 + (160 - 202) * colorPhase);
    const b = Math.floor(94 + (255 - 94) * colorPhase);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  };

  const getProductTextColor = () => {
    const r = Math.floor(232 + (0 - 232) * colorPhase);
    const g = Math.floor(202 + (160 - 202) * colorPhase);
    const b = Math.floor(94 + (255 - 94) * colorPhase);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <section className="relative py-6 md:py-8 overflow-hidden">
      {/* Animated gradient background that smoothly transitions between yellow and blue */}
      <div 
        className="absolute inset-0 transition-all duration-300 ease-in-out"
        style={{
          background: getRadialGradient(),
        }}
      />

      {/* Soft blur overlay for extra smoothness */}
      <div 
        className="absolute inset-0 backdrop-blur-[100px]"
        style={{
          background: 'transparent'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section label - with animated color */}
        <div className="text-center mb-4">
          <p 
            className="text-[11px] uppercase tracking-wider font-medium transition-all duration-300"
            style={{ 
              color: getProductTextColor(),
            }}
          >
            Trusted Partners & Products
          </p>
        </div>

        {/* Partners Slider */}
        <div className="mb-4 relative">
          <Slider items={partnerLogos.map((partner) => (
            <div
              key={partner.id}
              className="group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
              <div 
                className="relative w-8 h-8 md:w-10 md:h-10 transition-all duration-300 group-hover:scale-110"
              >
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-contain rounded-full"
                  style={{
                    filter: 'none',
                  }}
                />
              </div>
            </div>
          ))} direction="left" speed={25} />
        </div>

        {/* Products Slider with animated colors */}
        <div className="relative">
          <Slider items={products.map((product) => (
            <div
              key={product}
              className="group relative px-3 py-1 md:px-4 md:py-1.5 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: getProductBgColor(),
              }}
            >
              <span 
                className="text-sm md:text-base  font-semibold transition-all duration-300"
                style={{
                  color: getProductTextColor(),
                }}
              >
                {product}
              </span>
            </div>
          ))} direction="right" speed={30} />
        </div>
      </div>

      <style jsx>{`
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </section>
  );
}