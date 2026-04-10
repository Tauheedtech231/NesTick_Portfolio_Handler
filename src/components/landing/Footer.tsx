'use client';

import { Heart, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1F4381] border-t border-[#00E0FF]/20 pt-12 pb-6 relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E0FF]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8CA5E]/20 to-transparent" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{ boxShadow: '0 0 15px rgba(0, 224, 255, 0.3)' }}>
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] bg-clip-text text-transparent">
                Portfolio Handler
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Empowering educational institutions with modern portfolio management solutions. 
              Create, manage, and showcase student portfolios effortlessly.
            </p>
            {/* Trust Badge */}
            <div className="flex items-center gap-2 mt-4">
              <Sparkles className="w-4 h-4 text-[#00E0FF]" />
              <span className="text-xs text-gray-400">Trusted by 500+ Institutions</span>
            </div>
          </div>

          {/* Quick Links with accent hover */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#E8CA5E]" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#00E0FF] transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/vision" className="text-gray-300 hover:text-[#00E0FF] transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300"></span>
                  Vision
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-300 hover:text-[#00E0FF] transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300"></span>
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#00E0FF] transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#00E0FF]/0 group-hover:bg-[#00E0FF] rounded-full transition-all duration-300"></span>
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with accent line */}
        <div className="border-t border-[#00E0FF]/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Portfolio Handler. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-[#E8CA5E]" /> by{' '}
              <a 
                href="https://nesticktech.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#00E0FF] hover:text-[#E8CA5E] hover:underline transition-colors"
              >
                Nestick Tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}