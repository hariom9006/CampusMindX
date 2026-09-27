import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Layers, TrendingUp, Award, CheckCircle2, Database } from 'lucide-react';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AIInsightCard from '../../components/AIInsightCard';
import { studentAcademicData } from '../../data/academicData';
import { apiService } from '../../services/api';

export default function AdminAnalytics() {
  const [dept, setDept] = useState(studentAcademicData.departmentOverview);
  const [stats, setStats] = useState({
    totalStudents: 420,
    averageAttendance: 74.5,
    averagePerformance: 72.8,
    passPercentage: 86.4
  });
  const [isLive, setIsLive] = useState(false);

  const naacCriteriaScores = [
    { criterion: 'Curricular Aspects', score: 3.65, max: 4.0 },
    { criterion: 'Teaching-Learning & Eval', score: 3.52, max: 4.0 },
    { criterion: 'Research & Innovation', score: 3.28, max: 4.0 },
    { criterion: 'Student Support & Progression', score: 3.78, max: 4.0 },
    { criterion: 'Governance & Leadership', score: 3.60, max: 4.0 }
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadAdminAnalytics() {
      try {
        const res = await apiService.getAnalyticsOverview();
        if (isMounted && res) {
          if (res.department) setDept(res.department);
          setStats({
            totalStudents: res.totalStudents || 420,
            averageAttendance: res.averageAttendance || 74.5,
            averagePerformance: res.averagePerformance || 72.8,
            passPercentage: res.passPercentage || 86.4
          });
          setIsLive(true);
        }
      } catch (err) {
        console.error('Error loading admin analytics:', err);
      }
    }

    loadAdminAnalytics();
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
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30">
              Institutional Intelligence
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Accreditation Benchmarking
            </span>
            {isLive && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>MongoDB Active</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1.5">
            Departmental & Accreditation Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Systemic multi-department evaluation, NAAC criterion compliance, and institutional KPI projections.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Student Progression Index"
          value="3.78"
          unit="/ 4.0"
          glowColor="blue"
          trend={{ direction: 'up', label: 'Highest institutional pillar' }}
          icon={Award}
        />
        <StatCard
          title="On-Time Graduation Rate"
          value={stats.passPercentage}
          unit="%"
          glowColor="emerald"
          trend={{ direction: 'up', label: '+2.4% vs 2025' }}
          icon={TrendingUp}
        />
        <StatCard
          title="Monitored Students"
          value={stats.totalStudents}
          unit="enrolled"
          glowColor="cyan"
          subtitle="Real-time Mongoose Tracking"
          icon={CheckCircle2}
        />
        <StatCard
          title="Average Attendance Rate"
          value={stats.averageAttendance}
          unit="%"
          glowColor="purple"
          subtitle="Institutional mean compliance"
          icon={Layers}
        />
      </div>

      {/* Charts: NAAC Criteria & GPA Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NAAC Pillars */}
        <ChartCard
          title="NAAC Accreditation Pillar Scores"
          subtitle="Current evaluated score per institutional criterion (out of 4.0)"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={naacCriteriaScores}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" domain={[0, 4.0]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis dataKey="criterion" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="score" name="Criterion Score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* GPA Stratification */}
        <ChartCard
          title="Undergraduate Performance Distribution"
          subtitle="Distribution across performance bands in School of Computing"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dept.semesterPerformanceDist || studentAcademicData.departmentOverview.semesterPerformanceDist} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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
