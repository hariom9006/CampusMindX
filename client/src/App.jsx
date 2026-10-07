import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout & Core Boundaries
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';

// Public & Auth Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const RoleSelectPage = lazy(() => import('./pages/RoleSelectPage'));
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage'));
const AIModelCenter = lazy(() => import('./pages/AIModelCenter'));

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

// 404 Fallback Page
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Smart redirect to role-specific dashboard
function DashboardRedirect() {
  const { user } = useAuth();
  if (user?.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <Suspense fallback={<LoadingScreen message="Initializing CampusMind X..." />}>
            <Routes>
              {/* Public Landing & Authentication */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/persona" element={<RoleSelectPage />} />

              {/* Convenience Shorthand Aliases & Role Redirects */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
              <Route path="/performance" element={<Navigate to="/student/performance" replace />} />
              <Route path="/skills" element={<Navigate to="/student/skills" replace />} />
              <Route path="/roadmap" element={<Navigate to="/student/roadmap" replace />} />
              <Route path="/ai-assistant" element={<Navigate to="/student/assistant" replace />} />
              <Route path="/insights" element={<Navigate to="/student#insights" replace />} />
              <Route path="/notifications" element={<Navigate to="/student#notifications" replace />} />

              {/* Protected Personal Mode Analysis Routes */}
              <Route
                path="/analyze"
                element={
                  <ProtectedRoute>
                    <AnalyzeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/analyze"
                element={
                  <ProtectedRoute>
                    <AnalyzeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-analysis"
                element={
                  <ProtectedRoute>
                    <AnalysisResultPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/my-analysis"
                element={
                  <ProtectedRoute>
                    <AnalysisResultPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analyze-class"
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <FacultyAnalyzeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty/analyze"
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <FacultyAnalyzeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-class-analysis"
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <FacultyAnalysisResultPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty/my-analysis"
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <FacultyAnalysisResultPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analyze-university"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAnalyzeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analyze"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAnalyzeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-university-analysis"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAnalysisResultPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/my-analysis"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAnalysisResultPage />
                  </ProtectedRoute>
                }
              />

              {/* University LMS & Cloud Integration */}
              <Route
                path="/connect-university"
                element={
                  <ProtectedRoute>
                    <ConnectUniversityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/connected-intelligence"
                element={
                  <ProtectedRoute>
                    <ConnectedIntelligencePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Dashboard Shell for Authenticated Portals */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* User Profile */}
                <Route path="/profile" element={<ProfilePage />} />

                {/* Architecture & AI Models */}
                <Route path="/architecture" element={<ArchitecturePage />} />
                <Route path="/models" element={<AIModelCenter />} />
                <Route path="/intelligence-center" element={<Navigate to="/models" replace />} />

                {/* Student Routes */}
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/performance" element={<StudentPerformance />} />
                <Route path="/student/attendance" element={<StudentAttendance />} />
                <Route path="/student/skills" element={<StudentSkills />} />
                <Route path="/student/roadmap" element={<StudentRoadmap />} />
                <Route path="/student/assistant" element={<StudentAssistant />} />

                {/* Faculty Routes */}
                <Route path="/faculty" element={<FacultyDashboard />} />
                <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                <Route path="/faculty/students" element={<FacultyStudents />} />
                <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
                <Route path="/faculty/assistant" element={<FacultyAssistant />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/assistant" element={<AdminAssistant />} />
              </Route>

              {/* Application-Level 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
