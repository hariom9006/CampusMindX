import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';
import { useTheme } from '../context/ThemeContext';

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark
          ? 'bg-[#080B12] text-[#F8FAFC]'
          : 'bg-[#F8FAFF] text-slate-800 aurora-bg-mesh'
      } selection:bg-indigo-500/20 selection:text-indigo-900`}
    >
      {/* Top Navbar */}
      <TopNavbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Main Application Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0 overflow-y-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Touch-Friendly Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
