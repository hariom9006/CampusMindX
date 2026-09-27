import React from 'react';
import { Sparkles, Brain, ArrowRight, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export default function AIInsightCard({
  title,
  description,
  rationale = null,
  impact = null,
  actionText = "Explore Solution",
  onAction = null,
  type = "info", // "info", "warning", "success", "purple"
  onExplain = null,
  className = ""
}) {
  const typeStyles = {
    info: {
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/20",
      glow: "hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]",
      badge: "bg-cyan-900/60 text-cyan-300 border-cyan-500/30",
      icon: Sparkles,
      iconColor: "text-cyan-400"
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-950/20",
      glow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]",
      badge: "bg-amber-900/60 text-amber-300 border-amber-500/30",
      icon: ShieldAlert,
      iconColor: "text-amber-400"
    },
    success: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/20",
      glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
      badge: "bg-emerald-900/60 text-emerald-300 border-emerald-500/30",
      icon: CheckCircle,
      iconColor: "text-emerald-400"
    },
    purple: {
      border: "border-purple-500/30",
      bg: "bg-purple-950/20",
      glow: "hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]",
      badge: "bg-purple-900/60 text-purple-300 border-purple-500/30",
      icon: Brain,
      iconColor: "text-purple-400"
    }
  };

  const style = typeStyles[type] || typeStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden ${style.border} ${style.bg} ${style.glow} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-xl border bg-slate-900/80 ${style.border} ${style.iconColor} shrink-0 mt-0.5`}>
            <Icon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${style.badge}`}>
                AI Insight
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{description}</p>
          </div>
        </div>

        {impact && (
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-200 shrink-0">
            {impact}
          </span>
        )}
      </div>

      {rationale && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-300">Factor Analysis:</strong> {rationale}
          </span>
        </div>
      )}

      <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-800/50">
        {onExplain ? (
          <button
            onClick={onExplain}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Explain Factor Weights</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-500 font-mono">Automated Decision Pipeline</span>
        )}

        {actionText && (
          <button
            onClick={onAction}
            className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        )}
      </div>
    </div>
  );
}
