'use client';

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { LogOut, LayoutDashboard, Menu, X, MessageCircle, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Custom theme hook - simple and reliable
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

// Simple nav item - no heavy animations
const NavItem = memo(({ item, isActive, onClick }: { 
  item: { name: string; path: string }; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 transition-colors duration-200 group ${
      isActive 
        ? 'text-[#00E0FF]' 
        : 'text-gray-400 hover:text-white'
    }`}
  >
    <span className="font-medium text-sm uppercase tracking-wide">
      {item.name}
    </span>
    <span className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-[#E8CA5E] to-[#00E0FF] rounded-full transition-all duration-200 ${
      isActive ? 'w-full' : 'w-0 group-hover:w-full'
    }`} />
  </button>
));

NavItem.displayName = 'NavItem';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Simple scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check user authentication
  useEffect(() => {
    const checkUserAuthentication = () => {
      try {
        const loginUser = localStorage.getItem('login_user');
        if (loginUser) {
          setUser(JSON.parse(loginUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    };

    checkUserAuthentication();

    const handleStorageChange = () => {
      checkUserAuthentication();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simple mobile menu toggle - CSS transition only
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
    localStorage.removeItem('login_user');
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/auth/login');
  }, [router]);

  const handleDashboardRedirect = useCallback(() => {
    router.push('/Portfolio_Handler');
  }, [router]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/designer-portal');
    } else {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [router]);

  const getUserEmail = () => user?.email || '';

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Vision', path: '/vision' },
    { name: 'Templates', path: '/templates' },
    { name: 'About', path: '/about' },
  ];

  // Don't render until mounted
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1F4381]/90 backdrop-blur-sm border-b border-[#00E0FF]/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl bg-gray-700" />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] bg-clip-text text-transparent">
                Portfolio Handler
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-md' 
        : 'bg-background/90 backdrop-blur-sm border-b border-border/50'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
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
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md shadow-primary/20">
              <Image
                src="/logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xl md:text-2xl font-bold font-serif tracking-tight bg-gradient-to-r from-[#E8CA5E] via-[#F5D76E] to-[#A57F2A] bg-clip-text text-transparent">
              Portfolio Handler
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-muted/50 border border-border hover:border-[#00E0FF]/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Feedback Button */}
            <Link
              href="/feedback"
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Feedback
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-muted/50 border border-border hover:border-[#00E0FF] transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] rounded-lg flex items-center justify-center">
                    <span className="text-[#1F4381] font-bold text-sm">
                      {getUserEmail().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-muted-foreground max-w-[150px] truncate">
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
                    <div className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">Signed in as</p>
                        <p className="text-sm text-muted-foreground truncate">{getUserEmail()}</p>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={() => {
                            router.push('/designer-portal');
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/10 hover:text-[#00E0FF] rounded-lg transition-colors font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Designer Portal</span>
                        </button>
                        
                        {user.email === 'tauheeddeveloper13@gmail.com' && (
                          <button
                            onClick={handleDashboardRedirect}
                            className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/10 hover:text-[#00E0FF] rounded-lg transition-colors font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/10 hover:text-[#00E0FF] rounded-lg transition-colors font-medium"
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
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-[#4F0281] to-[#DC33E0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-muted/50 border border-border hover:border-[#00E0FF] transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Simple CSS transition */}
        <div 
          ref={mobileMenuRef} 
          className="lg:hidden mt-3 overflow-hidden transition-all duration-200"
          style={{ 
            display: 'none',
            transform: 'translateY(-10px)',
            opacity: 0
          }}
        >
          <div className="bg-card border border-border rounded-xl shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`block w-full text-left font-medium text-sm py-2.5 px-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-primary/20 text-[#00E0FF]' 
                        : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              
              <Link
                href="/feedback"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full mt-2 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                Feedback
              </Link>
            </div>

            {user ? (
              <div className="border-t border-border px-4 py-4 space-y-2">
                <button
                  onClick={() => {
                    router.push('/designer-portal');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-[#00E0FF] to-[#1F4381] text-white rounded-lg transition-all duration-200 hover:scale-105 font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Designer Portal
                </button>
                
                {user.email === 'tauheeddeveloper13@gmail.com' && (
                  <button
                    onClick={() => {
                      handleDashboardRedirect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] rounded-lg transition-all duration-200 hover:scale-105 font-semibold"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-[#4F0281] to-[#DC33E0] text-white rounded-lg transition-all duration-200 hover:scale-105 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-border px-4 py-4">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2.5 text-sm bg-gradient-to-r from-[#4F0281] to-[#DC33E0] text-white rounded-lg transition-all duration-200 hover:scale-105 font-semibold"
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