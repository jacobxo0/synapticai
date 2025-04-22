import { Session } from '@prisma/client';

export interface Feedback {
  id: string;
  sessionId: string;
  userId?: string; // Optional for anonymous feedback
  rating: number;
  tags: string[];
  comment?: string;
  context?: {
    conversationId?: string;
    mode?: string;
    memoryTags?: string[];
    promptType?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackCreateInput {
  sessionId: string;
  userId?: string;
  rating: number;
  tags: string[];
  comment?: string;
  context?: {
    conversationId?: string;
    mode?: string;
    memoryTags?: string[];
    promptType?: string;
  };
}

export interface FeedbackResponse {
  success: boolean;
  feedback?: Feedback;
  error?: string;
}

export const FEEDBACK_TAGS = [
  'helpful',
  'empathetic',
  'insightful',
  'confusing',
  'irrelevant',
  'too_short',
  'too_long',
  'technical_issue',
  'other'
] as const;

export type FeedbackTag = typeof FEEDBACK_TAGS[number]; 