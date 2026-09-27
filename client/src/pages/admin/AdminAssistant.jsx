import React from 'react';
import { Bot, Sparkles, Building2, ShieldCheck, TrendingUp, BarChart3 } from 'lucide-react';
import AIChat from '../../components/AIChat';

export default function AdminAssistant() {
  const adminPrompts = [
    "What is the university academic health?",
    "Which department has the highest retention and performance?"
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30 font-semibold">
              Institutional Intelligence
            </span>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              FERPA Compliant Privacy Protected
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1.5">
            University Executive AI Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Query university-wide student retention, macro predictive risk distributions, and comparative department performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Authority:</span>
            <span className="text-xs font-bold text-white">Office of Academic Affairs</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Component */}
        <div className="lg:col-span-8">
          <AIChat
            role="admin"
            initialPrompts={adminPrompts}
            title="Institutional Intelligence Assistant"
            subtitle="Context: Office of Academic Affairs • Campus-Wide Analytics"
          />
        </div>

        {/* Sidebar Context & Institutional Metrics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-blue-500/30">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-sm mb-3">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Institutional Overview</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Total Enrollment:</span>
                <span className="font-mono font-bold text-cyan-400">1,420 Students</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Retention Rate:</span>
                <span className="font-mono font-bold text-emerald-400">94.2%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Academic Departments:</span>
                <span className="font-semibold text-white">8 Schools</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">High Risk Cohort:</span>
                <span className="font-mono font-bold text-amber-400">10% (143 students)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Active Interventions:</span>
                <span className="font-mono font-bold text-purple-300">128 Campus-wide</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Data Protection Guarantee</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Institutional executive queries deliver aggregate distributions and school-level analytics without revealing unnecessary private student identifiable records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
