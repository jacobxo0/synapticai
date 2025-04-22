import { TonePreference } from '../stores/useToneStore';

export type Mood = 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry';

interface MicrocopyFragment {
  opening: string;
  continuation: string;
  fallback: string;
}

interface ToneMicrocopy {
  [key: string]: {
    [key in Mood]: MicrocopyFragment;
  };
}

export const ADAPTIVE_TONE_COPY: ToneMicrocopy = {
  supportive: {
    happy: {
      opening: "I'm glad you're feeling positive! Let's build on this energy...",
      continuation: "That's wonderful to hear. How can we keep this momentum going?",
      fallback: "I'm here to support you. What would you like to explore?"
    },
    neutral: {
      opening: "I'm here to support you. What's on your mind today?",
      continuation: "I'm listening. What else would you like to share?",
      fallback: "I'm here to support you. What would you like to explore?"
    },
    sad: {
      opening: "I hear your sadness. Would you like to talk about what's weighing on you?",
      continuation: "It's okay to feel this way. What would help you feel supported right now?",
      fallback: "I'm here to support you. What would you like to explore?"
    },
    anxious: {
      opening: "Let's take this one step at a time. What feels most manageable right now?",
      continuation: "I understand this feels overwhelming. Let's break it down together.",
      fallback: "I'm here to support you. What would you like to explore?"
    },
    angry: {
      opening: "I understand you're upset. Let's find a way to process these feelings together.",
      continuation: "Your feelings are valid. How can we work through this constructively?",
      fallback: "I'm here to support you. What would you like to explore?"
    }
  },
  direct: {
    happy: {
      opening: "Great! Let's outline your next steps clearly...",
      continuation: "Perfect. Here's what we need to focus on next:",
      fallback: "Let's get straight to the point. What's the priority?"
    },
    neutral: {
      opening: "Here's what we need to focus on: [specific steps]",
      continuation: "Moving forward, here's the plan:",
      fallback: "Let's get straight to the point. What's the priority?"
    },
    sad: {
      opening: "I see this is hard. Let's break it down into manageable pieces...",
      continuation: "Let's create a clear action plan to move forward:",
      fallback: "Let's get straight to the point. What's the priority?"
    },
    anxious: {
      opening: "Let's create a clear plan to address this. First, we'll...",
      continuation: "Here's the structured approach we'll take:",
      fallback: "Let's get straight to the point. What's the priority?"
    },
    angry: {
      opening: "Let's take a moment, then we can create an action plan.",
      continuation: "Here's how we can address this effectively:",
      fallback: "Let's get straight to the point. What's the priority?"
    }
  },
  curious: {
    happy: {
      opening: "What aspects of this success are most meaningful to you?",
      continuation: "What patterns do you notice in what's working well?",
      fallback: "What would you like to explore together?"
    },
    neutral: {
      opening: "What patterns do you notice in how you approach this?",
      continuation: "What connections are you seeing here?",
      fallback: "What would you like to explore together?"
    },
    sad: {
      opening: "What might help you feel more supported right now?",
      continuation: "What insights are emerging from this experience?",
      fallback: "What would you like to explore together?"
    },
    anxious: {
      opening: "Let's explore what feels most stable in this situation.",
      continuation: "What possibilities are you seeing in this challenge?",
      fallback: "What would you like to explore together?"
    },
    angry: {
      opening: "What's at the heart of what's upsetting you?",
      continuation: "What deeper understanding might help us here?",
      fallback: "What would you like to explore together?"
    }
  }
};

export function selectMicrocopy(tone: TonePreference, mood: Mood | null): MicrocopyFragment {
  if (!mood) {
    return {
      opening: ADAPTIVE_TONE_COPY[tone].neutral.fallback,
      continuation: ADAPTIVE_TONE_COPY[tone].neutral.continuation,
      fallback: ADAPTIVE_TONE_COPY[tone].neutral.fallback
    };
  }

  return ADAPTIVE_TONE_COPY[tone][mood];
}

export function getContinuationCue(tone: TonePreference, mood: Mood | null): string {
  const microcopy = selectMicrocopy(tone, mood);
  return microcopy.continuation;
}

export function getFallbackCue(tone: TonePreference): string {
  return ADAPTIVE_TONE_COPY[tone].neutral.fallback;
} 