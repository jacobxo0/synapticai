import { Mood } from './adaptiveToneCopy';
import { TonePreference } from '../stores/useToneStore';

interface CoachingInput {
  entry: string;
  reflection: string;
  mood: Mood | null;
  tone: TonePreference;
  focusAreas?: string[];
}

interface CoachingPrompt {
  context: string;
  reflection: string;
  actionFrame: string;
  boundaries: string;
  metadata: {
    tone: TonePreference;
    mood: Mood | null;
    focusAreas: string[];
    tokenEstimate: number;
  };
}

const TONE_FRAMING = {
  supportive: {
    action: "You might consider exploring",
    agency: "What feels right for you?",
    boundary: "Remember, these are suggestions for exploration, not directives. You know your situation best."
  },
  direct: {
    action: "Let's identify specific steps",
    agency: "What concrete actions could you take?",
    boundary: "These are starting points for your exploration. The pace and direction are yours to determine."
  },
  curious: {
    action: "What possibilities emerge when you consider",
    agency: "What discoveries might you make?",
    boundary: "These are invitations to explore. Your journey of discovery is unique to you."
  }
};

const MOOD_ACTIONS = {
  happy: {
    supportive: "building on this positive energy",
    direct: "capitalizing on this momentum",
    curious: "exploring what's working well"
  },
  neutral: {
    supportive: "finding your next step",
    direct: "identifying clear actions",
    curious: "discovering new possibilities"
  },
  sad: {
    supportive: "finding gentle ways forward",
    direct: "taking small, manageable steps",
    curious: "exploring what might help"
  },
  anxious: {
    supportive: "creating a sense of safety",
    direct: "breaking this down into smaller pieces",
    curious: "understanding what's beneath the surface"
  },
  angry: {
    supportive: "channeling this energy constructively",
    direct: "focusing on what you can control",
    curious: "exploring what this is telling you"
  }
};

export class CoachingEngine {
  private extractKeyInsights(reflection: string): string {
    // Simple extraction of key insights from reflection
    const sentences = reflection.split(/[.!?]+/);
    return sentences
      .filter(sentence => 
        sentence.includes('you') || 
        sentence.includes('your') ||
        sentence.includes('this')
      )
      .slice(0, 2)
      .join('. ') + '.';
  }

  private buildActionFrame(
    input: CoachingInput,
    toneFraming: typeof TONE_FRAMING[keyof typeof TONE_FRAMING],
    moodAction: string
  ): string {
    const { focusAreas = [] } = input;
    
    let frame = `${toneFraming.action} ${moodAction}. `;
    
    if (focusAreas.length > 0) {
      const focusPhrase = focusAreas.length === 1 
        ? `this ${focusAreas[0]} area`
        : `these areas of ${focusAreas.join(' and ')}`;
      
      frame += `What small adjustments could you make in ${focusPhrase}? `;
    }
    
    frame += `${toneFraming.agency}`;
    
    return frame;
  }

  public buildCoachingPrompt(input: CoachingInput): CoachingPrompt {
    const { entry, reflection, mood, tone, focusAreas = [] } = input;
    
    // Get tone-specific framing
    const toneFraming = TONE_FRAMING[tone];
    
    // Get mood-appropriate action
    const moodAction = mood 
      ? MOOD_ACTIONS[mood][tone]
      : MOOD_ACTIONS.neutral[tone];
    
    // Build context
    const context = `[Context]
Emotional State: ${mood || 'neutral'}
Focus Areas: ${focusAreas.join(', ') || 'general exploration'}
Tone: ${tone}`;
    
    // Extract key insights
    const reflectionSummary = this.extractKeyInsights(reflection);
    
    // Build action frame
    const actionFrame = this.buildActionFrame(input, toneFraming, moodAction);
    
    // Set boundaries
    const boundaries = toneFraming.boundary;
    
    // Estimate tokens
    const tokenEstimate = 
      context.length / 4 + 
      reflectionSummary.length / 4 + 
      actionFrame.length / 4 + 
      boundaries.length / 4;
    
    return {
      context,
      reflection: `[Reflection Summary]\n${reflectionSummary}`,
      actionFrame: `[Action Frame]\n${actionFrame}`,
      boundaries: `[Boundaries]\n${boundaries}`,
      metadata: {
        tone,
        mood,
        focusAreas,
        tokenEstimate: Math.ceil(tokenEstimate)
      }
    };
  }

  public formatPromptForClaude(prompt: CoachingPrompt): string {
    return `${prompt.context}

${prompt.reflection}

${prompt.actionFrame}

${prompt.boundaries}

[Metadata]
Tone: ${prompt.metadata.tone}
Mood: ${prompt.metadata.mood || 'neutral'}
Focus Areas: ${prompt.metadata.focusAreas.join(', ')}
Token Estimate: ${prompt.metadata.tokenEstimate}`;
  }
} 