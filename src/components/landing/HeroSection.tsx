'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Compass, Globe2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({ scrollToSection, heroRef }: HeroSectionProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Auto-play video when loaded
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, [videoLoaded]);
  
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden w-full"
    >
      {/* Video Background - Direct */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <div 
          ref={parallaxRef}
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
        >
          <div className="absolute inset-0 w-full h-full bg-black">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted
              playsInline
              autoPlay
              onLoadedData={() => setVideoLoaded(true)}
              style={{
                opacity: videoLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <source src="/v.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Fallback gradient if video fails to load */}
            {!videoLoaded && (
              <div 
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1F4381] to-[#0B0F19]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Main Content */}
      <div className="relative z-20 container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border shadow-md mb-6 sm:mb-8 mt-8 sm:mt-12 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[#1F4381] border-[#E8CA5E]'
              : 'bg-white border-[#00A0FF]'
          }`}>
            <div className="flex gap-1">
              <Compass className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-500 ${
                theme === 'dark' ? 'text-[#E8CA5E]' : 'text-[#00A0FF]'
              }`} />
              <Globe2 className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-500 ${
                theme === 'dark' ? 'text-[#E8CA5E]' : 'text-[#00A0FF]'
              }`} />
            </div>
            <span className={`text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-[#00A0FF]'
            }`}>
              🌟 Trusted by 500+ Educational Institutions
            </span>
          </div>

          {/* Headings */}
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

          {/* Subheading - White in both modes */}
          <p className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-2 mb-8 sm:mb-10 font-light tracking-wide text-white drop-shadow-md">
            Like the ancient libraries of Baghdad, we preserve and showcase educational excellence. 
            A centralized constellation where institutions create, customize, and control their digital 
            presence across the universe of learning.
          </p>

          {/* Single CTA Button */}
          <button
            onClick={() => scrollToSection("templates")}
            className={`group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#E8CA5E] text-[#1F4381] hover:bg-[#E8CA5E]/90'
                : 'bg-[#00A0FF] text-white hover:bg-[#00A0FF]/90'
            }`}
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Simple scroll hint */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-1 opacity-50">
          <span className="text-[9px] uppercase tracking-wider text-white">Scroll</span>
          <div className="w-4 h-6 border border-white rounded-full flex justify-center">
            <div className="w-0.5 h-1.5 bg-white rounded-full mt-1 animate-bounce" />
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