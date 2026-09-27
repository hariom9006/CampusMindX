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
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';

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
  const [analysisData, setAnalysisData] = useState(null);
  const [skillRecommendations, setSkillRecommendations] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [_loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalysis() {
      try {
        setLoading(true);
        const [studentData, gapData, recsData] = await Promise.all([
          apiService.getCurrentStudent('22BCA1042'),
          apiService.analyzeSkillGap({
            studentId: '22BCA1042',
            careerTarget: selectedRole
          }),
          apiService.getRecommendations('22BCA1042')
        ]);

        if (isMounted) {
          if (studentData) {
            setStudent(studentData);
            if (!selectedRole && studentData.careerGoal) {
              setSelectedRole(studentData.careerGoal);
            }
          }
          if (gapData) {
            setAnalysisData(gapData);
            setIsLive(true);
          }
          if (recsData && recsData.length > 0) {
            setSkillRecommendations(
              recsData.filter((r) => r.category === 'Skill Development' || r.category === 'Career')
            );
          }
        }
      } catch (err) {
        console.error('Error fetching skill gap data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAnalysis();
    return () => {
      isMounted = false;
    };
  }, [selectedRole]);

  const skills = analysisData?.skills || [];
  const filteredSkills = skills.filter((s) => {
    if (priorityFilter === 'All') return true;
    if (priorityFilter === 'High') return s.priority === 'High';
    if (priorityFilter === 'Medium') return s.priority === 'Medium';
    if (priorityFilter === 'Mastered') return s.status === 'Mastered';
    return true;
  });

  const radarData = analysisData?.radarData?.length > 0
    ? analysisData.radarData.map((d) => ({
        subject: d.category,
        current: d.current,
        required: d.target,
        fullMark: 100
      }))
    : [
        { subject: 'Frontend', current: 78, required: 85, fullMark: 100 },
        { subject: 'Backend', current: 55, required: 80, fullMark: 100 },
        { subject: 'Databases', current: 65, required: 75, fullMark: 100 },
        { subject: 'Core CS', current: 50, required: 80, fullMark: 100 },
        { subject: 'DevOps', current: 45, required: 70, fullMark: 100 }
      ];

  const readinessScore = analysisData?.readinessPercentage || 64;
  const highGapsCount = analysisData?.summary?.highPriorityGaps ?? 3;
  const moderateGapsCount = analysisData?.summary?.moderateGaps ?? 4;
  const masteredCount = analysisData?.summary?.masteredSkills ?? 2;

  const priorityBadgeStyles = {
    High: 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    Medium: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    Low: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
  };

  const statusBadgeStyles = {
    'Critical Gap': 'text-rose-400 bg-rose-950/40 border-rose-500/30',
    'Moderate Gap': 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    'On Track': 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    'Mastered': 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header with Career Track Selector */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
              Phase 4 Skill Gap Engine
            </span>
            {isLive && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>MongoDB Live Vector</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            Skill Gap Analyzer & Industry Alignment
          </h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Quantifying verified coursework mastery, practical lab evaluation, and project implementations against standard placement benchmarks with transparent scoring rules.
          </p>
        </div>

        {/* Role Track Selector */}
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 shrink-0 space-y-1.5 bg-slate-900/80">
          <label className="text-[11px] font-mono text-purple-300 block uppercase">
            Select Career Target Benchmark
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-slate-950 text-white text-xs rounded-lg px-3 py-2 border border-purple-500/40 focus:border-cyan-400 focus:outline-none"
          >
            {CAREER_TRACKS.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Role Readiness Index"
          value={readinessScore}
          unit="%"
          glowColor="purple"
          trend={{ direction: 'up', label: 'Formula: sum(min(C,T)*w) / sum(T*w)' }}
          icon={Target}
        />
        <StatCard
          title="High Priority Gaps"
          value={highGapsCount}
          unit="Skills"
          glowColor="rose"
          subtitle="Gap ≥ 30% or critical prerequisite"
          icon={AlertTriangle}
        />
        <StatCard
          title="Moderate Gaps"
          value={moderateGapsCount}
          unit="Skills"
          glowColor="amber"
          subtitle="15% ≤ Gap < 30%"
          icon={TrendingUp}
        />
        <StatCard
          title="Mastered Competencies"
          value={masteredCount}
          unit="Skills"
          glowColor="emerald"
          subtitle="Proficiency meets/exceeds target"
          icon={CheckCircle2}
        />
      </div>

      {/* Radar Chart & Placement Readiness Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-base font-bold text-white">Domain Competency Radar</h3>
            <p className="text-xs text-slate-400">
              Cyan polygon: {student.name}'s verified level | Purple dashed perimeter: {selectedRole} target
            </p>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1222',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Radar
                  name="Student Current Level"
                  dataKey="current"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Role Target Level"
                  dataKey="required"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Meter & Transparent Scoring Explanation */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Placement Readiness Meter</h3>
            <p className="text-xs text-slate-400 mb-3">
              Weighted composite evaluating {skills.length} technical competencies against {selectedRole} standards.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center my-3">
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 block font-mono">
                {readinessScore}%
              </span>
              <span className="text-xs font-semibold text-slate-300 mt-1 block">Overall Career Track Readiness</span>
              <div className="w-full max-w-xs mx-auto mt-3">
                <ProgressBar value={readinessScore} max={100} color="purple" showValue={false} height="h-2.5" />
              </div>
            </div>

            {/* Documented Scoring Logic Box */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Transparent Scoring Rules</span>
              </div>
              <p className="font-mono text-[10px] text-slate-400">
                • Gap = Math.max(0, Target Level - Current Level)<br />
                • High Priority: Gap ≥ 30% OR (Critical Prereq && Gap ≥ 20%)<br />
                • Medium Priority: 15% ≤ Gap &lt; 30%<br />
                • Low Priority: Gap &lt; 15% (Mastered when Gap = 0)
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <Link
              to="/student/roadmap"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>View Milestone Learning Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Transparent Skill Gap Table with Priority Filters */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Competency Gap Audit Table</span>
            </h2>
            <p className="text-xs text-slate-400">
              Showing assessed skill levels, role targets, calculated gaps, and priority rankings.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            {['All', 'High', 'Medium', 'Mastered'].map((filter) => (
              <button
                key={filter}
                onClick={() => setPriorityFilter(filter)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  priorityFilter === filter
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === 'High' ? 'High Priority' : filter === 'Medium' ? 'Medium' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-3">Skill & Competency</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Current Level</th>
                <th className="py-3 px-3 text-center">Target Level</th>
                <th className="py-3 px-3 text-center">Calculated Gap</th>
                <th className="py-3 px-3 text-center">Priority</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSkills.map((item, idx) => {
                const isHigh = item.priority === 'High';
                return (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-slate-900/40 ${
                      isHigh ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{item.skill}</span>
                        {item.critical && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
                            Critical
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{item.category}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-cyan-300">
                      {item.currentLevel}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-purple-300">
                      {item.targetLevel}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className={item.gap > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {item.gap > 0 ? `-${item.gap}%` : '0%'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${priorityBadgeStyles[item.priority] || priorityBadgeStyles.Low}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusBadgeStyles[item.status] || ''}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px] max-w-xs leading-relaxed">
                      {item.action}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Linked Skill Development Recommendations (Phase 4 Engine) */}
      {skillRecommendations.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Targeted Skill & Career Recommendations</span>
              </h2>
              <p className="text-xs text-slate-400">
                Actionable learning steps generated to bridge your highest-priority developmental gaps.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30">
              {skillRecommendations.length} Interventions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillRecommendations.map((rec, i) => (
              <RecommendationCard key={rec._id || rec.id || i} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
