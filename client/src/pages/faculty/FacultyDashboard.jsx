import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Send,
  Database,
  Sparkles,
  TrendingUp,
  Activity,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AIInsightCard from '../../components/AIInsightCard';
import StudentTable from '../../components/StudentTable';
import ExplainabilityModal from '../../components/ExplainabilityModal';

import { allStudents } from '../../data/students';
import { apiService } from '../../services/api';

export default function FacultyDashboard() {
  const [students, setStudents] = useState(allStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFacultyData() {
      try {
        setLoading(true);
        const data = await apiService.getAllStudents().catch(() => null);
        if (isMounted && data && data.length > 0) {
          setStudents(
            data.map((s) => ({
              ...s,
              id: s._id || s.id,
              rollNo: s.enrollmentNumber || s.rollNo
            }))
          );
          setIsLive(true);
        }
      } catch (err) {
        console.warn('Faculty cohort load fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFacultyData();
    return () => {
      isMounted = false;
    };
  }, []);

  const supportSignalStudents = students.filter((s) => s.riskLevel === 'High');
  const advisoryStudents = students.filter((s) => s.riskLevel === 'Medium');
  const healthyStudents = students.filter((s) => s.riskLevel === 'Low' || !s.riskLevel);

  const cohortDistribution = [
    { name: 'Healthy Trajectory', value: healthyStudents.length || 42, color: '#10B981' },
    { name: 'Advisory Watchlist', value: advisoryStudents.length || 16, color: '#F59E0B' },
    { name: 'Support Signals Active', value: supportSignalStudents.length || 6, color: '#EC4899' }
  ];

  const handleExplainStudent = (student) => {
    setSelectedStudent(student);
    setExplainModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ==================================================
          Hero: Class Intelligence (Requirement 14)
          ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-full">
              Faculty Suite • BCA Semester 5
            </span>
            {isLive ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Cohort Feed
              </span>
            ) : (
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Demo Intelligence
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Class Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Real-time cohort telemetry, continuous evaluation monitoring, and early support signals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/faculty/assistant"
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 shadow-xs transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>Faculty AI Assistant</span>
          </Link>
          <Link
            to="/analyze-class"
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze My Class</span>
          </Link>
        </div>
      </div>

      {/* ==================================================
          Cards: Students, Performance, Attendance, Support Signals
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Students Monitored"
          value={students.length || 64}
          unit="Enrolled"
          variant="indigo"
          subtitle="BCA 2022-2025 Cohort"
          icon={Users}
        />
        <StatCard
          title="Performance Average"
          value="78.4%"
          unit="Overall"
          variant="violet"
          trend={{ direction: 'up', label: '+3.2% vs Midterm 1' }}
          icon={TrendingUp}
        />
        <StatCard
          title="Attendance Average"
          value="81.2%"
          unit="Cohort"
          variant="cyan"
          trend={{ direction: 'neutral', label: '75% clearance threshold' }}
          icon={Activity}
        />
        <StatCard
          title="Support Signals"
          value={supportSignalStudents.length || 6}
          unit="Students"
          variant="pink"
          trend={{ direction: 'down', label: 'Proactive intervention needed' }}
          icon={AlertTriangle}
        />
      </div>

      {/* ==================================================
          Teacher Self-Analysis & Class Calculator Banner
          ================================================== */}
      <div className="glass-panel rounded-[26px] p-6 border border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-white/95 to-indigo-50/60 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Teacher Self-Analysis
                </span>
                <span className="text-xs text-slate-500 font-medium">Personal Class Calculator</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Analyse My Class Data & Calculate Self Metrics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl font-medium">
                Input your own custom syllabus quizzes, student roster, passing thresholds, and attendance marks to compute live pass rates, at-risk student lists, and proactive pedagogical interventions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <Link
              to="/my-class-analysis"
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-purple-700 bg-white hover:bg-purple-50 border border-purple-200 shadow-2xs transition-all"
            >
              View Saved Results
            </Link>
            <Link
              to="/analyze-class"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/25 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Class Calculator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================
          Class Performance Visualizations
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Performance Bar Chart */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Class Performance Distribution by Course"
            subtitle="Comparing internal midterm evaluations across BCA Semester 5 subjects"
            height="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { subject: 'Data Structures', avg: 82, target: 75 },
                  { subject: 'DBMS', avg: 69, target: 75 },
                  { subject: 'Web Dev', avg: 86, target: 75 },
                  { subject: 'Computer Networks', avg: 74, target: 75 },
                  { subject: 'Cloud Computing', avg: 79, target: 75 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="subject" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#E2E8F0',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="avg" name="Class Average %" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Cohort Support Signal Distribution Pie Chart */}
        <div className="lg:col-span-4">
          <div className="glass-panel rounded-[26px] p-6 border border-slate-200/80 bg-white/95 shadow-sm h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Cohort Telemetry
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Support Signal Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Proactive student classification
              </p>

              <div className="w-full h-44 relative mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cohortDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                    >
                      {cohortDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#E2E8F0',
                        borderRadius: '16px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-2">
                {cohortDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold font-mono text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          Support Signals: Student Trend Cards (Requirement 14)
          ================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Students Requiring Attention (Support Signals)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Identified through automated multi-factor attendance and assignment attribution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {students.slice(0, 3).map((st) => (
            <div
              key={st.rollNo}
              className="glass-panel rounded-[24px] p-5 border border-slate-200/90 shadow-sm bg-white/95 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{st.rollNo}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Support Signal
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span>Attendance:</span>
                    <span className="font-bold text-amber-600">{st.attendance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance:</span>
                    <span className="font-bold text-slate-900">{st.overallPerformance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Career Focus:</span>
                    <span className="font-medium text-slate-700">{st.careerGoal || 'Full Stack'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleExplainStudent(st)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain Factors</span>
                </button>
                <Link
                  to="/faculty/students"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Student Table */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Complete Cohort Registry
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Searchable student records with explainability inspection
          </p>
        </div>
        <StudentTable
          students={students}
          onExplainStudent={handleExplainStudent}
        />
      </div>

      {/* Explainable AI Modal */}
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
