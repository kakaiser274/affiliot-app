import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  return formatDate(dateString);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    active: 'Aktif',
    scheduled: 'Terjadwal',
    completed: 'Selesai',
    archived: 'Diarsipkan',
    pending: 'Tertunda',
    missed: 'Terlewat',
    rescheduled: 'Dijadwalkan Ulang',
    overdue: 'Terlambat',
  };
  return labels[status] || status;
}

export function getContentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    hook: 'Hook',
    script: 'Script',
    caption: 'Caption',
    cta: 'CTA',
    hashtag: 'Hashtag',
    first_comment: 'Komentar Pertama',
    video_idea: 'Ide Video',
    thumbnail_idea: 'Ide Thumbnail',
  };
  return labels[type] || type;
}

export function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    upload: 'Upload',
    reminder: 'Pengingat',
    deadline: 'Deadline',
    review: 'Review',
    generate: 'Generate',
  };
  return labels[type] || type;
}

export function getOpportunityLabel(score: number): string {
  if (score >= 80) return 'Sangat Tinggi';
  if (score >= 60) return 'Tinggi';
  if (score >= 40) return 'Sedang';
  if (score >= 20) return 'Rendah';
  return 'Sangat Rendah';
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
