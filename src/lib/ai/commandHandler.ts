import { Command, validateCommand } from './commands'
import { contextEngine } from './context'
import { cache } from '../cache'

export class CommandHandler {
  private static instance: CommandHandler
  private commandQueue: Command[] = []
  private processing = false

  private constructor() {}

  static getInstance(): CommandHandler {
    if (!CommandHandler.instance) {
      CommandHandler.instance = new CommandHandler()
    }
    return CommandHandler.instance
  }

  async processCommand(command: Command): Promise<boolean> {
    if (!validateCommand(command)) {
      console.error('Invalid command received:', command)
      return false
    }

    try {
      switch (command.type) {
        case 'switch_agent':
          await this.handleSwitchAgent(command)
          break
        case 'update_context':
          await this.handleUpdateContext(command)
          break
        case 'request_help':
          await this.handleRequestHelp(command)
          break
        case 'share_insights':
          await this.handleShareInsights(command)
          break
        case 'coordinate_task':
          await this.handleCoordinateTask(command)
          break
        case 'coordinate_prompts':
          await this.handleCoordinatePrompts(command)
          break
        default:
          console.error('Unknown command type:', command.type)
          return false
      }

      return true
    } catch (error) {
      console.error('Error processing command:', error)
      return false
    }
  }

  private async handleSwitchAgent(command: Command) {
    const { targetAgent, reason, context } = command.payload
    console.log(`Switching to agent: ${targetAgent}, Reason: ${reason}`)
    
    if (context) {
      await contextEngine.setContext({
        key: `agent:${targetAgent}:context`,
        value: context,
        ttl: 3600
      })
    }
  }

  private async handleUpdateContext(command: Command) {
    const { key, value, ttl } = command.payload
    await contextEngine.setContext({
      key,
      value,
      ttl
    })
  }

  private async handleRequestHelp(command: Command) {
    const { issue, priority, context } = command.payload
    const helpKey = `help:${command.sourceAgent}:${Date.now()}`
    
    await cache.set(helpKey, {
      issue,
      priority,
      context,
      status: 'pending',
      timestamp: Date.now()
    }, 3600)
  }

  private async handleShareInsights(command: Command) {
    const { topic, insights, relevance } = command.payload
    const insightsKey = `insights:${topic}:${Date.now()}`
    
    await cache.set(insightsKey, {
      topic,
      insights,
      relevance,
      sourceAgent: command.sourceAgent,
      timestamp: Date.now()
    }, 3600)
  }

  private async handleCoordinateTask(command: Command) {
    const { task, dependencies, deadline } = command.payload
    const taskKey = `task:${command.sourceAgent}:${Date.now()}`
    
    await cache.set(taskKey, {
      task,
      dependencies,
      deadline,
      status: 'pending',
      assignedTo: command.targetAgent,
      timestamp: Date.now()
    }, 3600)
  }

  private async handleCoordinatePrompts(command: Command<CoordinatePromptsPayload>): Promise<void> {
    const { prompt, targetAgents, priority, context, deadline } = command.payload
    
    // Broadcast the prompt to all target agents
    for (const agent of targetAgents) {
      await this.broadcastPrompt(agent, {
        prompt,
        priority,
        context,
        deadline,
        sourceAgent: command.sourceAgent
      })
    }
  }

  private async broadcastPrompt(
    targetAgent: string,
    promptData: {
      prompt: string
      priority: 'low' | 'medium' | 'high'
      context?: string
      deadline?: string
      sourceAgent: string
    }
  ): Promise<void> {
    // Implement the actual prompt broadcasting logic here
    // This could involve:
    // 1. Sending the prompt to the target agent's chat
    // 2. Updating the agent's context with the new prompt
    // 3. Logging the broadcast for tracking
    console.log(`Broadcasting prompt to ${targetAgent}:`, promptData)
  }

  async queueCommand(command: Command) {
    this.commandQueue.push(command)
    if (!this.processing) {
      await this.processQueue()
    }
  }

  private async processQueue() {
    this.processing = true
    while (this.commandQueue.length > 0) {
      const command = this.commandQueue.shift()
      if (command) {
        await this.processCommand(command)
      }
    }
    this.processing = false
  }
}

export const commandHandler = CommandHandler.getInstance() 