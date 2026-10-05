import React from 'react';
import { Bot, Sparkles, BrainCircuit, ShieldAlert, BookOpen, Clock } from 'lucide-react';
import AIChat from '../../components/AIChat';
import RiskBadge from '../../components/RiskBadge';
import { currentStudent } from '../../data/students';

export default function StudentAssistant() {
  const student = currentStudent;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
              Conversational Explainable AI
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Context-Aware Agent
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            CampusMind AI
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Query your academic trajectory, examine feature attribution models, and receive personalized remedial action plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2.5">
            <span className="text-xs text-slate-500 font-medium">Target Persona:</span>
            <span className="text-xs font-bold text-slate-900">{student.name}</span>
            <RiskBadge level={student.riskLevel} size="sm" />
          </div>
        </div>
      </div>

      {/* Main Interactive Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Component */}
        <div className="lg:col-span-8">
          <AIChat role="student" studentContext={student} />
        </div>

        {/* Sidebar Context & Active Factor Explainer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-[24px] p-5 border border-indigo-100/90 bg-white/95 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-3">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Active Agent Context</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Enrolled Program:</span>
                <span className="font-bold text-slate-900">{student.shortProgram} Sem {student.semester}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Current Aggregate:</span>
                <span className="font-mono font-bold text-indigo-600">84%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Attendance Status:</span>
                <span className="font-mono font-bold text-amber-600">71% (Clearance Target: 75%)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Support Status:</span>
                <span className="font-mono font-bold text-emerald-600">Healthy Trajectory</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Career Direction:</span>
                <span className="font-bold text-slate-800">{student.careerGoal || 'Full Stack Developer'}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[24px] p-5 border border-slate-200/80 bg-white/95 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Recommended Prompts</span>
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Ask anything to inspect your transparent AI predictions:
            </p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "Why is my academic risk increasing?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "What skills should I learn for Full Stack Development?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "Show my performance trend."
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "Create my weekly study plan."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
