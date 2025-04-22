import { logger } from '../utils/logger';

export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ContentCategory = 'personal' | 'trauma' | 'health' | 'identity' | 'conflict';

export interface ContentClassification {
  level: SensitivityLevel;
  categories: ContentCategory[];
  requiresReview: boolean;
  redactionFlags: string[];
}

export interface UserPrivacyFlags {
  allowPersonalInfo: boolean;
  allowTraumaContent: boolean;
  allowHealthData: boolean;
  allowIdentityInfo: boolean;
  allowConflictContent: boolean;
  requireReviewThreshold: SensitivityLevel;
}

export interface RedactionResult {
  cleanContent: string;
  classification: ContentClassification;
  flags: {
    requiresReview: boolean;
    sensitiveCategories: ContentCategory[];
    redactedSections: {
      start: number;
      end: number;
      category: ContentCategory;
    }[];
  };
}

// Default redaction rules
const REDACTION_RULES: {
  pattern: RegExp;
  category: ContentCategory;
  action: 'mask' | 'remove' | 'flag';
  replacement: string;
  requiresReview: boolean;
}[] = [
  // Personal Information
  {
    pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Names
    category: 'personal',
    action: 'mask',
    replacement: '[NAME]',
    requiresReview: true
  },
  {
    pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
    category: 'personal',
    action: 'mask',
    replacement: '[PHONE]',
    requiresReview: true
  },
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
    category: 'personal',
    action: 'mask',
    replacement: '[EMAIL]',
    requiresReview: true
  },

  // Trauma Indicators
  {
    pattern: /\b(abuse|violence|assault|trauma|ptsd)\b/gi,
    category: 'trauma',
    action: 'flag',
    replacement: '$1',
    requiresReview: true
  },

  // Health Information
  {
    pattern: /\b(diagnosis|treatment|medication|therapy|hospital)\b/gi,
    category: 'health',
    action: 'flag',
    replacement: '$1',
    requiresReview: true
  },

  // Identity Markers
  {
    pattern: /\b(race|ethnicity|gender|orientation|religion)\b/gi,
    category: 'identity',
    action: 'flag',
    replacement: '$1',
    requiresReview: true
  },

  // Conflict Indicators
  {
    pattern: /\b(argument|dispute|conflict|legal|court)\b/gi,
    category: 'conflict',
    action: 'flag',
    replacement: '$1',
    requiresReview: true
  }
];

export const redactSensitiveContent = (
  content: string,
  userFlags: UserPrivacyFlags
): RedactionResult => {
  try {
    let cleanContent = content;
    const redactedSections: RedactionResult['flags']['redactedSections'] = [];
    const sensitiveCategories = new Set<ContentCategory>();
    let requiresReview = false;

    // Apply redaction rules
    REDACTION_RULES.forEach(rule => {
      if (!isCategoryAllowed(rule.category, userFlags)) {
        const matches = [...content.matchAll(rule.pattern)];
        
        matches.forEach(match => {
          if (match.index === undefined) return;
          
          const start = match.index;
          const end = start + match[0].length;
          
          // Store redaction information
          redactedSections.push({
            start,
            end,
            category: rule.category
          });
          
          sensitiveCategories.add(rule.category);
          
          // Apply redaction
          if (rule.action === 'mask') {
            cleanContent = cleanContent.substring(0, start) + 
                          rule.replacement + 
                          cleanContent.substring(end);
          } else if (rule.action === 'remove') {
            cleanContent = cleanContent.substring(0, start) + 
                          cleanContent.substring(end);
          }
          
          if (rule.requiresReview) {
            requiresReview = true;
          }
        });
      }
    });

    // Classify content sensitivity
    const classification = classifyContent(
      Array.from(sensitiveCategories),
      requiresReview
    );

    // Check if review is required based on user preferences
    requiresReview = requiresReview || 
      classification.level >= userFlags.requireReviewThreshold;

    return {
      cleanContent,
      classification,
      flags: {
        requiresReview,
        sensitiveCategories: Array.from(sensitiveCategories),
        redactedSections
      }
    };
  } catch (error) {
    logger.error('Error redacting sensitive content:', error);
    // Return original content with high sensitivity classification
    return {
      cleanContent: content,
      classification: {
        level: 'critical',
        categories: [],
        requiresReview: true,
        redactionFlags: ['error']
      },
      flags: {
        requiresReview: true,
        sensitiveCategories: [],
        redactedSections: []
      }
    };
  }
};

const isCategoryAllowed = (category: ContentCategory, flags: UserPrivacyFlags): boolean => {
  switch (category) {
    case 'personal':
      return flags.allowPersonalInfo;
    case 'trauma':
      return flags.allowTraumaContent;
    case 'health':
      return flags.allowHealthData;
    case 'identity':
      return flags.allowIdentityInfo;
    case 'conflict':
      return flags.allowConflictContent;
    default:
      return false;
  }
};

const classifyContent = (
  categories: ContentCategory[],
  requiresReview: boolean
): ContentClassification => {
  // Determine sensitivity level based on categories
  let level: SensitivityLevel = 'low';
  
  if (categories.includes('trauma') || categories.includes('health')) {
    level = 'high';
  } else if (categories.includes('identity') || categories.includes('conflict')) {
    level = 'medium';
  } else if (categories.includes('personal')) {
    level = 'medium';
  }

  // Critical if multiple high-sensitivity categories
  if (categories.length >= 2 && 
      (categories.includes('trauma') || categories.includes('health'))) {
    level = 'critical';
  }

  return {
    level,
    categories,
    requiresReview,
    redactionFlags: categories.map(cat => `#${cat}`)
  };
};

// Helper function to prepare Claude-safe prompts
export const prepareClaudePrompt = (
  content: string,
  result: RedactionResult
): string => {
  const sensitivityNotice = result.classification.redactionFlags.length > 0
    ? `[SENSITIVITY: ${result.classification.redactionFlags.join(', ')}]`
    : '';

  const reviewNotice = result.flags.requiresReview
    ? '[REVIEW REQUIRED: This content contains sensitive information that requires user review]'
    : '';

  return `${sensitivityNotice}\n${reviewNotice}\n\n${result.cleanContent}`;
}; 