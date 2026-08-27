'use client';

import { cn } from '@/lib/utils';
import { getOpportunityLabel } from '@/lib/utils';

interface OpportunityGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function OpportunityGauge({ score, size = 'md', showLabel = true }: OpportunityGaugeProps) {
  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // Green
    if (s >= 60) return '#3b82f6'; // Blue
    if (s >= 40) return '#eab308'; // Yellow
    if (s >= 20) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const dimensions = { sm: 56, md: 80, lg: 110 };
  const strokeWidths = { sm: 4, md: 6, lg: 8 };
  const fontSizes = { sm: 'text-xs', md: 'text-base', lg: 'text-xl' };

  const dim = dimensions[size];
  const strokeWidth = strokeWidths[size];
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>
        <div className={cn(
          'absolute inset-0 flex items-center justify-center font-bold text-gray-900',
          fontSizes[size]
        )}>
          {score}
        </div>
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          {getOpportunityLabel(score)}
        </span>
      )}
    </div>
  );
}
