import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  threshold = null,
  color = 'indigo', // 'indigo', 'purple', 'emerald', 'amber', 'rose', 'cyan'
  label = null,
  showValue = true,
  unit = '%',
  height = 'h-2.5',
  className = ''
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorGradients = {
    indigo: 'from-indigo-500 to-indigo-600',
    cyan: 'from-cyan-500 to-blue-500',
    purple: 'from-purple-500 to-indigo-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-500 to-pink-600'
  };

  const selectedGradient = colorGradients[color] || colorGradients.indigo;

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-semibold text-slate-700">
          <span>{label}</span>
          {showValue && (
            <span className="font-bold text-slate-900">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}
      <div className={`relative w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 ${height}`}>
        {/* Animated fill */}
        <div
          className={`h-full bg-gradient-to-r ${selectedGradient} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        {/* Optional threshold marker (e.g. 75% attendance line) */}
        {threshold !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
            style={{ left: `${(threshold / max) * 100}%` }}
            title={`Threshold: ${threshold}${unit}`}
          />
        )}
      </div>
      {threshold !== null && (
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>0{unit}</span>
          <span className="text-rose-600 font-semibold">Benchmark: {threshold}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  );
}
