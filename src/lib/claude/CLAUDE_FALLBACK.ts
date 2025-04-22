import { ClaudeResponse, ClaudeRequest } from './types';

// Mock responses for different scenarios
const MOCK_RESPONSES = {
  greeting: {
    text: "Hello! I'm here to support you. I notice you're in offline mode right now, but I can still help you reflect and explore your thoughts.",
    tone: "supportive",
    context: "initial_greeting"
  },
  reflection: {
    text: "That's an interesting perspective. Would you like to explore that thought further? I'm here to listen and help you reflect.",
    tone: "curious",
    context: "general_reflection"
  },
  support: {
    text: "I hear you. It sounds like you're going through something challenging. Remember, I'm here to support you, and it's okay to take things at your own pace.",
    tone: "supportive",
    context: "emotional_support"
  },
  exploration: {
    text: "Let's explore that idea together. What aspects of this feel most important to you right now?",
    tone: "curious",
    context: "idea_exploration"
  },
  guidance: {
    text: "Based on what you've shared, here are some gentle suggestions to consider. Remember, these are just ideas - you know what's best for you.",
    tone: "direct",
    context: "gentle_guidance"
  }
};

// Error responses for different scenarios
const ERROR_RESPONSES = {
  rate_limit: {
    text: "I'm currently handling a lot of conversations. Let's take a moment to pause and reflect on what we've discussed so far.",
    tone: "supportive",
    context: "rate_limit"
  },
  timeout: {
    text: "I'm having trouble connecting right now. Let's focus on what we've been discussing, and we can explore more when the connection improves.",
    tone: "supportive",
    context: "timeout"
  },
  general: {
    text: "I'm experiencing some technical difficulties. Let's take a moment to reflect on what we've discussed so far.",
    tone: "supportive",
    context: "general_error"
  }
};

export class ClaudeFallback {
  private static instance: ClaudeFallback;
  private lastResponseType: string = 'greeting';
  private responseHistory: string[] = [];

  private constructor() {}

  public static getInstance(): ClaudeFallback {
    if (!ClaudeFallback.instance) {
      ClaudeFallback.instance = new ClaudeFallback();
    }
    return ClaudeFallback.instance;
  }

  private getMockResponse(context: string): ClaudeResponse {
    // If we have a specific mock for this context, use it
    if (MOCK_RESPONSES[context as keyof typeof MOCK_RESPONSES]) {
      return MOCK_RESPONSES[context as keyof typeof MOCK_RESPONSES];
    }

    // Otherwise, rotate through general responses
    const contexts = Object.keys(MOCK_RESPONSES);
    const nextContext = contexts[(contexts.indexOf(this.lastResponseType) + 1) % contexts.length];
    this.lastResponseType = nextContext;
    return MOCK_RESPONSES[nextContext as keyof typeof MOCK_RESPONSES];
  }

  private getErrorResponse(errorType: string): ClaudeResponse {
    return ERROR_RESPONSES[errorType as keyof typeof ERROR_RESPONSES] || ERROR_RESPONSES.general;
  }

  public async getResponse(request: ClaudeRequest): Promise<ClaudeResponse> {
    // Log the request for debugging
    console.log('[ClaudeFallback] Processing request:', {
      context: request.context,
      userInput: request.userInput?.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });

    // Store the context for response history
    this.responseHistory.push(request.context);
    if (this.responseHistory.length > 10) {
      this.responseHistory.shift();
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return appropriate response based on context
    return this.getMockResponse(request.context);
  }

  public async handleError(errorType: string): Promise<ClaudeResponse> {
    console.log('[ClaudeFallback] Handling error:', errorType);
    return this.getErrorResponse(errorType);
  }

  public getResponseHistory(): string[] {
    return [...this.responseHistory];
  }

  public clearHistory(): void {
    this.responseHistory = [];
    this.lastResponseType = 'greeting';
  }
}

// Export singleton instance
export const claudeFallback = ClaudeFallback.getInstance(); 