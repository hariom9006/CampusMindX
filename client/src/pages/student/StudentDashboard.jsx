import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CalendarCheck,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Bot,
  Database,
  X,
  CheckCircle2,
  ExternalLink,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AIInsightCard from '../../components/AIInsightCard';
import RiskBadge from '../../components/RiskBadge';
import ProgressBar from '../../components/ProgressBar';
import ExplainabilityModal from '../../components/ExplainabilityModal';
import RecommendationCard from '../../components/RecommendationCard';

import { currentStudent } from '../../data/students';
import { studentAcademicData } from '../../data/academicData';
import { studentAttendanceData } from '../../data/attendanceData';
import { studentRecommendations } from '../../data/recommendations';
import { apiService } from '../../services/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [completedActions, setCompletedActions] = useState(new Set());
  const [student, setStudent] = useState(currentStudent);
  const [attendanceItems, setAttendanceItems] = useState(studentAttendanceData.subjectWiseAttendance);
  const [academicSubjects, setAcademicSubjects] = useState(studentAcademicData.currentSubjects);
  const [recommendations, setRecommendations] = useState(studentRecommendations);
  const [_loading, setLoading] = useState(true);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [perfPrediction, setPerfPrediction] = useState(null);
  const [skillGap, setSkillGap] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveDashboard() {
      try {
        setLoading(true);
        const [bundle, _health, liveRisk, livePerf, liveRecs, liveSkillGap] = await Promise.all([
          apiService.getStudentDashboardBundle('22BCA1042'),
          apiService.getHealth(),
          apiService.predictRisk({ studentId: '22BCA1042' }),
          apiService.predictPerformance({ studentId: '22BCA1042' }),
          apiService.getRecommendations('22BCA1042'),
          apiService.analyzeSkillGap({ studentId: '22BCA1042', careerTarget: 'Full Stack Developer' })
        ]);

        if (isMounted) {
          if (liveRisk) setRiskPrediction(liveRisk);
          if (livePerf) setPerfPrediction(livePerf);
          if (liveSkillGap) setSkillGap(liveSkillGap);
          if (liveRecs && liveRecs.length > 0) setRecommendations(liveRecs);

          if (bundle && bundle.student) {
            setStudent({
              ...bundle.student,
              rollNo: bundle.student.enrollmentNumber || bundle.student.rollNo,
              advisor: bundle.student.advisorName || bundle.student.advisor,
              // If model predicted risk, reflect it
              riskLevel: liveRisk?.risk_level || bundle.student.riskLevel,
              academicSupportIndicator: liveRisk?.risk_level || bundle.student.academicSupportIndicator,
              predictedSemesterCgpa: livePerf?.predicted_gpa || bundle.student.predictedSemesterCgpa
            });

            if (bundle.attendance && bundle.attendance.length > 0) {
              setAttendanceItems(
                bundle.attendance.map((att) => ({
                  subject: att.subjectName || att.subject?.name,
                  code: att.subjectCode || att.subject?.code,
                  attended: att.attendedClasses,
                  total: att.totalClasses,
                  percentage: att.percentage,
                  status: att.status
                }))
              );
            }

            if (bundle.marks && bundle.marks.length > 0) {
              setAcademicSubjects(
                bundle.marks.map((m) => ({
                  code: m.subjectCode || m.subject?.code,
                  name: m.subjectName || m.subject?.name,
                  score: m.totalMarks,
                  grade: m.grade,
                  status: m.status,
                  internalScore: m.internalMarks
                }))
              );
            }
            setIsLiveDb(true);
          } else {
            setIsLiveDb(false);
          }
        }
      } catch (err) {
        console.error('Error fetching student dashboard from API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLiveDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler: Open action modal when recommendation button is clicked
  const handleRecommendationAction = (rec) => {
    setSelectedAction(rec);
    setActionModalOpen(true);
  };

  // Handler: Navigate from action modal to relevant section
  const getActionNavTarget = (rec) => {
    const title = (rec?.title || '').toLowerCase();
    const category = (rec?.category || '').toLowerCase();
    const linkText = (rec?.linkText || '').toLowerCase();
    if (linkText.includes('attendance') || category.includes('attendance') || title.includes('attendance') || title.includes('recovery sprint'))
      return { path: '/student/attendance', label: 'Go to Attendance Tracker' };
    if (linkText.includes('skill') || category.includes('skill') || linkText.includes('learning module') || title.includes('skill'))
      return { path: '/student/skills', label: 'Open Skills & Learning Modules' };
    if (category.includes('career') || title.includes('capstone') || title.includes('portfolio'))
      return { path: '/student/roadmap', label: 'View Career Roadmap' };
    if (category.includes('academic') || title.includes('clinic') || title.includes('remedial'))
      return { path: '/student/performance', label: 'View Academic Performance' };
    return { path: '/student/assistant', label: 'Ask AI Assistant for Help' };
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Student Welcome Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Welcome back, {student.name}
              </h1>
              <RiskBadge level={student.riskLevel} size="md" />
              {isLiveDb && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>MongoDB Live</span>
                </span>
              )}
              {riskPrediction?.status === 'model' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Model Prediction</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
                  <span>Demo Data</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {student.program} • Semester {student.semester} • Roll: <span className="font-mono text-cyan-300">{student.rollNo}</span>
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
              <span className="text-[11px] font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Career Goal: <strong className="text-cyan-400">{student.careerGoal}</strong>
              </span>
              <span>• Advisor: {student.advisor || student.advisorName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setExplainModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Why Am I {student.riskLevel} Risk?</span>
          </button>
          <Link
            to="/student/assistant"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white glass-panel hover:bg-slate-800 transition-colors flex items-center gap-2 border border-slate-700"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* Required Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Overall Performance */}
        <StatCard
          title="Overall Performance"
          value={student.overallPerformance}
          unit="%"
          glowColor="cyan"
          trend={{
            direction: 'neutral',
            label: perfPrediction?.predicted_gpa
              ? `Predicted CGPA: ${perfPrediction.predicted_gpa} [${perfPrediction.prediction_range?.lower_bound}-${perfPrediction.prediction_range?.upper_bound}]`
              : `Predicted CGPA: ${student.predictedSemesterCgpa || '7.2'}`
          }}
          badge={
            perfPrediction?.status === 'model' ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                Model Prediction
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Demo Data
              </span>
            )
          }
          icon={GraduationCap}
          onExplain={() => setExplainModalOpen(true)}
        />

        {/* 2. Attendance */}
        <StatCard
          title="Class Attendance"
          value={student.attendance}
          unit="%"
          glowColor="amber"
          trend={{ direction: 'down', label: 'Threshold: 75% required' }}
          icon={CalendarCheck}
          badge={
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
              Shortage: {student.attendance - 75}%
            </span>
          }
          onExplain={() => setExplainModalOpen(true)}
        />

        {/* 3. Assignment Completion */}
        <StatCard
          title="Assignment Completion"
          value={student.assignmentCompletion}
          unit="%"
          glowColor="blue"
          trend={{ direction: 'down', label: 'Overdue coursework pending' }}
          icon={CheckCircle}
          subtitle="13 of 21 submitted"
          onExplain={() => setExplainModalOpen(true)}
        />

        {/* 4. Academic Support Indicator */}
        <StatCard
          title="Support Indicator"
          value={student.academicSupportIndicator}
          glowColor="purple"
          trend={{
            direction: student.riskLevel === 'High' ? 'down' : (student.riskLevel === 'Medium' ? 'neutral' : 'up'),
            label: riskPrediction?.status === 'model' ? `Model Confidence: ${(riskPrediction.confidence * 100).toFixed(1)}%` : 'Proactive intervention'
          }}
          icon={AlertTriangle}
          badge={
            <div className="flex items-center gap-1">
              <RiskBadge level={student.riskLevel} size="sm" showIcon={false} />
              {riskPrediction?.status === 'model' ? (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Model
                </span>
              ) : (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Demo
                </span>
              )}
            </div>
          }
          onExplain={() => setExplainModalOpen(true)}
        />
      </div>

      {/* AI Key Advisory Insight Card */}
      <AIInsightCard
        title="Predictive Risk Attribution: Attendance Deficit & Core Assessment"
        description={
          riskPrediction?.category_meaning ||
          "Empirical feature attribution isolated class attendance (68%) and assignment completion (62%) as primary drivers. Historical GPA foundation acts as the strongest positive factor."
        }
        rationale={
          riskPrediction?.feature_contributions
            ? riskPrediction.feature_contributions.slice(0, 3).map((f) => `${f.label}: ${f.impact}`).join(' | ')
            : "Attendance impact: -14.2% | Assignment impact: -9.1% | Prior GPA baseline: +11.8%."
        }
        impact="Actionable Decision Support"
        type="warning"
        actionText="View Recovery Recommendations"
        onExplain={() => setExplainModalOpen(true)}
        onAction={() => {
          const el = document.getElementById('recommendations-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Recharts Performance Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Progression vs Batch Average */}
        <ChartCard
          title="Academic Performance Progression"
          subtitle="Semester-by-semester GPA compared with BCA cohort batch average"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={studentAcademicData.semesterHistory} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="batchGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="semester" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[5, 10]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="gpa"
                name="Aarav Sharma GPA"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#gpaGradient)"
              />
              <Area
                type="monotone"
                dataKey="batchAvg"
                name="Batch Average"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#batchGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Current Semester Subject Breakdown */}
        <ChartCard
          title="Current Semester Subject Scores"
          subtitle="Continuous assessment scores across enrolled courses (MongoDB Synchronized)"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={academicSubjects}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="code" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val, name, item) => [`${val}% (${item.payload.name})`, 'Score']}
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {academicSubjects.map((entry, index) => {
                  let fillColor = '#06b6d4';
                  if (entry.score < 60) fillColor = '#ef4444';
                  else if (entry.score < 75) fillColor = '#f59e0b';
                  else if (entry.score >= 80) fillColor = '#10b981';
                  return (
                    <cell key={`cell-${index}`} fill={fillColor} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Attendance & Subject Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Breakdown Bar */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Course Attendance Clearance Status</h3>
              <p className="text-xs text-slate-400">Target: Minimum 75% for end-semester examination hall ticket</p>
            </div>
            <Link
              to="/student/attendance"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Detailed Attendance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {attendanceItems.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{item.subject}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.code})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{item.attended}/{item.total} sessions</span>
                    <span
                      className={`font-mono font-bold ${
                        item.percentage < 75 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={item.percentage}
                  max={100}
                  threshold={75}
                  color={item.percentage < 65 ? 'rose' : item.percentage < 75 ? 'amber' : 'emerald'}
                  showValue={false}
                  height="h-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Goal & Roadmap Widget */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-purple-400">Career Goal Alignment</span>
              <span className="text-[10px] font-mono bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                {skillGap?.readinessPercentage || 64}% Readiness
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mt-2">{student.careerGoal || 'Full Stack Developer'}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {skillGap?.summary
                ? `Assessed against ${skillGap.summary.totalSkills} role competencies. Isolated ${skillGap.summary.highPriorityGaps} high-priority developmental gaps requiring targeted interventions.`
                : 'Target role for BCA campus placements. High proficiency in React & Database design, with developmental priorities in Node.js & System Design.'}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Role Readiness</span>
                <span className="font-mono text-cyan-400 font-bold">{skillGap?.readinessPercentage || 64}%</span>
              </div>
              <ProgressBar value={skillGap?.readinessPercentage || 64} max={100} color="cyan" showValue={false} height="h-2" />
              <span className="text-[10px] text-slate-400 block pt-1">
                {skillGap?.skills?.[0]
                  ? `Priority Focus: ${skillGap.skills[0].skill} (${skillGap.skills[0].gap}% deficit)`
                  : 'Next Milestone: Complete Graph Algorithms sprint'}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
            <Link
              to="/student/skills"
              className="w-full py-2 rounded-xl text-xs font-semibold text-center text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Skill Gap Radar</span>
            </Link>
            <Link
              to="/student/roadmap"
              className="w-full py-2 rounded-xl text-xs font-semibold text-center text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 transition-colors border border-cyan-500/30 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open Personalized Roadmap</span>
            </Link>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div id="recommendations-section" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Targeted AI Recommendations & Interventions</h2>
            <p className="text-xs text-slate-400">
              Personalized action steps generated from explainable risk factor attribution.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            {recommendations.length} Actions Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <RecommendationCard
                key={rec._id || rec.id || i}
                recommendation={rec}
                onAction={handleRecommendationAction}
                isCompleted={completedActions.has(rec._id || rec.id)}
              />
            ))
          ) : (
            <div className="col-span-full glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-200">No Urgent Interventions Required</p>
              <p className="text-xs">All academic metrics and coursework meet or exceed target benchmarks.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reusable Explainability Modal */}
      <ExplainabilityModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        studentName={student.name}
        rollNo={student.rollNo}
        riskLevel={student.riskLevel}
        overallScore={`${student.overallPerformance}%`}
        factors={student.explainabilityFactors}
        predictionData={riskPrediction}
        isModel={riskPrediction?.status === 'model'}
      />

      {/* Recommendation Action Modal */}
      {actionModalOpen && selectedAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActionModalOpen(false)}>
          <div
            className="max-w-lg w-full rounded-3xl bg-[#090d1a] border border-cyan-500/40 shadow-2xl overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40">
                  CampusMind AI Intervention
                </span>
                <h3 className="text-lg font-bold text-white mt-2 leading-snug">
                  {selectedAction.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {selectedAction.courseCode && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {selectedAction.courseCode}
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    selectedAction.urgencyColor === 'red'
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                      : selectedAction.urgencyColor === 'amber'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {selectedAction.urgency} Priority
                  </span>
                  {selectedAction.impactRating && (
                    <span className="text-[10px] text-emerald-300 flex items-center gap-1 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Zap className="w-3 h-3" />
                      {selectedAction.impactRating}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setActionModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors mt-1 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Why am I seeing this */}
            {selectedAction.rationale && (
              <div className="px-6 pt-4">
                <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-cyan-300 block mb-0.5">Why this recommendation?</span>
                  {selectedAction.rationale.replace(/^Why am I seeing this recommendation\?\s*/i, '')}
                </div>
              </div>
            )}

            {/* Step-by-Step Action Plan */}
            {selectedAction.actionPlan && selectedAction.actionPlan.length > 0 && (
              <div className="px-6 pt-4">
                <span className="text-xs font-semibold text-white block mb-2">Your Action Plan:</span>
                <div className="space-y-2">
                  {selectedAction.actionPlan.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-6 pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const target = getActionNavTarget(selectedAction);
                  setCompletedActions(prev => new Set([...prev, selectedAction._id || selectedAction.id]));
                  setActionModalOpen(false);
                  navigate(target.path);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{getActionNavTarget(selectedAction).label}</span>
              </button>
              <button
                onClick={() => {
                  setCompletedActions(prev => new Set([...prev, selectedAction._id || selectedAction.id]));
                  setActionModalOpen(false);
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Acknowledged</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
