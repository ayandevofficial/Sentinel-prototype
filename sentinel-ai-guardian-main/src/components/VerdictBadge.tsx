import React from 'react';
import { cn } from '@/lib/utils';

interface VerdictBadgeProps {
  verdict: 'CLEAN' | 'BLOCKED';
  className?: string;
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, className }) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';
  
  const verdictClasses = {
    CLEAN: 'bg-sentinel-success-light text-sentinel-success',
    BLOCKED: 'bg-sentinel-danger-light text-sentinel-danger animate-pulse-glow',
  };

  return (
    <span className={cn(baseClasses, verdictClasses[verdict], className)}>
      {verdict}
    </span>
  );
};

export default VerdictBadge;
