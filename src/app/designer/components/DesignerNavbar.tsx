// app/designer/components/DesignerNavbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut,
  ChevronDown,
  Palette,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface DesignerNavbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'design_approved' | 'design_rejected' | 'sale' | 'info';
  is_read: boolean;
  created_at: string;
  related_id?: number;
}

export function DesignerNavbar({ 
  sidebarCollapsed, 
  onMenuClick, 
  isDarkMode, 
  onThemeToggle 
}: DesignerNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [designerName, setDesignerName] = useState('Designer');
  const [designerEmail, setDesignerEmail] = useState('');
  const [designerId, setDesignerId] = useState<number | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Get designer info from sessionStorage
  useEffect(() => {
    const auth = sessionStorage.getItem('designer_auth');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        setDesignerName(parsed.user?.name || 'Designer');
        setDesignerEmail(parsed.user?.email || '');
        setDesignerId(parsed.user?.id);
      } catch (e) {
        console.error('Error parsing designer info');
      }
    }
  }, []);

  // Fetch notifications from API
  useEffect(() => {
    if (designerId) {
      fetchNotifications();
      
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [designerId]);

  const fetchNotifications = async () => {
    if (!designerId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/designer/notifications?designerId=${designerId}`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch('/api/designer/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, designerId })
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'design_approved':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'design_rejected':
        return <XCircle size={14} className="text-red-500" />;
      case 'sale':
        return <Bell size={14} className="text-blue-500" />;
      default:
        return <Bell size={14} className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'design_approved':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200';
      case 'design_rejected':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200';
      case 'sale':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200';
      default:
        return 'bg-gray-50 dark:bg-gray-700';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    sessionStorage.removeItem('designer_auth');
    router.push('/designer/login');
  };

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/designer') return 'Dashboard';
    if (pathname === '/designer/my-designs') return 'My Designs';
    if (pathname === '/designer/upload-design') return 'Upload New Design';
    if (pathname === '/designer/earnings') return 'Earnings';
    if (pathname === '/designer/profile') return 'Profile';
    return '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Menu Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <Link href="/designer" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Palette size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:inline">
              Designer Studio
            </span>
          </Link>
        </div>

        {/* Center - Page Title */}
        <div className="hidden md:block">
          <h1 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-600" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <Bell size={18} className="text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={fetchNotifications}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Refresh
                      </button>
                    )}
                  </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${getNotificationColor(notif.type)} ${!notif.is_read ? 'border-l-4 border-blue-500' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          {getNotificationIcon(notif.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(notif.created_at)}</p>
                          </div>
                          {!notif.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {designerName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{designerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{designerEmail}</p>
              </div>
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <Link
                  href="/designer/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-xl"
                >
                  <User size={16} /> Profile
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-xl w-full"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}