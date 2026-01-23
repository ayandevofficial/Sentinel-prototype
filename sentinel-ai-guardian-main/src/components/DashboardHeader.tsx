import React from 'react';
import { CheckCircle2, Menu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import DashboardSidebar from './DashboardSidebar';
import { Button } from './ui/button';

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * Enhanced DashboardHeader
 * Now includes a responsive "Mobile Menu" trigger for navigation.
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, children }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
      
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* Mobile Menu Trigger - Only visible on small screens (< lg) */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle Navigation Menu</span>
              </Button>
            </SheetTrigger>
            {/* Injecting the Sidebar inside the Sheet for Mobile view */}
            <SheetContent side="left" className="p-0 w-[240px]">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Responsive Title */}
        <h1 className="text-xl md:text-3xl font-bold text-foreground">
          {title}
        </h1>
        
        {/* Placeholder for mobile layout symmetry */}
        <div className="w-10 md:hidden" />
      </div>

      {/* Action Controls & Status */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          {children}
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] md:text-sm bg-muted/30 md:bg-transparent py-1.5 px-3 rounded-full w-full md:w-auto border md:border-none">
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-sentinel-success" />
          <span className="text-muted-foreground hidden sm:inline">System Status:</span>
          <span className="text-sentinel-success font-medium">Operational</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
