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
          apiService.getCurrentStudent('22BCA1042').catch(() => null),
          apiService.getMarksRecords('22BCA1042').catch(() => null),
          apiService.getAssignments('22BCA1042').catch(() => null),
          apiService.predictPerformance({ studentId: '22BCA1042' }).catch(() => null),
          apiService.getRecommendations('22BCA1042').catch(() => null)
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
              predictedSemesterCgpa: livePerf?.predicted_gpa || studentData.predictedSemesterCgpa || 8.4
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
        console.warn('Performance diagnostics fallback:', err);
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
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
              Academic Diagnostics
            </span>
            {isLive ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Data Connected
              </span>
            ) : (
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Demo Intelligence
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Predictive GPA estimation, internal continuous evaluations, and cohort benchmarks.
          </p>
        </div>

        <button
          onClick={() => setExplainModalOpen(true)}
          className="self-start md:self-auto px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explain CGPA Projection</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cumulative CGPA"
          value={student.cgpa || 8.4}
          unit="/ 10.0"
          variant="indigo"
          trend={{ direction: 'up', label: '+0.2 from Sem 4' }}
          icon={GraduationCap}
        />
        <StatCard
          title="Predicted Sem 5 CGPA"
          value={student.predictedSemesterCgpa || 8.4}
          unit="/ 10.0"
          variant="violet"
          trend={{ direction: 'up', label: 'Confidence: 89.4%' }}
          icon={Sparkles}
          onExplain={() => setExplainModalOpen(true)}
        />
        <StatCard
          title="Continuous Marks"
          value={student.overallPerformance || 84}
          unit="%"
          variant="cyan"
          trend={{ direction: 'neutral', label: 'Class Rank: 48 / 120' }}
          icon={TrendingUp}
        />
        <StatCard
          title="Assignment Velocity"
          value={student.assignmentCompletion || 88}
          unit="%"
          variant="amber"
          trend={{ direction: 'neutral', label: '2 pending reviews' }}
          icon={FileText}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester GPA History Chart */}
        <ChartCard
          title="GPA Trajectory & Cohort Comparison"
          subtitle="Hariom vs Department of Computing semester average"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={studentAcademicData.semesterHistory} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="semester" stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <YAxis domain={[5.0, 10.0]} stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderColor: '#E2E8F0',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="gpa"
                name="Student GPA"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 5, fill: '#6366F1' }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="batchAvg"
                name="Cohort Average"
                stroke="#EC4899"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#EC4899' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Continuous Assessment Component Scores */}
        <ChartCard
          title="Internal Assessment vs Aggregate Performance"
          subtitle="Evaluation component breakdown across Sem 5 courses"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjects} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="code" stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderColor: '#E2E8F0',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="score" name="Overall Marks %" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="internalScore" name="Internal (out of 30)" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Course Evaluation Breakdown Table */}
      <div className="glass-panel rounded-[24px] border border-slate-200/80 overflow-hidden shadow-xs bg-white">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Coursework Breakdown
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Continuous assessment components and letter grades
            </p>
          </div>
        </div>

        {/* Mobile Coursework Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {subjects.map((sub, i) => (
            <div key={i} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{sub.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{sub.code} • {sub.credits} Credits</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Grade {sub.grade || 'A'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Internal (30)</span>
                  <span className="font-mono font-bold text-indigo-600 text-sm">{sub.internalScore ?? 22}/30</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Marks</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{sub.score}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Instructor: {sub.instructor}</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  On Track
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Coursework Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Faculty Advisor</th>
                <th className="py-3 px-4">Internal (30)</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Telemetry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{sub.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{sub.code}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{sub.credits}</td>
                  <td className="py-3.5 px-4 text-slate-600">{sub.instructor}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                    {sub.internalScore ?? 22}/30
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {sub.score}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {sub.grade || 'A'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      On Track
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExplainabilityModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        studentName={student.name || "Hariom"}
        rollNo={student.rollNo || "22BCA1042"}
        riskLevel="Healthy trajectory"
        target="performance"
      />
    </div>
  );
}
