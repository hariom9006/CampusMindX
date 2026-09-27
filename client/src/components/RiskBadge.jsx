import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function RiskBadge({ level = 'Medium', size = 'md', showIcon = true }) {
  const normalized = (level || '').toLowerCase();

  const config = {
    low: {
      label: 'Low Risk / On Track',
      shortLabel: 'Low Risk',
      bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      icon: CheckCircle2,
      dot: 'bg-emerald-400'
    },
    medium: {
      label: 'Medium Risk / At Risk',
      shortLabel: 'Medium Risk',
      bg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      icon: AlertTriangle,
      dot: 'bg-amber-400'
    },
    high: {
      label: 'High Risk / Immediate Support',
      shortLabel: 'High Risk',
      bg: 'bg-rose-950/60 border-rose-500/50 text-rose-300',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.35)]',
      icon: AlertOctagon,
      dot: 'bg-rose-400 animate-ping'
    }
  };

  const current = config[normalized] || config.medium;
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 space-x-1.5',
    md: 'text-xs font-medium px-2.5 py-1 space-x-2',
    lg: 'text-sm font-semibold px-3 py-1.5 space-x-2.5'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all duration-200 ${current.bg} ${current.glow} ${sizeStyles[size] || sizeStyles.md}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot.replace(' animate-ping', '')}`}></span>
      </span>
      {showIcon && <Icon className="w-3.5 h-3.5 opacity-90" />}
      <span className="tracking-wide">{size === 'sm' ? current.shortLabel : current.label}</span>
    </span>
  );
}
