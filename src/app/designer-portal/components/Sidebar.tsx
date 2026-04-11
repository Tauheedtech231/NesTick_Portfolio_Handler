// components/Sidebar.tsx
'use client';

import { LayoutDashboard, Grid3x3, Upload, DollarSign, BarChart3, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Sidebar({ sidebarOpen, activePage, setActivePage }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'designs', label: 'My Designs', icon: Grid3x3, badge: '24' },
    { id: 'upload', label: 'Upload Design', icon: Upload },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, badge: '$340' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-[#0D0F1A] border-r border-[#2A2D3E] z-30 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-5 border-b border-[#2A2D3E]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#6C63FF]/40">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-semibold text-sm font-serif">Neezamiya</div>
              <div className="text-[10px] text-[#A0A8C0] tracking-wider">PES Portal</div>
            </div>
          )}
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-[#6C63FF]/10 text-[#8B84FF] border-l-2 border-[#6C63FF]' : 'text-[#A0A8C0] hover:bg-[#131625] hover:text-white'}`}
            >
              <Icon className="w-4.5 h-4.5" />
              {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
              {sidebarOpen && item.badge && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${item.id === 'designs' ? 'bg-[#6C63FF]/20 text-[#8B84FF]' : 'bg-amber-500/20 text-amber-400'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2D3E]">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#131625] transition-all cursor-pointer">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex items-center justify-center text-white font-bold text-sm">FA</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0D0F1A]" />
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Fatima Al-Rashid</div>
              <div className="text-[10px] text-[#A0A8C0]">Senior Designer</div>
            </div>
          )}
          {sidebarOpen && <LogOut className="w-4 h-4 text-[#A0A8C0]" />}
        </div>
      </div>
    </aside>
  );
}