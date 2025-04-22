import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schemas
const createConversationSchema = z.object({
  title: z.string().min(1).max(100),
  userId: z.string().min(1),
})

const updateConversationSchema = z.object({
  title: z.string().min(1).max(100).optional(),
})

// GET /api/conversations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      )
    }

    const conversations = await db.getConversations(userId)
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/conversations
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createConversationSchema.parse(body)

    const conversation = await db.createConversation(validatedData)
    return NextResponse.json(conversation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/conversations/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateConversationSchema.parse(body)

    const conversation = await db.updateConversation(params.id, validatedData)
    return NextResponse.json(conversation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/conversations/:id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.deleteConversation(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 