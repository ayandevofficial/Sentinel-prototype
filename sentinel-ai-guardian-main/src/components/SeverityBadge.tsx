import React from 'react';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: 'high' | 'medium' | 'low';
  className?: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium';
  
  const severityClasses = {
    high: 'bg-sentinel-danger-light text-sentinel-danger',
    medium: 'bg-sentinel-info-light text-sentinel-info',
    low: 'bg-sentinel-success-light text-sentinel-success',
  };

  return (
    <span className={cn(baseClasses, severityClasses[severity], className)}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

export default SeverityBadge;
