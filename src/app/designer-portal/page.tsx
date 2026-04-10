/* eslint-disable @typescript-eslint/no-explicit-any */
// app/designer-portal/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Grid3x3, 
  Upload, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Sun, 
  LogOut,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Shield,
  Lock,
  ChevronRight,
  ChevronDown,
  Star,
  Calendar,
  FileText,
  Image as ImageIcon,
  Figma,
  Link,
  AlertCircle
} from 'lucide-react';

// Mock data
const designs = [
  { id: 1, name: 'School Admin Dashboard', status: 'approved', price: 89, category: 'Admin Dashboard', views: 4200, sales: 16, hue: 230 },
  { id: 2, name: 'Student Portal v2', status: 'approved', price: 65, category: 'Student Portal', views: 3100, sales: 12, hue: 160 },
  { id: 3, name: 'Library Portal', status: 'pending', price: 75, category: 'Library System', views: 1200, sales: 0, hue: 45 },
  { id: 4, name: 'Timetable Manager', status: 'approved', price: 55, category: 'Timetable System', views: 1600, sales: 8, hue: 270 },
  { id: 5, name: 'Finance Module Pro', status: 'rejected', price: 45, category: 'Finance', views: 800, sales: 0, hue: 355 },
  { id: 6, name: 'HR Management UI', status: 'pending', price: 99, category: 'HR Management', views: 960, sales: 0, hue: 195 },
  { id: 7, name: 'Exam Scheduler', status: 'approved', price: 70, category: 'Exam Management', views: 2100, sales: 9, hue: 310 },
  { id: 8, name: 'Parent Communication', status: 'approved', price: 60, category: 'Communication', views: 1800, sales: 7, hue: 20 },
  { id: 9, name: 'Admin Dashboard v4', status: 'approved', price: 110, category: 'Admin Dashboard', views: 3900, sales: 14, hue: 240 },
];

const transactions = [
  { design: 'School Admin Dashboard', buyer: 'Al-Noor Academy', date: 'Apr 03, 2026', amount: 89, commission: 13.35, payout: 75.65, status: 'paid' },
  { design: 'Student Portal v2', buyer: 'Dar Al-Ulum School', date: 'Apr 01, 2026', amount: 65, commission: 9.75, payout: 55.25, status: 'paid' },
  { design: 'School Admin Dashboard', buyer: 'Future Stars Academy', date: 'Mar 28, 2026', amount: 89, commission: 13.35, payout: 75.65, status: 'paid' },
  { design: 'Timetable Manager', buyer: 'Bright Minds School', date: 'Mar 22, 2026', amount: 55, commission: 8.25, payout: 46.75, status: 'pending' },
  { design: 'Student Portal v2', buyer: 'Al-Hikma Institute', date: 'Mar 19, 2026', amount: 65, commission: 9.75, payout: 55.25, status: 'paid' },
  { design: 'Library Portal', buyer: 'Riyadh Int\'l School', date: 'Mar 15, 2026', amount: 75, commission: 11.25, payout: 63.75, status: 'paid' },
  { design: 'School Admin Dashboard', buyer: 'Knowledge Garden', date: 'Mar 10, 2026', amount: 89, commission: 13.35, payout: 75.65, status: 'paid' },
];

const recentActivity = [
  { type: 'approved', title: 'School Dashboard v3 approved', desc: 'Admin approved · ready for sale', time: '2h ago' },
  { type: 'upload', title: 'Library Portal uploaded', desc: 'Pending admin review', time: '5h ago' },
  { type: 'sale', title: 'Payment received · $120', desc: 'Admin Portal sale · Al-Noor School', time: '1d ago' },
  { type: 'rejected', title: 'Finance Template rejected', desc: 'Missing mobile responsive view', time: '2d ago' },
  { type: 'view', title: 'Student Portal — 48 views today', desc: 'Trending in Student category', time: '3d ago' },
];

