describe('CommandHandler', () => {
  describe('coordinate_prompts command', () => {
    it('should broadcast prompts to all target agents', async () => {
      const handler = new CommandHandler()
      const command = createCoordinatePromptsCommand({
        prompt: 'Test prompt',
        targetAgents: ['agent1', 'agent2', 'agent3'],
        priority: 'high',
        context: 'Test context',
        deadline: '2024-03-25T12:00:00Z'
      })

      await handler.queueCommand(command)

      // Verify that the prompt was broadcast to all target agents
      expect(console.log).toHaveBeenCalledTimes(3)
      expect(console.log).toHaveBeenCalledWith(
        'Broadcasting prompt to agent1:',
        expect.objectContaining({
          prompt: 'Test prompt',
          priority: 'high',
          context: 'Test context',
          deadline: '2024-03-25T12:00:00Z',
          sourceAgent: 'project_manager'
        })
      )
    })

    it('should handle empty target agents list', async () => {
      const handler = new CommandHandler()
      const command = createCoordinatePromptsCommand({
        prompt: 'Test prompt',
        targetAgents: [],
        priority: 'medium'
      })

      await handler.queueCommand(command)

      // Verify that no broadcasts were made
      expect(console.log).not.toHaveBeenCalled()
    })

    it('should handle missing optional fields', async () => {
      const handler = new CommandHandler()
      const command = createCoordinatePromptsCommand({
        prompt: 'Test prompt',
        targetAgents: ['agent1'],
        priority: 'low'
      })

      await handler.queueCommand(command)

      // Verify that the broadcast was made with default values
      expect(console.log).toHaveBeenCalledWith(
        'Broadcasting prompt to agent1:',
        expect.objectContaining({
          prompt: 'Test prompt',
          priority: 'low',
          sourceAgent: 'project_manager'
        })
      )
    })
  })
}) 