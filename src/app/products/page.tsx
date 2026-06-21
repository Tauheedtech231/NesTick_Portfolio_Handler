/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface ProductSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'outline';
  accentColor: 'primary' | 'tertiary' | 'secondary' | 'error';
  imagePosition: 'left' | 'right';
}

const PRODUCTS: ProductSection[] = [
  {
    id: "erp",
    title: "PSM ERP",
    subtitle: "Enterprise Core",
    description: "A high-fidelity, modern SaaS ERP designed specifically for school management. Streamline complex administrative workflows with data-driven precision.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGYcsSWmJrrm3xO8VRNz4aS0PGNIkzbzrUIhrz5QgQoNff6sMqbbvVMJSPOYPmz0HofjGQocvxd4UeoBv-6ed4XPgCjg-j0wWHBayrz_tinsFHuYC7BM1ORCVgagnF4KnUE6lE-CN_VyJ8iqNSe5AAGByeKff7jyfiChO_OfXzk1Rv8tdjNQBga8Udwf4pEFFEDvNbEULwny5rQ8ffiDtl5q1tYqsyjVDzYT6JMXtXVGPkSNcKU7510Rk5azPwMMagvDv8n9xUPuzl",
    features: [
      "Comprehensive Administration",
      "Real-time Data Visualization",
      "Advanced Sidebar Navigation",
      "Premium Light UI",
      "Centralized Resource Management"
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
    description: "A sleek, modern LMS that bridges the gap between students and educators. Minimalist design meets powerful course management and interactive video modules.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8ct-6ljgpbedqVzynuMqUA-N4P9vSJI2efu6wQXuGRI5tr0BZsaHYIu-1t5xcNGgXzK9SRb-oLPjps7ujmA6mvTVypHZxbyiYOizYHscgjebW6pB1c-Dx7gZUb62aR5FEogFjAORYt5d-vs93KLq6Oces-uxfUp0btjgUH5gWhLceN_zI9qS3BZ3NSY5s4SQoO4quhsYt-y53Bn-6vomE9VxIw3KJOHIRPw0VNEKVL-nBcg7pHnKUl8FGsdsuqzZgaW6QffTBwW2i",
    features: [
      "Course Progress Tracking",
      "Video Player Interface",
      "Interactive Student Panels",
      "High-end SaaS Aesthetic",
      "Collaborative Assignments"
    ],
    buttonText: "Learn More",
    buttonVariant: 'outline',
    accentColor: 'tertiary',
    imagePosition: 'right'
  },
  {
    id: "admissions",
    title: "Admission Automation System",
    subtitle: "Growth Engine",
    description: "Optimize your applicant journey from inquiry to enrollment. Enterprise-grade pipeline tracking ensures no candidate is left behind.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0v_By-ZD17MH3x8-8ebL9kXpvq1ucsRAUKYF02VcOLnxE2_Mkn2v_ZKKDuLz_3MJ4N2tGarmuHavVvC6E7br6gVrFeto4EioicbeNtViS60Vzg9e79ihuJORKC9Yw7ivnTQt3Oy87qWlgO6qrjIsYaSKqx_XOeeGtTbQYbW6BvZUiSiibPhvvg938pDhO9h2OqWgZiA6Jl9PD7amnw3BXR6vzuGhe_FWjrJuHQ-PJNG6RcMM8OFDDfPPlb_dgR4v687A_8EPcUpb5",
    features: [
      "Applicant Pipeline CRM",
      "Status Tracker Dashboard",
      "Predictive Data Analytics",
      "Automated Enrollment",
      "Communication Automation"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'secondary',
    imagePosition: 'left'
  },
  {
    id: "exams",
    title: "Examination Management System",
    subtitle: "Academic Excellence",
    description: "A sophisticated ecosystem for managing assessments. From scheduling to automated grading, ensure complete transparency and accuracy in academic evaluations.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCw2tL4WpL8lFescTP3sJeJ2IgCWjPgVNOH6ghlxsiEIZrGGsZhwwTiEveJUbQIpPRVuMKvVKoelYJm2Jw4ERjlq2bYBAG8_bMWghIqdNLyUSKAGQ2j2r99CAO6q2VWraE5KBI-Ffz69jyH61tgHPFxajV2bmM7iOlwYtKwJxPkCFv6CPPTD3h-v5ecZoXct2qZYbulD63Tl7TVPL9-U-9Yh6bTWQpIws395-Qcs0P6_6-HFGwuA3kCJEmiDq3hhIm9kdqUg3bRKjg",
    features: [
      "Automated Grading Charts",
      "Dynamic Exam Scheduling",
      "Performance Metrics",
      "Secure Question Banks",
      "Detailed Result Analytics"
    ],
    buttonText: "Learn More",
    buttonVariant: 'outline',
    accentColor: 'primary',
    imagePosition: 'right'
  },
  {
    id: "sis",
    title: "Student Information System",
    subtitle: "Single Source of Truth",
    description: "A detailed 360-degree view of every learner. Manage demographics, academic history, and behavioral records in a single, secure environment.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1NzzttGVTvPn_9eDP-JQt7blKhxBt3pP4800OJooC3M8YUCl_D82H5Wb-raXAHvysQfiDLsvKlB3A5xSs9B0Idi0oFQJZKHPMKgLmjNtBhMb6bTX8M7dJhwijiYvyUa4BYP-sGoRcRKzkJfRYJzzveXRYOu3-CikfxSlRvT8xU5_Z5diz6KrutY7y-nZVKl4ICm8vXH1GcoeQyQWWp_1e_iysVx4TJQtz_HN3Dw4lUKO4kMs13Y8y_sC9rE0r6IYIwxd9VceuS3yb",
    features: [
      "Detailed Profile Views",
      "Attendance Monitoring",
      "Demographic Tracking",
      "Academic History Archives",
      "Behavior Logs"
    ],
    buttonText: "Learn More",
    buttonVariant: 'primary',
    accentColor: 'primary',
    imagePosition: 'left'
  },
  {
    id: "fees",
    title: "Fee Management System",
    subtitle: "Financial Integrity",
    description: "Modern financial operations for the modern institution. Securely handle billing cycles, payment status, and institutional reporting.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD95CfUWzepGxHgvl-vqBNZ4fIM8DtX6OIAxsm03exAi-qKzGFICBrwKiLGGwDlojGz8ntEeOX1dNc5UpkyMl9xIvC834cUfOUcCgFFWpBcbi3gIa1QWABWwVVqZD3GiP-0zRN8ejBUc0ba_m74NnHYtJIttbLr5qWtx85x66-5Yq-Q0AbpQyslbSnWVssuRm0_ck5k-v4ws9RXeTA3OVQGXe0wZkDDVZY5dT2u0pNy1osh2TiFeQlDmqzYC1bzshBV5BY77plzLap",
    features: [
      "Automated Billing Cycles",
      "Real-time Payment Status",
      "Financial Reporting Modules",
      "Multi-Gateway Integration",
      "Secure Transaction Audit"
    ],
    buttonText: "Learn More",
    buttonVariant: 'outline',
    accentColor: 'error',
    imagePosition: 'right'
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

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section-id');
          if (id) {
            setVisibleSections(prev => new Set(prev).add(id));
          }
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
      threshold: 0.3,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsNeezamiyaVisible(true);
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

  const getAccentColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: theme === 'dark' ? '#004ac6' : '#2563eb',
      tertiary: theme === 'dark' ? '#943700' : '#bc4800',
      secondary: theme === 'dark' ? '#505f76' : '#54647a',
      error: theme === 'dark' ? '#ba1a1a' : '#dc2626',
    };
    return colors[color] || colors.primary;
  };

  const getAccentLight = (color: string) => {
    const colors: Record<string, string> = {
      primary: theme === 'dark' ? 'rgba(0, 74, 198, 0.1)' : 'rgba(37, 99, 235, 0.1)',
      tertiary: theme === 'dark' ? 'rgba(148, 55, 0, 0.1)' : 'rgba(188, 72, 0, 0.1)',
      secondary: theme === 'dark' ? 'rgba(80, 95, 118, 0.1)' : 'rgba(84, 100, 122, 0.1)',
      error: theme === 'dark' ? 'rgba(186, 26, 26, 0.1)' : 'rgba(220, 38, 38, 0.1)',
    };
    return colors[color] || colors.primary;
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

  const getAccent = () => {
    return theme === 'dark' ? '#E8CA5E' : '#0066FF';
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

  // Split NEEZAMIYA for colored 6th character
  const neezamiyaText = "NEEZAMIYA";
  const neezamiyaChars = neezamiyaText.split('');

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content with top margin */}
      <div className="w-full pt-20 md:pt-24 lg:pt-28" style={{ backgroundColor: getSectionBg() }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 sm:space-y-16 lg:space-y-20">
          {/* Product Sections with Continuous Fade Animation */}
          {PRODUCTS.map((product, index) => {
            const isLeft = product.imagePosition === 'left';
            const accentColor = getAccentColor(product.accentColor);
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
                className={`transition-all duration-700 ease-out ${
                  isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center`}>
                  {/* Image with Continuous Fade Animation */}
                  <div className={`${isLeft ? 'lg:order-1' : 'lg:order-2'} relative group`}>
                    <div
                      className="absolute -inset-4 rounded-3xl blur-2xl transition-all duration-500 group-hover:opacity-100"
                      style={{
                        backgroundColor: accentLight,
                        opacity: 0.5,
                      }}
                    />
                    <div
                      className="relative rounded-3xl overflow-hidden border cursor-pointer transition-transform duration-300 hover:scale-[1.02] animate-fade-in-out"
                      style={{
                        borderColor: getBorderColor(),
                        boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                        animationDelay: `${index * 0.5}s`,
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-auto object-cover aspect-video"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Content with Continuous Fade Animation */}
                  <div 
                    className={`${isLeft ? 'lg:order-2' : 'lg:order-1'} space-y-3 animate-fade-in-out`}
                    style={{
                      animationDelay: `${index * 0.5 + 0.3}s`,
                    }}
                  >
                    <span
                      className="text-[10px] font-semibold uppercase tracking-widest cursor-default"
                      style={{ color: accentColor }}
                    >
                      {product.subtitle}
                    </span>
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl font-bold font-serif cursor-default"
                      style={{ color: getTextColor() }}
                    >
                      {product.title}
                    </h2>
                    <p
                      className="text-sm sm:text-base leading-relaxed max-w-xl cursor-default"
                      style={{ color: getTextMuted() }}
                    >
                      {product.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {product.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs sm:text-sm cursor-default"
                          style={{ color: getTextMuted() }}
                        >
                          <span
                            className="material-symbols-outlined cursor-default flex-shrink-0"
                            style={{
                              fontSize: '18px',
                              color: accentColor,
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
                        className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto ${
                          product.buttonVariant === 'primary'
                            ? 'text-white shadow-lg'
                            : 'border'
                        }`}
                        style={{
                          backgroundColor: product.buttonVariant === 'primary' ? accentColor : 'transparent',
                          color: product.buttonVariant === 'primary' ? '#FFFFFF' : getTextColor(),
                          borderColor: product.buttonVariant === 'outline' ? getBorderColor() : 'transparent',
                        }}
                      >
                        {product.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}

          {/* NEEZAMIYA - Large, centered at bottom */}
          <div
            ref={neezamiyaRef}
            className={`relative w-full flex items-center justify-center transition-all duration-1000 ease-out ${
              isNeezamiyaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{
              minHeight: '30vh',
              padding: '2rem 0',
            }}
          >
            <div className="text-center px-4 animate-fade-in-out">
              <span
                className="font-bold font-serif tracking-tight block cursor-default"
                style={{
                  fontSize: 'clamp(3rem, 12vw, 10rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                {neezamiyaChars.map((char, index) => {
                  const isSixth = index === 5;
                  return (
                    <span
                      key={index}
                      style={{
                        color: isSixth ? getAccent() : getTextColor(),
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              <span
                className="block mt-3 sm:mt-4 text-xs sm:text-sm font-light tracking-[0.2em] uppercase cursor-default"
                style={{ color: getTextMuted() }}
              >
                Enterprise Solutions
              </span>
            </div>
          </div>

          {/* Call to Action Section with Form */}
          <div
            ref={ctaRef}
            className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 rounded-3xl transition-all duration-700"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderColor: getBorderColor(),
              borderWidth: '1px',
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-3 cursor-default"
                  style={{ color: getTextColor() }}
                >
                  Ready to Transform Your Institution?
                </h2>
                <p
                  className="text-sm sm:text-base max-w-2xl mx-auto cursor-default"
                  style={{ color: getTextMuted() }}
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
                      style={{ color: getTextMuted() }}
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
                      }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium mb-1.5 cursor-default"
                      style={{ color: getTextMuted() }}
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
                      style={{ color: getTextMuted() }}
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
                      }}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="interest"
                      className="block text-xs sm:text-sm font-medium mb-1.5 cursor-default"
                      style={{ color: getTextMuted() }}
                    >
                      Product of Interest
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base transition-all focus:outline-none focus:ring-2 cursor-pointer"
                      style={{
                        backgroundColor: getInputBg(),
                        borderColor: getBorderColor(),
                        color: getTextColor(),
                      }}
                    >
                      <option value="">Select a product</option>
                      {PRODUCTS.map(product => (
                        <option key={product.id} value={product.title}>
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
                      backgroundColor: getAccent(),
                    }}
                  >
                    {formSubmitted ? '✓ Request Sent!' : 'Request a Demo'}
                  </button>
                  {formSubmitted && (
                    <p
                      className="mt-3 text-sm text-center"
                      style={{ color: getAccent() }}
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

      {/* Material Icons Font & Continuous Animations */}
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

        /* Continuous Fade In Out Animation */
        @keyframes fadeInOut {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          25% {
            opacity: 0.7;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          75% {
            opacity: 0.8;
            transform: scale(0.99);
          }
        }

        .animate-fade-in-out {
          animation: fadeInOut 6s ease-in-out infinite;
        }

        /* Responsive animation adjustments */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-out {
            animation: none;
          }
        }

        /* Input focus ring using box-shadow instead of focusRingColor */
        input:focus, select:focus {
          box-shadow: 0 0 0 2px ${theme === 'dark' ? '#E8CA5E' : '#0066FF'} !important;
          border-color: ${theme === 'dark' ? '#E8CA5E' : '#0066FF'} !important;
        }
      `}</style>
    </>
  );
}