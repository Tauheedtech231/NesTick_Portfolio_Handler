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

  const getSectionBg = () => {
    return theme === 'dark' ? '#0B0F19' : '#FFFFFF';
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Features Section */}
      <FeaturesSection />

      {/* Packages Section - Independent */}
      <PackagesSection />

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="py-12 md:py-16 px-4 sm:px-6"
        style={{
          backgroundColor: getSectionBg(),
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 font-serif tracking-tight">
              <span className="relative inline-block"
                style={{ 
                  color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Streamlined
              </span>{' '}
              <span className="inline-block"
                style={{ 
                  color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Portfolio Management
              </span>
            </h2>
            
            <p className="text-lg md:text-xl max-w-4xl mx-auto font-light"
              style={{ 
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              The College Portfolio Handler System centralizes digital portfolios for educational institutions, 
              providing a comprehensive platform to create, manage, and showcase student achievements professionally 
              across multiple colleges and departments.
            </p>
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