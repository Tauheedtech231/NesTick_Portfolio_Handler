'use client';

import { Heart, Sparkles, Star, Compass, Globe2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
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

  return (
    <footer 
      className="border-t pt-12 pb-6 relative overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: theme === 'dark' 
          ? 'linear-gradient(135deg, #1F4381, #0F172A)'
          : '#FFFFFF',
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1F4381, #0F172A)'
          : '#FFFFFF',
        borderTopColor: theme === 'dark' ? 'rgba(0, 224, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Gradient overlays - Blended borders */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8CA5E]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E0FF]/15 to-transparent" />
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.05)' : 'rgba(232, 202, 94, 0.1)',
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(0, 224, 255, 0.05)' : 'rgba(0, 224, 255, 0.1)',
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div className="group">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg"
                style={{
                  boxShadow: theme === 'dark' ? '0 0 15px rgba(0, 224, 255, 0.2)' : '0 0 15px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold font-serif tracking-tight bg-gradient-to-r from-[#E8CA5E] via-[#F5D76E] to-[#A57F2A] bg-clip-text text-transparent animate-gradient">
                Portfolio Handler
              </span>
            </Link>
            <p className="text-sm md:text-base leading-relaxed mb-4 font-light max-w-md transition-colors duration-500"
              style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
            >
              Empowering educational institutions with modern portfolio management solutions. 
              Create, manage, and showcase student portfolios effortlessly.
            </p>
            {/* Trust Badge */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#00E0FF]" />
                <Sparkles className="w-3 h-3 text-[#E8CA5E] -ml-1" />
              </div>
              <span className="text-xs font-medium tracking-wide transition-colors duration-500"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              >
                Trusted by 500+ Institutions
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg md:text-xl mb-5 flex items-center gap-2 font-serif tracking-tight transition-colors duration-500"
              style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
            >
              <Star className="w-5 h-5 text-[#E8CA5E] fill-[#E8CA5E]/20" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="transition-all duration-300 text-sm md:text-base flex items-center gap-2 group font-medium"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  <span className="w-1.5 h-1.5 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/vision" className="transition-all duration-300 text-sm md:text-base flex items-center gap-2 group font-medium"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  <span className="w-1.5 h-1.5 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                  Vision
                </Link>
              </li>
              <li>
                <Link href="/templates" className="transition-all duration-300 text-sm md:text-base flex items-center gap-2 group font-medium"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  <span className="w-1.5 h-1.5 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-all duration-300 text-sm md:text-base flex items-center gap-2 group font-medium"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                >
                  <span className="w-1.5 h-1.5 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with blended accent line */}
        <div className="relative pt-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8CA5E]/30 to-transparent" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            <p className="text-xs md:text-sm text-center md:text-left font-light tracking-wide transition-colors duration-500"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              © {currentYear} Portfolio Handler. All rights reserved.
            </p>
            <p className="text-xs md:text-sm flex items-center gap-1 font-light transition-colors duration-500"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            >
              Made with <Heart className="w-3 h-3 text-[#E8CA5E] animate-pulse" /> by{' '}
              <a 
                href="https://nesticktech.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#00E0FF] hover:text-[#E8CA5E] hover:underline transition-all duration-300 font-medium"
              >
                Nestick Tech
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </footer>
  );
}