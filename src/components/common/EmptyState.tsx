'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center py-20 px-6 text-center clean-card',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-8">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-pill px-6 py-3 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
