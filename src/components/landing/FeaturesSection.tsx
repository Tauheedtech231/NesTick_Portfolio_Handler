"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { useInView } from "react-intersection-observer";

interface Feature {
  id: number;
  title: string;
  shortLabel: string;
  tag: string;
  fill: string;
  description: string;
}

export default function FeaturesSection() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeIdx, setActiveIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Theme detection
  useEffect(() => {
    setIsClient(true);
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

  const features: Feature[] = [
    {
      id: 0,
      title: "Ready-Made Portfolio Templates",
      shortLabel: "Portfolio",
      tag: "Templates",
      fill: "#4cc9f0",
      description: "Choose from 30+ professionally designed templates to showcase your work in minutes."
    },
    {
      id: 1,
      title: "Multi-Portal Architecture",
      shortLabel: "Multiportal",
      tag: "Architecture",
      fill: "#f72585",
      description: "Build and manage multiple portals from a single codebase with shared components."
    },
    {
      id: 2,
      title: "Centralized Management",
      shortLabel: "Centraliz",
      tag: "Management",
      fill: "#e8ca5e",
      description: "Control all your portals, users, and content from one central dashboard."
    },
    {
      id: 3,
      title: "Real-Time Content Updates",
      shortLabel: "Live Sync",
      tag: "Real-Time",
      fill: "#06d6a0",
      description: "Content updates reflect instantly across all portals without any downtime."
    },
    {
      id: 4,
      title: "Role-Based Access Control",
      shortLabel: "Access Ctrl",
      tag: "Security",
      fill: "#7209b7",
      description: "Define granular permissions for users, teams, and roles with enterprise-grade security."
    }
  ];

  // Typing animation
  useEffect(() => {
    const activeFeature = features[activeIdx];
    if (!activeFeature) return;

    const fullText = activeFeature.description;
    setTypedText("");
    setProgress(0);
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 30;

    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        setProgress((currentIndex / fullText.length) * 100);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [activeIdx]);

  const strokeColor = theme === 'dark' ? '#94a3b8' : '#1e293b';
  const activeColor = theme === 'dark' ? '#E8CA5E' : '#0066FF';
  const textColor = theme === 'dark' ? '#60A5FA' : '#1E3A8A';
  const dimTextColor = theme === 'dark' ? '#60A5FA' : '#000000';
  const cardBgColor = theme === 'dark' ? 'rgba(15, 23, 42, 0.97)' : 'rgba(255, 255, 255, 0.97)';
  const cardTextColor = theme === 'dark' ? '#e2e8f0' : '#1e293b';
  const cardTextSecondary = theme === 'dark' ? '#9CA3AF' : '#4B5563';
  const cardBgLight = theme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : '#F3F4F6';
  
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const diagramContainerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [showCard, setShowCard] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [cardAnimating, setCardAnimating] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-loop through features
  const startLoop = useCallback(() => {
    if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    
    loopTimerRef.current = setInterval(() => {
      const nextIdx = (activeIdx + 1) % features.length;
      setActiveIdx(nextIdx);
    }, 4000);
  }, [activeIdx, features.length]);

  useEffect(() => {
    startLoop();
    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [startLoop]);

  // Auto hide after description complete
  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (progress === 100 && !isHovering && !userInteracted) {
      hideTimerRef.current = setTimeout(() => {
        setCardAnimating(false);
        setTimeout(() => {
          const nextIdx = (activeIdx + 1) % features.length;
          setActiveIdx(nextIdx);
          setCardAnimating(true);
        }, 500);
      }, 1500);
    }

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [progress, isHovering, userInteracted, activeIdx]);

  useEffect(() => {
    if (isHovering) {
      setShowCard(true);
      setCardAnimating(true);
    } else {
      setShowCard(true);
      setCardAnimating(true);
    }
  }, [isHovering]);

  // Arrow positions
  const ARROW_START_X = 250;
  const ARROW_START_Y = 20;

  const getArrowEndPosition = () => {
    if (cardRef.current && svgRef.current && diagramContainerRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      const containerRect = diagramContainerRef.current.getBoundingClientRect();
      
      const scaleX = 550 / svgRect.width;
      const scaleY = 500 / svgRect.height;
      
      const cardTopCenterX = (cardRect.left + cardRect.width / 2 - containerRect.left) * scaleX;
      const cardTopY = (cardRect.top - containerRect.top - 10) * scaleY;
      
      return { x: Math.max(480, Math.min(cardTopCenterX, 540)), y: Math.max(20, cardTopY) };
    }
    
    return { x: 502, y: 160 };
  };

  const arrowEnd = getArrowEndPosition();
  const arrowPath = `M ${ARROW_START_X} ${ARROW_START_Y} Q ${(ARROW_START_X + arrowEnd.x) / 2 + 40} ${Math.min(ARROW_START_Y, arrowEnd.y) - 60}, ${arrowEnd.x} ${arrowEnd.y}`;

  // Fixed: Only 5 positions for 5 features
  const featurePositions = [
    { x: 115, y: 90, marginTop: 22, marginLeft: 0, id: 0 },
    { x: 325, y: 110, marginTop: 0, marginLeft: 0, id: 1 },
    { x: 235, y: 205, marginTop: 18, marginLeft: 0, id: 2 },
    { x: 130, y: 295, marginTop: 18, marginLeft: 0, id: 3 },
    { x: 180, y: 430, marginTop: 0, marginLeft: 25, id: 4 },
  ];

  const activeFeature = features[activeIdx];

  const handleMouseEnter = (idx: number) => {
    setUserInteracted(true);
    if (loopTimerRef.current) {
      clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsHovering(true);
    setActiveIdx(idx);
    setShowCard(true);
    setCardAnimating(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setUserInteracted(false);
    startLoop();
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, []);

  if (!isClient) return null;

  return (
    <div 
      ref={sectionRef}
      className="relative w-full flex items-center justify-center" 
      style={{ minHeight: '500px' }}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-center" style={{ gap: '0px', minWidth: '550px' }}>
        {/* Diagram Container */}
        <div ref={diagramContainerRef} className="relative w-[500px] h-[500px] flex-shrink-0">
          <svg
            ref={svgRef}
            viewBox="0 0 550 500"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Main Circle */}
            <circle
              cx="250"
              cy="250"
              r="230"
              fill="none"
              stroke={activeIdx !== null ? activeColor : strokeColor}
              strokeWidth={activeIdx !== null ? 3 : 2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "all 0.5s ease",
                filter: activeIdx !== null ? `drop-shadow(0 0 6px ${activeColor}44)` : 'none',
              }}
            />

            {/* Dividers */}
            {[
              { x1: 250, y1: 20, x2: 160, y2: 155 },
              { x1: 160, y1: 155, x2: 330, y2: 210 },
              { x1: 120, y1: 260, x2: 210, y2: 330 },
              { x1: 210, y1: 330, x2: 480, y2: 250 },
              { x1: 160, y1: 155, x2: 120, y2: 260 },
              { x1: 330, y1: 210, x2: 480, y2: 250 },
              { x1: 20, y1: 250, x2: 120, y2: 260 },
              { x1: 210, y1: 330, x2: 140, y2: 452 },
              { x1: 210, y1: 330, x2: 310, y2: 472 },
            ].map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={activeIdx !== null ? activeColor : strokeColor}
                strokeWidth={activeIdx !== null ? 3 : 2.5}
                style={{
                  transition: "all 0.5s ease",
                  filter: activeIdx !== null ? `drop-shadow(0 0 4px ${activeColor}44)` : 'none',
                }}
              />
            ))}

            {/* Dotted Curved Arrow */}
            {showCard && (
              <>
                <path
                  d={arrowPath}
                  fill="none"
                  stroke={activeColor}
                  strokeWidth={2.5}
                  opacity={0.8}
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="14"
                    to="0"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </path>

                <foreignObject
                  x={arrowEnd.x - 14}
                  y={arrowEnd.y - 14}
                  width={28}
                  height={28}
                >
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activeColor,
                      fontSize: '28px',
                      opacity: 0.9,
                      transition: 'all 0.5s ease',
                    }}
                  >
                    <TiArrowSortedDown />
                  </div>
                </foreignObject>
              </>
            )}

            {/* Feature Labels */}
            {featurePositions.map((pos) => {
              const feature = features[pos.id];
              if (!feature) return null;
              
              const isActive = activeIdx === pos.id;
              const isDimmed = activeIdx !== null && !isActive;
              
              const textX = pos.x + pos.marginLeft;
              const textY = pos.y + pos.marginTop;

              return (
                <g
                  key={pos.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => handleMouseEnter(pos.id)}
                >
                  <circle cx={pos.x} cy={pos.y} r="55" fill="transparent" />
                  
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isActive ? activeColor : isDimmed ? dimTextColor : textColor}
                    fontSize={pos.id === 4 ? "18" : pos.id === 1 ? "16" : "14"}
                    fontWeight={isActive ? "bold" : "600"}
                    style={{
                      fontFamily: "'Architects Daughter', cursive",
                      transition: "all 0.5s ease",
                      opacity: isDimmed ? 0.4 : 1,
                      filter: isActive ? `drop-shadow(0 0 8px ${activeColor}66)` : 'none',
                      pointerEvents: "none",
                    }}
                  >
                    {feature.shortLabel.split(" ").map((word: string, i: number) => (
                      <tspan key={i} x={textX} dy={i === 0 ? 0 : 18}>
                        {word}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Description Card */}
        <div 
          className="flex-shrink-0 relative"
          style={{ 
            width: '340px',
            minHeight: '300px',
            marginLeft: '-14px',
          }}
        >
          <div 
            className="absolute inset-0 flex items-center"
            style={{ pointerEvents: 'auto' }}
          >
            {showCard && activeFeature && (
              <div 
                ref={cardRef}
                className="w-full"
                style={{
                  opacity: cardAnimating ? 1 : 0,
                  transform: cardAnimating ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.9)',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  pointerEvents: 'auto',
                }}
              >
                <div
                  className="rounded-xl p-5 shadow-2xl relative"
                  style={{
                    backgroundColor: cardBgColor,
                    border: `2px solid ${activeColor}`,
                    boxShadow: `0 0 50px ${activeColor}33, 0 20px 60px rgba(0,0,0,0.3)`,
                    width: '100%',
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${activeColor}22, transparent 70%)`,
                      opacity: 0.5,
                    }}
                  />
                  
                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        background: activeFeature.fill,
                        border: `2px solid ${activeColor}`,
                        boxShadow: `0 0 15px ${activeColor}66`,
                      }}
                    />
                    <span className="text-base font-semibold leading-tight flex-1" style={{ color: cardTextColor }}>
                      {activeFeature.title}
                    </span>
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full ml-auto flex-shrink-0 font-medium"
                      style={{ 
                        background: theme === 'dark' ? 'rgba(232, 202, 94, 0.2)' : 'rgba(0, 102, 255, 0.15)',
                        color: activeColor 
                      }}
                    >
                      {activeFeature.tag}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 mb-3 relative z-10">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: activeFeature.fill }}
                    />
                    <p className="text-sm leading-relaxed min-h-[48px]" style={{ color: cardTextSecondary }}>
                      {typedText}
                      {isTyping && (
                        <span
                          className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                          style={{ background: cardTextSecondary, animation: "blink 0.7s step-end infinite" }}
                        />
                      )}
                    </p>
                  </div>

                  <div className="h-1 w-full rounded-full overflow-hidden relative z-10" style={{ backgroundColor: cardBgLight }}>
                    <div
                      className="h-full rounded-full transition-all duration-75"
                      style={{ width: `${progress}%`, background: activeColor, boxShadow: `0 0 15px ${activeColor}66` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}