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
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-full font-semibold">
              Faculty Advisory Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Faculty AI Assistant
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Query cohort attendance trajectories, early support signals, and generate intervention plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-slate-500 font-medium">Faculty Lead:</span>
            <span className="text-xs font-bold text-slate-900">Dr. Sunita Kulkarni</span>
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
            title="CampusMind AI • Faculty Advisory"
            subtitle="Dr. Sunita Kulkarni • BCA Department Chair"
          />
        </div>

        {/* Sidebar Context & Quick Faculty Queries */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-[24px] p-5 border border-purple-100 bg-white/95 shadow-xs">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-3">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Cohort Advisory Scope</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Active Cohort:</span>
                <span className="font-bold text-slate-900">BCA 2022-2025 (Sem 5)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Cohort Size:</span>
                <span className="font-mono font-bold text-purple-600">64 Enrolled</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Support Signals:</span>
                <span className="font-mono font-bold text-rose-600">6 Active Signals</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Class Average:</span>
                <span className="font-mono font-bold text-indigo-600">78.4%</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[24px] p-5 border border-slate-200/80 bg-white/95 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Frequent Inquiries</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "Which students need attention?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "What is the class attendance trend?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "Which subject has the lowest average performance?"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                "Give me a cohort summary of BCA Semester 5."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
