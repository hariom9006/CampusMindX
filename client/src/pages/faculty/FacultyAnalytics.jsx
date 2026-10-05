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
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-full">
              Department Telemetry
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Pass Rate Predictive Modeling
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Cohort Performance Analytics
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
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
          variant="indigo"
          trend={{ direction: 'up', label: '+4.1% YoY' }}
          icon={TrendingUp}
        />
        <StatCard
          title="High Bottleneck Courses"
          value="2"
          unit="Courses"
          variant="pink"
          trend={{ direction: 'down', label: 'Networks & DSA II' }}
          icon={AlertTriangle}
        />
        <StatCard
          title="Mean Cumulative GPA"
          value="7.28"
          unit="/ 10.0"
          variant="violet"
          subtitle="Department Benchmark: 7.00"
          icon={ChartIcon}
        />
        <StatCard
          title="Cohort Attendance Mean"
          value="79.4"
          unit="%"
          variant="cyan"
          trend={{ direction: 'neutral', label: 'Mandatory: 75%' }}
          icon={ShieldCheck}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Pass Rate Forecasting */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Predicted Subject Pass Rates"
            subtitle="LightGBM model inference across Sem 5 curriculum"
            height="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPassRateForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="subject" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#E2E8F0',
                    borderRadius: '16px'
                  }}
                />
                <Bar dataKey="passRate" name="Predicted Pass %" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Cohort Grade Distribution */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Grade Distribution Histogram"
            subtitle="Department of Computing continuous assessment"
            height="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { grade: 'A+ (90-100)', count: 8 },
                  { grade: 'A (80-89)', count: 24 },
                  { grade: 'B (70-79)', count: 18 },
                  { grade: 'C (60-69)', count: 10 },
                  { grade: 'F (<60)', count: 4 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="grade" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#E2E8F0',
                    borderRadius: '16px'
                  }}
                />
                <Bar dataKey="count" name="Students" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
