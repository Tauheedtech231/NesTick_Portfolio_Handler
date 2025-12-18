'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';

import { MainLayout } from '../components/layout/main-layout';
import { TemplateRequestsTable } from '../components/colleges/template-requests-table';
/* eslint-disable */

interface TemplateRequest {
  id: string;
  name: string;
  representativeName: string; // college name
  email: string;
  phone: string;
  plan: string;
  templateName: string;
  type: 'free' | 'paid';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function CollegesPage() {
  const [templateRequests, setTemplateRequests] = useState<TemplateRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [search, setSearch] = useState('');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Fetch template requests from backend
  const fetchTemplateRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await fetch('/api/templates/template-requests');
      const data = await response.json();
      
      
      if (data.success) {
        console.log('Fetched template requests:', data);
        setTemplateRequests(data.requests || []);
      } else {
        console.error('Failed to fetch template requests:', data.message);
      }
    } catch (error) {
      console.error('Error fetching template requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch requests on component mount
  useEffect(() => {
    fetchTemplateRequests();
  }, []);

  // Filter template requests
  const filteredRequests = templateRequests.filter(request => {
    // Apply status filter
    if (requestFilter !== 'all' && request.status !== requestFilter) {
      return false;
    }
    
    // Apply search filter
    if (search.trim() === '') return true;
    
    const searchLower = search.toLowerCase();
    return (
      request.name.toLowerCase().includes(searchLower) ||
      request.representativeName.toLowerCase().includes(searchLower) ||
      request.email.toLowerCase().includes(searchLower) ||
      request.phone.includes(search) ||
      request.templateName.toLowerCase().includes(searchLower)
    );
  });

  // Handle update request status
  const handleUpdateRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/templates/template-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update request status');
      }

      // Update local state
      setTemplateRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status } : request
        )
      );

      console.log(`Request ${status} successfully`);

    } catch (error: any) {
      console.error('Error updating request status:', error);
      alert(error.message || 'Error updating request status');
    }
  };

  // Handle delete request from backend
  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const response = await fetch(`/api/templates/template-requests/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove the request from the list
        setTemplateRequests(prev => prev.filter(req => req.id !== id));
      } else {
        alert('Failed to delete request: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request');
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
              Template Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage template purchase requests from users
            </p>
          </div>

          <button
            onClick={fetchTemplateRequests}
            disabled={loadingRequests}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loadingRequests ? 'animate-spin' : ''} />
            Refresh Requests
          </button>
        </header>

        {/* Filters */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search requests by name, college, email, phone, or template..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-gray-500 focus:border-transparent 
                           transition-colors duration-300"
              />
            </div>

            {/* Status Filter */}
            <select
              value={requestFilter}
              onChange={e => setRequestFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-gray-500 focus:border-transparent
                         transition-colors duration-300"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                  {templateRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                  {templateRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Rejected</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
                  {templateRequests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Template Requests Table */}
        <TemplateRequestsTable
          requests={filteredRequests}
          loading={loadingRequests}
          onUpdateStatus={handleUpdateRequestStatus}
          onDeleteRequest={handleDeleteRequest}
          onRefresh={fetchTemplateRequests}
        />
      </motion.div>
    </MainLayout>
  );
}