import { describe, it, expect } from 'vitest'
import { validatePromptStructure, validatePromptTemplate } from '@/lib/prompts/validation'

describe('Prompt Validation', () => {
  describe('validatePromptStructure', () => {
    it('validates correct prompt structure', () => {
      const validPrompt = {
        id: '1',
        title: 'Test Prompt',
        content: 'Test content',
        createdAt: new Date().toISOString(),
      }

      expect(validatePromptStructure(validPrompt)).toBe(true)
    })

    it('rejects prompt with missing required fields', () => {
      const invalidPrompt = {
        id: '1',
        // Missing title
        content: 'Test content',
      }

      expect(validatePromptStructure(invalidPrompt)).toBe(false)
    })

    it('rejects prompt with invalid field types', () => {
      const invalidPrompt = {
        id: 1, // Should be string
        title: 'Test Prompt',
        content: 'Test content',
        createdAt: 'invalid-date',
      }

      expect(validatePromptStructure(invalidPrompt)).toBe(false)
    })
  })

  describe('validatePromptTemplate', () => {
    it('validates correct template structure', () => {
      const validTemplate = {
        name: 'Test Template',
        description: 'Test description',
        variables: ['name', 'age'],
        template: 'Hello {name}, you are {age} years old.',
      }

      expect(validatePromptTemplate(validTemplate)).toBe(true)
    })

    it('rejects template with missing variables', () => {
      const invalidTemplate = {
        name: 'Test Template',
        description: 'Test description',
        variables: ['name'],
        template: 'Hello {name}, you are {age} years old.', // age is not in variables
      }

      expect(validatePromptTemplate(invalidTemplate)).toBe(false)
    })

    it('rejects template with unused variables', () => {
      const invalidTemplate = {
        name: 'Test Template',
        description: 'Test description',
        variables: ['name', 'age', 'unused'],
        template: 'Hello {name}, you are {age} years old.',
      }

      expect(validatePromptTemplate(invalidTemplate)).toBe(false)
    })
  })
}) 