/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { LogOut, LayoutDashboard, Menu, X, Sun, Moon, UserCircle, Shield, Sparkles, GraduationCap, ChevronDown, Code2 } from "lucide-react";
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

// Login Dropdown Component
const LoginDropdown = ({ theme, onSelect }: { theme: 'light' | 'dark'; onSelect: (route: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    { id: 'admin', name: 'Admin', icon: Shield, route: '/auth/login', color: '#F59E0B' },
    { id: 'developer', name: 'Developer', icon: Code2, route: '/designer/login?type=developer', color: '#8B5CF6' },
    { id: 'designer', name: 'Designer', icon: Sparkles, route: '/designer/login', color: '#0066FF' },
    { id: 'principal', name: 'Principal Portal', icon: GraduationCap, route: '/College_Portfolio_Handler/login', color: '#10B981' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: theme === 'dark' ? '#E8CA5E' : '#0066FF', // ← UPDATED: Gold color
          color: theme === 'dark' ? '#1F4381' : '#FFFFFF', // ← UPDATED: Dark text on gold
          fontFamily: "'Poppins', sans-serif",
          padding: '8px 16px',
          borderRadius: '28px',
          fontSize: '13px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        className="flex items-center gap-2"
      >
        <UserCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Login</span>
        <span className="sm:hidden">Login</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl shadow-2xl border overflow-hidden z-[9999]"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(26, 86, 219, 0.2)',
          }}
        >
          <div className="px-4 py-3 border-b"
            style={{
              borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(26, 86, 219, 0.1)',
            }}
          >
            <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Login as
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Choose your role
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
                  className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm rounded-lg font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Icon className="w-4 h-4" style={{ color: role.color }} />
                  <span>{role.name}</span>
                </button>
              );
            })}
          </div>
        </div>
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
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUserAuthentication = () => {
      try {
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
        
        const loginUser = localStorage.getItem('login_user');
        if (loginUser) {
          const adminUser = JSON.parse(loginUser);
          setUser(adminUser);
          setUserRole('admin');
          return;
        }
        
        const designerAuth = sessionStorage.getItem('designer_auth');
        if (designerAuth) {
          const designerData = JSON.parse(designerAuth);
          if (designerData.user && designerData.user.email) {
            setUser({ email: designerData.user.email, id: designerData.user.id });
            setUserRole('designer');
            return;
          }
        }
        
        const developerAuth = sessionStorage.getItem('developer_auth');
        if (developerAuth) {
          const developerData = JSON.parse(developerAuth);
          if (developerData.user && developerData.user.email) {
            setUser({ email: developerData.user.email, id: developerData.user.id });
            setUserRole('developer');
            return;
          }
        }
        
        setUser(null);
        setUserRole(null);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
        setUserRole(null);
      }
    };

    checkUserAuthentication();

    const handleStorageChange = () => {
      checkUserAuthentication();
    };

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
    if (route === '/College_Portfolio_Handler/login') {
      const authCollege = localStorage.getItem('auth_college');
      if (authCollege) {
        router.push('/College_Portfolio_Handler');
      } else {
        router.push('/College_Portfolio_Handler/login');
      }
    } else {
      router.push(route);
    }
  }, [router]);

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

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#132248' }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between" style={{ height: '80px' }}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gray-700" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-2 sm:px-4`}
      style={{
        paddingTop: '10px',
        paddingBottom: '10px',
        background: 'transparent',
      }}
    >
      <div 
        className="w-full max-w-[1300px] h-[70px] sm:h-[80px] rounded-[16px] sm:rounded-[20px] flex items-center relative overflow-visible"
        style={{
          background: theme === 'dark' ? '#132248' : '#ffffff',
          boxShadow: isScrolled ? '0 6px 40px rgba(0,0,0,0.5)' : '0 6px 40px rgba(0,0,0,0.5)',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* ① LOGO BLOCK - No Background Color */}
        <div 
          className="h-full rounded-l-[16px] sm:rounded-l-[20px] flex items-center gap-2 sm:gap-3 flex-shrink-0"
          style={{
            background: 'transparent',
            padding: '0 10px 0 10px',
          }}
        >
          {/* Logo Image - No Background */}
          <div 
            className="w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={handleLogoClick}
          >
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={46}
              height={46}
              className="rounded-lg sm:w-[46px] sm:h-[46px] object-cover"
            />
          </div>
          <div className="flex flex-col leading-[1.2] cursor-pointer" onClick={handleLogoClick}>
            <span className="text-[11px] sm:text-[15px] font-semibold" style={{ color: theme === 'dark' ? '#d8e6ff' : '#1a56db' }}>Portfolio</span>
            <span className="text-[12px] sm:text-[16px] font-bold" style={{ color: '#E8CA5E' }}> {/* ← UPDATED: Gold color */ }
              Handler
            </span>
          </div>
        </div>

        {/* ② S-CURVE DIVIDER - Now Hidden */}
        <div className="hidden"></div>

        {/* ③ NAV LINKS */}
        <div className="hidden md:flex flex-1 h-full items-center gap-0 pl-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="relative h-full flex items-center whitespace-nowrap text-[11px] lg:text-[13px] font-medium tracking-[0.6px] px-2 lg:px-5 cursor-pointer"
                style={{
                  color: isActive ? '#E8CA5E' : (theme === 'dark' ? '#9ab0d4' : '#4a5a7a'), // ← UPDATED: Gold for active
                  fontWeight: isActive ? '600' : '500',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-md"
                    style={{ background: '#E8CA5E' }} /> 
                )}
              </button>
            );
          })}
          <style>{`
            .nav-links-container button + button::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 1px;
              height: 20px;
              background: ${theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
            }
          `}</style>
        </div>

        {/* ④ RIGHT CONTROLS */}
        <div className="flex items-center gap-1 sm:gap-3 pr-2 sm:pr-4 flex-shrink-0 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] rounded-full border-2 flex items-center justify-center cursor-pointer"
            style={{
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(26, 86, 219, 0.3)',
              background: 'transparent',
              color: theme === 'dark' ? '#E8CA5E' : '#0066FF', // ← UPDATED: Gold sun icon
            }}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Login / User Pill */}
          {!user ? (
            <LoginDropdown theme={theme} onSelect={handleRoleSelect} />
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 cursor-pointer"
                style={{
                  background: theme === 'dark' ? '#E8CA5E' : '#0066FF', // ← UPDATED: Gold background
                  borderRadius: '28px',
                  padding: '4px 10px 4px 4px',
                }}
              >
                <div 
                  className="w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] rounded-full flex items-center justify-center text-[10px] sm:text-sm font-bold flex-shrink-0"
                  style={{
                    background: theme === 'dark' ? '#132248' : '#ffffff',
                    border: '2px solid rgba(255,255,255,0.4)',
                    color: theme === 'dark' ? '#E8CA5E' : '#0066FF', // ← UPDATED: Gold text
                  }}
                >
                  {getUserInitial()}
                </div>
                <span 
                  className="text-[10px] sm:text-[12.5px] font-semibold max-w-[80px] sm:max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }} // ← UPDATED: Dark text on gold
                >
                  {getUserName()}
                </span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ color: theme === 'dark' ? '#1F4381' : '#FFFFFF' }} /> {/* ← UPDATED: Dark text on gold */}
              </div>

              {/* User Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl shadow-2xl border overflow-hidden z-[9999]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(26, 86, 219, 0.2)',
                  }}
                >
                  <div className="px-4 py-3 border-b"
                    style={{
                      borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(26, 86, 219, 0.1)',
                    }}
                  >
                    <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Signed in as
                    </p>
                    <p className="text-sm text-gray-600 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {getUserName()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {userRole}
                    </p>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleDashboardRedirect();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm rounded-lg font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                      className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm rounded-lg font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] rounded-full border-2 flex items-center justify-center cursor-pointer"
            style={{
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(26, 86, 219, 0.3)',
              background: 'transparent',
              color: theme === 'dark' ? '#E8CA5E' : '#0066FF', // ← UPDATED: Gold icon
            }}
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* ⑤ MOBILE MENU */}
        <div 
          ref={mobileMenuRef} 
          className="md:hidden absolute top-[75px] sm:top-[90px] left-2 right-2 sm:left-4 sm:right-4 overflow-hidden"
          style={{ 
            display: 'none',
            opacity: 0,
            transform: 'translateY(-10px)',
            transition: 'opacity 150ms ease, transform 150ms ease',
          }}
        >
          <div className="rounded-xl shadow-2xl border overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(26, 86, 219, 0.2)',
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`block w-full text-left font-medium text-sm py-2.5 px-3 rounded-lg cursor-pointer ${
                      isActive 
                        ? 'text-[#E8CA5E] bg-[#E8CA5E]/10' // ← UPDATED: Gold text + bg
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
                <button
                  onClick={() => {
                    handleDashboardRedirect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-semibold cursor-pointer"
                  style={{
                    background: '#E8CA5E', // ← UPDATED: Gold background
                    color: '#1F4381', // ← UPDATED: Dark text
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-semibold cursor-pointer"
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
                <button
                  onClick={() => {
                    router.push('/auth/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-semibold cursor-pointer"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-semibold cursor-pointer"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-semibold cursor-pointer"
                  style={{
                    backgroundColor: '#0066FF',
                    color: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Login as Designer
                </button>

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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-semibold cursor-pointer"
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