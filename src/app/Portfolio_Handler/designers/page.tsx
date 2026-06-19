// app/Portfolio_Handler/designers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Eye, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Code2,
  Palette
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
  cv_filename: string;
  cv_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  total_designs?: number;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function DesignersPage() {
  const router = useRouter();
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/designers');
      const data = await response.json();
      if (data.success) {
        // Fetch design counts for each designer
        const designersWithCounts = await Promise.all(
          (data.data || []).map(async (designer: Designer) => {
            const designsRes = await fetch(`/api/designers/${designer.id}/designs`);
            const designsData = await designsRes.json();
            return {
              ...designer,
              total_designs: designsData.count || 0
            };
          })
        );
        setDesigners(designersWithCounts);
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default:
        return null;
    }
  };

  const handleViewDetails = (designerId: number) => {
    router.push(`/Portfolio_Handler/designers/${designerId}`);
  };

  const filteredDesigners = designers.filter(designer => {
    if (statusFilter !== 'all' && designer.status !== statusFilter) return false;
    if (searchTerm && !designer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !designer.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !designer.specialization?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: designers.length,
    approved: designers.filter(d => d.status === 'approved').length,
    pending: designers.filter(d => d.status === 'pending').length,
    rejected: designers.filter(d => d.status === 'rejected').length,
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={48} className="animate-spin text-purple-500" />
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
              <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 dark:text-white">Designers</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all registered designers</p>
            </div>
            <button
              onClick={fetchDesigners}
              disabled={refreshing}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Designers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.approved}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">Rejected</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Designers Table - Responsive */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Designer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Specialization</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Designs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDesigners.map((designer) => (
                    <tr key={designer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <User size={14} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{designer.name}</p>
                            <p className="text-xs text-gray-500">{designer.company || 'Freelancer'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{designer.email}</p>
                        <p className="text-xs text-gray-500">{designer.phone || 'No phone'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                          {designer.specialization || 'N/A'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{designer.experience} exp</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-purple-600">{designer.total_designs || 0}</span>
                        <p className="text-xs text-gray-500">designs</p>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(designer.status)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetails(designer.id)}
                          className="px-3 py-1.5 hover:cursor-pointer bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDesigners.length === 0 && (
              <div className="text-center py-12">
                <User size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No designers found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}