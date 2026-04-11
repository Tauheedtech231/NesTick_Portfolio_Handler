// components/DesignCard.tsx
'use client';

import { CheckCircle, Clock, XCircle, Edit, Trash2 } from 'lucide-react';

type DesignStatus = 'approved' | 'pending' | 'rejected';

interface DesignCardProps {
  design: {
    id: number;
    name: string;
    status: DesignStatus;
    price: number;
    category: string;
    views: number;
    sales: number;
    hue: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function DesignCard({ design, onEdit, onDelete }: DesignCardProps) {
  const statusColors = {
    approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: Clock },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
  };
  const StatusIcon = statusColors[design.status].icon;
  
  return (
    <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl overflow-hidden hover:border-[#6C63FF]/30 transition-all duration-300 hover:-translate-y-1">
      <div className="h-[140px] relative overflow-hidden bg-gradient-to-br" style={{ background: `linear-gradient(135deg, hsl(${design.hue}, 30%, 12%) 0%, hsl(${design.hue}, 20%, 8%) 100%)` }}>
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button className="px-3 py-1.5 bg-[#6C63FF] text-white rounded-lg text-xs font-medium">View Details</button>
          <button onClick={onEdit} className="px-3 py-1.5 bg-white/15 backdrop-blur text-white rounded-lg text-xs font-medium">Edit</button>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex justify-between text-[10px] text-white/60">
            <span>👁 {design.views.toLocaleString()} views</span>
            <span>🛒 {design.sales} sales</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white text-sm">{design.name}</h3>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[design.status].bg} ${statusColors[design.status].text}`}>
            <StatusIcon className="w-3 h-3" />
            {design.status.charAt(0).toUpperCase() + design.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[#F5C842] font-bold">${design.price}</span>
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-1.5 rounded-lg bg-[#2A2D3E] text-[#A0A8C0] hover:bg-[#6C63FF]/20 hover:text-[#6C63FF] transition-colors">
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg bg-[#2A2D3E] text-[#A0A8C0] hover:bg-red-500/20 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}