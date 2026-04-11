// components/Header.tsx
'use client';

import { useState } from 'react';
import { Menu, X, Search, Bell, Plus } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActivePage: (page: string) => void;
}

export function Header({ sidebarOpen, setSidebarOpen, setActivePage }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  
  const notifications = [
    { id: 1, title: 'School Dashboard v3 approved ✓', desc: 'Admin reviewed and approved · 2h ago', unread: true },
    { id: 2, title: 'New sale — Student Portal v2', desc: 'Al-Noor Academy purchased · 5h ago', unread: true },
    { id: 3, title: 'Payment of $75.65 released', desc: 'Transferred to your account · 1d ago', unread: true },
    { id: 4, title: 'Finance Template needs revision', desc: 'Missing responsive mobile view · 2d ago', unread: false },
    { id: 5, title: 'Timetable Manager — 12 views today', desc: 'Trending in School Systems category · 3d ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-20 bg-[#0D0F1A]/95 backdrop-blur-sm border-b border-[#2A2D3E] px-6 py-3 flex items-center justify-between">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-[#131625] transition-all">
        {sidebarOpen ? <X className="w-5 h-5 text-[#A0A8C0]" /> : <Menu className="w-5 h-5 text-[#A0A8C0]" />}
      </button>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#131625] border border-[#2A2D3E] rounded-lg">
          <Search className="w-4 h-4 text-[#5A6180]" />
          <input type="text" placeholder="Search designs, earnings…" className="bg-transparent text-white text-sm placeholder:text-[#5A6180] outline-none w-48" />
        </div>
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-lg bg-[#131625] border border-[#2A2D3E] hover:bg-[#1E2235] transition-all">
            <Bell className="w-4 h-4 text-[#A0A8C0]" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0D0F1A] border border-[#2A2D3E] rounded-xl shadow-2xl z-50">
              <div className="p-3 border-b border-[#2A2D3E] flex justify-between">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button onClick={() => setNotifOpen(false)} className="text-[11px] text-[#8B84FF]">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-3 border-b border-[#2A2D3E] hover:bg-[#131625] transition-colors cursor-pointer ${notif.unread ? 'bg-[#6C63FF]/5' : ''}`}>
                    <p className="text-[12px] font-medium text-white">{notif.title}</p>
                    <p className="text-[10px] text-[#A0A8C0] mt-0.5">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button onClick={() => setActivePage('upload')} className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#6C63FF] text-white rounded-lg text-sm font-medium hover:bg-[#8B84FF] transition-all">
          <Plus className="w-4 h-4" />
          New Design
        </button>
      </div>
    </header>
  );
}