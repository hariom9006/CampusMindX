import React from 'react';

export default function ChartCard({
  title,
  subtitle,
  children,
  action = null,
  badge = null,
  height = 'h-72',
  className = ''
}) {
  return (
    <div className={`glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-lg flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
            {badge && <span>{badge}</span>}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Chart container */}
      <div className={`w-full ${height} relative`}>
        {children}
      </div>
    </div>
  );
}
