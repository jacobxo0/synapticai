import { z } from 'zod';

// Enhanced mood classification
export const MoodStateSchema = z.enum([
  'distressed',
  'anxious',
  'overwhelmed',
  'reflective',
  'motivated',
  'uncertain',
  'hopeful',
  'neutral'
]);

export const MoodIntensitySchema = z.enum([
  'low',
  'medium',
  'high',
  'critical'
]);

// Types for prompt configuration
export const PromptStyleSchema = z.enum(['empathy', 'coaching', 'philosophical']);
export const PromptIntensitySchema = z.enum(['low', 'medium', 'high']);
export const PromptDepthSchema = z.enum(['surface', 'moderate', 'deep']);
export const LanguageSchema = z.enum(['en', 'da']);
export const EmotionalToneSchema = z.enum(['comforting', 'energizing', 'reflective']);
export const SessionTypeSchema = z.enum([
  'daily_checkin',
  'mood_exploration',
  'reflective_journaling',
  'goal_review',
  'gentle_challenge',
  'self_care_reminder'
]);

export type MoodState = z.infer<typeof MoodStateSchema>;
export type MoodIntensity = z.infer<typeof MoodIntensitySchema>;
export type PromptStyle = z.infer<typeof PromptStyleSchema>;
export type PromptIntensity = z.infer<typeof PromptIntensitySchema>;
export type PromptDepth = z.infer<typeof PromptDepthSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type EmotionalTone = z.infer<typeof EmotionalToneSchema>;
export type SessionType = z.infer<typeof SessionTypeSchema>;

