import { MemoryStoreService } from './memoryStore';
import { ContextBuilder, ContextScope, MemoryType } from '../models/memory';
import { PrismaClient } from '@prisma/client';
import { TONE_CONFIG, TonePreference } from '../stores/useToneStore';
import { ADAPTIVE_TONE_COPY, Mood, selectMicrocopy, getContinuationCue } from './adaptiveToneCopy';
import { ReflectionEngine } from './reflectionEngine';
import { CoachingEngine } from './coachingEngine';
import { v4 as uuidv4 } from 'uuid';

interface ContextOptions {
  maxTokens?: number;
  includeRecentMessages?: boolean;
  includeUserProfile?: boolean;
  customTags?: string[];
  tonePreference?: TonePreference;
  isContinuation?: boolean;
  sessionType?: 'journal' | 'conversation' | 'reflection' | 'coaching';
  coachingEnabled?: boolean;
}

interface ToneWeight {
  baseWeight: number;    // User preference (0.6)
  moodWeight: number;    // Mood compatibility (0.3)
  contextWeight: number; // Conversation context (0.1)
}

interface TimelineContext {
  summary: string;
  anchors: TimelineAnchor[];
  recentStreaks: Streak[];
  goalHistory: GoalFocus[];
  metadata: {
    lastUpdated: Date;
    tokenCount: number;
    emotionalState: 'stable' | 'sensitive' | 'trauma';
  };
}

interface TimelineAnchor {
  id: string;
  date: Date;
  type: 'milestone' | 'shift' | 'pattern';
  description: string;
  emotionalTags: string[];
  relevance: number;
}

interface Streak {
  type: 'journaling' | 'reflection' | 'goal';
  startDate: Date;
  endDate: Date | null;
  count: number;
}

interface GoalFocus {
  area: string;
  startDate: Date;
  intensity: number;
  progress: number;
}

const TONE_MEMORY_TAGS = {
  supportive: ['empathy', 'support', 'encouragement'],
  direct: ['action', 'steps', 'clarity'],
  curious: ['exploration', 'patterns', 'insights']
} as const;

const TIMELINE_TEMPLATES = {
  stable: {
    summary: "Looking at your journey, we can see...",
    anchors: "Notable moments include...",
    progress: "Your progress in {area} shows..."
  },
  sensitive: {
    summary: "In recent weeks, you've been exploring...",
    anchors: "Some significant experiences were...",
    progress: "You've been working with {area}..."
  },
  trauma: {
    summary: "Your recent entries show...",
    anchors: "Important to note...",
    progress: "In {area}, you've been..."
  }
};

