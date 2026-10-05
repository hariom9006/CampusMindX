import React, { useState } from 'react';
import { Users, Filter, Sparkles, Mail } from 'lucide-react';
import StudentTable from '../../components/StudentTable';
import ExplainabilityModal from '../../components/ExplainabilityModal';
import { allStudents } from '../../data/students';

export default function FacultyStudents() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  const students = allStudents;

  const handleExplainStudent = (student) => {
    setSelectedStudent(student);
    setExplainModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-full">
              Advisory Roster
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              BCA Sem 5 Cohort
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Student Monitoring
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Continuous attendance telemetry, internal evaluations, and automated support indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Batch notification dispatch modal opened.")}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Cohort Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-[22px] border border-slate-200/80 bg-white/95 text-center shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Active</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{students.length} Students</span>
        </div>
        <div className="glass-panel p-4 rounded-[22px] border border-rose-200 text-center bg-rose-50/50 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-rose-700 block">Support Signals</span>
          <span className="text-2xl font-extrabold text-rose-600 mt-0.5 block">2 Students</span>
        </div>
        <div className="glass-panel p-4 rounded-[22px] border border-amber-200 text-center bg-amber-50/50 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-amber-700 block">Advisory Watch</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-0.5 block">3 Students</span>
        </div>
        <div className="glass-panel p-4 rounded-[22px] border border-emerald-200 text-center bg-emerald-50/50 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-emerald-700 block">Healthy Trajectory</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-0.5 block">3 Students</span>
        </div>
      </div>

      {/* Interactive Cohort Table */}
      <div>
        <StudentTable
          students={students}
          onExplainStudent={handleExplainStudent}
        />
      </div>

      <ExplainabilityModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        studentName={selectedStudent?.name || "Hariom"}
        rollNo={selectedStudent?.rollNo || "22BCA1042"}
        riskLevel={selectedStudent?.riskLevel || "Healthy"}
      />
    </div>
  );
}
