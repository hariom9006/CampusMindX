import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  Target,
  Bot,
  User,
  Cpu,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const role = user?.role || 'student';
  const isFaculty = role === 'faculty' || currentPath.startsWith('/faculty');
  const isAdmin = role === 'admin' || currentPath.startsWith('/admin');

  const homePath = isFaculty ? '/faculty' : isAdmin ? '/admin' : '/student';
  const performancePath = isFaculty
    ? '/faculty/analytics'
    : isAdmin
    ? '/admin/analytics'
    : '/student/performance';
  const skillsPath = isFaculty ? '/analyze-class' : isAdmin ? '/analyze-university' : '/student/skills';
  const assistantPath = isFaculty
    ? '/faculty/assistant'
    : isAdmin
    ? '/admin/assistant'
    : '/student/assistant';

  const navItems = [
    { name: 'Home', path: homePath, icon: LayoutDashboard },
    { name: 'Intelligence', path: '/models', icon: Cpu },
    { name: 'Performance', path: performancePath, icon: LineChart },
    { name: 'Skills', path: skillsPath, icon: Target },
    { name: 'AI Assistant', path: assistantPath, icon: Bot, highlight: true },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === homePath
              ? currentPath === item.path || currentPath === `${item.path}/dashboard`
              : currentPath.startsWith(item.path);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] rounded-xl transition-all relative ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              {item.highlight ? (
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </div>
              )}
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
