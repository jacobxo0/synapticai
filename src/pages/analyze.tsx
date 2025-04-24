import React, { useState } from 'react'
import { CodeAnalysisDisplay } from '../components/CodeAnalysisDisplay'

export default function AnalyzePage() {
  const [fileName, setFileName] = useState('')
  const [startLine, setStartLine] = useState('')
  const [endLine, setEndLine] = useState('')
  const [content, setContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Code Analysis</h1>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="fileName" className="block text-sm font-medium mb-1">
                File Name
              </label>
              <input
                type="text"
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., src/components/App.tsx"
              />
            </div>
            <div>
              <label htmlFor="startLine" className="block text-sm font-medium mb-1">
                Start Line
              </label>
              <input
                type="number"
                id="startLine"
                value={startLine}
                onChange={(e) => setStartLine(e.target.value)}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div>
              <label htmlFor="endLine" className="block text-sm font-medium mb-1">
                End Line
              </label>
              <input
                type="number"
                id="endLine"
                value={endLine}
                onChange={(e) => setEndLine(e.target.value)}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Code Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded min-h-[200px] font-mono"
              placeholder="Paste your code here..."
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!content || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </form>

        {isAnalyzing && content && (
          <CodeAnalysisDisplay
            content={content}
            fileName={fileName || 'Untitled'}
            startLine={parseInt(startLine) || 1}
            endLine={parseInt(endLine) || content.split('\n').length}
          />
        )}
      </div>
    </main>
  )
} 