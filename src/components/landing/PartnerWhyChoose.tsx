/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion } from 'framer-motion';
import { Building2, Palette, Code2, LucideIcon } from 'lucide-react';

interface BenefitItem {
  icon: LucideIcon;
  text: string;
  color: string;
}

interface PartnerWhyChooseProps {
  activeForm: 'partner' | 'designer' | 'developer';
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
  const getBgColor = () => theme === 'dark' ? '#0B0F19' : '#F5F5F5';
  const getTextColor = () => theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const getTextSecondary = () => theme === 'dark' ? '#D1D5DB' : '#4B5563';
  const getTextMuted = () => theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const getAccentColor = () => theme === 'dark' ? '#E8CA5E' : '#00A0FF';
  const getButtonText = () => theme === 'dark' ? '#1F4381' : '#FFFFFF';

  const getIcon = () => {
    if (activeForm === 'partner') return Building2;
    if (activeForm === 'designer') return Palette;
    return Code2;
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="rounded-xl md:rounded-2xl p-5 md:p-8"
      style={{
        backgroundColor: 'transparent',
        border: 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center"
          style={{ backgroundColor: getAccentColor() }}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: getButtonText() }} />
        </div>
        <h3
          className="text-lg md:text-xl font-bold font-serif tracking-tight"
          style={{ color: getTextColor() }}
        >
          {categoryContent.title}
        </h3>
      </div>

      <div className="space-y-4 md:space-y-6">
        <p
          className="text-sm md:text-base leading-relaxed font-light tracking-wide"
          style={{ color: getTextSecondary() }}
        >
          {categoryContent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {categoryContent.benefits.map((benefit, idx) => {
            const BenefitIcon = benefit.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.1)' : 'rgba(0, 160, 255, 0.04)',
                }}
              >
                <BenefitIcon
                  className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0"
                  style={{ color: benefit.color }}
                />
                <span
                  className="text-[10px] md:text-xs font-medium"
                  style={{ color: getTextSecondary() }}
                >
                  {benefit.text}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="p-4 md:p-5 rounded-r-xl"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.06)' : 'rgba(0, 160, 255, 0.03)',
            borderLeft: `3px solid ${getAccentColor()}`,
          }}
        >
          <p
            className="text-[11px] md:text-sm italic leading-relaxed font-light"
            style={{ color: getTextSecondary() }}
          >
            "{categoryContent.quote}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}