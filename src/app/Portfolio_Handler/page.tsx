'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Palette, Download, Trash2, Check, X, User, Calendar } from 'lucide-react';

import { MainLayout } from './components/layout/main-layout';
import { StatsCard } from './components/dashboard/stats-card';
import { College } from '@/app/types';

interface DeleteRequest {
  id: string;
  userName: string;
  contactNumber: string;
  status: 'pending' | 'approved';
  requestedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [deleteRequests, setDeleteRequests] = useState<DeleteRequest[]>([]);
  const [showDeleteRequests, setShowDeleteRequests] = useState(false);

  // Load colleges from localStorage once on mount
useEffect(() => {
  const stored = localStorage.getItem('colleges');
  // console.log("The stored colleges are:", stored);

  if (stored) {
    const parsed = JSON.parse(stored);
    setColleges(parsed);

    // Print modules names with true/false
    // parsed.forEach((college: any) => {
    //   console.log(`College: ${college.name}`);
    //   Object.entries(college.modules).forEach(([moduleName, status]) => {
    //     console.log(`  ${moduleName}: ${status}`);
    //   });
    // });
  }
}, []);



  // Load delete requests from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('deleteRequests');
    if (stored) {
      setDeleteRequests(JSON.parse(stored));
    }
  }, []);

  const total = colleges.length;
  const active = colleges.filter((c) => c.status === 'active').length;
  const inactive = colleges.filter((c) => c.status === 'inactive').length;
  const pendingDeleteRequests = deleteRequests.filter(req => req.status === 'pending').length;

  const handleAdd = () => router.push('/Portfolio_Handler/colleges');
  const handleThemes = () => router.push('/Portfolio_Handler/themes');

  const handleBackup = () => {
    const data = {
      colleges: localStorage.getItem('colleges'),
      themes: localStorage.getItem('themes'),
      announcements: localStorage.getItem('announcements'),
      settings: localStorage.getItem('settings'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-backup.json';
    link.click();
  };
  //handle id logic
  // useEffect(() => {
  //   // LocalStorage se data get karo
  //   const storedData = localStorage.getItem('colleges');

  //   if (storedData) {
  //     try {
  //       // JSON parse karo
  //       const college = JSON.parse(storedData);

  //       // Agar ek array hai
  //       if (Array.isArray(college)) {
  //         college.forEach((c) => console.log('College ID:', c.id));
  //       } 
  //       // Agar single object hai
  //       else {
  //         console.log('College ID:', college.id);
  //       }
  //     } catch (error) {
  //       console.error('Error parsing college data:', error);
  //     }
  //   } else {
  //     console.log('No college data found in localStorage');
  //   }
  // }, []);

  // NEW: Handle approving delete requests
  const handleApproveDeleteRequest = (requestId: string) => {
    // Clear all data except deleteRequests
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

    alert('✅ Data deletion approved and all data has been cleared!');
    // Optionally reload the page to reflect changes
    // window.location.reload();
  };

  // NEW: Handle rejecting delete requests
  const handleRejectDeleteRequest = (requestId: string) => {
    const updatedRequests = deleteRequests.filter(req => req.id !== requestId);
    setDeleteRequests(updatedRequests);
    localStorage.setItem('deleteRequests', JSON.stringify(updatedRequests));
    
    alert('❌ Delete request has been rejected.');
  };

  // NEW: Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="min-h-screen bg-white dark:bg-black p-6 space-y-8 transition-colors duration-300"
      >
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Dashboard
          </h1>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Colleges"
            value={total.toString()}
            description="All registered colleges"
            trend="+2 this month"
          />
          <StatsCard
            title="Active Colleges"
            value={active.toString()}
            description="Currently active portfolios"
            trend="+12% from last month"
          />
          <StatsCard
            title="Disabled Colleges"
            value={inactive.toString()}
            description="Inactive portfolios"
            trend="-5% from last month"
          />
          <StatsCard
            title="Pending Deletions"
            value={pendingDeleteRequests.toString()}
            description="Awaiting approval"
            trend="Needs attention"
            alert={pendingDeleteRequests > 0}
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
                       bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                       hover:shadow-md hover:shadow-gray-400/10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100/20 to-gray-300/10 
                            dark:from-gray-800/30 dark:to-gray-700/20 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

            <Plus size={24} className="text-gray-900 dark:text-white relative z-10" />
            <div className="relative z-10 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">Add College</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Register a new college</p>
            </div>
          </motion.button>

          {/* Manage Themes */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleThemes}
            className="group relative flex items-center space-x-3 p-6 rounded-2xl shadow-sm 
                       bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                       hover:shadow-md hover:shadow-gray-400/10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100/20 to-gray-300/10 
                            dark:from-gray-800/30 dark:to-gray-700/20 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

            <Palette size={24} className="text-gray-900 dark:text-white relative z-10" />
            <div className="relative z-10 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">Manage Themes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize appearance</p>
            </div>
          </motion.button>

          {/* Backup Data */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackup}
            className="group relative flex items-center space-x-3 p-6 rounded-2xl shadow-sm 
                       bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                       hover:shadow-md hover:shadow-gray-400/10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100/20 to-gray-300/10 
                            dark:from-gray-800/30 dark:to-gray-700/20 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

            <Download size={24} className="text-gray-900 dark:text-white relative z-10" />
            <div className="relative z-10 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">Backup Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Export all data</p>
            </div>
          </motion.button>

          {/* NEW: Manage Delete Requests */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDeleteRequests(true)}
            className={`group relative flex items-center space-x-3 p-6 rounded-2xl shadow-sm 
                       border transition-all duration-300 ${
                         pendingDeleteRequests > 0
                           ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:shadow-red-400/10'
                           : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-gray-400/10'
                       }`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none ${
              pendingDeleteRequests > 0
                ? 'bg-gradient-to-b from-red-100/20 to-red-300/10 dark:from-red-800/30 dark:to-red-700/20'
                : 'bg-gradient-to-b from-gray-100/20 to-gray-300/10 dark:from-gray-800/30 dark:to-gray-700/20'
            }`}></div>

            <Trash2 size={24} className={`relative z-10 ${
              pendingDeleteRequests > 0 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-900 dark:text-white'
            }`} />
            <div className="relative z-10 text-left">
              <h3 className={`font-semibold ${
                pendingDeleteRequests > 0 
                  ? 'text-red-800 dark:text-red-300' 
                  : 'text-gray-900 dark:text-white'
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

        {/* Analytics */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              College Status Distribution
            </h3>
            <div className="space-y-4 text-gray-800 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span>Active Colleges</span>
                <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-gray-900 dark:bg-gray-100"
                    style={{ width: `${total ? (active / total) * 100 : 0}%` }}
                  />
                </div>
                <span>{active}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Inactive Colleges</span>
                <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-gray-500 dark:bg-gray-400"
                    style={{ width: `${total ? (inactive / total) * 100 : 0}%` }}
                  />
                </div>
                <span>{inactive}</span>
              </div>
            </div>
          </div>

          {/* NEW: Delete Requests Summary */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              Delete Requests Summary
            </h3>
            <div className="space-y-4 text-gray-800 dark:text-gray-300">
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

        {/* NEW: Delete Requests Modal */}
        {showDeleteRequests && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="text-red-600 dark:text-red-400" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
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
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="h-10 w-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                <User size={16} className="text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
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
                              onClick={() => handleApproveDeleteRequest(request.id)}
                              className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                              title="Approve and Delete Data"
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectDeleteRequest(request.id)}
                              className="flex items-center space-x-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition text-sm"
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

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
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
      </motion.div>
    </MainLayout>
  );
}