import React from 'react';
import { Bot, Sparkles, BrainCircuit, Users, ShieldAlert, GraduationCap, Building2 } from 'lucide-react';
import AIChat from '../../components/AIChat';

export default function FacultyAssistant() {
  const facultyPrompts = [
    "Which students need attention?",
    "What is the class attendance trend?",
    "Which subject has the lowest average performance?",
    "Give me a cohort summary of BCA Semester 5."
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 font-semibold">
              Faculty Advisory Intelligence
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Role-Based Access Enforced
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1.5">
            Faculty AI Intelligence Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Query cohort attendance trajectories, early-warning indicators, and identify students requiring academic advisory interventions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">Authenticated Advisor:</span>
            <span className="text-xs font-bold text-white">Dr. Sunita Kulkarni</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Component */}
        <div className="lg:col-span-8">
          <AIChat
            role="faculty"
            initialPrompts={facultyPrompts}
            title="Faculty Advisory Assistant"
            subtitle="Context: Dr. Sunita Kulkarni • BCA Department Chair"
          />
        </div>

        {/* Sidebar Context & Quick Faculty Queries */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm mb-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Cohort Advisory Scope</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-white">School of Computing & IT</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Monitored Cohort:</span>
                <span className="font-semibold text-white">BCA Semester 5</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Enrolled Students:</span>
                <span className="font-mono font-bold text-cyan-400">5 Students</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">High Risk Priority:</span>
                <span className="font-mono font-bold text-red-400">2 Students (Rohan, Kabir)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Active Interventions:</span>
                <span className="font-mono font-bold text-purple-300">6 Clinical Sprints</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Suggested Advisory Queries</span>
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Click any question below to immediately inspect student risk distributions:
            </p>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                "Which students need attention?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                "What is the class attendance trend?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                "Which subject has the lowest average performance?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                "Give me a cohort summary of BCA Semester 5."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
