import { z } from 'zod'

// Command types
export const CommandTypeSchema = z.enum([
  'switch_agent',
  'update_context',
  'request_help',
  'share_insights',
  'coordinate_task',
  'coordinate_prompts'
])

export type CommandType = z.infer<typeof CommandTypeSchema>

// Command payload schemas
const SwitchAgentPayloadSchema = z.object({
  targetAgent: z.string(),
  reason: z.string(),
  context: z.string().optional()
})

const UpdateContextPayloadSchema = z.object({
  key: z.string(),
  value: z.string(),
  ttl: z.number().optional()
})

const RequestHelpPayloadSchema = z.object({
  issue: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  context: z.string()
})

const ShareInsightsPayloadSchema = z.object({
  topic: z.string(),
  insights: z.string(),
  relevance: z.enum(['low', 'medium', 'high'])
})

const CoordinateTaskPayloadSchema = z.object({
  task: z.string(),
  dependencies: z.array(z.string()),
  deadline: z.string().optional()
})

const CoordinatePromptsPayloadSchema = z.object({
  prompt: z.string(),
  targetAgents: z.array(z.string()),
  priority: z.enum(['low', 'medium', 'high']),
  context: z.string().optional(),
  deadline: z.string().optional()
})

// Command interface
export interface Command<T = any> {
  type: CommandType
  payload: T
  timestamp: number
  sourceAgent: string
  targetAgent: string
}

// Command factory functions
export function createSwitchAgentCommand(
  sourceAgent: string,
  targetAgent: string,
  reason: string,
  context?: string
): Command<z.infer<typeof SwitchAgentPayloadSchema>> {
  return {
    type: 'switch_agent',
    payload: {
      targetAgent,
      reason,
      context
    },
    timestamp: Date.now(),
    sourceAgent,
    targetAgent
  }
}

export function createUpdateContextCommand(
  sourceAgent: string,
  targetAgent: string,
  key: string,
  value: string,
  ttl?: number
): Command<z.infer<typeof UpdateContextPayloadSchema>> {
  return {
    type: 'update_context',
    payload: {
      key,
      value,
      ttl
    },
    timestamp: Date.now(),
    sourceAgent,
    targetAgent
  }
}

export function createRequestHelpCommand(
  sourceAgent: string,
  targetAgent: string,
  issue: string,
  priority: 'low' | 'medium' | 'high',
  context: string
): Command<z.infer<typeof RequestHelpPayloadSchema>> {
  return {
    type: 'request_help',
    payload: {
      issue,
      priority,
      context
    },
    timestamp: Date.now(),
    sourceAgent,
    targetAgent
  }
}

export function createShareInsightsCommand(
  sourceAgent: string,
  targetAgent: string,
  topic: string,
  insights: string,
  relevance: 'low' | 'medium' | 'high'
): Command<z.infer<typeof ShareInsightsPayloadSchema>> {
  return {
    type: 'share_insights',
    payload: {
      topic,
      insights,
      relevance
    },
    timestamp: Date.now(),
    sourceAgent,
    targetAgent
  }
}

export function createCoordinateTaskCommand(
  sourceAgent: string,
  targetAgent: string,
  task: string,
  dependencies: string[],
  deadline?: string
): Command<z.infer<typeof CoordinateTaskPayloadSchema>> {
  return {
    type: 'coordinate_task',
    payload: {
      task,
      dependencies,
      deadline
    },
    timestamp: Date.now(),
    sourceAgent,
    targetAgent
  }
}

export function createCoordinatePromptsCommand(
  sourceAgent: string,
  prompt: string,
  targetAgents: string[],
  priority: 'low' | 'medium' | 'high',
  context?: string,
  deadline?: string
): Command<z.infer<typeof CoordinatePromptsPayloadSchema>> {
  return {
    type: 'coordinate_prompts',
    payload: {
      prompt,
      targetAgents,
      priority,
      context,
      deadline
    },
    timestamp: Date.now(),
    sourceAgent,
    targetAgent: 'all'
  }
}

// Command validation
export function validateCommand<T>(command: Command<T>): boolean {
  try {
    CommandTypeSchema.parse(command.type)
    
    switch (command.type) {
      case 'switch_agent':
        SwitchAgentPayloadSchema.parse(command.payload)
        break
      case 'update_context':
        UpdateContextPayloadSchema.parse(command.payload)
        break
      case 'request_help':
        RequestHelpPayloadSchema.parse(command.payload)
        break
      case 'share_insights':
        ShareInsightsPayloadSchema.parse(command.payload)
        break
      case 'coordinate_task':
        CoordinateTaskPayloadSchema.parse(command.payload)
        break
      case 'coordinate_prompts':
        CoordinatePromptsPayloadSchema.parse(command.payload)
        break
    }
    
    return true
  } catch (error) {
    console.error('Command validation failed:', error)
    return false
  }
} 