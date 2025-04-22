import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface ConsentSettings {
  moodTracking: {
    enabled: boolean;
    temporaryOptOut?: boolean;
    lastUpdated: Date;
  };
  toneContinuity: {
    enabled: boolean;
    temporaryOptOut?: boolean;
    lastUpdated: Date;
  };
  goalLinking: {
    enabled: boolean;
    temporaryOptOut?: boolean;
    lastUpdated: Date;
  };
  reflectionHistory: {
    enabled: boolean;
    temporaryOptOut?: boolean;
    lastUpdated: Date;
  };
}

interface SessionConsent {
  sessionId: string;
  timestamp: Date;
  overrides: Partial<ConsentSettings>;
}

interface FilteredContext {
  mood: any | null;
  tone: any | null;
  goals: any[] | null;
  reflections: any[] | null;
  metadata: {
    consentStatus: {
      [K in keyof ConsentSettings]: boolean;
    };
    fallbackUsed: boolean;
  };
}

interface MemoryContext {
  mood: any;
  tone: any;
  goals: any[];
  reflections: any[];
  sessionId: string;
}

const PROMPT_VARIATIONS = {
  fullContext: "Using your full context and history...",
  limitedContext: "With limited context available ({enabledTypes})...",
  neutralContext: "In a neutral context..."
} as const;

export class ConsentMemoryEngine {
  private prisma: PrismaClient;
  private consentManager: ConsentManager;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.consentManager = new ConsentManager();
  }

  public async initializeUserConsent(userId: string): Promise<void> {
    const defaultSettings: ConsentSettings = {
      moodTracking: {
        enabled: true,
        lastUpdated: new Date()
      },
      toneContinuity: {
        enabled: true,
        lastUpdated: new Date()
      },
      goalLinking: {
        enabled: true,
        lastUpdated: new Date()
      },
      reflectionHistory: {
        enabled: true,
        lastUpdated: new Date()
      }
    };

    await this.prisma.userConsent.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        settings: defaultSettings
      }
    });
  }

  public async updateConsent(
    userId: string,
    type: keyof ConsentSettings,
    enabled: boolean
  ): Promise<void> {
    await this.prisma.userConsent.update({
      where: { userId },
      data: {
        settings: {
          [type]: {
            enabled,
            lastUpdated: new Date()
          }
        }
      }
    });
  }

  public async setTemporaryOptOut(
    userId: string,
    sessionId: string,
    type: keyof ConsentSettings
  ): Promise<void> {
    const sessionConsent: SessionConsent = {
      sessionId,
      timestamp: new Date(),
      overrides: {
        [type]: {
          enabled: false,
          temporaryOptOut: true
        }
      }
    };

    await this.prisma.sessionConsent.upsert({
      where: { sessionId },
      update: sessionConsent,
      create: {
        ...sessionConsent,
        userId
      }
    });
  }

  public async filterContextByConsent(
    userId: string,
    sessionId: string,
    rawContext: MemoryContext
  ): Promise<FilteredContext> {
    const [userConsent, sessionConsent] = await Promise.all([
      this.prisma.userConsent.findUnique({
        where: { userId }
      }),
      this.prisma.sessionConsent.findUnique({
        where: { sessionId }
      })
    ]);

    if (!userConsent) {
      throw new Error('User consent settings not found');
    }

    const filtered: FilteredContext = {
      mood: null,
      tone: null,
      goals: null,
      reflections: null,
      metadata: {
        consentStatus: {},
        fallbackUsed: false
      }
    };

    // Apply consent rules
    Object.entries(userConsent.settings).forEach(([type, settings]) => {
      const isEnabled = settings.enabled && 
        !sessionConsent?.overrides[type]?.temporaryOptOut;
      
      filtered.metadata.consentStatus[type] = isEnabled;
      
      if (isEnabled) {
        filtered[type] = rawContext[type];
      }
    });

    // Use fallback if no context available
    if (Object.values(filtered.metadata.consentStatus).every(v => !v)) {
      filtered.metadata.fallbackUsed = true;
    }

    return filtered;
  }

  public buildClaudePrompt(filteredContext: FilteredContext): string {
    if (filteredContext.metadata.fallbackUsed) {
      return PROMPT_VARIATIONS.neutralContext;
    }

    const enabledTypes = Object.entries(filteredContext.metadata.consentStatus)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type);

    if (enabledTypes.length === Object.keys(filteredContext.metadata.consentStatus).length) {
      return PROMPT_VARIATIONS.fullContext;
    }

    return PROMPT_VARIATIONS.limitedContext.replace(
      '{enabledTypes}',
      enabledTypes.join(', ')
    );
  }

  public async getMemoryContext(
    userId: string,
    sessionId: string
  ): Promise<MemoryContext> {
    const [mood, tone, goals, reflections] = await Promise.all([
      this.prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      this.prisma.tonePreference.findUnique({
        where: { userId }
      }),
      this.prisma.goal.findMany({
        where: { userId },
        include: { progress: true }
      }),
      this.prisma.reflection.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    return {
      mood,
      tone,
      goals,
      reflections,
      sessionId
    };
  }

  public async acknowledgeMemoryLimits(
    filteredContext: FilteredContext
  ): Promise<string> {
    const disabledTypes = Object.entries(filteredContext.metadata.consentStatus)
      .filter(([_, enabled]) => !enabled)
      .map(([type]) => type);

    if (disabledTypes.length === 0) {
      return '';
    }

    return `Note: Some context is unavailable due to privacy settings (${disabledTypes.join(', ')}).`;
  }
}

class ConsentManager {
  private userSettings: ConsentSettings;
  private sessionOverrides: Map<string, SessionConsent>;

  constructor() {
    this.userSettings = {
      moodTracking: { enabled: true, lastUpdated: new Date() },
      toneContinuity: { enabled: true, lastUpdated: new Date() },
      goalLinking: { enabled: true, lastUpdated: new Date() },
      reflectionHistory: { enabled: true, lastUpdated: new Date() }
    };
    this.sessionOverrides = new Map();
  }

  public updateConsent(type: keyof ConsentSettings, enabled: boolean): void {
    this.userSettings[type].enabled = enabled;
    this.userSettings[type].lastUpdated = new Date();
  }

  public setTemporaryOptOut(sessionId: string, type: keyof ConsentSettings): void {
    const session = this.sessionOverrides.get(sessionId) || {
      sessionId,
      timestamp: new Date(),
      overrides: {}
    };
    session.overrides[type] = { enabled: false, temporaryOptOut: true };
    this.sessionOverrides.set(sessionId, session);
  }

  public getSettings(): ConsentSettings {
    return this.userSettings;
  }

  public getSessionOverride(sessionId: string): SessionConsent | undefined {
    return this.sessionOverrides.get(sessionId);
  }
} 