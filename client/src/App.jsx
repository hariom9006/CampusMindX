import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Core Boundaries
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';

// Code-split pages for high performance and reduced initial bundle size
const LandingPage = lazy(() => import('./pages/LandingPage'));
const RoleSelectPage = lazy(() => import('./pages/RoleSelectPage'));
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const StudentPerformance = lazy(() => import('./pages/student/StudentPerformance'));
const StudentAttendance = lazy(() => import('./pages/student/StudentAttendance'));
const StudentSkills = lazy(() => import('./pages/student/StudentSkills'));
const StudentRoadmap = lazy(() => import('./pages/student/StudentRoadmap'));
const StudentAssistant = lazy(() => import('./pages/student/StudentAssistant'));

// Faculty Pages
const FacultyDashboard = lazy(() => import('./pages/faculty/FacultyDashboard'));
const FacultyStudents = lazy(() => import('./pages/faculty/FacultyStudents'));
const FacultyAnalytics = lazy(() => import('./pages/faculty/FacultyAnalytics'));
const FacultyAssistant = lazy(() => import('./pages/faculty/FacultyAssistant'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminAssistant = lazy(() => import('./pages/admin/AdminAssistant'));

// Personal Mode Pages (Analyze My Data - Student, Faculty, Admin)
const AnalyzeFormPage = lazy(() => import('./pages/analysis/AnalyzeFormPage'));
const AnalysisResultPage = lazy(() => import('./pages/analysis/AnalysisResultPage'));
const FacultyAnalyzeFormPage = lazy(() => import('./pages/analysis/FacultyAnalyzeFormPage'));
const FacultyAnalysisResultPage = lazy(() => import('./pages/analysis/FacultyAnalysisResultPage'));
const AdminAnalyzeFormPage = lazy(() => import('./pages/analysis/AdminAnalyzeFormPage'));
const AdminAnalysisResultPage = lazy(() => import('./pages/analysis/AdminAnalysisResultPage'));

// Connected LMS & Cloud Integration Pages
const ConnectUniversityPage = lazy(() => import('./pages/integration/ConnectUniversityPage'));
const ConnectedIntelligencePage = lazy(() => import('./pages/integration/ConnectedIntelligencePage'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen message="Initializing CampusMind X..." />}>
          <Routes>
            {/* Public Landing & Persona Switcher */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<RoleSelectPage />} />

            {/* University LMS & Cloud Integration */}
            <Route path="/connect-university" element={<ConnectUniversityPage />} />
            <Route path="/connected-intelligence" element={<ConnectedIntelligencePage />} />

            {/* Personal Mode: Student Self-Analysis */}
            <Route path="/analyze" element={<AnalyzeFormPage />} />
            <Route path="/my-analysis" element={<AnalysisResultPage />} />

            {/* Personal Mode: Faculty Class Analysis */}
            <Route path="/analyze-class" element={<FacultyAnalyzeFormPage />} />
            <Route path="/my-class-analysis" element={<FacultyAnalysisResultPage />} />

            {/* Personal Mode: Administrator University Analysis */}
            <Route path="/analyze-university" element={<AdminAnalyzeFormPage />} />
            <Route path="/my-university-analysis" element={<AdminAnalysisResultPage />} />

            {/* Dashboard Shell for Role-Based Portals */}
            <Route element={<DashboardLayout />}>
              {/* Architecture Page (also accessible inside dashboard shell) */}
              <Route path="/architecture" element={<ArchitecturePage />} />

              {/* Student Routes */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/performance" element={<StudentPerformance />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/skills" element={<StudentSkills />} />
              <Route path="/student/roadmap" element={<StudentRoadmap />} />
              <Route path="/student/assistant" element={<StudentAssistant />} />

              {/* Faculty Routes */}
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/students" element={<FacultyStudents />} />
              <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
              <Route path="/faculty/assistant" element={<FacultyAssistant />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/assistant" element={<AdminAssistant />} />
            </Route>

            {/* Fallback to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
