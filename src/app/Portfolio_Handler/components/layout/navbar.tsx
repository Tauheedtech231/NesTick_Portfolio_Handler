'use client';
import { HomeIcon, Building2, Sparkles, Menu, X, Crown, GraduationCap, Globe, Compass } from 'lucide-react';
import { ThemeToggleProfessional } from '../../../components/layout/ThemeToggleProfessional';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
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
    
    return () => observer.disconnect();
  }, []);
  
  const handleNavigateHome = () => (window.location.href = '/');
  const handleNavigateCollege = () => (window.location.href = '/College_Portfolio_Handler');
  const handleNavigateVision = () => (window.location.href = '/vision');

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon, onClick: handleNavigateHome },
    { name: 'Vision', path: '/vision', icon: Compass, onClick: handleNavigateVision },
    { name: 'College Portfolio', path: '/College_Portfolio_Handler', icon: Building2, onClick: handleNavigateCollege, isPrimary: true },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#E8CA5E]/20' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Brand/Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className={`absolute inset-0 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${
                isDarkMode ? 'bg-[#E8CA5E]' : 'bg-[#E8CA5E]'
              }`}></div>
              <div className={`relative w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-[#E8CA5E] to-[#A57F2A] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                isDarkMode ? 'shadow-[#E8CA5E]/30' : 'shadow-[#E8CA5E]/20'
              }`}>
                <Crown size={18} className="text-[#1F4381] font-bold" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className={`text-lg lg:text-xl font-bold ${
                isDarkMode ? 'bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent' : 'text-gray-900'
              }`}>
                Neezamiya
              </span>
              <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] bg-clip-text text-transparent ml-1">
                Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              if (item.isPrimary) {
                return (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] font-semibold shadow-lg shadow-[#E8CA5E]/30 hover:shadow-xl hover:shadow-[#E8CA5E]/40 transition-all duration-300 hover:scale-105"
                  >
                    <Icon size={18} className="group-hover:rotate-3 transition-transform duration-300" />
                    <span>{item.name}</span>
                    <Sparkles size={14} className="absolute -top-1 -right-1 text-[#E8CA5E] animate-pulse" />
                  </button>
                );
              }
              
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-[#1F4381]/20 to-[#00E0FF]/20 border border-[#00E0FF]/50 text-[#00E0FF]'
                        : 'bg-gradient-to-r from-[#1F4381]/10 to-[#00E0FF]/10 border border-[#00E0FF]/30 text-[#1F4381]'
                      : isDarkMode
                        ? 'bg-[#0F172A] border border-[#1E293B] hover:border-[#00E0FF]/50 text-gray-300 hover:text-white hover:shadow-lg hover:shadow-[#00E0FF]/10'
                        : 'bg-gray-100 border border-gray-200 hover:border-[#E8CA5E]/50 text-gray-700 hover:text-gray-900 hover:shadow-lg hover:shadow-[#E8CA5E]/10'
                  }`}
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00E0FF] to-[#E8CA5E] rounded-full" />
                  )}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#00E0FF]/0 via-[#00E0FF]/5 to-[#00E0FF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </button>
              );
            })}
          
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
           
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#0F172A] border border-[#1E293B] text-white hover:border-[#00E0FF]/50'
                  : 'bg-gray-100 border border-gray-200 text-gray-900 hover:border-[#E8CA5E]/50'
              }`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Premium Styled */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 pt-4 border-t space-y-3 animate-slideDown ${
            isDarkMode ? 'border-[#1E293B]' : 'border-gray-200'
          }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              if (item.isPrimary) {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] font-semibold shadow-lg transition-all duration-300"
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                    <Sparkles size={14} className="animate-pulse" />
                  </button>
                );
              }
              
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-[#1F4381]/20 to-[#00E0FF]/20 border border-[#00E0FF]/50 text-[#00E0FF]'
                        : 'bg-gradient-to-r from-[#1F4381]/10 to-[#00E0FF]/10 border border-[#00E0FF]/30 text-[#1F4381]'
                      : isDarkMode
                        ? 'bg-[#0F172A] border border-[#1E293B] text-gray-300 hover:text-white'
                        : 'bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              );
            })}
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
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}