// app/developer/notifications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Trash2,
  Mail,
  Check,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'design_assigned' | 'submission_reviewed' | 'sale' | 'withdrawal' | 'info';
  is_read: boolean;
  related_id: number;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getDeveloperId = (): string | null => {
    const auth = sessionStorage.getItem('developer_auth');
    if (!auth) return null;
    try {
      const parsed = JSON.parse(auth);
      return parsed?.user?.id ? parsed.user.id.toString() : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        console.error('Developer session missing');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/developer/notifications?developerId=${developerId}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    setMarkingId(id);
    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        console.error('Developer session missing');
        return;
      }

      const response = await fetch('/api/developer/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: true, developerId })
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setMarkingId(null);
    }
  };

  const deleteNotification = async (id: number) => {
    setDeletingId(id);
    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        console.error('Developer session missing');
        return;
      }

      const response = await fetch('/api/developer/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, developerId })
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      const developerId = getDeveloperId();
      if (!developerId) {
        console.error('Developer session missing');
        return;
      }

      const response = await fetch(`/api/developer/notifications/mark-all?developerId=${developerId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'design_assigned':
        return <AlertCircle size={16} className="text-blue-500" />;
      case 'submission_reviewed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'sale':
        return <Mail size={16} className="text-purple-500" />;
      case 'withdrawal':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated with your activity</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all flex items-center gap-2"
          >
            <Check size={16} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Total Notifications</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Unread</p>
          <p className="text-2xl font-bold text-purple-500">{unreadCount}</p>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-xl border ${
                !notification.is_read 
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/10' 
                  : 'border-gray-200 dark:border-gray-700'
              } p-5 transition-all`}
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(notification.type)}
                    <h3 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                    {!notification.is_read && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs">New</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      disabled={markingId === notification.id}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Mark as read"
                    >
                      {markingId === notification.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} className="text-gray-500" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    disabled={deletingId === notification.id}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    {deletingId === notification.id ? (
                      <Loader2 size={16} className="animate-spin text-red-500" />
                    ) : (
                      <Trash2 size={16} className="text-red-500" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}