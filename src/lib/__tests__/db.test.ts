import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from '../db'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Database Service', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await prisma.message.deleteMany()
    await prisma.conversation.deleteMany()
    await prisma.user.deleteMany()
    await prisma.promptTemplate.deleteMany()
  })

  afterEach(async () => {
    // Clear the database after each test
    await prisma.message.deleteMany()
    await prisma.conversation.deleteMany()
    await prisma.user.deleteMany()
    await prisma.promptTemplate.deleteMany()
  })

  describe('User Operations', () => {
    it('creates a user', async () => {
      const user = await db.createUser({
        email: 'test@example.com',
        name: 'Test User',
      })

      expect(user).toBeDefined()
      expect(user.email).toBe('test@example.com')
      expect(user.name).toBe('Test User')
    })

    it('gets a user by id', async () => {
      const createdUser = await db.createUser({
        email: 'test@example.com',
        name: 'Test User',
      })

      const user = await db.getUser(createdUser.id)
      expect(user).toBeDefined()
      expect(user?.email).toBe('test@example.com')
    })
  })

  describe('Conversation Operations', () => {
    it('creates a conversation', async () => {
      const user = await db.createUser({
        email: 'test@example.com',
      })

      const conversation = await db.createConversation({
        title: 'Test Conversation',
        userId: user.id,
      })

      expect(conversation).toBeDefined()
      expect(conversation.title).toBe('Test Conversation')
    })

    it('gets a conversation by id', async () => {
      const user = await db.createUser({
        email: 'test@example.com',
      })

      const createdConversation = await db.createConversation({
        title: 'Test Conversation',
        userId: user.id,
      })

      const conversation = await db.getConversation(createdConversation.id)
      expect(conversation).toBeDefined()
      expect(conversation?.title).toBe('Test Conversation')
    })
  })

  describe('Message Operations', () => {
    it('creates a message', async () => {
      const user = await db.createUser({
        email: 'test@example.com',
      })

      const conversation = await db.createConversation({
        title: 'Test Conversation',
        userId: user.id,
      })

      const message = await db.createMessage({
        content: 'Test message',
        role: 'user',
        conversationId: conversation.id,
      })

      expect(message).toBeDefined()
      expect(message.content).toBe('Test message')
    })

    it('gets messages for a conversation', async () => {
      const user = await db.createUser({
        email: 'test@example.com',
      })

      const conversation = await db.createConversation({
        title: 'Test Conversation',
        userId: user.id,
      })

      await db.createMessage({
        content: 'Test message 1',
        role: 'user',
        conversationId: conversation.id,
      })

      await db.createMessage({
        content: 'Test message 2',
        role: 'assistant',
        conversationId: conversation.id,
      })

      const messages = await db.getMessages(conversation.id)
      expect(messages).toHaveLength(2)
      expect(messages[0].content).toBe('Test message 1')
      expect(messages[1].content).toBe('Test message 2')
    })
  })

  describe('Prompt Template Operations', () => {
    it('creates a prompt template', async () => {
      const template = await db.createPromptTemplate({
        name: 'Test Template',
        content: 'Test content',
        variables: ['var1', 'var2'],
      })

      expect(template).toBeDefined()
      expect(template.name).toBe('Test Template')
      expect(template.variables).toHaveLength(2)
    })

    it('gets a prompt template by id', async () => {
      const createdTemplate = await db.createPromptTemplate({
        name: 'Test Template',
        content: 'Test content',
        variables: ['var1'],
      })

      const template = await db.getPromptTemplate(createdTemplate.id)
      expect(template).toBeDefined()
      expect(template?.name).toBe('Test Template')
    })
  })
}) 