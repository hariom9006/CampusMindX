import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BrainCircuit,
  Lock,
  Cloud,
  FileText,
  Layers,
  RefreshCw,
  Info,
  Check,
  Sliders,
  ExternalLink,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

import { SUPPORTED_UNIVERSITIES } from '../../data/demoUniversityData';
import dataSyncService, { DEFAULT_PERMISSIONS } from '../../services/dataSyncService';
import { ICloudConnector, SAMPLE_CLOUD_DOCUMENTS } from '../../integrations/cloud/iCloudConnector';

export default function ConnectUniversityPage() {
  const navigate = useNavigate();

  // Workflow steps: 1 = Select University & ID, 2 = Permissions, 3 = Live Sync Animation, 4 = Optional Cloud Documents
  const [step, setStep] = useState(1);

  // University Selection State
  const [selectedUniversityId, setSelectedUniversityId] = useState('galgotias');
  const [studentId, setStudentId] = useState('24BCA1089');
  const [authMethod, setAuthMethod] = useState('university_sso');

  // Permissions State
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  // Syncing Animation State
  const [syncStepIndex, setSyncStepIndex] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCompleted, setSyncCompleted] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [authenticatedStudent, setAuthenticatedStudent] = useState(null);

  // Cloud / Document Intelligence State
  const [cloudConnected, setCloudConnected] = useState(false);
  const [selectedCloudDoc, setSelectedCloudDoc] = useState(null);
  const [parsedDocResult, setParsedDocResult] = useState(null);
  const [isParsingDoc, setIsParsingDoc] = useState(false);

  const selectedUniv =
    SUPPORTED_UNIVERSITIES.find((u) => u.id === selectedUniversityId) || SUPPORTED_UNIVERSITIES[0];

  const syncStages = [
    'Connecting to University LMS',
    'Authenticating Session Token',
    'Fetching Academic Records',
    'Fetching Attendance Telemetry',
    'Fetching Coursework & Assignments',
    'Fetching Course Information',
    'Organizing & Normalizing Data',
    'Running CampusMind AI Analysis'
  ];

  const checklistItems = [
    { label: 'Academic Data', key: 'academicResults' },
    { label: 'Attendance Telemetry', key: 'attendance' },
    { label: 'Coursework & Assignments', key: 'assignments' },
    { label: 'Course Information', key: 'courses' },
    { label: 'Examinations Schedule', key: 'examinations' },
    { label: 'Industry Skills & Badges', key: 'skills' },
    { label: 'Academic Documents', key: 'academicDocuments' }
  ];

  // Handler: Toggle Permission Checkbox
  const handleTogglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleUniversityChange = (id) => {
    setSelectedUniversityId(id);
    const univ = SUPPORTED_UNIVERSITIES.find((u) => u.id === id);
    if (univ?.defaultStudentId) {
      setStudentId(univ.defaultStudentId);
    }
  };

  // Handler: Start Real Sync Sequence
  const handleStartSync = async () => {
    setStep(3);
    setIsSyncing(true);
    setSyncStepIndex(0);
    setSyncCompleted(false);
    setSyncError(null);

    // Call real synchronization service
    const syncPromise = dataSyncService.performRealSync({
      universityId: selectedUniversityId,
      studentId,
      authMethod,
      permissions
    });

    const interval = setInterval(() => {
      setSyncStepIndex((prev) => {
        if (prev < syncStages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          syncPromise
            .then((normalized) => {
              setAuthenticatedStudent(normalized.student);
              setIsSyncing(false);
              setSyncCompleted(true);
            })
            .catch((err) => {
              setIsSyncing(false);
              setSyncError(err.message || 'Synchronization failed');
            });
          return prev;
        }
      });
    }, 450);
  };

  // Handler: Connect iCloud / Cloud Simulation
  const handleConnectCloud = async () => {
    const cloud = new ICloudConnector();
    await cloud.connect('Apple iCloud Drive');
    setCloudConnected(true);
  };

  // Handler: Parse Cloud Document
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
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP BRAND HEADER */}
        <div className="glass-panel rounded-[24px] p-5 border border-emerald-100 bg-white/95 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                  Connected LMS Mode
                </span>
                <span className="text-xs text-slate-500 font-medium">OAuth 2.0 / SSO Integration</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                Connect Your University Account
              </h1>
              <p className="text-xs text-slate-400">
                Authorize official academic records, continuous attendance, and task feeds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Link
              to="/analyze"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800 transition-colors"
            >
              Manual Entry Mode
            </Link>
            <Link
              to="/student"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 transition-colors"
            >
              Explore Demo
            </Link>
          </div>
        </div>

        {/* STEP PROGRESS TRACKER */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 bg-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between text-xs font-medium mb-3">
            {[
              { num: 1, label: 'University Selection' },
              { num: 2, label: 'Data Permissions' },
              { num: 3, label: 'Sync & Normalization' }
            ].map((st) => (
              <div
                key={st.num}
                className={`flex items-center gap-2 ${
                  step === st.num
                    ? 'text-cyan-400 font-bold'
                    : step > st.num
                    ? 'text-slate-300'
                    : 'text-slate-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono ${
                    step === st.num
                      ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : step > st.num
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step > st.num ? '✓' : st.num}
                </span>
                <span>{st.label}</span>
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 bg-slate-900/70 shadow-2xl relative min-h-[460px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: UNIVERSITY & LMS SELECTION */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    <span>Select University & Authentication Method</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Connect your institution's official ERP, Moodle, or student portal.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Select University / Institution *
                    </label>
                    <select
                      value={selectedUniversityId}
                      onChange={(e) => handleUniversityChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      {SUPPORTED_UNIVERSITIES.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} — {u.status === 'unsupported' ? '⚠️ [Unsupported]' : u.isLive ? '● [Official API/SSO]' : '⚡ [Demo Sandbox]'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Unsupported University Alert Block (Section 20 requirement) */}
                  {selectedUniv.status === 'unsupported' ? (
                    <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-3">
                      <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>Integration Unavailable</span>
                      </div>
                      <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                        This university does not currently provide a supported integration for CampusMind X.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2.5">
                        <Link
                          to="/analyze"
                          className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 flex items-center gap-1.5 shadow"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Manual Data Entry</span>
                        </Link>
                        <button
                          onClick={() => {
                            const el = document.getElementById('cloud-upload-drawer');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 flex items-center gap-1.5"
                        >
                          <Cloud className="w-3.5 h-3.5 text-blue-400" />
                          <span>Upload Academic Documents</span>
                        </button>
                        <button
                          onClick={() => handleUniversityChange('galgotias')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 hover:bg-emerald-900 flex items-center gap-1.5"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Try Supported University (Galgotias / DU)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* University LMS details card */
                    <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                      selectedUniv.isLive
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : 'bg-purple-950/30 border-purple-500/40'
                    }`}>
                      <img
                        src={selectedUniv.logo}
                        alt={selectedUniv.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{selectedUniv.name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            selectedUniv.isLive
                              ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40'
                              : 'bg-purple-900/60 text-purple-300 border-purple-500/40'
                          }`}>
                            {selectedUniv.isLive ? '● Live University Integration' : 'Demo Sandbox'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{selectedUniv.description}</p>
                        <span className="text-[11px] font-mono text-cyan-400 block pt-0.5">
                          Auth Protocol: {selectedUniv.authType}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedUniv.status !== 'unsupported' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Student Admission ID / Enrollment ID *
                        </label>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                          placeholder="e.g. 24BCA1089"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Authentication Method
                        </label>
                        <select
                          value={authMethod}
                          onChange={(e) => setAuthMethod(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                        >
                          <option value="university_sso">Official University SSO (Single Sign-On)</option>
                          <option value="oauth2">OAuth 2.0 Identity Token</option>
                          {selectedUniv.id === 'demo_lms' && (
                            <option value="demo_connector">Demo Connector (Simulated LMS)</option>
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Privacy & Security Note */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">
                      Security-First Credential Protection:
                    </span>
                    <span>
                      The password must NEVER be stored in localStorage, sessionStorage, frontend source code, browser logs, or analytics. CampusMind X redirects through official university SSO or tokenized handshake.
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={selectedUniv.status === 'unsupported'}
                    onClick={() => setStep(2)}
                    className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      selectedUniv.status === 'unsupported'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md'
                    }`}
                  >
                    <span>{selectedUniv.status === 'unsupported' ? 'Integration Unavailable' : 'Continue Securely'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATA PERMISSIONS SCREEN */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span>Choose What CampusMind Can Access</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    CampusMind only imports the information you authorize. You can disconnect or revoke access anytime.
                  </p>
                </div>

                {/* Permission Checkboxes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'academicResults', label: 'Academic Results & Semester Marks', desc: 'Grades, subject totals, CGPA history' },
                    { key: 'attendance', label: 'Attendance Telemetry', desc: 'Lecture attendance, condonation clearance' },
                    { key: 'assignments', label: 'Assignments & Coursework', desc: 'Completed, pending, and overdue submissions' },
                    { key: 'courses', label: 'Course Catalog & Syllabus', desc: 'Enrolled courses, curriculum credits' },
                    { key: 'examinations', label: 'Examination Schedule', desc: 'Upcoming mid-term and practical exam dates' },
                    { key: 'internalMarks', label: 'Internal Assessment Breakdown', desc: 'Quizzes, laboratory tests, class tests' },
                    { key: 'skills', label: 'Skills & Certifications', desc: 'Verified badges and credentials' },
                    { key: 'academicDocuments', label: 'Academic Documents & Transcripts', desc: 'Official marksheet and project PDFs' },
                    { key: 'personalFiles', label: 'Personal Files (Cloud/Device)', desc: 'General non-academic documents (Disabled by default)' }
                  ].map((item) => (
                    <div
                      key={item.key}
                      onClick={() => handleTogglePermission(item.key)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        permissions[item.key]
                          ? 'bg-cyan-950/40 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                          permissions[item.key]
                            ? 'bg-cyan-600 border-cyan-500 text-white'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {permissions[item.key] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span
                          className={`font-semibold text-xs block ${
                            permissions[item.key] ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white glass-panel hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('/')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartSync}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md flex items-center gap-2"
                    >
                      <span>Allow & Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: AUTOMATIC DATA FETCHING & SYNCHRONIZATION */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center max-w-md mx-auto space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                    <RefreshCw className={`w-7 h-7 ${isSyncing ? 'animate-spin' : ''}`} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Syncing Your Academic Data</h2>
                  <p className="text-xs text-slate-400">
                    Connecting to {selectedUniv.name} via authorized session token...
                  </p>
                </div>

                {/* Animated Pipeline Stage Monitor */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 max-w-lg mx-auto text-xs">
                  {syncStages.map((stage, idx) => {
                    const isDone = idx < syncStepIndex || syncCompleted;
                    const isCurrent = idx === syncStepIndex && isSyncing;
                    return (
                      <div
                        key={stage}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-cyan-950/80 border border-cyan-500/40 text-white font-semibold'
                            : isDone
                            ? 'text-cyan-300/80'
                            : 'text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                          )}
                          <span>{stage}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {isDone ? '✓' : isCurrent ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Live Checklist Items */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-xl mx-auto">
                  {checklistItems.map((chk) => {
                    const isAuthorized = permissions[chk.key] !== false;
                    return (
                      <div
                        key={chk.key}
                        className={`p-2.5 rounded-xl border text-center text-[11px] ${
                          syncCompleted && isAuthorized
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : isAuthorized
                            ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                            : 'bg-slate-950/40 border-slate-900 text-slate-600'
                        }`}
                      >
                        <span className="block font-medium truncate">{chk.label}</span>
                        <span className="font-mono text-[10px] block mt-0.5">
                          {syncCompleted && isAuthorized ? '✓ Synchronized' : isAuthorized ? 'Fetching' : 'Excluded'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Post-Sync Confirmation & Navigation */}
                {syncCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-cyan-950/60 border border-emerald-500/40 text-center space-y-4 pt-4 max-w-lg mx-auto"
                  >
                    <span className="text-xs font-mono uppercase text-emerald-400 font-bold block">
                      Synchronization Complete
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Your academic profile has been synchronized.
                    </h3>
                    <p className="text-xs text-slate-300">
                      CampusMind AI has retrieved and validated your actual academic records directly from the university gateway.
                    </p>

                    {/* Authenticated Student Identity Card */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/40 text-left space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                            Authenticated Student
                          </span>
                          <span className="text-base font-bold text-white">
                            {authenticatedStudent?.name || (selectedUniv.isLive ? 'Rahul Kumar' : 'Hariom Anand')}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                          authenticatedStudent?.isLiveIntegration !== false
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                        }`}>
                          {authenticatedStudent?.isLiveIntegration !== false ? '● LIVE UNIVERSITY DATA' : '● DEMO SANDBOX'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block">Admission ID:</span>
                          <span className="font-mono font-semibold text-white">{authenticatedStudent?.admissionId || studentId}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block">Program:</span>
                          <span className="font-semibold text-white">{authenticatedStudent?.program || 'BCA (Semester 5)'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block">University:</span>
                          <span className="font-semibold text-emerald-300">{authenticatedStudent?.university || selectedUniv.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block">Authentication:</span>
                          <span className="font-semibold text-cyan-300">Official SSO Token Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => navigate('/connected-intelligence')}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-md flex items-center justify-center gap-2"
                      >
                        <span>View My AI Analysis</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {syncError && (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center max-w-lg mx-auto">
                    {syncError}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* OPTIONAL CLOUD & iCLOUD INTEGRATION DRAWER */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-950/80 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Connect Cloud Storage (iCloud, Drive, OneDrive)</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Optional
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Authorize academic documents (marksheets, certifications) for AI document parsing.
                </p>
              </div>
            </div>

            {!cloudConnected ? (
              <button
                onClick={handleConnectCloud}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Simulate Cloud Connection</span>
              </button>
            ) : (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>iCloud Authorized (Demo)</span>
              </span>
            )}
          </div>

          {/* Cloud Documents List if connected */}
          {cloudConnected && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Authorized Cloud Documents Ready for AI Parser:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_CLOUD_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                        <span>{doc.category}</span>
                        <span>{doc.fileSize}</span>
                      </div>
                      <span className="font-semibold text-white block mt-1 truncate">{doc.fileName}</span>
                    </div>

                    <button
                      onClick={() => handleParseDocument(doc)}
                      className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Parse with AI</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Intelligence Extracted Data Modal */}
          {parsedDocResult && (
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2.5 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Document Intelligence Parsed: {parsedDocResult.fileName}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Confidence: {Math.round(parsedDocResult.confidenceScore * 100)}%
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">{parsedDocResult.message}</p>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-200 overflow-x-auto">
                {JSON.stringify(parsedDocResult.extractedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
