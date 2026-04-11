// components/DashboardPage.tsx
'use client';

import { LayoutDashboard, Grid3x3, CheckCircle, Clock, DollarSign, TrendingUp, Eye, Upload, XCircle } from 'lucide-react';
import { SimpleLineChart, SimpleBarChart, SimpleDonutChart } from './Charts';
import { designs, monthlyEarnings, monthlyViews, monthlySales, months } from '../page';

interface DashboardPageProps {
  setActivePage: (page: string) => void;
}

const recentActivity = [
  { type: 'approved', title: 'School Dashboard v3 approved', desc: 'Admin approved · ready for sale', time: '2h ago' },
  { type: 'upload', title: 'Library Portal uploaded', desc: 'Pending admin review', time: '5h ago' },
  { type: 'sale', title: 'Payment received · $120', desc: 'Admin Portal sale · Al-Noor School', time: '1d ago' },
  { type: 'rejected', title: 'Finance Template rejected', desc: 'Missing mobile responsive view', time: '2d ago' },
  { type: 'view', title: 'Student Portal — 48 views today', desc: 'Trending in Student category', time: '3d ago' },
];

export function DashboardPage({ setActivePage }: DashboardPageProps) {
  const approvedCount = designs.filter(d => d.status === 'approved').length;
  const pendingCount = designs.filter(d => d.status === 'pending').length;
  const totalEarnings = 4820;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-serif">Good morning, Fatima ✦</h1>
        <p className="text-[#A0A8C0] text-sm mt-1">Here&apos;s what&apos;s happening with your designs today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Designs', value: '24', change: '+3 this month', color: '#6C63FF', icon: Grid3x3 },
          { label: 'Approved', value: approvedCount.toString(), change: '+2 new approvals', color: '#2DD4A0', icon: CheckCircle },
          { label: 'Pending Review', value: pendingCount.toString(), change: '~2 days review time', color: '#FF9F43', icon: Clock },
          { label: 'Total Earnings', value: `$${totalEarnings}`, change: '+$340 this month', color: '#F5C842', icon: DollarSign },
        ].map((metric, i) => (
          <div key={i} className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-4 relative overflow-hidden">
            <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full opacity-10" style={{ background: metric.color }} />
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${metric.color}20` }}>
              <metric.icon className="w-4.5 h-4.5" style={{ color: metric.color }} />
            </div>
            <div className="text-[#A0A8C0] text-[11px] font-medium uppercase tracking-wide mb-1">{metric.label}</div>
            <div className="text-3xl font-bold text-white font-serif mb-1">{metric.value}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white text-sm">Performance Overview</h3>
              <p className="text-[#A0A8C0] text-[11px]">Views, downloads & sales — last 7 months</p>
            </div>
            <div className="flex gap-3 text-[11px] text-[#A0A8C0]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6C63FF]" />Views</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2DD4A0]" />Sales</span>
            </div>
          </div>
          <div className="h-[160px]">
            <div className="flex h-full gap-2">
              <div className="flex-1">
                <SimpleLineChart data={monthlyViews} color="#6C63FF" height={140} />
                <div className="flex justify-between mt-2 text-[10px] text-[#5A6180]">{months.map(m => <span key={m}>{m}</span>)}</div>
              </div>
              <div className="w-px bg-[#2A2D3E]" />
              <div className="flex-1">
                <SimpleLineChart data={monthlySales} color="#2DD4A0" height={140} />
                <div className="flex justify-between mt-2 text-[10px] text-[#5A6180]">{months.map(m => <span key={m}>{m}</span>)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white text-sm">Recent Activity</h3>
              <p className="text-[#A0A8C0] text-[11px]">Latest updates on your designs</p>
            </div>
            <button onClick={() => setActivePage('designs')} className="text-[11px] text-[#8B84FF] hover:text-white transition-colors">View all →</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((act, i) => {
              const iconColors = {
                approved: 'bg-emerald-500/10 text-emerald-400',
                upload: 'bg-[#6C63FF]/10 text-[#6C63FF]',
                sale: 'bg-amber-500/10 text-amber-400',
                rejected: 'bg-red-500/10 text-red-400',
                view: 'bg-[#6C63FF]/10 text-[#6C63FF]',
              };
              const icons = {
                approved: CheckCircle,
                upload: Upload,
                sale: DollarSign,
                rejected: XCircle,
                view: Eye,
              };
              const Icon = icons[act.type as keyof typeof icons];
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[act.type as keyof typeof iconColors]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white truncate">{act.title}</p>
                    <p className="text-[11px] text-[#A0A8C0] truncate">{act.desc}</p>
                  </div>
                  <span className="text-[10px] text-[#5A6180] flex-shrink-0">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white text-sm">Monthly Earnings Trend</h3>
              <p className="text-[#A0A8C0] text-[11px]">Last 10 months performance</p>
            </div>
            <button onClick={() => setActivePage('earnings')} className="text-[11px] text-[#8B84FF] hover:text-white transition-colors">Full report →</button>
          </div>
          <div className="h-[120px]">
            <SimpleBarChart data={monthlyEarnings} color="#6C63FF" height={100} />
          </div>
        </div>
        <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-white text-sm">Design Status</h3>
            <p className="text-[#A0A8C0] text-[11px]">Approved vs Pending vs Rejected</p>
          </div>
          <SimpleDonutChart data={[approvedCount, pendingCount, designs.filter(d => d.status === 'rejected').length]} size={120} />
          <div className="flex justify-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-[10px] text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" />Approved</span>
            <span className="flex items-center gap-1 text-[10px] text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" />Pending</span>
            <span className="flex items-center gap-1 text-[10px] text-red-400"><span className="w-2 h-2 rounded-full bg-red-400" />Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
}