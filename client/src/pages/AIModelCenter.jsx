import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  BrainCircuit,
  Activity,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  RefreshCw,
  Sliders,
  Zap,
  ShieldCheck,
  Compass,
  Target,
  FileCheck
} from 'lucide-react';
import ExplainabilityModal from '../components/ExplainabilityModal';

export default function AIModelCenter() {
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const models = [
    {
      id: 'risk-model',
      name: 'Academic Risk Model',
      tagline: 'Early warning support signal detection',
      status: 'Active / Serving',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      modelType: 'LightGBM / Tree Ensemble',
      input: 'Attendance telemetry, continuous marks (30%), assignment submission latency, LMS login frequencies',
      output: 'Support Signal classification (Healthy, Advisory, Support Signal) + confidence percentile',
      lastUpdated: '14 mins ago',
      metrics: { latency: '12ms', accuracy: '94.2%', queries: '1,420/day' },
      icon: ShieldCheck,
      color: 'from-indigo-500 to-indigo-600',
      accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'perf-model',
      name: 'Performance Prediction Model',
      tagline: 'Continuous GPA trajectory forecasting',
      status: 'Active / Serving',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      modelType: 'Ridge Regression + Polynomial Feature Pipeline',
      input: 'Historical semester SGPA (Sem 1-4), course credit weightings, mid-term continuous assessments',
      output: 'Forecasted Semester CGPA (0.00-10.00) & trajectory slope',
      lastUpdated: '1 hour ago',
      metrics: { latency: '8ms', accuracy: 'RMSE 0.28', queries: '890/day' },
      icon: TrendingUpIcon,
      color: 'from-violet-500 to-violet-600',
      accentBg: 'bg-violet-50 text-violet-700 border-violet-200'
    },
    {
      id: 'skill-engine',
      name: 'Skill Gap Engine',
      tagline: 'Career competency taxonomy matching',
      status: 'Active / Serving',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      modelType: 'Graph Semantic Alignment & Skill Ontology',
      input: 'Student acquired skills, verified coursework, target career role (e.g. Full Stack Developer)',
      output: 'Competency deficiency breakdown (Strong, Developing, Missing) with percentage deficit',
      lastUpdated: '3 hours ago',
      metrics: { latency: '18ms', accuracy: '98.0%', queries: '650/day' },
      icon: Target,
      color: 'from-pink-500 to-pink-600',
      accentBg: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    {
      id: 'rec-engine',
      name: 'Recommendation Engine',
      tagline: 'Personalized step-by-step remedial actions',
      status: 'Active / Serving',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      modelType: 'Multi-Factor Constraint Satisfaction Heuristic',
      input: 'Active academic bottlenecks, attendance deficit counters, career roadmap milestones',
      output: 'Ranked actionable intervention cards with estimated time and grade impact rating',
      lastUpdated: '22 mins ago',
      metrics: { latency: '15ms', accuracy: 'High Relevance', queries: '2,100/day' },
      icon: Compass,
      color: 'from-cyan-500 to-cyan-600',
      accentBg: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    {
      id: 'xai-engine',
      name: 'Explainability Engine',
      tagline: 'Transparent SHAP feature attribution core',
      status: 'Active / Serving',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      modelType: 'TreeSHAP & Normalized Feature Impact Kernel',
      input: 'Predictive model weights, student telemetry instance, background cohort sample',
      output: 'Normalized percentage contributions, plain-language synthesis, non-causal ethical statements',
      lastUpdated: 'Real-time dynamic',
      metrics: { latency: '24ms', accuracy: 'Exact SHAP', queries: '3,450/day' },
      icon: BrainCircuit,
      color: 'from-emerald-500 to-emerald-600',
      accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
              Futuristic AI Control Center
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              5 of 5 Engines Online
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Intelligence Center
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Real-time inference telemetry, feature attribution pipelines, and model registry.
          </p>
        </div>

        <button
          onClick={() => setExplainModalOpen(true)}
          className="self-start md:self-auto px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Test Explainability Engine</span>
        </button>
      </div>

      {/* Global Control Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-[24px] p-5 border border-indigo-100 bg-white/95 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Inferences
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            8,510
          </div>
          <span className="text-[10px] font-bold text-emerald-600 mt-1 block">
            ↑ 18% weekly throughput
          </span>
        </div>
        <div className="glass-panel rounded-[24px] p-5 border border-purple-100 bg-white/95 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Avg Inference Latency
          </span>
          <div className="text-3xl font-extrabold text-indigo-600 font-mono">
            15.4 ms
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-1 block">
            p99: 38ms
          </span>
        </div>
        <div className="glass-panel rounded-[24px] p-5 border border-cyan-100 bg-white/95 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            XAI Attribution Coverage
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            100%
          </div>
          <span className="text-[10px] font-bold text-emerald-600 mt-1 block">
            Zero black-box predictions
          </span>
        </div>
        <div className="glass-panel rounded-[24px] p-5 border border-emerald-100 bg-white/95 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Model Drift Status
          </span>
          <div className="text-3xl font-extrabold text-emerald-600">
            Optimal
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-1 block">
            Kolmogorov-Smirnov p &gt; 0.05
          </span>
        </div>
      </div>

      {/* Model Modules (Requirement 16) */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Active AI Inference Modules
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.map((mod) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.id}
                whileHover={{ y: -3 }}
                className="glass-panel rounded-[26px] p-6 border border-slate-200/80 bg-white/95 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar of Module */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${mod.color} flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {mod.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {mod.tagline}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${mod.statusColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${mod.dotColor} animate-pulse`} />
                      <span>{mod.status}</span>
                    </span>
                  </div>

                  {/* Module Details Table */}
                  <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-400">
                        Model Architecture
                      </span>
                      <span className="font-mono font-semibold text-indigo-700">
                        {mod.modelType}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-400">
                        Telemetry Inputs
                      </span>
                      <span className="text-slate-600 leading-relaxed block">
                        {mod.input}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-400">
                        Inference Output
                      </span>
                      <span className="text-slate-600 leading-relaxed block">
                        {mod.output}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                    <span>Latency: <strong>{mod.metrics.latency}</strong></span>
                    <span>Throughput: <strong>{mod.metrics.queries}</strong></span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    Updated {mod.lastUpdated}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

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

function TrendingUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
