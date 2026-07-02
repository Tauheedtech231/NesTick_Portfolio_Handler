'use client';

import { motion, Variants } from 'framer-motion';
import { Eye, Info, Search, X, Filter, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
  featured?: boolean;
}

interface TemplatesGridProps {
  templates: Template[];
  loadingTemplates: boolean;
  theme: 'light' | 'dark';
  onPreviewClick: (imageUrl: string, templateName: string, description: string, liveUrl?: string | null) => void;
  onBuyNowClick: (template: Template) => void;
  onDetailsClick: (template: Template) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
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

export default function TemplatesGrid({
  templates,
  loadingTemplates,
  theme,
  onPreviewClick,
  onBuyNowClick,
  onDetailsClick,
}: TemplatesGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'free' | 'paid'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <section 
      id="templates-grid" 
      className="py-8 md:py-10 lg:py-12"
      style={{ 
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: theme === 'dark' ? 'transparent' : '#F8FAFF', // Subtle off-white for light mode
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - No left animation */}
        <div 
          ref={headerRef}
          className="mb-10 md:mb-12 text-center md:text-left"
        >
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 mx-auto md:mx-0 w-fit"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.15)' : 'rgba(0, 100, 255, 0.08)',
              border: 'none',
            }}
          >
            <Sparkles className="w-3.5 h-3.5"
              style={{ color: theme === 'dark' ? '#E8CA5E' : '#0066FF' }}
            />
            <span className="text-xs font-medium"
              style={{ 
                color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              ✨ All Available Templates
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 font-serif tracking-tight">
            <span 
              className="relative inline-block"
              style={{ 
                color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Explore Our
            </span>{' '}
            <span 
              className="inline-block"
              style={{ 
                color: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Template Collection
            </span>
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-2xl mx-auto md:mx-0 leading-relaxed font-light"
            style={{ 
              color: theme === 'dark' ? '#9CA3AF' : '#4B5563', // Darker for light mode
              fontFamily: "'Calibri Light', sans-serif",
            }}
          >
            {templates.length > 0
              ? "Browse through our complete collection of professionally designed templates"
              : loadingTemplates ? "Loading templates..." : "No templates uploaded yet."}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="relative flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer"
                  style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                />
                <input
                  type="text"
                  placeholder="Search templates by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none transition-colors duration-300 cursor-text"
                  style={{
                    backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                    borderWidth: '1px',
                    color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                    fontFamily: "'Calibri Light', sans-serif",
                    boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 cursor-pointer" style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                  borderWidth: '1px',
                  color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <Filter className="w-4 h-4 cursor-pointer" />
                <span className="text-sm hidden sm:inline cursor-pointer">Filter</span>
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="mt-3 p-2 rounded-xl flex gap-2"
              style={{
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
                borderWidth: '1px',
                boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <button
                onClick={() => setSelectedType('all')}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 tracking-wide cursor-pointer"
                style={{
                  backgroundColor: selectedType === 'all'
                    ? (theme === 'dark' ? '#E8CA5E' : '#0066FF')
                    : 'transparent',
                  color: selectedType === 'all'
                    ? (theme === 'dark' ? '#1F4381' : '#FFFFFF')
                    : (theme === 'dark' ? '#9CA3AF' : '#4B5563'),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                All Templates
              </button>
              <button
                onClick={() => setSelectedType('free')}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 tracking-wide cursor-pointer"
                style={{
                  backgroundColor: selectedType === 'free'
                    ? '#22C55E'
                    : 'transparent',
                  color: selectedType === 'free'
                    ? '#FFFFFF'
                    : (theme === 'dark' ? '#9CA3AF' : '#4B5563'),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Free
              </button>
              <button
                onClick={() => setSelectedType('paid')}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 tracking-wide cursor-pointer"
                style={{
                  backgroundColor: selectedType === 'paid'
                    ? (theme === 'dark' ? '#E8CA5E' : '#0066FF')
                    : 'transparent',
                  color: selectedType === 'paid'
                    ? (theme === 'dark' ? '#1F4381' : '#FFFFFF')
                    : (theme === 'dark' ? '#9CA3AF' : '#4B5563'),
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Premium
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-3">
            <p className="text-xs tracking-wide cursor-default"
              style={{ 
                color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} available
            </p>
          </div>
        </div>

        {loadingTemplates ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 rounded-full animate-spin cursor-wait"
              style={{
                borderColor: theme === 'dark' ? 'rgba(232, 202, 94, 0.2)' : 'rgba(0, 100, 255, 0.2)',
                borderTopColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
              }}
            />
          </div>
        ) : filteredTemplates.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(0, 0, 0, 0.06)',
                  boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* 🔥 Template Image - 16:9 Landscape with object-contain */}
                <div className="relative w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <Image
                      src={template.image}
                      alt={template.name}
                      fill
                      className="object-contain"  
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                      }}
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                    <span className="text-[10px] font-medium text-white/90 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full cursor-default"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Template
                    </span>
                    <span className={`text-[10px] font-medium text-white px-2 py-0.5 rounded-full backdrop-blur-sm cursor-default ${
                      template.type === 'free' 
                        ? 'bg-green-500/80' 
                        : (theme === 'dark' ? 'bg-[#E8CA5E] text-[#1F4381]' : 'bg-[#0066FF] text-white')
                    }`}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {template.type === 'free' ? 'Free' : 'Premium'}
                    </span>
                  </div>
                  
                  {/* Preview Overlay - Smooth hover */}
                  <button
                    onClick={() => onPreviewClick(template.image, template.name, template.description, template.live_url)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 z-20 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    <div className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transform transition-all duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: theme === 'dark' ? '#E8CA5E' : '#0066FF',
                        color: theme === 'dark' ? '#1F4381' : '#FFFFFF',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <Eye size={16} />
                      Preview
                    </div>
                  </button>
                </div>

                {/* Content area */}
                <div className="p-6 md:p-8 relative z-10 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300 cursor-default"
                    style={{ 
                      color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {template.name}
                  </h3>
                  
                  <p className="leading-relaxed text-base mb-4 line-clamp-2 cursor-default"
                    style={{ 
                      color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
                      fontFamily: "'Calibri Light', sans-serif",
                    }}
                  >
                    {template.description}
                  </p>

                  {/* Buttons */}
                  <div className="mt-auto pt-2 flex gap-2">
                    <button
                      onClick={() => onDetailsClick(template)}
                      className="flex-1 py-2 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                        border: '1px solid',
                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
                        color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <Info size={14} />
                      Details
                    </button>
                    <button
                      onClick={() => onBuyNowClick(template)}
                      className="flex-1 py-2 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: template.type === 'free'
                          ? '#22C55E'
                          : (theme === 'dark' ? '#E8CA5E' : '#0066FF'),
                        color: template.type === 'free'
                          ? '#FFFFFF'
                          : (theme === 'dark' ? '#1F4381' : '#FFFFFF'),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <Sparkles size={14} />
                      {template.type === 'free' ? 'Use Free' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center cursor-default"
              style={{
                backgroundColor: theme === 'dark' ? '#0F172A' : '#F5F5F5',
                border: '1px solid',
                borderColor: theme === 'dark' ? '#1E293B' : '#E5E7EB',
              }}
            >
              <Search className="w-6 h-6 cursor-default"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
              />
            </div>
            <h3 className="text-lg font-bold mb-1 font-serif tracking-tight cursor-default"
              style={{ 
                color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              No templates found
            </h3>
            <p className="text-sm font-light tracking-wide cursor-default"
              style={{ 
                color: theme === 'dark' ? '#9CA3AF' : '#4B5563',
                fontFamily: "'Calibri Light', sans-serif",
              }}
            >
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}