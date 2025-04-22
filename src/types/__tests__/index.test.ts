import React, { ReactNode } from 'react'
import { describe, it, expect } from 'vitest'
import {
  Theme,
  BaseProps,
  ThemeProps,
  ApiResponse,
  PaginatedResponse,
  PromptTemplate,
  AiContext,
  Conversation,
  Message,
  CacheConfig,
  CacheEntry,
  ApiError,
  Result,
  WithChildren,
} from '../index'

describe('Shared Types', () => {
  describe('Theme Types', () => {
    it('defines valid theme values', () => {
      const themes: Theme[] = ['light', 'dark', 'system']
      themes.forEach(theme => {
        expect(theme).toBeDefined()
      })
    })
  })

  describe('Component Props', () => {
    it('defines BaseProps correctly', () => {
      const props: BaseProps = {
        className: 'test',
        children: <div>Test</div>,
      }
      expect(props).toBeDefined()
    })

    it('extends BaseProps for ThemeProps', () => {
      const props: ThemeProps = {
        className: 'test',
        children: <div>Test</div>,
        theme: 'light',
      }
      expect(props).toBeDefined()
    })
  })

  describe('API Types', () => {
    it('defines ApiResponse correctly', () => {
      const response: ApiResponse<string> = {
        data: 'test',
        status: 200,
      }
      expect(response).toBeDefined()
    })

    it('extends ApiResponse for PaginatedResponse', () => {
      const response: PaginatedResponse<string> = {
        data: ['test'],
        status: 200,
        page: 1,
        total: 1,
        limit: 10,
      }
      expect(response).toBeDefined()
    })
  })

  describe('AI Types', () => {
    it('defines PromptTemplate correctly', () => {
      const template: PromptTemplate = {
        id: 'test',
        name: 'Test Template',
        content: 'Test content',
        variables: ['var1'],
      }
      expect(template).toBeDefined()
    })

    it('defines AiContext correctly', () => {
      const context: AiContext = {
        conversationId: 'test',
        userId: 'user1',
        timestamp: Date.now(),
        metadata: {},
      }
      expect(context).toBeDefined()
    })
  })

  describe('Database Types', () => {
    it('defines Conversation correctly', () => {
      const conversation: Conversation = {
        id: 'test',
        title: 'Test Conversation',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1',
      }
      expect(conversation).toBeDefined()
    })

    it('defines Message correctly', () => {
      const message: Message = {
        id: 'test',
        content: 'Test message',
        role: 'user',
        conversationId: 'conv1',
        createdAt: new Date(),
      }
      expect(message).toBeDefined()
    })
  })

  describe('Cache Types', () => {
    it('defines CacheConfig correctly', () => {
      const config: CacheConfig = {
        ttl: 3600,
        prefix: 'test',
        fallback: true,
      }
      expect(config).toBeDefined()
    })

    it('defines CacheEntry correctly', () => {
      const entry: CacheEntry<string> = {
        key: 'test',
        value: 'test value',
        expiresAt: Date.now() + 3600,
      }
      expect(entry).toBeDefined()
    })
  })

  describe('Error Types', () => {
    it('defines ApiError correctly', () => {
      const error: ApiError = {
        code: 'TEST_ERROR',
        message: 'Test error',
      }
      expect(error).toBeDefined()
    })
  })

  describe('Result Type', () => {
    it('handles success case', () => {
      const result: Result<string> = {
        success: true,
        data: 'test',
      }
      expect(result).toBeDefined()
    })

    it('handles error case', () => {
      const result: Result<string> = {
        success: false,
        error: new Error('test error'),
      }
      expect(result).toBeDefined()
    })
  })

  describe('Type Tests', () => {
    it('WithChildren type works correctly', () => {
      const component: WithChildren = {
        children: 'Test'
      };
      expect(component.children).toBeDefined();
    });

    it('Theme type has correct values', () => {
      const theme: Theme = 'light';
      expect(['light', 'dark']).toContain(theme);
    });
  })
}) 