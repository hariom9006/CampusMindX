import React from 'react';
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
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
import { studentAcademicData } from '../../data/academicData';

export default function AdminDashboard() {
  const dept = studentAcademicData.departmentOverview;

  const departmentComparison = [
    { name: 'Computing & IT (BCA/MCA)', enrolled: 420, avgGpa: 7.28, retention: 94, atRisk: 42 },
    { name: 'Computer Science & Eng', enrolled: 680, avgGpa: 7.54, retention: 96, atRisk: 38 },
    { name: 'Electronics & Comm', enrolled: 310, avgGpa: 7.12, retention: 91, atRisk: 35 },
    { name: 'Information Science', enrolled: 290, avgGpa: 7.36, retention: 93, atRisk: 22 }
  ];

  const yearlyAccreditationTrend = [
    { year: '2023', score: 3.22, benchmark: 3.5 },
    { year: '2024', score: 3.38, benchmark: 3.5 },
    { year: '2025', score: 3.49, benchmark: 3.5 },
    { year: '2026 (Projected)', score: 3.62, benchmark: 3.5 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-blue-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                University Academic Directorate
              </h1>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                Institutional Executive View
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Macro intelligence, multi-department telemetry, and predictive retention analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analyze-university"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Analyze My University</span>
          </Link>
          <Link
            to="/admin/analytics"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white glass-panel hover:bg-slate-800 transition-all flex items-center gap-2 border border-slate-700"
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Departments</span>
          </Link>
        </div>
      </div>

      {/* Prominent Mode Switch Callout: Analyze My University (Personal Mode) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-indigo-950/60 border border-blue-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold px-2 py-0.5 rounded-full bg-blue-950 border border-blue-500/40">
                Personal Administrator Mode
              </span>
              <span className="text-[11px] text-slate-400">Institutional Macro Intelligence</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">Analyze My University</h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Enter university or department-level data to generate personalized institutional insights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Link
            to="/analyze-university"
            className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Start University Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Institutional KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Undergrad Enrolled"
          value="1,700"
          unit="students"
          glowColor="blue"
          trend={{ direction: 'up', label: '+4.2% annual growth' }}
          icon={Users}
        />
        <StatCard
          title="Institutional Pass Rate"
          value={dept.passPercentage}
          unit="%"
          glowColor="cyan"
          trend={{ direction: 'up', label: 'NAAC A+ Benchmark: >85%' }}
          icon={Award}
        />
        <StatCard
          title="Aggregated At-Risk"
          value="137"
          unit="students"
          glowColor="rose"
          subtitle="8.0% of student population"
          icon={ShieldAlert}
        />
        <StatCard
          title="Mean Cumulative GPA"
          value="7.34"
          unit="/ 10.0"
          glowColor="purple"
          trend={{ direction: 'up', label: 'Continuous evaluation index' }}
          icon={TrendingUp}
        />
      </div>

      {/* University-Level Insight */}
      <AIInsightCard
        title="Institutional Intelligence Advisory: School of Computing & IT"
        description="While retention is strong at 94%, BCA Semester 5 shows an early concentration of attendance deficits (14% below 75% threshold) primarily linked with practical laboratory scheduling overlap."
        rationale="Automated schedule optimization and remedial clinic deployment predicted to lift pass rates by 3.8% across the department."
        impact="Policy Action Recommended"
        type="info"
        actionText="Review Academic Senate Memo"
        onAction={() => alert("Academic Senate memo preview generated.")}
      />

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Average GPA Bar Chart */}
        <ChartCard
          title="Cross-Department Performance Benchmarks"
          subtitle="Average CGPA and Student Retention across Academic Schools"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentComparison} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
              <YAxis domain={[5, 10]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="avgGpa" name="Average CGPA" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Accreditation Metric Trajectory */}
        <ChartCard
          title="NAAC / Institutional Accreditation Index"
          subtitle="Annual composite score progression against target standard (3.50+)"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={yearlyAccreditationTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[3.0, 4.0]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Accreditation Score"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#accGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Department Summary Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-5">
        <h3 className="text-base font-bold text-white mb-1">Academic Divisions Summary Matrix</h3>
        <p className="text-xs text-slate-400 mb-4">
          Core metrics tracking enrollment, retention, and student support triage across engineering & computing programs.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b1222] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">School / Department</th>
                <th className="py-3 px-3">Enrolled</th>
                <th className="py-3 px-3">Average CGPA</th>
                <th className="py-3 px-3">Retention Rate</th>
                <th className="py-3 px-3">At-Risk Count</th>
                <th className="py-3 px-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {departmentComparison.map((d, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-white">{d.name}</td>
                  <td className="py-3.5 px-3 font-mono">{d.enrolled}</td>
                  <td className="py-3.5 px-3 font-mono text-cyan-300 font-bold">{d.avgGpa}</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400">{d.retention}%</td>
                  <td className="py-3.5 px-3 font-mono text-amber-400">{d.atRisk}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      Accredited
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
