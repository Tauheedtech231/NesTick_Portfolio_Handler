'use client';

import { MainLayout } from '../components/layout/main-layout';
import ThemeUploadForm from '../components/themes/ThemeUploadForm';
import ThemeList from '../components/themes/ThemeList';
import { Sparkles } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0B0F19] py-4 sm:py-6 lg:py-8">
        {/* No padding on outer container */}
        
        {/* Header - Centered with some padding */}
        <div className="text-center mb-6 lg:mb-8 px-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 backdrop-blur-sm mb-3">
            <Sparkles className="w-3 h-3 text-[#FFD700]" />
            <span className="text-[10px] font-medium text-gray-300">Templates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Portfolio Templates
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
            Upload and manage reusable portfolio templates for colleges. All templates are stored and managed securely.
          </p>
        </div>

        {/* Upload Form - Full width with centered content */}
        <div className="mb-6 lg:mb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <ThemeUploadForm />
          </div>
        </div>

        {/* Template List - Full width no side gaps */}
        <div>
          <div className="px-4 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              Available Templates
            </h2>
            <p className="text-xs text-gray-400">
              Browse and manage all your uploaded templates
            </p>
          </div>
          <ThemeList />
        </div>
      </div>
    </MainLayout>
  );
}