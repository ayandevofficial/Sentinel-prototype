import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';

/**
 * DashboardLayout
 * The main wrapper for all authenticated routes.
 * Handles the responsive sidebar-to-content distribution.
 */
const DashboardLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Route guarding: Redirect unauthenticated sessions
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* The DashboardSidebar component already contains the 'hidden lg:flex' 
        logic to auto-hide on mobile devices.
      */}
      <DashboardSidebar />

      {/* Main content container
        - flex-1: Fills the remaining width (full width on mobile when sidebar is hidden)
        - p-4: Minimal padding for small screens to prevent squeezing text
        - md:p-8: Professional spacious padding for desktops
      */}
      <main className="flex-1 flex flex-col w-full h-screen overflow-hidden p-4 md:p-8">
        <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
