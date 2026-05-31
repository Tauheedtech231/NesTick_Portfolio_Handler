/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/Portfolio_Handler/design-management/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  Loader2,
  ExternalLink,
  Tag,
  DollarSign,
  Calendar,
  ChevronUp,
  ChevronDown,
  Filter,
  Grid,
  List,
  AlertCircle,
  Download,
  Trash2,
  MoreVertical,
  Edit,
  Ban
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
  views?: number;
  likes?: number;
  revision_count?: number;
  is_permanently_rejected?: boolean;
}

type SortField = 'title' | 'designer_name' | 'price' | 'created_at' | 'status';
type SortOrder = 'asc' | 'desc';

export default function DesignManagementPage() {
  const router = useRouter();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<Design | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDesigns, setSelectedDesigns] = useState<number[]>([]);

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
        setShowRejectModal(null);
        setRejectionReason('');
        
        // Show appropriate message based on rejection result
        if (data.is_permanently_rejected) {
          alert(`Design permanently rejected! (Revision ${data.revision_count}/3)`);
        } else {
          alert(`Design rejected. (Revision ${data.revision_count}/3)`);
        }
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

  const handleBulkApprove = async () => {
    if (selectedDesigns.length === 0) return;
    if (confirm(`Approve ${selectedDesigns.length} design(s)?`)) {
      for (const id of selectedDesigns) {
        await handleApprove(id);
      }
      setSelectedDesigns([]);
    }
  };

  const getStatusBadge = (design: Design) => {
    // Check for permanently rejected first
    if (design.is_permanently_rejected) {
      return <span className="px-2 py-1 rounded-full bg-gradient-to-r from-red-700 to-red-800 dark:from-red-800 dark:to-red-900 text-white text-xs flex items-center gap-1"><Ban size={12} /> Permanently Rejected</span>;
    }
    
    switch(design.status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-700 dark:text-yellow-400 text-xs flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-1"><XCircle size={12} /> Rejected ({design.revision_count || 0}/3)</span>;
      default: return null;
    }
  };

  const canReject = (design: Design) => {
    // Cannot reject if already approved
    if (design.status === 'approved') return false;
    // Cannot reject if permanently rejected
    if (design.is_permanently_rejected) return false;
    // Cannot reject if already 3 or more revisions
    if ((design.revision_count || 0) >= 3) return false;
    return true;
  };

  const canApprove = (design: Design) => {
    // Cannot approve if permanently rejected
    if (design.is_permanently_rejected) return false;
    // Can only approve pending designs
    return design.status === 'pending';
  };

  const handleViewDetails = (designId: number) => {
    router.push(`/Portfolio_Handler/design-management/${designId}`);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <Filter size={14} className="opacity-30" />;
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const filteredDesigns = designs.filter(design => {
    if (statusFilter !== 'all' && design.status !== statusFilter) return false;
    if (searchTerm && !design.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !design.designer_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    
    if (sortField === 'created_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (sortField === 'price') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedDesigns = sortedDesigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedDesigns.length / itemsPerPage);
  const pendingCount = designs.filter(d => d.status === 'pending' && !d.is_permanently_rejected).length;

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Designer', 'Category', 'Price', 'Status', 'Revision Count', 'Created At'];
    const csvData = sortedDesigns.map(d => [
      d.id, d.title, d.designer_name, d.category, d.price, 
      d.is_permanently_rejected ? 'Permanently Rejected' : d.status,
      d.revision_count || 0,
      new Date(d.created_at).toLocaleDateString()
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `designs_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-600 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading designs...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Design Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage designer submissions</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Download size={16} /> Export CSV
              </button>
              <button
                onClick={fetchDesigns}
                className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <RefreshCw size={16} className="hover:rotate-180 transition-transform" /> Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingCount}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
              <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{designs.filter(d => d.status === 'approved' && !d.is_permanently_rejected).length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 hover:shadow-lg transition-all">
              <p className="text-sm text-red-600 dark:text-red-400">Rejected</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{designs.filter(d => d.status === 'rejected' && !d.is_permanently_rejected).length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-700 to-red-800 dark:from-red-800 dark:to-red-900 rounded-xl p-4 border border-red-600 hover:shadow-lg transition-all">
              <p className="text-sm text-red-300">Permanently Rejected</p>
              <p className="text-2xl font-bold text-white">{designs.filter(d => d.is_permanently_rejected).length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search by design title or designer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="cursor-text w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="cursor-pointer px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="cursor-pointer px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`cursor-pointer p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`cursor-pointer p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDesigns.length > 0 && (
            <div
              className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 flex items-center justify-between"
            >
              <span className="text-sm text-purple-700 dark:text-purple-300">
                {selectedDesigns.length} design(s) selected
              </span>
              <button
                onClick={handleBulkApprove}
                className="cursor-pointer px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <CheckCircle size={16} /> Approve Selected
              </button>
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDesigns(paginatedDesigns.filter(d => canApprove(d)).map(d => d.id));
                            } else {
                              setSelectedDesigns([]);
                            }
                          }}
                          className="cursor-pointer rounded border-gray-300"
                        />
                      </th>
                      <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors" onClick={() => handleSort('title')}>
                        <div className="flex items-center gap-1">Title {getSortIcon('title')}</div>
                      </th>
                      <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors" onClick={() => handleSort('designer_name')}>
                        <div className="flex items-center gap-1">Designer {getSortIcon('designer_name')}</div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                      <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors" onClick={() => handleSort('price')}>
                        <div className="flex items-center gap-1">Price {getSortIcon('price')}</div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Revisions</th>
                      <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors" onClick={() => handleSort('status')}>
                        <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
                      </th>
                      <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors" onClick={() => handleSort('created_at')}>
                        <div className="flex items-center gap-1">Created {getSortIcon('created_at')}</div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedDesigns.map((design, index) => (
                      <tr
                        key={design.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${design.is_permanently_rejected ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedDesigns.includes(design.id)}
                            onChange={(e) => {
                              if (e.target.checked && canApprove(design)) {
                                setSelectedDesigns([...selectedDesigns, design.id]);
                              } else {
                                setSelectedDesigns(selectedDesigns.filter(id => id !== design.id));
                              }
                            }}
                            disabled={!canApprove(design)}
                            className="cursor-pointer rounded border-gray-300 disabled:opacity-50"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewDetails(design.id)}
                            className="cursor-pointer text-sm font-medium text-gray-900 dark:text-white hover:text-purple-600 transition-colors text-left"
                          >
                            {design.title}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{design.designer_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                            {design.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-purple-600">${design.price}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${(design.revision_count || 0) >= 3 ? 'text-red-600' : 'text-gray-500'}`}>
                            {design.revision_count || 0}/3
                          </span>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(design)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            {new Date(design.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(design.id)}
                              className="cursor-pointer p-1.5 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            {canApprove(design) && (
                              <button
                                onClick={() => handleApprove(design.id)}
                                disabled={approvingId === design.id}
                                className="cursor-pointer p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all disabled:opacity-50"
                                title="Approve"
                              >
                                {approvingId === design.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                              </button>
                            )}
                            {canReject(design) && (
                              <button
                                onClick={() => setShowRejectModal(design)}
                                className="cursor-pointer p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                title={`Reject (${design.revision_count || 0}/3)`}
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                            {design.figma_url && (
                              <a
                                href={design.figma_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer p-1.5 text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg transition-all"
                                title="Open in Figma"
                              >
                                <Figma size={16} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDesigns.map((design) => (
                <div
                  key={design.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    design.is_permanently_rejected 
                      ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* Preview Image */}
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                    {design.preview_image ? (
                      <img src={design.preview_image} alt={design.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Brush size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(design)}
                    </div>
                    {design.is_permanently_rejected && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Ban size={48} className="text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Eye size={32} className="text-white" />
                    </div>
                  </div>

                  {/* Design Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{design.title}</h3>
                      <span className="text-lg font-bold text-purple-600">${design.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{design.description}</p>
                    
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User size={14} />
                        <span className="truncate">{design.designer_name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Revisions: {(design.revision_count || 0)}/3
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                        {design.category}
                      </span>
                      {design.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleViewDetails(design.id)}
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} /> View Details
                      </button>
                      {canApprove(design) && (
                        <button
                          onClick={() => handleApprove(design.id)}
                          disabled={approvingId === design.id}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {approvingId === design.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                          Approve
                        </button>
                      )}
                      {canReject(design) && (
                        <button
                          onClick={() => setShowRejectModal(design)}
                          className="py-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                          title={`Reject (${design.revision_count || 0}/3)`}
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredDesigns.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Brush size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No designs found</h3>
              <p className="text-gray-500 dark:text-gray-400">No designs match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRejectModal(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertCircle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reject Design</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Revision {showRejectModal.revision_count || 0}/3
                      {(showRejectModal.revision_count || 0) >= 2 && (
                        <span className="text-red-500 ml-2">
                          ⚠️ Next rejection will permanently reject this design!
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Provide a reason for rejecting "<span className="font-semibold text-gray-700 dark:text-gray-300">{showRejectModal.title}</span>"
                </p>
                
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  placeholder="Enter rejection reason (required)..."
                  className="cursor-text w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all mb-4"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRejectModal(null);
                      setRejectionReason('');
                    }}
                    className="cursor-pointer flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(showRejectModal.id)}
                    disabled={rejectingId === showRejectModal.id}
                    className="cursor-pointer flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {rejectingId === showRejectModal.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {((showRejectModal.revision_count || 0) + 1) >= 3 ? 'Permanently Reject' : 'Reject Design'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}