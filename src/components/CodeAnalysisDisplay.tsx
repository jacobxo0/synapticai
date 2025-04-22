import React, { useEffect, useState } from 'react'
import { Mood, MOOD_CONFIG } from '@/stores/useMoodStore'
import { Tone, TONE_CONFIG } from '@/stores/useToneStore'

interface AnalysisResult {
  suggestedMood: Mood
  suggestedTone: Tone
  confidence: number
  analysis: string
}

interface Props {
  content: string
  fileName: string
  startLine: number
  endLine: number
}

export function CodeAnalysisDisplay({ content, fileName, startLine, endLine }: Props) {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const analyzeCode = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: content }),
        })

        if (!response.ok) {
          throw new Error('Analysis failed')
        }

        const data = await response.json()
        setResult(data)
        setError(null)
      } catch (err) {
        setError('Failed to analyze code. Please try again.')
        setResult(null)
      }
    }

    analyzeCode()
  }, [content])

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    )
  }

  if (!result) {
    return (
      <div className="p-4 bg-gray-100 rounded animate-pulse">
        Analyzing code...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">File Details</h3>
            <p className="text-sm text-gray-600">
              {fileName} (lines {startLine}-{endLine})
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">Confidence Score</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">Suggested Mood</h3>
            <div className="flex items-center">
              <span className="text-2xl mr-2">
                {MOOD_CONFIG[result.suggestedMood].icon}
              </span>
              <span className={MOOD_CONFIG[result.suggestedMood].color}>
                {MOOD_CONFIG[result.suggestedMood].label}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">Suggested Tone</h3>
            <div className="flex items-center">
              <span className="text-2xl mr-2">
                {TONE_CONFIG[result.suggestedTone].icon}
              </span>
              <span className={TONE_CONFIG[result.suggestedTone].color}>
                {TONE_CONFIG[result.suggestedTone].label}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Detailed Analysis</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {result.analysis}
          </p>
        </div>
      </div>
    </div>
  )
} 