'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Parker Robert",
    role: "UI Designer",
    text: "when an unknown printer took a galley of type and scrambled to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Emily Johnson",
    role: "Web Developer",
    text: "The learning experience was amazing! The instructors are very knowledgeable and the curriculum is well-structured. I highly recommend this course.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Product Manager",
    text: "This platform transformed my career. The practical approach to teaching really helped me understand complex concepts easily.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Sophia Martinez",
    role: "Graphic Designer",
    text: "Excellent content and great support. The projects are real-world based which helped me build a strong portfolio.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Data Scientist",
    text: "One of the best decisions I made for my education. The community is supportive and the resources are top-notch.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
  }
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Detect theme
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

  // Auto-change testimonial every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  // Get colors based on theme
  const getColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#0B0F19',
        cardBg: '#0F172A',
        text: '#FFFFFF',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        border: 'rgba(30, 41, 59, 0.5)',
        accent: '#E8CA5E',
        accentLight: 'rgba(232, 202, 94, 0.15)',
      };
    } else {
      return {
        bg: '#FFFFFF',
        cardBg: '#F8F9FA',
        text: '#1F2937',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        border: 'rgba(0, 0, 0, 0.06)',
        accent: '#0066FF',
        accentLight: 'rgba(0, 102, 255, 0.08)',
      };
    }
  };

  const colors = getColors();

  return (
    <section 
      className="py-12 md:py-16 lg:py-20 px-4 sm:px-6"
      style={{
        backgroundColor: colors.bg,
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
        
        {/* LEFT - Image */}
        <div className="relative flex-shrink-0">
          {/* Decorative shapes with theme colors */}
          <div 
            className="absolute -top-3 -left-3 w-8 h-8 rounded-full"
            style={{ backgroundColor: colors.accentLight }}
          />
          <div 
            className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full"
            style={{ backgroundColor: colors.accentLight }}
          />
          <div 
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
            style={{ backgroundColor: colors.accentLight }}
          />

          {/* Image Container - Fixed Dimensions */}
          <div 
            className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4"
            style={{
              borderColor: colors.accent,
              boxShadow: `0 0 30px ${colors.accent}20`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={currentTestimonial.imageUrl}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 320px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT - Content */}
        <div className="flex-1 max-w-xl">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: colors.accentLight,
            }}
          >
            <span 
              className="text-xs font-medium"
              style={{ color: colors.accent }}
            >
              💬 Testimonials
            </span>
          </div>

          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-serif"
            style={{ color: colors.text }}
          >
            What Our Students <br /> Say About Us
          </h2>

          {/* Quote Icon */}
          <div 
            className="text-4xl leading-none mb-3"
            style={{ color: colors.accent }}
          >
            “
          </div>

          {/* Text with animation */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{ color: colors.textSecondary }}
            >
              {currentTestimonial.text}
            </motion.p>
          </AnimatePresence>

          {/* Divider */}
          <div 
            className="w-12 h-0.5 rounded-full mb-4"
            style={{ backgroundColor: colors.accent }}
          />

          {/* Author */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h4 
                className="font-semibold text-base"
                style={{ color: colors.text }}
              >
                {currentTestimonial.name}
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.textMuted }}
              >
                {currentTestimonial.role}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: currentIndex === idx ? "24px" : "8px",
                  backgroundColor: currentIndex === idx 
                    ? colors.accent 
                    : (theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}