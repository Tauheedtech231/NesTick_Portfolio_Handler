// app/developer/completed-designs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ExternalLink, 
  Calendar, 
  Eye,
  Search,
  AlertCircle,
  Download,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

interface CompletedDesign {
  id: number;
  design_id: number;
  design_title: string;
  design_description: string;
  designer_name: string;
  submission_url: string;
  approved_at: string;
  amount?: number;
}

export default function CompletedDesignsPage() {
  const [designs, setDesigns] = useState<CompletedDesign[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<CompletedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getDeveloperId = (): string | null => {
    const auth = sessionStorage.getItem('developer_auth');
    if (!auth) return null;
    try {
      const parsed = JSON.parse(auth);
      return parsed?.user?.id ? parsed.user.id.toString() : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchCompletedDesigns();
  }, []);

  useEffect(() => {
    filterDesigns();
  }, [searchTerm, designs]);

  const fetchCompletedDesigns = async () => {
    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        console.error('Developer ID required for completed designs fetch');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/developer/assignments?status=approved&developerId=${developerId}`);
      const data = await response.json();
      if (data.success) {
        setDesigns(data.data);
        setFilteredDesigns(data.data);
      }
    } catch (error) {
      console.error('Error fetching completed designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDesigns = () => {
    let filtered = [...designs];
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.design_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.designer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredDesigns(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Completed Designs</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">All your approved and completed designs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{designs.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${designs.reduce((sum, d) => sum + (d.amount || 0), 0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active in Market</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{designs.length}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by design name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Designs Grid */}
      {filteredDesigns.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No completed designs yet</p>
          <Link href="/developer/assigned-designs" className="text-purple-500 hover:underline text-sm mt-2 inline-block">
            Go to assigned designs →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-500 transition-all group"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {design.design_title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {design.design_description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar size={12} />
                  <span>Approved: {new Date(design.approved_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  {design.submission_url && (
                    <a
                      href={design.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                  <Link
                    href={`/developer/submit-design?id=${design.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    <Eye size={14} />
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}