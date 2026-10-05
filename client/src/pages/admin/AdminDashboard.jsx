import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  ShieldAlert,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  FileText,
  Activity,
  Briefcase,
  AlertTriangle,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AIInsightCard from '../../components/AIInsightCard';
import RiskBadge from '../../components/RiskBadge';

export default function AdminDashboard() {
  const [selectedMetric, setSelectedMetric] = useState('health');

  const departmentComparison = [
    { name: 'Computer Science (BCA/MCA)', enrolled: 420, avgGpa: 8.28, retention: 94, attendance: 82, placement: 88, signals: 14 },
    { name: 'Artificial Intelligence & DS', enrolled: 380, avgGpa: 8.54, retention: 96, attendance: 86, placement: 92, signals: 8 },
    { name: 'Electronics & Comm (ECE)', enrolled: 310, avgGpa: 7.92, retention: 91, attendance: 78, placement: 81, signals: 19 },
    { name: 'Information Science', enrolled: 290, avgGpa: 8.16, retention: 93, attendance: 84, placement: 85, signals: 11 },
    { name: 'Mechanical & Robotics', enrolled: 240, avgGpa: 7.64, retention: 89, attendance: 76, placement: 77, signals: 22 }
  ];

  const universityAttendanceTrend = [
    { month: 'Aug', overall: 87, cs: 89, ai: 91, ece: 83 },
    { month: 'Sep', overall: 84, cs: 86, ai: 88, ece: 80 },
    { month: 'Oct', overall: 81, cs: 83, ai: 87, ece: 77 },
    { month: 'Nov', overall: 83, cs: 84, ai: 89, ece: 79 },
    { month: 'Dec', overall: 82, cs: 85, ai: 88, ece: 78 }
  ];

  // University-Level Heatmap Data (Department x Performance Dimension)
  const heatmapData = [
    { dept: 'BCA / Computing', cgpa: 82, attendance: 81, assignments: 86, placement: 88, satisfaction: 90 },
    { dept: 'AI & Data Science', cgpa: 89, attendance: 87, assignments: 92, placement: 94, satisfaction: 93 },
    { dept: 'Electronics (ECE)', cgpa: 76, attendance: 78, assignments: 79, placement: 81, satisfaction: 84 },
    { dept: 'Information Science', cgpa: 81, attendance: 84, assignments: 85, placement: 86, satisfaction: 87 },
    { dept: 'Robotics & Mech', cgpa: 74, attendance: 75, assignments: 76, placement: 77, satisfaction: 80 }
  ];

  const getHeatmapColor = (val) => {
    if (val >= 90) return 'bg-emerald-500 text-white font-bold';
    if (val >= 85) return 'bg-emerald-100 text-emerald-800 font-bold';
    if (val >= 80) return 'bg-indigo-100 text-indigo-800 font-bold';
    if (val >= 75) return 'bg-amber-100 text-amber-800 font-bold';
    return 'bg-rose-100 text-rose-800 font-bold';
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ==================================================
          Hero: University Intelligence (Requirement 15)
          ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-0.5 rounded-full">
              University Academic Directorate
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Institutional Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            University Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Macro institutional analytics, retention health, and cross-department telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/assistant"
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 shadow-xs transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-cyan-600" />
            <span>Executive AI</span>
          </Link>
          <Link
            to="/analyze-university"
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze University</span>
          </Link>
        </div>
      </div>

      {/* ==================================================
          Cards: Total Students, Academic Health, Attendance Trend, Support Signals, Placement Readiness
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value="1,640"
          unit="Enrolled"
          variant="indigo"
          subtitle="Across 5 departments"
          icon={Users}
        />
        <StatCard
          title="Academic Health"
          value="91.4%"
          unit="Index"
          variant="mint"
          trend={{ direction: 'up', label: '+2.1% YoY' }}
          icon={Award}
        />
        <StatCard
          title="Attendance Trend"
          value="82.6%"
          unit="Average"
          variant="cyan"
          trend={{ direction: 'neutral', label: 'Stable clearance' }}
          icon={Activity}
        />
        <StatCard
          title="Support Signals"
          value="74"
          unit="Active"
          variant="pink"
          trend={{ direction: 'down', label: 'Proactive alerts' }}
          icon={AlertTriangle}
        />
        <StatCard
          title="Placement Readiness"
          value="87.2%"
          unit="Ready"
          variant="violet"
          trend={{ direction: 'up', label: '+6.4% this cycle' }}
          icon={Briefcase}
        />
      </div>

      {/* ==================================================
          Institutional Self-Analysis & University Calculator Banner
          ================================================== */}
      <div className="glass-panel rounded-[26px] p-6 border border-cyan-200/90 bg-gradient-to-br from-cyan-50/70 via-white/95 to-indigo-50/60 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-100/80 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  Institutional Self-Analysis
                </span>
                <span className="text-xs text-slate-500 font-medium">University Calculator</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Analyse My University Data & Calculate Institutional Benchmarks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl font-medium">
                Enter your department rosters, student headcounts, faculty ratios, and semester targets to compute macro retention forecasts, resource health indices, and accreditation compliance projections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <Link
              to="/my-university-analysis"
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-cyan-800 bg-white hover:bg-cyan-50 border border-cyan-200 shadow-2xs transition-all"
            >
              View Saved Results
            </Link>
            <Link
              to="/analyze-university"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-md shadow-cyan-500/25 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open University Calculator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================
          Department Performance & Course Analytics
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Performance Comparison Bar Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Department Performance & Retention Benchmark"
            subtitle="Comparing student retention percentage and average GPA by faculty department"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#E2E8F0',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="retention" name="Retention Rate %" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="placement" name="Placement Readiness %" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* University Attendance Trend Line Chart */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Campus Attendance Trajectory (YoY)"
            subtitle="Monthly multi-cohort attendance telemetry"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={universityAttendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[70, 95]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#E2E8F0',
                    borderRadius: '16px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="overall" name="Campus Aggregate" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ai" name="AI & Data Science" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="ece" name="Electronics (ECE)" stroke="#EC4899" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* ==================================================
          University-Level Heatmap (Requirement 15)
          ================================================== */}
      <div className="glass-panel rounded-[26px] p-6 border border-slate-200/80 bg-white/95 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Multi-Dimensional Heatmap
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              University Health & Performance Heatmap
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Comparative cohort score across academic performance, attendance clearance, assignments, and placement readiness
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500" /> &gt;90% Optimal</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300" /> 85-89%</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-indigo-100 border border-indigo-300" /> 80-84%</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" /> 75-79%</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">Academic Department</th>
                <th className="py-3 px-4 text-center">CGPA Index</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Assignment Velocity</th>
                <th className="py-3 px-4 text-center">Placement Readiness</th>
                <th className="py-3 px-4 text-center">Student Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {heatmapData.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                    {row.dept}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block w-16 py-1.5 rounded-xl ${getHeatmapColor(row.cgpa)}`}>
                      {row.cgpa}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block w-16 py-1.5 rounded-xl ${getHeatmapColor(row.attendance)}`}>
                      {row.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block w-16 py-1.5 rounded-xl ${getHeatmapColor(row.assignments)}`}>
                      {row.assignments}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block w-16 py-1.5 rounded-xl ${getHeatmapColor(row.placement)}`}>
                      {row.placement}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block w-16 py-1.5 rounded-xl ${getHeatmapColor(row.satisfaction)}`}>
                      {row.satisfaction}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
