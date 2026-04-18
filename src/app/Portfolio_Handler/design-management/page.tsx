/* eslint-disable @typescript-eslint/no-explicit-any */
// app/Portfolio_Handler/design-management/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  User,
  Brush,
  Mail,
  Figma,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { MainLayout } from '../components/layout/main-layout';

interface Design {
  id: number;
  title: string;
  description: string;
  preview_image: string;
  category: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  designer_id: number;
  designer_name: string;
  designer_email: string;
  created_at: string;
  rejection_reason: string | null;
  figma_url: string;
  live_url: string;
  tags: string[];
}

export default function DesignManagementPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await fetch('/api/admin/designs');
      const data = await response.json();
      if (data.success) {
        setDesigns(data.designs);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
      setError('Failed to fetch designs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (designId: number) => {
    setApprovingId(designId);
    try {
      const response = await fetch(`/api/admin/designs/${designId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        await fetchDesigns();
        setShowDetailModal(false);
      } else {
        alert(data.error || 'Failed to approve design');
      }
    } catch (error) {
      console.error('Error approving design:', error);
      alert('Network error. Please try again.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (designId: number) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    setRejectingId(designId);
    try {
      const response = await fetch(`/api/admin/designs/${designId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason })
      });
      const data = await response.json();
      if (data.success) {
        await fetchDesigns();
        setShowDetailModal(false);
        setRejectionReason('');
      } else {
        alert(data.error || 'Failed to reject design');
      }
    } catch (error) {
      console.error('Error rejecting design:', error);
      alert('Network error. Please try again.');
    } finally {
      setRejectingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs flex items-center gap-1 cursor-default"><CheckCircle size={12} /> Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs flex items-center gap-1 cursor-default"><Clock size={12} /> Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs flex items-center gap-1 cursor-default"><XCircle size={12} /> Rejected</span>;
      default: return null;
    }
  };

  const filteredDesigns = designs.filter(design => {
    if (statusFilter !== 'all' && design.status !== statusFilter) return false;
    if (searchTerm && !design.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !design.designer_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const pendingCount = designs.filter(d => d.status === 'pending').length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Design Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage designer submissions</p>
          </div>
          <button
            onClick={fetchDesigns}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800 cursor-default">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingCount}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 cursor-default">
            <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{designs.filter(d => d.status === 'approved').length}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 cursor-default">
            <p className="text-sm text-red-600 dark:text-red-400">Rejected</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{designs.filter(d => d.status === 'rejected').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by design title or designer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-text"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Designs List - Grid with 3 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => {
                setSelectedDesign(design);
                setShowDetailModal(true);
              }}
            >
              {/* Preview Image */}
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                {design.preview_image ? (
                  <img src={design.preview_image} alt={design.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Brush size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(design.status)}
                </div>
              </div>

              {/* Design Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{design.title}</h3>
                  <span className="text-lg font-bold text-blue-600">${design.price}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{design.description}</p>
                
                {/* Designer Info */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <User size={14} />
                  <span>{design.designer_name}</span>
                  <span className="text-gray-400">•</span>
                  <Mail size={14} />
                  <span>{design.designer_email}</span>
                </div>

                {/* Category & Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs cursor-default">
                    {design.category}
                  </span>
                  {design.tags?.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions - Buttons with individual loading states */}
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDesign(design);
                      setShowDetailModal(true);
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye size={16} /> View Details
                  </button>
                  {design.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(design.id);
                      }}
                      disabled={approvingId === design.id}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {approvingId === design.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDesigns.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Brush size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No designs found</h3>
            <p className="text-gray-500 dark:text-gray-400">No designs match your filters</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDesign.title}</h2>
                    <p className="text-sm text-gray-500">Submitted by {selectedDesign.designer_name} • {new Date(selectedDesign.created_at).toLocaleDateString()}</p>
                  </div>
                  {getStatusBadge(selectedDesign.status)}
                </div>

                {selectedDesign.preview_image && (
                  <div className="mb-6">
                    <img src={selectedDesign.preview_image} alt={selectedDesign.title} className="w-full rounded-lg max-h-96 object-cover" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
                    <p className="text-gray-900 dark:text-white">{selectedDesign.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h3>
                      <p className="text-gray-900 dark:text-white">{selectedDesign.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Price</h3>
                      <p className="text-2xl font-bold text-blue-600">${selectedDesign.price}</p>
                    </div>
                  </div>

                  {selectedDesign.tags && selectedDesign.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDesign.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs cursor-default">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {selectedDesign.figma_url && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Figma URL</h3>
                        <a href={selectedDesign.figma_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1 cursor-pointer">
                          <Figma size={14} /> View in Figma
                        </a>
                      </div>
                    )}
                    {selectedDesign.live_url && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Live Demo</h3>
                        <a href={selectedDesign.live_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1 cursor-pointer">
                          <LinkIcon size={14} /> View Live
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Designer Information</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-500" />
                        <span>{selectedDesign.designer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-500" />
                        <span>{selectedDesign.designer_email}</span>
                      </div>
                    </div>
                  </div>

                  {selectedDesign.status === 'rejected' && selectedDesign.rejection_reason && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                      <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Rejection Reason</h3>
                      <p className="text-sm text-red-600 dark:text-red-300">{selectedDesign.rejection_reason}</p>
                    </div>
                  )}

                  {selectedDesign.status === 'pending' && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rejection Reason (if rejecting)</label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          placeholder="Provide reason for rejection..."
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none cursor-text"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(selectedDesign.id)}
                          disabled={approvingId === selectedDesign.id}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {approvingId === selectedDesign.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          Approve Design
                        </button>
                        <button
                          onClick={() => handleReject(selectedDesign.id)}
                          disabled={rejectingId === selectedDesign.id}
                          className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {rejectingId === selectedDesign.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          Reject Design
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}