'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
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

  if (featuredTemplates.length === 0) return null;

  const currentTemplate = featuredTemplates[currentIndex];
  const totalTemplates = featuredTemplates.length;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const isEven = currentIndex % 2 === 0;

  // Get background color - same for both templates
  const bgColor = theme === 'dark' ? '#0F172A' : '#F8F9FA';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12 md:py-16 lg:py-20 min-h-screen" // Full height, more padding
      style={{
        backgroundColor: theme === 'dark' ? '#0B0F19' : '#FFFFFF',
        fontFamily: "'Poppins', sans-serif",
        width: '100%', // Full width
      }}
    >
      <div className="w-full"> {/* No max-width, no padding */}
        <div className="flex items-center gap-3 mb-8 px-4 sm:px-6 lg:px-8"> {/* Added padding only to heading */}
          <div className="w-1 h-8 rounded-full"
            style={{ backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
          />
          <h2 className="text-2xl md:text-3xl font-bold font-serif">
            <span style={{ 
              color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
              fontFamily: "'Poppins', sans-serif",
            }}>
              Featured
            </span>{' '}
            <span style={{ 
              color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
              fontFamily: "'Poppins', sans-serif",
            }}>
              Premium Templates
            </span>
          </h2>
        </div>

        {/* Single Card - No rounded corners, full width */}
        <div
          style={{
            backgroundColor: bgColor, // Same for all templates
          }}
        >
          {/* Tab Headers - 2 Columns */}
          <div className="grid grid-cols-2 border-b"
            style={{
              borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
            }}
          >
            {featuredTemplates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => goToSlide(index)}
                className="relative py-4 px-6 text-center transition-all duration-300 cursor-pointer hover:bg-opacity-5 group"
                style={{
                  backgroundColor: 'transparent', // Always transparent
                  borderRight: index === 0 ? '1px solid' : 'none',
                  borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-medium opacity-50"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    0{index + 1}
                  </span>
                  <span className="text-sm font-medium truncate"
                    style={{
                      color: index === currentIndex
                        ? (theme === 'dark' ? '#E8CA5E' : '#0066FF')
                        : (theme === 'dark' ? '#9CA3AF' : '#6B7280'),
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {template.name}
                  </span>
                </div>
                
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{
                      backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area - No background change */}
          <div className="relative min-h-[400px]"> {/* Increased height for full screen feel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isEven ? 20 : -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col md:flex-row h-full items-center"
              >
                {isEven ? (
                  // Template 1: Image Left, Description Right
                  <>
                    <div className="md:w-1/2 h-72 md:h-[420px] relative overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      <div className="absolute top-3 left-3 z-10">
                       
                      </div>
                      <div className="w-full h-full relative">
                        <Image
                          src={currentTemplate.image}
                          alt={currentTemplate.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 p-10 md:p-14 lg:p-16 flex flex-col justify-center items-start"> {/* More padding */}
                      <h3 className="text-2xl font-bold mb-3" 
                        style={{ 
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {currentTemplate.name}
                      </h3>
                      <p className="text-base mb-4 leading-relaxed line-clamp-3"
                        style={{ 
                          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                          fontFamily: "'Calibri Light', sans-serif",
                        }}
                      >
                        {currentTemplate.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-[11px] px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(232,202,94,0.2)' : 'rgba(0,102,255,0.08)',
                            color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Premium
                        </span>
                        <span className="text-[11px] px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(0,224,255,0.2)' : 'rgba(0,102,255,0.08)',
                            color: theme === 'dark' ? '#00E0FF' : '#0066FF',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Responsive
                        </span>
                        <span className="text-[11px] px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(34,197,94,0.2)' : 'rgba(0,102,255,0.08)',
                            color: theme === 'dark' ? '#22C55E' : '#0066FF',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Customizable
                        </span>
                      </div>
                      <button
                        onClick={() => onBuyNowClick(currentTemplate)}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 w-fit"
                        style={{
                          backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                          color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </>
                ) : (
                  // Template 2: Description Left, Image Right
                  <>
                    <div className="md:w-1/2 p-10 md:p-14 lg:p-16 flex flex-col justify-center items-start"> {/* More padding */}
                      <h3 className="text-2xl font-bold mb-3" 
                        style={{ 
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {currentTemplate.name}
                      </h3>
                      <p className="text-base mb-4 leading-relaxed line-clamp-3" 
                        style={{ 
                          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                          fontFamily: "'Calibri Light', sans-serif",
                        }}
                      >
                        {currentTemplate.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-[11px] px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(232,202,94,0.2)' : 'rgba(0,102,255,0.08)',
                            color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Premium
                        </span>
                        <span className="text-[11px] px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(0,224,255,0.2)' : 'rgba(0,102,255,0.08)',
                            color: theme === 'dark' ? '#00E0FF' : '#0066FF',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Responsive
                        </span>
                        <span className="text-[11px] px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(34,197,94,0.2)' : 'rgba(0,102,255,0.08)',
                            color: theme === 'dark' ? '#22C55E' : '#0066FF',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Customizable
                        </span>
                      </div>
                      <button
                        onClick={() => onBuyNowClick(currentTemplate)}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 w-fit"
                        style={{
                          backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                          color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                    <div className="md:w-1/2 h-72 md:h-[420px] relative overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      <div className="absolute top-3 left-3 z-10">
                     
                      </div>
                      <div className="w-full h-full relative">
                        <Image
                          src={currentTemplate.image}
                          alt={currentTemplate.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}