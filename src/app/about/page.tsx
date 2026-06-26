/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion, useInView, Variants, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, 
  Rocket, 
  Target,
  Eye,
  Infinity,
  Award,
  TrendingUp,
  Globe,
  Brain,
  Users,
  Crown,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { PartnerSection } from '@/components/landing/PartnerSection';
import JourneySection from './JourneySection';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Stars Component ───
function Stars() {
  const dots = [
    { x: "6%", y: "8%", r: 1, op: 0.5 },
    { x: "17%", y: "15%", r: 1.2, op: 0.4 },
    { x: "30%", y: "6%", r: 0.8, op: 0.6 },
    { x: "47%", y: "4%", r: 1, op: 0.5 },
    { x: "84%", y: "5%", r: 0.8, op: 0.6 },
    { x: "95%", y: "13%", r: 1, op: 0.3 },
    { x: "7%", y: "37%", r: 0.8, op: 0.3 },
    { x: "91%", y: "74%", r: 1, op: 0.4 },
    { x: "63%", y: "91%", r: 1.5, op: 0.7, color: "#4da6ff" },
    { x: "71%", y: "17%", r: 1.5, op: 0.6, color: "#4da6ff" },
    { x: "79%", y: "82%", r: 1, op: 0.5, color: "#4da6ff" },
    { x: "40%", y: "94%", r: 5, op: 0.65, color: "#f5a623" },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.r * 2,
            height: d.r * 2,
            borderRadius: "50%",
            background: d.color ?? "white",
            opacity: d.op,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

// ─── StatItem Component ───
function StatItem({
  icon,
  number,
  numberColor,
  label,
}: {
  icon: React.ReactNode;
  number: string;
  numberColor: string;
  label: string[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 8, opacity: 0.8 }}>{icon}</div>
      <span
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: numberColor,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {number}
      </span>
      {label.map((l, i) => (
        <span
          key={i}
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.5,
          }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

// ─── Icons ───
function InstitutionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="18" height="2" rx="1" fill="#f5a623" />
      <rect x="5" y="4" width="14" height="2" rx="1" fill="#f5a623" />
      <rect x="4" y="12" width="2" height="8" rx="1" fill="#f5a623" />
      <rect x="8" y="12" width="2" height="8" rx="1" fill="#f5a623" />
      <rect x="14" y="12" width="2" height="8" rx="1" fill="#f5a623" />
      <rect x="18" y="12" width="2" height="8" rx="1" fill="#f5a623" />
      <rect x="3" y="20" width="18" height="1.5" rx="0.75" fill="#f5a623" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f5a623"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function GlobeIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── Orbital Diagram ───
function OrbitalDiagram() {
  return (
    <div style={{ position: "relative", width: 480, height: 480 }}>
      {/* Rings */}
      {[480, 372, 260, 152].map((size, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size,
            height: size,
            marginTop: -size / 2,
            marginLeft: -size / 2,
            borderRadius: "50%",
            border:
              i === 2
                ? "1px dashed rgba(255,255,255,0.09)"
                : i === 3
                ? "1.2px solid rgba(245,166,35,0.28)"
                : i === 1
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(255,255,255,0.04)",
          }}
        />
      ))}

      {/* Planet glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 192,
          height: 192,
          marginTop: -96,
          marginLeft: -96,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(77,166,255,0.28) 0%, transparent 70%)",
        }}
      />

      {/* Planet */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 116,
          height: 116,
          marginTop: -58,
          marginLeft: -58,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 35%, #6ab4ff 0%, #1a4a9e 35%, #091535 70%, #030918 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          overflow: "hidden",
        }}
      >
        {/* Golden arc overlay */}
        <svg
          style={{ position: "absolute", inset: 0 }}
          viewBox="0 0 116 116"
          fill="none"
        >
          <path
            d="M 20 44 A 58 58 0 0 1 58 6"
            stroke="#f5a623"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 20 44 A 58 58 0 0 0 58 110"
            stroke="rgba(245,166,35,0.2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span
          style={{
            fontSize: "clamp(28px, 3vw, 36px)",
            fontWeight: 900,
            fontStyle: "italic",
            background: "linear-gradient(135deg, #4da6ff, #f5a623, #fff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            position: "relative",
            zIndex: 1,
          }}
        >
          N
        </span>
      </div>

      {/* Ring accent dots */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "calc(50% - 130px)",
          width: 7,
          height: 7,
          marginTop: -3.5,
          borderRadius: "50%",
          background: "#f5a623",
          boxShadow: "0 0 8px rgba(245,166,35,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "calc(50% - 186px)",
          left: "calc(50% + 80px)",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#4da6ff",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "calc(50% + 140px)",
          left: "calc(50% - 170px)",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#4da6ff",
          opacity: 0.55,
        }}
      />

      {/* Nodes */}
      <OrbitalNode
        label={["SMART PORTFOLIOS"]}
        style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
        labelPos="bottom"
        icon={<PortfolioIcon />}
      />
      <OrbitalNode
        label={["SECURE &", "RELIABLE"]}
        style={{ top: "50%", left: 0, transform: "translateY(-50%)" }}
        labelPos="bottom"
        icon={<ShieldIcon />}
      />
      <OrbitalNode
        label={["DATA DRIVEN", "INSIGHTS"]}
        style={{ top: "50%", right: 0, transform: "translateY(-50%)" }}
        labelPos="bottom"
        icon={<ChartIcon />}
      />
      <OrbitalNode
        label={["GLOBAL", "PRESENCE"]}
        style={{ bottom: 0, left: "50%", transform: "translateX(-50%)" }}
        labelPos="bottom"
        icon={<GlobeNodeIcon />}
      />
    </div>
  );
}

function OrbitalNode({
  icon,
  label,
  style,
  labelPos,
}: {
  icon: React.ReactNode;
  label: string[];
  style: React.CSSProperties;
  labelPos: "bottom";
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        ...style,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "#0a1535",
          border: "1px solid rgba(77,166,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ textAlign: "center" }}>
        {label.map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "1.2px",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.5,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4da6ff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12,2 2,7 12,12 22,7" />
      <polyline points="2,17 12,22 22,17" />
      <polyline points="2,12 12,17 22,12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4da6ff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4da6ff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="10" y1="20" x2="10" y2="4" />
      <line x1="14" y1="20" x2="14" y2="12" />
      <line x1="18" y1="20" x2="18" y2="8" />
      <polyline points="6,14 10,8 14,12 18,6" />
    </svg>
  );
}

function GlobeNodeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4da6ff"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── PurposeSection ───
interface CardData {
  label: string;
  title: string;
  body: string;
  accentColor: string;
  labelColor: string;
  icon: React.ReactNode;
}

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

const DotGrid: React.FC = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 4px)",
      gap: "7px",
      marginTop: "34px",
    }}
  >
    {Array.from({ length: 9 }).map((_, i) => (
      <span
        key={i}
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#1e2d52",
          display: "block",
        }}
      />
    ))}
  </div>
);

