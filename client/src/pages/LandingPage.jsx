import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Building2,
  Target,
  ChevronRight,
  Menu,
  X,
  Check,
  Cpu,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import ExplainabilityModal from '../components/ExplainabilityModal';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark } = useTheme();
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Technical Architecture Pipeline (Deterministic & Transparent)
  const pipelineSteps = [
    {
      step: '01',
      title: 'DATA INGESTION',
      badge: 'Input Streams',
      description: 'Unified ingestion of LMS activity, biometric attendance, lab completion, and continuous internal assessments.'
    },
    {
      step: '02',
      title: 'FEATURE NORMALIZATION',
      badge: 'Preprocessing',
      description: 'Z-score standardization across cohort distributions, credit weight computation, and temporal trend extraction.'
    },
    {
      step: '03',
      title: 'INTELLIGENCE ENGINE',
      badge: 'Machine Learning',
      description: 'Dual-model execution: calibrated Random Forest classification and Ridge Regression continuous GPA forecasting.'
    },
    {
      step: '04',
      title: 'XAI ATTRIBUTION',
      badge: 'Explainable AI',
      description: 'Additive empirical feature attribution isolating primary positive and negative factors without black-box metrics.'
    },
    {
      step: '05',
      title: 'VALIDATED ACTION',
      badge: 'Outcome',
      description: 'Personalized recovery roadmap dispatch, proactive faculty advisor alerts, and institutional telemetry.'
    }
  ];

  // 6 Core Features (Minimal Enterprise Cards)
  const features = [
    {
      icon: Activity,
      title: 'Academic Intelligence',
      description: 'Multi-semester academic telemetry tracking credit velocity, subject mastery distributions, and continuous assessment trajectories.',
      tag: 'Continuous Telemetry'
    },
    {
      icon: TrendingUp,
      title: 'Performance Prediction',
      description: 'Continuous future semester GPA projections powered by empirical Ridge Regression with strict 95% statistical confidence bounds.',
      tag: 'Ridge Regression'
    },
    {
      icon: Target,
      title: 'Skill Gap Analysis',
      description: 'Deterministic benchmarking against 5 industry career tracks to compute Role Readiness Index and prioritize curriculum deficits.',
      tag: 'Curriculum Alignment'
    },
    {
      icon: Compass,
      title: 'Personalized Guidance',
      description: 'Structured 12-week remediation roadmaps, targeted milestone scheduling, and course-specific study pathways.',
      tag: 'Validated Action'
    },
    {
      icon: Layers,
      title: 'Explainable AI (XAI)',
      description: 'Additive feature attribution providing transparent positive and negative drivers behind every evaluation with ethical non-causal framing.',
      tag: 'Zero Black Boxes'
    },
    {
      icon: Building2,
      title: 'University Analytics',
      description: 'Institutional-level intelligence delivering retention probability modeling, department-by-department pass rates, and accreditation metrics.',
      tag: 'Institutional Scale'
    }
  ];

  // Sample Intelligence Metrics (Cleanly labeled demo benchmarks)
  const metrics = [
    {
      value: '94.2%',
      label: 'Model Calibration Rate',
      sub: 'Sample Intelligence · Benchmark Cohort'
    },
    {
      value: '±0.18',
      label: 'Continuous GPA Margin',
      sub: 'Ridge Regression · 95% Confidence'
    },
    {
      value: '19',
      label: 'Specialized Query Intents',
      sub: 'Context-Aware AI Assistant'
    },
    {
      value: '< 120ms',
      label: 'Inference Response Time',
      sub: 'Microservice API Gateway'
    }
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased overflow-x-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#080B12] text-[#F8FAFC] dark-bg-grid selection:bg-[#8B5CF6]/30 selection:text-white'
          : 'bg-[#F8FAFC] text-[#0F172A] light-bg-grid selection:bg-indigo-500/20 selection:text-indigo-900'
      }`}
    >
      {/* ==================================================
          Top Navigation (Dark & Light Responsive Navbar)
          ================================================== */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
          isDark
            ? 'bg-[#080B12]/85 border-[#202938]'
            : 'bg-white/90 border-slate-200/90 shadow-2xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                isDark
                  ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151C28]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                  isDark
                    ? 'bg-[#151C28] border-[#202938] text-[#8B5CF6] group-hover:border-[#8B5CF6]/50'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-600 group-hover:border-indigo-400'
                }`}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span
                  className={`text-base sm:text-lg font-bold tracking-tight block leading-tight ${
                    isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                  }`}
                >
                  CampusMind{' '}
                  <span className={isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}>
                    X
                  </span>
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider font-mono font-medium hidden sm:block ${
                    isDark ? 'text-[#64748B]' : 'text-slate-400'
                  }`}
                >
                  University Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-7 text-sm font-medium transition-colors ${
              isDark ? 'text-[#94A3B8]' : 'text-slate-600'
            }`}
          >
            <a href="#product" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              Product
            </a>
            <a href="#pipeline" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              Intelligence
            </a>
            <a href="#students" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              For Students
            </a>
            <a href="#faculty" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              For Faculty
            </a>
            <a href="#universities" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              For Universities
            </a>
            <Link to="/architecture" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              Architecture
            </Link>
            <a href="#about" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              About
            </a>
          </nav>

          {/* Action Buttons & Theme Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark / Light Theme Toggle Button */}
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <div className="hidden sm:block text-right">
                  <span
                    className={`text-xs font-semibold block leading-tight ${
                      isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                    }`}
                  >
                    {user?.name || 'Authenticated'}
                  </span>
                  <span
                    className={`text-[10px] capitalize block font-mono ${
                      isDark ? 'text-[#64748B]' : 'text-slate-400'
                    }`}
                  >
                    {user?.role} Portal
                  </span>
                </div>
                <Link
                  to={user?.role === 'faculty' ? '/faculty' : user?.role === 'admin' ? '/admin' : '/student'}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                    isDark
                      ? 'text-[#080B12] bg-[#F8FAFC] hover:bg-white'
                      : 'text-white bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={logout}
                  className={`hidden sm:inline-block text-xs font-medium px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    isDark
                      ? 'text-[#64748B] hover:text-[#EF4444] hover:bg-[#151C28]'
                      : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
                  }`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                    isDark
                      ? 'text-[#E2E8F0] hover:text-white bg-transparent border-[#202938] hover:border-[#8B5CF6]/50 hover:bg-[#151C28]'
                      : 'text-slate-700 hover:text-slate-900 bg-white border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                    isDark
                      ? 'text-[#080B12] bg-[#F8FAFC] hover:bg-white'
                      : 'text-white bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t px-4 pt-3 pb-5 space-y-3 ${
              isDark ? 'border-[#202938] bg-[#0D111A]' : 'border-slate-200 bg-white/95'
            }`}
          >
            <div
              className={`flex flex-col space-y-2 text-sm font-medium ${
                isDark ? 'text-[#94A3B8]' : 'text-slate-700'
              }`}
            >
              <a
                href="#product"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl transition-colors ${
                  isDark
                    ? 'hover:bg-[#151C28] hover:text-[#F8FAFC]'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Product
              </a>
              <a
                href="#pipeline"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl transition-colors ${
                  isDark
                    ? 'hover:bg-[#151C28] hover:text-[#F8FAFC]'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Intelligence
              </a>
              <a
                href="#students"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl transition-colors ${
                  isDark
                    ? 'hover:bg-[#151C28] hover:text-[#F8FAFC]'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                For Students
              </a>
              <a
                href="#faculty"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl transition-colors ${
                  isDark
                    ? 'hover:bg-[#151C28] hover:text-[#F8FAFC]'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                For Faculty
              </a>
              <a
                href="#universities"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl transition-colors ${
                  isDark
                    ? 'hover:bg-[#151C28] hover:text-[#F8FAFC]'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                For Universities
              </a>
              <Link
                to="/architecture"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl transition-colors ${
                  isDark
                    ? 'hover:bg-[#151C28] hover:text-[#F8FAFC]'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Architecture
              </Link>
            </div>

            {/* Mobile Theme Toggle Row */}
            <div
              className={`pt-3 border-t flex items-center justify-between ${
                isDark ? 'border-[#202938]' : 'border-slate-200'
              }`}
            >
              <span className={`text-xs font-medium ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                Appearance Theme
              </span>
              <ThemeToggle showLabel />
            </div>

            {isAuthenticated ? (
              <div
                className={`pt-3 border-t flex items-center justify-between ${
                  isDark ? 'border-[#202938]' : 'border-slate-200'
                }`}
              >
                <span className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                    isDark ? 'text-[#EF4444] hover:bg-[#151C28]' : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div
                className={`pt-3 border-t grid grid-cols-2 gap-2 ${
                  isDark ? 'border-[#202938]' : 'border-slate-200'
                }`}
              >
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-center py-2.5 rounded-xl border text-xs font-medium ${
                    isDark
                      ? 'border-[#202938] text-[#E2E8F0] hover:bg-[#151C28]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-center py-2.5 rounded-xl text-xs font-semibold ${
                    isDark
                      ? 'text-[#080B12] bg-[#F8FAFC] hover:bg-white'
                      : 'text-white bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </header>

      {/* ==================================================
          Hero Section (Dynamic Dark & Light Theme)
          ================================================== */}
      <section
        className={`relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full ${
          isDark ? 'dark-hero-ambient' : 'bg-gradient-to-b from-indigo-50/30 via-transparent to-transparent'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Minimal Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
                isDark
                  ? 'bg-[#111722] border-[#202938] text-[#94A3B8]'
                  : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#8B5CF6]' : 'bg-indigo-600'}`} />
              <span>UNIVERSITY INTELLIGENCE & STUDENT SUCCESS</span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] ${
                isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
              }`}
            >
              Your University.<br />
              Understood by{' '}
              <span className={isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}>
                Intelligence.
              </span>
            </h1>

            {/* Editorial Statement */}
            <p className={`text-lg sm:text-xl font-medium ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
              "Understand Your Campus.{' '}
              <span className={isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}>
                Predict What Comes Next.
              </span>"
            </p>

            {/* Subtitle */}
            <p
              className={`text-sm sm:text-base max-w-xl leading-relaxed mx-auto lg:mx-0 ${
                isDark ? 'text-[#94A3B8]' : 'text-slate-600'
              }`}
            >
              Turn continuous academic telemetry into transparent, non-causal insights, personalized career roadmaps, and validated student success interventions across every institutional department.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/register"
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 ${
                  isDark
                    ? 'text-[#080B12] bg-[#F8FAFC] hover:bg-white'
                    : 'text-white bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#pipeline"
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'text-[#E2E8F0] bg-transparent border-[#202938] hover:border-[#8B5CF6]/50 hover:bg-[#151C28]'
                    : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>Explore Architecture</span>
                <ChevronRight className={`w-4 h-4 ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`} />
              </a>
            </div>

            {/* Minimal Trust Pill Signals */}
            <div
              className={`pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-medium ${
                isDark ? 'text-[#64748B]' : 'text-slate-500'
              }`}
            >
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                <Check className="w-3.5 h-3.5 text-[#22C55E]" /> Explainable Predictions
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                <Check className="w-3.5 h-3.5 text-[#3B82F6]" /> Zero Black-Box Scoring
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}`} /> Real-Time Telemetry Sync
              </span>
            </div>
          </div>

          {/* Right Column: Sophisticated Enterprise Telemetry Console */}
          <div className="lg:col-span-6 relative z-10">
            <div
              className={`border rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-colors ${
                isDark
                  ? 'bg-[#111722] border-[#202938]'
                  : 'bg-white border-slate-200/90 shadow-xl'
              }`}
            >
              {/* Header Terminal Bar */}
              <div
                className={`flex items-center justify-between border-b pb-4 mb-5 ${
                  isDark ? 'border-[#202938]' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-[#202938]' : 'bg-slate-300'}`} />
                  <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-[#202938]' : 'bg-slate-300'}`} />
                  <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-[#202938]' : 'bg-slate-300'}`} />
                  <span
                    className={`text-[11px] font-mono ml-2 ${
                      isDark ? 'text-[#64748B]' : 'text-slate-400'
                    }`}
                  >
                    campusmind.internal / telemetry / cohort-2026
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <span>ONLINE · 12ms</span>
                </div>
              </div>

              {/* Console Metric Cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div
                  className={`border rounded-xl p-3 ${
                    isDark ? 'bg-[#151C28] border-[#202938]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                    Stability
                  </span>
                  <div className={`text-base sm:text-lg font-bold mt-0.5 ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    94.2%
                  </div>
                  <span className="text-[10px] text-[#22C55E] font-mono font-medium">Optimal Tier</span>
                </div>
                <div
                  className={`border rounded-xl p-3 ${
                    isDark ? 'bg-[#151C28] border-[#202938]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                    Forecast GPA
                  </span>
                  <div className={`text-base sm:text-lg font-bold mt-0.5 ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    8.74
                  </div>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                    ± 0.18 CI
                  </span>
                </div>
                <div
                  className={`border rounded-xl p-3 ${
                    isDark ? 'bg-[#151C28] border-[#202938]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                    Risk Index
                  </span>
                  <div className="text-base sm:text-lg font-bold text-[#22C55E] mt-0.5">Low</div>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                    0.12 calibrated
                  </span>
                </div>
              </div>

              {/* Minimal Telemetry Trajectory Chart Preview */}
              <div
                className={`border rounded-xl p-4 mb-5 ${
                  isDark ? 'bg-[#0D111A] border-[#202938]' : 'bg-slate-900 border-slate-800 text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-semibold text-[#F8FAFC]">Continuous Performance Trajectory</h4>
                    <span className="text-[10px] text-slate-400">12-week empirical trend vs cohort benchmark (Sample Intelligence)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Ridge Regression
                  </span>
                </div>

                {/* SVG Visual Telemetry Curve */}
                <div className="h-28 w-full relative">
                  <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

                    {/* Area under curve */}
                    <path
                      d="M 0,75 C 60,70 120,55 180,48 C 240,40 300,32 400,22 L 400,100 L 0,100 Z"
                      fill="url(#curveGradient)"
                    />
                    {/* Trajectory Stroke */}
                    <path
                      d="M 0,75 C 60,70 120,55 180,48 C 240,40 300,32 400,22"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                    />
                    {/* Benchmark dashed line */}
                    <path
                      d="M 0,65 C 100,60 200,55 400,45"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      strokeOpacity="0.7"
                    />
                    {/* Milestone nodes */}
                    <circle cx="180" cy="48" r="3.5" fill="#8B5CF6" stroke="#080B12" strokeWidth="2" />
                    <circle cx="400" cy="22" r="4.5" fill="#22C55E" stroke="#080B12" strokeWidth="2" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800">
                  <span>Week 1 (Baseline)</span>
                  <span className="text-[#3B82F6]">Benchmark</span>
                  <span className="text-[#8B5CF6]">Predicted Trajectory</span>
                  <span>Week 12 (Target: 8.74)</span>
                </div>
              </div>

              {/* Additive Feature Attribution Panel */}
              <div className="space-y-2">
                <div
                  className={`flex items-center justify-between text-xs font-semibold ${
                    isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                  }`}
                >
                  <span>Additive Feature Attribution (XAI)</span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                    Weight Impact
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div
                    className={`rounded-lg p-2 flex items-center justify-between text-xs border ${
                      isDark ? 'bg-[#151C28] border-[#202938]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`flex items-center gap-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#8B5CF6]' : 'bg-indigo-600'}`} />
                      Biometric Attendance (89%)
                    </span>
                    <span className="font-mono text-[#22C55E] text-[11px]">+0.38 contribution</span>
                  </div>
                  <div
                    className={`rounded-lg p-2 flex items-center justify-between text-xs border ${
                      isDark ? 'bg-[#151C28] border-[#202938]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`flex items-center gap-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      Mid-Term Assessment Score (88%)
                    </span>
                    <span className="font-mono text-[#22C55E] text-[11px]">+0.29 contribution</span>
                  </div>
                  <div
                    className={`rounded-lg p-2 flex items-center justify-between text-xs border ${
                      isDark ? 'bg-[#151C28] border-[#202938]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`flex items-center gap-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#64748B]' : 'bg-slate-400'}`} />
                      Assignment Velocity (-1 overdue)
                    </span>
                    <span className="font-mono text-[#F59E0B] text-[11px]">-0.11 contribution</span>
                  </div>
                </div>
              </div>

              {/* Interactive Inspector Trigger */}
              <button
                onClick={() => setExplainModalOpen(true)}
                className={`w-full mt-4 py-2.5 px-3 rounded-xl border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-[#151C28] hover:bg-[#1a2332] border-[#202938] text-[#94A3B8] hover:text-[#F8FAFC]'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>Inspect Full Explainable AI Attribution Model</span>
                <ArrowUpRight className={`w-3.5 h-3.5 ${isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          Section 2: Minimal Analytics & Reliability Benchmarks
          ================================================== */}
      <section
        className={`py-12 border-y transition-colors ${
          isDark ? 'border-[#202938] bg-[#0D111A]' : 'border-slate-200 bg-slate-100/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                  }`}
                >
                  {m.value}
                </div>
                <div
                  className={`text-xs sm:text-sm font-medium ${
                    isDark ? 'text-[#F8FAFC]' : 'text-slate-800'
                  }`}
                >
                  {m.label}
                </div>
                <div className={`text-[11px] font-mono ${isDark ? 'text-[#64748B]' : 'text-slate-500'}`}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          Section 3: AI Intelligence Pipeline (Technical Architecture)
          ================================================== */}
      <section id="pipeline" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl mb-14">
          <span
            className={`text-xs font-mono font-semibold uppercase tracking-wider ${
              isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'
            }`}
          >
            System Architecture
          </span>
          <h2
            className={`text-2xl sm:text-4xl font-bold tracking-tight mt-2 ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}
          >
            Deterministic Machine Learning Pipeline
          </h2>
          <p className={`text-sm sm:text-base mt-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
            How continuous student telemetry is transformed into transparent, non-causal guidance without opaque black-box scoring.
          </p>
        </div>

        {/* 5-Node Technical Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {pipelineSteps.map((node, idx) => (
            <div
              key={idx}
              className={`border rounded-2xl p-5 transition-all flex flex-col justify-between group ${
                isDark
                  ? 'bg-[#111722] border-[#202938] hover:border-[#334155]'
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'
                    }`}
                  >
                    {node.step}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isDark
                        ? 'text-[#64748B] bg-[#151C28] border-[#202938]'
                        : 'text-slate-500 bg-slate-100 border-slate-200'
                    }`}
                  >
                    {node.badge}
                  </span>
                </div>
                <h3
                  className={`text-xs sm:text-sm font-bold tracking-tight mb-2 ${
                    isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                  }`}
                >
                  {node.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                  {node.description}
                </p>
              </div>

              {/* Progress Indicator Accent */}
              <div
                className={`w-full h-1 rounded-full overflow-hidden mt-5 ${
                  isDark ? 'bg-[#151C28]' : 'bg-slate-100'
                }`}
              >
                <div
                  className={`w-full h-full rounded-full ${
                    isDark ? 'bg-[#8B5CF6]/60' : 'bg-indigo-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          Section 4: Core Capabilities (6 Minimal Feature Cards)
          ================================================== */}
      <section
        id="product"
        className={`py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t transition-colors ${
          isDark ? 'border-[#202938]' : 'border-slate-200'
        }`}
      >
        <div className="max-w-3xl mb-14">
          <span
            className={`text-xs font-mono font-semibold uppercase tracking-wider ${
              isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'
            }`}
          >
            Platform Capabilities
          </span>
          <h2
            className={`text-2xl sm:text-4xl font-bold tracking-tight mt-2 ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}
          >
            Engineered for Precision and Clarity
          </h2>
          <p className={`text-sm sm:text-base mt-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
            Eliminating guesswork from institutional operations with validated predictive models and actionable roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`border rounded-2xl p-6 transition-all flex flex-col justify-between group ${
                  isDark
                    ? 'bg-[#111722] border-[#202938] hover:border-[#334155] hover:bg-[#151C28]'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 shadow-xs'
                }`}
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 transition-colors ${
                      isDark
                        ? 'bg-[#151C28] border-[#202938] text-[#8B5CF6] group-hover:border-[#8B5CF6]/50'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-600 group-hover:border-indigo-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>
                <div
                  className={`pt-4 border-t flex items-center justify-between text-[11px] font-mono ${
                    isDark ? 'border-[#202938]/60 text-[#64748B]' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <span>{item.tag}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${
                      isDark ? 'text-[#94A3B8]' : 'text-slate-600'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          Section 5: AI Assistant Dark & Light Chat Interface
          ================================================== */}
      <section
        className={`py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t transition-colors ${
          isDark ? 'border-[#202938]' : 'border-slate-200'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span
              className={`text-xs font-mono font-semibold uppercase tracking-wider ${
                isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'
              }`}
            >
              Conversational Telemetry
            </span>
            <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
              CampusMind AI Assistant
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
              Students and advisors query continuous performance trajectories using plain natural language. Integrated with 19 domain intents and robust student privacy guardrails.
            </p>
            <div className={`space-y-2 pt-2 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
              <div className="flex items-center gap-2">
                <Check className={`w-4 h-4 ${isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}`} />
                <span>Strict privacy isolation preventing cross-student data leakage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className={`w-4 h-4 ${isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}`} />
                <span>Transparent explanation of continuous GPA projections</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className={`w-4 h-4 ${isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}`} />
                <span>Contextual study roadmaps tailored to specific course deficits</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/student/assistant"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  isDark
                    ? 'text-[#080B12] bg-[#F8FAFC] hover:bg-white'
                    : 'text-white bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <span>Launch Interactive Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Minimal Chat Interface Preview */}
          <div className="lg:col-span-7">
            <div
              className={`border rounded-2xl p-5 sm:p-6 shadow-xl transition-colors ${
                isDark ? 'bg-[#111722] border-[#202938]' : 'bg-white border-slate-200'
              }`}
            >
              {/* Chat Titlebar */}
              <div
                className={`flex items-center justify-between border-b pb-4 mb-4 ${
                  isDark ? 'border-[#202938]' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                      isDark ? 'bg-[#151C28] border-[#202938] text-[#8B5CF6]' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                      CampusMind AI
                    </h4>
                    <span className={`text-[10px] block font-mono ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                      Academic Inference Engine
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                  Privacy Guardrails Active
                </span>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3.5 text-xs">
                {/* User Message */}
                <div className="flex justify-end">
                  <div
                    className={`border rounded-xl rounded-tr-xs p-3 max-w-md ${
                      isDark
                        ? 'bg-[#151C28] border-[#202938] text-[#E2E8F0]'
                        : 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    }`}
                  >
                    How is my academic performance trending this semester, and what factors are influencing it?
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div
                    className={`border rounded-xl rounded-tl-xs p-4 max-w-lg space-y-3 ${
                      isDark
                        ? 'bg-[#0D111A] border-[#202938] text-[#94A3B8]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isDark
                            ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        XAI Inference Response
                      </span>
                    </div>
                    <p className={`leading-relaxed ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                      Your academic trajectory is currently in the{' '}
                      <strong className="text-[#22C55E]">Optimal</strong> tier with a predicted Semester 5 GPA of{' '}
                      <strong className={isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}>8.74 ± 0.18</strong>.
                    </p>
                    <div
                      className={`space-y-1.5 pt-1 border-t text-[11px] ${
                        isDark ? 'border-[#202938]' : 'border-slate-200'
                      }`}
                    >
                      <span className={`font-mono uppercase text-[10px] block ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                        Primary Contributing Drivers:
                      </span>
                      <div className="flex items-center justify-between">
                        <span>• Biometric Attendance (89%)</span>
                        <span className="font-mono text-[#22C55E]">+0.38 contribution</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Mid-Term Assessments (88%)</span>
                        <span className="font-mono text-[#22C55E]">+0.29 contribution</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Pending Assignments (1 unit)</span>
                        <span className="font-mono text-[#F59E0B]">-0.11 contribution</span>
                      </div>
                    </div>
                    <div className={`pt-1 text-[11px] ${isDark ? 'text-[#64748B]' : 'text-slate-500'}`}>
                      Recommendation: Submitting your remaining Web Tech assignment will reinforce your 95% forecast stability.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          Section 6: Persona Portals Showcase
          ================================================== */}
      <section
        className={`py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t transition-colors ${
          isDark ? 'border-[#202938]' : 'border-slate-200'
        }`}
      >
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span
            className={`text-xs font-mono font-semibold uppercase tracking-wider ${
              isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'
            }`}
          >
            Stakeholder Suites
          </span>
          <h2
            className={`text-2xl sm:text-4xl font-bold tracking-tight mt-2 ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}
          >
            Tailored for Every University Role
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Suite */}
          <div
            id="students"
            className={`border rounded-2xl p-6 transition-all flex flex-col justify-between ${
              isDark
                ? 'bg-[#111722] border-[#202938] hover:border-[#334155]'
                : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isDark ? 'bg-[#151C28] border-[#202938] text-[#8B5CF6]' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                For Students
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                Continuous telemetry across attendance, coursework, and examinations. Transparent feature attributions explain risk factors and deliver 12-week roadmaps.
              </p>
              <ul className={`space-y-2 text-xs pt-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#22C55E]" /> Academic Trajectory Score (84/100)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#22C55E]" /> 75% Exam Clearance Recovery Tracker
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#22C55E]" /> Conversational CampusMind AI
                </li>
              </ul>
            </div>
            <Link
              to="/student"
              className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-between ${
                isDark
                  ? 'text-[#E2E8F0] hover:text-white bg-[#151C28] hover:bg-[#1f2838] border-[#202938]'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span>Launch Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Faculty Suite */}
          <div
            id="faculty"
            className={`border rounded-2xl p-6 transition-all flex flex-col justify-between ${
              isDark
                ? 'bg-[#111722] border-[#202938] hover:border-[#334155]'
                : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isDark ? 'bg-[#151C28] border-[#202938] text-[#3B82F6]' : 'bg-purple-50 border-purple-200 text-purple-600'
                }`}
              >
                <Users className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                For Faculty Mentors
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                Intelligence over manual grading. Proactive student monitoring detects early support signals before examinations with instant intervention dispatch.
              </p>
              <ul className={`space-y-2 text-xs pt-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#3B82F6]" /> Support Signals Monitoring Table
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#3B82F6]" /> Course Bottleneck Diagnostics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#3B82F6]" /> Automated Advising Record Logs
                </li>
              </ul>
            </div>
            <Link
              to="/faculty"
              className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-between ${
                isDark
                  ? 'text-[#E2E8F0] hover:text-white bg-[#151C28] hover:bg-[#1f2838] border-[#202938]'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span>Launch Faculty Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* University Admin */}
          <div
            id="universities"
            className={`border rounded-2xl p-6 transition-all flex flex-col justify-between ${
              isDark
                ? 'bg-[#111722] border-[#202938] hover:border-[#334155]'
                : 'bg-white border-slate-200 hover:border-cyan-300 shadow-sm'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isDark ? 'bg-[#151C28] border-[#202938] text-[#8B5CF6]' : 'bg-cyan-50 border-cyan-200 text-cyan-600'
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                For University Executives
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                Macro-level telemetry for Deans and Department Chairs. Retention modeling, placement readiness heatmaps, and accreditation telemetry.
              </p>
              <ul className={`space-y-2 text-xs pt-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                <li className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#8B5CF6]' : 'text-cyan-600'}`} /> Macro Institutional Academic Health
                </li>
                <li className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#8B5CF6]' : 'text-cyan-600'}`} /> Department Performance Heatmaps
                </li>
                <li className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#8B5CF6]' : 'text-cyan-600'}`} /> NAAC & NIRF Accreditation Metrics
                </li>
              </ul>
            </div>
            <Link
              to="/admin"
              className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-between ${
                isDark
                  ? 'text-[#E2E8F0] hover:text-white bg-[#151C28] hover:bg-[#1f2838] border-[#202938]'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span>Launch Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          Section 7: Interactive Explainability Preview Banner
          ================================================== */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div
          className={`border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors ${
            isDark
              ? 'bg-[#111722] border-[#202938]'
              : 'bg-white border-slate-200 shadow-md'
          }`}
        >
          <div className="space-y-2 text-center sm:text-left">
            <div
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded text-[10px] font-mono border ${
                isDark
                  ? 'bg-[#151C28] text-[#8B5CF6] border-[#202938]'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              INTERACTIVE DEMO
            </div>
            <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
              Inspect Explainable AI (XAI) Feature Attribution
            </h3>
            <p className={`text-xs sm:text-sm max-w-xl ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
              Preview how CampusMind X explains model predictions with positive and negative contribution weights instead of opaque risk scores.
            </p>
          </div>

          <button
            onClick={() => setExplainModalOpen(true)}
            className={`shrink-0 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
              isDark
                ? 'text-[#080B12] bg-[#F8FAFC] hover:bg-white'
                : 'text-white bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <span>Open Explainability Inspector</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ==================================================
          Footer (Dark & Light Theme Footer)
          ================================================== */}
      <footer
        id="about"
        className={`mt-auto border-t py-12 px-4 sm:px-6 lg:px-8 transition-colors ${
          isDark ? 'border-[#202938] bg-[#080B12]' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isDark ? 'bg-[#151C28] border-[#202938] text-[#8B5CF6]' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
              }`}
            >
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-sm font-bold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-slate-900'}`}>
                CampusMind{' '}
                <span className={isDark ? 'text-[#8B5CF6]' : 'text-indigo-600'}>
                  X
                </span>
              </span>
              <span className={`text-[11px] block font-mono ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
                Explainable University Intelligence
              </span>
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center justify-center gap-6 text-xs font-medium ${
              isDark ? 'text-[#94A3B8]' : 'text-slate-600'
            }`}
          >
            <Link to="/models" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              AI Model Center
            </Link>
            <Link to="/architecture" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              Architecture
            </Link>
            <Link to="/analyze" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              Self-Analysis
            </Link>
            <a href="#pipeline" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              Neural Pipeline
            </a>
            <a href="#product" className={isDark ? 'hover:text-[#F8FAFC]' : 'hover:text-slate-900'}>
              Product
            </a>
          </div>

          <p className={`text-xs font-mono text-center md:text-right ${isDark ? 'text-[#64748B]' : 'text-slate-400'}`}>
            © 2026 CampusMind X. Transparent & Non-Causal Analytics.
          </p>
        </div>
      </footer>

      {/* Explainable AI Modal Preview Component (Retained) */}
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
