import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BrainCircuit,
  GraduationCap,
  Users,
  Shield,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle,
  CheckCircle2,
  Activity,
  Layers,
  ChevronRight,
  Building2,
  Cloud,
  Lock,
  ShieldCheck,
  BookOpen,
  FileText
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col radial-bg-overlay selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#070b14]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent block leading-tight">
                CampusMind<span className="text-cyan-400">X</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                Explainable University Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/architecture"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/60 transition-colors hidden lg:inline-flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>System Architecture</span>
            </Link>
            <Link
              to="/connect-university"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Connect University</span>
            </Link>
            <Link
              to="/analyze"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all hidden sm:flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Analyze My Data</span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5"
            >
              <span>Explore Demo Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>BCA Final-Year Project • Phase 1 UI & Foundation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            An Explainable AI-Powered{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              University Intelligence
            </span>{' '}
            & Student Success Platform
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
            Eliminating black-box academic predictions. Transparent risk attribution, continuous attendance telemetry, career-aligned skill gap analysis, and tailored remedial roadmaps.
          </p>

          {/* NEW PROMINENT FEATURE: Connect Your University (Glassmorphism Futuristic Card) */}
          <div className="mt-10 max-w-4xl mx-auto w-full text-left">
            <div className="relative p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-cyan-950/40 border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.25)] hover:border-emerald-400/70 transition-all overflow-hidden">
              {/* Top ambient glow */}
              <div className="absolute top-0 right-1/4 w-72 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-60 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Status Header & Secure Connection Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Building2 className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        Connected LMS Mode
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                        <Cloud className="w-2.5 h-2.5" /> iCloud & Cloud Sync
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                      Connect Your University
                    </h2>
                  </div>
                </div>

                {/* Secure Connection Indicator */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">OAuth 2.0 / Zero Password Storage</span>
                </div>
              </div>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl relative z-10 mb-6 font-medium">
                Connect your university LMS or academic portal and let CampusMind AI analyze your academic journey automatically.
              </p>

              {/* Animated Connection Line & Architecture Pipeline */}
              <div className="relative z-10 mb-8 p-4 rounded-2xl bg-[#030712]/70 border border-slate-800/90 overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Building2 className="w-3.5 h-3.5" /> University LMS / ERP
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                    <Cloud className="w-3.5 h-3.5" /> iCloud / Documents
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
                    <BrainCircuit className="w-3.5 h-3.5" /> CampusMind AI Engine
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Personalized Results
                  </span>
                </div>

                {/* Animated SVG Stream */}
                <div className="relative h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500 opacity-70 animate-pulse" />
                  <div className="absolute top-0 bottom-0 w-24 bg-white/40 blur-xs rounded-full animate-marquee" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 text-[11px] font-sans text-slate-400 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Galgotias, DU, Amity, MU</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Marksheet & PDF Parser</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Explainable Support KPIs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Adaptive Remedial Roadmap</span>
                  </div>
                </div>
              </div>

              {/* 4 Required Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
                <Link
                  to="/connect-university"
                  className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                  <Building2 className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                  <span>Connect University LMS</span>
                </Link>

                <Link
                  to="/connect-university?tab=cloud"
                  className="py-3 px-4 rounded-xl text-xs font-bold text-cyan-200 bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/60 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all flex items-center justify-center gap-2 group"
                >
                  <Cloud className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>Import Academic Data</span>
                </Link>

                <Link
                  to="/analyze"
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Continue with Manual Entry</span>
                </Link>

                <Link
                  to="/student"
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-950/80 border border-slate-800 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>Explore Demo</span>
                </Link>
              </div>

              {/* Data Mode Integrity Notice */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Strict Mode Isolation: Connected LMS data is never mixed with demo data.
                </span>
                <span className="text-slate-500">
                  Granular permission control • Disconnect anytime
                </span>
              </div>
            </div>
          </div>

          {/* Operational Data Modes Overview Bar */}
          <div className="mt-8 max-w-4xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-2.5 text-left text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">1. Demo Mode</span>
              <p className="text-slate-300 text-[11px] mt-0.5">Realistic sample dataset (Aarav Sharma).</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">2. Personal Mode</span>
              <p className="text-slate-300 text-[11px] mt-0.5">Direct manual entry by student, faculty, admin.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 bg-emerald-950/20">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">3. Connected LMS</span>
              <p className="text-slate-300 text-[11px] mt-0.5">Official university portal / SSO token sync.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 bg-cyan-950/20">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">4. Cloud Data Mode</span>
              <p className="text-slate-300 text-[11px] mt-0.5">Authorized iCloud & marksheet PDF ingestion.</p>
            </div>
          </div>

          {/* Secondary Options: Analyze My Data vs Explore Demo */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto text-left">
            {/* Mode 1: Analyze My Data (Personal Mode) */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-blue-950/40 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:border-cyan-400 transition-all flex flex-col justify-between group">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                Personal Mode
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Sparkles className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  Analyze My Data
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Enter your academic and career information to get your personalized CampusMind X analysis.
                </p>
                <div className="space-y-1.5 mb-5 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>Student: Personal subjects, marks & career roadmap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>Faculty: Class student roster, attendance & support flags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Admin: University departments & institutional telemetry</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/analyze"
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]"
                >
                  <span>Start Student Analysis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center justify-center gap-4 pt-1">
                  <Link to="/analyze-class" className="text-xs text-purple-300 hover:text-purple-200 underline flex items-center gap-1">
                    <span>Faculty Analysis</span>
                  </Link>
                  <span className="text-slate-600">•</span>
                  <Link to="/analyze-university" className="text-xs text-blue-300 hover:text-blue-200 underline flex items-center gap-1">
                    <span>Admin Analysis</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mode 2: Explore Demo (Demo Mode) */}
            <div className="relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                Demo Mode
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6 text-purple-300" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  Explore Demo
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Uses fictional sample data for Aarav Sharma (BCA Sem 5), faculty mentor & dean portals.
                </p>
                <div className="space-y-1.5 mb-6 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>Predefined fictional student dataset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>Explore faculty & administrator dashboards</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/student"
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-slate-100 hover:text-white glass-panel hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-purple-500/50"
                >
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>Explore Demo (Aarav Sharma)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-4 pt-1">
                  <Link to="/faculty" className="text-xs text-purple-300 hover:text-purple-200 underline">
                    Faculty Portal
                  </Link>
                  <span className="text-slate-600">•</span>
                  <Link to="/admin" className="text-xs text-blue-300 hover:text-blue-200 underline">
                    Admin Portal
                  </Link>
                  <span className="text-slate-600">•</span>
                  <Link to="/login" className="text-xs text-slate-400 hover:text-slate-300 underline">
                    All Personas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats / Live Telemetry Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
          <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 text-center">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">Featured Persona</span>
            <span className="text-xl font-bold text-white mt-1 block">Aarav Sharma</span>
            <span className="text-xs text-slate-400">BCA Sem 5 • 71% Overall</span>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-amber-500/20 text-center">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">Attendance Telemetry</span>
            <span className="text-xl font-bold text-amber-300 mt-1 block">68% (Below 75%)</span>
            <span className="text-xs text-slate-400">10 classes to clearance</span>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-purple-500/20 text-center">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">Explainable AI Core</span>
            <span className="text-xl font-bold text-purple-300 mt-1 block">Feature Attribution</span>
            <span className="text-xs text-slate-400">Transparent Factor Attribution</span>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 text-center">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">Career Alignment</span>
            <span className="text-xl font-bold text-emerald-300 mt-1 block">Full Stack Dev</span>
            <span className="text-xs text-slate-400">64% Industry Readiness</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-white">Three Distinct Operational Tiers</h2>
            <p className="text-xs text-slate-400 mt-1">
              Purpose-built interfaces tailored to each stakeholder across the academic lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Tier */}
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/25 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Student Intelligence</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Real-time visibility into continuous performance, exam clearance thresholds, skill gap radar, and the conversational CampusMind AI assistant.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Predictive CGPA & early risk score</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Attendance deficit recovery sprint planner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Full Stack career milestone roadmap</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/student"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>Enter Student View</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Faculty Tier */}
            <div className="glass-panel rounded-2xl p-6 border border-purple-500/25 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Faculty & Advisory Suite</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Early detection of at-risk students before mid-term failures occur. Transparent feature attribution explains why students struggle.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>Cohort risk triage & search filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>One-click Explainability Factor Modal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>Remedial clinic assignment workflows</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/faculty"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                <span>Enter Faculty Suite</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Admin Tier */}
            <div className="glass-panel rounded-2xl p-6 border border-blue-500/25 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">University Administration</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Macro-level department benchmarks, pass-rate forecasting, institutional risk distributions, and systemic academic policy insights.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>School of Computing & IT analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Cross-department GPA distribution curves</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Retention & accreditation metrics</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/admin"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>Enter Admin Console</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <p>CampusMind X — BCA Final Year Capstone Project • Phase 1 Prototype Foundation</p>
        <p className="mt-1 text-[11px] text-slate-400 font-mono">
          Explainable AI Integration simulated for academic demonstration. No real ML weights or external credentials exposed.
        </p>
      </footer>
    </div>
  );
}