const notifications = [
  { id: 1, title: 'School Dashboard v3 approved ✓', desc: 'Admin reviewed and approved · 2h ago', unread: true },
  { id: 2, title: 'New sale — Student Portal v2', desc: 'Al-Noor Academy purchased · 5h ago', unread: true },
  { id: 3, title: 'Payment of $75.65 released', desc: 'Transferred to your account · 1d ago', unread: true },
  { id: 4, title: 'Finance Template needs revision', desc: 'Missing responsive mobile view · 2d ago', unread: false },
  { id: 5, title: 'Timetable Manager — 12 views today', desc: 'Trending in School Systems category · 3d ago', unread: false },
];

const monthlyEarnings = [280, 420, 380, 620, 510, 740, 690, 880, 760, 340];
const monthlyViews = [3200, 4800, 3900, 6100, 5400, 7200, 6800];
const monthlySales = [12, 18, 14, 22, 19, 28, 24];
const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

// Simple chart component using SVG (no external dependencies)
function SimpleLineChart({ data, height = 140, color = '#6C63FF' }: { data: number[]; height?: number; color?: string }) {
  const max = Math.max(...data);
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${height - (val / max) * height}`).join(' ');
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="rounded-lg">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
      <polygon points={`0,${height} ${points} 100,${height}`} fill={`${color}20`} />
    </svg>
  );
}

function SimpleBarChart({ data, height = 120, color = '#6C63FF' }: { data: number[]; height?: number; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end justify-between h-full gap-1">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-[#1E2235] rounded-t-md overflow-hidden" style={{ height: `${(val / max) * height}px` }}>
            <div className="w-full h-full rounded-t-md transition-all" style={{ height: `${(val / max) * 100}%`, backgroundColor: color }} />
          </div>
          <span className="text-[10px] text-[#5A6180]">{months[i % months.length]}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleDonutChart({ data, size = 120 }: { data: number[]; size?: number }) {
  const total = data.reduce((a, b) => a + b, 0);
  const colors = ['#2DD4A0', '#FF9F43', '#FF5B6B'];
  let currentAngle = 0;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <circle cx={size/2} cy={size/2} r={size/2.5} fill="#1E2235" />
      {data.map((val, i) => {
        const angle = (val / total) * 360;
        const start = currentAngle;
        const end = start + angle;
        currentAngle = end;
        
        const startRad = (start - 90) * Math.PI / 180;
        const endRad = (end - 90) * Math.PI / 180;
        const r = size/2.5;
        const cx = size/2;
        const cy = size/2;
        
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        
        const largeArc = angle > 180 ? 1 : 0;
        
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={colors[i]}
            stroke="#131625"
            strokeWidth="2"
          />
        );
      })}
      <circle cx={size/2} cy={size/2} r={size/3.5} fill="#131625" />
    </svg>
  );
}

// Design Card Component
function DesignCard({ design, onEdit, onDelete }: { design: typeof designs[0]; onEdit: () => void; onDelete: () => void }) {
  const statusColors = {
    approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: Clock },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
  };
  const StatusIcon = statusColors[design.status as keyof typeof statusColors].icon;
  
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
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[design.status as keyof typeof statusColors].bg} ${statusColors[design.status as keyof typeof statusColors].text}`}>
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

