import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
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
  Search,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';

import facultyDataService, { DEFAULT_FACULTY_CLASS_TEMPLATE } from '../../services/facultyDataService';
import facultyAnalysisService from '../../services/facultyAnalysisService';

export default function FacultyAnalyzeFormPage() {
  const navigate = useNavigate();

  // Multi-step: 1 = Faculty & Class, 2 = Student Roster, 3 = Assessment Marks, 4 = Attendance & Assignments, 5 = Skills & Config
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState(() => {
    const saved = facultyDataService.loadFacultyData();
    return saved || DEFAULT_FACULTY_CLASS_TEMPLATE;
  });

  // Search & Filter for students in steps
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAttentionOnly, setFilterAttentionOnly] = useState(false);

  // Processing animation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);

  const processingPhases = [
    'Collecting Class Data',
    'Validating Student Records',
    'Analyzing Performance',
    'Analyzing Attendance',
    'Analyzing Assignments',
    'Identifying Students Requiring Attention',
    'Detecting Class-Level Patterns',
    'Generating Faculty Recommendations',
    'Preparing Intelligence Dashboard'
  ];

  // Save changes to localStorage
  const handleSaveDraft = () => {
    facultyDataService.saveFacultyData(formData);
    alert('Class analysis draft saved to local browser storage.');
  };

  // Reset to default sample
  const handleResetToSample = () => {
    if (window.confirm('Reset all entered class data to the default template?')) {
      setFormData(DEFAULT_FACULTY_CLASS_TEMPLATE);
      facultyDataService.saveFacultyData(DEFAULT_FACULTY_CLASS_TEMPLATE);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // Student Roster Helpers
  const handleAddStudent = () => {
    const newId = `STU-0${formData.students.length + 1}`;
    const newStudent = {
      id: newId,
      name: `Student ${formData.students.length + 1}`,
      rollNo: `22BCA10${40 + formData.students.length + 1}`,
      quizMarks: 15,
      midTermMarks: 30,
      assignmentMarks: 18,
      practicalMarks: 18,
      externalMarks: 60,
      totalMarks: 72,
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 38,
      totalAssignments: 8,
      completedAssignments: 6,
      pendingAssignments: 2,
      overdueAssignments: 0,
      skills: [
        { name: 'Core Concepts', level: 70 },
        { name: 'Practical Labs', level: 65 }
      ]
    };

    setFormData((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
      facultyInfo: {
        ...prev.facultyInfo,
        numberOfStudents: prev.students.length + 1
      }
    }));
  };

  const handleRemoveStudent = (id) => {
    if (formData.students.length <= 1) {
      alert('Class must contain at least one student record.');
      return;
    }
    setFormData((prev) => {
      const updated = prev.students.filter((s) => s.id !== id);
      return {
        ...prev,
        students: updated,
        facultyInfo: {
          ...prev.facultyInfo,
          numberOfStudents: updated.length
        }
      };
    });
  };

  const handleUpdateStudentField = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      students: prev.students.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: value };

        // Auto-recalculate totalMarks if internal/external marks change
        if (['quizMarks', 'midTermMarks', 'assignmentMarks', 'practicalMarks', 'externalMarks'].includes(field)) {
          const internal =
            (Number(field === 'quizMarks' ? value : updated.quizMarks) || 0) +
            (Number(field === 'midTermMarks' ? value : updated.midTermMarks) || 0) +
            (Number(field === 'assignmentMarks' ? value : updated.assignmentMarks) || 0) +
            (Number(field === 'practicalMarks' ? value : updated.practicalMarks) || 0);
          const external = Number(field === 'externalMarks' ? value : updated.externalMarks) || 0;
          updated.totalMarks = internal + external;
        }

        return updated;
      })
    }));
  };

  // Start analysis pipeline
  const handleStartAnalysis = () => {
    if (formData.students.length === 0) {
      alert('Please enter at least one student before analyzing.');
      return;
    }

    // Save data and execute full analysis
    facultyDataService.saveFacultyData(formData);
    const results = facultyAnalysisService.runFullFacultyAnalysis(formData);
    facultyDataService.saveFacultyAnalysisResults(results);

    // Launch prototype processing overlay
    setIsProcessing(true);
    setProcessingStepIndex(0);
  };

  // Processing step timer
  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => {
      setProcessingStepIndex((prev) => {
        if (prev < processingPhases.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/my-class-analysis');
          }, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isProcessing, navigate, processingPhases.length]);

  // Quick live summary metrics
  const liveAcademic = facultyAnalysisService.analyzeClassPerformance(
    formData.students,
    formData.thresholds?.performanceTarget || 65
  );
  const liveAttendance = facultyAnalysisService.analyzeClassAttendance(
    formData.students,
    formData.thresholds?.attendanceTarget || 75
  );

  // Filtered students for display
  const filteredStudents = formData.students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    if (!filterAttentionOnly) return matchesSearch;
    const attPct = Math.round(((Number(s.attendedClasses) || 0) / (Number(s.totalClasses) || 1)) * 100);
    const perfPct = Math.round(((Number(s.totalMarks) || 0) / (Number(s.maxMarks) || 100)) * 100);
    return matchesSearch && (attPct < 75 || perfPct < 65);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col justify-between aurora-bg-mesh selection:bg-purple-500/20 selection:text-purple-900">
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP BAR / MODE HEADER */}
        <div className="glass-panel rounded-[24px] p-5 border border-purple-100 bg-white/95 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                  Faculty Personal Mode
                </span>
                <span className="text-xs text-slate-500 font-medium">Class Intelligence Wizard</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                Analyze My Class Data
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Enter your class and student performance records to discover proactive cohort insights.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleSaveDraft}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs"
              title="Save draft to localStorage"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={handleResetToSample}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs"
              title="Reset to default sample"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <Link
              to="/faculty"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1.5"
            >
              <span>Explore Demo Mode</span>
            </Link>
          </div>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium mb-3">
            {[
              { num: 1, label: 'Faculty & Class' },
              { num: 2, label: 'Student Roster' },
              { num: 3, label: 'Academic Marks' },
              { num: 4, label: 'Attendance & Tasks' },
              { num: 5, label: 'Skills & Targets' }
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-1.5 transition-colors ${
                  currentStep === st.num
                    ? 'text-purple-400 font-bold'
                    : currentStep > st.num
                    ? 'text-slate-700'
                    : 'text-slate-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono ${
                    currentStep === st.num
                      ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                      : currentStep > st.num
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {st.num}
                </span>
                <span className="hidden md:inline">{st.label}</span>
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 bg-white/95 shadow-sm relative min-h-[480px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: FACULTY & CLASS INFO */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span>Faculty & Class Information</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Enter your academic department, instructional subject, and cohort parameters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Faculty / Instructor Name *
                    </label>
                    <input
                      type="text"
                      value={formData.facultyInfo.facultyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          facultyInfo: { ...formData.facultyInfo, facultyName: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g. Dr. Priya Sharma"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={formData.facultyInfo.department}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          facultyInfo: { ...formData.facultyInfo, department: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g. Computer Applications"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Subject / Course Taught *
                    </label>
                    <input
                      type="text"
                      value={formData.facultyInfo.subject}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          facultyInfo: { ...formData.facultyInfo, subject: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g. Computer Networks"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Course / Program
                    </label>
                    <input
                      type="text"
                      value={formData.facultyInfo.courseProgram}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          facultyInfo: { ...formData.facultyInfo, courseProgram: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g. BCA (Honours)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Semester
                      </label>
                      <select
                        value={formData.facultyInfo.semester}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facultyInfo: { ...formData.facultyInfo, semester: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-purple-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Section
                      </label>
                      <input
                        type="text"
                        value={formData.facultyInfo.section}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facultyInfo: { ...formData.facultyInfo, section: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-purple-500"
                        placeholder="e.g. A"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        value={formData.facultyInfo.academicYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facultyInfo: { ...formData.facultyInfo, academicYear: e.target.value }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-purple-500"
                        placeholder="e.g. 2025-2026"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Class Type
                      </label>
                      <select
                        value={formData.facultyInfo.classType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facultyInfo: { ...formData.facultyInfo, classType: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="Theory + Laboratory">Theory + Laboratory</option>
                        <option value="Theory Only">Theory Only</option>
                        <option value="Laboratory Only">Laboratory Only</option>
                        <option value="Seminar / Capstone">Seminar / Capstone</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-purple-300 block">
                      Enrolled Students Count: {formData.students.length}
                    </span>
                    <span className="text-slate-400">
                      You can dynamically add, edit, or remove students in Step 2.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-purple-900/60 text-purple-200 px-2 py-1 rounded-lg border border-purple-500/40">
                    Auto Synchronized
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: STUDENT ROSTER (ADD / REMOVE / SEARCH / FILTER) */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span>Class Student Roster</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Manage students, edit roll numbers, and view quick flags.
                    </p>
                  </div>

                  <button
                    onClick={handleAddStudent}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by student name or roll number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => setFilterAttentionOnly(!filterAttentionOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      filterAttentionOnly
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-50/80 text-slate-400 border-slate-200 hover:text-slate-200'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{filterAttentionOnly ? 'Showing Attention Flags' : 'Filter Flags'}</span>
                  </button>
                </div>

                {/* Student Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 max-h-[380px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 text-slate-400 uppercase font-mono text-[10px] sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Roll No.</th>
                        <th className="p-3">Total Marks</th>
                        <th className="p-3">Attendance</th>
                        <th className="p-3">Assignments</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 text-slate-700">
                      {filteredStudents.map((s, idx) => {
                        const attPct = Math.round(
                          ((Number(s.attendedClasses) || 0) / (Number(s.totalClasses) || 1)) * 100
                        );
                        const perfPct = Math.round(
                          ((Number(s.totalMarks) || 0) / (Number(s.maxMarks) || 100)) * 100
                        );
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={s.name}
                                onChange={(e) => handleUpdateStudentField(s.id, 'name', e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-purple-500 focus:outline-none text-white font-medium w-full text-xs"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={s.rollNo}
                                onChange={(e) => handleUpdateStudentField(s.id, 'rollNo', e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-purple-500 focus:outline-none font-mono text-slate-700 w-full text-xs"
                              />
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-semibold ${
                                  perfPct >= 75 ? 'text-emerald-400' : perfPct >= 60 ? 'text-amber-400' : 'text-red-400'
                                }`}
                              >
                                {s.totalMarks}/{s.maxMarks} ({perfPct}%)
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                                  attPct >= 75
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {s.attendedClasses}/{s.totalClasses} ({attPct}%)
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="font-mono text-slate-400">
                                {s.completedAssignments}/{s.totalAssignments} done
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleRemoveStudent(s.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Remove student"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2">
                  <span>
                    Showing {filteredStudents.length} of {formData.students.length} student(s)
                  </span>
                  <span>Click any name or roll number to edit directly.</span>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILED ASSESSMENT MARKS */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span>Detailed Academic & Assessment Marks</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Break down internal assessments (Quiz, Mid-Term, Assignments, Practicals) and external exams.
                  </p>
                </div>

                {/* Live Class Summary Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-purple-300">Class Average</span>
                    <span className="text-lg font-bold text-slate-900 block mt-0.5">{liveAcademic.classAverage}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-300">Highest Score</span>
                    <span className="text-lg font-bold text-emerald-400 block mt-0.5">
                      {liveAcademic.highestScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-red-300">Lowest Score</span>
                    <span className="text-lg font-bold text-red-400 block mt-0.5">{liveAcademic.lowestScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-amber-300">Below Target</span>
                    <span className="text-lg font-bold text-amber-300 block mt-0.5">
                      {liveAcademic.studentsBelowTarget.length} Students
                    </span>
                  </div>
                </div>

                {/* Assessment Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 max-h-[350px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 text-slate-400 uppercase font-mono text-[10px] sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Quiz (20)</th>
                        <th className="p-3">Mid-Term (40)</th>
                        <th className="p-3">Assignments (20)</th>
                        <th className="p-3">Practical (20)</th>
                        <th className="p-3">External (100)</th>
                        <th className="p-3">Total / Pct</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 text-slate-700">
                      {formData.students.map((s) => {
                        const max = Number(s.maxMarks) || 100;
                        const score = Number(s.totalMarks) || 0;
                        const pct = Math.round((score / max) * 100);
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/60">
                            <td className="p-3">
                              <span className="font-semibold text-white block">{s.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">{s.rollNo}</span>
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={s.quizMarks}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'quizMarks', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                max="40"
                                value={s.midTermMarks}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'midTermMarks', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={s.assignmentMarks}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'assignmentMarks', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={s.practicalMarks}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'practicalMarks', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={s.externalMarks}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'externalMarks', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-bold font-mono ${
                                  pct >= 75 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
                                }`}
                              >
                                {score} ({pct}%)
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* STEP 4: ATTENDANCE & ASSIGNMENTS */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-purple-400" />
                    <span>Attendance & Assignment Submissions</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Track total lectures, attended sessions, completed vs overdue assignments.
                  </p>
                </div>

                {/* Live Attendance Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-purple-300">Cohort Attendance</span>
                    <span className="text-lg font-bold text-slate-900 block mt-0.5">
                      {liveAttendance.averageAttendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-amber-300">Below 75% Target</span>
                    <span className="text-lg font-bold text-amber-400 block mt-0.5">
                      {liveAttendance.studentsBelowTarget.length} Students
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-300">Healthy Attendance</span>
                    <span className="text-lg font-bold text-emerald-400 block mt-0.5">
                      {liveAttendance.studentsHealthy.length} Students
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 max-h-[350px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 text-slate-400 uppercase font-mono text-[10px] sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Student</th>
                        <th className="p-3">Total Classes</th>
                        <th className="p-3">Attended Classes</th>
                        <th className="p-3">Attendance %</th>
                        <th className="p-3">Assignments (Total)</th>
                        <th className="p-3">Completed</th>
                        <th className="p-3">Overdue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 text-slate-700">
                      {formData.students.map((s) => {
                        const totalCl = Number(s.totalClasses) || 1;
                        const attendedCl = Number(s.attendedClasses) || 0;
                        const attPct = Math.round((attendedCl / totalCl) * 100);
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/60">
                            <td className="p-3">
                              <span className="font-semibold text-white block">{s.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">{s.rollNo}</span>
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="1"
                                value={s.totalClasses}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'totalClasses', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                value={s.attendedClasses}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'attendedClasses', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                                  attPct >= 75
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {attPct}%
                              </span>
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                value={s.totalAssignments}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'totalAssignments', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                value={s.completedAssignments}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'completedAssignments', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                value={s.overdueAssignments}
                                onChange={(e) =>
                                  handleUpdateStudentField(s.id, 'overdueAssignments', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* STEP 5: OPTIONAL SKILLS & CONFIG */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-purple-400" />
                    <span>Topic Performance & Threshold Configuration</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Optionally configure curriculum topics and threshold sensitivities for student support flags.
                  </p>
                </div>

                {/* Threshold Configuration Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Attendance Target (%)
                    </label>
                    <span className="text-[10px] text-slate-400 block mb-2">
                      Students below this target trigger attendance flags.
                    </span>
                    <input
                      type="number"
                      min="50"
                      max="90"
                      value={formData.thresholds.attendanceTarget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thresholds: { ...formData.thresholds, attendanceTarget: Number(e.target.value) }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Academic Pass Target (%)
                    </label>
                    <span className="text-[10px] text-slate-400 block mb-2">
                      Minimum benchmark for safe course progression.
                    </span>
                    <input
                      type="number"
                      min="40"
                      max="85"
                      value={formData.thresholds.performanceTarget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thresholds: { ...formData.thresholds, performanceTarget: Number(e.target.value) }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Assignment Target (%)
                    </label>
                    <span className="text-[10px] text-slate-400 block mb-2">
                      Expected completion rate for coursework.
                    </span>
                    <input
                      type="number"
                      min="50"
                      max="90"
                      value={formData.thresholds.assignmentTarget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thresholds: { ...formData.thresholds, assignmentTarget: Number(e.target.value) }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Topic Breakdown Inputs */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Curriculum Topic Assessments</h3>
                      <p className="text-[11px] text-slate-400">
                        Tracks which specific modules need revision workshops.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.topics.map((t, idx) => {
                      const pct = Math.round((t.avgMarks / t.maxMarks) * 100);
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex-1">
                            <span className="font-semibold text-slate-200 block">{t.name}</span>
                            <span className="text-[10px] text-slate-500">Max Marks: {t.maxMarks}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max={t.maxMarks}
                              value={t.avgMarks}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFormData((prev) => ({
                                  ...prev,
                                  topics: prev.topics.map((item, i) =>
                                    i === idx ? { ...item, avgMarks: val } : item
                                  )
                                }));
                              }}
                              className="w-14 px-2 py-1 rounded bg-white border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:border-purple-500"
                            />
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                pct >= 70
                                  ? 'bg-emerald-950/80 text-emerald-400'
                                  : 'bg-amber-950/80 text-amber-400'
                              }`}
                            >
                              {pct}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final CTA Bar */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-900/90 border-2 border-purple-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <span>Ready to Generate Class Intelligence</span>
                    </h3>
                    <p className="text-xs text-slate-700 mt-0.5">
                      Process {formData.students.length} student records for {formData.facultyInfo.subject} (Section {formData.facultyInfo.section}).
                    </p>
                  </div>
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-900 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 shrink-0 group"
                  >
                    <span>Analyze My Class</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTTOM STEP CONTROLS */}
          <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentStep === 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-700 hover:text-white glass-panel hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <span className="text-xs font-mono text-slate-500">Step {currentStep} of 5</span>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleStartAnalysis}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-1.5 transition-all"
              >
                <span>Analyze My Class</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PROTOTYPE PROCESSING OVERLAY */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          >
            <div className="w-full max-w-md p-6 rounded-[26px] glass-panel border border-purple-200 bg-white shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 animate-pulse shadow-md">
                <BrainCircuit className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40">
                  Visual Prototype Pipeline
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3">
                  Generating Class Intelligence
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Synthesizing entered student records, attendance, and coursework patterns.
                </p>
              </div>

              {/* Phase progress list */}
              <div className="space-y-2 text-left text-xs">
                {processingPhases.map((phase, idx) => {
                  const isDone = idx < processingStepIndex;
                  const isCurrent = idx === processingStepIndex;
                  return (
                    <div
                      key={phase}
                      className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-purple-950/80 border border-purple-500/50 text-white font-semibold'
                          : isDone
                          ? 'text-purple-300/60'
                          : 'text-slate-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                      )}
                      <span className="truncate">{phase}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-500 font-mono block">
                  Phase {processingStepIndex + 1} of {processingPhases.length}
                </span>
                <span className="text-[10px] text-slate-600 mt-1 block">
                  Prototype calculation demonstration • Not a real production ML deployment.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
