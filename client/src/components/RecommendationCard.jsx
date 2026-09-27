import React, { useState } from 'react';
import { CheckCircle2, Clock, Zap, ArrowRight, ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';

export default function RecommendationCard({
  recommendation,
  onAction = null,
  isCompleted = false
}) {
  const [expanded, setExpanded] = useState(false);

  const {
    id,
    title,
    category,
    urgency,
    urgencyColor,
    estimatedTime,
    impactRating,
    rationale,
    actionPlan,
    courseCode,
    linkText
  } = recommendation;

  const categoryStyles = {
    'Academic': 'bg-blue-950/60 text-blue-300 border-blue-500/40',
    'Attendance': 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    'Assignment': 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    'Skill Development': 'bg-purple-950/60 text-purple-300 border-purple-500/40',
    'Career': 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
  };

  const urgencyStyles = {
    red: 'bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 transition-all duration-300 hover:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${categoryStyles[category] || 'bg-slate-900 border-slate-700 text-slate-300'}`}>
              {category}
            </span>
            {courseCode && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                {courseCode}
              </span>
            )}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgencyStyles[urgencyColor] || urgencyStyles.cyan}`}>
              {urgency} Priority
            </span>
          </div>

          <h3 className="text-base font-bold text-white mt-2">{title}</h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-950/50 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>{impactRating}</span>
          </div>
        </div>
      </div>

      {/* Rationale (XAI Why am I seeing this recommendation?) */}
      <div className="mt-3.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300 font-medium">Why am I seeing this recommendation?</strong>
          <p className="mt-0.5 text-slate-300 text-[11px] leading-relaxed">
            {rationale.replace(/^Why am I seeing this recommendation\?\s*/i, '')}
          </p>
        </div>
      </div>

      {/* Expandable Action Steps */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <span>{expanded ? 'Hide Step-by-Step Action Plan' : 'Show Action Plan (3 steps)'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onAction && onAction(recommendation)}
            disabled={isCompleted}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              isCompleted
                ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 cursor-default'
                : 'text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Acknowledged</span>
              </>
            ) : (
              <>
                <span>{linkText || 'Take Action'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/60 animate-fadeIn">
            {actionPlan.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
