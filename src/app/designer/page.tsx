/* eslint-disable @typescript-eslint/no-explicit-any */
// app/designer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Calendar,
  ArrowUpRight,
  Star,
  Users,
  ShoppingBag,
  Upload
} from 'lucide-react';

interface DesignStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  totalEarnings: number;
  monthlyEarnings: number;
  totalDownloads: number;
  totalLikes: number;
}

interface RecentActivity {
  id: number;
  type: 'approved' | 'sold' | 'uploaded' | 'rejected';
  title: string;
  date: string;
  amount?: number;
}

interface MonthlyEarning {
  month: string;
  earnings: number;
}

export default function DesignerDashboard() {
  const [designer, setDesigner] = useState<any>(null);
  const [stats, setStats] = useState<DesignStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    totalDownloads: 0,
    totalLikes: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('designer_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        setDesigner(authData.user);
        fetchDashboardData(authData.user.id);
      } catch (e) {
        console.error('Error parsing auth');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (designerId: number) => {
    try {
      const response = await fetch(`/api/designer/dashboard?designerId=${designerId}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentActivities(data.recentActivities || []);
        setMonthlyEarnings(data.monthlyEarnings || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'approved': return <CheckCircle size={16} className="text-green-500" />;
      case 'sold': return <ShoppingBag size={16} className="text-blue-500" />;
      case 'uploaded': return <Upload size={16} className="text-purple-500" />;
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const maxEarning = monthlyEarnings.length > 0 ? Math.max(...monthlyEarnings.map(m => m.earnings)) : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {designer?.name || 'Designer'}! 👋</h1>
        <p className="text-blue-100">Here&lsquo;s what&lsquo;s happening with your designs today.</p>
      </div>

      {/* Stats Cards - Only 2 cards now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Layers size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Designs</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-green-600">✓ {stats.approved} approved</span>
            <span className="text-yellow-600">⏳ {stats.pending} pending</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <ArrowUpRight size={16} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalEarnings}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
          <p className="text-xs text-green-600 mt-2">+${stats.monthlyEarnings} this month</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Earnings</h3>
          {monthlyEarnings.length > 0 ? (
            <div className="flex items-end gap-3 h-48">
              {monthlyEarnings.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${(item.earnings / maxEarning) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-gray-500">{item.month}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">${item.earnings}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">No earnings data yet</div>
          )}
        </div>

        {/* Design Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design Status</h3>
          {stats.total > 0 ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Approved</span>
                  <span className="text-green-600">{stats.approved} ({Math.round((stats.approved/stats.total)*100)}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2" style={{ width: `${(stats.approved/stats.total)*100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Pending Review</span>
                  <span className="text-yellow-600">{stats.pending} ({Math.round((stats.pending/stats.total)*100)}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 rounded-full h-2" style={{ width: `${(stats.pending/stats.total)*100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Rejected</span>
                  <span className="text-red-600">{stats.rejected} ({Math.round((stats.rejected/stats.total)*100)}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 rounded-full h-2" style={{ width: `${(stats.rejected/stats.total)*100}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">No designs uploaded yet</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="text-sm font-semibold text-green-600">+${activity.amount}</span>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
}