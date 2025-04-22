import { useState, useCallback } from 'react'
import { Mood } from '@/stores/useMoodStore'
import { Tone } from '@/stores/useToneStore'

interface AnalysisResult {
  suggestedMood: Mood
  suggestedTone: Tone
  confidence: number
  analysis: string
}

export function useTextAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyzeText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setResult(null)
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setResult(null)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return {
    analyzeText,
    isAnalyzing,
    error,
    result,
  }
} 