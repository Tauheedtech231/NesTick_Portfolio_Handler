'use client';

import { Eye, Sparkles, ChevronRight, Info, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const router = useRouter();

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

  const handleDetailsClick = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
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

  // Animation variants
  const containerVariants :Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants:Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
  };

  const headerVariants:Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants:Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const modalVariants:Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        id="templates"
        className="py-12 md:py-16 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#0B0F19' : '#F5F5F5',
        }}
      >
        {/* Simple background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              backgroundColor: theme === 'dark' ? '#1F4381' : '#E8CA5E',
            }}
          />
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              backgroundColor: theme === 'dark' ? '#00E0FF' : '#1F4381',
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Section Header */}
          <motion.div 
            variants={headerVariants}
            className="mb-10 md:mb-12 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto md:mx-0 w-fit"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(31, 67, 129, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.3)' : 'rgba(232, 202, 94, 0.5)',
                borderWidth: '1px',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E0FF]" />
              <span className="text-xs font-medium"
                style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}
              >
                ✨ Ready-to-Use Portfolio Templates
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 font-serif tracking-tight">
              <span className="relative inline-block"
                style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}
              >
                Beautiful
              </span>{' '}
              <span className="bg-gradient-to-r from-[#E8CA5E] via-[#F5D76E] to-[#A57F2A] bg-clip-text text-transparent inline-block">
                Portfolio Templates
              </span>
            </h2>
            
            <p className="text-sm md:text-base max-w-2xl mx-auto md:mx-0 leading-relaxed"
              style={{ color: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
            >
              {templates.length > 0
                ? "Professionally designed templates for every academic discipline"
                : loadingTemplates ? "Loading templates..." : "No templates uploaded yet."}
            </p>
          </motion.div>

          {loadingTemplates ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-2 border-[#E8CA5E]/20 border-t-[#E8CA5E] rounded-full animate-spin" />
            </div>
          ) : templates.length > 0 ? (
            <>
              {/* Templates Grid */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
              >
                {displayedTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    ref={el => addToRefs(el, templateCardsRef)}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group rounded-xl overflow-hidden flex flex-col h-full cursor-pointer"
                    style={{
                      backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                      borderWidth: '1px',
                      boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Image Container */}
                    <div className="h-44 relative overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                      <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Image
                          src={template.image}
                          alt={template.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                          }}
                        />
                      </motion.div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                        <span className="text-[10px] font-medium text-white/90 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                          Template
                        </span>
                        <span className={`text-[10px] font-medium text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm ${
                          template.type === 'free' 
                            ? 'bg-green-500/80' 
                            : 'bg-gradient-to-r from-[#1F4381] to-[#00E0FF]'
                        }`}>
                          {template.type === 'free' ? 'Free' : 'Premium'}
                        </span>
                      </div>
                      
                      {/* Preview Overlay */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        onClick={() => handlePreviewClick(template.image, template.name, template.description, template.live_url)}
                        className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center cursor-pointer"
                      >
                        <div className="bg-[#E8CA5E] text-[#1F4381] px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5">
                          <Eye size={12} />
                          Preview
                        </div>
                      </motion.button>
                    </div>

                    {/* Content area */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-base font-bold mb-1.5 transition-colors duration-300"
                        style={{ 
                          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                        }}
                      >
                        {template.name}
                      </h3>
                      
                      <p className="text-xs leading-relaxed mb-3 line-clamp-2"
                        style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      >
                        {template.description}
                      </p>

                      {/* Buttons */}
                      <div className="mt-auto pt-2 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDetailsClick(template)}
                          className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                            borderWidth: '1px',
                            color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                          }}
                        >
                          <Info size={12} />
                          Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleBuyNowClick(template)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                            template.type === 'free'
                              ? 'bg-green-500 text-white'
                              : 'bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381]'
                          }`}
                        >
                          <Sparkles size={12} />
                          {template.type === 'free' ? 'Use Free' : 'Buy Now'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* View More Button */}
              {!showAll && templates.length > 3 && (
                <div className="flex justify-center mt-10">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleViewMore}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] font-medium rounded-lg cursor-pointer"
                  >
                    <span>View More Templates</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.div>
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                { id: 1, name: "Modern Professional", description: "Clean, corporate design for business portfolios.", type: 'free' },
                { id: 2, name: "Creative Arts", description: "Vibrant layout for art and design students.", type: 'paid' },
                { id: 3, name: "Academic Classic", description: "Traditional layout for research portfolios.", type: 'free' },
              ].map((template) => (
                <div
                  key={template.id}
                  className="rounded-xl overflow-hidden opacity-50 flex flex-col h-full"
                  style={{
                    backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                    borderWidth: '1px',
                  }}
                >
                  <div className="h-44 relative overflow-hidden bg-gray-700 flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Preview</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-500 mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-500">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              style={{
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#00E0FF' : '#E8CA5E',
                borderWidth: '1px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 p-4 border-b"
                style={{
                  backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                  borderColor: theme === 'dark' ? 'rgba(0,224,255,0.2)' : 'rgba(0,0,0,0.1)',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-black/10 transition-all duration-300 cursor-pointer"
                >
                  <X className="w-4 h-4" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
                </motion.button>
                <h3 className="text-lg font-bold pr-6" style={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2937' }}>
                  {selectedTemplate.name}
                </h3>
                <div className="flex gap-2 mt-1">
                  <span className={`text-[10px] font-medium text-white px-1.5 py-0.5 rounded-full ${
                    selectedTemplate.type === 'free' ? 'bg-green-500/80' : 'bg-gradient-to-r from-[#1F4381] to-[#00E0FF]'
                  }`}>
                    {selectedTemplate.type === 'free' ? 'Free' : 'Premium'}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4">
                {/* Template Image */}
                <motion.div 
                  className="relative h-40 rounded-lg overflow-hidden mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={selectedTemplate.image}
                    alt={selectedTemplate.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[#E8CA5E] mb-1">Description</h4>
                  <p className="text-sm" style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}>
                    {selectedTemplate.description}
                  </p>
                </div>

                {/* Key Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[#00E0FF] mb-2">Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getTemplateFeatures(selectedTemplate.name).slice(0, 6).map((feature, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-center gap-1.5 cursor-pointer"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className="w-3 h-3 text-[#E8CA5E]" />
                        <span className="text-xs" style={{ color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      closeModal();
                      handlePreviewClick(selectedTemplate.image, selectedTemplate.name, selectedTemplate.description, selectedTemplate.live_url);
                    }}
                    className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      borderWidth: '1px',
                      color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                    }}
                  >
                    <Eye size={14} />
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      closeModal();
                      handleBuyNowClick(selectedTemplate);
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedTemplate.type === 'free'
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381]'
                    }`}
                  >
                    <Sparkles size={14} />
                    {selectedTemplate.type === 'free' ? 'Use Free' : 'Buy Now'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}