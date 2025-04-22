import { buildPrompt, buildInsightPrompt, buildSentimentPrompt } from '../prompts';
import { 
  PromptConfig, 
  PromptStyle, 
  PromptIntensity, 
  PromptDepth, 
  Language,
  EmotionalTone,
  SessionType,
  MoodState,
  MoodIntensity
} from '../prompts';

describe('Therapeutic Prompt Templates', () => {
  const defaultConfig: PromptConfig = {
    style: 'empathy',
    intensity: 'medium',
    depth: 'moderate',
    language: 'en',
    tone: 'comforting',
    sessionType: 'daily_checkin',
    moodState: 'neutral',
    moodIntensity: 'medium',
    userPreferences: {
      name: 'Test User',
      preferredPronouns: 'they/them',
      communicationStyle: 'balanced',
      sensitivityLevel: 'medium'
    }
  };

  describe('Mood Classification and Tone Selection', () => {
    it('should select comforting tone for distressed mood', () => {
      const distressedConfig: PromptConfig = {
        ...defaultConfig,
        moodState: 'distressed',
        moodIntensity: 'high'
      };
      const messages = buildPrompt(distressedConfig, 'Test input');
      
      expect(messages[0].content).toContain('comforting');
      expect(messages[0].content).toContain('distressed');
      expect(messages[0].content).toContain('high intensity');
    });

    it('should select reflective tone for uncertain mood', () => {
      const uncertainConfig: PromptConfig = {
        ...defaultConfig,
        moodState: 'uncertain',
        moodIntensity: 'medium'
      };
      const messages = buildPrompt(uncertainConfig, 'Test input');
      
      expect(messages[0].content).toContain('reflective');
      expect(messages[0].content).toContain('uncertain');
    });

    it('should select energizing tone for motivated mood', () => {
      const motivatedConfig: PromptConfig = {
        ...defaultConfig,
        moodState: 'motivated',
        moodIntensity: 'medium'
      };
      const messages = buildPrompt(motivatedConfig, 'Test input');
      
      expect(messages[0].content).toContain('energizing');
      expect(messages[0].content).toContain('motivated');
    });

    it('should maintain previous therapeutic tone', () => {
      const config: PromptConfig = {
        ...defaultConfig,
        tone: 'comforting',
        moodState: 'neutral'
      };
      const messages = buildPrompt(config, 'Test input');
      
      expect(messages[0].content).toContain('comforting');
      expect(messages[0].content).not.toContain('neutral');
    });

    it('should handle critical intensity appropriately', () => {
      const criticalConfig: PromptConfig = {
        ...defaultConfig,
        moodState: 'anxious',
        moodIntensity: 'critical'
      };
      const messages = buildPrompt(criticalConfig, 'Test input');
      
      expect(messages[0].content).toContain('critical');
      expect(messages[0].content).toContain('comforting');
    });
  });

  describe('Context Preservation', () => {
    it('should include previous context in system message', () => {
      const context = 'Previous conversation about anxiety';
      const messages = buildPrompt(defaultConfig, 'Test input', context);
      
      expect(messages[0].content).toContain(context);
    });

    it('should maintain context across multiple messages', () => {
      const context = 'Ongoing discussion about stress management';
      const messages = buildPrompt(defaultConfig, 'Test input', context);
      
      expect(messages[0].content).toContain('Maintain consistent therapeutic presence');
      expect(messages[0].content).toContain('Preserve context and continuity');
    });
  });

  describe('Critical Instructions', () => {
    it('should include therapeutic presence instructions', () => {
      const messages = buildPrompt(defaultConfig, 'Test input');
      
      expect(messages[0].content).toContain('Never break character');
      expect(messages[0].content).toContain('Always respond with empathy');
    });

    it('should maintain emotional intensity matching', () => {
      const messages = buildPrompt(defaultConfig, 'Test input');
      
      expect(messages[0].content).toContain('Match emotional intensity appropriately');
    });
  });

  describe('buildPrompt', () => {
    it('should create valid message array with default config', () => {
      const messages = buildPrompt(defaultConfig, 'Test input');
      
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('system');
      expect(messages[1].role).toBe('user');
      expect(messages[0].content).toContain('therapeutic');
      expect(messages[0].content).toContain('comforting');
      expect(messages[0].content).toContain('daily_checkin');
    });

    it('should include user preferences in system message', () => {
      const messages = buildPrompt(defaultConfig, 'Test input');
      
      expect(messages[0].content).toContain('Test User');
      expect(messages[0].content).toContain('they/them');
      expect(messages[0].content).toContain('balanced');
    });

    it('should include emotion when provided', () => {
      const emotion = 'anxious';
      const messages = buildPrompt(defaultConfig, 'Test input', undefined, emotion);
      
      expect(messages[1].content).toContain(emotion);
    });

    it('should include time of day when provided', () => {
      const timeOfDay = 'morning';
      const messages = buildPrompt(defaultConfig, 'Test input', undefined, undefined, timeOfDay);
      
      expect(messages[1].content).toContain(timeOfDay);
    });

    it('should support Danish language', () => {
      const danishConfig: PromptConfig = {
        ...defaultConfig,
        language: 'da'
      };
      const messages = buildPrompt(danishConfig, 'Test input');
      
      expect(messages[0].content).toContain('da');
      expect(messages[1].content).toMatch(/God/);
    });

    it('should support different emotional tones', () => {
      const energizingConfig: PromptConfig = {
        ...defaultConfig,
        tone: 'energizing'
      };
      const messages = buildPrompt(energizingConfig, 'Test input');
      
      expect(messages[0].content).toContain('energizing');
      expect(messages[1].content).toMatch(/inspiring/);
    });

    it('should support different session types', () => {
      const moodConfig: PromptConfig = {
        ...defaultConfig,
        sessionType: 'mood_exploration'
      };
      const messages = buildPrompt(moodConfig, 'Test input', undefined, 'happy');
      
      expect(messages[0].content).toContain('mood_exploration');
      expect(messages[1].content).toMatch(/feeling/);
    });
  });

  describe('buildInsightPrompt', () => {
    it('should create insight-focused message array', () => {
      const messages = buildInsightPrompt(defaultConfig, 'Test input');
      
      expect(messages[0].content).toContain('insightful');
      expect(messages[1].content).toContain('explore deeper insights');
    });

    it('should maintain tone and user preferences', () => {
      const messages = buildInsightPrompt(defaultConfig, 'Test input');
      
      expect(messages[0].content).toContain('comforting');
      expect(messages[0].content).toContain('Test User');
    });
  });

  describe('buildSentimentPrompt', () => {
    it('should create sentiment-focused message array', () => {
      const messages = buildSentimentPrompt(defaultConfig, 'Test input');
      
      expect(messages[0].content).toContain('emotional analysis');
      expect(messages[1].content).toContain('emotional landscape');
    });

    it('should support different tones', () => {
      const reflectiveConfig: PromptConfig = {
        ...defaultConfig,
        tone: 'reflective'
      };
      const messages = buildSentimentPrompt(reflectiveConfig, 'Test input');
      
      expect(messages[0].content).toContain('reflective');
    });
  });

  describe('Type Safety', () => {
    it('should enforce valid tone values', () => {
      const invalidConfig = {
        ...defaultConfig,
        tone: 'invalid' as EmotionalTone
      };
      
      // @ts-expect-error - Testing invalid tone
      expect(() => buildPrompt(invalidConfig, 'Test input')).toThrow();
    });

    it('should enforce valid session type values', () => {
      const invalidConfig = {
        ...defaultConfig,
        sessionType: 'invalid' as SessionType
      };
      
      // @ts-expect-error - Testing invalid session type
      expect(() => buildPrompt(invalidConfig, 'Test input')).toThrow();
    });

    it('should enforce valid user preference values', () => {
      const invalidConfig = {
        ...defaultConfig,
        userPreferences: {
          ...defaultConfig.userPreferences,
          communicationStyle: 'invalid' as 'direct' | 'metaphorical' | 'balanced'
        }
      };
      
      // @ts-expect-error - Testing invalid communication style
      expect(() => buildPrompt(invalidConfig, 'Test input')).toThrow();
    });
  });
}); 