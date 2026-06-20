'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from 'react-intersection-observer';
import {
  Layout,
  Building2,
  Settings,
  Zap,
  Shield,
  BarChart3,
  LucideIcon,
} from "lucide-react";
import UniqueDiagram from "./UniqueDiagram";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  fill: string;
  stroke: string;
  tagBg: string;
  tagColor: string;
  tag: string;
  bar: string;
  shortLabel: string;
}

interface FeaturesSectionProps {
  featuresRef?: React.RefObject<HTMLDivElement | null>;
  addToRefs?: (
    el: HTMLDivElement | null,
    refArray: React.MutableRefObject<HTMLDivElement[]>
  ) => void;
  featureCardsRef?: React.MutableRefObject<HTMLDivElement[]>;
}

const features: Feature[] = [
  {
    title: "Ready-Made Portfolio Templates",
    description:
      "Professional templates for colleges with standard sections: Home, About, Services, Faculty, Gallery, Contact. Easily customizable for any educational institute.",
    icon: Layout,
    fill: "rgba(0, 102, 255, 0.15)",
    stroke: "#0066FF",
    tagBg: "rgba(0, 102, 255, 0.2)",
    tagColor: "#0066FF",
    tag: "Templates",
    bar: "#0066FF",
    shortLabel: "Portfolio",
  },
  {
    title: "Multi-Portal Architecture",
    description:
      "Three-tier system: Generic Portal for previews, Main Admin Portal for centralized control, and College Admin Portal for individual institution management.",
    icon: Building2,
    fill: "rgba(0, 102, 255, 0.15)",
    stroke: "#0066FF",
    tagBg: "rgba(0, 102, 255, 0.2)",
    tagColor: "#0066FF",
    tag: "Architecture",
    bar: "#0066FF",
    shortLabel: "Multiportal",
  },
  {
    title: "Centralized Management",
    description:
      "Add/edit/delete colleges, approve template requests, upload new templates, and manage sections per college from a single dashboard.",
    icon: Settings,
    fill: "rgba(0, 102, 255, 0.15)",
    stroke: "#0066FF",
    tagBg: "rgba(0, 102, 255, 0.2)",
    tagColor: "#0066FF",
    tag: "Core Hub",
    bar: "#0066FF",
    shortLabel: "Centraliz",
  },
  {
    title: "Real-Time Content Updates",
    description:
      "Changes made by college admins reflect instantly on live websites with live synchronization to the centralized database.",
    icon: Zap,
    fill: "rgba(0, 102, 255, 0.15)",
    stroke: "#0066FF",
    tagBg: "rgba(0, 102, 255, 0.2)",
    tagColor: "#0066FF",
    tag: "Live Sync",
    bar: "#0066FF",
    shortLabel: "Live Sync",
  },
  {
    title: "Role-Based Access Control",
    description:
      "Three-tier access: Generic users view templates, College admins manage their content, Main admin has full system control.",
    icon: Shield,
    fill: "rgba(0, 102, 255, 0.15)",
    stroke: "#0066FF",
    tagBg: "rgba(0, 102, 255, 0.2)",
    tagColor: "#0066FF",
    tag: "Security",
    bar: "#0066FF",
    shortLabel: "Access Ctrl",
  },
  {
    title: "Scalable Infrastructure",
    description:
      "Built to support multiple institutions simultaneously with independent workspaces and robust data management tools.",
    icon: BarChart3,
    fill: "rgba(0, 102, 255, 0.15)",
    stroke: "#0066FF",
    tagBg: "rgba(0, 102, 255, 0.2)",
    tagColor: "#0066FF",
    tag: "Scale",
    bar: "#0066FF",
    shortLabel: "Scalable",
  },
];

export default function FeaturesSection({
  featuresRef,
  addToRefs,
  featureCardsRef,
}: FeaturesSectionProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { ref: headingRef, inView: headingInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

  const { ref: pieRef, inView: pieInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    checkTheme();
    
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const getColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#0B0F19',
        heading: '#FFFFFF',
        subheading: '#9CA3AF',
        accent: '#E8CA5E',
      };
    } else {
      return {
        bg: '#FFFFFF',
        heading: '#1F2937',
        subheading: '#6B7280',
        accent: '#0066FF',
      };
    }
  };

  const colors = getColors();

  const startTyping = useCallback((text: string) => {
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    setTypedText("");
    setIsTyping(true);
    let pos = 0;
    typeTimerRef.current = setInterval(() => {
      pos++;
      setTypedText(text.slice(0, pos));
      if (pos >= text.length) {
        clearInterval(typeTimerRef.current!);
        setIsTyping(false);
      }
    }, 18);
  }, []);

  const handleEnter = useCallback(
    (idx: number) => {
      if (activeIdx === idx) return;
      setActiveIdx(idx);
      startTyping(features[idx].description);
    },
    [activeIdx, startTyping]
  );

  useEffect(() => {
    if (pieInView && isInitialLoad) {
      setIsInitialLoad(false);
      startTyping(features[0].description);
    }
  }, [pieInView, isInitialLoad, startTyping]);

  useEffect(() => {
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    };
  }, []);

  const progress =
    typedText.length > 0
      ? Math.round((typedText.length / features[activeIdx].description.length) * 100)
      : 0;

  return (
    <section
      ref={featuresRef}
      className="w-full py-16 px-4 overflow-hidden relative"
      style={{ backgroundColor: colors.bg }}
      aria-label="System features"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center mb-10"
          style={{
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? 'translateX(0)' : 'translateX(-150px)',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-4xl font-bold font-serif tracking-tight"
            style={{ color: colors.heading }}
          >
            Comprehensive <span style={{ color: colors.accent }}>System Features</span>
          </h2>
          <p
            className="text-sm md:text-base mt-2 font-light"
            style={{ color: colors.subheading }}
          >
            Hover over each feature to explore
          </p>
        </div>

        {/* Diagram Section */}
        <div
          ref={pieRef}
          className="relative w-full"
          style={{ 
            minHeight: 500,
            opacity: pieInView ? 1 : 0,
            transform: pieInView ? 'translateY(0)' : 'translateY(120px)',
            transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div className="relative flex items-center justify-center" style={{ minHeight: 500 }}>
            <div className="relative" style={{ width: '100%', maxWidth: '550px' }}>
              <UniqueDiagram
                features={features}
                activeIdx={activeIdx}
                onHover={handleEnter}
                theme={theme}
                typedText={typedText}
                isTyping={isTyping}
                progress={progress}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}