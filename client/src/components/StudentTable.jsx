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
  const [sortBy, setSortBy] = useState('riskScore'); // 'riskScore', 'attendance', 'performance'
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter students
  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.careerGoal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || s.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  // Sort students
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortBy] ?? 0;
    let bVal = b[sortBy] ?? 0;
    if (sortBy === 'riskScore') {
      aVal = a.riskScore || 0;
      bVal = b.riskScore || 0;
    }
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
    <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      {/* Table Controls / Filter Toolbar */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/50">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll no, or career..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <span className="px-2 text-slate-400 text-[11px] font-medium">Filter:</span>
            {['all', 'high', 'medium', 'low'].map((rf) => (
              <button
                key={rf}
                onClick={() => setRiskFilter(rf)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                  riskFilter === rf
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rf === 'all' ? 'All Cohort' : `${rf} Risk`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0b1222] text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Student Profile</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('overallPerformance')}>
                <div className="flex items-center gap-1">
                  <span>Performance</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('attendance')}>
                <div className="flex items-center gap-1">
                  <span>Attendance</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('riskScore')}>
                <div className="flex items-center gap-1">
                  <span>AI Risk Level</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4">Career Goal</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {sorted.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-cyan-400 transition-colors"
                    />
                    <div>
                      <span className="font-bold text-white group-hover:text-cyan-300 transition-colors block">
                        {student.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {student.rollNo} • Sem {student.semester}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{student.overallPerformance}%</span>
                    <span className="text-[11px] text-slate-400">CGPA {student.currentCgpa}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        student.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {student.attendance}%
                    </span>
                    {student.attendance < 75 && (
                      <span className="text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-500/30">
                        Shortage
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <RiskBadge level={student.riskLevel} size="sm" />
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-300 text-xs">{student.careerGoal}</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onExplainStudent && onExplainStudent(student)}
                      className="p-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 transition-colors"
                      title="Explain Predictive Factors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectStudent && onSelectStudent(student)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                    >
                      Profile
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">
                  No student records found matching the query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
