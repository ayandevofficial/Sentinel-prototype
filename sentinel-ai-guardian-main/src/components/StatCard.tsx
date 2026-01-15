import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: 'primary' | 'success' | 'danger' | 'warning';
  subtitle?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  progressBar?: {
    value: number;
    color: 'primary' | 'success' | 'danger' | 'warning';
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'primary',
  className,
  progressBar,
}) => {
  const iconColorClasses = {
    primary: 'text-primary bg-sentinel-info-light',
    success: 'text-sentinel-success bg-sentinel-success-light',
    danger: 'text-sentinel-danger bg-sentinel-danger-light',
    warning: 'text-sentinel-warning bg-sentinel-warning-light',
  };

  const progressColorClasses = {
    primary: 'bg-primary',
    success: 'bg-sentinel-success',
    danger: 'bg-sentinel-danger',
    warning: 'bg-sentinel-warning',
  };

  return (
    <div className={cn('sentinel-card p-6', className)}>
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-lg', iconColorClasses[iconColor])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        </div>
      </div>
      {progressBar && (
        <div className="mt-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500', progressColorClasses[progressBar.color])}
              style={{ width: `${Math.min(progressBar.value, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
