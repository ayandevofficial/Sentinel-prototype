import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * DashboardHeader Component
 * Renders a responsive top navigation bar for the Sentinel AI Console.
 * Adapts layout for Mobile (Stack) and Desktop (Row).
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, children }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
      
      {/* Title section - Responsive font sizes and alignment */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center md:text-left">
        {title}
      </h1>

      {/* Action controls and System Status monitoring */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
        
        {/* Dynamic children slot for Theme Toggles or Model Selectors */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          {children}
        </div>

        {/* System Health Indicator - Compact on mobile with subtle background */}
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm bg-muted/30 md:bg-transparent py-1.5 px-3 rounded-full md:p-0 w-full md:w-auto border md:border-none border-muted">
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-sentinel-success" />
          <span className="text-muted-foreground">System Status:</span>
          <span className="text-sentinel-success font-medium">Operational</span>
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;
