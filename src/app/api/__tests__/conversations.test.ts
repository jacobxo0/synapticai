import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { GET, POST, PUT, DELETE } from '../conversations/route'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

describe('Conversations API', () => {
  let userId: string
  let conversationId: string

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
  })

  afterEach(async () => {
    // Clean up
    await db.deleteConversation(conversationId)
    await db.deleteUser(userId)
  })

  describe('GET /api/conversations', () => {
    it('returns all conversations for a user', async () => {
      const request = new Request('http://localhost/api/conversations')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].title).toBe('Test Conversation')
      expect(data[0].userId).toBe(userId)
    })
  })

  describe('GET /api/conversations/:id', () => {
    it('returns a specific conversation', async () => {
      const request = new Request(`http://localhost/api/conversations/${conversationId}`)
      const response = await GET(request, { params: { id: conversationId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.title).toBe('Test Conversation')
      expect(data.userId).toBe(userId)
    })

    it('returns 404 for non-existent conversation', async () => {
      const request = new Request('http://localhost/api/conversations/non-existent-id')
      const response = await GET(request, { params: { id: 'non-existent-id' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Conversation not found')
    })
  })

  describe('POST /api/conversations', () => {
    it('creates a new conversation', async () => {
      const request = new Request('http://localhost/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: 'New Conversation',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.title).toBe('New Conversation')
      expect(data.userId).toBe(userId)

      // Clean up the new conversation
      await db.deleteConversation(data.id)
    })

    it('returns 400 for invalid data', async () => {
      const request = new Request('http://localhost/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'invalid-id',
          title: '',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })
  })

  describe('PUT /api/conversations/:id', () => {
    it('updates a conversation', async () => {
      const request = new Request(`http://localhost/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Updated Conversation',
        }),
      })

      const response = await PUT(request, { params: { id: conversationId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.title).toBe('Updated Conversation')
    })

    it('returns 400 for invalid data', async () => {
      const request = new Request(`http://localhost/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '',
        }),
      })

      const response = await PUT(request, { params: { id: conversationId } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })
  })

  describe('DELETE /api/conversations/:id', () => {
    it('deletes a conversation', async () => {
      const request = new Request(`http://localhost/api/conversations/${conversationId}`, {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: conversationId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('returns 404 for non-existent conversation', async () => {
      const request = new Request('http://localhost/api/conversations/non-existent-id', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: 'non-existent-id' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Conversation not found')
    })
  })
}) 