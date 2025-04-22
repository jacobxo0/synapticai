import { FeedbackCreateInput, FEEDBACK_TAGS } from '../models/feedback';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateFeedbackInput(input: FeedbackCreateInput): ValidationResult {
  const errors: string[] = [];

  // Validate sessionId
  if (!input.sessionId || typeof input.sessionId !== 'string') {
    errors.push('Invalid sessionId');
  }

  // Validate rating
  if (typeof input.rating !== 'number' || input.rating < 1 || input.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  // Validate tags
  if (!Array.isArray(input.tags)) {
    errors.push('Tags must be an array');
  } else {
    const invalidTags = input.tags.filter(tag => !FEEDBACK_TAGS.includes(tag as any));
    if (invalidTags.length > 0) {
      errors.push(`Invalid tags: ${invalidTags.join(', ')}`);
    }
  }

  // Validate comment (if provided)
  if (input.comment !== undefined && typeof input.comment !== 'string') {
    errors.push('Comment must be a string');
  }

  // Validate context (if provided)
  if (input.context) {
    if (input.context.conversationId && typeof input.context.conversationId !== 'string') {
      errors.push('Invalid conversationId in context');
    }
    if (input.context.mode && typeof input.context.mode !== 'string') {
      errors.push('Invalid mode in context');
    }
    if (input.context.memoryTags && !Array.isArray(input.context.memoryTags)) {
      errors.push('Invalid memoryTags in context');
    }
    if (input.context.promptType && typeof input.context.promptType !== 'string') {
      errors.push('Invalid promptType in context');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
} 