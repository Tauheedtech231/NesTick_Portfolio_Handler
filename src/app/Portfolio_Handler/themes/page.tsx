'use client';

import { MainLayout } from '../components/layout/main-layout';
import ThemeUploadForm from '../components/themes/ThemeUploadForm';
import ThemeList from '../components/themes/ThemeList';
import { Sparkles } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0B0F19] py-6 sm:py-8 lg:py-10">
        {/* No padding on outer container */}
        
        {/* Header - Centered with some padding */}
        <div className="text-center mb-8 lg:mb-12 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 backdrop-blur-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-xs font-medium text-gray-300">Templates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Portfolio Templates
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Upload and manage reusable portfolio templates for colleges. All templates are stored and managed securely.
          </p>
        </div>

        {/* Upload Form - Full width with centered content */}
        <div className="mb-8 lg:mb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <ThemeUploadForm />
          </div>
        </div>

        {/* Template List - Full width no side gaps */}
        <div>
          <div className="px-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Available Templates
            </h2>
            <p className="text-gray-400 text-sm">
              Browse and manage all your uploaded templates
            </p>
          </div>
          <ThemeList />
        </div>
      </div>
    </MainLayout>
  );
}