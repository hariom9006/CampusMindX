import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  TrendingUp,
  Target,
  BookOpen,
  Compass,
  Clock,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [student, setStudent] = useState(currentStudent);
  const [attendanceItems, setAttendanceItems] = useState(studentAttendanceData.subjectWiseAttendance);
  const [academicSubjects, setAcademicSubjects] = useState(studentAcademicData.currentSubjects);
  const [recommendations, setRecommendations] = useState(studentRecommendations);
  const [_loading, setLoading] = useState(true);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [perfPrediction, setPerfPrediction] = useState(null);
  const [skillGap, setSkillGap] = useState(null);

  // Performance Trend Data for Recharts
  const performanceTrendData = [
    { week: 'W1', overall: 74, dbms: 78, networks: 70, dsa: 76 },
    { week: 'W2', overall: 76, dbms: 75, networks: 72, dsa: 79 },
    { week: 'W3', overall: 79, dbms: 71, networks: 75, dsa: 81 },
    { week: 'W4', overall: 81, dbms: 68, networks: 77, dsa: 84 },
    { week: 'W5', overall: 84, dbms: 66, networks: 79, dsa: 86 }
  ];

  // Attendance Trend Data
  const attendanceTrendData = [
    { month: 'Aug', percentage: 88 },
    { month: 'Sep', percentage: 82 },
    { month: 'Oct', percentage: 76 },
    { month: 'Nov', percentage: 71 }
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadLiveDashboard() {
      try {
        setLoading(true);
        const [bundle, _health, liveRisk, livePerf, liveRecs, liveSkillGap] = await Promise.all([
          apiService.getStudentDashboardBundle('22BCA1042').catch(() => null),
          apiService.getHealth().catch(() => null),
          apiService.predictRisk({ studentId: '22BCA1042' }).catch(() => null),
          apiService.predictPerformance({ studentId: '22BCA1042' }).catch(() => null),
          apiService.getRecommendations('22BCA1042').catch(() => null),
          apiService.analyzeSkillGap({ studentId: '22BCA1042', careerTarget: 'Full Stack Developer' }).catch(() => null)
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
              riskLevel: liveRisk?.risk_level || bundle.student.riskLevel || 'Healthy',
              predictedSemesterCgpa: livePerf?.predicted_gpa || bundle.student.predictedSemesterCgpa || 8.4
            });
            setIsLiveDb(true);
          }
        }
      } catch (err) {
        console.warn('Dashboard live bundle error, using demo fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLiveDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const studentName = user?.name || student?.name || "Student";

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ==================================================
          Top Header: Greeting (Requirement 7)
          ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
              Student Intelligence
            </span>
            {isLiveDb ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Connected to Database
              </span>
            ) : (
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Demo Intelligence
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {studentName} 👋
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium mt-1">
            Here's what CampusMind X understands about your academic journey.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <Link
            to="/analyze"
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Analyse My Data</span>
          </Link>
          <Link
            to="/student/assistant"
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-2xs transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Ask CampusMind AI</span>
          </Link>
          <Link
            to="/student/roadmap"
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>8-Week Roadmap</span>
          </Link>
        </div>
      </div>

      {/* ==================================================
          Hero Intelligence Card (Requirement 7 & 5)
          "Your Academic Intelligence" + Circular Score (84) + Trajectory
          ================================================== */}
      <div className="glass-panel rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 lg:p-8 border border-indigo-100/90 shadow-[0_15px_40px_-10px_rgba(99,102,241,0.1)] bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/50 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-100/40 via-purple-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
          {/* Circular Score & Trajectory */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Circular Progress Ring */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#aurora-score-grad)"
                  strokeWidth="10"
                  strokeDasharray="314"
                  strokeDashoffset="50"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="aurora-score-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  84
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  / 100 Index
                </span>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1 sm:space-y-1.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full inline-block">
                Your Academic Intelligence
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Healthy trajectory
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
                Predicted CGPA is steady at <strong>8.4</strong>. DSA and Web Development exhibit strong momentum.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setExplainModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect attribution drivers →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mini Visualizations Below/Beside (Attendance, Performance, Assignments, Learning consistency) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* Attendance */}
            <div className="glass-card bg-white/95 rounded-[22px] p-4 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Attendance
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                71%
              </div>
              <p className="text-[10px] font-bold text-amber-600 mt-0.5">
                4% below target
              </p>
              <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '71%' }} />
              </div>
            </div>

            {/* Performance */}
            <div className="glass-card bg-white/95 rounded-[22px] p-4 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Performance
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                84%
              </div>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                ↑ 14% this term
              </p>
              <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            {/* Assignments */}
            <div className="glass-card bg-white/95 rounded-[22px] p-4 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Assignments
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                12 / 14
              </div>
              <p className="text-[10px] font-bold text-pink-600 mt-0.5">
                2 pending reviews
              </p>
              <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Learning Consistency */}
            <div className="glass-card bg-white/95 rounded-[22px] p-4 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Consistency
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                94%
              </div>
              <p className="text-[10px] font-bold text-indigo-600 mt-0.5">
                Active 5d streak
              </p>
              <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          Section 8: AI INSIGHT CARD (Requirement 8)
          ================================================== */}
      <AIInsightCard
        title="CampusMind AI Insight"
        description="Your academic performance has improved over the last 3 weeks, but your DBMS performance is trending below your previous average."
        whyPoints={[
          "Recent DBMS scores decreased (18.5/30 internal evaluation)",
          "2 assignments are pending in queue (Normalization & Indexing)",
          "Attendance is 71% (4% below the 75% examination clearance target)"
        ]}
        actionText="Understand Why"
        onExplain={() => setExplainModalOpen(true)}
      />

      {/* ==================================================
          Section 10: Performance Analytics (Recharts)
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Trend Area Chart */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Multi-Week Performance Trajectory"
            subtitle="Normalized continuous evaluation telemetry across BCA Semester 5 courses"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="auroraAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="dbmsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="overall"
                  name="Overall Index"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#auroraAreaGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="dbms"
                  name="DBMS Evaluation"
                  stroke="#EC4899"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#dbmsAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Subject-Wise Diagnostics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-[24px] p-6 border border-slate-200/80 bg-white/90 shadow-xs h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Subject Telemetry
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Coursework Analysis
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current semester breakdown
              </p>

              <div className="mt-5 space-y-3.5">
                {academicSubjects.slice(0, 4).map((sub, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">{sub.name}</span>
                      <span className="font-extrabold text-indigo-600 font-mono">{sub.internalMarks}/30</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${(sub.internalMarks / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/student/performance"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-between transition-colors"
              >
                <span>Full Performance Diagnostics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          Section: Priority Recommendations & Actions
          ================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Curated Academic Interventions
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ranked by impact on exam clearance and semester CGPA
            </p>
          </div>
          <Link
            to="/student/roadmap"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>View 8-Week Roadmap →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onAction={() => setExplainModalOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* Explainable AI Modal Dialog */}
      <ExplainabilityModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        studentName={studentName}
        rollNo={student?.rollNo || "22BCA1042"}
        riskLevel="Healthy trajectory"
      />
    </div>
  );
}
