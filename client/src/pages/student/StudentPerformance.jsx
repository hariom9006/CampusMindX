import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  BrainCircuit,
  Database
} from 'lucide-react';

import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import ProgressBar from '../../components/ProgressBar';
import ExplainabilityModal from '../../components/ExplainabilityModal';
import RecommendationCard from '../../components/RecommendationCard';

import { currentStudent } from '../../data/students';
import { studentAcademicData } from '../../data/academicData';
import { apiService } from '../../services/api';

export default function StudentPerformance() {
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [student, setStudent] = useState(currentStudent);
  const [subjects, setSubjects] = useState(studentAcademicData.currentSubjects);
  const [assignments, setAssignments] = useState(studentAcademicData.assignmentStatus.recentSubmissions);
  const [perfPrediction, setPerfPrediction] = useState(null);
  const [academicRecs, setAcademicRecs] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPerformanceData() {
      try {
        setLoading(true);
        const [studentData, marksData, assignmentData, livePerf, recsData] = await Promise.all([
          apiService.getCurrentStudent('22BCA1042'),
          apiService.getMarksRecords('22BCA1042'),
          apiService.getAssignments('22BCA1042'),
          apiService.predictPerformance({ studentId: '22BCA1042' }),
          apiService.getRecommendations('22BCA1042')
        ]);

        if (isMounted) {
          if (livePerf) setPerfPrediction(livePerf);
          if (recsData && recsData.length > 0) {
            setAcademicRecs(recsData.filter((r) => r.category === 'Academic' || r.category === 'Assignment'));
          }

          if (studentData) {
            setStudent({
              ...studentData,
              rollNo: studentData.enrollmentNumber || studentData.rollNo,
              predictedSemesterCgpa: livePerf?.predicted_gpa || studentData.predictedSemesterCgpa
            });
          }

          if (marksData && marksData.length > 0) {
            setSubjects(
              marksData.map((m) => ({
                code: m.subjectCode || m.subject?.code || m.code,
                name: m.subjectName || m.subject?.name || m.name,
                credits: m.subject?.credits || m.credits || 4,
                instructor: m.subject?.instructorName || m.instructor || 'Faculty Lead',
                internalScore: m.internalMarks,
                assignmentScore: m.assignmentScore || 85,
                score: m.totalMarks || m.score,
                grade: m.grade || 'B',
                status: m.status || 'Satisfactory'
              }))
            );
            setIsLive(true);
          }

          if (assignmentData && assignmentData.length > 0) {
            setAssignments(
              assignmentData.map((a, i) => ({
                id: a._id || a.id || `ASN-${i}`,
                title: a.title,
                subject: a.subjectName || a.subject?.name || 'Computing',
                dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'Upcoming',
                status: a.status,
                score: a.score
              }))
            );
          }
        }
      } catch (err) {
        console.error('Error fetching academic performance:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPerformanceData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Academic Performance Analytics</h1>
            {isLive && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>MongoDB Sync</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predictive grade telemetry, continuous internal evaluation tracking, and assignment velocity.
          </p>
        </div>
        <button
          onClick={() => setExplainModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Explain CGPA Projection</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Cumulative GPA"
          value={student.currentCgpa}
          unit="/ 10.0"
          glowColor="cyan"
          trend={{ direction: 'up', label: 'Credits: 84 / 120' }}
          icon={GraduationCap}
        />
        <StatCard
          title="Predicted Sem 5 CGPA"
          value={perfPrediction?.predicted_gpa || student.predictedSemesterCgpa || 5.55}
          unit="/ 10.0"
          glowColor="purple"
          trend={{
            direction: 'neutral',
            label: perfPrediction?.prediction_range
              ? `95% Range: [${perfPrediction.prediction_range.lower_bound} - ${perfPrediction.prediction_range.upper_bound}]`
              : 'Statistical Ridge Estimate'
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
          icon={Sparkles}
          onExplain={() => setExplainModalOpen(true)}
        />
        <StatCard
          title="Overall Course Mark"
          value={student.overallPerformance}
          unit="%"
          glowColor="blue"
          trend={{ direction: 'neutral', label: 'Class Rank: 48 / 120' }}
          icon={TrendingUp}
        />
        <StatCard
          title="Assignment Velocity"
          value={student.assignmentCompletion}
          unit="%"
          glowColor="amber"
          trend={{ direction: 'down', label: '1 overdue in DSA II' }}
          icon={FileText}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester GPA History Chart */}
        <ChartCard
          title="GPA Trajectory & Cohort Comparison"
          subtitle="Aarav Sharma vs Department of Computing semester average"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={studentAcademicData.semesterHistory} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="semester" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[5.0, 10.0]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="gpa"
                name="Aarav GPA"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 5, fill: '#06b6d4' }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="batchAvg"
                name="Cohort Average"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Continuous Assessment Component Scores */}
        <ChartCard
          title="Internal Assessment vs Aggregate Performance"
          subtitle="Evaluation component breakdown across Sem 5 courses (MongoDB Live)"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjects} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="code" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="score" name="Overall Aggregate %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="internalScore" name="Internal Marks (out of 30)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Enrolled Courses Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-5">
        <h3 className="text-base font-bold text-white mb-1">Enrolled Subjects Diagnostic Breakdown</h3>
        <p className="text-xs text-slate-400 mb-4">
          Detailed metrics showing continuous internal assessments (CIA) and predicted grades from MongoDB.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b1222] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Credits</th>
                <th className="py-3 px-3">Faculty</th>
                <th className="py-3 px-3">Internal Mark</th>
                <th className="py-3 px-3">Aggregate %</th>
                <th className="py-3 px-3">Predicted Grade</th>
                <th className="py-3 px-3">Diagnostic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white block">{sub.name}</span>
                    <span className="text-[11px] font-mono text-cyan-400">{sub.code}</span>
                  </td>
                  <td className="py-3.5 px-3">{sub.credits}</td>
                  <td className="py-3.5 px-3 text-slate-400">{sub.instructor}</td>
                  <td className="py-3.5 px-3 font-mono">
                    {sub.internalScore} <span className="text-slate-500">/ 30</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono">{sub.score}%</span>
                      <div className="w-16">
                        <ProgressBar
                          value={sub.score}
                          max={100}
                          color={sub.score < 60 ? 'rose' : sub.score < 75 ? 'amber' : 'emerald'}
                          showValue={false}
                          height="h-1.5"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-900 border border-slate-700 text-cyan-300">
                      Grade {sub.grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        sub.status === 'Strong'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : sub.status === 'At Risk'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Tracker Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Assignment Completion & Submission Log</h3>
            <p className="text-xs text-slate-400">Current status: 62% on-time completion (MongoDB Collection: assignments)</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
            {assignments.filter((a) => a.status === 'Overdue').length} Overdue
          </span>
        </div>

        <div className="space-y-2.5">
          {assignments.map((asn) => (
            <div
              key={asn.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                asn.status === 'Overdue'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : asn.status === 'Late Submission'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    asn.status === 'Overdue'
                      ? 'bg-rose-900/50 text-rose-400'
                      : asn.status === 'Late Submission'
                      ? 'bg-amber-900/50 text-amber-400'
                      : 'bg-emerald-900/50 text-emerald-400'
                  }`}
                >
                  {asn.status === 'Overdue' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : asn.status === 'Late Submission' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{asn.title}</h4>
                  <p className="text-[11px] text-slate-400">{asn.subject} • Due: {asn.dueDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-mono font-bold text-slate-200">
                  Score: {asn.score}
                </span>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                    asn.status === 'Overdue'
                      ? 'bg-rose-900/40 text-rose-300 border-rose-500/40'
                      : asn.status === 'Late Submission'
                      ? 'bg-amber-900/40 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {asn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic & Coursework Recommendations (Phase 4) */}
      {academicRecs.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Targeted Academic Interventions</span>
              </h2>
              <p className="text-xs text-slate-400">
                Derived from continuous assessment gaps and model grade projection bottlenecks.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              {academicRecs.length} Active Steps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academicRecs.map((rec, i) => (
              <RecommendationCard key={rec._id || rec.id || i} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Explainability Modal for Continuous Performance Prediction */}
      <ExplainabilityModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        title="Predicted Semester CGPA & Linear Attribution"
        studentName={student.name}
        rollNo={student.rollNo}
        riskLevel={student.riskLevel}
        overallScore={`${student.overallPerformance}%`}
        factors={student.explainabilityFactors}
        predictionData={perfPrediction}
        target="performance"
        isModel={perfPrediction?.status === 'model'}
      />
    </div>
  );
}
