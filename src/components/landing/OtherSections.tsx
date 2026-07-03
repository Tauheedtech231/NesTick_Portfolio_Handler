'use client';

import { useEffect, useState } from "react";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import HowItWorksMobile from "./HowItWorksMobile";
import PackagesSection from "./PackagesSection";
import PortalArchitecture from "./PortalArchitecture";

interface OtherSectionsProps {
  featuresRef: React.RefObject<HTMLDivElement | null>;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
  scrollToSection: (sectionId: string) => void;
  addToRefs: (
    el: HTMLDivElement | null,
    refArray: React.MutableRefObject<HTMLDivElement[]>
  ) => void;
  featureCardsRef: React.MutableRefObject<HTMLDivElement[]>;
  formElementsRef: React.MutableRefObject<HTMLDivElement[]>;
  isDarkMode: boolean;
}

export default function OtherSections({
  featuresRef,
  aboutRef,
  addToRefs,
  featureCardsRef,
}: OtherSectionsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    checkTheme();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';
  const GOLD = '#E8CA5E';
  const BLUE = '#0066FF';
  const accentColor = isDark ? GOLD : BLUE;
  
  const getSectionBg = () => {
    return isDark ? '#0B0F19' : '#F8FAFF';
  };

  const getTextColor = () => {
    return isDark ? '#FFFFFF' : '#1F2937';
  };

  const getTextMuted = () => {
    return isDark ? '#9CA3AF' : '#4B5563';
  };

  const getAccentColor = () => {
    return isDark ? GOLD : BLUE;
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Features Section */}
      <FeaturesSection />

      {/* Packages Section - Independent */}
      <PackagesSection />

      {/* About Section - UPDATED with better contrast */}
      <section
        id="about"
        ref={aboutRef}
        className="py-12 md:py-16 px-4 sm:px-6"
        style={{
          backgroundColor: getSectionBg(),
        }}
      >
        <div className="container mt-10 mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto w-fit"
              style={{
                backgroundColor: isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)',
                border: 'none',
              }}
            >
              <span className="text-xs font-medium"
                style={{ 
                  color: accentColor,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                ✦ About Our System
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 font-serif tracking-tight">
              <span className="relative inline-block"
                style={{ 
                  color: getTextColor(),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Streamlined
              </span>{' '}
              <span className="inline-block"
                style={{ 
                  color: accentColor,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Portfolio Management
              </span>
            </h2>
            
            <p className="text-base md:text-lg max-w-4xl mx-auto font-light"
              style={{ 
                color: getTextMuted(),
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              The College Portfolio Handler System centralizes digital portfolios for educational institutions, 
              providing a comprehensive platform to create, manage, and showcase student achievements professionally 
              across multiple colleges and departments.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12" style={{ background: accentColor, opacity: 0.3 }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
              <div className="h-px w-12" style={{ background: accentColor, opacity: 0.3 }} />
            </div>
          </div>

          {/* How It Works - Desktop & Mobile */}
          <div className="w-full">
            <div className="hidden md:block">
              <HowItWorks />
            </div>
            
            <div className="block md:hidden">
              <HowItWorksMobile />
            </div>
          </div>

          {/* Portal Architecture - Independent Component */}
          <PortalArchitecture />
        </div>
      </section>
    </div>
  );
}