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
  Sparkles
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
import { facultyInterventionPrototypes } from '../../data/recommendations';
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
        const data = await apiService.getAllStudents();
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
        console.error('Error fetching faculty cohort from API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFacultyData();
    return () => {
      isMounted = false;
    };
  }, []);

  const highRiskStudents = students.filter((s) => s.riskLevel === 'High');
  const mediumRiskStudents = students.filter((s) => s.riskLevel === 'Medium');
  const lowRiskStudents = students.filter((s) => s.riskLevel === 'Low');

  const riskDistribution = [
    { name: 'Low Risk', value: lowRiskStudents.length, color: '#10b981' },
    { name: 'Medium Risk', value: mediumRiskStudents.length, color: '#f59e0b' },
    { name: 'Critical High Risk', value: highRiskStudents.length, color: '#ef4444' }
  ];

  const [modalPrediction, setModalPrediction] = useState(null);

  const handleExplainStudent = async (student) => {
    setSelectedStudent(student);
    setModalPrediction(null);
    setExplainModalOpen(true);
    try {
      const pred = await apiService.predictRisk({
        studentId: student.rollNo || student._id,
        attendance: student.attendance,
        assignment_completion: student.assignmentCompletion
      });
      if (pred) setModalPrediction(pred);
    } catch (err) {
      console.warn('Could not fetch real prediction for student:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Faculty Header */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Dr. Sunita Kulkarni
              </h1>
              <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Cohort Advisory Console
              </span>
              {isLive && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>MongoDB Live</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Associate Professor & BCA 5th Semester Academic Lead • School of Computing & IT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analyze-class"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Analyze My Class</span>
          </Link>
          <Link
            to="/faculty/students"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white glass-panel hover:bg-slate-800 transition-all flex items-center gap-2 border border-slate-700"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Cohort Roster</span>
          </Link>
        </div>
      </div>

      {/* Prominent Mode Switch Callout: Analyze My Class (Personal Mode) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-indigo-950/60 border border-purple-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40">
                Personal Faculty Mode
              </span>
              <span className="text-[11px] text-slate-400">Evaluate Your Own Teaching Cohort</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">Analyze My Class</h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Enter your class, subject and student performance data to generate personalized academic insights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Link
            to="/analyze-class"
            className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Start Class Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Cohort KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Students"
          value={students.length}
          unit="cohort"
          glowColor="purple"
          subtitle="BCA Section A & B"
          icon={Users}
        />
        <StatCard
          title="Critical / High Risk"
          value={highRiskStudents.length}
          unit="students"
          glowColor="rose"
          trend={{ direction: 'down', label: 'Urgent intervention needed' }}
          icon={ShieldAlert}
        />
        <StatCard
          title="Medium / At Risk"
          value={mediumRiskStudents.length}
          unit="students"
          glowColor="amber"
          trend={{ direction: 'neutral', label: 'Includes Aarav Sharma (48)' }}
          icon={AlertTriangle}
        />
        <StatCard
          title="On-Track / Exemplary"
          value={lowRiskStudents.length}
          unit="students"
          glowColor="emerald"
          trend={{ direction: 'up', label: 'Average CGPA: 8.5' }}
          icon={CheckCircle2}
        />
      </div>

      {/* Faculty Key AI Action Card */}
      <AIInsightCard
        title="Immediate Interventions Recommended by Explainable Risk Pipeline"
        description="The predictive early warning model flags Rohan Das (Score 78) and Kabir Mehta (Score 84) for chronic attendance and lab deficits, while Aarav Sharma requires an assignment recovery plan for DSA II."
        rationale="Cross-validation of 3-week attendance curves indicates 94% detention probability without immediate intervention."
        impact="3 Interventions Pending"
        type="warning"
        actionText="Review Pending Interventions"
        onAction={() => {
          const el = document.getElementById('intervention-list');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Charts: Risk Distribution & Attendance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <ChartCard
          title="Cohort Academic Risk Stratification"
          subtitle="Distribution of current monitored students across risk levels (MongoDB Query)"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Student Attendance & Score Quick Overview */}
        <ChartCard
          title="Cohort Performance vs Attendance Diagnostic"
          subtitle="Student-by-student overview of performance % and attendance %"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={students} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="overallPerformance" name="Performance %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" name="Attendance %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pending Interventions Queue */}
      <div id="intervention-list" className="glass-panel rounded-2xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Automated Intervention Workflow Queue</h3>
            <p className="text-xs text-slate-400">
              High-priority academic actions synthesized from feature importance attribution.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-500/30">
            MongoDB Synchronized
          </span>
        </div>

        <div className="space-y-3">
          {facultyInterventionPrototypes.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{item.studentName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    ID: {item.studentId}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30">
                    {item.riskCategory}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1.5">
                  <strong className="text-cyan-400">Trigger:</strong> {item.primaryTrigger}
                </p>
                <p className="text-xs text-purple-300 mt-0.5">
                  <strong>Recommended Action:</strong> {item.suggestedAction}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => alert(`Intervention triggered for ${item.studentName}`)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Action</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Monitoring Table Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white">Cohort Live Telemetry</h3>
            <p className="text-xs text-slate-400">Click any student to inspect empirical feature contribution breakdown</p>
          </div>
          <Link
            to="/faculty/students"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Open Dedicated Monitoring View</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StudentTable
          students={students}
          onExplainStudent={handleExplainStudent}
          onSelectStudent={handleExplainStudent}
        />
      </div>

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
          predictionData={modalPrediction}
          isModel={modalPrediction?.status === 'model'}
        />
      )}
    </div>
  );
}
