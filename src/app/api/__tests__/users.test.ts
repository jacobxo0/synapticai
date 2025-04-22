import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { GET, POST, PUT, DELETE } from '../users/route'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

describe('Users API', () => {
  let userId: string

  beforeEach(async () => {
    // Create a test user
    const user = await db.createUser({
      email: 'test@example.com',
      name: 'Test User',
    })
    userId = user.id
  })

  afterEach(async () => {
    // Clean up
    await db.deleteUser(userId)
  })

  describe('GET /api/users', () => {
    it('returns all users', async () => {
      const request = new Request('http://localhost/api/users')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].email).toBe('test@example.com')
      expect(data[0].name).toBe('Test User')
    })
  })

  describe('GET /api/users/:id', () => {
    it('returns a specific user', async () => {
      const request = new Request(`http://localhost/api/users/${userId}`)
      const response = await GET(request, { params: { id: userId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.email).toBe('test@example.com')
      expect(data.name).toBe('Test User')
    })

    it('returns 404 for non-existent user', async () => {
      const request = new Request('http://localhost/api/users/non-existent-id')
      const response = await GET(request, { params: { id: 'non-existent-id' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('User not found')
    })
  })

  describe('POST /api/users', () => {
    it('creates a new user', async () => {
      const request = new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'new@example.com',
          name: 'New User',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.email).toBe('new@example.com')
      expect(data.name).toBe('New User')

      // Clean up the new user
      await db.deleteUser(data.id)
    })

    it('returns 400 for invalid data', async () => {
      const request = new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          name: '',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })
  })

  describe('PUT /api/users/:id', () => {
    it('updates a user', async () => {
      const request = new Request(`http://localhost/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Updated User',
        }),
      })

      const response = await PUT(request, { params: { id: userId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Updated User')
    })

    it('returns 400 for invalid data', async () => {
      const request = new Request(`http://localhost/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
        }),
      })

      const response = await PUT(request, { params: { id: userId } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('deletes a user', async () => {
      const request = new Request(`http://localhost/api/users/${userId}`, {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: userId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('returns 404 for non-existent user', async () => {
      const request = new Request('http://localhost/api/users/non-existent-id', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: { id: 'non-existent-id' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('User not found')
    })
  })
}) 