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

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
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
      <div className="p-3 rounded-xl shadow-xl border border-blue-500/30 bg-gray-900/95 backdrop-blur-sm">
        <p className="font-semibold text-sm text-yellow-500 mb-1">{label}</p>
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
  const [toasts, setToasts] = useState<Toast[]>([]);
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
        addToast('Colleges loaded successfully!', 'success');
      } catch (error) {
        console.error('Error fetching colleges:', error);
        addToast('Failed to load college data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
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
      { name: 'Active', value: active, color: '#3B82F6' },
      { name: 'Inactive', value: inactive, color: '#EAB308' }
    ]);
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 5000);
  };

  const total = colleges.length;
  const active = colleges.filter((c) => c.is_active).length;
  const inactive = colleges.filter((c) => !c.is_active).length;
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

  // Stats Data with solid colors
  const stats = [
    { 
      title: "Total Colleges", 
      value: total.toString(), 
      icon: School, 
      bgColor: "bg-blue-600",
      trend: "+12% this month"
    },
    { 
      title: "Active Institutions", 
      value: active.toString(), 
      icon: Building2, 
      bgColor: "bg-blue-500",
      trend: `${activePercentage}% of total`
    },
    { 
      title: "Inactive Institutions", 
      value: inactive.toString(), 
      icon: AlertTriangle, 
      bgColor: "bg-yellow-500",
      trend: "Need attention"
    },
    { 
      title: "Success Rate", 
      value: `${activePercentage}%`, 
      icon: Award, 
      bgColor: "bg-yellow-600",
      trend: "Active colleges ratio"
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
                ? 'bg-gray-900 border-blue-500' 
                : toast.type === 'error'
                ? 'bg-gray-900 border-red-500'
                : 'bg-gray-900 border-yellow-500'
            } backdrop-blur-md`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} className="text-blue-500" />
            ) : toast.type === 'error' ? (
              <X size={18} className="text-red-400" />
            ) : (
              <Bell size={18} className="text-yellow-500" />
            )}
            <span className={`text-sm font-medium ${
              toast.type === 'success' ? 'text-white' : 
              toast.type === 'error' ? 'text-red-300' : 'text-yellow-300'
            }`}>
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
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-blue-500/30 p-6">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown size={32} className="text-yellow-500" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Dashboard
                </h1>
                <Sparkles size={24} className="text-yellow-500" />
              </div>
              <p className="text-sm text-gray-400 ml-12">
                Welcome back! Here's what's happening with your platform today
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-yellow-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges, themes, or settings..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X size={16} className="text-gray-400 hover:text-white transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative group overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="relative p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-lg`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{stat.trend}</div>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
                  <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${index === 0 ? (total > 0 ? 100 : 0) : index === 1 ? activePercentage : index === 2 ? (inactive > 0 ? 100 : 0) : activePercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${index === 0 || index === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Plus, label: 'Add College', desc: 'Register new institution', onClick: handleAdd, color: "bg-blue-600" },
            { icon: Palette, label: 'Manage Themes', desc: 'Customize appearance', onClick: handleThemes, color: "bg-yellow-600" },
            { icon: Download, label: 'Backup Data', desc: 'Export all data', onClick: handleBackup, color: "bg-blue-500" },
            { icon: RefreshCw, label: 'Refresh Data', desc: 'Sync latest data', onClick: refreshCollegeData, color: "bg-yellow-500", loading: refreshing }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.onClick}
              disabled={action.loading}
              className={`group relative p-4 rounded-2xl transition-all duration-300 bg-gray-900 border border-gray-800 hover:border-blue-500/50 overflow-hidden ${action.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {action.loading ? <Loader2 size={18} className="text-white animate-spin" /> : <action.icon size={18} className="text-white" />}
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
            </motion.button>
          ))}
        </div>

        {/* Charts Section */}
        {colleges.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Chart - Growth Trend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <TrendingUp size={20} className="text-blue-500" />
                    Growth Trend
                  </h3>
                  <p className="text-sm text-gray-500">
                    Monthly college registration growth
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs text-gray-400">Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-xs text-gray-400">Total</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineChartData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={(props) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                    <Area type="monotone" dataKey="colleges" stroke="#EAB308" fill="url(#colorTotal)" name="Total Colleges" strokeWidth={2} />
                    <Area type="monotone" dataKey="active" stroke="#3B82F6" fill="url(#colorActive)" name="Active Colleges" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Chart - Status Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                    <PieChartIcon size={20} className="text-yellow-500" />
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
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-400">Active: {active}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-400">Inactive: {inactive}</span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 rounded-2xl bg-gray-900 border border-gray-800 text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
              <School size={40} className="text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No College Data
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Start by adding your first college to see analytics
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
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
            className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/30 transition-all duration-300"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
              <Activity size={18} className="text-yellow-500" />
              Performance Summary
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Active Colleges</span>
                  <span className="text-blue-500 font-semibold">{active}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(active / total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-blue-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Inactive Colleges</span>
                  <span className="text-yellow-500 font-semibold">{inactive}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(inactive / total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full bg-yellow-500"
                  />
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Institutions</span>
                  <span className="text-white font-semibold">{total}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-yellow-500 font-semibold">{activePercentage}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
}