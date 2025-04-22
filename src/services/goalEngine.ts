import { Mood } from './adaptiveToneCopy';
import { TonePreference } from '../stores/useToneStore';
import { v4 as uuidv4 } from 'uuid';

interface GoalInput {
  reflection: string;
  focusArea: string;
  tone: TonePreference;
  mood: Mood | null;
}

interface SuggestedGoal {
  id: string;
  content: string;
  focusArea: string;
  metadata: {
    tone: TonePreference;
    mood: Mood | null;
    duration: 'short' | 'medium' | 'long';
    confidence: number;
    tags: string[];
  };
}

const TONE_GOAL_FRAMING = {
  supportive: {
    prefix: "You might consider",
    action: "exploring",
    duration: "at your own pace",
    boundary: "Remember, this is just a suggestion. You know what feels right for you."
  },
  direct: {
    prefix: "A potential goal could be",
    action: "implementing",
    duration: "this week",
    boundary: "This is one possible approach. Feel free to adjust it to better suit your needs."
  },
  curious: {
    prefix: "What if you tried",
    action: "experimenting with",
    duration: "over the next few days",
    boundary: "This is an invitation to explore. You're free to modify or decline as you see fit."
  }
};

const DURATION_ESTIMATES = {
  short: {
    minWords: 50,
    maxWords: 100,
    confidenceThreshold: 0.7
  },
  medium: {
    minWords: 100,
    maxWords: 200,
    confidenceThreshold: 0.8
  },
  long: {
    minWords: 200,
    maxWords: 500,
    confidenceThreshold: 0.9
  }
};

const FOCUS_TEMPLATES = {
  work: {
    short: "one small change in your {action}",
    medium: "a specific aspect of your {action}",
    long: "a comprehensive approach to {action}"
  },
  relationships: {
    short: "one interaction in your {action}",
    medium: "a pattern in your {action}",
    long: "the dynamics of your {action}"
  },
  wellbeing: {
    short: "one aspect of your {action}",
    medium: "your approach to {action}",
    long: "your overall {action} strategy"
  }
};

export class GoalEngine {
  private calculateConfidence(
    reflection: string,
    focusArea: string,
    tone: TonePreference
  ): number {
    let confidence = 0.5; // Base confidence

    // Length factor
    const wordCount = reflection.split(/\s+/).length;
    if (wordCount > 100) confidence += 0.2;
    else if (wordCount > 50) confidence += 0.1;

    // Focus area clarity
    const focusMentions = (reflection.match(new RegExp(focusArea, 'gi')) || []).length;
    confidence += Math.min(focusMentions * 0.1, 0.2);

    // Tone alignment
    if (tone === 'direct' && reflection.includes('specific') || reflection.includes('clear')) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1);
  }

  private estimateDuration(
    reflection: string,
    confidence: number
  ): 'short' | 'medium' | 'long' {
    const wordCount = reflection.split(/\s+/).length;

    if (confidence >= DURATION_ESTIMATES.long.confidenceThreshold && 
        wordCount >= DURATION_ESTIMATES.long.minWords) {
      return 'long';
    } else if (confidence >= DURATION_ESTIMATES.medium.confidenceThreshold && 
               wordCount >= DURATION_ESTIMATES.medium.minWords) {
      return 'medium';
    }
    return 'short';
  }

  private extractTags(reflection: string, focusArea: string): string[] {
    const tags = new Set<string>();
    tags.add(focusArea);

    // Add emotional tags
    if (reflection.includes('feel') || reflection.includes('emotion')) {
      tags.add('emotional awareness');
    }
    if (reflection.includes('think') || reflection.includes('consider')) {
      tags.add('cognitive');
    }
    if (reflection.includes('do') || reflection.includes('action')) {
      tags.add('behavioral');
    }

    return Array.from(tags);
  }

  public generateGoalFromReflection(input: GoalInput): SuggestedGoal {
    const { reflection, focusArea, tone, mood } = input;
    
    // Calculate confidence
    const confidence = this.calculateConfidence(reflection, focusArea, tone);
    
    // Estimate duration
    const duration = this.estimateDuration(reflection, confidence);
    
    // Get tone framing
    const framing = TONE_GOAL_FRAMING[tone];
    
    // Get focus template
    const template = FOCUS_TEMPLATES[focusArea as keyof typeof FOCUS_TEMPLATES]?.[duration] || 
                    FOCUS_TEMPLATES.work[duration];
    
    // Build goal content
    const action = reflection.includes('improve') ? 'improvement' :
                  reflection.includes('change') ? 'change' :
                  reflection.includes('explore') ? 'exploration' : 'development';
    
    const templateContent = template.replace('{action}', action);
    
    const content = `${framing.prefix} ${framing.action} ${templateContent} ${framing.duration}. ${framing.boundary}`;
    
    // Extract tags
    const tags = this.extractTags(reflection, focusArea);
    
    return {
      id: uuidv4(),
      content,
      focusArea,
      metadata: {
        tone,
        mood,
        duration,
        confidence,
        tags
      }
    };
  }

  public formatGoalForClaude(goal: SuggestedGoal): string {
    return `[Suggested Goal]
${goal.content}

[Metadata]
ID: ${goal.id}
Focus Area: ${goal.focusArea}
Duration: ${goal.metadata.duration}
Confidence: ${Math.round(goal.metadata.confidence * 100)}%
Tags: ${goal.metadata.tags.join(', ')}`;
  }
} 