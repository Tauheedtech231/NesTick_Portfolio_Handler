"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SocialProofBarMobile from "./landing/SocialProofBarMobile";

export default function SocialProofBar() {
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
  const bgColor = theme === "dark" ? "#0B0F19" : "#FFFFFF";
  const hexBgColor = theme === "dark" ? "#0b1120" : "#F3F4F6";
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
    <>
     <SocialProofBarMobile />
      {/* Desktop only - hidden on mobile */}
      <div className="hidden md:block">
        <section
          ref={ref}
          className="w-full min-h-[510px] flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {/* Background Connection SVG Layer */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
              <path
                className="connector-line"
                d="M 500 500 C 400 500, 350 450, 250 350"
                fill="none"
                stroke={neonBlue}
                strokeWidth="1"
                opacity="0.4"
                style={{ filter: "drop-shadow(0 0 2px #4cc9f0)" }}
              />
              <path
                className="connector-line"
                d="M 500 500 C 400 500, 350 550, 250 650"
                fill="none"
                stroke={neonBlue}
                strokeWidth="1"
                opacity="0.4"
                style={{ filter: "drop-shadow(0 0 2px #4cc9f0)" }}
              />
              <path
                className="connector-line"
                d="M 500 500 C 600 500, 650 450, 750 350"
                fill="none"
                stroke={neonBlue}
                strokeWidth="1"
                opacity="0.4"
                style={{ filter: "drop-shadow(0 0 2px #4cc9f0)" }}
              />
              <path
                className="connector-line"
                d="M 500 500 C 600 500, 650 550, 750 650"
                fill="none"
                stroke={neonBlue}
                strokeWidth="1"
                opacity="0.4"
                style={{ filter: "drop-shadow(0 0 2px #4cc9f0)" }}
              />
            </svg>
          </div>

          {/* Stats Layout Container */}
          <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center px-4">
            {/* Left Side Column - Animates from Left */}
            <div 
              className="flex flex-col items-center md:items-end gap-16"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-200px)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: "200ms",
              }}
            >
              {/* Clients */}
              <div
                className="w-40 h-44 transition-transform duration-300 hover:scale-105"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: neonBlue,
                  padding: "1px",
                  boxShadow: "0 0 15px rgba(76, 201, 240, 0.5)",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    background: hexBgColor,
                  }}
                >
                  <span
                    className="text-[8px] uppercase tracking-widest mb-1"
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
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: neonBlue }}
                  >
                    handshake
                  </span>
                </div>
              </div>

              {/* Templates */}
              <div
                className="w-40 h-44 transition-transform duration-300 hover:scale-105"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: neonBlue,
                  padding: "1px",
                  boxShadow: "0 0 15px rgba(76, 201, 240, 0.5)",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    background: hexBgColor,
                  }}
                >
                  <span
                    className="text-[8px] uppercase tracking-widest mb-1"
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
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: neonBlue }}
                  >
                    content_copy
                  </span>
                </div>
              </div>
            </div>

            {/* Center Main Hexagon - Animates from Bottom */}
            <div 
              className="flex justify-center"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(250px)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: "400ms",
              }}
            >
              <div
                className="w-64 h-72 md:w-72 md:h-80 transition-transform duration-300 hover:scale-105"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: "linear-gradient(135deg, #4cc9f0, #225a6e)",
                  padding: "2px",
                  boxShadow: "0 0 30px rgba(76, 201, 240, 0.3)",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    background: theme === "dark" ? "#050a14" : "#F9FAFB",
                  }}
                >
                  <h1
                    className="text-3xl md:text-3xl font-black leading-tight tracking-tight"
                    style={{ color: textColor }}
                  >
                    <span style={{ color: yellowColor }}>TRUSTED</span>
                    <br />
                    WORLDWIDE
                  </h1>
                </div>
              </div>
            </div>

            {/* Right Side Column - Animates from Right */}
            <div 
              className="flex flex-col items-center md:items-start gap-16"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(200px)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: "200ms",
              }}
            >
              {/* Active Users */}
              <div
                className="w-40 h-44 transition-transform duration-300 hover:scale-105"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: neonBlue,
                  padding: "1px",
                  boxShadow: "0 0 15px rgba(76, 201, 240, 0.5)",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    background: hexBgColor,
                  }}
                >
                  <span
                    className="text-[8px] uppercase tracking-widest mb-1"
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
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: neonBlue }}
                  >
                    group
                  </span>
                </div>
              </div>

              {/* Success Rate */}
              <div
                className="w-40 h-44 transition-transform duration-300 hover:scale-105"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: neonBlue,
                  padding: "1px",
                  boxShadow: "0 0 15px rgba(76, 201, 240, 0.5)",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4"
                  style={{
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    background: hexBgColor,
                  }}
                >
                  <span
                    className="text-[8px] uppercase tracking-widest mb-1"
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
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: neonBlue }}
                  >
                    trending_up
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Material Icons and Animations */}
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

            .material-symbols-outlined {
              font-family: "Material Symbols Outlined";
              font-weight: normal;
              font-style: normal;
              font-size: 24px;
              line-height: 1;
              letter-spacing: normal;
              text-transform: none;
              display: inline-block;
              white-space: nowrap;
              word-wrap: normal;
              direction: ltr;
              -webkit-font-feature-settings: "liga";
              -webkit-font-smoothing: antialiased;
            }

            @keyframes subtle-pulse {
              0%,
              100% {
                opacity: 0.4;
              }
              50% {
                opacity: 0.7;
              }
            }
            
            .connector-line {
              animation: subtle-pulse 5s infinite ease-in-out;
            }
          `}</style>
        </section>
      </div>
    </>
  );
}