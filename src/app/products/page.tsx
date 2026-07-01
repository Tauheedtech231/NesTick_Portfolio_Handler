/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// Particle Network Component - Only network particles, 80 particles on entire page
function ParticleNetwork({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Theme-based colors
    const dotColor = theme === 'dark' ? 'rgba(232, 202, 94, 0.6)' : 'rgba(0, 102, 255, 0.5)';
    const lineRGB = theme === 'dark' ? '232, 202, 94' : '0, 102, 255';

    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const createParticle = () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1.5 + Math.random() * 1.5,
    });

    const init = () => {
      resize();
      particlesRef.current = Array.from({ length: 80 }, createParticle);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const particles = particlesRef.current;

      // Draw lines first
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${lineRGB}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}

interface ProductSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'outline';
  accentColor: 'primary' | 'tertiary' | 'secondary' | 'error' | 'success';
  imagePosition: 'left' | 'right';
}

// Colors
const GOLD = "#E8CA5E";
const BLUE = "#0066FF";

// 9 Real Products with JPG Images
const PRODUCTS: ProductSection[] = [
  {
    id: "portfolio-site",
    title: "Portfolio Site Management",
    subtitle: "Web Presence",
    description: "A comprehensive platform for schools and colleges to manage their digital presence. Easily update content, maintain branding consistency, and showcase institutional achievements with a professional portfolio website. Every school gets its own customized portal with no-code editing and real-time analytics.",
    image: "/Portfolio site management.jpg",
    features: [
      "Custom Portfolio Website",
      "No-Code Content Updates",
      "Digital Presence & Branding",
      "Event & News Management",
      "Media Gallery & Analytics"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'left'
  },
  {
    id: "admission-automation",
    title: "Admission Automation System",
    subtitle: "Enrollment Engine",
    description: "Streamline the entire admission process from application to enrollment. Parents can apply from home, upload documents, and track progress digitally. Institutes can manage student data seamlessly with automated record generation and cloud storage.",
    image: "/admission automation system.jpg",
    features: [
      "Online Application Portal",
      "Document Upload & Verification",
      "Payment Gateway Integration",
      "Auto Student Record Generation",
      "Admin Tracking Dashboard"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'right'
  },
  {
    id: "parent-teacher",
    title: "Parent Teacher Management System",
    subtitle: "Communication Hub",
    description: "Bridge the gap between parents and teachers with seamless communication tools. Track attendance, monitor student progress, and foster collaborative engagement. Features include WhatsApp integration, real-time alerts, and a dedicated mobile app for parents.",
    image: "/parent teacher management illustration.jpg",
    features: [
      "Real-time Communication",
      "Attendance & Progress Alerts",
      "Digital Report Cards",
      "Online PTM Scheduling",
      "WhatsApp & SMS Integration"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'left'
  },
  {
    id: "lms",
    title: "Learning Management System",
    subtitle: "Digital Classroom",
    description: "Transform traditional classrooms into digital learning environments. Deliver online classes, manage courses, and conduct assignments, quizzes, and grading all in one unified platform. Supports live classes, recorded lectures, and hybrid learning models.",
    image: "/learning management system.jpg",
    features: [
      "Online Live Classes",
      "Course & Subject Management",
      "Assignments & Auto-Grading",
      "Student Performance Analytics",
      "Parent Progress Portal"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'right'
  },
  {
    id: "exam-generator",
    title: "AI Exam Generator",
    subtitle: "Intelligent Assessment",
    description: "Revolutionize exam creation with AI-powered paper generation. Automatically generate syllabus-aligned exams with varying difficulty levels. Includes AI question generation, diagram support, question bank management, and instant PDF export.",
    image: "/AI Exam Generator.jpg",
    features: [
      "AI Question Generation",
      "Syllabus-Aligned Papers",
      "Question Bank Management",
      "PDF Export & Print",
      "Analytics Dashboard"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'left'
  },
  {
    id: "lrm",
    title: "Learning Resource Management",
    subtitle: "Knowledge Hub",
    description: "Build a comprehensive digital library for your institution. Manage, organize, and share learning resources, study materials, and educational content. Features AI-powered categorization, version control, and seamless LMS integration.",
    image: "/learning resource management.jpg",
    features: [
      "Digital Library Management",
      "AI-Powered Content Tagging",
      "Version Control System",
      "LMS Integration",
      "Multi-Format Support"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'right'
  },
  {
    id: "erp",
    title: "ERP System",
    subtitle: "Institution Management",
    description: "End-to-end resource management for schools and colleges. Covers finance, HR, academics, library, and inventory operations. Custom role-based access for departments and real-time dashboards for transparency and efficiency.",
    image: "/ERP System.jpg",
    features: [
      "Finance & Accounting",
      "HR & Staff Management",
      "Academic Operations",
      "Library & Inventory",
      "Real-Time Dashboards"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'left'
  },
  {
    id: "neezamiya-meet",
    title: "Neezamiya Meet",
    subtitle: "Virtual Classroom",
    description: "A Google Meet-like platform specially crafted for educational systems. Conduct secure video classes, record sessions, share screens, and engage students with interactive whiteboards and breakout rooms designed for learning.",
    image: "/neezamiya meet.jpg",
    features: [
      "Secure Video Conferencing",
      "Screen & Whiteboard Sharing",
      "Session Recording",
      "Breakout Rooms",
      "Student Engagement Tools"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'right'
  },
  {
    id: "neezamiya-muthamar",
    title: "Neezamiya Muthamar",
    subtitle: "Virtual Seminar System",
    description: "A powerful virtual seminar platform designed for educational institutions. Host webinars, conferences, and guest lectures with ease. Features include live streaming, audience Q&A, polling, and detailed attendance tracking for large-scale events.",
    image: "/Neezamiya Muthamar.jpg",
    features: [
      "Live Webinar Streaming",
      "Interactive Q&A Sessions",
      "Real-time Polling",
      "Attendance Tracking",
      "Recording & Playback"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'left'
  }
];

export default function ProductShowcase() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [isNeezamiyaVisible, setIsNeezamiyaVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const neezamiyaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Intersection Observer for scroll animation - Har scroll par
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-section-id');
        if (!id) return;
        
        const rect = entry.boundingClientRect;
        const windowHeight = window.innerHeight;
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visiblePercentage = Math.max(0, visibleHeight / rect.height);
        const visibility = Math.min(1, Math.max(0, visiblePercentage));
        
        if (visibility > 0.05) {
          setVisibleSections(prev => new Set(prev).add(id));
        } else {
          setVisibleSections(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((el: HTMLDivElement) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Observer for NEEZAMIYA
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsNeezamiyaVisible(true);
        } else {
          setIsNeezamiyaVisible(false);
        }
      });
    }, observerOptions);

    if (neezamiyaRef.current) {
      observer.observe(neezamiyaRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getAccentLight = (color: string) => {
    return 'rgba(0, 102, 255, 0.12)';
  };

  const getSectionBg = () => {
    return theme === 'dark' ? '#0B0F19' : '#FFFFFF';
  };

  const getTextColor = () => {
    return theme === 'dark' ? '#FFFFFF' : '#1F2937';
  };

  const getTextMuted = () => {
    return theme === 'dark' ? '#9CA3AF' : '#6B7280';
  };

  const getBorderColor = () => {
    return theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  };

  const getInputBg = () => {
    return theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  };

  const isVisible = (id: string) => visibleSections.has(id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  // Split NEEZAMIYA - Only 'M' will be Gold, rest White
  const neezamiyaText = "NEEZAMIYA";
  const neezamiyaChars = neezamiyaText.split('');

  // Image animation - Har scroll par trigger
  const getImageAnimationClass = (imagePosition: 'left' | 'right', isVisible: boolean) => {
    if (!isVisible) {
      return imagePosition === 'left' 
        ? 'opacity-0 -translate-x-[100%] scale-95' 
        : 'opacity-0 translate-x-[100%] scale-95';
    }
    return 'opacity-100 translate-x-0 scale-100';
  };

  // Content animation - Har scroll par trigger
  const getContentAnimationClass = (isVisible: boolean) => {
    return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content with Particle Network Background - Single instance for entire page */}
      <div className="w-full relative" style={{ 
        backgroundColor: getSectionBg(), 
        fontFamily: "'Poppins', sans-serif",
        overflow: 'hidden',
        minHeight: '100vh',
      }}>
        
        {/* Single Particle Network for entire page - 80 particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ParticleNetwork theme={theme} />
        </div>

        {/* Subtle glow effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div 
            className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${GOLD}, transparent 70%)`,
            }}
          />
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${BLUE}, transparent 70%)`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Sections */}
          {PRODUCTS.map((product, index) => {
            const isLeft = product.imagePosition === 'left';
            const accentLight = getAccentLight(product.accentColor);
            const isSectionVisible = isVisible(product.id);

            return (
              <section
                key={product.id}
                ref={(el: HTMLDivElement | null) => {
                  if (el) {
                    sectionRefs.current.set(product.id, el);
                  }
                }}
                data-section-id={product.id}
                className="flex items-center overflow-hidden relative"
                style={{
                  minHeight: '100vh',
                  padding: '0.5rem 0',
                  marginTop: index === 0 ? '0' : '0',
                  scrollMarginTop: '0',
                }}
              >
                <div className="w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center">
                    
                    {/* Image - Har scroll par animation */}
                    <div 
                      className={`${isLeft ? 'lg:order-1' : 'lg:order-2'} relative group flex ${isLeft ? 'justify-start' : 'justify-end'} transition-all duration-800 ease-out ${getImageAnimationClass(product.imagePosition, isSectionVisible)}`}
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
                      }}
                    >
                      <div
                        className="absolute -inset-4 rounded-3xl blur-2xl transition-all duration-500 group-hover:opacity-100"
                        style={{
                          backgroundColor: accentLight,
                          opacity: 0.4,
                        }}
                      />
                      <div
                        className="relative w-full max-w-[90%] rounded-3xl overflow-hidden border transition-transform duration-300 hover:scale-[1.02]"
                        style={{
                          borderColor: getBorderColor(),
                          boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                          aspectRatio: '4/3',
                          backgroundColor: theme === 'dark' ? 'rgba(26,26,46,0.5)' : 'rgba(245,245,245,0.5)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                            target.className = 'w-full h-full object-contain p-8';
                          }}
                        />
                      </div>
                    </div>

                    {/* Content - Har scroll par animation */}
                    <div 
                      className={`${isLeft ? 'lg:order-2' : 'lg:order-1'} space-y-3 md:space-y-4 pl-0 lg:pl-4 flex flex-col transition-all duration-600 ease-out ${getContentAnimationClass(isSectionVisible)}`}
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
                      }}
                    >
                      <div className="flex flex-col justify-center">
                        <span
                          className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest cursor-default"
                          style={{ 
                            color: GOLD,
                            fontFamily: "'Poppins', sans-serif",
                            letterSpacing: '0.15em',
                          }}
                        >
                          {product.subtitle}
                        </span>
                        
                        <h2
                          className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif cursor-default leading-tight"
                          style={{ 
                            color: getTextColor(),
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {product.title}
                        </h2>
                        
                        <p
                          className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl cursor-default" 
                          style={{ 
                            color: getTextMuted(),
                            fontFamily: "'Calibri Light', sans-serif",
                          }}
                        >
                          {product.description}
                        </p>
                        
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {product.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-xs sm:text-sm cursor-default"
                              style={{ 
                                color: getTextMuted(),
                                fontFamily: "'Calibri Light', sans-serif",
                              }}
                            >
                              <span
                                className="material-symbols-outlined cursor-default flex-shrink-0"
                                style={{
                                  fontSize: '18px',
                                  color: BLUE,
                                }}
                              >
                                check_circle
                              </span>
                              <span className="break-words">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="pt-3">
                          <button
                            onClick={scrollToCTA}
                            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto text-white shadow-lg`}
                            style={{
                              backgroundColor: BLUE,
                              fontFamily: "'Poppins', sans-serif",
                              boxShadow: `0 4px 20px rgba(0, 102, 255, 0.3)`,
                            }}
                          >
                            {product.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}

          {/* NEEZAMIYA */}
          <div
            ref={neezamiyaRef}
            className={`relative w-full flex items-center justify-center transition-all duration-1000 ease-out ${
              isNeezamiyaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{
              minHeight: '40vh',
              padding: '2rem 0',
            }}
          >
            <div className="text-center px-4">
              <span
                className="font-bold font-serif tracking-tight block cursor-default"
                style={{
                  fontSize: 'clamp(3rem, 12vw, 10rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {neezamiyaChars.map((char, index) => {
                  const isM = char === 'M';
                  return (
                    <span
                      key={index}
                      style={{
                        color: isM ? GOLD : '#FFFFFF',
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              <span
                className="block mt-3 sm:mt-4 text-xs sm:text-sm font-light tracking-[0.2em] uppercase cursor-default"
                style={{ 
                  color: GOLD,
                  fontFamily: "'Calibri Light', sans-serif",
                  letterSpacing: '0.3em',
                }}
              >
                Enterprise Solutions
              </span>
            </div>
          </div>

          {/* Call to Action Section with Form */}
          <div
            ref={ctaRef}
            className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 rounded-3xl transition-all duration-700 flex items-center mb-0 relative"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderColor: getBorderColor(),
              borderWidth: '1px',
              marginTop: '1rem',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-3 cursor-default"
                  style={{ 
                    color: getTextColor(),
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Ready to Transform Your Institution?
                </h2>
                <p
                  className="text-sm sm:text-base max-w-2xl mx-auto cursor-default"
                  style={{ 
                    color: getTextMuted(),
                    fontFamily: "'Calibri Light', sans-serif",
                  }}
                >
                  Get a personalized demo and discover how NEEZAMIYA's enterprise solutions can revolutionize your educational institution.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-medium mb-1.5 cursor-default"
                      style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base transition-all focus:outline-none focus:ring-2 cursor-text"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        color: getTextColor(),
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium mb-1.5 cursor-default"
                      style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base transition-all focus:outline-none focus:ring-2 cursor-text"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        color: getTextColor(),
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                      placeholder="john@institution.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs sm:text-sm font-medium mb-1.5 cursor-default"
                      style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base transition-all focus:outline-none focus:ring-2 cursor-text"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        color: getTextColor(),
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="interest"
                      className="block text-xs sm:text-sm font-medium mb-1.5 cursor-default"
                      style={{ 
                        color: getTextMuted(),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Product of Interest
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base transition-all focus:outline-none focus:ring-2 cursor-pointer appearance-none"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        color: getTextColor(),
                        fontFamily: "'Calibri Light', sans-serif",
                        zIndex: 10,
                        position: 'relative',
                      }}
                    >
                      <option value="">Select a product</option>
                      {PRODUCTS.map(product => (
                        <option key={product.id} value={product.title} style={{ 
                          backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff',
                          color: getTextColor(),
                          padding: '8px',
                        }}>
                          {product.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 text-white shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: BLUE,
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: `0 4px 30px rgba(0, 102, 255, 0.3)`,
                    }}
                  >
                    {formSubmitted ? '✓ Request Sent!' : 'Request a Demo'}
                  </button>
                  {formSubmitted && (
                    <p
                      className="mt-3 text-sm text-center"
                      style={{ 
                        color: BLUE,
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    >
                      Thank you! We'll be in touch shortly.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

        .material-symbols-outlined {
          font-family: "Material Symbols Outlined";
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: "liga";
          -webkit-font-smoothing: antialiased;
        }

        input:focus, select:focus {
          box-shadow: 0 0 0 2px ${BLUE} !important;
          border-color: ${BLUE} !important;
        }

        button:hover {
          opacity: 0.9;
        }

        footer {
          margin-top: 0 !important;
        }

        section {
          scroll-margin-top: 0;
        }
      `}</style>
    </>
  );
}