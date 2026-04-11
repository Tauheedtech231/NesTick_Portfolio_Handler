// components/EarningsPage.tsx
'use client';

import { Download } from 'lucide-react';
import { SimpleBarChart } from './Charts';
import { monthlyEarnings, transactions } from '../page';

export function EarningsPage() {
  const totalEarnings = 4820;
  const pendingAmount = 340;
  const withdrawnAmount = 4480;
  const commissionPaid = 723;

  return (
    <div>
      <div className="bg-gradient-to-br from-[#1A1640] to-[#0F1230] border border-[#6C63FF]/20 rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#6C63FF]/20 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#A0A8C0] text-xs font-serif italic mb-1">Total lifetime earnings</p>
            <div className="text-5xl font-bold text-white font-serif mb-3">${totalEarnings}<span className="text-lg text-[#A0A8C0]">.00</span></div>
            <div className="flex gap-6">
              <div><div className="text-[10px] text-[#A0A8C0] uppercase tracking-wide">Pending</div><div className="text-amber-400 font-semibold">${pendingAmount}.00</div></div>
              <div><div className="text-[10px] text-[#A0A8C0] uppercase tracking-wide">Withdrawn</div><div className="text-emerald-400 font-semibold">${withdrawnAmount}.00</div></div>
              <div><div className="text-[10px] text-[#A0A8C0] uppercase tracking-wide">This Month</div><div className="text-white font-semibold">${pendingAmount}.00</div></div>
              <div><div className="text-[10px] text-[#A0A8C0] uppercase tracking-wide">Commission Paid</div><div className="text-red-400 font-semibold">${commissionPaid}.00</div></div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#6C63FF] text-white rounded-xl font-semibold text-sm hover:bg-[#8B84FF] transition-all shadow-lg shadow-[#6C63FF]/40">
            <Download className="w-4 h-4" />
            Withdraw ${pendingAmount}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="font-semibold text-white text-sm">Earnings by Month</h3><p className="text-[#A0A8C0] text-[11px]">2026 performance</p></div>
            <button className="text-[11px] text-[#A0A8C0]">2026 ▾</button>
          </div>
          <div className="h-[160px]">
            <SimpleBarChart data={monthlyEarnings} color="#F5C842" height={140} />
          </div>
        </div>
        <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Top Earning Designs</h3>
          <div className="space-y-4">
            {[
              { name: 'School Admin Dashboard', earnings: 1424, percent: 100, color: '#6C63FF' },
              { name: 'Student Portal v2', earnings: 1085, percent: 76, color: '#2DD4A0' },
              { name: 'Timetable Manager', earnings: 770, percent: 52, color: '#FF9F43' },
              { name: 'Library Portal', earnings: 480, percent: 33, color: '#A0A8C0' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center text-xs font-bold text-[#6C63FF] flex-shrink-0">#{i+1}</div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-white">{item.name}</p>
                  <div className="h-1 bg-[#2A2D3E] rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-[#F5C842]">${item.earnings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div><h3 className="font-semibold text-white text-sm">Transaction History</h3><p className="text-[#A0A8C0] text-[11px]">All sales, commissions, and payouts</p></div>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-[11px] text-white outline-none">
              <option>All Designs</option>
              <option>School Admin</option>
              <option>Student Portal</option>
            </select>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-[#2A2D3E] rounded-lg text-[11px] text-[#A0A8C0] hover:bg-[#1E2235] transition-all">
              <Download className="w-3 h-3" />
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2D3E]">
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase tracking-wide">Design</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase tracking-wide">Buyer</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase tracking-wide">Date</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase tracking-wide">Amount</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase tracking-wide">Commission</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase tracking-wide">Payout</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b border-[#2A2D3E] hover:bg-[#131625] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-medium text-white">{tx.design}</td>
                  <td className="py-3 px-3 text-[12px] text-[#A0A8C0]">{tx.buyer}</td>
                  <td className="py-3 px-3 text-[12px] text-[#A0A8C0]">{tx.date}</td>
                  <td className="py-3 px-3 text-[12px] font-medium text-white">${tx.amount}</td>
                  <td className="py-3 px-3 text-[12px] text-red-400">-${tx.commission}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-emerald-400">${tx.payout}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tx.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'paid' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {tx.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}