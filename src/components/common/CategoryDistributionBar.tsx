'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CategorySegment {
  id: string;
  label: string;
  percentage: number;
  color: string; // Tailwind class like 'bg-gray-900'
  textColor?: string; // e.g. text-gray-900
  highlightValue?: string; // if present, shows the floating pill
  glowColor?: string; // gradient tailwind for the highlight glow
}

interface CategoryDistributionBarProps {
  title?: string;
  segments: CategorySegment[];
  className?: string;
}

export function CategoryDistributionBar({ title, segments, className }: CategoryDistributionBarProps) {
  // Calculate total to ensure it's 100%
  const total = segments.reduce((sum, s) => sum + s.percentage, 0);

  return (
    <div className={cn("clean-card p-6 flex flex-col justify-center", className)}>
      {title && <h3 className="font-bold text-gray-900 mb-8">{title}</h3>}

      <div className="relative pt-12 pb-4">
        {/* Floating Highlight & Percentages Layer */}
        <div className="absolute top-0 left-0 w-full flex items-end h-10 px-1">
          {segments.map((segment) => {
            const hasHighlight = !!segment.highlightValue;
            return (
              <div
                key={`top-${segment.id}`}
                style={{ width: `${(segment.percentage / total) * 100}%` }}
                className="relative h-full flex items-end justify-center"
              >
                {hasHighlight ? (
                  // Highlight Pill (e.g. Goal / Revenue)
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center"
                  >
                    <div className="relative z-10 px-4 py-1.5 bg-blue-600 text-white font-bold text-sm rounded-full whitespace-nowrap shadow-md">
                      {segment.highlightValue}
                    </div>
                    {/* Glow effect behind */}
                    <div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 -z-10 rounded-full scale-150" />
                    
                    {/* Vertical dashed indicator lines on edges - simulated by a wide box with border-x */}
                    <div className="absolute top-4 w-[110%] h-12 border-x border-dashed border-gray-300/70 -z-20 pointer-events-none" />
                  </motion.div>
                ) : (
                  // Normal Percentage Text
                  <span className="text-gray-500 font-semibold text-sm mb-1.5">
                    {segment.percentage}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* The Bar Segments */}
        <div className="w-full flex gap-1 h-3 mt-4 relative z-10">
          {segments.map((segment, idx) => (
            <motion.div
              key={`bar-${segment.id}`}
              initial={{ width: 0 }}
              animate={{ width: `${(segment.percentage / total) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full", segment.color)}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6">
        {segments.map((segment) => (
          <div key={`legend-${segment.id}`} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", segment.color)} />
            <span className="text-sm font-semibold text-gray-600">{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
