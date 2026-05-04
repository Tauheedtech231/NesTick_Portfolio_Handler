// app/Portfolio_Handler/submitted-designs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Eye, ExternalLink, CheckCircle, XCircle, 
  Clock, Search, RefreshCw, Loader2, AlertCircle,
  Calendar, User, Link as LinkIcon, Image as ImageIcon,
  Send, Mail, Code2, ChevronRight, MessageSquare,
  Filter, X, ArrowLeft, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { MainLayout } from '../components/layout/main-layout';
import Image from 'next/image';

interface Submission {
  id: number;
  assignment_id: number;
  design_title: string;
  design_description: string;
  developer_name: string;
  developer_email: string;
  live_url: string;
  white_paper: string;
  source_code_url: string | null;
  preview_image_url: string | null;
  submission_notes: string | null;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  review_notes: string | null;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function SubmittedDesignsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Detect theme
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    checkTheme();
    const observer = new MutationObserver(() => checkTheme());
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Fetch submissions
  const fetchSubmissions = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/admin/submissions');
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Approve submission
  const handleApprove = async (submission: Submission) => {
    if (!confirm(`Approve "${submission.design_title}"?`)) return;
    
    setProcessingId(submission.id);
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: submission.assignment_id, 
          status: 'approved',
          reviewNotes: reviewNotes || 'Your design has been approved! It will be listed soon.'
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchSubmissions();
        setShowDetailModal(false);
        setReviewNotes('');
        alert('Design approved successfully! Developer has been notified.');
      } else {
        alert(data.error || 'Failed to approve');
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve design');
    } finally {
      setProcessingId(null);
    }
  };

  // Reject submission
  const handleReject = async (submission: Submission) => {
    const reason = prompt('Please enter rejection reason:', reviewNotes || '');
    if (!reason) return;
    
    if (!confirm(`Reject "${submission.design_title}"?`)) return;
    
    setProcessingId(submission.id);
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: submission.assignment_id, 
          status: 'rejected',
          reviewNotes: reason
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchSubmissions();
        setShowDetailModal(false);
        setReviewNotes('');
        alert('Design rejected. Developer has been notified.');
      } else {
        alert(data.error || 'Failed to reject');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject design');
    } finally {
      setProcessingId(null);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (searchTerm && !sub.design_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !sub.developer_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Stats
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="text-xs text-gray-400">{status}</span>;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={48} className="animate-spin text-purple-500 mx-auto" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              Submitted Designs
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Review and manage developer design submissions
            </p>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Pending Review</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-500">{pendingCount}</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Approved</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">{approvedCount}</p>
                </div>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Rejected</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-500">{rejectedCount}</p>
                </div>
                <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Filters - Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by design name or developer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2"
              >
                <Filter size={16} />
                Filter by Status
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all text-sm sm:text-base ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchSubmissions}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
            >
              {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden mb-4 overflow-hidden"
              >
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status</span>
                    <button onClick={() => setMobileFilterOpen(false)}>
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                  {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2 rounded-lg capitalize transition-all text-left ${
                        statusFilter === status
                          ? 'bg-purple-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {status === 'all' ? 'All' : status}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submissions List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No submissions found</p>
              </div>
            ) : (
              filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={`${submission.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-purple-500 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          {submission.design_title}
                        </h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {submission.design_description}
                      </p>
                      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={12} /> <span className="truncate">{submission.developer_name}</span>
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <Mail size={12} /> <span className="truncate hidden xs:inline">{submission.developer_email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {new Date(submission.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowDetailModal(true);
                          setReviewNotes(submission.review_notes || '');
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-all flex items-center gap-1 flex-1 sm:flex-none justify-center"
                      >
                        <Eye size={14} /> <span className="text-xs sm:text-sm">Review</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Detail Modal - Responsive */}
        <AnimatePresence>
          {showDetailModal && selectedSubmission && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Review Submission</h2>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XCircle size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Basic Info - Responsive Grid */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Design Name</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white break-words">
                        {selectedSubmission.design_title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Developer</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white break-words">
                        {selectedSubmission.developer_name}
                      </p>
                    </div>
                    <div className="col-span-1 xs:col-span-2">
                      <p className="text-xs sm:text-sm text-gray-500">Email</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white break-words">
                        {selectedSubmission.developer_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Submitted On</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                        {new Date(selectedSubmission.submitted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Preview Image */}
                  {selectedSubmission.preview_image_url && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">Preview Image</p>
                      <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={selectedSubmission.preview_image_url}
                          alt={selectedSubmission.design_title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  )}

                  {/* Live Demo URL */}
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">Live Demo URL</p>
                    <a
                      href={selectedSubmission.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:underline flex items-center gap-1 text-sm sm:text-base break-all"
                    >
                      {selectedSubmission.live_url} <ExternalLink size={14} className="flex-shrink-0" />
                    </a>
                  </div>

                  {/* Source Code URL */}
                  {selectedSubmission.source_code_url && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">Source Code</p>
                      <a
                        href={selectedSubmission.source_code_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:underline flex items-center gap-1 text-sm sm:text-base break-all"
                      >
                        {selectedSubmission.source_code_url} <Code2 size={14} className="flex-shrink-0" />
                      </a>
                    </div>
                  )}

                  {/* White Paper */}
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">Technical Documentation / White Paper</p>
                    <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-pre-wrap text-xs sm:text-sm max-h-48 overflow-y-auto">
                      {selectedSubmission.white_paper}
                    </div>
                  </div>

                  {/* Submission Notes */}
                  {selectedSubmission.submission_notes && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">Developer Notes</p>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs sm:text-sm">
                        {selectedSubmission.submission_notes}
                      </div>
                    </div>
                  )}

                  {/* Review Notes Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Review Notes (for developer)
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      placeholder="Add feedback or notes for the developer..."
                      className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* Actions - Responsive Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {selectedSubmission.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedSubmission)}
                          disabled={processingId === selectedSubmission.id}
                          className="order-1 sm:order-none px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                        >
                          {processingId === selectedSubmission.id ? <Loader2 size={16} className="animate-spin" /> : <ThumbsUp size={16} />}
                          Approve Design
                        </button>
                        <button
                          onClick={() => handleReject(selectedSubmission)}
                          disabled={processingId === selectedSubmission.id}
                          className="order-2 sm:order-none px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                        >
                          {processingId === selectedSubmission.id ? <Loader2 size={16} className="animate-spin" /> : <ThumbsDown size={16} />}
                          Reject Design
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="order-3 sm:order-none px-4 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-all text-sm sm:text-base"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Additional Responsive Styles */}
      <style jsx>{`
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:col-span-2 {
            grid-column: span 2;
          }
        }
      `}</style>
    </MainLayout>
  );
}