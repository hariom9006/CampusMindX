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
    totalStudents: 1640,
    averageAttendance: 82.5,
    averagePerformance: 81.8,
    passPercentage: 91.4
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
        const res = await apiService.getAnalyticsOverview().catch(() => null);
        if (isMounted && res) {
          if (res.department) setDept(res.department);
          setStats({
            totalStudents: res.totalStudents || 1640,
            averageAttendance: res.averageAttendance || 82.5,
            averagePerformance: res.averagePerformance || 81.8,
            passPercentage: res.passPercentage || 91.4
          });
          setIsLive(true);
        }
      } catch (err) {
        console.warn('Analytics overview fallback:', err);
      }
    }

    loadAdminAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-0.5 rounded-full">
              Institutional Accreditation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Department Analytics
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            NAAC criteria metrics, campus-wide learning velocity, and institutional pass rate forecasts.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Campus Enrollment"
          value={stats.totalStudents}
          unit="Enrolled"
          variant="indigo"
          subtitle="All academic faculties"
          icon={Layers}
        />
        <StatCard
          title="Overall Attendance"
          value={stats.averageAttendance}
          unit="%"
          variant="cyan"
          trend={{ direction: 'neutral', label: 'Threshold: 75%' }}
          icon={CheckCircle2}
        />
        <StatCard
          title="Passing Forecast"
          value={stats.passPercentage}
          unit="%"
          variant="mint"
          trend={{ direction: 'up', label: '+3.8% projected' }}
          icon={TrendingUp}
        />
        <StatCard
          title="Accreditation Score"
          value="3.56"
          unit="/ 4.0"
          variant="violet"
          trend={{ direction: 'up', label: 'NAAC A+ Ready' }}
          icon={Award}
        />
      </div>

      {/* Accreditation Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ChartCard
            title="NAAC Quality Framework Assessment"
            subtitle="Evaluating 5 key university criteria on a 4.0 CGPA grade scale"
            height="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={naacCriteriaScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="criterion" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 4.0]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#E2E8F0',
                    borderRadius: '16px'
                  }}
                />
                <Bar dataKey="score" name="Institutional Score" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-4">
          <div className="glass-panel rounded-[26px] p-6 border border-slate-200/80 bg-white/95 shadow-sm h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Executive Synthesis
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Institutional Quality Assurance
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                CampusMind X attribution data satisfies NAAC Criterion 2.6 (Student Performance & Learning Outcomes) through explainable continuous evaluations.
              </p>

              <div className="mt-4 p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200 text-xs text-cyan-800 font-semibold space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-900">
                  <Award className="w-4 h-4 text-cyan-600" />
                  <span>NAAC Grade A+ Readiness</span>
                </div>
                <p className="text-[11px] text-cyan-700 font-normal">
                  Composite institutional score meets all regulatory thresholds for academic cycle 2025-2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
