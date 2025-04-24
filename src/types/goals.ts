export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export type GoalPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface GoalSuggestion {
  title: string;
  description?: string;
  priority: GoalPriority;
  tone?: string;
  confidence: number;
}

export interface GoalProgress {
  id: string;
  goalId: string;
  status: string;
  note?: string;
  createdAt: string;
} 