/* eslint-disable react/no-unescaped-entities */
// components/landing/ContactSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Send, Phone, Mail, MapPin, Link2, User } from 'lucide-react';

export default function ContactSection() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
  });

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

  const isDark = theme === 'dark';

  // ─── Theme Colors ────────────────────────────────────────────────────────────
  // Navbar colors used for form
  const navbarBg = isDark ? '#132248' : '#ffffff';
  const navbarText = isDark ? '#d8e6ff' : '#1a56db';

  const colors = {
    sectionBg: isDark ? '#0B0F19' : '#F5F5F5',
    cardBg: '#FCF1E3',
    leftBg: '#FCF1E3',
    // ─── Form BG = Navbar BG ────────────────────────────────────────────────
    formBg: navbarBg, // ← Navbar ka bg color
    formInputBg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    formText: isDark ? '#FFFFFF' : '#1F2937',
    formLabel: isDark ? '#9ab0d4' : '#4a5a7a',
    accent: isDark ? '#E8CA5E' : '#0066FF',
    accentLight: isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)',
    border: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
    textPrimary: isDark ? '#FFFFFF' : '#1F2937',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    textMuted: isDark ? '#6B7280' : '#9CA3AF',
    decoColor: '#3D3580',
    decoDotsColor: '#3D3580',
    chatBg: '#FFD23F',
    chatDot: '#4A3F7A',
    arrowBg: '#FFA83E',
    arrowColor: '#2C2359',
    bottomDotsColor: '#2B2359',
    globeBg: '#4C6FFF',
    globeColor: '#FFFFFF',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section 
      className="py-6 -mt-8 px-4 sm:px-6 relative overflow-hidden"
      style={{
        background: colors.sectionBg,
        fontFamily: "'Inter', sans-serif",
        transition: 'background-color 0.6s ease',
      }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* ─── Header ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
            style={{
              backgroundColor: colors.accentLight,
              border: 'none',
            }}
          >
            <span className="text-xs font-medium tracking-wide" style={{ 
              color: colors.accent,
              fontFamily: "'Poppins', sans-serif",
            }}>
              Get In Touch
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-serif tracking-tight" style={{ 
            color: colors.textPrimary,
            fontFamily: "'Poppins', sans-serif",
          }}>
            Let's{' '}
            <span className="inline-block" style={{ color: colors.accent }}>
              Connect
            </span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide mt-2" style={{ 
            color: colors.textSecondary,
            fontFamily: "'Calibri Light', sans-serif",
          }}>
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        {/* ─── Main Card ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.08)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr]">

            {/* ─── LEFT COLUMN ────────────────────────────────────────────────── */}
            <div 
              className="relative p-[20px_16px_20px] sm:p-[24px_20px_24px] md:p-[30px_24px_24px] flex flex-col justify-between min-h-[300px] sm:min-h-[340px] overflow-hidden cursor-pointer group"
              style={{ background: colors.leftBg }}
            >
              {/* Float animation overlay */}
              <div className="absolute inset-0 pointer-events-none group-hover:shadow-[inset_0_0_60px_rgba(0,0,0,0.03)] transition-all duration-700" />

              {/* Decorative elements */}
              <div className="absolute -top-[30px] -left-[10px] w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] rounded-full pointer-events-none" style={{ background: colors.decoColor }} />
              <div className="absolute -top-[10px] left-[22px] w-[40px] h-[40px] sm:w-[56px] sm:h-[56px] rounded-full pointer-events-none" style={{ background: colors.decoColor }} />

              {/* ─── TOP CENTER - Founder Number ──────────────────────────────── */}
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-[4]">
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{
                    background: 'rgba(44, 35, 89, 0.08)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(44, 35, 89, 0.06)',
                  }}
                >
                  <User className="w-3 h-3" style={{ color: '#4A3F7A' }} />
                  <span className="text-[8px] sm:text-[9px] font-medium" style={{ color: '#4A3F7A' }}>
                    Founder: 0319-3236529
                  </span>
                </div>
              </div>

              <div className="absolute -left-[16px] top-[44%] w-[24px] h-[24px] sm:w-[34px] sm:h-[34px] rounded-full pointer-events-none" style={{ background: colors.decoColor }} />
              <div className="absolute -right-[14px] top-[42%] w-[20px] h-[50px] sm:w-[30px] sm:h-[70px] rounded-[14px] pointer-events-none" style={{ background: colors.decoColor }} />
              <div className="absolute -bottom-[8px] left-[18px] w-[28px] h-[20px] sm:w-[36px] sm:h-[26px] rounded-t-[50%] pointer-events-none" style={{ background: colors.decoColor }} />

              <div className="absolute bottom-[20px] right-[38px] grid grid-cols-3 gap-[5px] pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full" style={{ background: colors.bottomDotsColor }} />
                ))}
              </div>

              {/* ─── Center Graphic ──────────────────────────────────────────── */}
              <div className="relative flex-1 flex items-center justify-center mt-8 sm:mt-10">

                {/* Chat bubble - Senior Developer Number */}
                <div 
                  className="absolute left-[2px] top-[20px] sm:top-[30px] rounded-[10px_10px_10px_2px] p-[6px_10px] sm:p-[9px_13px] z-[3] cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{ 
                    background: colors.chatBg, 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
                  }}
                >
                  <div className="flex gap-[3px]">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className="w-1 h-1 rounded-full" style={{ background: colors.chatDot }} />
                    ))}
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-medium mt-1 text-center" style={{ color: colors.chatDot }}>
                    Senior Developer: 0323-7594869
                  </div>
                </div>

                {/* Location Badge */}
                <div 
                  className="absolute right-[-2px] top-[10px] sm:top-[16px] rounded-[10px] p-[6px_10px] sm:p-[7px_13px] z-[3] cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{ 
                    background: colors.globeBg, 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)' 
                  }}
                >
                  <div className="flex gap-[3px] mb-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className="w-1 h-1 rounded-full opacity-70" style={{ background: '#fff' }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <span className="text-white text-[8px] sm:text-[10px] font-medium leading-none">Lahore, PK</span>
                  </div>
                </div>

                {/* Laptop mockup - with hover email */}
                <div 
                  className="relative w-[120px] sm:w-[150px] md:w-[172px] z-[2] cursor-pointer transition-all duration-300 hover:scale-[1.04]"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="rounded-[8px] sm:rounded-[10px] p-[6px] sm:p-[9px]" style={{ background: '#2C2359' }}>
                    <div 
                      className="relative h-[80px] sm:h-[100px] md:h-[112px] rounded-[4px] sm:rounded-[6px] flex items-center justify-center overflow-hidden"
                      style={{ background: '#CBBBF9' }}
                    >
                      <div className="relative w-[50px] sm:w-[60px] md:w-[66px] h-[35px] sm:h-[42px] md:h-[48px]">
                        <div 
                          className="absolute top-[6px] sm:top-[8px] md:top-[9px] left-0 w-full h-[calc(100%-6px)] sm:h-[calc(100%-8px)] md:h-[calc(100%-9px)] border-2 rounded-[1px]"
                          style={{ background: '#FCF1E3', borderColor: '#2C2359' }}
                        />
                        <svg width="100%" height="100%" viewBox="0 0 66 20" className="absolute top-0 left-0">
                          <polygon points="0,0 66,0 33,18" fill="#FCF1E3" stroke="#2C2359" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="absolute bottom-[8px] sm:bottom-[10px] md:bottom-[12px] left-[12px] sm:left-[14px] md:left-[16px] w-[24px] sm:w-[28px] md:w-[34px] h-[2px] rounded" style={{ background: '#2C2359', opacity: 0.45 }} />
                      <div className="absolute bottom-[14px] sm:bottom-[16px] md:bottom-[19px] left-[12px] sm:left-[14px] md:left-[16px] w-[16px] sm:w-[18px] md:w-[22px] h-[2px] rounded" style={{ background: '#2C2359', opacity: 0.45 }} />
                      
                      {/* ─── Hover Email Overlay ────────────────────────────── */}
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        }`}
                        style={{
                          background: 'rgba(44, 35, 89, 0.85)',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          <span className="text-white text-[8px] sm:text-[10px] md:text-xs font-medium">
                            neezamiya@gmail.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="w-full h-[12px] sm:h-[14px] md:h-[16px] rounded-b-[4px] sm:rounded-b-[6px] -mt-px"
                    style={{
                      background: '#2C2359',
                      clipPath: 'polygon(8% 0, 92% 0, 100% 100%, 0% 100%)',
                    }}
                  />
                </div>

                {/* Left bottom icon - Globe (Website link) */}
                <a 
                  href="https://nesticktech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -left-[4px] bottom-[2px] w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] md:w-[40px] md:h-[40px] rounded-full flex items-center justify-center z-[3] cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-xl"
                  style={{ 
                    background: colors.globeBg, 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)' 
                  }}
                >
                  <Link2 className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[19px] md:h-[19px]" style={{ color: colors.globeColor }} />
                </a>
              </div>

              {/* ─── Bottom "Get in touch" ────────────────────────────────────── */}
              <div className="relative flex items-center justify-between mt-2 sm:mt-3 z-[3]">
                <div className="text-base sm:text-lg font-semibold cursor-default" style={{ color: '#2C2359' }}>Get in touch</div>
                <div 
                  className="w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] md:w-[38px] md:h-[38px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{ 
                    background: colors.arrowBg, 
                    boxShadow: `0 4px 20px ${colors.arrowBg}30` 
                  }}
                >
                  <ArrowRight className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" style={{ color: colors.arrowColor }} />
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN - FORM (Navbar BG Color) ──────────────────────── */}
            <div className="p-[16px_20px] sm:p-[20px_24px] md:p-[24px_28px]" style={{ background: colors.formBg }}>
              <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 md:space-y-3.5">
                {/* Name */}
                <div>
                  <label className="text-[8px] sm:text-[10px] font-medium tracking-[1px] mb-1 block" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="full name"
                    className="w-full rounded-[6px] px-3 py-2 text-xs sm:text-sm outline-none transition-all focus:ring-1 box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      color: colors.formText,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-[8px] sm:text-[10px] font-medium tracking-[1px] mb-1 block" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="company name"
                    className="w-full rounded-[6px] px-3 py-2 text-xs sm:text-sm outline-none transition-all focus:ring-1 box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      color: colors.formText,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[8px] sm:text-[10px] font-medium tracking-[1px] mb-1 block" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="phone number"
                    className="w-full rounded-[6px] px-3 py-2 text-xs sm:text-sm outline-none transition-all focus:ring-1 box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      color: colors.formText,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[8px] sm:text-[10px] font-medium tracking-[1px] mb-1 block" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your best email address"
                    className="w-full rounded-[6px] px-3 py-2 text-xs sm:text-sm outline-none transition-all focus:ring-1 box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      color: colors.formText,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-[8px] sm:text-[10px] font-medium tracking-[1px] mb-1 block" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="write your message here"
                    rows={3}
                    className="w-full rounded-[6px] px-3 py-2 text-xs sm:text-sm outline-none transition-all focus:ring-1 resize-vertical box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      color: colors.formText,
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-[22px] py-[9px] sm:py-[10px] md:py-[11px] text-[10px] sm:text-xs font-semibold tracking-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
                  style={{
                    background: colors.accent,
                    color: isDark ? '#1F4381' : '#FFFFFF',
                    border: 'none',
                    boxShadow: `0 4px 20px ${colors.accent}30`,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1.5 sm:mr-2" />
                  send message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}