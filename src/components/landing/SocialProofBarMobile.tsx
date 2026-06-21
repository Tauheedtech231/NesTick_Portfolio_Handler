"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function SocialProofBarMobile() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [counts, setCounts] = useState({
    clients: 0,
    templates: 0,
    activeUsers: 0,
    successRate: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px 0px",
  });

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
      
      const targets = {
        clients: 500,
        templates: 30,
        activeUsers: 20000,
        successRate: 99,
      };
      
      const duration = 2000;
      const steps = 60;
      const increments = {
        clients: targets.clients / steps,
        templates: targets.templates / steps,
        activeUsers: targets.activeUsers / steps,
        successRate: targets.successRate / steps,
      };
      
      const currentCounts = {
        clients: 0,
        templates: 0,
        activeUsers: 0,
        successRate: 0,
      };
      
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        
        currentCounts.clients += increments.clients;
        currentCounts.templates += increments.templates;
        currentCounts.activeUsers += increments.activeUsers;
        currentCounts.successRate += increments.successRate;
        
        if (step >= steps) {
          currentCounts.clients = targets.clients;
          currentCounts.templates = targets.templates;
          currentCounts.activeUsers = targets.activeUsers;
          currentCounts.successRate = targets.successRate;
          clearInterval(timer);
        }
        
        setCounts({
          clients: Math.floor(currentCounts.clients),
          templates: Math.floor(currentCounts.templates),
          activeUsers: Math.floor(currentCounts.activeUsers),
          successRate: Math.floor(currentCounts.successRate),
        });
      }, duration / steps);
    }
  }, [inView, hasAnimated]);

  // Theme-based colors
  const bgColor = theme === "dark" ? "#050a14" : "#F3F4F6";
  const cardBg = theme === "dark" ? "rgba(10, 25, 47, 0.8)" : "rgba(243, 244, 246, 0.9)";
  const textColor = theme === "dark" ? "#FFFFFF" : "#1F2937";
  const textGray = theme === "dark" ? "#9CA3AF" : "#6B7280";
  const neonBlue = "#4cc9f0";
  const yellowColor = "#E8CA5E";

  // Format values
  const formatValue = (value: number, type: string) => {
    if (type === 'activeUsers') {
      return (value / 1000).toFixed(1) + 'K+';
    }
    return value + '+';
  };

  return (
    <div className="block md:hidden">
      <section
        ref={ref}
        className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden"
        style={{
          backgroundColor: bgColor,
        }}
      >
        {/* Background Dots Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Connection Lines SVG */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <svg className="w-full h-full opacity-40" viewBox="0 0 400 800" fill="none">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={neonBlue} stopOpacity="0" />
                <stop offset="50%" stopColor={neonBlue} stopOpacity="1" />
                <stop offset="100%" stopColor={neonBlue} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Path from Central to Clients (Top Left) */}
            <path d="M 200 150 Q 100 150 100 350" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" />
            {/* Path from Central to Active Users (Top Right) */}
            <path d="M 200 150 Q 300 150 300 400" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" />
            {/* Path from Central to Templates (Bottom Left) */}
            <path d="M 200 150 Q 100 250 100 550" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" />
            {/* Path from Central to Success Rate (Bottom Right) */}
            <path d="M 200 150 Q 300 250 300 600" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md mx-auto py-12 flex flex-col items-center">
          {/* Central Heading Section */}
          <div 
            className="mb-12 relative"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(150px)",
              transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: "200ms",
            }}
          >
            {/* Decorative light streak */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent blur-md" />
            
            <div
              className="relative"
              style={{
                clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                background: "linear-gradient(135deg, #1e3a5f 0%, #4cc9f0 100%)",
                padding: "2px",
                boxShadow: "0 0 30px rgba(76, 201, 240, 0.15)",
              }}
            >
              <div
                className="px-10 py-16 flex items-center justify-center text-center"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  backgroundColor: theme === "dark" ? "#050a14" : "#F9FAFB",
                }}
              >
                <h1 
                  className="text-2xl font-black tracking-widest uppercase leading-tight"
                  style={{ color: textColor }}
                >
                  <span style={{ color: yellowColor }}>Trusted</span>
                  <br />
                  Worldwide
                </h1>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div 
            className="grid grid-cols-2 gap-4 w-full px-2"
            style={{
              opacity: inView ? 1 : 0,
              transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: "400ms",
            }}
          >
            {/* STAT: Clients */}
            <div 
              className="flex flex-col items-center"
              style={{
                transform: inView ? "translateX(0)" : "translateX(-80px)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: "500ms",
              }}
            >
              <div
                className="w-36 h-40"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: "linear-gradient(135deg, #1e3a5f 0%, #4cc9f0 100%)",
                  padding: "2px",
                  filter: "drop-shadow(0 0 8px rgba(76, 201, 240, 0.3))",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    backgroundColor: cardBg,
                  }}
                >
                  <span 
                    className="text-xs font-medium mb-1"
                    style={{ color: textGray }}
                  >
                    Clients
                  </span>
                  <span 
                    className="text-2xl font-bold mb-2"
                    style={{ color: textColor }}
                  >
                    {formatValue(counts.clients, 'clients')}
                  </span>
                  {/* Handshake Icon */}
                  <svg 
                    className="text-glow-blue" 
                    fill="none" 
                    height="24" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    width="24" 
                    style={{ color: neonBlue }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 20v2" />
                    <path d="M15 20v2" />
                    <path d="M7 20v2" />
                    <path d="M3 20v2" />
                    <path d="M3 13h18" />
                    <path d="m11 13 4.5-4.5" />
                    <path d="m15 13-4.5-4.5" />
                    <path d="M2 13h1" />
                    <path d="M21 13h1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* STAT: Active Users */}
            <div 
              className="flex flex-col items-center mt-8"
              style={{
                transform: inView ? "translateX(0)" : "translateX(80px)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: "600ms",
              }}
            >
              <div
                className="w-36 h-40"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: "linear-gradient(135deg, #1e3a5f 0%, #4cc9f0 100%)",
                  padding: "2px",
                  filter: "drop-shadow(0 0 8px rgba(76, 201, 240, 0.3))",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    backgroundColor: cardBg,
                  }}
                >
                  <span 
                    className="text-xs font-medium mb-1"
                    style={{ color: textGray }}
                  >
                    Active Users
                  </span>
                  <span 
                    className="text-2xl font-bold mb-2"
                    style={{ color: textColor }}
                  >
                    {formatValue(counts.activeUsers, 'activeUsers')}
                  </span>
                  {/* Users Icon */}
                  <svg 
                    className="text-glow-blue" 
                    fill="none" 
                    height="24" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    width="24" 
                    style={{ color: neonBlue }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
            </div>

            {/* STAT: Templates */}
            <div 
              className="flex flex-col items-center -mt-4"
              style={{
                transform: inView ? "translateX(0)" : "translateX(-80px)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: "700ms",
              }}
            >
              <div
                className="w-36 h-40"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: "linear-gradient(135deg, #1e3a5f 0%, #4cc9f0 100%)",
                  padding: "2px",
                  filter: "drop-shadow(0 0 8px rgba(76, 201, 240, 0.3))",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    backgroundColor: cardBg,
                  }}
                >
                  <span 
                    className="text-xs font-medium mb-1"
                    style={{ color: textGray }}
                  >
                    Templates
                  </span>
                  <span 
                    className="text-2xl font-bold mb-2"
                    style={{ color: textColor }}
                  >
                    {formatValue(counts.templates, 'templates')}
                  </span>
                  {/* Files Icon */}
                  <svg 
                    className="text-glow-blue" 
                    fill="none" 
                    height="24" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    width="24" 
                    style={{ color: neonBlue }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h10.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                    <path d="M15 2v5h5" />
                    <path d="M9 18h10" />
                    <path d="M9 14h10" />
                    <path d="M9 10h1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* STAT: Success Rate */}
            <div 
              className="flex flex-col items-center mt-4"
              style={{
                transform: inView ? "translateX(0)" : "translateX(80px)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: "800ms",
              }}
            >
              <div
                className="w-36 h-40"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: "linear-gradient(135deg, #1e3a5f 0%, #4cc9f0 100%)",
                  padding: "2px",
                  filter: "drop-shadow(0 0 8px rgba(76, 201, 240, 0.3))",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    backgroundColor: cardBg,
                  }}
                >
                  <span 
                    className="text-xs font-medium mb-1"
                    style={{ color: textGray }}
                  >
                    Success Rate
                  </span>
                  <span 
                    className="text-2xl font-bold mb-2"
                    style={{ color: textColor }}
                  >
                    {counts.successRate}%
                  </span>
                  {/* Up Arrow Icon */}
                  <svg 
                    className="text-glow-blue" 
                    fill="none" 
                    height="24" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    width="24" 
                    style={{ color: neonBlue }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m22 7-8.5 8.5-5-5L2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative background dots */}
          <div className="mt-8 opacity-20 select-none pointer-events-none">
            <svg className="text-gray-600" fill="currentColor" height="100" viewBox="0 0 200 100" width="200">
              <circle cx="20" cy="30" r="1.5" />
              <circle cx="50" cy="20" r="1.5" />
              <circle cx="80" cy="40" r="1.5" />
              <circle cx="110" cy="25" r="1.5" />
              <circle cx="140" cy="50" r="1.5" />
              <circle cx="170" cy="35" r="1.5" />
              <circle cx="30" cy="60" r="1.5" />
              <circle cx="60" cy="75" r="1.5" />
              <circle cx="95" cy="65" r="1.5" />
              <circle cx="130" cy="80" r="1.5" />
              <circle cx="160" cy="70" r="1.5" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}