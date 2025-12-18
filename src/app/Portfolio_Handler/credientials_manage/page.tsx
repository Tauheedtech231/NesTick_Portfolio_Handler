// app/Portfolio_Handler/credentials-manage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Mail, Phone, Building2, FileText, Link as LinkIcon, Eye, EyeOff, Key, Globe, Clock, CheckCircle } from 'lucide-react';
import { MainLayout } from '../components/layout/main-layout'; 
/* eslint-disable */

interface CredentialInfo {
  template_request_id: string;
  template_name: string;
  template_type: string;
  template_description?: string;
  template_live_url?: string;
  template_image?: string;
  college_id: number;
  college_name: string;
  college_email: string;
  college_phone: string;
  college_website: string;
  college_city: string;
  college_country: string;
  login_email: string;
  password_visible?: string; // Only for display
  password_encrypted: string;
  sent_at: string;
  is_active: boolean;
}

interface PendingRequest {
  id: string;
  template_id: number;
  name: string; // User's personal name
  college: string; // College name
  email: string;
  phone: string;
  plan: 'basic' | 'enterprise';
  type: 'free' | 'paid';
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  updated_at: string;
  hasCredentials?: boolean;
  template_name?: string;
  template_type?: string;
}

export default function CredentialsManagePage() {
  const [credentials, setCredentials] = useState<CredentialInfo[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [search, setSearch] = useState('');
  const [showPasswordId, setShowPasswordId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'sent' | 'pending'>('pending');

  // Fetch sent credentials data
  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/colleges/credentials/manage');
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched sent credentials:', data.credentials);
        setCredentials(data.credentials || []);
      } else {
        console.error('Failed to fetch sent credentials:', data.message);
        setCredentials([]);
      }
    } catch (error) {
      console.error('Error fetching sent credentials:', error);
      setCredentials([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch pending approved requests
  const fetchPendingRequests = async () => {
    try {
      setLoadingPending(true);
      const response = await fetch('/api/templates/template-requests/approve?status=approved');
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched pending requests:', data.requests);
        
        // Filter requests that don't have sent credentials
        const requestsWithoutCredentials = data.requests.filter((req: any) => !req.hasCredentials);
        setPendingRequests(requestsWithoutCredentials || []);
      } else {
        console.error('Failed to fetch pending requests:', data.message);
        setPendingRequests([]);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setPendingRequests([]);
    } finally {
      setLoadingPending(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'sent') {
      fetchCredentials();
    } else {
      fetchPendingRequests();
    }
  }, [activeTab]);

  // Filter pending requests based on search
  const filteredPendingRequests = pendingRequests.filter(request => {
    if (search.trim() === '') return true;
    
    const searchLower = search.toLowerCase();
    return (
      request.college.toLowerCase().includes(searchLower) ||
      request.email.toLowerCase().includes(searchLower) ||
      (request.template_name && request.template_name.toLowerCase().includes(searchLower)) ||
      request.name.toLowerCase().includes(searchLower) ||
      request.phone.includes(search)
    );
  });

  // Filter sent credentials based on search
  const filteredCredentials = credentials.filter(cred => {
    if (search.trim() === '') return true;
    
    const searchLower = search.toLowerCase();
    return (
      cred.college_name.toLowerCase().includes(searchLower) ||
      cred.college_email.toLowerCase().includes(searchLower) ||
      cred.template_name.toLowerCase().includes(searchLower) ||
      cred.college_phone.includes(search)
    );
  });

  // Toggle password visibility
  const togglePasswordVisibility = (requestId: string) => {
    if (showPasswordId === requestId) {
      setShowPasswordId(null);
    } else {
      setShowPasswordId(requestId);
    }
  };

  // Handle send credentials for pending request
  const handleSendCredentials = async (requestId: string, requestData: PendingRequest) => {
    if (!confirm('Are you sure you want to send credentials for this approved request?')) return;
    
    try {
      const response = await fetch('/api/colleges/credentials/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateRequestId: requestId,
          requestData: {
            template_id: requestData.template_id,
            college: requestData.college, // College name
            email: requestData.email, // College email
            name: requestData.name, // User's personal name
            phone: requestData.phone,
            plan: requestData.plan,
            type: requestData.type
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Credentials sent successfully!');
        // Refresh both lists
        fetchPendingRequests();
        fetchCredentials();
        // Switch to sent tab to see the new entry
        setActiveTab('sent');
      } else {
        alert(`Failed to send credentials: ${data.message}`);
      }
    } catch (error: any) {
      console.error('Error sending credentials:', error);
      alert(`Error sending credentials: ${error.message}`);
    }
  };

  // Handle resend credentials (existing function)
  const handleResendCredentials = async (collegeId: number, templateRequestId: string) => {
    if (!confirm('Are you sure you want to resend credentials to this college?')) return;
    
    try {
      const response = await fetch('/api/colleges/credentials/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeId: collegeId,
          templateRequestId: templateRequestId,
          resend: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Credentials resent successfully!');
        fetchCredentials(); // Refresh the list
      } else {
        alert(`Failed to resend credentials: ${data.message}`);
      }
    } catch (error: any) {
      console.error('Error resending credentials:', error);
      alert(`Error resending credentials: ${error.message}`);
    }
  };

  // Toggle college active status
  const handleToggleActive = async (collegeId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/colleges/${collegeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Update local state
        setCredentials(prev => 
          prev.map(cred => 
            cred.college_id === collegeId 
              ? { ...cred, is_active: !currentStatus } 
              : cred
          )
        );
        alert(`College ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to update status: ${error.error}`);
      }
    } catch (error: any) {
      console.error('Error toggling status:', error);
      alert(`Error updating status: ${error.message}`);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    if (activeTab === 'sent') {
      fetchCredentials();
    } else {
      fetchPendingRequests();
    }
  };

  // Get plan badge color
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'basic':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'free':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="min-h-screen bg-white dark:bg-gray-900 p-6 space-y-8 transition-colors duration-300"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Credentials Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {activeTab === 'sent' 
                ? 'View and manage college credentials for approved templates' 
                : 'Send credentials for approved template requests'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing || (activeTab === 'sent' ? loading : loadingPending)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === 'pending'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Clock size={16} />
            Pending Requests
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === 'sent'
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <CheckCircle size={16} />
            Sent Credentials
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded-full">
              {credentials.length}
            </span>
          </button>
        </div>

        {/* Filters */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={
                activeTab === 'sent' 
                  ? "Search by college name, email, template name, or phone..."
                  : "Search by college name, requester name, email, or phone..."
              }
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:ring-2 focus:ring-gray-500 focus:border-transparent 
                         transition-colors duration-300"
            />
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Linked</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
              {credentials.length}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400">Active Colleges</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
              {credentials.filter(c => c.is_active).length}
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-600 dark:text-purple-400">Templates</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
              {new Set(credentials.map(c => c.template_name)).size}
            </p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending Requests</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
              {pendingRequests.length}
            </p>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'pending' ? (
          /* PENDING REQUESTS TABLE */
          loadingPending ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading pending requests...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Request Details
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        College Details
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Template & Plan
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Request Date
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPendingRequests.map((request) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      >
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              Request #{request.id}
                            </p>
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Approved
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Requester: {request.name}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Building2 size={16} className="text-gray-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {request.college}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Contact: {request.name}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail size={12} className="text-gray-500" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">{request.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={12} className="text-gray-500" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">{request.phone}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {request.template_name || `Template #${request.template_id}`}
                                </p>
                                {request.template_type && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Type: {request.template_type}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(request.plan)}`}>
                                {request.plan.charAt(0).toUpperCase() + request.plan.slice(1)}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(request.type)}`}>
                                {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(request.submitted_at)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Last updated: {formatDate(request.updated_at)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleSendCredentials(request.id, request)}
                              className="px-4 py-2 rounded-lg bg-green-600 text-white 
                                       hover:bg-green-700 transition-colors text-sm font-medium
                                       flex items-center gap-2 justify-center"
                            >
                              <Mail size={14} />
                              Send Credentials
                            </button>
                            <button
                              onClick={() => {
                                // View request details
                                window.open(`/Portfolio_Handler/templates/requests?highlight=${request.id}`, '_blank');
                              }}
                              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredPendingRequests.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {search ? 'No pending requests match your search' : 'No pending requests found'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      All approved requests have been processed or no approved requests available
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          /* SENT CREDENTIALS TABLE (Existing Table) */
          loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading sent credentials...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Template Details
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        College Details
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Credentials
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCredentials.map((cred) => (
                      <motion.tr
                        key={`${cred.template_request_id}-${cred.college_id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                      >
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {cred.template_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Type: {cred.template_type}
                                </p>
                              </div>
                            </div>
                            {cred.template_live_url && (
                              <a 
                                href={cred.template_live_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <Globe size={12} />
                                Live Preview
                              </a>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Request ID: {cred.template_request_id}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Building2 size={16} className="text-gray-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {cred.college_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {cred.college_id}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail size={12} className="text-gray-500" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">{cred.college_email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={12} className="text-gray-500" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">{cred.college_phone}</p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {cred.college_city && cred.college_country && (
                                <p>{cred.college_city}, {cred.college_country}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Login Email
                              </p>
                              <p className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                {cred.login_email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center justify-between">
                                <span>Password</span>
                                <button
                                  onClick={() => togglePasswordVisibility(cred.template_request_id)}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {showPasswordId === cred.template_request_id ? (
                                    <span className="flex items-center gap-1">
                                      <EyeOff size={12} /> Hide
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <Eye size={12} /> Show
                                    </span>
                                  )}
                                </button>
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                                    {showPasswordId === cred.template_request_id 
                                      ? cred.password_visible || '************'
                                      : '************'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Sent: {formatDate(cred.sent_at)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <button
                              onClick={() => handleToggleActive(cred.college_id, cred.is_active)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                cred.is_active
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                            >
                              {cred.is_active ? 'Active' : 'Inactive'}
                            </button>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <LinkIcon size={12} />
                              <span>College ID: {cred.college_id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleResendCredentials(cred.college_id, cred.template_request_id)}
                              className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 
                                       hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium
                                       flex items-center gap-1 justify-center"
                            >
                              <Mail size={14} />
                              Resend Creds
                            </button>
                            <button
                              onClick={() => {
                                window.open(`/Portfolio_Handler/colleges#college-${cred.college_id}`, '_blank');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 
                                       hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                            >
                              View College
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredCredentials.length === 0 && (
                  <div className="text-center py-12">
                    <Key size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {search ? 'No credentials match your search' : 'No credentials found'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Send credentials for approved requests to see them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </motion.div>
    </MainLayout>
  );
}