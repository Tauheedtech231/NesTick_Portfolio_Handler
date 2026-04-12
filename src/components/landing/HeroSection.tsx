// components/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Compass, Globe2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({ scrollToSection, heroRef }: HeroSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [gifLoaded, setGifLoaded] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  
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
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Simple parallax effect on mouse move
  useEffect(() => {
    if (!parallaxRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 10;
      const yPercent = (clientY / innerHeight - 0.5) * 5;
      
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate(${xPercent}px, ${yPercent}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-white'
      }`}
    >
      {/* Animated GIF Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          ref={parallaxRef}
          className="absolute inset-0 transition-transform duration-300 ease-out"
        >
          {/* Fallback Image - Shows until GIF loads */}
          {!gifLoaded && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          
          {/* Animated GIF */}
          <img
            src="https://cdn.pixabay.com/animation/2023/01/24/23/10/23-10-04-56_512.gif"
            alt="Animated galaxy background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              gifLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setGifLoaded(true)}
          />
        </div>
        
        {/* Theme-aware overlays */}
        <div 
          className="absolute inset-0 z-10 transition-all duration-500"
          style={{
            background: theme === 'dark' 
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6), rgba(0,0,0,0.8))'
              : 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.3))'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border shadow-md mb-6 sm:mb-8 mt-8 sm:mt-12 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[#1F4381]/40 border-[#E8CA5E]/30'
              : 'bg-white border-[#E8CA5E]/50'
          }`}>
            <div className="flex gap-1">
              <Compass className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-500 ${
                theme === 'dark' ? 'text-[#00E0FF]' : 'text-[#1F4381]'
              }`} />
              <Globe2 className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-500 ${
                theme === 'dark' ? 'text-[#E8CA5E]' : 'text-[#A57F2A]'
              }`} />
            </div>
            <span className={`text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              🌟 Trusted by 500+ Educational Institutions
            </span>
          </div>

          {/* Headings - Mobile: 4xl, Desktop: 5xl */}
          <div className="mb-5 sm:mb-7">
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-bold leading-[1.2] sm:leading-[1.3] mb-3 sm:mb-4 max-w-5xl">
              <span className="block text-white font-serif tracking-tight drop-shadow-lg">
                Journey Through the
              </span>
            </h1>
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-bold leading-[1.2] sm:leading-[1.3]">
              <span className="block">
                <span className="text-[#E8CA5E] font-serif drop-shadow-lg">Galaxy of</span>{' '}
                <span className="text-[#00E0FF] font-serif drop-shadow-lg">College Portfolios</span>
              </span>
            </h1>
          </div>

          {/* Subheading - Light mode: Yellow (#E8CA5E), Dark mode: Light gray */}
          <p className={`text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-2 mb-8 sm:mb-10 font-light tracking-wide transition-all duration-500 ${
            theme === 'dark' ? 'text-gray-300' : 'text-[#E8CA5E]'
          }`}>
            Like the ancient libraries of Baghdad, we preserve and showcase educational excellence. 
            A centralized constellation where institutions create, customize, and control their digital 
            presence across the universe of learning.
          </p>

          {/* Single CTA Button */}
          <button
            onClick={() => scrollToSection("templates")}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] hover:from-[#00E0FF] hover:to-[#1F4381] text-[#1F4381] hover:text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Simple scroll hint */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-1 opacity-50">
          <span className="text-[9px] uppercase tracking-wider text-gray-400">Scroll</span>
          <div className="w-4 h-6 border border-gray-400 rounded-full flex justify-center">
            <div className="w-0.5 h-1.5 bg-gray-400 rounded-full mt-1 animate-bounce" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .will-change-transform {
          will-change: transform;
        }
        
        /* Smooth font rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Elegant text selection */
        ::selection {
          background: linear-gradient(135deg, #E8CA5E40, #00E0FF40);
          color: #E8CA5E;
        }
      `}</style>
    </section>
  );
}