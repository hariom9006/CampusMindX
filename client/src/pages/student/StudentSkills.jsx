import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';
import {
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  Database,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Check,
  CircleDot,
  MinusCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

import StatCard from '../../components/StatCard';
import ProgressBar from '../../components/ProgressBar';
import RecommendationCard from '../../components/RecommendationCard';
import { currentStudent } from '../../data/students';
import { apiService } from '../../services/api';

const CAREER_TRACKS = [
  'Full Stack Developer',
  'Data Analyst / Data Scientist',
  'Cloud & DevOps Engineer',
  'Cybersecurity Analyst',
  'AI / Machine Learning Engineer'
];

export default function StudentSkills() {
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [student, setStudent] = useState(currentStudent);
  const [_loading, setLoading] = useState(false);

  // Skill state according to Requirement 11
  const roleSkillsData = {
    'Full Stack Developer': {
      acquiredSkills: [
        { name: 'HTML', level: 'Strong', mastery: 95, icon: '✓' },
        { name: 'CSS', level: 'Strong', mastery: 90, icon: '✓' },
        { name: 'JavaScript', level: 'Strong', mastery: 88, icon: '✓' },
        { name: 'React', level: 'Strong', mastery: 85, icon: '✓' }
      ],
      skillGaps: [
        { name: 'Node.js', status: 'Missing', priority: 'High', deficit: '25%', week: 'Week 2' },
        { name: 'Express.js', status: 'Missing', priority: 'High', deficit: '28%', week: 'Week 3' },
        { name: 'REST APIs', status: 'Developing', priority: 'Medium', deficit: '15%', week: 'Week 4' },
        { name: 'Authentication', status: 'Missing', priority: 'High', deficit: '32%', week: 'Week 5' },
        { name: 'Deployment', status: 'Missing', priority: 'Medium', deficit: '20%', week: 'Week 7' }
      ],
      radarData: [
        { subject: 'Frontend (React/JS)', current: 90, target: 85 },
        { subject: 'Backend (Node/Express)', current: 55, target: 85 },
        { subject: 'API Architecture', current: 65, target: 80 },
        { subject: 'Auth & Security', current: 48, target: 80 },
        { subject: 'Database (MongoDB)', current: 70, target: 85 },
        { subject: 'DevOps / Deploy', current: 45, target: 75 }
      ]
    }
  };

  const currentRoleData = roleSkillsData[selectedRole] || roleSkillsData['Full Stack Developer'];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ==================================================
          Header & Role Selector (Requirement 11)
          ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-full">
              Career Intelligence Engine
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Career Skill Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Real-time competency mapping aligned with industry role requirements.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 pl-2">Target Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {CAREER_TRACKS.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==================================================
          Quick Stat Metrics
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Role Alignment"
          value="68%"
          unit="Match"
          trend={{ direction: 'up', label: '+12% this month' }}
          variant="indigo"
          icon={Target}
        />
        <StatCard
          title="Acquired Skills"
          value="4"
          unit="Mastered"
          subtitle="HTML, CSS, JS, React"
          variant="mint"
          icon={CheckCircle2}
        />
        <StatCard
          title="Identified Gaps"
          value="5"
          unit="Skills"
          subtitle="Node, Express, APIs, Auth, Deploy"
          variant="pink"
          icon={AlertTriangle}
        />
        <StatCard
          title="Time to Readiness"
          value="8"
          unit="Weeks"
          subtitle="Personalized roadmap scheduled"
          variant="violet"
          icon={Clock}
        />
      </div>

      {/* ==================================================
          Visual Skill Map & Radar Analytics
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Acquired Skills & Skill Gaps Visual Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Your Skills (Requirement 11) */}
          <div className="glass-panel rounded-[26px] p-6 border border-emerald-100/90 bg-white/95 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Your Skills (Acquired)
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Strong Foundation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentRoleData.acquiredSkills.map((sk) => (
                <div
                  key={sk.name}
                  className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{sk.name}</span>
                    <span className="text-xs font-extrabold text-emerald-600">✓</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                      <span>Strong</span>
                      <span>{sk.mastery}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sk.mastery}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps (Requirement 11) */}
          <div className="glass-panel rounded-[26px] p-6 border border-indigo-100/90 bg-white/95 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Target Skill Gaps
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Required to unlock Full Stack Developer placement eligibility
                  </p>
                </div>
              </div>
              <Link
                to="/student/roadmap"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                <span>Follow Roadmap →</span>
              </Link>
            </div>

            {/* Visual Skill Map with Strong, Developing, Missing States */}
            <div className="space-y-3">
              {currentRoleData.skillGaps.map((gap) => {
                const isDeveloping = gap.status === 'Developing';
                return (
                  <div
                    key={gap.name}
                    className="p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isDeveloping
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isDeveloping ? '~' : '×'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{gap.name}</h4>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                              isDeveloping
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {gap.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Deficit: {gap.deficit} vs industry benchmark
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                        {gap.week}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Radar Competency Chart */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-[26px] p-6 border border-slate-200/80 bg-white/95 shadow-sm h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Visual Skill Map
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Competency Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current skills vs Full Stack Developer target
              </p>

              <div className="w-full h-80 relative mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={currentRoleData.radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" />
                    <Radar
                      name="Your Competency"
                      dataKey="current"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Target Benchmark"
                      dataKey="target"
                      stroke="#06B6D4"
                      fill="#06B6D4"
                      fillOpacity={0.15}
                      strokeDasharray="4 4"
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Next Milestone: Node.js Internals
              </span>
              <Link
                to="/student/roadmap"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Go to Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
