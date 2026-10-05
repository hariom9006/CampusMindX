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
  Sparkles,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  Target,
  BrainCircuit,
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
  Compass
} from 'lucide-react';

import studentDataService from '../../services/studentDataService';
import analysisService from '../../services/analysisService';

export default function AnalysisResultPage() {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [supportingDataModalOpen, setSupportingDataModalOpen] = useState(false);

  // AI Chat state for Personal Analysis mode
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I am your CampusMind X Personal Assistant. I have analyzed your entered academic, attendance, coursework, and career information. Ask me anything about your strengths, skill gaps, or attendance clearance!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Load and calculate analysis on mount
  useEffect(() => {
    const rawStudent = studentDataService.loadStudentData();
    if (!rawStudent) {
      // If no data entered yet, redirect to the entry form
      navigate('/analyze');
      return;
    }

    setStudentData(rawStudent);

    // Compute fresh analysis
    const actualGoal = rawStudent.careerGoal === 'Other' && rawStudent.customCareerGoal
      ? rawStudent.customCareerGoal
      : rawStudent.careerGoal || 'Full Stack Developer';

    const academicAnalysis = analysisService.analyzeAcademicPerformance(rawStudent.subjects);
    const attendanceAnalysis = analysisService.analyzeAttendance(
      rawStudent.attendanceRecords,
      rawStudent.attendanceThreshold || 75
    );
    const assignmentAnalysis = analysisService.analyzeAssignments(rawStudent.assignments);
    const skillAnalysis = analysisService.analyzeSkillGaps(rawStudent.skills, actualGoal);
    const indicator = analysisService.calculateAcademicSupportIndicator(
      academicAnalysis,
      attendanceAnalysis,
      assignmentAnalysis,
      skillAnalysis
    );
    const insights = analysisService.generateInsights(rawStudent, {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator
    });
    const recommendations = analysisService.generateRecommendations(rawStudent, {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator
    });
    const studyPlan = analysisService.generateStudyPlan(rawStudent, {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator
    });
    const roadmap = analysisService.generateRoadmap(rawStudent, {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator
    });

    const fullAnalysis = {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator,
      insights,
      recommendations,
      studyPlan,
      roadmap
    };

    setAnalysis(fullAnalysis);
    studentDataService.saveAnalysisResults({ student: rawStudent, ...fullAnalysis });
  }, [navigate]);

  if (!studentData || !analysis) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex items-center justify-center p-6 aurora-bg-mesh">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading your personal analysis...</span>
        </div>
      </div>
    );
  }

  const { academic, attendance, assignments, skills, indicator, insights, recommendations, studyPlan, roadmap } = analysis;

  // AI Chat submission handler
  const handleSendChat = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput.trim();
    const userMsg = { sender: 'user', text: userQuery };

    const aiRes = analysisService.processStudentChat(userQuery, studentData, analysis);
    const aiMsg = { sender: 'assistant', text: aiRes.reply };

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
    setChatInput('');
  };

  const handleQuickQuestion = (q) => {
    const userMsg = { sender: 'user', text: q };
    const aiRes = analysisService.processStudentChat(q, studentData, analysis);
    const aiMsg = { sender: 'assistant', text: aiRes.reply };
    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
  };


  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col justify-between aurora-bg-mesh selection:bg-indigo-500/20 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP BAR / MODE HEADER */}
        <div className="glass-panel rounded-[24px] p-5 border border-indigo-100 bg-white/95 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  My CampusMind Analysis
                </h1>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 bg-indigo-50 border border-indigo-200">
                  Personalized Demo Analysis
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Personal Mode
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Welcome, <strong className="text-indigo-700 font-bold">{studentData.name}</strong>. Here is your personalized analysis based strictly on the information you provided.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => navigate('/analyze')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edit My Data</span>
            </button>
            <Link
              to="/student"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Explore Demo</span>
            </Link>
          </div>
        </div>

        {/* TOP RESULT METRIC CARDS (5 Core Dimensions) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* 1. Academic Performance */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/60 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Academic Performance</span>
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {academic.hasData ? `${academic.overallPercentage}%` : 'Data Not Available'}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1 truncate">
              {academic.hasData ? `Across ${academic.subjectResults.length} subjects` : 'No marks entered'}
            </span>
          </div>

          {/* 2. Attendance */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/60 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Attendance</span>
              <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {attendance.hasData ? `${attendance.overallAttendance}%` : 'Data Not Available'}
            </div>
            <span
              className={`text-[11px] font-semibold block mt-1 ${
                attendance.hasData
                  ? attendance.status === 'Healthy'
                    ? 'text-emerald-400'
                    : attendance.status === 'Critical'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                  : 'text-slate-500'
              }`}
            >
              {attendance.hasData ? `${attendance.status} (${attendance.belowTargetCount} below target)` : 'No records entered'}
            </span>
          </div>

          {/* 3. Assignment Completion */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/60 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Assignments</span>
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {assignments.hasData ? `${assignments.completionPercentage}%` : 'Data Not Available'}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              {assignments.hasData ? `${assignments.completed} of ${assignments.total} submitted` : 'No coursework'}
            </span>
          </div>

          {/* 4. Career Skill Readiness */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/60 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Skill Readiness</span>
              <Target className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-black font-mono text-purple-300">
              {skills.hasData ? `${skills.readinessPercentage}%` : 'Data Not Available'}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1 truncate">
              {skills.hasData ? `Target: ${studentData.careerGoal}` : 'No skills entered'}
            </span>
          </div>

          {/* 5. Academic Support Indicator */}
          <div
            className={`glass-panel p-4 rounded-2xl border relative overflow-hidden ${
              indicator.level === 'Low'
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : indicator.level === 'High'
                ? 'border-rose-500/40 bg-rose-950/10'
                : 'border-amber-500/40 bg-amber-950/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Support Indicator</span>
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div
              className={`text-xl font-black font-mono ${
                indicator.level === 'Low'
                  ? 'text-emerald-400'
                  : indicator.level === 'High'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {indicator.level}
            </div>
            <button
              onClick={() => setExplainModalOpen(true)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline block mt-1 text-left font-medium"
            >
              Why this indicator? →
            </button>
          </div>
        </div>

        {/* LARGE PERSONALIZED AI-STYLE INSIGHT CARD */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-slate-900/60 to-purple-950/20 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  CampusMind Personalized Insight
                </h3>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                &quot;{insights.summary}&quot;
              </p>
              <p className="text-xs text-slate-400">
                Generated from your actual entered metrics. No pre-set sample values were substituted.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setExplainModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-cyan-600/20"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Explain Analysis</span>
              </button>
              <button
                onClick={() => setSupportingDataModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                View Input Data
              </button>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN ANALYTICS: ACADEMICS & ATTENDANCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ACADEMIC ANALYSIS */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Academic Performance Overview</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Subject-wise percentages and average evaluation scores.
                </p>
              </div>
              {academic.hasData && (
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Avg: {academic.overallPercentage}%
                </span>
              )}
            </div>

            {academic.hasData && academic.subjectResults.length > 0 ? (
              <div className="space-y-4">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={academic.subjectResults}
                      margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        angle={-20}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#070b14',
                          borderColor: '#1e293b',
                          borderRadius: '0.75rem',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="percentage" name="Score %" radius={[6, 6, 0, 0]}>
                        {academic.subjectResults.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={
                              entry.percentage >= 75
                                ? '#10b981'
                                : entry.percentage >= 60
                                ? '#06b6d4'
                                : '#f43f5e'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-mono block">HIGHEST SCORING</span>
                    <span className="font-semibold text-white truncate block">
                      {academic.highestSubject?.name} ({academic.highestSubject?.percentage}%)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-rose-400 font-mono block">LOWEST SCORING</span>
                    <span className="font-semibold text-white truncate block">
                      {academic.lowestSubject?.name} ({academic.lowestSubject?.percentage}%)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No academic marks entered. Edit your data to see your academic chart.
              </div>
            )}
          </div>

          {/* ATTENDANCE ANALYSIS */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-blue-400" />
                  <span>Attendance Telemetry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target threshold: <strong className="text-slate-200">{attendance.threshold || 75}%</strong>
                </p>
              </div>
              {attendance.hasData && (
                <span
                  className={`text-xs font-mono font-bold ${
                    attendance.status === 'Healthy'
                      ? 'text-emerald-400'
                      : attendance.status === 'Critical'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {attendance.overallAttendance}% Overall
                </span>
              )}
            </div>

            {attendance.hasData && attendance.subjectAttendance.length > 0 ? (
              <div className="space-y-4">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={attendance.subjectAttendance}
                      margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="subjectName"
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        angle={-20}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#070b14',
                          borderColor: '#1e293b',
                          borderRadius: '0.75rem',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="percentage" name="Attendance %" radius={[6, 6, 0, 0]}>
                        {attendance.subjectAttendance.map((entry, idx) => (
                          <Cell
                            key={`att-${idx}`}
                            fill={
                              entry.percentage >= attendance.threshold
                                ? '#10b981'
                                : entry.percentage >= 60
                                ? '#f59e0b'
                                : '#f43f5e'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  {attendance.belowTargetCount > 0 ? (
                    <p className="text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        Your attendance is below the configured target in{' '}
                        <strong>{attendance.belowTargetCount}</strong> subject(s). Clearance plan recommended.
                      </span>
                    </p>
                  ) : (
                    <p className="text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>All courses meet or exceed the {attendance.threshold}% attendance threshold.</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No attendance records entered.
              </div>
            )}
          </div>
        </div>

        {/* ASSIGNMENT & COURSEWORK BREAKDOWN */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Assignment & Continuous Assessment Performance</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates coursework submission rates and outstanding deadlines.
              </p>
            </div>
            {assignments.hasData && (
              <span className="text-xs font-mono font-bold text-emerald-400">
                {assignments.completionPercentage}% Completion
              </span>
            )}
          </div>

          {assignments.hasData ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Assigned</span>
                <span className="text-2xl font-black font-mono text-white">{assignments.total}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-center">
                <span className="text-[10px] uppercase font-mono text-emerald-400 block">Completed</span>
                <span className="text-2xl font-black font-mono text-emerald-400">{assignments.completed}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-center">
                <span className="text-[10px] uppercase font-mono text-amber-400 block">Pending</span>
                <span className="text-2xl font-black font-mono text-amber-400">{assignments.pending}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30 text-center">
                <span className="text-[10px] uppercase font-mono text-rose-400 block">Overdue</span>
                <span className="text-2xl font-black font-mono text-rose-400">{assignments.overdue}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No assignment data available.
            </div>
          )}
        </div>

        {/* SKILL GAP ANALYSIS TABLE & CAREER READINESS */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-slate-950/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900">
                  Career Skill Gap Analysis ({studentData.careerGoal})
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison between your self-assessed level and benchmark industry expectations.
              </p>
            </div>
            {skills.hasData && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
                Role Readiness: <strong>{skills.readinessPercentage}%</strong>
              </span>
            )}
          </div>

          {skills.hasData ? (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white/95/40">
                <table className="w-full text-left text-xs text-slate-600 font-medium">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Competency / Skill</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Your Level</th>
                      <th className="py-2.5 px-3 text-center">Career Target</th>
                      <th className="py-2.5 px-3 text-center">Gap</th>
                      <th className="py-2.5 px-3 text-center">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 font-medium">
                    {skills.skills.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-1.5">
                          <span>{item.skill}</span>
                          {item.essential && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-50 text-cyan-300 border border-cyan-500/30">
                              Core
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{item.category}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.currentLevel}%</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">{item.targetLevel}%</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          {item.gap > 0 ? (
                            <span className="text-rose-400">-{item.gap}%</span>
                          ) : (
                            <span className="text-emerald-400">0%</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              item.gapPriority === 'High'
                                ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                                : item.gapPriority === 'Medium'
                                ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {item.gapStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Strong Skills vs Skills to Improve */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your Strong Areas</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.strongSkills.length > 0 ? (
                      skills.strongSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono"
                        >
                          {s.skill} ({s.currentLevel}%)
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Ongoing competency building</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Priority Competencies to Improve</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.skillsToImprove.length > 0 ? (
                      skills.skillsToImprove.slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[11px] font-mono"
                        >
                          {s.skill} (-{s.gap}%)
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">All competencies on track</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-mono">
                * Prototype calculation based on entered skill levels compared against standard {studentData.careerGoal} profiles.
              </p>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No skills selected. Edit your data to view your personalized skill-gap comparison.
            </div>
          )}
        </div>

        {/* PERSONALIZED RECOMMENDATIONS (What Should You Focus On?) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>What Should You Focus On?</span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized interventions targeting your lowest-scoring areas and largest skill deficits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                    {rec.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      rec.priority === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border-rose-500/30'
                        : rec.priority === 'High'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-slate-400 block mb-0.5 text-[10px] uppercase font-mono">Why this recommendation?</strong>
                  {rec.reason}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Concrete Action Plan:</span>
                  <ul className="space-y-1 text-xs text-slate-600 font-medium">
                    {rec.actionPlan.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERSONALIZED LEARNING ROADMAP */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Personalized Learning Roadmap ({studentData.careerGoal})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic 6-week curriculum generated directly from your identified skill gaps.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-cyan-300 border border-cyan-500/30">
              6 Weeks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roadmap.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-400 font-bold text-[11px]">{step.week}</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <h5 className="font-bold text-white">{step.title}</h5>
                <p className="text-slate-400 text-[11px] leading-relaxed">{step.desc}</p>
                <span className="text-[10px] text-emerald-400 font-mono block pt-1">
                  ✓ Milestone: {step.milestone}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PERSONALIZED WEEKLY STUDY PLAN */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>My Weekly Study Plan</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Allocated across your entered study time ({studentData.weeklyStudyHours || 10} hrs/week) prioritized by weak areas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {studyPlan.map((slot) => (
              <div
                key={slot.day}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1"
              >
                <span className="font-bold text-cyan-300 block text-xs">{slot.day}</span>
                <span className="text-[10px] font-mono text-slate-400 block">{slot.duration}</span>
                <p className="text-white text-[11px] font-medium leading-snug pt-1">{slot.task}</p>
                <span className="text-[9px] font-mono text-purple-300 block pt-1">{slot.focus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPUSMIND AI CHAT FOR PERSONAL ANALYSIS */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 border border-cyan-500/40 text-cyan-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">CampusMind AI Personal Assistant</h3>
                <p className="text-xs text-slate-400">
                  Ask questions about your entered marks, attendance clearance, and target skills.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Active Session
            </span>
          </div>

          {/* Quick Question Chips */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              'What is my weakest subject?',
              'What is affecting my performance?',
              'Which skill should I learn first?',
              'How can I improve my attendance?',
              'What should I study this week?',
              'Am I ready for my selected career?',
              'Explain my analysis.'
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleQuickQuestion(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="max-h-72 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-lg leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white font-medium shadow-md shadow-cyan-600/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about your personal analysis..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Need to update your marks or attendance?</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/analyze')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit My Data & Re-Analyze</span>
            </button>
          </div>
        </div>
      </div>

      {/* EXPLAINABILITY MODAL */}
      {explainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0b1222] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900">Why did CampusMind generate this result?</h3>
              </div>
              <button
                onClick={() => setExplainModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-indigo-50/40 border border-cyan-500/30 text-cyan-200 leading-relaxed">
                <span className="font-mono text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                  Demo Contribution Weights (Transparent Prototype Rules)
                </span>
                {indicator.explanation}
              </div>

              {/* Factors list */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Weighted Factor Attribution:
                </span>
                {indicator.contributions.map((c, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-white block">{c.factor}</span>
                      <span className="text-[11px] text-slate-400">{c.impact}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-cyan-400 font-bold block">{c.value}</span>
                      <span className="text-[10px] font-mono text-slate-500">Weight: {c.weight}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <p>
                  * These weights reflect transparent prototype formulas and do not claim to be black-box ML feature importances.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setExplainModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SUPPORTING DATA MODAL */}
      {supportingDataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0b1222] border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-900">Your Supporting Input Data</h3>
              <button
                onClick={() => setSupportingDataModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">Student Profile</span>
                <p className="text-slate-200">
                  {studentData.name} • {studentData.program || 'Program'} • Sem {studentData.semester} • Target: {studentData.careerGoal}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">Entered Subjects ({academic.subjectResults.length})</span>
                <div className="space-y-1">
                  {academic.subjectResults.map((s, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-800/60">
                      <span>{s.name}</span>
                      <span className="font-mono text-cyan-300">{s.obtainedMarks}/{s.maxMarks} ({s.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">Entered Attendance</span>
                <div className="space-y-1">
                  {attendance.subjectAttendance.map((a, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-800/60">
                      <span>{a.subjectName}</span>
                      <span className="font-mono text-cyan-300">{a.attendedClasses}/{a.totalClasses} ({a.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">Entered Skills ({skills.skills.length})</span>
                <div className="flex flex-wrap gap-1">
                  {studentData.skills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">
                      {sk.name}: {sk.level}%
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSupportingDataModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
