'use client';

import { Eye, Sparkles, ChevronRight, Info, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInView } from 'react-intersection-observer';

interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
}

interface TemplatesSectionProps {
  templates: Template[];
  loadingTemplates: boolean;
  handlePreviewClick: (imageUrl: string, templateName: string, description: string, liveUrl?: string | null) => void;
  handleBuyNowClick: (template: Template) => void;
  addToRefs: (el: HTMLDivElement | null, refArray: React.MutableRefObject<HTMLDivElement[]>) => void;
  templateCardsRef: React.MutableRefObject<HTMLDivElement[]>;
}

export default function TemplatesSection({
  templates,
  loadingTemplates,
  handlePreviewClick,
  handleBuyNowClick,
  addToRefs,
  templateCardsRef
}: TemplatesSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const router = useRouter();
  
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

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

  const displayedTemplates = showAll ? templates : templates.slice(0, 3);

  const handleViewMore = () => {
    router.push('/templates');
  };

  // UPDATED: Redirect to details page
  const handleDetailsClick = (template: Template) => {
    // Store template data in sessionStorage
    const templateData = {
      id: template.id,
      name: template.name,
      type: template.type,
      image: template.image,
      description: template.description,
      live_url: template.live_url,
      created_at: template.created_at
    };
    
    sessionStorage.setItem('selectedTemplateDetails', JSON.stringify(templateData));
    
    // Redirect to /details/[id]
    window.location.href = `/details/${template.id}`;
  };

  const getTemplateFeatures = (templateName: string) => {
    const featuresMap: { [key: string]: string[] } = {
      "Modern Professional": [
        "Clean and corporate design",
        "Fully responsive layout",
        "SEO optimized structure",
        "Easy customization options",
        "Contact form integration",
        "Project showcase gallery"
      ],
      "Creative Arts": [
        "Vibrant visual design",
        "Portfolio grid layout",
        "Social media integration",
        "Blog section included",
        "Multi-color schemes"
      ],
      "Academic Classic": [
        "Research paper showcase",
        "Publication timeline",
        "Citation management",
        "CV/Resume section",
        "Conference listings",
        "Academic achievements"
      ]
    };

    const defaultFeatures = [
      "Modern responsive design",
      "Easy to customize",
      "Fast loading performance",
      "Cross-browser compatible",
      "Mobile-first approach",
      "Clean code structure"
    ];

    return featuresMap[templateName] || defaultFeatures;
  };

  // Theme-based colors for better contrast
  const isDark = theme === 'dark';
  const GOLD = '#E8CA5E';
  const BLUE = '#0066FF';
  const accentColor = isDark ? GOLD : BLUE;
  
  // CHANGED: Full Black in light mode, Full White in dark mode
  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const textMuted = isDark ? '#FFFFFF' : '#000000'; // CHANGED: White in dark, Black in light
  const textLight = isDark ? '#FFFFFF' : '#000000'; // CHANGED: White in dark, Black in light
  const borderColor = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF';
  const sectionBg = isDark ? '#0B0F19' : '#F8FAFF';
  const accentLight = isDark ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 102, 255, 0.08)';
  const shadowColor = isDark ? 'none' : '0 8px 32px rgba(0,0,0,0.06)';
  const cardShadow = isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)';

  return (
    <section
      id="templates"
      className="py-12 px-4 sm:px-6 relative"
      style={{
        backgroundColor: sectionBg,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header - Left se slide */}
        <div 
          ref={headerRef}
          className="mb-10 md:mb-12 text-center md:text-left overflow-hidden"
        >
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto md:mx-0 w-fit transition-all duration-1000 ease-out will-change-transform"
            style={{
              backgroundColor: accentLight,
              border: 'none',
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? 'translateX(0) scale(1)' : 'translateX(-120px) scale(0.8)',
              transitionDelay: '100ms',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="text-xs font-medium" style={{ 
              color: accentColor,
              fontFamily: "'Poppins', sans-serif",
            }}>
              ✨ Ready-to-Use Portfolio Templates
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 font-serif tracking-tight overflow-hidden">
            <span 
              className="relative inline-block transition-all duration-1000 ease-out will-change-transform"
              style={{ 
                color: textColor,
                opacity: headerInView ? 1 : 0,
                transform: headerInView ? 'translateX(0)' : 'translateX(-150px)',
                transitionDelay: '200ms',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Beautiful
            </span>{' '}
            <span 
              className="inline-block transition-all duration-1000 ease-out will-change-transform"
              style={{ 
                color: accentColor,
                opacity: headerInView ? 1 : 0,
                transform: headerInView ? 'translateX(0)' : 'translateX(-120px)',
                transitionDelay: '300ms',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Portfolio Templates
            </span>
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-2xl mx-auto md:mx-0 leading-relaxed font-light transition-all duration-1000 ease-out will-change-transform"
            style={{ 
              color: textMuted, // White in dark, Black in light
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? 'translateX(0)' : 'translateX(-100px)',
              transitionDelay: '400ms',
              fontFamily: "'Calibri Light', sans-serif",
            }}
          >
            {templates.length > 0
              ? "Professionally designed templates for every academic discipline"
              : loadingTemplates ? "Loading templates..." : "No templates uploaded yet."}
          </p>
        </div>

        {loadingTemplates ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{
                borderColor: isDark ? 'rgba(232, 202, 94, 0.2)' : 'rgba(0, 100, 255, 0.2)',
                borderTopColor: accentColor,
              }}
            />
          </div>
        ) : templates.length > 0 ? (
          <>
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayedTemplates.map((template, index) => (
                <div
                  key={template.id}
                  ref={el => addToRefs(el, templateCardsRef)}
                  className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{
                    backgroundColor: cardBg,
                    border: '1px solid',
                    borderColor: borderColor,
                    boxShadow: cardShadow,
                    cursor: 'default',
                  }}
                >
                  {/* Template Image - 16:9 Landscape */}
                  <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <Image
                        src={template.image}
                        alt={template.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                        }}
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                      <span className="text-[10px] font-medium text-white/90 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Template
                      </span>
                      <span className={`text-[10px] font-medium text-white px-2 py-0.5 rounded-full backdrop-blur-sm ${
                        template.type === 'free' 
                          ? 'bg-green-500/80' 
                          : (isDark ? 'bg-[#E8CA5E] text-[#1F4381]' : 'bg-[#0066FF] text-white')
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {template.type === 'free' ? 'Free' : 'Premium'}
                      </span>
                    </div>
                    
                    {/* Preview Overlay - Smooth hover */}
                    <button
                      onClick={() => handlePreviewClick(template.image, template.name, template.description, template.live_url)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 z-20 flex items-center justify-center transition-all duration-300 ease-in-out"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform transition-all duration-300 group-hover:scale-105"
                        style={{
                          backgroundColor: accentColor,
                          color: isDark ? '#1F4381' : '#FFFFFF',
                          fontFamily: "'Poppins', sans-serif",
                          cursor: 'pointer',
                          boxShadow: isDark ? '0 4px 20px rgba(232,202,94,0.3)' : '0 4px 20px rgba(0,102,255,0.25)',
                        }}
                      >
                        <Eye size={16} />
                        Preview
                      </div>
                    </button>
                  </div>

                  {/* Content area */}
                  <div className="p-6 md:p-8 relative z-10 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 transition-colors duration-300"
                      style={{ 
                        color: textColor,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {template.name}
                    </h3>
                    
                    {/* CHANGED: Full Black in light mode, Full White in dark mode */}
                    <p className="leading-relaxed text-base mb-4 line-clamp-2"
                      style={{ 
                        color: isDark ? '#FFFFFF' : '#000000', // Full White in dark, Full Black in light
                        fontFamily: "'Calibri Light', sans-serif",
                      }}
                    >
                      {template.description}
                    </p>

                    {/* Buttons - Fully Rounded with better styling */}
                    <div className="mt-auto pt-2 flex gap-2">
                      <button
                        onClick={() => handleDetailsClick(template)}
                        className="flex-1 py-2.5 px-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                          border: '1px solid',
                          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
                          color: isDark ? '#FFFFFF' : '#000000', // Full White in dark, Full Black in light
                          fontFamily: "'Poppins', sans-serif",
                          cursor: 'pointer',
                        }}
                      >
                        <Info size={14} />
                        Details
                      </button>
                      <button
                        onClick={() => handleBuyNowClick(template)}
                        className="flex-1 py-2.5 px-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: template.type === 'free'
                            ? '#22C55E'
                            : accentColor,
                          color: template.type === 'free'
                            ? '#FFFFFF'
                            : (isDark ? '#1F4381' : '#FFFFFF'),
                          fontFamily: "'Poppins', sans-serif",
                          cursor: 'pointer',
                          boxShadow: template.type === 'free'
                            ? 'none'
                            : (isDark ? '0 4px 16px rgba(232,202,94,0.25)' : '0 4px 16px rgba(0,102,255,0.2)'),
                        }}
                      >
                        <Sparkles size={14} />
                        {template.type === 'free' ? 'Use Free' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button - Fully Rounded with shadow */}
            {!showAll && templates.length > 3 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleViewMore}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: accentColor,
                    color: isDark ? '#1F4381' : '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif",
                    cursor: 'pointer',
                    boxShadow: isDark 
                      ? '0 4px 20px rgba(232,202,94,0.3)' 
                      : '0 4px 24px rgba(0,102,255,0.25)',
                  }}
                >
                  <span>View More Templates</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { id: 1, name: "Modern Professional", description: "Clean, corporate design for business portfolios.", type: 'free' },
              { id: 2, name: "Creative Arts", description: "Vibrant layout for art and design students.", type: 'paid' },
              { id: 3, name: "Academic Classic", description: "Traditional layout for research portfolios.", type: 'free' },
            ].map((template) => (
              <div
                key={template.id}
                className="rounded-2xl p-6 md:p-8 opacity-50 flex flex-col"
                style={{
                  backgroundColor: cardBg,
                  border: '1px solid',
                  borderColor: borderColor,
                }}
              >
                <div className="relative w-full rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Preview</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2"
                  style={{ 
                    color: isDark ? '#FFFFFF' : '#1F2937',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {template.name}
                </h3>
                <p className="text-base"
                  style={{ 
                    color: isDark ? '#FFFFFF' : '#000000', // Full White in dark, Full Black in light
                    fontFamily: "'Calibri Light', sans-serif",
                  }}
                >
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}