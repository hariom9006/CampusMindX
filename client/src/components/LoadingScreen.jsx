import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export default function LoadingScreen({ message = "Loading Portal Intelligence..." }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="relative flex items-center justify-center mb-6">
        {/* Ambient Glow */}
        <div className="absolute w-28 h-28 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>

        {/* Orbiting Spinner Ring */}
        <div className="w-16 h-16 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-400 border-r-purple-400 animate-spin"></div>

        {/* Center Icon */}
        <div className="absolute w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg">
          <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-1.5">
        <h3 className="text-sm font-bold tracking-tight text-slate-100 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>CampusMind<span className="text-cyan-400">X</span></span>
        </h3>
        <p className="text-xs font-mono text-slate-400">{message}</p>
      </div>
    </div>
  );
}
