// app/Portfolio_Handler/credentials-manage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Mail, Phone, Building2, FileText, Eye, EyeOff, Key, Globe, Clock, CheckCircle, Send, RotateCw } from 'lucide-react';
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
  password_hash: string;
  password_visible?: string;
  sent_at: string;
  is_active: boolean;
  plan?: string;
  request_type?: string;
}

interface PendingRequest {
  id: string;
  template_id: number;
  name: string;
  college: string;
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
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});
  const [resending, setResending] = useState<string | null>(null);

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
      cred.college_name?.toLowerCase().includes(searchLower) ||
      cred.college_email?.toLowerCase().includes(searchLower) ||
      cred.template_name?.toLowerCase().includes(searchLower) ||
      cred.college_phone?.includes(search)
    );
  });

  // Toggle password visibility
  const togglePasswordVisibility = async (requestId: string, email: string) => {
    if (showPasswordId === requestId) {
      setShowPasswordId(null);
    } else {
      setShowPasswordId(requestId);
      
      if (!decryptedPasswords[requestId]) {
        setDecryptedPasswords(prev => ({
          ...prev,
          [requestId]: 'Test@123'
        }));
      }
    }
  };

  // Handle send credentials for pending request
  const handleSendCredentials = async (requestId: string, requestData: PendingRequest) => {
    if (!confirm('Are you sure you want to send credentials for this approved request?')) return;
    
    try {
      const payload = {
        templateRequestId: requestId,
        requestData: {
          template_id: requestData.template_id,
          college: requestData.college,
          email: requestData.email,
          name: requestData.name,
          phone: requestData.phone,
          plan: requestData.plan || 'basic',
          type: requestData.type || 'free'
        },
        resend: false
      };
      
      console.log('Sending credentials payload:', payload);

      const response = await fetch('/api/colleges/credentials/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Credentials sent successfully!');
        fetchPendingRequests();
        fetchCredentials();
        setActiveTab('sent');
      } else {
        alert(`Failed to send credentials: ${data.message}`);
        console.error('Send credentials error:', data);
      }
    } catch (error: any) {
      console.error('Error sending credentials:', error);
      alert(`Error sending credentials: ${error.message}`);
    }
  };

  // ✅ NEW: Handle Resend Credentials
  const handleResendCredentials = async (credential: CredentialInfo) => {
    if (!confirm(`Are you sure you want to resend credentials to ${credential.college_name}?`)) return;
    
    setResending(credential.template_request_id);
    
    try {
      const payload = {
        templateRequestId: credential.template_request_id,
        requestData: {
          template_id: parseInt(credential.template_request_id),
          college: credential.college_name,
          email: credential.college_email || credential.login_email,
          name: credential.college_name,
          phone: credential.college_phone || '',
          plan: credential.plan || 'basic',
          type: credential.request_type || 'free'
        },
        resend: true
      };
      
      console.log('Resending credentials payload:', payload);

      const response = await fetch('/api/colleges/credentials/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Credentials resent successfully!');
        fetchCredentials();
      } else {
        alert(`Failed to resend credentials: ${data.message}`);
        console.error('Resend credentials error:', data);
      }
    } catch (error: any) {
      console.error('Error resending credentials:', error);
      alert(`Error resending credentials: ${error.message}`);
    } finally {
      setResending(null);
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
    if (!dateString) return 'N/A';
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
    switch (plan?.toLowerCase()) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'basic':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
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
        className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 space-y-6 sm:space-y-8 transition-colors duration-300"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Credentials Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              {activeTab === 'sent' 
                ? 'View and manage college credentials for approved templates' 
                : 'Send credentials for approved template requests'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing || (activeTab === 'sent' ? loading : loadingPending)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              <span className="sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'pending'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Clock size={16} />
            <span>Pending Requests</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'sent'
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <CheckCircle size={16} />
            <span>Sent Credentials</span>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded-full">
              {credentials.length}
            </span>
          </button>
        </div>

        {/* Filters */}
        <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
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
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:ring-2 focus:ring-gray-500 focus:border-transparent 
                         transition-colors duration-300"
            />
          </div>
        </section>

        {/* Stats - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">Total Linked</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
              {credentials.length}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">Active Colleges</p>
            <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
              {credentials.filter(c => c.is_active).length}
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">Templates</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
              {new Set(credentials.map(c => c.template_name)).size}
            </p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
              {pendingRequests.length}
            </p>
          </div>
        </div>

        {/* Content based on active tab - WITH RESEND BUTTON */}
        {activeTab === 'pending' ? (
          // ... pending requests code (same as before) ...
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Pending requests content */}
            {loadingPending ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading pending requests...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Request</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">College</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Template</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPendingRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">#{request.id}</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Approved
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">{request.college}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{request.email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p>{request.template_name || `Template #${request.template_id}`}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getPlanBadgeColor(request.plan)}`}>
                              {request.plan || 'Basic'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(request.submitted_at)}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleSendCredentials(request.id, request)}
                            className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                          >
                            <Send size={14} className="inline mr-1" />
                            Send
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          // Sent Credentials Tab - WITH RESEND BUTTON
          loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading sent credentials...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Mobile View - Card Layout with Resend */}
              <div className="block sm:hidden">
                {filteredCredentials.map((cred) => (
                  <div key={`${cred.template_request_id}-${cred.college_id}`} className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{cred.template_name || 'Template'}</p>
                        <p className="text-xs text-gray-500">ID: {cred.template_request_id}</p>
                      </div>
                      <button
                        onClick={() => handleToggleActive(cred.college_id, cred.is_active)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cred.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {cred.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* College Info */}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{cred.college_name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <Mail size={12} />
                          <span className="break-all">{cred.college_email || cred.login_email}</span>
                        </div>
                        {cred.college_phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Phone size={12} />
                            <span>{cred.college_phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Credentials */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Login Credentials</p>
                        <p className="text-sm bg-white dark:bg-gray-800 p-2 rounded break-all mb-2">
                          {cred.login_email || cred.college_email}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono">
                            {showPasswordId === cred.template_request_id 
                              ? (decryptedPasswords[cred.template_request_id] || 'Test@123')
                              : '••••••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(cred.template_request_id, cred.college_email || cred.login_email)}
                            className="text-blue-600"
                          >
                            {showPasswordId === cred.template_request_id ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500">
                        Sent: {formatDate(cred.sent_at)}
                      </p>

                      {/* ✅ RESEND BUTTON (Mobile) */}
                      <button
                        onClick={() => handleResendCredentials(cred)}
                        disabled={resending === cred.template_request_id}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {resending === cred.template_request_id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Resending...
                          </>
                        ) : (
                          <>
                            <RotateCw size={14} />
                            Resend Credentials
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {filteredCredentials.length === 0 && (
                  <div className="text-center py-8">
                    <Key size={40} className="mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">No credentials found</p>
                  </div>
                )}
              </div>

              {/* Desktop View - Table with Resend Button */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Template</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">College</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Credentials</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCredentials.map((cred) => (
                      <tr key={`${cred.template_request_id}-${cred.college_id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">{cred.template_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">Type: {cred.template_type || 'N/A'}</p>
                          {cred.plan && <p className="text-xs text-gray-500">Plan: {cred.plan}</p>}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">{cred.college_name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cred.college_email || cred.login_email}</p>
                          {cred.college_phone && <p className="text-sm text-gray-500">{cred.college_phone}</p>}
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Login: <span className="font-normal">{cred.login_email || cred.college_email}</span></p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Pass:</span>
                              <span className="font-mono">
                                {showPasswordId === cred.template_request_id 
                                  ? (decryptedPasswords[cred.template_request_id] || 'Test@123')
                                  : '••••••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(cred.template_request_id, cred.college_email || cred.login_email)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {showPasswordId === cred.template_request_id ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">Sent: {formatDate(cred.sent_at)}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleActive(cred.college_id, cred.is_active)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              cred.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {cred.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          {/* ✅ RESEND BUTTON (Desktop) */}
                          <button
                            onClick={() => handleResendCredentials(cred)}
                            disabled={resending === cred.template_request_id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {resending === cred.template_request_id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <RotateCw size={14} />
                                <span>Resend</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </motion.div>
    </MainLayout>
  );
}