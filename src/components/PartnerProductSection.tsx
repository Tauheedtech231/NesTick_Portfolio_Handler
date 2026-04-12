// components/PartnerProductSection.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const products = ["Neezamiya", "Advance POS", "MarX", "Build N"];

const partnerLogos = [
  { id: 1, name: "Microsoft", image: "https://images.unsplash.com/photo-1642132652075-0c5f10da6c0e?w=100&h=100&fit=crop" },
  { id: 2, name: "Google", image: "https://images.unsplash.com/photo-1573804633927-b8c6e3c9f8b5?w=100&h=100&fit=crop" },
  { id: 3, name: "Amazon", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop" },
  { id: 4, name: "Apple", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&h=100&fit=crop" },
  { id: 5, name: "Meta", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=100&fit=crop" },
  { id: 6, name: "Netflix", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop" },
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Detect theme changes
  useEffect(() => {
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

  const productItems = products.map((product) => (
    <div
      key={product}
      className="group relative px-3 py-1 md:px-4 md:py-1.5 rounded-lg border transition-all duration-300 cursor-pointer whitespace-nowrap"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: theme === 'dark' ? 'transparent' : 'rgba(232, 202, 94, 0.3)',
      }}
    >
      <span 
        className="text-sm md:text-base lg:text-lg font-bold transition-all duration-300 bg-clip-text text-transparent"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'linear-gradient(to right, #9CA3AF, #D1D5DB)'
            : 'linear-gradient(to right, #1F4381, #00E0FF)',
        }}
      >
        {product}
      </span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#E8CA5E]/0 via-[#E8CA5E]/10 to-[#E8CA5E]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  ));

  const partnerItems = partnerLogos.map((partner) => (
    <div
      key={partner.id}
      className="group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 cursor-pointer"
    >
      <div 
        className="relative w-8 h-8 md:w-10 md:h-10 transition-all duration-300 group-hover:scale-110"
        style={{
          filter: theme === 'dark' ? 'grayscale(100%)' : 'grayscale(0%)',
          opacity: theme === 'dark' ? 0.6 : 1,
        }}
      >
        <Image
          src={partner.image}
          alt={partner.name}
          fill
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  ));

  // Get gradient colors based on theme
  const gradientColors = theme === 'dark'
    ? ['#0B0F19', '#1F4381', '#E8CA5E', '#0B0F19', '#00E0FF', '#1F4381', '#0B0F19']
    : ['#F5F5F5', '#E8CA5E', '#1F4381', '#F5F5F5', '#00E0FF', '#E8CA5E', '#F5F5F5'];

  return (
    <section className="relative py-4 md:py-6 overflow-hidden">
      {/* Theme-aware background - Fixed style conflict */}
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{
          backgroundImage: `linear-gradient(270deg, ${gradientColors.join(', ')})`,
          backgroundSize: '400% 400%',
          backgroundPosition: '0% 50%',
          animation: 'smoothGradient 15s ease infinite',
        }}
      />
      
      {/* Subtle overlay for blending */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, rgba(11, 15, 25, 0.3), rgba(11, 15, 25, 0.1), rgba(11, 15, 25, 0.3))'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3))'
        }}
      />

      {/* Edge Fade Masks */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Partners Slider */}
        <div className="mb-3 md:mb-4 relative">
          <div 
            className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to right, #0B0F19, transparent)'
                : 'linear-gradient(to right, #F5F5F5, transparent)'
            }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to left, #0B0F19, transparent)'
                : 'linear-gradient(to left, #F5F5F5, transparent)'
            }}
          />
          <Slider items={partnerItems} direction="left" speed={30} />
        </div>

        {/* Products Slider */}
        <div className="relative">
          <div 
            className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to right, #0B0F19, transparent)'
                : 'linear-gradient(to right, #F5F5F5, transparent)'
            }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to left, #0B0F19, transparent)'
                : 'linear-gradient(to left, #F5F5F5, transparent)'
            }}
          />
          <Slider items={productItems} direction="right" speed={35} />
        </div>
      </div>

      <style jsx>{`
        @keyframes smoothGradient {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 50%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </section>
  );
}