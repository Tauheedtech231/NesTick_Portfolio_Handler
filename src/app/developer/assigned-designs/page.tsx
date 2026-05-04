// app/developer/assigned-designs/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Figma,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Assignment {
  id: number;
  design_id: number;
  design_title: string;
  design_description: string;
  designer_name: string;
  preview_image: string | null;
  figma_url: string | null;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  assigned_at: string;
  deadline: string | null;
  notes: string;
  submission_url: string | null;
  review_notes: string | null;
}

type StatusFilter = 'all' | 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';

export default function AssignedDesignsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const getDeveloperId = useCallback((): string | null => {
    const auth = sessionStorage.getItem('developer_auth');
    if (!auth) return null;
    try {
      const parsed = JSON.parse(auth);
      return parsed?.user?.id ? parsed.user.id.toString() : null;
    } catch {
      return null;
    }
  }, []);

  // Single API call on mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/developer/assignments?developerId=${developerId}`);
      const data = await response.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments based on search and status
  const filteredAssignments = useCallback(() => {
    let filtered = [...assignments];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.design_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.designer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [assignments, statusFilter, searchTerm])();

  // Stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => a.status === 'in_progress').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    approved: assignments.filter(a => a.status === 'approved').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'in_progress':
        return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> In Progress</span>;
      case 'submitted':
        return <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Submitted</span>;
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
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Assigned Designs</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your assigned design projects</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-purple-500">{stats.submitted}</p>
          <p className="text-xs text-gray-500">Submitted</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by design name or designer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'pending', 'in_progress', 'submitted', 'approved', 'rejected'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No designs assigned yet</p>
          </div>
        ) : (
          filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-500 transition-all"
            >
              <div className="flex flex-col md:flex-row">
                {/* Preview Image Section */}
                <div className="md:w-48 h-48 bg-gray-100 dark:bg-gray-700 relative">
                  {assignment.preview_image ? (
                    <Image
                      src={assignment.preview_image}
                      alt={assignment.design_title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {assignment.design_title}
                        </h3>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {assignment.design_description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> Designer: {assignment.designer_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                        </span>
                        {assignment.deadline && (
                          <span className="flex items-center gap-1 text-orange-500">
                            <AlertCircle size={12} /> Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Figma Link */}
                      {assignment.figma_url && (
                        <a
                          href={assignment.figma_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-purple-500 hover:text-purple-600"
                        >
                          <Figma size={12} />
                          View Figma Design
                          <ExternalLink size={10} />
                        </a>
                      )}

                      {assignment.notes && (
                        <p className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          📝 {assignment.notes}
                        </p>
                      )}
                      
                      {assignment.review_notes && (
                        <p className="text-xs text-red-500 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          Review: {assignment.review_notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {assignment.status === 'pending' && (
                        <span className="px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium">
                          Not Started
                        </span>
                      )}
                      
                      {/* Only Submit button - redirects to submit page */}
                      {(assignment.status === 'pending' || assignment.status === 'in_progress') && (
                        <Link
                          href={`/developer/submit-design?id=${assignment.id}`}
                          className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all flex items-center gap-2"
                        >
                          Submit Design
                          <ChevronRight size={16} />
                        </Link>
                      )}
                      
                      {assignment.status === 'submitted' && (
                        <span className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-400 text-sm font-medium">
                          Under Review
                        </span>
                      )}
                      
                      {assignment.status === 'approved' && assignment.submission_url && (
                        <a
                          href={assignment.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          View Live Demo
                          <ExternalLink size={14} />
                        </a>
                      )}
                      
                      {assignment.status === 'rejected' && (
                        <Link
                          href={`/developer/submit-design?id=${assignment.id}`}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all"
                        >
                          Resubmit Design
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}