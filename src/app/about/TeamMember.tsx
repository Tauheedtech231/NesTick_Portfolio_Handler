// components/landing/TeamSlider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import Image from 'next/image';

interface TeamMemberProps {
  id: number;
  name: string;
  role: string;
  color: string;
  image: string;
}

const teamMembers: TeamMemberProps[] = [
  {
    id: 1,
    name: 'Talha Zaheer',
    role: 'CTO',
    color: '#6366F1',
    image: 'https://i.pravatar.cc/300?img=11',
  },
  {
    id: 2,
    name: 'Abdullah Amin',
    role: 'Founder',
    color: '#8B5CF6',
    image: 'https://i.pravatar.cc/300?img=12',
  },
  {
    id: 3,
    name: 'Nimra Ali',
    role: 'Creative Lead',
    color: '#EC4899',
    image: 'https://i.pravatar.cc/300?img=25',
  },
  {
    id: 4,
    name: 'Muhammad Tauheed',
    role: 'Senior Developer',
    color: '#06B6D4',
    image: 'https://i.pravatar.cc/300?img=33',
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
  const bgColor = isDark ? '#0B0F19' : '#f5f5f7';
  const accentColor = isDark ? '#E8CA5E' : '#8800ff';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';
  const textSecondary = isDark ? '#9CA3AF' : '#888888';
  const accentLight = isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(136, 0, 255, 0.08)';

  // ─── SAME PARALLELOGRAM COLOR FOR ALL ──────────────────────────────────────
  const parallelogramColor = '#8800ff';

  return (
    <section className="py-8 md:py-16 overflow-hidden" style={{ 
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

        {/* ─── CARDS - 4 in Row ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center pb-4 md:pb-6 relative overflow-hidden rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-300 w-full"
              style={{
                background: cardBg,
                transition: 'background-color 0.6s ease, transform 0.3s ease',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.06)',
                minHeight: '380px',
              }}
            >
              {/* Photo Area */}
              <div className="w-full h-[240px] md:h-[280px] relative overflow-hidden">
                {/* Parallelogram Background - Centered */}
                <div 
                  className="absolute bottom-[-16px] w-[200px] h-[200px] md:w-[220px] md:h-[220px]"
                  style={{
                    background: parallelogramColor,
                    clipPath: 'polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)',
                    opacity: isDark ? 0.7 : 0.9,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
                
                {/* Image - Centered */}
                <div 
                  className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 z-[2] w-[110px] h-[160px] md:w-[140px] md:h-[200px]"
                >
                  <div className="w-full h-full rounded-t-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={140}
                      height={200}
                      className="w-full h-full object-cover object-top"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="text-center px-3 mt-3 md:mt-4" style={{
                fontSize: '13px',
                fontWeight: 700,
                color: textPrimary,
                fontFamily: "'Poppins', sans-serif",
              }}>
                {member.name}
              </div>
              <div className="text-center px-3 pb-1" style={{
                fontSize: '11px',
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