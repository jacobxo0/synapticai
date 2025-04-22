import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { GET, POST, PUT, DELETE } from '../messages/route'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

describe('Messages API', () => {
  let userId: string
  let conversationId: string
  let messageId: string

  beforeEach(async () => {
    // Create a test user
    const user = await db.createUser({
      email: 'test@example.com',
      name: 'Test User',
    })
    userId = user.id

    // Create a test conversation
    const conversation = await db.createConversation({
      userId,
      title: 'Test Conversation',
    })
    conversationId = conversation.id

    // Create a test message
    const message = await db.createMessage({
      conversationId,
      role: 'user',
      content: 'Test message',
    })
    messageId = message.id
  })

  afterEach(async () => {
    // Clean up
    await db.deleteMessage(messageId)
    await db.deleteConversation(conversationId)
    await db.deleteUser(userId)
  })

  describe('GET /api/messages', () => {
    it('returns all messages for a conversation', async () => {
      const request = new Request(`http://localhost/api/messages?conversationId=${conversationId}`)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].content).toBe('Test message')
      expect(data[0].conversationId).toBe(conversationId)
    })

    it('returns 400 if conversationId is missing', async () => {
      const request = new Request('http://localhost/api/messages')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('ConversationId is required')
    })
  })

  describe('GET /api/messages/:id', () => {
    it('returns a specific message', async () => {
      const request = new Request(`http://localhost/api/messages/${messageId}`)
      const response = await GET(request, { params: { id: messageId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.content).toBe('Test message')
      expect(data.conversationId).toBe(conversationId)
    })

    it('returns 404 for non-existent message', async () => {
      const request = new Request('http://localhost/api/messages/non-existent-id')
      const response = await GET(request, { params: { id: 'non-existent-id' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Message not found')
    })
  })

  describe('POST /api/messages', () => {
    it('creates a new message', async () => {
      const request = new Request('http://localhost/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          role: 'assistant',
          content: 'New message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.content).toBe('New message')
      expect(data.conversationId).toBe(conversationId)
      expect(data.role).toBe('assistant')

      // Clean up the new message
      await db.deleteMessage(data.id)
    })

    it('returns 400 for invalid data', async () => {
      const request = new Request('http://localhost/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: 'invalid-id',
          role: 'invalid-role',
          content: '',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })
  })

  describe('PUT /api/messages/:id', () => {
    it('updates a message', async () => {
      const request = new Request(`http://localhost/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Updated message',
        }),
      })

      const response = await PUT(request, { params: { id: messageId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.content).toBe('Updated message')
    })

    it('returns 400 for invalid data', async () => {
      const request = new Request(`http://localhost/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '',
        }),
      })

      const response = await PUT(request, { params: { id: messageId } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })
  })

  describe('DELETE /api/messages/:id', () => {
    it('deletes a message', async () => {
      const request = new Request(`http://localhost/api/messages/${messageId}`, {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: messageId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('returns 404 for non-existent message', async () => {
      const request = new Request('http://localhost/api/messages/non-existent-id', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: 'non-existent-id' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Message not found')
    })
  })
}) 