import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BrainCircuit,
  GraduationCap,
  Users,
  Shield,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Activity,
  Layers,
  Building2,
  FileText,
  Compass,
  Target,
  ChevronRight,
  Database,
  ArrowDown,
  Menu,
  X,
  Check,
  Zap
} from 'lucide-react';
import AIOrb from '../components/AIOrb';
import ExplainabilityModal from '../components/ExplainabilityModal';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Neural pipeline nodes for Section 6
  const pipelineSteps = [
    {
      label: "STUDENT DATA",
      sub: "LMS, Attendance, Assessments",
      color: "from-indigo-500 to-indigo-600",
      accent: "#6366F1",
      badge: "Ingestion"
    },
    {
      label: "AI ANALYSIS",
      sub: "Feature Normalization & Attribution",
      color: "from-violet-500 to-violet-600",
      accent: "#8B5CF6",
      badge: "Processing"
    },
    {
      label: "PATTERN DETECTION",
      sub: "Temporal Trajectory Modeling",
      color: "from-pink-500 to-pink-600",
      accent: "#EC4899",
      badge: "Detection"
    },
    {
      label: "PREDICTION",
      sub: "Explainable Risk & Score Output",
      color: "from-cyan-500 to-cyan-600",
      accent: "#06B6D4",
      badge: "Inference"
    },
    {
      label: "RECOMMENDATION",
      sub: "Curated Remediations & Milestones",
      color: "from-emerald-500 to-emerald-600",
      accent: "#10B981",
      badge: "Guidance"
    },
    {
      label: "ACTION",
      sub: "Intervention & Student Success",
      color: "from-amber-500 to-amber-600",
      accent: "#F59E0B",
      badge: "Outcome"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col aurora-bg-mesh selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* ==================================================
          Top Navigation (Requirement 5 & Mobile Navigation)
          ================================================== */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                  CampusMind<span className="aurora-gradient-text font-black">X</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold hidden sm:block">
                  Aurora Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#product" className="hover:text-indigo-600 transition-colors">Product</a>
            <a href="#pipeline" className="hover:text-indigo-600 transition-colors">AI Intelligence</a>
            <a href="#students" className="hover:text-indigo-600 transition-colors">For Students</a>
            <a href="#faculty" className="hover:text-indigo-600 transition-colors">For Faculty</a>
            <a href="#universities" className="hover:text-indigo-600 transition-colors">For Universities</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {user?.name || 'Authenticated'}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize block">
                    {user?.role} Portal
                  </span>
                </div>
                <Link
                  to={user?.role === 'faculty' ? '/faculty' : user?.role === 'admin' ? '/admin' : '/student'}
                  className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center gap-1.5"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={logout}
                  className="hidden sm:inline-block text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 sm:px-5 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-5 space-y-3"
          >
            <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
              <a
                href="#product"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Product
              </a>
              <a
                href="#pipeline"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                AI Intelligence
              </a>
              <a
                href="#students"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                For Students
              </a>
              <a
                href="#faculty"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                For Faculty
              </a>
              <a
                href="#universities"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                For Universities
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                About
              </a>
            </div>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </header>

      {/* ==================================================
          Hero Section (Requirement 5 & 8)
          ================================================== */}
      <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Hero Typography */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>AI-POWERED UNIVERSITY INTELLIGENCE</span>
            </div>

            {/* Main Heading - Responsive Typography */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Your University.{' '}
              <br />
              <span className="aurora-gradient-text">
                Understood by AI.
              </span>
            </h1>

            {/* Editorial Heading quote */}
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-700">
              "Understand Your Campus. <span className="text-indigo-600">Predict What Comes Next.</span>"
            </p>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Turn academic data into meaningful insights, personalized guidance and better decisions. Explainable predictive modeling, skill gap telemetry, and student success interventions.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/student"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Explore CampusMind X</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#pipeline"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>See How It Works</span>
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Trust Pill */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> Explainable Predictions
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indigo-500" /> No Black Boxes
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-purple-500" /> Instant LMS Sync
              </span>
            </div>
          </div>

          {/* Right Column: Interactive AI Intelligence Visualization with Glowing Orb & Floating Glass Cards */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-6 lg:py-4">
            {/* Central Glowing AI Orb (Responsive sizing: 200 on mobile, 280 on desktop) */}
            <div className="relative flex items-center justify-center">
              <div className="block sm:hidden">
                <AIOrb size={200} />
              </div>
              <div className="hidden sm:block">
                <AIOrb size={280} />
              </div>

              {/* Floating Cards (Visible on sm+ screens where there's room to float without overflow) */}
              <div className="hidden sm:block">
                {/* Floating Card 1: Academic Health 92% (Top Left) */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -left-6 sm:-left-10 glass-card rounded-[22px] p-3.5 shadow-lg border border-slate-200/80 bg-white/90 z-20 flex items-center gap-3 backdrop-blur-xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-extrabold text-sm">
                    92%
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Academic Health
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Optimal Trajectory
                    </span>
                  </div>
                </motion.div>

                {/* Floating Card 2: Performance Trend ↑ 14% (Top Right) */}
                <motion.div
                  animate={{ y: [6, -6, 6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-4 -right-4 sm:-right-8 glass-card rounded-[22px] p-3.5 shadow-lg border border-slate-200/80 bg-white/90 z-20 flex items-center gap-3 backdrop-blur-xl"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Performance Trend
                    </span>
                    <span className="text-xs font-extrabold text-indigo-600 font-mono">
                      ↑ 14% this term
                    </span>
                  </div>
                </motion.div>

                {/* Floating Card 3: Skill Gap 3 detected (Bottom Left) */}
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -left-4 sm:-left-8 glass-card rounded-[22px] p-3.5 shadow-lg border border-slate-200/80 bg-white/90 z-20 flex items-center gap-3 backdrop-blur-xl"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Skill Gap
                    </span>
                    <span className="text-xs font-bold text-purple-700">
                      3 detected for Full Stack
                    </span>
                  </div>
                </motion.div>

                {/* Floating Card 4: AI Insight Recommendation ready (Bottom Right) */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  onClick={() => setExplainModalOpen(true)}
                  className="absolute -bottom-4 -right-4 sm:-right-6 glass-card rounded-[22px] p-3.5 shadow-lg border border-indigo-200/90 bg-white/95 z-20 flex items-center gap-3 backdrop-blur-xl cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      AI Insight
                    </span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Recommendation ready</span>
                      <ChevronRight className="w-3 h-3 text-indigo-500" />
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile Card Grid (Cleanly displayed below the orb on mobile screens without negative margin overflow) */}
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mt-6 sm:hidden">
              <div className="glass-card rounded-2xl p-3 border border-slate-200/80 bg-white/95 flex items-center gap-2.5 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-extrabold text-xs shrink-0">
                  92%
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Health</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">Optimal</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-3 border border-slate-200/80 bg-white/95 flex items-center gap-2.5 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Trend</span>
                  <span className="text-xs font-bold text-indigo-600 truncate block">↑ 14%</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-3 border border-slate-200/80 bg-white/95 flex items-center gap-2.5 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Skill Gap</span>
                  <span className="text-xs font-bold text-purple-700 truncate block">3 Detected</span>
                </div>
              </div>

              <div
                onClick={() => setExplainModalOpen(true)}
                className="glass-card rounded-2xl p-3 border border-pink-200/80 bg-white/95 flex items-center gap-2.5 shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">AI Model</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">Explain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          Section 6: DATA INTELLIGENCE VISUALIZATION (Neural Data Pipeline)
          ================================================== */}
      <section id="pipeline" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            Neural Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Intelligent Neural Data Pipeline
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            How continuous academic telemetry transforms raw student events into transparent, actionable guidance.
          </p>
        </div>

        {/* The Pipeline Node Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          {pipelineSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass-card rounded-[24px] p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group hover:-translate-y-1 bg-white/90"
            >
              {/* Step Number & Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                  style={{ backgroundColor: step.accent }}
                >
                  {idx + 1}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {step.badge}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1 mb-4">
                <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                  {step.label}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-snug">
                  {step.sub}
                </p>
              </div>

              {/* Indicator Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${step.color}`}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Connecting arrow for desktop between cards */}
              {idx < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-400">
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================================================
          Section: Persona Portals Showcase
          ================================================== */}
      <section id="product" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
            Role Portals
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Designed for Every Campus Stakeholder
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <div id="students" className="glass-panel rounded-[26px] p-7 border border-indigo-100/90 bg-white/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                For Students
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Continuous telemetry across attendance, performance, and coursework. Transparent feature attribution explains why risks are flagged and provides an 8-week career roadmap.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Academic Trajectory Score (84/100)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Career Skill Gap Engine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Conversational CampusMind AI
                </li>
              </ul>
            </div>
            <Link
              to="/student"
              className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              <span>Launch Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Faculty Card */}
          <div id="faculty" className="glass-panel rounded-[26px] p-7 border border-purple-100/90 bg-white/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                For Faculty
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Intelligence over CRUD. Proactive student monitoring identifies students requiring support signals before mid-term examinations, with AI cohort breakdowns.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Support Signals Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Course Attendance Deficit Alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Automated Advisor Notes
                </li>
              </ul>
            </div>
            <Link
              to="/faculty"
              className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
            >
              <span>Launch Faculty Suite</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* University Admin Card */}
          <div id="universities" className="glass-panel rounded-[26px] p-7 border border-cyan-100/90 bg-white/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                For Universities
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Campus-wide intelligence for Deans and Academic Administrators. Retention modeling, placement readiness heatmaps, and cross-department telemetry.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Institutional Academic Health (92%)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Department Performance Heatmap
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Placement Preparedness Metrics
                </li>
              </ul>
            </div>
            <Link
              to="/admin"
              className="mt-6 inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors"
            >
              <span>Launch University Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          Footer (Requirement 5)
          ================================================== */}
      <footer id="about" className="mt-auto border-t border-slate-200/80 bg-white/90 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900">CampusMind X</span>
              <span className="text-[11px] text-slate-400 block font-medium">Aurora Intelligence System</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-semibold">
            <Link to="/models" className="hover:text-indigo-600 transition-colors">AI Model Center</Link>
            <Link to="/architecture" className="hover:text-indigo-600 transition-colors">System Architecture</Link>
            <Link to="/analyze" className="hover:text-indigo-600 transition-colors">Self-Analysis</Link>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 CampusMind X. Explainable University Intelligence.
          </p>
        </div>
      </footer>

      {/* Explainable AI Modal Preview */}
      <ExplainabilityModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        studentName="Hariom"
        rollNo="22BCA1042"
        riskLevel="Healthy trajectory"
      />
    </div>
  );
}
