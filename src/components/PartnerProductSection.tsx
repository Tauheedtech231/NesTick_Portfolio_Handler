"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  Users,
  Handshake,
  FileText,
  TrendingUp,
} from "lucide-react";

const HexCard = ({
  title,
  value,
  icon,
  className = "",
  targetValue,
  suffix,
  isKFormat = false,
  index = 0,
  delay = 0,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
  targetValue: number;
  suffix: string;
  isKFormat?: boolean;
  index?: number;
  delay?: number;
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: "-50px 0px",
  });

  // Detect theme
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };
    
    checkTheme();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Animate counter when in view
  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
      
      const duration = 2000;
      const steps = 60;
      const increment = targetValue / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
          current = targetValue;
          clearInterval(timer);
        }
        
        setCount(Math.floor(current));
      }, duration / steps);
    }
  }, [inView, hasAnimated, targetValue]);

  const formatValue = (count: number) => {
    if (isKFormat) {
      return (count / 1000).toFixed(1) + "K+";
    }
    return count + suffix;
  };

  return (
    <div 
      ref={ref}
      className={`absolute ${className} cursor-pointer transition-all duration-1000 ease-out will-change-transform`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : `translateY(${150 + index * 30}px) scale(0.85)`,
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="relative w-[210px] h-[180px]">
        {/* Outer Hex - Removed border */}
        <div
          className="absolute inset-0"
          style={{
            clipPath:
              "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
          }}
        />

        {/* Inner Hex - With floating animation */}
        <div
          className="absolute inset-[10px] flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105"
          style={{
            clipPath:
              "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
            backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "#F3F4F6",
            border: theme === "dark" ? "1px solid rgba(30, 41, 59, 0.5)" : "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.04)",
            cursor: "pointer",
            animation: inView ? `float ${4 + delay}s ease-in-out infinite` : "none",
          }}
        >
          <p 
            className="text-xs font-medium transition-all duration-300"
            style={{ 
              color: theme === "dark" ? "#9CA3AF" : "#6B7280"
            }}
          >
            {title}
          </p>

          <h3 
            className="text-2xl font-bold font-serif mt-1 transition-all duration-300"
            style={{ 
              color: theme === "dark" ? "#FFFFFF" : "#1F2937"
            }}
          >
            {formatValue(count)}
          </h3>

          <div 
            className="mt-2 transition-all duration-300"
            style={{ 
              color: theme === "dark" ? "#FFFFFF" : "#1F2937"
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SocialProofBar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const sectionRef = useRef<HTMLElement>(null);
  
  const { ref: centerRef, inView: centerInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: "-50px 0px",
  });

  // Detect theme
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };
    
    checkTheme();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-[510px] overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: theme === "dark" ? "#0B0F19" : "#FFFFFF"
      }}
    >
      {/* Left Top */}
      <HexCard
        title="Clients"
        value="500+"
        icon={<Handshake size={24} />}
        className="left-[70px] top-[155px]"
        targetValue={500}
        suffix="+"
        index={0}
        delay={0}
      />

      {/* Left Bottom */}
      <HexCard
        title="Templates"
        value="30+"
        icon={<FileText size={24} />}
        className="left-[260px] top-[260px]"
        targetValue={30}
        suffix="+"
        index={1}
        delay={0.5}
      />

      {/* Center Main - Fixed position with proper animation */}
      <div 
        ref={centerRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      >
        <div 
          className="relative w-[330px] h-[280px] transition-all duration-1000 ease-out will-change-transform"
          style={{
            opacity: centerInView ? 1 : 0,
            transform: centerInView ? "scale(1)" : "scale(0.85)",
            transitionDelay: "300ms",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              clipPath:
                "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
            }}
          />

          <div
            className="absolute inset-[12px] transition-all duration-300 hover:scale-105"
            style={{
              clipPath:
                "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
              backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "#F3F4F6",
              border: theme === "dark" ? "1px solid rgba(30, 41, 59, 0.5)" : "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.04)",
              cursor: "pointer",
              animation: centerInView ? "float 4.5s ease-in-out infinite" : "none",
            }}
          >
            <div className="flex items-center justify-center h-full flex-col">
              <h2 
                className="text-3xl font-bold text-center leading-tight transition-all duration-300"
                style={{ 
                  color: theme === "dark" ? "#E8CA5E" : "#00A0FF",
                  fontFamily: "serif"
                }}
              >
                TRUSTED
              </h2>
              <h2 
                className="text-3xl font-bold text-center leading-tight transition-all duration-300"
                style={{ 
                  color: theme === "dark" ? "#FFFFFF" : "#1F2937",
                  fontFamily: "serif"
                }}
              >
                WORLDWIDE
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Right Top */}
      <HexCard
        title="Active Users"
        value="20.0K+"
        icon={<Users size={24} />}
        className="right-[260px] top-[80px]"
        targetValue={20000}
        suffix="K+"
        isKFormat={true}
        index={2}
        delay={1}
      />

      {/* Right */}
      <HexCard
        title="Success Rate"
        value="99%"
        icon={<TrendingUp size={24} />}
        className="right-[60px] top-[185px]"
        targetValue={99}
        suffix="%"
        index={3}
        delay={1.5}
      />

      {/* Add keyframe animation for floating */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}