// components/about/PurposeSection.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface CardData {
  label: string;
  title: string;
  body: string;
  accentColor: string;
  labelColor: string;
  icon: React.ReactNode;
}

// ─── Icons ───
const TargetIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.6" fill="none" />
    <circle cx="16" cy="16" r="5.5" stroke={color} strokeWidth="1.6" fill="none" />
    <circle cx="16" cy="16" r="1.5" fill={color} />
    <line x1="16" y1="5" x2="16" y2="2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="27" y1="16" x2="30" y2="16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="16" y1="27" x2="16" y2="30" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="5" y1="16" x2="2" y2="16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const EyeIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 17C4 17 8.5 9 17 9C25.5 9 30 17 30 17C30 17 25.5 25 17 25C8.5 25 4 17 4 17Z"
      stroke={color}
      strokeWidth="1.6"
      fill="none"
      strokeLinejoin="round"
    />
    <circle cx="17" cy="17" r="4.5" stroke={color} strokeWidth="1.6" fill="none" />
    <circle cx="17" cy="17" r="1.5" fill={color} />
  </svg>
);

const DotGrid: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 4px)",
      gap: "7px",
      marginTop: "28px",
    }}
  >
    {Array.from({ length: 9 }).map((_, i) => (
      <span
        key={i}
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: theme === 'dark' ? "#1e2d52" : "#d1d9e8",
          display: "block",
        }}
      />
    ))}
  </div>
);

