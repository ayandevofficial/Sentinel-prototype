import React from 'react';
import { Shield } from 'lucide-react';

interface SentinelLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const SentinelLogo: React.FC<SentinelLogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Shield className={`${sizeClasses[size]} text-primary`} strokeWidth={2} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary font-bold" style={{ fontSize: size === 'sm' ? '8px' : size === 'md' ? '10px' : '14px' }}>
            S
          </span>
        </div>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-semibold text-foreground`}>
          Sentinel AI
        </span>
      )}
    </div>
  );
};

export default SentinelLogo;
