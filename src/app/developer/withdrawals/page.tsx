/* eslint-disable @typescript-eslint/no-explicit-any */
// app/developer/withdrawals/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Send, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
  Banknote,
  CreditCard,
  Landmark
} from 'lucide-react';
import Link from 'next/link';

interface Withdrawal {
  id: number;
  amount: number;
  method: string;
  account_details: any;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [accountDetails, setAccountDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWithdrawals();
    fetchBalance();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/developer/withdrawals');
      const data = await response.json();
      if (data.success) {
        setWithdrawals(data.data);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/developer/earnings?summary=true');
      const data = await response.json();
      if (data.success) {
        setAvailableBalance(data.pendingEarnings || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amountNum > availableBalance) {
      setError('Amount exceeds available balance');
      return;
    }
    if (amountNum < 10) {
      setError('Minimum withdrawal amount is $10');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      let accountDetailsObj = {};
      if (method === 'bank_transfer') {
        const [bankName, accountName, accountNumber, iban] = accountDetails.split('|');
        accountDetailsObj = { bankName, accountName, accountNumber, iban };
      } else if (method === 'easy_paisa' || method === 'jazz_cash') {
        const [accountNumber, accountName] = accountDetails.split('|');
        accountDetailsObj = { accountNumber, accountName };
      } else {
        accountDetailsObj = { email: accountDetails };
      }

      const response = await fetch('/api/developer/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          method,
          accountDetails: accountDetailsObj
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Withdrawal request submitted successfully!');
        setShowForm(false);
        setAmount('');
        setAccountDetails('');
        fetchWithdrawals();
        fetchBalance();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      setError('Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'processing':
        return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Processing</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Completed</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> Rejected</span>;
      default:
        return <span className="text-xs text-gray-400">{status}</span>;
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Withdrawals</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Request and track your payouts</p>
      </div>

      {/* Available Balance */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm">Available for Withdrawal</p>
            <p className="text-3xl font-bold">${availableBalance}</p>
            <p className="text-purple-200 text-xs mt-1">Minimum withdrawal: $10</p>
          </div>
          <Wallet className="w-12 h-12 text-purple-300 opacity-50" />
        </div>
        {availableBalance >= 10 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
          >
            {showForm ? 'Cancel' : 'Request Withdrawal'}
          </button>
        )}
      </div>

      {/* Withdrawal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">New Withdrawal Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="10"
                  max={availableBalance}
                  step="1"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'bank_transfer', label: 'Bank Transfer', icon: Landmark },
                    { value: 'easy_paisa', label: 'EasyPaisa', icon: CreditCard },
                    { value: 'jazz_cash', label: 'JazzCash', icon: CreditCard },
                    { value: 'paypal', label: 'PayPal', icon: Banknote }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        method === option.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={option.value}
                        checked={method === option.value}
                        onChange={(e) => setMethod(e.target.value)}
                        className="hidden"
                      />
                      <option.icon size={18} className={method === option.value ? 'text-purple-500' : 'text-gray-400'} />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {method === 'paypal' ? 'PayPal Email' : 
                   method === 'easy_paisa' || method === 'jazz_cash' ? 'Account Number | Account Name' : 
                   'Bank Name | Account Name | Account Number | IBAN'}
                </label>
                <textarea
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  rows={2}
                  placeholder={
                    method === 'paypal' ? 'your-email@example.com' :
                    method === 'easy_paisa' || method === 'jazz_cash' ? '03001234567 | John Doe' :
                    'Bank of Example | John Doe | 123456789 | PK36ABCD123456789'
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                Submit Request
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdrawal History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Withdrawal History</h2>
        </div>
        {withdrawals.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No withdrawal requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Requested On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">${withdrawal.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {withdrawal.method.replace('_', ' ')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(withdrawal.status)}
                      {withdrawal.rejection_reason && (
                        <p className="text-xs text-red-500 mt-1">{withdrawal.rejection_reason}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}