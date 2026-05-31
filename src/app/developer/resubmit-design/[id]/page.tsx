/* eslint-disable @typescript-eslint/no-explicit-any */
// app/developer/resubmit-design/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, 
  Image as ImageIcon, 
  X,
  Plus,
  Save,
  Globe,
  Figma,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Trash2,
  FileText,
  Code2,
  Info
} from 'lucide-react';

export default function DeveloperResubmitPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [developerId, setDeveloperId] = useState<number | null>(null);
  
  const developerIdRef = useRef<number | null>(null);
  
  const [formData, setFormData] = useState({
    liveUrl: '',
    previewImageFile: null as File | null,
    notes: '',
  });
  
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [originalPreviewImageUrl, setOriginalPreviewImageUrl] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [designDetails, setDesignDetails] = useState<any>(null);
  const [revisionCount, setRevisionCount] = useState(0);
  const [remainingRevisions, setRemainingRevisions] = useState(3);

  useEffect(() => {
    const auth = sessionStorage.getItem('developer_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        const id = authData.user?.id;
        setDeveloperId(id);
        developerIdRef.current = id;
      } catch (e) {
        console.error('Error parsing auth');
      }
    }
  }, []);

  useEffect(() => {
    if (developerId && assignmentId) {
      fetchAssignmentData();
    }
  }, [developerId, assignmentId]);

  const fetchAssignmentData = async () => {
    try {
      const response = await fetch(`/api/developer/assignments?developerId=${developerId}&id=${assignmentId}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const assignment = data.data[0];
        
        if (assignment.status !== 'rejected') {
          alert('Only rejected designs can be resubmitted');
          router.push('/developer/assigned-designs');
          return;
        }
        
        if (assignment.is_permanently_rejected) {
          alert('This design is permanently rejected and cannot be resubmitted');
          router.push('/developer/assigned-designs');
          return;
        }
        
        setFormData({
          liveUrl: assignment.live_url || '',
          previewImageFile: null,
          notes: assignment.submission_notes || '',
        });
        
        setOriginalPreviewImageUrl(assignment.preview_image_url);
        setPreviewImageUrl(assignment.preview_image_url);
        setRevisionCount(assignment.revision_count || 0);
        setRemainingRevisions(3 - (assignment.revision_count || 0));
        setDesignDetails(assignment);
        setIsImageChanged(false);
      } else {
        alert('Assignment not found');
        router.push('/developer/assigned-designs');
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      alert('Failed to load assignment data');
      router.push('/developer/assigned-designs');
    } finally {
      setLoading(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      setFormData(prev => ({ ...prev, previewImageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result as string);
        setIsImageChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setPreviewImageUrl(originalPreviewImageUrl);
    setFormData(prev => ({ ...prev, previewImageFile: null }));
    setIsImageChanged(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const currentDeveloperId = developerIdRef.current;

    if (!currentDeveloperId) {
      setError('Session expired. Please refresh the page and try again.');
      setSubmitting(false);
      return;
    }

    if (!formData.liveUrl.trim()) {
      setError('Live Demo URL is required');
      setSubmitting(false);
      return;
    }

    try {
      let previewImageBase64 = null;
      
      if (formData.previewImageFile) {
        previewImageBase64 = await fileToBase64(formData.previewImageFile);
      }

      const submitData = {
        assignmentId: parseInt(assignmentId),
        developerId: currentDeveloperId,
        liveUrl: formData.liveUrl,
        previewImage: previewImageBase64,
        notes: formData.notes,
        isResubmit: true
      };

      const response = await fetch('/api/developer/resubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Design resubmitted successfully! It will be reviewed by our team.');
        router.push('/developer/assigned-designs');
      } else {
        setError(data.error || 'Failed to resubmit design. Please try again.');
      }
    } catch (error) {
      console.error('Resubmit error:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/developer/assigned-designs"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resubmit Design</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your implementation based on admin feedback and resubmit for review
          </p>
        </div>
      </div>

      {/* Revision Status Card */}
      <div className={`p-4 rounded-xl border ${remainingRevisions === 1 ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Info size={18} className={remainingRevisions === 1 ? 'text-orange-500' : 'text-yellow-500'} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Revision Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${remainingRevisions === 1 ? 'text-orange-600' : 'text-yellow-600'}`}>
              {revisionCount}/3 revisions used
            </span>
            <span className="text-xs text-gray-500">
              ({remainingRevisions} {remainingRevisions === 1 ? 'attempt remaining' : 'attempts remaining'})
            </span>
          </div>
        </div>
        {remainingRevisions === 1 && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
            ⚠️ This is your last revision attempt. Make sure to address all feedback carefully.
          </p>
        )}
      </div>

      {/* Original Design Details */}
      {designDetails && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Original Design Reference</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Design Title</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{designDetails.design_title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Admin Feedback</p>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{designDetails.review_notes || 'No specific feedback provided'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Preview Image Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview Image</h3>
          
          {previewImageUrl && (
            <div className="mb-4">
              <div className="relative inline-block">
                <img 
                  src={previewImageUrl} 
                  alt="Preview" 
                  className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-600" 
                />
                {isImageChanged && (
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Reset to original"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              {isImageChanged && (
                <p className="text-xs text-green-600 mt-2">New image selected. Will replace current preview.</p>
              )}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">Upload new preview image</p>
            <p className="text-xs text-gray-400 mb-4">PNG, JPG, or GIF (max 5MB)</p>
            <label className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
              Choose File
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
          
          {originalPreviewImageUrl && !isImageChanged && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Current image shown. Upload new to replace.
            </p>
          )}
        </div>

        {/* Live Demo URL */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Demo URL</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Globe size={16} /> Live Demo URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
              required
              placeholder="https://your-deployed-application.com"
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Notes (Optional)</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes for Admin
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              placeholder="Explain what changes you made based on the feedback..."
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
            <Info size={16} />
            Important Note
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            After resubmission, your design will be sent back to admin for review.
            You have {remainingRevisions} revision attempt{remainingRevisions !== 1 ? 's' : ''} remaining.
            {remainingRevisions === 1 && ' Please make sure all feedback is addressed.'}
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 cursor-pointer py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Resubmitting...
              </>
            ) : (
              <>
                <Save size={18} /> Resubmit for Review
              </>
            )}
          </button>
          <Link
            href="/developer/assigned-designs"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}