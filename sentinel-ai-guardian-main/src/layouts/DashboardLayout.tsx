import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
