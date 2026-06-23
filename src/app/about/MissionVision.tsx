'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import { Target, Eye } from 'lucide-react';

interface MissionVisionProps {
  theme: 'light' | 'dark';
  getTextColor: () => string;
  getTextSecondary: () => string;
  getAccentColor: () => string;
  missionInView: boolean;
}

export function MissionVision({ 
  theme, 
  getTextColor, 
  getTextSecondary, 
  getAccentColor,
  missionInView 
}: MissionVisionProps) {
  const missionRef = useRef(null);

  const fadeInLeftVariants:Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      }
    }
  };

  const fadeInRightVariants:Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
      }
    }
  };

  return (
    <section ref={missionRef} className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Mission */}
          <motion.div
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={fadeInLeftVariants}
            className="group"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
                  }}
                >
                  <Target className="w-6 h-6"
                    style={{ color: getAccentColor() }}
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Our Mission
                </h2>
              </div>
              <p className="leading-relaxed text-base md:text-lg font-light tracking-wide"
                style={{ 
                  color: getTextSecondary(),
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                To empower educational institutions with cutting-edge portfolio management technology 
                that simplifies administration, enhances student visibility, and creates lasting digital 
                legacies for academic achievements.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={fadeInRightVariants}
            className="group"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
                  }}
                >
                  <Eye className="w-6 h-6"
                    style={{ color: getAccentColor() }}
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Our Vision
                </h2>
              </div>
              <p className="leading-relaxed text-base md:text-lg font-light tracking-wide"
                style={{ 
                  color: getTextSecondary(),
                  fontFamily: "'Calibri Light', sans-serif",
                }}
              >
                To become the global standard for educational portfolio management, connecting 
                institutions, students, and opportunities through innovative technology that 
                showcases potential and celebrates achievement.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}