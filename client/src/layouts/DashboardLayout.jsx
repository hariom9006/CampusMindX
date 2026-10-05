import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import MobileBottomNav from '../components/MobileBottomNav';

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-800 flex flex-col aurora-bg-mesh selection:bg-indigo-500/20 selection:text-indigo-900">
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
