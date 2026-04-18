// app/designer/components/DesignerSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Layers, 
  Upload, 
  DollarSign, 
  User,
  
} from 'lucide-react';

interface DesignerSidebarProps {
  collapsed: boolean;
}

const menuItems = [
  { href: '/designer', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/designer/my-designs', icon: Layers, label: 'My Designs' },
  { href: '/designer/upload-design', icon: Upload, label: 'Upload Design' },
  { href: '/designer/earnings', icon: DollarSign, label: 'Earnings' },
  { href: '/designer/profile', icon: User, label: 'Profile' },
];

export function DesignerSidebar({ collapsed }: DesignerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`fixed left-0 top-16 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="flex flex-col h-full py-6">
        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {collapsed && (
                  <div className="absolute left-14 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

    
      </div>
    </aside>
  );
}