// Main Component
export default function DesignerPortal() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadPrice, setUploadPrice] = useState(89);
  const commission = uploadPrice * 0.15;
  const payout = uploadPrice * 0.85;

  const filteredDesigns = designs.filter(d => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'designs', label: 'My Designs', icon: Grid3x3, badge: '24' },
    { id: 'upload', label: 'Upload Design', icon: Upload },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, badge: '$340' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'designs': return <DesignsPage designs={filteredDesigns} filterStatus={filterStatus} setFilterStatus={setFilterStatus} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'upload': return <UploadPage uploadPrice={uploadPrice} setUploadPrice={setUploadPrice} commission={commission} payout={payout} />;
      case 'earnings': return <EarningsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'profile': return <ProfilePage />;
      default: return <DashboardPage />;
    }
  };

  function DashboardPage() {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-serif">Good morning, Fatima ✦</h1>
          <p className="text-[#A0A8C0] text-sm mt-1">Here&apos;s what&apos;s happening with your designs today</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Designs', value: '24', change: '+3 this month', color: '#6C63FF', icon: Grid3x3 },
            { label: 'Approved', value: '18', change: '+2 new approvals', color: '#2DD4A0', icon: CheckCircle },
            { label: 'Pending Review', value: '4', change: '~2 days review time', color: '#FF9F43', icon: Clock },
            { label: 'Total Earnings', value: '$4,820', change: '+$340 this month', color: '#F5C842', icon: DollarSign },
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

        {/* Charts Row */}
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

        {/* Bottom Row */}
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
            <SimpleDonutChart data={[18, 4, 2]} size={120} />
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

  function DesignsPage({ designs, filterStatus, setFilterStatus, searchQuery, setSearchQuery }: any) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">My Designs</h1>
            <p className="text-[#A0A8C0] text-sm mt-1">24 templates · 18 approved · 4 pending · 2 rejected</p>
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
                {status.charAt(0).toUpperCase() + status.slice(1)} {status === 'all' ? '(24)' : status === 'approved' ? '(18)' : status === 'pending' ? '(4)' : '(2)'}
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
          {designs.map((design: any) => (
            <DesignCard key={design.id} design={design} onEdit={() => {}} onDelete={() => {}} />
          ))}
        </div>
      </div>
    );
  }

  function UploadPage({ uploadPrice, setUploadPrice, commission, payout }: any) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">Upload New Design</h1>
            <p className="text-[#A0A8C0] text-sm mt-1">Fill in all details carefully — incomplete submissions may be rejected</p>
          </div>
          <button className="px-4 py-2 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#1E2235] transition-all">Load Draft</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-white text-sm">Design Information</h3>
                <p className="text-[#A0A8C0] text-[11px]">Basic details about your template</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Design Title <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="e.g. School Admin Dashboard Pro v2" className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none focus:border-[#6C63FF] transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Description <span className="text-red-400">*</span></label>
                  <textarea rows={3} placeholder="Describe your design: features, target users, tech stack, pages included..." className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none focus:border-[#6C63FF] transition-colors resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Category <span className="text-red-400">*</span></label>
                    <select className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none">
                      <option>Admin Dashboard</option>
                      <option>Student Portal</option>
                      <option>Library System</option>
                      <option>Finance Module</option>
                      <option>HR Management</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Tags</label>
                    <input type="text" placeholder="school, admin, dashboard…" className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none focus:border-[#6C63FF] transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-white text-sm">Pricing & Commission</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Sale Price <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A8C0] text-sm">$</span>
                    <input type="number" value={uploadPrice} onChange={(e) => setUploadPrice(Number(e.target.value))} className="w-full pl-7 pr-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Commission (15%)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">$</span>
                    <input type="text" value={commission.toFixed(2)} readOnly className="w-full pl-7 pr-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Your Payout</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm">$</span>
                    <input type="text" value={payout.toFixed(2)} readOnly className="w-full pl-7 pr-3 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#6C63FF]/10 border border-[#6C63FF]/20">
                <AlertCircle className="w-4 h-4 text-[#6C63FF] flex-shrink-0" />
                <p className="text-[12px] text-[#8B84FF]">Platform commission is fixed at <strong>15%</strong> of the sale price. Your payout is released within 5 business days after each successful sale.</p>
              </div>
            </div>

            {/* Files */}
            <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-white text-sm">Design Files</h3>
                <p className="text-[#A0A8C0] text-[11px]">Upload your design files or provide a link</p>
              </div>
              <div className="border-2 border-dashed border-[#2A2D3E] rounded-xl p-6 text-center hover:border-[#6C63FF] transition-colors cursor-pointer mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-5 h-5 text-[#6C63FF]" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Drop your design files here</h4>
                <p className="text-[11px] text-[#A0A8C0]">or <span className="text-[#6C63FF]">browse to upload</span></p>
                <p className="text-[10px] text-[#5A6180] mt-2">Figma · Adobe XD · ZIP · Max 100MB</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Or Figma / Drive Link</label>
                  <input type="url" placeholder="https://figma.com/file/..." className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A0A8C0] mb-1.5 uppercase tracking-wide">Live Preview URL (optional)</label>
                  <input type="url" placeholder="https://yourpreview.netlify.app" className="w-full px-3 py-2.5 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#6C63FF] text-white rounded-lg text-sm font-medium hover:bg-[#8B84FF] transition-all">
                  <Upload className="w-4 h-4" />
                  Submit for Review
                </button>
                <button className="px-5 py-2.5 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#1E2235] transition-all">Save as Draft</button>
                <button onClick={() => setActivePage('designs')} className="px-5 py-2.5 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#1E2235] transition-all">Cancel</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-white text-sm">Preview Images</h3>
                <p className="text-[#A0A8C0] text-[11px]">Upload up to 6 screenshots</p>
              </div>
              <div className="border-2 border-dashed border-[#2A2D3E] rounded-xl p-4 text-center hover:border-[#6C63FF] transition-colors cursor-pointer mb-3">
                <ImageIcon className="w-8 h-8 text-[#A0A8C0] mx-auto mb-2" />
                <p className="text-[11px] text-[#A0A8C0]">PNG · JPG · WebP · Max 5MB each</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-lg bg-[#131625] border border-[#2A2D3E] flex items-center justify-center cursor-pointer hover:border-[#6C63FF] transition-colors">
                    {i === 1 ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : i === 5 ? <Plus className="w-4 h-4 text-[#A0A8C0]" /> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wide">Submission Guidelines</h3>
              <div className="space-y-3">
                {[
                  'All designs must be fully responsive across desktop, tablet, and mobile',
                  'Include at least 3 high-quality preview screenshots (min 1280×800px)',
                  'Designs must be original work — no plagiarism or copied UI kits',
                  'Provide working Figma link or full source files for review',
                  'Reviews typically take 2–3 business days after submission',
                ].map((guideline, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] mt-1.5 flex-shrink-0" />
                    <p className="text-[11px] text-[#A0A8C0] leading-relaxed">{guideline}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-[12px] font-semibold text-amber-400">Draft Saved</p>
                  <p className="text-[11px] text-[#A0A8C0]">Auto-saved 2 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function EarningsPage() {
    return (
      <div>
        <div className="bg-gradient-to-br from-[#1A1640] to-[#0F1230] border border-[#6C63FF]/20 rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#6C63FF]/20 blur-3xl" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[#A0A8C0] text-xs font-serif italic mb-1">Total lifetime earnings</p>
              <div className="text-5xl font-bold text-white font-serif mb-3">$4,820<span className="text-lg text-[#A0A8C0]">.00</span></div>
              <div className="flex gap-6">
                <div><div className="text-[10px] text-[#A0A8C0] uppercase tracking-wide">Pending</div><div className="text-amber-400 font-semibold">$340.00</div></div>
                <div><div className="text-[10px] text-[#A0A8C0] uppercase tracking-wide">Withdrawn</div><div className="text-emerald-400 font-semibold">$4,480.00</div></div>
                <div><div className="text-[10px] text-[#A0A8C0] uppercase tracking-wide">This Month</div><div className="text-white font-semibold">$340.00</div></div>
                <div><div className="text-[10px] text-[#A0A8C0] uppercase tracking-wide">Commission Paid</div><div className="text-red-400 font-semibold">$723.00</div></div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-[#6C63FF] text-white rounded-xl font-semibold text-sm hover:bg-[#8B84FF] transition-all shadow-lg shadow-[#6C63FF]/40">
              <Download className="w-4 h-4" />
              Withdraw $340
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

  function AnalyticsPage() {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-serif">Analytics</h1>
          <p className="text-[#A0A8C0] text-sm mt-1">Deep insights into your design performance</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Views', value: '24,892', change: '+18%', icon: Eye },
            { label: 'Total Sales', value: '142', change: '+12%', icon: DollarSign },
            { label: 'Conversion Rate', value: '3.2%', change: '+0.4%', icon: TrendingUp },
            { label: 'Avg. Rating', value: '4.9★', change: '+0.2★', icon: Star },
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

  function ProfilePage() {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">Profile Settings</h1>
            <p className="text-[#A0A8C0] text-sm mt-1">Manage your account, payment details, and preferences</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#6C63FF] text-white rounded-lg text-sm font-medium hover:bg-[#8B84FF] transition-all">
            <Edit className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-5">
            <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-[#6C63FF]/40">
                  FA
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#6C63FF] flex items-center justify-center border-2 border-[#1E2235]">
                  <Edit className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-white">Fatima Al-Rashid</h2>
              <p className="text-[#A0A8C0] text-sm mb-4">@fatima.designs</p>
              <button className="w-full py-2 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#131625] transition-all">Change Photo</button>
              <div className="flex justify-around mt-5 pt-4 border-t border-[#2A2D3E]">
                <div><div className="text-xl font-bold text-white">24</div><div className="text-[10px] text-[#A0A8C0]">Designs</div></div>
                <div><div className="text-xl font-bold text-white">142</div><div className="text-[10px] text-[#A0A8C0]">Sales</div></div>
                <div><div className="text-xl font-bold text-white">4.9★</div><div className="text-[10px] text-[#A0A8C0]">Rating</div></div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['UI/UX', 'Figma', 'Dashboard', 'SaaS', 'Education'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#131625] border border-[#2A2D3E] text-[11px] text-[#A0A8C0]">{tag}</span>
                ))}
              </div>
            </div>

            <div className="bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { label: 'Design approved', desc: 'When admin approves a design', checked: true },
                  { label: 'New sale', desc: 'When someone purchases your design', checked: true },
                  { label: 'Payment released', desc: 'When payout is sent to your account', checked: true },
                  { label: 'Admin feedback', desc: 'When admin leaves review comments', checked: false },
                  { label: 'Weekly summary', desc: 'Weekly performance digest email', checked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2D3E] last:border-0">
                    <div>
                      <p className="text-[12px] font-medium text-white">{item.label}</p>
                      <p className="text-[10px] text-[#A0A8C0]">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#2A2D3E] rounded-full peer peer-checked:bg-[#6C63FF] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#1E2235] border border-[#2A2D3E] rounded-xl p-6">
            <div className="border-b border-[#2A2D3E] pb-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-[#6C63FF]" />
                <h3 className="font-semibold text-white text-sm">Personal Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Full Name</label><input type="text" value="Fatima Al-Rashid" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Username</label><input type="text" value="fatima.designs" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Email Address</label><input type="email" value="fatima@neezamiya.com" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Phone</label><input type="tel" value="+966 50 123 4567" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div className="col-span-2"><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Bio</label><textarea rows={3} className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm resize-none">UI/UX Designer specializing in educational platforms and SaaS dashboards. 5+ years of experience building intuitive, conversion-focused interfaces for schools and institutions across the GCC.</textarea></div>
                <div className="col-span-2"><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Portfolio Website</label><input type="url" value="https://fatima.design" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              </div>
            </div>

            <div className="border-b border-[#2A2D3E] pb-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-[#6C63FF]" />
                <h3 className="font-semibold text-white text-sm">Payment Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Payment Method</label><select className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm"><option>Bank Transfer (IBAN)</option><option>PayPal</option></select></div>
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Bank Name</label><input type="text" value="Riyad Bank" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div className="col-span-2"><label className="block text-[11px] text-[#A0A8C0] mb-1.5">IBAN / Account Number</label><input type="text" value="SA12 3456 7890 1234 5678 90" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Swift / BIC Code</label><input type="text" value="RIBLSARI" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Account Holder Name</label><input type="text" value="Fatima Mohammed Al-Rashid" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-[#6C63FF]" />
                <h3 className="font-semibold text-white text-sm">Security</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Current Password</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">New Password</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div><label className="block text-[11px] text-[#A0A8C0] mb-1.5">Confirm Password</label><input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-[#131625] border border-[#2A2D3E] rounded-lg text-white text-sm" /></div>
                <div className="flex items-end"><button className="w-full py-2 border border-[#2A2D3E] text-[#A0A8C0] rounded-lg text-sm hover:bg-[#131625] transition-all">Update Password</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080F]">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-[#0D0F1A] border-r border-[#2A2D3E] z-30 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-5 border-b border-[#2A2D3E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#6C63FF]/40">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
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

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
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

        <div className="p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}