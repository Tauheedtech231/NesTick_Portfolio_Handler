'use client';

import { Eye, ExternalLink } from "lucide-react";
import Image from "next/image";

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
  handlePreviewClick: (imageUrl: string, templateName: string, description: string) => void;
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
  return (
    <section
      id="templates"
      className="py-20 md:py-28 px-4 sm:px-6 bg-white dark:bg-black relative overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Beautiful Portfolio Templates
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {templates.length > 0
              ? "Professionally designed templates for every academic discipline"
              : loadingTemplates ? "Loading templates..." : "No templates uploaded yet. Upload templates from the admin panel to see them here."}
          </p>
        </div>

        {loadingTemplates ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                ref={el => addToRefs(el, templateCardsRef)}
                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 flex flex-col h-full"
              >
                {/* Fixed height image container with Next.js Image */}
                <div className="h-48 relative overflow-hidden flex-shrink-0">
                  <Image
                    src={template.image}
                    alt={template.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback to placeholder on error
                      (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs font-semibold text-white/90 bg-black/30 px-2 py-1 rounded-full">
                      Portfolio Template
                    </span>
                    <span
                      className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${
                        template.type === 'free' ? 'bg-green-500/80' : 'bg-blue-500/80'
                      }`}
                    >
                      {template.type === 'free' ? 'Free' : 'Paid'}
                    </span>
                  </div>
                </div>

                {/* Content area - grows to fill available space */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {template.name}
                  </h3>
                  
                  {/* Description with line clamp (2-3 lines) */}
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">
                    {template.description}
                  </p>

                  {/* Button container - pushes to bottom with mt-auto */}
                  <div className="mt-auto pt-4">
                    <div className="flex flex-col gap-3">
                      {/* First row of buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handlePreviewClick(template.image, template.name, template.description)}
                          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          Preview
                        </button>
                        
                        <button
                          onClick={() => handleBuyNowClick(template)}
                          className="border border-gray-900 dark:border-white text-gray-900 dark:text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 flex items-center justify-center gap-2"
                        >
                          {template.type === 'free' ? 'Get Free' : 'Buy Now'}
                        </button>
                      </div>
                      
                      {/* Live Demo Button - Show only if live_url exists (second row) */}
                      {template.live_url && (
                        <a
                          href={template.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2 w-full"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Placeholder templates - same uniform height applied */}
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
                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 opacity-60 flex flex-col h-full"
              >
                <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No Preview Available</span>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs font-semibold text-white/90 bg-black/30 px-2 py-1 rounded-full">
                      Portfolio Template
                    </span>
                    <span
                      className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${
                        template.type === 'free' ? 'bg-green-500/80' : 'bg-blue-500/80'
                      }`}
                    >
                      {template.type === 'free' ? 'Free' : 'Paid'}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">
                    {template.description}
                  </p>
                  <div className="mt-auto pt-4">
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Upload templates in admin panel to enable purchasing
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