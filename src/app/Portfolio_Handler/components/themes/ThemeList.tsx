/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, Eye, ExternalLink, Trash2, Sparkles, Tag, Calendar, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
}

export default function ThemeList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/templates');
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.templates);
      } else {
        setError(data.message || 'Failed to load templates');
      }
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      setError(err.message || 'Error loading templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setTemplates(prev => prev.filter(template => template.id !== id));
      } else {
        alert('Failed to delete template: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error deleting template');
    }
  };

  const openPreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  if (loading && templates.length === 0) {
    return (
      <div className="bg-[#0F172A] rounded-2xl shadow-xl border border-[#1E293B] overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FFD700]/70 to-transparent" />
          <div className="p-6 border-b border-[#1E293B]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Uploaded Templates
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage your template collection
                  </p>
                </div>
              </div>
              <button
                onClick={fetchTemplates}
                className="p-2 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/50 transition-all duration-300"
              >
                <RefreshCcw size={18} className="animate-spin" />
              </button>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-3 border-[#1E293B] border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (templates.length === 0 && !loading) {
    return (
      <div className="bg-[#0F172A] rounded-2xl shadow-xl border border-[#1E293B] overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FFD700]/70 to-transparent" />
          <div className="p-6 border-b border-[#1E293B]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Uploaded Templates
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage your template collection
                  </p>
                </div>
              </div>
              <button
                onClick={fetchTemplates}
                className="p-2 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/50 transition-all duration-300"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-3 text-sm">⚠️ {error}</div>
            <button
              onClick={fetchTemplates}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black rounded-xl font-semibold text-sm shadow-lg shadow-[#FFD700]/30 hover:shadow-xl transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#0B0F19] border border-[#1E293B] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm mb-2">
              No templates uploaded yet
            </p>
            <p className="text-xs text-gray-600">
              Upload your first template using the form above
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0F172A] rounded-2xl shadow-xl border border-[#1E293B] overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FFD700]/70 to-transparent" />
          <div className="p-6 border-b border-[#1E293B]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFD700]/70 flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Uploaded Templates
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {templates.length} template{templates.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              <button
                onClick={fetchTemplates}
                disabled={loading}
                className="p-2 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/50 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-[#0B0F19] rounded-xl border border-[#1E293B] overflow-hidden hover:border-[#FFD700]/50 hover:shadow-xl hover:shadow-[#FFD700]/10 transition-all duration-300"
              >
                {/* Type Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                    template.type === 'paid' 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30' 
                      : 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/30'
                  }`}>
                    {template.type === 'paid' ? '💎 Paid' : '🆓 Free'}
                  </span>
                </div>

                {/* Template Image */}
                <div className="relative h-48 bg-[#0F172A] overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%230F172A"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%236B7280" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-white mb-1 line-clamp-1">
                    {template.name}
                  </h3>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[32px]">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                    <Calendar size={12} />
                    <span>{new Date(template.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openPreview(template)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black text-xs font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <Eye size={12} />
                      Preview
                    </button>

                    {template.live_url && (
                      <a
                        href={template.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#1E293B] text-gray-400 text-xs font-semibold hover:border-[#FFD700]/50 hover:text-[#FFD700] hover:scale-105 transition-all duration-300"
                      >
                        <ExternalLink size={12} />
                        Live Demo
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(template.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 hover:scale-105 transition-all duration-300"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={closePreview}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-[#0F172A] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#1E293B]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#0F172A] border-b border-[#1E293B] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{previewTemplate.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{previewTemplate.type === 'paid' ? 'Paid Template' : 'Free Template'}</p>
                  </div>
                  <button
                    onClick={closePreview}
                    className="p-2 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-gray-400 hover:text-white hover:border-[#FFD700]/50 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="rounded-xl overflow-hidden border border-[#1E293B] mb-4">
                  <img
                    src={previewTemplate.image}
                    alt={previewTemplate.name}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Description</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{previewTemplate.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Type</h4>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
                      previewTemplate.type === 'paid' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {previewTemplate.type === 'paid' ? '💎 Paid' : '🆓 Free'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Uploaded</h4>
                    <p className="text-sm text-gray-300">{new Date(previewTemplate.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {previewTemplate.live_url && (
                  <div className="mt-6 pt-4 border-t border-[#1E293B]">
                    <a
                      href={previewTemplate.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black rounded-xl font-semibold text-sm shadow-lg shadow-[#FFD700]/30 hover:shadow-xl transition-all duration-300"
                    >
                      <ExternalLink size={16} />
                      View Live Demo
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}