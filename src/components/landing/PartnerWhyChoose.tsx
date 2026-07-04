/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion } from 'framer-motion';
import { Building2, Palette, Code2, LucideIcon, CheckCircle, TrendingUp, Megaphone, Target } from 'lucide-react';

// ==========================================
// BRAND COLORS - CONSISTENT WITH ALL SECTIONS
// ==========================================
const GOLD = "#E8CA5E";
const BLUE = "#0066FF";

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

interface PartnerWhyChooseProps {
  activeForm: 'designer' | 'developer' | 'business_dev' | 'marketing_agency' | 'sales';
  theme: 'light' | 'dark';
  isInView: boolean;
  categoryContent: {
    title: string;
    description: string;
    benefits: BenefitItem[];
    quote: string;
  };
  activeColor?: string; // ✅ Added: Active color from parent
}

export function PartnerWhyChoose({ 
  activeForm, 
  theme, 
  isInView, 
  categoryContent,
  activeColor = BLUE // Default to BLUE if not provided
}: PartnerWhyChooseProps) {
  // ==========================================
  // THEME COLORS WITH DEPTH
  // ==========================================

  // 1️⃣ Card Background - Consistent with form card
  const getCardBg = () => {
    if (theme === 'dark') return 'rgba(15, 23, 42, 0.4)';
    return 'rgba(255, 255, 255, 0.95)';
  };

  const getCardShadow = () => {
    if (theme === 'light') {
      return '0 4px 24px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)';
    }
    return 'none';
  };

  const getCardBorder = () => {
    if (theme === 'light') {
      return '1px solid rgba(0,0,0,0.04)';
    }
    return 'none';
  };

  // 2️⃣ Text Colors - Better contrast
  const getTextColor = () => {
    return theme === 'dark' ? '#F1F5F9' : '#0F172A';
  };

  const getTextSecondary = () => {
    return theme === 'dark' ? '#D1D5DB' : '#334155';
  };

  const getTextMuted = () => {
    return theme === 'dark' ? '#94A3B8' : '#475569';
  };

  // 3️⃣ Accent Color - Uses activeColor from parent ✅
  const getAccentColor = () => activeColor;

  // 4️⃣ Button Text - White
  const getButtonText = () => '#FFFFFF';

  // 5️⃣ Icon Background - Uses active color
  const getIconBg = () => {
    const color = getAccentColor();
    return theme === 'dark' ? `${color}20` : `${color}10`;
  };

  // 6️⃣ Quote Background - Uses active color
  const getQuoteBg = () => {
    const color = getAccentColor();
    return theme === 'dark' ? `${color}15` : `${color}06`;
  };

  // 7️⃣ Border Color - Subtle
  const getBorderColor = () => {
    return theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  };

  const getIcon = () => {
    if (activeForm === 'designer') return Palette;
    if (activeForm === 'developer') return Code2;
    if (activeForm === 'business_dev') return TrendingUp;
    if (activeForm === 'marketing_agency') return Megaphone;
    if (activeForm === 'sales') return Target;
    return Building2;
  };

  const Icon = getIcon();
  const benefitsList = categoryContent?.benefits || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300"
      style={{
        backgroundColor: getCardBg(),
        border: getCardBorder(),
        boxShadow: getCardShadow(),
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ─── HEADER WITH ICON ─── */}
      <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
          style={{ 
            backgroundColor: getAccentColor(),
            boxShadow: `0 4px 16px ${getAccentColor()}30`,
          }}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: getButtonText() }} />
        </div>
        <h3
          className="text-lg md:text-xl lg:text-2xl font-bold font-serif tracking-tight"
          style={{ 
            color: getTextColor(),
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {categoryContent?.title || 'Why Join Us?'}
        </h3>
      </div>

      <div className="space-y-4 md:space-y-5">
        {/* ─── DESCRIPTION ─── */}
        <p
          className="text-xs md:text-sm lg:text-base leading-relaxed"
          style={{ 
            color: getTextSecondary(),
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}
        >
          {categoryContent?.description || ''}
        </p>

        {/* ─── BENEFITS LIST ─── */}
        <div className="space-y-2 md:space-y-2.5">
          {benefitsList.length > 0 ? (
            benefitsList.map((benefit, idx) => {
              const benefitText = benefit.title || benefit.description || '';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + (idx * 0.08), duration: 0.4 }}
                  className="flex items-start gap-2.5 md:gap-3 group cursor-pointer"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = getIconBg();
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0px)';
                  }}
                >
                  {/* Check Icon - Uses active color ✅ */}
                  <div
                    className="flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110"
                    style={{ color: getAccentColor() }}
                  >
                    <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  
                  {/* Benefit Text */}
                  <span
                    className="text-xs md:text-sm lg:text-base font-medium"
                    style={{ 
                      color: getTextSecondary(),
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      lineHeight: 1.5,
                    }}
                  >
                    {benefitText}
                  </span>
                </motion.div>
              );
            })
          ) : (
            <p className="text-xs md:text-sm" style={{ color: getTextMuted() }}>
              No benefits available
            </p>
          )}
        </div>

        {/* ─── QUOTE BOX - Uses active color ✅ ─── */}
        <div
          className="p-4 md:p-5 rounded-xl transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: getQuoteBg(),
            borderLeft: `3px solid ${getAccentColor()}`,
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '10px',
            border: `1px solid ${theme === 'light' ? getBorderColor() : 'transparent'}`,
            borderLeftWidth: '3px',
          }}
        >
          <p
            className="text-xs md:text-sm lg:text-base italic leading-relaxed"
            style={{ 
              color: getTextSecondary(),
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            "{categoryContent?.quote || 'Join us in transforming education.'}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}