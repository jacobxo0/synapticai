import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schemas
const createMessageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  conversationId: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
})

const updateMessageSchema = z.object({
  content: z.string().min(1).optional(),
  metadata: z.record(z.unknown()).optional(),
})

// GET /api/messages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'ConversationId is required' },
        { status: 400 }
      )
    }

    const messages = await db.getMessages(conversationId)
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/messages
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createMessageSchema.parse(body)

    const message = await db.createMessage(validatedData)
    return NextResponse.json(message)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/messages/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateMessageSchema.parse(body)

    const message = await db.updateMessage(params.id, validatedData)
    return NextResponse.json(message)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/messages/:id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.deleteMessage(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 