'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Stat {
  value: string;
  label: string;
  target: number;
  suffix: string;
}

const stats: Stat[] = [
  { value: '500+', label: 'Clients', target: 500, suffix: '+' },
  { value: '30+', label: 'Templates', target: 30, suffix: '+' },
  { value: '20K+', label: 'Active Users', target: 20000, suffix: 'K+' },
  { value: '99%', label: 'Success Rate', target: 99, suffix: '%' },
];

export default function SocialProofBar() {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: '-50px 0px',
  });

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

  // Animate counter when in view
  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
      
      stats.forEach((stat, index) => {
        const duration = 2000;
        const steps = 60;
        const increment = stat.target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current += increment;
          
          if (step >= steps) {
            current = stat.target;
            clearInterval(timer);
          }
          
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(current);
            return newCounts;
          });
        }, duration / steps);
      });
    }
  }, [inView, hasAnimated]);

  const formatValue = (count: number, suffix: string) => {
    if (suffix === 'K+') {
      return (count / 1000).toFixed(1) + 'K+';
    }
    return count + suffix;
  };

  return (
    <section 
      ref={ref}
      className="py-16 relative overflow-hidden"
      style={{
        backgroundColor: theme === 'dark' ? '#0B0F19' : '#FFFFFF',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            transition-all
            duration-1000
            ease-out
            will-change-transform
          "
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF',
            borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
            boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0) scale(1)' : 'translateY(120px) scale(0.95)',
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-5">
            
            {/* Left Content */}
            <div
              className="
                col-span-2
                lg:col-span-1
                flex
                flex-col
                items-center
                justify-center
                p-6
                lg:p-8
                border-b
                lg:border-b-0
                lg:border-r
                transition-all
                duration-1000
                ease-out
                will-change-transform
              "
              style={{
                borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : '#FAFAFA',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(80px)',
                transitionDelay: '100ms',
              }}
            >
              

              <h3
                className="
                  text-center
                  text-base
                  font-bold
                  transition-all
                  duration-1000
                  ease-out
                  will-change-transform
                "
                style={{ 
                  color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(60px)',
                  transitionDelay: '300ms',
                }}
              >
                Trusted Worldwide
              </h3>
            </div>

            {/* Stats with Counter */}
            {stats.map((stat, index) => (
              <div
                key={index}
                className="
                  group
                  relative
                  flex
                  flex-col
                  items-center
                  justify-center
                  p-4
                  lg:p-6
                  text-center
                  transition-all
                  duration-1000
                  ease-out
                  border-b
                  lg:border-b-0
                  lg:border-r
                  last:border-r-0
                  hover:z-10
                  cursor-default
                  will-change-transform
                "
                style={{
                  borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0) scale(1)' : `translateY(${100 + index * 20}px) scale(0.9)`,
                  transitionDelay: `${(index + 1) * 150}ms`,
                }}
              >
                <div className="absolute inset-0 transition-all duration-500 rounded-2xl will-change-transform"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' 
                      ? 'rgba(255,255,255,0.03)' 
                      : 'rgba(0,0,0,0.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                />
                
                <h4
                  className="
                    text-3xl
                    lg:text-4xl
                    font-bold
                    font-serif
                    transition-all
                    duration-1000
                    ease-out
                    will-change-transform
                  "
                  style={{ 
                    color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    transform: inView ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(60px)',
                    transitionDelay: `${(index + 1) * 200}ms`,
                  }}
                >
                  {formatValue(counts[index], stat.suffix)}
                </h4>

                <p
                  className="
                    mt-1
                    text-sm
                    font-medium
                    transition-all
                    duration-1000
                    ease-out
                    will-change-transform
                  "
                  style={{ 
                    color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(50px)',
                    transitionDelay: `${(index + 1) * 250}ms`,
                  }}
                >
                  {stat.label}
                </p>

                {/* Underline Indicator */}
                <div className="mt-3 w-10 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 will-change-transform"
                  style={{
                    backgroundColor: theme === 'dark' ? '#E8CA5E' : '#00A0FF',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}