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
  Legend
} from 'recharts';
import {
  Building2,
  Sparkles,
  Layers,
  GraduationCap,
  CalendarCheck,
  CheckSquare,
  AlertTriangle,
  Clock,
  ArrowRight,
  Edit3,
  Bot,
  HelpCircle,
  RotateCcw,
  Send,
  User,
  Shield,
  Target,
  FileText,
  Cpu
} from 'lucide-react';

import adminDataService from '../../services/adminDataService';
import adminAnalysisService from '../../services/adminAnalysisService';

export default function AdminAnalysisResultPage() {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [supportingDataModalOpen, setSupportingDataModalOpen] = useState(false);

  // University AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: 'Greetings Administrator! I am your CampusMind University AI. I have evaluated your university and departmental records. Ask me which departments need attention, how institutional attendance is trending, or request an institutional action plan!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Load and calculate analysis on mount
  useEffect(() => {
    const rawData = adminDataService.loadAdminData();
    if (!rawData) {
      navigate('/analyze-university');
      return;
    }

    setAdminData(rawData);
    const calculated = adminAnalysisService.runFullAdminAnalysis(rawData);
    setAnalysis(calculated);
    adminDataService.saveAdminAnalysisResults(calculated);
  }, [navigate]);

  if (!adminData || !analysis) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex items-center justify-center p-4 aurora-bg-mesh">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading university intelligence...</span>
        </div>
      </div>
    );
  }

  const { metrics, recommendations, actionPlan } = analysis;
  const { kpis, departmentChartData, deptsBelowAttTarget, deptsBelowPerfTarget, commonSkillGaps, thresholds } =
    metrics;

  // AI Chat handler
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const userMsg = { sender: 'user', text: userText };
    setChatInput('');

    const aiResponseText = adminAnalysisService.processUniversityChat(
      userText,
      adminData,
      metrics
    );

    const aiMsg = { sender: 'assistant', text: aiResponseText };
    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const handlePromptClick = (prompt) => {
    setChatInput(prompt);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col justify-between aurora-bg-mesh selection:bg-cyan-500/20 selection:text-cyan-900">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP BAR / MODE HEADER */}
        <div className="glass-panel rounded-[24px] p-5 border border-cyan-100 bg-white/95 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-800 font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200">
                  Administrator Personal Analysis
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[10px] font-mono text-cyan-800 font-semibold">
                  Personalized Demo Analysis
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                My University Intelligence
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Welcome, <span className="font-bold text-slate-900">Central Academic Directorate</span> •{' '}
                {adminData.universityInfo.universityName} ({adminData.universityInfo.academicYear})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => navigate('/analyze-university')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit University Data</span>
            </button>
            <button
              onClick={() => {
                const refreshed = adminAnalysisService.runFullAdminAnalysis(adminData);
                setAnalysis(refreshed);
                alert('University intelligence re-analyzed.');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
              <span>Re-Analyze</span>
            </button>
            <Link
              to="/admin"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
            >
              Switch to Demo Mode
            </Link>
          </div>
        </div>

        {/* 8 ADMIN KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Total Students */}
          <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/90 bg-white/95/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Enrolled Students</span>
            <span className="text-xl font-black text-white mt-1 block">{kpis.totalStudents}</span>
            <span className="text-[10px] text-blue-400 font-mono">University-Wide</span>
          </div>

          {/* 2. Total Faculty */}
          <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/90 bg-white/95/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Faculty Members</span>
            <span className="text-xl font-black text-white mt-1 block">{kpis.totalFaculty}</span>
            <span className="text-[10px] text-slate-400">Instructional Staff</span>
          </div>

          {/* 3. Departments */}
          <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/90 bg-white/95/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Departments</span>
            <span className="text-xl font-black text-purple-400 mt-1 block">{kpis.departmentCount}</span>
            <span className="text-[10px] text-purple-300/80">Academic Units</span>
          </div>

          {/* 4. Average Performance */}
          <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/90 bg-white/95/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Avg Performance</span>
            <span className="text-xl font-black text-cyan-400 mt-1 block">{kpis.avgPerformance}%</span>
            <span className="text-[10px] text-slate-400">Pass: {kpis.passPercentage}%</span>
          </div>

          {/* 5. Average Attendance */}
          <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/90 bg-white/95/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Avg Attendance</span>
            <span
              className={`text-xl font-black mt-1 block ${
                kpis.avgAttendance >= 75 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {kpis.avgAttendance}%
            </span>
            <span className="text-[10px] text-slate-400">Target: {thresholds.attendanceTarget}%</span>
          </div>

          {/* 6. Assignment Completion */}
          <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/90 bg-white/95/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Assignment Rate</span>
            <span className="text-xl font-black text-indigo-400 mt-1 block">
              {kpis.avgAssignmentCompletion}%
            </span>
            <span className="text-[10px] text-slate-400">Submission Rate</span>
          </div>

          {/* 7. Students Requiring Attention */}
          <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/30 bg-amber-950/20 shadow">
            <span className="text-[10px] font-mono uppercase text-amber-300 block">Requires Attention</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">{kpis.totalAttentionCount}</span>
            <span className="text-[10px] text-amber-300/80">Support Flags</span>
          </div>

          {/* 8. Skill Readiness */}
          <div className="glass-panel rounded-2xl p-3.5 border border-cyan-500/30 bg-indigo-50/20 shadow">
            <span className="text-[10px] font-mono uppercase text-cyan-300 block">Skill Readiness</span>
            <span className="text-xl font-black text-cyan-300 mt-1 block">
              {kpis.skillReadiness !== null ? `${kpis.skillReadiness}%` : 'N/A'}
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono">
              {kpis.skillReadiness !== null ? 'Industry Aligned' : 'Not Provided'}
            </span>
          </div>
        </div>

        {/* SECTION: DEPARTMENT COMPARISON BAR CHART */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Cross-Department Benchmark Telemetry</span>
              </h3>
              <p className="text-xs text-slate-400">
                Comparative analysis of academic marks, attendance compliance, and assignment completion.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Performance
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Attendance
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Assignments
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d1a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="performance" name="Performance %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance %" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assignments" name="Assignments %" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION: DEPARTMENT DATA TABLE */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Department Operational Roster</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated from administrator-entered department metrics.
              </p>
            </div>
            <span className="text-xs font-mono text-blue-300">
              {departmentChartData.length} Departments Audited
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Students</th>
                  <th className="p-3.5">Faculty</th>
                  <th className="p-3.5">Avg Performance</th>
                  <th className="p-3.5">Avg Attendance</th>
                  <th className="p-3.5">Assignment Rate</th>
                  <th className="p-3.5">Students Requiring Attention</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-slate-300">
                {adminData.departments.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{d.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {d.code} • HOD: {d.headOfDepartment || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{d.studentsCount}</td>
                    <td className="p-3.5 font-mono text-slate-300">{d.facultyCount}</td>
                    <td className="p-3.5">
                      <span
                        className={`font-mono font-semibold ${
                          d.avgPerformance >= thresholds.academicTarget ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {d.avgPerformance}%
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                          d.avgAttendance >= thresholds.attendanceTarget
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {d.avgAttendance}%
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-indigo-300">{d.assignmentCompletion}%</td>
                    <td className="p-3.5 font-mono font-bold text-amber-400">
                      {d.studentsRequiringAttention}
                    </td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                          d.avgAttendance >= 75 && d.avgPerformance >= 70
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {d.avgAttendance >= 75 && d.avgPerformance >= 70 ? 'Compliant' : 'Review Needed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION: ATTENDANCE & SKILL GAP INTELLIGENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Attendance Analysis (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>University Attendance Intelligence</span>
            </h3>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
              <span className="font-bold block mb-1">Institutional Attendance Alert:</span>
              <p className="leading-relaxed">
                {deptsBelowAttTarget.length > 0
                  ? `${deptsBelowAttTarget.length} department(s) (${deptsBelowAttTarget
                      .map((d) => d.code)
                      .join(', ')}) have average attendance below the configured ${thresholds.attendanceTarget}% benchmark.`
                  : `All departments currently satisfy the institutional ${thresholds.attendanceTarget}% attendance requirement.`}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="text-slate-400">University Weighted Average:</span>
                <span className="font-bold font-mono text-white">{kpis.avgAttendance}%</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="text-slate-400">Departments Below Target:</span>
                <span className="font-bold font-mono text-amber-400">{deptsBelowAttTarget.length}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="text-slate-400">Flagged Attendance Shortage Students:</span>
                <span className="font-bold font-mono text-red-400">
                  {adminData.universityAcademic.attendanceBelowTargetCount}
                </span>
              </div>
            </div>
          </div>

          {/* Industry Skill Gap Intelligence (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Industry Skill Gap Intelligence</span>
              </h3>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                Prototype Skill Gap Analysis
              </span>
            </div>

            {adminData.skillsData && adminData.skillsData.length > 0 ? (
              <div className="space-y-3">
                {adminData.skillsData.map((sk, idx) => {
                  const target = Number(sk.targetLevel) || 75;
                  const gap = Math.max(0, target - sk.level);
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{sk.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Current: <strong className="text-white">{sk.level}%</strong> | Target:{' '}
                          <strong className="text-cyan-400">{target}%</strong>
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{ width: `${sk.level}%` }}
                        />
                      </div>
                      {gap > 0 && (
                        <div className="flex justify-end">
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                              gap >= 25
                                ? 'bg-red-950/80 text-red-300 border border-red-500/30'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            Gap: {gap}% ({gap >= 25 ? 'High Priority' : 'Moderate'})
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Skill data not provided in this institutional dataset.
              </div>
            )}
          </div>
        </div>

        {/* SECTION: EXPLAINABLE AI CARD & MODAL TRIGGER */}
        <div className="glass-panel rounded-3xl p-6 border border-blue-500/40 bg-slate-900/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40">
                CampusMind Institutional Explainability
              </span>
              <span className="text-xs text-slate-400 font-mono">XAI Feature Attribution</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Why did CampusMind generate this university insight?
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Institutional flags and recommendations are transparently attributed across department-level attendance rates, academic passing scores, and coursework bottlenecks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setExplainModalOpen(true)}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md flex items-center gap-2 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-cyan-300" />
              <span>View Explainability Breakdown</span>
            </button>
          </div>
        </div>

        {/* SECTION: RECOMMENDATIONS & UNIVERSITY ACTION PLAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Institutional Recommendations (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Recommended Institutional Actions</span>
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
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{rec.reason}</p>
                  <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-300">
                    <span className="font-semibold block text-[10px] uppercase font-mono text-blue-400">
                      Policy Directive:
                    </span>
                    {rec.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* University Action Plan (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>University Action Plan</span>
            </h3>

            <div className="space-y-3">
              {actionPlan.map((item) => (
                <div
                  key={item.priority}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center text-[10px] font-mono">
                        P{item.priority}
                      </span>
                      <span>{item.title}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-300 pl-7">{item.action}</p>
                  <div className="pl-7 text-[11px] text-cyan-300 font-mono">Target: {item.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION: CAMPUSMIND UNIVERSITY AI */}
        <div className="glass-panel rounded-3xl p-6 border border-blue-500/40 bg-slate-900/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">CampusMind University AI</h3>
                <span className="text-[10px] font-mono text-blue-300">
                  Grounded in entered institutional records for {adminData.universityInfo.universityName}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Executive AI
            </span>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'Which department needs attention?',
              'What is the university average performance?',
              'Which departments have attendance concerns?',
              'What are the major skill gaps?',
              'Create an institutional action plan',
              'Explain the contribution weights'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handlePromptClick(chip)}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-950/80 hover:bg-blue-950/80 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 max-h-64 overflow-y-auto p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/40 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium'
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
              placeholder="Ask anything about departmental pass rates, attendance compliance, or resource priorities..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* EXPLAINABILITY MODAL */}
      {explainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl glass-panel border border-blue-500/40 bg-slate-950 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40">
                  Explainable AI Telemetry
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Why did CampusMind generate this university insight?
                </h3>
              </div>
              <button
                onClick={() => setExplainModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Factor Weights */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Institutional Contribution Factors</span>
                <span className="text-[10px] font-mono text-blue-300 uppercase">
                  Demo Contribution Weights
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Dept Attendance</span>
                  <span className="font-bold text-blue-300">40%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Academic Marks</span>
                  <span className="font-bold text-blue-300">30%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Assignments</span>
                  <span className="font-bold text-blue-300">20%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Staff Ratio</span>
                  <span className="font-bold text-blue-300">10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-white block">Explanation:</span>
              <p className="text-slate-300 leading-relaxed">
                Institutional support alerts are primarily triggered when multiple departments record student attendance rates below the configured benchmark ({thresholds.attendanceTarget}%) or accumulate high numbers of students requiring academic intervention.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setExplainModalOpen(false);
                  setSupportingDataModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-300 hover:text-white glass-panel hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-blue-500/30"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Supporting Data</span>
              </button>

              <button
                onClick={() => setExplainModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORTING DATA MODAL */}
      {supportingDataModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-950 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">University Supporting Telemetry</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {adminData.universityInfo.universityName}
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
                <span className="text-slate-400">Enrolled Students:</span>
                <span className="font-bold text-slate-900">{kpis.totalStudents}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Total Faculty:</span>
                <span className="font-bold text-slate-900">{kpis.totalFaculty}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Departments Below Target:</span>
                <span className="font-bold text-amber-400">{deptsBelowAttTarget.length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Students Flagged for Support:</span>
                <span className="font-bold text-red-400">{kpis.totalAttentionCount}</span>
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
