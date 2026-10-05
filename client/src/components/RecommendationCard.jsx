import React, { useState } from 'react';
import { CheckCircle2, Clock, Zap, ArrowRight, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

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
    'Academic': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Attendance': 'bg-amber-50 text-amber-700 border-amber-200',
    'Assignment': 'bg-rose-50 text-rose-700 border-rose-200',
    'Skill Development': 'bg-purple-50 text-purple-700 border-purple-200',
    'Career': 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const urgencyStyles = {
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <div className="glass-panel rounded-[24px] p-5 border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.03)] transition-all duration-300 hover:shadow-[0_15px_35px_-5px_rgba(99,102,241,0.08)]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryStyles[category] || 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              {category}
            </span>
            {courseCode && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {courseCode}
              </span>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgencyStyles[urgencyColor] || urgencyStyles.cyan}`}>
              {urgency} Priority
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 mt-2">{title}</h3>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-200 font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{impactRating}</span>
          </div>
        </div>
      </div>

      {/* Rationale (XAI Why am I seeing this recommendation?) */}
      <div className="mt-3.5 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 font-semibold">Why this recommendation?</strong>
          <p className="mt-0.5 text-slate-600 text-[11px] leading-relaxed">
            {rationale.replace(/^Why am I seeing this recommendation\?\s*/i, '')}
          </p>
        </div>
      </div>

      {/* Expandable Action Steps */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <span>{expanded ? 'Hide Step-by-Step Action Plan' : 'Show Action Plan (3 steps)'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onAction && onAction(recommendation)}
            disabled={isCompleted}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-sm shadow-indigo-500/20'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Marked Complete</span>
              </>
            ) : (
              <>
                <span>{linkText || 'Execute Recommendation'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Action steps expanded */}
        {expanded && (
          <div className="mt-3 space-y-2 pt-2">
            {actionPlan &&
              actionPlan.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
                >
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
