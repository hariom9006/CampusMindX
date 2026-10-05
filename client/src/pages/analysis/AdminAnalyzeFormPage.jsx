import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  GraduationCap,
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
  Shield,
  Layers,
  TrendingUp,
  Cpu
} from 'lucide-react';

import adminDataService, { DEFAULT_ADMIN_UNIVERSITY_TEMPLATE } from '../../services/adminDataService';
import adminAnalysisService from '../../services/adminAnalysisService';

export default function AdminAnalyzeFormPage() {
  const navigate = useNavigate();

  // Multi-step: 1 = University Info, 2 = Department Roster, 3 = Dept Performance, 4 = Academic & Skills, 5 = Review & Targets
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState(() => {
    const saved = adminDataService.loadAdminData();
    return saved || DEFAULT_ADMIN_UNIVERSITY_TEMPLATE;
  });

  // Processing animation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);

  const processingPhases = [
    'Collecting University Data',
    'Validating Department Data',
    'Analyzing Academic Performance',
    'Analyzing Attendance',
    'Analyzing Assignment Trends',
    'Analyzing Department Patterns',
    'Identifying Skill Gaps',
    'Generating University Insights',
    'Preparing Dashboard'
  ];

  // Save changes to localStorage
  const handleSaveDraft = () => {
    adminDataService.saveAdminData(formData);
    alert('University data draft saved to local browser storage.');
  };

  // Reset to default template
  const handleResetToSample = () => {
    if (window.confirm('Reset all entered university data to default template?')) {
      setFormData(DEFAULT_ADMIN_UNIVERSITY_TEMPLATE);
      adminDataService.saveAdminData(DEFAULT_ADMIN_UNIVERSITY_TEMPLATE);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // Department Management
  const handleAddDepartment = () => {
    const newId = `DEP-0${formData.departments.length + 1}`;
    const newDept = {
      id: newId,
      name: `Department of Emerging Tech ${formData.departments.length + 1}`,
      code: `DEP${formData.departments.length + 1}`,
      studentsCount: 60,
      facultyCount: 5,
      avgPerformance: 75,
      avgAttendance: 78,
      assignmentCompletion: 74,
      studentsRequiringAttention: 6,
      headOfDepartment: 'Prof. Faculty Lead'
    };

    setFormData((prev) => ({
      ...prev,
      departments: [...prev.departments, newDept],
      universityInfo: {
        ...prev.universityInfo,
        numberOfDepartments: prev.departments.length + 1
      }
    }));
  };

  const handleRemoveDepartment = (id) => {
    if (formData.departments.length <= 1) {
      alert('University must register at least one department.');
      return;
    }
    setFormData((prev) => {
      const updated = prev.departments.filter((d) => d.id !== id);
      return {
        ...prev,
        departments: updated,
        universityInfo: {
          ...prev.universityInfo,
          numberOfDepartments: updated.length
        }
      };
    });
  };

  const handleUpdateDeptField = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    }));
  };

  // Start analysis pipeline
  const handleStartAnalysis = () => {
    if (formData.departments.length === 0) {
      alert('Please enter at least one academic department.');
      return;
    }

    adminDataService.saveAdminData(formData);
    const results = adminAnalysisService.runFullAdminAnalysis(formData);
    adminDataService.saveAdminAnalysisResults(results);

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
            navigate('/my-university-analysis');
          }, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isProcessing, navigate, processingPhases.length]);

  // Live Aggregate Metrics
  const liveMetrics = adminAnalysisService.analyzeUniversityMetrics(formData);

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col justify-between aurora-bg-mesh selection:bg-cyan-500/20 selection:text-cyan-900">
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP BAR / MODE HEADER */}
        <div className="glass-panel rounded-[24px] p-5 border border-cyan-100 bg-white/95 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-800 font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200">
                  Administrator Personal Mode
                </span>
                <span className="text-xs text-slate-500 font-medium">Institutional Intelligence Wizard</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                Analyze My University Data
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Enter university or department-level data to generate personalized institutional insights.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleSaveDraft}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs"
              title="Save draft"
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
              to="/admin"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors flex items-center gap-1.5"
            >
              <span>Explore Demo Mode</span>
            </Link>
          </div>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium mb-3">
            {[
              { num: 1, label: 'University Info' },
              { num: 2, label: 'Departments' },
              { num: 3, label: 'Dept Performance' },
              { num: 4, label: 'Academic & Skills' },
              { num: 5, label: 'Analyze' }
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-1.5 transition-colors ${
                  currentStep === st.num
                    ? 'text-blue-400 font-bold'
                    : currentStep > st.num
                    ? 'text-slate-700'
                    : 'text-slate-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono ${
                    currentStep === st.num
                      ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                      : currentStep > st.num
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {st.num}
                </span>
                <span className="hidden md:inline">{st.label}</span>
              </button>
            ))}
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTAINER */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 bg-white/95 shadow-sm relative min-h-[480px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: UNIVERSITY INFORMATION */}
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
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span>University Institutional Information</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Provide the university or college identity, campus details, and academic calendar parameters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      University / College Name *
                    </label>
                    <input
                      type="text"
                      value={formData.universityInfo.universityName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          universityInfo: { ...formData.universityInfo, universityName: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. Apex National Institute of Technology"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Academic Year *
                    </label>
                    <input
                      type="text"
                      value={formData.universityInfo.academicYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          universityInfo: { ...formData.universityInfo, academicYear: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="e.g. 2025-2026"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Campus / Institutional Location
                    </label>
                    <input
                      type="text"
                      value={formData.universityInfo.campusLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          universityInfo: { ...formData.universityInfo, campusLocation: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Central University Campus"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Total Enrolled Students
                      </label>
                      <input
                        type="number"
                        value={formData.universityInfo.numberOfStudents}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            universityInfo: { ...formData.universityInfo, numberOfStudents: Number(e.target.value) }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-blue-500 font-mono"
                        placeholder="e.g. 420"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Total Faculty Members
                      </label>
                      <input
                        type="number"
                        value={formData.universityInfo.numberOfFaculty}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            universityInfo: { ...formData.universityInfo, numberOfFaculty: Number(e.target.value) }
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-blue-500 font-mono"
                        placeholder="e.g. 32"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Program Categories
                    </label>
                    <input
                      type="text"
                      value={formData.universityInfo.programCategories}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          universityInfo: { ...formData.universityInfo, programCategories: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Computing, Engineering, Management"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-blue-300 block">
                      Registered Departments: {formData.departments.length}
                    </span>
                    <span className="text-slate-400">
                      Configure departmental student counts and faculty in Step 2.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-blue-900/60 text-blue-200 px-2 py-1 rounded-lg border border-blue-500/40">
                    Institutional Tier
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DEPARTMENT ROSTER */}
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
                      <Layers className="w-5 h-5 text-blue-400" />
                      <span>Academic Departments</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Add, edit, or remove departments comprising the institution.
                    </p>
                  </div>

                  <button
                    onClick={handleAddDepartment}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Department</span>
                  </button>
                </div>

                {/* Departments Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 max-h-[380px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 text-slate-400 uppercase font-mono text-[10px] sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Department Full Name</th>
                        <th className="p-3">Enrolled Students</th>
                        <th className="p-3">Faculty Count</th>
                        <th className="p-3">Head of Department</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 text-slate-700">
                      {formData.departments.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-3 font-mono">
                            <input
                              type="text"
                              value={d.code}
                              onChange={(e) => handleUpdateDeptField(d.id, 'code', e.target.value)}
                              className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-blue-300 font-bold focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={d.name}
                              onChange={(e) => handleUpdateDeptField(d.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-medium focus:outline-none focus:border-blue-500 text-xs"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="1"
                              value={d.studentsCount}
                              onChange={(e) =>
                                handleUpdateDeptField(d.id, 'studentsCount', Number(e.target.value))
                              }
                              className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="1"
                              value={d.facultyCount}
                              onChange={(e) =>
                                handleUpdateDeptField(d.id, 'facultyCount', Number(e.target.value))
                              }
                              className="w-16 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={d.headOfDepartment || ''}
                              onChange={(e) => handleUpdateDeptField(d.id, 'headOfDepartment', e.target.value)}
                              className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 text-xs"
                              placeholder="e.g. Dr. Faculty Lead"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleRemoveDepartment(d.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Remove department"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DEPARTMENT PERFORMANCE METRICS */}
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
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span>Department Performance & Telemetry</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Input average score, attendance %, assignment completion, and count of students requiring attention.
                  </p>
                </div>

                {/* Live University Macro Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-blue-300">University Avg Score</span>
                    <span className="text-lg font-bold text-slate-900 block mt-0.5">
                      {liveMetrics.kpis.avgPerformance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-300">Avg Attendance</span>
                    <span className="text-lg font-bold text-emerald-400 block mt-0.5">
                      {liveMetrics.kpis.avgAttendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-indigo-300">Assignment Rate</span>
                    <span className="text-lg font-bold text-indigo-400 block mt-0.5">
                      {liveMetrics.kpis.avgAssignmentCompletion}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-amber-300">Total Flagged Students</span>
                    <span className="text-lg font-bold text-amber-300 block mt-0.5">
                      {liveMetrics.kpis.totalAttentionCount} Students
                    </span>
                  </div>
                </div>

                {/* Metrics Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 max-h-[350px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 text-slate-400 uppercase font-mono text-[10px] sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Department</th>
                        <th className="p-3">Avg Performance (%)</th>
                        <th className="p-3">Avg Attendance (%)</th>
                        <th className="p-3">Assignment Rate (%)</th>
                        <th className="p-3">Attention Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 text-slate-700">
                      {formData.departments.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/60">
                          <td className="p-3">
                            <span className="font-bold text-white block">{d.code}</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-xs block">{d.name}</span>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={d.avgPerformance}
                              onChange={(e) =>
                                handleUpdateDeptField(d.id, 'avgPerformance', Number(e.target.value))
                              }
                              className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={d.avgAttendance}
                              onChange={(e) =>
                                handleUpdateDeptField(d.id, 'avgAttendance', Number(e.target.value))
                              }
                              className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={d.assignmentCompletion}
                              onChange={(e) =>
                                handleUpdateDeptField(d.id, 'assignmentCompletion', Number(e.target.value))
                              }
                              className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              value={d.studentsRequiringAttention}
                              onChange={(e) =>
                                handleUpdateDeptField(
                                  d.id,
                                  'studentsRequiringAttention',
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-amber-300 font-mono text-xs focus:outline-none focus:border-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* STEP 4: UNIVERSITY ACADEMIC & OPTIONAL SKILLS */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                    <span>University Academic Standards & Industry Skills</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Enter macro pass rates, institution-wide submission bottlenecks, and optional technology skills data.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Expected Pass Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={formData.universityAcademic.passPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          universityAcademic: {
                            ...formData.universityAcademic,
                            passPercentage: Number(e.target.value)
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Attendance Benchmark Target (%)
                    </label>
                    <input
                      type="number"
                      min="60"
                      max="85"
                      value={formData.thresholds.attendanceTarget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thresholds: {
                            ...formData.thresholds,
                            attendanceTarget: Number(e.target.value)
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Pending Coursework Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.universityAcademic.pendingSubmissionsCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          universityAcademic: {
                            ...formData.universityAcademic,
                            pendingSubmissionsCount: Number(e.target.value)
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Optional Skills Section */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>Optional Industry Skill Readiness Benchmarks</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Evaluates curriculum alignment with modern industry competencies.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.skillsData.map((sk, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex-1">
                          <span className="font-semibold text-slate-200 block">{sk.name}</span>
                          <span className="text-[10px] text-slate-500">Target Benchmark: {sk.targetLevel}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sk.level}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormData((prev) => ({
                                ...prev,
                                skillsData: prev.skillsData.map((item, i) =>
                                  i === idx ? { ...item, level: val } : item
                                )
                              }));
                            }}
                            className="w-14 px-2 py-1 rounded bg-white border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVIEW & LAUNCH */}
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
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span>Review & Institutional Analysis</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Verify entered university records before generating institutional intelligence.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Institution</span>
                    <span className="text-sm font-bold text-slate-900 block mt-1 truncate">
                      {formData.universityInfo.universityName}
                    </span>
                    <span className="text-xs text-blue-400 font-mono">
                      {formData.departments.length} Departments
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Overall Performance</span>
                    <span className="text-2xl font-black text-cyan-400 block mt-1">
                      {liveMetrics.kpis.avgPerformance}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Pass Rate: {formData.universityAcademic.passPercentage}%</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Overall Attendance</span>
                    <span className="text-2xl font-black text-emerald-400 block mt-1">
                      {liveMetrics.kpis.avgAttendance}%
                    </span>
                    <span className="text-xs text-amber-300">
                      {liveMetrics.deptsBelowAttTarget.length} Dept(s) below target
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Academic Support</span>
                    <span className="text-2xl font-black text-amber-400 block mt-1">
                      {liveMetrics.kpis.totalAttentionCount}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Students Flagged</span>
                  </div>
                </div>

                {/* Final CTA Bar */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/60 to-slate-900/90 border-2 border-blue-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <span>Ready to Generate University Intelligence</span>
                    </h3>
                    <p className="text-xs text-slate-700 mt-0.5">
                      Process {formData.departments.length} department datasets across {liveMetrics.kpis.totalStudents} enrolled students.
                    </p>
                  </div>
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-900 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2 shrink-0 group"
                  >
                    <span>Analyze My University</span>
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
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleStartAnalysis}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-1.5 transition-all"
              >
                <span>Analyze My University</span>
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
            <div className="w-full max-w-md p-6 rounded-[26px] glass-panel border border-cyan-200 bg-white shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 animate-pulse shadow-md">
                <BrainCircuit className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40">
                  Visual Prototype Pipeline
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3">
                  Generating Institutional Intelligence
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Synthesizing university and departmental telemetry models.
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
                          ? 'bg-blue-950/80 border border-blue-500/50 text-white font-semibold'
                          : isDone
                          ? 'text-blue-300/60'
                          : 'text-slate-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
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
