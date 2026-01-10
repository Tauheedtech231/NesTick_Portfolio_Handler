'use client';



interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
}


export default function HeroSection({ scrollToSection, heroRef }: HeroSectionProps) {
  return (
    <section
      id="home"
      ref={heroRef}
      className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6
                 bg-gradient-to-br from-gray-50 via-white to-gray-100
                 dark:from-black dark:via-black dark:to-black
                 relative overflow-hidden transition-colors duration-700"
    >
      {/* --- Upward Curved Line Background --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <defs>
            <linearGradient id="lineColor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          {/* First Upward Curved Line */}
          <path
            d="M0 700 C300 550 600 750 900 600 C1200 450 1500 650 1800 500"
            fill="none"
            stroke="url(#lineColor)"
            strokeWidth="1.5"
            opacity="0.45"
          />
          {/* Second Upward Curved Line */}
          <path
            d="M0 600 C300 450 600 650 900 500 C1200 350 1500 550 1800 400"
            fill="none"
            stroke="url(#lineColor)"
            strokeWidth="1.2"
            opacity="0.35"
          />
          {/* Third Upward Curved Line */}
          <path
            d="M0 500 C300 350 600 550 900 400 C1200 250 1500 450 1800 300"
            fill="none"
            stroke="url(#lineColor)"
            strokeWidth="1"
            opacity="0.28"
          />
          {/* Fourth Upward Curved Line */}
          <path
            d="M0 400 C300 250 600 450 900 300 C1200 150 1500 350 1800 200"
            fill="none"
            stroke="url(#lineColor)"
            strokeWidth="0.8"
            opacity="0.22"
          />
        </svg>
      </div>

      {/* --- Existing Blobs --- */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gray-300 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* --- Main Content --- */}
      <div className="container mx-auto max-w-6xl text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 leading-tight">
          Simplify College Portfolios{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-size-200 animate-gradient">
            One Unified Platform
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed font-light">
          Manage events, templates, and profiles effortlessly in one place. Built for modern educational institutions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
          <button
            onClick={() => scrollToSection("templates")}
            className="w-full sm:w-auto bg-gray-900 text-white dark:bg-white dark:text-black
                       px-8 py-4 md:px-10 md:py-5 rounded-2xl font-semibold text-lg md:text-xl
                       transition-all duration-500 ease-in-out transform hover:scale-105
                       shadow-2xl hover:shadow-gray-400/40 dark:hover:shadow-gray-600/60
                       relative overflow-hidden"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}