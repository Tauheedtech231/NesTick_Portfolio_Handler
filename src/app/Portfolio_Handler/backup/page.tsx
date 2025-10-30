'use client';
/* eslint-disable */
import { MainLayout } from '../components/layout/main-layout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Database, AlertTriangle } from 'lucide-react';

export default function BackupPage() {
  const [storageSize, setStorageSize] = useState<string>('0 KB');
  const [lastBackup, setLastBackup] = useState<string>('Never');
  const [showClearModal, setShowClearModal] = useState(false);
  const [dataSummary, setDataSummary] = useState<{ [key: string]: number }>({});

  // ✅ Run only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      calculateStorageSize();
      loadLastBackupTime();
      calculateDataSummary();
    }
  }, []);

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

        alert('✅ Data imported successfully! Reloading...');
        window.location.reload();
      } catch (error) {
        alert('❌ Error importing data. Invalid format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // ✅ Clear all localStorage
  const clearAllData = () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
    calculateStorageSize();
    setLastBackup('Never');
    setShowClearModal(false);
    setDataSummary({});
    alert('🗑️ All data cleared! Reloading...');
    window.location.reload();
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
      title: 'Clear All Data',
      description: 'Permanently delete all data',
      buttonText: 'Clear Data',
      onClick: () => setShowClearModal(true),
      color: 'bg-red-600 hover:bg-red-700',
    },
  ];

  return (
    <MainLayout>
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

    {/* Clear Data Modal */}
    {showClearModal && (
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
                Clear All Data
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will permanently delete all colleges, themes, announcements, and settings.
              Please export your data first if needed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearAllData}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Clear All Data
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
