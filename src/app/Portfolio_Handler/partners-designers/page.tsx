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
  RefreshCw,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  FileArchive,
  Store,
  TrendingUp,
  Network,
  DollarSign,
  Briefcase as BriefcaseIcon,
  Download,
  Eye as EyeIcon,
  Globe,
  MessageSquare,
  Hash,
  Tag,
  FolderOpen,
  Key,
  Send
} from 'lucide-react';
import { MainLayout } from '../components/layout/main-layout';

// Designer Interface
interface Designer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  specialization: string;
  experience: string;
  portfolio: string;
  cv_filename: string;
  cv_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Partner Interface
interface Partner {
  id: number;
  name:string;
  partner_id: string;
  partner_type: 'institute' | 'bd' | 'marketing_firm' | 'investor' | 'software_house' | 'other';
  other_domain: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  links: string[];
  proposal_filename: string;
  proposal_url: string;
  cv_filename: string;
  cv_url: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
}

type TabType = 'designers' | 'partners';
type StatusType = 'pending' | 'approved' | 'rejected' | 'all';

// Partner Type Labels
const partnerTypeLabels: Record<string, string> = {
  institute: '🏛️ Institute',
  bd: '📈 Business Development (BD)',
  marketing_firm: '📢 Marketing Firm',
  investor: '💰 Investor',
  software_house: '💻 Software House',
  other: '🔘 Other'
};

const partnerTypeIcons: Record<string, any> = {
  institute: Building2,
  bd: TrendingUp,
  marketing_firm: Network,
  investor: DollarSign,
  software_house: BriefcaseIcon,
  other: Store
};

// Helper function to download file from URL
const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to open file in new tab
const openFile = (url: string) => {
  window.open(url, '_blank');
};

