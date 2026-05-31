/* eslint-disable react/no-unescaped-entities */
// app/developer/submit-design/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  ArrowLeft,
  Figma,
  Code2,
  X,
  Upload,
  Info,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Assignment {
  id: number;
  design_id: number;
  design_title: string;
  design_description: string;
  preview_image: string;
  figma_url: string;
  designer_name: string;
  status: string;
  white_paper?: string;
  white_paper_filename?: string;
  source_code_url?: string;
}

export default function SubmitDesignPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assignmentId = searchParams.get('id');
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
        const assignment = Array.isArray(data.data) ? data.data[0] : data.data;
        if (assignment) {
          setAssignment(assignment);
        } else {
          router.push('/developer/assigned-designs');
        }
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
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setPreviewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setPreviewUrl('');
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          previewImage: previewImageBase64,
          notes,
          developerId
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('✅ Design submitted successfully! Waiting for admin review.');
        setTimeout(() => {
          router.push('/developer/assigned-designs');
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit design');
      }
    } catch (error) {
      console.error('Error submitting design:', error);
      setError('Failed to submit design. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">Loading design details...</p>
      </div>
    );
  }

  if (!assignment) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/developer/assigned-designs"
              className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              <ArrowLeft size={22} className="text-gray-500 group-hover:text-purple-600 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Submit Your Work
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Submit your implementation for review
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Ready to Submit</span>
          </div>
        </div>

        {/* Original Design Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye size={18} className="text-purple-500" />
              Original Design Reference
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Review the design requirements before submitting</p>
          </div>
          
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Design Preview</label>
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                  {assignment.preview_image ? (
                    <Image
                      src={assignment.preview_image}
                      alt={assignment.design_title}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImageIcon size={48} className="text-gray-400" />
                      <p className="text-sm text-gray-400 mt-2">No preview available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Design Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{assignment.design_title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Designer:</span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{assignment.designer_name}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {assignment.design_description}
                  </p>
                </div>
                
                {assignment.figma_url && (
                  <a
                    href={assignment.figma_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all group"
                  >
                    <Figma size={16} className="group-hover:scale-110 transition-transform" />
                    Open in Figma
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Form Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form - Left Side (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              {/* Form Header */}
              <div className="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Send size={18} className="text-purple-500" />
                  Submission Details
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Fields marked with * are required</p>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* Error/Success Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2"
                    >
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-2"
                    >
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Live Demo URL - Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Live Demo URL <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'liveUrl' ? 'ring-2 ring-purple-500 rounded-xl' : ''}`}>
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      onFocus={() => setFocusedField('liveUrl')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="https://your-deployed-application.com"
                      className="cursor-text w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                    <Info size={12} /> Provide the URL where your implemented design is hosted
                  </p>
                </div>

                {/* Preview Image - Optional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview Image <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="previewImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {previewUrl ? (
                      <div className="relative inline-block">
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                          <img src={previewUrl} alt="Preview" className="max-h-48 w-auto rounded-xl" />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="cursor-pointer absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="previewImage"
                        className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all bg-gray-50 dark:bg-gray-700/30"
                      >
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload preview image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Upload a screenshot of your implementation (optional)
                  </p>
                </div>

                {/* Additional Notes - Optional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'notes' ? 'ring-2 ring-purple-500 rounded-xl' : ''}`}>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      onFocus={() => setFocusedField('notes')}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      placeholder="Any additional information for the admin about your implementation..."
                      className="cursor-text w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Info Box - Documentation will be uploaded after approval */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        📄 Documentation Upload After Approval
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Technical documentation, white paper, and source code can be uploaded 
                        <strong> after your submission is approved</strong>. You will get access to upload 
                        these documents once the admin approves your work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="px-5 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Submit for Review
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="cursor-pointer px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.form>
          </div>

          {/* Info Sidebar - Right Side (1/3 width) */}
         <div className="lg:col-span-1 space-y-5 sticky top-6">

  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
  >
    
    {/* Header */}
    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <HelpCircle size={18} className="text-purple-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Submission Guidelines
        </h3>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Please read before submitting your work
      </p>
    </div>

    <div className="p-5 space-y-5">

      {/* Required */}
      <div className="flex gap-3">
        <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 shrink-0"></div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Required
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            You must provide a working live demo URL before submission.
          </p>
        </div>
      </div>

      {/* After submission */}
      <div className="flex gap-3">
        <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            What happens next
          </p>
          <ul className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>Admin reviews your submission</li>
            <li>You receive approval or feedback</li>
            <li>Approved work moves to documentation stage</li>
          </ul>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50/60 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} className="text-yellow-600" />
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
            Practical Tips
          </p>
        </div>

        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>• Test your deployment link properly</p>
          <p>• Keep screenshots ready for validation</p>
          <p>• Ensure Figma link permissions are public</p>
        </div>
      </div>

    </div>
  </motion.div>
</div>
        </div>
      </div>
    </div>
  );
}