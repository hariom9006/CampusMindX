import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  GraduationCap,
  Sparkles,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateProfile({ name: name.trim() });
      if (res.success) {
        setSuccessMessage('Profile information saved successfully.');
      } else {
        setErrorMessage(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMessage('Network error while saving profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Active Session Member';

  const roleColor =
    user?.role === 'admin'
      ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
      : user?.role === 'faculty'
      ? 'bg-purple-50 text-purple-700 border-purple-200'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200';

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
            Account Management
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Secure Session
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          My Account Profile
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
          View your registered credentials, authorized role tier, and active university identity.
        </p>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-4">
          <div className="glass-panel rounded-[28px] p-6 border border-slate-200/90 shadow-sm bg-white/95 text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-3xl font-extrabold mx-auto shadow-md shadow-indigo-500/20 mb-4">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name || 'User'}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{user?.email}</p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${roleColor}`}>
                {user?.role || 'student'}
              </span>
            </div>

            <div className="border-t border-slate-100 mt-6 pt-4 text-left space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Joined {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Encrypted bcrypt credentials</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Active Aurora Intelligence access</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>

        {/* Right Column: Edit Profile Form & Settings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-[28px] p-6 sm:p-8 border border-slate-200/90 shadow-sm bg-white/95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Personal Credentials</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">
              Update your account display name across all university intelligence reports.
            </p>

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200/90 bg-white text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Registered Email Address (Verified)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Email modifications require contacting university academic IT.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assigned Operational Role
                </label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 capitalize block">
                      {user?.role} Tier Access
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Role authorization is enforced server-side. Privilege escalation to Admin is protected.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