const IconCircle: React.FC<{
  children: React.ReactNode;
  dotColor: string;
}> = ({ children, dotColor }) => (
  <div
    style={{
      width: "76px",
      height: "76px",
      borderRadius: "50%",
      border: "1.5px solid #1e3366",
      background: "rgba(12, 22, 58, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: "-5px",
        borderRadius: "50%",
        border: "1px solid rgba(91,155,255,0.15)",
        pointerEvents: "none",
      }}
    />
    {children}
    <div
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
    />
  </div>
);

const MissionCard: React.FC<{ data: CardData }> = ({ data }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      padding: "0 40px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "18px",
        marginBottom: "22px",
        width: "100%",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ textAlign: "right" }}>
        <p
          style={{
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: data.labelColor,
            marginBottom: "5px",
          }}
        >
          {data.label}
        </p>
        <h3
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.18,
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
      <IconCircle dotColor={data.accentColor}>{data.icon}</IconCircle>
    </div>

    <div
      style={{
        width: "30px",
        height: "2.5px",
        borderRadius: "2px",
        background: data.accentColor,
        margin: "16px 0 18px",
      }}
    />

    <p
      style={{
        fontSize: "13px",
        color: "#7a8daa",
        lineHeight: 1.78,
        fontWeight: 400,
        textAlign: "right",
      }}
    >
      {data.body}
    </p>

    <DotGrid />
  </div>
);

