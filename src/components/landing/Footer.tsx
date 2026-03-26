// components/landing/Footer.tsx
'use client';

import { Heart, Mail, Phone, MapPin, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#0B0F19] border-t border-[#1E293B] pt-12 pb-6">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-white">Portfolio Handler</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Empowering educational institutions with modern portfolio management solutions. 
              Create, manage, and showcase student portfolios effortlessly.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Features', 'Templates', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-400 hover:text-[#38BDF8] transition-colors text-sm"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span>support@portfoliohandler.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span>+92 319 3236529</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span>Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Globe className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <a href="https://nesticktech.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors">
                  nesticktech.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1E293B] pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Portfolio Handler. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500" /> by{' '}
              <a href="https://nesticktech.com" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline">
                Nestick Tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}