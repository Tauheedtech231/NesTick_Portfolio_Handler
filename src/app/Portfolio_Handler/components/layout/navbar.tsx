'use client';
import { HomeIcon, Building2, Sparkles, Menu, X } from 'lucide-react';
import { ThemeToggleProfessional } from '../../../components/layout/ThemeToggleProfessional';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
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
    
    return () => observer.disconnect();
  }, []);
  
  const handleNavigateHome = () => (window.location.href = '/');
  const handleNavigateCollege = () => (window.location.href = '/College_Portfolio_Handler');

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#FFD700]/20' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Brand/Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`absolute inset-0 rounded-xl blur-md opacity-50 ${
                isDarkMode ? 'bg-[#FFD700]' : 'bg-[#FFD700]'
              }`}></div>
              <div className={`relative w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-[#FFD700] to-[#FFD700]/70 rounded-xl flex items-center justify-center shadow-lg ${
                isDarkMode ? 'shadow-[#FFD700]/30' : 'shadow-[#FFD700]/20'
              }`}>
                <span className="text-[#0B0F19] font-bold text-base lg:text-lg">P</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className={`text-lg lg:text-xl font-bold ${
                isDarkMode ? 'bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent' : 'text-gray-900'
              }`}>
                Portfolio
              </span>
              <span className="text-lg lg:text-xl font-bold text-[#FFD700] ml-1">
                Handler
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Home Button */}
            <button
              onClick={handleNavigateHome}
              className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#0F172A] border border-[#1E293B] hover:border-[#FFD700]/50 text-gray-300 hover:text-white hover:shadow-lg hover:shadow-[#FFD700]/10'
                  : 'bg-gray-100 border border-gray-200 hover:border-[#FFD700]/50 text-gray-700 hover:text-gray-900 hover:shadow-lg hover:shadow-[#FFD700]/10'
              }`}
            >
              <HomeIcon size={18} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Home</span>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/5 to-[#FFD700]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            </button>

            {/* College Portfolio Button */}
            <button
              onClick={handleNavigateCollege}
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-[#0B0F19] font-semibold shadow-lg shadow-[#FFD700]/30 hover:shadow-xl hover:shadow-[#FFD700]/40 transition-all duration-300 hover:scale-105"
            >
              <Building2 size={18} className="group-hover:rotate-3 transition-transform duration-300" />
              <span>College Portfolio</span>
              <Sparkles size={14} className="absolute -top-1 -right-1 text-[#FFD700] animate-pulse" />
            </button>

           
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggleProfessional />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#0F172A] border border-[#1E293B] text-white hover:border-[#FFD700]/50'
                  : 'bg-gray-100 border border-gray-200 text-gray-900 hover:border-[#FFD700]/50'
              }`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 pt-4 border-t space-y-3 animate-slideDown ${
            isDarkMode ? 'border-[#1E293B]' : 'border-gray-200'
          }`}>
            <button
              onClick={() => {
                handleNavigateHome();
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#0F172A] border border-[#1E293B] text-gray-300 hover:text-white'
                  : 'bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900'
              }`}
            >
              <HomeIcon size={18} />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => {
                handleNavigateCollege();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-[#0B0F19] font-semibold shadow-lg transition-all duration-300"
            >
              <Building2 size={18} />
              <span>College Portfolio</span>
            </button>
          </div>
        )}
      </div>

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
    </nav>
  );
}