import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({
  className = '',
  showLabel = true,
  variant = 'button' // 'button' | 'segmented' | 'compact'
}) {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl border transition-colors ${
          isDark
            ? 'bg-[#151C28] border-[#202938]'
            : 'bg-slate-100 border-slate-200'
        } ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            !isDark
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
          title="Switch to Light Theme"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isDark
              ? 'bg-[#111722] text-[#F8FAFC] shadow-xs border border-[#202938]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Switch to Dark Theme"
        >
          <Moon className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode as per your preference`}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
        isDark
          ? 'bg-[#151C28] text-[#E2E8F0] hover:text-white border border-[#202938] hover:border-[#8B5CF6]/60 shadow-xs'
          : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-indigo-300 shadow-2xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-200 hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="hidden sm:inline">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
