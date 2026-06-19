'use client';
import { motion } from 'framer-motion';
import { Check, X, User, Building, Mail, Phone, Calendar, DollarSign, Tag, Trash2, Clock, ChevronRight } from 'lucide-react';
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
    const safeStatus = status || 'pending';
    
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-500/30',
        icon: Clock,
        label: 'Pending' 
      },
      approved: { 
        color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/30',
        icon: Check,
        label: 'Approved' 
      },
      rejected: { 
        color: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/30',
        icon: X,
        label: 'Rejected' 
      }
    };

    const config = statusConfig[safeStatus as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${config.color}`}>
        <Icon size={10} />
        {config.label}
      </span>
    );
  };

  const getPlanBadge = (plan: string | null | undefined) => {
    const planValue = plan || 'basic';
    
    const planConfig: Record<string, { color: string; label: string }> = {
      basic: { 
        color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30',
        label: 'Basic' 
      },
      professional: { 
        color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/30',
        label: 'Professional' 
      },
      enterprise: { 
        color: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-orange-500/30',
        label: 'Enterprise' 
      }
    };

    const config = planConfig[planValue.toLowerCase()] || planConfig.basic;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const safeType = type || 'free';
    
    const typeConfig = {
      free: { 
        color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/30',
        icon: Tag,
        label: 'Free'
      },
      paid: { 
        color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/30',
        icon: DollarSign,
        label: 'Paid'
      }
    };

    const config = typeConfig[safeType as keyof typeof typeConfig] || typeConfig.free;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${config.color}`}>
        <Icon size={10} />
        {config.label}
      </span>
    );
  };

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
        <p className="text-xs text-gray-600 dark:text-gray-400">Loading template requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Building size={40} className="mx-auto" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No template requests found.
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
          Template requests will appear here when users submit them through the landing page.
        </p>
        <button
          onClick={onRefresh}
          className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-xs cursor-pointer"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {requests.map((request, index) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
        >
          <div className="p-4 sm:p-5">
            {/* Header - Name & Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Tag size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {request.templateName}
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                    ID: {request.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              {getStatusBadge(request.status)}
            </div>

            {/* College Info */}
            <div className="flex items-start gap-2 mb-2.5 p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <Building size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-gray-900 dark:text-white truncate">
                  {request.representativeName}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                  <User size={9} />
                  {request.name}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Mail size={12} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{request.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Phone size={12} className="text-gray-400 flex-shrink-0" />
                <span>{request.phone}</span>
              </div>
            </div>

            {/* Plan & Type Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {getPlanBadge(request.plan)}
              {getTypeBadge(request.type)}
              <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto flex items-center gap-1">
                <Calendar size={10} />
                {formatDate(request.createdAt)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              {request.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingRequest === request.id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-500/30 rounded-lg transition-all text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingRequest === request.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check size={13} />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={processingRequest === request.id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/30 rounded-lg transition-all text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={13} />
                    Reject
                  </button>
                </>
              ) : (
                <span className="flex-1 text-center text-[10px] text-gray-500 dark:text-gray-400">
                  {request.status === 'approved' ? '✓ Request Approved' : '✗ Request Rejected'}
                </span>
              )}
              
              <button
                onClick={() => handleDelete(request.id)}
                disabled={processingRequest === request.id}
                className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                title="Delete Request"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {request.status === 'approved' && (
              <div className="mt-2 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
                <p className="text-[10px] text-green-600 dark:text-green-400 text-center">
                  ✓ Credentials have been sent to the user's email
                </p>
              </div>
            )}

            {request.status === 'rejected' && (
              <div className="mt-2 p-2 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-[10px] text-red-600 dark:text-red-400 text-center">
                  ✗ Request has been rejected
                </p>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}