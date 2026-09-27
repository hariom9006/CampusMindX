import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { LineChart as ChartIcon, Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import ChartCard from '../../components/ChartCard';
import StatCard from '../../components/StatCard';
import AIInsightCard from '../../components/AIInsightCard';
import { studentAcademicData } from '../../data/academicData';
import { allStudents } from '../../data/students';

export default function FacultyAnalytics() {
  const students = allStudents;
  const dept = studentAcademicData.departmentOverview;

  const subjectPassRateForecast = [
    { subject: 'Full Stack Web Tech', passRate: 92, atRiskCount: 3 },
    { subject: 'Database Management', passRate: 88, atRiskCount: 5 },
    { subject: 'Software Engineering', passRate: 85, atRiskCount: 6 },
    { subject: 'Computer Networks', passRate: 72, atRiskCount: 14 },
    { subject: 'Data Structures II', passRate: 68, atRiskCount: 18 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
              Department Telemetry
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Pass Rate Predictive Modeling
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1.5">
            Cohort Performance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated pass probability distributions and course bottleneck diagnostics for BCA Semester 5.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Predicted Cohort Pass Rate"
          value="84.2"
          unit="%"
          glowColor="purple"
          trend={{ direction: 'up', label: '+3.1% after clinic' }}
          icon={TrendingUp}
        />
        <StatCard
          title="Critical Bottleneck Course"
          value="DSA II"
          unit=""
          glowColor="rose"
          subtitle="18 students flagged at risk"
          icon={AlertTriangle}
        />
        <StatCard
          title="Attendance Compliance"
          value="74.5"
          unit="%"
          glowColor="amber"
          trend={{ direction: 'neutral', label: 'Threshold: 75%' }}
          icon={ChartIcon}
        />
        <StatCard
          title="Intervention Efficacy"
          value="88"
          unit="%"
          glowColor="emerald"
          subtitle="Turnaround rate post-remedial"
          icon={ShieldCheck}
        />
      </div>

      {/* AI Key Insight */}
      <AIInsightCard
        title="Predictive Bottleneck: BCA-505 Data Structures II"
        description="Course-level gradient boosted tree analysis reveals that 18 out of 60 students in BCA Sem 5 have scored below 60% on continuous internal evaluations, creating a severe bottleneck for final semester graduation eligibility."
        rationale="Graph algorithms and algorithmic analysis sub-modules account for 74% of missed assignment points."
        impact="Intervention: Remedial Clinic Active"
        type="warning"
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Rate Forecast Bar Chart */}
        <ChartCard
          title="Course Pass Rate Forecast & At-Risk Counts"
          subtitle="Predicted final clearance percentage per course"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectPassRateForecast} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 10 }} />
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
              <Bar dataKey="passRate" name="Forecast Pass Rate %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="atRiskCount" name="At-Risk Students Count" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* GPA Stratification Curve */}
        <ChartCard
          title="Department GPA Distribution"
          subtitle="420 enrolled students across School of Computing & IT"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dept.semesterPerformanceDist} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" name="Enrolled Students" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
