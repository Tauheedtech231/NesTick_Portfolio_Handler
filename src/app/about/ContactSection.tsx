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
  const GOLD = '#E8CA5E';
  const BLUE = '#0066FF';
  
  const colors = {
    sectionBg: isDark ? '#0B0F19' : '#F4F7FC',
    cardBg: isDark ? '#132248' : '#FFFFFF',
    leftBg: isDark ? '#132248' : '#F8F9FE',
    formBg: isDark ? '#132248' : '#FFFFFF',
    formInputBg: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
    formText: isDark ? '#FFFFFF' : '#1A2332',
    formLabel: isDark ? '#9ab0d4' : '#4A5B6E',
    accent: isDark ? GOLD : BLUE,
    accentLight: isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)',
    border: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
    textPrimary: isDark ? '#FFFFFF' : '#1A2332',
    textSecondary: isDark ? '#9CA3AF' : '#6B7A8F',
    inputBorder: isDark ? 'rgba(255,255,255,0.12)' : '#E5E7EB',
    inputShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
    // Left column brand colors
    decoColor: isDark ? GOLD : BLUE,
    chatBg: isDark ? GOLD : BLUE,
    chatDot: isDark ? '#1F4381' : '#FFFFFF',
    arrowBg: isDark ? GOLD : BLUE,
    arrowColor: isDark ? '#1F4381' : '#FFFFFF',
    bottomDotsColor: isDark ? GOLD : BLUE,
    globeBg: isDark ? GOLD : BLUE,
    globeColor: isDark ? '#1F4381' : '#FFFFFF',
    laptopBg: isDark ? GOLD : BLUE,
    laptopScreenBg: isDark ? '#FCF1E3' : '#E8EEF8',
    laptopBorder: isDark ? '#1F4381' : BLUE,
    hoverOverlay: isDark ? 'rgba(232, 202, 94, 0.9)' : 'rgba(0, 102, 255, 0.9)',
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
            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.06)',
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

              {/* Decorative elements - Brand colors */}
              <div className="absolute -top-[30px] -left-[10px] w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] rounded-full pointer-events-none" style={{ background: colors.decoColor, opacity: isDark ? 0.3 : 0.15 }} />
              <div className="absolute -top-[10px] left-[22px] w-[40px] h-[40px] sm:w-[56px] sm:h-[56px] rounded-full pointer-events-none" style={{ background: colors.decoColor, opacity: isDark ? 0.3 : 0.15 }} />

              {/* ─── TOP CENTER - Founder Number ──────────────────────────────── */}
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-[4]">
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{
                    background: isDark ? 'rgba(232, 202, 94, 0.12)' : 'rgba(0, 102, 255, 0.06)',
                    backdropFilter: 'blur(4px)',
                    border: isDark ? '1px solid rgba(232, 202, 94, 0.1)' : '1px solid rgba(0, 102, 255, 0.06)',
                  }}
                >
                  <User className="w-3 h-3" style={{ color: colors.accent }} />
                  <span className="text-[8px] sm:text-[9px] font-medium" style={{ color: isDark ? GOLD : '#4A5B6E' }}>
                    Founder: 0319-3236529
                  </span>
                </div>
              </div>

              <div className="absolute -left-[16px] top-[44%] w-[24px] h-[24px] sm:w-[34px] sm:h-[34px] rounded-full pointer-events-none" style={{ background: colors.decoColor, opacity: isDark ? 0.3 : 0.15 }} />
              <div className="absolute -right-[14px] top-[42%] w-[20px] h-[50px] sm:w-[30px] sm:h-[70px] rounded-[14px] pointer-events-none" style={{ background: colors.decoColor, opacity: isDark ? 0.3 : 0.15 }} />
              <div className="absolute -bottom-[8px] left-[18px] w-[28px] h-[20px] sm:w-[36px] sm:h-[26px] rounded-t-[50%] pointer-events-none" style={{ background: colors.decoColor, opacity: isDark ? 0.3 : 0.15 }} />

              <div className="absolute bottom-[20px] right-[38px] grid grid-cols-3 gap-[5px] pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full" style={{ background: colors.bottomDotsColor, opacity: isDark ? 0.5 : 0.3 }} />
                ))}
              </div>

              {/* ─── Center Graphic ──────────────────────────────────────────── */}
              <div className="relative flex-1 flex items-center justify-center mt-8 sm:mt-10">

                {/* Chat bubble - Senior Developer Number */}
                <div 
                  className="absolute left-[2px] top-[20px] sm:top-[30px] rounded-[10px_10px_10px_2px] p-[6px_10px] sm:p-[9px_13px] z-[3] cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{ 
                    background: colors.chatBg, 
                    boxShadow: `0 4px 8px ${isDark ? 'rgba(232,202,94,0.2)' : 'rgba(0,0,0,0.1)'}` 
                  }}
                >
                  <div className="flex gap-[3px]">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className="w-1 h-1 rounded-full" style={{ background: colors.chatDot }} />
                    ))}
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-medium mt-1 text-center" style={{ color: isDark ? '#1F4381' : '#FFFFFF' }}>
                    Senior Developer: 0323-7594869
                  </div>
                </div>

                {/* Location Badge */}
                <div 
                  className="absolute right-[-2px] top-[10px] sm:top-[16px] rounded-[10px] p-[6px_10px] sm:p-[7px_13px] z-[3] cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{ 
                    background: colors.globeBg, 
                    boxShadow: `0 4px 8px ${isDark ? 'rgba(232,202,94,0.2)' : 'rgba(0,0,0,0.15)'}` 
                  }}
                >
                  <div className="flex gap-[3px] mb-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className="w-1 h-1 rounded-full opacity-70" style={{ background: colors.globeColor }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: colors.globeColor }} />
                    <span className="text-[8px] sm:text-[10px] font-medium leading-none" style={{ color: colors.globeColor }}>Lahore, PK</span>
                  </div>
                </div>

                {/* Laptop mockup - with hover email */}
                <div 
                  className="relative w-[120px] sm:w-[150px] md:w-[172px] z-[2] cursor-pointer transition-all duration-300 hover:scale-[1.04]"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="rounded-[8px] sm:rounded-[10px] p-[6px] sm:p-[9px]" style={{ background: colors.laptopBg }}>
                    <div 
                      className="relative h-[80px] sm:h-[100px] md:h-[112px] rounded-[4px] sm:rounded-[6px] flex items-center justify-center overflow-hidden"
                      style={{ background: colors.laptopScreenBg }}
                    >
                      <div className="relative w-[50px] sm:w-[60px] md:w-[66px] h-[35px] sm:h-[42px] md:h-[48px]">
                        <div 
                          className="absolute top-[6px] sm:top-[8px] md:top-[9px] left-0 w-full h-[calc(100%-6px)] sm:h-[calc(100%-8px)] md:h-[calc(100%-9px)] border-2 rounded-[1px]"
                          style={{ background: isDark ? '#FCF1E3' : '#FFFFFF', borderColor: colors.laptopBorder }}
                        />
                        <svg width="100%" height="100%" viewBox="0 0 66 20" className="absolute top-0 left-0">
                          <polygon points="0,0 66,0 33,18" fill={isDark ? '#FCF1E3' : '#FFFFFF'} stroke={colors.laptopBorder} strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="absolute bottom-[8px] sm:bottom-[10px] md:bottom-[12px] left-[12px] sm:left-[14px] md:left-[16px] w-[24px] sm:w-[28px] md:w-[34px] h-[2px] rounded" style={{ background: colors.laptopBorder, opacity: 0.45 }} />
                      <div className="absolute bottom-[14px] sm:bottom-[16px] md:bottom-[19px] left-[12px] sm:left-[14px] md:left-[16px] w-[16px] sm:w-[18px] md:w-[22px] h-[2px] rounded" style={{ background: colors.laptopBorder, opacity: 0.45 }} />
                      
                      {/* ─── Hover Email Overlay ────────────────────────────── */}
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        }`}
                        style={{
                          background: colors.hoverOverlay,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: isDark ? '#1F4381' : '#FFFFFF' }} />
                          <span className="text-[8px] sm:text-[10px] md:text-xs font-medium" style={{ color: isDark ? '#1F4381' : '#FFFFFF' }}>
                            neezamiya@gmail.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="w-full h-[12px] sm:h-[14px] md:h-[16px] rounded-b-[4px] sm:rounded-b-[6px] -mt-px"
                    style={{
                      background: colors.laptopBg,
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
                    boxShadow: `0 4px 10px ${isDark ? 'rgba(232,202,94,0.2)' : 'rgba(0,0,0,0.15)'}` 
                  }}
                >
                  <Link2 className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[19px] md:h-[19px]" style={{ color: colors.globeColor }} />
                </a>
              </div>

              {/* ─── Bottom "Get in touch" ────────────────────────────────────── */}
              <div className="relative flex items-center justify-between mt-2 sm:mt-3 z-[3]">
                <div className="text-base sm:text-lg font-semibold cursor-default" style={{ color: isDark ? GOLD : '#1A2332' }}>Get in touch</div>
                <div 
                  className="w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] md:w-[38px] md:h-[38px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                  style={{ 
                    background: colors.arrowBg, 
                    boxShadow: `0 4px 20px ${isDark ? 'rgba(232,202,94,0.3)' : 'rgba(0,102,255,0.25)'}` 
                  }}
                >
                  <ArrowRight className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" style={{ color: colors.arrowColor }} />
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN - FORM ──────────────────────────────────────── */}
            <div 
              className="p-[16px_20px] sm:p-[20px_24px] md:p-[24px_28px]" 
              style={{ 
                background: colors.formBg,
                borderLeft: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.04)',
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 md:space-y-3.5">
                {/* Name */}
                <div>
                  <label className="text-[8px] sm:text-[9px] font-medium tracking-[1px] mb-1 block uppercase" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all focus:ring-2 box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1.5px solid ${colors.inputBorder}`,
                      color: colors.formText,
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: colors.inputShadow,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}15`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.inputBorder;
                      e.currentTarget.style.boxShadow = colors.inputShadow || 'none';
                    }}
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-[8px] sm:text-[9px] font-medium tracking-[1px] mb-1 block uppercase" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all focus:ring-2 box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1.5px solid ${colors.inputBorder}`,
                      color: colors.formText,
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: colors.inputShadow,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}15`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.inputBorder;
                      e.currentTarget.style.boxShadow = colors.inputShadow || 'none';
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[8px] sm:text-[9px] font-medium tracking-[1px] mb-1 block uppercase" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all focus:ring-2 box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1.5px solid ${colors.inputBorder}`,
                      color: colors.formText,
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: colors.inputShadow,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}15`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.inputBorder;
                      e.currentTarget.style.boxShadow = colors.inputShadow || 'none';
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[8px] sm:text-[9px] font-medium tracking-[1px] mb-1 block uppercase" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all focus:ring-2 box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1.5px solid ${colors.inputBorder}`,
                      color: colors.formText,
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: colors.inputShadow,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}15`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.inputBorder;
                      e.currentTarget.style.boxShadow = colors.inputShadow || 'none';
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-[8px] sm:text-[9px] font-medium tracking-[1px] mb-1 block uppercase" style={{ 
                    color: colors.formLabel,
                    fontFamily: "'Poppins', sans-serif",
                  }}>Your Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows={3}
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all focus:ring-2 resize-vertical box-border"
                    style={{
                      background: colors.formInputBg,
                      border: `1.5px solid ${colors.inputBorder}`,
                      color: colors.formText,
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: colors.inputShadow,
                      minHeight: '80px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}15`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.inputBorder;
                      e.currentTarget.style.boxShadow = colors.inputShadow || 'none';
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-xl py-3 text-sm md:text-base font-semibold tracking-[0.5px] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: colors.accent,
                    color: isDark ? '#1F4381' : '#FFFFFF',
                    border: 'none',
                    boxShadow: isDark ? `0 4px 20px ${colors.accent}30` : `0 4px 20px ${colors.accent}25`,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = isDark ? `0 6px 30px ${colors.accent}50` : `0 6px 30px ${colors.accent}35`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = isDark ? `0 4px 20px ${colors.accent}30` : `0 4px 20px ${colors.accent}25`;
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}