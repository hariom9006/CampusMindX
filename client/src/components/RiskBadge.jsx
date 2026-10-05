import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function RiskBadge({ level = 'Medium', size = 'md', showIcon = true }) {
  const normalized = (level || '').toLowerCase();

  let type = 'medium';
  if (normalized.includes('low') || normalized.includes('health') || normalized.includes('optimal')) {
    type = 'low';
  } else if (normalized.includes('high') || normalized.includes('support') || normalized.includes('critical')) {
    type = 'high';
  }

  const config = {
    low: {
      label: 'Healthy Trajectory',
      shortLabel: 'Healthy',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-500/10',
      icon: CheckCircle2,
      dot: 'bg-emerald-500'
    },
    medium: {
      label: 'Watchlist / Advisory',
      shortLabel: 'Advisory',
      bg: 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm shadow-amber-500/10',
      icon: AlertTriangle,
      dot: 'bg-amber-500'
    },
    high: {
      label: 'Support Signals Active',
      shortLabel: 'Support Needed',
      bg: 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm shadow-rose-500/10',
      icon: AlertOctagon,
      dot: 'bg-rose-500'
    }
  };

  const current = config[type];
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 space-x-1 font-semibold',
    md: 'text-xs font-semibold px-2.5 py-1 space-x-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 space-x-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all duration-200 ${current.bg} ${sizeStyles[size] || sizeStyles.md}`}
    >
      <span className="relative flex h-2 w-2 mr-1">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      {showIcon && <Icon className="w-3.5 h-3.5 opacity-90 mr-1" />}
      <span className="tracking-tight">{size === 'sm' ? current.shortLabel : current.label}</span>
    </span>
  );
}
