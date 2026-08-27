'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Copy, Pencil, Trash2, Star } from 'lucide-react';
import type { GeneratedContent } from '@/types';
import { getContentTypeLabel } from '@/lib/utils';

interface ContentCardProps {
  content: GeneratedContent;
  className?: string;
  onCopy?: () => void;
  onFavorite?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ContentCard({
  content,
  className,
  onCopy,
  onFavorite,
  onEdit,
  onDelete,
}: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'clean-card clean-card-hover p-5 group flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {content.title && (
            <h4 className="text-sm font-bold text-gray-900">{content.title}</h4>
          )}
          {content.emotion && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {content.emotion}
            </span>
          )}
          {content.format && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {content.format}
            </span>
          )}
        </div>
        <button
          onClick={onFavorite}
          className={cn(
            'p-1.5 rounded-full transition-colors',
            content.favorite
              ? 'bg-yellow-100 text-yellow-600'
              : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-500'
          )}
        >
          <Star className={cn('w-4 h-4', content.favorite && 'fill-yellow-500')} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {content.content}
        </p>

        {/* Visual concept for thumbnail ideas */}
        {content.visualConcept && (
          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs font-semibold text-gray-900 mb-1">💡 Konsep Visual</p>
            <p className="text-xs text-gray-600 italic">
              {content.visualConcept}
            </p>
          </div>
        )}
      </div>

      {/* Actions & Meta */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500">
          {getContentTypeLabel(content.type)} · <span className="text-blue-600">{content.aiModel}</span>
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onCopy}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            title="Salin"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
