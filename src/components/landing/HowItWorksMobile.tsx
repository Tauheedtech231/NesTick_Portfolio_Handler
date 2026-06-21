"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Step {
  num: string;
  ttl: string;
  dsc: string;
  tag: string;
  details: string[];
}

const STEPS: Step[] = [
  {
    num: "01",
    ttl: "Template Selection",
    dsc: "Colleges browse through professional portfolio templates specifically designed for educational institutions, selecting the one that best fits their brand and requirements",
    tag: "",
    details: [],
  },
  {
    num: "02",
    ttl: "Admin Approval",
    dsc: "Main admin reviews the request and sends login credentials to college through email and college find the credentials in their inbox.",
    tag: "",
    details: ["Credentials generated", "Email sent to college"],
  },
  {
    num: "03",
    ttl: "College Login",
    dsc: "College logs in securely using the credentials provided by admin.",
    tag: "",
    details: ["Username & password", "Secure portal access", "Dashboard access"],
  },
  {
    num: "04",
    ttl: "Content Management",
    dsc: "College admin fills in their data — courses, faculty, gallery — and saves.",
    tag: "",
    details: ["Data entered", "Content saved"],
  },
  {
    num: "05",
    ttl: "Live Publication",
    dsc: "Portfolio goes live instantly. Real-time updates publish content to the world.",
    tag: "LIVE ✦",
    details: [],
  },
];

