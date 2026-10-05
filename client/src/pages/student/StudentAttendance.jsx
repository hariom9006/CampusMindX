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
          apiService.getCurrentStudent('22BCA1042').catch(() => null),
          apiService.getAttendanceRecords('22BCA1042').catch(() => null)
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
            const avg = totalHeld > 0 ? Math.round((totalAtt / totalHeld) * 100) : studentData?.attendance || 71;

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
        console.warn('Attendance records fallback:', err);
      }
    }

    loadAttendanceData();
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
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
              Attendance Telemetry
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
            Attendance Analytics & Clearance
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Exam eligibility verification, threshold warnings, and automated recovery planning.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={att.overallPercentage || 71}
          unit="%"
          variant="amber"
          trend={{ direction: 'down', label: '4% below 75% target' }}
          icon={CalendarCheck}
        />
        <StatCard
          title="Classes Attended"
          value={att.totalClassesAttended || 142}
          unit={`/ ${att.totalClassesHeld || 200}`}
          variant="indigo"
          subtitle="Lectures & practicals"
          icon={CheckCircle2}
        />
        <StatCard
          title="Subjects At Risk"
          value={att.subjectsAtRisk || 1}
          unit="Subject"
          variant="pink"
          trend={{ direction: 'down', label: 'DBMS: 71%' }}
          icon={AlertTriangle}
        />
        <StatCard
          title="Recovery Classes"
          value="4"
          unit="Classes"
          variant="mint"
          subtitle="Needed to reach 75% clearance"
          icon={Clock}
        />
      </div>

      {/* Main Attendance Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject-Wise Attendance Bar Chart */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Subject-Wise Attendance vs 75% Clearance Benchmark"
            subtitle="Red reference line represents mandatory University exam eligibility threshold"
            height="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectList} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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
                <ReferenceLine y={75} stroke="#EF4444" strokeDasharray="4 4" label={{ value: '75% Target', fill: '#EF4444', fontSize: 11 }} />
                <Bar dataKey="percentage" name="Attendance %" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Clearance Diagnostics */}
        <div className="lg:col-span-4">
          <div className="glass-panel rounded-[26px] p-6 border border-slate-200/80 bg-white/95 shadow-sm h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                University Clearance
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Examination Eligibility
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated by automated institutional rules
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Advisory: 1 Coursework Shortage</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  DBMS (BCA-502) is currently at 71%. Attend the next 3 scheduled lab sessions to clear semester exam hall ticket requirements.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              Regulation: Ordinance 4.2 • 75% Minimum Attendance Clause
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="glass-panel rounded-[24px] border border-slate-200/80 overflow-hidden shadow-xs bg-white">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Subject Attendance Registry
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live semester lecture and laboratory counters
            </p>
          </div>
        </div>

        {/* Mobile Attendance Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {subjectList.map((sub, i) => (
            <div key={i} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{sub.subject}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{sub.code}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                    sub.percentage >= 75
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {sub.percentage >= 75 ? 'Cleared' : 'Shortage'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Attended: {sub.attended} / {sub.total} classes</span>
                <span className={`font-mono font-extrabold text-sm ${sub.percentage >= 75 ? 'text-slate-900' : 'text-amber-600'}`}>
                  {sub.percentage}%
                </span>
              </div>
              <ProgressBar
                value={sub.percentage}
                threshold={75}
                color={sub.percentage >= 75 ? 'emerald' : 'amber'}
                showValue={false}
              />
            </div>
          ))}
        </div>

        {/* Desktop Attendance Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Attended / Total</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectList.map((sub, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{sub.subject}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{sub.code}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">
                    {sub.attended} / {sub.total} classes
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                    {sub.percentage}%
                  </td>
                  <td className="py-3.5 px-4 w-48">
                    <ProgressBar
                      value={sub.percentage}
                      threshold={75}
                      color={sub.percentage >= 75 ? 'emerald' : 'amber'}
                      showValue={false}
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        sub.percentage >= 75
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {sub.percentage >= 75 ? 'Cleared for Exams' : 'Shortage Advisory'}
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
