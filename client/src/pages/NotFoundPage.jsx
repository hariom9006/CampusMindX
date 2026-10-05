import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Compass, GraduationCap, Users, Shield, Cpu, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 aurora-bg-mesh selection:bg-indigo-500/20 selection:text-indigo-900 relative overflow-hidden">
      <div className="w-full max-w-2xl relative z-10 text-center">
        {/* Glowing 404 Icon & Code */}
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 mb-6 shadow-sm">
          <Sparkles className="w-12 h-12" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 uppercase mb-4">
          Error 404 • Neural Pathway Unresolved
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Page Not <span className="aurora-gradient-text">Found</span>
        </h1>

        <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
          The requested route <code className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono text-xs">{location.pathname}</code> does not exist in the CampusMind X neural matrix or has been repositioned.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all text-xs font-bold shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-all text-xs font-bold"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Role Switcher</span>
          </Link>
        </div>

        {/* Quick Portal Access Directory */}
        <div className="glass-panel p-6 rounded-[26px] border border-slate-200/80 bg-white/95 shadow-sm text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Verified Platform Portals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              to="/student"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 transition-colors group"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-slate-800 group-hover:text-indigo-700 block">Student Portal</span>
                <span className="text-[11px] text-slate-500">Risk modeling, skills & AI advisor</span>
              </div>
            </Link>

            <Link
              to="/faculty"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200/80 hover:border-purple-200 transition-colors group"
            >
              <Users className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-slate-800 group-hover:text-purple-700 block">Faculty Suite</span>
                <span className="text-[11px] text-slate-500">Cohort telemetry & early interventions</span>
              </div>
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-cyan-50/60 border border-slate-200/80 hover:border-cyan-200 transition-colors group"
            >
              <Shield className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-slate-800 group-hover:text-cyan-700 block">University Admin</span>
                <span className="text-[11px] text-slate-500">Institutional pass-rate & accreditation</span>
              </div>
            </Link>

            <Link
              to="/models"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 transition-colors group"
            >
              <Cpu className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-slate-800 group-hover:text-emerald-700 block">AI Intelligence Center</span>
                <span className="text-[11px] text-slate-500">XAI pipelines & model telemetry</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
