import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center p-6 aurora-bg-mesh text-slate-800">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl -z-10 animate-ping" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              CampusMind<span className="aurora-gradient-text font-black">X</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Verifying authenticated university session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Please sign in to access CampusMind X.'
        }}
        replace
      />
    );
  }

  // Check role authorization if specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const defaultRolePath =
      user.role === 'faculty'
        ? '/faculty'
        : user.role === 'admin'
        ? '/admin'
        : '/student';

    return <Navigate to={defaultRolePath} replace />;
  }

  return children;
}
