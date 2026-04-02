'use client';

import { Heart, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19] border-t border-[#FFD700]/20 pt-12 pb-6 relative overflow-hidden">
      {/* Golden gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link href="/home" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFD700] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#FFD700]/30">
                <span className="text-black font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-white">
                Portfolio Handler
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Empowering educational institutions with modern portfolio management solutions. 
              Create, manage, and showcase student portfolios effortlessly.
            </p>
            {/* Trust Badge */}
            <div className="flex items-center gap-2 mt-4">
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span className="text-xs text-gray-500">Trusted by 500+ Institutions</span>
            </div>
          </div>

          {/* Quick Links with golden hover */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#FFD700]" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-gray-400 hover:text-[#FFD700] transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#FFD700]/0 group-hover:bg-[#FFD700] rounded-full transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-400 hover:text-[#FFD700] transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#FFD700]/0 group-hover:bg-[#FFD700] rounded-full transition-all duration-300"></span>
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#FFD700] transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#FFD700]/0 group-hover:bg-[#FFD700] rounded-full transition-all duration-300"></span>
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with golden line */}
        <div className="border-t border-[#FFD700]/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Portfolio Handler. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-[#FFD700]" /> by{' '}
              <a 
                href="https://nesticktech.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FFD700] hover:text-[#FFD700]/80 hover:underline transition-colors"
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