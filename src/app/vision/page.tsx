// app/vision/page.tsx
'use client';

import { motion, useInView, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import dynamic from 'next/dynamic';

import { 

  Building2,
 
  Globe,

  Users,
 
  Library,
 
  School,

  Award,

  Infinity,
  BarChart3,
 
  Monitor,
  Phone,
  Share2,
 
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

// Dynamically import 3D components
const Baghdad3DModel = dynamic(() => import('./Baghdad3DModel'), { ssr: false });
const FutureCity3DModel = dynamic(() => import('./FutureCity3DModel'), { ssr: false });

// Progress Bar Component
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 z-50 origin-left"
      style={{ 
        scaleX,
        background: "linear-gradient(90deg, #C9A84C, #7EB8F7, #00DCFF)"
      }}
    />
  );
}

export default function VisionPage() {
  const heroRef = useRef(null);
 const originRef = useRef<HTMLElement | null>(null)
  const systemRef = useRef(null);
  const fallRef = useRef(null);
  const silenceRef = useRef(null);
  const pakistanRef = useRef(null);
  const digitalRef = useRef(null);
  const futureRef = useRef(null);
  const joinRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const originInView = useInView(originRef, { once: true, amount: 0.2 });
  const systemInView = useInView(systemRef, { once: true, amount: 0.2 });
  const fallInView = useInView(fallRef, { once: true, amount: 0.2 });
  const silenceInView = useInView(silenceRef, { once: true, amount: 0.2 });
  const pakistanInView = useInView(pakistanRef, { once: true, amount: 0.2 });
  const digitalInView = useInView(digitalRef, { once: true, amount: 0.2 });
  const futureInView = useInView(futureRef, { once: true, amount: 0.2 });
  const joinInView = useInView(joinRef, { once: true, amount: 0.2 });

  // Products data
  const products = [
    { id: 1, name: "Smart Classroom OS", icon: Monitor, color: "#E8CA5E", description: "Complete classroom management — attendance, lessons, student tracking — built for Pakistan's schools." },
    { id: 2, name: "Teacher Knowledge Hub", icon: Users, color: "#00E0FF", description: "Shared lesson plans, methodologies, resources. A national brain trust for educators." },
    { id: 3, name: "Analytics Dashboard", icon: BarChart3, color: "#1F4381", description: "Real-time data for principals and officials. Data-driven decisions at provincial scale." },
    { id: 4, name: "Student Learning App", icon: Phone, color: "#E8CA5E", description: "Gamified, personalized study paths. Interactive curriculum on any Android phone." },
    { id: 5, name: "Neezamiya Network", icon: Share2, color: "#00E0FF", description: "Educators, developers, parents, students — all in one ecosystem." },
    { id: 6, name: "Government Partner", icon: Building2, color: "#1F4381", description: "Pilot programs, policy advocacy, provincial rollouts at scale." }
  ];

  // Animation variants - Optimized for smoothness
  const fadeInUpVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const fadeInLeftVariants: Variants = {
    hidden: { x: -30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const fadeInRightVariants: Variants = {
    hidden: { x: 30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const scaleInVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const statVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" }
    })
  };

  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main className="min-h-screen bg-[#0B0F19] pt-16 overflow-hidden">
        
        {/* Section 1: Hero - Baghdad 3D Model - Full visibility */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* 3D Model - Full opacity */}
          <div className="absolute inset-0 z-0">
            <Baghdad3DModel />
          </div>
          
          {/* Subtle gradient overlay - Reduced opacity for better 3D visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-10" />
          
          {/* Content - Above 3D model */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
            >
              <div className="font-['Cairo',sans-serif] text-lg md:text-xl text-[#C9A84C]/80 tracking-[0.12em] mb-4 font-light drop-shadow-lg">
                بيت الحكمة · دار العلم · نظامية
              </div>
              
              <h1 className="font-['Cinzel_Decorative',serif] text-5xl md:text-6xl lg:text-7xl text-[#C9A84C] leading-tight mb-5 font-bold tracking-wide drop-shadow-2xl" style={{ textShadow: '0 0 80px rgba(201,168,76,.6), 0 0 30px rgba(201,168,76,.3)' }}>
                Neezamiya
              </h1>
              
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto my-5" />
              
              <p className="font-['Cinzel',serif] text-[10px] tracking-[0.35em] uppercase text-[#d4b483]/80 mb-3 font-medium drop-shadow-lg">
                The Revival · Pakistan 2024
              </p>
              
              <p className="font-['Lora',serif] italic text-base md:text-lg text-[#f5edd8]/80 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-lg">
                Born in the golden halls of Baghdad.<br />
                Reborn in the classrooms of Pakistan.<br />
                A thousand-year legacy of knowledge — rekindled.
              </p>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                onClick={() => scrollToSection(originRef)}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="font-['Cinzel',serif] text-[0.5rem] tracking-[0.3em] uppercase text-[#C9A84C]/70 font-light drop-shadow">Scroll to begin</span>
                  <div className="w-px h-10 bg-gradient-to-b from-[#C9A84C] to-transparent" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Origin - The City That Lit the World */}
        <section ref={originRef} className="relative py-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/80 to-stone-900/90 z-0" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <motion.div
                initial="hidden"
                animate={originInView ? "visible" : "hidden"}
                variants={fadeInLeftVariants}
              >
                <span className="font-['Cinzel',serif] text-[0.6rem] tracking-[0.35em] uppercase text-[#C9A84C]/70 block mb-3 font-light">750 — 1258 CE</span>
                <h2 className="font-['Cinzel_Decorative',serif] text-3xl md:text-4xl text-[#E8C97A] mb-4 leading-tight font-bold tracking-wide">
                  The City That<br />Lit the World
                </h2>
                <div className="flex items-center gap-4 my-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
                  <span className="text-[#C9A84C]/60">◆</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
                </div>
                <p className="font-['Lora',serif] text-base text-[#d4b483]/80 leading-relaxed mb-4 font-light">
                  When Europe was dark and divided, one city blazed with an intensity that no empire had ever seen. 
                  Baghdad — <em className="text-[#C9A84C] not-italic font-medium">Madinat al-Salam</em> — was a statement: 
                  human knowledge, not military conquest, was the highest achievement.
                </p>
                <div className="border-l-2 border-[#C9A84C]/50 bg-[#C9A84C]/10 p-4 my-4">
                  <p className="font-['Lora',serif] italic text-[#f5edd8]/80 mb-1 text-sm font-light">
                    The ink of a scholar is more sacred than the blood of a martyr.
                  </p>
                  <cite className="font-['Cinzel',serif] text-[0.5rem] tracking-[0.2em] uppercase text-[#C9A84C] font-light">— Abbasid court</cite>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate={originInView ? "visible" : "hidden"}
                variants={fadeInRightVariants}
              >
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { num: "400K", label: "Manuscripts in the House of Wisdom", icon: Library },
                    { num: "30+", label: "Languages of knowledge housed", icon: Globe },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={statVariants}
                        className="bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-lg p-4 text-center hover:border-[#C9A84C]/30 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/10 flex items-center justify-center mx-auto mb-2">
                          <Icon className="w-5 h-5 text-[#C9A84C]" />
                        </div>
                        <div className="font-['Cinzel_Decorative',serif] text-xl text-[#C9A84C] font-bold">{stat.num}</div>
                        <div className="font-['Cinzel',serif] text-[0.5rem] tracking-[0.15em] uppercase text-[#d4b483]/70 font-light">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { num: "500", label: "Years of scholarship", icon: Award },
                    { num: "1065", label: "CE — Neezamiya founded", icon: School },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        custom={i + 2}
                        variants={statVariants}
                        className="bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-lg p-4 text-center hover:border-[#C9A84C]/30 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/10 flex items-center justify-center mx-auto mb-2">
                          <Icon className="w-5 h-5 text-[#C9A84C]" />
                        </div>
                        <div className="font-['Cinzel_Decorative',serif] text-xl text-[#C9A84C] font-bold">{stat.num}</div>
                        <div className="font-['Cinzel',serif] text-[0.5rem] tracking-[0.15em] uppercase text-[#d4b483]/70 font-light">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: The System - Neezamiya Blueprint */}
        <section ref={systemRef} className="relative py-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/85 to-stone-950/90 z-0" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate={systemInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-center mb-8"
            >
              <span className="font-['Cinzel',serif] text-[0.6rem] tracking-[0.35em] uppercase text-[#C9A84C]/70 font-light">The Blueprint · 1065 CE</span>
              <h2 className="font-['Cinzel_Decorative',serif] text-3xl md:text-4xl text-[#E8C97A] mt-3 font-bold tracking-wide">
                The World&apos;s First<br />University Network
              </h2>
              <p className="font-['Lora',serif] text-base text-[#d4b483]/80 max-w-2xl mx-auto mt-3 leading-relaxed font-light">
                Nizam al-Mulk didn&apos;t build a school. He engineered a system — structured curriculum, state stipends, 
                a network spanning Baghdad, Nishapur, Isfahan, Basra. It predated Oxford by 65 years.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5 mt-8">
              {[
                { icon: "📜", title: "Structured Curriculum", desc: "Theology, law, medicine, astronomy, mathematics — taught in sequence." },
                { icon: "🌍", title: "Scholars from Everywhere", desc: "Persia, Arabia, India, Central Asia — all working side by side." },
                { icon: "🏛️", title: "State-Funded Access", desc: "Students received stipends, housing, books — paid by the state." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate={systemInView ? "visible" : "hidden"}
                  variants={statVariants}
                  className="bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-lg p-5 hover:border-[#C9A84C]/30 transition-all duration-300"
                >
                  <span className="text-2xl block mb-3">{item.icon}</span>
                  <div className="font-['Cinzel',serif] text-sm text-[#E8C97A] mb-2 font-medium">{item.title}</div>
                  <p className="text-xs text-[#d4b483]/80 leading-relaxed font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: The Fall - Now properly visible */}
        <section ref={fallRef} className="relative py-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95 z-0" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498084393753-b411b2d26b34?w=1800&q=80')] bg-cover bg-center opacity-20 z-0" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate={fallInView ? "visible" : "hidden"}
              variants={scaleInVariants}
            >
              <span className="font-['Cinzel',serif] text-[0.65rem] tracking-[0.35em] uppercase text-[#a04040]/70 block mb-3 font-light">1258 CE</span>
              <div className="font-['Cinzel_Decorative',serif] text-5xl md:text-6xl lg:text-7xl text-[#a04040]/80 mb-4 font-bold">The Fall.</div>
              <div className="w-14 h-px bg-[#a04040]/40 mx-auto my-5" />
              <p className="font-['Lora',serif] italic text-base md:text-lg text-[#b48c8c]/80 max-w-2xl mx-auto leading-relaxed font-light">
                The Mongol armies under Hulagu Khan reached the gates of Baghdad in February 1258. 
                In seventeen days, they did what no plague, no rival, no revolution had managed in five centuries.
              </p>
              <div className="border-l-2 border-[#a04040]/40 bg-[#a04040]/10 p-4 my-6 max-w-2xl mx-auto text-left">
                <p className="text-[#d4a0a0]/80 italic text-sm mb-1 font-light">
                  &quot;The Tigris ran black with ink. The great libraries — every manuscript, every translation — 
                  were thrown into the river. It is said you could walk across the Tigris on the backs of books.&quot;
                </p>
                <cite className="font-['Cinzel',serif] text-[0.5rem] tracking-[0.2em] uppercase text-[#a06060] font-light">— Persian Chronicles, 1258 CE</cite>
              </div>
              <p className="text-[#a08080]/70 text-sm max-w-2xl mx-auto font-light">
                The House of Wisdom was destroyed. The Neezamiya network — scattered. Eight hundred thousand people killed. 
                The most advanced city on Earth reduced to ash and silence in less than three weeks.
              </p>
              <div className="mt-8">
                <span className="font-['Cinzel',serif] text-[0.6rem] tracking-[0.3em] uppercase text-[#a06060]/60 font-light">The silence lasted 766 years.</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 5: Silence Transition */}
        <section ref={silenceRef} className="relative py-10 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-black z-0" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate={silenceInView ? "visible" : "hidden"}
              variants={scaleInVariants}
            >
              <div className="font-['Cinzel_Decorative',serif] text-4xl md:text-5xl text-[#3a3a3a]/60 font-bold">766</div>
              <p className="font-['Cinzel',serif] text-[0.55rem] tracking-[0.35em] uppercase text-[#3a3a3a]/50 mt-1 mb-5 font-light">Years of Silence</p>
              <p className="font-['Lora',serif] italic text-base md:text-lg text-[#5a5a5a]/80 max-w-2xl mx-auto leading-relaxed font-light">
                The ideas didn&apos;t die. They traveled — to Andalusia, Cairo, Delhi. They seeded the Renaissance, 
                became algebra, became algorithms.
              </p>
              <div className="mt-6">
                <p className="font-['Cinzel',serif] text-[0.65rem] tracking-[0.3em] uppercase text-[#4a4a6a]/60 font-light">And now — in Pakistan — the signal returns.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 6: Pakistan Challenge */}
        <section ref={pakistanRef} className="relative py-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 to-slate-950/95 z-0" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate={pakistanInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-center mb-8"
            >
              <span className="font-['Cinzel',serif] text-[0.6rem] tracking-[0.35em] uppercase text-[#7EB8F7]/70 font-light">Pakistan · 2024</span>
              <h2 className="font-['Cinzel_Decorative',serif] text-3xl md:text-4xl text-[#7EB8F7] mt-3 font-bold tracking-wide">
                60 Million Children.<br />One Opportunity.
              </h2>
              <p className="font-['Lora',serif] text-base text-[#8aacff]/80 max-w-2xl mx-auto mt-3 font-light">
                Pakistan has the 5th largest youth population. This is not a statistic. This is a civilizational emergency.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { value: "26M+", label: "Children out of school", color: "#8B0000" },
                { value: "44%", label: "Schools without electricity", color: "#E8CA5E" },
                { value: "2%", label: "GDP spent on education", color: "#00E0FF" },
                { value: "#5", label: "Youth population worldwide", color: "#1F4381" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate={pakistanInView ? "visible" : "hidden"}
                  variants={statVariants}
                  className="bg-[#4a80ff]/10 border border-[#4a80ff]/15 rounded-lg p-4 text-center"
                >
                  <div className="font-['Space_Grotesk',sans-serif] text-xl font-semibold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="font-['Space_Grotesk',sans-serif] text-[0.5rem] tracking-[0.12em] uppercase text-[#7EB8F7]/50 mt-1 font-light">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <motion.div
                initial="hidden"
                animate={pakistanInView ? "visible" : "hidden"}
                variants={fadeInLeftVariants}
                className="border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-5 rounded-lg"
              >
                <div className="font-['Cinzel_Decorative',serif] text-2xl text-[#C9A84C] mb-1 font-bold">1065</div>
                <div className="font-['Cinzel',serif] text-[0.55rem] text-[#E8C97A] mb-3 font-light">Abbasid Caliphate · Baghdad</div>
                <ul className="space-y-1">
                  <li className="text-xs text-[#d4b483]/80 flex items-center gap-2 font-light"><span className="text-[#C9A84C]">✓</span> State invests in scholars</li>
                  <li className="text-xs text-[#d4b483]/80 flex items-center gap-2 font-light"><span className="text-[#C9A84C]">✓</span> Scholars travel worldwide</li>
                  <li className="text-xs text-[#d4b483]/80 flex items-center gap-2 font-light"><span className="text-[#C9A84C]">✓</span> Standardized curriculum</li>
                  <li className="text-xs text-[#d4b483]/80 flex items-center gap-2 font-light"><span className="text-[#C9A84C]">✓</span> Free access for all</li>
                </ul>
              </motion.div>
              <motion.div
                initial="hidden"
                animate={pakistanInView ? "visible" : "hidden"}
                variants={fadeInRightVariants}
                className="border border-[#7EB8F7]/20 bg-[#7EB8F7]/5 p-5 rounded-lg"
              >
                <div className="font-['Cinzel_Decorative',serif] text-2xl text-[#7EB8F7] mb-1 font-bold">2024</div>
                <div className="font-['Cinzel',serif] text-[0.55rem] text-[#7EB8F7] mb-3 font-light">Neezamiya · Pakistan</div>
                <ul className="space-y-1">
                  <li className="text-xs text-[#8aacff]/80 flex items-center gap-2 font-light"><span className="text-[#7EB8F7]">→</span> Tech platforms for classrooms</li>
                  <li className="text-xs text-[#8aacff]/80 flex items-center gap-2 font-light"><span className="text-[#7EB8F7]">→</span> Nationwide educator network</li>
                  <li className="text-xs text-[#8aacff]/80 flex items-center gap-2 font-light"><span className="text-[#7EB8F7]">→</span> Software standardizes learning</li>
                  <li className="text-xs text-[#8aacff]/80 flex items-center gap-2 font-light"><span className="text-[#7EB8F7]">→</span> Cloud access for every student</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 7: Digital Products */}
        <section ref={digitalRef} className="relative py-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/90 to-slate-950/95 z-0" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate={digitalInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-center mb-8"
            >
              <span className="font-['Cinzel',serif] text-[0.6rem] tracking-[0.35em] uppercase text-[#00DCFF]/70 font-light">Our Platform · Digital Infrastructure</span>
              <h2 className="font-['Cinzel_Decorative',serif] text-3xl md:text-4xl text-[#00DCFF] mt-3 font-bold tracking-wide">What We Build</h2>
              <p className="font-['Lora',serif] text-base text-[#8adcff]/80 max-w-2xl mx-auto mt-3 font-light">
                Not selling software. Building the digital infrastructure of Pakistani education.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {products.map((product, i) => {
                const Icon = product.icon;
                return (
                  <motion.div
                    key={product.id}
                    custom={i}
                    initial="hidden"
                    animate={digitalInView ? "visible" : "hidden"}
                    variants={statVariants}
                    className="bg-[#00DCFF]/5 border border-[#00DCFF]/15 rounded-lg p-4 hover:border-[#00DCFF]/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00DCFF]/20 to-[#00DCFF]/5 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" style={{ color: product.color }} />
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk',sans-serif] font-semibold text-white text-base mb-1 tracking-wide">{product.name}</h3>
                        <p className="text-[#8adcff]/70 text-xs leading-relaxed font-light">{product.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 8: Future City 3D Model */}
        <section ref={futureRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <FutureCity3DModel products={products.map(p => ({ 
            id: p.id, 
            name: p.name, 
            icon: p.icon, 
            color: p.color 
          }))} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]/20 pointer-events-none z-10" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={futureInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F4381]/80 border border-[#E8CA5E]/30 backdrop-blur-sm mb-3">
                <Building2 className="w-3.5 h-3.5 text-[#00E0FF]" />
                <span className="text-[0.6rem] font-medium text-gray-200 tracking-wide font-sans">The Future Neezamiya · 2024 CE</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg font-serif tracking-tight">
                A New <span className="text-[#E8CA5E]">Golden Age</span> of Learning
              </h2>
              <p className="text-gray-300 text-sm max-w-2xl mx-auto drop-shadow-md font-light tracking-wide">
                Explore the future city — where ancient wisdom meets modern technology
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 9: Join the Movement */}
        <section ref={joinRef} className="relative py-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 to-slate-950/95 z-0" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate={joinInView ? "visible" : "hidden"}
              variants={fadeInUpVariants}
              className="text-center"
            >
              <span className="font-['Cinzel',serif] text-[0.6rem] tracking-[0.35em] uppercase text-[#00DCFF]/70 font-light">The Movement</span>
              <h2 className="font-['Cinzel_Decorative',serif] text-3xl md:text-4xl text-white mt-3 mb-3 font-bold tracking-wide">
                Not a Company.<br />A Civilization Project.
              </h2>
              <p className="font-['Lora',serif] text-base text-[#8aacff]/80 max-w-2xl mx-auto mb-6 font-light">
                We don&apos;t sell software first. We build a community first — the software is the gift we give that community.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-6 py-2.5 bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-black rounded-lg font-semibold text-sm hover:scale-105 transition-all duration-300 font-sans tracking-wide">
                  Join the Community
                </button>
                <button className="px-6 py-2.5 border-2 border-[#7EB8F7] text-[#7EB8F7] rounded-lg font-semibold text-sm hover:bg-[#7EB8F7]/10 transition-all duration-300 font-sans tracking-wide">
                  Partner With Us
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-[#00DCFF] to-[#7EB8F7] text-black rounded-lg font-semibold text-sm hover:scale-105 transition-all duration-300 font-sans tracking-wide">
                  Explore Solutions
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </>
  );
}