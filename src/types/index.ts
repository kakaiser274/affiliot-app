// ============================================================
// Affiliot — TypeScript Type Definitions
// ============================================================

// --- User ---
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  timezone: string;
  createdAt: string;
}

export interface UserPreferences {
  preferredAiProvider: 'openai' | 'claude' | 'gemini' | 'openrouter';
  language: string;
  dailyGoal: number;
  weeklyGoal: number;
  monthlyGoal: number;
  notificationEnabled: boolean;
  calendarConnected: boolean;
}

// --- Campaign ---
export type CampaignStatus = 'draft' | 'active' | 'scheduled' | 'completed' | 'archived';

export interface Campaign {
  id: string;
  userId: string;
  productName: string;
  productImage?: string;
  tiktokShopUrl: string;
  status: CampaignStatus;
  opportunityScore: number;
  contentCount: number;
  progress: number; // 0-100
  nextSchedule?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  category?: string;
  price?: string;
  usp?: string;
  target_audience?: string;
  selling_points?: string[];
  pain_points?: string[];
  emotion_triggers?: string[];
  quick_analysis?: string;
}

// --- Product Analysis ---
export interface ProductAnalysis {
  id: string;
  campaignId: string;
  audience: string[];
  painPoints: string[];
  usp: string;
  sellingAngle: string;
  emotionTrigger: string[];
  positioning: string;
  contentDifficulty: 'easy' | 'medium' | 'hard';
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendation: 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended';
  recommendationReason: string;
  createdAt: string;
}

// --- Generated Content ---
export type ContentType =
  | 'hook'
  | 'script'
  | 'caption'
  | 'cta'
  | 'hashtag'
  | 'first_comment'
  | 'video_idea'
  | 'thumbnail_idea';

export interface GeneratedContent {
  id: string;
  campaignId: string;
  type: ContentType;
  content: string;
  title?: string;
  emotion?: string;
  format?: string; // untuk video_idea: POV, Storytelling, dll.
  visualConcept?: string; // untuk thumbnail_idea
  favorite: boolean;
  archived: boolean;
  aiModel: string;
  createdAt: string;
  updatedAt: string;
}

// --- Schedule ---
export type ScheduleStatus = 'pending' | 'completed' | 'missed' | 'rescheduled';
export type EventType = 'upload' | 'reminder' | 'deadline' | 'review' | 'generate';

export interface ScheduleItem {
  id: string;
  campaignId: string;
  campaignName: string;
  contentId?: string;
  title: string;
  description?: string;
  scheduleAt: string;
  status: ScheduleStatus;
  eventType: EventType;
  googleEventId?: string;
  createdAt: string;
}

// --- Goals ---
export interface Goals {
  id: string;
  userId: string;
  weeklyTarget: number;
  monthlyTarget: number;
  weeklyProgress: number;
  monthlyProgress: number;
  streak: number;
  updatedAt: string;
}

// --- AI Coach ---
export interface CoachRecommendation {
  id: string;
  userId: string;
  recommendation: string;
  icon: string;
  priority: number;
  validUntil: string;
  createdAt: string;
}

// --- Today's Task ---
export interface TodayTask {
  id: string;
  campaignId: string;
  campaignName: string;
  title: string;
  status: 'pending' | 'completed' | 'overdue';
  dueTime?: string;
}

// --- Chat ---
export interface ChatSession {
  id: string;
  campaignId: string;
  campaignName: string;
  title: string;
  lastMessage?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  message: string;
  createdAt: string;
}

// --- Campaign History ---
export interface CampaignHistoryItem {
  id: string;
  campaignId: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// --- Campaign Note ---
export interface CampaignNote {
  id: string;
  campaignId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
