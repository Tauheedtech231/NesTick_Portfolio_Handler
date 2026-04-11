// components/DesignsPage.tsx
'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { DesignCard } from './DesignCard';
import { designs } from '../page';

interface DesignsPageProps {
  setActivePage: (page: string) => void;
}

export function DesignsPage({ setActivePage }: DesignsPageProps) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDesigns = designs.filter(d => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const approvedCount = designs.filter(d => d.status === 'approved').length;
  const pendingCount = designs.filter(d => d.status === 'pending').length;
  const rejectedCount = designs.filter(d => d.status === 'rejected').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif">My Designs</h1>
          <p className="text-[#A0A8C0] text-sm mt-1">24 templates · {approvedCount} approved · {pendingCount} pending · {rejectedCount} rejected</p>
        </div>
        <button onClick={() => setActivePage('upload')} className="flex items-center gap-2 px-4 py-2 bg-[#6C63FF] text-white rounded-lg text-sm font-medium hover:bg-[#8B84FF] transition-all">
          <Plus className="w-4 h-4" />
          Upload New
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 bg-[#131625] rounded-lg p-1 border border-[#2A2D3E]">
          {['all', 'approved', 'pending', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterStatus === status ? 'bg-[#252840] text-white' : 'text-[#A0A8C0] hover:text-white'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} {status === 'all' ? '(24)' : status === 'approved' ? `(${approvedCount})` : status === 'pending' ? `(${pendingCount})` : `(${rejectedCount})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg">
            <Search className="w-4 h-4 text-[#5A6180]" />
            <input
              type="text"
              placeholder="Search your designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white text-sm placeholder:text-[#5A6180] outline-none w-48"
            />
          </div>
          <select className="px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-sm text-white outline-none">
            <option>Sort: Newest</option>
            <option>Sort: Highest Earnings</option>
            <option>Sort: Most Views</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDesigns.map((design) => (
          <DesignCard key={design.id} design={design} onEdit={() => {}} onDelete={() => {}} />
        ))}
      </div>
    </div>
  );
}