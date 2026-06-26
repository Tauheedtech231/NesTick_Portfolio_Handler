'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function Hero() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // ── Theme detection ──────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () =>
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  // ── Get accent color based on theme ─────────────────────────────────────────
  const getAccentColor = () => {
    return theme === 'dark' ? '#E8CA5E' : '#2563EB';
  };

  const fadeInLeftVariants: Variants = {
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

  const fromBottomVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.6,
        delay: 0.2,
      }
    }
  };

  const isDark = theme === 'dark';
  const accentColor = getAccentColor();

  return (
    <section ref={heroRef} className="relative overflow-hidden flex items-center justify-center min-h-[50vh]">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={fadeInLeftVariants}
          className="mb-5"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mt-[2rem] rounded-full mb-4 mx-auto w-fit"
            style={{
              backgroundColor: isDark ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 160, 255, 0.08)',
              border: 'none',
            }}
          >
            <Sparkles
              className="w-3.5 h-3.5"
              style={{ color: accentColor }}
            />
            <span
              className="text-xs font-medium tracking-wide"
              style={{
                color: isDark ? '#D1D5DB' : '#4B5563',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              About Us
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 leading-tight max-w-3xl mx-auto font-serif tracking-tight">
            <span className="block" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Building{' '}
              <span
                className="inline-block"
                style={{ color: accentColor }}
              >
                Digital Futures
              </span>
            </span>
            <span className="block" style={{ fontFamily: "'Poppins', sans-serif" }}>Since 2021</span>
          </h1>
        </motion.div>

        <motion.p
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={fromBottomVariants}
          className="text-base md:text-lg max-w-2xl mx-auto font-light tracking-wide"
          style={{
            color: isDark ? '#D1D5DB' : '#E5E7EB',
            fontFamily: "'Calibri Light', sans-serif",
          }}
        >
          Helping institutions manage and showcase student portfolios — simply and efficiently.
        </motion.p>
      </div>
    </section>
  );
}