import { Mood, selectMicrocopy } from './adaptiveToneCopy';
import { TonePreference } from '../stores/useToneStore';

interface ReflectionContext {
  emotion: string[];
  depth: 'surface' | 'moderate' | 'deep';
  focus: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  depthScore: number;
}

interface ReflectionPrompt {
  opening: string;
  context: string;
  questions: string[];
  closing: string;
  metadata: {
    tone: TonePreference;
    mood: Mood | null;
    sentiment: string;
    depthScore: number;
  };
}

const EMOTION_TAGS = {
  surface: ['feeling', 'experience', 'moment'],
  moderate: ['pattern', 'connection', 'insight'],
  deep: ['meaning', 'growth', 'transformation']
};

const DEPTH_QUESTIONS = {
  surface: [
    "What stood out to you in this experience?",
    "How did you feel in the moment?",
    "What was most noticeable about this situation?"
  ],
  moderate: [
    "What patterns do you notice in how you're responding?",
    "How does this connect to other experiences?",
    "What insights are emerging for you?"
  ],
  deep: [
    "What deeper meaning might this hold for you?",
    "How might this experience contribute to your growth?",
    "What transformation might be possible here?"
  ]
};

const FOCUS_AREA_TAGS = {
  work: {
    keywords: ['work', 'job', 'career', 'project', 'meeting', 'deadline', 'boss', 'colleague', 'promotion', 'salary'],
    phrases: ['at work', 'in the office', 'workplace', 'professional', 'business', 'team', 'company', 'industry'],
    semantic: ['professional growth', 'career development', 'work performance', 'job satisfaction']
  },
  relationships: {
    keywords: ['friend', 'family', 'partner', 'relationship', 'love', 'dating', 'marriage', 'parent', 'child', 'sibling'],
    phrases: ['my partner', 'my family', 'my friends', 'social life', 'personal life', 'close to', 'connected to'],
    semantic: ['interpersonal dynamics', 'social connections', 'relationship quality', 'emotional bonds']
  },
  wellbeing: {
    keywords: ['health', 'fitness', 'exercise', 'diet', 'sleep', 'stress', 'anxiety', 'depression', 'mental', 'physical'],
    phrases: ['my health', 'wellbeing', 'self care', 'taking care', 'feeling good', 'feeling bad', 'mental health'],
    semantic: ['health habits', 'self-care practices', 'wellness routine', 'mental wellbeing']
  },
  identity: {
    keywords: ['identity', 'self', 'who i am', 'values', 'beliefs', 'purpose', 'meaning', 'authentic', 'true self'],
    phrases: ['my identity', 'who i am', 'my values', 'my beliefs', 'my purpose', 'my meaning', 'being authentic'],
    semantic: ['self-concept', 'personal identity', 'core values', 'life purpose']
  },
  goals: {
    keywords: ['goal', 'plan', 'future', 'dream', 'aspiration', 'ambition', 'achievement', 'success', 'progress'],
    phrases: ['my goals', 'my plans', 'my future', 'my dreams', 'my aspirations', 'my ambitions', 'my achievements'],
    semantic: ['goal setting', 'future planning', 'personal growth', 'achievement orientation']
  },
  creativity: {
    keywords: ['creative', 'art', 'music', 'writing', 'design', 'project', 'idea', 'inspiration', 'expression'],
    phrases: ['my art', 'my music', 'my writing', 'my design', 'my project', 'my ideas', 'my inspiration'],
    semantic: ['creative expression', 'artistic process', 'creative flow', 'inspiration']
  }
} as const;

type FocusArea = keyof typeof FOCUS_AREA_TAGS;

interface FocusDetection {
  area: FocusArea;
  confidence: number;
  matches: {
    keywords: number;
    phrases: number;
    semantic: number;
  };
}

