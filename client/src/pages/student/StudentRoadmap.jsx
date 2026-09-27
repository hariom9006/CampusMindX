import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Zap,
  Target,
  HelpCircle,
  Database
} from 'lucide-react';

import ProgressBar from '../../components/ProgressBar';
import AIInsightCard from '../../components/AIInsightCard';
import RecommendationCard from '../../components/RecommendationCard';
import { currentStudent } from '../../data/students';
import { apiService } from '../../services/api';

export default function StudentRoadmap() {
  const [student, setStudent] = useState(currentStudent);
  const [skillGap, setSkillGap] = useState(null);
  const [careerRecs, setCareerRecs] = useState([]);
  const [isLive, setIsLive] = useState(false);

  const [completedTopics, setCompletedTopics] = useState({
    'Graph Traversal (BFS/DFS)': true,
    'OAuth2 / JWT Token Refresh': false,
    'REST Endpoint Architecture': true,
    'Database Indexing & Normalization': false
  });

  useEffect(() => {
    let isMounted = true;
    async function loadRoadmapData() {
      try {
        const [studentData, gapData, recsData] = await Promise.all([
          apiService.getCurrentStudent('22BCA1042'),
          apiService.analyzeSkillGap({ studentId: '22BCA1042', careerTarget: 'Full Stack Developer' }),
          apiService.getRecommendations('22BCA1042')
        ]);

        if (isMounted) {
          if (studentData) {
            setStudent(studentData);
          }
          if (gapData) {
            setSkillGap(gapData);
            setIsLive(true);
          }
          if (recsData && recsData.length > 0) {
            setCareerRecs(recsData.filter((r) => r.category === 'Career' || r.category === 'Skill Development'));
          }
        }
      } catch (err) {
        console.warn('Error fetching roadmap live data:', err);
      }
    }

    loadRoadmapData();
    return () => {
      isMounted = false;
    };
  }, []);

  const milestones = [
    {
      step: 1,
      title: 'Algorithmic Rigor & Graph Fundamentals',
      targetDuration: 'Weeks 1-4 • 4 Weeks',
      status: 'In Progress',
      progress: 45,
      whyAssigned: 'Why is this milestone assigned? Addresses your High Priority gap in Data Structures & Algorithms (assessed at 52% vs 80% role benchmark). Solving this foundational bottleneck restores eligibility for 85% of campus technical interview screenings.',
      topics: [
        'Graph Traversal (BFS/DFS)',
        'Dijkstra Shortest Path & MST',
        'Binary Search Tree Balancing',
        'Dynamic Programming Memoization',
        'LeetCode Medium Frequency Set'
      ],
      recommendedAction: 'Complete Thursday TA Clinic and submit Dijkstra assignment on LMS.'
    },
    {
      step: 2,
      title: 'Backend Runtime Internals & REST API Mastery',
      targetDuration: 'Weeks 5-8 • 4 Weeks',
      status: 'Upcoming',
      progress: 20,
      whyAssigned: 'Why is this milestone assigned? Addresses your critical 25% competency deficit in Node.js runtime mechanics and Express middleware architecture required for Full Stack backend responsibilities.',
      topics: [
        'Node.js Event Loop & Streams',
        'Express Router & Middleware Chaining',
        'OAuth2 / JWT Token Refresh',
        'Mongoose Aggregation Pipelines',
        'Database Indexing & Normalization'
      ],
      recommendedAction: 'Build an authenticated multi-tenant REST API with rate limiting.'
    },
    {
      step: 3,
      title: 'System Design Basics & Production Deployment',
      targetDuration: 'Weeks 9-12 • 4 Weeks',
      status: 'Upcoming',
      progress: 0,
      whyAssigned: 'Why is this milestone assigned? Bridges the 28% gap in System Design Basics and Docker deployment required for senior-tier placement qualification and placement interview case studies.',
      topics: [
        'Docker Multi-Stage Containerization',
        'Stateless Architecture & Redis Caching',
        'CI/CD Pipeline Automation (GitHub Actions)',
        'Database Horizontal Sharding Basics',
        'Production Deployment to Cloud'
      ],
      recommendedAction: 'Containerize and deploy your CampusMind full-stack capstone to Render/AWS.'
    }
  ];

  // Calculate live completion percentage across all topics
  const allTopicCount = milestones.reduce((sum, m) => sum + m.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const overallProgression = Math.round((completedCount / allTopicCount) * 100);

  const toggleTopic = (topic) => {
    setCompletedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              Personalized Learning Path
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
              Target: {student.careerGoal || 'Full Stack Developer'}
            </span>
            {isLive && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Skill Engine Synced</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            Adaptive Academic & Career Roadmap
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Dynamic 12-week remedial and skill-acceleration curriculum synthesized specifically from {student.name}'s verified skill gaps, academic deficits, and campus placement milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Overall Progression</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{overallProgression}% Complete</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{completedCount} of {allTopicCount} Competencies</span>
          </div>
        </div>
      </div>

      {/* AI Strategy Overview Card */}
      <AIInsightCard
        title="AI Roadmap Sequencing Rationale"
        description={`Because campus placement technical evaluations start in 8 weeks, Milestone 1 prioritizes resolving the Data Structures assessment bottleneck (Graph Traversals and Dijkstra) immediately during Weeks 1-4, before progressing to Backend Runtime Internals and Containerized Deployment.`}
        rationale="Solving the primary academic and algorithmic deficit first restores examination eligibility while unlocking 85% of technical screening rounds."
        impact="Strategic Priority: Critical"
        type="info"
        actionText="Sync with Calendar Schedule"
        onAction={() => alert("Roadmap study milestones exported to student calendar feed.")}
      />

      {/* Interactive Milestones Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Curated 12-Week Milestone Sprint Timeline</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Current Role Readiness: <strong className="text-cyan-300">{skillGap?.readinessPercentage || 64}%</strong>
          </span>
        </div>

        <div className="space-y-4">
          {milestones.map((m) => {
            const isCurrent = m.status === 'In Progress';

            return (
              <div
                key={m.step}
                className={`glass-panel rounded-2xl p-6 border transition-all duration-300 ${
                  isCurrent
                    ? 'border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] bg-slate-900/80'
                    : 'border-slate-800/80 bg-slate-950/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isCurrent
                          ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {m.step}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        {m.title}
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            Active Sprint
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> {m.targetDuration}
                      </span>
                    </div>
                  </div>

                  <div className="w-full sm:w-48">
                    <ProgressBar
                      value={m.progress}
                      max={100}
                      label={`Sprint Progress (${m.progress}%)`}
                      color={isCurrent ? 'cyan' : 'purple'}
                      showValue={false}
                      height="h-2"
                    />
                  </div>
                </div>

                {/* Explicit Explanation: Why is this milestone assigned? */}
                <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300 font-medium">Why is this milestone assigned?</strong>
                    <p className="mt-0.5 text-slate-300 text-[11px] leading-relaxed">
                      {m.whyAssigned.replace(/^Why is this milestone assigned\?\s*/i, '')}
                    </p>
                  </div>
                </div>

                {/* Topics List Checklist */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-300 block mb-2">
                    Core Learning Modules & Verified Competencies (Click to Toggle):
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {m.topics.map((t, i) => {
                      const checked = completedTopics[t] || false;
                      return (
                        <div
                          key={i}
                          onClick={() => toggleTopic(t)}
                          className={`p-2.5 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                            checked
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{t}</span>
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              checked ? 'text-emerald-400' : 'text-slate-600'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Suggested Action Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      <strong className="text-cyan-300">Target Action:</strong> {m.recommendedAction}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Starting interactive learning module for: ${m.title}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 shrink-0 self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Linked Career & Skill Recommendations */}
      {careerRecs.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Linked Career Interventions</span>
              </h2>
              <p className="text-xs text-slate-400">
                Actionable milestones synchronized with your career track requirements.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30">
              {careerRecs.length} Actions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerRecs.map((rec, i) => (
              <RecommendationCard key={rec._id || rec.id || i} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
