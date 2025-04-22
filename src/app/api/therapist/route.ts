import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'
import { Resource, Action } from '@/lib/auth/permissions'
import { handleError } from '@/lib/errors'

// GET /api/therapist/me
export async function GET(req: NextRequest) {
  return withAuth(
    async (req) => {
      try {
        const token = await getToken({ req })
        if (!token?.sub) {
          throw new Error('User not found')
        }

        const therapist = await prisma.therapist.findUnique({
          where: { userId: token.sub },
          include: {
            user: true,
            organization: true,
            clients: {
              include: {
                user: true
              }
            }
          }
        })

        if (!therapist) {
          throw new Error('Therapist profile not found')
        }

        return NextResponse.json(therapist)
      } catch (error) {
        return handleError(error)
      }
    },
    {
      resource: Resource.USER,
      action: Action.READ
    }
  )(req)
}

// GET /api/therapist/clients
export async function GET(req: NextRequest) {
  return withAuth(
    async (req) => {
      try {
        const token = await getToken({ req })
        if (!token?.sub) {
          throw new Error('User not found')
        }

        const therapist = await prisma.therapist.findUnique({
          where: { userId: token.sub },
          include: {
            clients: {
              include: {
                user: true
              }
            }
          }
        })

        if (!therapist) {
          throw new Error('Therapist profile not found')
        }

        return NextResponse.json(therapist.clients)
      } catch (error) {
        return handleError(error)
      }
    },
    {
      resource: Resource.USER,
      action: Action.READ
    }
  )(req)
}

// GET /api/therapist/client-data
export async function GET(req: NextRequest) {
  return withAuth(
    async (req) => {
      try {
        const { searchParams } = new URL(req.url)
        const clientId = searchParams.get('clientId')

        if (!clientId) {
          throw new Error('Client ID is required')
        }

        const token = await getToken({ req })
        if (!token?.sub) {
          throw new Error('User not found')
        }

        // Verify therapist has access to this client
        const therapist = await prisma.therapist.findUnique({
          where: { userId: token.sub },
          include: {
            clients: {
              where: { id: clientId }
            }
          }
        })

        if (!therapist || therapist.clients.length === 0) {
          throw new Error('Access denied')
        }

        const clientData = await prisma.client.findUnique({
          where: { id: clientId },
          include: {
            user: true,
            moodLogs: {
              orderBy: { createdAt: 'desc' },
              take: 30
            },
            goals: {
              orderBy: { createdAt: 'desc' }
            },
            conversations: {
              orderBy: { updatedAt: 'desc' },
              include: {
                messages: {
                  orderBy: { createdAt: 'desc' },
                  take: 1
                }
              }
            },
            therapistNotes: {
              orderBy: { createdAt: 'desc' }
            }
          }
        })

        if (!clientData) {
          throw new Error('Client not found')
        }

        return NextResponse.json(clientData)
      } catch (error) {
        return handleError(error)
      }
    },
    {
      resource: Resource.USER,
      action: Action.READ
    }
  )(req)
}

// POST /api/therapist/notes
export async function POST(req: NextRequest) {
  return withAuth(
    async (req) => {
      try {
        const body = await req.json()
        const { clientId, content, isPrivate } = body

        if (!clientId || !content) {
          throw new Error('Client ID and content are required')
        }

        const token = await getToken({ req })
        if (!token?.sub) {
          throw new Error('User not found')
        }

        // Verify therapist has access to this client
        const therapist = await prisma.therapist.findUnique({
          where: { userId: token.sub },
          include: {
            clients: {
              where: { id: clientId }
            }
          }
        })

        if (!therapist || therapist.clients.length === 0) {
          throw new Error('Access denied')
        }

        const note = await prisma.therapistNote.create({
          data: {
            therapistId: therapist.id,
            clientId,
            content,
            isPrivate
          }
        })

        return NextResponse.json(note)
      } catch (error) {
        return handleError(error)
      }
    },
    {
      resource: Resource.THERAPIST_NOTE,
      action: Action.CREATE
    }
  )(req)
} 