import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, children }) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 text-sentinel-success" />
          <span className="text-muted-foreground">System Status:</span>
          <span className="text-sentinel-success font-medium">Operational</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
