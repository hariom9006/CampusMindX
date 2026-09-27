import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Database
} from 'lucide-react';

import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import ProgressBar from '../../components/ProgressBar';
import AIInsightCard from '../../components/AIInsightCard';

import { studentAttendanceData } from '../../data/attendanceData';
import { currentStudent } from '../../data/students';
import { apiService } from '../../services/api';

export default function StudentAttendance() {
  const [att, setAtt] = useState(studentAttendanceData);
  const [subjectList, setSubjectList] = useState(studentAttendanceData.subjectWiseAttendance);
  const [student, setStudent] = useState(currentStudent);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAttendanceData() {
      try {
        const [studentData, records] = await Promise.all([
          apiService.getCurrentStudent('22BCA1042'),
          apiService.getAttendanceRecords('22BCA1042')
        ]);

        if (isMounted) {
          if (studentData) {
            setStudent({
              ...studentData,
              rollNo: studentData.enrollmentNumber || studentData.rollNo
            });
          }

          if (records && records.length > 0) {
            const mapped = records.map((r) => ({
              subject: r.subjectName || r.subject?.name,
              code: r.subjectCode || r.subject?.code,
              attended: r.attendedClasses,
              total: r.totalClasses,
              percentage: r.percentage,
              status: r.status,
              color: r.percentage >= 75 ? '#10b981' : r.percentage >= 65 ? '#f59e0b' : '#ef4444',
              faculty: r.facultyName || 'Faculty In-Charge'
            }));
            setSubjectList(mapped);

            const totalHeld = records.reduce((acc, curr) => acc + curr.totalClasses, 0);
            const totalAtt = records.reduce((acc, curr) => acc + curr.attendedClasses, 0);
            const avg = totalHeld > 0 ? Math.round((totalAtt / totalHeld) * 100) : studentData?.attendance || 68;

            setAtt((prev) => ({
              ...prev,
              overallPercentage: avg,
              totalClassesHeld: totalHeld || prev.totalClassesHeld,
              totalClassesAttended: totalAtt || prev.totalClassesAttended,
              missedClasses: totalHeld - totalAtt
            }));
            setIsLive(true);
          }
        }
      } catch (err) {
        console.error('Error fetching attendance from API:', err);
      }
    }

    loadAttendanceData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Attendance Telemetry & Clearance</h1>
            {isLive && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>MongoDB Live</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric & LMS lecture attendance tracking for <span className="text-slate-200 font-semibold">{student.name}</span> ({student.rollNo || student.enrollmentNumber}) with predictive recovery modeling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-950/70 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Attendance Shortage: {att.overallPercentage}% (Req: 75%)</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={att.overallPercentage}
          unit="%"
          glowColor="amber"
          trend={{ direction: 'down', label: `${att.overallPercentage - 75}% below 75% threshold` }}
          icon={CalendarCheck}
        />
        <StatCard
          title="Classes Attended"
          value={att.totalClassesAttended}
          unit={`/ ${att.totalClassesHeld}`}
          glowColor="cyan"
          subtitle={`${att.totalClassesAttended} sessions logged`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Recovery Target"
          value={att.shortageCount}
          unit="classes"
          glowColor="rose"
          trend={{ direction: 'neutral', label: '10 consecutive required' }}
          icon={ShieldAlert}
        />
        <StatCard
          title="Total Missed"
          value={att.missedClasses}
          unit="hours"
          glowColor="purple"
          subtitle="4 unexcused absences"
          icon={Clock}
        />
      </div>

      {/* Action Notice Banner */}
      <AIInsightCard
        title="Predictive Attendance Recovery Plan"
        description="Your aggregate attendance is 68%. Under university academic regulation 4.2, students below 75% are ineligible to sit for final semester examinations. You must attend 10 consecutive scheduled lectures without absence to reach exactly 75.0%."
        rationale="Severe deficit concentrated in Computer Networks (48%) and Data Structures Lab (62%). Full Stack Web Tech is currently in safe zone (79%)."
        impact="Examination Clearance Critical"
        type="warning"
        actionText="Download Attendance Log PDF"
        onAction={() => alert("Attendance summary report exported for Dr. Sunita Kulkarni (Advisor).")}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend with 75% Threshold Line */}
        <ChartCard
          title="Weekly Attendance Trend"
          subtitle="Historical weekly percentage vs mandatory 75% eligibility line"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={att.weeklyTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[40, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '75% Threshold', fill: '#ef4444', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="attendance"
                name="Attendance %"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#attGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Comparison */}
        <ChartCard
          title="Monthly Attendance vs Cohort Average"
          subtitle="Aarav Sharma monthly attendance compared with BCA Sem 5 peers"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={att.monthlyComparison} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1222',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="rate" name="Aarav %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="batchAvg" name="Cohort Average %" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Subject-Wise Detailed Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-5">
        <h3 className="text-base font-bold text-white mb-1">Subject-Wise Attendance Clearance Table</h3>
        <p className="text-xs text-slate-400 mb-4">
          Status of each enrolled course in BCA Semester 5 with faculty leads (MongoDB Sync).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b1222] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Subject / Code</th>
                <th className="py-3 px-3">Faculty In-Charge</th>
                <th className="py-3 px-3">Sessions Attended</th>
                <th className="py-3 px-3">Percentage</th>
                <th className="py-3 px-3">Visual Progress</th>
                <th className="py-3 px-3">Exam Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {subjectList.map((item) => (
                <tr key={item.code} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white block">{item.subject}</span>
                    <span className="text-[11px] font-mono text-cyan-400">{item.code}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">{item.faculty}</td>
                  <td className="py-3.5 px-3 font-mono">
                    {item.attended} / {item.total}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`font-bold font-mono text-sm ${
                        item.percentage < 60
                          ? 'text-rose-400'
                          : item.percentage < 75
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 w-48">
                    <ProgressBar
                      value={item.percentage}
                      max={100}
                      threshold={75}
                      color={item.percentage < 60 ? 'rose' : item.percentage < 75 ? 'amber' : 'emerald'}
                      showValue={false}
                      height="h-2"
                    />
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.percentage >= 75
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {item.status}
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
