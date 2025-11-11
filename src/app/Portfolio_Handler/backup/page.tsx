'use client';
/* eslint-disable */
import { MainLayout } from '../components/layout/main-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Database, AlertTriangle, User, Phone, CheckCircle, X, XCircle } from 'lucide-react';

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

export default function BackupPage() {
  const [storageSize, setStorageSize] = useState<string>('0 KB');
  const [lastBackup, setLastBackup] = useState<string>('Never');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [dataSummary, setDataSummary] = useState<{ [key: string]: number }>({});
  const [formData, setFormData] = useState({
    userName: '',
    contactNumber: ''
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ✅ Run only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      calculateStorageSize();
      loadLastBackupTime();
      calculateDataSummary();
    }
  }, []);

  // ✅ Add toast notification
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  // ✅ Remove toast notification
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // ✅ Calculate localStorage total size
  const calculateStorageSize = () => {
    let totalSize = 0;
    if (typeof window === 'undefined') return;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          totalSize += localStorage[key].length * 2;
        } catch {}
      }
    }
    setStorageSize(formatBytes(totalSize));
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // ✅ Load backup time
  const loadLastBackupTime = () => {
    if (typeof window === 'undefined') return;
    const lastBackupTime = localStorage.getItem('lastBackupTime');
    if (lastBackupTime) {
      setLastBackup(new Date(lastBackupTime).toLocaleString());
    }
  };

  // ✅ Export Data
  const exportData = () => {
    if (typeof window === 'undefined') return;

    const data: { [key: string]: any } = {};
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          data[key] = JSON.parse(localStorage[key]);
        } catch {
          data[key] = localStorage[key];
        }
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    const now = new Date().toISOString();
    localStorage.setItem('lastBackupTime', now);
    setLastBackup(new Date(now).toLocaleString());
  };

  // ✅ Import Data
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === 'undefined') return;

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        localStorage.clear();
        for (let key in data) {
          if (typeof data[key] === 'string') {
            localStorage.setItem(key, data[key]);
          } else {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        }

        const now = new Date().toISOString();
        localStorage.setItem('lastBackupTime', now);
        setLastBackup(new Date(now).toLocaleString());
        calculateStorageSize();
        calculateDataSummary();

        addToast('✅ Data imported successfully! Reloading...', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        addToast('❌ Error importing data. Invalid format.', 'error');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // ✅ NEW: Submit delete request
  const submitDeleteRequest = () => {
    if (!formData.userName.trim() || !formData.contactNumber.trim()) {
      addToast('Please fill in both name and contact number', 'error');
      return;
    }

    const deleteRequest: DeleteRequest = {
      id: Date.now().toString(),
      userName: formData.userName.trim(),
      contactNumber: formData.contactNumber.trim(),
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    // Get existing delete requests or initialize empty array
    const existingRequests = JSON.parse(localStorage.getItem('deleteRequests') || '[]');
    const updatedRequests = [...existingRequests, deleteRequest];
    
    localStorage.setItem('deleteRequests', JSON.stringify(updatedRequests));
    
    // Reset form and close modals
    setFormData({ userName: '', contactNumber: '' });
    setShowFormModal(false);
    setShowConfirmModal(false);
    
    addToast('✅ Delete request submitted successfully! It is now pending admin approval.', 'success');
  };

  // ✅ Calculate Data Summary safely
  const calculateDataSummary = () => {
    if (typeof window === 'undefined') return;

    const summary: { [key: string]: number } = {};
    const keys = ['colleges', 'announcements', 'settings'];
    keys.forEach((key) => {
      const data = localStorage.getItem(key);
      try {
        summary[key] = data ? (key === 'settings' ? 1 : JSON.parse(data).length) : 0;
      } catch {
        summary[key] = 0;
      }
    });
    setDataSummary(summary);
  };

  const backupActions = [
    {
      icon: Download,
      title: 'Export Data',
      description: 'Download all data as JSON file',
      buttonText: 'Export',
      onClick: exportData,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: Upload,
      title: 'Import Data',
      description: 'Upload JSON file to restore data',
      buttonText: 'Import',
      onClick: () => document.getElementById('import-file')?.click(),
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: Trash2,
      title: 'Request Data Deletion',
      description: 'Submit a request to delete all data' ,
      buttonText: 'Request Deletion',
      onClick: () => setShowConfirmModal(true),
      color: 'bg-red-600 hover:bg-red-700',
    },
  ];

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
              <XCircle size={20} className="text-red-600" />
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
        className="space-y-6 transition-colors duration-300"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Data & Backup
          </h1>
        </div>

        {/* Storage Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Database className="text-gray-700 dark:text-gray-300" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Storage Usage</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{storageSize}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Local storage consumption</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Download className="text-gray-700 dark:text-gray-300" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Last Backup</h3>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{lastBackup}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Most recent data export</p>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {backupActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700"
            >
              <action.icon size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{action.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={action.onClick}
                className={`w-full py-2 px-4 rounded-lg text-white bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 transition-all duration-300`}
              >
                {action.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Hidden file input for import */}
        <input
          id="import-file"
          type="file"
          accept=".json"
          onChange={importData}
          className="hidden"
        />

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Request Data Deletion
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This will submit a request to delete all data. An admin will review your request 
                  and approve it before any data is actually deleted.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      setShowFormModal(true);
                    }}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Form Modal */}
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="text-red-600 dark:text-red-400" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Submit Deletion Request
                  </h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your contact number"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitDeleteRequest}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.userName.trim() || !formData.contactNumber.trim()}
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ✅ Safe Data Summary */}
        {typeof window !== 'undefined' && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Data Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['colleges', 'announcements', 'settings'].map((key) => (
                <div
                  key={key}
                  className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {dataSummary[key] || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
}