import React, { useState } from 'react';
import RiskBadge from './RiskBadge';
import { Search, Filter, ArrowUpDown, ExternalLink, Sparkles, UserCheck, AlertCircle } from 'lucide-react';

export default function StudentTable({
  students = [],
  onSelectStudent = null,
  onExplainStudent = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('overallPerformance');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter students
  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.careerGoal && s.careerGoal.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = riskFilter === 'all' || s.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  // Sort students
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortBy] ?? 0;
    let bVal = b[sortBy] ?? 0;
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="glass-panel rounded-[24px] border border-slate-200/80 overflow-hidden shadow-[0_10px_30px_-5px_rgba(15,23,42,0.03)] bg-white">
      {/* Table Controls / Filter Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/60">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll no, or career goal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <span className="px-2 text-[11px] font-bold text-slate-400">Filter:</span>
            {['all', 'high', 'medium', 'low'].map((rf) => (
              <button
                key={rf}
                onClick={() => setRiskFilter(rf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  riskFilter === rf
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rf === 'all' ? 'All Cohort' : rf === 'high' ? 'Support Needed' : `${rf} Risk`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card View (Section 11 Requirement: Convert tables to responsive cards on mobile) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {sorted.map((s) => (
          <div key={s.rollNo} className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {s.name}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {s.rollNo}
                  </span>
                </div>
              </div>
              <RiskBadge level={s.riskLevel} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Performance
                </span>
                <span className="font-mono font-extrabold text-slate-800 text-sm">
                  {s.overallPerformance}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Attendance
                </span>
                <span className={`font-mono font-extrabold text-sm ${s.attendance < 75 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {s.attendance}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium truncate max-w-[180px]">
                🎯 {s.careerGoal || 'Full Stack Developer'}
              </span>
              <button
                onClick={() => onExplainStudent && onExplainStudent(s)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Explain AI</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4">Student Profile</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('overallPerformance')}>
                <div className="flex items-center gap-1">
                  <span>Performance</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('attendance')}>
                <div className="flex items-center gap-1">
                  <span>Attendance</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('riskLevel')}>
                <div className="flex items-center gap-1">
                  <span>Support Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Career Goal</th>
              <th className="py-3.5 px-4 text-right">Explainability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((s) => (
              <tr
                key={s.rollNo}
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors">
                        {s.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {s.rollNo}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                  {s.overallPerformance}%
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <span className={`font-bold ${s.attendance < 75 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {s.attendance}%
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <RiskBadge level={s.riskLevel} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {s.careerGoal || 'Full Stack Developer'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onExplainStudent && onExplainStudent(s)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>Explain</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