const VisionCard: React.FC<{ data: CardData }> = ({ data }) => (
  <div style={{ padding: "0 40px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "18px",
        marginBottom: "22px",
      }}
    >
      <IconCircle dotColor={data.accentColor}>{data.icon}</IconCircle>
      <div>
        <p
          style={{
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: data.labelColor,
            marginBottom: "5px",
          }}
        >
          {data.label}
        </p>
        <h3
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.18,
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
        width: "30px",
        height: "2.5px",
        borderRadius: "2px",
        background: data.accentColor,
        margin: "16px 0 18px",
      }}
    />

    <p
      style={{
        fontSize: "13px",
        color: "#7a8daa",
        lineHeight: 1.78,
        fontWeight: 400,
      }}
    >
      {data.body}
    </p>

    <DotGrid />
  </div>
);

const BackgroundSVG: React.FC = () => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    viewBox="0 0 900 520"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <circle cx="90" cy="340" r="160" fill="none" stroke="#14224a" strokeWidth="1.2" />
    <circle cx="90" cy="340" r="110" fill="none" stroke="#14224a" strokeWidth="0.8" />
    <circle cx="90" cy="340" r="60" fill="none" stroke="#14224a" strokeWidth="0.5" />
    <circle cx="810" cy="340" r="160" fill="none" stroke="#14224a" strokeWidth="1.2" />
    <circle cx="810" cy="340" r="110" fill="none" stroke="#14224a" strokeWidth="0.8" />
    <circle cx="810" cy="340" r="60" fill="none" stroke="#14224a" strokeWidth="0.5" />
    {[44, 58, 72].map((x) =>
      [390, 404].map((y) => (
        <circle key={`l${x}${y}`} cx={x} cy={y} r="2.5" fill="#1a2a52" />
      ))
    )}
    {[500, 514, 528].map((x) =>
      [430, 444].map((y) => (
        <circle key={`r${x}${y}`} cx={x} cy={y} r="2.5" fill="#1a2a52" />
      ))
    )}
  </svg>
);

const PurposeSection: React.FC = () => {
  const missionData: CardData = {
    label: "Our Mission",
    title: "Empowering\nEducation",
    body: "To empower educational institutions with cutting-edge portfolio management technology that simplifies administration, enhances student visibility, and creates lasting digital legacies for academic achievements.",
    accentColor: "#f5a623",
    labelColor: "#f5a623",
    icon: <TargetIcon color="#d4901a" />,
  };

  const visionData: CardData = {
    label: "Our Vision",
    title: "Shaping\nthe Future",
    body: "To become the global standard for educational portfolio management, connecting institutions, students, and opportunities through innovative technology that showcases potential and celebrates achievement.",
    accentColor: "#5b9bff",
    labelColor: "#5b9bff",
    icon: <EyeIcon color="#5b9bff" />,
  };

  return (
    <section
      style={{
        background: "#0B0F19", // Same as JourneySection
        minHeight: "500px",
        padding: "48px 48px 64px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <BackgroundSVG />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "22px",
        }}
      >
        <div style={{ height: "1px", width: "72px", background: "#d4901a" }} />
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#d4901a" }} />
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            color: "#8899bb",
            textTransform: "uppercase",
          }}
        >
          Our Purpose
        </span>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#d4901a" }} />
        <div style={{ height: "1px", width: "72px", background: "#d4901a" }} />
      </div>

      <div style={{ textAlign: "center", marginBottom: "18px", lineHeight: 1.15 }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", display: "block", margin: 0 }}>
          Driven by <span style={{ color: "#f5a623" }}>Purpose</span>,
        </h1>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", display: "block", margin: 0 }}>
          Focused on <span style={{ color: "#5b9bff" }}>Impact</span>
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "48px",
        }}
      >
        <div style={{ width: "26px", height: "2.5px", background: "#f5a623", borderRadius: "2px" }} />
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#e8e8e8" }} />
        <div style={{ width: "26px", height: "2.5px", background: "#5b9bff", borderRadius: "2px" }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          alignItems: "start",
        }}
      >
        <MissionCard data={missionData} />

        <div
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #2a4080 20%, #3a6ac0 50%, #2a4080 80%, transparent 100%)",
            position: "relative",
            alignSelf: "stretch",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#5b9bff",
              boxShadow: "0 0 12px 3px rgba(91,155,255,0.6)",
            }}
          />
        </div>

        <VisionCard data={visionData} />
      </div>
    </section>
  );
};

