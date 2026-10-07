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
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function TopNavbar({ onToggleMobileSidebar = null }) {
  const { isDark } = useTheme();
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
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-200 ${
        isDark
          ? 'bg-[#080B12]/90 border-[#202938] text-[#F8FAFC]'
          : 'glass-panel border-slate-200/80 bg-white/85 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              aria-label="Toggle navigation menu"
              className={`md:hidden p-2 rounded-xl transition-colors ${
                isDark
                  ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151C28]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                isDark
                  ? 'bg-[#151C28] border border-[#202938] text-[#8B5CF6]'
                  : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/25'
              }`}
            >
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-base font-extrabold tracking-tight block leading-tight ${
                  isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                }`}
              >
                CampusMind<span className={isDark ? 'text-[#8B5CF6] font-black' : 'aurora-gradient-text font-black'}>X</span>
              </span>
              <span
                className={`text-[9px] uppercase tracking-wider font-bold hidden sm:block ${
                  isDark ? 'text-[#64748B]' : 'text-slate-500'
                }`}
              >
                University Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation shortcuts */}
        <nav
          className={`hidden lg:flex items-center gap-1.5 p-1 rounded-2xl border transition-colors ${
            isDark
              ? 'bg-[#111722] border-[#202938]'
              : 'bg-slate-100/80 border-slate-200/60'
          }`}
        >
          <Link
            to="/student"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPath.startsWith('/student')
                ? isDark
                  ? 'bg-[#151C28] text-[#8B5CF6] shadow-sm border border-[#202938]'
                  : 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                : isDark
                ? 'text-[#94A3B8] hover:text-[#F8FAFC]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Portal
          </Link>
          <Link
            to="/faculty"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPath.startsWith('/faculty')
                ? isDark
                  ? 'bg-[#151C28] text-purple-400 shadow-sm border border-[#202938]'
                  : 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                : isDark
                ? 'text-[#94A3B8] hover:text-[#F8FAFC]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty Suite
          </Link>
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPath.startsWith('/admin')
                ? isDark
                  ? 'bg-[#151C28] text-cyan-400 shadow-sm border border-[#202938]'
                  : 'bg-white text-cyan-700 shadow-sm border border-slate-200/60'
                : isDark
                ? 'text-[#94A3B8] hover:text-[#F8FAFC]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            University Admin
          </Link>
          <div className={`h-4 w-px mx-1 ${isDark ? 'bg-[#202938]' : 'bg-slate-300'}`} />
          <Link
            to="/models"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentPath === '/models'
                ? isDark
                  ? 'bg-[#151C28] text-[#8B5CF6] shadow-sm border border-[#202938]'
                  : 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                : isDark
                ? 'text-[#94A3B8] hover:text-[#F8FAFC]'
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

          {/* Theme Toggle Button */}
          <ThemeToggle />

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
                className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-xl p-2 z-50 animate-fadeIn ${
                  isDark
                    ? 'bg-[#111722] border-[#202938] text-[#F8FAFC]'
                    : 'glass-panel bg-white/95 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`px-3 py-2 border-b mb-1 ${isDark ? 'border-[#202938]' : 'border-slate-100'}`}>
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                    Account & Roles
                  </span>
                  <span className={`text-xs font-bold truncate block ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    {displayName}
                  </span>
                  {user?.email && (
                    <span className={`text-[10px] truncate block ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                      {user.email}
                    </span>
                  )}
                </div>

                {/* Theme Mode Preference Row */}
                <div className={`px-3 py-2 my-1 rounded-xl flex items-center justify-between border ${
                  isDark ? 'bg-[#151C28] border-[#202938]' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <span className={`text-xs font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                    Theme Preference
                  </span>
                  <ThemeToggle variant="segmented" />
                </div>

                {/* Account Profile Link */}
                <Link
                  to="/profile"
                  onClick={() => setShowRoleMenu(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-[#94A3B8] hover:bg-[#151C28] hover:text-[#F8FAFC]'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  <User className="w-4 h-4 text-indigo-500" />
                  <span>My Profile & Settings</span>
                </Link>

                <div className={`border-t my-1 ${isDark ? 'border-[#202938]' : 'border-slate-100'}`} />

                <div className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                  Switch Active Portal
                </div>
                <Link
                  to="/student"
                  onClick={() => setShowRoleMenu(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-[#94A3B8] hover:bg-[#151C28] hover:text-[#F8FAFC]'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>Student Portal</span>
                </Link>
                <Link
                  to="/faculty"
                  onClick={() => setShowRoleMenu(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-[#94A3B8] hover:bg-[#151C28] hover:text-[#F8FAFC]'
                      : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>Faculty Suite</span>
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setShowRoleMenu(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-[#94A3B8] hover:bg-[#151C28] hover:text-[#F8FAFC]'
                      : 'text-slate-700 hover:bg-cyan-50 hover:text-cyan-700'
                  }`}
                >
                  <Shield className="w-4 h-4 text-cyan-500" />
                  <span>University Admin</span>
                </Link>

                <div className={`border-t my-1 ${isDark ? 'border-[#202938]' : 'border-slate-100'}`} />
                <div className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                  Self-Analysis Calculators
                </div>
                <Link
                  to="/analyze"
                  onClick={() => setShowRoleMenu(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-[#94A3B8] hover:bg-[#151C28] hover:text-[#F8FAFC]'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Student Self-Calculator</span>
                </Link>
                <Link
                  to="/analyze-class"
                  onClick={() => setShowRoleMenu(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-[#94A3B8] hover:bg-[#151C28] hover:text-[#F8FAFC]'
                      : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Teacher / Class Calculator</span>
                </Link>
                <Link
                  to="/analyze-university"
                  onClick={() => setShowRoleMenu(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-[#94A3B8] hover:bg-[#151C28] hover:text-[#F8FAFC]'
                      : 'text-slate-700 hover:bg-cyan-50 hover:text-cyan-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Admin / University Calculator</span>
                </Link>

                <div className={`border-t my-1 ${isDark ? 'border-[#202938]' : 'border-slate-100'}`} />
                <Link
                  to="/models"
                  onClick={() => setShowRoleMenu(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'text-[#94A3B8] hover:bg-[#151C28] hover:text-[#F8FAFC]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-indigo-500" />
                  <span>AI Intelligence Center</span>
                </Link>

                <div className={`border-t my-1 ${isDark ? 'border-[#202938]' : 'border-slate-100'}`} />
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                    navigate('/');
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 transition-colors cursor-pointer text-left ${
                    isDark ? 'hover:bg-[#151C28]' : 'hover:bg-rose-50'
                  }`}
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
