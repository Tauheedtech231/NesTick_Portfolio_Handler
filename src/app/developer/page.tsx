/* eslint-disable react/no-unescaped-entities */
// app/developer/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  CheckCircle, 
  DollarSign, 
  Bell,
  TrendingUp,
  Clock,
  Award,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalAssigned: number;
  pendingSubmissions: number;
  completedDesigns: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
}

interface RecentAssignment {
  id: number;
  design_title: string;
  status: string;
  assigned_at: string;
  deadline: string;
}

export default function DeveloperDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssigned: 0,
    pendingSubmissions: 0,
    completedDesigns: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0
  });
  const [recentAssignments, setRecentAssignments] = useState<RecentAssignment[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchDashboardData = async () => {
      try {
        const developerId = getDeveloperId();
        if (!developerId) {
          console.error('Developer ID required for dashboard fetch');
          setLoading(false);
          return;
        }

        const [statsRes, assignmentsRes] = await Promise.all([
          fetch(`/api/developer/dashboard?developerId=${developerId}`),
          fetch(`/api/developer/assignments?limit=5&developerId=${developerId}`)
        ]);
        
        const statsData = await statsRes.json();
        const assignmentsData = await assignmentsRes.json();
        
        if (statsData.success) setStats(statsData.data);
        if (assignmentsData.success) setRecentAssignments(assignmentsData.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Assigned Designs', value: stats.totalAssigned, icon: FolderOpen, color: 'bg-blue-500', change: '+0' },
    { title: 'Pending Submissions', value: stats.pendingSubmissions, icon: Clock, color: 'bg-yellow-500', change: 'Need action' },
    { title: 'Completed', value: stats.completedDesigns, icon: CheckCircle, color: 'bg-green-500', change: '+0' },
    { title: 'Total Earnings', value: `$${stats.totalEarnings}`, icon: DollarSign, color: 'bg-purple-500', change: 'Lifetime' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Pending</span>;
      case 'in_progress': return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">In Progress</span>;
      case 'submitted': return <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">Submitted</span>;
      case 'approved': return <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Approved</span>;
      default: return <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs">{status}</span>;
    }
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's your development overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <Icon size={22} className={`${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings Summary</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Earnings</span>
              <span className="font-semibold text-gray-900 dark:text-white">${stats.totalEarnings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending Payment</span>
              <span className="font-semibold text-yellow-500">${stats.pendingEarnings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Paid Amount</span>
              <span className="font-semibold text-green-500">${stats.paidEarnings}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link href="/developer/earnings" className="flex items-center justify-between text-purple-500 hover:text-purple-600 transition-colors">
                <span className="text-sm">View Details</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link href="/developer/assigned-designs" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <FolderOpen size={18} className="text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">View Assigned Designs</span>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
            <Link href="/developer/submit-design" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Submit Completed Design</span>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
            <Link href="/developer/withdrawals" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <DollarSign size={18} className="text-purple-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Request Withdrawal</span>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Assignments</h2>
          </div>
          <Link href="/developer/assigned-designs" className="text-sm text-purple-500 hover:text-purple-600">
            View All
          </Link>
        </div>
        
        {recentAssignments.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No designs assigned yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{assignment.design_title}</p>
                  <p className="text-xs text-gray-500 mt-1">Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(assignment.status)}
                  <Link href={`/developer/submit-design?id=${assignment.id}`} className="text-purple-500 hover:text-purple-600">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}