import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col radial-bg-overlay selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <TopNavbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Main Application Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
