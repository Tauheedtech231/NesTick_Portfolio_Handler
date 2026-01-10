'use client';
import { motion } from 'framer-motion';
import { Check, X, User, Building, Mail, Phone, Calendar, DollarSign, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';
/* eslint-disable */

interface TemplateRequest {
  id: string;
  name: string;
  representativeName: string;
  email: string;
  phone: string;
  plan: string;
  templateName: string;
  type: 'free' | 'paid';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface TemplateRequestsTableProps {
  requests: TemplateRequest[];
  loading: boolean;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onDeleteRequest: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function TemplateRequestsTable({ 
  requests, 
  loading, 
  onUpdateStatus, 
  onDeleteRequest,
  onRefresh 
}: TemplateRequestsTableProps) {
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    // Default to 'pending' if status is undefined or invalid
    const safeStatus = status || 'pending';
    
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', 
        label: 'Pending' 
      },
      approved: { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 
        label: 'Approved' 
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 
        label: 'Rejected' 
      }
    };

    // Use the status if it exists in config, otherwise default to pending
    const config = statusConfig[safeStatus as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPlanBadge = (plan: string | null | undefined) => {
    const planValue = plan || 'basic';
    
    const planConfig: Record<string, { color: string; label: string }> = {
      basic: { 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', 
        label: 'Basic' 
      },
      professional: { 
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', 
        label: 'Professional' 
      },
      enterprise: { 
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', 
        label: 'Enterprise' 
      }
    };

    const config = planConfig[planValue.toLowerCase()] || planConfig.basic;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    // Handle null/undefined type
    const safeType = type || 'free';
    
    const typeConfig = {
      free: { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: Tag,
        label: 'Free'
      },
      paid: { 
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        icon: DollarSign,
        label: 'Paid'
      }
    };

    const config = typeConfig[safeType as keyof typeof typeConfig] || typeConfig.free;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingRequest(id);
    try {
      await onUpdateStatus(id, 'approved');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingRequest(id);
    try {
      await onUpdateStatus(id, 'rejected');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingRequest(id);
    try {
      await onDeleteRequest(id);
    } finally {
      setProcessingRequest(null);
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading template requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Building size={48} className="mx-auto" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          No template requests found.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Template requests will appear here when users submit them through the landing page.
        </p>
        <button
          onClick={onRefresh}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-colors duration-300 border border-gray-200 dark:border-gray-700">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {['Template', 'College', 'Contact', 'Plan', 'Type', 'Date', 'Status', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map((request, index) => (
              <motion.tr
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                      <Tag size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block">
                        {request.templateName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {request.id}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Building size={14} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {request.representativeName}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {request.name}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Mail size={12} className="mr-1" />
                      {request.email}
                    </div>
                    <div className="flex items-center">
                      <Phone size={12} className="mr-1" />
                      {request.phone}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {getPlanBadge(request.plan)}
                </td>

                <td className="px-6 py-4">
                  {getTypeBadge(request.type)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(request.createdAt)}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {getStatusBadge(request.status)}
                </td>

                <td className="px-6 py-4 text-sm font-medium flex flex-wrap items-center gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingRequest === request.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 rounded-lg transition text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Approve Request"
                      >
                        {processingRequest === request.id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Approve</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={processingRequest === request.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/50 rounded-lg transition text-xs sm:text-sm disabled:opacity-50"
                        title="Reject Request"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(request.id)}
                    disabled={processingRequest === request.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition text-xs sm:text-sm disabled:opacity-50"
                    title="Delete Request"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4 p-4">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Tag size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {request.templateName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.representativeName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Request ID: {request.id}
                  </p>
                </div>
              </div>
              {getStatusBadge(request.status)}
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <User size={12} className="mr-2" />
                {request.name}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail size={12} className="mr-2" />
                {request.email}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone size={12} className="mr-2" />
                {request.phone}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {getPlanBadge(request.plan)}
                  {getTypeBadge(request.type)}
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  <Calendar size={10} className="inline mr-1" />
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              {request.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingRequest === request.id}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 rounded-lg transition text-xs disabled:opacity-50"
                  >
                    {processingRequest === request.id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Approve</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={processingRequest === request.id}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/50 rounded-lg transition text-xs disabled:opacity-50"
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(request.id)}
                disabled={processingRequest === request.id}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition text-xs disabled:opacity-50"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}