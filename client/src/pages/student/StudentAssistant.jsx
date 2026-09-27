import React from 'react';
import { Bot, Sparkles, BrainCircuit, ShieldAlert, BookOpen, Clock } from 'lucide-react';
import AIChat from '../../components/AIChat';
import RiskBadge from '../../components/RiskBadge';
import { currentStudent } from '../../data/students';

export default function StudentAssistant() {
  const student = currentStudent;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              Conversational Explainable AI
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
              Context-Aware Agent
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1.5">
            CampusMind AI Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Query your academic trajectory, examine feature attribution models, and receive personalized remedial action plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <span className="text-xs text-slate-400">Target Persona:</span>
            <span className="text-xs font-bold text-white">{student.name}</span>
            <RiskBadge level={student.riskLevel} size="sm" />
          </div>
        </div>
      </div>

      {/* Main Interactive Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Component */}
        <div className="lg:col-span-8">
          <AIChat studentContext={student} />
        </div>

        {/* Sidebar Context & Active Factor Explainer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-3">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>Active Agent Context</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Enrolled Program:</span>
                <span className="font-semibold text-white">{student.shortProgram} Sem {student.semester}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Current Aggregate:</span>
                <span className="font-mono font-bold text-cyan-400">{student.overallPerformance}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Attendance Status:</span>
                <span className="font-mono font-bold text-amber-400">{student.attendance}% (Below 75%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Academic Support:</span>
                <span className="font-mono font-bold text-purple-300">{student.academicSupportIndicator}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Career Direction:</span>
                <span className="font-semibold text-slate-200">{student.careerGoal}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recommended Prompts</span>
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Click any question below to immediately inspect how the AI calculates your risk indicators:
            </p>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                "Why is my DSA grade pulling down my predicted GPA?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                "How many classes do I need to clear attendance?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                "Explain my Academic Support Indicator"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                "What is my skill gap for Full Stack Developer?"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
