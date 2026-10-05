import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Sparkles,
  User,
  Users,
  Shield,
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  Cpu,
  HelpCircle,
  Search,
  LogOut
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { useAuth } from '../context/AuthContext';

export default function TopNavbar({ onToggleMobileSidebar = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Determine current role based on path or authenticated user
  const currentPath = location.pathname;
  let activeRole = user?.role ? (user.role === 'faculty' ? 'Faculty' : user.role === 'admin' ? 'University Admin' : 'Student') : 'Student';
  if (currentPath.startsWith('/faculty')) activeRole = 'Faculty';
  else if (currentPath.startsWith('/admin')) activeRole = 'University Admin';
  else if (currentPath === '/architecture') activeRole = 'System Architect';

  const displayName = user?.name || (activeRole === 'Faculty' ? 'Dr. Sunita Kulkarni' : activeRole === 'University Admin' ? 'Dean of Academics' : 'Hariom Anand');
  const roleDetail = user?.role
    ? `${user.role.toUpperCase()} • ${user.email}`
    : activeRole === 'Faculty'
    ? 'Faculty & Student Advisor'
    : activeRole === 'University Admin'
    ? 'Institutional Intelligence'
    : 'BCA 5th Sem • Verified';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                CampusMind<span className="aurora-gradient-text font-black">X</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold hidden sm:block">
                Aurora Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation shortcuts */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <Link
            to="/student"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPath.startsWith('/student')
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Portal
          </Link>
          <Link
            to="/faculty"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPath.startsWith('/faculty')
                ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty Suite
          </Link>
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPath.startsWith('/admin')
                ? 'bg-white text-cyan-700 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            University Admin
          </Link>
          <div className="h-4 w-px bg-slate-300 mx-1" />
          <Link
            to="/models"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentPath === '/models'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Model Center</span>
          </Link>
        </nav>

        {/* Right: Actions, Notifications, Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Direct Role-Aware Analyse My Data / Self-Calculator Button */}
          <Link
            to={
              currentPath.startsWith('/faculty') || currentPath === '/analyze-class' || currentPath === '/my-class-analysis'
                ? '/analyze-class'
                : currentPath.startsWith('/admin') || currentPath === '/analyze-university' || currentPath === '/my-university-analysis'
                ? '/analyze-university'
                : '/analyze'
            }
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200/80 shadow-2xs transition-all hover:scale-[1.02]"
            title="Open Self-Analysis Calculator"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>
              {currentPath.startsWith('/faculty')
                ? 'Analyse Class Data'
                : currentPath.startsWith('/admin')
                ? 'Analyse University Data'
                : 'Analyse My Data'}
            </span>
          </Link>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white animate-pulse" />
            </button>
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Persona Button */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl border border-slate-200/80 bg-white/90 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                  {roleDetail}
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona Switcher & Account Dropdown */}
            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-2xl glass-panel bg-white/95 border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Account & Roles
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {displayName}
                  </span>
                  {user?.email && (
                    <span className="text-[10px] text-slate-500 truncate block">
                      {user.email}
                    </span>
                  )}
                </div>

                {/* Account Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <User className="w-4 h-4 text-indigo-500" />
                  <span>My Profile & Settings</span>
                </Link>

                <div className="border-t border-slate-100 my-1" />

                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Switch Active Portal
                </div>
                <Link
                  to="/student"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>Student Portal</span>
                </Link>
                <Link
                  to="/faculty"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>Faculty Suite</span>
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                >
                  <Shield className="w-4 h-4 text-cyan-500" />
                  <span>University Admin</span>
                </Link>

                <div className="border-t border-slate-100 my-1" />
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Self-Analysis Calculators
                </div>
                <Link
                  to="/analyze"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Student Self-Calculator</span>
                </Link>
                <Link
                  to="/analyze-class"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Teacher / Class Calculator</span>
                </Link>
                <Link
                  to="/analyze-university"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Admin / University Calculator</span>
                </Link>

                <div className="border-t border-slate-100 my-1" />
                <Link
                  to="/models"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Cpu className="w-4 h-4 text-indigo-500" />
                  <span>AI Intelligence Center</span>
                </Link>

                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
