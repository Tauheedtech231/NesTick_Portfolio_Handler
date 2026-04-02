'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LogOut, LayoutDashboard, Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

  const getUserEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  const navItems = [
    { name: 'Home', path: '/' },
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
        ? 'bg-[#0B0F19]/95 backdrop-blur-lg border-b border-[#1E293B] shadow-lg' 
        : 'bg-[#0B0F19]/90 backdrop-blur-sm border-b border-[#1E293B]/50'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with Golden Background */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity group"
          >
            <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-[#FFD700]/30">
              <span className="text-black font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-white">
              Portfolio Handler
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative px-4 py-2 transition-all duration-300 ease-out group ${
                    isActive 
                      ? 'text-[#38BDF8]' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="font-medium text-sm uppercase tracking-wide">
                    {item.name}
                  </span>
                  <span className={`absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-full transition-all duration-500 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              );
            })}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3">
            {/* Feedback Button - Full Golden */}
            <Link
              href="/feedback"
              className="hidden sm:flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#FFD700]/90 hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/30"
            >
              <MessageCircle className="w-4 h-4" />
              Feedback
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#38BDF8]/30 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {getUserEmail().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-300 max-w-[150px] truncate">
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
                    <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] rounded-xl shadow-lg border border-[#1E293B] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-[#1E293B]">
                        <p className="text-sm font-medium text-white">Signed in as</p>
                        <p className="text-sm text-gray-400 truncate">{getUserEmail()}</p>
                      </div>
                      
                      <div className="p-2">
                        {user.email === 'tauheeddeveloper13@gmail.com' && (
                          <button
                            onClick={handleDashboardRedirect}
                            className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1E293B] rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="font-medium">Dashboard</span>
                          </button>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1E293B] rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Logout</span>
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
                  className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[#1D4ED8]/30"
                >
                  Login
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle with Animated Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#38BDF8]/30 transition-all duration-300 relative overflow-hidden"
              aria-label="Toggle menu"
            >
              <div className="relative z-10">
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-400 transition-transform duration-300 rotate-0" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-400 transition-transform duration-300" />
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
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`block w-full text-left font-medium text-sm py-2.5 px-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#1D4ED8]/20 to-[#38BDF8]/20 text-[#38BDF8]' 
                        : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
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
                className="flex items-center justify-center gap-2 w-full mt-2 bg-[#FFD700] text-black px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-[#FFD700]/90"
              >
                <MessageCircle className="w-4 h-4" />
                Feedback
              </Link>
            </div>

            {user ? (
              <div className="border-t border-[#1E293B] px-4 py-4 space-y-2">
                {user.email === 'tauheeddeveloper13@gmail.com' && (
                  <button
                    onClick={() => {
                      handleDashboardRedirect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white rounded-lg hover:scale-105 transition-all duration-300"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-[#1E293B] px-4 py-4">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2.5 text-sm bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white rounded-lg hover:scale-105 transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}