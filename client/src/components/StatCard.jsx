import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, HelpCircle } from 'lucide-react';

export default function StatCard({
  title,
  value,
  unit = '',
  trend = null, // e.g. { direction: 'up', label: '+4% this month' }
  subtitle = null,
  icon: Icon = null,
  glowColor = 'cyan', // 'cyan', 'blue', 'purple', 'emerald', 'amber', 'rose'
  badge = null,
  onExplain = null,
  className = ''
}) {
  const glowStyles = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    blue: 'border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]',
    purple: 'border-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
    amber: 'border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    rose: 'border-rose-500/20 hover:border-rose-500/40 hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]'
  };

  const iconBgStyles = {
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30',
    blue: 'bg-blue-950/60 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-950/60 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-950/60 text-rose-400 border-rose-500/30'
  };

  return (
    <div
      className={`relative glass-panel rounded-2xl p-5 transition-all duration-300 ${glowStyles[glowColor] || glowStyles.cyan} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge}
          {Icon && (
            <div className={`p-2 rounded-xl border ${iconBgStyles[glowColor] || iconBgStyles.cyan}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
        {unit && <span className="text-lg font-medium text-slate-400">{unit}</span>}
      </div>

      {/* Trend & Subtitle & Explainability Trigger */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                trend.direction === 'up'
                  ? 'text-emerald-400'
                  : trend.direction === 'down'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {trend.label}
            </span>
          )}
          {subtitle && !trend && <span className="text-slate-400 text-xs">{subtitle}</span>}
        </div>

        {onExplain && (
          <button
            onClick={onExplain}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-950/40 hover:bg-cyan-950/80 px-2 py-0.5 rounded-lg border border-cyan-500/20"
            title="Inspect AI Feature Drivers"
          >
            <Sparkles className="w-3 h-3" />
            <span>Why?</span>
          </button>
        )}
      </div>
    </div>
  );
}
