import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  Users,
  Sparkles,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit3,
  Bot,
  Info,
  HelpCircle,
  RotateCcw,
  Send,
  User,
  Compass,
  Target,
  FileText
} from 'lucide-react';

import facultyDataService from '../../services/facultyDataService';
import facultyAnalysisService from '../../services/facultyAnalysisService';

export default function FacultyAnalysisResultPage() {
  const navigate = useNavigate();

  const [facultyData, setFacultyData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [supportingDataModalOpen, setSupportingDataModalOpen] = useState(false);

  // Faculty AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello Professor! I am your CampusMind Faculty AI Assistant. I have analyzed your entered class roster, attendance records, and assessment submissions. Ask me which students require attention, how average attendance looks, or what action steps to take this week!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Load and calculate analysis on mount
  useEffect(() => {
    const rawData = facultyDataService.loadFacultyData();
    if (!rawData) {
      navigate('/analyze-class');
      return;
    }

    setFacultyData(rawData);
    const calculated = facultyAnalysisService.runFullFacultyAnalysis(rawData);
    setAnalysis(calculated);
    facultyDataService.saveFacultyAnalysisResults(calculated);
  }, [navigate]);

  if (!facultyData || !analysis) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex items-center justify-center p-4 aurora-bg-mesh">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading class intelligence...</span>
        </div>
      </div>
    );
  }

  const { classMetrics, recommendations, actionPlan } = analysis;
  const { academic, attendance, assignments, flaggedStudents, topics, thresholds } = classMetrics;

  const highAttentionCount = flaggedStudents.filter((s) => s.indicator === 'High Attention').length;
  const modAttentionCount = flaggedStudents.filter((s) => s.indicator === 'Moderate Attention').length;

  // Student Score Distribution Chart Data
  const scoreDistData = academic.scoreDistribution || [];

  // Attendance breakdown pie data
  const attendancePieData = [
    { name: 'Healthy (>=75%)', value: attendance.distribution.healthy, color: '#10b981' },
    { name: 'Needs Attention (60-74%)', value: attendance.distribution.needsAttention, color: '#f59e0b' },
    { name: 'Critical (<60%)', value: attendance.distribution.critical, color: '#ef4444' }
  ];

  // Open explanation for a flagged student
  const handleOpenExplanation = (student) => {
    setSelectedStudentForModal(student);
    setExplainModalOpen(true);
  };

  // AI Chat handler
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const userMsg = { sender: 'user', text: userText };
    setChatInput('');

    const aiResponseText = facultyAnalysisService.processFacultyChat(
      userText,
      facultyData,
      classMetrics
    );

    const aiMsg = { sender: 'assistant', text: aiResponseText };
    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const handlePromptClick = (prompt) => {
    setChatInput(prompt);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col justify-between aurora-bg-mesh selection:bg-purple-500/20 selection:text-purple-900">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP BAR / MODE HEADER */}
        <div className="glass-panel rounded-[24px] p-5 border border-purple-100 bg-white/95 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                  Faculty Personal Analysis
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[10px] font-mono text-purple-700 font-semibold">
                  Personalized Demo Analysis
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                My Class Intelligence
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Welcome, <span className="font-bold text-slate-900">{facultyData.facultyInfo.facultyName}</span> •{' '}
                {facultyData.facultyInfo.subject} (Sem {facultyData.facultyInfo.semester} - Section {facultyData.facultyInfo.section})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => navigate('/analyze-class')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
              <span>Edit Class Data</span>
            </button>
            <button
              onClick={() => {
                const refreshed = facultyAnalysisService.runFullFacultyAnalysis(facultyData);
                setAnalysis(refreshed);
                alert('Class intelligence re-analyzed.');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
              <span>Re-Analyze</span>
            </button>
            <Link
              to="/faculty"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
            >
              Switch to Demo Mode
            </Link>
          </div>
        </div>

        {/* 6 FACULTY KPI CARDS (STRICTLY CALCULATED FROM ENTERED DATA) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Total Students */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/95 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Students</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {academic.totalStudents}
            </span>
            <span className="text-[11px] text-purple-400 font-mono">
              Sec {facultyData.facultyInfo.section} • Enrolled
            </span>
          </div>

          {/* 2. Average Performance */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/95 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Average Performance</span>
            <span className="text-2xl font-black text-cyan-400 mt-1 block">
              {academic.classAverage}%
            </span>
            <span className="text-[11px] text-slate-400">
              High: {academic.highestScore}% | Low: {academic.lowestScore}%
            </span>
          </div>

          {/* 3. Average Attendance */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/95 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Average Attendance</span>
            <span
              className={`text-2xl font-black mt-1 block ${
                attendance.averageAttendance >= 75 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {attendance.averageAttendance}%
            </span>
            <span className="text-[11px] text-slate-400">
              Target: {thresholds.attendanceTarget}%
            </span>
          </div>

          {/* 4. Assignment Completion */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/95 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Assignment Rate</span>
            <span className="text-2xl font-black text-indigo-400 mt-1 block">
              {assignments.averageCompletion}%
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {assignments.totalCompleted}/{assignments.totalAssigned} done
            </span>
          </div>

          {/* 5. Requiring Attention */}
          <div className="glass-panel rounded-2xl p-4 border border-amber-500/30 bg-amber-950/20 shadow-lg">
            <span className="text-[10px] font-mono uppercase text-amber-300 block">Requires Attention</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              {highAttentionCount + modAttentionCount}
            </span>
            <span className="text-[11px] text-amber-300/80">
              {highAttentionCount} High • {modAttentionCount} Mod
            </span>
          </div>

          {/* 6. High Performance */}
          <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20 shadow-lg">
            <span className="text-[10px] font-mono uppercase text-emerald-300 block">High Performers</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {academic.highPerformingStudents.length}
            </span>
            <span className="text-[11px] text-emerald-300/80 font-mono">
              Score &gt;= 80%
            </span>
          </div>
        </div>

        {/* SECTION: CLASS PERFORMANCE & ATTENDANCE INTELLIGENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Class Performance Distribution (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Class Performance Distribution</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Categorized score ranges across {academic.totalStudents} enrolled students.
                </p>
              </div>
              <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-500/30">
                Avg: {academic.classAverage}%
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d1a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {scoreDistData.map((entry, index) => {
                      const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#ef4444'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Highest Performer</span>
                <span className="font-bold text-white truncate block">
                  {academic.highestStudent ? `${academic.highestStudent.name} (${academic.highestStudent.score}%)` : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Lowest Performer</span>
                <span className="font-bold text-white truncate block">
                  {academic.lowestStudent ? `${academic.lowestStudent.name} (${academic.lowestStudent.score}%)` : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Below Pass Target</span>
                <span className="font-bold text-amber-400 block">
                  {academic.studentsBelowTarget.length} Students (&lt; {thresholds.performanceTarget}%)
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Risk Breakdown (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                  <span>Attendance Health Breakdown</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Target: {thresholds.attendanceTarget}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Dynamic telemetry of lecture presence and condonation clearance.
              </p>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {attendancePieData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d1a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Attendance Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
              <span className="font-bold block mb-0.5">Attendance Telemetry Alert:</span>
              <span>
                {attendance.studentsBelowTarget.length > 0
                  ? `${attendance.studentsBelowTarget.length} student(s) currently sit below the configured ${thresholds.attendanceTarget}% attendance target and risk exam detention.`
                  : `All ${academic.totalStudents} students currently meet the course attendance target.`}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION: STUDENTS REQUIRING ATTENTION TABLE */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Students Requiring Academic Attention</span>
                </h3>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  Prototype Rule-Based Indicator
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Proactive multi-factor identification combining attendance shortage, marks deficit, and overdue coursework.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-300">
              {flaggedStudents.filter((s) => s.riskLevel !== 'Low').length} Flagged / {academic.totalStudents} Total
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Roll No.</th>
                  <th className="p-3.5">Academic Score</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Assignments</th>
                  <th className="p-3.5">Support Indicator</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-slate-300">
                {flaggedStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-semibold text-white">{s.name}</td>
                    <td className="p-3.5 font-mono text-slate-400">{s.rollNo}</td>
                    <td className="p-3.5">
                      <span
                        className={`font-mono font-semibold ${
                          s.calculatedPerfPct >= thresholds.performanceTarget
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {s.totalMarks}/{s.maxMarks} ({s.calculatedPerfPct}%)
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                          s.calculatedAttPct >= thresholds.attendanceTarget
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {s.attendedClasses}/{s.totalClasses} ({s.calculatedAttPct}%)
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">
                      {s.completedAssignments}/{s.totalAssignments} ({s.calculatedAssignPct}%)
                      {s.overdueAssignments > 0 && (
                        <span className="text-red-400 ml-1">({s.overdueAssignments} overdue)</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          s.indicator === 'High Attention'
                            ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                            : s.indicator === 'Moderate Attention'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {s.indicator}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenExplanation(s)}
                        className="px-3 py-1 rounded-xl text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 transition-colors inline-flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>View Explanation</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION: TOPIC PERFORMANCE & DYNAMIC INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Topic Performance (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Curriculum Topic Mastery</span>
            </h3>

            {topics && topics.topics ? (
              <div className="space-y-3">
                {topics.topics.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{t.name}</span>
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                          t.percentage >= 70
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {t.percentage}% • {t.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          t.percentage >= 70
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-amber-500 to-red-500'
                        }`}
                        style={{ width: `${t.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No specific topic breakdown data entered for this class.
              </div>
            )}
          </div>

          {/* Dynamic Class Insights (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Class-Level Telemetry Insights</span>
              </h3>
              <span className="text-[10px] font-mono uppercase bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40">
                Personalized Demo Insight
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                  Academic Performance Insight
                </span>
                <p className="text-slate-300">
                  {academic.studentsBelowTarget.length > 0
                    ? `${academic.studentsBelowTarget.length} student(s) are performing below the ${thresholds.performanceTarget}% pass benchmark, while ${academic.highPerformingStudents.length} student(s) maintain an honor score (>=80%).`
                    : `Strong academic baseline: all students exceed the ${thresholds.performanceTarget}% benchmark.`}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                  Attendance Telemetry Insight
                </span>
                <p className="text-slate-300">
                  Average lecture attendance stands at {attendance.averageAttendance}%.{' '}
                  {attendance.studentsBelowTarget.length > 0
                    ? `${attendance.studentsBelowTarget.length} student(s) currently need attendance recovery to satisfy the ${thresholds.attendanceTarget}% condonation rule.`
                    : 'All students are in full attendance compliance.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">
                  Coursework & Tasks Insight
                </span>
                <p className="text-slate-300">
                  Class assignment completion is {assignments.averageCompletion}%. There are{' '}
                  {assignments.totalPending} pending and {assignments.totalOverdue} overdue submission(s) across the cohort.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: FACULTY RECOMMENDATIONS & ACTION PLAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recommended Faculty Actions (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Recommended Faculty Actions</span>
            </h3>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{rec.title}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        rec.priority === 'High'
                          ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                          : rec.priority === 'Medium'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{rec.reason}</p>
                  <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300">
                    <span className="font-semibold block text-[10px] uppercase font-mono text-purple-400">
                      Suggested Action:
                    </span>
                    {rec.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Class Action Plan (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>My Class Action Plan</span>
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase text-purple-400 font-bold block mb-2">
                  This Week's Interventions
                </span>
                <div className="space-y-2">
                  {actionPlan.thisWeek.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-2.5 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block">{item.task}</span>
                        <span className="text-[11px] text-slate-400">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-indigo-400 font-bold block mb-2">
                  Next Week's Milestones
                </span>
                <div className="space-y-2">
                  {actionPlan.nextWeek.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-2.5 text-xs"
                    >
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block">{item.task}</span>
                        <span className="text-[11px] text-slate-400">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: CAMPUSMIND FACULTY AI ASSISTANT */}
        <div className="glass-panel rounded-3xl p-6 border border-purple-500/40 bg-slate-900/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">CampusMind Faculty AI</h3>
                <span className="text-[10px] font-mono text-purple-300">
                  Grounded in your entered {facultyData.facultyInfo.subject} data
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Interactive Advisor
            </span>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'Which students need attention?',
              'What is the average class performance?',
              'Which students have low attendance?',
              'Which topic needs revision?',
              'What should I focus on this week?',
              'Explain the contribution weights'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handlePromptClick(chip)}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-950/80 hover:bg-purple-950/80 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-3 max-h-64 overflow-y-auto p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-purple-600/40 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about student attendance, scores, or revision plans..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* EXPLAINABILITY MODAL FOR FLAGGED STUDENT */}
      {explainModalOpen && selectedStudentForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl glass-panel border border-purple-500/40 bg-slate-950 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40">
                  Explainable AI Telemetry
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Why was {selectedStudentForModal.name} flagged?
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Roll No: {selectedStudentForModal.rollNo} • Indicator: {selectedStudentForModal.indicator}
                </span>
              </div>
              <button
                onClick={() => setExplainModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Factor Weights Banner */}
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Rule-Based Composite Attribution</span>
                <span className="text-[10px] font-mono text-purple-300 uppercase">
                  Demo Contribution Weights
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Attendance</span>
                  <span className="font-bold text-purple-300">35%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Performance</span>
                  <span className="font-bold text-purple-300">30%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Assignments</span>
                  <span className="font-bold text-purple-300">20%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Overdue Tasks</span>
                  <span className="font-bold text-purple-300">15%</span>
                </div>
              </div>
            </div>

            {/* Flag Explanation Specific to Student */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-white block">Specific Contributing Factors:</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {selectedStudentForModal.flagReasons && selectedStudentForModal.flagReasons.length > 0 ? (
                  selectedStudentForModal.flagReasons.map((r, i) => <li key={i}>{r}</li>)
                ) : (
                  <li>Student metrics require routine follow-up.</li>
                )}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setExplainModalOpen(false);
                  setSupportingDataModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:text-white glass-panel hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-purple-500/30"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Supporting Data</span>
              </button>

              <button
                onClick={() => setExplainModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORTING DATA MODAL */}
      {supportingDataModalOpen && selectedStudentForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-950 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Supporting Data: {selectedStudentForModal.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Roll No: {selectedStudentForModal.rollNo}
                </span>
              </div>
              <button
                onClick={() => setSupportingDataModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100/80">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Total Marks:</span>
                <span className="font-bold text-slate-900">
                  {selectedStudentForModal.totalMarks} / {selectedStudentForModal.maxMarks} (
                  {selectedStudentForModal.calculatedPerfPct}%)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Attendance:</span>
                <span className="font-bold text-slate-900">
                  {selectedStudentForModal.attendedClasses} / {selectedStudentForModal.totalClasses} (
                  {selectedStudentForModal.calculatedAttPct}%)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Completed Assignments:</span>
                <span className="font-bold text-slate-900">
                  {selectedStudentForModal.completedAssignments} / {selectedStudentForModal.totalAssignments}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Overdue Assignments:</span>
                <span className="font-bold text-red-400">
                  {selectedStudentForModal.overdueAssignments}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSupportingDataModalOpen(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