export default function HowItWorksMobile() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showPSM, setShowPSM] = useState(false);
  const [showCollege, setShowCollege] = useState(false);
  const [showCollegeActive, setShowCollegeActive] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDetails, setShowDetails] = useState<number[]>([]);
  const [showTag, setShowTag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDetails, setCurrentDetails] = useState<string[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const typeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  const colors = {
    bg: theme === "dark" ? "#0d1117" : "#F3F4F6",
    cardBg: theme === "dark" ? "#121926" : "#FFFFFF",
    cardBorder: theme === "dark" ? "#1f2937" : "rgba(0, 0, 0, 0.06)",
    text: theme === "dark" ? "#FFFFFF" : "#1F2937",
    textMuted: theme === "dark" ? "#9CA3AF" : "#6B7280",
    accent: theme === "dark" ? "#ffd700" : "#0066FF",
    accentLight: theme === "dark" ? "rgba(255, 215, 0, 0.15)" : "rgba(0, 102, 255, 0.08)",
    accentBorder: theme === "dark" ? "rgba(255, 215, 0, 0.4)" : "rgba(0, 102, 255, 0.2)",
    liveColor: "#10b981",
    liveBg: "rgba(16, 185, 129, 0.1)",
    liveBorder: "rgba(16, 185, 129, 0.3)",
    connectorColor: theme === "dark" ? "#4b5563" : "#D1D5DB",
  };

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    typeTimersRef.current.forEach(clearTimeout);
    typeTimersRef.current = [];
  }, []);

  const t = useCallback((fn: () => void, ms: number) => {
    timerRef.current.push(setTimeout(fn, ms));
  }, []);

  // Tree animation sequence - SLOWED DOWN
  const startTreeAnimation = useCallback(() => {
    clearTimers();
    
    // Reset states
    setCompletedSteps([]);
    setShowPSM(false);
    setShowCollege(false);
    setShowCollegeActive(false);
    setActiveStep(0);
    setTypedText("");
    setProgress(0);
    setIsTyping(false);
    setShowDetails([]);
    setShowTag(false);
    setCurrentDetails([]);

    // t=0: Show PSM
    t(() => {
      setShowPSM(true);
    }, 0);

    // t=600: Show College
    t(() => {
      setShowCollege(true);
    }, 600);

    // t=1000: Show College Active
    t(() => {
      setShowCollegeActive(true);
    }, 1000);

    // t=1400: Show Step 1
    t(() => {
      setActiveStep(0);
      setCompletedSteps([0]);
    }, 1400);

    // t=4000: Show Step 2 (2.6 sec gap from step 1)
    t(() => {
      setActiveStep(1);
      setCompletedSteps(prev => [...prev, 1]);
    }, 4000);

    // t=6600: Show Step 3 (2.6 sec gap from step 2)
    t(() => {
      setActiveStep(2);
      setCompletedSteps(prev => [...prev, 2]);
    }, 6600);

    // t=9200: Show Step 4 (2.6 sec gap from step 3)
    t(() => {
      setActiveStep(3);
      setCompletedSteps(prev => [...prev, 3]);
    }, 9200);

    // t=11800: Show Step 5 (2.6 sec gap from step 4)
    t(() => {
      setActiveStep(4);
      setCompletedSteps(prev => [...prev, 4]);
    }, 11800);

    // t=14000: Restart (2.2 sec after step 5 completes)
    t(() => {
      startTreeAnimation();
    }, 14000);
  }, [t, clearTimers]);

  // Start animation on mount
  useEffect(() => {
    startTreeAnimation();
    return () => {
      clearTimers();
    };
  }, [startTreeAnimation, clearTimers]);

  // Typing animation for current step - SLOWED DOWN
  useEffect(() => {
    const step = STEPS[activeStep];
    if (!step) return;

    setTypedText("");
    setProgress(0);
    setIsTyping(true);
    setShowDetails([]);
    setShowTag(false);
    setCurrentDetails(step.details);

    const fullText = step.dsc;
    let currentIndex = 0;
    const typingSpeed = 50; // Changed from 25 to 50 (slower typing)

    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        setProgress((currentIndex / fullText.length) * 100);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);

        if (step.details.length > 0) {
          step.details.forEach((_, idx) => {
            setTimeout(() => {
              setShowDetails(prev => [...prev, idx]);
            }, 400 + idx * 300);
          });
        }

        if (step.tag) {
          setTimeout(() => setShowTag(true), 600);
        }
      }
    }, typingSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [activeStep]);

  const currentStep = STEPS[activeStep];
  const isStepCompleted = (index: number) => completedSteps.includes(index);

  return (
    <div className="block md:hidden w-full px-4 py-8" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <header className="text-center mb-12 pt-4">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: colors.text }}>
          How It <span style={{ color: colors.accent }}>Works</span>
        </h1>
      </header>

      {/* Main Flow Container */}
      <div className="max-w-md mx-auto relative">
        {/* PSM Node */}
        <section className="flex flex-col items-center">
          <div
            className={`w-44 h-44 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-700 ${
              showPSM ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{
              borderColor: colors.accent,
              background: colors.cardBg,
              boxShadow: showPSM ? `0 0 30px ${colors.accent}22` : 'none',
            }}
          >
            <h2 className="text-4xl font-bold tracking-tight" style={{ color: colors.accent }}>
              PSM
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>System</p>
            <div
              className="w-2 h-2 rounded-full mt-4"
              style={{
                background: showPSM ? colors.accent : colors.textMuted,
                animation: showPSM ? "pulse-dot 1s ease-in-out infinite" : "none",
              }}
            />
          </div>
          {/* Connector Line */}
          <div
            className={`transition-all duration-700 ${
              showCollege ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              borderLeft: `2px dashed ${colors.connectorColor}`,
              height: '48px',
              margin: '0 auto',
              width: 0,
            }}
          />
        </section>

        {/* College Node */}
        <section className="flex flex-col items-center">
          <div
            className={`w-full max-w-[200px] p-6 rounded-xl flex flex-col items-center transition-all duration-700 ${
              showCollege ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{
              border: `1px solid ${showCollegeActive ? colors.accent : colors.accentBorder}`,
              background: colors.cardBg,
              boxShadow: showCollegeActive ? `0 0 30px ${colors.accent}22` : 'none',
            }}
          >
            <span className="text-2xl mb-2">🎓</span>
            <span 
              className="text-xs font-semibold tracking-wide"
              style={{ color: showCollegeActive ? colors.accent : colors.textMuted }}
            >
              College A
            </span>
            {showCollegeActive && (
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5"
                style={{
                  background: colors.accent,
                  animation: "pulse-dot 0.8s ease-in-out infinite",
                }}
              />
            )}
          </div>
          {/* Connector Line */}
          <div
            className={`transition-all duration-700 ${
              completedSteps.length > 0 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              borderLeft: `2px dashed ${colors.connectorColor}`,
              height: '48px',
              margin: '0 auto',
              width: 0,
            }}
          />
        </section>

        {/* Steps */}
        {STEPS.map((step, idx) => (
          <article key={idx} className="relative flex flex-col items-center">
            <div
              className={`w-full p-8 rounded-2xl text-center transition-all duration-700 ${
                isStepCompleted(idx) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{
                background: colors.cardBg,
                border: `1px solid ${
                  isStepCompleted(idx) && activeStep === idx ? colors.accent : colors.cardBorder
                }`,
                boxShadow: isStepCompleted(idx) && activeStep === idx ? `0 0 30px ${colors.accent}22` : 'none',
              }}
            >
              <span 
                className="text-base font-bold tracking-[0.1em] block mb-3"
                style={{ color: colors.accent }}
              >
                {step.num}
              </span>
              <h3 
                className="text-xl font-bold mb-4"
                style={{ color: colors.text }}
              >
                {step.ttl}
              </h3>
              <p 
                className="text-sm leading-relaxed mb-6"
                style={{ color: colors.textMuted }}
              >
                {activeStep === idx ? typedText : step.dsc}
                {activeStep === idx && isTyping && (
                  <span
                    className="inline-block w-0.5 h-3 ml-0.5 align-middle"
                    style={{
                      background: colors.accent,
                      animation: "blink-cursor 0.7s step-end infinite",
                    }}
                  />
                )}
              </p>

              {/* Details */}
              {step.details.length > 0 && (
                <div className="flex flex-col items-start max-w-[180px] mx-auto">
                  {step.details.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className={`flex items-center text-xs mb-2 transition-all duration-500 ${
                        activeStep === idx && showDetails.includes(dIdx)
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-2'
                      }`}
                      style={{ color: colors.textMuted }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mr-3"
                        style={{ background: colors.accent }}
                      />
                      {detail}
                    </div>
                  ))}
                </div>
              )}

              {/* Live Badge */}
              {step.tag && (
                <div className="flex justify-center mt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-500 ${
                      activeStep === idx && showTag
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90'
                    }`}
                    style={{
                      background: colors.liveBg,
                      color: colors.liveColor,
                      border: `1px solid ${colors.liveBorder}`,
                    }}
                  >
                    {step.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Connector Line (except last) */}
            {idx < STEPS.length - 1 && (
              <div
                className={`transition-all duration-700 ${
                  isStepCompleted(idx) && isStepCompleted(idx + 1) ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  borderLeft: `2px dashed ${colors.connectorColor}`,
                  height: '48px',
                  margin: '0 auto',
                  width: 0,
                }}
              />
            )}
          </article>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.6); opacity: 0.3; }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}