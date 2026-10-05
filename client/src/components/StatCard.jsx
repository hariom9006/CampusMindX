import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

export default function StatCard({
  title,
  value,
  unit = '',
  trend = null, // e.g. { direction: 'up', label: '+4% this month' }
  subtitle = null,
  icon: Icon = null,
  variant = 'indigo', // 'indigo', 'violet', 'cyan', 'pink', 'mint', 'amber'
  badge = null,
  onExplain = null,
  className = ''
}) {
  const variantStyles = {
    indigo: {
      border: 'border-indigo-100 hover:border-indigo-300',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
      glow: 'hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.12)]',
      accent: 'from-indigo-500 to-indigo-600'
    },
    violet: {
      border: 'border-purple-100 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200/80',
      glow: 'hover:shadow-[0_15px_30px_-5px_rgba(139,92,246,0.12)]',
      accent: 'from-purple-500 to-violet-600'
    },
    cyan: {
      border: 'border-cyan-100 hover:border-cyan-300',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200/80',
      glow: 'hover:shadow-[0_15px_30px_-5px_rgba(6,182,212,0.12)]',
      accent: 'from-cyan-500 to-blue-500'
    },
    pink: {
      border: 'border-pink-100 hover:border-pink-300',
      iconBg: 'bg-pink-50 text-pink-600 border-pink-200/80',
      glow: 'hover:shadow-[0_15px_30px_-5px_rgba(236,72,153,0.12)]',
      accent: 'from-pink-500 to-rose-500'
    },
    mint: {
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      glow: 'hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.12)]',
      accent: 'from-emerald-500 to-teal-500'
    },
    amber: {
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      glow: 'hover:shadow-[0_15px_30px_-5px_rgba(245,158,11,0.12)]',
      accent: 'from-amber-500 to-orange-500'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.indigo;

  return (
    <div
      className={`relative glass-panel rounded-[24px] p-4 sm:p-5 transition-all duration-300 border ${currentVariant.border} ${currentVariant.glow} hover:-translate-y-1 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.03),0_4px_10px_rgba(15,23,42,0.02)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge}
          {Icon && (
            <div className={`p-2 sm:p-2.5 rounded-xl border ${currentVariant.iconBg}`}>
              <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </span>
        {unit && <span className="text-xs sm:text-sm font-semibold text-slate-500">{unit}</span>}
      </div>

      {/* Trend & Subtitle & Explainability Trigger */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                trend.direction === 'up'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : trend.direction === 'down'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
              {trend.label}
            </span>
          )}
          {subtitle && !trend && <span className="text-slate-500 text-xs">{subtitle}</span>}
        </div>

        {onExplain && (
          <button
            onClick={onExplain}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200"
            title="Inspect AI Feature Drivers"
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Why?</span>
          </button>
        )}
      </div>
    </div>
  );
}
