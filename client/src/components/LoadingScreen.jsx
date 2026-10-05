import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export default function LoadingScreen({ message = "Initializing CampusMind X..." }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-fadeIn bg-transparent">
      <div className="relative flex items-center justify-center mb-6">
        {/* Ambient Glow */}
        <div className="absolute w-28 h-28 bg-indigo-500/15 rounded-full blur-2xl animate-pulse" />
        <div className="absolute w-20 h-20 bg-pink-500/15 rounded-full blur-xl" />

        {/* Orbiting Spinner Ring */}
        <div className="w-16 h-16 rounded-2xl border-2 border-indigo-200 border-t-indigo-600 border-r-purple-600 animate-spin" />

        {/* Center Icon */}
        <div className="absolute w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md">
          <BrainCircuit className="w-5 h-5 text-indigo-600 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-1.5">
        <h3 className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>CampusMind<span className="aurora-gradient-text font-black">X</span></span>
        </h3>
        <p className="text-xs font-semibold text-slate-500">{message}</p>
      </div>
    </div>
  );
}
