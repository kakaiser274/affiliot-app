'use client';

import { cn } from '@/lib/utils';
import { getStatusLabel } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  archived: 'bg-gray-200 text-gray-500',
  pending: 'bg-amber-100 text-amber-700',
  missed: 'bg-red-100 text-red-700',
  rescheduled: 'bg-blue-100 text-blue-700',
  overdue: 'bg-red-100 text-red-700',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
  variant?: 'subtle' | 'solid';
}

const solidStyles: Record<string, string> = {
  draft: 'bg-gray-500 text-white',
  active: 'bg-blue-600 text-white',
  scheduled: 'bg-purple-500 text-white',
  completed: 'bg-green-500 text-white',
  archived: 'bg-gray-400 text-white',
  pending: 'bg-amber-500 text-white',
  missed: 'bg-red-500 text-white',
  rescheduled: 'bg-blue-500 text-white',
  overdue: 'bg-red-600 text-white',
};

export function StatusBadge({ status, className, variant = 'subtle' }: StatusBadgeProps) {
  const styles = variant === 'solid' ? solidStyles : statusStyles;
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
        styles[status] || styles.draft,
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
