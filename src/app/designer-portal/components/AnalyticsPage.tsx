// components/AnalyticsPage.tsx
'use client';

import { Eye, DollarSign, TrendingUp, Star } from 'lucide-react';
import { SimpleLineChart } from './Charts';
import { designs, monthlyViews, monthlySales, months } from '../page';

export function AnalyticsPage() {
  const totalViews = designs.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.views, 0);
  const totalSales = designs.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.sales, 0);
  const conversionRate = ((totalSales / totalViews) * 100).toFixed(1);
  const avgRating = 4.9;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-serif">Analytics</h1>
        <p className="text-[#A0A8C0] text-sm mt-1">Deep insights into your design performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Views', value: totalViews.toLocaleString(), change: '+18%', icon: Eye },
          { label: 'Total Sales', value: totalSales.toString(), change: '+12%', icon: DollarSign },
          { label: 'Conversion Rate', value: `${conversionRate}%`, change: '+0.4%', icon: TrendingUp },
          { label: 'Avg. Rating', value: `${avgRating}★`, change: '+0.2★', icon: Star },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#A0A8C0] uppercase tracking-wide">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-[#6C63FF]" />
            </div>
            <div className="text-2xl font-bold text-white font-serif">{stat.value}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
              <TrendingUp className="w-3 h-3" />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-white text-sm">Views Trend</h3>
            <p className="text-[#A0A8C0] text-[11px]">Last 6 months</p>
          </div>
          <div className="h-[200px]">
            <SimpleLineChart data={monthlyViews} color="#6C63FF" height={180} />
            <div className="flex justify-between mt-2 text-[10px] text-[#5A6180]">{months.map(m => <span key={m}>{m}</span>)}</div>
          </div>
        </div>
        <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-white text-sm">Sales Trend</h3>
            <p className="text-[#A0A8C0] text-[11px]">Last 6 months</p>
          </div>
          <div className="h-[200px]">
            <SimpleLineChart data={monthlySales} color="#2DD4A0" height={180} />
            <div className="flex justify-between mt-2 text-[10px] text-[#5A6180]">{months.map(m => <span key={m}>{m}</span>)}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-white text-sm">Top Performing Designs</h3>
          <p className="text-[#A0A8C0] text-[11px]">Sorted by revenue generated</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2D3E]">
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase">Design Name</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase">Category</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase">Views</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase">Sales</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase">Revenue</th>
                <th className="text-left py-3 px-3 text-[10px] font-semibold text-[#A0A8C0] uppercase">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {designs.filter(d => d.status === 'approved').slice(0, 6).map((design, i) => (
                <tr key={i} className="border-b border-[#2A2D3E] hover:bg-[#131625] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-medium text-white">{design.name}</td>
                  <td className="py-3 px-3 text-[12px] text-[#A0A8C0]">{design.category}</td>
                  <td className="py-3 px-3 text-[12px] text-[#A0A8C0]">{design.views.toLocaleString()}</td>
                  <td className="py-3 px-3 text-[12px] text-white">{design.sales}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#F5C842]">${design.price * design.sales}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#2A2D3E] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#6C63FF]" style={{ width: `${Math.min(100, (design.sales / design.views) * 10000)}%` }} />
                      </div>
                      <span className="text-[10px] text-[#A0A8C0]">{((design.sales / design.views) * 100).toFixed(2)}%</span>
                    </div>
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