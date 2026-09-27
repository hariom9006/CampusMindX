import React from 'react';
import ProgressBar from './ProgressBar';
import { Target, Zap, AlertCircle } from 'lucide-react';

export default function SkillGapCard({
  skill,
  onExplore = null
}) {
  const {
    name,
    category,
    currentScore,
    requiredScore,
    gap,
    priority,
    status,
    description
  } = skill;

  const priorityColors = {
    High: {
      badge: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
      barColor: 'rose'
    },
    Medium: {
      badge: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
      barColor: 'amber'
    },
    Low: {
      badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
      barColor: 'emerald'
    }
  };

  const pConfig = priorityColors[priority] || priorityColors.Medium;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
              {category}
            </span>
            <h4 className="text-sm font-bold text-white mt-1.5">{name}</h4>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pConfig.badge}`}>
            {priority} Priority
          </span>
        </div>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Current: <strong className="text-slate-200">{currentScore}%</strong>
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-purple-400" /> Industry Target: <strong className="text-purple-300">{requiredScore}%</strong>
          </span>
        </div>

        <ProgressBar
          value={currentScore}
          max={100}
          threshold={requiredScore}
          color={currentScore >= requiredScore ? 'emerald' : pConfig.barColor}
          showValue={false}
          height="h-2"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">{status}</span>
          <span className={`text-xs font-mono font-bold ${gap < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {gap > 0 ? `+${gap}%` : `${gap}%`} Gap
          </span>
        </div>
      </div>
    </div>
  );
}
