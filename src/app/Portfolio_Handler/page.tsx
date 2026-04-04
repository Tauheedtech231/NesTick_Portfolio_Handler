'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Palette, Download, Trash2, Check, X, User, Calendar, 
  AlertTriangle, CheckCircle, TrendingUp, Building2, RefreshCw,
  Activity, Zap, Shield, BarChart3, PieChart as PieChartIcon,
  Loader2, Bell, Clock, MoreVertical, Search, Sparkles, Crown
} from 'lucide-react';
/* eslint-disable */
import { MainLayout } from './components/layout/main-layout';
import { StatsCard } from './components/dashboard/stats-card';

// Import Recharts for professional charts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

interface DeleteRequest {
  id: string;
  userName: string;
  contactNumber: string;
  status: 'pending' | 'approved';
  requestedAt: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface College {
  id: number;
  name: string;
  email: string;
  website: string;
  city: string;
  country: string;
  phone: string;
  template_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  template_name?: string;
}

interface ChartData {
  month: string;
  colleges: number;
  active: number;
  inactive: number;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

// Define proper type for Recharts pie chart data
interface RechartsPieData {
  name: string;
  value: number;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [deleteRequests, setDeleteRequests] = useState<DeleteRequest[]>([]);
  const [showDeleteRequests, setShowDeleteRequests] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [approveConfirmModal, setApproveConfirmModal] = useState<{show: boolean; request: DeleteRequest | null}>({
    show: false,
    request: null
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Chart data states
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]);
  const [statusData, setStatusData] = useState<RechartsPieData[]>([]);

  // Theme detection
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDarkNow);
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch colleges from backend API
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/colleges');
        if (!response.ok) throw new Error('Failed to fetch colleges');
        const data = await response.json();
        setColleges(data);
        generateChartData(data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
        addToast('Failed to load college data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Load delete requests from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('deleteRequests');
    if (stored) {
      setDeleteRequests(JSON.parse(stored));
    }
  }, []);

  const generateChartData = (collegesData: College[]) => {
    if (!collegesData.length) return;

    const monthlyData: Record<string, { total: number; active: number; inactive: number }> = {};
    
    collegesData.forEach(college => {
      const date = new Date(college.created_at);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { total: 0, active: 0, inactive: 0 };
      }
      
      monthlyData[monthYear].total += 1;
      if (college.is_active) {
        monthlyData[monthYear].active += 1;
      } else {
        monthlyData[monthYear].inactive += 1;
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData: ChartData[] = Object.entries(monthlyData)
      .map(([monthYear, data]) => {
        const [year, month] = monthYear.split('-');
        return {
          month: `${monthNames[parseInt(month) - 1]} ${year}`,
          colleges: data.total,
          active: data.active,
          inactive: data.inactive
        };
      })
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    setLineChartData(chartData);

    const active = collegesData.filter(c => c.is_active).length;
    const inactive = collegesData.filter(c => !c.is_active).length;
    
    setStatusData([
      { name: 'Active', value: active, color: '#10B981' },
      { name: 'Inactive', value: inactive, color: '#EF4444' }
    ]);
  };

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 5000);
  };

  const total = colleges.length;
  const active = colleges.filter((c) => c.is_active).length;
  const inactive = colleges.filter((c) => !c.is_active).length;
  const pendingDeleteRequests = deleteRequests.filter(req => req.status === 'pending').length;
  const activePercentage = total > 0 ? ((active / total) * 100).toFixed(1) : 0;

  const handleAdd = () => router.push('/Portfolio_Handler/colleges');
  const handleThemes = () => router.push('/Portfolio_Handler/themes');