// ─── Icon Circle with Hover Animation ───
const IconCircle: React.FC<{
  children: React.ReactNode;
  dotColor: string;
  theme: 'light' | 'dark';
}> = ({ children, dotColor, theme }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const borderColor = theme === 'dark' ? "#1e3366" : "#e0e6f0";
  const bgColor = theme === 'dark' ? "rgba(12, 22, 58, 0.8)" : "rgba(255, 255, 255, 0.9)";
  const shadowColor = theme === 'dark' ? "rgba(232,202,94,0.15)" : "rgba(0, 102, 255, 0.08)";

  return (
    <motion.div
      style={{
        width: "68px",
        height: "68px",
        borderRadius: "50%",
        border: `1.5px solid ${borderColor}`,
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        cursor: "pointer",
        boxShadow: theme === 'light' ? `0 4px 15px ${shadowColor}` : 'none',
        transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
      }}
      whileHover={{
        scale: 1.1,
        borderColor: dotColor,
        boxShadow: theme === 'light' 
          ? `0 8px 30px rgba(0, 102, 255, 0.15)` 
          : `0 0 25px ${dotColor}40`,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          duration: 0.15,
        },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: "-5px",
          borderRadius: "50%",
          border: `1px solid ${shadowColor}`,
          pointerEvents: "none",
          transition: "border-color 0.3s ease",
        }}
        animate={{
          borderColor: isHovered ? dotColor : shadowColor,
          scale: isHovered ? 1.15 : 1,
          opacity: isHovered ? 0.8 : 0.3,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
      
      <motion.div
        animate={{
          rotate: isHovered ? 10 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
      
      <motion.div
        style={{
          position: "absolute",
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: dotColor,
          boxShadow: `0 0 8px ${dotColor}`,
          bottom: "6px",
          right: "6px",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          boxShadow: isHovered 
            ? `0 0 20px ${dotColor}, 0 0 40px ${dotColor}60` 
            : `0 0 8px ${dotColor}`,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
    </motion.div>
  );
};

// ─── Shared Card Component ───
const PurposeCard: React.FC<{ 
  data: CardData; 
  isInView: boolean; 
  theme: 'light' | 'dark';
  direction: 'left' | 'right';
}> = ({ data, isInView, theme, direction }) => {
  const textColor = theme === 'dark' ? '#fff' : '#1A2332';
  const bodyColor = theme === 'dark' ? '#7a8daa' : '#4A5B6E';
  const bgColor = theme === 'dark' ? 'transparent' : '#FFFFFF';
  const shadowColor = theme === 'dark' ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.06)';
  const borderColor = theme === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.04)';

  const initialX = direction === 'left' ? -120 : 120;
  const delay = direction === 'left' ? 0.2 : 0.3;

  // Border radius based on direction - only round outer edges
  let borderRadius = '0px';
  if (theme === 'light') {
    if (direction === 'left') {
      borderRadius = '16px 0 0 16px'; // Round left side only
    } else {
      borderRadius = '0 16px 16px 0'; // Round right side only
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
      transition={{ 
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: theme === 'light' ? "32px 28px" : "0 20px",
        width: "100%",
        background: bgColor,
        borderRadius: borderRadius,
        boxShadow: theme === 'light' ? shadowColor : 'none',
        border: theme === 'light' ? borderColor : 'none',
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "18px",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <IconCircle dotColor={data.accentColor} theme={theme}>
          {data.icon}
        </IconCircle>
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: data.labelColor,
              marginBottom: "4px",
            }}
          >
            {data.label}
          </p>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: textColor,
              lineHeight: 1.18,
              transition: "color 0.3s ease",
            }}
          >
            {data.title.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < data.title.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h3>
        </div>
      </div>

      <div
        style={{
          width: "28px",
          height: "2.5px",
          borderRadius: "2px",
          background: data.accentColor,
          margin: "14px 0 16px",
        }}
      />

      <p
        style={{
          fontSize: "14px",
          color: bodyColor,
          lineHeight: 1.7,
          fontWeight: 400,
          maxWidth: "480px",
          transition: "color 0.3s ease",
          width: "100%",
        }}
      >
        {data.body}
      </p>

      <DotGrid theme={theme} />
    </motion.div>
  );
};

// ─── Main Purpose Component ───
export function PurposeSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    amount: 0.2,
    margin: "-100px 0px -100px 0px"
  });

  const [theme, setTheme] = useState<"light" | "dark">("dark");

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

  const missionData: CardData = {
    label: "Our Mission",
    title: "Empowering\nEducation",
    body: "To empower educational institutions with cutting-edge portfolio management technology that simplifies administration, enhances student visibility, and creates lasting digital legacies for academic achievements.",
    accentColor: "#E8CA5E",
    labelColor: "#E8CA5E",
    icon: <TargetIcon color="#c49b2a" />,
  };

  const visionData: CardData = {
    label: "Our Vision",
    title: "Shaping\nthe Future",
    body: "To become the global standard for educational portfolio management, connecting institutions, students, and opportunities through innovative technology that showcases potential and celebrates achievement.",
    accentColor: "#0066FF",
    labelColor: "#0066FF",
    icon: <EyeIcon color="#0066FF" />,
  };

  // Theme-based colors
  const bgColor = theme === 'dark' ? "#0B0F19" : "#F4F7FC";
  const textColor = theme === 'dark' ? '#fff' : '#1A2332';
  const mutedColor = theme === 'dark' ? '#8899bb' : '#6B7A8F';
  const centerDotColor = theme === 'dark' ? '#E8CA5E' : '#0066FF';
  const centerLineColor = theme === 'dark' 
    ? "linear-gradient(to bottom, transparent 0%, #2a4080 20%, #E8CA5E 50%, #2a4080 80%, transparent 100%)"
    : "linear-gradient(to bottom, transparent 0%, #d1d9e8 20%, #0066FF 50%, #d1d9e8 80%, transparent 100%)";

  // Header animation
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: bgColor,
        minHeight: "450px",
        padding: theme === 'light' ? "60px 20px 70px" : "40px 20px 50px",
        marginTop: "4rem", 
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
        transition: "background 0.6s ease, padding 0.3s ease",
      }}
    >
      {/* Subtle background gradient for light mode */}
      {theme === 'light' && (
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(0, 102, 255, 0.03) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
      )}

      {/* Header with Animation */}
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={headerVariants}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "14px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            color: mutedColor,
            textTransform: "uppercase",
            transition: "color 0.3s ease",
          }}
        >
          Our Purpose
        </span>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={headerVariants}
        transition={{ delay: 0.1 }}
        style={{ 
          textAlign: "center", 
          marginBottom: "12px", 
          lineHeight: 1.15,
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1 style={{ 
          fontSize: "clamp(24px, 4vw, 30px)", 
          fontWeight: 800, 
          color: textColor, 
          display: "block", 
          margin: 0,
          transition: "color 0.3s ease",
        }}>
          Purpose & <span style={{ color: theme === 'dark' ? "#E8CA5E" : "#0066FF" }}>Impact</span>
        </h1>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={headerVariants}
        transition={{ delay: 0.15 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "36px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ 
          width: "26px", 
          height: "2.5px", 
          background: theme === 'dark' ? "#E8CA5E" : "#0066FF", 
          borderRadius: "2px",
          opacity: 0.6,
        }} />
        <div style={{ 
          width: "5px", 
          height: "5px", 
          borderRadius: "50%", 
          background: textColor, 
          transition: "background 0.3s ease",
          opacity: 0.3,
        }} />
        <div style={{ 
          width: "26px", 
          height: "2.5px", 
          background: theme === 'dark' ? "#5b9bff" : "#0066FF", 
          borderRadius: "2px",
          opacity: 0.6,
        }} />
      </motion.div>

      {/* Mission & Vision - Responsive Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          gap: "0",
          maxWidth: "1100px",
          margin: "0 auto",
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
        className="purpose-grid"
      >
        <PurposeCard 
          data={missionData} 
          isInView={isInView} 
          theme={theme} 
          direction="left"
        />

        {/* Center Line with Glowing Dot */}
        <div
          style={{
            background: centerLineColor,
            position: "relative",
            alignSelf: "stretch",
            width: "2px",
            margin: "0 auto",
            transition: "background 0.6s ease",
          }}
          className="center-line"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: centerDotColor,
              boxShadow: `0 0 20px 5px ${centerDotColor}60`,
              transition: "background 0.3s ease, box-shadow 0.3s ease",
            }}
            className="center-dot"
          />
        </div>

        <PurposeCard 
          data={visionData} 
          isInView={isInView} 
          theme={theme} 
          direction="right"
        />
      </div>

      {/* ─── RESPONSIVE STYLES ─── */}
      <style>{`
        @media (max-width: 1024px) {
          .purpose-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .center-line {
            display: none !important;
          }
          .center-dot {
            display: none !important;
          }
          /* On mobile, both cards should have full rounded corners */
          .purpose-grid > div {
            border-radius: 16px !important;
          }
        }

        @media (max-width: 640px) {
          .purpose-grid {
            gap: 30px !important;
          }
          .purpose-grid > div {
            padding: 0 10px !important;
          }
          .purpose-grid > div > div:first-child {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .purpose-grid > div > div:first-child h3 {
            font-size: 18px !important;
          }
          .purpose-grid > div p {
            font-size: 13px !important;
          }
          .purpose-grid > div .dot-grid {
            margin-top: 20px !important;
          }
        }

        @media (max-width: 480px) {
          section {
            padding: 30px 12px 40px !important;
            margin-top: 0.5rem !important;
          }
          .purpose-grid > div {
            padding: 0 6px !important;
          }
          .purpose-grid > div > div:first-child h3 {
            font-size: 16px !important;
          }
          .purpose-grid > div p {
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}