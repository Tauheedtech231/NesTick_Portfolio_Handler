/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const pathname = usePathname();
  
  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDarkNow);
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // Load navbar links from localStorage
    loadNavLinks();

    // Listen for storage changes from sidebar
    const handleStorageChange = () => {
      loadNavLinks();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadNavLinks = () => {
    const stored = localStorage.getItem('navbar_links');
    if (stored) {
      try {
        const links = JSON.parse(stored);
        setNavLinks(links);
      } catch {
        setNavLinks([]);
      }
    } else {
      setNavLinks([]);
    }
  };

  const hasNavLinks = navLinks.length > 0;

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-blue-500/20' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Brand/Logo - Always visible */}
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="hidden sm:block">
                <span className={`text-lg lg:text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Neezamiya
                </span>
                <span className="text-lg lg:text-xl font-bold text-yellow-500 ml-1">
                  Portal
                </span>
              </div>
            </Link>

            {/* Center - Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center gap-6">
              {/* Dynamic Nav Links from Sidebar - Only when dropdown is active */}
              {hasNavLinks && (
                <>
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                        pathname === link.href
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : isDarkMode
                            ? 'bg-gray-800 border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white hover:shadow-lg hover:shadow-blue-500/20'
                            : 'bg-gray-100 border border-gray-200 hover:border-yellow-500 text-gray-700 hover:text-gray-900 hover:shadow-lg hover:shadow-yellow-500/20'
                      }`}
                    >
                      <span className="text-sm font-medium">{link.label}</span>
                      {pathname === link.href && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Right side - Empty (College Portfolio Button Removed) */}
            <div className="hidden md:flex items-center">
              {/* College Portfolio Button REMOVED */}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800 border border-gray-700 text-white'
                    : 'bg-gray-100 border border-gray-200 text-gray-900'
                }`}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden mt-4 pt-4 border-t space-y-3 animate-slideDown ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {/* Dynamic Nav Links for Mobile */}
              {hasNavLinks && (
                <>
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        pathname === link.href
                          ? 'bg-blue-600 text-white'
                          : isDarkMode
                            ? 'bg-gray-800 border border-gray-700 text-gray-300'
                            : 'bg-gray-100 border border-gray-200 text-gray-700'
                      }`}
                    >
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </>
              )}

              {/* College Portfolio Button REMOVED from mobile also */}
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}