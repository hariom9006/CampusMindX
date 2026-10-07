import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  CalendarCheck,
  Target,
  Compass,
  Bot,
  Users,
  Building2,
  Cpu,
  GraduationCap,
  Sparkles,
  Shield,
  Layers,
  Activity,
  Lightbulb,
  CheckCircle2,
  User,
  LogOut,
  Bell,
  FileText,
  CheckSquare,
  Settings,
  ShieldAlert,
  PieChart,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ isOpen = true, onCloseMobile = null }) {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    if (onCloseMobile) onCloseMobile();
    navigate('/login');
  };

  // Determine section type
  let roleType = user?.role || 'student';
  if (currentPath.startsWith('/faculty')) roleType = 'faculty';
  else if (currentPath.startsWith('/admin')) roleType = 'admin';

  const studentNavItems = [
    { name: 'Overview', path: '/student', icon: LayoutDashboard },
    { name: 'Performance', path: '/student/performance', icon: LineChart },
    { name: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
    { name: 'Skill Gap Analyzer', path: '/student/skills', icon: Target },
    { name: 'Career Roadmap', path: '/student/roadmap', icon: Compass },
    { name: 'Analyse My Data', path: '/analyze', icon: Sparkles, badge: 'Self-Calc' },
    { name: 'AI Assistant', path: '/student/assistant', icon: Bot, highlight: true },
    { name: 'Notifications', path: '/student#notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/profile', icon: Settings }
  ];

  const facultyNavItems = [
    { name: 'Overview', path: '/faculty', icon: LayoutDashboard },
    { name: 'Class Intelligence', path: '/faculty', icon: Activity },
    { name: 'Students', path: '/faculty/students', icon: Users },
    { name: 'Performance Analytics', path: '/faculty/analytics', icon: LineChart },
    { name: 'Attendance Analytics', path: '/faculty/analytics', icon: CalendarCheck },
    { name: 'Support Signals', path: '/faculty/students', icon: ShieldAlert },
    { name: 'Analyse Class Data', path: '/analyze-class', icon: Sparkles, badge: 'Self-Calc' },
    { name: 'AI Assistant', path: '/faculty/assistant', icon: Bot, highlight: true },
    { name: 'Reports', path: '/faculty/analytics', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const adminNavItems = [
    { name: 'University Overview', path: '/admin', icon: Building2 },
    { name: 'University Intelligence', path: '/admin', icon: Activity },
    { name: 'Academic Analytics', path: '/admin/analytics', icon: LineChart },
    { name: 'Analyse University Data', path: '/analyze-university', icon: Sparkles, badge: 'Self-Calc' },
    { name: 'AI Assistant', path: '/admin/assistant', icon: Bot, highlight: true },
    { name: 'Reports', path: '/admin/analytics', icon: FileText },
    { name: 'System Settings', path: '/profile', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const activeItems =
    roleType === 'faculty'
      ? facultyNavItems
      : roleType === 'admin'
      ? adminNavItems
      : studentNavItems;

  const roleTitles = {
    student: {
      title: 'Student Portal',
      role: `${user?.name || 'Hariom Anand'} • BCA Sem 5`,
      color: 'text-indigo-600',
      badge: 'Aurora Student'
    },
    faculty: {
      title: 'Faculty Suite',
      role: user?.name ? `${user.name} • Faculty Advisor` : 'Dr. Sunita Kulkarni • Advisor',
      color: 'text-purple-600',
      badge: 'Faculty AI'
    },
    admin: {
      title: 'University Admin',
      role: user?.name ? `${user.name} • Administrator` : 'Dr. Rajesh Rao • Registrar',
      color: 'text-cyan-600',
      badge: 'Executive Admin'
    }
  };

  return (
    <>
      {/* Mobile backdrop with smooth blur */}
      {isOpen && onCloseMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-30 h-full md:h-[calc(100vh-4rem)] w-72 max-w-[85vw] md:w-56 lg:w-60 xl:w-64 border-r backdrop-blur-xl flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out shrink-0 shadow-2xl md:shadow-none ${
          isDark
            ? 'bg-[#0D111A]/95 md:bg-[#0D111A]/85 border-[#202938] text-[#F8FAFC]'
            : 'glass-panel border-slate-200/80 bg-white/95 md:bg-white/80 text-slate-800'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto pr-1">
          {/* Mobile Drawer Header with Close Button */}
          <div className="flex md:hidden items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                CampusMind<span className="aurora-gradient-text font-black">X</span>
              </span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Workspace Persona Banner */}
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-100/80 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Workspace</span>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xs font-bold ${roleTitles[roleType].color}`}>
                {roleTitles[roleType].title}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 shadow-2xs">
                {roleTitles[roleType].badge}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-600 mt-1 truncate">
              {roleTitles[roleType].role}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 px-3 tracking-wider">
              Navigation
            </span>
            {activeItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/student' || item.path === '/faculty' || item.path === '/admin'
                  ? currentPath === item.path
                  : currentPath.startsWith(item.path);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-purple-600 animate-pulse'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                  {item.highlight && !isActive && (
                    <span className="ml-auto text-[9px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.2 rounded-full font-bold">
                      AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* AI Intelligence & Personal Analysis */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 px-3 tracking-wider">
              AI Intelligence
            </span>

            {/* AI Models Center Link */}
            <NavLink
              to="/models"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentPath === '/models'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
            >
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>AI Model Center</span>
            </NavLink>

            {/* Personal Mode */}
            {roleType === 'faculty' ? (
              <NavLink
                to="/analyze-class"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPath === '/analyze-class' || currentPath === '/my-class-analysis' || currentPath === '/faculty/analyze'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span>Analyse My Data (Teacher)</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Self-Calc
                </span>
              </NavLink>
            ) : roleType === 'admin' ? (
              <NavLink
                to="/analyze-university"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPath === '/analyze-university' || currentPath === '/my-university-analysis' || currentPath === '/admin/analyze'
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    : 'text-cyan-700 hover:bg-cyan-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" />
                  <span>Analyse My Data (Admin)</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200">
                  Self-Calc
                </span>
              </NavLink>
            ) : (
              <NavLink
                to="/analyze"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPath === '/analyze' || currentPath === '/my-analysis' || currentPath === '/student/analyze'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span>Analyse My Data (Student)</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Self-Calc
                </span>
              </NavLink>
            )}

            {/* Architecture Link */}
            <NavLink
              to="/architecture"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentPath === '/architecture'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>System Architecture</span>
            </NavLink>

            {/* Switch Persona */}
            <NavLink
              to="/login"
              onClick={onCloseMobile}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Switch Persona</span>
            </NavLink>
          </div>
        </div>

        {/* Sidebar Footer with Theme Switcher, User Card & Logout */}
        <div className={`pt-3 border-t space-y-2 ${isDark ? 'border-[#202938]' : 'border-slate-200/80'}`}>
          {/* Quick Theme Switcher */}
          <div
            className={`p-2 rounded-xl flex items-center justify-between border text-xs ${
              isDark ? 'bg-[#151C28] border-[#202938] text-[#F8FAFC]' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className="font-semibold text-[11px]">Theme</span>
            <ThemeToggle variant="segmented" />
          </div>

          {isAuthenticated && user ? (
            <div
              className={`p-2.5 rounded-2xl border shadow-sm ${
                isDark ? 'bg-[#151C28] border-[#202938]' : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate leading-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-800'}`}>
                    {user.name}
                  </p>
                  <p className={`text-[10px] truncate ${isDark ? 'text-[#94A3B8]' : 'text-slate-400'}`}>
                    {user.email}
                  </p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md capitalize ${
                  isDark ? 'bg-[#111722] text-[#8B5CF6] border border-[#202938]' : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? 'text-rose-400 bg-rose-950/30 hover:bg-rose-900/50 border-rose-900/40'
                    : 'text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200'
                }`}
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className={`p-3 rounded-2xl border text-xs ${
              isDark ? 'bg-[#151C28] border-[#202938] text-[#94A3B8]' : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-100'
            }`}>
              <div className="flex items-center gap-2 text-indigo-500 font-bold mb-0.5">
                <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>CampusMind X</span>
              </div>
              <p className="text-[11px] opacity-80 leading-snug">
                University Intelligence & Student Success.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
