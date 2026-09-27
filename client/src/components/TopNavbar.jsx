import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Sparkles, User, Users, Shield, GraduationCap, ChevronDown, Menu, X, Cpu, Building2 } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

export default function TopNavbar({ onToggleMobileSidebar = null }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Determine current role based on path
  const currentPath = location.pathname;
  let activeRole = 'Student';
  if (currentPath.startsWith('/faculty')) activeRole = 'Faculty';
  else if (currentPath.startsWith('/admin')) activeRole = 'University Admin';
  else if (currentPath === '/architecture') activeRole = 'System Architect';

  const personas = {
    Student: {
      name: 'Aarav Sharma',
      detail: 'BCA 5th Sem',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      badgeColor: 'text-cyan-400'
    },
    Faculty: {
      name: 'Dr. Sunita Kulkarni',
      detail: 'Faculty & Advisor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      badgeColor: 'text-purple-400'
    },
    'University Admin': {
      name: 'Dean of Academics',
      detail: 'Institutional Office',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      badgeColor: 'text-blue-400'
    },
    'System Architect': {
      name: 'System Architect',
      detail: 'Core Engineering',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
      badgeColor: 'text-emerald-400'
    }
  };
  const activePersona = personas[activeRole] || personas.Student;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#070b14]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent block leading-tight">
                CampusMind<span className="text-cyan-400">X</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono hidden sm:block">
                Explainable Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation shortcuts & Architecture link */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <Link
            to="/connect-university"
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-900/60 shadow-[0_0_10px_rgba(16,185,129,0.2)] flex items-center gap-1.5 transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Connect LMS</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 mx-1"></div>
          <Link
            to="/analyze"
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/60 shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Analyze My Data</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 mx-1"></div>
          <Link
            to="/student"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentPath.startsWith('/student')
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student Portal
          </Link>
          <Link
            to="/faculty"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentPath.startsWith('/faculty')
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Faculty Insights
          </Link>
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentPath.startsWith('/admin')
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            University Admin
          </Link>
          <Link
            to="/architecture"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentPath === '/architecture'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Architecture</span>
          </Link>
        </nav>

        {/* Right: Quick Role Switcher, Notifications, User Avatar */}
        <div className="flex items-center gap-2.5 relative">
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/40 text-xs font-medium text-slate-200 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="hidden sm:inline text-slate-400 text-[11px]">Role:</span>
              <span className="font-semibold text-cyan-300">{activeRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn text-xs"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-cyan-400 font-bold">
                  Personal Analysis Modes
                </div>
                <Link
                  to="/analyze"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/20 text-cyan-200 hover:text-white transition-colors mb-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-[11px]">Analyze My Data</span>
                    <span className="text-[9px] text-cyan-300/70">Student Self-Analysis</span>
                  </div>
                </Link>
                <Link
                  to="/analyze-class"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 text-purple-200 hover:text-white transition-colors mb-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-[11px]">Analyze My Class</span>
                    <span className="text-[9px] text-purple-300/70">Faculty Cohort Intel</span>
                  </div>
                </Link>
                <Link
                  to="/analyze-university"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/20 text-blue-200 hover:text-white transition-colors mb-2"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-[11px]">Analyze My University</span>
                    <span className="text-[9px] text-blue-300/70">Institutional Telemetry</span>
                  </div>
                </Link>

                <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-slate-400">
                  Demo Personas
                </div>
                <Link
                  to="/student"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-bold block">Aarav Sharma</span>
                    <span className="text-[10px] text-slate-400">BCA Sem 5 Student</span>
                  </div>
                </Link>
                <Link
                  to="/faculty"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="font-bold block">Dr. Sunita Kulkarni</span>
                    <span className="text-[10px] text-slate-400">Faculty & DSA Chair</span>
                  </div>
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-white transition-colors"
                >
                  <Shield className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="font-bold block">Dean of Academics</span>
                    <span className="text-[10px] text-slate-400">University Admin Portal</span>
                  </div>
                </Link>
                <div className="border-t border-slate-800 my-1"></div>
                <Link
                  to="/login"
                  className="flex items-center justify-between px-3 py-1.5 text-[11px] text-cyan-400 hover:text-cyan-300"
                >
                  <span>Role Switch Hub</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            </button>
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2.5 pl-1.5 border-l border-slate-800">
            <img
              src={activePersona.avatar}
              alt={activePersona.name}
              className="w-8 h-8 rounded-full object-cover border border-cyan-500/40"
            />
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">{activePersona.name}</span>
              <span className={`text-[10px] font-mono ${activePersona.badgeColor}`}>{activePersona.detail}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
