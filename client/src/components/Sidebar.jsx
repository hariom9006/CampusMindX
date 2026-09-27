import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Shield
} from 'lucide-react';

export default function Sidebar({ isOpen = true, onCloseMobile = null }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine section type
  let roleType = 'student';
  if (currentPath.startsWith('/faculty')) roleType = 'faculty';
  else if (currentPath.startsWith('/admin')) roleType = 'admin';

  const studentNavItems = [
    { name: 'Student Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Performance Analytics', path: '/student/performance', icon: LineChart },
    { name: 'Attendance Analytics', path: '/student/attendance', icon: CalendarCheck },
    { name: 'Skill Gap Analyzer', path: '/student/skills', icon: Target },
    { name: 'Learning Roadmap', path: '/student/roadmap', icon: Compass },
    { name: 'CampusMind AI Assistant', path: '/student/assistant', icon: Bot, highlight: true }
  ];

  const facultyNavItems = [
    { name: 'Faculty Dashboard', path: '/faculty', icon: LayoutDashboard },
    { name: 'Student Monitoring', path: '/faculty/students', icon: Users },
    { name: 'Cohort Analytics', path: '/faculty/analytics', icon: LineChart },
    { name: 'Faculty AI Assistant', path: '/faculty/assistant', icon: Bot, highlight: true }
  ];

  const adminNavItems = [
    { name: 'University Dashboard', path: '/admin', icon: Building2 },
    { name: 'Department Analytics', path: '/admin/analytics', icon: LineChart },
    { name: 'Executive AI Assistant', path: '/admin/assistant', icon: Bot, highlight: true }
  ];


  const activeItems =
    roleType === 'faculty'
      ? facultyNavItems
      : roleType === 'admin'
      ? adminNavItems
      : studentNavItems;

  const roleTitles = {
    student: { title: 'Student Portal', role: 'Aarav Sharma • BCA Sem 5', color: 'text-cyan-400' },
    faculty: { title: 'Faculty Suite', role: 'Dr. Sunita Kulkarni • Advisor', color: 'text-purple-400' },
    admin: { title: 'University Admin', role: 'Institutional Intelligence', color: 'text-blue-400' }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onCloseMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-slate-800/80 bg-[#070b14]/95 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Active Mode Banner */}
          <div className="mb-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Workspace</span>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xs font-bold ${roleTitles[roleType].color}`}>
                {roleTitles[roleType].title}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                v1.0 Production
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{roleTitles[roleType].role}</p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 px-3 tracking-wider">
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
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-cyan-400'
                        : item.highlight
                        ? 'text-purple-400 animate-pulse'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto text-[9px] bg-purple-900/60 text-purple-300 px-1.5 py-0.2 rounded font-mono border border-purple-500/30">
                      AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Cross-Platform Viewers */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 px-3 tracking-wider">
              Personal Analysis Mode
            </span>
            {roleType === 'faculty' ? (
              <NavLink
                to="/analyze-class"
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPath === '/analyze-class' || currentPath === '/my-class-analysis'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 border border-purple-500/20'
                }`}
              >
                <Users className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>Analyze My Class</span>
              </NavLink>
            ) : roleType === 'admin' ? (
              <NavLink
                to="/analyze-university"
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPath === '/analyze-university' || currentPath === '/my-university-analysis'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 border border-blue-500/20'
                }`}
              >
                <Shield className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>Analyze My University</span>
              </NavLink>
            ) : (
              <NavLink
                to="/analyze"
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPath === '/analyze' || currentPath === '/my-analysis'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Analyze My Data</span>
              </NavLink>
            )}
            {/* Connected LMS & Cloud Mode */}
            <NavLink
              to="/connect-university"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentPath === '/connect-university' || currentPath === '/connected-intelligence'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/20'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Connect University LMS</span>
            </NavLink>
            <NavLink
              to="/architecture"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                currentPath === '/architecture'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>System Architecture</span>
            </NavLink>
            <NavLink
              to="/login"
              onClick={onCloseMobile}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Switch Demo Persona</span>
            </NavLink>
          </div>
        </div>

        {/* Sidebar Footer with Explainability Badge */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>CampusMind XAI Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Explainable feature attributions active for BCA Sem 5 cohort.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
