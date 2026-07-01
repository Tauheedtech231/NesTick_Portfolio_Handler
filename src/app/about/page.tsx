// app/about/page.tsx
/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion, useInView } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { PartnerSection } from '@/components/landing/PartnerSection';
import JourneySection from './JourneySection';
import { HeroSection } from './HeroSection'; 
import { PurposeSection } from './PurposeSection';
import  TeamSlider  from './TeamMember';
import ContactSection from './ContactSection'; // ← IMPORTED

export default function AboutPage() {
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
  const bgPrimary = isDark ? '#0B0F19' : '#F5F5F5';

  return (
    <>
      <Navbar />
      <main 
        className="min-h-screen pt-16 lg:pt-20 overflow-hidden"
        style={{ 
          backgroundColor: bgPrimary, 
          fontFamily: "'Poppins', sans-serif",
          transition: 'background-color 0.6s ease'
        }}
      >
        {/* ─── HERO SECTION ─── */}
        <HeroSection />

        {/* ─── PURPOSE SECTION (Mission & Vision) ─── */}
        <PurposeSection />

        {/* ─── Journey Section ─── */}
        <JourneySection />

        {/* ─── Partner Section ─── */}
        <PartnerSection onPartnerSubmit={(data) => {
          console.log('New partner application:', data);
        }} />

        {/* ─── TEAM SECTION ─── */}
        <TeamSlider />

        {/* ─── CONTACT SECTION - Independent Component ─── */}
        <ContactSection />
        
      </main>
      <Footer />
    </>
  );
}