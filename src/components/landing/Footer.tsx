'use client';

import { Heart, Sparkles, Star, Compass, Globe2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#1F4381] to-[#0F172A] border-t border-[#00E0FF]/10 pt-12 pb-6 relative overflow-hidden">
      {/* Gradient overlays - Blended borders */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8CA5E]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E0FF]/15 to-transparent" />
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E8CA5E]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00E0FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div className="group">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#00E0FF]/20">
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
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 font-light max-w-md">
              Empowering educational institutions with modern portfolio management solutions. 
              Create, manage, and showcase student portfolios effortlessly.
            </p>
            {/* Trust Badge */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#00E0FF]" />
                <Sparkles className="w-3 h-3 text-[#E8CA5E] -ml-1" />
              </div>
              <span className="text-xs text-gray-400 font-medium tracking-wide">Trusted by 500+ Institutions</span>
            </div>
          </div>

          {/* Quick Links - No border under heading */}
          <div>
            <h3 className="text-white font-bold text-lg md:text-xl mb-5 flex items-center gap-2 font-serif tracking-tight">
              <Star className="w-5 h-5 text-[#E8CA5E] fill-[#E8CA5E]/20" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#00E0FF] transition-all duration-300 text-sm md:text-base flex items-center gap-2 group font-medium">
                  <span className="w-1.5 h-1.5 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/vision" className="text-gray-300 hover:text-[#00E0FF] transition-all duration-300 text-sm md:text-base flex items-center gap-2 group font-medium">
                  <span className="w-1.5 h-1.5 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                  Vision
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-300 hover:text-[#00E0FF] transition-all duration-300 text-sm md:text-base flex items-center gap-2 group font-medium">
                  <span className="w-1.5 h-1.5 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#00E0FF] transition-all duration-300 text-sm md:text-base flex items-center gap-2 group font-medium">
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
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left font-light tracking-wide">
              © {currentYear} Portfolio Handler. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs md:text-sm flex items-center gap-1 font-light">
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