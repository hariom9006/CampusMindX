import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  threshold = null,
  color = 'cyan', // 'cyan', 'purple', 'emerald', 'amber', 'rose'
  label = null,
  showValue = true,
  unit = '%',
  height = 'h-2.5',
  className = ''
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorGradients = {
    cyan: 'from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    purple: 'from-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    emerald: 'from-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    amber: 'from-amber-400 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    rose: 'from-rose-500 to-pink-600 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
  };

  const selectedGradient = colorGradients[color] || colorGradients.cyan;

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-slate-300">
          <span>{label}</span>
          {showValue && (
            <span className="font-semibold text-slate-200">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}
      <div className={`relative w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-700/50 ${height}`}>
        {/* Animated fill */}
        <div
          className={`h-full bg-gradient-to-r ${selectedGradient} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        {/* Optional threshold marker (e.g. 75% attendance line) */}
        {threshold !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10 shadow-[0_0_6px_rgba(244,63,94,0.9)]"
            style={{ left: `${(threshold / max) * 100}%` }}
            title={`Threshold: ${threshold}${unit}`}
          />
        )}
      </div>
      {threshold !== null && (
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0{unit}</span>
          <span className="text-rose-400 font-medium">Req. {threshold}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  );
}
