
'use client';

import { MainLayout } from '../components/layout/main-layout';
import ThemeUploadForm from '../components/themes/ThemeUploadForm';
import ThemeList from '../components/themes/ThemeList';

export default function TemplatesPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                Portfolio Templates
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Upload and manage reusable portfolio templates for colleges. All templates are stored and managed securely.
              </p>
            </div>

            {/* Upload Form + List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Form */}
              <div className="lg:col-span-1">
                <ThemeUploadForm />
              </div>

              {/* Template List */}
              <div className="lg:col-span-2">
                <ThemeList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