export class ContextBuilderService implements ContextBuilder {
  private memoryStore: MemoryStoreService;
  private prisma: PrismaClient;
  private lastToneContext: string | null = null;
  private reflectionEngine: ReflectionEngine;
  private coachingEngine: CoachingEngine;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.memoryStore = new MemoryStoreService(prisma);
    this.reflectionEngine = new ReflectionEngine();
    this.coachingEngine = new CoachingEngine();
  }

  private shouldOfferCoaching(
    recentMessages: any[],
    tonePreference: TonePreference,
    mood: Mood | null
  ): boolean {
    if (recentMessages.length < 2) return false;
    
    const lastMessage = recentMessages[0];
    const secondLastMessage = recentMessages[1];
    
    // Check if we have a journal entry followed by a reflection
    const isReflectionSequence = 
      secondLastMessage.content.length > 100 && // Likely journal entry
      lastMessage.content.includes('reflection') || 
      lastMessage.content.includes('consider');
    
    // Check if tone is appropriate for coaching
    const isActiveTone = tonePreference === 'direct' || tonePreference === 'curious';
    
    // Check if mood is suitable for coaching
    const isSuitableMood = mood !== 'sad' && mood !== 'anxious';
    
    return isReflectionSequence && isActiveTone && isSuitableMood;
  }

  private buildCoachingContext(
    entry: string,
    reflection: string,
    mood: Mood | null,
    tonePreference: TonePreference,
    focusAreas: string[]
  ): string {
    const coachingPrompt = this.coachingEngine.buildCoachingPrompt({
      entry,
      reflection,
      mood,
      tone: tonePreference,
      focusAreas
    });

    return this.coachingEngine.formatPromptForClaude(coachingPrompt);
  }

  async buildContext(userId: string, scope: ContextScope, options: ContextOptions = {}): Promise<string> {
    const {
      maxTokens = 4000,
      includeRecentMessages = true,
      includeUserProfile = true,
      customTags = [],
      tonePreference = 'supportive',
      isContinuation = false,
      sessionType = 'conversation',
      coachingEnabled = true
    } = options;

    // Get user profile for mood and context
    const userProfile = includeUserProfile
      ? await this.getUserProfile(userId)
      : null;

    const currentMood = userProfile?.moodEntries[0]?.mood?.toLowerCase() as Mood | null;

    // Calculate tone weights based on mood
    const toneWeights = this.calculateToneWeights(tonePreference, currentMood);

    // Get relevant memories with tone-specific tags
    const memories = await this.memoryStore.getMemories(userId, {
      type: scope === 'long_term' ? 'long_term' : 'short_term',
      tags: [...customTags, ...TONE_MEMORY_TAGS[tonePreference]],
      minWeight: 0.3,
      limit: 10,
    });

    // Get recent messages if needed
    const recentMessages = includeRecentMessages
      ? await this.getRecentMessages(userId)
      : [];

    // Build context sections with optimized tone handling
    const contextSections = [
      this.buildToneContext(tonePreference, toneWeights, currentMood, isContinuation),
      this.buildMemoryContext(memories, toneWeights),
      this.buildMessageContext(recentMessages),
      this.buildProfileContext(userProfile),
    ].filter(Boolean);

    // Add reflection context if this is a journal session
    if (sessionType === 'journal' && recentMessages.length > 0) {
      const lastMessage = recentMessages[0];
      const reflectionPrompt = this.reflectionEngine.buildReflectionPrompt(
        lastMessage.content,
        currentMood,
        tonePreference
      );
      
      // Log token usage for reflection
      const reflectionTokens = this.reflectionEngine.estimateTokenUsage(reflectionPrompt);
      console.log(`Reflection prompt token usage: ${reflectionTokens}`);
      
      contextSections.push(this.reflectionEngine.formatPromptForClaude(reflectionPrompt));

      // Check if we should offer coaching
      if (coachingEnabled && this.shouldOfferCoaching(recentMessages, tonePreference, currentMood)) {
        const coachingContext = this.buildCoachingContext(
          recentMessages[1].content, // The journal entry
          recentMessages[0].content, // The reflection
          currentMood,
          tonePreference,
          reflectionPrompt.metadata.focusAreas
        );
        
        // Check if we have enough tokens remaining
        const coachingTokens = Math.ceil(coachingContext.length / 4);
        const currentTokens = contextSections.join('\n\n').length / 4;
        
        if (currentTokens + coachingTokens <= maxTokens) {
          contextSections.push(coachingContext);
          console.log(`Added coaching context (${coachingTokens} tokens)`);
        } else {
          console.log('Skipping coaching context due to token limit');
        }
      }
    }

    // Combine and trim to token limit
    const context = this.trimToTokenLimit(contextSections.join('\n\n'), maxTokens);
    
    // Store the tone context for continuity
    this.lastToneContext = contextSections[0] || null;

    return context;
  }

  private calculateToneWeights(tone: TonePreference, mood: Mood | null): ToneWeight {
    const baseWeight = 0.6;
    const moodWeight = 0.3;
    const contextWeight = 0.1;

    // Adjust weights based on mood-tone compatibility
    let moodAdjustment = 0;
    if (mood) {
      switch (mood) {
        case 'sad':
        case 'anxious':
        case 'angry':
          moodAdjustment = tone === 'supportive' ? 0.1 : -0.1;
          break;
        case 'happy':
        case 'neutral':
          moodAdjustment = 0;
          break;
      }
    }

    return {
      baseWeight: baseWeight + (tone === 'supportive' ? moodAdjustment : 0),
      moodWeight: moodWeight - moodAdjustment,
      contextWeight
    };
  }

  private buildToneContext(tonePreference: TonePreference, weights: ToneWeight, mood: Mood | null, isContinuation: boolean): string {
    const toneConfig = TONE_CONFIG[tonePreference];
    const microcopy = selectMicrocopy(tonePreference, mood);
    
    // Select appropriate microcopy based on context
    const toneInstruction = isContinuation 
      ? getContinuationCue(tonePreference, mood)
      : microcopy.opening;

    // Add mood-specific adjustments if needed
    let moodAdjustment = '';
    if (mood && !isContinuation) {
      switch (mood) {
        case 'sad':
          moodAdjustment = '\nShow extra empathy and understanding.';
          break;
        case 'anxious':
          moodAdjustment = '\nProvide clear structure and reassurance.';
          break;
        case 'angry':
          moodAdjustment = '\nMaintain calm and help process emotions.';
          break;
      }
    }

    return `AI Tone Preference: ${toneConfig.label} (${Math.round(weights.baseWeight * 100)}% weight)
${toneInstruction}${moodAdjustment}`;
  }

  private buildMemoryContext(memories: any[], weights: ToneWeight): string {
    if (memories.length === 0) return '';

    const memoryEntries = memories.map(memory => {
      const toneRelevance = this.calculateToneRelevance(memory, weights);
      return `- [${memory.type}] ${memory.content} 
  (Priority: ${memory.priority}, Weight: ${memory.weight.toFixed(2)}, 
  Tone Relevance: ${toneRelevance.toFixed(2)})`;
    }).join('\n');

    return `Relevant Memories:\n${memoryEntries}`;
  }

  private calculateToneRelevance(memory: any, weights: ToneWeight): number {
    let relevance = 0;
    
    // Check memory tags for tone alignment
    if (memory.tags) {
      const tagMatches = memory.tags.filter((tag: string) => 
        Object.values(TONE_MEMORY_TAGS).flat().includes(tag)
      ).length;
      
      relevance += (tagMatches / memory.tags.length) * weights.baseWeight;
    }

    // Consider memory content length and recency
    relevance += (memory.content.length > 100 ? 0.1 : 0) * weights.contextWeight;
    relevance += (Date.now() - new Date(memory.updatedAt).getTime() < 86400000 ? 0.1 : 0) * weights.moodWeight;

    return Math.min(1, relevance);
  }

  private async getRecentMessages(userId: string) {
    return this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { conversation: true },
    });
  }

  private async getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        moodEntries: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  private buildMessageContext(messages: any[]): string {
    if (messages.length === 0) return '';

    const messageEntries = messages.map(msg => 
      `[${msg.conversation?.title || 'General'}] ${msg.content}`
    ).join('\n');

    return `Recent Conversation Context:\n${messageEntries}`;
  }

  private buildProfileContext(profile: any): string {
    if (!profile) return '';

    const mood = profile.moodEntries[0]?.mood || 'unknown';
    const preferences = profile.preferences || {};

    return `User Profile Context:
- Current Mood: ${mood}
- Preferences: ${JSON.stringify(preferences)}
- Language: ${profile.language || 'en'}`;
  }

  private trimToTokenLimit(text: string, maxTokens: number): string {
    // Simple token estimation (4 chars ≈ 1 token)
    const estimatedTokens = text.length / 4;
    
    if (estimatedTokens <= maxTokens) return text;

    // Remove sections until we're under the limit
    const sections = text.split('\n\n');
    let trimmedText = '';
    let currentTokens = 0;

    for (const section of sections) {
      const sectionTokens = section.length / 4;
      if (currentTokens + sectionTokens > maxTokens) break;
      
      trimmedText += (trimmedText ? '\n\n' : '') + section;
      currentTokens += sectionTokens;
    }

    return trimmedText;
  }

  private buildTimelineContext(
    recentEntries: any[],
    emotionalState: 'stable' | 'sensitive' | 'trauma'
  ): TimelineContext {
    const template = TIMELINE_TEMPLATES[emotionalState];
    
    // Analyze entries for timeline data
    const anchors = this.extractTimelineAnchors(recentEntries);
    const streaks = this.calculateStreaks(recentEntries);
    const goalHistory = this.analyzeGoalHistory(recentEntries);
    
    // Generate summary
    const summary = this.generateTimelineSummary(
      recentEntries,
      anchors,
      streaks,
      goalHistory,
      template
    );
    
    // Calculate token count
    const tokenCount = this.estimateTokenCount(summary, anchors, streaks, goalHistory);
    
    return {
      summary,
      anchors,
      recentStreaks: streaks,
      goalHistory,
      metadata: {
        lastUpdated: new Date(),
        tokenCount,
        emotionalState
      }
    };
  }

  private extractTimelineAnchors(entries: any[]): TimelineAnchor[] {
    const anchors: TimelineAnchor[] = [];
    
    entries.forEach((entry, index) => {
      if (this.isSignificantEvent(entry)) {
        anchors.push({
          id: uuidv4(),
          date: new Date(entry.date),
          type: this.determineAnchorType(entry),
          description: this.generateAnchorDescription(entry),
          emotionalTags: this.extractEmotionalTags(entry),
          relevance: this.calculateRelevance(entry, entries)
        });
      }
    });
    
    return anchors;
  }

  private calculateStreaks(entries: any[]): Streak[] {
    const streaks: Streak[] = [];
    let currentStreak: Streak | null = null;
    
    entries.forEach((entry, index) => {
      const entryDate = new Date(entry.date);
      const prevDate = index > 0 ? new Date(entries[index - 1].date) : null;
      
      if (!currentStreak || !this.isContinuous(entryDate, prevDate)) {
        if (currentStreak) {
          currentStreak.endDate = prevDate;
          streaks.push(currentStreak);
        }
        currentStreak = {
          type: this.determineStreakType(entry),
          startDate: entryDate,
          endDate: null,
          count: 1
        };
      } else {
        currentStreak.count++;
      }
    });
    
    if (currentStreak) {
      streaks.push(currentStreak);
    }
    
    return streaks;
  }

  private analyzeGoalHistory(entries: any[]): GoalFocus[] {
    const goals: { [key: string]: GoalFocus } = {};
    
    entries.forEach(entry => {
      const goalAreas = this.extractGoalAreas(entry);
      goalAreas.forEach(area => {
        if (!goals[area]) {
          goals[area] = {
            area,
            startDate: new Date(entry.date),
            intensity: 0,
            progress: 0
          };
        }
        goals[area].intensity = Math.max(goals[area].intensity, this.calculateIntensity(entry));
        goals[area].progress = this.calculateProgress(entry, goals[area]);
      });
    });
    
    return Object.values(goals);
  }

  private generateTimelineSummary(
    entries: any[],
    anchors: TimelineAnchor[],
    streaks: Streak[],
    goalHistory: GoalFocus[],
    template: typeof TIMELINE_TEMPLATES[keyof typeof TIMELINE_TEMPLATES]
  ): string {
    const summaryParts: string[] = [];
    
    // Add main summary
    summaryParts.push(template.summary);
    
    // Add significant anchors
    if (anchors.length > 0) {
      summaryParts.push(template.anchors);
      anchors.forEach(anchor => {
        summaryParts.push(`- ${anchor.description} (${anchor.date.toLocaleDateString()})`);
      });
    }
    
    // Add goal progress
    if (goalHistory.length > 0) {
      goalHistory.forEach(goal => {
        summaryParts.push(template.progress.replace('{area}', goal.area));
      });
    }
    
    return summaryParts.join('\n\n');
  }

  private estimateTokenCount(
    summary: string,
    anchors: TimelineAnchor[],
    streaks: Streak[],
    goalHistory: GoalFocus[]
  ): number {
    // Rough token estimation (1 token ≈ 4 characters)
    const summaryTokens = Math.ceil(summary.length / 4);
    const anchorTokens = anchors.reduce((sum, anchor) => 
      sum + Math.ceil(anchor.description.length / 4), 0);
    const streakTokens = streaks.reduce((sum, streak) => 
      sum + Math.ceil(JSON.stringify(streak).length / 4), 0);
    const goalTokens = goalHistory.reduce((sum, goal) => 
      sum + Math.ceil(JSON.stringify(goal).length / 4), 0);
    
    return summaryTokens + anchorTokens + streakTokens + goalTokens;
  }

  private isSignificantEvent(entry: any): boolean {
    // Implement logic to determine if an entry represents a significant event
    return entry.mood === 'milestone' || 
           entry.tags?.includes('breakthrough') || 
           entry.content?.includes('realized') ||
           entry.content?.includes('decided');
  }

  private determineAnchorType(entry: any): TimelineAnchor['type'] {
    if (entry.mood === 'milestone') return 'milestone';
    if (entry.tags?.includes('pattern')) return 'pattern';
    return 'shift';
  }

  private generateAnchorDescription(entry: any): string {
    // Implement logic to generate a concise description of the anchor
    return entry.content?.substring(0, 100) || 'Significant event';
  }

  private extractEmotionalTags(entry: any): string[] {
    const tags = new Set<string>();
    if (entry.mood) tags.add(entry.mood);
    if (entry.tags) entry.tags.forEach((tag: string) => tags.add(tag));
    return Array.from(tags);
  }

  private calculateRelevance(entry: any, allEntries: any[]): number {
    // Implement logic to calculate relevance based on entry content and context
    return 0.8; // Placeholder
  }

  private isContinuous(currentDate: Date, prevDate: Date | null): boolean {
    if (!prevDate) return false;
    const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
    return dayDiff <= 2; // Allow for small gaps
  }

  private determineStreakType(entry: any): Streak['type'] {
    if (entry.type === 'journal') return 'journaling';
    if (entry.type === 'reflection') return 'reflection';
    return 'goal';
  }

  private extractGoalAreas(entry: any): string[] {
    const areas = new Set<string>();
    if (entry.goals) entry.goals.forEach((goal: any) => areas.add(goal.area));
    return Array.from(areas);
  }

  private calculateIntensity(entry: any): number {
    // Implement logic to calculate goal intensity
    return 0.5; // Placeholder
  }

  private calculateProgress(entry: any, goal: GoalFocus): number {
    // Implement logic to calculate goal progress
    return 0.3; // Placeholder
  }
} 