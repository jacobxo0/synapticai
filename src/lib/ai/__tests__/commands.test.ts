import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createSwitchAgentCommand,
  createUpdateContextCommand,
  createRequestHelpCommand,
  createShareInsightsCommand,
  createCoordinateTaskCommand,
  validateCommand
} from '../commands'
import { commandHandler } from '../commandHandler'
import { contextEngine } from '../context'
import { cache } from '../../cache'

// Mock dependencies
vi.mock('../context', () => ({
  contextEngine: {
    setContext: vi.fn()
  }
}))

vi.mock('../../cache', () => ({
  cache: {
    set: vi.fn()
  }
}))

describe('Command System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Command Creation', () => {
    it('should create valid switch agent command', () => {
      const command = createSwitchAgentCommand(
        'frontend',
        'backend',
        'Need API implementation',
        'Current context'
      )

      expect(command.type).toBe('switch_agent')
      expect(command.payload.targetAgent).toBe('backend')
      expect(command.payload.reason).toBe('Need API implementation')
      expect(command.payload.context).toBe('Current context')
    })

    it('should create valid update context command', () => {
      const command = createUpdateContextCommand(
        'frontend',
        'backend',
        'user:123',
        'User preferences',
        3600
      )

      expect(command.type).toBe('update_context')
      expect(command.payload.key).toBe('user:123')
      expect(command.payload.value).toBe('User preferences')
      expect(command.payload.ttl).toBe(3600)
    })

    it('should create valid request help command', () => {
      const command = createRequestHelpCommand(
        'frontend',
        'backend',
        'API integration issue',
        'high',
        'Error details'
      )

      expect(command.type).toBe('request_help')
      expect(command.payload.issue).toBe('API integration issue')
      expect(command.payload.priority).toBe('high')
      expect(command.payload.context).toBe('Error details')
    })

    it('should create valid share insights command', () => {
      const command = createShareInsightsCommand(
        'frontend',
        'backend',
        'User behavior',
        'Insight details',
        'high'
      )

      expect(command.type).toBe('share_insights')
      expect(command.payload.topic).toBe('User behavior')
      expect(command.payload.insights).toBe('Insight details')
      expect(command.payload.relevance).toBe('high')
    })

    it('should create valid coordinate task command', () => {
      const command = createCoordinateTaskCommand(
        'frontend',
        'backend',
        'Implement API endpoint',
        ['Database schema', 'Authentication'],
        '2024-04-01'
      )

      expect(command.type).toBe('coordinate_task')
      expect(command.payload.task).toBe('Implement API endpoint')
      expect(command.payload.dependencies).toEqual(['Database schema', 'Authentication'])
      expect(command.payload.deadline).toBe('2024-04-01')
    })
  })

  describe('Command Validation', () => {
    it('should validate correct commands', () => {
      const command = createSwitchAgentCommand(
        'frontend',
        'backend',
        'Need API implementation'
      )

      expect(validateCommand(command)).toBe(true)
    })

    it('should reject invalid commands', () => {
      const invalidCommand = {
        type: 'invalid_type',
        payload: {},
        timestamp: Date.now(),
        sourceAgent: 'frontend',
        targetAgent: 'backend'
      }

      expect(validateCommand(invalidCommand)).toBe(false)
    })
  })

  describe('Command Processing', () => {
    it('should process switch agent command', async () => {
      const command = createSwitchAgentCommand(
        'frontend',
        'backend',
        'Need API implementation',
        'Current context'
      )

      await commandHandler.processCommand(command)

      expect(contextEngine.setContext).toHaveBeenCalledWith({
        key: 'agent:backend:context',
        value: 'Current context',
        ttl: 3600
      })
    })

    it('should process update context command', async () => {
      const command = createUpdateContextCommand(
        'frontend',
        'backend',
        'user:123',
        'User preferences',
        3600
      )

      await commandHandler.processCommand(command)

      expect(contextEngine.setContext).toHaveBeenCalledWith({
        key: 'user:123',
        value: 'User preferences',
        ttl: 3600
      })
    })

    it('should process request help command', async () => {
      const command = createRequestHelpCommand(
        'frontend',
        'backend',
        'API integration issue',
        'high',
        'Error details'
      )

      await commandHandler.processCommand(command)

      expect(cache.set).toHaveBeenCalled()
    })

    it('should process share insights command', async () => {
      const command = createShareInsightsCommand(
        'frontend',
        'backend',
        'User behavior',
        'Insight details',
        'high'
      )

      await commandHandler.processCommand(command)

      expect(cache.set).toHaveBeenCalled()
    })

    it('should process coordinate task command', async () => {
      const command = createCoordinateTaskCommand(
        'frontend',
        'backend',
        'Implement API endpoint',
        ['Database schema', 'Authentication'],
        '2024-04-01'
      )

      await commandHandler.processCommand(command)

      expect(cache.set).toHaveBeenCalled()
    })
  })
}) 