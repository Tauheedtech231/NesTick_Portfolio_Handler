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
        className="flex gap-6 md:gap-8 will-change-transform"
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
      className="group relative px-4 py-1.5 md:px-5 md:py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 hover:border-[#FFD700] transition-all duration-300 cursor-pointer whitespace-nowrap"
    >
      <span className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-[#FFD700] group-hover:to-[#FFD700] transition-all duration-300">
        {product}
      </span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/10 to-[#FFD700]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  ));

  const partnerItems = partnerLogos.map((partner) => (
    <div
      key={partner.id}
      className="group relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 cursor-pointer"
    >
      <div className="relative w-10 h-10 md:w-12 md:h-12 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110">
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
    <section className="relative py-6 md:py-8 overflow-hidden">
      {/* Smooth Continuous Changing Background */}
      <div className="absolute inset-0 bg-gradient-moving" />
      
      {/* Subtle overlay for smooth blending */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Blended Border - Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
      
      {/* Blended Border - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />

      {/* Edge Fade Masks */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Partners Slider - Right to Left */}
        <div className="mb-4 md:mb-5 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <Slider items={partnerItems} direction="left" speed={35} />
        </div>

        {/* Products Slider - Left to Right */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
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
            #0B1C3D 0%,
            #1a2f4e 15%,
            #FFD700 30%,
            #0B1C3D 45%,
            #FFD700 60%,
            #1a2f4e 75%,
            #0B1C3D 90%,
            #000000 100%
          );
          background-size: 400% 400%;
          animation: smoothGradient 10s ease infinite;
        }
      `}</style>
    </section>
  );
}