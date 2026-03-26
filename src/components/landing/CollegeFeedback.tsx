// components/landing/CollegeFeedback.tsx
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, X, GraduationCap, ChevronRight } from "lucide-react";

interface College {
  id: number;
  name: string;
  role: string;
  college: string;
  image: string;
  feedback: string;
  rating: number;
}

const colleges: College[] = [
  {
    id: 1,
    name: "Dr. Sarah Ahmed",
    role: "Vice Chancellor",
    college: "National University of Sciences & Technology",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
    feedback: "Portfolio Handler has revolutionized how we showcase our students' achievements. The platform is intuitive, powerful, and has significantly improved our digital presence.",
    rating: 5,
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    role: "Dean of Academics",
    college: "Lahore University of Management Sciences",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    feedback: "The centralized management system has streamlined our entire portfolio process. Our faculty and students love the ease of use and professional templates.",
    rating: 5,
  },
  {
    id: 3,
    name: "Dr. Fatima Khan",
    role: "Director IT",
    college: "University of the Punjab",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80",
    feedback: "Exceptional platform with robust security and real-time updates. The support team is responsive and the product keeps getting better.",
    rating: 5,
  },
  {
    id: 4,
    name: "Prof. James Wilson",
    role: "Head of Department",
    college: "Karachi Institute of Technology",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
    feedback: "The AI-powered features have transformed how we manage student portfolios. Highly recommended for any educational institution.",
    rating: 5,
  },
  {
    id: 5,
    name: "Dr. Amna Riaz",
    role: "Academic Director",
    college: "Forman Christian College University",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
    feedback: "A game-changer for our institution. The templates are beautiful, and the multi-portal architecture is brilliant.",
    rating: 5,
  },
  {
    id: 6,
    name: "Prof. David Kim",
    role: "Registrar",
    college: "Beaconhouse National University",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80",
    feedback: "The best investment we've made in digital infrastructure. Our portfolio management has never been this efficient.",
    rating: 5,
  },
  {
    id: 7,
    name: "Dr. Hassan Ali",
    role: "Vice Chancellor",
    college: "Ghulam Ishaq Khan Institute",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80",
    feedback: "Exceptional platform that has transformed our digital presence. Highly recommended for all institutions.",
    rating: 5,
  },
  {
    id: 8,
    name: "Prof. Maria Khan",
    role: "Dean",
    college: "Habib University",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80",
    feedback: "The best decision we made for our portfolio management. Outstanding support and features.",
    rating: 5,
  },
];

export default function CollegeFeedback() {
  const [selected, setSelected] = useState<College | null>(null);
  const [mounted, setMounted] = useState(false);
  const [circleSize, setCircleSize] = useState(500);

  useEffect(() => {
    setMounted(true);
    
    const calculateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      if (vw >= 1024) {
        const minSize = Math.min(vw * 0.45, vh * 0.7, 700);
        setCircleSize(minSize);
      } else {
        const minSize = Math.min(vw * 0.8, vh * 0.4, 450);
        setCircleSize(minSize);
      }
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  if (!mounted) return null;

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  
  const ringSizes = {
    large: isDesktop ? circleSize * 1.3 : circleSize * 1.2,
    medium: circleSize,
    small: isDesktop ? circleSize * 0.75 : circleSize * 0.7,
    orbit: isDesktop ? circleSize * 0.75 : circleSize * 0.7
  };

  return (
    <section className="relative w-full py-16 lg:py-20 bg-[#0B0F19] overflow-hidden">
      {/* Background Pattern - Dark Theme */}
      <div className="absolute inset-0 w-full h-full opacity-20">
        <div className="absolute inset-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #38BDF8 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1D4ED8]/5 via-transparent to-[#38BDF8]/5" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
            <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-xs lg:text-sm font-medium text-gray-300">
              College Testimonials
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] bg-clip-text text-transparent">
              Leading Institutions
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Hear from our partner colleges and universities about their experience with Portfolio Handler.
          </p>
        </div>

        {/* Orbit Container */}
        <div className="relative w-full flex items-center justify-center overflow-visible min-h-[400px] sm:min-h-[450px] lg:min-h-[550px]">
          <div 
            className="relative flex items-center justify-center"
            style={{ width: ringSizes.large, height: ringSizes.large }}
          >
            {/* Rings */}
            <div className="absolute rounded-full border border-[#1D4ED8]/20" style={{ width: ringSizes.large, height: ringSizes.large }} />
            <div className="absolute rounded-full border border-[#38BDF8]/15" style={{ width: ringSizes.medium, height: ringSizes.medium }} />
            <div className="absolute rounded-full border border-[#22C55E]/10" style={{ width: ringSizes.small, height: ringSizes.small }} />
            
            {/* Rotating Orbit */}
            <div className="absolute" style={{ width: ringSizes.orbit, height: ringSizes.orbit }}>
              <motion.div 
                className="relative w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                {colleges.map((college, index) => {
                  const angle = (index / colleges.length) * 360;
                  const radius = ringSizes.orbit / 2;

                  return (
                    <div
                      key={college.id}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
                        transformOrigin: '0 0',
                      }}
                    >
                      <motion.button
                        onClick={() => setSelected(college)}
                        className="relative rounded-full border-2 border-[#38BDF8]/30 shadow-xl hover:scale-110 transition duration-300 pointer-events-auto group"
                        style={{ 
                          width: isDesktop ? 80 : 60,
                          height: isDesktop ? 80 : 60,
                          marginLeft: isDesktop ? -40 : -30,
                          marginTop: isDesktop ? -40 : -30,
                        }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        <Image
                          src={college.image}
                          alt={college.name}
                          fill
                          className="rounded-full object-cover"
                          sizes={isDesktop ? "80px" : "60px"}
                        />
                      </motion.button>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient bar */}
              <div className="h-1 bg-gradient-to-r from-[#1D4ED8] via-[#38BDF8] to-[#1D4ED8]" />
              
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-[#1E293B] rounded-full flex items-center justify-center text-gray-400 hover:bg-[#2D3A4F] hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6">
                {/* Profile Image */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] animate-pulse" />
                  <div className="absolute inset-0.5 rounded-full bg-[#0F172A]" />
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={selected.image}
                      alt={selected.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-1">
                  {selected.name}
                </h3>
                <p className="text-[#38BDF8] font-medium text-sm mb-1">
                  {selected.role}
                </p>
                <p className="text-gray-500 text-xs mb-3">
                  {selected.college}
                </p>

                {/* Rating Stars */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(selected.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Quote */}
                <Quote className="w-8 h-8 text-[#1D4ED8]/30 mx-auto mb-3" />

                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  {selected.feedback}
                </p>

                {/* Decorative dots */}
                <div className="flex justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}