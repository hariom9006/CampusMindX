import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    }

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

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role
      });

      if (res.success && res.user) {
        // Redirect to user's personalized role dashboard
        if (res.user.role === 'faculty') {
          navigate('/faculty', { replace: true });
        } else {
          navigate('/student', { replace: true });
        }
      } else {
        setErrorMessage(res.message || 'Registration failed. Please verify your details.');
      }
    } catch (err) {
      setErrorMessage('Network error or server unavailable. Please try again.');
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
        {/* Top Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              CampusMind<span className="aurora-gradient-text font-black">X</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Join the explainable university intelligence & student success platform.
          </p>
        </div>

        {/* Register Glass Panel */}
        <div className="glass-panel rounded-[28px] p-6 sm:p-8 border border-slate-200/90 shadow-xl bg-white/95 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle aurora accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-transparent rounded-bl-full pointer-events-none" />

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold text-slate-700 mb-1.5 tracking-tight"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors((prev) => ({ ...prev, name: null }));
                    }
                  }}
                  placeholder="e.g. Hariom Anand"
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    validationErrors.name
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200/90 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                  disabled={isSubmitting}
                  autoComplete="name"
                />
              </div>
              {validationErrors.name && (
                <span className="text-[11px] font-medium text-rose-600 mt-1 block">
                  {validationErrors.name}
                </span>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-bold text-slate-700 mb-1.5 tracking-tight"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
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

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-tight">
                Role (Default: Student)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    role === 'student'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    role === 'faculty'
                      ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>Faculty</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                * Note: Administrator accounts require institutional verification.
              </span>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-bold text-slate-700 mb-1.5 tracking-tight"
              >
                Password * (min 6 characters)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-password"
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
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-xs font-bold text-slate-700 mb-1.5 tracking-tight"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors((prev) => ({ ...prev, confirmPassword: null }));
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    validationErrors.confirmPassword
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200/90 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="text-[11px] font-medium text-rose-600 mt-1 block">
                  {validationErrors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/90" />
            </div>
            <span className="relative px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Already registered?
            </span>
          </div>

          {/* Sign In Link */}
          <Link
            to="/login"
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Sign In to Existing Account</span>
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
