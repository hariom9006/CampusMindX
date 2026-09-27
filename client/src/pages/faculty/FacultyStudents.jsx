import React, { useState } from 'react';
import { Users, Filter, Sparkles, AlertOctagon, Mail, Calendar, CheckSquare } from 'lucide-react';
import StudentTable from '../../components/StudentTable';
import ExplainabilityModal from '../../components/ExplainabilityModal';
import { allStudents } from '../../data/students';

export default function FacultyStudents() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const students = allStudents;

  const handleExplainStudent = (student) => {
    setSelectedStudent(student);
    setExplainModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
              Advisory Roster
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              BCA Sem 5 Cohort
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1.5">
            Student Monitoring & Risk Triage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric attendance, continuous internal evaluation, and automated academic support indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Batch notification dispatch modal opened.")}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white glass-panel hover:bg-slate-800 transition-colors border border-slate-700 flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Cohort Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Active</span>
          <span className="text-xl font-bold text-white mt-0.5 block">{students.length} Students</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-rose-500/30 text-center bg-rose-950/20">
          <span className="text-[10px] font-mono uppercase text-rose-300 block">Critical Risk</span>
          <span className="text-xl font-bold text-rose-400 mt-0.5 block">2 Students</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-amber-500/30 text-center bg-amber-950/20">
          <span className="text-[10px] font-mono uppercase text-amber-300 block">Medium / At Risk</span>
          <span className="text-xl font-bold text-amber-400 mt-0.5 block">2 Students</span>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/30 text-center bg-emerald-950/20">
          <span className="text-[10px] font-mono uppercase text-emerald-300 block">Exemplary Tier</span>
          <span className="text-xl font-bold text-emerald-400 mt-0.5 block">4 Students</span>
        </div>
      </div>

      {/* Student Table */}
      <StudentTable
        students={students}
        onExplainStudent={handleExplainStudent}
        onSelectStudent={handleExplainStudent}
      />

      {/* Explainability Modal */}
      {selectedStudent && (
        <ExplainabilityModal
          isOpen={explainModalOpen}
          onClose={() => setExplainModalOpen(false)}
          studentName={selectedStudent.name}
          rollNo={selectedStudent.rollNo}
          riskLevel={selectedStudent.riskLevel}
          overallScore={`${selectedStudent.overallPerformance}%`}
          factors={selectedStudent.explainabilityFactors || []}
        />
      )}
    </div>
  );
}
