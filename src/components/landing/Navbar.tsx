/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { LogOut, LayoutDashboard, Menu, X, Sun, Moon, Code2, UserCircle, Shield, Sparkles, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Custom theme hook
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      document.documentElement.classList.toggle('dark', defaultTheme === 'dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, [theme]);

  return { theme, toggleTheme, mounted };
}

// Simple nav item with slide animation
const NavItem = memo(({ item, isActive, onClick, theme, index, isVisible }: { 
  item: { name: string; path: string }; 
  isActive: boolean; 
  onClick: () => void;
  theme: 'light' | 'dark';
  index: number;
  isVisible: boolean;
}) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 transition-all duration-700 ease-out will-change-transform cursor-pointer ${
      isActive 
        ? (theme === 'dark' ? 'text-[#E8CA5E]' : 'text-[#0066FF]')
        : (theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#1F4381]')
    }`}
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-80px)',
      transitionDelay: `${index * 100}ms`,
      fontFamily: "'Poppins', sans-serif",
    }}
  >
    <span className="font-medium text-sm uppercase tracking-wide">
      {item.name}
    </span>
    <span className={`absolute left-0 bottom-0 h-0.5 rounded-full transition-all duration-200 ${
      isActive ? 'w-full' : 'w-0 group-hover:w-full'
    }`}
    style={{
      backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
    }} />
  </button>
));

NavItem.displayName = 'NavItem';

// Login Dropdown Component
const LoginDropdown = ({ theme, onSelect, isVisible }: { theme: 'light' | 'dark'; onSelect: (route: string) => void; isVisible: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: 'admin', name: 'Admin', icon: Shield, route: '/auth/login', color: '#F59E0B' },
    { id: 'developer', name: 'Developer', icon: Code2, route: '/designer/login?type=developer', color: '#8B5CF6' },
    { id: 'designer', name: 'Designer', icon: Sparkles, route: '/designer/login', color: '#0066FF' },
    { id: 'principal', name: 'Principal Portal', icon: GraduationCap, route: '/College_Portfolio_Handler/login', color: '#10B981' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-700 ease-out will-change-transform cursor-pointer"
        style={{
          backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
          color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-60px) scale(0.8)',
          transitionDelay: '500ms',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <UserCircle className="w-4 h-4" />
        Login
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0, 100, 255, 0.2)',
            }}
          >
            <div className="px-4 py-3 border-b"
              style={{
                borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0, 100, 255, 0.1)',
              }}
            >
              <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Login as
              </p>
              <p className="text-xs text-gray-500" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                Choose your role to continue
              </p>
            </div>
            
            <div className="p-2">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      onSelect(role.route);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-medium text-gray-700 hover:bg-gray-100 hover:scale-105 hover:shadow-md cursor-pointer group"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" style={{ color: role.color }} />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'designer' | 'developer' | 'principal' | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Simple scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check user authentication from all storage locations
  useEffect(() => {
    const checkUserAuthentication = () => {
      try {
        // Check for Principal (localStorage)
        const authCollege = localStorage.getItem('auth_college');
        if (authCollege) {
          const collegeData = JSON.parse(authCollege);
          if (collegeData.email) {
            setUser({ 
              email: collegeData.email, 
              name: collegeData.name || collegeData.email,
              collegeId: collegeData.collegeId 
            });
            setUserRole('principal');
            return;
          }
        }
        
        // Check for Admin (localStorage)
        const loginUser = localStorage.getItem('login_user');
        if (loginUser) {
          const adminUser = JSON.parse(loginUser);
          setUser(adminUser);
          setUserRole('admin');
          return;
        }
        
        // Check for Designer (sessionStorage)
        const designerAuth = sessionStorage.getItem('designer_auth');
        if (designerAuth) {
          const designerData = JSON.parse(designerAuth);
          if (designerData.user && designerData.user.email) {
            setUser({ email: designerData.user.email, id: designerData.user.id });
            setUserRole('designer');
            return;
          }
        }
        
        // Check for Developer (sessionStorage)
        const developerAuth = sessionStorage.getItem('developer_auth');
        if (developerAuth) {
          const developerData = JSON.parse(developerAuth);
          if (developerData.user && developerData.user.email) {
            setUser({ email: developerData.user.email, id: developerData.user.id });
            setUserRole('developer');
            return;
          }
        }
        
        // No user found
        setUser(null);
        setUserRole(null);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
        setUserRole(null);
      }
    };

    checkUserAuthentication();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkUserAuthentication();
    };

    // Custom event for sessionStorage changes
    const handleSessionStorageChange = () => {
      checkUserAuthentication();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sessionStorageChange', handleSessionStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sessionStorageChange', handleSessionStorageChange);
    };
  }, []);

  // Simple mobile menu toggle
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    
    if (isMobileMenuOpen) {
      mobileMenuRef.current.style.display = 'block';
      setTimeout(() => {
        if (mobileMenuRef.current) {
          mobileMenuRef.current.style.opacity = '1';
          mobileMenuRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    } else {
      if (mobileMenuRef.current) {
        mobileMenuRef.current.style.opacity = '0';
        mobileMenuRef.current.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          if (mobileMenuRef.current && !isMobileMenuOpen) {
            mobileMenuRef.current.style.display = 'none';
          }
        }, 200);
      }
    }
  }, [isMobileMenuOpen]);

  const handleLogout = useCallback(() => {
    // Clear based on role
    if (userRole === 'admin') {
      localStorage.removeItem('login_user');
    } else if (userRole === 'designer') {
      sessionStorage.removeItem('designer_auth');
    } else if (userRole === 'developer') {
      sessionStorage.removeItem('developer_auth');
    } else if (userRole === 'principal') {
      localStorage.removeItem('auth_college');
    }
    
    setUser(null);
    setUserRole(null);
    setIsDropdownOpen(false);
    
    // Redirect to home
    router.push('/');
  }, [userRole, router]);

  const handleDashboardRedirect = useCallback(() => {
    if (userRole === 'admin') {
      router.push('/Portfolio_Handler');
    } else if (userRole === 'designer') {
      router.push('/designer');
    } else if (userRole === 'developer') {
      router.push('/developer');
    } else if (userRole === 'principal') {
      router.push('/College_Portfolio_Handler');
    }
  }, [userRole, router]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  }, [router]);

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [router]);

  const handleRoleSelect = useCallback((route: string) => {
    // Check if user is already logged in for Principal Portal
    if (route === '/College_Portfolio_Handler/login') {
      const authCollege = localStorage.getItem('auth_college');
      if (authCollege) {
        // User is logged in, go to dashboard
        router.push('/College_Portfolio_Handler');
      } else {
        // User not logged in, go to login
        router.push('/College_Portfolio_Handler/login');
      }
    } else {
      router.push(route);
    }
  }, [router]);

  const getUserEmail = () => user?.email || '';
  const getUserName = () => user?.name || user?.email || '';
  const getUserInitial = () => {
    const name = getUserName();
    return name?.charAt(0).toUpperCase() || 'U';
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Vision', path: '/vision' },
    { name: 'Templates', path: '/templates' },
    { name: 'Products', path: '/products' },
    { name: 'Partner', path: '/partner' },
    { name: 'About', path: '/about' },
  ];

  // Don't render until mounted
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1F4381]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl bg-gray-700" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : ''
    }`}
    style={{
      backgroundColor: theme === 'dark' 
        ? '#1F4381'
        : '#FFFFFF',
      borderBottom: theme === 'dark' ? '1px solid rgba(232, 202, 94, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                handleLogoClick(e as unknown as React.MouseEvent);
              }
            }}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-60px) scale(0.8)',
              transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: '100ms',
            }}
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer"
              style={{
                boxShadow: theme === 'dark' ? '0 0 15px rgba(232, 202, 94, 0.2)' : '0 0 15px rgba(0, 100, 255, 0.15)',
              }}
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Company name */}
            <span className="hidden sm:inline-block text-xl md:text-2xl font-bold font-serif tracking-tight cursor-pointer"
              style={{
                color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Portfolio Handler
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                theme={theme}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-700 ease-out will-change-transform cursor-pointer"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 100, 255, 0.08)',
                borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 100, 255, 0.2)',
                borderWidth: '1px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-50px) scale(0.8)',
                transitionDelay: '400ms',
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#E8CA5E]" />
              ) : (
                <Moon className="w-4 h-4 text-[#0066FF]" />
              )}
            </button>

            {/* Desktop Login Button - Show when user is NOT logged in */}
            {!user && (
              <div className="hidden lg:block">
                <LoginDropdown theme={theme} onSelect={handleRoleSelect} isVisible={isVisible} />
              </div>
            )}

            {/* User Dropdown - Desktop only when user is logged in */}
            {user && (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-700 ease-out will-change-transform cursor-pointer"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 100, 255, 0.08)',
                    borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 100, 255, 0.2)',
                    borderWidth: '1px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-50px) scale(0.8)',
                    transitionDelay: '500ms',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: userRole === 'admin' ? '#F59E0B' : 
                                     (userRole === 'developer' ? '#8B5CF6' : 
                                     (userRole === 'principal' ? '#10B981' : '#0066FF')),
                    }}
                  >
                    <span className="text-white font-bold text-sm">
                      {getUserInitial()}
                    </span>
                  </div>
                  <span className="hidden xl:block text-sm font-medium max-w-[150px] truncate"
                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                  >
                    {getUserName()}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0, 100, 255, 0.2)',
                      }}
                    >
                      <div className="px-4 py-3 border-b"
                        style={{
                          borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0, 100, 255, 0.1)',
                        }}
                      >
                        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Signed in as
                        </p>
                        <p className="text-sm text-gray-600 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {getUserName()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 capitalize" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                          {userRole}
                        </p>
                      </div>
                      
                      <div className="p-2">
                        {/* Dashboard Link - Based on role */}
                        <button
                          onClick={() => {
                            handleDashboardRedirect();
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-medium text-gray-700 hover:bg-gray-100 hover:scale-105 cursor-pointer"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>
                            {userRole === 'admin' ? 'Admin Dashboard' : 
                             userRole === 'developer' ? 'Developer Dashboard' : 
                             userRole === 'principal' ? 'Principal Dashboard' : 
                             'Designer Dashboard'}
                          </span>
                        </button>
                        
                        <hr className="my-2 border-gray-100" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-medium text-red-600 hover:bg-red-50 hover:scale-105 cursor-pointer"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl transition-all duration-700 ease-out will-change-transform cursor-pointer"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 100, 255, 0.08)',
                borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(0, 100, 255, 0.2)',
                borderWidth: '1px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-50px) scale(0.8)',
                transitionDelay: '600ms',
              }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef} 
          className="lg:hidden mt-3 overflow-hidden transition-all duration-200"
          style={{ 
            display: 'none',
            transform: 'translateY(-10px)',
            opacity: 0
          }}
        >
          <div className="rounded-xl shadow-lg border overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0, 100, 255, 0.2)',
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`block w-full text-left font-medium text-sm py-2.5 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-[#0066FF]/10 text-[#0066FF]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu - Login/User Section */}
            {user ? (
              <div className="border-t border-gray-100 px-4 py-4 space-y-2">
                {/* Dashboard Button */}
                <button
                  onClick={() => {
                    handleDashboardRedirect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-semibold hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: userRole === 'admin' ? '#F59E0B' : 
                                   (userRole === 'developer' ? '#8B5CF6' : 
                                   (userRole === 'principal' ? '#10B981' : '#0066FF')),
                    color: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {userRole === 'admin' ? 'Admin Dashboard' : 
                   userRole === 'developer' ? 'Developer Dashboard' : 
                   userRole === 'principal' ? 'Principal Dashboard' : 
                   'Designer Dashboard'}
                </button>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-semibold hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 px-4 py-4 space-y-2">
                {/* Mobile Login Options */}
                <button
                  onClick={() => {
                    router.push('/auth/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-semibold hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: '#F59E0B',
                    color: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Shield className="w-4 h-4" />
                  Login as Admin
                </button>
                
                <button
                  onClick={() => {
                    router.push('/designer/login?type=developer');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-semibold hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: '#8B5CF6',
                    color: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Code2 className="w-4 h-4" />
                  Login as Developer
                </button>
                
                <button
                  onClick={() => {
                    router.push('/designer/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-semibold hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: '#0066FF',
                    color: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Login as Designer
                </button>

                {/* Mobile Principal Portal */}
                <button
                  onClick={() => {
                    const authCollege = localStorage.getItem('auth_college');
                    if (authCollege) {
                      router.push('/College_Portfolio_Handler');
                    } else {
                      router.push('/College_Portfolio_Handler/login');
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 font-semibold hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <GraduationCap className="w-4 h-4" />
                  Principal Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}