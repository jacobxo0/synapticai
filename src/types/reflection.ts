export type ReflectionType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Reflection {
  id: string;
  type: ReflectionType;
  content: string;
  mood: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReflectionPrompt {
  id: string;
  text: string;
  category: string;
  type: ReflectionType;
  isActive: boolean;
}

export interface ReflectionFeedback {
  id: string;
  reflectionId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface ReflectionAnalytics {
  totalReflections: number;
  averageMood: number;
  mostCommonTags: string[];
  reflectionFrequency: Record<ReflectionType, number>;
} 