'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Palette, Download, Trash2, Check, X, User, Calendar, 
  AlertTriangle, CheckCircle, TrendingUp, Building2, RefreshCw,
  Activity, Zap, Shield, BarChart3, PieChart as PieChartIcon,
  Loader2, Bell, Clock, MoreVertical, Search, Sparkles, Crown,
  LayoutDashboard, Users, School, Award, Globe, Target, Eye
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

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, isDarkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl shadow-xl border border-[#E8CA5E]/30 bg-[#0F172A]/95 backdrop-blur-sm">
        <p className="font-semibold text-sm text-[#E8CA5E] mb-1">{label}</p>
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
  const [statusData, setStatusData] = useState<PieChartData[]>([]);

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
      { name: 'Active', value: active, color: '#00E0FF' },
      { name: 'Inactive', value: inactive, color: '#E8CA5E' }
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
      addToast('Data deletion approved successfully!', 'success');
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
    addToast('Delete request rejected', 'success');
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

  const pieChartData = statusData.map(item => ({
    name: item.name,
    value: item.value,
    color: item.color
  }));

  // Premium Stats Data
  const premiumStats = [
    { 
      title: "Total Colleges", 
      value: total.toString(), 
      icon: School, 
      gradient: "from-[#1F4381] to-[#00E0FF]",
      trend: "+12% this month",
      bgGlow: "#1F4381"
    },
    { 
      title: "Active Institutions", 
      value: active.toString(), 
      icon: Building2, 
      gradient: "from-[#00E0FF] to-[#E8CA5E]",
      trend: `${activePercentage}% of total`,
      bgGlow: "#00E0FF"
    },
    { 
      title: "Pending Requests", 
      value: pendingDeleteRequests.toString(), 
      icon: Bell, 
      gradient: "from-[#E8CA5E] to-[#A57F2A]",
      trend: "Awaiting approval",
      bgGlow: "#E8CA5E"
    },
    { 
      title: "Success Rate", 
      value: `${activePercentage}%`, 
      icon: Award, 
      gradient: "from-[#1F4381] to-[#E8CA5E]",
      trend: "Active colleges ratio",
      bgGlow: "#E8CA5E"
    }
  ];

  return (
    <MainLayout>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
              toast.type === 'success' 
                ? 'bg-gradient-to-r from-[#00E0FF]/10 to-[#E8CA5E]/10 border-[#00E0FF]/30' 
                : 'bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30'
            } backdrop-blur-md`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} className="text-[#00E0FF]" />
            ) : (
              <X size={18} className="text-red-400" />
            )}
            <span className={`text-sm font-medium ${toast.type === 'success' ? 'text-white' : 'text-red-300'}`}>
              {toast.message}
            </span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
              <X size={14} className="text-gray-400 hover:text-white transition-colors" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8"
      >
        {/* Premium Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1F4381]/20 via-[#00E0FF]/10 to-[#E8CA5E]/20 border border-[#E8CA5E]/30 p-6 backdrop-blur-sm">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8CA5E]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00E0FF]/10 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-r from-[#E8CA5E] to-[#00E0FF] rounded-full blur-xl opacity-60 animate-pulse" />
                  <Crown size={32} className="text-[#E8CA5E] relative z-10" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#E8CA5E] via-[#00E0FF] to-[#E8CA5E] bg-clip-text text-transparent animate-gradient">
                  Dashboard
                </h1>
                <Sparkles size={24} className="text-[#E8CA5E] animate-pulse" />
              </div>
              <p className="text-sm text-gray-400 ml-12">
                Welcome back! Here's what's happening with your platform today
              </p>
            </div>
            
            {/* Premium Search Bar */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-[#E8CA5E]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges, themes, or settings..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F172A]/80 border border-[#1E293B] text-white placeholder-gray-500 focus:outline-none focus:border-[#00E0FF] transition-all duration-300 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X size={16} className="text-gray-400 hover:text-white transition-colors" />
                </button>
              )}
              <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#E8CA5E]/20 to-[#00E0FF]/20 blur-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {premiumStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] hover:border-[#00E0FF]/50 transition-all duration-300"
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{stat.trend}</div>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
                  <div className="mt-2 h-1 w-full bg-[#1E293B] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${index === 0 ? (total > 0 ? 100 : 0) : index === 1 ? activePercentage : index === 2 ? (pendingDeleteRequests > 0 ? 100 : 0) : activePercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Premium Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Plus, label: 'Add College', desc: 'Register new institution', onClick: handleAdd, color: "from-[#1F4381] to-[#00E0FF]" },
            { icon: Palette, label: 'Manage Themes', desc: 'Customize appearance', onClick: handleThemes, color: "from-[#E8CA5E] to-[#A57F2A]" },
            { icon: Download, label: 'Backup Data', desc: 'Export all data', onClick: handleBackup, color: "from-[#00E0FF] to-[#1F4381]" },
            { icon: Trash2, label: 'Delete Requests', desc: `${pendingDeleteRequests} pending`, onClick: () => setShowDeleteRequests(true), color: "from-[#E8CA5E] to-[#A57F2A]", alert: pendingDeleteRequests > 0 }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.onClick}
              className={`group relative p-4 rounded-2xl transition-all duration-300 bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] hover:border-[#00E0FF]/50 overflow-hidden ${action.alert ? 'ring-2 ring-[#E8CA5E]/50' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-white">
                    {action.label}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {action.desc}
                  </p>
                </div>
              </div>
              {action.alert && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E8CA5E] rounded-full animate-pulse" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Premium Charts Section */}
        {colleges.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Chart - Growth Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] hover:border-[#00E0FF]/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <TrendingUp size={20} className="text-[#00E0FF]" />
                    Growth Trend
                  </h3>
                  <p className="text-sm text-gray-500">
                    Monthly college registration growth
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#00E0FF]" />
                    <span className="text-xs text-gray-400">Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#E8CA5E]" />
                    <span className="text-xs text-gray-400">Total</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineChartData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E8CA5E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E8CA5E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E0FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00E0FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={(props) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                    <Area type="monotone" dataKey="colleges" stroke="#E8CA5E" fill="url(#colorTotal)" name="Total Colleges" strokeWidth={2} />
                    <Area type="monotone" dataKey="active" stroke="#00E0FF" fill="url(#colorActive)" name="Active Colleges" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Chart - Status Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] hover:border-[#00E0FF]/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <PieChartIcon size={20} className="text-[#E8CA5E]" />
                    Status Distribution
                  </h3>
                  <p className="text-sm text-gray-500">
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
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={(props) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00E0FF]" />
                  <span className="text-sm text-gray-400">Active: {active}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E8CA5E]" />
                  <span className="text-sm text-gray-400">Inactive: {inactive}</span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-[#1F4381]/20 to-[#E8CA5E]/20 flex items-center justify-center mb-4">
              <School size={40} className="text-[#E8CA5E]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No College Data
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Start by adding your first college to see analytics
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-2.5 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E8CA5E]/30 transition-all duration-300"
            >
              + Add College
            </button>
          </motion.div>
        )}

        {/* Performance Summary Card */}
        {colleges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#1E293B] hover:border-[#00E0FF]/30 transition-all duration-300"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
              <Activity size={18} className="text-[#E8CA5E]" />
              Performance Summary
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Active Colleges</span>
                  <span className="text-[#00E0FF] font-semibold">{active}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1E293B] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(active / total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00E0FF] to-[#E8CA5E]"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Inactive Colleges</span>
                  <span className="text-[#E8CA5E] font-semibold">{inactive}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1E293B] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(inactive / total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A]"
                  />
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#1E293B]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Institutions</span>
                  <span className="text-white font-semibold">{total}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-[#E8CA5E] font-semibold">{activePercentage}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Delete Requests Modal - Premium Styled */}
        <AnimatePresence>
          {showDeleteRequests && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteRequests(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#E8CA5E]/30"
              >
                <div className="p-6 border-b border-[#1E293B]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#E8CA5E]/10 rounded-xl">
                        <Trash2 className="text-[#E8CA5E]" size={20} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Delete Requests
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowDeleteRequests(false)}
                      className="p-1 rounded-lg hover:bg-[#1E293B] transition-colors"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                  {deleteRequests.filter(req => req.status === 'pending').length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto rounded-full bg-[#00E0FF]/10 flex items-center justify-center mb-4">
                        <CheckCircle size={32} className="text-[#00E0FF]" />
                      </div>
                      <p className="text-lg text-white">No pending requests</p>
                      <p className="text-sm text-gray-500">All clear!</p>
                    </div>
                  ) : (
                    deleteRequests.filter(req => req.status === 'pending').map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-xl bg-[#0F172A]/50 border border-[#1E293B] hover:border-[#E8CA5E]/30 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E8CA5E]/20 to-[#00E0FF]/20 flex items-center justify-center">
                                <User size={16} className="text-[#E8CA5E]" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">
                                  {request.userName}
                                </h4>
                                <p className="text-sm text-gray-400">
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
                              className="px-4 py-2 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectDeleteRequest(request.id)}
                              className="px-4 py-2 bg-[#1E293B] hover:bg-[#2D3A4E] text-gray-300 rounded-lg text-sm font-medium transition"
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

        {/* Approval Confirmation Modal - Premium Styled */}
        <AnimatePresence>
          {approveConfirmModal.show && approveConfirmModal.request && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border border-[#E8CA5E]/30"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#E8CA5E]/10 rounded-full">
                      <AlertTriangle className="text-[#E8CA5E]" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Confirm Deletion
                      </h3>
                      <p className="text-sm text-gray-400">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-[#E8CA5E]/10 to-[#00E0FF]/10 border border-[#E8CA5E]/30">
                    <p className="font-semibold text-[#E8CA5E]">
                      {approveConfirmModal.request.userName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {approveConfirmModal.request.contactNumber}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#E8CA5E]/5 border border-[#E8CA5E]/20 mb-6">
                    <p className="text-xs text-gray-400">
                      ⚠️ This will permanently delete all colleges, themes, and settings
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setApproveConfirmModal({ show: false, request: null })}
                      className="px-4 py-2 rounded-lg font-medium transition bg-[#1E293B] hover:bg-[#2D3A4E] text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApproveDeleteRequest}
                      className="px-4 py-2 bg-gradient-to-r from-[#E8CA5E] to-[#A57F2A] text-[#1F4381] rounded-lg font-medium transition hover:shadow-lg flex items-center gap-2"
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

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </MainLayout>
  );
}