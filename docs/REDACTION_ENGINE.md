# Redaction Engine

## Overview
The Redaction Engine is a privacy-first system that identifies and handles sensitive content in user entries. It ensures that personal, traumatic, or identifiable information is properly managed before being used in AI interactions or exports.

## Core Components

### 1. Content Classification
```typescript
type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical';
type ContentCategory = 'personal' | 'trauma' | 'health' | 'identity' | 'conflict';

interface ContentClassification {
  level: SensitivityLevel;
  categories: ContentCategory[];
  requiresReview: boolean;
  redactionFlags: string[];
}
```

### 2. Redaction Rules
```typescript
interface RedactionRule {
  pattern: RegExp;
  category: ContentCategory;
  action: 'mask' | 'remove' | 'flag';
  replacement: string;
  requiresReview: boolean;
}
```

### 3. User Preferences
```typescript
interface UserPrivacyFlags {
  allowPersonalInfo: boolean;
  allowTraumaContent: boolean;
  allowHealthData: boolean;
  allowIdentityInfo: boolean;
  allowConflictContent: boolean;
  requireReviewThreshold: SensitivityLevel;
}
```

## Implementation

### 1. Pattern Detection
- Names and identifiers
- Addresses and locations
- Medical information
- Financial data
- Trauma indicators
- Conflict markers
- Identity markers

### 2. Redaction Actions
- Masking (e.g., "[NAME]", "[LOCATION]")
- Removal (complete removal of sensitive sections)
- Flagging (marking for review)
- Classification (categorizing content sensitivity)

### 3. Review Process
- Automatic classification
- User review prompts
- Consent management
- Audit logging

## Usage Example

```typescript
import { redactSensitiveContent } from '../services/redactionEngine';

const userFlags: UserPrivacyFlags = {
  allowPersonalInfo: false,
  allowTraumaContent: false,
  allowHealthData: false,
  allowIdentityInfo: false,
  allowConflictContent: false,
  requireReviewThreshold: 'medium'
};

const result = redactSensitiveContent(entry, userFlags);

// Result structure
interface RedactionResult {
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
```

## Safety Measures

### 1. Default Cautious
- Always err on the side of caution
- Require explicit user consent
- Maintain strict privacy boundaries
- Log all redaction actions

### 2. Content Categories
- #trauma: Abuse, violence, loss
- #health: Medical conditions, treatments
- #identity: Race, gender, orientation
- #conflict: Arguments, disputes, legal issues

### 3. Review Triggers
- High sensitivity content
- Multiple categories
- Complex redaction needs
- User preference changes

## Integration

### 1. Claude Prompts
- Pre-process all inputs
- Include sensitivity context
- Add usage restrictions
- Flag review requirements

### 2. Export Handling
- Apply redaction rules
- Include sensitivity metadata
- Add usage warnings
- Track consent status

### 3. User Interface
- Show redaction previews
- Highlight sensitive content
- Request explicit consent
- Provide review options

## Privacy Considerations
- No permanent storage of sensitive data
- Encrypted audit logs
- Regular privacy reviews
- User data minimization

## Future Improvements
1. Machine learning for better pattern detection
2. Context-aware redaction
3. Custom rule creation
4. Multi-language support
5. Real-time redaction preview
6. Advanced consent management
7. Automated sensitivity scoring
8. Integration with privacy laws 