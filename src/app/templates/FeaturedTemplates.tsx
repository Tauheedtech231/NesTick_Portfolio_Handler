'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
  featured?: boolean;
}

interface FeaturedTemplatesProps {
  featuredTemplates: Template[];
  theme: 'light' | 'dark';
  onBuyNowClick: (template: Template) => void;
}

export default function FeaturedTemplates({
  featuredTemplates,
  theme,
  onBuyNowClick,
}: FeaturedTemplatesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (featuredTemplates.length === 0) return null;

  const currentTemplate = featuredTemplates[currentIndex];
  const totalTemplates = featuredTemplates.length;

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0B0F19' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#1F2937';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const textMuted = isDark ? '#6B7280' : '#9CA3AF';
  const goldColor = '#E8CA5E';
  const blueColor = '#0066FF';
  const borderColor = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  const accentLight = isDark ? 'rgba(232, 202, 94, 0.12)' : 'rgba(0, 102, 255, 0.08)';

  const isImageLeft = currentIndex % 2 === 0;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  const descriptionVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const renderDescriptionContent = () => (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`desc-${currentIndex}`}
        custom={direction}
        variants={descriptionVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="p-6 md:p-8 lg:p-10 flex flex-col justify-center"
        style={{ backgroundColor: isDark ? '#0B0F19' : '#FFFFFF' }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
          <span
            className="text-[8px] md:text-[9px] font-semibold tracking-[1.5px] uppercase px-3 py-1 rounded-full border"
            style={{
              color: goldColor,
              borderColor: isDark ? 'rgba(232, 202, 94, 0.3)' : 'rgba(232, 202, 94, 0.3)',
              backgroundColor: isDark ? 'rgba(232, 202, 94, 0.1)' : 'rgba(232, 202, 94, 0.06)',
            }}
          >
            Premium
          </span>
          <span
            className="text-[8px] md:text-[9px] font-medium"
            style={{ color: textMuted }}
          >
            {currentIndex === 0 ? 'Modern & Professional' : 'Clean & Scalable'}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3" style={{ color: textPrimary }}>
          {currentTemplate.name}
        </h2>

        <p className="text-xs md:text-sm leading-relaxed mb-4 md:mb-5 max-w-md" style={{ color: textSecondary }}>
          {currentTemplate.description}
        </p>

        <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
          {[
            'Modern & Professional Design',
            'Fully Responsive Layout',
            'Easy to Customize',
            'Premium Support Included',
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span
                className="text-[8px] md:text-[10px] mt-0.5"
                style={{ color: goldColor }}
              >
                ●
              </span>
              <span
                className="text-[11px] md:text-[12.5px]"
                style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 md:p-4 rounded-2xl mb-4 md:mb-5 max-w-sm"
          style={{
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#F8F9FA',
            border: `1px solid ${borderColor}`,
          }}
        >
          <div>
            <div className="text-[8px] md:text-[10px]" style={{ color: textMuted }}>
              Starting from
            </div>
            <div className="text-xl md:text-2xl font-bold" style={{ color: textPrimary }}>
              ${currentTemplate.type === 'paid' ? '49' : '0'}
            </div>
          </div>
          <div
            className="hidden sm:block w-px h-8 md:h-10"
            style={{
              backgroundColor: isDark
                ? 'rgba(71,85,105,0.3)'
                : 'rgba(0,0,0,0.1)',
            }}
          />
          <div className="flex flex-col gap-1">
            {['Lifetime Updates', '6 Months Support'].map((perk, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[9px] md:text-[10.5px]"
                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
              >
                <span
                  className="text-[7px] md:text-[8px]"
                  style={{ color: '#22C55E' }}
                >
                  ✓
                </span>
                {perk}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onBuyNowClick(currentTemplate)}
          className="px-6 md:px-8 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all hover:scale-105 active:scale-95 w-fit cursor-pointer"
          style={{
            backgroundColor: isDark ? goldColor : blueColor,
            color: isDark ? '#1F4381' : '#FFFFFF',
          }}
        >
          Buy Now →
        </button>
      </motion.div>
    </AnimatePresence>
  );

  const renderImageContent = () => (
    <div
      className="relative min-h-[350px] md:min-h-[400px] lg:min-h-[480px] flex"
      style={{
        backgroundColor: isDark ? '#0B0F19' : '#F8F9FA',
        borderRight: isDark
          ? '1px solid rgba(30, 41, 59, 0.5)'
          : '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="w-10 md:w-12 flex flex-col items-center justify-center gap-2 py-4 md:py-6 flex-shrink-0"
        style={{
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f0f0f0',
          borderRight: isDark
            ? '1px solid rgba(232,202,94,0.12)'
            : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          className="text-base md:text-lg"
          style={{ color: goldColor }}
        >
          ★
        </div>
        <div
          className="w-3 md:w-4 h-px"
          style={{
            backgroundColor: isDark
              ? 'rgba(232,202,94,0.2)'
              : 'rgba(0,0,0,0.1)',
          }}
        />
        <div
          className="text-[6px] md:text-[7px] font-bold tracking-[2px] uppercase leading-none"
          style={{
            color: goldColor,
            writingMode: 'vertical-rl',
            letterSpacing: '2px',
          }}
        >
          Premium
        </div>
        <div
          className="w-3 md:w-4 h-px"
          style={{
            backgroundColor: isDark
              ? 'rgba(232,202,94,0.15)'
              : 'rgba(0,0,0,0.08)',
          }}
        />
        <div
          className="text-[5.5px] md:text-[6.5px] text-center leading-[1.6]"
          style={{
            color: isDark ? '#6B7280' : '#9CA3AF',
            writingMode: 'vertical-rl',
            letterSpacing: '0.3px',
          }}
        >
          Handpicked
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-3 md:p-5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`img-${currentIndex}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 350, damping: 35 },
              opacity: { duration: 0.25 },
            }}
            className="w-full h-48 md:h-64 lg:h-[420px] relative overflow-hidden"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <Image
              src={currentTemplate.image}
              alt={currentTemplate.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 md:hidden">
        {featuredTemplates.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex
                ? 'w-6 h-2'
                : 'w-2 h-2'
            }`}
            style={{
              backgroundColor: index === currentIndex
                ? goldColor
                : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
            }}
          />
        ))}
      </div>

      {/* Desktop Navigation - Dots only */}
      <div className="absolute bottom-4 left-16 hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {featuredTemplates.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? 'w-5 h-1.5'
                  : 'w-1.5 h-1.5'
              }`}
              style={{
                backgroundColor: index === currentIndex
                  ? goldColor
                  : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen"
      style={{
        backgroundColor: bgColor,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Top Bar - Tabs with Right Side Content */}
      <div
        className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3 md:py-5 overflow-x-auto"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        <div className="flex gap-4 md:gap-6 overflow-x-auto flex-1">
          {featuredTemplates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => goToSlide(index)}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer ${
                index === currentIndex ? 'border' : ''
              }`}
              style={{
                backgroundColor:
                  index === currentIndex
                    ? isDark
                      ? 'rgba(232, 202, 94, 0.1)'
                      : 'rgba(0, 102, 255, 0.08)'
                    : 'transparent',
                borderColor:
                  index === currentIndex
                    ? isDark
                      ? '#E8CA5E'
                      : '#0066FF'
                    : 'transparent',
                borderWidth: '1px',
              }}
            >
              <div
                className="w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] md:text-sm font-medium"
                style={{
                  backgroundColor:
                    index === currentIndex
                      ? isDark
                        ? 'rgba(232, 202, 94, 0.15)'
                        : 'rgba(0, 102, 255, 0.08)'
                      : isDark
                      ? 'rgba(30, 41, 59, 0.5)'
                      : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${
                    index === currentIndex
                      ? isDark
                        ? 'rgba(232, 202, 94, 0.3)'
                        : 'rgba(0, 102, 255, 0.2)'
                      : isDark
                      ? 'rgba(30, 41, 59, 0.3)'
                      : 'rgba(0,0,0,0.1)'
                  }`,
                  color:
                    index === currentIndex
                      ? goldColor
                      : isDark
                      ? '#9CA3AF'
                      : '#6B7280',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="text-left hidden sm:block">
                <div
                  className="text-[8px] md:text-[9.5px] font-medium"
                  style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
                >
                  Template
                </div>
                <div
                  className="text-[10px] md:text-[12.5px] font-semibold truncate max-w-[80px] sm:max-w-[150px]"
                  style={{
                    color:
                      index === currentIndex
                        ? isDark
                          ? '#FFFFFF'
                          : '#1F2937'
                        : isDark
                        ? '#9CA3AF'
                        : '#6B7280',
                  }}
                >
                  {template.name}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden md:flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-medium"
              style={{
                backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.08)',
                color: '#22C55E',
                border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
              }}
            >
              <span>●</span> Live Preview
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-medium"
              style={{
                backgroundColor: isDark ? 'rgba(232, 202, 94, 0.1)' : 'rgba(232, 202, 94, 0.08)',
                color: goldColor,
                border: `1px solid ${isDark ? 'rgba(232, 202, 94, 0.2)' : 'rgba(232, 202, 94, 0.2)'}`,
              }}
            >
              <span>★</span> {currentIndex === 0 ? '4.9' : '4.8'} Rating
            </div>
          </div>
          <div
            className="text-[8px] md:text-[10px] font-medium px-2.5 md:px-3 py-1 md:py-1.5 rounded-full"
            style={{
              backgroundColor: isDark ? 'rgba(232, 202, 94, 0.1)' : 'rgba(232, 202, 94, 0.08)',
              color: goldColor,
              border: `1px solid ${isDark ? 'rgba(232, 202, 94, 0.2)' : 'rgba(232, 202, 94, 0.2)'}`,
            }}
          >
            {totalTemplates} Templates
          </div>
        </div>
      </div>

      {/* Main Body - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {isImageLeft ? (
          <>
            {renderImageContent()}
            {renderDescriptionContent()}
          </>
        ) : (
          <>
            {renderDescriptionContent()}
            {renderImageContent()}
          </>
        )}
      </div>

      {/* Stats Bar - Full Rounded */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 mb-4 overflow-hidden"
        style={{
          backgroundColor: isDark ? '#0B0F19' : '#f8f9fa',
          border: `1px solid ${borderColor}`,
        }}
      >
        {[
          { 
            label: '4.9', 
            sub: 'Rating',
            icon: '★',
            color: goldColor
          },
          { 
            label: '98%', 
            sub: 'Satisfaction',
            icon: '✓',
            color: '#22C55E'
          },
          { 
            label: 'May 12', 
            sub: 'Updated',
            icon: '→',
            color: '#0066FF'
          },
          { 
            label: '1,200+', 
            sub: 'Customers',
            icon: '●',
            color: '#E8CA5E'
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-2 md:p-3 text-center"
            style={{ 
              borderRight: i < 3 ? `1px solid ${borderColor}` : 'none',
            }}
          >
            <div
              className="text-[12px] md:text-[16px] font-bold"
              style={{ color: stat.color }}
            >
              {stat.icon}
            </div>
            <div
              className="text-[11px] md:text-[13px] font-bold mt-0.5"
              style={{ color: isDark ? '#FFFFFF' : '#1F2937' }}
            >
              {stat.label}
            </div>
            <div
              className="text-[8px] md:text-[9.5px]"
              style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
            >
              {stat.sub}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}