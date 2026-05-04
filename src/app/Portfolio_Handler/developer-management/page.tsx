/* eslint-disable @typescript-eslint/no-explicit-any */
// app/Portfolio_Handler/developer-management/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, XCircle, Clock, Eye, Mail, Phone, 
  MapPin, Briefcase, Award, Code2, Calendar, FileText, 
  Download, Loader2, Search, Filter, RefreshCw,
  User, Building2, Link as LinkIcon, ExternalLink,
  Check, X, Key, Trash2, PlusCircle, LayoutTemplate,
  List, FolderOpen, AlertCircle, Calendar as CalendarIcon
} from 'lucide-react';
import { MainLayout } from '../components/layout/main-layout';

interface Developer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string | null;
  specialization: string;
  experience: string;
  skills: string[];
  portfolio: string | null;
  cv_filename: string | null;
  cv_file: string | null;
  cv_url: string | null;
  bio: string | null;
  location: string | null;
  bank_account_details: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  assigned_designs_count?: number;
}

interface Design {
  id: number;
  title: string;
  description: string;
  designer_name: string;
  status: string;
  preview_image: string;
}

interface AssignedDesign {
  id: number;
  design_id: number;
  design_title: string;
  design_description: string;
  designer_name: string;
  assigned_at: string;
  status: string;
  deadline: string | null;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function DeveloperManagementPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssignedDesignsModal, setShowAssignedDesignsModal] = useState(false);
  const [assignedDesigns, setAssignedDesigns] = useState<AssignedDesign[]>([]);
  const [assigningDeveloper, setAssigningDeveloper] = useState<Developer | null>(null);
  const [selectedDesignId, setSelectedDesignId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  // Fetch developers with assigned designs count
  const fetchDevelopers = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/developers');
      const data = await response.json();
      if (data.success) {
        const processed = await Promise.all(data.data.map(async (dev: any) => {
          // Fetch assigned designs count for each developer
          const countRes = await fetch(`/api/developers/assigned-designs?developerId=${dev.id}&count=true`);
          const countData = await countRes.json();
          
          return {
            ...dev,
            skills: typeof dev.skills === 'string' ? JSON.parse(dev.skills || '[]') : (dev.skills || []),
            assigned_designs_count: countData.count || 0
          };
        }));
        setDevelopers(processed);
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch assigned designs for a developer
  const fetchAssignedDesigns = async (developerId: number) => {
    setLoadingAssigned(true);
    try {
      const response = await fetch(`/api/developers/assigned-designs?developerId=${developerId}`);
      const data = await response.json();
      if (data.success) {
        setAssignedDesigns(data.designs);
        setShowAssignedDesignsModal(true);
      }
    } catch (error) {
      console.error('Error fetching assigned designs:', error);
    } finally {
      setLoadingAssigned(false);
    }
  };

  // Fetch available designs (approved designs not yet assigned)
  const fetchAvailableDesigns = async () => {
    try {
      const response = await fetch('/api/admin/designs?status=approved');
      const data = await response.json();
      if (data.success) {
        setDesigns(data.designs || []);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Update developer status
  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    if (status === 'approved') {
      setApprovingId(id);
    } else {
      setRejectingId(id);
    }

    try {
      const response = await fetch('/api/developers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      const data = await response.json();
      if (data.success) {
        await fetchDevelopers();
        alert(`Developer ${status} successfully!`);
        if (status === 'approved') {
          await sendCredentialsEmail(id);
        }
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update developer status');
    } finally {
      setApprovingId(null);
      setRejectingId(null);
    }
  };

  // Send credentials email after approval
  const sendCredentialsEmail = async (developerId: number) => {
    try {
      const response = await fetch('/api/developers/send-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId })
      });
      const data = await response.json();
      if (!data.success) {
        console.error('Failed to send credentials email');
      }
    } catch (error) {
      console.error('Error sending credentials:', error);
    }
  };

  // Resend credentials (only for approved developers)
  const handleResendCredentials = async (developer: Developer) => {
    if (!confirm(`Send credentials to ${developer.email}?`)) return;
    
    setResendingId(developer.id);
    try {
      const response = await fetch('/api/developers/resend-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          developerId: developer.id,
          email: developer.email,
          name: developer.name
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Credentials sent successfully to ${developer.email}`);
      } else {
        throw new Error(data.error || 'Failed to send credentials');
      }
    } catch (error) {
      console.error('Error sending credentials:', error);
      alert('Failed to send credentials');
    } finally {
      setResendingId(null);
    }
  };

  // Open assign design modal
  const openAssignModal = async (developer: Developer) => {
    setAssigningDeveloper(developer);
    await fetchAvailableDesigns();
    setSelectedDesignId(null);
    setShowAssignModal(true);
  };

  // Assign design to developer
  const assignDesign = async () => {
    if (!selectedDesignId || !assigningDeveloper) {
      alert('Please select a design');
      return;
    }

    setAssigning(true);
    try {
      const response = await fetch('/api/admin/assign-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId: selectedDesignId,
          developerId: assigningDeveloper.id
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Design assigned successfully to ${assigningDeveloper.name}`);
        setShowAssignModal(false);
        setAssigningDeveloper(null);
        setSelectedDesignId(null);
        await fetchDevelopers();
      } else {
        throw new Error(data.error || 'Failed to assign design');
      }
    } catch (error) {
      console.error('Error assigning design:', error);
      alert('Failed to assign design');
    } finally {
      setAssigning(false);
    }
  };

  // Download CV
  const downloadCV = (developer: Developer) => {
    if (!developer.cv_file && !developer.cv_url) {
      alert('No CV file available');
      return;
    }
    
    try {
      if (developer.cv_url) {
        window.open(developer.cv_url, '_blank');
      } else if (developer.cv_file) {
        const link = document.createElement('a');
        let base64Content = developer.cv_file;
        if (base64Content.includes(',')) {
          base64Content = base64Content.split(',')[1];
        }
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = developer.cv_filename || 'cv_file.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV');
    }
  };

  // Filter developers
  const filteredDevelopers = developers.filter(dev => {
    if (statusFilter !== 'all' && dev.status !== statusFilter) return false;
    if (searchTerm && !dev.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !dev.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Get status badge
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

  // Stats
  const pendingCount = developers.filter(d => d.status === 'pending').length;
  const approvedCount = developers.filter(d => d.status === 'approved').length;
  const rejectedCount = developers.filter(d => d.status === 'rejected').length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={48} className="animate-spin text-yellow-500 mx-auto" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Code2 className="w-8 h-8 text-purple-500" />
              Developer Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage developer registrations, approvals, design assignments, and credentials</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-500">{approvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Rejected</p>
                  <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              onClick={fetchDevelopers}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center gap-2"
            >
              {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Refresh
            </button>
          </div>

          {/* Developers List */}
          <div className="space-y-4">
            {filteredDevelopers.map((developer) => (
              <motion.div
                key={developer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-purple-500 transition-all"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{developer.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{developer.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-gray-700 dark:text-gray-300">{developer.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Specialization</p>
                        <p className="text-gray-700 dark:text-gray-300">{developer.specialization}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Experience</p>
                        <p className="text-gray-700 dark:text-gray-300">{developer.experience}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Company</p>
                        <p className="text-gray-700 dark:text-gray-300">{developer.company_name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* Skills Tags */}
                    {developer.skills && developer.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {developer.skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                            {skill}
                          </span>
                        ))}
                        {developer.skills.length > 5 && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                            +{developer.skills.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(developer.status)}
                      {/* Assigned Designs Badge */}
                      {developer.status === 'approved' && developer.assigned_designs_count !== undefined && developer.assigned_designs_count > 0 && (
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1">
                          <FolderOpen size={12} />
                          {developer.assigned_designs_count} Design{developer.assigned_designs_count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap justify-end">
                      <button
                        onClick={() => {
                          setSelectedDeveloper(developer);
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-all flex items-center gap-1"
                      >
                        <Eye size={12} /> View
                      </button>
                      
                      {/* View Assigned Designs Button - Only for approved developers with designs */}
                      {developer.status === 'approved' && developer.assigned_designs_count !== undefined && developer.assigned_designs_count > 0 && (
                        <button
                          onClick={() => fetchAssignedDesigns(developer.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all flex items-center gap-1"
                        >
                          <List size={12} />
                          View Designs ({developer.assigned_designs_count})
                        </button>
                      )}
                      
                      {developer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(developer.id, 'approved')}
                            disabled={approvingId === developer.id}
                            className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-all flex items-center gap-1 disabled:opacity-50"
                          >
                            {approvingId === developer.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(developer.id, 'rejected')}
                            disabled={rejectingId === developer.id}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-all flex items-center gap-1 disabled:opacity-50"
                          >
                            {rejectingId === developer.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                            Reject
                          </button>
                        </>
                      )}
                      
                      {/* Assign Design Button - Only for approved developers */}
                      {developer.status === 'approved' && (
                        <button
                          onClick={() => openAssignModal(developer)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-all flex items-center gap-1"
                          title="Assign Design to Developer"
                        >
                          <PlusCircle size={12} />
                          Assign Design
                        </button>
                      )}
                      
                      {/* Resend Credentials - Only for approved developers */}
                      {developer.status === 'approved' && (
                        <button
                          onClick={() => handleResendCredentials(developer)}
                          disabled={resendingId === developer.id}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-all flex items-center gap-1 disabled:opacity-50"
                          title="Resend Login Credentials to Developer"
                        >
                          {resendingId === developer.id ? <Loader2 size={12} className="animate-spin" /> : <Key size={12} />}
                          Resend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredDevelopers.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No developers found</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedDeveloper && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Developer Details</h2>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedDeveloper.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedDeveloper.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedDeveloper.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedDeveloper.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedDeveloper.company_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registered On</p>
                      <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedDeveloper.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Assigned Designs</p>
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        {selectedDeveloper.assigned_designs_count || 0} design{selectedDeveloper.assigned_designs_count !== 1 ? 's' : ''} assigned
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Professional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedDeveloper.specialization}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedDeveloper.experience}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Skills</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedDeveloper.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Portfolio/GitHub</p>
                        {selectedDeveloper.portfolio ? (
                          <a href={selectedDeveloper.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline flex items-center gap-1">
                            {selectedDeveloper.portfolio} <ExternalLink size={14} />
                          </a>
                        ) : (
                          <p className="text-gray-500">Not provided</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Bio</p>
                        <p className="text-gray-700 dark:text-gray-300">{selectedDeveloper.bio || 'No bio provided'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Bank Account Details</p>
                        <p className="text-gray-700 dark:text-gray-300">{selectedDeveloper.bank_account_details || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {selectedDeveloper.cv_filename && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">CV/Resume</h3>
                      <button
                        onClick={() => downloadCV(selectedDeveloper)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
                      >
                        <Download size={16} />
                        Download CV ({selectedDeveloper.cv_filename})
                      </button>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex gap-3">
                    {selectedDeveloper.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updateStatus(selectedDeveloper.id, 'approved');
                            setShowDetailModal(false);
                          }}
                          className="flex-1 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all"
                        >
                          Approve Developer
                        </button>
                        <button
                          onClick={() => {
                            updateStatus(selectedDeveloper.id, 'rejected');
                            setShowDetailModal(false);
                          }}
                          className="flex-1 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all"
                        >
                          Reject Developer
                        </button>
                      </>
                    )}
                    
                    {selectedDeveloper.status === 'approved' && (
                      <>
                        {selectedDeveloper.assigned_designs_count !== undefined && selectedDeveloper.assigned_designs_count > 0 && (
                          <button
                            onClick={() => {
                              fetchAssignedDesigns(selectedDeveloper.id);
                              setShowDetailModal(false);
                            }}
                            className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                          >
                            <List size={16} />
                            View Assigned Designs ({selectedDeveloper.assigned_designs_count})
                          </button>
                        )}
                        <button
                          onClick={() => {
                            openAssignModal(selectedDeveloper);
                            setShowDetailModal(false);
                          }}
                          className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                          <PlusCircle size={16} />
                          Assign Design
                        </button>
                        <button
                          onClick={() => {
                            handleResendCredentials(selectedDeveloper);
                          }}
                          disabled={resendingId === selectedDeveloper.id}
                          className="flex-1 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                          {resendingId === selectedDeveloper.id ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
                          Resend Credentials
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="flex-1 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assign Design Modal */}
        <AnimatePresence>
          {showAssignModal && assigningDeveloper && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAssignModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <LayoutTemplate className="w-6 h-6 text-purple-500" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Design</h2>
                    </div>
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Assign a design to <strong>{assigningDeveloper.name}</strong>
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Design
                    </label>
                    <select
                      value={selectedDesignId || ''}
                      onChange={(e) => setSelectedDesignId(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="">-- Select a design --</option>
                      {designs.map((design) => (
                        <option key={design.id} value={design.id}>
                          {design.title} - by {design.designer_name}
                        </option>
                      ))}
                    </select>
                    {designs.length === 0 && (
                      <p className="text-sm text-yellow-500 mt-2">No approved designs available for assignment.</p>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="flex-1 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={assignDesign}
                      disabled={assigning || !selectedDesignId}
                      className="flex-1 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {assigning ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Assign Design
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assigned Designs Modal */}
        <AnimatePresence>
          {showAssignedDesignsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowAssignedDesignsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assigned Designs</h2>
                  </div>
                  <button
                    onClick={() => setShowAssignedDesignsModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  {loadingAssigned ? (
                    <div className="flex justify-center py-8">
                      <Loader2 size={32} className="animate-spin text-purple-500" />
                    </div>
                  ) : assignedDesigns.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No designs assigned yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assignedDesigns.map((design) => (
                        <div
                          key={design.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-purple-500 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <LayoutTemplate className="w-5 h-5 text-purple-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {design.design_title}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                Designer: <span className="text-gray-700 dark:text-gray-300">{design.designer_name}</span>
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {design.design_description || 'No description provided'}
                              </p>
                              <div className="flex flex-wrap gap-3 text-xs">
                                <span className="flex items-center gap-1 text-gray-500">
                                  <CalendarIcon size={12} />
                                  Assigned: {new Date(design.assigned_at).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full ${
                                  design.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                  design.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                  design.status === 'submitted' ? 'bg-purple-500/20 text-purple-400' :
                                  design.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  Status: {design.status?.replace('_', ' ') || 'pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}