import { delay } from '@/lib/utils'

export interface ClaudeResponse {
  content: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

const MOCK_RESPONSES = {
  suggestGoals: [
    {
      title: "Practice Mindfulness",
      description: "Set aside 10 minutes each morning for meditation and deep breathing exercises.",
      tone: "encouraging"
    },
    {
      title: "Journal Daily",
      description: "Write down three things you're grateful for each day before bed.",
      tone: "reflective"
    },
    {
      title: "Exercise Regularly",
      description: "Aim for 30 minutes of physical activity at least 3 times per week.",
      tone: "motivational"
    }
  ],
  analyzeMood: {
    content: "Based on your journal entry, I notice a mix of emotions. There seems to be some stress about work deadlines, but also excitement about upcoming plans. The overall tone suggests you're feeling hopeful about the future while managing current challenges.",
    usage: {
      input_tokens: 150,
      output_tokens: 75
    }
  },
  generateInsights: {
    content: "Your mood patterns show that you tend to feel more positive in the mornings, especially after exercise. There's a noticeable correlation between social interactions and improved mood. Consider scheduling more morning activities and social engagements.",
    usage: {
      input_tokens: 200,
      output_tokens: 100
    }
  }
}

export async function mockClaudeRequest(
  endpoint: string,
  data: any
): Promise<ClaudeResponse> {
  // Simulate network delay
  await delay(Number(process.env.NEXT_PUBLIC_MOCK_RESPONSE_DELAY) || 1000)

  switch (endpoint) {
    case '/suggest-goals':
      return {
        content: JSON.stringify(MOCK_RESPONSES.suggestGoals),
        usage: {
          input_tokens: 100,
          output_tokens: 200
        }
      }
    case '/analyze-mood':
      return MOCK_RESPONSES.analyzeMood
    case '/generate-insights':
      return MOCK_RESPONSES.generateInsights
    default:
      throw new Error(`Mock endpoint not found: ${endpoint}`)
  }
} 