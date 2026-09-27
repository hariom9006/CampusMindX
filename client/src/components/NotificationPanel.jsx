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
      message: 'Computer Networks (BCA-504) is at 48%. Attending the next 7 classes is required for exam clearance.',
      time: '12m ago',
      urgent: true,
      link: '/student/attendance'
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Overdue Assignment Notice',
      message: 'Dijkstra Implementation (BCA-505) was due yesterday. Submit today for 80% maximum credit.',
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
        console.error('Error fetching notifications:', err);
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

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-14 w-80 sm:w-96 glass-panel rounded-2xl border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-fadeIn text-slate-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Academic Notifications</h4>
          {isLive && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              MongoDB
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close academic notifications"
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60 p-1">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 hover:bg-slate-800/40 transition-colors rounded-xl m-1 ${
              n.urgent ? 'bg-rose-950/15 border-l-2 border-rose-500' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h5 className="text-xs font-semibold text-white flex items-center gap-1.5">
                {n.urgent && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                {n.title}
              </h5>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" /> {n.time}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{n.message}</p>
            <div className="mt-2.5 flex items-center justify-between">
              <Link
                to={n.link}
                onClick={onClose}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Details →
              </Link>
              {n.urgent && (
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-900/40 text-rose-300 border border-rose-500/30">
                  Action Required
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-center">
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}
