// components/landing/TeamSlider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface TeamMemberProps {
  id: number;
  name: string;
  role: string;
  color: string;
  initials: string;
}

const teamMembers: TeamMemberProps[] = [
  {
    id: 1,
    name: 'Talha Zaheer',
    role: 'CTO',
    color: '#0066FF',
    initials: 'TZ',
  },
  {
    id: 2,
    name: 'Abdullah Amin',
    role: 'Founder',
    color: '#0066FF',
    initials: 'AA',
  },
  {
    id: 3,
    name: 'Nimra Ali',
    role: 'Creative Lead',
    color: '#0066FF',
    initials: 'NA',
  },
  {
    id: 4,
    name: 'Muhammad Tauheed',
    role: 'Senior Developer',
    color: '#0066FF',
    initials: 'MT',
  },
];

export function TeamSlider() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // ── Theme detection ──────────────────────────────────────────────────────────
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // ── Templates Section Colors ────────────────────────────────────────────────
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0B0F19' : '#FFFFFF';
  const accentColor = isDark ? '#E8CA5E' : '#0066FF';
  const textPrimary = isDark ? '#FFFFFF' : '#1F2937';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const accentLight = isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)';

  // ─── BLUE COLOR FOR ALL ──────────────────────────────────────────────────
  const parallelogramColor = '#0066FF';

  return (
    <section className="py-8 md:py-18 overflow-hidden" style={{ 
      background: bgColor,
      transition: 'background-color 0.6s ease'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
            style={{
              backgroundColor: accentLight,
              border: 'none',
            }}
          >
            <Users className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="text-xs font-medium tracking-wide" style={{ 
              color: textSecondary,
              fontFamily: "'Poppins', sans-serif",
            }}>
              Our Team
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 font-serif tracking-tight" style={{ 
            color: textPrimary,
            fontFamily: "'Poppins', sans-serif",
          }}>
            Meet Our{' '}
            <span className="inline-block" style={{ color: accentColor }}>
              Leadership
            </span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide" style={{ 
            color: textSecondary,
            fontFamily: "'Calibri Light', sans-serif",
          }}>
            The passionate team driving innovation at Portfolio Handler
          </p>
        </motion.div>

        {/* ─── TEAM - Simple Blue Parallelogram ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* ─── Simple Parallelogram ─── */}
              <div className="relative w-full aspect-[3/4] max-w-[200px] mx-auto">
                
                {/* Main Parallelogram - Flat, No Shadow */}
                <div 
                  className="relative w-full h-full overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{
                    clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                    background: parallelogramColor,
                  }}
                >
                  {/* Avatar - Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderColor: 'rgba(255,255,255,0.8)',
                      }}
                    >
                      <span 
                        className="text-2xl md:text-3xl font-bold"
                        style={{ 
                          color: parallelogramColor,
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {member.initials}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="text-center mt-4" style={{
                fontSize: '14px',
                fontWeight: 700,
                color: textPrimary,
                fontFamily: "'Poppins', sans-serif",
              }}>
                {member.name}
              </div>
              <div className="text-center" style={{
                fontSize: '12px',
                color: textSecondary,
                fontWeight: 400,
                fontFamily: "'Poppins', sans-serif",
              }}>
                {member.role}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}