/* eslint-disable react/no-unescaped-entities */
// app/developer/submit-design/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Send, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  ArrowLeft,
  FileText,
  Figma,
  Code2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Assignment {
  id: number;
  design_id: number;
  design_title: string;
  design_description: string;
  design_preview_image: string;
  design_figma_url: string;
  designer_name: string;
  status: string;
}

export default function SubmitDesignPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assignmentId = searchParams.get('id');
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [whitePaper, setWhitePaper] = useState('');
  const [sourceCodeUrl, setSourceCodeUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getDeveloperId = () => {
    const auth = sessionStorage.getItem('developer_auth');
    if (!auth) return null;
    try {
      const parsed = JSON.parse(auth);
      return parsed?.user?.id ? parsed.user.id.toString() : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!assignmentId) {
      router.push('/developer/assigned-designs');
      return;
    }
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        router.push('/developer/assigned-designs');
        return;
      }

      const response = await fetch(`/api/developer/assignments?id=${assignmentId}&developerId=${developerId}`);
      const data = await response.json();
      if (data.success && data.data) {
        setAssignment(data.data);
      } else {
        router.push('/developer/assigned-designs');
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setPreviewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!liveUrl) {
      setError('Live Demo URL is required');
      return;
    }
    if (!whitePaper) {
      setError('Technical documentation / White paper is required');
      return;
    }
    if (whitePaper.length < 100) {
      setError('Please provide detailed technical documentation (minimum 100 characters)');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      let previewImageBase64 = '';
      if (previewImage) {
        previewImageBase64 = await fileToBase64(previewImage);
      }

      const developerId = getDeveloperId();

      const response = await fetch('/api/developer/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: parseInt(assignmentId!),
          liveUrl,
          whitePaper,
          sourceCodeUrl,
          previewImage: previewImageBase64,
          notes,
          developerId
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Design submitted successfully! Waiting for admin review.');
        setTimeout(() => {
          router.push('/developer/assigned-designs');
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit design');
      }
    } catch (error) {
      console.error('Error submitting design:', error);
      setError('Failed to submit design');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!assignment) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/developer/assigned-designs"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Submit Design</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Complete and submit your development work</p>
        </div>
      </div>

      {/* Design Details Card - Show Original Design Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Eye size={18} className="text-purple-500" />
            Original Design Details
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left - Preview Image */}
            <div>
              {assignment.design_preview_image ? (
                <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={assignment.design_preview_image}
                    alt={assignment.design_title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-64 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Right - Design Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{assignment.design_title}</h3>
                <p className="text-sm text-gray-500 mt-1">Designer: {assignment.designer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{assignment.design_description}</p>
              </div>
              {assignment.design_figma_url && (
                <a
                  href={assignment.design_figma_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
                >
                  <Figma size={16} />
                  View Figma Design
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            {/* Live Demo URL - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live Demo URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  required
                  placeholder="https://your-deployed-app.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Provide the URL where your built design is hosted</p>
            </div>

            {/* White Paper / Technical Documentation - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technical Documentation / White Paper <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <textarea
                  value={whitePaper}
                  onChange={(e) => setWhitePaper(e.target.value)}
                  required
                  rows={6}
                  placeholder="Describe your technical implementation, algorithms used, architecture decisions, challenges faced, and how you solved them..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Include: Technologies used, algorithms, data structures, performance optimizations, security measures, etc.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Minimum 100 characters. Currently: {whitePaper.length} characters
              </p>
            </div>

            {/* Source Code URL - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source Code URL (Optional)
              </label>
              <div className="relative">
                <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="url"
                  value={sourceCodeUrl}
                  onChange={(e) => setSourceCodeUrl(e.target.value)}
                  placeholder="https://github.com/yourusername/repository"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">GitHub/GitLab repository link (private repos can be shared separately)</p>
            </div>

            {/* Preview Image - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => document.getElementById('previewImage')?.click()}
              >
                <input
                  id="previewImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(null);
                        setPreviewUrl('');
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload preview image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any additional information for the admin about this submission..."
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              {submitting ? 'Submitting...' : 'Submit Design for Review'}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Submission Requirements</h3>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="font-medium text-purple-700 dark:text-purple-300 mb-2">📋 Required:</p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-xs list-disc list-inside">
                  <li>Working live demo URL</li>
                  <li>Technical documentation (min 100 chars)</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">💡 White Paper Should Include:</p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-xs list-disc list-inside">
                  <li>Technologies & frameworks used</li>
                  <li>Architecture decisions</li>
                  <li>Algorithms & logic implemented</li>
                  <li>Performance optimizations</li>
                  <li>Security considerations</li>
                  <li>Challenges faced & solutions</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-medium text-green-700 dark:text-green-300 mb-2">✅ After Submission:</p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-xs list-disc list-inside">
                  <li>Admin will review your work</li>
                  <li>You'll be notified of decision</li>
                  <li>May request changes if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}