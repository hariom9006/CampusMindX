import React, { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

export default function NotificationPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Attendance Shortage Alert',
      message: 'Computer Networks (BCA-504) is at 48%. Attending the next 7 classes is recommended.',
      time: '12m ago',
      urgent: true,
      link: '/student/attendance'
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Pending Coursework Notice',
      message: 'Dijkstra Implementation (BCA-505) internal submission is pending.',
      time: '2h ago',
      urgent: true,
      link: '/student/performance'
    }
  ]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadNotifications() {
      try {
        const data = await apiService.getNotifications();
        if (isMounted && data && data.length > 0) {
          setNotifications(
            data.map((n) => ({
              id: n._id || n.id,
              type: n.type,
              title: n.title,
              message: n.message,
              time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              urgent: n.urgent,
              link: n.link || '/student',
              read: n.read
            }))
          );
          setIsLive(true);
        }
      } catch (err) {
        console.warn('Notifications fallback:', err);
      }
    }

    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, urgent: false })));
    } catch {}
  };

  return (
    <div
      className="fixed inset-x-3 sm:inset-x-auto sm:absolute sm:right-0 top-16 sm:top-14 sm:w-96 max-w-[calc(100vw-1.5rem)] glass-panel rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden bg-white/95 text-slate-800 animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-purple-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Academic Notifications
          </h4>
          {isLive && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live DB
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close notifications"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-1">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 hover:bg-slate-50 transition-colors rounded-xl m-1 ${
              n.urgent ? 'bg-amber-50/40 border-l-2 border-amber-500' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                {n.urgent && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                {n.title}
              </h5>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                <Clock className="w-3 h-3" /> {n.time}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.message}</p>
            <div className="mt-2.5 flex items-center justify-between">
              <Link
                to={n.link}
                onClick={onClose}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View Details →
              </Link>
              {n.urgent && (
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Advisory
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}
