import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Shield, Cpu, ArrowRight, Sparkles, CheckCircle2, Building2, Cloud, Lock } from 'lucide-react';

export default function RoleSelectPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student Portal',
      persona: 'Aarav Sharma',
      detail: 'BCA 5th Semester • Roll: 22BCA1042',
      focus: 'Performance: 71% | Attendance: 68% | Medium Risk',
      color: 'cyan',
      icon: GraduationCap,
      path: '/student',
      tags: ['Risk Modeling', 'Skill Gap Radar', 'AI Assistant']
    },
    {
      id: 'faculty',
      title: 'Faculty Advisor',
      persona: 'Dr. Sunita Kulkarni',
      detail: 'Associate Professor • Chair of Computing & IT',
      focus: 'Managing 8 Cohort Students • Early Interventions',
      color: 'purple',
      icon: Users,
      path: '/faculty',
      tags: ['Cohort Monitoring', 'Feature Attribution', 'Remedial Clinics']
    },
    {
      id: 'admin',
      title: 'University Admin',
      persona: 'Dean of Academic Affairs',
      detail: 'Central Academic Directorate',
      focus: '420 Enrolled Students • Macro Pass-Rate Forecasting',
      color: 'blue',
      icon: Shield,
      path: '/admin',
      tags: ['Department Analytics', 'Policy Insights', 'Accreditation']
    },
    {
      id: 'architect',
      title: 'System Architect',
      persona: 'Explainable AI Pipeline',
      detail: 'Technical Specification & Data Flow',
      focus: 'React UI + Express + FastAPI ML Foundation',
      color: 'emerald',
      icon: Cpu,
      path: '/architecture',
      tags: ['XAI Architecture', 'FastAPI Skeleton', 'Mongoose Schemas']
    }
  ];

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 radial-bg-overlay selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              CampusMind<span className="text-cyan-400">X</span>
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Choose Your Operational Mode</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Connect your university LMS, analyze personal data, or explore predefined demo personas.
          </p>
        </div>

        {/* Featured Card: Connected University LMS Mode */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-slate-900/90 to-cyan-950/50 border-2 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.2)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Building2 className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Connected LMS Mode
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1">
                    <Cloud className="w-2.5 h-2.5" /> iCloud Sync
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">Connect Your University Account</h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                  Official SSO / API connection to Galgotias, DU, Amity or Demo University LMS with zero password storage.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/connect-university"
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Connect University LMS</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Highlighted Section: Personal Analysis Modes */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Personal Modes • Real User Inputs
              </span>
              <h2 className="text-lg font-bold text-white">Analyze Your Own Academic Data</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Zero Fake Data
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student Personal Mode */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/60 via-slate-900/90 to-blue-950/60 border border-cyan-500/40 hover:border-cyan-400 shadow-lg flex flex-col justify-between group transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    Student
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Analyze My Data</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  Enter your subjects, marks, attendance, and career goals for custom insights.
                </p>
              </div>
              <Link
                to="/analyze"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow transition-all flex items-center justify-center gap-1.5"
              >
                <span>Start Student Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Faculty Personal Mode */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/60 via-slate-900/90 to-indigo-950/60 border border-purple-500/40 hover:border-purple-400 shadow-lg flex flex-col justify-between group transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                    Faculty
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Analyze My Class</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  Enter student marks, attendance roster, and assessment topics for cohort support flags.
                </p>
              </div>
              <Link
                to="/analyze-class"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow transition-all flex items-center justify-center gap-1.5"
              >
                <span>Start Class Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Admin Personal Mode */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/60 via-slate-900/90 to-indigo-950/60 border border-blue-500/40 hover:border-blue-400 shadow-lg flex flex-col justify-between group transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                    Admin
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Analyze My University</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  Enter department records, pass rates, and institutional benchmarks for macro policy.
                </p>
              </div>
              <Link
                to="/analyze-university"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow transition-all flex items-center justify-center gap-1.5"
              >
                <span>Start University Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Personas Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Demo Mode • Fictional Sample Data
            </span>
            <h3 className="text-base font-bold text-slate-200">Explore Predefined Personas</h3>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roles.map((r) => {
            const Icon = r.icon;
            const borderColors = {
              cyan: 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
              purple: 'border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
              blue: 'border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]',
              emerald: 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]'
            };

            const iconColors = {
              cyan: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40',
              purple: 'bg-purple-950/80 text-purple-400 border-purple-500/40',
              blue: 'bg-blue-950/80 text-blue-400 border-blue-500/40',
              emerald: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
            };

            return (
              <div
                key={r.id}
                onClick={() => navigate(r.path)}
                className={`glass-panel rounded-2xl p-6 border cursor-pointer transition-all duration-300 flex flex-col justify-between group ${borderColors[r.color]}`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl border ${iconColors[r.color]} shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {r.title}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-4 group-hover:text-cyan-300 transition-colors">
                    {r.persona}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{r.detail}</p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold block mb-0.5">
                      Operational State:
                    </span>
                    {r.focus}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors">
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Return to Landing Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
