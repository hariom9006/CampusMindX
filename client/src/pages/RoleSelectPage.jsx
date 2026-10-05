import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Shield,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function RoleSelectPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student Portal',
      persona: 'Hariom',
      detail: 'BCA 5th Semester • Roll: 22BCA1042',
      focus: 'Performance: 84% | Attendance: 71% | Healthy Trajectory',
      color: 'indigo',
      icon: GraduationCap,
      path: '/student',
      tags: ['Risk Modeling', 'Skill Gap Radar', 'CampusMind AI']
    },
    {
      id: 'faculty',
      title: 'Faculty Advisor',
      persona: 'Dr. Sunita Kulkarni',
      detail: 'Associate Professor • Chair of Computing & IT',
      focus: 'Managing 64 Cohort Students • Support Signals Active',
      color: 'purple',
      icon: Users,
      path: '/faculty',
      tags: ['Cohort Monitoring', 'Support Signals', 'Remedial Clinics']
    },
    {
      id: 'admin',
      title: 'University Admin',
      persona: 'Dean of Academic Affairs',
      detail: 'Central Academic Directorate',
      focus: '1,640 Enrolled Students • Macro Retention Telemetry',
      color: 'cyan',
      icon: Shield,
      path: '/admin',
      tags: ['Department Analytics', 'Health Heatmap', 'Placement']
    },
    {
      id: 'models',
      title: 'AI Intelligence Center',
      persona: 'Explainable AI Control',
      detail: 'Model Registry & Attribution Inference',
      focus: '5 of 5 Engines Online • TreeSHAP Core',
      color: 'emerald',
      icon: Cpu,
      path: '/models',
      tags: ['XAI Architecture', 'FastAPI Models', 'Latency Telemetry']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 aurora-bg-mesh selection:bg-indigo-500/20 selection:text-indigo-900">
      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              CampusMind<span className="aurora-gradient-text font-black">X</span>
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Operational Persona
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2 max-w-lg mx-auto">
            Experience role-tailored Explainable AI intelligence, continuous telemetry, and student success interventions.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => navigate(role.path)}
                className="glass-panel rounded-[26px] p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white/95 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {role.title}
                      </h3>
                      <span className="text-xs font-bold text-indigo-700">
                        {role.persona}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-1">
                  {role.detail}
                </p>
                <p className="text-xs font-semibold text-slate-700 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {role.focus}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {role.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            ← Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
