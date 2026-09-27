import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  Sparkles,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Save,
  CheckCircle2,
  BrainCircuit,
  Sliders,
  Clock,
  Target
} from 'lucide-react';

import studentDataService from '../../services/studentDataService';
import analysisService from '../../services/analysisService';

const CAREER_OPTIONS = [
  'Full Stack Developer',
  'Software Developer',
  'Data Analyst',
  'AI/ML Engineer',
  'Cloud Engineer',
  'Cybersecurity',
  'Other'
];

const COMMON_SKILL_SUGGESTIONS = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js',
  'MongoDB', 'Python', 'Java', 'C++', 'SQL', 'Git/GitHub',
  'Machine Learning', 'Data Analytics', 'Cloud (AWS/GCP)'
];

const COMMON_SUBJECT_SUGGESTIONS = [
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Computer Networks',
  'Operating Systems',
  'Software Engineering',
  'Web Technologies',
  'Java Programming',
  'AI & Machine Learning'
];

export default function AnalyzeFormPage() {
  const navigate = useNavigate();

  // Multi-step: 1 = Basic Info, 2 = Academic Marks, 3 = Attendance, 4 = Assignments, 5 = Skills & Career
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [saveToast, setSaveToast] = useState(false);

  // FORM STATE
  const [formData, setFormData] = useState({
    // Step 1: Basic
    name: '',
    college: '',
    program: '',
    semester: '5',
    academicYear: '2025-2026',
    careerGoal: 'Full Stack Developer',
    customCareerGoal: '',
    weeklyStudyHours: '10',
    currentLearning: '',
    learningGoal: '',
    projects: [],

    // Step 2: Academic Subjects
    subjects: [
      { name: 'Database Management Systems', maxMarks: 100, obtainedMarks: 78 },
      { name: 'Computer Networks', maxMarks: 100, obtainedMarks: 72 },
      { name: 'Data Structures & Algorithms', maxMarks: 100, obtainedMarks: 64 },
      { name: 'Operating Systems', maxMarks: 100, obtainedMarks: 81 }
    ],

    // Step 3: Attendance
    attendanceThreshold: 75,
    attendanceRecords: [
      { subjectName: 'Database Management Systems', totalClasses: 40, attendedClasses: 32 },
      { subjectName: 'Computer Networks', totalClasses: 38, attendedClasses: 23 },
      { subjectName: 'Data Structures & Algorithms', totalClasses: 42, attendedClasses: 34 },
      { subjectName: 'Operating Systems', totalClasses: 36, attendedClasses: 30 }
    ],

    // Step 4: Assignments
    assignments: {
      total: 12,
      completed: 9,
      pending: 3,
      overdue: 1
    },

    // Step 5: Skills
    skills: [
      { name: 'JavaScript', level: 75 },
      { name: 'React', level: 70 },
      { name: 'Node.js', level: 40 },
      { name: 'HTML & Semantic CSS', level: 85 },
      { name: 'SQL', level: 65 }
    ]
  });

  // Load existing data from localStorage on mount if student already saved data
  useEffect(() => {
    const existing = studentDataService.loadStudentData();
    if (existing) {
      setFormData(existing);
    }
  }, []);

  // Sync subjects into attendance table if attendance is empty
  const syncSubjectsToAttendance = () => {
    const updatedAtt = formData.subjects.map((sub) => {
      const existing = formData.attendanceRecords.find(
        (a) => a.subjectName?.toLowerCase() === sub.name?.toLowerCase()
      );
      return existing || { subjectName: sub.name, totalClasses: 40, attendedClasses: 30 };
    });
    setFormData((prev) => ({ ...prev, attendanceRecords: updatedAtt }));
  };

  // Save progress
  const handleSaveProgress = () => {
    studentDataService.saveStudentData(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Reset form
  const handleResetForm = () => {
    if (window.confirm('Reset all entered information? This will clear your current input.')) {
      studentDataService.clearStudentData();
      setFormData({
        name: '',
        college: '',
        program: '',
        semester: '5',
        academicYear: '2025-2026',
        careerGoal: 'Full Stack Developer',
        customCareerGoal: '',
        weeklyStudyHours: '10',
        currentLearning: '',
        learningGoal: '',
        projects: [],
        subjects: [],
        attendanceThreshold: 75,
        attendanceRecords: [],
        assignments: { total: 0, completed: 0, pending: 0, overdue: 0 },
        skills: []
      });
      setCurrentStep(1);
    }
  };

  // Validation per step
  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name.trim().length > 0;
    }
    return true;
  };

  // Step 4 assignment total sync
  const updateAssignmentField = (field, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setFormData((prev) => {
      const current = { ...prev.assignments, [field]: num };
      return { ...prev, assignments: current };
    });
  };

  // Trigger analysis and animated processing sequence
  const handleStartAnalysis = () => {
    // Save to localStorage
    studentDataService.saveStudentData(formData);

    // Run synchronous analysis service
    const actualGoal = formData.careerGoal === 'Other' && formData.customCareerGoal
      ? formData.customCareerGoal
      : formData.careerGoal;

    const academicAnalysis = analysisService.analyzeAcademicPerformance(formData.subjects);
    const attendanceAnalysis = analysisService.analyzeAttendance(
      formData.attendanceRecords,
      formData.attendanceThreshold
    );
    const assignmentAnalysis = analysisService.analyzeAssignments(formData.assignments);
    const skillAnalysis = analysisService.analyzeSkillGaps(formData.skills, actualGoal);
    const indicator = analysisService.calculateAcademicSupportIndicator(
      academicAnalysis,
      attendanceAnalysis,
      assignmentAnalysis,
      skillAnalysis
    );
    const insights = analysisService.generateInsights(formData, {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator
    });
    const recommendations = analysisService.generateRecommendations(formData, {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator
    });
    const studyPlan = analysisService.generateStudyPlan(formData, {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator
    });
    const roadmap = analysisService.generateRoadmap(formData, {
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator
    });

    const analysisResults = {
      student: {
        name: formData.name || 'Student',
        college: formData.college || 'University',
        program: formData.program || 'Degree Program',
        semester: formData.semester || '5',
        academicYear: formData.academicYear || '2025-2026',
        careerGoal: actualGoal,
        weeklyStudyHours: formData.weeklyStudyHours || '10',
        currentLearning: formData.currentLearning,
        learningGoal: formData.learningGoal,
        projects: formData.projects || []
      },
      academic: academicAnalysis,
      attendance: attendanceAnalysis,
      assignments: assignmentAnalysis,
      skills: skillAnalysis,
      indicator,
      insights,
      recommendations,
      studyPlan,
      roadmap
    };

    // Store in localStorage
    studentDataService.saveAnalysisResults(analysisResults);

    // Launch processing animation
    setIsProcessing(true);
  };

  // Processing Animation Steps
  const processingPhases = [
    'Collecting Student Data',
    'Validating Information',
    'Analyzing Academic Performance',
    'Analyzing Attendance',
    'Analyzing Assignments',
    'Analyzing Skills',
    'Identifying Skill Gaps',
    'Generating Personalized Recommendations',
    'Preparing Your Dashboard'
  ];

  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => {
      setProcessingStepIndex((prev) => {
        if (prev < processingPhases.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/my-analysis');
          }, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isProcessing, navigate, processingPhases.length]);

  // LIVE CALCULATIONS FOR STEP SUMMARIES
  const liveAcademic = analysisService.analyzeAcademicPerformance(formData.subjects);
  const liveAttendance = analysisService.analyzeAttendance(
    formData.attendanceRecords,
    formData.attendanceThreshold
  );
  const liveSkillAnalysis = analysisService.analyzeSkillGaps(
    formData.skills,
    formData.careerGoal === 'Other' && formData.customCareerGoal ? formData.customCareerGoal : formData.careerGoal
  );

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Navigation & Mode Indicator */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Personal Analysis Mode</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveProgress}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Save Progress</span>
            </button>
            <button
              onClick={handleResetForm}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-xs text-slate-400 hover:text-rose-300 transition-colors"
              title="Reset Form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Save Notification Toast */}
        {saveToast && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Information saved to browser storage. You can resume anytime.</span>
          </div>
        )}

        {/* Multi-Step Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Step {currentStep} of 5</span>
            <span className="text-cyan-400 font-semibold">
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Academic Performance'}
              {currentStep === 3 && 'Biometric Attendance'}
              {currentStep === 4 && 'Coursework & Assignments'}
              {currentStep === 5 && 'Skills & Career Alignment'}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Step Pill Buttons */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-3">
            {[
              { num: 1, label: 'Profile', icon: User },
              { num: 2, label: 'Academics', icon: BookOpen },
              { num: 3, label: 'Attendance', icon: CalendarCheck },
              { num: 4, label: 'Assignments', icon: CheckSquare },
              { num: 5, label: 'Skills & Goal', icon: Target }
            ].map((step) => {
              const Icon = step.icon;
              const isCurrent = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`py-2 px-1 sm:px-3 rounded-xl border text-center text-xs flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : isDone
                      ? 'bg-slate-900/80 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline font-medium truncate">{step.label}</span>
                  <span className="sm:hidden font-mono text-[10px]">{step.num}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl shadow-2xl relative min-h-[460px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: BASIC INFORMATION */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    <span>Student Profile & Career Target</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your academic profile and selected career destination. No sensitive personal documents required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Full Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      College / University
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., National Institute of Technology"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Course / Program
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., BCA / B.Tech Computer Science"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Current Semester
                      </label>
                      <select
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s} className="bg-slate-900 text-white">
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        value={formData.academicYear}
                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Career Goal Dropdown */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Target Career Goal <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={formData.careerGoal}
                    onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    {CAREER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>

                  {formData.careerGoal === 'Other' && (
                    <div className="mt-3">
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Specify Your Career Goal
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Embedded Systems Engineer / Game Developer"
                        value={formData.customCareerGoal}
                        onChange={(e) => setFormData({ ...formData, customCareerGoal: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}
                </div>

                {/* Optional Additional Profile Info */}
                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block mb-3">
                    Optional Profile Context (Used for Custom Study Plan)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dedicated Weekly Study Time</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={formData.weeklyStudyHours}
                          onChange={(e) => setFormData({ ...formData, weeklyStudyHours: e.target.value })}
                          className="w-24 px-3 py-2 rounded-xl glass-input text-xs text-white text-center focus:outline-none focus:border-cyan-500"
                        />
                        <span className="text-xs text-slate-400">hours / week</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">
                        Currently Learning / Enrolled Courses
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., React, Express, Python"
                        value={formData.currentLearning}
                        onChange={(e) => setFormData({ ...formData, currentLearning: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ACADEMIC PERFORMANCE */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-cyan-400" />
                      <span>Academic Performance & Subjects</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Add the courses/subjects you are currently studying along with obtained marks.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        subjects: [
                          ...prev.subjects,
                          { name: `Subject ${prev.subjects.length + 1}`, maxMarks: 100, obtainedMarks: 75 }
                        ]
                      }));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subject</span>
                  </button>
                </div>

                {/* Quick Add Suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Quick Add:</span>
                  {COMMON_SUBJECT_SUGGESTIONS.map((subj) => (
                    <button
                      key={subj}
                      onClick={() => {
                        if (!formData.subjects.some((s) => s.name.toLowerCase() === subj.toLowerCase())) {
                          setFormData((prev) => ({
                            ...prev,
                            subjects: [...prev.subjects, { name: subj, maxMarks: 100, obtainedMarks: 75 }]
                          }));
                        }
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors"
                    >
                      + {subj}
                    </button>
                  ))}
                </div>

                {/* Subjects Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Subject Name</th>
                        <th className="py-2.5 px-3 w-28 text-center">Max Marks</th>
                        <th className="py-2.5 px-3 w-32 text-center">Obtained Marks</th>
                        <th className="py-2.5 px-3 w-24 text-center">Score %</th>
                        <th className="py-2.5 px-3 w-16 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {formData.subjects.map((sub, idx) => {
                        const max = Number(sub.maxMarks) || 100;
                        const obt = Number(sub.obtainedMarks) || 0;
                        const pct = Math.round((obt / max) * 100);

                        return (
                          <tr key={idx} className="hover:bg-slate-800/20">
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={sub.name}
                                onChange={(e) => {
                                  const updated = [...formData.subjects];
                                  updated[idx].name = e.target.value;
                                  setFormData({ ...formData, subjects: updated });
                                }}
                                className="w-full bg-transparent border-b border-slate-700/60 text-white focus:border-cyan-400 focus:outline-none py-1 text-xs"
                                placeholder="e.g. Operating Systems"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                min="1"
                                max="1000"
                                value={sub.maxMarks}
                                onChange={(e) => {
                                  const updated = [...formData.subjects];
                                  updated[idx].maxMarks = e.target.value;
                                  setFormData({ ...formData, subjects: updated });
                                }}
                                className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-center text-white focus:border-cyan-400 focus:outline-none text-xs"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max={sub.maxMarks}
                                value={sub.obtainedMarks}
                                onChange={(e) => {
                                  const updated = [...formData.subjects];
                                  updated[idx].obtainedMarks = e.target.value;
                                  setFormData({ ...formData, subjects: updated });
                                }}
                                className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-center text-white focus:border-cyan-400 focus:outline-none text-xs"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`font-mono font-bold px-2 py-0.5 rounded ${
                                  pct >= 75
                                    ? 'text-emerald-400 bg-emerald-950/40'
                                    : pct >= 55
                                    ? 'text-amber-400 bg-amber-950/40'
                                    : 'text-rose-400 bg-rose-950/40'
                                }`}
                              >
                                {pct}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  const updated = formData.subjects.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, subjects: updated });
                                }}
                                className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                                title="Remove Subject"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {formData.subjects.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-slate-500">
                            No subjects added yet. Click &quot;Add Subject&quot; or choose from quick recommendations.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Live Academic Summary Banner */}
                {liveAcademic.hasData && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Overall Average</span>
                      <span className="text-base font-extrabold text-cyan-400 font-mono">
                        {liveAcademic.overallPercentage}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Average Marks</span>
                      <span className="text-base font-bold text-white font-mono">
                        {liveAcademic.averageMarks}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Highest Subject</span>
                      <span className="text-xs font-semibold text-emerald-400 truncate block">
                        {liveAcademic.highestSubject?.name} ({liveAcademic.highestSubject?.percentage}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Lowest Subject</span>
                      <span className="text-xs font-semibold text-rose-400 truncate block">
                        {liveAcademic.lowestSubject?.name} ({liveAcademic.lowestSubject?.percentage}%)
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: ATTENDANCE */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <CalendarCheck className="w-5 h-5 text-cyan-400" />
                      <span>Subject-Wise Attendance</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Enter lecture & lab attendance per course. Clearance requirement is dynamically calculated.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={syncSubjectsToAttendance}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                      title="Import subject names from Step 2"
                    >
                      Sync from Subjects
                    </button>
                    <button
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          attendanceRecords: [
                            ...prev.attendanceRecords,
                            { subjectName: `Subject ${prev.attendanceRecords.length + 1}`, totalClasses: 40, attendedClasses: 30 }
                          ]
                        }));
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>
                  </div>
                </div>

                {/* Configurable Threshold Bar */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Configured Minimum Examination Target:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="50"
                      max="95"
                      value={formData.attendanceThreshold}
                      onChange={(e) => setFormData({ ...formData, attendanceThreshold: Number(e.target.value) || 75 })}
                      className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-center text-cyan-400 font-mono font-bold text-xs"
                    />
                    <span className="font-mono text-slate-400">%</span>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3 w-28 text-center">Total Classes</th>
                        <th className="py-2.5 px-3 w-28 text-center">Classes Attended</th>
                        <th className="py-2.5 px-3 w-24 text-center">Attendance %</th>
                        <th className="py-2.5 px-3 w-32 text-center">Status</th>
                        <th className="py-2.5 px-3 w-16 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {formData.attendanceRecords.map((rec, idx) => {
                        const tot = Number(rec.totalClasses) || 0;
                        const att = Number(rec.attendedClasses) || 0;
                        const pct = tot > 0 ? Math.round((att / tot) * 100) : 0;
                        const isHealthy = pct >= formData.attendanceThreshold;
                        const isCritical = pct < 60;

                        return (
                          <tr key={idx} className="hover:bg-slate-800/20">
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={rec.subjectName}
                                onChange={(e) => {
                                  const updated = [...formData.attendanceRecords];
                                  updated[idx].subjectName = e.target.value;
                                  setFormData({ ...formData, attendanceRecords: updated });
                                }}
                                className="w-full bg-transparent border-b border-slate-700/60 text-white focus:border-cyan-400 focus:outline-none py-1 text-xs"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                min="1"
                                max="200"
                                value={rec.totalClasses}
                                onChange={(e) => {
                                  const updated = [...formData.attendanceRecords];
                                  updated[idx].totalClasses = e.target.value;
                                  setFormData({ ...formData, attendanceRecords: updated });
                                }}
                                className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-center text-white focus:outline-none text-xs"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max={rec.totalClasses}
                                value={rec.attendedClasses}
                                onChange={(e) => {
                                  const updated = [...formData.attendanceRecords];
                                  updated[idx].attendedClasses = e.target.value;
                                  setFormData({ ...formData, attendanceRecords: updated });
                                }}
                                className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-center text-white focus:outline-none text-xs"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold">
                              <span className={isHealthy ? 'text-emerald-400' : isCritical ? 'text-rose-400' : 'text-amber-400'}>
                                {pct}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                  isHealthy
                                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                                    : isCritical
                                    ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                                    : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                {isHealthy ? 'Healthy' : isCritical ? 'Critical' : 'Needs Attention'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  const updated = formData.attendanceRecords.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, attendanceRecords: updated });
                                }}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {formData.attendanceRecords.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-500">
                            No attendance records entered. Click &quot;Sync from Subjects&quot; or &quot;Add Row&quot;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Attendance Live Status Summary */}
                {liveAttendance.hasData && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Overall Attendance</span>
                      <span className="text-base font-extrabold text-cyan-400 font-mono">
                        {liveAttendance.overallAttendance}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Status</span>
                      <span
                        className={`text-xs font-bold ${
                          liveAttendance.status === 'Healthy'
                            ? 'text-emerald-400'
                            : liveAttendance.status === 'Critical'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {liveAttendance.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Above Target (≥{liveAttendance.threshold}%)</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {liveAttendance.aboveTargetCount} Subjects
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Below Target (&lt;{liveAttendance.threshold}%)</span>
                      <span className="text-xs font-bold text-rose-400">
                        {liveAttendance.belowTargetCount} Subjects
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: ASSIGNMENTS */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-cyan-400" />
                    <span>Assignments & Continuous Assessment</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the count of semester assignments. If no assignments have been assigned yet, leave total as 0.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <label className="text-xs text-slate-400 block mb-1">Total Assigned</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.assignments.total}
                      onChange={(e) => updateAssignmentField('total', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-lg font-bold font-mono text-white text-center focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                    <label className="text-xs text-emerald-300 block mb-1">Completed / Submitted</label>
                    <input
                      type="number"
                      min="0"
                      max={formData.assignments.total}
                      value={formData.assignments.completed}
                      onChange={(e) => updateAssignmentField('completed', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-lg font-bold font-mono text-emerald-400 text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
                    <label className="text-xs text-amber-300 block mb-1">Pending Submissions</label>
                    <input
                      type="number"
                      min="0"
                      max={formData.assignments.total}
                      value={formData.assignments.pending}
                      onChange={(e) => updateAssignmentField('pending', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-lg font-bold font-mono text-amber-400 text-center focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30">
                    <label className="text-xs text-rose-300 block mb-1">Overdue Tasks</label>
                    <input
                      type="number"
                      min="0"
                      max={formData.assignments.total}
                      value={formData.assignments.overdue}
                      onChange={(e) => updateAssignmentField('overdue', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-lg font-bold font-mono text-rose-400 text-center focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Assignment Completion Progress Bar & Insights */}
                {Number(formData.assignments.total) > 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">Assignment Completion Rate</span>
                      <span className="font-mono font-bold text-cyan-400 text-sm">
                        {Math.round((formData.assignments.completed / formData.assignments.total) * 100)}%
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((formData.assignments.completed / formData.assignments.total) * 100)
                          )}%`
                        }}
                      />
                    </div>

                    <p className="text-xs text-slate-400">
                      You have submitted <strong className="text-slate-200">{formData.assignments.completed}</strong> of{' '}
                      <strong className="text-slate-200">{formData.assignments.total}</strong> assignments.
                      {formData.assignments.overdue > 0 && (
                        <span className="text-rose-400 font-semibold ml-1">
                          Action required: {formData.assignments.overdue} overdue task(s).
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
                    No assignment data available. If you have coursework, enter your total assignments above.
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: SKILLS & CAREER */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span>Skills & Career Alignment</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your current technical competencies. We benchmark them against{' '}
                    <strong className="text-cyan-400">{formData.careerGoal}</strong> expectations.
                  </p>
                </div>

                {/* Quick Add Skill Chips */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                    Quick Add Common Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SKILL_SUGGESTIONS.map((skillName) => {
                      const exists = formData.skills.some(
                        (s) => s.name.toLowerCase() === skillName.toLowerCase()
                      );
                      return (
                        <button
                          key={skillName}
                          disabled={exists}
                          onClick={() => {
                            if (!exists) {
                              setFormData((prev) => ({
                                ...prev,
                                skills: [...prev.skills, { name: skillName, level: 60 }]
                              }));
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                            exists
                              ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
                          }`}
                        >
                          + {skillName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Student Skills with Slider & Level Buttons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Your Selected Skills ({formData.skills.length})
                    </span>
                    <button
                      onClick={() => {
                        const name = window.prompt('Enter skill name:');
                        if (name && name.trim()) {
                          setFormData((prev) => ({
                            ...prev,
                            skills: [...prev.skills, { name: name.trim(), level: 50 }]
                          }));
                        }
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Custom Skill</span>
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {formData.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="w-full sm:w-48 font-medium text-white truncate flex items-center justify-between sm:justify-start gap-2">
                          <span>{skill.name}</span>
                          <span className="font-mono text-cyan-400 font-bold sm:hidden">{skill.level}%</span>
                        </div>

                        {/* Slider and Quick Preset Buttons */}
                        <div className="flex items-center gap-3 flex-1 max-w-sm">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => {
                              const updated = [...formData.skills];
                              updated[idx].level = Number(e.target.value);
                              setFormData({ ...formData, skills: updated });
                            }}
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                          <span className="font-mono text-cyan-400 w-10 text-right font-bold hidden sm:inline">
                            {skill.level}%
                          </span>
                        </div>

                        {/* Quick Level Preset Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {['Beginner', 'Intermediate', 'Advanced'].map((tier) => {
                            const val = tier === 'Beginner' ? 30 : tier === 'Intermediate' ? 65 : 90;
                            const isSelected = Math.abs(skill.level - val) <= 15;
                            return (
                              <button
                                key={tier}
                                onClick={() => {
                                  const updated = [...formData.skills];
                                  updated[idx].level = val;
                                  setFormData({ ...formData, skills: updated });
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                                  isSelected
                                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                                }`}
                              >
                                {tier[0]}
                              </button>
                            );
                          })}

                          <button
                            onClick={() => {
                              const updated = formData.skills.filter((_, i) => i !== idx);
                              setFormData({ ...formData, skills: updated });
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1 ml-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {formData.skills.length === 0 && (
                      <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                        No skills selected yet. Click the quick suggestions above to add your technologies.
                      </div>
                    )}
                  </div>
                </div>

                {/* Career Target Benchmark Live Preview */}
                {liveSkillAnalysis.hasData && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">
                        Live Role Readiness Index ({formData.careerGoal}):
                      </span>
                      <span className="font-mono font-bold text-base text-cyan-400">
                        {liveSkillAnalysis.readinessPercentage}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Evaluated against {liveSkillAnalysis.skills.length} target competencies. Identified{' '}
                      <strong className="text-rose-400">{liveSkillAnalysis.highPriorityCount} high priority skill gaps</strong>{' '}
                      and <strong className="text-emerald-400">{liveSkillAnalysis.masteredCount} mastered skills</strong>.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                disabled={!canProceed()}
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20 hover:from-cyan-500 hover:to-blue-500'
                    : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                }`}
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleStartAnalysis}
                className="px-6 py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <BrainCircuit className="w-4 h-4 animate-pulse" />
                <span>Analyze My Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VISUAL PROTOTYPE PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-[#050814]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-cyan-500/30 text-center space-y-6 shadow-2xl">
            <div className="relative flex items-center justify-center mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-400 border-r-purple-400 animate-spin" />
              <BrainCircuit className="w-7 h-7 text-cyan-400 absolute animate-pulse" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Visual Prototype Processing
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Analyzing Student Telemetry</h3>
              <p className="text-xs text-slate-400 mt-1">
                Applying transparent evaluation rules and career benchmarks...
              </p>
            </div>

            {/* Step Sequence List */}
            <div className="space-y-2 text-left bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
              {processingPhases.map((phase, idx) => {
                const isPassed = idx < processingStepIndex;
                const isCurrent = idx === processingStepIndex;
                return (
                  <div
                    key={phase}
                    className={`flex items-center gap-2 transition-opacity ${
                      isCurrent
                        ? 'text-cyan-300 font-bold opacity-100'
                        : isPassed
                        ? 'text-emerald-400 opacity-80'
                        : 'text-slate-600 opacity-40'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-3.5 h-3.5 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      </span>
                    ) : (
                      <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px]">○</span>
                    )}
                    <span>{phase}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-500">
              * Prototype evaluation uses student-entered data. No black-box machine learning claims.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
