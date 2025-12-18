/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, Eye, ExternalLink, Trash2 } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string;
  image: string; // base64 image or URL
  live_url: string | null;
  type: 'free' | 'paid';
  created_at: string;
}

export default function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        // Remove the template from the list
        setTemplates(prev => prev.filter(template => template.id !== id));
      } else {
        alert('Failed to delete template: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error deleting template');
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Uploaded Templates
          </h2>
          <button
            onClick={fetchTemplates}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Refresh Templates"
          >
            <RefreshCcw size={20} className="text-gray-600 dark:text-gray-300 animate-spin" />
          </button>
        </div>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (templates.length === 0 && !loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Uploaded Templates
          </h2>
          <button
            onClick={fetchTemplates}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Refresh Templates"
          >
            <RefreshCcw size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">⚠️ {error}</div>
            <button
              onClick={fetchTemplates}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              No templates uploaded yet.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Upload your first template using the upload form.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-black dark:text-white">
          Uploaded Templates ({templates.length})
        </h2>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-sm text-red-500 mr-2">{error}</span>
          )}
          <button
            onClick={fetchTemplates}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
            title="Refresh Templates"
          >
            <RefreshCcw
              size={20}
              className={`${loading ? 'animate-spin text-blue-500' : 'text-gray-600 dark:text-gray-300'}`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 flex flex-col"
          >
            {/* Type Badge */}
            <div className="absolute top-2 left-2 z-10">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                template.type === 'paid' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {template.type === 'paid' ? '💎 Paid' : '🆓 Free'}
              </span>
            </div>

            {/* Template Image */}
            <div className="relative h-40 sm:h-48 bg-gray-100 dark:bg-gray-700">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                }}
              />
            </div>

            <div className="p-3 flex flex-col flex-1">
              <h3 className="text-base font-semibold text-black dark:text-white mb-1 truncate">
                {template.name}
              </h3>

              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
                {template.description}
              </p>

              <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                Uploaded: {new Date(template.created_at).toLocaleDateString()}
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                <button
                  onClick={() => {
                    // Open modal or new page for preview
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                    modal.innerHTML = `
                      <div class="relative bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <h3 class="text-lg font-semibold">${template.name}</h3>
                          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">✕</button>
                        </div>
                        <div class="p-4">
                          <img src="${template.image}" alt="${template.name}" class="w-full rounded-lg mb-4" />
                          <p class="text-gray-600 dark:text-gray-300">${template.description}</p>
                        </div>
                      </div>
                    `;
                    document.body.appendChild(modal);
                    modal.onclick = (e) => {
                      if (e.target === modal) {
                        document.body.removeChild(modal);
                      }
                    };
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black py-2 px-3 rounded-lg text-xs font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <Eye size={14} />
                  Preview
                </button>

                {template.live_url && (
                  <a
                    href={template.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-black dark:border-white text-black dark:text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}

                <button
                  onClick={() => handleDelete(template.id)}
                  className="flex-1 flex items-center justify-center gap-2 border border-red-600 text-red-600 dark:text-red-400 dark:border-red-400 py-2 px-3 rounded-lg text-xs font-semibold shadow-sm hover:bg-red-50 dark:hover:bg-red-900 hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}