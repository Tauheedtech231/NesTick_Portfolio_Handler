'use client';

import { Eye, ExternalLink, Sparkles, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  // Show only 3 cards initially, then more on View More
  const displayedTemplates = showAll ? templates : templates.slice(0, 3);

  const handleViewMore = () => {
    router.push('/templates');
  };

  // Animation variants
  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants:Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 12,
        duration: 0.5,
      },
    },
  };

  const headerVariants:Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  return (
    <section
      id="templates"
      className="py-20 md:py-28 px-4 sm:px-6 bg-[#0B0F19] relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[#1D4ED8]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#38BDF8]/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header - Left aligned with slide animation */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 md:mb-16 text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-sm font-medium text-gray-300">
              🎨 Ready-to-Use Portfolio Templates
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Beautiful{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8]">
              Portfolio Templates
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
            {templates.length > 0
              ? "Professionally designed templates for every academic discipline"
              : loadingTemplates ? "Loading templates..." : "No templates uploaded yet. Upload templates from the admin panel to see them here."}
          </p>
        </motion.div>

        {loadingTemplates ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#1D4ED8]/20 border-t-[#1D4ED8] rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#38BDF8] animate-pulse" />
              </div>
            </div>
          </div>
        ) : templates.length > 0 ? (
          <>
            {/* Templates Grid - Max 3 cards per row */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {displayedTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  ref={el => addToRefs(el, templateCardsRef)}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#38BDF8]/50 hover:shadow-2xl hover:shadow-[#1D4ED8]/10 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="h-48 relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10" />
                    <Image
                      src={template.image}
                      alt={template.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 z-20">
                      <span className="text-xs font-semibold text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                        Portfolio Template
                      </span>
                      <span
                        className={`text-xs font-semibold text-white px-2 py-1 rounded-full backdrop-blur-sm ${
                          template.type === 'free' 
                            ? 'bg-green-500/80 border border-green-400/30' 
                            : 'bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] border border-[#38BDF8]/30'
                        }`}
                      >
                        {template.type === 'free' ? 'Free' : 'Premium'}
                      </span>
                    </div>
                    
                    {/* Preview Overlay */}
                    <button
                      onClick={() => handlePreviewClick(template.image, template.name, template.description, template.live_url)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center"
                    >
                      <div className="bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white px-5 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg">
                        <Eye size={14} />
                        Quick Preview
                      </div>
                    </button>
                  </div>

                  {/* Content area */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#38BDF8] transition-colors duration-300">
                      {template.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Button container */}
                    <div className="mt-auto pt-3">
                      <button
                        onClick={() => handleBuyNowClick(template)}
                        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                          template.type === 'free'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40'
                            : 'bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white shadow-lg shadow-[#1D4ED8]/20 hover:shadow-[#1D4ED8]/40'
                        }`}
                      >
                        {template.type === 'free' ? (
                          <>
                            <Sparkles size={14} />
                            Use Template Free
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            Use Premium Template
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Glow Line */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              ))}
            </motion.div>

            {/* View More Button - Redirects to /templates */}
            {!showAll && templates.length > 3 && (
              <div className="flex justify-center mt-12">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleViewMore}
                  className="group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1D4ED8]/30 transition-all duration-300 hover:scale-105"
                >
                  <span>View More Templates</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Placeholder templates */}
            {[
              {
                id: 1,
                name: "Modern Professional",
                description: "Clean, corporate design perfect for business and engineering portfolios.",
                image: "/port1.jpg",
                type: 'free' as const,
                live_url: null
              },
              {
                id: 2,
                name: "Creative Arts",
                description: "Vibrant and expressive layout for art, design, and media students.",
                image: "/port2.jpg",
                type: 'paid' as const,
                live_url: null
              },
              {
                id: 3,
                name: "Academic Classic",
                description: "Traditional layout with modern elements for research and academic portfolios.",
                image: "/port3.jpg",
                type: 'free' as const,
                live_url: null
              },
            ].map((template) => (
              <div
                key={template.id}
                className="group bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden transition-all duration-500 opacity-60 flex flex-col h-full"
              >
                <div className="h-48 relative overflow-hidden bg-[#1E293B] flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500">No Preview Available</span>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs font-semibold text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      Portfolio Template
                    </span>
                    <span
                      className={`text-xs font-semibold text-white px-2 py-1 rounded-full backdrop-blur-sm ${
                        template.type === 'free' 
                          ? 'bg-green-500/80' 
                          : 'bg-gradient-to-r from-[#1D4ED8] to-[#38BDF8]'
                      }`}
                    >
                      {template.type === 'free' ? 'Free' : 'Premium'}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="mt-auto pt-3">
                    <div className="text-center py-3">
                      <p className="text-xs text-gray-500">
                        Upload templates in admin panel to enable
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}