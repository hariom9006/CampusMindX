import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Compass, GraduationCap, Users, Shield, Cpu, RefreshCw } from 'lucide-react';

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 radial-bg-overlay selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 text-center">
        {/* Glowing 404 Icon & Code */}
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.25)] mb-6 animate-pulse">
          <ShieldAlert className="w-12 h-12 text-cyan-400" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 uppercase mb-4">
          Error 404 • Neural Pathway Unresolved
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Page Not <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Found</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-4 leading-relaxed">
          The requested route <code className="text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 font-mono text-xs">{location.pathname}</code> does not exist in the CampusMind X neural matrix or has been repositioned.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all text-sm font-semibold shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white transition-all text-sm font-semibold"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Role Switcher</span>
          </Link>
        </div>

        {/* Quick Portal Access Directory */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#070b14]/80 backdrop-blur-xl text-left">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Verified Platform Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              to="/student"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-semibold text-slate-200 group-hover:text-cyan-300 block">Student Portal</span>
                <span className="text-[10px] text-slate-500">Risk modeling, skills & AI advisor</span>
              </div>
            </Link>

            <Link
              to="/faculty"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 transition-colors group"
            >
              <Users className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-semibold text-slate-200 group-hover:text-purple-300 block">Faculty Advisor</span>
                <span className="text-[10px] text-slate-500">Cohort telemetry & early interventions</span>
              </div>
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/40 transition-colors group"
            >
              <Shield className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-semibold text-slate-200 group-hover:text-blue-300 block">University Admin</span>
                <span className="text-[10px] text-slate-500">Institutional pass-rate & accreditation</span>
              </div>
            </Link>

            <Link
              to="/architecture"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 transition-colors group"
            >
              <Cpu className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-semibold text-slate-200 group-hover:text-emerald-300 block">System Architecture</span>
                <span className="text-[10px] text-slate-500">XAI pipelines & FastAPI/Express specs</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
