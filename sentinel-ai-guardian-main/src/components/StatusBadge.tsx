import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Resolved' | 'Pending' | 'Investigating' | 'Blocked' | 'Active';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium';
  
  const statusClasses: Record<string, string> = {
    Resolved: 'bg-sentinel-success-light text-sentinel-success',
    Pending: 'bg-sentinel-warning-light text-amber-700',
    Investigating: 'bg-sentinel-info-light text-sentinel-info',
    Blocked: 'bg-sentinel-danger-light text-sentinel-danger',
    Active: 'bg-sentinel-success-light text-sentinel-success',
  };

  return (
    <span className={cn(baseClasses, statusClasses[status] || statusClasses.Pending, className)}>
      {status}
    </span>
  );
};

export default StatusBadge;
