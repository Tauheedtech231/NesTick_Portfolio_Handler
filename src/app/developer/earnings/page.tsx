// app/developer/earnings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Earning {
  id: number;
  design_title: string;
  amount: number;
  platform_fee: number;
  developer_earning: number;
  status: string;
  purchased_at: string;
  buyer_name: string;
  buyer_email: string;
}

interface EarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalSales: number;
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [summary, setSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/developer/earnings');
      const data = await response.json();
      if (data.success) {
        setEarnings(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportEarnings = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/developer/earnings/export');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting earnings:', error);
    } finally {
      setExporting(false);
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
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Earnings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your earnings and payment history</p>
        </div>
        <button
          onClick={exportEarnings}
          disabled={exporting}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all flex items-center gap-2"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${summary.totalEarnings}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payment</p>
              <p className="text-2xl font-bold text-yellow-500">${summary.pendingEarnings}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid Amount</p>
              <p className="text-2xl font-bold text-green-500">${summary.paidEarnings}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-blue-500">{summary.totalSales}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Earnings Table */}
      {earnings.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No earnings yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Design</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Your Share</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {earnings.map((earning) => (
                  <motion.tr
                    key={earning.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{earning.design_title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{earning.buyer_name}</p>
                      <p className="text-xs text-gray-500">{earning.buyer_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white">${earning.amount}</p>
                      <p className="text-xs text-gray-500">Fee: ${earning.platform_fee}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">${earning.developer_earning}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(earning.purchased_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        earning.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400'
                          : earning.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {earning.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Withdrawal Button */}
      {summary.pendingEarnings > 0 && (
        <div className="flex justify-center">
          <Link
            href="/developer/withdrawals"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-105 transition-all"
          >
            Request Withdrawal (${summary.pendingEarnings} available)
          </Link>
        </div>
      )}
    </div>
  );
}