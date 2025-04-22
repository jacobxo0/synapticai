import { NextApiRequest, NextApiResponse } from 'next'
import { Mood, MOOD_CONFIG } from '@/stores/useMoodStore'
import { Tone, TONE_CONFIG } from '@/stores/useToneStore'

interface AnalysisResult {
  suggestedMood: Mood
  suggestedTone: Tone
  confidence: number
  analysis: string
}

// Simple sentiment analysis function
function analyzeSentiment(text: string): number {
  const positiveWords = ['happy', 'great', 'excellent', 'good', 'love', 'wonderful', 'fantastic']
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'horrible', 'poor']
  
  const words = text.toLowerCase().split(/\s+/)
  let score = 0
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1
    if (negativeWords.includes(word)) score -= 1
  })
  
  return score / words.length // Normalize by text length
}

// Determine mood based on sentiment
function determineMood(sentiment: number): Mood {
  if (sentiment > 0.3) return 'happy'
  if (sentiment < -0.3) return 'thoughtful'
  if (Math.abs(sentiment) <= 0.1) return 'neutral'
  return 'focused'
}

// Determine tone based on text characteristics
function determineTone(text: string): Tone {
  const words = text.toLowerCase().split(/\s+/)
  const questionCount = (text.match(/\?/g) || []).length
  const exclamationCount = (text.match(/!/g) || []).length
  
  if (questionCount > 0) return 'inquisitive'
  if (exclamationCount > 0) return 'enthusiastic'
  if (words.length > 20) return 'analytical'
  return 'casual'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResult>
) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  try {
    const { text } = req.body

    if (!text || typeof text !== 'string') {
      res.status(400).json({
        suggestedMood: 'neutral',
        suggestedTone: 'casual',
        confidence: 0,
        analysis: 'Invalid input'
      })
      return
    }

    const sentiment = analyzeSentiment(text)
    const suggestedMood = determineMood(sentiment)
    const suggestedTone = determineTone(text)
    const confidence = Math.abs(sentiment)

    const analysis = `Based on the text analysis:
    - Sentiment Score: ${sentiment.toFixed(2)}
    - Suggested Mood: ${MOOD_CONFIG[suggestedMood].label}
    - Suggested Tone: ${TONE_CONFIG[suggestedTone].label}`

    res.status(200).json({
      suggestedMood,
      suggestedTone,
      confidence,
      analysis
    })
  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({
      suggestedMood: 'neutral',
      suggestedTone: 'casual',
      confidence: 0,
      analysis: 'Analysis failed'
    })
  }
} 