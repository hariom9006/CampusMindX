import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Check,
  CircleDot
} from 'lucide-react';
import ProgressBar from '../../components/ProgressBar';

export default function StudentRoadmap() {
  // 8-Week Roadmap according to Requirement 12
  const initialWeeks = [
    {
      weekNumber: 1,
      title: 'Advanced JavaScript',
      desc: 'Closures, Prototypes, Event Loop mechanics, Async/Await concurrency, and ES6+ modern patterns.',
      status: 'completed',
      topics: ['Event Loop & Microtasks', 'Closures & Scope Chain', 'Promise Combinators', 'ESModules & Bundling'],
      color: 'from-emerald-500 to-teal-500',
      nodeColor: 'bg-emerald-500'
    },
    {
      weekNumber: 2,
      title: 'Node.js',
      desc: 'Runtime architecture, V8 engine integration, buffer management, streams, and file system primitives.',
      status: 'in-progress',
      topics: ['Node.js Event-driven Architecture', 'Streams & Pipes', 'Buffer Manipulation', 'Child Processes & Worker Threads'],
      color: 'from-indigo-500 to-indigo-600',
      nodeColor: 'bg-indigo-600'
    },
    {
      weekNumber: 3,
      title: 'Express.js',
      desc: 'Middleware chaining, routing mechanics, error handling strategies, and request pipeline lifecycles.',
      status: 'upcoming',
      topics: ['Middleware Pipelines', 'Router Modularization', 'Global Error Handling', 'CORS & Security Headers'],
      color: 'from-purple-500 to-purple-600',
      nodeColor: 'bg-purple-600'
    },
    {
      weekNumber: 4,
      title: 'REST APIs',
      desc: 'HTTP semantics, endpoint design standards, OpenAPI/Swagger specifications, and pagination.',
      status: 'upcoming',
      topics: ['HTTP Status Codes & Idempotency', 'RESTful Resource Modeling', 'Query Filtering & Cursor Pagination', 'Swagger Documentation'],
      color: 'from-pink-500 to-rose-500',
      nodeColor: 'bg-pink-600'
    },
    {
      weekNumber: 5,
      title: 'Authentication',
      desc: 'JWT token lifecycles, OAuth 2.0 flows, bcrypt password hashing, and session management.',
      status: 'upcoming',
      topics: ['Access & Refresh Token Rotation', 'OAuth 2.0 / GitHub Login', 'Role-Based Access Control (RBAC)', 'CSRF & XSS Mitigation'],
      color: 'from-cyan-500 to-blue-500',
      nodeColor: 'bg-cyan-600'
    },
    {
      weekNumber: 6,
      title: 'MongoDB',
      desc: 'Schema design with Mongoose, indexing strategies, aggregation pipelines, and transactions.',
      status: 'upcoming',
      topics: ['Document Modeling & Normalization', 'Compound Indexing & Explain Plans', 'Aggregation Framework ($match, $lookup)', 'Replica Set Transactions'],
      color: 'from-emerald-500 to-teal-500',
      nodeColor: 'bg-emerald-600'
    },
    {
      weekNumber: 7,
      title: 'Deployment',
      desc: 'Docker containerization, CI/CD GitHub Actions, environment configuration, and cloud hosting.',
      status: 'upcoming',
      topics: ['Dockerfile & Multi-stage Builds', 'Docker Compose Orchestration', 'GitHub Actions CI/CD Pipeline', 'Cloud Deployment & SSL'],
      color: 'from-amber-500 to-orange-500',
      nodeColor: 'bg-amber-600'
    },
    {
      weekNumber: 8,
      title: 'Full Stack Project',
      desc: 'End-to-end full stack capstone: production deployment, telemetry integration, and portfolio showcase.',
      status: 'upcoming',
      topics: ['Full Stack Architecture Integration', 'End-to-End Testing (Playwright/Jest)', 'Lighthouse Performance Optimization', 'Portfolio Showcase & Pitch'],
      color: 'from-indigo-600 via-purple-600 to-pink-600',
      nodeColor: 'bg-gradient-to-r from-indigo-600 to-pink-600'
    }
  ];

  const [weeks, setWeeks] = useState(initialWeeks);

  const toggleComplete = (weekNumber) => {
    setWeeks((prev) =>
      prev.map((w) => {
        if (w.weekNumber === weekNumber) {
          return {
            ...w,
            status: w.status === 'completed' ? 'in-progress' : 'completed'
          };
        }
        return w;
      })
    );
  };

  const completedCount = weeks.filter((w) => w.status === 'completed').length;
  const progressPercent = Math.round((completedCount / weeks.length) * 100);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ==================================================
          Header & Progress Summary
          ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
              Personalized Curriculum
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your 8-Week Full Stack Roadmap
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Curated weekly milestones calibrated to bridge your verified career gaps.
          </p>
        </div>

        {/* Progress Card */}
        <div className="glass-card bg-white/95 rounded-[22px] p-4 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Curriculum Progress
            </span>
            <span className="text-base font-extrabold text-indigo-600 font-mono">
              {completedCount} of 8 Weeks Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 flex items-center justify-center font-bold text-xs text-indigo-700">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* ==================================================
          Curved Timeline with Colorful Nodes (Requirement 12)
          ================================================== */}
      <div className="relative max-w-4xl mx-auto py-6">
        {/* Continuous Connecting Center Timeline Line */}
        <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-400 via-indigo-400 to-pink-400 -translate-x-1/2 rounded-full opacity-40 hidden sm:block" />
        <div className="absolute left-6 top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-400 via-indigo-400 to-pink-400 -translate-x-1/2 rounded-full opacity-40 sm:hidden" />

        <div className="space-y-8">
          {weeks.map((week, idx) => {
            const isCompleted = week.status === 'completed';
            const isInProgress = week.status === 'in-progress';
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={week.weekNumber}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                  isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                } gap-6`}
              >
                {/* Timeline Center Node */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleComplete(week.weekNumber)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow-md transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 ring-4 ring-emerald-100'
                        : isInProgress
                        ? 'bg-indigo-600 ring-4 ring-indigo-100 animate-pulse'
                        : 'bg-slate-300 ring-4 ring-slate-100 hover:bg-indigo-400'
                    }`}
                    title="Click to toggle completion"
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : `W${week.weekNumber}`}
                  </motion.button>
                </div>

                {/* Milestone Content Card */}
                <div className={`w-full sm:w-[calc(50%-2.5rem)] pl-16 sm:pl-0 ${isLeft ? 'sm:pr-4' : 'sm:pl-4'}`}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className={`glass-panel rounded-[24px] p-6 border transition-all ${
                      isCompleted
                        ? 'border-emerald-200 bg-white/95 shadow-sm'
                        : isInProgress
                        ? 'border-indigo-200 bg-gradient-to-br from-white/95 to-indigo-50/40 shadow-md shadow-indigo-500/10'
                        : 'border-slate-200/80 bg-white/90 shadow-2xs'
                    }`}
                  >
                    {/* Week pill & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        Week {week.weekNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isInProgress
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {isCompleted ? 'Completed ✓' : isInProgress ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {week.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {week.desc}
                    </p>

                    {/* Core Topics Checklist */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Syllabus Focus
                      </span>
                      {week.topics.map((t, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CircleDot className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>

                    {/* Toggle Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleComplete(week.weekNumber)}
                        className={`text-xs font-bold transition-colors ${
                          isCompleted
                            ? 'text-slate-400 hover:text-slate-600'
                            : 'text-indigo-600 hover:text-indigo-800'
                        }`}
                      >
                        {isCompleted ? 'Mark as Incomplete' : 'Mark Week Complete ✓'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
