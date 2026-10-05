import React from 'react';
import { Sparkles, Brain, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AIInsightCard({
  title = "CampusMind AI Insight",
  description = "Your academic performance has improved over the last 3 weeks, but your DBMS performance is trending below your previous average.",
  whyPoints = [
    "Recent DBMS scores decreased (18.5/30)",
    "2 assignments are pending in queue",
    "Attendance is 71% (below 75% target)"
  ],
  actionText = "Understand Why",
  onExplain = null,
  className = ""
}) {
  return (
    <div
      className={`glass-panel rounded-[24px] p-6 border border-indigo-100/90 shadow-[0_12px_32px_-8px_rgba(99,102,241,0.08),0_4px_12px_rgba(15,23,42,0.02)] relative overflow-hidden bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/40 ${className}`}
    >
      {/* Decorative gradient top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Predictive Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous neural telemetry analysis
            </p>
          </div>
        </div>

        {onExplain && (
          <button
            onClick={onExplain}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Insight Description */}
      <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 mb-4 shadow-xs">
        <p className="text-sm text-slate-800 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* Why This Insight Section */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <span>WHY THIS INSIGHT?</span>
        </div>
        <ul className="space-y-1.5">
          {whyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shrink-0 mt-1.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