// Actual team data with avatar colors
const teamMembers = [
  {
    id: 1,
    name: 'Talha Zaheer',
    role: 'CTO',
    avatarColor: '#6366F1',
    initials: 'TZ',
  },
  {
    id: 2,
    name: 'Abdullah Amin',
    role: 'Founder',
    avatarColor: '#8B5CF6',
    initials: 'AA',
  },
  {
    id: 3,
    name: 'Nimra Ali',
    role: 'Creative Lead',
    avatarColor: '#EC4899',
    initials: 'NA',
  },
  {
    id: 4,
    name: 'Muhammad Tauheed',
    role: 'Senior Developer',
    avatarColor: '#06B6D4',
    initials: 'MT',
  },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Team slider state
  const [duplicatedTeam, setDuplicatedTeam] = useState<typeof teamMembers>([]);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });

  // Scroll parallax for team slider
  const { scrollYProgress } = useScroll({
    target: teamRef,
    offset: ["start end", "end start"]
  });

  const sliderX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -200, -400, -600, -800]
  );

  // Detect theme changes
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

  // Create seamless infinite loop for team
  useEffect(() => {
    const copies = [...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers];
    setDuplicatedTeam(copies);
  }, []);

  // Contact Form State
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Contact Info
  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+92 319 3236529", href: "tel:+923193236529", description: "Available Mon-Fri, 9AM-6PM" },
    { icon: Mail, label: "Email", value: "support@portfoliohandler.com", href: "mailto:support@portfoliohandler.com", description: "We reply within 24 hours" },
    { icon: MapPin, label: "Office", value: "Daska, Pakistan", href: null, description: "Serving globally from Daska" },
    { icon: Clock, label: "Business Hours", value: "Monday - Friday", href: null, description: "9:00 AM - 6:00 PM (PKT)" },
  ];

  // Form Handlers
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactFormData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setContactFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
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

  const fadeInRightVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
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

  // Theme-based colors
  const getBgColor = () => '#0B0F19'; // Consistent with JourneySection
  const getTextColor = () => '#FFFFFF';
  const getTextSecondary = () => '#D1D5DB';
  const getTextMuted = () => '#9CA3AF';
  const getAccentColor = () => '#E8CA5E';
  const getBorderColor = () => 'rgba(30, 41, 59, 0.3)';
  const getInputBg = () => 'rgba(15, 23, 42, 0.5)';

  return (
    <>
      <Navbar />
      <main 
        className="min-h-screen pt-16 lg:pt-20 overflow-hidden"
        style={{ backgroundColor: '#0B0F19', fontFamily: "'Poppins', sans-serif" }}
      >
        {/* ─── HERO SECTION (Curve Lines Removed) ─── */}
        <section
          style={{
            minHeight: "100vh",
            background:
              "radial-gradient(ellipse at 65% 50%, #0d1e4a 0%, #070c1e 55%, #03050d 100%)",
            display: "flex",
            alignItems: "center",
            padding: "0 6%",
            position: "relative",
            overflow: "hidden",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <Stars />

          {/* ─── SWOOPING ARC - REMOVED ─── */}
          {/* <svg ... > ... </svg> */}

          <div
            style={{
              flex: "0 0 42%",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.38)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.42)",
                }}
              >
                About Us
              </span>
            </div>

            <h1 style={{ margin: 0, lineHeight: 1.05 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(36px, 5vw, 58px)",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                Building
              </span>
              <span style={{ display: "block" }}>
                <span
                  style={{
                    fontSize: "clamp(36px, 5vw, 58px)",
                    fontWeight: 800,
                    color: "#f5a623",
                  }}
                >
                  Digital{" "}
                </span>
                <span
                  style={{
                    fontSize: "clamp(36px, 5vw, 58px)",
                    fontWeight: 800,
                    color: "#4da6ff",
                  }}
                >
                  Futures
                </span>
              </span>
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "18px 0 26px",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "rgba(255,255,255,0.28)",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "3.5px",
                  color: "rgba(255,255,255,0.42)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Since 2021
              </span>
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "rgba(255,255,255,0.28)",
                }}
              />
            </div>

            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.58)",
                maxWidth: 380,
                margin: "0 0 40px",
              }}
            >
              We empower institutions to manage and showcase student portfolios —{" "}
              <span
                style={{
                  color: "#f5a623",
                  fontWeight: 600,
                  fontStyle: "italic",
                }}
              >
                simply, securely and efficiently.
              </span>
            </p>

            <div
              style={{
                display: "flex",
                gap: 36,
                marginBottom: 40,
              }}
            >
              <StatItem
                icon={<InstitutionIcon />}
                number="500+"
                numberColor="#f5a623"
                label={["Institutions", "Trust Us"]}
              />
              <StatItem
                icon={<PeopleIcon />}
                number="1M+"
                numberColor="#f5a623"
                label={["Students", "Impacted"]}
              />
              <StatItem
                icon={<GlobeIcon color="#a264ff" />}
                number="20+"
                numberColor="#a264ff"
                label={["Countries", "Reached"]}
              />
            </div>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                Explore Our Solutions
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          </div>

          <div
            style={{
              flex: 1,
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <OrbitalDiagram />
          </div>
        </section>

        {/* ─── PURPOSE SECTION (Mission & Vision) ─── */}
        <PurposeSection />

        {/* ─── Journey Section ─── */}
        <JourneySection />

        {/* ─── Partner Section ─── */}
        <PartnerSection onPartnerSubmit={(data) => {
          console.log('New partner application:', data);
        }} />

        {/* ─── Team Slider ─── */}
        <section ref={teamRef} className="py-12 md:py-16 overflow-hidden" style={{ background: "#0B0F19" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
                style={{
                  backgroundColor: 'rgba(31, 67, 129, 0.2)',
                  border: 'none',
                }}
              >
                <Users className="w-3.5 h-3.5" style={{ color: '#E8CA5E' }} />
                <span className="text-xs font-medium tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Poppins', sans-serif" }}>
                  Our Team
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-serif tracking-tight" style={{ color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                Meet Our{' '}
                <span className="inline-block" style={{ color: '#E8CA5E' }}>
                  Leadership
                </span>
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Calibri Light', sans-serif" }}>
                The passionate team driving innovation at Portfolio Handler
              </p>
            </motion.div>

            <div className="relative w-full overflow-hidden">
              <motion.div 
                className="relative w-full"
                style={{ x: sliderX }}
              >
                <div className="flex gap-6 md:gap-8 lg:gap-10 items-stretch py-4 w-max">
                  {duplicatedTeam.map((member, index) => (
                    <div
                      key={`${member.id}-${index}`}
                      className="flex-shrink-0 group w-[180px] md:w-[200px] lg:w-[220px]"
                    >
                      <div className="flex flex-col items-center transition-all duration-300">
                        <div className="relative mb-3">
                          <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
                          <div 
                            className={`relative w-20 h-18 hover:cursor-pointer md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#6366F1]/20 overflow-hidden`}
                            style={{
                              backgroundColor: member.avatarColor,
                              borderColor: 'rgba(255,255,255,0.2)',
                            }}
                          >
                            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {member.initials}
                            </span>
                          </div>
                          
                          <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium whitespace-nowrap transition-all duration-300 group-hover:scale-105`}
                            style={{
                              backgroundColor: '#1F4381',
                              color: '#FFFFFF',
                              opacity: 0.95,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {member.role}
                          </div>
                        </div>
                        
                        <span className={`text-sm md:text-base font-semibold tracking-wide text-[#E2E8F0] group-hover:text-[#6366F1] transition-colors duration-300 text-center`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {member.name}
                        </span>
                        
                        <div className="w-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] group-hover:w-12 transition-all duration-300 mt-1 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Contact Section ─── */}
        <section ref={contactRef} className="py-12 md:py-16" style={{ background: "#0B0F19" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={contactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 mx-auto w-fit"
                style={{
                  backgroundColor: 'rgba(31, 67, 129, 0.2)',
                  border: 'none',
                }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: '#E8CA5E' }} />
                <span className="text-xs font-medium tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Poppins', sans-serif" }}>
                  Get In Touch
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-serif tracking-tight" style={{ color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                Let's{' '}
                <span className="inline-block" style={{ color: '#E8CA5E' }}>
                  Connect
                </span>
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Calibri Light', sans-serif" }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={contactInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 md:p-8"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif tracking-tight" style={{ color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#E8CA5E' }} />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(31, 67, 129, 0.2)' }}>
                        <item.icon className="w-5 h-5" style={{ color: '#E8CA5E' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-medium mb-0.5 tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Poppins', sans-serif" }}>
                          {item.label}
                        </h3>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-semibold hover:underline transition-colors block" style={{ color: '#E8CA5E', fontFamily: "'Poppins', sans-serif" }}>
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold" style={{ color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                            {item.value}
                          </p>
                        )}
                        <p className="text-xs mt-1 font-light" style={{ color: '#9CA3AF', fontFamily: "'Calibri Light', sans-serif" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={contactInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 md:p-8"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif tracking-tight" style={{ color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
                  <Mail className="w-5 h-5" style={{ color: '#E8CA5E' }} />
                  Send us a Message
                </h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Poppins', sans-serif" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors placeholder:text-gray-500"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.5)',
                        borderColor: 'rgba(30, 41, 59, 0.3)',
                        borderWidth: '1px',
                        color: '#FFFFFF',
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Poppins', sans-serif" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactFormData.email}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors placeholder:text-gray-500"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.5)',
                        borderColor: 'rgba(30, 41, 59, 0.3)',
                        borderWidth: '1px',
                        color: '#FFFFFF',
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Poppins', sans-serif" }}>
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={contactFormData.subject}
                      onChange={handleContactInputChange}
                      required
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.5)',
                        borderColor: 'rgba(30, 41, 59, 0.3)',
                        borderWidth: '1px',
                        color: '#FFFFFF',
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership Opportunity</option>
                      <option value="Demo Request">Demo Request</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: '#9CA3AF', fontFamily: "'Poppins', sans-serif" }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={contactFormData.message}
                      onChange={handleContactInputChange}
                      required
                      rows={4}
                      placeholder="Tell us about your inquiry..."
                      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors resize-none placeholder:text-gray-500"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.5)',
                        borderColor: 'rgba(30, 41, 59, 0.3)',
                        borderWidth: '1px',
                        color: '#FFFFFF',
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#E8CA5E',
                      color: '#1F4381',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1F4381' }}>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <p className="text-green-400 text-xs" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                        Thank you! We'll get back to you soon.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <p className="text-red-400 text-xs" style={{ fontFamily: "'Calibri Light', sans-serif" }}>
                        Failed to send. Please try again.
                      </p>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}