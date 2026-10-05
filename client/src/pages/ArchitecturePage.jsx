import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  BrainCircuit,
  Database,
  Server,
  Monitor,
  ArrowRight,
  FileCheck,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function ArchitecturePage() {
  const [activeTier, setActiveTier] = useState('xai');

  const tiers = [
    {
      id: 'xai',
      name: 'Explainable AI (XAI) Core',
      icon: BrainCircuit,
      color: 'indigo',
      description: 'Transparent feature attribution replacing black-box predictions using TreeSHAP principles.'
    },
    {
      id: 'frontend',
      name: 'Aurora Intelligence UI',
      icon: Monitor,
      color: 'purple',
      description: 'Responsive React 19 + Vite dashboard with Recharts telemetry and light glassmorphism.'
    },
    {
      id: 'gateway',
      name: 'Express Gateway & Node.js',
      icon: Server,
      color: 'cyan',
      description: 'REST API orchestration, JWT session handling, and MongoDB/Mongoose data schemas.'
    },
    {
      id: 'ai-engine',
      name: 'FastAPI AI Engine Foundation',
      icon: Cpu,
      color: 'emerald',
      description: 'Microservice foundation for high-performance Python inference and feature importance pipelines.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="glass-panel rounded-[26px] p-6 sm:p-8 border border-indigo-100 bg-white/95 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
              System Specification
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Aurora Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            CampusMind X System Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-3xl leading-relaxed">
            Technical blueprint explaining the multi-tier Explainable AI pipeline, institutional data flow, and modern web stack foundations.
          </p>
        </div>

        <Link
          to="/models"
          className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <span>View AI Model Center</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Interactive Tier Switcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiers.map((t) => {
          const Icon = t.icon;
          const isActive = activeTier === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setActiveTier(t.id)}
              className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'border-indigo-400 bg-indigo-50/50 shadow-md shadow-indigo-500/10'
                  : 'border-slate-200/80 hover:border-slate-300 bg-white/90'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {t.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{t.description}</p>
            </div>
          );
        })}
      </div>

      {/* Visual Architectural Data Flow Diagram */}
      <div className="glass-panel rounded-[26px] p-6 sm:p-8 border border-slate-200/80 shadow-sm bg-white/95">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              End-to-End Explainable Intelligence Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data ingestion, feature transformation, model inference, and explanation delivery.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
            Microservice Topology
          </span>
        </div>

        {/* Diagram Flow Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">Tier 1: Data Ingestion</span>
                <Database className="w-4 h-4 text-indigo-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Academic & Telemetry Feeds</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li>• Biometric & RFID attendance</li>
                <li>• Continuous internal marks (CIA)</li>
                <li>• LMS assignment timestamps</li>
                <li>• Student career goal vectors</li>
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-indigo-100 text-[10px] font-mono text-slate-400">
              Format: Raw Tabular / JSON
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-purple-600 font-bold uppercase">Tier 2: Backend Gateway</span>
                <Server className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Node.js & Express Gateway</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li>• REST API endpoint router</li>
                <li>• Mongoose schemas (Student, Academic)</li>
                <li>• Fallback mock data provider</li>
                <li>• Role-based authentication hook</li>
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-purple-100 text-[10px] font-mono text-slate-400">
              Port: 5000 | MongoDB Driver
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-pink-600 font-bold uppercase">Tier 3: AI Inference</span>
                <Cpu className="w-4 h-4 text-pink-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">FastAPI AI Engine</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li>• /predict/risk (Support signal)</li>
                <li>• /predict/performance (GPA curve)</li>
                <li>• /skill-gap (Curriculum delta)</li>
                <li>• SHAP TreeExplainer kernel</li>
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-pink-100 text-[10px] font-mono text-slate-400">
              Port: 8000 | Python 3.14+
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-cyan-50/40 border border-cyan-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-600 font-bold uppercase">Tier 4: Visual XAI</span>
                <Monitor className="w-4 h-4 text-cyan-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Aurora Intelligence UI</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
                <li>• React 19 + Tailwind CSS + Recharts</li>
                <li>• Explainability Modal (Feature Drivers)</li>
                <li>• CampusMind AI Assistant (Chat)</li>
                <li>• 8-Week Personalized Roadmaps</li>
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-cyan-100 text-[10px] font-mono text-slate-400">
              Port: 5173 | Vite Dev Server
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive on Explainable AI (XAI) Theory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-[26px] p-6 border border-slate-200/80 bg-white/95 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              The Need for Explainable AI (XAI) in Education
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Traditional machine learning solutions in universities operate as <strong>"black boxes"</strong>: they label a student as <em>"At Risk"</em> or predict a low grade without telling the student or mentor why. This causes student anxiety, faculty distrust, and zero actionable guidance.
          </p>
          <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
            <span className="text-indigo-800 font-bold block">CampusMind X's XAI Solution:</span>
            <p className="text-slate-600 leading-relaxed">
              We apply additive feature attribution principles (inspired by <strong>SHAP - SHapley Additive exPlanations</strong>). Every prediction is broken down into quantifiable positive drivers and negative drivers with non-causal statistical guardrails.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-[26px] p-6 border border-slate-200/80 bg-white/95 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">
              Architecture Delivery Highlights
            </h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <span className="font-bold text-emerald-800 block mb-1">
                Active in Production:
              </span>
              <ul className="space-y-1 text-slate-600">
                <li>✓ Full production-quality React UI with Aurora Intelligence visual system</li>
                <li>✓ Recharts visualizations (Attendance, GPA trends, Radar skill maps, Heatmaps)</li>
                <li>✓ Reusable component architecture (ExplainabilityModal, StatCard, AIChat)</li>
                <li>✓ Express.js API gateway foundation with Mongoose data models</li>
                <li>✓ FastAPI microservice foundation with explicit prototype contracts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
