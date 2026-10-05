import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Flash message passed from ProtectedRoute redirect or register success
  const redirectMessage = location.state?.message;

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success && res.user) {
        // Redirect to intended route or role-specific dashboard
        const fromPath = location.state?.from?.pathname;
        if (fromPath && !fromPath.startsWith('/login') && !fromPath.startsWith('/register')) {
          navigate(fromPath, { replace: true });
        } else if (res.user.role === 'faculty') {
          navigate('/faculty', { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/student', { replace: true });
        }
      } else {
        setErrorMessage(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage('Unable to connect to the authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 aurora-bg-mesh text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Top Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              CampusMind<span className="aurora-gradient-text font-black">X</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
            Sign in to continue to your university intelligence dashboard.
          </p>
        </div>

        {/* Login Glass Panel */}
        <div className="glass-panel rounded-[28px] p-6 sm:p-8 border border-slate-200/90 shadow-xl bg-white/95 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle aurora corner accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-400/10 via-purple-400/10 to-transparent rounded-bl-full pointer-events-none" />

          {/* Flash redirect message */}
          {redirectMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-semibold flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{redirectMessage}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-slate-700 mb-1.5 tracking-tight"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors((prev) => ({ ...prev, email: null }));
                    }
                  }}
                  placeholder="name@campus.edu.in"
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    validationErrors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200/90 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
              {validationErrors.email && (
                <span className="text-[11px] font-medium text-rose-600 mt-1 block">
                  {validationErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-slate-700 tracking-tight"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    validationErrors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200/90 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <span className="text-[11px] font-medium text-rose-600 mt-1 block">
                  {validationErrors.password}
                </span>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/90" />
            </div>
            <span className="relative px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              New to CampusMind X?
            </span>
          </div>

          {/* Create Account Button */}
          <Link
            to="/register"
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Create Account</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            ← Back to CampusMind X Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
