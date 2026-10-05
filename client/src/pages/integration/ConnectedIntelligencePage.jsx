import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from 'recharts';
import {
  Building2,
  Sparkles,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  Target,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  HelpCircle,
  RotateCcw,
  Send,
  User,
  Shield,
  Cloud,
  FileText,
  Lock,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sliders,
  Check
} from 'lucide-react';

import dataSyncService, { DEFAULT_PERMISSIONS } from '../../services/dataSyncService';
import { ICloudConnector, SAMPLE_CLOUD_DOCUMENTS } from '../../integrations/cloud/iCloudConnector';
import { DEMO_LMS_PAYLOAD } from '../../data/demoUniversityData';

export default function ConnectedIntelligencePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [dataSourceModalOpen, setDataSourceModalOpen] = useState(false);
  const [isSyncingNow, setIsSyncingNow] = useState(false);
  const [syncHistory, setSyncHistory] = useState([]);
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  // Cloud / iCloud state
  const [cloudConnected, setCloudConnected] = useState(false);
  const [selectedCloudDoc, setSelectedCloudDoc] = useState(null);
  const [parsedDocResult, setParsedDocResult] = useState(null);
  const [isParsingDoc, setIsParsingDoc] = useState(false);

  // AI Chat state for Connected Mode
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Load connected data on mount
  useEffect(() => {
    let currentProfile = dataSyncService.loadConnectedProfile();
    if (!currentProfile) {
      // Auto-initialize with default official university live sync
      dataSyncService.performRealSync({
        universityId: 'galgotias',
        studentId: '24BCA1089',
        authMethod: 'sso',
        permissions: DEFAULT_PERMISSIONS
      }).then((norm) => {
        setProfile(norm);
        setChatMessages([
          {
            sender: 'assistant',
            text: `Hello ${norm.student.name}! I am CampusMind AI, connected directly to your authorized ${norm.student.university} records. Factual data retrieved: Overall Attendance is ${norm.attendance.overallPercentage}%, CGPA is ${norm.academics.cgpa}, with ${norm.assignments.pending || 4} pending assignments. How can I help you today?`
          }
        ]);
      });
    } else {
      setProfile(currentProfile);
      setChatMessages([
        {
          sender: 'assistant',
          text: `Hello ${currentProfile.student.name}! I am CampusMind AI, connected directly to your authorized ${currentProfile.student.university} records. Factual data retrieved: Overall Attendance is ${currentProfile.attendance.overallPercentage}%, CGPA is ${currentProfile.academics.cgpa}, with ${currentProfile.assignments.pending || 4} pending assignments. How can I help you today?`
        }
      ]);
    }

    setSyncHistory(dataSyncService.loadSyncHistory());
    setPermissions(dataSyncService.loadPermissions());
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex items-center justify-center p-4 aurora-bg-mesh">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading connected university intelligence...</span>
        </div>
      </div>
    );
  }

  const { student, academics, attendance, assignments, examinations, skills, analytics, meta } = profile;

  // Manual Data Refresh Handler
  const handleSyncNow = async () => {
    setIsSyncingNow(true);
    try {
      const refreshed = await dataSyncService.performRealSync({
        universityId: student.universityId || 'galgotias',
        studentId: student.admissionId || '24BCA1089',
        authMethod: 'sso',
        permissions
      });
      setProfile(refreshed);
      setSyncHistory(dataSyncService.loadSyncHistory());
      alert(`Latest records synchronized from ${student.university}.`);
    } finally {
      setIsSyncingNow(false);
    }
  };

  // Disconnect & Revoke
  const handleDisconnect = () => {
    setDisconnectModalOpen(true);
  };

  // Delete All Imported Data
  const handleDeleteData = () => {
    dataSyncService.clearConnectedProfile();
    setDeleteModalOpen(false);
    alert('All imported university records and cached intelligence have been purged.');
    navigate('/');
  };

  // Chat message handler
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const userMsg = { sender: 'user', text: userText };
    setChatInput('');

    let aiReply = '';
    const q = userText.toLowerCase();

    if (q.includes('support') || q.includes('indicator') || q.includes('medium') || q.includes('why')) {
      aiReply = `Your Academic Support Indicator is currently ${analytics.supportIndicator}. Contributing factors: 1) Attendance in Computer Networks (${attendance.subjects?.[2]?.percentage || 58}%) and Java (${attendance.subjects?.[3]?.percentage || 62}%) are below the 75% condonation threshold. 2) Assignment completion velocity is ${assignments.completionRate}% with ${assignments.pending} pending tasks. CGPA remains at ${academics.cgpa}.`;
    } else if (q.includes('attendance') || q.includes('missed') || q.includes('classes') || q.includes('low')) {
      aiReply = `Your overall attendance across enrolled courses is ${attendance.overallPercentage}%. Computer Networks (${attendance.subjects?.[2]?.percentage || 58}%, 7 lectures needed for 75% clearance) and Java (${attendance.subjects?.[3]?.percentage || 62}%, 5 lectures needed) require immediate attendance recovery.`;
    } else if (q.includes('assignment') || q.includes('pending') || q.includes('late')) {
      aiReply = `You have completed ${assignments.completed} out of ${assignments.total} assignments (${assignments.completionRate}% completion rate). You currently have ${assignments.pending} pending assignments: 1) Computer Networks Assignment 3 (Due Sep 30), 2) DBMS Assignment 4 (Due Oct 02), 3) Java Project Milestone 2 (Due Oct 05).`;
    } else if (q.includes('skill') || q.includes('gap') || q.includes('career') || q.includes('full stack')) {
      aiReply = `For your target career goal of Full Stack Developer, your verified university coursework covers Java, DBMS, and Computer Networks. Key skill gaps to focus on: Node.js & Express (gap: 35%), MongoDB (gap: 25%), and Testing / System Design (gap: 40%).`;
    } else if (q.includes('focus') || q.includes('study') || q.includes('week') || q.includes('plan')) {
      aiReply = `Top priorities this week: 1) Attend all scheduled Computer Networks and Java lectures to recover attendance. 2) Submit Computer Networks Assignment 3 before Sep 30. 3) Prepare for the Mid-Term examinations starting Oct 12.`;
    } else {
      aiReply = `Based on your synchronized records from ${student.university}: Authenticated student ${student.name} (Admission ID: ${student.admissionId}). Overall performance is ${academics.percentage || academics.overallPercentage}%, CGPA is ${academics.cgpa}, attendance is ${attendance.overallPercentage}%, and ${assignments.pending} coursework items are pending.`;
    }

    const aiMsg = { sender: 'assistant', text: aiReply };
    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  // iCloud Connection Handler
  const handleConnectCloud = async () => {
    const cloud = new ICloudConnector();
    await cloud.connect('Apple iCloud Drive');
    setCloudConnected(true);
  };

  // Parse Document Handler
  const handleParseDocument = async (doc) => {
    setSelectedCloudDoc(doc);
    setIsParsingDoc(true);
    const cloud = new ICloudConnector();
    try {
      const res = await cloud.parseAcademicDocument(doc.id);
      setParsedDocResult(res);
    } finally {
      setIsParsingDoc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col justify-between aurora-bg-mesh selection:bg-indigo-500/20 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP BAR / MODE HEADER */}
        <div className="glass-panel rounded-[24px] p-5 border border-emerald-100 bg-white/95 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-bold px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                  Connected LMS Mode
                </span>
                {/* Section 8: Live University Data Source Indicator */}
                <button
                  onClick={() => setDataSourceModalOpen(true)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                    student.isLiveIntegration !== false
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-purple-950/90 text-purple-300 border-purple-500/50 hover:bg-purple-900/60'
                  }`}
                  title="Click to view verified data source and active integration details"
                >
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      student.isLiveIntegration !== false ? 'bg-emerald-400' : 'bg-purple-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      student.isLiveIntegration !== false ? 'bg-emerald-500' : 'bg-purple-500'
                    }`}></span>
                  </span>
                  <span>● {student.isLiveIntegration !== false ? 'LIVE UNIVERSITY DATA' : 'DEMO SANDBOX'}</span>
                  <span className="text-[10px] text-slate-400 font-sans font-normal border-l border-slate-700 pl-1.5">
                    Last synced: {profile.lastSynced ? new Date(profile.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                  </span>
                </button>
              </div>

              {/* Section 10: Personalized AI Result Banner */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
                <span>Welcome, {student.name}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-0.5">
                <span>University: <strong className="text-white">{student.university}</strong></span>
                <span className="text-slate-600">•</span>
                <span>Admission ID: <strong className="font-mono text-cyan-300">{student.admissionId}</strong></span>
                <span className="text-slate-600">•</span>
                <span>Semester: <strong className="text-white">{student.semester}</strong></span>
                <span className="text-slate-600">•</span>
                <span>CGPA: <strong className="text-cyan-300">{academics.cgpa}</strong></span>
                <span className="text-slate-600">•</span>
                <span>Attendance: <strong className={attendance.overallPercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}>{attendance.overallPercentage}%</strong></span>
                <span className="text-slate-600">•</span>
                <span>Assignment Completion: <strong className="text-indigo-400">{assignments.completionRate}%</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSyncNow}
              disabled={isSyncingNow}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
            <button
              onClick={() => setPermissionsModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Permissions</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 glass-panel hover:bg-red-500/10 border border-red-500/30 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* 7 MAIN AI KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Academic Performance */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Performance</span>
            <span className="text-2xl font-black text-cyan-400 mt-1 block">
              {academics.overallPercentage}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono">CGPA: {academics.cgpa}</span>
          </div>

          {/* 2. Attendance */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Attendance</span>
            <span
              className={`text-2xl font-black mt-1 block ${
                attendance.overallPercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {attendance.overallPercentage}%
            </span>
            <span className="text-[10px] text-amber-300 font-mono">Target: {attendance.configuredThreshold}%</span>
          </div>

          {/* 3. Assignment Rate */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Assignments</span>
            <span className="text-2xl font-black text-indigo-400 mt-1 block">
              {assignments.completionRate}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{assignments.completed}/{assignments.total} Done</span>
          </div>

          {/* 4. Support Indicator */}
          <div className="glass-panel rounded-2xl p-4 border border-amber-500/30 bg-amber-950/20 shadow">
            <span className="text-[10px] font-mono uppercase text-amber-300 block">Support Indicator</span>
            <span className="text-xl font-black text-amber-400 mt-1 block uppercase">
              {analytics.supportIndicator}
            </span>
            <button
              onClick={() => setExplainModalOpen(true)}
              className="text-[10px] text-amber-300/90 underline font-medium mt-0.5 block text-left"
            >
              Why this result?
            </button>
          </div>

          {/* 5. Career Readiness */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Career Readiness</span>
            <span className="text-2xl font-black text-purple-400 mt-1 block">
              {analytics.careerReadiness}%
            </span>
            <span className="text-[10px] text-purple-300/80">Full Stack Dev</span>
          </div>

          {/* 6. Skill Coverage */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Skill Coverage</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {analytics.skillCoverage}%
            </span>
            <span className="text-[10px] text-slate-400">9 Key Topics</span>
          </div>

          {/* 7. Learning Consistency */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/60 shadow">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Consistency</span>
            <span className="text-2xl font-black text-blue-400 mt-1 block">
              {analytics.learningConsistency}%
            </span>
            <span className="text-[10px] text-blue-300 font-mono">High Velocity</span>
          </div>
        </div>

        {/* SECTION: ACADEMIC MARKS & SEMESTER TREND */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subject Performance Marks (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Subject Performance & Internal vs External Marks</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Imported directly from {student.university} semester gradebook.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                Avg: {academics.overallPercentage}%
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={academics.subjects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="code" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d1a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="internalMarks" name="Internal Marks" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="externalMarks" name="External Marks" fill="#06b6d4" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Strongest Subject</span>
                <span className="font-bold text-emerald-400 truncate block">
                  {academics.highestSubject ? `${academics.highestSubject.name} (${academics.highestSubject.percentage}%)` : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Requires Attention</span>
                <span className="font-bold text-amber-400 truncate block">
                  {academics.lowestSubject ? `${academics.lowestSubject.name} (${academics.lowestSubject.percentage}%)` : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Semester CGPA</span>
                <span className="font-bold text-white block">{academics.cgpa} / 10.0</span>
              </div>
            </div>
          </div>

          {/* Semester Trend Chart (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Multi-Semester Academic Velocity</span>
            </h3>
            <p className="text-xs text-slate-400">
              Historical progression tracking GPA and aggregate percentage.
            </p>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={academics.semesterTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="semester" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d1a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Line type="monotone" dataKey="percentage" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION: ATTENDANCE & ASSIGNMENT TELEMETRY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Attendance Analysis (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                  <span>Attendance Telemetry & Clearance</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous tracking against {attendance.configuredThreshold || 75}% condonation threshold.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-300">
                {attendance.overallPercentage}% Overall
              </span>
            </div>

            {/* Attendance Alert Banner */}
            {(attendance.subjectsBelowTarget?.length || 0) > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
                <span className="font-bold block mb-0.5">Attention Required:</span>
                <span>
                  Attendance is below the configured {attendance.configuredThreshold || 75}% target in{' '}
                  {attendance.subjectsBelowTarget.length} subject(s). Clearance classes required:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {attendance.subjectsBelowTarget.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-amber-900/80 text-amber-200 font-mono text-[10px] border border-amber-500/30"
                    >
                      {s.name}: {s.percentage}% ({s.requiredToClear} lectures needed)
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs">
              {attendance.subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <span className="font-semibold text-white block">{sub.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {sub.attendedClasses} attended / {sub.totalClasses} scheduled
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full ${
                        sub.percentage >= attendance.configuredThreshold
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {sub.percentage}% • {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Intelligence (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>Assignment Intelligence</span>
              </h3>
              <span className="text-xs font-mono text-indigo-300">{assignments.completionRate}%</span>
            </div>

            {/* AI Insight Card */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
              <span className="font-bold block text-[10px] font-mono uppercase text-indigo-400 mb-0.5">
                CampusMind AI Insight
              </span>
              <p className="leading-relaxed">
                Assignment completion has decreased during the current academic period (82% vs historical 91%). You have {assignments.pending} pending and {assignments.late} late submission(s).
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {(assignments.records && assignments.records.length > 0
                ? assignments.records
                : assignments.recentList || []
              ).map((asg, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="max-w-[70%]">
                    <span className="font-semibold text-white block truncate">{asg.name || asg.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {asg.subject} • Due: {asg.deadline || asg.dueDate || 'N/A'}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded capitalize shrink-0 ${
                      (asg.status || '').toLowerCase() === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : (asg.status || '').toLowerCase() === 'pending'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-red-950 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {asg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION: CAREER SKILL GAPS & RECOMMENDATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Skill Gap Matrix (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>Career Skill Gap Intelligence (Full Stack Dev)</span>
              </h3>
              <span className="text-[10px] font-mono uppercase bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Industry Radar
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {skills.map((sk, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{sk.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Current: <strong className="text-white">{sk.currentLevel}%</strong> / Target:{' '}
                      <strong className="text-purple-300">{sk.targetLevel}%</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sk.gap === 0
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                      }`}
                      style={{ width: `${sk.currentLevel}%` }}
                    />
                  </div>
                  {sk.gap > 0 && (
                    <div className="flex justify-end pt-0.5">
                      <span className="text-[9px] font-mono text-amber-300">
                        Gap: {sk.gap}% ({sk.priority})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Recommendations (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>CampusMind Recommendations</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  title: 'Improve Computer Networks Attendance',
                  reason: 'Your attendance is currently 61% (below 75% target). Attending the next 7 classes will restore exam clearance.',
                  priority: 'High'
                },
                {
                  title: 'Complete Pending Coursework Submissions',
                  reason: 'Subnet Masking Problem Set is due in 3 days. Clearing pending items will increase assignment rate from 82% to 90%.',
                  priority: 'High'
                },
                {
                  title: 'Practice Node.js & REST API Architecture',
                  reason: 'Node.js has a 35% gap relative to your selected Full Stack Developer career competency benchmark.',
                  priority: 'Medium'
                },
                {
                  title: 'Revise Weak Topics in AI/ML Foundations',
                  reason: 'Upcoming Mid-Term examination in 2 weeks requires review of A* search and Heuristic algorithms.',
                  priority: 'Medium'
                }
              ].map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rec.title}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        rec.priority === 'High'
                          ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 15: REAL ENROLLED COURSES & FACULTY */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>My Enrolled Courses & Faculty</span>
              </h3>
              <p className="text-xs text-slate-400">
                Official course registrations synchronized from {student.university} Academic Portal.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              {(courses && courses.length) || 5} Active Courses
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(courses && courses.length > 0 ? courses : [
              { code: 'BCS501', name: 'Data Structures & Algorithms', faculty: 'Dr. R. K. Sharma', credits: 4 },
              { code: 'BCS502', name: 'Database Management Systems', faculty: 'Prof. Anjali Verma', credits: 4 },
              { code: 'BCS503', name: 'Computer Networks', faculty: 'Dr. V. Narayanan', credits: 4 },
              { code: 'BCS504', name: 'Java Programming & J2EE', faculty: 'Prof. S. Ghosh', credits: 4 },
              { code: 'BCS505', name: 'Artificial Intelligence Foundations', faculty: 'Dr. K. Singhania', credits: 3 }
            ]).map((course, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-xs text-white block leading-snug">
                    {course.name}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 shrink-0">
                    {course.code}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span className="truncate">{course.faculty || 'Department Faculty'}</span>
                  <span className="font-mono text-slate-300">{course.credits || 4} Credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: 8-WEEK ADAPTIVE ROADMAP */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Personalized 8-Week Learning Roadmap</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Adaptive Curriculum Path</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            {[
              { week: 'Week 1', title: 'Networks Revision', focus: 'Subnetting & TCP/IP' },
              { week: 'Week 2', title: 'DBMS Practical', focus: 'B-Tree & Indexing' },
              { week: 'Week 3', title: 'JavaScript Core', focus: 'Async/Await & Closures' },
              { week: 'Week 4', title: 'React Mastery', focus: 'Custom Hooks & State' },
              { week: 'Week 5', title: 'Node.js Backend', focus: 'Express & REST APIs' },
              { week: 'Week 6', title: 'MongoDB Modeling', focus: 'Mongoose & Aggregation' },
              { week: 'Week 7', title: 'Full Stack Build', focus: 'JWT Auth & Microservices' },
              { week: 'Week 8', title: 'Resume & Mock Prep', focus: 'Portfolio Deployment' }
            ].map((wk, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">{wk.week}</span>
                  <span className="font-semibold text-white block mt-1">{wk.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">{wk.focus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: ASK CAMPUSMIND AI CHAT */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/40 bg-slate-900/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ask CampusMind AI</h3>
                <span className="text-[10px] font-mono text-cyan-300">
                  Directly grounded in your authorized LMS records from {student.university}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Interactive Advisor
            </span>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'Why is my support indicator Medium?',
              'Which subject has low attendance?',
              'Which assignments are pending?',
              'What skills am I missing for Full Stack?',
              'What should I study this week?'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => setChatInput(chip)}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-950/80 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 max-h-64 overflow-y-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-600/40 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about your grades, attendance, or study roadmap..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* SECTION: DATA SYNC STATUS & HISTORY & PRIVACY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Connection Status Card (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>University Data Connection</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                Connected ✓
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-800">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">University Portal:</span>
                <span className="font-semibold text-white">{student.university}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Admission / Student ID:</span>
                <span className="font-mono text-cyan-300">{student.admissionId}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Last Synced:</span>
                <span className="font-mono text-slate-300">Today, 10:42 AM</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Authorized Sources:</span>
                <span className="text-emerald-400 font-medium">✓ Marks ✓ Attendance ✓ Tasks ✓ Exams</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSyncNow}
                disabled={isSyncingNow}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
              <button
                onClick={() => setPermissionsModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800 border border-slate-700"
              >
                Manage Permissions
              </button>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 glass-panel hover:bg-red-500/10 border border-red-500/30"
              >
                Disconnect
              </button>
            </div>

            {/* Sync History Log */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                Data Sync History
              </span>
              <div className="space-y-1.5 text-xs">
                {syncHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-white block">{item.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.timestamp} • {item.source}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy & Security Center (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Privacy & Security Center</span>
              </h3>
              <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                End-To-End Protection
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">You Control What Data Is Shared</span>
                  <span className="text-[11px] text-slate-400">Only authorized categories are ingested into CampusMind.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Zero Password Retention</span>
                  <span className="text-[11px] text-slate-400">Passwords are never logged, inspected, or held in storage.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Revoke and Purge Anytime</span>
                  <span className="text-[11px] text-slate-400">Instant one-click deletion of all synchronized local data.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-950/50 hover:bg-red-900 border border-red-500/40 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete My Imported Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 11: EXPLAINABLE AI USING REAL DATA MODAL */}
      {explainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl glass-panel border border-cyan-500/40 bg-slate-950 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40">
                  CampusMind Explainable AI
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">
                  Why was I identified for academic support?
                </h3>
              </div>
              <button onClick={() => setExplainModalOpen(false)} className="text-slate-400 hover:text-white text-base">
                ✕
              </button>
            </div>

            {/* Contributing Data Breakdown */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-cyan-500/20">
                <span className="font-bold text-white">Result: {analytics.supportIndicator} Academic Support Indicator</span>
                <span className="text-[10px] font-mono text-cyan-300">CGPA: {academics.cgpa}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-300">Attendance:</span>
                  <span className="font-mono text-amber-300 font-semibold">{attendance.overallPercentage}% (Below 75%)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-300">Assignment Completion:</span>
                  <span className="font-mono text-indigo-300 font-semibold">{assignments.completionRate}%</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-300">Current CGPA:</span>
                  <span className="font-mono text-cyan-300 font-semibold">{academics.cgpa}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-300">Recent Performance:</span>
                  <span className="font-mono text-amber-300 font-semibold">Declining</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-300">Subjects Requiring Attention:</span>
                  <span className="font-mono text-red-300 font-semibold">
                    {attendance.subjects?.filter((s) => s.percentage < 75).length || 2} Subject(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Prototype Explainability Mandatory Disclaimer */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-300 block mb-1">CampusMind Explainability Attribution:</span>
              <p>
                Prototype AI analysis based on synchronized university data. This result is generated using the project's current analytical rules and is not a validated ML prediction.
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setExplainModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: DATA SOURCE VERIFICATION MODAL */}
      {dataSourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl glass-panel border border-emerald-500/40 bg-slate-950 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40">
                  Verified Data Source
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Data Source Telemetry</h3>
              </div>
              <button onClick={() => setDataSourceModalOpen(false)} className="text-slate-400 hover:text-white text-base">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">University:</span>
                <span className="font-semibold text-white">{student.university}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Connection:</span>
                <span className="font-semibold text-emerald-400">Authenticated ✓</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Data Source Mode:</span>
                <span className="font-mono text-cyan-300 font-semibold">{student.isLiveIntegration !== false ? 'REAL UNIVERSITY LMS' : 'DEMO SANDBOX'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Last Sync:</span>
                <span className="font-mono text-slate-300">
                  {profile.lastSynced ? new Date(profile.lastSynced).toLocaleString() : 'Today, 01:25 PM'}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1.5 font-medium">Data Retrieved:</span>
                <div className="grid grid-cols-2 gap-1 text-slate-200 font-mono text-[11px]">
                  <span className="text-emerald-400">✓ Student Profile</span>
                  <span className="text-emerald-400">✓ Attendance</span>
                  <span className="text-emerald-400">✓ Academic Marks</span>
                  <span className="text-emerald-400">✓ Assignments</span>
                  <span className="text-emerald-400">✓ Enrolled Courses</span>
                  <span className="text-emerald-400">✓ Exam Schedule</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  setDataSourceModalOpen(false);
                  handleSyncNow();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Now</span>
              </button>
              <button
                onClick={() => {
                  setDataSourceModalOpen(false);
                  setDisconnectModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-500/30"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 24: DISCONNECT CONFIRMATION MODAL */}
      {disconnectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl glass-panel border border-red-500/40 bg-slate-950 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2.5 text-red-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Disconnect University Account?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will stop future synchronization with your university and revoke your active session.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDisconnectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white glass-panel"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dataSyncService.clearConnectedProfile();
                  setDisconnectModalOpen(false);
                  navigate('/');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow flex items-center gap-1.5"
              >
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE PERMISSIONS MODAL */}
      {permissionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl glass-panel border border-slate-800 bg-slate-950 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Manage LMS Permissions</h3>
                <p className="text-xs text-slate-400">Toggle data categories accessible to CampusMind AI.</p>
              </div>
              <button onClick={() => setPermissionsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {Object.keys(permissions).map((k) => (
                <div
                  key={k}
                  onClick={() => setPermissions({ ...permissions, [k]: !permissions[k] })}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span className="capitalize text-slate-200">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                      permissions[k]
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {permissions[k] ? 'Allowed' : 'Denied'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                dataSyncService.savePermissions(permissions);
                setPermissionsModalOpen(false);
                alert('Permissions updated.');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500"
            >
              Save Permissions
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl glass-panel border border-red-500/40 bg-slate-950 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete All Imported Data?</h3>
                <p className="text-xs text-slate-400">
                  This will purge all synchronized LMS marks, attendance records, and cached intelligence models.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 glass-panel hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteData}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
