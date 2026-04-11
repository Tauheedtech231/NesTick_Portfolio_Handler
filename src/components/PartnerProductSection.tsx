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
  const productItems = products.map((product) => (
    <div
      key={product}
      className="group relative px-3 py-1 md:px-4 md:py-1.5 bg-[#0F172A]/40 backdrop-blur-sm rounded-lg border border-transparent hover:border-[#E8CA5E]/30 transition-all duration-300 cursor-pointer whitespace-nowrap"
    >
      <span className="text-sm md:text-base lg:text-lg font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent group-hover:from-[#E8CA5E] group-hover:to-[#A57F2A] transition-all duration-300">
        {product}
      </span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#E8CA5E]/0 via-[#E8CA5E]/5 to-[#E8CA5E]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  ));

  const partnerItems = partnerLogos.map((partner) => (
    <div
      key={partner.id}
      className="group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 cursor-pointer"
    >
      <div className="relative w-8 h-8 md:w-10 md:h-10 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110">
        <Image
          src={partner.image}
          alt={partner.name}
          fill
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  ));

  return (
    <section className="relative py-4 md:py-6 overflow-hidden">
      {/* Smooth Continuous Changing Background - Intact */}
      <div className="absolute inset-0 bg-gradient-moving" />
      
      {/* Subtle overlay for blending - No borders */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/20 via-transparent to-[#0B0F19]/20 pointer-events-none" />

      {/* Edge Fade Masks - Only these remain for smooth edges */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Partners Slider - Right to Left */}
        <div className="mb-3 md:mb-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-10 pointer-events-none" />
          <Slider items={partnerItems} direction="left" speed={35} />
        </div>

        {/* Products Slider - Left to Right */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-10 pointer-events-none" />
          <Slider items={productItems} direction="right" speed={40} />
        </div>
      </div>

      <style jsx>{`
        @keyframes smoothGradient {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .bg-gradient-moving {
          background: linear-gradient(
            270deg,
            #0B0F19 0%,
            #1F4381 20%,
            #E8CA5E 35%,
            #0B0F19 50%,
            #00E0FF 65%,
            #1F4381 80%,
            #0B0F19 100%
          );
          background-size: 400% 400%;
          animation: smoothGradient 12s ease infinite;
        }
      `}</style>
    </section>
  );
}