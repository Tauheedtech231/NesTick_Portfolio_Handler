/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion } from 'framer-motion';
import { Building2, Palette, Code2, LucideIcon, CheckCircle, TrendingUp, Megaphone, Target } from 'lucide-react';

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
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
}

export function PartnerWhyChoose({ 
  activeForm, 
  theme, 
  isInView, 
  categoryContent 
}: PartnerWhyChooseProps) {
  const getTextColor = () => theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const getTextSecondary = () => theme === 'dark' ? '#D1D5DB' : '#4B5563';
  const getAccentColor = () => '#60A5FA';
  const getButtonText = () => '#FFFFFF';
  const getIconBg = () => theme === 'dark' ? 'rgba(96, 165, 250, 0.12)' : 'rgba(96, 165, 250, 0.08)';

  const getIcon = () => {
    if (activeForm === 'designer') return Palette;
    if (activeForm === 'developer') return Code2;
    if (activeForm === 'business_dev') return TrendingUp;
    if (activeForm === 'marketing_agency') return Megaphone;
    if (activeForm === 'sales') return Target;
    return Building2;
  };

  const Icon = getIcon();

  // Ensure benefits data exists
  const benefitsList = categoryContent?.benefits || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8"
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: getAccentColor() }}
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

        {/* Benefits as simple list with check icons */}
        <div className="space-y-2 md:space-y-2.5">
          {benefitsList.length > 0 ? (
            benefitsList.map((benefit, idx) => {
              // Use title as the text to display
              const benefitText = benefit.title || benefit.description || '';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + (idx * 0.08), duration: 0.4 }}
                  className="flex items-start gap-2.5 md:gap-3 group cursor-pointer"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = getIconBg();
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0px)';
                  }}
                >
                  {/* Check Icon */}
                  <div
                    className="flex-shrink-0 mt-0.5"
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
            <p className="text-xs md:text-sm" style={{ color: getTextSecondary() }}>
              No benefits available
            </p>
          )}
        </div>

        <div
          className="p-4 md:p-5 rounded-xl"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(96, 165, 250, 0.04)',
            borderLeft: `3px solid ${getAccentColor()}`,
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '10px',
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