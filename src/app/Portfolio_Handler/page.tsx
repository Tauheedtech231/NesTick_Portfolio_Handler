'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Palette, Download, Check, X, User, Calendar, 
  AlertTriangle, CheckCircle, TrendingUp, Building2, RefreshCw,
  Activity, Loader2, Bell, Search, Sparkles, Crown,
  LayoutDashboard, Users, School, Award, Grid, FileText,
  ChevronRight, Zap, FileCode, Handshake, UserPlus as UserPlusIcon,
  Layers, Blocks,
  Clock
} from 'lucide-react';
/* eslint-disable */
import { MainLayout } from './components/layout/main-layout';

// Import Recharts for professional charts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, Brush } from 'recharts';

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

interface DashboardStats {
  totalColleges: number;
  activeInstitutes: number;
  inactiveInstitutes: number;
  totalDesigns: number;
  totalTemplates: number;
  totalDesigners: number;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, isDarkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl shadow-xl border border-blue-500/30 bg-gray-900/95 backdrop-blur-sm">
        <p className="font-semibold text-xs text-yellow-500 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-[11px]">
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
  const [activeQuickTab, setActiveQuickTab] = useState<'template' | 'partner' | 'designer'>('template');

  // Stats states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalColleges: 0,
    activeInstitutes: 0,
    inactiveInstitutes: 0,
    totalDesigns: 0,
    totalTemplates: 0,
    totalDesigners: 0
  });

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
        
        // Update colleges stats
        const total = data.length || 0;
        const active = data.filter((c: any) => c.is_active).length || 0;
        const inactive = total - active;
        
        setDashboardStats(prev => ({
          ...prev,
          totalColleges: total,
          activeInstitutes: active,
          inactiveInstitutes: inactive
        }));
        
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

  // Fetch extra stats (designers, designs, templates)
  const fetchExtraStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const result = await response.json();
      
      if (result.success) {
        setDashboardStats(prev => ({
          ...prev,
          totalDesigners: result.data.totalDesigners || 0,
          totalDesigns: result.data.totalDesigns || 0,
          totalTemplates: result.data.totalTemplates || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching extra stats:', error);
      addToast('Failed to load dashboard statistics', 'error');
    }
  };

  // Fetch extra stats on mount
  useEffect(() => {
    fetchExtraStats();
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

  const total = dashboardStats.totalColleges;
  const active = dashboardStats.activeInstitutes;
  const inactive = dashboardStats.inactiveInstitutes;
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
      
      const total = data.length || 0;
      const active = data.filter((c: any) => c.is_active).length || 0;
      const inactive = total - active;
      
      setDashboardStats(prev => ({
        ...prev,
        totalColleges: total,
        activeInstitutes: active,
        inactiveInstitutes: inactive
      }));
      
      await fetchExtraStats();
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

  // All 6 Stats Data
  const allStats = [
    { 
      title: "Number of Colleges", 
      value: dashboardStats.totalColleges.toString(), 
      icon: School, 
      bgColor: "bg-blue-600",
      trend: "Total registered colleges"
    },
    { 
      title: "Active Institutes", 
      value: dashboardStats.activeInstitutes.toString(), 
      icon: Building2, 
      bgColor: "bg-green-600",
      trend: `${activePercentage}% of total`
    },
    { 
      title: "Inactive Institutes", 
      value: dashboardStats.inactiveInstitutes.toString(), 
      icon: AlertTriangle, 
      bgColor: "bg-yellow-500",
      trend: "Need attention"
    },
    { 
      title: "Total Designs", 
      value: dashboardStats.totalDesigns.toString(), 
      icon: LayoutDashboard, 
      bgColor: "bg-purple-600",
      trend: "Designer designs"
    },
    { 
      title: "Total Templates", 
      value: dashboardStats.totalTemplates.toString(), 
      icon: Grid, 
      bgColor: "bg-indigo-600",
      trend: "Available templates"
    },
    { 
      title: "Number of Designers", 
      value: dashboardStats.totalDesigners.toString(), 
      icon: Users, 
      bgColor: "bg-teal-600",
      trend: "Registered designers"
    }
  ];

  // Tab Content for Quick Actions
  const tabContent = {
    template: {
      title: "Template Requests",
      icon: FileCode,
      description: "Manage template requests from colleges",
      actions: [
        { label: "View All Template Requests", href: "/Portfolio_Handler/Requested_template", icon: FileText },
        { label: "Manage Templates", href: "/Portfolio_Handler/themes", icon: Palette },
        { label: "Template Categories", href: "/Portfolio_Handler/modules", icon: Layers }
      ]
    },
    partner: {
      title: "Partner Requests",
      icon: Handshake,
      description: "Manage partner & collaboration requests",
      actions: [
        { label: "View Partner Applications", href: "/Portfolio_Handler/partners-designers", icon: Users },
        { label: "Pending Approvals", href: "/Portfolio_Handler/partners-designers?status=pending", icon: Clock },
        { label: "Approved Partners", href: "/Portfolio_Handler/partners-designers?status=approved", icon: CheckCircle }
      ]
    },
    designer: {
      title: "Designer Requests",
      icon: UserPlusIcon,
      description: "Manage designer registrations & designs",
      actions: [
        { label: "View Designers", href: "/Portfolio_Handler/partners-designers", icon: Users },
        { label: "Pending Designs", href: "/Portfolio_Handler/design-management", icon: Brush },
        { label: "Design Approvals", href: "/Portfolio_Handler/design-management?status=pending", icon: Clock }
      ]
    }
  };

  const tabs = [
    { id: 'template', label: 'Template Request', icon: FileCode },
    { id: 'partner', label: 'Partner Request', icon: Handshake },
    { id: 'designer', label: 'Designer Request', icon: UserPlusIcon }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-yellow-500 mx-auto mb-4" />
            <p className="text-xs text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

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
            className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border cursor-pointer ${
              toast.type === 'success' 
                ? 'bg-gray-900 border-blue-500' 
                : toast.type === 'error'
                ? 'bg-gray-900 border-red-500'
                : 'bg-gray-900 border-yellow-500'
            } backdrop-blur-md`}
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} className="text-blue-500" />
            ) : toast.type === 'error' ? (
              <X size={18} className="text-red-400" />
            ) : (
              <Bell size={18} className="text-yellow-500" />
            )}
            <span className={`text-xs font-medium ${
              toast.type === 'success' ? 'text-white' : 
              toast.type === 'error' ? 'text-red-300' : 'text-yellow-300'
            }`}>
              {toast.message}
            </span>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="cursor-pointer"
            >
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
                <Crown size={28} className="text-yellow-500" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Dashboard
                </h1>
                <Sparkles size={20} className="text-yellow-500" />
              </div>
              <p className="text-xs text-gray-400 ml-12">
                Welcome back! Here's what's happening with your platform today
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-yellow-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges, themes, or settings..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500 transition-all duration-300 cursor-pointer"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  <X size={14} className="text-gray-400 hover:text-white transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid - 6 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
          {allStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="relative group overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  // Add click functionality if needed
                }}
              >
                <div className="relative p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-lg`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{stat.trend}</div>
                    </div>
                  </div>
                  <h3 className="text-xs font-medium text-gray-400">{stat.title}</h3>
                  <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: stat.value !== "0" ? "100%" : "0%" }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full rounded-full ${index < 3 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions - Tabbed Interface */}
        <div className="rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" />
              Quick Actions
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">Manage requests and approvals</p>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-800 px-5">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeQuickTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveQuickTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all duration-300 border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-yellow-500 text-yellow-500'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <TabIcon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuickTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-gray-800"
            >
              {tabContent[activeQuickTab].actions.map((action, idx) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => router.push(action.href)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="text-left">
                        <h4 className="font-medium text-white text-xs group-hover:text-yellow-500 transition-colors">
                          {action.label}
                        </h4>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
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
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-white">
                    <TrendingUp size={18} className="text-blue-500" />
                    Growth Trend
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Monthly college registration growth
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-gray-400">Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="text-[10px] text-gray-400">Total</span>
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
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} />
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
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-white">
                    <Activity size={18} className="text-yellow-500" />
                    Status Distribution
                  </h3>
                  <p className="text-[11px] text-gray-500">
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
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-[11px] text-gray-400">Active: {active}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="text-[11px] text-gray-400">Inactive: {inactive}</span>
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
            <h3 className="text-lg font-semibold text-white mb-2">
              No College Data
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Start by adding your first college to see analytics
            </p>
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all duration-300 cursor-pointer"
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
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-white">
              <Activity size={16} className="text-yellow-500" />
              Performance Summary
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
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
                <div className="flex justify-between text-xs mb-2">
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
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Total Institutions</span>
                  <span className="text-white font-semibold">{total}</span>
                </div>
                <div className="flex justify-between text-xs mt-2">
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