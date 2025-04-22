import { 
  redactSensitiveContent, 
  prepareClaudePrompt,
  UserPrivacyFlags,
  ContentCategory,
  SensitivityLevel
} from '../redactionEngine';

describe('Redaction Engine', () => {
  const defaultUserFlags: UserPrivacyFlags = {
    allowPersonalInfo: false,
    allowTraumaContent: false,
    allowHealthData: false,
    allowIdentityInfo: false,
    allowConflictContent: false,
    requireReviewThreshold: 'medium'
  };

  describe('redactSensitiveContent', () => {
    it('should redact personal information', () => {
      const content = 'John Smith can be reached at john@example.com or 555-123-4567';
      const result = redactSensitiveContent(content, defaultUserFlags);

      expect(result.cleanContent).toBe('[NAME] can be reached at [EMAIL] or [PHONE]');
      expect(result.classification.categories).toContain('personal');
      expect(result.flags.sensitiveCategories).toContain('personal');
      expect(result.flags.redactedSections).toHaveLength(3);
    });

    it('should flag trauma-related content', () => {
      const content = 'I experienced trauma after the assault';
      const result = redactSensitiveContent(content, defaultUserFlags);

      expect(result.cleanContent).toBe(content);
      expect(result.classification.categories).toContain('trauma');
      expect(result.classification.level).toBe('high');
      expect(result.flags.requiresReview).toBe(true);
    });

    it('should handle health information', () => {
      const content = 'My diagnosis was confirmed at the hospital';
      const result = redactSensitiveContent(content, defaultUserFlags);

      expect(result.cleanContent).toBe(content);
      expect(result.classification.categories).toContain('health');
      expect(result.classification.level).toBe('high');
    });

    it('should respect user privacy flags', () => {
      const content = 'John Smith experienced trauma';
      const flags: UserPrivacyFlags = {
        ...defaultUserFlags,
        allowPersonalInfo: true,
        allowTraumaContent: true
      };

      const result = redactSensitiveContent(content, flags);

      expect(result.cleanContent).toBe(content);
      expect(result.classification.categories).toHaveLength(0);
      expect(result.flags.requiresReview).toBe(false);
    });

    it('should handle multiple sensitive categories', () => {
      const content = 'John Smith (race: Asian) experienced trauma at the hospital';
      const result = redactSensitiveContent(content, defaultUserFlags);

      expect(result.cleanContent).toBe('[NAME] (race: Asian) experienced trauma at the hospital');
      expect(result.classification.categories).toContain('personal');
      expect(result.classification.categories).toContain('trauma');
      expect(result.classification.categories).toContain('health');
      expect(result.classification.categories).toContain('identity');
      expect(result.classification.level).toBe('critical');
    });

    it('should handle empty content', () => {
      const result = redactSensitiveContent('', defaultUserFlags);

      expect(result.cleanContent).toBe('');
      expect(result.classification.categories).toHaveLength(0);
      expect(result.classification.level).toBe('low');
      expect(result.flags.requiresReview).toBe(false);
    });

    it('should handle error cases gracefully', () => {
      const result = redactSensitiveContent(null as any, defaultUserFlags);

      expect(result.classification.level).toBe('critical');
      expect(result.classification.redactionFlags).toContain('error');
      expect(result.flags.requiresReview).toBe(true);
    });
  });

  describe('prepareClaudePrompt', () => {
    it('should include sensitivity notices', () => {
      const content = 'John Smith experienced trauma';
      const result = redactSensitiveContent(content, defaultUserFlags);
      const prompt = prepareClaudePrompt(content, result);

      expect(prompt).toContain('[SENSITIVITY: #personal, #trauma]');
      expect(prompt).toContain('[REVIEW REQUIRED:');
      expect(prompt).toContain('[NAME] experienced trauma');
    });

    it('should not include notices for non-sensitive content', () => {
      const content = 'Today was a good day';
      const result = redactSensitiveContent(content, defaultUserFlags);
      const prompt = prepareClaudePrompt(content, result);

      expect(prompt).not.toContain('[SENSITIVITY:');
      expect(prompt).not.toContain('[REVIEW REQUIRED:');
      expect(prompt).toBe(content);
    });
  });

  describe('sensitivity classification', () => {
    it('should classify content with trauma as high sensitivity', () => {
      const content = 'I experienced trauma';
      const result = redactSensitiveContent(content, defaultUserFlags);

      expect(result.classification.level).toBe('high');
      expect(result.classification.categories).toContain('trauma');
    });

    it('should classify content with health information as high sensitivity', () => {
      const content = 'I went to the hospital';
      const result = redactSensitiveContent(content, defaultUserFlags);

      expect(result.classification.level).toBe('high');
      expect(result.classification.categories).toContain('health');
    });

    it('should classify content with identity markers as medium sensitivity', () => {
      const content = 'I am Asian';
      const result = redactSensitiveContent(content, defaultUserFlags);

      expect(result.classification.level).toBe('medium');
      expect(result.classification.categories).toContain('identity');
    });

    it('should classify content with multiple high-sensitivity categories as critical', () => {
      const content = 'I experienced trauma at the hospital';
      const result = redactSensitiveContent(content, defaultUserFlags);

      expect(result.classification.level).toBe('critical');
      expect(result.classification.categories).toContain('trauma');
      expect(result.classification.categories).toContain('health');
    });
  });
}); 