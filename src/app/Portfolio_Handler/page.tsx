'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Palette, Download, Trash2, Check, X, User, Calendar, AlertTriangle, CheckCircle, TrendingUp, Building2 } from 'lucide-react';

import { MainLayout } from './components/layout/main-layout';
import { StatsCard } from './components/dashboard/stats-card';

// Import Recharts for professional charts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

// College interface matching your backend
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

// Fixed Chart data interfaces
interface ChartData {
  month: string;
  colleges: number;
  active: number;
  inactive: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

// Type for Pie chart data that matches Recharts expectations
interface PieChartData {
  name: string;
  value: number;
  color: string;
}/* eslint-disable */


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

  // Chart data states
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]);
  const [statusData, setStatusData] = useState<PieChartData[]>([]);

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

  // Load delete requests from localStorage (keeping this as is)
  useEffect(() => {
    const stored = localStorage.getItem('deleteRequests');
    if (stored) {
      setDeleteRequests(JSON.parse(stored));
    }
  }, []);

  // Generate chart data based on colleges
  const generateChartData = (collegesData: College[]) => {
    if (!collegesData.length) return;

    // Group colleges by month of creation
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

    // Convert to array and sort by date
    const chartData: ChartData[] = Object.entries(monthlyData)
      .map(([monthYear, data]) => {
        const [year, month] = monthYear.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          month: `${monthNames[parseInt(month) - 1]} ${year}`,
          colleges: data.total,
          active: data.active,
          inactive: data.inactive
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });

    setLineChartData(chartData);

    // Status distribution for pie chart
    const active = collegesData.filter(c => c.is_active).length;
    const inactive = collegesData.filter(c => !c.is_active).length;
    
    setStatusData([
      { name: 'Active', value: active, color: '#10B981' },
      { name: 'Inactive', value: inactive, color: '#EF4444' }
    ]);
  };

  // Toast notification system
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const total = colleges.length;
  const active = colleges.filter((c) => c.is_active).length;
  const inactive = colleges.filter((c) => !c.is_active).length;
  const pendingDeleteRequests = deleteRequests.filter(req => req.status === 'pending').length;

  const handleAdd = () => router.push('/Portfolio_Handler/colleges');
  const handleThemes = () => router.push('/Portfolio_Handler/themes');

  const handleBackup = async () => {
    try {
      // Fetch all data from APIs for backup
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

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
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

  // Show approval confirmation modal
  const showApproveConfirmation = (request: DeleteRequest) => {
    setApproveConfirmModal({ show: true, request });
  };

  // Handle approving delete requests
  const handleApproveDeleteRequest = async () => {
    if (!approveConfirmModal.request) return;

    try {
      const requestId = approveConfirmModal.request.id;
      
      // First, delete all colleges from backend
      const response = await fetch('/api/colleges', {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete colleges from backend');
      }

      // Clear all data except deleteRequests from localStorage
      const savedDeleteRequests = localStorage.getItem('deleteRequests');
      localStorage.clear();
      
      // Restore delete requests but mark this one as approved
      if (savedDeleteRequests) {
        const requests = JSON.parse(savedDeleteRequests);
        const updatedRequests = requests.map((req: DeleteRequest) => 
          req.id === requestId ? { ...req, status: 'approved' } : req
        );
        localStorage.setItem('deleteRequests', JSON.stringify(updatedRequests));
        setDeleteRequests(updatedRequests);
      }

      // Update colleges state to empty
      setColleges([]);
      setLineChartData([]);
      setStatusData([]);

      // Close modal and show success toast
      setApproveConfirmModal({ show: false, request: null });
      addToast('✅ Data deletion approved and all colleges have been deleted!', 'success');
      
      // Close the delete requests modal if open
      setShowDeleteRequests(false);
    } catch (error) {
      console.error('Error approving delete request:', error);
      addToast('Failed to delete colleges from backend', 'error');
    }
  };

  // Handle rejecting delete requests
  const handleRejectDeleteRequest = (requestId: string) => {
    const updatedRequests = deleteRequests.filter(req => req.id !== requestId);
    setDeleteRequests(updatedRequests);
    localStorage.setItem('deleteRequests', JSON.stringify(updatedRequests));
    
    addToast('❌ Delete request has been rejected.', 'success');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Fixed Pie chart label function
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, name
  }: any) => {
    if (typeof percent === 'undefined') return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Refresh college data
  const refreshCollegeData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/colleges');
      if (!response.ok) throw new Error('Failed to fetch colleges');
      const data = await response.json();
      setColleges(data);
      generateChartData(data);
      addToast('College data refreshed successfully!', 'success');
    } catch (error) {
      console.error('Error refreshing colleges:', error);
      addToast('Failed to refresh college data', 'error');
    } finally {
      setLoading(false);
    }
  };

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
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border ${
              toast.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <X size={20} className="text-red-600" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`p-1 rounded-full hover:bg-opacity-20 ${
                toast.type === 'success' 
                  ? 'hover:bg-green-600 text-green-600' 
                  : 'hover:bg-red-600 text-red-600'
              }`}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="min-h-screen bg-white dark:bg-gray-900 p-6 space-y-8 transition-colors duration-300"
      >
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <button
            onClick={refreshCollegeData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Refresh Data</span>
              </>
            )}
          </button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Colleges"
            value={total.toString()}
            description="All registered colleges"
            icon={<Building2 className="text-blue-600" size={24} />}
            trend="Real-time data from backend"
          />
          <StatsCard
            title="Active Colleges"
            value={active.toString()}
            description="Currently active"
            icon={<CheckCircle className="text-green-600" size={24} />}
            trend={`${total > 0 ? ((active / total) * 100).toFixed(1) : 0}% of total`}
          />
          <StatsCard
            title="Inactive Colleges"
            value={inactive.toString()}
            description="Not active"
            icon={<X className="text-red-600" size={24} />}
            trend={`${total > 0 ? ((inactive / total) * 100).toFixed(1) : 0}% of total`}
          />
          <StatsCard
            title="Pending Deletions"
            value={pendingDeleteRequests.toString()}
            description="Awaiting approval"
            icon={<AlertTriangle className="text-yellow-600" size={24} />}
            alert={pendingDeleteRequests > 0}
            trend="Local storage only"
          />
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Add College */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="group relative flex items-center space-x-3 p-6 rounded-2xl shadow-sm 
                       bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       hover:shadow-md transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/20 to-gray-100/10 
                            dark:from-gray-700/30 dark:to-gray-600/20 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

            <Plus size={24} className="text-gray-700 dark:text-gray-200 relative z-10" />
            <div className="relative z-10 text-left">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Add College</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Register a new college</p>
            </div>
          </motion.button>

          {/* Manage Themes */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleThemes}
            className="group relative flex items-center space-x-3 p-6 rounded-2xl shadow-sm 
                       bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       hover:shadow-md transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/20 to-gray-100/10 
                            dark:from-gray-700/30 dark:to-gray-600/20 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

            <Palette size={24} className="text-gray-700 dark:text-gray-200 relative z-10" />
            <div className="relative z-10 text-left">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Manage Themes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize appearance</p>
            </div>
          </motion.button>

          {/* Backup Data */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackup}
            className="group relative flex items-center space-x-3 p-6 rounded-2xl shadow-sm 
                       bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       hover:shadow-md transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/20 to-gray-100/10 
                            dark:from-gray-700/30 dark:to-gray-600/20 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

            <Download size={24} className="text-gray-700 dark:text-gray-200 relative z-10" />
            <div className="relative z-10 text-left">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Backup Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Export all data</p>
            </div>
          </motion.button>

          {/* Manage Delete Requests */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDeleteRequests(true)}
            className={`group relative flex items-center space-x-3 p-6 rounded-2xl shadow-sm 
                       border transition-all duration-300 ${
                         pendingDeleteRequests > 0
                           ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:shadow-md'
                           : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                       }`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none ${
              pendingDeleteRequests > 0
                ? 'bg-gradient-to-b from-red-50/20 to-red-100/10 dark:from-red-800/30 dark:to-red-700/20'
                : 'bg-gradient-to-b from-gray-50/20 to-gray-100/10 dark:from-gray-700/30 dark:to-gray-600/20'
            }`}></div>

            <Trash2 size={24} className={`relative z-10 ${
              pendingDeleteRequests > 0 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-700 dark:text-gray-200'
            }`} />
            <div className="relative z-10 text-left">
              <h3 className={`font-semibold ${
                pendingDeleteRequests > 0 
                  ? 'text-red-700 dark:text-red-300' 
                  : 'text-gray-700 dark:text-gray-200'
              }`}>
                Delete Requests
              </h3>
              <p className={`text-sm ${
                pendingDeleteRequests > 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {pendingDeleteRequests} pending
              </p>
            </div>
          </motion.button>
        </section>

        {/* Professional Charts Section */}
        {colleges.length > 0 ? (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart - College Growth Trend */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp size={20} />
                    College Growth Trend
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Monthly college registration growth
                  </p>
                </div>
              </div>
              <div className="h-80">
                {lineChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6B7280"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#6B7280"
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="colleges" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#1D4ED8' }}
                        name="Total Colleges"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="active" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        name="Active Colleges"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No chart data available
                  </div>
                )}
              </div>
            </div>

            {/* Status Distribution Pie Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Status Distribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Active vs Inactive colleges
                  </p>
                </div>
              </div>
              <div className="h-80">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData as unknown as { name?: string; value: number; color?: string }[]}
                        nameKey="status"
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No data for status distribution
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : !loading && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Building2 size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No College Data</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first college</p>
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
            >
              Add College
            </button>
          </div>
        )}

        {/* Analytics Summary Cards */}
        {colleges.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                College Status Distribution
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between items-center">
                  <span>Active Colleges</span>
                  <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${total ? (active / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span>{active}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Inactive Colleges</span>
                  <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${total ? (inactive / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span>{inactive}</span>
                </div>
              </div>
            </div>

            {/* Delete Requests Summary */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Delete Requests Summary
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between items-center">
                  <span>Pending Requests</span>
                  <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{ width: `${pendingDeleteRequests > 0 ? 100 : 0}%` }}
                    />
                  </div>
                  <span className={pendingDeleteRequests > 0 ? 'text-yellow-600 font-semibold' : ''}>
                    {pendingDeleteRequests}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Total Requests</span>
                  <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <span>{deleteRequests.length}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Delete Requests Modal */}
        {showDeleteRequests && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="text-red-600 dark:text-red-400" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Data Deletion Requests
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDeleteRequests(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {deleteRequests.filter(req => req.status === 'pending').length === 0 ? (
                  <div className="text-center py-8">
                    <Trash2 size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No pending deletion requests</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      All deletion requests have been processed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deleteRequests.filter(req => req.status === 'pending').map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="h-10 w-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                <User size={16} className="text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {request.userName}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {request.contactNumber}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                Requested: {formatDate(request.requestedAt)}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => showApproveConfirmation(request)}
                              className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                              title="Approve and Delete Data"
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectDeleteRequest(request.id)}
                              className="flex items-center space-x-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition text-sm"
                              title="Reject Request"
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Total pending: {deleteRequests.filter(req => req.status === 'pending').length}
                  </span>
                  <span>
                    Total requests: {deleteRequests.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Approval Confirmation Modal */}
        <AnimatePresence>
          {approveConfirmModal.show && approveConfirmModal.request && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                      <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Confirm Data Deletion
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      You are about to approve the deletion request from:
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="font-semibold text-red-800 dark:text-red-300">
                        {approveConfirmModal.request.userName}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {approveConfirmModal.request.contactNumber}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                      Requested on: {formatDate(approveConfirmModal.request.requestedAt)}
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Warning: This will permanently delete all data
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          • All colleges from database ({colleges.length} colleges)<br/>
                          • All themes and settings from localStorage<br/>
                          • All announcements<br/>
                          • This action cannot be reversed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setApproveConfirmModal({ show: false, request: null })}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                               border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                               transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApproveDeleteRequest}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                               transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Delete All Data</span>
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