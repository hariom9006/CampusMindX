import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  BrainCircuit,
  Database,
  Server,
  Monitor,
  ArrowRight,
  FileCheck
} from 'lucide-react';

export default function ArchitecturePage() {
  const [activeTier, setActiveTier] = useState('xai');

  const tiers = [
    {
      id: 'xai',
      name: 'Explainable AI (XAI) Core',
      icon: BrainCircuit,
      color: 'cyan',
      description: 'Transparent feature attribution replacing black-box predictions using SHAP/LIME principles.'
    },
    {
      id: 'frontend',
      name: 'Frontend Intelligence UI',
      icon: Monitor,
      color: 'purple',
      description: 'Responsive React 19 + Vite dashboard with Recharts telemetry and glassmorphism styling.'
    },
    {
      id: 'gateway',
      name: 'Express Gateway & Node.js',
      icon: Server,
      color: 'blue',
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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              System Specification
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Phase 1 Engineering Blueprint
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1.5">
            CampusMind X System Architecture
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Technical blueprint explaining the multi-tier Explainable AI pipeline, institutional data flow, and modern web stack foundations.
          </p>
        </div>

        <Link
          to="/login"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <span>Test Demo Personas</span>
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
                  ? 'border-cyan-400 bg-slate-900/90 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {t.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{t.description}</p>
            </div>
          );
        })}
      </div>

      {/* Visual Architectural Data Flow Diagram */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">End-to-End Explainable Intelligence Pipeline</h3>
            <p className="text-xs text-slate-400">Data ingestion, feature transformation, model inference, and explanation delivery.</p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-cyan-300">
            Microservice Topology
          </span>
        </div>

        {/* Diagram Flow Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Tier 1: Data Ingestion</span>
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Academic & Telemetry Feeds</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• Biometric & RFID attendance</li>
                <li>• Continuous internal marks (CIA)</li>
                <li>• LMS assignment timestamps</li>
                <li>• Student career goal vectors</li>
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              Format: Raw Tabular / JSON
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">Tier 2: Backend Gateway</span>
                <Server className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Node.js & Express Gateway</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• REST API endpoint router</li>
                <li>• Mongoose schemas (Student, Academic)</li>
                <li>• Fallback mock data provider</li>
                <li>• Role-based authentication hook</li>
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              Port: 5000 | MongoDB Driver
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Tier 3: AI Inference</span>
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white">FastAPI AI Engine</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• /predict/risk (Early warning)</li>
                <li>• /predict/performance (GPA curve)</li>
                <li>• /skill-gap (Curriculum delta)</li>
                <li>• SHAP TreeExplainer kernel (Phase 2)</li>
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              Port: 8000 | Python 3.14+
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Tier 4: Visual XAI</span>
                <Monitor className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Client Intelligence UI</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• React 19 + Tailwind CSS + Recharts</li>
                <li>• Explainability Modal (Feature Drivers)</li>
                <li>• CampusMind AI Assistant (Chat)</li>
                <li>• Personalized Learning Roadmaps</li>
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              Port: 5173 | Vite Dev Server
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive on Explainable AI (XAI) Theory & Foundation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">The Need for Explainable AI (XAI) in Education</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Traditional machine learning solutions in universities operate as <strong>"black boxes"</strong>: they label a student as <em>"At Risk"</em> or predict a low grade without telling the student or mentor why. This causes student anxiety, faculty distrust, and zero actionable guidance.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <span className="text-cyan-300 font-semibold block">CampusMind X's XAI Solution:</span>
            <p className="text-slate-300">
              We apply additive feature attribution principles (inspired by <strong>SHAP - SHapley Additive exPlanations</strong>). Every prediction is broken down into quantifiable positive drivers (e.g. +16% for strong web projects) and negative drivers (e.g. -14% for lab attendance shortages).
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Phase 1 vs Phase 2 Separation</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="font-bold text-emerald-300 block mb-1">
                Completed in Phase 1:
              </span>
              <ul className="space-y-1 text-slate-300">
                <li>✓ Full production-quality React UI with all 14 routes</li>
                <li>✓ Recharts visualizations (Attendance, GPA trends, Radar skill maps)</li>
                <li>✓ Reusable component architecture (ExplainabilityModal, StatCard, AIChat)</li>
                <li>✓ Express.js API gateway foundation with Mongoose data models</li>
                <li>✓ FastAPI microservice foundation with explicit prototype contracts</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <span className="font-bold text-purple-300 block mb-1">
                Scheduled for Phase 2:
              </span>
              <ul className="space-y-1 text-slate-300">
                <li>• Training real Random Forest / XGBoost classifiers on university datasets</li>
                <li>• Integrating real `shap.TreeExplainer` in FastAPI to calculate live Shapley values</li>
                <li>• Dynamic MongoDB persistence & real-time WebSocket attendance ingestion</li>
                <li>• Production JWT authentication with role-based route guards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