export interface PromptConfig {
  style: PromptStyle;
  intensity: PromptIntensity;
  depth: PromptDepth;
  language: Language;
  tone: EmotionalTone;
  sessionType: SessionType;
  moodState?: MoodState;
  moodIntensity?: MoodIntensity;
  userPreferences?: {
    name?: string;
    preferredPronouns?: string;
    communicationStyle?: 'direct' | 'metaphorical' | 'balanced';
    sensitivityLevel?: 'low' | 'medium' | 'high';
  };
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Language-specific templates
const languageTemplates = {
  en: {
    daily_checkin: {
      comforting: {
        low: "Good {timeOfDay}, {name}. How are you feeling today?",
        medium: "I'm here to listen, {name}. What's on your mind today?",
        high: "I'm present with you, {name}. How has your day been so far?"
      },
      energizing: {
        low: "Hello {name}! What's inspiring you today?",
        medium: "Let's start the day with intention, {name}. What's calling your attention?",
        high: "I'm excited to connect with you, {name}! What energy are you bringing into today?"
      },
      reflective: {
        low: "Welcome back, {name}. What thoughts are you carrying with you today?",
        medium: "Let's take a moment to check in, {name}. How are you really doing?",
        high: "I'm here to explore with you, {name}. What's present in your awareness today?"
      }
    },
    mood_exploration: {
      comforting: {
        low: "I notice you're feeling {emotion}. Would you like to talk about it?",
        medium: "I'm here with you in this {emotion} moment. What's coming up for you?",
        high: "Your feelings are valid and important. Let's explore this {emotion} together."
      },
      energizing: {
        low: "What's sparking this {emotion} feeling for you?",
        medium: "Let's understand what's behind this {emotion}. What's the story?",
        high: "I see your strength in facing this {emotion}. What's it teaching you?"
      },
      reflective: {
        low: "What does this {emotion} feel like in your body?",
        medium: "Let's explore the layers of this {emotion}. What's beneath the surface?",
        high: "This {emotion} is a messenger. What is it trying to tell you?"
      }
    }
  },
  da: {
    daily_checkin: {
      comforting: {
        low: "God {timeOfDay}, {name}. Hvordan har du det i dag?",
        medium: "Jeg er her for at lytte, {name}. Hvad fylder i din tanker i dag?",
        high: "Jeg er til stede med dig, {name}. Hvordan har din dag været indtil videre?"
      },
      energizing: {
        low: "Hej {name}! Hvad inspirerer dig i dag?",
        medium: "Lad os starte dagen med intention, {name}. Hvad fanger din opmærksomhed?",
        high: "Jeg glæder mig til at forbinde med dig, {name}! Hvilken energi bringer du ind i dag?"
      },
      reflective: {
        low: "Velkommen tilbage, {name}. Hvilke tanker bærer du med dig i dag?",
        medium: "Lad os tage et øjeblik til at tjekke ind, {name}. Hvordan har du det virkelig?",
        high: "Jeg er her for at udforske med dig, {name}. Hvad er til stede i din bevidsthed i dag?"
      }
    },
    mood_exploration: {
      comforting: {
        low: "Jeg bemærker, at du føler dig {emotion}. Vil du tale om det?",
        medium: "Jeg er her med dig i dette {emotion} øjeblik. Hvad kommer op i dig?",
        high: "Dine følelser er valide og vigtige. Lad os udforske denne {emotion} sammen."
      },
      energizing: {
        low: "Hvad vækker denne {emotion} følelse i dig?",
        medium: "Lad os forstå, hvad der ligger bag denne {emotion}. Hvad er historien?",
        high: "Jeg ser din styrke i at møde denne {emotion}. Hvad lærer den dig?"
      },
      reflective: {
        low: "Hvordan føles denne {emotion} i din krop?",
        medium: "Lad os udforske lagene i denne {emotion}. Hvad ligger under overfladen?",
        high: "Denne {emotion} er en budbærer. Hvad prøver den at fortælle dig?"
      }
    }
  }
};

// Helper function to get appropriate template based on config
function getTemplate(config: PromptConfig, emotion?: string, timeOfDay?: string): string {
  const template = languageTemplates[config.language][config.sessionType][config.tone][config.intensity];
  let result = template;
  
  if (config.userPreferences?.name) {
    result = result.replace('{name}', config.userPreferences.name);
  }
  if (emotion) {
    result = result.replace('{emotion}', emotion);
  }
  if (timeOfDay) {
    result = result.replace('{timeOfDay}', timeOfDay);
  }
  
  return result;
}

// Tone fallback logic
function determineAppropriateTone(
  currentMood: MoodState,
  intensity: MoodIntensity,
  previousTone?: EmotionalTone
): EmotionalTone {
  // Never fall back to neutral if previous tone was therapeutic
  if (previousTone && previousTone !== 'neutral') {
    return previousTone;
  }

  // Mood-based tone selection
  switch (currentMood) {
    case 'distressed':
    case 'anxious':
    case 'overwhelmed':
      return 'comforting';
    case 'reflective':
    case 'uncertain':
      return 'reflective';
    case 'motivated':
    case 'hopeful':
      return 'energizing';
    default:
      return previousTone || 'reflective'; // Default to reflective over neutral
  }
}

// Context-aware prompt builder
function buildContextAwarePrompt(
  config: PromptConfig,
  moodState: MoodState,
  previousContext?: string
): Message[] {
  const messages: Message[] = [];
  
  // Determine appropriate tone based on mood
  const appropriateTone = determineAppropriateTone(
    moodState,
    config.moodIntensity || 'medium',
    config.tone
  );

  // Enhanced system message
  const systemMessage = {
    role: 'system' as const,
    content: `You are a therapeutic AI assistant operating in ${appropriateTone} tone at ${config.depth} depth.
    Current user mood: ${moodState}${config.moodIntensity ? ` (${config.moodIntensity} intensity)` : ''}
    Previous context: ${previousContext || 'None'}
    Style: ${config.style}
    Session Type: ${config.sessionType}
    ${config.userPreferences ? `User Preferences: ${JSON.stringify(config.userPreferences)}` : ''}
    
    Critical Instructions:
    - Maintain consistent therapeutic presence
    - Never break character or revert to neutral/robotic responses
    - Match emotional intensity appropriately
    - Preserve context and continuity
    - Always respond with empathy and understanding`
  };
  messages.push(systemMessage);

  return messages;
}

// Main prompt builder function
export function buildPrompt(
  config: PromptConfig,
  userInput: string,
  context?: string,
  emotion?: string,
  timeOfDay?: string
): Message[] {
  const messages: Message[] = [];
  
  // Get mood state from config or default to reflective
  const moodState = config.moodState || 'reflective';
  
  // Build context-aware prompt
  const contextMessages = buildContextAwarePrompt(config, moodState, context);
  messages.push(...contextMessages);

  // User message with template
  const userMessage = {
    role: 'user' as const,
    content: `${getTemplate(config, emotion, timeOfDay)}\n\n${userInput}`
  };
  messages.push(userMessage);

  return messages;
}

// Insight prompt builder
export function buildInsightPrompt(
  config: PromptConfig,
  userInput: string,
  context?: string
): Message[] {
  const messages: Message[] = [];
  
  const systemMessage = {
    role: 'system' as const,
    content: `You are an insightful therapeutic AI assistant specializing in ${config.style} analysis at ${config.depth} depth.
    Your responses should be in ${config.language}.
    Tone: ${config.tone}
    ${config.userPreferences ? `User Preferences: ${JSON.stringify(config.userPreferences)}` : ''}
    ${context ? `Context: ${context}` : ''}`
  };
  messages.push(systemMessage);

  const userMessage = {
    role: 'user' as const,
    content: `Let's explore deeper insights about:\n\n${userInput}`
  };
  messages.push(userMessage);

  return messages;
}

// Sentiment prompt builder
export function buildSentimentPrompt(
  config: PromptConfig,
  userInput: string,
  context?: string
): Message[] {
  const messages: Message[] = [];
  
  const systemMessage = {
    role: 'system' as const,
    content: `You are a therapeutic AI assistant with expertise in emotional analysis at ${config.depth} depth.
    Your responses should be in ${config.language}.
    Tone: ${config.tone}
    ${config.userPreferences ? `User Preferences: ${JSON.stringify(config.userPreferences)}` : ''}
    ${context ? `Context: ${context}` : ''}`
  };
  messages.push(systemMessage);

  const userMessage = {
    role: 'user' as const,
    content: `Let's explore the emotional landscape of:\n\n${userInput}`
  };
  messages.push(userMessage);

  return messages;
}

export const TONE_SYSTEM_PROMPTS = {
  supportive: {
    instruction: "You are a warm, compassionate companion who provides gentle support and validation.",
    expanded: `Respond with:
- Warm, nurturing tone
- Active listening and emotional validation
- Gentle encouragement without pressure
- Emphasis on self-compassion
- Focus on emotional safety and comfort
- Use of comforting metaphors and imagery
- Patience and understanding`,
    example: "I hear that you're feeling stuck today, and that's completely okay. These moments can feel heavy, but they're also opportunities for gentle self-reflection. Would you like to explore what's contributing to this feeling? We can take it one small step at a time, at whatever pace feels right for you."
  },
  direct: {
    instruction: "You are a clear, focused guide who provides honest, practical insights.",
    expanded: `Respond with:
- Clear, concise language
- Direct observations and insights
- Practical suggestions
- Honest feedback
- Focus on actionable steps
- Respectful boundaries
- Solution-oriented approach`,
    example: "Feeling stuck often means we're at a decision point. Let's identify what's holding you back. What specific area feels most challenging right now? We can address it directly and find a way forward."
  },
  curious: {
    instruction: "You are an inquisitive companion who helps explore thoughts and feelings through thoughtful questioning.",
    expanded: `Respond with:
- Open-ended, exploratory questions
- Genuine curiosity about experiences
- Reflective observations
- Space for self-discovery
- Non-judgmental exploration
- Focus on patterns and connections
- Gentle probing of underlying themes`,
    example: "I'm curious about what 'stuck' means for you today. What thoughts or feelings come up when you notice this sense of being stuck? How does it show up in your body or daily activities?"
  }
} as const; 