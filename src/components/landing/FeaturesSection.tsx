"use client";

import React, { useEffect, useState } from "react";

interface Feature {
  title: string;
  shortLabel: string;
}

const features: Feature[] = [
  {
    title: "Ready-Made Portfolio Templates",
    shortLabel: "Portfolio",
  },
  {
    title: "Multi-Portal Architecture",
    shortLabel: "Multiportal",
  },
  {
    title: "Centralized Management",
    shortLabel: "Centraliz",
  },
  {
    title: "Real-Time Content Updates",
    shortLabel: "Live Sync",
  },
  {
    title: "Role-Based Access Control",
    shortLabel: "Access Ctrl",
  },
];

export default function FeaturesSection() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

  // 5 segments with positions - moved labels slightly left
  const segments = [
    { 
      id: 0, 
      path: "M 135 45 C 110 50, 75 110, 65 180 C 60 215, 75 240, 105 245 L 210 200 L 155 55 Z", 
      label: features[0].shortLabel, 
      x: 115, // Moved left from 130 to 115
      y: 120,
    },
    { 
      id: 1, 
      path: "M 175 42 C 240 35, 330 65, 385 145 L 230 185 L 165 55 Z", 
      label: features[1].shortLabel, 
      x: 285, // Moved left from 300 to 285
      y: 100,
    },
    { 
      id: 2, 
      path: "M 100 260 C 110 320, 150 380, 245 385 L 205 220 L 105 255 Z", 
      label: features[2].shortLabel, 
      x: 165, // Moved left from 180 to 165
      y: 310,
    },
    { 
      id: 3, 
      path: "M 225 220 L 270 345 C 300 330, 330 300, 345 285 L 305 195 L 225 210 Z", 
      label: features[3].shortLabel, 
      x: 285, // Moved left from 300 to 285
      y: 270,
    },
    { 
      id: 4, 
      path: "M 310 175 L 395 260 C 425 225, 435 175, 430 150 L 335 170 Z", 
      label: features[4].shortLabel, 
      x: 375, // Moved left from 390 to 375
      y: 212,
    },
  ];

  const bgColor = theme === 'dark' ? '#0B0F19' : '#FFFFFF';
  const strokeColor = theme === 'dark' ? '#E8CA5E' : '#1F2937';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#1F2937';
  const headingColor = theme === 'dark' ? '#E8CA5E' : '#0066FF'; // Yellow in dark, Blue in light

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 
          className="text-3xl md:text-4xl font-bold font-serif tracking-tight"
          style={{ color: headingColor }}
        >
          Comprehensive System Features
        </h2>
        <div 
          className="w-20 h-1 mx-auto mt-3 rounded-full"
          style={{ 
            background: headingColor,
            boxShadow: `0 0 20px ${headingColor}44`
          }}
        />
      </div>

      <div className="relative w-full max-w-[550px]">
        <svg 
          className="w-full h-auto" 
          viewBox="0 0 436 397" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="roughness">
              <feTurbulence baseFrequency="0.03" numOctaves="3" result="noise" type="fractalNoise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>
          
          <g 
            fill="none" 
            stroke={strokeColor} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2.5"
            style={{ filter: 'url(#roughness)' }}
          >
            {segments.map((segment) => (
              <path
                key={segment.id}
                d={segment.path}
                style={{
                  animation: `subtleFade ${15 + segment.id * 1.5}s ease-in-out infinite`,
                  animationDelay: `${segment.id * 2}s`,
                  opacity: 0.3,
                }}
              />
            ))}
          </g>
          
          {/* Segment labels with fade in/out - left margin applied */}
          {segments.map((segment) => (
            <text
              key={`label-${segment.id}`}
              x={segment.x}
              y={segment.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={segment.id === 4 ? "10" : "11"}
              fontWeight="500"
              fill={textColor}
              style={{
                fontFamily: "'Architects Daughter', cursive",
                animation: `textFade ${15 + segment.id * 1.5}s ease-in-out infinite`,
                animationDelay: `${segment.id * 2}s`,
                opacity: 0.3,
                pointerEvents: 'none',
              }}
            >
              {segment.label}
            </text>
          ))}
        </svg>
      </div>

      <style jsx global>{`
        @keyframes subtleFade {
          0% {
            opacity: 0.2;
            transform: scale(0.99);
          }
          25% {
            opacity: 0.9;
            transform: scale(1.01);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.995);
          }
          75% {
            opacity: 0.9;
            transform: scale(1.01);
          }
          100% {
            opacity: 0.2;
            transform: scale(0.99);
          }
        }
        
        @keyframes textFade {
          0% {
            opacity: 0.15;
          }
          25% {
            opacity: 0.85;
          }
          50% {
            opacity: 0.4;
          }
          75% {
            opacity: 0.85;
          }
          100% {
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}