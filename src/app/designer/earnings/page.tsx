/* eslint-disable @typescript-eslint/no-explicit-any */
// app/designer/earnings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  
  TrendingUp, 
  
  CheckCircle,
  Clock,
  ArrowUpRight,
  CreditCard,
  Wallet,
  Banknote,
  AlertCircle
} from 'lucide-react';

interface Transaction {
  id: number;
  designTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
  buyer: string;
}

interface Withdrawal {
  id: number;
  amount: number;
  date: string;
  method: string;
  status: string;
}

export default function EarningsPage() {
  const [designer, setDesigner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>([]);
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('paypal');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('designer_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        setDesigner(authData.user);
        fetchEarningsData(authData.user.id);
      } catch (e) {
        console.error('Error parsing auth');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchEarningsData = async (designerId: number) => {
    try {
      const response = await fetch(`/api/designer/earnings?designerId=${designerId}`);
      const data = await response.json();
      
      if (data.success) {
        setTotalEarnings(data.totalEarnings);
        setPendingEarnings(data.pendingEarnings);
        setMonthlyEarnings(data.monthlyEarnings);
        setTotalSales(data.totalSales);
        setAvailableBalance(data.availableBalance);
        setTransactions(data.transactions || []);
        setWithdrawalHistory(data.withdrawalHistory || []);
      } else {
        setError(data.error || 'Failed to fetch earnings data');
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(withdrawAmount) > availableBalance) {
      alert('Amount exceeds available balance');
      return;
    }
    
    setWithdrawing(true);
    
    try {
      const auth = sessionStorage.getItem('designer_auth');
      if (!auth) return;
      
      const authData = JSON.parse(auth);
      const response = await fetch('/api/designer/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designerId: authData.user.id,
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          accountDetails: withdrawAccount
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Withdrawal request submitted successfully!');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setWithdrawAccount('');
        fetchEarningsData(authData.user.id);
      } else {
        alert(data.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Network error. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your sales and revenue</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Wallet size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${totalEarnings}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${pendingEarnings}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Clearance</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <ArrowUpRight size={16} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${monthlyEarnings}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CreditCard size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalSales}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
        </motion.div>
      </div>

      {/* Withdraw Button */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold">Available for Withdrawal</h3>
            <p className="text-3xl font-bold mt-1">${availableBalance}</p>
          </div>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            disabled={availableBalance <= 0}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  {transaction.status === 'completed' ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <Clock size={20} className="text-yellow-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.designTitle}</p>
                    <p className="text-xs text-gray-500">{transaction.buyer} • {new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">+${transaction.amount}</p>
                  <p className="text-xs text-gray-500">{transaction.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No transactions yet</div>
          )}
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Withdrawal History</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {withdrawalHistory.length > 0 ? (
            withdrawalHistory.map((withdrawal) => (
              <div key={withdrawal.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Banknote size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">${withdrawal.amount}</p>
                    <p className="text-xs text-gray-500">{withdrawal.method} • {new Date(withdrawal.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs text-green-600">{withdrawal.status}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No withdrawal history</div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Withdraw Funds</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="10"
                  max={availableBalance}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Available: ${availableBalance} | Minimum: $10</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Withdrawal Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="easy_paisa">EasyPaisa</option>
                  <option value="jazz_cash">JazzCash</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Details</label>
                <input
                  type="text"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  placeholder="PayPal email / Bank account / Mobile number"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {withdrawing ? 'Processing...' : 'Submit Request'}
                </button>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}