  const handleBackup = async () => {
    try {
      const [collegesRes, templatesRes] = await Promise.all([
        fetch('/api/colleges'),
        fetch('/api/templates')
      ]);

      const collegesData = await collegesRes.json();
      const templatesData = templatesRes.ok ? await templatesRes.json() : [];

      const data = {
        timestamp: new Date().toISOString(),
        colleges: collegesData,
        templates: templatesData.templates || templatesData,
        deleteRequests: localStorage.getItem('deleteRequests') ? JSON.parse(localStorage.getItem('deleteRequests')!) : [],
        settings: localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')!) : {}
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      addToast('Backup created successfully!', 'success');
    } catch (error) {
      console.error('Backup failed:', error);
      addToast('Failed to create backup', 'error');
    }
  };

  const showApproveConfirmation = (request: DeleteRequest) => {
    setApproveConfirmModal({ show: true, request });
  };

  const handleApproveDeleteRequest = async () => {
    if (!approveConfirmModal.request) return;

    try {
      const requestId = approveConfirmModal.request.id;
      
      const response = await fetch('/api/colleges', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete colleges');

      const savedDeleteRequests = localStorage.getItem('deleteRequests');
      localStorage.clear();
      
      if (savedDeleteRequests) {
        const requests = JSON.parse(savedDeleteRequests);
        const updatedRequests = requests.map((req: DeleteRequest) => 
          req.id === requestId ? { ...req, status: 'approved' } : req
        );
        localStorage.setItem('deleteRequests', JSON.stringify(updatedRequests));
        setDeleteRequests(updatedRequests);
      }

      setColleges([]);
      setLineChartData([]);
      setStatusData([]);

      setApproveConfirmModal({ show: false, request: null });
      addToast('✅ Data deletion approved successfully!', 'success');
      setShowDeleteRequests(false);
    } catch (error) {
      console.error('Error approving delete request:', error);
      addToast('Failed to delete colleges', 'error');
    }
  };

  const handleRejectDeleteRequest = (requestId: string) => {
    const updatedRequests = deleteRequests.filter(req => req.id !== requestId);
    setDeleteRequests(updatedRequests);
    localStorage.setItem('deleteRequests', JSON.stringify(updatedRequests));
    addToast('❌ Delete request rejected', 'success');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const refreshCollegeData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/colleges');
      if (!response.ok) throw new Error('Failed to fetch colleges');
      const data = await response.json();
      setColleges(data);
      generateChartData(data);
      addToast('Data refreshed successfully!', 'success');
    } catch (error) {
      console.error('Error refreshing colleges:', error);
      addToast('Failed to refresh data', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <p className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Convert data for pie chart to match Recharts expected format
  const pieChartData = statusData.map(item => ({
    name: item.name,
    value: item.value,
    color: item.color
  }));

  return (
    <MainLayout>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
              toast.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
            ) : (
              <X size={18} className="text-red-600 dark:text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              toast.type === 'success' 
                ? 'text-green-800 dark:text-green-300' 
                : 'text-red-800 dark:text-red-300'
            }`}>
              {toast.message}
            </span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
              <X size={14} className="text-gray-500 hover:text-gray-700 dark:text-gray-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 transition-colors duration-300"
      >
        {/* Header with Welcome Admin and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full blur-xl opacity-60 animate-pulse" />
                <Crown size={32} className="text-[#FFD700] relative z-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent animate-gradient">
                Welcome back, Admin!
              </h1>
              <Sparkles size={24} className="text-[#FFD700] animate-pulse" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
              Here's what's happening with your platform today
            </p>
          </div>
          
          {/* Cool Search Input */}
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleges, themes, or settings..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 ${
                isDarkMode
                  ? 'bg-[#0F172A] border-[#1E293B] text-white placeholder-gray-500 focus:border-[#FFD700]'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#FFD700]'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={16} className="text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
            {/* Animated border glow on focus */}
            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 blur-md" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <StatsCard
            title="Total Colleges"
            value={total.toString()}
            description="All registered colleges"
            icon={<Building2 size={24} />}
            trend="Real-time data"
          />
          <StatsCard
            title="Active Colleges"
            value={active.toString()}
            description="Currently active"
            icon={<CheckCircle size={24} />}
            trend={`${activePercentage}% of total`}
          />
          <StatsCard
            title="Inactive Colleges"
            value={inactive.toString()}
            description="Not active"
            icon={<X size={24} />}
            trend={`${total > 0 ? ((inactive / total) * 100).toFixed(1) : 0}% of total`}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Plus, label: 'Add College', desc: 'Register new college', onClick: handleAdd, color: 'from-blue-500 to-blue-600' },
            { icon: Palette, label: 'Manage Themes', desc: 'Customize appearance', onClick: handleThemes, color: 'from-purple-500 to-purple-600' },
            { icon: Download, label: 'Backup Data', desc: 'Export all data', onClick: handleBackup, color: 'from-green-500 to-green-600' },
            { icon: Trash2, label: 'Delete Requests', desc: `${pendingDeleteRequests} pending`, onClick: () => setShowDeleteRequests(true), color: 'from-red-500 to-red-600', alert: pendingDeleteRequests > 0 }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.onClick}
              className={`group relative p-4 rounded-2xl transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#0F172A] border border-[#1E293B] hover:border-[#FFD700]/50'
                  : 'bg-white border border-gray-200 hover:border-[#FFD700]/50'
              } ${action.alert ? 'ring-2 ring-red-500/50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}>
                  <action.icon size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {action.label}
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {action.desc}
                  </p>
                </div>
              </div>
              {action.alert && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Charts Section */}
        {colleges.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border ${
                isDarkMode ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`font-semibold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <TrendingUp size={20} className="text-[#FFD700]" />
                    Growth Trend
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Monthly college registration growth
                  </p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineChartData}>
                    <defs>
                      <linearGradient id="colorColleges" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#1E293B' : '#E5E7EB'} />
                    <XAxis dataKey="month" stroke={isDarkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
                    <YAxis stroke={isDarkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="colleges" stroke="#FFD700" fill="url(#colorColleges)" name="Total Colleges" />
                    <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="Active" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Chart - Fixed TypeScript Error */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border ${
                isDarkMode ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`font-semibold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <PieChartIcon size={20} className="text-[#FFD700]" />
                    Status Distribution
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Active vs Inactive colleges
                  </p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => {
                        const safePercent = percent || 0;
                        return `${name}: ${(safePercent * 100).toFixed(0)}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl border text-center ${
              isDarkMode ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'
            }`}
          >
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No College Data
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Start by adding your first college
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 text-black rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Add College
            </button>
          </motion.div>
        )}

        {/* Analytics Summary */}
        {colleges.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl border ${
                isDarkMode ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Activity size={18} className="text-[#FFD700]" />
                College Status Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Active Colleges</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{active}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(active / total) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Inactive Colleges</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{inactive}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(inactive / total) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Requests Modal */}
        <AnimatePresence>
          {showDeleteRequests && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteRequests(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-xl">
                        <Trash2 className="text-red-600 dark:text-red-400" size={20} />
                      </div>
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Delete Requests
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowDeleteRequests(false)}
                      className={`p-1 rounded-lg transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                  {deleteRequests.filter(req => req.status === 'pending').length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                      <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        No pending requests
                      </p>
                    </div>
                  ) : (
                    deleteRequests.filter(req => req.status === 'pending').map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border ${
                          isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <User size={16} className="text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {request.userName}
                                </h4>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {request.contactNumber}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock size={12} />
                              <span>Requested: {formatDate(request.requestedAt)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => showApproveConfirmation(request)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectDeleteRequest(request.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                isDarkMode
                                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Approval Confirmation Modal */}
        <AnimatePresence>
          {approveConfirmModal.show && approveConfirmModal.request && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`rounded-2xl shadow-xl w-full max-w-md overflow-hidden border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Confirm Deletion
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  
                  <div className={`mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800`}>
                    <p className={`font-semibold text-red-800 dark:text-red-300`}>
                      {approveConfirmModal.request.userName}
                    </p>
                    <p className={`text-sm text-red-600 dark:text-red-400`}>
                      {approveConfirmModal.request.contactNumber}
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6`}>
                    <p className={`text-xs ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                      ⚠️ This will permanently delete all colleges, themes, and settings
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setApproveConfirmModal({ show: false, request: null })}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApproveDeleteRequest}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete All
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MainLayout>
  );
}