export default function PartnersDesignersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('designers');
  const [statusFilter, setStatusFilter] = useState<StatusType>('pending');
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Designer | Partner | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);
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
      
      if (designersData.success) {
        const processedDesigners = (designersData.data || []).map((d: any) => ({
          ...d,
          cv_url: d.cv_url || null,
          cv_filename: d.cv_filename || null
        }));
        setDesigners(processedDesigners);
      }
      
      if (partnersData.success) {
        const processedPartners = (partnersData.data || []).map((p: any) => ({
          ...p,
          links: typeof p.links === 'string' ? (p.links ? JSON.parse(p.links) : []) : (p.links || []),
          proposal_url: p.proposal_url || null,
          proposal_filename: p.proposal_filename || null,
          cv_url: p.cv_url || null,
          cv_filename: p.cv_filename || null,
          partner_type: p.partner_type || 'other',
          other_domain: p.other_domain || null
        }));
        setPartners(processedPartners);
      }
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

  // Resend credentials for approved designer
  const handleResendCredentials = async (item: Designer | Partner) => {
    const type = 'specialization' in item ? 'designer' : 'partner';
    
    if (!confirm(`Send credentials to ${item.email}?`)) return;
    
    setResendingId(item.id);
    try {
      const endpoint = type === 'designer' ? '/api/designers/resend-credentials' : '/api/partners/resend-credentials';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: item.id,
          email: item.email,
          name: item.name || (type === 'designer' ? (item as Designer).name : (item as Partner).contact_person),
          type: type
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Credentials sent successfully to ${item.email}`);
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

  const handleStatusChange = async (item: Designer | Partner, newStatus: string) => {
    const type = 'specialization' in item ? 'designer' : 'partner';
    const endpoint = type === 'designer' ? '/api/designers' : '/api/partners';
    
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
      case 'reviewed':
        return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1"><Eye size={12} /> Reviewed</span>;
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
            <p className="text-gray-600 dark:text-gray-400">Manage all partner and designer registrations including proposals, CVs, and credentials</p>
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
                      
                      {designer.cv_url && (
                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                          <button
                            onClick={() => openFile(designer.cv_url!)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-500/20 transition-all"
                          >
                            <EyeIcon size={14} />
                            View CV
                          </button>
                          <button
                            onClick={() => downloadFile(designer.cv_url!, designer.cv_filename || 'cv_file')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm hover:bg-green-500/20 transition-all"
                          >
                            <Download size={14} />
                            Download CV {designer.cv_filename && `(${designer.cv_filename})`}
                          </button>
                        </div>
                      )}
                      
                      {designer.portfolio && (
                        <div className="mt-2">
                          <a href={designer.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1">
                            Portfolio Link <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(designer.status)}
                      <div className="flex gap-2 mt-2 flex-wrap justify-end">
                        {designer.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(designer, 'approved')}
                              disabled={approvingId === designer.id || rejectingId === designer.id}
                              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {approvingId === designer.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                              {approvingId === designer.id ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(designer, 'rejected')}
                              disabled={approvingId === designer.id || rejectingId === designer.id}
                              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {rejectingId === designer.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                              {rejectingId === designer.id ? 'Rejecting...' : 'Reject'}
                            </button>
                          </>
                        )}
                        
                        {/* Resend Credentials Button - Only for approved designers */}
                        {designer.status === 'approved' && (
                          <button
                            onClick={() => handleResendCredentials(designer)}
                            disabled={resendingId === designer.id}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Resend Login Credentials"
                          >
                            {resendingId === designer.id ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                            Resend Credentials
                          </button>
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
              {filteredPartners.map((partner) => {
                const PartnerIcon = partnerTypeIcons[partner.partner_type] || Building2;
                return (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 transition-all"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <PartnerIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {partner.organization_name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                {partnerTypeLabels[partner.partner_type] || partner.partner_type}
                              </span>
                              {partner.partner_type === 'other' && partner.other_domain && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  Domain: {partner.other_domain}
                                </span>
                              )}
                              {partner.country && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  🌍 {partner.country}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-gray-500 dark:text-gray-400 text-xs">Contact Person</p>
                              <p className="text-gray-900 dark:text-white text-sm truncate">{partner.contact_person}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-gray-500 dark:text-gray-400 text-xs">Email</p>
                              <a href={`mailto:${partner.email}`} className="text-blue-600 dark:text-blue-400 text-sm truncate hover:underline">
                                {partner.email}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-gray-500 dark:text-gray-400 text-xs">Phone</p>
                              <p className="text-gray-900 dark:text-white text-sm">{partner.phone || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        
                        {partner.links && partner.links.length > 0 && (
                          <div className="mt-3">
                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1.5 flex items-center gap-1">
                              <LinkIcon size={12} />
                              Provided Links ({partner.links.length}/7):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {partner.links.map((link, idx) => (
                                <a 
                                  key={idx}
                                  href={link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 dark:text-blue-400 text-xs hover:underline flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                >
                                  <LinkIcon size={10} />
                                  Link {idx + 1}
                                  <ExternalLink size={10} />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 flex flex-wrap gap-3">
                          {partner.proposal_url && (
                            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg">
                              <FileArchive size={14} className="text-orange-500" />
                              <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                                {partner.proposal_filename || 'Proposal'}
                              </span>
                              <button
                                onClick={() => openFile(partner.proposal_url!)}
                                className="text-blue-500 hover:text-blue-600"
                                title="View"
                              >
                                <EyeIcon size={12} />
                              </button>
                              <button
                                onClick={() => downloadFile(partner.proposal_url!, partner.proposal_filename || 'proposal')}
                                className="text-green-500 hover:text-green-600"
                                title="Download"
                              >
                                <Download size={12} />
                              </button>
                            </div>
                          )}
                          
                          {partner.cv_url && (
                            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg">
                              <FileText size={14} className="text-purple-500" />
                              <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                                {partner.cv_filename || 'CV'}
                              </span>
                              <button
                                onClick={() => openFile(partner.cv_url!)}
                                className="text-blue-500 hover:text-blue-600"
                                title="View"
                              >
                                <EyeIcon size={12} />
                              </button>
                              <button
                                onClick={() => downloadFile(partner.cv_url!, partner.cv_filename || 'cv')}
                                className="text-green-500 hover:text-green-600"
                                title="Download"
                              >
                                <Download size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {partner.message && (
                          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                              <MessageSquare size={10} className="inline mr-1" />
                              {partner.message}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {getStatusBadge(partner.status)}
                        <div className="flex gap-2 mt-2">
                          {partner.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(partner, 'approved')}
                                disabled={approvingId === partner.id || rejectingId === partner.id}
                                className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                {approvingId === partner.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                {approvingId === partner.id ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleStatusChange(partner, 'rejected')}
                                disabled={approvingId === partner.id || rejectingId === partner.id}
                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                {rejectingId === partner.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                                {rejectingId === partner.id ? '...' : 'Reject'}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedItem(partner);
                              setShowDetailModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs hover:bg-blue-600/30 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} /> Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
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
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
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
                          <p className="text-gray-900 dark:text-white font-medium">{(selectedItem as Designer).name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Email</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Designer).email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Phone</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Designer).phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Company</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Designer).company || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Specialization</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Designer).specialization}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Experience</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Designer).experience} years</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Portfolio</p>
                          {(selectedItem as Designer).portfolio ? (
                            <a href={(selectedItem as Designer).portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                              {(selectedItem as Designer).portfolio} <ExternalLink size={14} />
                            </a>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">Not provided</p>
                          )}
                        </div>
                        {(selectedItem as Designer).cv_url && (
                          <div className="col-span-2">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">CV / Resume</p>
                            <div className="flex gap-3 mt-1">
                              <button
                                onClick={() => openFile((selectedItem as Designer).cv_url!)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-500/20 transition-all"
                              >
                                <EyeIcon size={14} /> View CV
                              </button>
                              <button
                                onClick={() => downloadFile((selectedItem as Designer).cv_url!, (selectedItem as Designer).cv_filename || 'cv_file')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm hover:bg-green-500/20 transition-all"
                              >
                                <Download size={14} /> Download CV
                              </button>
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Status</p>
                          {getStatusBadge((selectedItem as Designer).status)}
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Registered On</p>
                          <p className="text-gray-900 dark:text-white">{new Date((selectedItem as Designer).created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {/* Resend Credentials Button in Modal for Approved Designers */}
                      {(selectedItem as Designer).status === 'approved' && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <button
                            onClick={() => handleResendCredentials(selectedItem)}
                            disabled={resendingId === selectedItem.id}
                            className="w-full py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                          >
                            {resendingId === selectedItem.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            Resend Credentials
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Partner ID</p>
                          <p className="text-gray-900 dark:text-white font-mono text-sm">{(selectedItem as Partner).partner_id || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Partner Type</p>
                          <p className="text-gray-900 dark:text-white">
                            {partnerTypeLabels[(selectedItem as Partner).partner_type]}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Other Domain</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).other_domain || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Organization Name</p>
                          <p className="text-gray-900 dark:text-white font-medium">{(selectedItem as Partner).organization_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Contact Person</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).contact_person}</p>
                                               </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Email</p>
                          <a href={`mailto:${(selectedItem as Partner).email}`} className="text-blue-600 dark:text-blue-400 break-all">
                            {(selectedItem as Partner).email}
                          </a>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Phone</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Country</p>
                          <p className="text-gray-900 dark:text-white">{(selectedItem as Partner).country}</p>
                        </div>
                        
                        {(selectedItem as Partner).links && (selectedItem as Partner).links.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Provided Links ({(selectedItem as Partner).links.length}/7)</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {(selectedItem as Partner).links.map((link, idx) => (
                                <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                  <LinkIcon size={12} /> Link {idx + 1} <ExternalLink size={12} />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {(selectedItem as Partner).proposal_url && (
                          <div className="col-span-2">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Proposal Document</p>
                            <div className="flex gap-3 mt-1">
                              <button
                                onClick={() => openFile((selectedItem as Partner).proposal_url!)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-500/20 transition-all"
                              >
                                <EyeIcon size={14} /> View Proposal
                              </button>
                              <button
                                onClick={() => downloadFile((selectedItem as Partner).proposal_url!, (selectedItem as Partner).proposal_filename || 'proposal')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm hover:bg-green-500/20 transition-all"
                              >
                                <Download size={14} /> Download Proposal
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Filename: {(selectedItem as Partner).proposal_filename}</p>
                          </div>
                        )}
                        
                        {(selectedItem as Partner).cv_url && (
                          <div className="col-span-2">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">CV / Resume</p>
                            <div className="flex gap-3 mt-1">
                              <button
                                onClick={() => openFile((selectedItem as Partner).cv_url!)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-500/20 transition-all"
                              >
                                <EyeIcon size={14} /> View CV
                              </button>
                              <button
                                onClick={() => downloadFile((selectedItem as Partner).cv_url!, (selectedItem as Partner).cv_filename || 'cv_file')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm hover:bg-green-500/20 transition-all"
                              >
                                <Download size={14} /> Download CV
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Filename: {(selectedItem as Partner).cv_filename}</p>
                          </div>
                        )}
                        
                        {(selectedItem as Partner).message && (
                          <div className="col-span-2">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Message</p>
                            <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mt-1">{(selectedItem as Partner).message}</p>
                          </div>
                        )}
                        
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
                          {approvingId === selectedItem.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
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
                          {rejectingId === selectedItem.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                          {rejectingId === selectedItem.id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </>
                    )}
                    
                    {/* Resend Credentials Button in Modal for Approved Designers */}
                    {'specialization' in selectedItem && (selectedItem as Designer).status === 'approved' && (
                      <button
                        onClick={() => handleResendCredentials(selectedItem)}
                        disabled={resendingId === selectedItem.id}
                        className="flex-1 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                      >
                        {resendingId === selectedItem.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Resend Credentials
                      </button>
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