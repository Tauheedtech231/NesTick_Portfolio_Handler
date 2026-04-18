/* eslint-disable @typescript-eslint/no-explicit-any */
// app/Portfolio_Handler/partners-designers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  FileText,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Key,
  Globe,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { MainLayout } from '../components/layout/main-layout';

interface Designer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  specialization: string;
  experience: string;
  portfolio: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Partner {
  id: number;
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  organization_type: string;
  country: string;
  message: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
}

type TabType = 'designers' | 'partners';
type StatusType = 'pending' | 'approved' | 'rejected' | 'all';

export default function PartnersDesignersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('designers');
  const [statusFilter, setStatusFilter] = useState<StatusType>('pending');
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Designer | Partner | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [designersRes, partnersRes] = await Promise.all([
        fetch('/api/designers'),
        fetch('/api/partners')
      ]);
      
      const designersData = await designersRes.json();
      const partnersData = await partnersRes.json();
      
      if (designersData.success) setDesigners(designersData.data || []);
      if (partnersData.success) setPartners(partnersData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const sendEmailNotification = async (type: string, data: any, status: string) => {
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, status, action: 'approval' })
      });
      return response.ok;
    } catch (error) {
      console.error('Email error:', error);
      return false;
    }
  };

  const handleStatusChange = async (item: Designer | Partner, newStatus: string) => {
    const type = 'specialization' in item ? 'designer' : 'partner';
    const endpoint = type === 'designer' ? '/api/designers' : '/api/partners';
    
    // Set loading state based on action
    if (newStatus === 'approved') {
      setApprovingId(item.id);
    } else {
      setRejectingId(item.id);
    }
    
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status: newStatus })
      });
      
      if (response.ok) {
        await sendEmailNotification(type, item, newStatus);
        await fetchData();
        alert(`${type === 'designer' ? 'Designer' : 'Partner'} ${newStatus} successfully!`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setApprovingId(null);
      setRejectingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs">{status}</span>;
    }
  };

  const filteredDesigners = designers.filter(d => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (searchTerm && !d.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !d.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredPartners = partners.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchTerm && !p.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !p.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getPendingCount = (type: TabType) => {
    if (type === 'designers') return designers.filter(d => d.status === 'pending').length;
    return partners.filter(p => p.status === 'pending').length;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Partners & Designers Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all partner and designer registrations</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button
              onClick={() => setActiveTab('designers')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'designers' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <User size={18} />
              Designers
              {getPendingCount('designers') > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-500 text-black text-xs">
                  {getPendingCount('designers')}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'partners' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Briefcase size={18} />
              Partners
              {getPendingCount('partners') > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-500 text-black text-xs">
                  {getPendingCount('partners')}
                </span>
              )}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as StatusType[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Designers List */}
          {activeTab === 'designers' && (
            <div className="grid grid-cols-1 gap-4">
              {filteredDesigners.map((designer) => (
                <motion.div
                  key={designer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 transition-all"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{designer.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{designer.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-gray-700 dark:text-gray-300">{designer.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Company</p>
                          <p className="text-gray-700 dark:text-gray-300">{designer.company || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Specialization</p>
                          <p className="text-gray-700 dark:text-gray-300">{designer.specialization}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Experience</p>
                          <p className="text-gray-700 dark:text-gray-300">{designer.experience} years</p>
                        </div>
                      </div>
                      
                      {designer.portfolio && (
                        <div className="mt-2">
                          <a href={designer.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline cursor-pointer">
                            Portfolio Link →
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(designer.status)}
                      <div className="flex gap-2 mt-2">
                        {designer.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(designer, 'approved')}
                              disabled={approvingId === designer.id || rejectingId === designer.id}
                              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {approvingId === designer.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              {approvingId === designer.id ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(designer, 'rejected')}
                              disabled={approvingId === designer.id || rejectingId === designer.id}
                              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {rejectingId === designer.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <XCircle size={14} />
                              )}
                              {rejectingId === designer.id ? 'Rejecting...' : 'Reject'}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedItem(designer);
                            setShowDetailModal(true);
                          }}
                          className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-600/30 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredDesigners.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No designers found</p>
                </div>
              )}
            </div>
          )}

          {/* Partners List */}
          {activeTab === 'partners' && (
            <div className="grid grid-cols-1 gap-4">
              {filteredPartners.map((partner) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 transition-all"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{partner.organization_name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contact: {partner.contact_person}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Email</p>
                          <p className="text-gray-700 dark:text-gray-300">{partner.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-gray-700 dark:text-gray-300">{partner.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Organization Type</p>
                          <p className="text-gray-700 dark:text-gray-300">{partner.organization_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Country</p>
                          <p className="text-gray-700 dark:text-gray-300">{partner.country}</p>
                        </div>
                      </div>
                      
                      {partner.message && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{partner.message}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(partner.status)}
                      <div className="flex gap-2 mt-2">
                        {partner.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(partner, 'approved')}
                              disabled={approvingId === partner.id || rejectingId === partner.id}
                              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {approvingId === partner.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              {approvingId === partner.id ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(partner, 'rejected')}
                              disabled={approvingId === partner.id || rejectingId === partner.id}
                              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {rejectingId === partner.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <XCircle size={14} />
                              )}
                              {rejectingId === partner.id ? 'Rejecting...' : 'Reject'}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedItem(partner);
                            setShowDetailModal(true);
                          }}
                          className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-600/30 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredPartners.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No partners found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedItem && (
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
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {'specialization' in selectedItem ? 'Designer Details' : 'Partner Details'}
                    </h2>
                    <button 
                      onClick={() => setShowDetailModal(false)} 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {'specialization' in selectedItem ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Full Name</p>
                          <p className="text-gray-900 dark:text-white">{selectedItem.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Email</p>
                          <p className="text-gray-900 dark:text-white">{selectedItem.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Phone</p>
                          <p className="text-gray-900 dark:text-white">{selectedItem.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Company</p>
                          <p className="text-gray-900 dark:text-white">{selectedItem.company || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Specialization</p>
                          <p className="text-gray-900 dark:text-white">{selectedItem.specialization}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Experience</p>
                          <p className="text-gray-900 dark:text-white">{selectedItem.experience} years</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Portfolio</p>
                          {selectedItem.portfolio ? (
                            <a href={selectedItem.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                              {selectedItem.portfolio}
                            </a>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">Not provided</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Status</p>
                          {getStatusBadge(selectedItem.status)}
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Registered On</p>
                          <p className="text-gray-900 dark:text-white">{new Date(selectedItem.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Organization Name</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).organization_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Contact Person</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).contact_person}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Email</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Phone</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Organization Type</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).organization_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Country</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).country}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Message</p>
                          <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{(selectedItem as Partner).message || 'No message'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Status</p>
                          {getStatusBadge((selectedItem as Partner).status)}
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Submitted On</p>
                          <p className="text-gray-900 dark:text-white">{new Date((selectedItem as Partner).created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {(selectedItem.status === 'pending') && (
                      <>
                        <button
                          onClick={() => {
                            handleStatusChange(selectedItem, 'approved');
                            setShowDetailModal(false);
                          }}
                          disabled={approvingId === selectedItem.id || rejectingId === selectedItem.id}
                          className="flex-1 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {approvingId === selectedItem.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          {approvingId === selectedItem.id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => {
                            handleStatusChange(selectedItem, 'rejected');
                            setShowDetailModal(false);
                          }}
                          disabled={approvingId === selectedItem.id || rejectingId === selectedItem.id}
                          className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {rejectingId === selectedItem.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {rejectingId === selectedItem.id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="flex-1 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all cursor-pointer"
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
    </MainLayout>
  );
}