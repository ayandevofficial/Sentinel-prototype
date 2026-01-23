import React from 'react';
import { cn } from '@/lib/utils';

interface VerdictBadgeProps {
  verdict: 'CLEAN' | 'BLOCKED';
  className?: string;
}

/**
 * VerdictBadge Component
 * Visual indicator for AI security analysis results.
 * Features: Responsive sizing and high-visibility status colors.
 */
const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, className }) => {
  // Base styling with responsive font scaling
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300';
  
  // Semantic color mapping for security statuses
  const verdictClasses = {
    CLEAN: 'bg-sentinel-success-light/20 text-sentinel-success border border-sentinel-success/30 shadow-sm',
    BLOCKED: 'bg-sentinel-danger-light/20 text-sentinel-danger border border-sentinel-danger/30 animate-pulse-glow shadow-sm',
  };

  return (
    <span className={cn(baseClasses, verdictClasses[verdict], className)}>
      {verdict}
    </span>
  );
};

export default VerdictBadge;
