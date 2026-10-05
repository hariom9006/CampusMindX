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
    <div
      className={`glass-panel rounded-[24px] p-4 sm:p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] flex flex-col justify-between transition-all hover:shadow-[0_15px_35px_-5px_rgba(99,102,241,0.08)] ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            {badge && <span>{badge}</span>}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Chart container */}
      <div className={`w-full min-w-0 ${height} relative overflow-hidden`}>
        {children}
      </div>
    </div>
  );
}
