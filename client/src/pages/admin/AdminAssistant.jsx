import React from 'react';
import { Bot, Sparkles, Building2, ShieldCheck, TrendingUp } from 'lucide-react';
import AIChat from '../../components/AIChat';

export default function AdminAssistant() {
  const adminPrompts = [
    "What is the university academic health?",
    "Which department has the highest retention and performance?"
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-0.5 rounded-full font-semibold">
              Institutional Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            University Executive AI
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Query university-wide student retention, macro predictive risk distributions, and department performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-cyan-600" />
            <span className="text-xs text-slate-500 font-medium">Authority:</span>
            <span className="text-xs font-bold text-slate-900">Office of Academic Affairs</span>
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
            title="CampusMind AI • Institutional Intelligence"
            subtitle="Office of Academic Affairs • Campus-Wide Analytics"
          />
        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-[24px] p-5 border border-cyan-100 bg-white/95 shadow-xs">
            <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm mb-3">
              <TrendingUp className="w-4 h-4 text-cyan-600" />
              <span>Institutional Overview</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Total Enrolled:</span>
                <span className="font-bold text-slate-900">1,640 Students</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Academic Health:</span>
                <span className="font-mono font-bold text-emerald-600">91.4% Index</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Placement Readiness:</span>
                <span className="font-mono font-bold text-indigo-600">87.2%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Support Signals:</span>
                <span className="font-mono font-bold text-pink-600">74 Campus-wide</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[24px] p-5 border border-slate-200/80 bg-white/95 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Frequent Inquiries</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "What is the university academic health?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "Which department has the highest retention and performance?"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
