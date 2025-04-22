import { Mood, MOOD_CONFIG } from '@/stores/useMoodStore'
import { Tone, TONE_CONFIG } from '@/stores/useToneStore'

interface CodeAnalysisResult {
  blockCount: number
  errorCount: number
  complexityScore: number
  suggestions: string[]
  mood: Mood
  tone: Tone
}

interface CodeBlock {
  content: string
  startLine: number
  endLine: number
  fileName: string
}

export class CodeAnalyzer {
  private static complexityThreshold = 300 // Configurable threshold

  static analyzeCodeBlock(block: CodeBlock): CodeAnalysisResult {
    const lines = block.content.split('\n')
    const blockCount = this.countCodeBlocks(lines)
    const errorCount = this.findErrors(block.content)
    const complexityScore = this.calculateComplexity(block.content)
    const suggestions = this.generateSuggestions(block)

    return {
      blockCount,
      errorCount,
      complexityScore,
      suggestions,
      mood: this.determineMood(complexityScore, errorCount),
      tone: this.determineTone(complexityScore)
    }
  }

  private static countCodeBlocks(lines: string[]): number {
    let blocks = 0
    let inBlock = false

    lines.forEach(line => {
      if (line.includes('{')) {
        blocks++
        inBlock = true
      }
      if (line.includes('}') && inBlock) {
        inBlock = false
      }
    })

    return blocks
  }

  private static findErrors(content: string): number {
    const errorPatterns = [
      /error/i,
      /exception/i,
      /undefined/,
      /null/,
      /NaN/,
      /invalid/i
    ]

    return errorPatterns.reduce((count, pattern) => {
      const matches = content.match(pattern) || []
      return count + matches.length
    }, 0)
  }

  private static calculateComplexity(content: string): number {
    const metrics = {
      lines: content.split('\n').length,
      conditionals: (content.match(/if|else|switch|case/g) || []).length,
      loops: (content.match(/for|while|do/g) || []).length,
      functions: (content.match(/function|=>/g) || []).length,
      nestingDepth: this.calculateNestingDepth(content)
    }

    return (
      metrics.lines +
      metrics.conditionals * 2 +
      metrics.loops * 3 +
      metrics.functions * 2 +
      metrics.nestingDepth * 4
    )
  }

  private static calculateNestingDepth(content: string): number {
    const lines = content.split('\n')
    let maxDepth = 0
    let currentDepth = 0

    lines.forEach(line => {
      const openBraces = (line.match(/{/g) || []).length
      const closeBraces = (line.match(/}/g) || []).length
      currentDepth += openBraces - closeBraces
      maxDepth = Math.max(maxDepth, currentDepth)
    })

    return maxDepth
  }

  private static generateSuggestions(block: CodeBlock): string[] {
    const suggestions: string[] = []
    const complexity = this.calculateComplexity(block.content)

    if (complexity > this.complexityThreshold) {
      suggestions.push('Consider breaking down this code block into smaller functions')
    }

    if (block.content.includes('TODO') || block.content.includes('FIXME')) {
      suggestions.push('There are TODO/FIXME comments that need attention')
    }

    if (this.findErrors(block.content) > 0) {
      suggestions.push('Review error handling patterns in this block')
    }

    return suggestions
  }

  private static determineMood(complexity: number, errors: number): Mood {
    if (complexity > this.complexityThreshold && errors > 0) {
      return 'thoughtful' // Complex with errors - needs careful consideration
    }
    if (complexity > this.complexityThreshold) {
      return 'focused' // Complex but clean - needs focus
    }
    if (errors > 0) {
      return 'neutral' // Has errors but not complex - steady approach
    }
    return 'happy' // Clean and simple code
  }

  private static determineTone(complexity: number): Tone {
    if (complexity > this.complexityThreshold * 1.5) {
      return 'analytical' // Very complex - needs detailed analysis
    }
    if (complexity > this.complexityThreshold) {
      return 'inquisitive' // Complex - needs investigation
    }
    return 'casual' // Simple enough for casual review
  }
} 