/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { HomeIcon, Building2, Sparkles, Menu, X, Crown, GraduationCap, Globe, Compass, Bell, Users, Briefcase, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
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
    
    // Fetch pending requests count
    fetchPendingCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
  
  const fetchPendingCount = async () => {
    try {
      const [designersRes, partnersRes] = await Promise.all([
        fetch('/api/designers'),
        fetch('/api/partners')
      ]);
      
      const designersData = await designersRes.json();
      const partnersData = await partnersRes.json();
      
      let count = 0;
      if (designersData.success) {
        count += designersData.data.filter((d: any) => d.status === 'pending').length;
      }
      if (partnersData.success) {
        count += partnersData.data.filter((p: any) => p.status === 'pending').length;
      }
      
      setPendingCount(count);
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };
  
  const handleNavigateCollege = () => (window.location.href = '/College_Portfolio_Handler');
  const handleNavigatePartners = () => (window.location.href = '/Portfolio_Handler/partners-designers');

  const navItems = [
    { 
      name: 'College Portfolio', 
      path: '/College_Portfolio_Handler', 
      icon: Building2, 
      onClick: handleNavigateCollege, 
      isPrimary: true 
    },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-blue-500/20' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Brand/Logo */}
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className={`w-9 h-9 lg:w-10 lg:h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                  isDarkMode ? 'shadow-yellow-500/30' : 'shadow-yellow-500/20'
                }`}>
                  <Crown size={18} className="text-gray-900 font-bold" />
                </div>
              </div>
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
                      className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 hover:scale-105"
                    >
                      <Icon size={18} className="group-hover:rotate-3 transition-transform duration-300" />
                      <span>{item.name}</span>
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-gray-800 border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white'
                          : 'bg-gray-100 border border-gray-200 hover:border-yellow-500 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white'
                      : 'bg-gray-100 border border-gray-200 hover:border-yellow-500 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Bell size={20} />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl overflow-hidden z-50 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Users size={18} className="text-yellow-500" />
                        <span>Pending Requests</span>
                        {pendingCount > 0 && (
                          <span className="ml-auto text-xs bg-yellow-500 text-gray-900 px-2 py-1 rounded-full">
                            {pendingCount} pending
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {pendingCount > 0 ? (
                        <div className="p-3">
                          <button
                            onClick={() => {
                              handleNavigatePartners();
                              setShowNotifications(false);
                            }}
                            className={`w-full p-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                              isDarkMode
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Briefcase size={18} className="text-blue-500" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium">Designers & Partners</p>
                              <p className="text-xs text-gray-500">{pendingCount} pending approval requests</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                            <CheckCircle size={24} className="text-green-500" />
                          </div>
                          <p className="text-sm font-medium">All caught up!</p>
                          <p className="text-xs text-gray-500 mt-1">No pending requests</p>
                        </div>
                      )}
                    </div>
                    {pendingCount > 0 && (
                      <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                          onClick={() => {
                            handleNavigatePartners();
                            setShowNotifications(false);
                          }}
                          className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          View All Requests
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Notification Bell for Mobile */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700 text-gray-300'
                      : 'bg-gray-100 border border-gray-200 text-gray-700'
                  }`}
                >
                  <Bell size={18} />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>
              
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
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg transition-all duration-300"
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
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
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-gray-800 border border-gray-700 text-gray-300'
                          : 'bg-gray-100 border border-gray-200 text-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              
              {/* Mobile Partners Link */}
              <button
                onClick={() => {
                  handleNavigatePartners();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-blue-500'
                    : 'bg-gray-100 border border-gray-200 text-gray-700 hover:border-yellow-500'
                }`}
              >
                <Users size={18} />
                <span>Requests</span>
                {pendingCount > 0 && (
                  <span className="ml-auto bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Notification Dropdown for Mobile */}
        {showNotifications && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:hidden" onClick={() => setShowNotifications(false)}>
            <div className={`rounded-xl shadow-2xl w-full max-w-sm overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`} onClick={(e) => e.stopPropagation()}>
              <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell size={18} className="text-yellow-500" />
                  <span>Notifications</span>
                </h3>
                <button onClick={() => setShowNotifications(false)} className="p-1">
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">
                {pendingCount > 0 ? (
                  <button
                    onClick={() => {
                      handleNavigatePartners();
                      setShowNotifications(false);
                    }}
                    className={`w-full p-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Users size={18} className="text-blue-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Pending Approvals</p>
                      <p className="text-xs text-gray-500">{pendingCount} designer/partner request{pendingCount !== 1 ? 's' : ''}</p>
                    </div>
                  </button>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">No pending requests</p>
                    <p className="text-xs text-gray-500 mt-1">All caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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