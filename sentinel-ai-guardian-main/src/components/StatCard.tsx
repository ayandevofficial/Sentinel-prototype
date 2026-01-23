import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: 'primary' | 'success' | 'danger' | 'warning';
  className?: string;
  progressBar?: {
    value: number;
    color: 'primary' | 'success' | 'danger' | 'warning';
  };
}

/**
 * StatCard Component
 * Metric visualization card designed for dashboard overviews.
 * Features: Responsive grid adaptation, dynamic icon coloring, and optional progress indicators.
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'primary',
  className,
  progressBar,
}) => {
  // Style mapping for different metric severities
  const iconColorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-sentinel-success bg-sentinel-success-light/20',
    danger: 'text-sentinel-danger bg-sentinel-danger-light/20',
    warning: 'text-sentinel-warning bg-sentinel-warning-light/20',
  };

  const progressColorClasses = {
    primary: 'bg-primary',
    success: 'bg-sentinel-success',
    danger: 'bg-sentinel-danger',
    warning: 'bg-sentinel-warning',
  };

  return (
    <div className={cn('sentinel-card p-4 md:p-6 hover:shadow-md transition-shadow duration-300', className)}>
      <div className="flex items-center md:items-start gap-3 md:gap-4">
        {/* Responsive Icon Container */}
        <div className={cn('p-2.5 md:p-3 rounded-xl shrink-0', iconColorClasses[iconColor])}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        
        {/* Metric Value & Label */}
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-foreground mt-0.5 md:mt-1 truncate">
            {value}
          </p>
        </div>
      </div>

      {/* Optional Progress Context */}
      {progressBar && (
        <div className="mt-4 md:mt-5">
          <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-700 ease-out', progressColorClasses[progressBar.color])}
              style={{ width: `${Math.max(0, Math.min(progressBar.value, 100))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
