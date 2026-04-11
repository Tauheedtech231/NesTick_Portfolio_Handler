'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LogOut, LayoutDashboard, Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check user authentication
  useEffect(() => {
    const checkUserAuthentication = () => {
      if (typeof window !== 'undefined') {
        const loginUser = localStorage.getItem('login_user');
        if (loginUser) {
          setUser(JSON.parse(loginUser));
        } else {
          setUser(null);
        }
      }
    };

    checkUserAuthentication();

    const handleStorageChange = () => {
      checkUserAuthentication();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Mobile menu animations - Smooth slide from top
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        // Animate in - slide down with bounce effect
        gsap.fromTo(mobileMenuRef.current,
          { 
            y: -20, 
            opacity: 0,
            display: "block"
          },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.5,
            ease: "back.out(0.6)",
            clearProps: "display"
          }
        );
      } else {
        // Animate out - slide up
        gsap.to(mobileMenuRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            if (mobileMenuRef.current) {
              gsap.set(mobileMenuRef.current, { display: "none" });
            }
          }
        });
      }
    }
  }, [isMobileMenuOpen]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('login_user');
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/auth/login');
  };

  // Handle dashboard redirect for super admin
  const handleDashboardRedirect = () => {
    router.push('/Portfolio_Handler');
  };

  // Handle logo click - redirect to designer portal
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if user is logged in and has access to designer portal
    if (user) {
      router.push('/designer-portal');
    } else {
      // If not logged in, redirect to login page
      router.push('/auth/login');
    }
  };

  const getUserEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Vision', path: '/vision' },
    { name: 'Templates', path: '/templates' },
    { name: 'About', path: '/about' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      isScrolled 
        ? 'bg-[#1F4381]/95 backdrop-blur-lg border-b border-[#00E0FF]/20 shadow-lg' 
        : 'bg-[#1F4381]/90 backdrop-blur-sm border-b border-[#00E0FF]/10'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with Brand Colors - Bigger Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogoClick(e as unknown as React.MouseEvent);
              }
            }}
          >
            {/* Bigger Logo Image */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#00E0FF]/20">
              <Image
                src="/logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            {/* Stylish Company Name */}
            <span className="text-xl md:text-2xl font-bold font-serif tracking-tight bg-gradient-to-r from-[#E8CA5E] via-[#F5D76E] to-[#A57F2A] bg-clip-text text-transparent animate-gradient">
              Portfolio Handler
            </span>
          </div>

          {/* Desktop Navigation - Stylish Font */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative px-4 py-2 transition-all duration-300 ease-out group ${
                    isActive 
                      ? 'text-[#00E0FF]' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="font-semibold text-sm uppercase tracking-wide font-sans">
                    {item.name}
                  </span>
                  <span className={`absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-[#E8CA5E] to-[#00E0FF] rounded-full transition-all duration-500 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              );
            })}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3">
            {/* Feedback Button - Stylish */}
            <Link
              href="/feedback"
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#E8CA5E]/30"
              style={{ boxShadow: '0 0 15px rgba(232, 202, 94, 0.2)' }}
            >
              <MessageCircle className="w-4 h-4" />
              Feedback
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#1F4381]/50 border border-[#00E0FF]/30 hover:border-[#00E0FF] transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] rounded-lg flex items-center justify-center">
                    <span className="text-[#1F4381] font-bold text-sm">
                      {getUserEmail().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-300 max-w-[150px] truncate font-sans">
                    {getUserEmail()}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-[#1F4381] rounded-xl shadow-lg border border-[#00E0FF]/30 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-[#00E0FF]/20">
                        <p className="text-sm font-semibold text-white font-sans">Signed in as</p>
                        <p className="text-sm text-gray-300 truncate font-light">{getUserEmail()}</p>
                      </div>
                      
                      <div className="p-2">
                        {/* Designer Portal Link - For all logged in users */}
                        <button
                          onClick={() => {
                            router.push('/designer-portal');
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#00E0FF]/10 hover:text-[#00E0FF] rounded-lg transition-colors font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Designer Portal</span>
                        </button>
                        
                        {/* Super Admin Dashboard - Only for specific email */}
                        {user.email === 'tauheeddeveloper13@gmail.com' && (
                          <button
                            onClick={handleDashboardRedirect}
                            className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#00E0FF]/10 hover:text-[#00E0FF] rounded-lg transition-colors font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#00E0FF]/10 hover:text-[#00E0FF] rounded-lg transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="bg-gradient-to-r from-[#4F0281] to-[#DC33E0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[#4F0281]/30"
                  style={{ boxShadow: '0 0 15px rgba(79, 2, 129, 0.3)' }}
                >
                  Login
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle with Animated Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#1F4381]/50 border border-[#00E0FF]/30 hover:border-[#00E0FF] transition-all duration-300 relative overflow-hidden"
              aria-label="Toggle menu"
            >
              <div className="relative z-10">
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-300 transition-transform duration-300 rotate-0" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-300 transition-transform duration-300" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Content - Smooth Slide Animation */}
        <div 
          ref={mobileMenuRef} 
          className="lg:hidden mt-3 overflow-hidden"
          style={{ display: 'none' }}
        >
          <div className="bg-[#1F4381] border border-[#00E0FF]/30 rounded-xl shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`block w-full text-left font-semibold text-sm py-2.5 px-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#00E0FF]/20 text-[#00E0FF]' 
                        : 'text-gray-300 hover:bg-[#00E0FF]/10 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              
              {/* Mobile Feedback Button */}
              <Link
                href="/feedback"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full mt-2 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                Feedback
              </Link>
            </div>

            {user ? (
              <div className="border-t border-[#00E0FF]/20 px-4 py-4 space-y-2">
                {/* Designer Portal - Mobile */}
                <button
                  onClick={() => {
                    router.push('/designer-portal');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-[#00E0FF] to-[#1F4381] text-white rounded-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Designer Portal
                </button>
                
                {/* Super Admin Dashboard - Mobile */}
                {user.email === 'tauheeddeveloper13@gmail.com' && (
                  <button
                    onClick={() => {
                      handleDashboardRedirect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] rounded-lg hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </button>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-[#4F0281] to-[#DC33E0] text-white rounded-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-[#00E0FF]/20 px-4 py-4">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2.5 text-sm bg-gradient-to-r from-[#4F0281] to-[#DC33E0] text-white rounded-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Login
                </Link>
              </div>
            )}
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
    </nav>
  );
}