export class ReflectionEngine {
  private detectFocusAreas(entry: string): FocusArea[] {
    const entryLower = entry.toLowerCase();
    const focusDetections: FocusDetection[] = [];
    
    // Analyze each focus area
    for (const [area, patterns] of Object.entries(FOCUS_AREA_TAGS)) {
      const detection: FocusDetection = {
        area: area as FocusArea,
        confidence: 0,
        matches: {
          keywords: 0,
          phrases: 0,
          semantic: 0
        }
      };

      // Check keywords
      detection.matches.keywords = patterns.keywords.filter(keyword => 
        entryLower.includes(keyword)
      ).length;

      // Check phrases
      detection.matches.phrases = patterns.phrases.filter(phrase => 
        entryLower.includes(phrase)
      ).length;

      // Check semantic patterns
      detection.matches.semantic = patterns.semantic.filter(pattern => 
        entryLower.includes(pattern)
      ).length;

      // Calculate confidence score
      detection.confidence = 
        (detection.matches.keywords * 0.4) + 
        (detection.matches.phrases * 0.4) + 
        (detection.matches.semantic * 0.2);

      if (detection.confidence > 0.3) {
        focusDetections.push(detection);
      }
    }

    // Sort by confidence and return top areas
    return focusDetections
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3)
      .map(detection => detection.area);
  }

  private analyzeEntry(entry: string): ReflectionContext {
    const words = entry.toLowerCase().split(/\s+/);
    const emotionWords = new Set<string>();
    let depthLevel: 'surface' | 'moderate' | 'deep' = 'surface';
    const focusAreas = this.detectFocusAreas(entry);
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let depthScore = 0;

    // Analyze emotional content and sentiment
    words.forEach(word => {
      if (word.match(/feel|emotion|mood|happy|sad|angry|anxious|excited|worried/)) {
        emotionWords.add(word);
      }
      
      // Sentiment analysis
      if (word.match(/happy|good|great|excellent|positive|success/)) {
        sentiment = 'positive';
      } else if (word.match(/sad|bad|difficult|hard|struggle|negative/)) {
        sentiment = 'negative';
      }
    });

    // Calculate depth score and level
    depthScore = this.calculateDepthScore(entry);
    if (depthScore > 0.7) {
      depthLevel = 'deep';
    } else if (depthScore > 0.4) {
      depthLevel = 'moderate';
    }

    return {
      emotion: Array.from(emotionWords),
      depth: depthLevel,
      focus: focusAreas,
      sentiment,
      depthScore
    };
  }

  private calculateDepthScore(entry: string): number {
    const words = entry.split(/\s+/);
    let score = 0;

    // Length factor (0-0.3)
    score += Math.min(words.length / 500, 0.3);

    // Complexity factor (0-0.3)
    const complexWords = words.filter(word => word.length > 6).length;
    score += Math.min(complexWords / words.length, 0.3);

    // Emotional depth factor (0-0.4)
    const emotionalWords = words.filter(word => 
      word.match(/feel|think|believe|understand|realize|experience|reflect/)
    ).length;
    score += Math.min(emotionalWords / words.length * 2, 0.4);

    return Math.min(score, 1);
  }

  private buildContextString(context: ReflectionContext): string {
    const { emotion, depth, focus, sentiment, depthScore } = context;
    
    const contextParts = [
      `Emotional Context: ${emotion.length > 0 ? emotion.join(', ') : 'neutral'}`,
      `Reflection Depth: ${depth} (${Math.round(depthScore * 100)}%)`,
      `Focus Areas: ${focus.length > 0 ? focus.join(', ') : 'general'}`,
      `Sentiment: ${sentiment}`
    ];

    return contextParts.join('\n');
  }

  private selectQuestions(context: ReflectionContext): string[] {
    const { depth, focus } = context;
    const baseQuestions = DEPTH_QUESTIONS[depth];
    
    // Add focus-specific questions if present
    const focusQuestions = focus.map(area => {
      switch (area) {
        case 'work':
          return "How does this relate to your professional growth?";
        case 'relationships':
          return "What does this reveal about your connections with others?";
        case 'goals':
          return "How might this influence your future plans?";
        case 'wellbeing':
          return "What impact might this have on your overall wellbeing?";
        default:
          return null;
      }
    }).filter(Boolean) as string[];

    return [...baseQuestions, ...focusQuestions];
  }

  public buildReflectionPrompt(
    entry: string,
    mood: Mood | null,
    tonePreference: TonePreference = 'supportive'
  ): ReflectionPrompt {
    const context = this.analyzeEntry(entry);
    const microcopy = selectMicrocopy(tonePreference, mood);
    
    const prompt: ReflectionPrompt = {
      opening: microcopy.opening,
      context: this.buildContextString(context),
      questions: this.selectQuestions(context),
      closing: "Take your time to reflect on these questions. There are no right or wrong answers.",
      metadata: {
        tone: tonePreference,
        mood,
        sentiment: context.sentiment,
        depthScore: context.depthScore
      }
    };

    return prompt;
  }

  public formatPromptForClaude(prompt: ReflectionPrompt): string {
    return `${prompt.opening}

${prompt.context}

Let's explore this together. Consider these questions:
${prompt.questions.map(q => `- ${q}`).join('\n')}

${prompt.closing}

[Metadata]
Tone: ${prompt.metadata.tone}
Mood: ${prompt.metadata.mood || 'neutral'}
Sentiment: ${prompt.metadata.sentiment}
Depth Score: ${Math.round(prompt.metadata.depthScore * 100)}%`;
  }

  public estimateTokenUsage(prompt: ReflectionPrompt): number {
    const formattedPrompt = this.formatPromptForClaude(prompt);
    // Rough estimation: 4 characters ≈ 1 token
    return Math.ceil(formattedPrompt.length / 4);
  }
} 